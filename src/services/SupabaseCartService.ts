import { supabase } from '@/lib/supabase/client'
import { ICartService, CartItem } from './types'

export class SupabaseCartService implements ICartService {
  async addItem(item: CartItem): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be logged in to add items to cart')
    }

    // Check if item already exists
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', item.product_id)
      .eq('variant_selection', JSON.stringify(item.variant_selection || {}))
      .single()

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + item.quantity })
        .eq('id', existingItem.id)

      if (error) {
        throw new Error(error.message)
      }
    } else {
      // Insert new item
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: item.product_id,
          quantity: item.quantity,
          variant_selection: item.variant_selection || null,
        })

      if (error) {
        throw new Error(error.message)
      }
    }
  }

  async removeItem(productId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be logged in')
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      throw new Error(error.message)
    }
  }

  async sync(): Promise<CartItem[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          *,
          variants:product_variants(*)
        )
      `)
      .eq('user_id', user.id)

    if (error) {
       // Ignore abort errors
       if (error.message && (error.message.includes('abort') || error.message.includes('signal'))) {
           return []
       }
       throw new Error(error.message)
    }

    return data.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      variant_selection: item.variant_selection,
      product: item.product,
    }))
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be logged in')
    }

    if (quantity <= 0) {
      await this.removeItem(productId)
      return
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      throw new Error(error.message)
    }
  }

  async clearCart(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User must be logged in')
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      throw new Error(error.message)
    }
  }
}