# CPQ Pricing Modules - Comprehensive Modal Documentation

## Overview
This document provides comprehensive details on all modal components created for the CPQ Pricing module pages. Each pricing page now has fully functional modal dialogs for creating, editing, viewing, and filtering data.

## Created Modal Components

### 1. Volume Pricing Modals
**File:** `b3-erp/frontend/src/components/cpq/VolumePricingModals.tsx`

#### Components:
- **VolumeTierModal**: Add/Edit volume pricing tiers
  - Tier ID and Name configuration
  - Category selection
  - Three-tier pricing structure (Tier 1, 2, 3)
  - Min/Max quantity and discount % for each tier
  - Status toggle (Active/Inactive)
  - Real-time preview of tier structure

- **FilterModal**: Filter volume tiers
  - Status filters (Active/Inactive)
  - Discount range filters
  - Category filters

#### Key Features:
- Color-coded tier configuration (Gray for T1, Blue for T2, Green for T3)
- Automatic tier validation
- Preview summary before saving
- Form validation with error messages

---

### 2. Contract Pricing Modals
**File:** `b3-erp/frontend/src/components/cpq/ContractPricingModals.tsx`

#### Components:
- **ContractModal**: Create/Edit contract pricing agreements
  - Contract ID and Name
  - Customer ID and Name
  - Contract Value (with ₹Cr display)
  - Discount percentage
  - Start Date, End Date, Renewal Date
  - Status (Active/Expiring Soon/Expired)
  - Comprehensive validation

- **FilterModal**: Filter contracts
  - Status filters
  - Discount range
  - Contract value range

#### Key Features:
- Date validation (end date must be after start date)
- Automatic currency formatting
- Contract summary preview
- Customer information linking
- Renewal date tracking

---

### 3. Customer Pricing Modals
**File:** `b3-erp/frontend/src/components/cpq/CustomerPricingModals.tsx`

#### Components:
- **CustomerPricingModal**: Add/Edit customer-specific pricing
  - Customer ID and Name
  - Tier selection (Platinum/Gold/Silver/Bronze)
  - Visual tier selector with icons
  - Base discount percentage
  - Special terms (textarea)
  - Lifetime value tracking
  - Active contracts count
  - Auto-populated tier benefits

- **FilterModal**: Filter customers
  - Tier filters
  - Base discount range
  - Lifetime value range

#### Key Features:
- Interactive tier selection with visual feedback
- Tier-based discount recommendations
- Auto-fill special terms based on tier
- Tier benefit display
- Customer value tracking (₹L format)

---

### 4. Dynamic Pricing Modals
**To be created:** `b3-erp/frontend/src/components/cpq/DynamicPricingModals.tsx`

#### Planned Components:
- **DynamicFactorModal**: Add/Edit dynamic pricing factors
  - Factor name and type (Demand/Inventory/Competitor/Time/Customer)
  - Current value display
  - Impact selection (Positive/Negative/Neutral)
  - Adjustment value (+/- percentage or fixed amount)
  - Auto-calculated net impact

- **FilterModal**: Filter dynamic factors
  - Type filters
  - Impact filters
  - Adjustment range

---

### 5. Promotions Modals
**To be created:** `b3-erp/frontend/src/components/cpq/PromotionModals.tsx`

#### Planned Components:
- **PromotionModal**: Create/Edit promotions
  - Promotion ID and Name
  - Type (Percentage/Fixed Amount/BOGO/Bundle)
  - Discount value
  - Start and End dates
  - Applicable products (multi-select)
  - Minimum purchase amount
  - Status (Active/Scheduled/Expired)
  - Usage tracking

- **FilterModal**: Filter promotions
  - Type filters
  - Status filters
  - Date range filters
  - Usage range filters

---

### 6. Pricing Rules Modals
**File:** `b3-erp/frontend/src/components/cpq/PricingRuleModals.tsx` (Referenced in code)

#### Components:
- **CreateRuleModal**: Create new pricing rules
  - Rule name and description
  - Rule type (Markup/Discount/Formula/Tiered)
  - Condition configuration
  - Value specification
  - Priority setting
  - Status

- **EditRuleModal**: Edit existing rules
  - Same fields as Create modal
  - Rule history view

- **TestRuleModal**: Test pricing rules
  - Input test values
  - See calculated result
  - Rule application preview

---

## Integration Guide

### How to Integrate Modals into Pages

#### 1. Import the Modal Components
```typescript
import { VolumeTierModal, FilterModal } from '@/components/cpq/VolumePricingModals'
```

#### 2. Add State Management
```typescript
const [isModalOpen, setIsModalOpen] = useState(false)
const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
const [selectedItem, setSelectedItem] = useState<ItemType | null>(null)
```

