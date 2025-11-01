# CPQ Contracts - Complete Enterprise Implementation Guide

## Overview
This document provides the complete implementation for all 5 CPQ Contract pages with enterprise-ready features.

## Implementation Status

### ✅ Completed
1. **Contract Template Modals** - Full CRUD modals created in `ContractTemplateModals.tsx`

### 🔧 Required Implementation

## Page 1: Contract Templates (`/cpq/contracts/templates`)

### Modals Created: ✅
- `TemplateModal` - Create/Edit templates
- `ViewTemplateModal` - View template details
- `UseTemplateModal` - Generate contract from template
- `FilterModal` - Advanced filtering

### Integration Steps:
1. Add modal imports
2. Add state management (modal states, selected template)
3. Add handler functions (create, edit, view, use, export, filter, favorite toggle)
4. Update all button onClick handlers
5. Add modals at end of page
6. Implement filtering logic
7. Add search functionality

### Handler Functions Needed:
```typescript
- handleCreateTemplate()
- handleEditTemplate(template)
- handleViewTemplate(template)
- handleUseTemplate(template)
- handleSaveTemplate(data)
- handleToggleFavorite(template)
- handleExport()
- handleApplyFilters(filters)
- handleCategoryFilter(category)
```

---

## Page 2: Contract Generate (`/cpq/contracts/generate`)

### Modals Needed:
- `PreviewContractModal` - Live preview of contract
- `SaveDraftModal` - Save progress as draft
- `SelectTemplateModal` - Choose from templates
- `SelectClausesModal` - Browse clause library

### Features to Add:
1. Step-by-step wizard validation
2. Live preview functionality
3. Auto-save draft (every 30 seconds)
4. Template quick-fill
5. Dynamic clause selection
6. Payment milestone calculator
7. Contract value summary
8. PDF generation
9. Email to customer

### Handler Functions Needed:
```typescript
- handleTemplateSelect(templateId)
- handlePreview()
- handleSaveDraft()
- handleGenerate()
- handleStepValidation(step)
- handleAutoSave()
- handleClauseToggle(clauseId)
- handleMilestoneAdd()
- handleMilestoneRemove(id)
```

---

## Page 3: Contract Clauses (`/cpq/contracts/clauses`)

### Modals Needed:
- `ClauseModal` - Create/Edit clause with rich text editor
- `ViewClauseModal` - View full clause text
- `PreviewClauseModal` - Formatted preview
- `ClauseVersionModal` - View version history
- `FilterClauseModal` - Advanced filtering

### Features to Add:
1. Rich text editor for clause text
2. Version control system
3. Approval workflow
4. Category management
5. Contract type mapping
6. Usage analytics
7. Duplicate/customize functionality
8. Bulk operations

### Handler Functions Needed:
```typescript
- handleCreateClause()
- handleEditClause(clause)
- handleViewClause(clause)
- handlePreviewClause(clause)
- handleDuplicateClause(clause)
- handleApproveClause(clause)
- handleVersionHistory(clause)
- handleCategoryFilter(category)
- handleExport()
```

---

## Page 4: Contract Execution (`/cpq/contracts/execution`)

### Modals Needed:
- `ViewContractModal` - Full contract details
- `MilestoneTrackingModal` - Update milestone status
- `PaymentTrackingModal` - Record payments
- `RenewalModal` - Initiate contract renewal
- `CustomerContactModal` - Contact customer
- `DocumentsModal` - View/upload documents
- `AlertSettingsModal` - Configure alerts

### Features to Add:
1. Real-time status tracking
2. Milestone completion workflow
3. Payment recording system
4. Renewal reminder system
5. Document management
6. Customer communication log
7. Performance analytics
8. Contract amendments
9. Export reports

### Handler Functions Needed:
```typescript
- handleViewContract(contract)
- handleUpdateMilestone(milestone, status)
- handleRecordPayment(payment)
- handleRenew(contract)
- handleContactCustomer(contract)
- handleUploadDocument(file)
- handleDownloadContract(contract)
- handleSetAlert(contract, alertType)
- handleStatusFilter(status)
```

---

## Page 5: Contract Approvals (`/cpq/contracts/approvals`)

