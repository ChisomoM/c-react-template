'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { mockOrders, AdminOrder } from './mockOrders'
import {
  searchOrders,
  filterByStatus,
  sortOrders,
} from './orderUtils'
import OrderCard from './OrderCard'
import OrderDetailsDialog from './OrderDetailsDialog'
import BulkActionsBar from './BulkActionsBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 10

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial load
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  // Status filter tabs
  const statusTabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    {
      id: 'pending',
      label: 'Pending',
      count: orders.filter((o) => o.status === 'pending').length,
    },
    {
      id: 'paid',
      label: 'Paid',
      count: orders.filter((o) => o.status === 'paid').length,
    },
    {
      id: 'shipped',
      label: 'Shipped',
      count: orders.filter((o) => o.status === 'shipped').length,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: orders.filter((o) => o.status === 'delivered').length,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: orders.filter((o) => o.status === 'cancelled').length,
    },
    {
      id: 'returned',
      label: 'Returned',
      count: orders.filter((o) => o.status === 'returned').length,
    },
  ]

  // Apply filters and sorting
  const filteredOrders = useMemo(() => {
    let result = [...orders]
    result = searchOrders(result, searchQuery)
    result = filterByStatus(result, selectedStatus)
    result = sortOrders(result, sortBy)
    return result
  }, [orders, searchQuery, selectedStatus, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStatus, sortBy])

  // Handlers
  const handleToggleSelect = (orderId: string) => {
    setSelectedOrders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const handleClearSelection = () => {
    setSelectedOrders(new Set())
  }

  const handleBulkAction = (action: string) => {
    const selectedOrdersList = orders.filter((o) => selectedOrders.has(o.id))

    switch (action) {
      case 'mark-paid':
        selectedOrdersList.forEach((order) => {
          if (order.status === 'pending') {
            handleStatusUpdate(order.id, 'paid')
          }
        })
        toast.success(`${selectedOrdersList.length} orders marked as paid`)
        break
      case 'mark-shipped':
        selectedOrdersList.forEach((order) => {
          if (order.status === 'paid') {
            handleStatusUpdate(order.id, 'shipped')
          }
        })
        toast.success(`${selectedOrdersList.length} orders marked as shipped`)
        break
      case 'export':
        toast.info('Exporting selected orders...')
        break
    }

    handleClearSelection()
  }

  const handleStatusUpdate = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            status_history: [
              ...order.status_history,
              {
                status: newStatus,
                changed_at: new Date().toISOString(),
                changed_by: 'admin@luxury.com',
              },
            ],
          }
        }
        return order
      })
    )
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-300 w-1/3 rounded"></div>
            <div className="h-10 bg-gray-300 w-full rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedOrders.size}
          onClearSelection={handleClearSelection}
          onBulkAction={handleBulkAction}
        />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-sora font-bold text-4xl md:text-5xl text-charcoal tracking-tight">
                Orders Management
              </h1>
              <p className="font-sora font-light text-lg text-gray-600 mt-2">
                View and manage all customer orders
              </p>
            </div>
            <Button
              onClick={handleExport}
              className="bg-charcoal hover:bg-gold-primary text-white hover:text-charcoal font-sora font-semibold rounded-none transition-all duration-300 hover:shadow-[0_0_20px_rgba(230,184,0,0.3)]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by order #, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 w-full border-gray-300 focus:border-gold-primary font-sora rounded-none"
                aria-label="Search orders"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 bg-white font-sora font-medium text-sm focus:outline-none focus:border-gold-primary rounded-none cursor-pointer"
              aria-label="Sort orders"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 border-b border-gray-300 pb-4">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`
                  px-4 py-2 font-sora font-medium text-sm
                  transition-all duration-300 rounded-none
                  ${
                    selectedStatus === tab.id
                      ? 'bg-charcoal text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }
                `}
                aria-pressed={selectedStatus === tab.id}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mt-4">
            <p className="font-sora font-light text-sm text-gray-600">
              Showing {paginatedOrders.length} of {filteredOrders.length} orders
            </p>
          </div>
        </motion.div>

        {/* Orders List */}
        {paginatedOrders.length > 0 ? (
          <div className="space-y-4">
            {paginatedOrders.map((order, idx) => (
              <OrderCard
                key={order.id}
                order={order}
                index={idx}
                onViewDetails={setSelectedOrder}
                isSelected={selectedOrders.has(order.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="font-sora font-semibold text-2xl text-charcoal mb-2">
              No orders found
            </h3>
            <p className="font-sora font-light text-gray-600 mb-8">
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'No orders have been placed yet'}
            </p>
            {(searchQuery || selectedStatus !== 'all') && (
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedStatus('all')
                }}
                className="bg-gold-primary hover:bg-gold-dark text-charcoal font-sora font-semibold rounded-none"
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-sora font-semibold rounded-none"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    w-10 h-10 font-sora font-semibold text-sm
                    transition-all duration-300 rounded-none
                    ${
                      currentPage === page
                        ? 'bg-gold-primary text-charcoal'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }
                  `}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-sora font-semibold rounded-none"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}
