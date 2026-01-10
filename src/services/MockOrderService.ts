import { IOrderService, Order, OrderItem } from './types'

export class MockOrderService implements IOrderService {
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'status' | 'user_id' | 'items'> & { items: Omit<OrderItem, 'id' | 'order_id'>[] }): Promise<Order> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Mock Order Created:', orderData)

    const mockOrder: Order = {
      id: `mock-order-${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'mock-user-id',
      status: 'pending',
      total_zmw: orderData.total_zmw,
      shipping_address: orderData.shipping_address,
      payment_method: orderData.payment_method,
      created_at: new Date().toISOString(),
      items: orderData.items.map(item => ({
        ...item,
        id: `mock-item-${Math.random().toString(36).substr(2, 9)}`,
        order_id: 'mock-order-id'
      }))
    }

    return mockOrder
  }

  async getOrders(): Promise<Order[]> {
    return []
  }

  async getOrder(id: string): Promise<Order | null> {
    return null
  }
}
