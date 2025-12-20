import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2, GraduationCap, MapPin, Filter } from 'lucide-react';
import { FirebaseFirestore } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/context/useAuth';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';
import { toast } from 'sonner';
import dayjs from 'dayjs';

interface Teacher {
  id: string;
  fullName: string;
  email?: string;
  district?: string;
  school?: string;
  status: string;
  myReferralCode?: string;
  createdAt: unknown;
}

export default function TeacherManagement() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const canViewAll = hasPermission(user, PERMISSIONS.VIEW_ALL_MEMBERS);
  const canViewRegion = hasPermission(user, PERMISSIONS.VIEW_REGION_MEMBERS);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await FirebaseFirestore.getCollection('users') as Teacher[];

      // Filter based on permissions
      let filtered = data;
      if (!canViewAll && canViewRegion && user?.assignedRegions) {
        // Regional Admin - only see their assigned districts
        filtered = data.filter(teacher => 
          teacher.district && user.assignedRegions?.includes(teacher.district)
        );
      }

      // Sort by creation date (newest first)
      const sorted = filtered.sort((a, b) => {
        let dateA: Date;
        let dateB: Date;
        
        if (typeof a.createdAt === 'object' && a.createdAt !== null && 'toDate' in a.createdAt) {
          dateA = (a.createdAt as { toDate: () => Date }).toDate();
        } else {
          dateA = new Date(a.createdAt as string | number | Date);
        }
        
        if (typeof b.createdAt === 'object' && b.createdAt !== null && 'toDate' in b.createdAt) {
          dateB = (b.createdAt as { toDate: () => Date }).toDate();
        } else {
          dateB = new Date(b.createdAt as string | number | Date);
        }
        
        return dateB.getTime() - dateA.getTime();
      });

      setTeachers(sorted);
      setFilteredTeachers(sorted);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [user, canViewAll, canViewRegion]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    let filtered = teachers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(teacher =>
        teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.school?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // District filter
    if (districtFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.district === districtFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === statusFilter);
    }

    setFilteredTeachers(filtered);
  }, [searchQuery, districtFilter, statusFilter, teachers]);

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return 'N/A';
    try {
      let date: Date;
      if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
        date = (timestamp as { toDate: () => Date }).toDate();
      } else {
        date = new Date(timestamp as string | number | Date);
      }
      return dayjs(date).format('MMM DD, YYYY');
    } catch {
      return 'N/A';
    }
  };

  const uniqueDistricts = Array.from(new Set(teachers.map(t => t.district).filter(Boolean)));

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => t.status === 'active').length,
    pending: teachers.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">
            {canViewAll 
              ? 'All ZUTE members' 
              : `Viewing: ${user?.assignedRegions?.join(', ') || 'No regions assigned'}`
            }
          </p>
        </div>
        <Button onClick={fetchTeachers} variant="outline">
          <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Members</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">{stats.active}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or school..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Districts</SelectItem>
                {uniqueDistricts.map((district) => (
                  <SelectItem key={district} value={district as string}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <GraduationCap className="h-12 w-12 mb-4" />
              <p>No members found</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow className="border-b border-gray-700">
                  <TableHead className="text-white font-semibold py-3 px-4">Name</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">School</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">District</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Referral Code</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Joined</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher, index) => (
                  <TableRow
                    key={teacher.id}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <TableCell className="font-medium">{teacher.fullName}</TableCell>
                    <TableCell>{teacher.school || 'N/A'}</TableCell>
                    <TableCell>
                      {teacher.district ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          {teacher.district}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {teacher.myReferralCode || 'N/A'}
                      </code>
                    </TableCell>
                    <TableCell>{formatDate(teacher.createdAt)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={teacher.status === 'active' ? 'default' : 'secondary'}
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
