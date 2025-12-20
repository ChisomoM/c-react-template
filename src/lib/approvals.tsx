import { FirebaseFirestore } from './firebase/firestore';
import type { ApprovalRequest, ApprovalHistoryItem } from '@/types/admin';
import type { AuthUser } from '@/types/auth';
import { type UserRole, USER_ROLES } from './constants';
import { AuditLogger } from './audit';

export const ApprovalSystem = {
  createRequest: async (
    requester: AuthUser,
    type: ApprovalRequest['type'],
    data: any,
    reason: string,
    approverRole: UserRole | 'dual' = USER_ROLES.PRESIDENT
  ) => {
    const request: Omit<ApprovalRequest, 'id'> = {
      type,
      requesterId: String(requester.id),
      requesterName: `${requester.firstName} ${requester.lastName}`,
      requesterRole: requester.role as UserRole,
      approverRole,
      status: 'pending',
      data,
      reason,
      createdAt: new Date(),
      updatedAt: new Date(),
      history: [{
        actorId: String(requester.id),
        actorName: `${requester.firstName} ${requester.lastName}`,
        actorRole: requester.role as UserRole,
        action: 'created',
        timestamp: new Date(),
      }],
    };

    const id = await FirebaseFirestore.addDocument('approval_requests', request);
    
    await AuditLogger.log('CREATE_APPROVAL_REQUEST', requester, { requestId: id, type, reason });
    
    return id;
  },

  approveRequest: async (
    requestId: string,
    approver: AuthUser,
    comment?: string
  ) => {
    const request = await FirebaseFirestore.getDocument('approval_requests', requestId) as ApprovalRequest;
    if (!request) throw new Error('Request not found');

    // Logic for Dual Approval
    let newStatus: ApprovalRequest['status'] = 'approved';
    
    if (request.approverRole === 'dual') {
      if (request.status === 'pending') {
        // First approval
        newStatus = approver.role === USER_ROLES.PRESIDENT ? 'awaiting_vp' : 'awaiting_president';
      } else if (
        (request.status === 'awaiting_vp' && approver.role === USER_ROLES.VICE_PRESIDENT) ||
        (request.status === 'awaiting_president' && approver.role === USER_ROLES.PRESIDENT)
      ) {
        // Second approval
        newStatus = 'approved';
      }
    }

    const historyItem: ApprovalHistoryItem = {
      actorId: String(approver.id),
      actorName: `${approver.firstName} ${approver.lastName}`,
      actorRole: approver.role as UserRole,
      action: 'approved',
      comment,
      timestamp: new Date(),
    };

    await FirebaseFirestore.updateDocument('approval_requests', requestId, {
      status: newStatus,
      updatedAt: new Date(),
      history: [...request.history, historyItem],
    });

    await AuditLogger.log('APPROVE_REQUEST', approver, { requestId, newStatus, comment });

    return newStatus;
  },

  rejectRequest: async (
    requestId: string,
    rejector: AuthUser,
    reason: string
  ) => {
    const request = await FirebaseFirestore.getDocument('approval_requests', requestId) as ApprovalRequest;
    if (!request) throw new Error('Request not found');

    const historyItem: ApprovalHistoryItem = {
      actorId: String(rejector.id),
      actorName: `${rejector.firstName} ${rejector.lastName}`,
      actorRole: rejector.role as UserRole,
      action: 'rejected',
      comment: reason,
      timestamp: new Date(),
    };

    await FirebaseFirestore.updateDocument('approval_requests', requestId, {
      status: 'rejected',
      updatedAt: new Date(),
      history: [...request.history, historyItem],
    });

    await AuditLogger.log('REJECT_REQUEST', rejector, { requestId, reason });
  },
};
