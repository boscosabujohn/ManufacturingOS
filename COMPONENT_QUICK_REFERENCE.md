# UI Component Library - Quick Reference

**Quick access guide for B3 ERP shared components**

---

## 🎯 Quick Selection Guide

| Need | Component | File |
|------|-----------|------|
| Show metric/KPI | KPICard | `ui/KPICard.tsx` |
| Display table/list | DataTable | `ui/DataTable.tsx` |
| Add filters | FilterPanel | `ui/FilterPanel.tsx` |
| Show empty state | EmptyState | `ui/EmptyState.tsx` |
| Show loading | LoadingState | `ui/LoadingState.tsx` |
| Wrap charts | ChartWrapper | `ui/ChartWrapper.tsx` |
| Page header | PageToolbar | `ui/PageToolbar.tsx` |
| Status badge | StatusBadge | `ui/StatusBadge.tsx` |

---

## 📦 Import Examples

```tsx
// Single import
import { KPICard } from '@/components/ui';

// Multiple imports
import {
  KPICard,
  DataTable,
  EmptyState,
  LoadingState,
  PageToolbar
} from '@/components/ui';

// With types
import {
  DataTable,
  type Column,
  type DataTableProps
} from '@/components/ui';
```

---

## 🎨 KPICard - Metrics Display

**Basic:**
```tsx
<KPICard
  title="Total Sales"
  value={12500}
  icon={DollarSign}
  color="green"
/>
```

**With Trend:**
```tsx
<KPICard
  title="Revenue"
  value="₹15.2Cr"
  icon={TrendingUp}
  color="blue"
  trend={{ value: 12.5, isPositive: true, label: 'from last month' }}
  description="Target: ₹20Cr"
/>
```

**Clickable:**
```tsx
<KPICard
  title="Pending Orders"
  value={45}
  icon={Package}
  color="yellow"
  onClick={() => router.push('/orders/pending')}
/>
```

**Colors:** `blue` `green` `red` `yellow` `purple` `indigo` `cyan` `gray`

---

## 📊 DataTable - List Views

**Basic:**
```tsx
<DataTable
  data={items}
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' }
  ]}
/>
```

**With Custom Rendering:**
```tsx
<DataTable
  data={leads}
  columns={[
    {
      key: 'name',
      header: 'Lead',
      sortable: true,
      render: (lead) => (
        <div>
          <div className="font-medium">{lead.name}</div>
          <div className="text-sm text-gray-500">{lead.company}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => (
        <span className={statusColors[lead.status]}>
          {lead.status}
        </span>
      )
    }
  ]}
  pagination={{ enabled: true, pageSize: 10 }}
  sorting={{ enabled: true }}
  onRowClick={(lead) => viewDetails(lead)}
/>
```

**With Selection:**
```tsx
<DataTable
  data={items}
  columns={columns}
  selectable={true}
  onRowClick={handleClick}
/>
```

---

## 🔍 FilterPanel - Search & Filter

**Basic:**
```tsx
<FilterPanel
  filters={[
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]}
  activeFilters={{ status: 'all' }}
  onFilterChange={(id, value) => setFilters({...filters, [id]: value})}
  onClearAll={() => setFilters(defaultFilters)}
/>
```

**Multiple Filter Types:**
```tsx
<FilterPanel
  filters={[
    {
      id: 'search',
      label: 'Search',
      type: 'search',
      placeholder: 'Search by name...'
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'checkbox',
      options: priorityOptions
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'daterange'
    }
  ]}
  activeFilters={filters}
  onFilterChange={handleFilterChange}
  onClearAll={clearAllFilters}
  collapsible={true}
/>
```

**Types:** `checkbox` `radio` `select` `search` `daterange`

---

## 📭 EmptyState - No Data

**Basic:**
```tsx
<EmptyState
  icon={Users}
  title="No leads yet"
  description="Get started by adding your first lead."
  action={{
    label: "Add Lead",
    onClick: () => router.push('/leads/add'),
    icon: Plus
  }}
/>
```

**With Filters:**
```tsx
<EmptyState
  icon={Search}
  title="No results found"
  description="Try adjusting your search or filters."
  action={{
    label: "Add New",
    onClick: handleAdd,
    icon: Plus
  }}
  secondaryAction={{
    label: "Clear Filters",
    onClick: clearFilters
  }}
  size="md"
/>
```

**Sizes:** `sm` `md` `lg`

---

## ⏳ LoadingState - Loading Indicators

**Basic:**
```tsx
<LoadingState message="Loading data..." />
```

**Variants:**
```tsx
// Spinner (default)
<LoadingState variant="spinner" />

// Skeleton
<LoadingState variant="skeleton" />

// Dots
<LoadingState variant="dots" />
```

**Specialized Skeletons:**
```tsx
// Card metrics
<CardSkeleton />

// Data tables
<TableSkeleton rows={5} columns={4} />

// Charts
<ChartSkeleton height="h-96" />
```

**Conditional Rendering:**
```tsx
{isLoading ? (
  <LoadingState />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <DataTable data={data} />
)}
```

---

## 📈 ChartWrapper - Chart Container

**Basic:**
```tsx
<ChartWrapper
  title="Sales Trend"
  description="Monthly sales over the past year"
>
  <LineChart data={chartData} />
</ChartWrapper>
```

**With Actions:**
```tsx
<ChartWrapper
  title="Revenue Analysis"
  description="Revenue breakdown by category"
  showRefresh={true}
  showDownload={true}
  showFullscreen={true}
  onRefresh={loadData}
  onDownload={exportData}
  onFullscreen={toggleFullscreen}
  height="h-96"
>
  <BarChart data={data} />
</ChartWrapper>
```

