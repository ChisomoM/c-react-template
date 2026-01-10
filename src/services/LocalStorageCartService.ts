import { ICartService, CartItem, Product } from './types'
import { supabase } from '@/lib/supabase/client'

const STORAGE_KEY = 'guest_cart'

export class LocalStorageCartService implements ICartService {
  async addItem(item: CartItem): Promise<void> {
    const items = this.getItems()
    // Logic to merge same product same variant
    const existingIndex = items.findIndex(i => 
      i.product_id === item.product_id && 
      JSON.stringify(i.variant_selection) === JSON.stringify(item.variant_selection)
    )

    if (existingIndex > -1) {
      items[existingIndex].quantity += item.quantity
    } else {
      // Add new item, ensure ID is distinct if needed, but for guest just array index or random
      items.push({ 
        ...item, 
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
      })
    }

    this.saveItems(items)
  }

  async removeItem(productId: string): Promise<void> {
    // Mimicking SupabaseCartService behavior of removing all items with product_id
    // though ideally it should respect variants.
    let items = this.getItems()
    items = items.filter(i => i.product_id !== productId)
    this.saveItems(items)
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeItem(productId)
      return
    }

    let items = this.getItems()
    // Mimicking SupabaseCartService behavior of updating all items with product_id
    items = items.map(item => {
      if (item.product_id === productId) {
        return { ...item, quantity }
      }
      return item
    })
    
    this.saveItems(items)
  }

  async clearCart(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  async sync(): Promise<CartItem[]> {
    const items = this.getItems()
    if (items.length === 0) return []

    // Fetch product details for these items to populate 'product' field
    const productIds = Array.from(new Set(items.map(i => i.product_id)))
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*)
      `)
      .in('id', productIds)

    if (error || !products) {
      console.error('Failed to fetch products for guest cart', error)
      return items
    }

    // Merge product data into items
    return items.map(item => {
      const product = products.find(p => p.id === item.product_id)
      return {
        ...item,
        product: product as Product
      }
    })
  }

  private getItems(): CartItem[] {
    if (typeof window === 'undefined') return []
    const json = localStorage.getItem(STORAGE_KEY)
    if (!json) return []
    try {
      return JSON.parse(json)
    } catch (e) {
      console.error('Failed to parse guest cart', e)
      return []
    }
  }

  private saveItems(items: CartItem[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}
