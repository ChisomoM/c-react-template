'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminOrder } from './mockOrders'
import StatusBadge from './StatusBadge'
import {
  formatDate,
  formatCurrency,
  getPaymentStatusColor,
  getStatusTransitions,
} from './orderUtils'
import {
  X,
  User,
  Package,
  CreditCard,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Printer,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface OrderDetailsDialogProps {
  order: AdminOrder | null
  onClose: () => void
  onStatusUpdate: (orderId: string, newStatus: AdminOrder['status']) => void
}

export default function OrderDetailsDialog({
  order,
  onClose,
  onStatusUpdate,
}: OrderDetailsDialogProps) {
  const [expandedSections, setExpandedSections] = useState({
    items: true,
    shipping: true,
    history: true,
  })
  const [isUpdating, setIsUpdating] = useState(false)

  if (!order) return null

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleStatusUpdate = async (newStatus: AdminOrder['status']) => {
    setIsUpdating(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      onStatusUpdate(order.id, newStatus)
      toast.success(`Order ${order.order_number} updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const availableTransitions = getStatusTransitions(order.status)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full md:w-[600px] h-full bg-white shadow-2xl overflow-y-auto"
          role="dialog"
          aria-labelledby="order-details-title"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-300 px-8 py-6 flex items-center justify-between">
            <div>
              <h2
                id="order-details-title"
                className="font-sora font-bold text-2xl text-charcoal"
              >
                {order.order_number}
              </h2>
              <p className="font-sora font-light text-sm text-gray-600 mt-1">
                {formatDate(order.created_at)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
              aria-label="Close dialog"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Status & Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <StatusBadge status={order.status} className="text-sm" />
                <p className="font-sora font-bold text-2xl text-charcoal">
                  {formatCurrency(order.total_zmw)}
                </p>
              </div>

              {/* Status Update Buttons */}
              {availableTransitions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <p className="w-full font-sora font-medium text-sm text-gray-700 mb-2">
                    Update Status:
                  </p>
                  {availableTransitions.map((status) => (
                    <Button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={isUpdating}
                      className="bg-charcoal hover:bg-gold-primary text-white hover:text-charcoal font-sora font-semibold text-sm rounded-none transition-all duration-300"
                    >
                      {isUpdating ? 'Updating...' : `Mark as ${status}`}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-cream p-6 rounded-none">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-gray-600" />
                <h3 className="font-sora font-semibold text-lg text-charcoal">
                  Customer Information
                </h3>
              </div>
              <div className="space-y-2">
                <p className="font-sora font-medium text-base text-gray-900">
                  {order.customer_name}
                </p>
                <p className="font-sora font-light text-sm text-gray-700">
                  {order.customer_email}
                </p>
                {order.customer_phone && (
                  <p className="font-sora font-light text-sm text-gray-700">
                    {order.customer_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t border-gray-300 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="font-sora font-semibold text-lg text-charcoal">
                  Payment Information
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-sora font-light text-sm text-gray-700">
                    Method:
                  </span>
                  <span className="font-sora font-medium text-sm text-gray-900">
                    {order.payment_method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sora font-light text-sm text-gray-700">
                    Status:
                  </span>
                  <span
                    className={`font-sora font-semibold text-sm ${getPaymentStatusColor(
                      order.payment_status
                    )}`}
                  >
                    {order.payment_status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-300 pt-6">
              <button
                onClick={() => toggleSection('items')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
                aria-expanded={expandedSections.items}
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-600" />
                  <h3 className="font-sora font-semibold text-lg text-charcoal">
                    Order Items ({order.items?.length || 0})
                  </h3>
                </div>
                {expandedSections.items ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.items && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="bg-cream p-4 rounded-none flex justify-between items-center"
                      >
                        <div>
                          <p className="font-sora font-medium text-sm text-gray-900">
                            Product ID: {item.product_id}
                          </p>
                          <p className="font-sora font-light text-xs text-gray-600 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-sora font-semibold text-base text-charcoal">
                          {formatCurrency(item.price_at_purchase * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shipping Address */}
            <div className="border-t border-gray-300 pt-6">
              <button
                onClick={() => toggleSection('shipping')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
                aria-expanded={expandedSections.shipping}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <h3 className="font-sora font-semibold text-lg text-charcoal">
                    Shipping Address
                  </h3>
                </div>
                {expandedSections.shipping ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.shipping && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-cream p-4 rounded-none space-y-1"
                  >
                    <p className="font-sora font-medium text-sm text-gray-900">
                      {order.shipping_address.first_name}{' '}
                      {order.shipping_address.last_name}
                    </p>
                    <p className="font-sora font-light text-sm text-gray-700">
                      {order.shipping_address.address}
                    </p>
                    {order.shipping_address.area && (
                      <p className="font-sora font-light text-sm text-gray-700">
                        {order.shipping_address.area}
                      </p>
                    )}
                    <p className="font-sora font-light text-sm text-gray-700">
                      {order.shipping_address.city}
                    </p>
                    <p className="font-sora font-light text-sm text-gray-700">
                      {order.shipping_address.phone}
                    </p>
                    {order.tracking_number && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="font-sora font-light text-xs text-gray-600">
                          Tracking Number:
                        </p>
                        <p className="font-sora font-semibold text-sm text-charcoal mt-1">
                          {order.tracking_number}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status History */}
            <div className="border-t border-gray-300 pt-6">
              <button
                onClick={() => toggleSection('history')}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
                aria-expanded={expandedSections.history}
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <h3 className="font-sora font-semibold text-lg text-charcoal">
                    Status History
                  </h3>
                </div>
                {expandedSections.history ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.history && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {order.status_history.map((history, idx) => (
                      <div
                        key={idx}
                        className="relative pl-6 pb-4 border-l-2 border-gray-300 last:border-l-0 last:pb-0"
                      >
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-gold-primary rounded-full" />
                        <div>
                          <StatusBadge status={history.status} className="mb-2" />
                          <p className="font-sora font-light text-xs text-gray-600">
                            {formatDate(history.changed_at)}
                          </p>
                          {history.changed_by && (
                            <p className="font-sora font-light text-xs text-gray-600 mt-1">
                              By: {history.changed_by}
                            </p>
                          )}
                          {history.note && (
                            <p className="font-sora font-light text-sm text-gray-700 mt-2 italic">
                              {history.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="border-t border-gray-300 pt-6">
                <h3 className="font-sora font-semibold text-lg text-charcoal mb-3">
                  Admin Notes
                </h3>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-none">
                  <p className="font-sora font-light text-sm text-gray-800">
                    {order.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-300 px-8 py-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-sora font-semibold rounded-none"
              onClick={() => {
                toast.info('Print functionality coming soon')
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-charcoal text-charcoal hover:bg-charcoal hover:text-white font-sora font-semibold rounded-none"
              onClick={() => {
                toast.info('Email functionality coming soon')
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Customer
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
