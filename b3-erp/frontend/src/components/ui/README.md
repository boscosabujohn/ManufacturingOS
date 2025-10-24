# Shared UI Primitives Library

A comprehensive collection of reusable UI components for the B3 ERP system. These components provide consistent design patterns, accessibility features, and common functionality across all modules.

## 📦 Available Components

### 1. **KPI Card** (`KPICard.tsx`)
Display key performance indicators with optional trends, icons, and loading states.

```tsx
import { KPICard } from '@/components/ui';
import { DollarSign } from 'lucide-react';

<KPICard
  title="Total Revenue"
  value="$125,430"
  icon={DollarSign}
  color="blue"
  trend={{ value: 12.5, isPositive: true, label: 'vs last month' }}
  description="Year to date"
  loading={false}
  onClick={() => console.log('Clicked')}
/>
```

**Props:**
- `title` (string) - Label for the metric
- `value` (string | number) - Main value to display
- `icon` (LucideIcon) - Optional icon component
- `color` - Theme color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'cyan' | 'gray'
- `trend` - Optional trend indicator with value, direction, and label
- `description` (string) - Additional context
- `loading` (boolean) - Show skeleton loader
- `onClick` (function) - Make card clickable

---

### 2. **Empty State** (`EmptyState.tsx`)
Display friendly messages when no data is available.

```tsx
import { EmptyState } from '@/components/ui';
import { Inbox, Plus } from 'lucide-react';

<EmptyState
  icon={Inbox}
  title="No orders found"
  description="Get started by creating your first order"
  size="md"
  action={{
    label: 'Create Order',
    onClick: () => navigate('/orders/new'),
    icon: Plus
  }}
  secondaryAction={{
    label: 'Learn More',
    onClick: () => openHelp()
  }}
/>
```

**Props:**
- `icon` (LucideIcon) - Icon to display (defaults to Inbox)
- `title` (string) - Main message
- `description` (string) - Additional explanation
- `size` - 'sm' | 'md' | 'lg'
- `action` - Primary action button with label, onClick, and optional icon
- `secondaryAction` - Secondary action button
- `children` - Custom content below actions

---

### 3. **Loading State** (`LoadingState.tsx`)
Various loading indicators and skeleton loaders.

```tsx
import { LoadingState, TableSkeleton, CardSkeleton, ChartSkeleton } from '@/components/ui';

// Spinner with message
<LoadingState
  message="Loading data..."
  size="md"
  variant="spinner"
  fullScreen={false}
/>

// Dots animation
<LoadingState variant="dots" size="lg" />

// Skeleton text
<LoadingState variant="skeleton" />

// Specialized skeletons
<TableSkeleton rows={5} />
<CardSkeleton />
<ChartSkeleton height="h-64" />
```

**Variants:**
- `spinner` - Rotating spinner with optional message
- `dots` - Bouncing dots animation
- `skeleton` - Content placeholder animation

**Specialized Components:**
- `TableSkeleton` - Mimics table structure
- `CardSkeleton` - Mimics card layout
- `ChartSkeleton` - Mimics chart appearance

---

### 4. **Filter Panel** (`FilterPanel.tsx`)
Collapsible filter panel with multiple filter types.

```tsx
import { FilterPanel } from '@/components/ui';

const filters = [
  {
    id: 'status',
    label: 'Status',
    type: 'checkbox',
    options: [
      { label: 'Active', value: 'active', count: 24 },
      { label: 'Pending', value: 'pending', count: 12 },
      { label: 'Completed', value: 'completed', count: 156 }
    ]
  },
  {
    id: 'owner',
    label: 'Assigned To',
    type: 'select',
    options: [
      { label: 'John Doe', value: 'john' },
      { label: 'Jane Smith', value: 'jane' }
    ],
    placeholder: 'Select owner...'
  },
  {
    id: 'dateRange',
    label: 'Date Range',
    type: 'daterange'
  }
];

<FilterPanel
  filters={filters}
  activeFilters={activeFilters}
  onFilterChange={(filterId, value) => setActiveFilters({ ...activeFilters, [filterId]: value })}
  onClearAll={() => setActiveFilters({})}
  collapsible={true}
  showApplyButton={true}
  onApply={() => applyFilters()}
/>
```

**Filter Types:**
- `checkbox` - Multiple selection
- `radio` - Single selection
- `select` - Dropdown selection
- `search` - Text input
- `daterange` - Start and end date inputs

---

### 5. **Data Table** (`DataTable.tsx`)
Feature-rich data table with sorting, pagination, and selection.