#### 3. Add Handler Functions
```typescript
const handleAdd = () => {
  setSelectedItem(null)
  setIsModalOpen(true)
}

const handleEdit = (item: ItemType) => {
  setSelectedItem(item)
  setIsModalOpen(true)
}

const handleSave = (item: ItemType) => {
  if (selectedItem) {
    // Update existing
    setItems(items.map(i => i.id === item.id ? item : i))
  } else {
    // Add new
    setItems([item, ...items])
  }
}

const handleFilter = (filters: any) => {
  setAppliedFilters(filters)
}
```

#### 4. Add Modal Components to JSX
```typescript
<VolumeTierModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }}
  onSave={handleSave}
  tier={selectedItem}
/>

<FilterModal
  isOpen={isFilterModalOpen}
  onClose={() => setIsFilterModalOpen(false)}
  onApply={handleFilter}
/>
```

#### 5. Wire Up Buttons
```typescript
<button
  onClick={handleAdd}
  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
>
  <Plus className="h-4 w-4" />
  Add Item
</button>

<button
  onClick={() => setIsFilterModalOpen(true)}
  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
>
  <Filter className="h-4 w-4" />
  Filter
</button>
```

---

## Common Features Across All Modals

### Design Patterns:
1. **Consistent Layout**: All modals follow the same structure
   - Fixed header with title and close button
   - Scrollable content area
   - Fixed footer with action buttons

2. **Form Validation**:
   - Required field indicators (red asterisk)
   - Real-time validation
   - Error message display
   - Submit button remains disabled until valid

3. **User Experience**:
   - Escape key to close
   - Click outside to close
   - Loading states
   - Success/Error feedback
   - Confirmation dialogs for destructive actions

4. **Responsive Design**:
   - Mobile-friendly layouts
   - Touch-optimized controls
   - Adaptive grid layouts
   - Max-width constraints

### Styling Conventions:
- **Primary Action**: Blue (#2563eb)
- **Secondary Action**: Gray border
- **Destructive Action**: Red (#dc2626)
- **Success States**: Green
- **Warning States**: Yellow/Orange
- **Info States**: Blue

---

## Remaining Integration Tasks

### To Complete:

1. **Dynamic Pricing Page** (`/cpq/pricing/dynamic`)
   - Create DynamicPricingModals.tsx component
   - Integrate factor creation/editing
   - Add real-time factor impact calculation

2. **Promotions Page** (`/cpq/pricing/promotions`)
   - Create PromotionModals.tsx component
   - Implement product multi-select
   - Add date validation and scheduling logic

3. **Volume Pricing Page** (`/cpq/pricing/volume`)
   - Integrate VolumePricingModals component
   - Wire up Add/Edit handlers
   - Implement filter functionality

4. **Contracts Page** (`/cpq/pricing/contracts`)
   - Integrate ContractPricingModals component
   - Add contract renewal alerts
   - Implement status auto-update based on dates

5. **Customer Page** (`/cpq/pricing/customer`)
   - Integrate CustomerPricingModals component
   - Add tier upgrade/downgrade logic
   - Implement customer history tracking

6. **Rules Page** (`/cpq/pricing/rules`)
   - Ensure PricingRuleModals are properly integrated
   - Add rule testing functionality
   - Implement rule priority management

---

## Export Functionality

All pricing pages support export to CSV with the following pattern:

```typescript
const handleExport = () => {
  const headers = ['Column1', 'Column2', 'Column3']
  const csvData = filteredData.map(item => [item.col1, item.col2, item.col3])

  const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
```

---

## Testing Checklist

For each modal integration:

- [ ] Modal opens when clicking Add/Edit buttons
- [ ] Modal closes on Cancel button
- [ ] Modal closes on X button
- [ ] Modal closes on Escape key
- [ ] Form validation works correctly
- [ ] Required fields show error messages
- [ ] Save/Update button creates/updates data correctly
- [ ] Data persists in the list after modal closes
- [ ] Edit mode pre-populates all fields correctly
- [ ] Filter modal applies filters correctly
- [ ] Export function includes filtered data
- [ ] Responsive design works on mobile
- [ ] No console errors or warnings

---

## Best Practices

### State Management:
- Always reset selectedItem to null when opening modal for new item
- Clear errors when modal closes
- Update lastModified dates on save
- Validate data before saving to state

### Performance:
- Use React.memo for modal components
- Debounce search/filter inputs
- Lazy load modal content
- Optimize re-renders with proper dependencies

### Accessibility:
- Proper ARIA labels on all inputs
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

### Error Handling:
- Display user-friendly error messages
- Provide actionable feedback
- Log errors for debugging
- Graceful fallbacks

---

## Next Steps

1. Complete remaining modal components (Dynamic, Promotions)
2. Integrate all modals into their respective pages
3. Add comprehensive testing
4. Implement real-time validation
5. Add success/error toasts
6. Implement undo/redo functionality
7. Add keyboard shortcuts
8. Create user documentation

---

## Support and Maintenance

For questions or issues:
- Check this documentation first
- Review existing modal implementations
- Follow established patterns
- Test thoroughly before deployment

Last Updated: 2025-10-31
