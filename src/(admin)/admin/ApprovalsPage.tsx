import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Clock, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { FirebaseFirestore } from '@/lib/firebase/firestore';
import { ApprovalSystem } from '@/lib/approvals';
import type { ApprovalRequest } from '@/types/admin';
import { useAuth } from '@/lib/context/useAuth';
import { USER_ROLES } from '@/lib/constants';
import dayjs from 'dayjs';

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const allRequests = await FirebaseFirestore.getCollection('approval_requests') as ApprovalRequest[];
      
      // Filter based on user role
      let filtered = allRequests;
      
      if (user?.role === USER_ROLES.PRESIDENT) {
        // President sees pending and awaiting_president
        filtered = allRequests.filter(req => 
          req.status === 'pending' || 
          req.status === 'awaiting_president' ||
          (req.approverRole === USER_ROLES.PRESIDENT && req.status !== 'approved' && req.status !== 'rejected')
        );
      } else if (user?.role === USER_ROLES.VICE_PRESIDENT) {
        // VP sees pending and awaiting_vp
        filtered = allRequests.filter(req => 
          req.status === 'pending' || 
          req.status === 'awaiting_vp' ||
          (req.approverRole === USER_ROLES.VICE_PRESIDENT && req.status !== 'approved' && req.status !== 'rejected')
        );
      } else if (user?.role === USER_ROLES.SUPER_ADMIN) {
        // Super Admin sees their own requests
        filtered = allRequests.filter(req => req.requesterId === String(user.id));
      }

      // Sort by creation date (newest first)
      const sorted = filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      setRequests(sorted);
    } catch (error) {
      console.error('Error fetching approval requests:', error);
      toast.error('Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleApprove = async () => {
    if (!selectedRequest || !user) return;

    try {
      setIsProcessing(true);
      const newStatus = await ApprovalSystem.approveRequest(
        selectedRequest.id,
        user,
        comment
      );

      if (newStatus === 'approved') {
        toast.success('Request approved successfully');
        // Execute the approved action here (e.g., approve members, process payment)
        // This would be handled by a separate function based on request.type
      } else {
        toast.success(`Request approved. Awaiting ${newStatus === 'awaiting_vp' ? 'VP' : 'President'} approval.`);
      }

      setIsDialogOpen(false);
      setComment('');
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !user || !comment) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      setIsProcessing(true);
      await ApprovalSystem.rejectRequest(selectedRequest.id, user, comment);
      toast.success('Request rejected');
      setIsDialogOpen(false);
      setComment('');
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'awaiting_vp':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Awaiting VP</Badge>;
      case 'awaiting_president':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Awaiting President</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'member_batch': return 'Member Batch Approval';
      case 'payment': return 'Payment Authorization';
      case 'delete_member': return 'Delete Member Record';
      case 'system_change': return 'System Configuration';
      case 'role_grant': return 'Role Grant';
      default: return type;
    }
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return 'N/A';
    try {
      let date: Date;
      if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
        date = (timestamp as { toDate: () => Date }).toDate();
      } else {
        date = new Date(timestamp as string | number | Date);
      }
      return dayjs(date).format('MMM DD, YYYY HH:mm');
    } catch {
      return 'N/A';
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    awaitingAction: requests.filter(r => 
      r.status === 'awaiting_vp' || r.status === 'awaiting_president'
    ).length,
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Queue</h1>
          <p className="text-gray-600 mt-1">Review and approve pending requests</p>
        </div>
        <Button onClick={fetchRequests} variant="outline">
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
                <p className="text-sm font-medium text-blue-600">Total Requests</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Awaiting Co-Approval</p>
                <p className="text-2xl font-bold text-purple-900">{stats.awaitingAction}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <CheckCircle className="h-12 w-12 mb-4" />
              <p>No pending approval requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {getTypeLabel(request.type)}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">From:</span> {request.requesterName} ({request.requesterRole})
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted: {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Review Approval Request</DialogTitle>
            <DialogDescription>
              Request ID: {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <Label>Request Type</Label>
                <p className="text-sm font-medium">{getTypeLabel(selectedRequest.type)}</p>
              </div>

              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              <div>
                <Label>Requested By</Label>
                <p className="text-sm">{selectedRequest.requesterName} ({selectedRequest.requesterRole})</p>
              </div>

              <div>
                <Label>Reason</Label>
                <p className="text-sm">{selectedRequest.reason}</p>
              </div>

              <div>
                <Label>Request Data</Label>
                <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(selectedRequest.data, null, 2)}
                </pre>
              </div>

              <div>
                <Label>Approval History</Label>
                <div className="space-y-2 mt-2">
                  {selectedRequest.history.map((item, index) => (
                    <div key={index} className="text-sm border-l-2 border-gray-300 pl-3">
                      <p className="font-medium">
                        {item.actorName} ({item.actorRole}) - {item.action}
                      </p>
                      {item.comment && <p className="text-gray-600">{item.comment}</p>}
                      <p className="text-xs text-gray-500">{formatDate(item.timestamp)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRequest.status !== 'approved' && selectedRequest.status !== 'rejected' && (
                <div>
                  <Label>Your Comment (Optional for Approval, Required for Rejection)</Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comments here..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            {selectedRequest?.status !== 'approved' && selectedRequest?.status !== 'rejected' && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleApprove} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
