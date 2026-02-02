'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SupabaseModifierService } from '@/services/SupabaseModifierService'
import { Modifier } from '@/services/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, Tags, GripVertical, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function ModifiersPage() {
  const [modifiers, setModifiers] = useState<Modifier[]>([])
  const [filteredModifiers, setFilteredModifiers] = useState<Modifier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const modifierService = new SupabaseModifierService()

  const loadModifiers = async () => {
    try {
      setIsLoading(true)
      const data = await modifierService.getModifiers()
      setModifiers(data)
      setFilteredModifiers(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load modifiers'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await modifierService.deleteModifier(deleteId)
      toast.success('Modifier deleted successfully')
      await loadModifiers()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete modifier'
      toast.error(message)
    } finally {
      setDeleteId(null)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredModifiers(modifiers)
      return
    }

    const filtered = modifiers.filter(
      (mod) =>
        mod.name.toLowerCase().includes(term.toLowerCase()) ||
        mod.description?.toLowerCase().includes(term.toLowerCase()) ||
        mod.sku?.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredModifiers(filtered)
  }

  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null)
      return
    }

    const draggedIndex = modifiers.findIndex((m) => m.id === draggedItem)
    const targetIndex = modifiers.findIndex((m) => m.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    // Reorder array
    const newModifiers = [...modifiers]
    const [removed] = newModifiers.splice(draggedIndex, 1)
    newModifiers.splice(targetIndex, 0, removed)

    // Update sort_order
    const updates = newModifiers.map((mod, index) => ({
      id: mod.id,
      sort_order: index,
    }))

    // Optimistically update UI
    setModifiers(newModifiers)
    setFilteredModifiers(newModifiers)

    try {
      await modifierService.updateSortOrders(updates)
      toast.success('Order updated')
    } catch (error) {
      toast.error('Failed to update order')
      await loadModifiers() // Revert on error
    }

    setDraggedItem(null)
  }

  useEffect(() => {
    loadModifiers()
  }, [])

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifiers</h1>
          <p className="text-gray-600 mt-1">Manage product add-ons and extras</p>
        </div>
        <Link href="/admin/modifiers/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Modifier
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search modifiers..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Modifiers Table */}
      <Card className="p-6">
        {filteredModifiers.length === 0 ? (
          <div className="text-center py-12">
            <Tags className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No modifiers found' : 'No modifiers yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search'
                : 'Get started by creating your first modifier'}
            </p>
            {!searchTerm && (
              <Link href="/admin/modifiers/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Modifier
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price (ZMW)</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModifiers.map((modifier) => (
                <TableRow
                  key={modifier.id}
                  draggable={!searchTerm}
                  onDragStart={() => handleDragStart(modifier.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(modifier.id)}
                  className={`${
                    draggedItem === modifier.id ? 'opacity-50' : ''
                  } ${!searchTerm ? 'cursor-move' : ''}`}
                >
                  <TableCell>
                    {!searchTerm && <GripVertical className="h-4 w-4 text-gray-400" />}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{modifier.name}</p>
                      {modifier.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {modifier.description}
                        </p>
                      )}
                      {modifier.sku && (
                        <p className="text-xs text-gray-400 mt-1">SKU: {modifier.sku}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      K{modifier.price_zmw.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {modifier.track_inventory ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          modifier.stock_quantity > (modifier.low_stock_threshold || 10)
                            ? 'bg-green-100 text-green-800'
                            : modifier.stock_quantity > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {modifier.stock_quantity}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {modifier.min_quantity}-{modifier.max_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    {modifier.is_global ? (
                      <Badge variant="secondary">Global</Badge>
                    ) : (
                      <Badge variant="outline">Product-specific</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        modifier.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {modifier.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/modifiers/${modifier.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(modifier.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this modifier. Products using this modifier will
              no longer have it available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
