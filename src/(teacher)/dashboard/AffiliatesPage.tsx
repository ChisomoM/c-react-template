import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { useAuth } from '@/lib/context/useAuth';
import { FirebaseFirestore } from '@/lib/firebase/firestore';
import { Copy, Loader2, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';

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

export default function AffiliatesPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    eligible: 0,
    paid: 0,
    earnings: 0,
  });

  const fetchReferrals = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await FirebaseFirestore.getCollection('referrals', [
        FirebaseFirestore.where('referrerId', '==', user.id)
      ]) as Referral[];

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

      // Calculate stats
      const newStats = {
        total: sortedData.length,
        pending: sortedData.filter(r => r.status === 'pending').length,
        eligible: sortedData.filter(r => r.status === 'eligible').length,
        paid: sortedData.filter(r => r.status === 'paid').length,
        earnings: sortedData
          .filter(r => r.status === 'paid' || r.status === 'eligible' || r.status === 'requested')
          .reduce((acc, curr) => acc + curr.amount, 0),
      };
      setStats(newStats);

    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const copyReferralCode = () => {
    if (user?.myReferralCode) {
      navigator.clipboard.writeText(user.myReferralCode);
      toast.success('Referral code copied to clipboard!');
    }
  };

  const requestPayout = async (referralId: string) => {
    try {
      await FirebaseFirestore.updateDocument('referrals', referralId, { status: 'requested' });
      setReferrals(prev =>
        prev.map(r => (r.id === referralId ? { ...r, status: 'requested' } : r))
      );
      toast.success('Payout requested successfully');
    } catch (error) {
      console.error('Error requesting payout:', error);
      toast.error('Failed to request payout');
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Affiliate Program</h1>
        <p className="text-gray-600 mt-1">Manage your referrals and earnings</p>
      </div>

      {/* Referral Code Card */}
      <Card className="bg-gradient-to-r from-primary-blue/10 to-primary-orange/10 border-primary-blue/20">
        <CardHeader>
          <CardTitle className="text-lg">Your Referral Code</CardTitle>
          <CardDescription>Share this code with other teachers to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-lg border border-gray-200 font-mono text-2xl font-bold tracking-wider text-primary-blue">
              {user?.myReferralCode || 'Generating...'}
            </div>
            <Button onClick={copyReferralCode} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Eligible for Payout</p>
                <p className="text-2xl font-bold text-green-600">{stats.eligible}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-primary-blue">K{stats.earnings}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-blue" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No referrals yet. Share your code to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referee Name</TableHead>
                  <TableHead>Date Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.refereeName}</TableCell>
                    <TableCell>{formatDate(referral.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>K{referral.amount}</TableCell>
                    <TableCell className="text-right">
                      {referral.status === 'eligible' && (
                        <Button 
                          size="sm" 
                          onClick={() => requestPayout(referral.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Request Payout
                        </Button>
                      )}
                      {referral.status === 'requested' && (
                        <span className="text-sm text-gray-500 italic">Processing...</span>
                      )}
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
