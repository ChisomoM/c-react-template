import { AdminOrder } from './mockOrders'
import { getStatusColor } from './orderUtils'

interface StatusBadgeProps {
  status: AdminOrder['status']
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusLabels: Record<AdminOrder['status'], string> = {
    pending: 'Pending',
    paid: 'Paid',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
  }

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full border
        font-sora font-semibold text-xs uppercase tracking-wider
        transition-all duration-300
        ${getStatusColor(status)}
        ${className}
      `}
      role="status"
      aria-label={`Order status: ${statusLabels[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}
