# Placeholder Fix Guide

This guide documents the remaining placeholders and recommended fixes.

## Categories of Placeholders

### 1. href="#" Placeholders (6 files)
These need to be replaced with proper routing or removed.

### 2. console.log Placeholders (30 files)
These are in master data pages and need proper action handlers.

---

## Approach for Fixing

### For href="#" Links:
Replace with:
- `onClick={(e) => { e.preventDefault(); alert('Feature coming soon'); }}`
- Or proper route: `href="/actual/route"`

### For console.log in Master Pages:
Replace pattern:
```typescript
// FROM:
onClick={() => console.log('Edit item:', row)}

// TO:
onClick={() => router.push(`/path/edit/${row.id}`)}
// OR
onClick={() => alert('Edit functionality coming soon')}
```

---

## Files to Fix

### Priority: href="#" (6 files)

1. **CPQ E-commerce Integration**
   - File: `b3-erp/frontend/src/app/(modules)/cpq/integration/ecommerce/page.tsx:449`
   - Issue: `<a href="#">{quote.quoteId}</a>`
   - Fix: Navigate to quote detail page or use onClick

2. **CPQ CAD Integration**
   - File: `b3-erp/frontend/src/app/(modules)/cpq/integration/cad/page.tsx`
   - Similar pattern to ecommerce

3. **Dashboard (Alternative)**
   - File: `b3-erp/frontend/src/app/dashboard/page.tsx`
   - Check if this is duplicate of main dashboard

4. **DashboardLayout Component**
   - File: `b3-erp/frontend/src/components/DashboardLayout.tsx`
   - Layout component with placeholder links

5. **RFQ View**
   - File: `b3-erp/frontend/src/app/(modules)/rfq/view/[id]/page.tsx`
   - Detail view with placeholder links

6. **Procurement Requisitions View**
   - File: `b3-erp/frontend/src/app/(modules)/procurement/requisitions/view/[id]/page.tsx`
   - Detail view with placeholder links

### Medium Priority: console.log in Common Masters (27 files)

These are master data CRUD pages with placeholder actions:

**Pattern Found:**
```typescript
onClick={() => console.log('Edit HSN/SAC:', row)}
onClick={() => console.log('View items:', row)}
onClick={() => console.log('Export HSN/SAC')}
onClick={() => console.log('Add HSN/SAC')}
```

**Recommended Fix:**
Since these are master data pages without specific add/edit routes, we should show user feedback:

```typescript
const handleEdit = (row: any) => {
  alert(`Edit functionality for ${row.name || row.code} will be implemented soon`);
};

const handleDelete = (row: any) => {
  if (confirm(`Are you sure you want to delete ${row.name || row.code}?`)) {
    alert('Delete functionality will be implemented soon');
  }
};

const handleExport = () => {
  alert('Export functionality will be implemented soon');
};

const handleAdd = () => {
  alert('Add new entry functionality will be implemented soon');
};
```

**Files:**
1. `hsn-sac-master/page.tsx`
2. `price-list-master/page.tsx`
3. `vendor-category-master/page.tsx`
4. `customer-category-master/page.tsx`
5. `payment-terms-master/page.tsx`
6. `bank-master/page.tsx`
7. `exchange-rate-master/page.tsx`
8. `territory-master/page.tsx`
9. `number-series-master/page.tsx`
10. `tool-master/page.tsx`
11. `operation-master/page.tsx`
12. `machine-master/page.tsx`
13. `item-group-master/page.tsx`
14. `user-master/page.tsx`
15. `role-master/page.tsx`
16. `holiday-master/page.tsx`
17. `shift-master/page.tsx`
18. `grade-master/page.tsx`
19. `designation-master/page.tsx`
20. `currency-master/page.tsx`
21. `city-master/page.tsx`
22. `state-master/page.tsx`

### Medium Priority: console.log in HR Leave Pages (6 files)

**Files:**
1. `app/hr/leave/policies/page.tsx`
2. `app/hr/leave/status/page.tsx`
3. `app/hr/leave/balance/department/page.tsx`
4. `app/hr/leave/balance/team/page.tsx`
5. `app/hr/leave/balance/my/page.tsx`
6. `app/hr/leave/types/page.tsx`

### Low Priority: Other console.log (2 files)

1. `app/(modules)/crm/leads/page.tsx` - Already has routing, might just be debug logs
2. `app/(modules)/support/tickets/page.tsx` - Support tickets page

---

## Quick Fix Strategy

### Option 1: User Feedback Approach (Recommended)
Replace console.log with user-friendly alerts/toasts indicating "Coming Soon"

**Pros:**
- Honest with users
- Quick to implement
- No broken functionality
- Clear about what's planned

**Cons:**
- Not fully functional
- Users know it's incomplete

### Option 2: Route to Placeholder Pages
Create generic add/edit pages for master data

**Pros:**
- Looks more complete
- Better UX flow

**Cons:**
- More work
- Still not functional without backend

### Option 3: Comment for Future Implementation
Add TODO comments and keep console.log for development

**Pros:**
- Quickest
- Good for development

**Cons:**
- Not production-ready
- Confusing for end users

---

## Recommendation

**Immediate Fix (Today):**
1. Fix all 6 href="#" files (high priority)
2. Add proper handlers with user feedback for CPQ pages
3. Document remaining console.log files

**Next Sprint:**
1. Create generic master data add/edit modal components
2. Replace console.log with modal handlers
3. Add proper form validation

**Future:**
1. Backend API integration
2. Real CRUD operations
3. Data persistence

---

## Implementation Priority

✅ **DONE:**
- Reports module (7 pages)
- User profile page
- Settings page
- Help & documentation pages
- Dashboard footer links

🔄 **IN PROGRESS:**
- href="#" fixes (6 files)

⏳ **PENDING:**
- console.log replacements (30 files)
  - Can be done incrementally
  - Not blocking for basic navigation
  - Recommended for next phase

---

## Decision

For production readiness, we should:

1. **Fix href="#"** immediately (6 files) - These break navigation UX
2. **Document console.log** as known limitations - These are mostly in admin/master pages
3. **Phase 2 implementation** - Proper CRUD for master data with backend integration

This approach balances:
- Immediate user experience improvements
- Development time efficiency
- Honest communication about system capabilities
