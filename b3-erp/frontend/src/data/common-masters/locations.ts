export interface Location {
  id: string;
  locationCode: string;
  locationName: string;
  locationType: 'head-office' | 'branch-office' | 'factory' | 'warehouse' | 'service-center' | 'showroom';
  parentLocationId?: string;
  level: number;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    landmark?: string;
  };
  contact: {
    phone: string;
    email: string;
    fax?: string;
    website?: string;
  };
  managerName?: string;
  managerContact?: string;
  operationalDetails: {
    operatingHours: string;
    workingDays: string;
    capacity?: number;
    area?: number; // in sq ft
  };
  facilities: string[];
  costCenter?: string;
  isActive: boolean;
  gstNumber?: string;
  panNumber?: string;
  establishedDate?: string;
  notes?: string;
}

export const mockLocations: Location[] = [
  {
    id: '1',
    locationCode: 'LOC-HO-MUM',
    locationName: 'Mumbai Head Office',
    locationType: 'head-office',
    level: 1,
    address: {
      addressLine1: 'Hiranandani Business Park, Powai',
      addressLine2: 'Tower A, 7th Floor',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400076',
      landmark: 'Near Powai Lake'
    },
    contact: {
      phone: '+91-22-61234567',
      email: 'ho.mumbai@kitchenmfg.com',
      fax: '+91-22-61234568',
      website: 'www.kitchenmfg.com'
    },
    managerName: 'Rajesh Kumar',
    managerContact: '+91-98765-43210',
    operationalDetails: {
      operatingHours: '9:00 AM - 6:00 PM',
      workingDays: 'Monday to Saturday',
      area: 15000
    },
    facilities: ['Conference Rooms', 'Cafeteria', 'Parking', 'IT Infrastructure', 'Security'],
    costCenter: 'CC-HO-001',
    isActive: true,
    gstNumber: '27AABCK1234F1Z5',
    panNumber: 'AABCK1234F',
    establishedDate: '2015-01-15',
    notes: 'Corporate headquarters with all administrative functions'
  },
  {
    id: '2',
    locationCode: 'LOC-FAC-PNE',
    locationName: 'Pune Manufacturing Plant',
    locationType: 'factory',
    level: 1,
    address: {
      addressLine1: 'MIDC Industrial Area, Chakan',
      addressLine2: 'Plot No. 45-48',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '410501',
      landmark: 'Near Rajgurunagar'
    },
    contact: {
      phone: '+91-20-67890123',
      email: 'factory.pune@kitchenmfg.com',
      fax: '+91-20-67890124'
    },
    managerName: 'Suresh Patil',
    managerContact: '+91-98234-56789',
    operationalDetails: {
      operatingHours: '24x7 (3 Shifts)',
      workingDays: 'All days (6 days rotating)',
      capacity: 5000, // units per month
      area: 50000
    },
    facilities: [
      'Production Lines',
      'Quality Lab',
      'Raw Material Storage',
      'Finished Goods Warehouse',
      'Maintenance Workshop',
      'Canteen',
      'Medical Room',
      'Fire Safety Systems',
      'Waste Treatment'
    ],
    costCenter: 'CC-FAC-001',
    isActive: true,
    gstNumber: '27AABCK1234F2Z6',
    panNumber: 'AABCK1234F',
    establishedDate: '2016-06-20',
    notes: 'Main manufacturing facility for modular kitchen cabinets and countertops'
  },
  {
    id: '3',
    locationCode: 'LOC-WH-NAV',
    locationName: 'Navi Mumbai Warehouse',
    locationType: 'warehouse',
    parentLocationId: '1',
    level: 2,
    address: {
      addressLine1: 'TTC Industrial Area, Mahape',
      addressLine2: 'Godown No. 12-15',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400710',
      landmark: 'Behind Mahape Railway Station'
    },
    contact: {
      phone: '+91-22-27456789',
      email: 'warehouse.navimumbai@kitchenmfg.com'
    },
    managerName: 'Vijay Sharma',
    managerContact: '+91-93456-78901',
    operationalDetails: {
      operatingHours: '8:00 AM - 8:00 PM',
      workingDays: 'Monday to Saturday',
      capacity: 10000, // units storage
      area: 25000
    },
    facilities: [
      'Racking Systems',
      'Loading Docks',
      'Temperature Control',
      'CCTV Surveillance',
      'Fork Lifts',
      'Office Area'
    ],
    costCenter: 'CC-WH-001',
    isActive: true,
    gstNumber: '27AABCK1234F3Z7',
    panNumber: 'AABCK1234F',
    establishedDate: '2017-03-10',
    notes: 'Regional distribution center for Western India'
  },
  {
    id: '4',
    locationCode: 'LOC-BR-DEL',
    locationName: 'Delhi Branch Office',
    locationType: 'branch-office',
    parentLocationId: '1',
    level: 2,
    address: {
      addressLine1: 'Jasola District Centre',
      addressLine2: '4th Floor, Block C',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      pincode: '110025',
      landmark: 'Near Jasola Apollo Metro'
    },
    contact: {
      phone: '+91-11-41234567',
      email: 'delhi@kitchenmfg.com',
      fax: '+91-11-41234568'
    },
    managerName: 'Amit Verma',
    managerContact: '+91-98110-12345',
    operationalDetails: {
      operatingHours: '9:30 AM - 6:30 PM',
      workingDays: 'Monday to Saturday',
      area: 3500
    },
    facilities: ['Meeting Rooms', 'Small Display Area', 'Parking', 'Pantry'],
    costCenter: 'CC-BR-001',
    isActive: true,
    gstNumber: '07AABCK1234F1Z8',
    panNumber: 'AABCK1234F',
    establishedDate: '2018-08-01',
    notes: 'Northern region sales and support office'
  },
  {
    id: '5',
    locationCode: 'LOC-SR-BLR',
    locationName: 'Bangalore Showroom',
    locationType: 'showroom',
    level: 1,
    address: {
      addressLine1: 'Indiranagar Main Road',
      addressLine2: 'Next to CMH Road Junction',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560038',
      landmark: 'Near 100 Feet Road'
    },
    contact: {
      phone: '+91-80-41234567',
      email: 'showroom.bangalore@kitchenmfg.com'
    },
    managerName: 'Priya Reddy',
    managerContact: '+91-98450-12345',
    operationalDetails: {
      operatingHours: '10:00 AM - 8:00 PM',
      workingDays: 'All days',
      area: 5000
    },
    facilities: [
      'Live Kitchen Displays',
      'Design Studio',
      'Customer Lounge',
      'Sample Room',
      'Consultation Rooms',
      'Parking'
    ],
    costCenter: 'CC-SR-001',
    isActive: true,
    gstNumber: '29AABCK1234F1Z9',
    panNumber: 'AABCK1234F',
    establishedDate: '2019-02-14',
    notes: 'Premium showroom with 15+ live kitchen displays'
  },
  {
    id: '6',
    locationCode: 'LOC-SC-HYD',
    locationName: 'Hyderabad Service Center',
    locationType: 'service-center',
    level: 1,
    address: {
      addressLine1: 'Kukatpally Industrial Estate',
      addressLine2: 'Unit 7-8',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      pincode: '500072',
      landmark: 'Near Kukatpally Metro'
    },
    contact: {
      phone: '+91-40-41234567',
      email: 'service.hyderabad@kitchenmfg.com'
    },
    managerName: 'Ramesh Babu',
    managerContact: '+91-98765-11111',
    operationalDetails: {
      operatingHours: '9:00 AM - 6:00 PM',
      workingDays: 'Monday to Saturday',
      area: 2000
    },
    facilities: [
      'Service Workshop',
      'Spare Parts Storage',
      'Customer Waiting Area',
      'Tool Room'
    ],
    costCenter: 'CC-SC-001',
    isActive: true,
    gstNumber: '36AABCK1234F1Z0',
    panNumber: 'AABCK1234F',
    establishedDate: '2020-05-10',
    notes: 'After-sales service and installation support center'
  },
  {
    id: '7',
    locationCode: 'LOC-FAC-AHM',
    locationName: 'Ahmedabad Manufacturing Unit',
    locationType: 'factory',
    level: 1,
    address: {
      addressLine1: 'Sanand Industrial Park',
      addressLine2: 'Plot No. 101-105',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      pincode: '382170',
      landmark: 'Near Sanand Circle'
    },
    contact: {
      phone: '+91-79-41234567',
      email: 'factory.ahmedabad@kitchenmfg.com',
      fax: '+91-79-41234568'
    },
    managerName: 'Kiran Patel',
    managerContact: '+91-98250-12345',
    operationalDetails: {
      operatingHours: '24x7 (3 Shifts)',
      workingDays: 'All days (6 days rotating)',
      capacity: 3000, // units per month
      area: 35000
    },
    facilities: [
      'Production Lines',
      'Quality Control Lab',
      'Material Yard',
      'Finished Goods Storage',
      'Maintenance Area',
      'Worker Cafeteria',
      'First Aid Center'
    ],
    costCenter: 'CC-FAC-002',
    isActive: true,
    gstNumber: '24AABCK1234F1Z1',
    panNumber: 'AABCK1234F',
    establishedDate: '2021-01-20',
    notes: 'Secondary manufacturing facility focusing on hardware and accessories'
  },
  {
    id: '8',
    locationCode: 'LOC-BR-KOL',
    locationName: 'Kolkata Branch Office',
    locationType: 'branch-office',
    parentLocationId: '1',
    level: 2,
    address: {
      addressLine1: 'Salt Lake Sector V',
      addressLine2: 'DN Block, 3rd Floor',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      pincode: '700091',
      landmark: 'Near Webel More'
    },
    contact: {
      phone: '+91-33-41234567',
      email: 'kolkata@kitchenmfg.com'
    },
    managerName: 'Sanjay Chatterjee',
    managerContact: '+91-98300-12345',
    operationalDetails: {
      operatingHours: '9:30 AM - 6:30 PM',
      workingDays: 'Monday to Saturday',
      area: 2500
    },
    facilities: ['Conference Room', 'Small Inventory', 'Parking'],
    costCenter: 'CC-BR-002',
    isActive: true,
    gstNumber: '19AABCK1234F1Z2',
    panNumber: 'AABCK1234F',
    establishedDate: '2020-11-01',
    notes: 'Eastern region sales office'
  },
  {
    id: '9',
    locationCode: 'LOC-WH-CHN',
    locationName: 'Chennai Warehouse',
    locationType: 'warehouse',
    level: 1,
    address: {
      addressLine1: 'Ambattur Industrial Estate',
      addressLine2: 'Phase 2, Building 23',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600058',
      landmark: 'Near Padi Flyover'
    },
    contact: {
      phone: '+91-44-41234567',
      email: 'warehouse.chennai@kitchenmfg.com'
    },
    managerName: 'Murali Krishna',
    managerContact: '+91-98410-12345',
    operationalDetails: {
      operatingHours: '8:00 AM - 8:00 PM',
      workingDays: 'Monday to Saturday',
      capacity: 8000,
      area: 20000
    },
    facilities: [
      'Storage Racks',
      'Loading Bay',
      'Climate Control',
      'Security System',
      'Material Handling Equipment'
    ],
    costCenter: 'CC-WH-002',
    isActive: true,
    gstNumber: '33AABCK1234F1Z3',
    panNumber: 'AABCK1234F',
    establishedDate: '2019-07-15',
    notes: 'Southern region distribution hub'
  },
  {
    id: '10',
    locationCode: 'LOC-SR-MUM',
    locationName: 'Mumbai Showroom - Andheri',
    locationType: 'showroom',
    parentLocationId: '1',
    level: 2,
    address: {
      addressLine1: 'Link Road, Andheri West',
      addressLine2: 'Ground Floor',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400053',
      landmark: 'Near Infiniti Mall'
    },
    contact: {
      phone: '+91-22-41234567',
      email: 'showroom.andheri@kitchenmfg.com'
    },
    managerName: 'Neha Desai',
    managerContact: '+91-98200-12345',
    operationalDetails: {
      operatingHours: '10:00 AM - 9:00 PM',
      workingDays: 'All days',
      area: 4000
    },
    facilities: [
      'Display Kitchens',
      'Design Consultation Area',
      'Material Library',
      'Customer Lounge',
      'Payment Counter'
    ],
    costCenter: 'CC-SR-002',
    isActive: true,
    gstNumber: '27AABCK1234F4Z4',
    panNumber: 'AABCK1234F',
    establishedDate: '2021-09-01',
    notes: 'Second Mumbai showroom targeting western suburbs'
  }
];
