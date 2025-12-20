# Three-Tier Governance System - Testing Guide

## 🎯 Overview
This guide will walk you through testing the complete three-tier governance system with Super Admin, President, and Vice President roles.

## 🚀 Quick Start

### Prerequisites
- Development server running (`pnpm run dev`)
- Firebase project configured
- Clean browser session (or incognito mode)

### Test Credentials
**Super Admin** (created via seed button):
- Email: `admin@zute.com`
- Password: `Password123!`

---

## 📋 Testing Scenarios

### 1. Seed Super Admin ✅
**Objective**: Create the initial Super Admin account

1. Navigate to `/login`
2. Look for the "Seed Super Admin" button at the bottom of the login form
3. Click the button
4. Wait for success toast: "Super Admin seeded successfully"
5. Verify the button disappears or becomes disabled after seeding

**Verification**:
- Super Admin document created in Firestore `admins` collection
- Role: `super_admin`
- Permissions: All 12 permissions
- Assigned regions: All 87 Zambian districts

---

### 2. Login as Super Admin ✅
**Objective**: Verify Super Admin authentication and dashboard access

1. Use credentials: `admin@zute.com` / `Password123!`
2. Click "Sign In"
3. Should redirect to `/admin/dashboard`

**Verification**:
- Dashboard displays with user name and role
- Sidebar shows:
  - ✅ Dashboard
  - ✅ Members
  - ✅ Join Applications
  - ✅ Approvals (visible only for Super Admin/President/VP)
  - ✅ Financials
  - ✅ Reports
  - ✅ User Management
  - ✅ System Settings
- Stats cards show: Total Members, Pending Apps, Monthly Revenue, Active Referrals
- Approval queue widget shows (if any pending approvals exist)

---

### 3. Create President ✅
**Objective**: Create a President account using Team Management

1. Navigate to `/admin/team-management`
2. Click "Add New User" button
3. Fill in form:
   - First Name: `John`
   - Last Name: `President`
   - Email: `president@zute.com`
   - Password: `Password123!`
   - Role: `President`
   - Assigned Regions: (Leave empty or select all - Presidents see all regions)
4. Click "Create User"
5. Wait for success toast

**Verification**:
- New admin document created in Firestore `admins` collection
- Role: `president`
- Permissions: All except `system_settings`, `view_audit_logs`, `manage_users`
- User appears in Team Management table

---

### 4. Create Vice President ✅
**Objective**: Create a Vice President account

Repeat Step 3 with:
- Email: `vp@zute.com`
- Role: `Vice President`

**Verification**:
- VP permissions exclude: `approve_members_batch`, `system_settings`, `view_audit_logs`, `manage_users`

---

### 5. Create Regional Admin ✅
**Objective**: Create a regional admin with scoped district access

1. Navigate to `/admin/team-management`
2. Click "Add New User"
3. Fill in form:
   - First Name: `Alice`
   - Last Name: `Regional`
   - Email: `regional@zute.com`
   - Password: `Password123!`
   - Role: `Regional Admin`
   - Assigned Regions: Select 2-3 districts (e.g., Lusaka, Chipata, Ndola)
4. Click "Create User"

**Verification**:
- Role: `regional_admin`
- Permissions: Only `view_region_members`, `view_own_financials`
- `assignedRegions` field populated with selected districts

---

### 6. Test Regional Scoping ✅
**Objective**: Verify Regional Admin can only see their assigned districts

1. Logout from Super Admin account
2. Login as Regional Admin: `regional@zute.com` / `Password123!`
3. Navigate to `/admin/teacher-management` (Members page)

**Verification**:
- Page header shows: "Viewing: Lusaka, Chipata, Ndola" (or your selected districts)
- Member table only displays teachers from assigned districts
- District filter dropdown only shows assigned districts
- Cannot see members from other districts

---

### 7. Test Approval Workflow (Single Approval) ✅
**Objective**: Test single-level approval for member batch approval

1. Login as Super Admin
2. Create an approval request:
   ```typescript
   // Via browser console or create UI for this
   import { ApprovalSystem } from '@/lib/approvals';
   
   await ApprovalSystem.createRequest(
     'super_admin',
     'admin@zute.com',
     'Super Admin',
     'president',
     'member_batch',
     { memberIds: ['user1', 'user2'], count: 2 },
     'Approve batch of 2 new members from Eastern Province'
   );
   ```
3. Logout and login as President: `president@zute.com` / `Password123!`
4. Navigate to `/admin/approvals`
5. Review the pending request in the approval queue
6. Click on the request to open review dialog
7. Click "Approve" and add a comment: "Approved - members verified"

