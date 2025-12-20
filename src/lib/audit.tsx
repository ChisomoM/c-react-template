import { FirebaseFirestore } from './firebase/firestore';
import type { AuditLog } from '@/types/admin';
import type { AuthUser } from '@/types/auth';
import { type UserRole } from './constants';

export const AuditLogger = {
  log: async (
    action: string,
    actor: AuthUser,
    details: any,
    targetId?: string,
    targetType?: string
  ) => {
    try {
      const logEntry: Omit<AuditLog, 'id'> = {
        actorId: String(actor.id),
        actorName: `${actor.firstName} ${actor.lastName}`,
        actorRole: actor.role as UserRole,
        action,
        details,
        targetId,
        targetType,
        timestamp: new Date(),
        // ipAddress and userAgent would ideally be captured here or passed in
      };

      await FirebaseFirestore.addDocument('audit_logs', logEntry);
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw, just log error so we don't break the main flow
    }
  },
};
