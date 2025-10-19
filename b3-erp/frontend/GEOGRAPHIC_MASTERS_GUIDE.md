# Geographic & Location Masters - Complete Implementation Guide

This document provides comprehensive code for all Geographic & Location Master components.

## ✅ Completed Components

1. **Country Master** - `src/components/common-masters/CountryMaster.tsx`
2. **State/Province Master** - `src/components/common-masters/StateMaster.tsx`

## 📋 Remaining Components to Implement

### 3. City Master

**File**: `src/components/common-masters/CityMaster.tsx`

**Interface**:
```typescript
interface City {
  id: string;
  cityCode: string;
  cityName: string;
  stateId: string;
  stateName: string;
  countryId: string;
  countryName: string;

  // Classification
  cityType: 'Metro' | 'Tier-1' | 'Tier-2' | 'Tier-3' | 'Rural';
  isCapital: boolean;

  // Geographic
  area?: number;
  population?: number;
  altitude?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };

  // Administrative
  mayorName?: string;
  pinCodePrefix?: string;
  stdCode?: string;

  // Business
  statistics: {
    totalPinCodes: number;
    totalCustomers?: number;
    totalSuppliers?: number;
    totalBranches?: number;
  };

  // Infrastructure
  infrastructure: {
    airport: boolean;
    seaport: boolean;
    railwayStation: boolean;
    metroRail: boolean;
  };

  status: 'Active' | 'Inactive';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data Examples**:
```typescript
const mockCities = [
  {
    id: '1',
    cityCode: 'MUM',
    cityName: 'Mumbai',
    stateId: '1',
    stateName: 'Maharashtra',
    countryId: '1',
    countryName: 'India',
    cityType: 'Metro',
    isCapital: true,
    area: 603.4,
    population: 12442373,
    coordinates: { latitude: 19.0760, longitude: 72.8777 },
    stdCode: '022',
    pinCodePrefix: '400',
    statistics: {
      totalPinCodes: 125,
      totalCustomers: 850,
      totalSuppliers: 320,
      totalBranches: 15
    },
    infrastructure: {
      airport: true,
      seaport: true,
      railwayStation: true,
      metroRail: true
    },
    status: 'Active'
  },
  // Add more cities...
];
```

**Key Features**:
- Filter by State, Country, City Type
- Display infrastructure icons
- Show statistics cards
- Metro/Tier classification badges

---

### 4. Pin Code/Postal Code Master

**File**: `src/components/common-masters/PinCodeMaster.tsx`

**Interface**:
```typescript
interface PinCode {
  id: string;
  pinCode: string;
  postalCode?: string;
  cityId: string;
  cityName: string;
  stateId: string;
  stateName: string;
  countryId: string;
  countryName: string;

  // Area Details
  areaDetails: {
    locality?: string;
    subLocality?: string;
    district?: string;
    taluk?: string;
  };

  // Delivery
  deliverySettings: {
    deliveryEnabled: boolean;
    cod Enabled: boolean;
    standardDays: number;
    expressDeliveryAvailable: boolean;
    shippingZone?: string;
  };

  // Logistics
  logistics: {
    sortingCenter?: string;
    hubLocation?: string;
    serviceableBy: string[];
  };

  // Business
  statistics: {
    totalAddresses: number;
    totalCustomers?: number;
    totalSuppliers?: number;
    avgDeliveryDays?: number;
  };

