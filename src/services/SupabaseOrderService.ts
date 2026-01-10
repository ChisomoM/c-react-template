import { supabase } from '@/lib/supabase/client'
import { IOrderService, Order, OrderItem } from './types'

export class SupabaseOrderService implements IOrderService {
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'status' | 'user_id' | 'items'> & { items: Omit<OrderItem, 'id' | 'order_id'>[] }): Promise<Order> {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Removed login check to support guests

    // Start a Supabase transaction equivalent (RPC or sequential inserts)
    // Since Supabase doesn't support client-side transactions easily without RPC, we'll do sequential inserts
    // and hope for the best (or write an RPC later if needed for robustness)

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null, 
        status: 'pending',
        total_zmw: orderData.total_zmw,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method,
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(orderError.message)
    }

    // 2. Create Order Items
    const itemsToInsert = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
      variant_selection: item.variant_selection,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert)

    if (itemsError) {
      // In a real app, we would want to rollback the order creation here
      console.error('Failed to create order items', itemsError)
      throw new Error('Failed to create order items')
    }

    // 3. Clear Cart (Optional, but usually desired)
    // We can let the UI handle this or do it here. Doing it here is safer.
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id)
    }

    return order
  }

  async getOrders(): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  async getOrder(id: string): Promise<Order | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(error.message)
    }

    return data
  }
}

