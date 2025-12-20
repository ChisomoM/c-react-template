import { type UserRole, USER_ROLES } from './constants';
import { type AuthUser } from '@/types/auth';

export const PERMISSIONS = {
  // Member Management
  VIEW_ALL_MEMBERS: 'view_all_members',
  VIEW_REGION_MEMBERS: 'view_region_members',
  APPROVE_MEMBERS_BATCH: 'approve_members_batch', // > 10
  APPROVE_MEMBERS_SINGLE: 'approve_members_single', // 1-10
  DELETE_MEMBER: 'delete_member',
  EDIT_MEMBER: 'edit_member',
  
  // Financial
  VIEW_ALL_FINANCIALS: 'view_all_financials',
  PROCESS_PAYMENT_SMALL: 'process_payment_small', // < K3000
  PROCESS_PAYMENT_LARGE: 'process_payment_large', // > K3000
  APPROVE_PAYOUTS: 'approve_payouts',
  
  // System
  MANAGE_USERS: 'manage_users',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  SYSTEM_SETTINGS: 'system_settings',
  
  // Communications
  SEND_SMS_ALL: 'send_sms_all',
  SEND_SMS_REGION: 'send_sms_region',
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [USER_ROLES.SUPER_ADMIN]: [
    PERMISSIONS.VIEW_ALL_MEMBERS,
    PERMISSIONS.APPROVE_MEMBERS_SINGLE,
    PERMISSIONS.PROCESS_PAYMENT_SMALL,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.SEND_SMS_ALL,
    PERMISSIONS.VIEW_ALL_FINANCIALS, // Read only
  ],
  [USER_ROLES.PRESIDENT]: [
    PERMISSIONS.VIEW_ALL_MEMBERS,
    PERMISSIONS.APPROVE_MEMBERS_SINGLE,
    PERMISSIONS.APPROVE_MEMBERS_BATCH,
    PERMISSIONS.PROCESS_PAYMENT_SMALL,
    PERMISSIONS.PROCESS_PAYMENT_LARGE,
    PERMISSIONS.APPROVE_PAYOUTS,
    PERMISSIONS.VIEW_ALL_FINANCIALS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.SEND_SMS_ALL,
    PERMISSIONS.EDIT_MEMBER,
  ],
  [USER_ROLES.VICE_PRESIDENT]: [
    PERMISSIONS.VIEW_ALL_MEMBERS,
    PERMISSIONS.APPROVE_MEMBERS_SINGLE,
    PERMISSIONS.APPROVE_MEMBERS_BATCH,
    PERMISSIONS.PROCESS_PAYMENT_SMALL,
    PERMISSIONS.PROCESS_PAYMENT_LARGE,
    PERMISSIONS.APPROVE_PAYOUTS,
    PERMISSIONS.VIEW_ALL_FINANCIALS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.SEND_SMS_ALL,
    PERMISSIONS.EDIT_MEMBER,
  ],
  [USER_ROLES.REGIONAL_ADMIN]: [
    PERMISSIONS.VIEW_REGION_MEMBERS,
    PERMISSIONS.APPROVE_MEMBERS_SINGLE,
    PERMISSIONS.EDIT_MEMBER, // Own region only
    PERMISSIONS.SEND_SMS_REGION,
  ],
  [USER_ROLES.OPERATIONS]: [
    PERMISSIONS.VIEW_REGION_MEMBERS,
    PERMISSIONS.EDIT_MEMBER,
    PERMISSIONS.SEND_SMS_REGION,
  ],
  [USER_ROLES.FINANCE]: [
    PERMISSIONS.VIEW_ALL_FINANCIALS,
    PERMISSIONS.PROCESS_PAYMENT_SMALL,
  ],
  [USER_ROLES.SUPPORT]: [
    PERMISSIONS.VIEW_ALL_MEMBERS, // Read only usually
  ],
  [USER_ROLES.TEACHER]: [],
};

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user || !user.role) return false;
  
  // Check if user has specific permission overrides
  if (user.permissions?.includes(permission)) return true;
  
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole];
  return rolePermissions?.includes(permission) || false;
}

export function canViewRegion(user: AuthUser | null, region: string): boolean {
  if (!user) return false;
  if (hasPermission(user, PERMISSIONS.VIEW_ALL_MEMBERS)) return true;
  
  return user.assignedRegions?.includes(region) || false;
}
