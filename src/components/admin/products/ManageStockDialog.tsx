import { useState, useEffect } from "react"
import { SupabaseBranchService } from "@/services/SupabaseBranchService"
import { Branch, BranchInventory } from "@/services/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"

interface ManageStockDialogProps {
  productId?: string
  variantId?: string
  title: string
  disabled?: boolean
  onUpdate?: () => void
}

export function ManageStockDialog({ productId, variantId, title, disabled, onUpdate }: ManageStockDialogProps) {
  const [open, setOpen] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stockChanges, setStockChanges] = useState<Record<string, number>>({}) // branchId -> quantity

  const branchService = new SupabaseBranchService()

  useEffect(() => {
    if (open && productId) {
      loadData()
    }
  }, [open, productId, variantId])

  const loadData = async () => {
    setLoading(true)
    try {
      if (!productId) return

      const branchesData = await branchService.getBranches()
      setBranches(branchesData)
      
      // Fetch inventory for each branch
      // Using Promise.all here is okay for small number of branches
      const invPromises = branchesData.map(b => branchService.getBranchInventory(b.id, productId))
      const invResults = await Promise.all(invPromises)
      
      // Flatten results
      const allInv = invResults.flat()
      
      // Initialize changes from existing
      const initial: Record<string, number> = {}
      branchesData.forEach(b => {
        // Find inventory matching this variant (or null variant)
        const item = allInv.find(i => 
            i.branch_id === b.id && 
            (variantId ? i.variant_id === variantId : i.variant_id === null)
        )
        initial[b.id] = item?.quantity || 0
      })
      setStockChanges(initial)

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!productId) return
    setSaving(true)
    try {
      // Save all changes
      const promises = branches.map(b => {
        const qty = stockChanges[b.id] || 0
        return branchService.updateBranchStock(b.id, productId, variantId, qty)
      })
      await Promise.all(promises)
      setOpen(false)
      if (onUpdate) onUpdate()
    } catch (e) {
      console.error(e)
      alert('Failed to save stock')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} type="button">Manage</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
             <div className="py-8 text-center text-gray-500">Loading inventory...</div>
        ) : branches.length === 0 ? (
             <div className="py-4 text-center text-red-500">
                 No branches found. Please create a branch first.
             </div>
        ) : (
            <div className="space-y-4 py-4">
                <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2">
                    {branches.map(branch => (
                        <div key={branch.id} className="flex items-center justify-between border p-3 rounded">
                            <div>
                                <div className="font-medium text-sm">{branch.name}</div>
                                <div className="text-xs text-gray-500">{branch.location || 'No location'}</div>
                            </div>
                            <div className="w-24">
                                <Input 
                                    type="number" 
                                    min="0"
                                    value={stockChanges[branch.id] ?? 0} 
                                    onChange={(e) => setStockChanges(prev => ({...prev, [branch.id]: parseInt(e.target.value) || 0}))}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                    <span className="font-medium">Total Stock:</span>
                    <span className="font-bold text-lg">
                        {Object.values(stockChanges).reduce((a, b) => a + b, 0)}
                    </span>
                </div>

                <Button className="w-full" onClick={handleSave} disabled={saving} type="button">
                    {saving ? 'Saving...' : 'Save Inventory'}
                </Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
