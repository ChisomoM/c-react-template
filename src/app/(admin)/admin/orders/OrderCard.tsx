import { motion } from 'framer-motion'
import { AdminOrder } from './mockOrders'
import StatusBadge from './StatusBadge'
import { formatDate, formatCurrency } from './orderUtils'
import { Eye, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrderCardProps {
  order: AdminOrder
  index: number
  onViewDetails: (order: AdminOrder) => void
  isSelected?: boolean
  onToggleSelect?: (orderId: string) => void
}

export default function OrderCard({
  order,
  index,
  onViewDetails,
  isSelected = false,
  onToggleSelect,
}: OrderCardProps) {
  const itemCount = order.items?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`
        relative bg-white border rounded-none overflow-hidden
        transition-all duration-300 cursor-pointer
        hover:shadow-lg group
        ${isSelected ? 'border-gold-primary shadow-md' : 'border-gray-300'}
      `}
      onClick={() => onViewDetails(order)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetails(order)
        }
      }}
      aria-label={`View details for order ${order.order_number}`}
    >
      {/* Selection Checkbox (if applicable) */}
      {onToggleSelect && (
        <div
          className="absolute top-4 left-4 z-10"
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect(order.id)
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="h-5 w-5 rounded border-gray-300 text-gold-primary focus:ring-gold-primary cursor-pointer"
            aria-label={`Select order ${order.order_number}`}
          />
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Order Info - 4 cols */}
        <div className="md:col-span-4 flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-sora font-semibold text-lg text-charcoal mb-1 truncate group-hover:text-gold-dark transition-colors">
              {order.order_number}
            </h3>
            <p className="font-sora font-medium text-base text-gray-900 truncate">
              {order.customer_name}
            </p>
            <p className="font-sora font-light text-sm text-gray-600 truncate">
              {order.customer_email}
            </p>
          </div>
        </div>

        {/* Items Count - 2 cols */}
        <div className="md:col-span-2">
          <p className="font-sora font-light text-sm text-gray-600">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
          <p className="font-sora font-light text-xs text-gray-500 mt-1">
            {order.payment_method}
          </p>
        </div>

        {/* Status - 2 cols */}
        <div className="md:col-span-2">
          <StatusBadge status={order.status} />
        </div>

        {/* Amount & Date - 3 cols */}
        <div className="md:col-span-3 text-left md:text-right">
          <p className="font-sora font-bold text-xl text-charcoal mb-1">
            {formatCurrency(order.total_zmw)}
          </p>
          <p className="font-sora font-light text-sm text-gray-600">
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Action Button - 1 col */}
        <div className="md:col-span-1 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gold-primary hover:text-charcoal transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(order)
            }}
            aria-label={`View details for ${order.order_number}`}
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Optional Note Indicator */}
      {order.notes && (
        <div className="px-6 pb-4">
          <p className="font-sora font-light text-xs text-gray-500 italic">
            Note: {order.notes}
          </p>
        </div>
      )}
    </motion.div>
  )
}