**With Loading/Error:**
```tsx
<ChartWrapper
  title="User Growth"
  loading={isLoading}
  error={error}
  isEmpty={data.length === 0}
  emptyMessage="No data available for selected period"
>
  <AreaChart data={data} />
</ChartWrapper>
```

---

## 🧭 PageToolbar - Page Headers

**Basic:**
```tsx
<PageToolbar
  title="Customers"
  subtitle="Manage your customer database"
  breadcrumbs={[
    { label: 'CRM', href: '/crm' },
    { label: 'Customers' }
  ]}
  actions={[
    {
      label: 'Add Customer',
      icon: Plus,
      variant: 'primary',
      href: '/customers/add'
    }
  ]}
/>
```

**Full Featured:**
```tsx
<PageToolbar
  title="Support Tickets"
  subtitle={`${total} tickets · ${open} open`}
  breadcrumbs={[
    { label: 'Support', href: '/support' },
    { label: 'Tickets' }
  ]}
  actions={[
    {
      label: 'Export',
      icon: Download,
      variant: 'secondary',
      onClick: handleExport
    },
    {
      label: 'New Ticket',
      icon: Plus,
      variant: 'primary',
      href: '/tickets/create'
    }
  ]}
  tabs={[
    { id: 'all', label: 'All', count: total },
    { id: 'open', label: 'Open', count: open },
    { id: 'closed', label: 'Closed', count: closed }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  searchPlaceholder="Search tickets..."
  onSearch={handleSearch}
  filterCount={activeFilters}
  onFilterToggle={toggleFilters}
/>
```

**Variants:** `primary` `secondary` `ghost` `danger`

---

## 🏷️ StatusBadge - Status Indicators

**Basic:**
```tsx
<StatusBadge status="implemented" />
<StatusBadge status="in-progress" />
<StatusBadge status="planned" />
<StatusBadge status="coming-soon" />
<StatusBadge status="deprecated" />
```

**Custom Label:**
```tsx
<StatusBadge
  status="implemented"
  label="Ready"
  showIcon={true}
  size="md"
/>
```

**With Navigation:**
```tsx
<NavItemWithStatus
  href="/feature/upcoming"
  showStatusBadges={true}
>
  <span>Upcoming Feature</span>
</NavItemWithStatus>
```

**Sizes:** `sm` `md`

---

## 🎨 Common Patterns

### Dashboard Layout
```tsx
<div className="p-6 space-y-6">
  {/* Metrics */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {isLoading ? (
      <>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </>
    ) : (
      <>
        <KPICard title="Metric 1" value={value1} />
        <KPICard title="Metric 2" value={value2} />
        <KPICard title="Metric 3" value={value3} />
        <KPICard title="Metric 4" value={value4} />
      </>
    )}
  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <ChartWrapper title="Chart 1">
      <Chart1 />
    </ChartWrapper>
    <ChartWrapper title="Chart 2">
      <Chart2 />
    </ChartWrapper>
  </div>
</div>
```

### List Page Layout
```tsx
<div className="p-6 space-y-6">
  <PageToolbar
    title="Items"
    breadcrumbs={breadcrumbs}
    actions={actions}
  />

  <FilterPanel
    filters={filters}
    activeFilters={activeFilters}
    onFilterChange={handleFilterChange}
  />

  {isLoading ? (
    <TableSkeleton />
  ) : filteredItems.length === 0 ? (
    <EmptyState
      title="No items"
      action={{ label: "Add Item", onClick: handleAdd }}
    />
  ) : (
    <DataTable
      data={filteredItems}
      columns={columns}
      pagination={{ enabled: true }}
    />
  )}
</div>
```

### Analytics Page Layout
```tsx
<div className="p-6 space-y-6">
  <PageToolbar title="Analytics" breadcrumbs={breadcrumbs} />

  {/* KPIs */}
  <div className="grid grid-cols-4 gap-4">
    <KPICard title="KPI 1" value={kpi1} />
    <KPICard title="KPI 2" value={kpi2} />
    <KPICard title="KPI 3" value={kpi3} />
    <KPICard title="KPI 4" value={kpi4} />
  </div>

  {/* Charts */}
  <ChartWrapper
    title="Main Trend"
    showRefresh={true}
    showDownload={true}
    onRefresh={refresh}
    onDownload={download}
    loading={isLoading}
  >
    <TrendChart data={data} />
  </ChartWrapper>

  <div className="grid grid-cols-2 gap-6">
    <ChartWrapper title="Breakdown">
      <PieChart data={breakdown} />
    </ChartWrapper>
    <ChartWrapper title="Comparison">
      <BarChart data={comparison} />
    </ChartWrapper>
  </div>
</div>
```

---

## 🐛 Common Pitfalls

### ❌ Don't
```tsx
// Don't use reserved keywords
const stats = { new: 5 }  // ERROR!

// Don't forget loading states
<DataTable data={data} />  // Bad UX

// Don't use inline styles
<div style={{color: 'red'}}>  // Inconsistent

// Don't duplicate code
{items.map(item => <div className="...">{item}</div>)}  // Repetitive
```

### ✅ Do
```tsx
// Use descriptive names
const stats = { newItems: 5 }  // Good!

// Always add loading states
{isLoading ? <LoadingState /> : <DataTable data={data} />}  // Better UX

// Use Tailwind classes
<div className="text-red-600">  // Consistent

// Use shared components
<DataTable data={items} columns={columns} />  // Reusable
```

---

## 📖 Additional Resources

- **Full Documentation:** `UI_UX_ENHANCEMENT_SUMMARY.md`
- **Component README:** `src/components/ui/README.md`
- **Example Pages:**
  - Dashboards: `/support/page.tsx`
  - Lists: `/crm/leads/page.tsx`
  - Analytics: `/support/analytics/csat/page.tsx`

---

*Last Updated: 2025-10-24*
