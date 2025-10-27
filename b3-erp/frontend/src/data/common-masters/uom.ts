export interface UOM {
  id: string;
  uomCode: string;
  uomName: string;
  uomType: 'length' | 'area' | 'volume' | 'weight' | 'quantity' | 'time';
  symbol: string;

  // Base unit reference
  isBaseUnit: boolean;
  baseUnitId?: string;
  baseUnitName?: string;
  conversionFactor?: number; // multiply by this to convert to base unit

  // Decimal precision
  decimalPlaces: number;

  // Usage
  allowFractional: boolean;
  mustBeWholeNumber: boolean;

  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UOMConversion {
  id: string;
  fromUOM: string;
  fromUOMCode: string;
  toUOM: string;
  toUOMCode: string;
  conversionFactor: number; // multiply fromUOM by this to get toUOM
  formula: string;
  bidirectional: boolean;
  uomType: 'length' | 'area' | 'volume' | 'weight' | 'quantity' | 'time';
  isActive: boolean;
  createdAt: string;
}

export const mockUOMs: UOM[] = [
  // Length - Base: Meter
  {
    id: '1',
    uomCode: 'M',
    uomName: 'Meter',
    uomType: 'length',
    symbol: 'm',
    isBaseUnit: true,
    decimalPlaces: 3,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Base unit for length measurement',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    uomCode: 'MM',
    uomName: 'Millimeter',
    uomType: 'length',
    symbol: 'mm',
    isBaseUnit: false,
    baseUnitId: '1',
    baseUnitName: 'Meter',
    conversionFactor: 0.001,
    decimalPlaces: 2,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Used for precise measurements in manufacturing',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '3',
    uomCode: 'CM',
    uomName: 'Centimeter',
    uomType: 'length',
    symbol: 'cm',
    isBaseUnit: false,
    baseUnitId: '1',
    baseUnitName: 'Meter',
    conversionFactor: 0.01,
    decimalPlaces: 2,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Common unit for dimensions',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '4',
    uomCode: 'FT',
    uomName: 'Feet',
    uomType: 'length',
    symbol: 'ft',
    isBaseUnit: false,
    baseUnitId: '1',
    baseUnitName: 'Meter',
    conversionFactor: 0.3048,
    decimalPlaces: 3,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Imperial unit, commonly used in kitchen dimensions',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '5',
    uomCode: 'IN',
    uomName: 'Inch',
    uomType: 'length',
    symbol: 'in',
    isBaseUnit: false,
    baseUnitId: '1',
    baseUnitName: 'Meter',
    conversionFactor: 0.0254,
    decimalPlaces: 3,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Imperial unit for detailed measurements',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },

  // Area - Base: Square Meter
  {
    id: '11',
    uomCode: 'SQM',
    uomName: 'Square Meter',
    uomType: 'area',
    symbol: 'm²',
    isBaseUnit: true,
    decimalPlaces: 3,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Base unit for area measurement',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '12',
    uomCode: 'SQFT',
    uomName: 'Square Feet',
    uomType: 'area',
    symbol: 'sq ft',
    isBaseUnit: false,
    baseUnitId: '11',
    baseUnitName: 'Square Meter',
    conversionFactor: 0.092903,
    decimalPlaces: 2,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Imperial area unit for countertops and surfaces',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },

  // Weight - Base: Kilogram
  {
    id: '21',
    uomCode: 'KG',
    uomName: 'Kilogram',
    uomType: 'weight',
    symbol: 'kg',
    isBaseUnit: true,
    decimalPlaces: 3,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Base unit for weight measurement',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '22',
    uomCode: 'G',
    uomName: 'Gram',
    uomType: 'weight',
    symbol: 'g',
    isBaseUnit: false,
    baseUnitId: '21',
    baseUnitName: 'Kilogram',
    conversionFactor: 0.001,
    decimalPlaces: 2,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Used for small weight measurements',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '23',
    uomCode: 'MT',
    uomName: 'Metric Ton',
    uomType: 'weight',
    symbol: 't',
    isBaseUnit: false,
    baseUnitId: '21',
    baseUnitName: 'Kilogram',
    conversionFactor: 1000,
    decimalPlaces: 3,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Used for bulk materials like steel',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },

  // Volume - Base: Liter
  {
    id: '31',
    uomCode: 'L',
    uomName: 'Liter',
    uomType: 'volume',
    symbol: 'L',
    isBaseUnit: true,
    decimalPlaces: 3,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Base unit for volume measurement',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '32',
    uomCode: 'ML',
    uomName: 'Milliliter',
    uomType: 'volume',
    symbol: 'ml',
    isBaseUnit: false,
    baseUnitId: '31',
    baseUnitName: 'Liter',
    conversionFactor: 0.001,
    decimalPlaces: 2,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Used for adhesives and chemicals',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },

  // Quantity - Base: Piece
  {
    id: '41',
    uomCode: 'PCS',
    uomName: 'Piece',
    uomType: 'quantity',
    symbol: 'pcs',
    isBaseUnit: true,
    decimalPlaces: 0,
    allowFractional: false,
    mustBeWholeNumber: true,
    description: 'Base unit for counting items',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '42',
    uomCode: 'DOZ',
    uomName: 'Dozen',
    uomType: 'quantity',
    symbol: 'doz',
    isBaseUnit: false,
    baseUnitId: '41',
    baseUnitName: 'Piece',
    conversionFactor: 12,
    decimalPlaces: 0,
    allowFractional: false,
    mustBeWholeNumber: true,
    description: '12 pieces',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '43',
    uomCode: 'PAIR',
    uomName: 'Pair',
    uomType: 'quantity',
    symbol: 'pair',
    isBaseUnit: false,
    baseUnitId: '41',
    baseUnitName: 'Piece',
    conversionFactor: 2,
    decimalPlaces: 0,
    allowFractional: false,
    mustBeWholeNumber: true,
    description: '2 pieces (for hinges, handles, etc.)',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '44',
    uomCode: 'BOX',
    uomName: 'Box',
    uomType: 'quantity',
    symbol: 'box',
    isBaseUnit: false,
    baseUnitId: '41',
    baseUnitName: 'Piece',
    conversionFactor: 100,
    decimalPlaces: 0,
    allowFractional: false,
    mustBeWholeNumber: true,
    description: 'Packaging unit (100 pcs)',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '45',
    uomCode: 'SET',
    uomName: 'Set',
    uomType: 'quantity',
    symbol: 'set',
    isBaseUnit: true,
    decimalPlaces: 0,
    allowFractional: false,
    mustBeWholeNumber: true,
    description: 'Complete set of items (kitchen set)',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '46',
    uomCode: 'SHEET',
    uomName: 'Sheet',
    uomType: 'quantity',
    symbol: 'sht',
    isBaseUnit: true,
    decimalPlaces: 0,
    allowFractional: false,
    mustBeWholeNumber: true,
    description: 'Metal/glass sheet',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },

  // Time - Base: Hour
  {
    id: '51',
    uomCode: 'HR',
    uomName: 'Hour',
    uomType: 'time',
    symbol: 'hr',
    isBaseUnit: true,
    decimalPlaces: 2,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Base unit for time tracking',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: '52',
    uomCode: 'MIN',
    uomName: 'Minute',
    uomType: 'time',
    symbol: 'min',
    isBaseUnit: false,
    baseUnitId: '51',
    baseUnitName: 'Hour',
    conversionFactor: 0.0166667,
    decimalPlaces: 2,
    allowFractional: true,
    mustBeWholeNumber: false,
    description: 'Used for operation timing',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  }
];

export const mockUOMConversions: UOMConversion[] = [
  // Length conversions
  {
    id: 'C1',
    fromUOM: 'Millimeter',
    fromUOMCode: 'MM',
    toUOM: 'Centimeter',
    toUOMCode: 'CM',
    conversionFactor: 0.1,
    formula: '1 mm = 0.1 cm',
    bidirectional: true,
    uomType: 'length',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'C2',
    fromUOM: 'Centimeter',
    fromUOMCode: 'CM',
    toUOM: 'Meter',
    toUOMCode: 'M',
    conversionFactor: 0.01,
    formula: '1 cm = 0.01 m',
    bidirectional: true,
    uomType: 'length',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'C3',
    fromUOM: 'Millimeter',
    fromUOMCode: 'MM',
    toUOM: 'Meter',
    toUOMCode: 'M',
    conversionFactor: 0.001,
    formula: '1 mm = 0.001 m',
    bidirectional: true,
    uomType: 'length',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'C4',
    fromUOM: 'Inch',
    fromUOMCode: 'IN',
    toUOM: 'Feet',
    toUOMCode: 'FT',
    conversionFactor: 0.0833333,
    formula: '1 in = 0.0833 ft',
    bidirectional: true,
    uomType: 'length',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'C5',
    fromUOM: 'Feet',
    fromUOMCode: 'FT',
    toUOM: 'Meter',
    toUOMCode: 'M',
    conversionFactor: 0.3048,
    formula: '1 ft = 0.3048 m',
    bidirectional: true,
    uomType: 'length',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'C6',
    fromUOM: 'Inch',
    fromUOMCode: 'IN',
    toUOM: 'Centimeter',
    toUOMCode: 'CM',
    conversionFactor: 2.54,
    formula: '1 in = 2.54 cm',
    bidirectional: true,
    uomType: 'length',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },

  // Weight conversions
  {
    id: 'C11',
    fromUOM: 'Gram',
    fromUOMCode: 'G',
    toUOM: 'Kilogram',
    toUOMCode: 'KG',
    conversionFactor: 0.001,
    formula: '1 g = 0.001 kg',
    bidirectional: true,
    uomType: 'weight',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'C12',
    fromUOM: 'Kilogram',
    fromUOMCode: 'KG',
    toUOM: 'Metric Ton',
    toUOMCode: 'MT',
    conversionFactor: 0.001,
    formula: '1 kg = 0.001 t',
    bidirectional: true,
    uomType: 'weight',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },

  // Volume conversions
  {
    id: 'C21',
    fromUOM: 'Milliliter',
    fromUOMCode: 'ML',
    toUOM: 'Liter',
    toUOMCode: 'L',
    conversionFactor: 0.001,
    formula: '1 ml = 0.001 L',
    bidirectional: true,
    uomType: 'volume',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },

  // Quantity conversions
  {
    id: 'C31',
    fromUOM: 'Pair',
    fromUOMCode: 'PAIR',
    toUOM: 'Piece',
    toUOMCode: 'PCS',
    conversionFactor: 2,
    formula: '1 pair = 2 pcs',
    bidirectional: true,
    uomType: 'quantity',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'C32',
    fromUOM: 'Dozen',
    fromUOMCode: 'DOZ',
    toUOM: 'Piece',
    toUOMCode: 'PCS',
    conversionFactor: 12,
    formula: '1 doz = 12 pcs',
    bidirectional: true,
    uomType: 'quantity',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'C33',
    fromUOM: 'Box',
    fromUOMCode: 'BOX',
    toUOM: 'Piece',
    toUOMCode: 'PCS',
    conversionFactor: 100,
    formula: '1 box = 100 pcs',
    bidirectional: true,
    uomType: 'quantity',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },

  // Time conversions
  {
    id: 'C41',
    fromUOM: 'Minute',
    fromUOMCode: 'MIN',
    toUOM: 'Hour',
    toUOMCode: 'HR',
    conversionFactor: 0.0166667,
    formula: '1 min = 0.0167 hr',
    bidirectional: true,
    uomType: 'time',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  }
];

// Helper functions
export function getUOMsByType(type: string): UOM[] {
  return mockUOMs.filter(uom => uom.uomType === type);
}

export function getBaseUOMs(): UOM[] {
  return mockUOMs.filter(uom => uom.isBaseUnit);
}

export function getConversionFactor(fromUOMCode: string, toUOMCode: string): number | null {
  const conversion = mockUOMConversions.find(
    c => (c.fromUOMCode === fromUOMCode && c.toUOMCode === toUOMCode) ||
         (c.bidirectional && c.fromUOMCode === toUOMCode && c.toUOMCode === fromUOMCode)
  );

  if (!conversion) return null;

  if (conversion.fromUOMCode === fromUOMCode) {
    return conversion.conversionFactor;
  } else {
    return 1 / conversion.conversionFactor;
  }
}

export function convertValue(value: number, fromUOMCode: string, toUOMCode: string): number | null {
  const factor = getConversionFactor(fromUOMCode, toUOMCode);
  return factor ? value * factor : null;
}

export function getUOMStats() {
  return {
    total: mockUOMs.length,
    active: mockUOMs.filter(u => u.isActive).length,
    baseUnits: mockUOMs.filter(u => u.isBaseUnit).length,
    length: mockUOMs.filter(u => u.uomType === 'length').length,
    weight: mockUOMs.filter(u => u.uomType === 'weight').length,
    volume: mockUOMs.filter(u => u.uomType === 'volume').length,
    quantity: mockUOMs.filter(u => u.uomType === 'quantity').length,
    totalConversions: mockUOMConversions.length
  };
}