```tsx
import { DataTable, Column } from '@/components/ui';
import { Eye, Edit, Trash2 } from 'lucide-react';

const columns: Column[] = [
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true,
    width: 'w-1/4'
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {value}
      </span>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: (row) => row,
    align: 'right',
    render: (_, row) => (
      <div className="flex gap-2 justify-end">
        <button onClick={() => view(row)}><Eye className="w-4 h-4" /></button>
        <button onClick={() => edit(row)}><Edit className="w-4 h-4" /></button>
        <button onClick={() => remove(row)}><Trash2 className="w-4 h-4" /></button>
      </div>
    )
  }
];

<DataTable
  data={items}
  columns={columns}
  loading={loading}
  emptyMessage="No items found"
  selectable={true}
  onSelectionChange={(selected) => setSelectedItems(selected)}
  pagination={{
    enabled: true,
    pageSize: 10,
    currentPage: 1,
    onPageChange: (page) => setPage(page)
  }}
  sorting={{
    enabled: true,
    defaultSort: { column: 'name', direction: 'asc' }
  }}
  onRowClick={(row) => navigate(`/items/${row.id}`)}
/>
```

**Features:**
- ✅ Column sorting (asc/desc)
- ✅ Pagination with page size control
- ✅ Row selection (single/multiple)
- ✅ Custom cell rendering
- ✅ Loading and empty states
- ✅ Clickable rows
- ✅ Responsive design

---

### 6. **Chart Wrapper** (`ChartWrapper.tsx`)
Wrapper for charts with loading, error, and empty states.

```tsx
import { ChartWrapper } from '@/components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Share2 } from 'lucide-react';

<ChartWrapper
  title="Revenue Trend"
  description="Monthly revenue for the last 12 months"
  loading={loading}
  error={error}
  isEmpty={data.length === 0}
  emptyMessage="No revenue data available"
  showDownload={true}
  showRefresh={true}
  showFullscreen={true}
  onDownload={() => exportChart()}
  onRefresh={() => refetchData()}
  onFullscreen={() => openFullscreen()}
  actions={[
    {
      label: 'Share Chart',
      icon: Share2,
      onClick: () => shareChart()
    },
    {
      label: 'View Details',
      onClick: () => navigate('/revenue-details')
    }
  ]}
  height="h-96"
>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</ChartWrapper>
```

**Features:**
- ✅ Loading skeleton
- ✅ Error handling with retry
- ✅ Empty state support
- ✅ Quick actions (download, refresh, fullscreen)
- ✅ Custom action menu
- ✅ Consistent styling

---

## 🎨 Color Palette

All components use a consistent color system:

- **Blue** - Primary actions, information
- **Green** - Success, positive trends
- **Red** - Errors, destructive actions, negative trends
- **Yellow** - Warnings, pending states
- **Purple** - Special features
- **Indigo** - Alternative primary
- **Cyan** - Highlights
- **Gray** - Neutral, default

---

## 🚀 Usage Example

Here's a complete example combining multiple primitives:

```tsx
import {
  KPICard,
  FilterPanel,
  DataTable,
  EmptyState,
  LoadingState
} from '@/components/ui';
import { DollarSign, ShoppingCart } from 'lucide-react';

function OrdersDashboard() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [orders, setOrders] = useState([]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Orders"
          value={1234}
          icon={ShoppingCart}
          color="blue"
          trend={{ value: 8.3, isPositive: true }}
        />
        <KPICard
          title="Revenue"
          value="$45,230"
          icon={DollarSign}
          color="green"
          trend={{ value: 12.5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters */}
        <div className="col-span-3">
          <FilterPanel
            filters={filterConfig}
            activeFilters={filters}
            onFilterChange={(id, value) => setFilters({ ...filters, [id]: value })}
            onClearAll={() => setFilters({})}
          />
        </div>

        {/* Data Table */}
        <div className="col-span-9">
          {loading ? (
            <LoadingState message="Loading orders..." />
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders found"
              description="Try adjusting your filters"
            />
          ) : (
            <DataTable
              data={orders}
              columns={orderColumns}
              pagination={{ enabled: true, pageSize: 20 }}
              sorting={{ enabled: true }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 Best Practices

1. **Always show loading states** - Use `LoadingState` or skeleton loaders while fetching data
2. **Handle empty states** - Use `EmptyState` with helpful messages and actions
3. **Provide feedback** - Use trends in KPI cards, selection counts in tables
4. **Keep it accessible** - All components include proper ARIA attributes
5. **Stay consistent** - Use the same color palette and patterns across modules
6. **Responsive design** - All components work on mobile, tablet, and desktop

---

## 🔧 Customization

All components accept a `className` prop for additional styling:

```tsx
<KPICard
  className="shadow-lg hover:shadow-xl"
  // other props
/>
```

Use Tailwind classes to customize spacing, colors, and layout as needed.

---

## 📚 Related Documentation

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Recharts Documentation](https://recharts.org/)
