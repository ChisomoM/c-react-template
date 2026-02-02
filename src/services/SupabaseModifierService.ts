import { supabase } from '@/lib/supabase/client'
import { IModifierService, Modifier } from './types'

export class SupabaseModifierService implements IModifierService {
  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  async getModifiers(): Promise<Modifier[]> {
    const { data, error } = await supabase
      .from('modifiers')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Get Modifiers Error:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  async getModifier(id: string): Promise<Modifier | null> {
    const { data, error } = await supabase
      .from('modifiers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error('Get Modifier Error:', error)
      throw new Error(error.message)
    }

    return data
  }

  async createModifier(modifier: Partial<Modifier>): Promise<Modifier> {
    // Sanitize empty strings to null for optional fields
    if (modifier.sku === '') modifier.sku = undefined
    if (modifier.description === '') modifier.description = undefined

    const { data, error } = await supabase
      .from('modifiers')
      .insert(modifier)
      .select()
      .single()

    if (error) {
      console.error('Create Modifier Error:', error)
      throw new Error(error.message)
    }

    return data
  }

  async updateModifier(id: string, modifier: Partial<Modifier>): Promise<Modifier> {
    // Sanitize empty strings
    if (modifier.sku === '') modifier.sku = undefined
    if (modifier.description === '') modifier.description = undefined

    const { data, error } = await supabase
      .from('modifiers')
      .update(modifier)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update Modifier Error:', error)
      throw new Error(error.message)
    }

    return data
  }

