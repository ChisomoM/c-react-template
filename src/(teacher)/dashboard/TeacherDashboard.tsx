import { useAuth } from '@/lib/context/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, User } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-medium text-lg">{user?.firstName} {user?.lastName}</p>
                <Badge variant="outline" className="mt-1">{user?.role?.replace('_', ' ').toUpperCase()}</Badge>
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              {user?.myReferralCode && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Referral Code:</span>
                  <Badge variant="secondary">{user.myReferralCode}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
