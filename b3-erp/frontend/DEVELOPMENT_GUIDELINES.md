# B3 MACBIS ERP - Development Guidelines

## Project Overview
**Company**: B3 MACBIS - Kitchen Manufacturing
**Developer**: KreupAI Technologies LLC
**Location**: India
**Industry**: Kitchen Manufacturing & Modular Kitchen Systems

---

## Table of Contents
1. [UI/UX Standards](#uiux-standards)
2. [Pagination Implementation](#pagination-implementation)
3. [Indian Localization](#indian-localization)
4. [Data Tables & Grids](#data-tables--grids)
5. [Forms & Validation](#forms--validation)
6. [Branding Guidelines](#branding-guidelines)

---

## UI/UX Standards

### Layout Structure
- **Main Container**: Always use `min-h-screen` instead of `h-full` for proper scrolling
- **Content Padding**: Use `px-4 sm:px-6 lg:px-8 py-6` for consistent spacing
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Scrollable Tables
All data tables/grids must have proper scrolling:

```tsx
<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
  <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
        {/* Table headers */}
      </thead>
      <tbody>
        {/* Table rows */}
      </tbody>
    </table>
  </div>
  {/* Pagination component goes here - outside scrolling area */}
</div>
```

### Key Points:
- Table wrapper: `overflow-x-auto` for horizontal scroll
- Table wrapper: `max-h-[calc(100vh-400px)] overflow-y-auto` for vertical scroll
- Table header: `sticky top-0` to keep header visible when scrolling
- Pagination: Place outside the scrolling div

---

## Pagination Implementation

### Standard Configuration
**All data grids/tables MUST include pagination with 10 items per page.**

### Required Imports
```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
```

### State Management
```tsx
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
```

### Pagination Logic
```tsx
// After filtering and sorting
const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
```

### UI Component (Place after table, outside scrolling div)
```tsx
{/* Pagination */}
<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
  <div className="text-sm text-gray-700">
    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} items
  </div>
  <div className="flex items-center space-x-2">
    <button
      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
    <div className="flex items-center space-x-1">
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page => {
          return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
        })
        .map((page, index, array) => (
          <div key={page} className="flex items-center">
            {index > 0 && array[index - 1] !== page - 1 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          </div>
        ))}
    </div>
    <button
      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
</div>
```

### Important Notes:
- Always use `paginatedItems` in the table body, not `filteredItems`
- Pagination automatically updates when filters are applied
- Ellipsis (...) shows for large page counts
- Previous/Next buttons disable at boundaries
- Active page highlighted in blue

---

## Indian Localization

### Currency
- **Symbol**: ₹ (Indian Rupees)
- **Format**: Lakhs and Crores system
  - 1 Lakh = 1,00,000 (₹1 L)
  - 1 Crore = 1,00,00,000 (₹1 Cr)

```tsx
const formatIndianCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatLakhsCrores = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return formatIndianCurrency(amount);
  }
};
```

### Tax & Registration Fields
- **GST Number**: Format `27AAAAA0000A1Z5` (GSTIN)
- **PAN Number**: Format `AAAPL1234C` (10 characters)
- **TAN Number**: Format `MUMM12345A` (TDS Tax Account Number)
- **Udyam Registration**: Format `UDYAM-MH-12-1234567` (MSME registration)
- **GST Types**: Regular, Composition, Unregistered

### Banking Fields
Indian banking system fields:
- **IFSC Code**: `HDFC0001234` (replaces SWIFT/BIC)
- **Branch Name**: `Andheri West, Mumbai` (replaces IBAN)
- **UPI ID**: `company@hdfcbank` (replaces Routing Number)
- **Bank Names**: HDFC Bank, ICICI Bank, SBI, Axis Bank, etc.

### Address Format
```typescript
interface Address {
  buildingFlat: string;      // Building 456, 3rd Floor
  localityArea: string;      // Andheri Industrial Estate
  city: string;              // Mumbai
  state: string;             // Maharashtra (dropdown)
  pinCode: string;           // 400053 (6 digits)
  country: string;           // India (default)
}
```

### Indian States (Dropdown)
Maharashtra, Karnataka, Tamil Nadu, Delhi, Gujarat, West Bengal, Rajasthan, Uttar Pradesh, Telangana, Kerala, Andhra Pradesh, Madhya Pradesh, Haryana, Punjab, Bihar, Odisha, Jharkhand, Chhattisgarh, Assam, Uttarakhand, Himachal Pradesh, Goa, Puducherry, Jammu and Kashmir, etc.

### Payment Terms (Indian Context)
- Advance Payment
- Net 15 days
- Net 30 days
- Net 45 days
- Net 60 days
- 30-60-90 days
- PDC (Post Dated Cheque)
- Against Delivery
- LC (Letter of Credit)

### Payment Methods (Indian Context)
- NEFT/RTGS
- UPI
- Cheque
- Cash
- Demand Draft
- IMPS
- LC (Letter of Credit)

### Shipping/Delivery Terms
- Ex-Works (Factory)
- FOR Destination
- Door Delivery
- Freight Paid
- Freight To Pay
- FOB (for exports)
- CIF (for exports)

### Industry Sectors (Kitchen Manufacturing Focus)
- Modular Kitchen Dealers
- Interior Designers
- Real Estate Developers
- Architects
- Contractors & Builders
- Home Renovation Companies
- Furniture Retailers
- Wholesale Distributors
- Export Business
- Direct Consumers
- Hospitality & Hotels
- Corporate Office Fit-Out

### Indian Phone Format
`+91-XX-XXXX-XXXX` or `+91-XXXXX-XXXXX`

### Indian Email Domains
`.co.in`, `.in`, `.com`

### Sales Organizations (Regions)
- North Region - Delhi
- South Region - Bangalore
- South Region - Hyderabad
- South Region - Chennai
- West Region - Mumbai
- West Region - Pune
- West Region - Ahmedabad
- East Region - Kolkata
- Central Region - Bhopal

### Major Cities
Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Patna, Vadodara, Coimbatore, Kochi, Visakhapatnam, Surat

### Certifications (Indian Context)
- ISO 9001:2015
- ISO 14001
- BIS Certification
- ISI Mark
- FSC (Forest Stewardship Council)
- Green Building Certification
- Make in India Certified
- IGBC Certified

---

## Data Tables & Grids

### Checkbox Selection (Standard Feature)
All list pages should include row selection:

```tsx
// State
const [selectedItems, setSelectedItems] = useState<string[]>([]);

// Handlers
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    setSelectedItems(paginatedItems.map(item => item.id));
  } else {
    setSelectedItems([]);
  }
};

const handleSelectItem = (itemId: string) => {
  setSelectedItems(prev => {
    if (prev.includes(itemId)) {
      return prev.filter(id => id !== itemId);
    } else {
      return [...prev, itemId];
    }
  });
};

const isAllSelected = paginatedItems.length > 0 &&
  paginatedItems.every(item => selectedItems.includes(item.id));
```

### Table Header Checkbox
```tsx
<th className="px-4 py-3 text-left">
  <input
    type="checkbox"
    checked={isAllSelected}
    onChange={(e) => handleSelectAll(e.target.checked)}
    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
  />
</th>
```

### Table Row Checkbox
```tsx
<td className="px-4 py-3">
  <input
    type="checkbox"
    checked={selectedItems.includes(item.id)}
    onChange={() => handleSelectItem(item.id)}
    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
  />
</td>
```

### Bulk Actions Bar
Show when items are selected:

```tsx
{selectedItems.length > 0 && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-blue-900">
        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
      </span>
      <button
        onClick={() => setSelectedItems([])}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Clear selection
      </button>
    </div>
    <div className="flex items-center space-x-2">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
        Export Selected
      </button>
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
        Send Email
      </button>
      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
        Delete Selected
      </button>
    </div>
  </div>
)}
```

### Sorting
Make columns sortable:

```tsx
const [sortField, setSortField] = useState<keyof ItemType | null>(null);
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

const handleSort = (field: keyof ItemType) => {
  if (sortField === field) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortField(field);
    setSortDirection('asc');
  }
};

// Apply sorting before pagination
if (sortField) {
  filteredItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}
```

---

## Forms & Validation

### Multi-Step Forms
Use for complex forms (e.g., Customer, Order entry):

```tsx
const [currentStep, setCurrentStep] = useState(1);
const totalSteps = 7;

const steps = [
  { id: 1, name: 'General Data', icon: Building2 },
  { id: 2, name: 'Address Management', icon: MapPin },
  // ... more steps
];
```

### Progress Indicator
```tsx
<div className="mb-8">
  <div className="flex items-center justify-between">
    {steps.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentStep >= step.id
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}>
          <step.icon className="h-5 w-5" />
        </div>
        {index < steps.length - 1 && (
          <div className={`w-full h-1 mx-2 ${
            currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
          }`} />
        )}
      </div>
    ))}
  </div>
</div>
```

### Form Navigation
```tsx
<div className="flex justify-between mt-6">
  {currentStep > 1 && (
    <button
      onClick={() => setCurrentStep(currentStep - 1)}
      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      Previous
    </button>
  )}
  {currentStep < totalSteps ? (
    <button
      onClick={() => setCurrentStep(currentStep + 1)}
      className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Next
    </button>
  ) : (
    <button
      onClick={handleSubmit}
      className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Submit
    </button>
  )}
</div>
```

### Required Field Indicator
```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  Field Name <span className="text-red-500">*</span>
</label>
```

---

## Branding Guidelines

### Company Information
- **Company Name**: B3 MACBIS
- **Product**: Kitchen Manufacturing ERP
- **Developer**: KreupAI Technologies LLC

### Footer Branding
```tsx
<div className="text-center md:text-left">
  <p className="text-sm font-semibold text-gray-700 mb-1">
    B3 MACBIS - Kitchen Manufacturing ERP
  </p>
  <p className="text-xs text-gray-500">
    Powered by KreupAI Technologies LLC
  </p>
</div>
```

### Sidebar Footer
```tsx
{isOpen && (
  <div className="border-t border-gray-200 p-4 bg-white">
    <p className="text-xs text-gray-500 text-center">
      B3 MACBIS - Kitchen Manufacturing ERP
    </p>
    <p className="text-xs text-gray-400 text-center mt-1">
      Powered by KreupAI Technologies LLC
    </p>
  </div>
)}
```

### Header Branding
```tsx
<div className="flex-shrink-0">
  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
    B3 MACBIS
  </h1>
  <p className="text-xs text-gray-600 font-medium">
    Manufacturing ERP System
  </p>
</div>
```

---

## Color Scheme

### Primary Colors
- **Primary Blue**: `bg-blue-600`, `text-blue-600`
- **Indigo**: `bg-indigo-600` (gradients)
- **Gray Scale**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Status Colors
- **Success**: `bg-green-100 text-green-700`
- **Warning**: `bg-yellow-100 text-yellow-700`
- **Error**: `bg-red-100 text-red-700`
- **Info**: `bg-blue-100 text-blue-700`
- **Neutral**: `bg-gray-100 text-gray-700`

### Classification Colors
- **Class A**: `bg-green-100 text-green-700`
- **Class B**: `bg-blue-100 text-blue-700`
- **Class C**: `bg-gray-100 text-gray-700`

---

## Quick Reference Checklist

When creating a new list page:
- [ ] Use `min-h-screen` for main container
- [ ] Add scrollable table wrapper with max-height
- [ ] Make table header sticky (`sticky top-0`)
- [ ] Implement pagination (10 items per page)
- [ ] Add checkbox selection
- [ ] Add bulk actions bar
- [ ] Add sortable columns
- [ ] Add filters (search + advanced)
- [ ] Use Indian localization (currency, addresses, etc.)
- [ ] Add export functionality
- [ ] Include proper stats cards
- [ ] Add "Add New" button (prominent, top-right)

When creating a new form:
- [ ] Use multi-step for complex forms (5+ sections)
- [ ] Add progress indicator
- [ ] Use Indian field formats (GST, PAN, etc.)
- [ ] Add required field indicators (*)
- [ ] Include proper validation
- [ ] Add navigation (Previous/Next/Submit)
- [ ] Use consistent spacing and layout

When adding features:
- [ ] Follow existing patterns from Customers page
- [ ] Maintain consistent styling
- [ ] Test on mobile and desktop
- [ ] Ensure proper scrolling behavior
- [ ] Test pagination with filters
- [ ] Verify branding is correct

---

## File Naming Conventions

- **Pages**: `page.tsx` (Next.js App Router)
- **Dynamic Routes**: `[id]/page.tsx`
- **Components**: PascalCase (e.g., `CustomerForm.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)

---

## Important Notes

1. **Never use `h-full`** on main containers - always use `min-h-screen`
2. **Always add pagination** to data tables/grids
3. **Place pagination outside** the scrolling div
4. **Use Indian formats** for all currency, addresses, and business fields
5. **Keep branding consistent** across all pages
6. **Test scrolling** on both axes (horizontal and vertical)
7. **Make headers sticky** in scrollable tables
8. **Use 10 items per page** as standard

---

## Support

For questions or clarifications:
- Refer to existing implementations in `/src/app/(modules)/crm/customers/`
- Check this guideline document
- Contact the development team

---

**Document Version**: 1.0
**Last Updated**: October 2025
**Maintained by**: KreupAI Technologies LLC
