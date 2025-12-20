import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FirebaseFirestore } from '@/lib/firebase/firestore';
import { Loader2, MoreVertical, CheckCircle, DollarSign, Search } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { Input } from '@/components/ui/input';

interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeId: string;
  refereeName: string;
  status: 'pending' | 'eligible' | 'requested' | 'paid';
  amount: number;
  createdAt: { toDate?: () => Date } | string | number | Date;
}

export default function Referrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'eligible' | 'requested' | 'paid'>('all');

  const fetchReferrals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await FirebaseFirestore.getCollection('referrals') as Referral[];
      
      // Sort by date
      const sortedData = data.sort((a, b) => {
        const dateA = typeof a.createdAt === 'object' && 'toDate' in a.createdAt && a.createdAt.toDate 
          ? a.createdAt.toDate() 
          : new Date(a.createdAt as string | number | Date);
        const dateB = typeof b.createdAt === 'object' && 'toDate' in b.createdAt && b.createdAt.toDate 
          ? b.createdAt.toDate() 
          : new Date(b.createdAt as string | number | Date);
        return dateB.getTime() - dateA.getTime();
      });
      
      setReferrals(sortedData);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterReferrals = useCallback(() => {
    let filtered = referrals;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.referrerName.toLowerCase().includes(query) ||
        r.refereeName.toLowerCase().includes(query)
      );
    }

    setFilteredReferrals(filtered);
  }, [referrals, searchQuery, statusFilter]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  useEffect(() => {
    filterReferrals();
  }, [filterReferrals]);

  const updateStatus = async (id: string, status: 'eligible' | 'paid') => {
    try {
      await FirebaseFirestore.updateDocument('referrals', id, { status });
      setReferrals(prev =>
        prev.map(r => (r.id === id ? { ...r, status } : r))
      );
      toast.success(`Referral marked as ${status}`);
    } catch (error) {
      console.error('Error updating referral:', error);
      toast.error('Failed to update referral');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'eligible':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Eligible</Badge>;
      case 'requested':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Requested</Badge>;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referral Management</h1>
          <p className="text-gray-600 mt-1">Manage affiliate payouts and status</p>
        </div>
        <Button onClick={fetchReferrals} variant="outline">
          <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by referrer or referee..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'eligible', 'requested', 'paid'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Referrals List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : filteredReferrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No referrals found matching your filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Referee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.referrerName}</TableCell>
                    <TableCell>{referral.refereeName}</TableCell>
                    <TableCell>{formatDate(referral.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>K{referral.amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white">
                          {referral.status === 'pending' && (
                            <DropdownMenuItem onClick={() => updateStatus(referral.id, 'eligible')}>
                              <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                              Confirm Deduction (Eligible)
                            </DropdownMenuItem>
                          )}
                          {referral.status === 'requested' && (
                            <DropdownMenuItem onClick={() => updateStatus(referral.id, 'paid')}>
                              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {referral.status === 'eligible' && (
                            <DropdownMenuItem onClick={() => updateStatus(referral.id, 'paid')}>
                              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                              Mark as Paid (Manual)
                            </DropdownMenuItem>
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
    </div>
  );
}