**Verification**:
- Request status changes from `pending` → `approved`
- Approval history shows President's approval with timestamp
- Request disappears from President's pending queue
- Audit log entry created with action `approval_approved`

---

### 8. Test Dual Approval Workflow ✅
**Objective**: Test dual approval for sensitive actions (delete_member, system_change, role_grant)

1. Login as Super Admin
2. Create a dual-approval request:
   ```typescript
   await ApprovalSystem.createRequest(
     'super_admin',
     'admin@zute.com',
     'Super Admin',
     'president',
     'delete_member',
     { memberId: 'user123', memberName: 'Test User' },
     'Delete inactive member - not responding for 6 months'
   );
   ```
3. Logout and login as President
4. Navigate to `/admin/approvals`
5. Approve the request with comment: "First approval - user confirmed inactive"
6. Logout and login as VP: `vp@zute.com` / `Password123!`
7. Navigate to `/admin/approvals`
8. Review the request (status should be `awaiting_vp`)
9. Approve with comment: "Second approval - delete confirmed"

**Verification**:
- After President approval: status = `awaiting_vp`
- After VP approval: status = `approved`
- Approval history shows both approvals in chronological order
- Request only disappears after both executives approve
- Audit logs track both approval actions

---

### 9. Test Rejection Workflow ✅
**Objective**: Verify approval rejection

1. Create a new approval request (as Super Admin)
2. Login as President
3. Navigate to `/admin/approvals`
4. Click on the request to review
5. Click "Reject" and add comment: "Insufficient documentation provided"

**Verification**:
- Request status changes to `rejected`
- Rejection comment and timestamp recorded in history
- Request disappears from pending queue
- Audit log entry created with action `approval_rejected`

---

### 10. Test Permission-Based Sidebar Visibility ✅
**Objective**: Verify role-based menu display

**Super Admin** should see:
- ✅ Dashboard
- ✅ Members
- ✅ Join Applications
- ✅ Approvals
- ✅ Financials
- ✅ Reports
- ✅ User Management
- ✅ System Settings

**President** should see:
- ✅ Dashboard
- ✅ Members
- ✅ Join Applications
- ✅ Approvals
- ✅ Financials
- ✅ Reports
- ❌ User Management (hidden)
- ❌ System Settings (hidden)

**Vice President** should see:
- ✅ Dashboard
- ✅ Members (view only)
- ❌ Join Applications (hidden)
- ✅ Approvals
- ✅ Financials
- ✅ Reports
- ❌ User Management (hidden)
- ❌ System Settings (hidden)

**Regional Admin** should see:
- ✅ Dashboard
- ✅ Members (scoped to assigned regions)
- ❌ Join Applications (hidden)
- ❌ Approvals (hidden)
- ✅ Financials (own only)
- ❌ Reports (hidden)
- ❌ User Management (hidden)
- ❌ System Settings (hidden)

---

### 11. Test Dashboard Quick Actions ✅
**Objective**: Verify permission-based quick action buttons

1. Login with different roles
2. Check dashboard quick action cards

**Verification**:
- Super Admin sees: Review Applications, View Members, Manage Financials, Manage Team
- President sees: Review Applications, View Members, Manage Financials
- VP sees: View Members, Manage Financials
- Regional Admin sees: View Members

---

### 12. Test Member Search and Filtering ✅
**Objective**: Verify member list functionality

1. Navigate to `/admin/teacher-management`
2. Test search box: Enter member name or email
3. Test district filter: Select a district from dropdown
4. Test status filter: Select "Active" or "Pending"

**Verification**:
- Search filters results in real-time
- District filter shows only members from selected district
- Status filter shows only members with matching status
- Regional Admin only sees their assigned districts in filter dropdown
- Table displays: Name, School, District, Referral Code, Joined Date, Status
- Alternating row colors (gray-50 / white)
- Dark header with white text

---

### 13. Test Audit Logging ✅
**Objective**: Verify all governance actions are logged

1. Perform various actions (create user, approve request, etc.)
2. Check Firestore `audit_logs` collection

**Verification**:
- Each log entry has:
  - `actor`: User ID who performed action
  - `action`: Action type (e.g., `user_created`, `approval_approved`)
  - `details`: Additional context (JSON)
  - `target`: Affected resource (e.g., user ID, approval ID)
  - `timestamp`: When action occurred
- Actions logged:
  - `user_created` (Team Management)
  - `approval_created` (Approval request submission)
  - `approval_approved` (Approval granted)
  - `approval_rejected` (Approval denied)
  - `login_success` (User authentication)

---

### 14. Test Session Persistence ✅
**Objective**: Verify permissions cached in localStorage

