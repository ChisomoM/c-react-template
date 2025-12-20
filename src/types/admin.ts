import { type UserRole, type District } from '@/lib/constants';

export interface AdminProfile {
  id: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  permissions: string[];
  assignedRegions?: District[];
}

export interface Referral {
  id: string;
  referrerId: string; // UID of the person who referred
  referrerName: string;
  refereeId: string; // UID of the new teacher (once created)
  refereeName: string;
  status: 'pending' | 'eligible' | 'requested' | 'paid';
  amount: number;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface ApprovalRequest {
  id: string;
  type: 'member_batch' | 'payment' | 'delete_member' | 'system_change' | 'role_grant';
  requesterId: string;
  requesterName: string;
  requesterRole: UserRole;
  approverRole: UserRole | 'dual'; // 'dual' means needs both Pres and VP
  status: 'pending' | 'approved' | 'rejected' | 'partially_approved' | 'awaiting_vp' | 'awaiting_president';
  data: any; // The data being approved (e.g., list of member IDs, payment details)
  reason: string;
  createdAt: any;
  updatedAt: any;
  history: ApprovalHistoryItem[];
}

export interface ApprovalHistoryItem {
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'created' | 'approved' | 'rejected' | 'commented';
  comment?: string;
  timestamp: any;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string; // e.g., 'APPROVE_MEMBER', 'DELETE_USER', 'LOGIN'
  targetId?: string; // ID of the object being acted upon
  targetType?: string; // 'user', 'payment', 'system'
  details: any; // Old value, new value, etc.
  ipAddress?: string;
  userAgent?: string;
  timestamp: any;
}

