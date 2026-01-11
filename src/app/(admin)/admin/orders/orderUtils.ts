import { AdminOrder } from './mockOrders'

export const getStatusColor = (status: AdminOrder['status']) => {
  const colors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-300',
    paid: 'bg-blue-100 text-blue-800 border-blue-300',
    shipped: 'bg-purple-100 text-purple-800 border-purple-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    returned: 'bg-red-100 text-red-800 border-red-300',
  }
  return colors[status] || colors.pending
}

export const getPaymentStatusColor = (status: AdminOrder['payment_status']) => {
  const colors = {
    pending: 'text-amber-600',
    completed: 'text-green-600',
    failed: 'text-red-600',
    refunded: 'text-gray-600',
  }
  return colors[status] || colors.pending
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export const formatCurrency = (amount: number) => {
  return `ZMW ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export const getStatusTransitions = (currentStatus: AdminOrder['status']) => {
  const transitions: Record<AdminOrder['status'], AdminOrder['status'][]> = {
    pending: ['paid', 'cancelled'],
    paid: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: ['returned'],
    cancelled: [],
    returned: [],
  }
  return transitions[currentStatus] || []
}

export const searchOrders = (orders: AdminOrder[], query: string) => {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return orders

  return orders.filter(order =>
    order.order_number.toLowerCase().includes(lowerQuery) ||
    order.customer_name.toLowerCase().includes(lowerQuery) ||
    order.customer_email.toLowerCase().includes(lowerQuery) ||
    order.customer_phone?.includes(lowerQuery)
  )
}

export const filterByStatus = (orders: AdminOrder[], status: string) => {
  if (status === 'all') return orders
  return orders.filter(order => order.status === status)
}

export const sortOrders = (orders: AdminOrder[], sortBy: string) => {
  const sorted = [...orders]
  
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    case 'amount-high':
      return sorted.sort((a, b) => b.total_zmw - a.total_zmw)
    case 'amount-low':
      return sorted.sort((a, b) => a.total_zmw - b.total_zmw)
    default:
      return sorted
  }
}
