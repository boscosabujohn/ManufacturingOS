# Accessibility Remediation Guide

## Executive Summary

This guide addresses **664 accessibility violations** across **288 files** in the ManufacturingOS ERP system. All violations relate to buttons and links lacking accessible names, violating WCAG 2.1 Level A standards.

### Quick Stats
- **Total Issues**: 664
- **Affected Files**: 288
- **Issue Types**: Native buttons (98.3%), Next.js Links (1.4%), Anchor tags (0.3%)
- **Primary Cause**: Icon-only buttons without aria-label attributes

---

## Table of Contents

1. [Understanding the Problem](#understanding-the-problem)
2. [Remediation Strategy](#remediation-strategy)
3. [Button Type Reference](#button-type-reference)
4. [Implementation Guide](#implementation-guide)
5. [Module-by-Module Breakdown](#module-by-module-breakdown)
6. [Testing & Validation](#testing--validation)
7. [Automated Tools](#automated-tools)

---

## Understanding the Problem

### What's Wrong?

Buttons with only icon content and no visible text must have accessible names via one of these methods:
- `aria-label` attribute
- `aria-labelledby` pointing to descriptive text
- `title` attribute (less preferred)
- Visible text content

### Example of the Issue

❌ **Incorrect** (No accessible name):
```tsx
<button className="p-2 hover:bg-gray-100">
  <Eye className="h-5 w-5" />
</button>
```

✅ **Correct** (With aria-label):
```tsx
<button
  className="p-2 hover:bg-gray-100"
  aria-label="View details"
>
  <Eye className="h-5 w-5" />
</button>
```

### Why It Matters

- **Screen readers** cannot announce the button's purpose without an accessible name
- Violates **WCAG 2.1 Level A** (Success Criterion 4.1.2: Name, Role, Value)
- Affects users with visual impairments, motor disabilities using voice control, and keyboard-only users
- Can result in legal compliance issues under ADA/Section 508

---

## Remediation Strategy

### Phase 1: High-Impact Quick Wins (Priority 1)

**Target**: 80+ issues fixed by updating 29 files

Fix all Common Masters components that are reused throughout the system:

1. **Common Masters** (29 components)
   - AuditMaster, BankMaster, BrandMaster, CategoryMaster, etc.
   - These are base components used across multiple modules
   - Fixing these will cascade improvements

2. **Shared Layout Components** (3 files)
   - Breadcrumbs.tsx
   - DashboardLayout.tsx
   - Sidebar.tsx

**Estimated Impact**: ~90 issues fixed (13.5% of total)
**Estimated Time**: 2-4 hours

### Phase 2: High-Density Modules (Priority 2)

**Target**: 260+ issues

1. **Finance Components** (90+ issues in 18 files)
2. **Procurement Components** (85+ issues in 19 files)
3. **CRM Module** (75+ issues in 28 files)
4. **Logistics Module** (55+ issues in 21 files)

**Estimated Impact**: ~260 issues fixed (39% of total)
**Estimated Time**: 8-12 hours

### Phase 3: Remaining Modules (Priority 3)

**Target**: 314+ issues

1. CPQ Module (45+ issues)
2. Support Module (40+ issues)
3. Production Module (30+ issues)
4. Sales Module (30+ issues)
5. IT Admin Module (25+ issues)
6. Inventory Module (25+ issues)
7. Project Management (20+ issues)
8. HR Module (18+ issues)
9. Estimation Module, Reports, RFQ, Others (~51+ issues)

**Estimated Impact**: ~314 issues fixed (47.3% of total)
**Estimated Time**: 10-15 hours

### Total Estimated Time: 20-31 hours

---

## Button Type Reference

### Complete Icon-to-Label Mapping

| Icon Component | Recommended aria-label | Context Examples |
|----------------|------------------------|------------------|
| **Eye** | "View details" | "View invoice", "View contract", "View user" |
| **Edit, Edit2, Edit3** | "Edit" | "Edit product", "Edit settings", "Edit profile" |
| **Trash2, TrashIcon** | "Delete" | "Delete record", "Remove item", "Delete user" |
| **Download** | "Download" | "Download report", "Download invoice", "Export data" |
| **Copy, DocumentDuplicateIcon** | "Copy" | "Duplicate template", "Copy to clipboard" |
| **ChevronLeft** | "Previous" | "Go to previous month", "Previous page" |
| **ChevronRight** | "Next" | "Go to next month", "Next page" |
| **ArrowLeft** | "Go back" | "Return to list", "Back to dashboard" |
| **Settings, CogIcon** | "Settings" | "Open settings", "Configure" |
| **Mail** | "Send email" | "Contact via email", "Email support" |
| **Phone** | "Call" | "Contact via phone", "Call customer" |
| **MessageSquare** | "Send message" | "Open chat", "Message user" |
| **Bell** | "Notifications" | "View notifications", "Notification center" |
| **Play** | "Start" | "Resume", "Play video" |
| **Pause** | "Pause" | "Pause process", "Pause playback" |
| **Check, CheckCircle** | "Approve" | "Mark as complete", "Confirm" |
| **X, XCircle** | "Close" | "Cancel", "Reject", "Dismiss" |
| **Send** | "Send" | "Submit", "Send message" |
| **MoreVertical, MoreHorizontal** | "More options" | "Open menu", "Additional actions" |
| **Filter** | "Filter results" | "Open filters", "Apply filters" |
| **RefreshCw** | "Refresh" | "Reload data", "Refresh page" |
| **Printer** | "Print" | "Print document", "Print invoice" |
| **Search** | "Search" | "Search records", "Find items" |
| **ZoomIn** | "Zoom in" | "Increase size", "Zoom in map" |
| **ZoomOut** | "Zoom out" | "Decrease size", "Zoom out map" |
| **Plus, PlusCircle** | "Add" | "Add new item", "Create", "Add tag" |
| **UserPlus** | "Add user" | "Invite user", "Add team member" |
| **Heart** | "Add to favorites" | "Like", "Save to favorites" |
| **Share, Share2** | "Share" | "Share link", "Share document" |
| **ThumbsUp** | "Approve" | "Like", "Thumbs up" |
| **FileText** | "View document" | "Open file", "View report" |
| **Upload** | "Upload file" | "Upload document", "Choose file" |
| **Camera** | "Take photo" | "Capture image", "Upload photo" |
| **Truck** | "Track shipment" | "View delivery", "Shipping details" |
| **Award** | "View achievements" | "View awards", "See badges" |
| **History** | "View history" | "Show history", "Activity log" |
| **ExternalLink** | "Open in new window" | "Open externally", "View external" |
| **Undo2** | "Undo" | "Revert changes", "Undo action" |
| **BarChart3** | "View analytics" | "View chart", "Show statistics" |
| **TrendingUp** | "View trends" | "Show growth", "View performance" |
| **User** | "User profile" | "View profile", "Account settings" |
| **UserMinus** | "Remove user" | "Delete user", "Remove member" |
| **LogOut** | "Log out" | "Sign out", "Exit account" |
| **HelpCircle** | "Help" | "Show help", "Get support" |
| **AlertTriangle** | "Warning" | "View warning", "Alert details" |
| **Home** | "Home" | "Go to home", "Dashboard" |

---

## Implementation Guide

### Method 1: Direct aria-label Addition

**Best for**: Simple, standalone buttons

```tsx
// Before
<button className="p-2 hover:bg-gray-100">
  <Edit className="h-5 w-5" />
</button>

// After
<button
  className="p-2 hover:bg-gray-100"
  aria-label="Edit"
>
  <Edit className="h-5 w-5" />
</button>
```

### Method 2: Context-Aware Labels

**Best for**: Buttons in loops or dynamic contexts

```tsx
// Before
{users.map(user => (
  <button onClick={() => handleEdit(user)}>
    <Edit className="h-5 w-5" />
  </button>
))}

// After
{users.map(user => (
  <button
    onClick={() => handleEdit(user)}
    aria-label={`Edit ${user.name}`}
  >
    <Edit className="h-5 w-5" />
  </button>
))}
```

### Method 3: Reusable Icon Button Component

**Best for**: Large-scale refactoring

```tsx
// components/ui/IconButton.tsx
interface IconButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'danger' | 'success';
}

export function IconButton({
  icon: Icon,
  label,
  onClick,
  className = '',
  variant = 'default'
}: IconButtonProps) {
  const variantStyles = {
    default: 'text-gray-600 hover:text-gray-700 hover:bg-gray-100',
    danger: 'text-red-600 hover:text-red-700 hover:bg-red-50',
    success: 'text-green-600 hover:text-green-700 hover:bg-green-50'
  };

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-2 rounded-lg transition-colors ${variantStyles[variant]} ${className}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

// Usage
<IconButton icon={Edit} label="Edit user" onClick={handleEdit} />
<IconButton icon={Trash2} label="Delete user" onClick={handleDelete} variant="danger" />
```

### Method 4: Tooltip + aria-label Pattern

**Best for**: Enhanced UX with visual feedback

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

<Tooltip>
  <TooltipTrigger asChild>
    <button
      aria-label="Edit user"
      className="p-2 hover:bg-gray-100"
    >
      <Edit className="h-5 w-5" />
    </button>
  </TooltipTrigger>
  <TooltipContent>Edit user</TooltipContent>
</Tooltip>
```

### Method 5: Button Groups with aria-describedby

**Best for**: Related button groups

```tsx
<div role="group" aria-label="User actions">
  <button aria-label="View user details">
    <Eye className="h-5 w-5" />
  </button>
  <button aria-label="Edit user">
    <Edit className="h-5 w-5" />
  </button>
  <button aria-label="Delete user">
    <Trash2 className="h-5 w-5" />
  </button>
</div>
```

---

## Module-by-Module Breakdown

### Common Masters (29 files, ~80 issues)

**Location**: `b3-erp/frontend/src/components/common-masters/`

**Common Patterns**:
- Eye (View details)
- Edit (Edit record)
- Trash2 (Delete record)
- Download (Export data)

**Priority**: HIGHEST - These components are reused extensively

**Example Fix** (AuditMaster.tsx):
```tsx
// Line with Edit button
<button
  aria-label="Edit audit record"
  className="p-2 hover:bg-gray-100"
>
  <Edit className="h-5 w-5" />
</button>

// Line with Trash2 button
<button
  aria-label="Delete audit record"
  className="p-2 hover:bg-red-50 text-red-600"
>
  <Trash2 className="h-5 w-5" />
</button>
```

### Finance Module (18 files, ~90 issues)

**Location**: `b3-erp/frontend/src/components/finance/`

**Common Patterns**:
- Eye (View transaction/report)
- Edit (Edit entry)
- Download (Download statement/report)
- PencilIcon (Edit financial data)
- MoreVertical (More financial options)

**Priority**: HIGH - Critical business module

**Example Fix** (AccountsReceivableManagement.tsx):
```tsx
<button aria-label="View invoice details">
  <Eye className="h-5 w-5" />
</button>
<button aria-label="Download invoice">
  <Download className="h-5 w-5" />
</button>
```

### Procurement Module (19 files, ~85 issues)

**Location**: `b3-erp/frontend/src/components/procurement/`

**Common Patterns**:
- Eye (View PO/vendor)
- Edit (Edit procurement data)
- MoreVertical (Procurement actions)
- Download (Export procurement reports)

### CRM Module (28 files, ~75 issues)

**Location**: `b3-erp/frontend/src/app/(modules)/crm/`

**Common Patterns**:
- Eye (View contact/lead)
- Edit (Edit CRM record)
- Copy (Duplicate lead/opportunity)
- Trash2 (Delete contact)
- Send (Send email/message)
- Phone (Call contact)
- Mail (Email contact)

### Logistics Module (21 files, ~55 issues)

**Location**: `b3-erp/frontend/src/app/(modules)/logistics/`

**Common Patterns**:
- Truck (Track shipment)
- Eye (View shipment details)
- Edit (Edit delivery)
- Download (Download shipping docs)

### Support Module (18 files, ~40 issues)

**Location**: `b3-erp/frontend/src/app/(modules)/support/`

**Common Patterns**:
- Eye (View ticket)
- Edit2 (Edit ticket)
- Copy (Duplicate template)
- Trash2 (Delete entry)
- Settings (Configure settings)

### Sales Module (13 files, ~30 issues)

**Location**: `b3-erp/frontend/src/app/(modules)/sales/`

**Common Patterns**:
- Eye (View order/quotation)
- Edit (Edit sales data)
- Download (Download invoice)
- Copy (Duplicate quotation)

---

## Testing & Validation

### Manual Testing with Screen Readers

**Tools**:
- **NVDA** (Windows): Free, open-source
- **JAWS** (Windows): Industry standard
- **VoiceOver** (macOS/iOS): Built-in
- **TalkBack** (Android): Built-in

**Test Steps**:
1. Enable screen reader
2. Navigate to a button using Tab key
3. Verify the screen reader announces the button's purpose
4. Activate the button using Enter/Space
5. Confirm the action matches the announced purpose

### Automated Testing

**axe DevTools**:
```bash
npm install --save-dev @axe-core/playwright
```

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/crm/contacts');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

**ESLint Plugin**:
```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

```json
// .eslintrc.json
{
  "extends": [
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "jsx-a11y/control-has-associated-label": "error"
  }
}
```

### Visual Regression Testing

Ensure aria-label additions don't affect visual appearance:

```typescript
// tests/visual.spec.ts
import { test, expect } from '@playwright/test';

test('button appearance unchanged', async ({ page }) => {
  await page.goto('/finance/accounts-receivable');
  await expect(page).toHaveScreenshot('finance-buttons.png');
});
```

---

## Automated Tools

See companion files:
- **fix-accessibility.ts**: Automated remediation script
- **aria-label-config.ts**: Centralized label configuration
- **accessibility-test-utils.ts**: Testing utilities

### Quick Fix Script Usage

```bash
# Fix all Common Masters
npm run fix-a11y -- --module common-masters

# Fix specific file
npm run fix-a11y -- --file src/components/finance/AccountsReceivableManagement.tsx

# Dry run (preview changes)
npm run fix-a11y -- --module finance --dry-run

# Fix all modules
npm run fix-a11y -- --all
```

---

## Progress Tracking

Use the checklist in `BUTTONS_CONTENT_AUDIT.md` to track progress:

- [ ] 288 files total
- [ ] Phase 1: Common Masters (29 files)
- [ ] Phase 1: Shared Components (3 files)
- [ ] Phase 2: Finance (18 files)
- [ ] Phase 2: Procurement (19 files)
- [ ] Phase 2: CRM (28 files)
- [ ] Phase 2: Logistics (21 files)
- [ ] Phase 3: Remaining modules (170 files)

---

## Best Practices Going Forward

### 1. Component Library Standards

Create accessible button components by default:

```tsx
// components/ui/button.tsx
export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ children, icon: Icon, iconLabel, ...props }, ref) => {
  if (Icon && !children && !iconLabel) {
    console.warn('Icon-only button missing iconLabel prop');
  }

  return (
    <button
      ref={ref}
      aria-label={iconLabel}
      {...props}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
});
```

### 2. Code Review Checklist

- [ ] All buttons have visible text OR aria-label
- [ ] aria-label describes the action, not the icon
- [ ] Context is included when necessary (e.g., "Edit user" not just "Edit")
- [ ] Disabled buttons have aria-disabled="true"
- [ ] Button groups have proper role and aria-label

### 3. Pre-commit Hooks

```bash
# .husky/pre-commit
npm run lint
npm run test:a11y
```

### 4. Documentation

Document accessibility requirements in component READMEs:

```markdown
## Accessibility

This component follows WCAG 2.1 Level AA standards:
- All interactive elements have accessible names
- Keyboard navigation is fully supported
- Screen reader tested with NVDA and VoiceOver
```

---

## Resources

### WCAG Guidelines
- [WCAG 2.1 Success Criterion 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)
- [Using ARIA Labels](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### Testing
- [Screen Reader Testing Guide](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Accessibility](https://webaim.org/techniques/keyboard/)

---

## Support

For questions or assistance with remediation:
1. Review this guide
2. Check the automated tools
3. Consult the button type reference
4. Review WCAG documentation

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Maintainer**: Accessibility Team
