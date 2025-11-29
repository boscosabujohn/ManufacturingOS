# Module Integration Guide - InContextApproval Widget

## Quick Integration Guide

### Step 1: Import the Component

```tsx
import InContextApproval from '@/components/workflow/InContextApproval';
```

### Step 2: Add to Your Page/Component

```tsx
// Example in Sales Order Detail Page
export default function SalesOrderDetail({ orderId }: { orderId: string }) {
    const [order, setOrder] = useState<any>(null);
    
    const fetchOrder = async () => {
        // Fetch order logic
    };

    return (
        <div>
            {/* Your existing order details */}
            <OrderDetails order={order} />

            {/* Add Approval Widget - ONLY if order needs approval */}
            {order?.approvalStatus === 'pending' && order?.approvalId && (
                <div className="mt-6">
                    <InContextApproval
                        referenceId={order.id}
                        approvalId={order.approvalId}
                        title="Sales Order Approval Required"
                        description={`Order #${order.orderNumber} - Total: $${order.totalAmount}`}
                        currentStatus={order.approvalStatus}
                        onActionComplete={() => {
                            // Refresh order data after approval
                            fetchOrder();
                        }}
                    />
                </div>
            )}
        </div>
    );
}
```

---

## Integration Examples for Key Modules

### 1. Sales Orders (`/sales/orders/[id]`)

**File:** `frontend/src/app/(modules)/sales/orders/[id]/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import InContextApproval from '@/components/workflow/InContextApproval';

export default function SalesOrderPage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<any>(null);

    const fetchOrder = async () => {
        const response = await fetch(`/api/sales/orders/${params.id}`);
        const data = await response.json();
        if (data.success) {
            setOrder(data.data);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    if (!order) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Sales Order #{order.orderNumber}</h1>
            
            {/* Existing order details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>Customer: {order.customerName}</div>
                <div>Amount: ${order.totalAmount}</div>
                <div>Status: {order.status}</div>
                <div>Date: {order.orderDate}</div>
            </div>

            {/* Approval Widget */}
            {order.approvalStatus === 'pending' && (
                <InContextApproval
                    referenceId={order.id}
                    approvalId={order.approvalId}
                    title="Sales Order Approval"
                    description={`Approve order #${order.orderNumber} for ${order.customerName}`}
                    currentStatus={order.approvalStatus}
                    onActionComplete={fetchOrder}
                />
            )}
        </div>
    );
}
```

---

### 2. Purchase Requisitions (`/procurement/requisitions/[id]`)

**File:** `frontend/src/app/(modules)/procurement/requisitions/[id]/page.tsx`

```tsx
'use client';

import InContextApproval from '@/components/workflow/InContextApproval';