### Modals Needed:
- `ApprovalDetailsModal` - Full approval request details
- `ApproveModal` - Approve with comments
- `RejectModal` - Reject with reasons
- `CommentThreadModal` - View all comments
- `EscalateModal` - Escalate to higher authority
- `DelegateModal` - Delegate approval
- `ApprovalHistoryModal` - Complete audit trail

### Features to Add:
1. Approve/Reject with mandatory comments
2. Conditional approvals
3. Multi-level approval chain
4. Auto-escalation for overdue
5. Email notifications
6. Approval delegation
7. Bulk approvals
8. Priority handling
9. SLA tracking

### Handler Functions Needed:
```typescript
- handleViewApproval(approval)
- handleApprove(approval, comments, conditions)
- handleReject(approval, reason)
- handleAddComment(approval, comment)
- handleEscalate(approval)
- handleDelegate(approval, user)
- handleBulkApprove(approvals)
- handleStatusFilter(status)
```

---

## Common Features Across All Pages

### Search Functionality:
```typescript
const [searchQuery, setSearchQuery] = useState('')
const filtered = items.filter(item =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.id.toLowerCase().includes(searchQuery.toLowerCase())
)
```

### Export Functionality:
```typescript
const handleExport = () => {
  const csvContent = [
    ['Header1', 'Header2', ...].join(','),
    ...filteredItems.map(item => [
      item.field1,
      `"${item.field2}"`,
      ...
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `export-${Date.now()}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
```

### Filter State Management:
```typescript
const [appliedFilters, setAppliedFilters] = useState<any>(null)
const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null)

const filteredItems = items.filter(item => {
  const matchesSearch = searchQuery === '' || /* search logic */
  const matchesCategory = selectedCategoryFilter === null || item.category === selectedCategoryFilter
  const matchesAdvanced = !appliedFilters || /* advanced filter logic */
  return matchesSearch && matchesCategory && matchesAdvanced
})
```

---

## Implementation Priority

### Phase 1 - Critical (Week 1):
1. ✅ Contract Templates - Modals created
2. Contract Templates - Integration
3. Contract Approvals - Full implementation

### Phase 2 - High Priority (Week 2):
4. Contract Generate - Wizard implementation
5. Contract Execution - Tracking implementation

### Phase 3 - Standard (Week 3):
6. Contract Clauses - Library management

---

## Technical Patterns

### Modal State Pattern:
```typescript
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedItem, setSelectedItem] = useState<Type | null>(null)

const handleOpen = (item) => {
  setSelectedItem(item)
  setIsModalOpen(true)
}

const handleClose = () => {
  setIsModalOpen(false)
  setSelectedItem(null)
}
```

### Update State Pattern:
```typescript
const handleUpdate = (updatedItem) => {
  setItems(items.map(item =>
    item.id === updatedItem.id ? updatedItem : item
  ))
}
```

### Add Item Pattern:
```typescript
const handleAdd = (newItem) => {
  const item = {
    id: `PREFIX-${Date.now()}`,
    ...newItem,
    createdDate: new Date().toISOString()
  }
  setItems([...items, item])
}
```

---

## Next Steps

1. Integrate Contract Template modals (templates page)
2. Create and integrate remaining modal files
3. Add state management to all pages
4. Implement handler functions
5. Update all button onClick events
6. Add comprehensive filtering
7. Implement search functionality
8. Add export functionality
9. Test all workflows end-to-end

---

## Files Created

1. ✅ `/components/cpq/ContractTemplateModals.tsx`
2. ⏳ `/components/cpq/ContractGenerateModals.tsx`
3. ⏳ `/components/cpq/ContractClauseModals.tsx`
4. ⏳ `/components/cpq/ContractExecutionModals.tsx`
5. ⏳ `/components/cpq/ContractApprovalModals.tsx`

---

## Estimated Implementation Time

- Contract Templates Integration: 30 minutes
- Contract Generate Modals + Integration: 1.5 hours
- Contract Clauses Modals + Integration: 1.5 hours
- Contract Execution Modals + Integration: 2 hours
- Contract Approvals Modals + Integration: 2 hours

**Total: ~7.5 hours for complete enterprise-ready implementation**
