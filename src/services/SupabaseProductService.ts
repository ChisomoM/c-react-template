import { supabase } from '@/lib/supabase/client'
import { IProductService, Product, InventoryLog } from './types'

export class SupabaseProductService implements IProductService {
  async getProducts(category?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner(slug),
        variants:product_variants(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('categories.slug', category)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  }

  async getAdminProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(slug, name),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  }

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(id, name, slug),
        variants:product_variants(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      throw new Error(error.message)
    }

    return data
  }

  async search(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*)
      `)
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  }

  // Admin methods
  async createProduct(product: Partial<Product>): Promise<Product> {
    // Separate variants from product data
    const { variants, ...productData } = product

    // Auto-calculate total stock if variants are provided
    if (variants && variants.length > 0) {
        productData.stock_quantity = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
    }

    // Sanitize data (convert empty strings to null for optional unique/uuid fields)
    if (productData.category_id === '') delete productData.category_id;
    if (productData.sku === '') delete productData.sku;

    // 1. Create Product
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error("Create Product Error:", error)
      throw new Error(error.message)
    }

    // 2. Create Variants
    if (variants && variants.length > 0) {
      const variantsToInsert = variants.map(v => ({
        product_id: newProduct.id,
        size: v.size,
        color: v.color,
        stock_quantity: v.stock_quantity || 0,
        cost_price_zmw: v.cost_price_zmw,
        sku: v.sku === '' ? null : v.sku 
        // Omit ID to let DB generate it
      }))

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantsToInsert)
      
      if (variantError) {
        console.error("Create Variants Error:", variantError)
        // Cleanup product if variant creation fails
        await this.deleteProduct(newProduct.id)
        throw new Error(variantError.message)
      }
    }

    return this.getProduct(newProduct.id) as Promise<Product>
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { variants, ...productData } = product

    // Auto-calculate total stock if variants are provided (authoritative list)
    if (variants) {
         productData.stock_quantity = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0)
    }

    // Sanitize
    if (productData.category_id === '') productData.category_id = undefined; // Undefined skips update for that field, or null to clear?
    // If user wants to clear category, they send null. But form sends ''.
    // For update, if we receive '', we probably mean clear it? Or keep it?
    // If form sends '', it means "no category selected". So NULL.
    if (productData.category_id === '') (productData as any).category_id = null;
    if (productData.sku === '') (productData as any).sku = null;

    // 1. Update Product
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    // 2. Sync Variants
    if (variants) {
      // Get existing variants to compare
      const { data: existingVariants } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', id)

      const existingIds = existingVariants?.map(v => v.id) || []
      const incomingIds = variants.map(v => v.id).filter(Boolean) as string[]

      // Delete removed variants
      const toDelete = existingIds.filter(eid => !incomingIds.includes(eid))
      if (toDelete.length > 0) {
        await supabase
          .from('product_variants')
          .delete()
          .in('id', toDelete)
      }

      // Upsert (Insert/Update) variants
      const toUpsert = variants.map(v => ({
        id: v.id, // If undefined, will insert (but upsert needs primary key match for update)
        product_id: id,
        size: v.size,
        color: v.color,
        stock_quantity: v.stock_quantity,
        cost_price_zmw: v.cost_price_zmw,
        sku: v.sku === '' ? null : v.sku
      }))
      
      // Note: With Supabase JS Client, upserting mixed with new (no ID) and existing (with ID) 
      // sometimes works if ID is primary key, but if ID is undefined it might error if not ignored.
      // Best to split.
      
      const newVariants = toUpsert.filter(v => !v.id)
      const existingToUpdate = toUpsert.filter(v => v.id)

      if (newVariants.length > 0) {
          const { error: insertError } = await supabase.from('product_variants').insert(newVariants)
          if (insertError) throw new Error(insertError.message)
      }

      if (existingToUpdate.length > 0) {
          const { error: upsertError } = await supabase.from('product_variants').upsert(existingToUpdate)
          if (upsertError) throw new Error(upsertError.message)
      }
    }

    return this.getProduct(id) as Promise<Product>
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  }

  // Inventory Management
  
  async adjustStock(
    productId: string, 
    variantId: string | null, 
    amount: number, 
    reason: string, 
    note?: string
  ): Promise<void> {
    const { error } = await supabase.rpc('adjust_stock', {
        p_product_id: productId,
        p_variant_id: variantId,
        p_change_amount: amount,
        p_reason: reason,
        p_note: note
    })

    if (error) {
        throw new Error(error.message)
    }
  }

  async getInventoryLogs(limit = 50): Promise<InventoryLog[]> {
      const { data, error } = await supabase
        .from('inventory_logs')
        .select(`
            *,
            product:products(title),
            variant:product_variants(size, color)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)
    
      if (error) throw new Error(error.message)
      return data as any as InventoryLog[]
  }

  async getLowStockProducts(): Promise<Product[]> {
      const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            variants:product_variants(*)
        `)
        .eq('track_inventory', true)
        
      if (error) throw new Error(error.message)
      
      // Filter in memory for now as "low stock" logic can be complex with variants
      // A product is low stock if:
      // 1. It has no variants and stock < threshold
      // 2. It has variants and ANY variant stock < threshold? Or sum? usually any variant.
      
      const lowStock = (data || []).filter(p => {
          const threshold = p.low_stock_threshold || 10
          if (p.variants && p.variants.length > 0) {
              return p.variants.some(v => (v.stock_quantity ?? 0) <= threshold)
          }
          return (p.stock_quantity ?? 0) <= threshold
      })

      return lowStock as Product[]
  }
}