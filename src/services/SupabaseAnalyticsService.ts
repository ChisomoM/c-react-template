import { supabase } from '@/lib/supabase/client'
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subMonths,
  eachDayOfInterval,
  format,
} from 'date-fns'

export interface AnalyticsSummary {
  revenue: number
  ordersCount: number
  averageOrderValue: number
  activeCustomers: number // Unique users who placed orders
  netProfit: number // Placeholder if cost isn't tracked yet
  pendingOrders: number
  deliveredOrders: number
  returnRate: number
}

export interface SalesTrend {
  date: string
  revenue: number
  orders: number
}

export interface ProductPerformance {
  id: string
  title: string
  quantitySold: number
  revenue: number
}

export interface InventoryAlert {
  id: string
  title: string
  stock_quantity: number
  low_stock_threshold: number
}

export interface AreaSales {
    area: string
    revenue: number
    orders: number
}

export class SupabaseAnalyticsService {
  async getSummary(startDate: Date, endDate: Date): Promise<AnalyticsSummary> {
    // Fetch orders within range
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(cost_price_zmw))')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .neq('status', 'cancelled') // Exclude cancelled orders from revenue

    if (error) throw new Error(error.message)

    const revenue = orders.reduce((sum, order) => sum + order.total_zmw, 0)
    const ordersCount = orders.length
    const averageOrderValue = ordersCount > 0 ? revenue / ordersCount : 0
    const activeCustomers = new Set(orders.map(o => o.user_id)).size

    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length
    const returnedOrders = orders.filter(o => o.status === 'returned').length
    const returnRate = ordersCount > 0 ? (returnedOrders / ordersCount) * 100 : 0
    
    // Calculate Net Profit
    // This requires cost_price_zmw on products.
    // Profit = (Sell Price - Cost Price) * Qty
    let totalCost = 0;
    orders.forEach(order => {
        order.items.forEach((item: any) => {
             const cost = item.product?.cost_price_zmw || 0; // Default to 0 if not set
             totalCost += cost * item.quantity;
        })
    });
    const netProfit = revenue - totalCost;

    return {
      revenue,
      ordersCount,
      averageOrderValue,
      activeCustomers,
      netProfit,
      pendingOrders,
      deliveredOrders,
      returnRate
    }
  }

  async getSalesTrend(startDate: Date, endDate: Date): Promise<SalesTrend[]> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('created_at, total_zmw')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .neq('status', 'cancelled')

    if (error) throw new Error(error.message)

    // Group by day
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const salesMap = new Map<string, { revenue: number; orders: number }>()

    days.forEach(day => {
      salesMap.set(format(day, 'yyyy-MM-dd'), { revenue: 0, orders: 0 })
    })

    orders.forEach(order => {
      const dateKey = format(new Date(order.created_at), 'yyyy-MM-dd')
      if (salesMap.has(dateKey)) {
        const current = salesMap.get(dateKey)!
        salesMap.set(dateKey, {
          revenue: current.revenue + order.total_zmw,
          orders: current.orders + 1
        })
      }
    })

    return Array.from(salesMap.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    }))
  }

  async getTopProducts(startDate: Date, endDate: Date, limit = 5): Promise<ProductPerformance[]> {
    const { data: items, error } = await supabase
      .from('order_items')
      .select('product_id, quantity, price_at_purchase, product:products(title), orders!inner(created_at, status)')
      .gte('orders.created_at', startDate.toISOString())
      .lte('orders.created_at', endDate.toISOString())
      .neq('orders.status', 'cancelled')

    if (error) throw new Error(error.message)

    const productMap = new Map<string, { title: string; quantity: number; revenue: number }>()

    items.forEach((item: any) => {
      // Note: Supabase response structure might vary slightly depending on join
      // item.product might be an array or object
      const title = item.product?.title || 'Unknown Product'
      const revenue = item.quantity * item.price_at_purchase

      if (productMap.has(item.product_id)) {
        const current = productMap.get(item.product_id)!
        productMap.set(item.product_id, {
          title,
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + revenue
        })
      } else {
        productMap.set(item.product_id, { title, quantity: item.quantity, revenue })
      }
    })

    return Array.from(productMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)
  }
  
  async getInventoryAlerts(limit = 10): Promise<InventoryAlert[]> {
      // Query products where stock_quantity <= low_stock_threshold
      // Since we can't do column comparison easily in basic PostgREST JS client filters (col vs col),
      // we might need to filter client side or use a stored procedure/view.
      // For now, let's fetch active products and filter JS side (or use rpc if performance is critical later).
      
      const { data: products, error } = await supabase
        .from('products')
        .select('id, title, stock_quantity, low_stock_threshold')
        .eq('is_active', true)
        
      if (error) throw new Error(error.message)
      
      return products
        .filter((p: any) => p.stock_quantity <= (p.low_stock_threshold || 10))
        .map((p: any) => ({
             id: p.id,
             title: p.title,
             stock_quantity: p.stock_quantity,
             low_stock_threshold: p.low_stock_threshold || 10
        }))
        .slice(0, limit);
  }

  async getSalesByArea(startDate: Date, endDate: Date): Promise<AreaSales[]> {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('shipping_address, total_zmw')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .neq('status', 'cancelled')
        
      if (error) throw new Error(error.message)
      
      const areaMap = new Map<string, { revenue: number, orders: number }>();
      
      orders.forEach((order: any) => {
          // Extract area, fallback to city if area is missing, or "Unknown"
          const area = order.shipping_address?.area || order.shipping_address?.city || 'Unknown';
          const revenue = order.total_zmw;
          
          if (areaMap.has(area)) {
              const current = areaMap.get(area)!;
              areaMap.set(area, { revenue: current.revenue + revenue, orders: current.orders + 1});
          } else {
              areaMap.set(area, { revenue, orders: 1 });
          }
      });
      
      return Array.from(areaMap.entries()).map(([area, data]) => ({
          area,
          revenue: data.revenue,
          orders: data.orders
      })).sort((a, b) => b.revenue - a.revenue);
  }
}