  async deleteModifier(id: string): Promise<void> {
    const { error } = await supabase
      .from('modifiers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete Modifier Error:', error)
      throw new Error(error.message)
    }
  }

  // ============================================================================
  // PRODUCT ASSOCIATIONS
  // ============================================================================

  async getProductModifiers(productId: string): Promise<Modifier[]> {
    // Get global modifiers
    const { data: globalModifiers, error: globalError } = await supabase
      .from('modifiers')
      .select('*')
      .eq('is_global', true)
      .eq('is_active', true)

    if (globalError) {
      console.error('Get Global Modifiers Error:', globalError)
      throw new Error(globalError.message)
    }

    // Get product-specific modifiers
    const { data: productModifiers, error: productError } = await supabase
      .from('product_modifiers')
      .select('modifier:modifiers(*)')
      .eq('product_id', productId)

    if (productError) {
      console.error('Get Product-Specific Modifiers Error:', productError)
      throw new Error(productError.message)
    }

    // Combine and deduplicate
    const productModifiersList = (productModifiers
      ?.map(pm => pm.modifier as unknown as Modifier)
      .filter(m => m && m.is_active) || []) as Modifier[]

    const allModifiers = [...(globalModifiers || []), ...productModifiersList]
    
    // Deduplicate by id
    const uniqueModifiers = Array.from(
      new Map(allModifiers.map(m => [m.id, m])).values()
    )

    // Sort by sort_order then name
    return uniqueModifiers.sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order
      }
      return a.name.localeCompare(b.name)
    })
  }

  async assignModifierToProduct(productId: string, modifierId: string): Promise<void> {
    // Check if already assigned
    const { data: existing } = await supabase
      .from('product_modifiers')
      .select('id')
      .eq('product_id', productId)
      .eq('modifier_id', modifierId)
      .single()

    if (existing) {
      // Already assigned, skip
      return
    }

    const { error } = await supabase
      .from('product_modifiers')
      .insert({
        product_id: productId,
        modifier_id: modifierId,
      })

    if (error) {
      console.error('Assign Modifier to Product Error:', error)
      throw new Error(error.message)
    }
  }

  async removeModifierFromProduct(productId: string, modifierId: string): Promise<void> {
    const { error } = await supabase
      .from('product_modifiers')
      .delete()
      .eq('product_id', productId)
      .eq('modifier_id', modifierId)

    if (error) {
      console.error('Remove Modifier from Product Error:', error)
      throw new Error(error.message)
    }
  }

  // ============================================================================
  // STOCK MANAGEMENT
  // ============================================================================

  async adjustModifierStock(
    modifierId: string,
    amount: number,
    reason: string,
    note?: string
  ): Promise<void> {
    const { error } = await supabase.rpc('adjust_modifier_stock', {
      p_modifier_id: modifierId,
      p_change_amount: amount,
      p_reason: reason,
      p_note: note,
    })

    if (error) {
      console.error('Adjust Modifier Stock Error:', error)
      throw new Error(error.message)
    }
  }

  async getLowStockModifiers(): Promise<Modifier[]> {
    const { data, error } = await supabase
      .from('modifiers')
      .select('*')
      .eq('track_inventory', true)
      .eq('is_active', true)
      .filter('stock_quantity', 'lte', 'low_stock_threshold')
      .order('stock_quantity', { ascending: true })

    if (error) {
      console.error('Get Low Stock Modifiers Error:', error)
      throw new Error(error.message)
    }

    return data || []
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Get all modifiers available for a specific product
   * Includes both global modifiers and product-specific ones
   */
  async getAvailableModifiersForProduct(productId: string): Promise<Modifier[]> {
    // Get global modifiers
    const { data: globalModifiers, error: globalError } = await supabase
      .from('modifiers')
      .select('*')
      .eq('is_global', true)
      .eq('is_active', true)

    if (globalError) {
      console.error('Get Global Modifiers Error:', globalError)
      throw new Error(globalError.message)
    }

    // Get product-specific modifiers
    const { data: productModifiers, error: productError } = await supabase
      .from('product_modifiers')
      .select('modifier:modifiers(*)')
      .eq('product_id', productId)

    if (productError) {
      console.error('Get Product-Specific Modifiers Error:', productError)
      throw new Error(productError.message)
    }

    // Combine and deduplicate
    const productModifiersList = (productModifiers
      ?.map(pm => pm.modifier as unknown as Modifier)
      .filter(m => m && m.is_active) || []) as Modifier[]

    const allModifiers = [...(globalModifiers || []), ...productModifiersList]
    
    // Deduplicate by id
    const uniqueModifiers = Array.from(
      new Map(allModifiers.map(m => [m.id, m])).values()
    )

    // Sort by sort_order then name
    return uniqueModifiers.sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order
      }
      return a.name.localeCompare(b.name)
    })
  }

  /**
   * Bulk assign multiple modifiers to a product
   */
  async bulkAssignModifiers(productId: string, modifierIds: string[]): Promise<void> {
    // First, get existing assignments
    const { data: existing } = await supabase
      .from('product_modifiers')
      .select('modifier_id')
      .eq('product_id', productId)

    const existingIds = existing?.map((pm: any) => pm.modifier_id) || []

    // Filter out already assigned
    const newIds = modifierIds.filter((id) => !existingIds.includes(id))

    if (newIds.length === 0) {
      return
    }

    // Insert new assignments
    const toInsert = newIds.map((modifierId) => ({
      product_id: productId,
      modifier_id: modifierId,
    }))

    const { error } = await supabase.from('product_modifiers').insert(toInsert)

    if (error) {
      console.error('Bulk Assign Modifiers Error:', error)
      throw new Error(error.message)
    }
  }

  /**
   * Bulk remove multiple modifiers from a product
   */
  async bulkRemoveModifiers(productId: string, modifierIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('product_modifiers')
      .delete()
      .eq('product_id', productId)
      .in('modifier_id', modifierIds)

    if (error) {
      console.error('Bulk Remove Modifiers Error:', error)
      throw new Error(error.message)
    }
  }

  /**
   * Update sort order for modifiers (for drag-and-drop)
   */
  async updateSortOrders(updates: Array<{ id: string; sort_order: number }>): Promise<void> {
    const promises = updates.map((update) =>
      supabase
        .from('modifiers')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id)
    )

    const results = await Promise.all(promises)

    const errors = results.filter((result: any) => result.error)
    if (errors.length > 0) {
      console.error('Update Sort Orders Errors:', errors)
      throw new Error('Failed to update some sort orders')
    }
  }
}
