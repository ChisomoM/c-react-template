'use client'

import { useState, useEffect } from 'react'
import { SupabaseProductService } from '@/services/SupabaseProductService'
import { Product, ProductVariant, InventoryLog } from '@/services/types'
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog'
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, AlertTriangle, History, Package, Search } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface InventoryItem {
    id: string // Product ID or Variant ID (complex key?) - used for tracking row
    productId: string
    variantId?: string
    title: string
    variantLabel: string
    sku: string
    stock: number
    threshold: number
    costPrice?: number
    isTracked: boolean
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [logs, setLogs] = useState<InventoryLog[]>([])
    const [loading, setLoading] = useState(true)
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    
    // Adjustment State
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
    const [adjustOpen, setAdjustOpen] = useState(false)
    const [adjustAmount, setAdjustAmount] = useState<number>(0)
    const [adjustReason, setAdjustReason] = useState('correction')
    const [adjustNote, setAdjustNote] = useState('')
    const [adjustLoading, setAdjustLoading] = useState(false)

    const productService = new SupabaseProductService()

    const loadData = async () => {
        setLoading(true)
        try {
            const [prods, inventoryLogs] = await Promise.all([
                productService.getAdminProducts(),
                productService.getInventoryLogs(50)
            ])
            setProducts(prods)
            setLogs(inventoryLogs)
            processInventory(prods)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load inventory data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const processInventory = (data: Product[]) => {
        const items: InventoryItem[] = []
        
        data.forEach(p => {
            // Include main product if it has no variants OR if we want to show it?
            // Usually if variants exist, main product stock is irrelevant effectively, 
            // but schema allows both. We'll show variants if they exist, otherwise product.
            
            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                     items.push({
                         id: v.id,
                         productId: p.id,
                         variantId: v.id,
                         title: p.title,
                         variantLabel: `${v.size || ''} ${v.color || ''}`.trim() || 'Variant',
                         sku: v.sku || p.sku || '',
                         stock: v.stock_quantity ?? 0,
                         threshold: p.low_stock_threshold || 10, // Variant specific threshold not in schema
                         costPrice: v.cost_price_zmw,
                         isTracked: p.track_inventory ?? true
                     })
                })
            } else {
                items.push({
                    id: p.id,
                    productId: p.id,
                    title: p.title,
                    variantLabel: '-',
                    sku: p.sku || '',
                    stock: p.stock_quantity ?? 0,
                    threshold: p.low_stock_threshold || 10,
                    costPrice: p.cost_price_zmw,
                    isTracked: p.track_inventory ?? true
                })
            }
        })
        setInventoryItems(items)
    }

    const handleAdjust = async () => {
        if (!selectedItem) return
        setAdjustLoading(true)
        try {
            await productService.adjustStock(
                selectedItem.productId,
                selectedItem.variantId || null,
                adjustAmount,
                adjustReason,
                adjustNote
            )
            toast.success('Stock updated')
            setAdjustOpen(false)
            setAdjustAmount(0)
            setAdjustNote('')
            loadData() // Refresh
        } catch (error) {
            console.error(error)
            toast.error('Failed to adjust stock')
        } finally {
            setAdjustLoading(false)
        }
    }

    const filteredItems = inventoryItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
         return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        )
    }

  return (
    <div className="p-8 space-y-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Track stock levels and view history</p>
        </div>

        <Tabs defaultValue="stock">
            <TabsList>
                <TabsTrigger value="stock" className="gap-2">
                    <Package className="h-4 w-4" /> Stock Levels
                </TabsTrigger>
                <TabsTrigger value="logs" className="gap-2">
                    <History className="h-4 w-4" /> History Logs
                </TabsTrigger>
            </TabsList>

            <TabsContent value="stock" className="space-y-4 mt-4">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Current Stock</CardTitle>
                             <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input 
                                    placeholder="Search products..." 
                                    className="pl-8" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Variant</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.variantLabel}</TableCell>
                                        <TableCell>{item.sku || '-'}</TableCell>
                                        <TableCell>
                                            <span className={item.stock <= item.threshold ? 'text-red-600 font-bold' : ''}>
                                                {item.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {item.stock <= 0 ? (
                                                <Badge variant="destructive">Out of Stock</Badge>
                                            ) : item.stock <= item.threshold ? (
                                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                                                    Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedItem(item)
                                                    setAdjustOpen(true)
                                                }}
                                            >
                                                Adjust
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredItems.length === 0 && (
                                     <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No products found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Inventory Logs</CardTitle>
                        <CardDescription>Audit trail of all stock movements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Change</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>User</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="font-medium">{log.product?.title}</span>
                                                {log.variant && (
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({log.variant.size} {log.variant.color})
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={log.change_amount > 0 ? 'text-green-600' : 'text-red-600'}>
                                                {log.change_amount > 0 ? '+' : ''}{log.change_amount}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-1">
                                                (Total: {log.final_stock})
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{log.reason}</Badge>
                                            {log.note && <div className="text-xs text-gray-500 mt-1">{log.note}</div>}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {/* We don't have user name yet due to query limits, showing 'Admin' or ID */}
                                            Admin
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {/* Adjustment Dialog */}
        <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adjust Stock</DialogTitle>
                    <DialogDescription>
                        {selectedItem?.title} {selectedItem?.variantLabel !== '-' && `(${selectedItem?.variantLabel})`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Current</Label>
                        <div className="col-span-3 font-medium">{selectedItem?.stock}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Change By</Label>
                        <Input 
                            id="amount" 
                            type="number" 
                            value={adjustAmount}
                            onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                            className="col-span-3"
                            placeholder="+10 or -5"
                        />
                        <div className="col-start-2 col-span-3 text-xs text-gray-500">
                            Use positive numbers to add stock, negative to remove.
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">Reason</Label>
                        <Select value={adjustReason} onValueChange={setAdjustReason}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="restock">Restock</SelectItem>
                                <SelectItem value="correction">Correction</SelectItem>
                                <SelectItem value="return">Return</SelectItem>
                                <SelectItem value="shrinkage">Loss/Damage</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="note" className="text-right">Note</Label>
                        <Textarea 
                            id="note" 
                            value={adjustNote} 
                            onChange={(e) => setAdjustNote(e.target.value)}
                            className="col-span-3" 
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setAdjustOpen(false)}>Cancel</Button>
                    <Button onClick={handleAdjust} disabled={adjustLoading || adjustAmount === 0}>
                        {adjustLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Adjustment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}
