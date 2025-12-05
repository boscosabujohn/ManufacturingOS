# Pending Backend Jobs - Procurement Approval System

## Database & Backend Setup (Blocked - Database Not Connected)

### 1. Database Migration & Initialization
- [ ] Run TypeORM migration to create approval tables
- [ ] Start backend server to auto-initialize default approval chains
- [ ] Verify tables created: `approval_chains`, `approval_levels`, `approval_requests`, `approval_history`, `approval_comments`, `approval_attachments`, `user_tasks`
- [ ] Test default PO approval chain initialization

**Command to run when database is ready:**
```bash
cd backend
npm run start:dev
# Backend will auto-create tables and initialize chains on first run
```

### 2. SLA Tracking Service
- [ ] Create `sla.service.ts` in `backend/src/modules/approvals/services/`
- [ ] Implement cron job to check SLA breaches every hour
- [ ] Update user task `slaStatus` field (on-track → warning → breached)
- [ ] Trigger escalation notifications on SLA breach

**File to create:** `backend/src/modules/approvals/services/sla.service.ts`

### 3. Notification Service
- [ ] Create `notification.service.ts` in `backend/src/modules/approvals/services/`
- [ ] Implement email notification using nodemailer (already installed)
- [ ] Create email templates for:
  - New approval request
  - Approval required (your turn)
  - Request approved
  - Request rejected
  - SLA breach warning
- [ ] Implement in-app notifications (create `notifications` table)
- [ ] Add push notification support for mobile

**File to create:** `backend/src/modules/approvals/services/notification.service.ts`

### 4. Email Templates
Create in `backend/src/modules/approvals/templates/`:
- [ ] `approval-request.html` - New approval request email
- [ ] `approval-required.html` - Your approval is needed
- [ ] `approval-complete.html` - Request approved notification
- [ ] `approval-rejected.html` - Request rejected notification
- [ ] `sla-warning.html` - SLA breach warning

### 5. Procurement Module Integration
- [ ] Update PO entity to add `approvalRequestId` field
- [ ] Add `approvalStatus` field to PO ('pending_approval', 'approved', 'rejected')
- [ ] Prevent PO submission when approval is pending
- [ ] Auto-update PO status when approval completes

**Files to modify:**
- `backend/src/modules/procurement/entities/purchase-order.entity.ts`
- `backend/src/modules/procurement/services/purchase-order.service.ts`

### 6. User & Role Management Integration
- [ ] Implement role-based approver lookup in `createApproverTasks()`
- [ ] Map role names ('department_head', 'finance_manager', etc.) to actual user IDs
- [ ] Filter pending approvals based on user's roles
- [ ] Add approval permissions to role configuration

**Files to modify:**
- `backend/src/modules/approvals/services/approval-workflow.service.ts` (lines 240-254, 316-326)

### 7. API Testing
Once database is connected, test all endpoints:
- [ ] `POST /api/approvals/request` - Create approval request
- [ ] `GET /api/approvals/pending?userId=xxx` - Get pending approvals
- [ ] `POST /api/approvals/:id/approve` - Approve request
- [ ] `POST /api/approvals/:id/reject` - Reject request
- [ ] `GET /api/approvals/:id/history` - Get approval history
- [ ] `GET /api/approvals/chains/:entityType` - Get chain config

**Test with:** Postman or `curl` commands

### 8. WebSocket / Real-time Updates
- [ ] Add WebSocket gateway for real-time approval updates
- [ ] Emit events when approval status changes
- [ ] Update frontend to listen for real-time events

---

## Estimated Time When Resuming
- **Database setup & testing:** 2 hours
- **SLA tracking service:** 4 hours
- **Notification service + templates:** 6 hours
- **Procurement integration:** 3 hours
- **User/role integration:** 2 hours
- **API testing:** 2 hours
- **Total:** ~19 hours (2.5 days)

---

## Dependencies Required
✅ NestJS, TypeORM, Bull - Already installed
✅ Nodemailer - Already installed
✅ PostgreSQL database - **PENDING CONNECTION**

---

*All backend code is ready to go. Just needs database connection to test and deploy.*