1. Login as any user
2. Open browser DevTools → Application → Local Storage
3. Check for keys:
   - `user_permissions`: Array of permission strings
   - `user_role`: Role enum value
   - `user_regions`: Array of assigned districts (for regional admins)

**Verification**:
- Permissions cached on login
- Cache cleared on logout
- Sidebar uses cached permissions for instant UI updates (no Firestore query needed)

---

## 🔧 Troubleshooting

### Issue: "Seed Super Admin" button doesn't appear
**Solution**: Check Firebase config in `.env` file

### Issue: "User already exists" when creating team members
**Solution**: Use unique emails or delete existing test users from Firebase Auth

### Issue: Regional Admin sees all members
**Solution**: Verify `assignedRegions` field in Firestore `admins` collection

### Issue: Approval queue is empty
**Solution**: Create test approval requests using ApprovalSystem.createRequest()

### Issue: Permission errors in console
**Solution**: Clear localStorage and re-login to refresh cached permissions

---

## 📊 Test Data Setup

### Populate Test Members
Use the existing join application flow to create test members in different districts:

1. Navigate to `/join`
2. Fill in join form with:
   - Full Name: "Test Teacher 1"
   - District: "Lusaka"
   - School: "Test School"
   - etc.
3. Submit application
4. Login as admin and approve via `/admin/join-applications`
5. Repeat for multiple districts (Chipata, Ndola, Kitwe, etc.)

### Create Multiple Approval Requests
```typescript
// Use browser console after logging in
const requests = [
  { type: 'member_batch', approver: 'president', data: { count: 5 } },
  { type: 'payment', approver: 'president', data: { amount: 5000 } },
  { type: 'delete_member', approver: 'president', data: { memberId: 'xyz' } },
  { type: 'system_change', approver: 'president', data: { change: 'config update' } },
];

for (const req of requests) {
  await ApprovalSystem.createRequest(
    'super_admin',
    'admin@zute.com',
    'Super Admin',
    req.approver,
    req.type,
    req.data,
    `Test request for ${req.type}`
  );
}
```

---

## ✅ Success Criteria

All features working correctly when:

1. **Authentication**
   - ✅ Super Admin can be seeded
   - ✅ All roles can login successfully
   - ✅ Permissions cached in localStorage
   - ✅ Logout clears cache

2. **Authorization**
   - ✅ Super Admin sees all menu items
   - ✅ President sees executive menu items
   - ✅ VP sees limited executive items
   - ✅ Regional Admin sees scoped menu items

3. **Team Management**
   - ✅ Super Admin can create all user types
   - ✅ Region assignment works for Regional Admins
   - ✅ Users appear in team list immediately

4. **Member Management**
   - ✅ Super Admin/President/VP see all members
   - ✅ Regional Admin sees only assigned districts
   - ✅ Search and filters work correctly
   - ✅ Member data displays properly

5. **Approval Workflow**
   - ✅ Requests created successfully
   - ✅ President/VP see pending requests
   - ✅ Single approval completes immediately
   - ✅ Dual approval requires both executives
   - ✅ Rejection works with comments
   - ✅ History tracks all approvals/rejections

6. **Audit Logging**
   - ✅ All CUD operations logged
   - ✅ Login events tracked
   - ✅ Approval actions recorded
   - ✅ Logs include actor, action, details, target

---

## 🎓 Next Steps

After successful testing:

1. **Dashboard Home Enhancement**
   - Add approval queue widget for President/VP
   - Add key metrics (total members, pending apps, revenue)
   - Add quick action buttons

2. **Approval Execution**
   - Wire up approved actions to actually execute
   - Member batch approval → approve join requests
   - Payment approval → process referral payouts
   - Delete member → soft delete user record

3. **Audit Log Viewer**
   - Create `/admin/audit-logs` page
   - Display filterable log table
   - Search by actor, action, date range
   - Export logs to CSV

4. **Region Management UI**
   - Allow President/VP to create/modify regions
   - Assign Regional Admins to regions
   - View region statistics

5. **System Settings Page**
   - Configure approval thresholds
   - Manage audit log retention
   - System-wide configurations

---

## 📝 Notes

- **Security**: All permission checks happen client-side (fast UI) but should be mirrored in Firestore Security Rules for server-side validation
- **Scalability**: Consider pagination for member list if >1000 members
- **Backup**: President and VP can both approve - dual control for sensitive actions
- **Flexibility**: Permission matrix can be easily extended for new permissions or roles

---

**Testing Started**: [Date]  
**Testing Completed**: [Date]  
**Tester**: [Name]  
**Status**: [ ] In Progress / [ ] Complete / [ ] Blocked