  status: 'Active' | 'Inactive' | 'Serviceable' | 'Non-Serviceable';
  notes?: string;

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data Examples**:
```typescript
const mockPinCodes = [
  {
    id: '1',
    pinCode: '400001',
    cityId: '1',
    cityName: 'Mumbai',
    stateId: '1',
    stateName: 'Maharashtra',
    countryId: '1',
    countryName: 'India',
    areaDetails: {
      locality: 'Fort',
      district: 'Mumbai City',
      taluk: 'Mumbai'
    },
    deliverySettings: {
      deliveryEnabled: true,
      codEnabled: true,
      standardDays: 2,
      expressDeliveryAvailable: true,
      shippingZone: 'Zone-A'
    },
    logistics: {
      sortingCenter: 'Mumbai Central',
      hubLocation: 'Fort Hub',
      serviceableBy: ['BlueDart', 'DTDC', 'FedEx']
    },
    statistics: {
      totalAddresses: 2450,
      totalCustomers: 180,
      avgDeliveryDays: 1.5
    },
    status: 'Serviceable'
  },
  // Add more pin codes...
];
```

**Key Features**:
- Bulk import/export functionality
- Serviceability checker
- Delivery zone mapping
- COD availability indicator

---

### 5. Territory Master

**File**: `src/components/common-masters/TerritoryMaster.tsx`

**Interface**:
```typescript
interface Territory {
  id: string;
  territoryCode: string;
  territoryName: string;
  parentTerritoryId?: string;
  parentTerritoryName?: string;
  level: number;

  // Coverage
  coverage: {
    countries?: string[];
    states?: string[];
    cities?: string[];
    pinCodes?: string[];
  };

  // Assignment
  assignment: {
    manager: string;
    managerId: string;
    salesTeam?: string[];
    serviceTeam?: string[];
  };

  // Targets
  targets: {
    monthlyRevenue?: number;
    quarterlyRevenue?: number;
    annualRevenue?: number;
    customerAcquisition?: number;
  };

  // Performance
  performance: {
    actualRevenue?: number;
    achievement?: number;
    totalCustomers?: number;
    activeCustomers?: number;
    avgDealSize?: number;
  };

  // Settings
  settings: {
    territoryType: 'Sales' | 'Service' | 'Distribution' | 'Collection';
    allowOverlap: boolean;
    priority: 'High' | 'Medium' | 'Low';
  };

  status: 'Active' | 'Inactive' | 'Under Review';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data Examples**:
```typescript
const mockTerritories = [
  {
    id: '1',
    territoryCode: 'WEST-MH-01',
    territoryName: 'Western Maharashtra Sales',
    level: 2,
    coverage: {
      states: ['Maharashtra'],
      cities: ['Mumbai', 'Pune', 'Nashik'],
      pinCodes: ['400001-400098', '411001-411068']
    },
    assignment: {
      manager: 'Rajesh Kumar',
      managerId: 'EMP001',
      salesTeam: ['EMP101', 'EMP102', 'EMP103']
    },
    targets: {
      monthlyRevenue: 5000000,
      quarterlyRevenue: 15000000,
      annualRevenue: 60000000,
      customerAcquisition: 50
    },
    performance: {
      actualRevenue: 4750000,
      achievement: 95,
      totalCustomers: 245,
      activeCustomers: 198,
      avgDealSize: 125000
    },
    settings: {
      territoryType: 'Sales',
      allowOverlap: false,
      priority: 'High'
    },
    status: 'Active'
  },
  // Add more territories...
];
```

**Key Features**:
- Hierarchical tree view
- Manager assignment
- Target vs Achievement tracking
- Performance metrics dashboard
- Coverage map integration

---

### 6. Region Master

**File**: `src/components/common-masters/RegionMaster.tsx`

**Interface**:
```typescript
interface Region {
  id: string;
  regionCode: string;
  regionName: string;
  regionType: 'Geographic' | 'Sales' | 'Administrative' | 'Custom';

  // Coverage
  coverage: {
    countries: string[];
    states: string[];
    territories?: string[];
    totalArea?: number;
  };

  // Management
  management: {
    regionalHead: string;
    regionalHeadId: string;
    headquarters: string;
    deputyHeads?: string[];
  };

  // Business Units
  businessUnits: {
    branches: number;
    warehouses: number;
    plants: number;
    servicesCenters: number;
  };

  // Financial
  financial: {
    budgetAllocated?: number;
    budgetUtilized?: number;
    revenueTarget?: number;
    actualRevenue?: number;
    profitMargin?: number;
  };

  // Performance
  kpis: {
    customerSatisfaction?: number;
    employeeStrength?: number;
    marketShare?: number;
    growthRate?: number;
  };

