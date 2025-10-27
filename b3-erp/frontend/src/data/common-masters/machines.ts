export interface Machine {
  id: string;
  machineCode: string;
  machineName: string;
  machineType: 'cutting' | 'bending' | 'welding' | 'finishing' | 'assembly' | 'cnc' | 'laser' | 'press';
  category: 'production' | 'testing' | 'packaging' | 'material_handling';
  manufacturer: string;
  model: string;
  serialNumber: string;

  // Location
  location: string;
  workCenter: string;
  department: string;

  // Capacity
  capacity: {
    unit: string;
    perHour: number;
    perShift: number;
    perDay: number;
  };

  // Technical Specifications
  specifications: {
    powerRating: string;
    voltage: string;
    dimensions: string;
    weight: string;
    [key: string]: string;
  };

  // Operation details
  operatorRequired: number;
  skillLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  setupTime: number; // in minutes
  cycleTime: number; // in minutes

  // Maintenance
  maintenance: {
    lastDate: string;
    nextDate: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    type: 'preventive' | 'breakdown' | 'calibration';
  };

  // Cost
  purchaseDate: string;
  purchaseCost: number;
  currency: string;
  depreciationRate: number; // percentage
  currentValue: number;

  // Performance
  oee: number; // Overall Equipment Effectiveness percentage
  availability: number; // percentage
  performance: number; // percentage
  quality: number; // percentage

  // Downtime tracking
  downtimeHours: number; // current month
  utilizationRate: number; // percentage

  // Safety
  safetyInstructions: string[];
  requiresSafetyTraining: boolean;
  lastSafetyInspection?: string;

  // Status
  operationalStatus: 'running' | 'idle' | 'maintenance' | 'breakdown' | 'retired';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const mockMachines: Machine[] = [
  {
    id: '1',
    machineCode: 'MCH-CNC-001',
    machineName: 'CNC Router Machine - Alpha',
    machineType: 'cnc',
    category: 'production',
    manufacturer: 'BIESSE Group',
    model: 'Rover A1632',
    serialNumber: 'BIS-2021-A1632-0456',
    location: 'Pune',
    workCenter: 'WC-CUT-01',
    department: 'Production',
    capacity: {
      unit: 'sheets',
      perHour: 8,
      perShift: 60,
      perDay: 180
    },
    specifications: {
      powerRating: '12 kW',
      voltage: '380V 3-Phase',
      dimensions: '5000mm x 3200mm x 2200mm',
      weight: '4500 kg',
      workingArea: '3200mm x 1600mm',
      spindleSpeed: '24000 RPM',
      toolStations: '12'
    },
    operatorRequired: 1,
    skillLevel: 'advanced',
    setupTime: 15,
    cycleTime: 7.5,
    maintenance: {
      lastDate: '2025-01-10',
      nextDate: '2025-02-10',
      frequency: 'monthly',
      type: 'preventive'
    },
    purchaseDate: '2021-03-15',
    purchaseCost: 4500000,
    currency: 'INR',
    depreciationRate: 15,
    currentValue: 2562188,
    oee: 78.5,
    availability: 92,
    performance: 87,
    quality: 98,
    downtimeHours: 12,
    utilizationRate: 85,
    safetyInstructions: [
      'Wear safety goggles and ear protection',
      'Keep hands away from cutting area',
      'Emergency stop button must be accessible',
      'Check tool alignment before operation'
    ],
    requiresSafetyTraining: true,
    lastSafetyInspection: '2025-01-05',
    operationalStatus: 'running',
    isActive: true,
    createdAt: '2021-03-15T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    machineCode: 'MCH-LSR-001',
    machineName: 'Fiber Laser Cutting Machine',
    machineType: 'laser',
    category: 'production',
    manufacturer: 'Trumpf India',
    model: 'TruLaser 3030',
    serialNumber: 'TRF-2022-3030-1234',
    location: 'Pune',
    workCenter: 'WC-CUT-02',
    department: 'Production',
    capacity: {
      unit: 'sheets',
      perHour: 12,
      perShift: 90,
      perDay: 270
    },
    specifications: {
      powerRating: '3 kW Fiber',
      voltage: '415V 3-Phase',
      dimensions: '7400mm x 3600mm x 2400mm',
      weight: '8200 kg',
      maxSheetSize: '3000mm x 1500mm',
      maxThickness: '20mm (SS), 15mm (MS)',
      cuttingSpeed: 'Up to 40 m/min'
    },
    operatorRequired: 1,
    skillLevel: 'expert',
    setupTime: 10,
    cycleTime: 5,
    maintenance: {
      lastDate: '2025-01-08',
      nextDate: '2025-04-08',
      frequency: 'quarterly',
      type: 'preventive'
    },
    purchaseDate: '2022-06-20',
    purchaseCost: 12000000,
    currency: 'INR',
    depreciationRate: 15,
    currentValue: 9180000,
    oee: 82.3,
    availability: 95,
    performance: 90,
    quality: 96,
    downtimeHours: 8,
    utilizationRate: 88,
    safetyInstructions: [
      'Laser Class 4 - Protective eyewear mandatory',
      'Ensure proper ventilation and fume extraction',
      'No reflective surfaces near laser path',
      'Authorized personnel only',
      'Fire extinguisher within 10m radius'
    ],
    requiresSafetyTraining: true,
    lastSafetyInspection: '2025-01-12',
    operationalStatus: 'running',
    isActive: true,
    createdAt: '2022-06-20T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    machineCode: 'MCH-BND-001',
    machineName: 'Hydraulic Press Brake',
    machineType: 'bending',
    category: 'production',
    manufacturer: 'AMADA India',
    model: 'HDS-8025',
    serialNumber: 'AMD-2020-8025-0789',
    location: 'Pune',
    workCenter: 'WC-BND-01',
    department: 'Production',
    capacity: {
      unit: 'bends',
      perHour: 120,
      perShift: 900,
      perDay: 2700
    },
    specifications: {
      powerRating: '15 kW',
      voltage: '415V 3-Phase',
      dimensions: '3200mm x 1800mm x 2600mm',
      weight: '6500 kg',
      bendingCapacity: '80 Tons',
      maxBendLength: '2500mm',
      bendingAngle: '0-135 degrees'
    },
    operatorRequired: 2,
    skillLevel: 'intermediate',
    setupTime: 20,
    cycleTime: 0.5,
    maintenance: {
      lastDate: '2024-12-28',
      nextDate: '2025-03-28',
      frequency: 'quarterly',
      type: 'preventive'
    },
    purchaseDate: '2020-09-10',
    purchaseCost: 3200000,
    currency: 'INR',
    depreciationRate: 15,
    currentValue: 1571200,
    oee: 75.2,
    availability: 88,
    performance: 89,
    quality: 96,
    downtimeHours: 18,
    utilizationRate: 82,
    safetyInstructions: [
      'Use both hands on controls',
      'Check back gauge alignment',
      'Ensure proper clamping before bending',
      'Keep hands away from die area'
    ],
    requiresSafetyTraining: true,
    lastSafetyInspection: '2024-12-20',
    operationalStatus: 'running',
    isActive: true,
    createdAt: '2020-09-10T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '4',
    machineCode: 'MCH-WLD-001',
    machineName: 'MIG Welding Station - Pro',
    machineType: 'welding',
    category: 'production',
    manufacturer: 'Lincoln Electric',
    model: 'PowerWave S500',
    serialNumber: 'LIN-2021-S500-2345',
    location: 'Pune',
    workCenter: 'WC-WLD-01',
    department: 'Production',
    capacity: {
      unit: 'joints',
      perHour: 45,
      perShift: 340,
      perDay: 1020
    },
    specifications: {
      powerRating: '8.5 kW',
      voltage: '400V 3-Phase',
      dimensions: '850mm x 600mm x 950mm',
      weight: '120 kg',
      outputCurrent: '40-500A',
      dutyCycle: '60% @ 500A',
      wireSpeed: '1-25 m/min'
    },
    operatorRequired: 1,
    skillLevel: 'advanced',
    setupTime: 10,
    cycleTime: 1.3,
    maintenance: {
      lastDate: '2025-01-05',
      nextDate: '2025-02-05',
      frequency: 'monthly',
      type: 'preventive'
    },
    purchaseDate: '2021-11-22',
    purchaseCost: 450000,
    currency: 'INR',
    depreciationRate: 20,
    currentValue: 230400,
    oee: 73.8,
    availability: 86,
    performance: 90,
    quality: 95,
    downtimeHours: 15,
    utilizationRate: 78,
    safetyInstructions: [
      'Wear welding helmet with proper shade',
      'Use welding gloves and leather apron',
      'Ensure proper ventilation',
      'Check gas connections before operation',
      'Fire watch required for 30 min after welding'
    ],
    requiresSafetyTraining: true,
    lastSafetyInspection: '2025-01-03',
    operationalStatus: 'running',
    isActive: true,
    createdAt: '2021-11-22T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '5',
    machineCode: 'MCH-FIN-001',
    machineName: 'Surface Finishing Machine',
    machineType: 'finishing',
    category: 'production',
    manufacturer: 'Timesavers',
    model: 'TS-1100',
    serialNumber: 'TMS-2019-1100-5678',
    location: 'Pune',
    workCenter: 'WC-FIN-01',
    department: 'Production',
    capacity: {
      unit: 'panels',
      perHour: 30,
      perShift: 225,
      perDay: 675
    },
    specifications: {
      powerRating: '5.5 kW',
      voltage: '415V 3-Phase',
      dimensions: '2800mm x 1400mm x 1600mm',
      weight: '1800 kg',
      workingWidth: '1100mm',
      beltSpeed: 'Variable 3-12 m/min',
      gritRange: '80-400'
    },
    operatorRequired: 1,
    skillLevel: 'intermediate',
    setupTime: 12,
    cycleTime: 2,
    maintenance: {
      lastDate: '2024-12-18',
      nextDate: '2025-01-18',
      frequency: 'monthly',
      type: 'preventive'
    },
    purchaseDate: '2019-08-05',
    purchaseCost: 1800000,
    currency: 'INR',
    depreciationRate: 15,
    currentValue: 679050,
    oee: 70.5,
    availability: 82,
    performance: 88,
    quality: 98,
    downtimeHours: 22,
    utilizationRate: 75,
    safetyInstructions: [
      'Wear dust mask and safety goggles',
      'Check dust collection system',
      'Inspect sanding belts for tears',
      'Keep hands away from feed rollers'
    ],
    requiresSafetyTraining: true,
    lastSafetyInspection: '2024-12-15',
    operationalStatus: 'running',
    isActive: true,
    createdAt: '2019-08-05T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '6',
    machineCode: 'MCH-PRS-001',
    machineName: 'Hydraulic Power Press 100T',
    machineType: 'press',
    category: 'production',
    manufacturer: 'Rajkumar Press Tools',
    model: 'HPP-100',
    serialNumber: 'RKP-2018-100-3456',
    location: 'Pune',
    workCenter: 'WC-PRS-01',
    department: 'Production',
    capacity: {
      unit: 'strokes',
      perHour: 180,
      perShift: 1350,
      perDay: 4050
    },
    specifications: {
      powerRating: '10 kW',
      voltage: '415V 3-Phase',
      dimensions: '1800mm x 1200mm x 2400mm',
      weight: '4200 kg',
      capacity: '100 Tons',
      strokeLength: '200mm',
      daylight: '600mm'
    },
    operatorRequired: 1,
    skillLevel: 'intermediate',
    setupTime: 25,
    cycleTime: 0.33,
    maintenance: {
      lastDate: '2024-11-20',
      nextDate: '2025-02-20',
      frequency: 'quarterly',
      type: 'preventive'
    },
    purchaseDate: '2018-05-12',
    purchaseCost: 1200000,
    currency: 'INR',
    depreciationRate: 15,
    currentValue: 372600,
    oee: 68.9,
    availability: 78,
    performance: 91,
    quality: 97,
    downtimeHours: 28,
    utilizationRate: 72,
    safetyInstructions: [
      'Use two-hand control system',
      'Never reach into die area during operation',
      'Check safety curtains and guards',
      'Wear safety shoes with steel toe'
    ],
    requiresSafetyTraining: true,
    lastSafetyInspection: '2024-11-15',
    operationalStatus: 'running',
    isActive: true,
    createdAt: '2018-05-12T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '7',
    machineCode: 'MCH-ASM-001',
    machineName: 'Pneumatic Assembly Station',
    machineType: 'assembly',
    category: 'production',
    manufacturer: 'Atlas Copco',
    model: 'AS-500',
    serialNumber: 'ATC-2020-AS500-7890',
    location: 'Pune',
    workCenter: 'WC-ASM-01',
    department: 'Assembly',
    capacity: {
      unit: 'units',
      perHour: 25,
      perShift: 190,
      perDay: 570
    },
    specifications: {
      powerRating: '2.2 kW',
      voltage: '230V Single Phase',
      dimensions: '2000mm x 800mm x 1500mm',
      weight: '350 kg',
      airPressure: '6-8 bar',
      airConsumption: '200 L/min',
      torqueRange: '1-50 Nm'
    },
    operatorRequired: 2,
    skillLevel: 'basic',
    setupTime: 8,
    cycleTime: 2.4,
    maintenance: {
      lastDate: '2025-01-02',
      nextDate: '2025-04-02',
      frequency: 'quarterly',
      type: 'preventive'
    },
    purchaseDate: '2020-02-18',
    purchaseCost: 350000,
    currency: 'INR',
    depreciationRate: 20,
    currentValue: 156800,
    oee: 72.4,
    availability: 85,
    performance: 87,
    quality: 98,
    downtimeHours: 10,
    utilizationRate: 80,
    safetyInstructions: [
      'Check air pressure before operation',
      'Wear safety glasses',
      'Inspect pneumatic tools for leaks',
      'Ensure proper ergonomic posture'
    ],
    requiresSafetyTraining: false,
    lastSafetyInspection: '2024-12-28',
    operationalStatus: 'running',
    isActive: true,
    createdAt: '2020-02-18T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '8',
    machineCode: 'MCH-CNC-002',
    machineName: 'CNC Router Machine - Beta',
    machineType: 'cnc',
    category: 'production',
    manufacturer: 'BIESSE Group',
    model: 'Rover A1632',
    serialNumber: 'BIS-2023-A1632-0891',
    location: 'Pune',
    workCenter: 'WC-CUT-01',
    department: 'Production',
    capacity: {
      unit: 'sheets',
      perHour: 8,
      perShift: 60,
      perDay: 180
    },
    specifications: {
      powerRating: '12 kW',
      voltage: '380V 3-Phase',
      dimensions: '5000mm x 3200mm x 2200mm',
      weight: '4500 kg',
      workingArea: '3200mm x 1600mm',
      spindleSpeed: '24000 RPM',
      toolStations: '12'
    },
    operatorRequired: 1,
    skillLevel: 'advanced',
    setupTime: 15,
    cycleTime: 7.5,
    maintenance: {
      lastDate: '2025-01-18',
      nextDate: '2025-02-18',
      frequency: 'monthly',
      type: 'preventive'
    },
    purchaseDate: '2023-08-10',
    purchaseCost: 4800000,
    currency: 'INR',
    depreciationRate: 15,
    currentValue: 4152000,
    oee: 65.2,
    availability: 72,
    performance: 92,
    quality: 98,
    downtimeHours: 35,
    utilizationRate: 68,
    safetyInstructions: [
      'Wear safety goggles and ear protection',
      'Keep hands away from cutting area',
      'Emergency stop button must be accessible',
      'Check tool alignment before operation'
    ],
    requiresSafetyTraining: true,
    lastSafetyInspection: '2025-01-15',
    operationalStatus: 'maintenance',
    isActive: true,
    createdAt: '2023-08-10T00:00:00Z',
    updatedAt: '2025-01-18T14:20:00Z',
    notes: 'Scheduled maintenance - Spindle bearing replacement'
  }
];

// Helper functions
export function getMachinesByType(type: string): Machine[] {
  return mockMachines.filter(m => m.machineType === type);
}

export function getMachinesByLocation(location: string): Machine[] {
  return mockMachines.filter(m => m.location === location);
}

export function getMachinesByStatus(status: string): Machine[] {
  return mockMachines.filter(m => m.operationalStatus === status);
}

export function getActiveMachines(): Machine[] {
  return mockMachines.filter(m => m.isActive && m.operationalStatus === 'running');
}

export function getMachineStats() {
  const runningMachines = mockMachines.filter(m => m.operationalStatus === 'running');
  const avgOEE = runningMachines.reduce((sum, m) => sum + m.oee, 0) / runningMachines.length;
  const avgUtilization = mockMachines.reduce((sum, m) => sum + m.utilizationRate, 0) / mockMachines.length;

  return {
    total: mockMachines.length,
    running: runningMachines.length,
    idle: mockMachines.filter(m => m.operationalStatus === 'idle').length,
    maintenance: mockMachines.filter(m => m.operationalStatus === 'maintenance').length,
    breakdown: mockMachines.filter(m => m.operationalStatus === 'breakdown').length,
    avgOEE: Math.round(avgOEE * 10) / 10,
    avgUtilization: Math.round(avgUtilization * 10) / 10,
    totalValue: mockMachines.reduce((sum, m) => sum + m.currentValue, 0)
  };
}
