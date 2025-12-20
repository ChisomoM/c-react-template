import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FirebaseFirestore } from '@/lib/firebase/firestore';
import { type JoinZuteFormData } from '@/types/join-zute';
import { FileText, Search, MoreVertical, Eye, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

interface ApplicationWithId extends JoinZuteFormData {
  id: string;
}

export default function JoinApplications() {
  const [applications, setApplications] = useState<ApplicationWithId[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<ApplicationWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await FirebaseFirestore.getCollection('join_requests') as ApplicationWithId[];
      
      // Sort by creation date (newest first)
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setApplications(sortedData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterApplications = useCallback(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.nrc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.school.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    filterApplications();
  }, [filterApplications]);

  const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      if (status === 'approved') {
        const app = applications.find(a => a.id === id);
        if (app) {
          // 1. Generate Referral Code
          const myReferralCode = generateReferralCode();

          // 2. Create User Record
          const userData = {
            ...app,
            myReferralCode,
            role: 'teacher',
            isActive: true,
            status: 'active',
            createdAt: new Date(),
          };
          
          // Store in 'users' collection
          const userId = await FirebaseFirestore.addDocument('users', userData);

          // 3. Handle Referral
          if (app.referralCode) {
            const referrers = await FirebaseFirestore.getCollection('users', [
              FirebaseFirestore.where('myReferralCode', '==', app.referralCode)
            ]);

            if (referrers.length > 0) {
              const referrer = referrers[0] as { id: string; fullName?: string };
              
              const referralData = {
                referrerId: referrer.id,
                referrerName: referrer.fullName || 'Unknown',
                refereeId: userId,
                refereeName: app.fullName,
                status: 'pending',
                amount: 50, // Default amount
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              await FirebaseFirestore.addDocument('referrals', referralData);
            }
          }
        }
      }

      await FirebaseFirestore.updateDocument('join_requests', id, { status });
      setApplications(prev =>
        prev.map(app => (app.id === id ? { ...app, status } : app))
      );
      toast.success(`Application ${status} successfully`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return 'N/A';
    try {
      const date = (timestamp as { toDate?: () => Date }).toDate ? (timestamp as { toDate: () => Date }).toDate() : new Date(timestamp as string | number | Date);
      return dayjs(date).format('MMM DD, YYYY');
    } catch {
      return 'N/A';
    }
  };

  const viewApplication = (application: ApplicationWithId) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  // Calculate stats
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Join Applications</h1>
          <p className="text-gray-600 mt-1">Manage membership applications</p>
        </div>
        <Button onClick={fetchApplications} variant="outline">
          <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
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
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, NRC, or school..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle>Applications List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FileText className="h-12 w-12 mb-4" />
              <p>No applications found</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-900">
                <TableRow className="border-b border-gray-700">
                  <TableHead className="text-white font-semibold py-3 px-4">Full Name</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">NRC</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">School</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">District</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Date Applied</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4">Status</TableHead>
                  <TableHead className="text-white font-semibold py-3 px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application, index) => (
                  <TableRow
                    key={application.id}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <TableCell className="font-medium">{application.fullName}</TableCell>
                    <TableCell>{application.nrc}</TableCell>
                    <TableCell>{application.school}</TableCell>
                    <TableCell>{application.district}</TableCell>
                    <TableCell>{formatDate(application.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          <DropdownMenuItem onClick={() => viewApplication(application)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {application.status === 'pending' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => updateApplicationStatus(application.id, 'approved')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Full details of the membership application
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Status and Date */}
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedApplication.status)}
                <span className="text-sm text-gray-500">
                  Applied: {formatDate(selectedApplication.createdAt)}
                </span>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Full Name</p>
                    <p className="font-medium">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">NRC</p>
                    <p className="font-medium">{selectedApplication.nrc}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact Number</p>
                    <p className="font-medium">{selectedApplication.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">TS/MAN No</p>
                    <p className="font-medium">{selectedApplication.tsManNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employment No</p>
                    <p className="font-medium">{selectedApplication.employmentNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Salary Scale</p>
                    <p className="font-medium">{selectedApplication.salaryScale}</p>
                  </div>
                </div>
              </div>

              {/* School Information */}
              <div>
                <h3 className="font-semibold text-lg mb-3">School Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">School</p>
                    <p className="font-medium">{selectedApplication.school}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">P.O Box</p>
                    <p className="font-medium">{selectedApplication.poBox}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">District</p>
                    <p className="font-medium">{selectedApplication.district}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Province</p>
                    <p className="font-medium">{selectedApplication.province}</p>
                  </div>
                </div>
              </div>

              {/* Union Details */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Union Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Previous Union</p>
                    <p className="font-medium">{selectedApplication.previousUnion || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pay Point</p>
                    <p className="font-medium">{selectedApplication.payPoint}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pay Point District</p>
                    <p className="font-medium">{selectedApplication.payPointDistrict}</p>
                  </div>
                  {selectedApplication.referralCode && (
                    <div>
                      <p className="text-gray-600">Referral Code Used</p>
                      <p className="font-medium text-primary-blue">{selectedApplication.referralCode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedApplication.nrcFront && (
                    <div>
                      <p className="text-gray-600 text-sm mb-2">NRC Front</p>
                      <a
                        href={selectedApplication.nrcFront}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {selectedApplication.nrcBack && (
                    <div>
                      <p className="text-gray-600 text-sm mb-2">NRC Back</p>
                      <a
                        href={selectedApplication.nrcBack}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {selectedApplication.applicantSignature && (
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Signature</p>
                      <a
                        href={selectedApplication.applicantSignature}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Signature
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'approved');
                      setIsDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'rejected');
                      setIsDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
