---
description: Optimize ERP page for high information density
---

# High-Density UI Optimization Workflow

This workflow documents the design changes applied to `/project-management` to increase information density and reduce wasted space. Apply these patterns consistently across all ERP module pages.

## 1. Global Layout Adjustments (DashboardLayout.tsx)

### Header Height Reduction
```diff
- <div className="flex justify-between items-center h-16 gap-4">
+ <div className="flex justify-between items-center h-12 gap-4">
```

### Sidebar-Content Gap Reduction
```diff
- ${sidebarOpen ? 'lg:ml-[315px]' : 'lg:ml-20'}
+ ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-20'}
```

---

## 2. Page-Level Spacing (page.tsx)

### Reduce Page Padding
```diff
- <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 space-y-6">
+ <div className="w-full min-h-screen px-3 py-2 space-y-3">
```

**Pattern**: `px-3 py-2 space-y-3` for compact layouts.

---

## 3. KPI/Statistics Cards

### Before (verbose)
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <p className="text-sm text-gray-600">Total Projects</p>
  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
  <div className="w-12 h-12 bg-blue-100 rounded-lg">
    <FolderKanban className="w-6 h-6" />
  </div>
</div>
```

### After (compact)
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Total Projects</p>
  <p className="text-xl font-black text-gray-900 leading-none mt-1">{stats.total}</p>
  <div className="w-8 h-8 bg-blue-50 rounded">
    <FolderKanban className="w-4 h-4" />
  </div>
</div>
```

**Key changes**:
- Padding: `p-6` → `p-3`
- Grid gap: `gap-6` → `gap-3`
- Label: `text-sm` → `text-[11px] font-bold uppercase`
- Value: `text-3xl` → `text-xl font-black`
- Icon container: `w-12 h-12` → `w-8 h-8`
- Icon: `w-6 h-6` → `w-4 h-4`

---

## 4. Consolidate Header + Filters (One-Line Bar)

### Before (separate sections)
```tsx
{/* Header Actions */}
<div className="flex justify-between items-center mb-4">
  <button className="px-4 py-2">Filters</button>
  <button className="px-4 py-2">Export</button>
</div>

{/* Filters */}
<div className="bg-white p-4">
  <input placeholder="Search..." className="pl-10 pr-4 py-2" />
  <select className="px-4 py-2">...</select>
</div>
```

### After (unified bar)
```tsx
<div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
  {/* Search */}
  <div className="relative flex-1 min-w-[200px]">
    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4" />
    <input className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg" />
  </div>

  {/* Inline Filters */}
  <select className="px-2 py-1.5 text-sm border rounded-lg">...</select>

  {/* Actions (pushed right) */}
  <div className="flex items-center gap-1.5 ml-auto">
    <button className="px-2.5 py-1.5 text-sm">Filters</button>
    <button className="px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white">New</button>
  </div>
</div>
```

**Key changes**:
- Single `flex flex-wrap` container with `gap-2` and `p-2`
- Search input: `pl-8 py-1.5 text-sm`
- Dropdowns: `px-2 py-1.5 text-sm`
- Buttons: `px-2.5 py-1.5 text-sm`
- Use `ml-auto` to push action buttons right

---

## 5. Table Density

### Table Headers
```diff
- <th className="px-6 py-3 text-xs font-medium">
+ <th className="px-3 py-2 text-[10px] font-bold uppercase">
```

### Table Cells
```diff
- <td className="px-6 py-4">
+ <td className="px-3 py-2">
```

### Cell Content
```tsx
// Compact project name
<div className="text-sm font-bold text-gray-900 leading-tight truncate max-w-[200px]">
  {project.name}
</div>

// Compact metadata
<span className="text-[10px] font-black text-gray-400">{project.code}</span>

// Compact status badge
<span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
  {project.status}
</span>

// Compact progress bar
<div className="w-24 bg-gray-100 rounded-full h-1">
  <div className="bg-blue-600 h-1 rounded-full" style={{width: `${progress}%`}} />
</div>
```

### Action Icons
```diff
- <button className="p-2"><Eye className="w-4 h-4" /></button>
+ <button className="p-1.5"><Eye className="w-3.5 h-3.5" /></button>
```

---

## 6. Quick Actions / Shortcuts Component

### Compact Variant
```tsx
<div className="bg-white rounded-lg border p-2">
  <div className="flex items-center gap-2 mb-2">
    <Sparkles className="w-4 h-4" />
    <h3 className="text-sm font-semibold">Quick Actions</h3>
  </div>
  <div className="flex flex-wrap gap-1.5">
    <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs">
      <Icon className="w-3.5 h-3.5" />
      <span>Label</span>
    </button>
  </div>
</div>
```

---

## Summary Checklist

When optimizing a new page, apply these changes in order:

// turbo-all
1. [ ] Reduce page wrapper: `px-3 py-2 space-y-3`
2. [ ] Compact KPI cards: `p-3`, smaller fonts/icons
3. [ ] Consolidate filters + actions into one-line bar
4. [ ] Reduce table padding: `px-3 py-2`
5. [ ] Use `text-[10px]`/`text-xs` for table content
6. [ ] Shrink icons: `w-3.5 h-3.5` and button padding `p-1.5`
7. [ ] Remove unnecessary margins (`mb-4` → `mb-2` or remove)
8. [ ] Verify build with `npx tsc --noEmit [file]`
9. [ ] Test page loads with `curl -s http://localhost:3000/[page] -o /dev/null -w "%{http_code}"`
