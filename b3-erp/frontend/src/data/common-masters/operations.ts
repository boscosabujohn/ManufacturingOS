export interface Operation {
  id: string;
  operationCode: string;
  operationName: string;
  operationType: 'cutting' | 'bending' | 'welding' | 'finishing' | 'assembly' | 'inspection' | 'packaging' | 'machining';
  category: 'manufacturing' | 'quality' | 'material_handling' | 'setup';
  description: string;

  // Workstation
  defaultWorkstation: string;
  alternativeWorkstations: string[];
  department: string;

  // Machine & Tools
  requiredMachine?: string;
  requiredMachineType?: string;
  requiredTools: string[];
  requiredSkill: 'basic' | 'intermediate' | 'advanced' | 'expert';

  // Manpower
  operatorsRequired: number;
  helpersRequired: number;

  // Time Standards
  setupTime: number; // in minutes
  cycleTime: number; // in minutes per unit
  teardownTime: number; // in minutes
  batchSetupTime?: number; // additional setup for batch

  // Capacity
  capacityPerHour: number;
  capacityPerShift: number;
  efficiencyFactor: number; // percentage

  // Costing
  costingMethod: 'time_based' | 'unit_based' | 'fixed';
  laborCostPerHour: number;
  machineRatePerHour: number;
  overheadRate: number; // percentage
  currency: string;

  // Quality Control
  requiresInspection: boolean;
  inspectionType?: 'incoming' | 'in_process' | 'final';
  inspectionFrequency?: 'every_unit' | 'sampling' | 'first_last';
  qualityCheckPoints?: string[];

  // Material Consumption
  materialWastagePercent: number;
  consumablesRequired: {
    item: string;
    quantityPerUnit: number;
    unit: string;
  }[];

  // Safety Requirements
  safetyGear: string[];
  safetyInstructions: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';

  // Sequencing
  precedingOperations: string[];
  succeedingOperations: string[];
  canRunParallel: boolean;

  // Performance Tracking
  avgActualCycleTime: number; // in minutes
  defectRate: number; // percentage
  utilizationRate: number; // percentage

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const mockOperations: Operation[] = [
  {
    id: '1',
    operationCode: 'OP-CUT-001',
    operationName: 'Sheet Metal Laser Cutting',
    operationType: 'cutting',
    category: 'manufacturing',
    description: 'Precision laser cutting of stainless steel and mild steel sheets',
    defaultWorkstation: 'WS-LASER-01',
    alternativeWorkstations: ['WS-LASER-02'],
    department: 'Production',
    requiredMachine: 'MCH-LSR-001',
    requiredMachineType: 'laser',
    requiredTools: ['Laser Safety Goggles', 'Material Handling Gloves'],
    requiredSkill: 'expert',
    operatorsRequired: 1,
    helpersRequired: 0,
    setupTime: 10,
    cycleTime: 5,
    teardownTime: 5,
    batchSetupTime: 3,
    capacityPerHour: 12,
    capacityPerShift: 90,
    efficiencyFactor: 85,
    costingMethod: 'time_based',
    laborCostPerHour: 350,
    machineRatePerHour: 1200,
    overheadRate: 25,
    currency: 'INR',
    requiresInspection: true,
    inspectionType: 'in_process',
    inspectionFrequency: 'sampling',
    qualityCheckPoints: ['Dimensional accuracy', 'Edge quality', 'Burn marks'],
    materialWastagePercent: 8,
    consumablesRequired: [
      { item: 'Laser Gas', quantityPerUnit: 0.5, unit: 'L' },
      { item: 'Cutting Nozzle', quantityPerUnit: 0.001, unit: 'PCS' }
    ],
    safetyGear: ['Laser Safety Goggles', 'Heat Resistant Gloves', 'Safety Shoes'],
    safetyInstructions: [
      'Ensure laser enclosure is closed',
      'Check gas pressure before operation',
      'Maintain safe distance from cutting area',
      'Fire extinguisher must be accessible'
    ],
    riskLevel: 'high',
    precedingOperations: [],
    succeedingOperations: ['OP-BND-001', 'OP-WLD-001'],
    canRunParallel: true,
    avgActualCycleTime: 5.3,
    defectRate: 2.1,
    utilizationRate: 88,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    operationCode: 'OP-BND-001',
    operationName: 'Press Brake Bending',
    operationType: 'bending',
    category: 'manufacturing',
    description: 'Hydraulic press brake bending for sheet metal components',
    defaultWorkstation: 'WS-BEND-01',
    alternativeWorkstations: ['WS-BEND-02'],
    department: 'Production',
    requiredMachine: 'MCH-BND-001',
    requiredMachineType: 'bending',
    requiredTools: ['Bending Dies', 'Back Gauge', 'Angle Measuring Tool'],
    requiredSkill: 'intermediate',
    operatorsRequired: 2,
    helpersRequired: 0,
    setupTime: 20,
    cycleTime: 0.5,
    teardownTime: 10,
    batchSetupTime: 5,
    capacityPerHour: 120,
    capacityPerShift: 900,
    efficiencyFactor: 82,
    costingMethod: 'time_based',
    laborCostPerHour: 300,
    machineRatePerHour: 800,
    overheadRate: 20,
    currency: 'INR',
    requiresInspection: true,
    inspectionType: 'in_process',
    inspectionFrequency: 'first_last',
    qualityCheckPoints: ['Bend angle accuracy', 'Bend length', 'Surface damage'],
    materialWastagePercent: 3,
    consumablesRequired: [
      { item: 'Hydraulic Oil', quantityPerUnit: 0.01, unit: 'L' }
    ],
    safetyGear: ['Safety Gloves', 'Safety Shoes', 'Ear Protection'],
    safetyInstructions: [
      'Use both hands on controls',
      'Check back gauge alignment',
      'Keep hands away from die area',
      'Ensure proper material support'
    ],
    riskLevel: 'medium',
    precedingOperations: ['OP-CUT-001'],
    succeedingOperations: ['OP-WLD-001'],
    canRunParallel: false,
    avgActualCycleTime: 0.6,
    defectRate: 3.5,
    utilizationRate: 82,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    operationCode: 'OP-WLD-001',
    operationName: 'MIG Welding Assembly',
    operationType: 'welding',
    category: 'manufacturing',
    description: 'MIG welding for joining sheet metal components',
    defaultWorkstation: 'WS-WELD-01',
    alternativeWorkstations: ['WS-WELD-02', 'WS-WELD-03'],
    department: 'Production',
    requiredMachine: 'MCH-WLD-001',
    requiredMachineType: 'welding',
    requiredTools: ['Welding Gun', 'Welding Clamps', 'Chipping Hammer', 'Wire Brush'],
    requiredSkill: 'advanced',
    operatorsRequired: 1,
    helpersRequired: 1,
    setupTime: 10,
    cycleTime: 1.3,
    teardownTime: 5,
    capacityPerHour: 45,
    capacityPerShift: 340,
    efficiencyFactor: 78,
    costingMethod: 'time_based',
    laborCostPerHour: 400,
    machineRatePerHour: 600,
    overheadRate: 30,
    currency: 'INR',
    requiresInspection: true,
    inspectionType: 'in_process',
    inspectionFrequency: 'every_unit',
    qualityCheckPoints: ['Weld penetration', 'Weld appearance', 'No porosity', 'Joint strength'],
    materialWastagePercent: 5,
    consumablesRequired: [
      { item: 'Welding Wire', quantityPerUnit: 0.05, unit: 'KG' },
      { item: 'CO2 Gas', quantityPerUnit: 0.3, unit: 'L' },
      { item: 'Contact Tips', quantityPerUnit: 0.002, unit: 'PCS' }
    ],
    safetyGear: ['Welding Helmet', 'Welding Gloves', 'Leather Apron', 'Safety Shoes'],
    safetyInstructions: [
      'Ensure proper ventilation',
      'Check gas connections',
      'Maintain safe arc length',
      'Fire watch for 30 min after welding',
      'Keep fire extinguisher nearby'
    ],
    riskLevel: 'high',
    precedingOperations: ['OP-CUT-001', 'OP-BND-001'],
    succeedingOperations: ['OP-FIN-001', 'OP-QC-001'],
    canRunParallel: false,
    avgActualCycleTime: 1.5,
    defectRate: 4.2,
    utilizationRate: 78,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '4',
    operationCode: 'OP-FIN-001',
    operationName: 'Surface Grinding & Polishing',
    operationType: 'finishing',
    category: 'manufacturing',
    description: 'Surface finishing for smooth and polished appearance',
    defaultWorkstation: 'WS-FINISH-01',
    alternativeWorkstations: ['WS-FINISH-02'],
    department: 'Production',
    requiredMachine: 'MCH-FIN-001',
    requiredMachineType: 'finishing',
    requiredTools: ['Grinding Belts', 'Polishing Pads', 'Dust Mask'],
    requiredSkill: 'intermediate',
    operatorsRequired: 1,
    helpersRequired: 0,
    setupTime: 12,
    cycleTime: 2,
    teardownTime: 8,
    capacityPerHour: 30,
    capacityPerShift: 225,
    efficiencyFactor: 75,
    costingMethod: 'time_based',
    laborCostPerHour: 250,
    machineRatePerHour: 400,
    overheadRate: 15,
    currency: 'INR',
    requiresInspection: true,
    inspectionType: 'final',
    inspectionFrequency: 'sampling',
    qualityCheckPoints: ['Surface roughness', 'Uniform finish', 'No scratches'],
    materialWastagePercent: 2,
    consumablesRequired: [
      { item: 'Grinding Belt 80 Grit', quantityPerUnit: 0.003, unit: 'PCS' },
      { item: 'Grinding Belt 120 Grit', quantityPerUnit: 0.003, unit: 'PCS' },
      { item: 'Polishing Compound', quantityPerUnit: 0.01, unit: 'KG' }
    ],
    safetyGear: ['Safety Goggles', 'Dust Mask', 'Safety Gloves'],
    safetyInstructions: [
      'Check dust collection system',
      'Inspect grinding belts for damage',
      'Maintain proper pressure',
      'Keep hands away from rollers'
    ],
    riskLevel: 'medium',
    precedingOperations: ['OP-WLD-001'],
    succeedingOperations: ['OP-QC-001'],
    canRunParallel: false,
    avgActualCycleTime: 2.2,
    defectRate: 3.8,
    utilizationRate: 75,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '5',
    operationCode: 'OP-ASM-001',
    operationName: 'Cabinet Hardware Assembly',
    operationType: 'assembly',
    category: 'manufacturing',
    description: 'Installation of hinges, handles, and drawer channels',
    defaultWorkstation: 'WS-ASSEM-01',
    alternativeWorkstations: ['WS-ASSEM-02', 'WS-ASSEM-03'],
    department: 'Assembly',
    requiredTools: ['Pneumatic Screwdriver', 'Hex Keys', 'Measuring Tape', 'Level'],
    requiredSkill: 'basic',
    operatorsRequired: 2,
    helpersRequired: 0,
    setupTime: 8,
    cycleTime: 2.4,
    teardownTime: 5,
    capacityPerHour: 25,
    capacityPerShift: 190,
    efficiencyFactor: 80,
    costingMethod: 'time_based',
    laborCostPerHour: 200,
    machineRatePerHour: 150,
    overheadRate: 10,
    currency: 'INR',
    requiresInspection: true,
    inspectionType: 'final',
    inspectionFrequency: 'every_unit',
    qualityCheckPoints: ['Alignment check', 'Tightness of screws', 'Functionality test'],
    materialWastagePercent: 1,
    consumablesRequired: [
      { item: 'Screws', quantityPerUnit: 12, unit: 'PCS' },
      { item: 'Dowels', quantityPerUnit: 8, unit: 'PCS' }
    ],
    safetyGear: ['Safety Glasses', 'Hand Gloves'],
    safetyInstructions: [
      'Check air pressure for pneumatic tools',
      'Ensure proper ergonomic posture',
      'Inspect tools before use'
    ],
    riskLevel: 'low',
    precedingOperations: ['OP-FIN-001'],
    succeedingOperations: ['OP-QC-001', 'OP-PKG-001'],
    canRunParallel: true,
    avgActualCycleTime: 2.5,
    defectRate: 2.5,
    utilizationRate: 80,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '6',
    operationCode: 'OP-QC-001',
    operationName: 'Final Quality Inspection',
    operationType: 'inspection',
    category: 'quality',
    description: 'Comprehensive quality check before packaging',
    defaultWorkstation: 'WS-QC-01',
    alternativeWorkstations: ['WS-QC-02'],
    department: 'Quality Control',
    requiredTools: ['Digital Caliper', 'Surface Roughness Tester', 'Inspection Checklist', 'Camera'],
    requiredSkill: 'intermediate',
    operatorsRequired: 1,
    helpersRequired: 0,
    setupTime: 5,
    cycleTime: 3,
    teardownTime: 2,
    capacityPerHour: 20,
    capacityPerShift: 150,
    efficiencyFactor: 90,
    costingMethod: 'time_based',
    laborCostPerHour: 300,
    machineRatePerHour: 0,
    overheadRate: 5,
    currency: 'INR',
    requiresInspection: false,
    materialWastagePercent: 0,
    consumablesRequired: [],
    safetyGear: ['Safety Glasses'],
    safetyInstructions: [
      'Handle products carefully',
      'Document all defects with photos',
      'Separate rejected items immediately'
    ],
    riskLevel: 'low',
    precedingOperations: ['OP-FIN-001', 'OP-ASM-001'],
    succeedingOperations: ['OP-PKG-001'],
    canRunParallel: false,
    avgActualCycleTime: 3.1,
    defectRate: 0.5,
    utilizationRate: 85,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '7',
    operationCode: 'OP-PKG-001',
    operationName: 'Final Packaging',
    operationType: 'packaging',
    category: 'material_handling',
    description: 'Product packaging with protective materials',
    defaultWorkstation: 'WS-PACK-01',
    alternativeWorkstations: ['WS-PACK-02'],
    department: 'Warehouse',
    requiredTools: ['Carton Sealer', 'Bubble Wrap Dispenser', 'Strapping Tool'],
    requiredSkill: 'basic',
    operatorsRequired: 2,
    helpersRequired: 1,
    setupTime: 5,
    cycleTime: 4,
    teardownTime: 3,
    capacityPerHour: 15,
    capacityPerShift: 110,
    efficiencyFactor: 85,
    costingMethod: 'unit_based',
    laborCostPerHour: 150,
    machineRatePerHour: 50,
    overheadRate: 8,
    currency: 'INR',
    requiresInspection: false,
    materialWastagePercent: 0,
    consumablesRequired: [
      { item: 'Carton Box', quantityPerUnit: 1, unit: 'PCS' },
      { item: 'Bubble Wrap', quantityPerUnit: 2, unit: 'M' },
      { item: 'Packing Tape', quantityPerUnit: 0.5, unit: 'M' },
      { item: 'Strapping Band', quantityPerUnit: 1, unit: 'M' }
    ],
    safetyGear: ['Hand Gloves'],
    safetyInstructions: [
      'Handle products with care',
      'Ensure proper cushioning',
      'Check carton strength',
      'Label correctly'
    ],
    riskLevel: 'low',
    precedingOperations: ['OP-QC-001'],
    succeedingOperations: [],
    canRunParallel: true,
    avgActualCycleTime: 4.2,
    defectRate: 1.0,
    utilizationRate: 82,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '8',
    operationCode: 'OP-CNC-001',
    operationName: 'CNC Routing for Cabinet Panels',
    operationType: 'machining',
    category: 'manufacturing',
    description: 'CNC routing for precise panel cutting and edge profiling',
    defaultWorkstation: 'WS-CNC-01',
    alternativeWorkstations: ['WS-CNC-02'],
    department: 'Production',
    requiredMachine: 'MCH-CNC-001',
    requiredMachineType: 'cnc',
    requiredTools: ['CNC Router Bits', 'Vacuum Hold Down', 'Dust Extraction'],
    requiredSkill: 'advanced',
    operatorsRequired: 1,
    helpersRequired: 0,
    setupTime: 15,
    cycleTime: 7.5,
    teardownTime: 10,
    batchSetupTime: 8,
    capacityPerHour: 8,
    capacityPerShift: 60,
    efficiencyFactor: 85,
    costingMethod: 'time_based',
    laborCostPerHour: 400,
    machineRatePerHour: 1500,
    overheadRate: 28,
    currency: 'INR',
    requiresInspection: true,
    inspectionType: 'in_process',
    inspectionFrequency: 'first_last',
    qualityCheckPoints: ['Dimensional accuracy', 'Edge profile', 'Surface finish', 'Corner radius'],
    materialWastagePercent: 12,
    consumablesRequired: [
      { item: 'CNC Router Bit', quantityPerUnit: 0.001, unit: 'PCS' },
      { item: 'Dust Bags', quantityPerUnit: 0.1, unit: 'PCS' }
    ],
    safetyGear: ['Safety Goggles', 'Ear Protection', 'Dust Mask'],
    safetyInstructions: [
      'Check tool alignment before operation',
      'Ensure material is properly secured',
      'Emergency stop must be accessible',
      'Dust extraction must be running'
    ],
    riskLevel: 'medium',
    precedingOperations: [],
    succeedingOperations: ['OP-FIN-001', 'OP-ASM-001'],
    canRunParallel: true,
    avgActualCycleTime: 7.8,
    defectRate: 2.8,
    utilizationRate: 85,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  }
];

// Helper functions
export function getOperationsByType(type: string): Operation[] {
  return mockOperations.filter(op => op.operationType === type);
}

export function getOperationsByCategory(category: string): Operation[] {
  return mockOperations.filter(op => op.category === category);
}

export function getOperationsByRiskLevel(riskLevel: string): Operation[] {
  return mockOperations.filter(op => op.riskLevel === riskLevel);
}

export function getOperationSequence(startOperationId: string): Operation[] {
  const sequence: Operation[] = [];
  const visited = new Set<string>();

  function traverse(opId: string) {
    if (visited.has(opId)) return;
    visited.add(opId);

    const operation = mockOperations.find(op => op.id === opId);
    if (operation) {
      sequence.push(operation);
      operation.succeedingOperations.forEach(succId => {
        const succOp = mockOperations.find(op => op.operationCode === succId);
        if (succOp) traverse(succOp.id);
      });
    }
  }

  traverse(startOperationId);
  return sequence;
}

export function getOperationStats() {
  const totalCost = mockOperations.reduce((sum, op) =>
    sum + (op.laborCostPerHour + op.machineRatePerHour), 0);
  const avgCycleTime = mockOperations.reduce((sum, op) => sum + op.cycleTime, 0) / mockOperations.length;
  const avgDefectRate = mockOperations.reduce((sum, op) => sum + op.defectRate, 0) / mockOperations.length;

  return {
    total: mockOperations.length,
    active: mockOperations.filter(op => op.isActive).length,
    manufacturing: mockOperations.filter(op => op.category === 'manufacturing').length,
    quality: mockOperations.filter(op => op.category === 'quality').length,
    highRisk: mockOperations.filter(op => op.riskLevel === 'high' || op.riskLevel === 'critical').length,
    avgCycleTime: Math.round(avgCycleTime * 10) / 10,
    avgDefectRate: Math.round(avgDefectRate * 10) / 10,
    avgUtilization: Math.round(mockOperations.reduce((sum, op) => sum + op.utilizationRate, 0) / mockOperations.length)
  };
}
