import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { FirebaseFirestore } from '@/lib/firebase/firestore';
import { createUser } from '@/lib/firebase/admin-utils';
import type { AdminProfile } from '@/types/admin';
import { USER_ROLES, type UserRole, ZAMBIAN_DISTRICTS } from '@/lib/constants';

export default function TeamManagement() {
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: USER_ROLES.REGIONAL_ADMIN as UserRole,
    assignedRegions: [] as string[],
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await FirebaseFirestore.getCollection('admins') as unknown as AdminProfile[];
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role,
        formData.assignedRegions
      );

      if (result.success) {
        toast.success('User created successfully');
        setIsAddDialogOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: USER_ROLES.REGIONAL_ADMIN,
          assignedRegions: [],
        });
        fetchUsers();
      } else {
        toast.error(`Failed to create user: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRegion = (region: string) => {
    setFormData(prev => {
      const current = prev.assignedRegions;
      if (current.includes(region)) {
        return { ...prev, assignedRegions: current.filter(r => r !== region) };
      } else {
        return { ...prev, assignedRegions: [...current, region] };
      }
    });
  };

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN: return 'bg-red-100 text-red-800 border-red-200';
      case USER_ROLES.PRESIDENT: return 'bg-purple-100 text-purple-800 border-purple-200';
      case USER_ROLES.VICE_PRESIDENT: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case USER_ROLES.REGIONAL_ADMIN: return 'bg-blue-100 text-blue-800 border-blue-200';
      case USER_ROLES.FINANCE: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage administrators and their roles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Create a new administrator account with specific roles and permissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john.doe@zute.org"
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(val) => setFormData({...formData, role: val as UserRole})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.values(USER_ROLES).filter(r => r !== 'teacher').map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.role === USER_ROLES.REGIONAL_ADMIN || formData.role === USER_ROLES.OPERATIONS) && (
                <div className="space-y-2">
                  <Label>Assigned Regions (Districts)</Label>
                  <ScrollArea className="h-48 border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {ZAMBIAN_DISTRICTS.map((district) => (
                        <div key={district} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`district-${district}`} 
                            checked={formData.assignedRegions.includes(district)}
                            onCheckedChange={() => toggleRegion(district)}
                          />
                          <Label htmlFor={`district-${district}`} className="text-sm font-normal cursor-pointer">
                            {district}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <p className="text-xs text-gray-500">
                    Selected: {formData.assignedRegions.length} districts
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateUser} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Regions</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-blue" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No team members found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.assignedRegions && user.assignedRegions.length > 0 ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {user.assignedRegions.length > 2 
                            ? `${user.assignedRegions.slice(0, 2).join(', ')} +${user.assignedRegions.length - 2} more`
                            : user.assignedRegions.join(', ')
                          }
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

