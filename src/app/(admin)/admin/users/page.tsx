'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { SupabaseUserService } from '@/services/SupabaseUserService'
import { User } from '@/services/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, Users, UserCheck, UserX } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const userService = new SupabaseUserService()

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load users'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await userService.deleteUser(deleteId)
      toast.success('User deleted successfully')
      await loadUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user'
      toast.error(message)
    } finally {
      setDeleteId(null)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: 'admin' | 'customer') => {
    try {
      setUpdatingRole(userId)
      await userService.updateUser(userId, { role: newRole })
      toast.success('User role updated successfully')
      await loadUsers()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user role'
      toast.error(message)
    } finally {
      setUpdatingRole(null)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

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
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <Link href="/admin/users/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Users Table */}
      <Card className="p-6">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
            <p className="text-gray-500 mb-4">Users will appear here once they register</p>
            <Link href="/admin/users/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : 'Unnamed User'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role || 'customer'}
                      onValueChange={(value: 'admin' | 'customer') =>
                        handleRoleUpdate(user.id, value)
                      }
                      disabled={updatingRole === user.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' ? (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <UserX className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={user.role === 'admin' ? 'text-green-600' : 'text-gray-600'}>
                        {user.role === 'admin' ? 'Active' : 'Customer'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
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
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and may affect order history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}