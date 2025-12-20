import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Users, Search, Loader2, UserPlus, UserMinus, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { FirebaseFirestore } from '@/lib/firebase/firestore';
import { ZAMBIAN_DISTRICTS, type District, USER_ROLES } from '@/lib/constants';
import type { AdminProfile } from '@/types/admin';
import { useAuth } from '@/lib/context/useAuth';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';
import { AuditLogger } from '@/lib/audit';

interface RegionStats {
  district: District;
  totalMembers: number;
  activeMembers: number;
  pendingApplications: number;
  assignedAdmins: AdminProfile[];
}

export default function RegionManagement() {
  const { user } = useAuth();
  const [regions, setRegions] = useState<RegionStats[]>([]);
  const [regionalAdmins, setRegionalAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');
  const [selectedRegions, setSelectedRegions] = useState<District[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const canManageRegions = hasPermission(user, PERMISSIONS.MANAGE_USERS);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all members
      const members = await FirebaseFirestore.getCollection('users') as Array<{
        id: string;
        district?: string;
        status?: string;
        [key: string]: unknown;
      }>;
      
      // Fetch all join applications
      const applications = await FirebaseFirestore.getCollection('join_requests') as Array<{
        district?: string;
        status?: string;
        [key: string]: unknown;
      }>;
      
      // Fetch regional admins
      const admins = await FirebaseFirestore.getCollection('admins') as AdminProfile[];
      const regionals = admins.filter(admin => 
        admin.role === USER_ROLES.REGIONAL_ADMIN || 
        admin.role === USER_ROLES.OPERATIONS
      );
      setRegionalAdmins(regionals);
      
      // Calculate stats for each district
      const stats: RegionStats[] = ZAMBIAN_DISTRICTS.map(district => {
        const districtMembers = members.filter(m => m.district === district);
        const districtApps = applications.filter(a => a.district === district && a.status === 'pending');
        const assignedAdmins = regionals.filter(admin => 
          admin.assignedRegions?.includes(district)
        );
        
        return {
          district,
          totalMembers: districtMembers.length,
          activeMembers: districtMembers.filter(m => m.status === 'active').length,
          pendingApplications: districtApps.length,
          assignedAdmins,
        };
      });
      
      setRegions(stats);
    } catch (error) {
      console.error('Error fetching region data:', error);
      toast.error('Failed to load region data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRegions = async () => {
    if (!selectedAdminId || selectedRegions.length === 0) {
      toast.error('Please select an admin and at least one region');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Get current admin data
      const admin = regionalAdmins.find(a => a.id === selectedAdminId);
      if (!admin) {
        toast.error('Admin not found');
        return;
      }

      // Merge with existing regions (avoid duplicates)
      const existingRegions = admin.assignedRegions || [];
      const newRegions = Array.from(new Set([...existingRegions, ...selectedRegions]));

      // Update admin document
      await FirebaseFirestore.updateDocument('admins', selectedAdminId, {
        assignedRegions: newRegions,
        updatedAt: new Date(),
      });

      // Log audit
      if (user) {
        await AuditLogger.log(
          'regions_assigned',
          user,
          {
            adminId: selectedAdminId,
            adminName: `${admin.firstName} ${admin.lastName}`,
            regionsAdded: selectedRegions,
            totalRegions: newRegions.length,
          },
          selectedAdminId,
          'admin'
        );
      }

      toast.success('Regions assigned successfully');
      setIsAssignDialogOpen(false);
      setSelectedAdminId('');
      setSelectedRegions([]);
      fetchData();
    } catch (error) {
      console.error('Error assigning regions:', error);
      toast.error('Failed to assign regions');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnassignRegion = async (adminId: string, district: District) => {
    try {
      const admin = regionalAdmins.find(a => a.id === adminId);
      if (!admin) return;

      const updatedRegions = (admin.assignedRegions || []).filter(r => r !== district);

      await FirebaseFirestore.updateDocument('admins', adminId, {
        assignedRegions: updatedRegions,
        updatedAt: new Date(),
      });

      if (user) {
        await AuditLogger.log(
          'region_unassigned',
          user,
          {
            adminId,
            adminName: `${admin.firstName} ${admin.lastName}`,
            regionRemoved: district,
          },
          adminId,
          'admin'
        );
      }

      toast.success(`${district} unassigned from ${admin.firstName} ${admin.lastName}`);
      fetchData();
    } catch (error) {
      console.error('Error unassigning region:', error);
      toast.error('Failed to unassign region');
    }
  };

  const toggleRegion = (district: District) => {
    setSelectedRegions(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const filteredRegions = regions.filter(region =>
    region.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMembers = regions.reduce((sum, r) => sum + r.totalMembers, 0);
  const totalActive = regions.reduce((sum, r) => sum + r.activeMembers, 0);
  const totalPending = regions.reduce((sum, r) => sum + r.pendingApplications, 0);
  const totalAssigned = regions.filter(r => r.assignedAdmins.length > 0).length;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Region Management</h1>
          <p className="text-gray-600 mt-1">Manage districts and regional admin assignments</p>
        </div>
        {canManageRegions && (
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Regions
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Districts</p>
                <p className="text-2xl font-bold text-blue-900">{ZAMBIAN_DISTRICTS.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Members</p>
                <p className="text-2xl font-bold text-green-900">{totalMembers}</p>
                <p className="text-xs text-green-600 mt-1">{totalActive} active</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending Apps</p>
                <p className="text-2xl font-bold text-yellow-900">{totalPending}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Assigned Districts</p>
                <p className="text-2xl font-bold text-purple-900">{totalAssigned}</p>
                <p className="text-xs text-purple-600 mt-1">of {ZAMBIAN_DISTRICTS.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search districts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Regions Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow className="border-b border-gray-700">
                  <TableHead className="text-white font-semibold py-3 px-4">District</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Total Members</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Active</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Pending Apps</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Assigned Admins</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegions.map((region, index) => (
                  <TableRow
                    key={region.district}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {region.district}
                      </div>
                    </TableCell>
                    <TableCell>{region.totalMembers}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {region.activeMembers}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {region.pendingApplications > 0 ? (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          {region.pendingApplications}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {region.assignedAdmins.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {region.assignedAdmins.map(admin => (
                            <div key={admin.id} className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {admin.firstName} {admin.lastName}
                              </Badge>
                              {canManageRegions && (
                                <button
                                  onClick={() => handleUnassignRegion(admin.id, region.district)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Unassign"
                                >
                                  <UserMinus className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {canManageRegions && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          Assign Admin
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assign Regions Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-white">
          <DialogHeader>
            <DialogTitle>Assign Regions to Admin</DialogTitle>
            <DialogDescription>
              Select a regional admin and the districts they will manage
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Regional Admin</Label>
              <Select value={selectedAdminId} onValueChange={setSelectedAdminId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select admin..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {regionalAdmins.map(admin => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.firstName} {admin.lastName} ({admin.email})
                      {admin.assignedRegions && admin.assignedRegions.length > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          - {admin.assignedRegions.length} regions
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Districts</Label>
              <ScrollArea className="h-64 border rounded-md p-4">
                <div className="grid grid-cols-2 gap-3">
                  {ZAMBIAN_DISTRICTS.map(district => (
                    <div key={district} className="flex items-center space-x-2">
                      <Checkbox
                        id={district}
                        checked={selectedRegions.includes(district)}
                        onCheckedChange={() => toggleRegion(district)}
                      />
                      <label
                        htmlFor={district}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {district}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-sm text-gray-500 mt-2">
                {selectedRegions.length} district{selectedRegions.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAssignDialogOpen(false);
              setSelectedAdminId('');
              setSelectedRegions([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAssignRegions} disabled={isProcessing}>
              {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Assign Regions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
