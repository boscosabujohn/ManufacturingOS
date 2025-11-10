# ManufacturingOS ERP - Landing Page

## Overview
The landing page has been created with a comprehensive dashboard that displays all modules as interactive cards.

## Features

### 🎯 Main Dashboard (`/dashboard`)
- **Header**: Contains logo, search bar, notifications, and user profile
- **Quick Stats**: 4 key metrics at a glance
  - Total Orders
  - Revenue
  - Production
  - Inventory Items
- **Module Grid**: 13 interactive module cards with:
  - Custom icons and colors
  - Module descriptions
  - Real-time statistics (total items & new items)
  - Hover effects with smooth transitions
  - Direct navigation to each module

### 📦 Available Modules

1. **CRM** - Customer Relationship Management (Blue)
2. **Sales** - Sales Order Management (Green)
3. **Estimation** - Cost Estimation & Quotations (Purple)
4. **Inventory** - Warehouse & Stock Management (Orange)
5. **Production** - Production Planning & Control (Red)
6. **Procurement** - Purchase Order Management (Indigo)
7. **Finance** - Financial Accounting (Yellow)
8. **HR** - Human Resource Management (Pink)
9. **Workflow** - Workflow Automation (Cyan)
10. **Reports** - Report Generation & Analytics (Teal)
11. **Logistics** - Logistics & Transportation (Lime)
12. **Support** - Customer Support & Incidents (Rose)
13. **IT Admin** - System Administration (Gray)

### 🔍 Search Functionality
- Real-time search across module names and descriptions
- Instant filtering of displayed modules

### 🎨 Design Features
- **Responsive Grid Layout**: 1-4 columns based on screen size
- **Color-Coded Modules**: Each module has a unique brand color
- **Smooth Animations**: Hover effects, transitions, and scale transforms
- **Clean UI**: Modern, professional design with Tailwind CSS
- **Accessibility**: Clear navigation and readable typography

## Navigation Flow

```
Home (/) → Redirects to Dashboard (/dashboard)
Dashboard → Module Cards → Individual Module Pages
Each Module Page → Back to Dashboard button
```

## File Structure

```
frontend/src/app/
├── page.tsx                    # Home (redirects to dashboard)
├── (dashboard)/
│   ├── page.tsx               # Main landing page with module cards
│   ├── layout.tsx             # Dashboard layout
│   ├── crm/
│   │   └── page.tsx          # CRM module (example with sub-modules)
│   ├── sales/
│   │   └── page.tsx          # Sales module
│   ├── inventory/
│   │   └── page.tsx          # Inventory module
│   ├── production/
│   │   └── page.tsx          # Production module
│   └── finance/
│       └── page.tsx          # Finance module
```

## Usage

1. **Access the Dashboard**:
   - Navigate to `http://localhost:3000`
   - Automatically redirects to `/dashboard`

2. **Search Modules**:
   - Use the search bar in the header
   - Type module name or description

3. **Access Modules**:
   - Click on any module card
   - Navigate to the specific module page

4. **Return to Dashboard**:
   - Click "Back to Dashboard" link on any module page

## Customization

### Adding New Modules
Edit `/frontend/src/app/(dashboard)/page.tsx`:

```typescript
const modules = [
  {
    id: 'new-module',
    name: 'New Module',
    description: 'Module description',
    icon: IconComponent,
    href: '/new-module',
    color: 'bg-color-500',
    stats: { total: 0, new: 0 },
  },
  // ... existing modules
];
```

### Changing Colors
Each module uses Tailwind color classes. Update the `color` property:
- `bg-blue-500`, `bg-green-500`, etc.

### Updating Stats
Stats are currently static. To make them dynamic:
1. Create API endpoint in backend
2. Fetch data using React Query
3. Update module stats in real-time

## Next Steps

1. Install dependencies: `cd frontend && npm install`
2. Run development server: `npm run dev`
3. Build individual module pages with actual functionality
4. Integrate with backend API
5. Add authentication layer
6. Implement real-time stats updates

The TypeScript errors will resolve once you install the npm dependencies.
