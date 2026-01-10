'use client'

import { useEffect, useState } from 'react'
import { SupabaseBranchService } from '@/services/SupabaseBranchService'
import { Branch, BranchStaff } from '@/services/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function BranchDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  
  const [branch, setBranch] = useState<Branch | null>(null)
  const [staff, setStaff] = useState<BranchStaff[]>([])
  const [loading, setLoading] = useState(true)
  const branchService = new SupabaseBranchService()

  useEffect(() => {
    if (id) loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const b = await branchService.getBranch(id)
      setBranch(b)
      if (b) {
        const s = await branchService.getBranchStaff(id)
        setStaff(s)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveStaff = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return
    try {
      await branchService.removeStaff(id, userId)
      loadData()
    } catch (e) {
      console.error(e)
      alert('Failed to remove staff')
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!branch) return <div className="p-6">Branch not found</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold">{branch.name}</h1>
           <p className="text-gray-500">{branch.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Staff & Admins</CardTitle>
            <AddStaffDialog branchId={branch.id} onSuccess={loadData} />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((s) => (
                   <TableRow key={s.id}>
                    <TableCell>
                      {s.user?.first_name} {s.user?.last_name}
                      <div className="text-xs text-gray-400">{s.user?.phone}</div> 
                    </TableCell>
                    <TableCell>{s.role}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {s.permissions.map(p => (
                          <span key={p} className="text-xs bg-gray-100 px-1 rounded">{p}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => handleRemoveStaff(s.user_id)}>
                         <Trash2 className="h-4 w-4 text-red-500" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {staff.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={4} className="text-center text-gray-500">No staff assigned</TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AddStaffDialog({ branchId, onSuccess }: any) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('staff')
  const [permissions, setPermissions] = useState<string[]>(['manage_inventory'])
  const [loading, setLoading] = useState(false)
  const branchService = new SupabaseBranchService()

  const availablePermissions = [
    { id: 'manage_inventory', label: 'Manage Inventory' },
    { id: 'manage_orders', label: 'Manage Orders' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'manage_staff', label: 'Manage Staff' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await branchService.assignStaff(branchId, email, role, permissions)
      onSuccess()
      setOpen(false)
      setEmail('')
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Failed to add staff')
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (id: string) => {
    setPermissions(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Assign Staff</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
             <Label>User Email</Label>
             <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@example.com" />
             <p className="text-xs text-gray-500">User must already be registered.</p>
          </div>
          
          <div className="space-y-2">
             <Label>Role Label</Label>
             <Input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Manager" />
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2">
              {availablePermissions.map(p => (
                <div key={p.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={p.id} 
                    checked={permissions.includes(p.id)}
                    onCheckedChange={() => togglePermission(p.id)}
                  />
                  <Label htmlFor={p.id} className="font-normal">{p.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Assigning...' : 'Assign Staff'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
