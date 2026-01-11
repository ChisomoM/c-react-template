import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onBulkAction: (action: string) => void
}

export default function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkAction,
}: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-0 right-0 z-30 bg-charcoal text-white shadow-lg border-b border-gold-primary"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Selection Info */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClearSelection}
                  className="hover:bg-white/10 text-white"
                  aria-label="Clear selection"
                >
                  <X className="h-5 w-5" />
                </Button>
                <p className="font-sora font-semibold text-base">
                  {selectedCount} order{selectedCount !== 1 ? 's' : ''} selected
                </p>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onBulkAction('mark-paid')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-sora font-semibold rounded-none"
                >
                  Mark as Paid
                </Button>
                <Button
                  onClick={() => onBulkAction('mark-shipped')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-sora font-semibold rounded-none"
                >
                  Mark as Shipped
                </Button>
                <Button
                  onClick={() => onBulkAction('export')}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-charcoal font-sora font-semibold rounded-none"
                >
                  Export
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
