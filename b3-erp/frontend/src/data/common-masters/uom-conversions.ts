export interface UOMConversion {
  id: string;
  conversionCode: string;
  fromUOM: string;
  toUOM: string;
  conversionFactor: number;
  category: 'weight' | 'length' | 'volume' | 'area' | 'quantity' | 'time' | 'temperature';
  isReversible: boolean;
  formula: string;
  description: string;
  examples: string;
  isActive: boolean;
  lastUpdated: string;
  usageCount: number;
}

export const mockUOMConversions: UOMConversion[] = [
  // Weight Conversions
  {
    id: '1',
    conversionCode: 'CONV-001',
    fromUOM: 'Kilogram (kg)',
    toUOM: 'Gram (g)',
    conversionFactor: 1000,
    category: 'weight',
    isReversible: true,
    formula: '1 kg = 1000 g',
    description: 'Standard metric weight conversion',
    examples: '2 kg = 2000 g, 0.5 kg = 500 g',
    isActive: true,
    lastUpdated: '2025-10-15',
    usageCount: 1250
  },
  {
    id: '2',
    conversionCode: 'CONV-002',
    fromUOM: 'Kilogram (kg)',
    toUOM: 'Metric Ton (MT)',
    conversionFactor: 0.001,
    category: 'weight',
    isReversible: true,
    formula: '1 kg = 0.001 MT',
    description: 'Bulk material weight conversion',
    examples: '1000 kg = 1 MT, 500 kg = 0.5 MT',
    isActive: true,
    lastUpdated: '2025-10-15',
    usageCount: 890
  },
  {
    id: '3',
    conversionCode: 'CONV-003',
    fromUOM: 'Gram (g)',
    toUOM: 'Milligram (mg)',
    conversionFactor: 1000,
    category: 'weight',
    isReversible: true,
    formula: '1 g = 1000 mg',
    description: 'Precision weight measurement',
    examples: '5 g = 5000 mg, 0.1 g = 100 mg',
    isActive: true,
    lastUpdated: '2025-10-12',
    usageCount: 340
  },
  {
    id: '4',
    conversionCode: 'CONV-004',
    fromUOM: 'Kilogram (kg)',
    toUOM: 'Pound (lb)',
    conversionFactor: 2.20462,
    category: 'weight',
    isReversible: true,
    formula: '1 kg = 2.20462 lb',
    description: 'Metric to Imperial weight conversion',
    examples: '10 kg = 22.0462 lb, 5 kg = 11.0231 lb',
    isActive: true,
    lastUpdated: '2025-10-18',
    usageCount: 156
  },

  // Length Conversions
  {
    id: '5',
    conversionCode: 'CONV-005',
    fromUOM: 'Meter (m)',
    toUOM: 'Centimeter (cm)',
    conversionFactor: 100,
    category: 'length',
    isReversible: true,
    formula: '1 m = 100 cm',
    description: 'Standard metric length conversion',
    examples: '1.5 m = 150 cm, 2 m = 200 cm',
    isActive: true,
    lastUpdated: '2025-10-15',
    usageCount: 980
  },
  {
    id: '6',
    conversionCode: 'CONV-006',
    fromUOM: 'Meter (m)',
    toUOM: 'Millimeter (mm)',
    conversionFactor: 1000,
    category: 'length',
    isReversible: true,
    formula: '1 m = 1000 mm',
    description: 'Precision length measurement for manufacturing',
    examples: '0.5 m = 500 mm, 3 m = 3000 mm',
    isActive: true,
    lastUpdated: '2025-10-15',
    usageCount: 1560
  },
  {
    id: '7',
    conversionCode: 'CONV-007',
    fromUOM: 'Meter (m)',
    toUOM: 'Foot (ft)',
    conversionFactor: 3.28084,
    category: 'length',
    isReversible: true,
    formula: '1 m = 3.28084 ft',
    description: 'Metric to Imperial length conversion',
    examples: '2 m = 6.56168 ft, 5 m = 16.4042 ft',
    isActive: true,
    lastUpdated: '2025-10-16',
    usageCount: 425
  },
  {
    id: '8',
    conversionCode: 'CONV-008',
    fromUOM: 'Centimeter (cm)',
    toUOM: 'Inch (in)',
    conversionFactor: 0.393701,
    category: 'length',
    isReversible: true,
    formula: '1 cm = 0.393701 in',
    description: 'Common cabinet and furniture measurement',
    examples: '10 cm = 3.93701 in, 30 cm = 11.811 in',
    isActive: true,
    lastUpdated: '2025-10-17',
    usageCount: 670
  },

  // Volume Conversions
  {
    id: '9',
    conversionCode: 'CONV-009',
    fromUOM: 'Liter (L)',
    toUOM: 'Milliliter (mL)',
    conversionFactor: 1000,
    category: 'volume',
    isReversible: true,
    formula: '1 L = 1000 mL',
    description: 'Standard metric volume conversion',
    examples: '2 L = 2000 mL, 0.5 L = 500 mL',
    isActive: true,
    lastUpdated: '2025-10-15',
    usageCount: 540
  },
  {
    id: '10',
    conversionCode: 'CONV-010',
    fromUOM: 'Cubic Meter (m³)',
    toUOM: 'Liter (L)',
    conversionFactor: 1000,
    category: 'volume',
    isReversible: true,
    formula: '1 m³ = 1000 L',
    description: 'Large volume storage conversion',
    examples: '0.5 m³ = 500 L, 2 m³ = 2000 L',
    isActive: true,
    lastUpdated: '2025-10-14',
    usageCount: 280
  },
  {
    id: '11',
    conversionCode: 'CONV-011',
    fromUOM: 'Liter (L)',
    toUOM: 'Gallon (US)',
    conversionFactor: 0.264172,
    category: 'volume',
    isReversible: true,
    formula: '1 L = 0.264172 Gal (US)',
    description: 'Metric to US volume conversion',
    examples: '10 L = 2.64172 Gal, 20 L = 5.28344 Gal',
    isActive: true,
    lastUpdated: '2025-10-16',
    usageCount: 195
  },

  // Area Conversions
  {
    id: '12',
    conversionCode: 'CONV-012',
    fromUOM: 'Square Meter (m²)',
    toUOM: 'Square Centimeter (cm²)',
    conversionFactor: 10000,
    category: 'area',
    isReversible: true,
    formula: '1 m² = 10,000 cm²',
    description: 'Standard metric area conversion',
    examples: '2 m² = 20,000 cm², 0.5 m² = 5,000 cm²',
    isActive: true,
    lastUpdated: '2025-10-15',
    usageCount: 420
  },
  {
    id: '13',
    conversionCode: 'CONV-013',
    fromUOM: 'Square Meter (m²)',
    toUOM: 'Square Foot (ft²)',
    conversionFactor: 10.7639,
    category: 'area',
    isReversible: true,
    formula: '1 m² = 10.7639 ft²',
    description: 'Metric to Imperial area conversion',
    examples: '5 m² = 53.8195 ft², 10 m² = 107.639 ft²',
    isActive: true,
    lastUpdated: '2025-10-17',
    usageCount: 310
  },
  {
    id: '14',
    conversionCode: 'CONV-014',
    fromUOM: 'Square Foot (ft²)',
    toUOM: 'Square Inch (in²)',
    conversionFactor: 144,
    category: 'area',
    isReversible: true,
    formula: '1 ft² = 144 in²',
    description: 'Imperial area measurement',
    examples: '2 ft² = 288 in², 5 ft² = 720 in²',
    isActive: true,
    lastUpdated: '2025-10-15',
    usageCount: 265
  },

  // Quantity Conversions
  {
    id: '15',
    conversionCode: 'CONV-015',
    fromUOM: 'Dozen (Dz)',
    toUOM: 'Piece (Pc)',
    conversionFactor: 12,
    category: 'quantity',
    isReversible: false,
    formula: '1 Dozen = 12 Pieces',
    description: 'Standard packaging count conversion',
    examples: '2 Dz = 24 Pc, 5 Dz = 60 Pc',
    isActive: true,
    lastUpdated: '2025-10-18',
    usageCount: 890
  },
  {
    id: '16',
    conversionCode: 'CONV-016',
    fromUOM: 'Gross',
    toUOM: 'Piece (Pc)',
    conversionFactor: 144,
    category: 'quantity',
    isReversible: false,
    formula: '1 Gross = 144 Pieces',
    description: 'Bulk packaging count conversion',
    examples: '1 Gross = 144 Pc, 2 Gross = 288 Pc',
    isActive: true,
    lastUpdated: '2025-10-16',
    usageCount: 245
  },
  {
    id: '17',
    conversionCode: 'CONV-017',
    fromUOM: 'Box',
    toUOM: 'Piece (Pc)',
    conversionFactor: 100,
    category: 'quantity',
    isReversible: false,
    formula: '1 Box = 100 Pieces (Hardware)',
    description: 'Hardware packaging standard',
    examples: '2 Box = 200 Pc, 5 Box = 500 Pc',
    isActive: true,
    lastUpdated: '2025-10-19',
    usageCount: 540
  },

  // Time Conversions
  {
    id: '18',
    conversionCode: 'CONV-018',
    fromUOM: 'Hour (hr)',
    toUOM: 'Minute (min)',
    conversionFactor: 60,
    category: 'time',
    isReversible: true,
    formula: '1 hr = 60 min',
    description: 'Standard time conversion for production scheduling',
    examples: '2 hr = 120 min, 0.5 hr = 30 min',
    isActive: true,
    lastUpdated: '2025-10-15',
    usageCount: 1120
  },
  {
    id: '19',
    conversionCode: 'CONV-019',
    fromUOM: 'Day',
    toUOM: 'Hour (hr)',
    conversionFactor: 24,
    category: 'time',
    isReversible: true,
    formula: '1 Day = 24 hr',
    description: 'Work time calculation',
    examples: '2 Day = 48 hr, 0.5 Day = 12 hr',
    isActive: true,
    lastUpdated: '2025-10-14',
    usageCount: 380
  },

  // Temperature Conversions (Note: These need special handling for offset)
  {
    id: '20',
    conversionCode: 'CONV-020',
    fromUOM: 'Celsius (°C)',
    toUOM: 'Fahrenheit (°F)',
    conversionFactor: 1.8,
    category: 'temperature',
    isReversible: true,
    formula: '°F = (°C × 1.8) + 32',
    description: 'Temperature conversion (requires offset +32)',
    examples: '0°C = 32°F, 100°C = 212°F',
    isActive: true,
    lastUpdated: '2025-10-17',
    usageCount: 125
  }
];

export function getUOMConversionStats() {
  const total = mockUOMConversions.length;
  const weight = mockUOMConversions.filter(c => c.category === 'weight').length;
  const length = mockUOMConversions.filter(c => c.category === 'length').length;
  const volume = mockUOMConversions.filter(c => c.category === 'volume').length;
  const area = mockUOMConversions.filter(c => c.category === 'area').length;
  const quantity = mockUOMConversions.filter(c => c.category === 'quantity').length;
  const reversible = mockUOMConversions.filter(c => c.isReversible).length;
  const active = mockUOMConversions.filter(c => c.isActive).length;
  const totalUsage = mockUOMConversions.reduce((sum, c) => sum + c.usageCount, 0);

  return {
    total,
    weight,
    length,
    volume,
    area,
    quantity,
    reversible,
    active,
    totalUsage
  };
}

export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    weight: 'Weight',
    length: 'Length',
    volume: 'Volume',
    area: 'Area',
    quantity: 'Quantity',
    time: 'Time',
    temperature: 'Temperature'
  };
  return names[category] || category;
}