  status: 'Active' | 'Inactive' | 'Under Restructuring';

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data Examples**:
```typescript
const mockRegions = [
  {
    id: '1',
    regionCode: 'REG-WEST',
    regionName: 'Western Region',
    regionType: 'Geographic',
    coverage: {
      countries: ['India'],
      states: ['Maharashtra', 'Gujarat', 'Goa'],
      territories: ['WEST-MH-01', 'WEST-GJ-01'],
      totalArea: 508052
    },
    management: {
      regionalHead: 'Amit Shah',
      regionalHeadId: 'EMP-RH-001',
      headquarters: 'Mumbai',
      deputyHeads: ['EMP-DH-001', 'EMP-DH-002']
    },
    businessUnits: {
      branches: 25,
      warehouses: 8,
      plants: 3,
      servicesCenters: 12
    },
    financial: {
      budgetAllocated: 50000000,
      budgetUtilized: 42000000,
      revenueTarget: 150000000,
      actualRevenue: 138000000,
      profitMargin: 18.5
    },
    kpis: {
      customerSatisfaction: 88,
      employeeStrength: 450,
      marketShare: 22.5,
      growthRate: 12.8
    },
    status: 'Active'
  },
  // Add more regions...
];
```

**Key Features**:
- Multi-state coverage
- Budget tracking
- KPI dashboard
- Regional hierarchy
- Business unit summary

---

### 7. Zone Master

**File**: `src/components/common-masters/ZoneMaster.tsx`

**Interface**:
```typescript
interface Zone {
  id: string;
  zoneCode: string;
  zoneName: string;
  zoneType: 'Operational' | 'Delivery' | 'Service' | 'Pricing' | 'Tax';

  // Coverage
  coverage: {
    regions?: string[];
    states?: string[];
    cities?: string[];
    pinCodes?: string[];
    customBoundary?: string; // GeoJSON or coordinates
  };

  // Zone Specific Settings
  zoneSettings: {
    // For Delivery Zones
    standardDeliveryDays?: number;
    expressDeliveryDays?: number;
    shippingCharges?: number;
    freeShippingThreshold?: number;

    // For Pricing Zones
    pricingMultiplier?: number;
    currencyCode?: string;

    // For Tax Zones
    taxRate?: number;
    taxType?: string;

    // For Service Zones
    serviceLevel?: 'Premium' | 'Standard' | 'Basic';
    responseTime?: number; // in hours
  };

  // Operations
  operations: {
    zoneManager?: string;
    zoneTeam?: string[];
    workingHours?: string;
    supportedLanguages?: string[];
  };

  // Performance
  metrics: {
    avgDeliveryTime?: number;
    deliverySuccess?: number;
    customerCount?: number;
    orderVolume?: number;
    revenue?: number;
  };

  status: 'Active' | 'Inactive' | 'Testing';
  priority: number;

  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
```

**Mock Data Examples**:
```typescript
const mockZones = [
  {
    id: '1',
    zoneCode: 'ZONE-A',
    zoneName: 'Metro Zone A',
    zoneType: 'Delivery',
    coverage: {
      cities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai'],
      pinCodes: ['400001-400098', '110001-110096']
    },
    zoneSettings: {
      standardDeliveryDays: 2,
      expressDeliveryDays: 1,
      shippingCharges: 50,
      freeShippingThreshold: 500,
      serviceLevel: 'Premium',
      responseTime: 2
    },
    operations: {
      zoneManager: 'Priya Sharma',
      zoneTeam: ['OPS-001', 'OPS-002', 'OPS-003'],
      workingHours: '24x7',
      supportedLanguages: ['English', 'Hindi']
    },
    metrics: {
      avgDeliveryTime: 1.8,
      deliverySuccess: 98.5,
      customerCount: 12500,
      orderVolume: 45000,
      revenue: 18500000
    },
    status: 'Active',
    priority: 1
  },
  {
    id: '2',
    zoneCode: 'ZONE-TAX-MH',
    zoneName: 'Maharashtra Tax Zone',
    zoneType: 'Tax',
    coverage: {
      states: ['Maharashtra']
    },
    zoneSettings: {
      taxRate: 18,
      taxType: 'SGST + CGST'
    },
    status: 'Active',
    priority: 1
  },
  // Add more zones...
];
```

**Key Features**:
- Multi-purpose zones (delivery, tax, pricing, service)
- Visual zone mapping
- Performance tracking by zone
- Priority-based routing
- Configurable zone settings

---

## Common UI Patterns for All Masters

### Statistics Cards Template
```typescript
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">Metric Name</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <Icon className="h-12 w-12 text-blue-600 opacity-20" />
    </div>
  </div>
</div>
```

### Status Badge Template
```typescript
const getStatusBadge = (status: string) => {
  const statusConfig = {
    'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
    'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
};
```

### Filter Section Template
```typescript
<div className="flex flex-1 gap-4">
  <div className="relative flex-1 max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <select className="px-3 py-2 border border-gray-300 rounded-lg">
    <option value="All">All Types</option>
  </select>
</div>
```

---

## Implementation Checklist

### For Each Master Component:

- [ ] Create interface with comprehensive fields
- [ ] Add 3-5 realistic mock data examples
- [ ] Implement search and filtering
- [ ] Add statistics cards (4 metrics minimum)
- [ ] Create responsive table view
- [ ] Add edit/delete functionality
- [ ] Implement modal form with tabs
- [ ] Add status badges with icons
- [ ] Include import/export buttons
- [ ] Add proper TypeScript typing
- [ ] Implement useMemo for filtered data
- [ ] Add proper error handling
- [ ] Include loading states
- [ ] Add confirmation dialogs

---

## Color Scheme Reference

- **Primary**: Blue (#3B82F6)
- **Success/Active**: Green (#10B981)
- **Warning**: Yellow/Amber (#F59E0B)
- **Error/Delete**: Red (#EF4444)
- **Info**: Purple (#8B5CF6)
- **Neutral**: Gray (#6B7280)

---

## Icon Reference (from lucide-react)

- **Geographic**: Globe, MapPin, Map, Navigation
- **Status**: CheckCircle2, XCircle, AlertCircle, AlertTriangle
- **Actions**: Edit2, Trash2, Eye, Plus, Download, Upload
- **Business**: Building2, Users, DollarSign, TrendingUp, Activity
- **Logistics**: Truck, Package, Navigation, Target
- **Communication**: Phone, Mail, MessageSquare

---

## Next Steps

1. Copy the interface and mock data for each component
2. Follow the established pattern from CountryMaster and StateMaster
3. Customize fields and features based on business requirements
4. Test with realistic data scenarios
5. Add validation and error handling
6. Integrate with backend APIs when ready

---

## Notes

- All components follow the same architectural pattern
- Components are fully self-contained with mock data
- Ready for API integration by replacing useState with API calls
- Responsive design with Tailwind CSS
- Type-safe with TypeScript
- Accessible and user-friendly interfaces

