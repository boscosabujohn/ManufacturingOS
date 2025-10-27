export interface Tool {
  id: string;
  toolCode: string;
  toolName: string;
  toolType: 'cutting' | 'measuring' | 'holding' | 'power' | 'hand' | 'jigs_fixtures' | 'safety';
  category: 'consumable' | 'durable' | 'precision_instrument';
  description: string;

  // Specifications
  specifications: {
    material?: string;
    size?: string;
    capacity?: string;
    accuracy?: string;
    [key: string]: string | undefined;
  };

  // Supplier Details
  manufacturer: string;
  supplier: string;
  partNumber?: string;

  // Usage
  compatibleMachines: string[];
  compatibleOperations: string[];
  applicableFor: string[];

  // Lifecycle
  lifeExpectancy: number; // in hours or units
  lifeUnit: 'hours' | 'cycles' | 'pieces' | 'months';
  currentUsage: number;
  remainingLife: number; // percentage

  // Inventory
  minimumStock: number;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  unitOfMeasure: string;
  storageLocation: string;

  // Costing
  unitCost: number;
  currency: string;
  depreciable: boolean;
  depreciationPeriod?: number; // in months

  // Maintenance
  requiresCalibration: boolean;
  calibrationFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastCalibrationDate?: string;
  nextCalibrationDate?: string;
  calibrationCertificate?: string;

  // Safety & Quality
  requiresTraining: boolean;
  safetyRating: 'standard' | 'caution' | 'hazardous';
  qualityCritical: boolean;

  // Tracking
  serialTracking: boolean;
  serialNumbers?: string[];
  assignedTo?: string;
  location: string;

  status: 'available' | 'in_use' | 'maintenance' | 'calibration' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const mockTools: Tool[] = [
  {
    id: '1',
    toolCode: 'TOOL-CNC-RB-001',
    toolName: 'CNC Router Bit - 6mm',
    toolType: 'cutting',
    category: 'consumable',
    description: 'Solid carbide end mill router bit for wood and composite materials',
    specifications: {
      material: 'Solid Carbide',
      diameter: '6mm',
      flutes: '2',
      cuttingLength: '25mm',
      shankDiameter: '6mm'
    },
    manufacturer: 'Amana Tool',
    supplier: 'India Cutting Tools Pvt Ltd',
    partNumber: 'AMN-46200',
    compatibleMachines: ['MCH-CNC-001', 'MCH-CNC-002'],
    compatibleOperations: ['OP-CNC-001'],
    applicableFor: ['Plywood', 'MDF', 'Particle Board', 'Solid Wood'],
    lifeExpectancy: 50,
    lifeUnit: 'hours',
    currentUsage: 32,
    remainingLife: 36,
    minimumStock: 10,
    currentStock: 15,
    reorderLevel: 12,
    reorderQuantity: 20,
    unitOfMeasure: 'PCS',
    storageLocation: 'Tool Room - Rack A3',
    unitCost: 850,
    currency: 'INR',
    depreciable: false,
    requiresCalibration: false,
    requiresTraining: true,
    safetyRating: 'caution',
    qualityCritical: true,
    serialTracking: false,
    location: 'Pune - Production Floor',
    status: 'available',
    condition: 'good',
    isActive: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    toolCode: 'TOOL-MES-CAL-001',
    toolName: 'Digital Vernier Caliper 0-150mm',
    toolType: 'measuring',
    category: 'precision_instrument',
    description: 'High-precision digital caliper for dimensional measurement',
    specifications: {
      range: '0-150mm',
      accuracy: '±0.01mm',
      resolution: '0.01mm',
      display: 'LCD Digital'
    },
    manufacturer: 'Mitutoyo',
    supplier: 'Precision Tools India',
    partNumber: 'MIT-500-196-30',
    compatibleMachines: [],
    compatibleOperations: ['OP-QC-001', 'OP-FIN-001'],
    applicableFor: ['All Operations'],
    lifeExpectancy: 60,
    lifeUnit: 'months',
    currentUsage: 18,
    remainingLife: 70,
    minimumStock: 5,
    currentStock: 8,
    reorderLevel: 6,
    reorderQuantity: 5,
    unitOfMeasure: 'PCS',
    storageLocation: 'QC Lab - Cabinet B',
    unitCost: 4500,
    currency: 'INR',
    depreciable: true,
    depreciationPeriod: 60,
    requiresCalibration: true,
    calibrationFrequency: 'annually',
    lastCalibrationDate: '2024-06-15',
    nextCalibrationDate: '2025-06-15',
    calibrationCertificate: 'CERT-2024-CAL-001',
    requiresTraining: true,
    safetyRating: 'standard',
    qualityCritical: true,
    serialTracking: true,
    serialNumbers: ['MIT-2023-001', 'MIT-2023-002', 'MIT-2024-003'],
    location: 'Pune - QC Lab',
    status: 'available',
    condition: 'excellent',
    isActive: true,
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    toolCode: 'TOOL-WLD-TIP-001',
    toolName: 'MIG Welding Contact Tips - 1.2mm',
    toolType: 'cutting',
    category: 'consumable',
    description: 'Copper contact tips for MIG welding torch',
    specifications: {
      diameter: '1.2mm',
      material: 'Copper',
      threadSize: 'M6'
    },
    manufacturer: 'Lincoln Electric',
    supplier: 'Welding Supply Co',
    partNumber: 'LIN-KP2744-12',
    compatibleMachines: ['MCH-WLD-001'],
    compatibleOperations: ['OP-WLD-001'],
    applicableFor: ['MIG Welding'],
    lifeExpectancy: 500,
    lifeUnit: 'pieces',
    currentUsage: 320,
    remainingLife: 36,
    minimumStock: 50,
    currentStock: 78,
    reorderLevel: 60,
    reorderQuantity: 100,
    unitOfMeasure: 'PCS',
    storageLocation: 'Welding Section - Bin W12',
    unitCost: 45,
    currency: 'INR',
    depreciable: false,
    requiresCalibration: false,
    requiresTraining: false,
    safetyRating: 'standard',
    qualityCritical: false,
    serialTracking: false,
    location: 'Pune - Welding Station',
    status: 'available',
    condition: 'good',
    isActive: true,
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '4',
    toolCode: 'TOOL-HOLD-CLM-001',
    toolName: 'Welding Clamp Set - Heavy Duty',
    toolType: 'holding',
    category: 'durable',
    description: 'Set of 4 heavy-duty welding clamps for secure workpiece holding',
    specifications: {
      openingCapacity: '0-100mm',
      clampingForce: '500N',
      material: 'Forged Steel',
      quantity: '4 pieces per set'
    },
    manufacturer: 'Strong Hand Tools',
    supplier: 'Industrial Hardware Ltd',
    partNumber: 'SHT-UWC35',
    compatibleMachines: [],
    compatibleOperations: ['OP-WLD-001'],
    applicableFor: ['Welding', 'Assembly'],
    lifeExpectancy: 24,
    lifeUnit: 'months',
    currentUsage: 12,
    remainingLife: 50,
    minimumStock: 3,
    currentStock: 6,
    reorderLevel: 4,
    reorderQuantity: 5,
    unitOfMeasure: 'SET',
    storageLocation: 'Tool Room - Rack C5',
    unitCost: 2800,
    currency: 'INR',
    depreciable: true,
    depreciationPeriod: 24,
    requiresCalibration: false,
    requiresTraining: false,
    safetyRating: 'standard',
    qualityCritical: false,
    serialTracking: false,
    location: 'Pune - Welding Section',
    status: 'in_use',
    condition: 'good',
    isActive: true,
    createdAt: '2023-04-20T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '5',
    toolCode: 'TOOL-PWR-GRD-001',
    toolName: 'Angle Grinder 4" - 850W',
    toolType: 'power',
    category: 'durable',
    description: 'Electric angle grinder for cutting and grinding operations',
    specifications: {
      power: '850W',
      discSize: '100mm (4 inch)',
      noLoadSpeed: '11000 RPM',
      voltage: '230V'
    },
    manufacturer: 'Bosch',
    supplier: 'Power Tools India',
    partNumber: 'BOSCH-GWS750-100',
    compatibleMachines: [],
    compatibleOperations: ['OP-FIN-001', 'OP-WLD-001'],
    applicableFor: ['Grinding', 'Cutting', 'Deburring'],
    lifeExpectancy: 36,
    lifeUnit: 'months',
    currentUsage: 14,
    remainingLife: 61,
    minimumStock: 2,
    currentStock: 5,
    reorderLevel: 3,
    reorderQuantity: 3,
    unitOfMeasure: 'PCS',
    storageLocation: 'Tool Room - Rack D2',
    unitCost: 5200,
    currency: 'INR',
    depreciable: true,
    depreciationPeriod: 36,
    requiresCalibration: false,
    requiresTraining: true,
    safetyRating: 'hazardous',
    qualityCritical: false,
    serialTracking: true,
    serialNumbers: ['BOSCH-2023-G001', 'BOSCH-2023-G002', 'BOSCH-2024-G003'],
    assignedTo: 'Finishing Section',
    location: 'Pune - Finishing Area',
    status: 'available',
    condition: 'excellent',
    isActive: true,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '6',
    toolCode: 'TOOL-HAND-WRN-001',
    toolName: 'Combination Wrench Set (8-24mm)',
    toolType: 'hand',
    category: 'durable',
    description: 'Chrome vanadium steel wrench set for assembly operations',
    specifications: {
      sizes: '8, 10, 12, 13, 14, 17, 19, 22, 24mm',
      material: 'Chrome Vanadium Steel',
      finish: 'Chrome Plated',
      pieces: '9'
    },
    manufacturer: 'Stanley',
    supplier: 'Hardware Junction',
    partNumber: 'STLY-87-060',
    compatibleMachines: [],
    compatibleOperations: ['OP-ASM-001'],
    applicableFor: ['Assembly', 'Maintenance'],
    lifeExpectancy: 60,
    lifeUnit: 'months',
    currentUsage: 20,
    remainingLife: 67,
    minimumStock: 5,
    currentStock: 10,
    reorderLevel: 6,
    reorderQuantity: 8,
    unitOfMeasure: 'SET',
    storageLocation: 'Tool Room - Drawer T8',
    unitCost: 1800,
    currency: 'INR',
    depreciable: true,
    depreciationPeriod: 60,
    requiresCalibration: false,
    requiresTraining: false,
    safetyRating: 'standard',
    qualityCritical: false,
    serialTracking: false,
    location: 'Pune - Assembly Section',
    status: 'available',
    condition: 'excellent',
    isActive: true,
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '7',
    toolCode: 'TOOL-JIG-BND-001',
    toolName: 'Bending Jig for Cabinet Frames',
    toolType: 'jigs_fixtures',
    category: 'durable',
    description: 'Custom bending jig for 90-degree cabinet frame bends',
    specifications: {
      bendAngle: '90 degrees',
      maxThickness: '3mm',
      material: 'Tool Steel',
      size: '500mm x 300mm'
    },
    manufacturer: 'Custom Made',
    supplier: 'In-House Tool Shop',
    compatibleMachines: ['MCH-BND-001'],
    compatibleOperations: ['OP-BND-001'],
    applicableFor: ['Cabinet Frame Bending'],
    lifeExpectancy: 48,
    lifeUnit: 'months',
    currentUsage: 6,
    remainingLife: 87,
    minimumStock: 1,
    currentStock: 2,
    reorderLevel: 1,
    reorderQuantity: 1,
    unitOfMeasure: 'PCS',
    storageLocation: 'Jig Storage - Section J3',
    unitCost: 12000,
    currency: 'INR',
    depreciable: true,
    depreciationPeriod: 48,
    requiresCalibration: false,
    requiresTraining: true,
    safetyRating: 'standard',
    qualityCritical: true,
    serialTracking: true,
    serialNumbers: ['JIG-BND-2023-001'],
    assignedTo: 'Bending Section',
    location: 'Pune - Bending Station',
    status: 'in_use',
    condition: 'excellent',
    isActive: true,
    createdAt: '2023-07-05T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '8',
    toolCode: 'TOOL-SAF-GOG-001',
    toolName: 'Safety Goggles - Anti-Fog',
    toolType: 'safety',
    category: 'consumable',
    description: 'Polycarbonate safety goggles with anti-fog coating',
    specifications: {
      lensType: 'Polycarbonate',
      coating: 'Anti-Fog',
      standard: 'IS 5983',
      uvProtection: 'UV400'
    },
    manufacturer: '3M',
    supplier: 'Safety Equipment Co',
    partNumber: '3M-2890A',
    compatibleMachines: [],
    compatibleOperations: ['All Operations'],
    applicableFor: ['All Workers'],
    lifeExpectancy: 12,
    lifeUnit: 'months',
    currentUsage: 0,
    remainingLife: 100,
    minimumStock: 50,
    currentStock: 85,
    reorderLevel: 60,
    reorderQuantity: 100,
    unitOfMeasure: 'PCS',
    storageLocation: 'Safety Equipment Store',
    unitCost: 180,
    currency: 'INR',
    depreciable: false,
    requiresCalibration: false,
    requiresTraining: false,
    safetyRating: 'standard',
    qualityCritical: false,
    serialTracking: false,
    location: 'Pune - Safety Store',
    status: 'available',
    condition: 'excellent',
    isActive: true,
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '9',
    toolCode: 'TOOL-MES-MIC-001',
    toolName: 'Digital Micrometer 0-25mm',
    toolType: 'measuring',
    category: 'precision_instrument',
    description: 'High-precision digital micrometer for accurate measurements',
    specifications: {
      range: '0-25mm',
      accuracy: '±0.001mm',
      resolution: '0.001mm',
      display: 'LCD Digital'
    },
    manufacturer: 'Mitutoyo',
    supplier: 'Precision Tools India',
    partNumber: 'MIT-293-340-30',
    compatibleMachines: [],
    compatibleOperations: ['OP-QC-001'],
    applicableFor: ['Precision Measurement'],
    lifeExpectancy: 60,
    lifeUnit: 'months',
    currentUsage: 24,
    remainingLife: 60,
    minimumStock: 3,
    currentStock: 5,
    reorderLevel: 4,
    reorderQuantity: 3,
    unitOfMeasure: 'PCS',
    storageLocation: 'QC Lab - Cabinet A',
    unitCost: 8500,
    currency: 'INR',
    depreciable: true,
    depreciationPeriod: 60,
    requiresCalibration: true,
    calibrationFrequency: 'annually',
    lastCalibrationDate: '2024-03-10',
    nextCalibrationDate: '2025-03-10',
    calibrationCertificate: 'CERT-2024-CAL-002',
    requiresTraining: true,
    safetyRating: 'standard',
    qualityCritical: true,
    serialTracking: true,
    serialNumbers: ['MIT-2023-M001', 'MIT-2023-M002'],
    location: 'Pune - QC Lab',
    status: 'available',
    condition: 'excellent',
    isActive: true,
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '10',
    toolCode: 'TOOL-CUT-GRB-001',
    toolName: 'Grinding Belt 80 Grit - 100x915mm',
    toolType: 'cutting',
    category: 'consumable',
    description: 'Aluminum oxide grinding belt for surface finishing',
    specifications: {
      grit: '80',
      size: '100mm x 915mm',
      material: 'Aluminum Oxide',
      backing: 'Cloth'
    },
    manufacturer: '3M',
    supplier: 'Abrasives India Ltd',
    partNumber: '3M-777F-80-100x915',
    compatibleMachines: ['MCH-FIN-001'],
    compatibleOperations: ['OP-FIN-001'],
    applicableFor: ['Metal Finishing'],
    lifeExpectancy: 200,
    lifeUnit: 'pieces',
    currentUsage: 145,
    remainingLife: 27,
    minimumStock: 20,
    currentStock: 35,
    reorderLevel: 25,
    reorderQuantity: 50,
    unitOfMeasure: 'PCS',
    storageLocation: 'Finishing Section - Bin F5',
    unitCost: 95,
    currency: 'INR',
    depreciable: false,
    requiresCalibration: false,
    requiresTraining: false,
    safetyRating: 'standard',
    qualityCritical: false,
    serialTracking: false,
    location: 'Pune - Finishing Area',
    status: 'available',
    condition: 'good',
    isActive: true,
    createdAt: '2023-10-10T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  }
];

// Helper functions
export function getToolsByType(type: string): Tool[] {
  return mockTools.filter(tool => tool.toolType === type);
}

export function getToolsByCategory(category: string): Tool[] {
  return mockTools.filter(tool => tool.category === category);
}

export function getToolsByStatus(status: string): Tool[] {
  return mockTools.filter(tool => tool.status === status);
}

export function getLowStockTools(): Tool[] {
  return mockTools.filter(tool => tool.currentStock <= tool.reorderLevel);
}

export function getToolsNeedingCalibration(): Tool[] {
  const today = new Date();
  return mockTools.filter(tool => {
    if (!tool.requiresCalibration || !tool.nextCalibrationDate) return false;
    const nextDate = new Date(tool.nextCalibrationDate);
    const daysUntil = Math.floor((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  });
}

export function getToolStats() {
  const totalValue = mockTools.reduce((sum, tool) => sum + (tool.unitCost * tool.currentStock), 0);
  const lowStock = getLowStockTools().length;
  const needsCalibration = getToolsNeedingCalibration().length;

  return {
    total: mockTools.length,
    available: mockTools.filter(t => t.status === 'available').length,
    inUse: mockTools.filter(t => t.status === 'in_use').length,
    maintenance: mockTools.filter(t => t.status === 'maintenance').length,
    lowStock,
    needsCalibration,
    totalValue: Math.round(totalValue),
    consumables: mockTools.filter(t => t.category === 'consumable').length,
    precisionInstruments: mockTools.filter(t => t.category === 'precision_instrument').length
  };
}