export default function PurchaseRequisitionPage({ params }: { params: { id: string } }) {
    const [pr, setPR] = useState<any>(null);

    const fetchPR = async () => {
        const response = await fetch(`/api/procurement/requisitions/${params.id}`);
        const data = await response.json();
        if (data.success) {
            setPR(data.data);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1>Purchase Requisition #{pr?.prNumber}</h1>

            {/* PR Details */}
            {/* ... */}

            {/* Approval Widget */}
            {pr?.approvalStatus === 'pending' && (
                <InContextApproval
                    referenceId={pr.id}
                    approvalId={pr.approvalId}
                    title="Purchase Requisition Approval"
                    description={`PR #${pr.prNumber} - Amount: $${pr.estimatedAmount}`}
                    currentStatus={pr.approvalStatus}
                    onActionComplete={fetchPR}
                />
            )}
        </div>
    );
}
```

---

### 3. Purchase Orders (`/procurement/orders/[id]`)

```tsx
// Similar pattern as above
{po?.approvalStatus === 'pending' && (
    <InContextApproval
        referenceId={po.id}
        approvalId={po.approvalId}
        title="Purchase Order Approval"
        description={`PO #${po.poNumber} for ${po.vendor} - $${po.totalAmount}`}
        currentStatus={po.approvalStatus}
        onActionComplete={fetchPO}
    />
)}
```

---

### 4. Project Approval (`/project-management/projects/[id]`)

```tsx
{project?.approvalStatus === 'pending' && (
    <InContextApproval
        referenceId={project.id}
        approvalId={project.approvalId}
        title="Project Approval Required"
        description={`${project.name} - Budget: $${project.budget}`}
        currentStatus={project.approvalStatus}
        onActionComplete={fetchProject}
    />
)}
```

---

### 5. Leave Requests (`/hr/leave/[id]`)

```tsx
{leaveRequest?.approvalStatus === 'pending' && (
    <InContextApproval
        referenceId={leaveRequest.id}
        approvalId={leaveRequest.approvalId}
        title="Leave Request Approval"
        description={`${leaveRequest.employeeName} - ${leaveRequest.leaveType} (${leaveRequest.days} days)`}
        currentStatus={leaveRequest.approvalStatus}
        onActionComplete={fetchLeaveRequest}
    />
)}
```

---

## Backend Integration - Creating Approval Tasks

When creating an approval workflow, create a user task:

```typescript
// In your service (e.g., SalesOrderService)
import { UserTaskService } from '../workflow/services/user-task.service';
import { NotificationService } from '../workflow/services/notification-enhanced.service';

async createSalesOrder(orderData, userId) {
    // 1. Create the order
    const order = await this.orderRepository.save(orderData);

    // 2. Create approval
    const approval = await this.approvalService.createApproval(
        order.projectId,
        'sales-order',
        order.id,
        'sequential',
        [
            { approverId: 'SALES_MANAGER_ID', stepNumber: 1 },
            { approverId: 'FINANCE_MANAGER_ID', stepNumber: 2 }
        ],
        userId,
        `Sales Order #${order.orderNumber}`
    );

    // 3. Create user task
    await this.userTaskService.createTask({
        taskType: 'approval',
        title: 'Sales Order Approval Required',
        description: `Approve sales order #${order.orderNumber} for ${order.customerName}`,
        module: 'sales',
        moduleUrl: `/sales/orders/${order.id}`,
        referenceId: order.id,
        referenceNumber: order.orderNumber,
        priority: order.totalAmount > 50000 ? 'high' : 'medium',
        assignedTo: 'SALES_MANAGER_ID',
        assignedBy: userId,
        actions: [
            { id: 'approve', label: 'Approve', action: 'approve', requiresComment: false },
            { id: 'reject', label: 'Reject', action: 'reject', requiresComment: true }
        ],
    });

    // 4. Send notification
    await this.notificationService.notifyApprovalRequired(
        'SALES_MANAGER_ID',
        'Sales Order',
        order.orderNumber,
        `/sales/orders/${order.id}`
    );

    return order;
}
```

---

## Entity Requirements

Your entity needs these fields:

```typescript
@Entity()
export class SalesOrder {
    @Column({ nullable: true })
    approvalId: string;

    @Column({ default: 'pending' })
    approvalStatus: string; // 'pending' | 'approved' | 'rejected'

    // ... other fields
}
```

---

## Complete Integration Checklist

For each module requiring approvals:

- [ ] Add `approvalId` and `approvalStatus` fields to entity
- [ ] Import `InContextApproval` component in detail page
- [ ] Add approval widget with conditional rendering
- [ ] Create user task when approval needed (backend)
- [ ] Send notification to approver (backend)
- [ ] Test approval flow end-to-end

---

## Testing the Integration

1. **Create Item Requiring Approval:**
   - Create a Sales Order / PR / PO
   - Backend should create approval + task + notification

2. **Check Task Inbox:**
   - Navigate to Workflow → My Task Inbox
   - Verify item appears with correct priority

3. **Navigate to Item:**
   - Click task in inbox
   - Should navigate to order/PR/PO page

4. **Approve In-Context:**
   - See approval widget on page
   - Click Approve/Reject
   - Add comment if required
   - Submit

5. **Verify Results:**
   - Item status should update
   - Task should disappear from inbox
   - Notification should be sent

---

## Common Patterns

### Pattern 1: Single Approver
```tsx
{item.approvalStatus === 'pending' && (
    <InContextApproval
        referenceId={item.id}
        approvalId={item.approvalId}
        title="Approval Required"
        onActionComplete={refresh}
    />
)}
```

### Pattern 2: Multi-Level (Shows current step)
```tsx
{item.approvalStatus === 'pending' && (
    <div>
        <div className="mb-2 text-sm text-gray-600">
            Approval Step: {item.currentStep} of {item.totalSteps}
        </div>
        <InContextApproval
            referenceId={item.id}
            approvalId={item.approvalId}
            title={`Step ${item.currentStep} Approval`}
            description={item.currentApproverRole}
            onActionComplete={refresh}
        />
    </div>
)}
```

### Pattern 3: Conditional Based on Amount
```tsx
{item.totalAmount > 10000 && item.approvalStatus === 'pending' && (
    <InContextApproval
        referenceId={item.id}
        approvalId={item.approvalId}
        title="High-Value Approval Required"
        description="This item requires additional approval due to high value"
        onActionComplete={refresh}
    />
)}
```

---

## Styling Tips

The approval widget is already styled, but you can customize placement:

```tsx
{/* Full-width at top */}
<div className="mb-6">
    <InContextApproval {...props} />
</div>

{/* Sidebar placement */}
<div className="grid grid-cols-3 gap-6">
    <div className="col-span-2">
        {/* Main content */}
    </div>
    <div>
        <InContextApproval {...props} />
    </div>
</div>

{/* Modal/Dialog */}
<Dialog>
    <DialogContent>
        <InContextApproval {...props} />
    </DialogContent>
</Dialog>
```

---

**Ready to use!** The InContextApproval widget is production-ready and can be added to any module page with just a few lines of code.
