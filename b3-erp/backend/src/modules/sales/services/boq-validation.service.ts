import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface BOQItem {
  id: string;
  lineNumber: number;
  itemCode?: string;
  description: string;
  specifications?: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice?: number;
  estimatedTotalPrice?: number;
  requiredDate?: string;
  priority: 'must_have' | 'should_have' | 'nice_to_have';
  category?: string;
  notes?: string;
  // Mapping to catalog
  mappedItemId?: string;
  mappedItemCode?: string;
  mappedItemName?: string;
  mappingConfidence?: number; // 0-100
  mappingStatus: 'unmapped' | 'suggested' | 'confirmed' | 'custom';
}

export interface BOQ {
  id: string;
  boqNumber: string;
  version: number;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';

  // Reference
  rfpId?: string;
  rfpNumber?: string;
  customerId?: string;
  customerName?: string;

  // BOQ Details
  title: string;
  description?: string;
  items: BOQItem[];

  // Totals
  totalItems: number;
  totalQuantity: number;
  estimatedTotalValue: number;

  // Validation
  validationStatus: 'pending' | 'passed' | 'failed' | 'warnings';
  validationErrors: string[];
  validationWarnings: string[];

  // Dates
  receivedDate: string;
  requiredByDate?: string;
  validUntil?: string;

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  // Version tracking
  previousVersionId?: string;
  changeLog?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completenessScore: number; // 0-100
  mappingScore: number; // 0-100
}

export interface BOQComparison {
  addedItems: BOQItem[];
  removedItems: BOQItem[];
  modifiedItems: Array<{
    lineNumber: number;
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  quantityChanges: Array<{
    lineNumber: number;
    description: string;
    oldQuantity: number;
    newQuantity: number;
    percentageChange: number;
  }>;
  summary: {
    totalChanges: number;
    valueImpact: number;
    requiresReview: boolean;
  };
}

@Injectable()
export class BOQValidationService {
  private boqs: BOQ[] = [];

  // Validation rules
  private readonly requiredFields = ['description', 'quantity', 'unit'];
  private readonly validUnits = ['Nos', 'Pcs', 'Kg', 'Ton', 'Mtr', 'Sqm', 'Ltr', 'Set', 'Lot', 'Box', 'Pack'];
  private readonly minQuantity = 0.001;

  constructor() {
    this.seedMockData();
  }

  async create(createDto: Partial<BOQ>): Promise<BOQ> {
    const boqNumber = await this.generateBOQNumber();

    const boq: BOQ = {
      id: uuidv4(),
      boqNumber,
      version: 1,
      status: 'draft',
      title: createDto.title || '',
      items: createDto.items || [],
      totalItems: 0,
      totalQuantity: 0,
      estimatedTotalValue: 0,
      validationStatus: 'pending',
      validationErrors: [],
      validationWarnings: [],
      receivedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: createDto.createdBy || 'system',
      updatedBy: createDto.updatedBy || 'system',
      ...createDto,
    };

    // Calculate totals
    this.calculateTotals(boq);

    // Auto-assign line numbers if not provided
    boq.items.forEach((item, index) => {
      if (!item.id) item.id = uuidv4();
      if (!item.lineNumber) item.lineNumber = index + 1;
      if (!item.mappingStatus) item.mappingStatus = 'unmapped';
    });

    this.boqs.push(boq);
    return boq;
  }

  async findOne(id: string): Promise<BOQ> {
    const boq = this.boqs.find(b => b.id === id);
    if (!boq) {
      throw new NotFoundException(`BOQ with ID ${id} not found`);
    }
    return boq;
  }

  async findByRFP(rfpId: string): Promise<BOQ[]> {
    return this.boqs
      .filter(b => b.rfpId === rfpId)
      .sort((a, b) => b.version - a.version);
  }

  async update(id: string, updateDto: Partial<BOQ>): Promise<BOQ> {
    const index = this.boqs.findIndex(b => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`BOQ with ID ${id} not found`);
    }

    const updated = {
      ...this.boqs[index],
      ...updateDto,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate totals if items changed
    if (updateDto.items) {
      this.calculateTotals(updated);
    }

    this.boqs[index] = updated;
    return updated;
  }

  async validateBOQ(id: string): Promise<ValidationResult> {
    const boq = await this.findOne(id);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if BOQ has items
    if (!boq.items || boq.items.length === 0) {
      errors.push('BOQ must contain at least one item');
    }

    let validItems = 0;
    let mappedItems = 0;

    // Validate each item
    for (const item of boq.items) {
      const itemErrors: string[] = [];
      const itemWarnings: string[] = [];

      // Check required fields
      for (const field of this.requiredFields) {
        if (!item[field as keyof BOQItem]) {
          itemErrors.push(`Line ${item.lineNumber}: Missing required field '${field}'`);
        }
      }

      // Validate quantity
      if (item.quantity <= 0) {
        itemErrors.push(`Line ${item.lineNumber}: Quantity must be greater than 0`);
      } else if (item.quantity < this.minQuantity) {
        itemWarnings.push(`Line ${item.lineNumber}: Very small quantity (${item.quantity})`);
      }

      // Validate unit
      if (item.unit && !this.validUnits.includes(item.unit)) {
        itemWarnings.push(`Line ${item.lineNumber}: Non-standard unit '${item.unit}'`);
      }

      // Check for duplicate descriptions
      const duplicates = boq.items.filter(i =>
        i.id !== item.id &&
        i.description?.toLowerCase() === item.description?.toLowerCase()
      );
      if (duplicates.length > 0) {
        itemWarnings.push(`Line ${item.lineNumber}: Duplicate description found`);
      }

      // Check mapping status
      if (item.mappingStatus === 'unmapped') {
        itemWarnings.push(`Line ${item.lineNumber}: Item not mapped to catalog`);
      } else if (item.mappingStatus === 'confirmed') {
        mappedItems++;
      }

      // Check estimated prices
      if (!item.estimatedUnitPrice || item.estimatedUnitPrice <= 0) {
        itemWarnings.push(`Line ${item.lineNumber}: No estimated unit price`);
      }

      errors.push(...itemErrors);
      warnings.push(...itemWarnings);

      if (itemErrors.length === 0) {
        validItems++;
      }
    }

    // Calculate scores
    const completenessScore = boq.items.length > 0
      ? Math.round((validItems / boq.items.length) * 100)
      : 0;

    const mappingScore = boq.items.length > 0
      ? Math.round((mappedItems / boq.items.length) * 100)
      : 0;

    // Update BOQ with validation results
    const validationStatus = errors.length > 0
      ? 'failed'
      : warnings.length > 0
        ? 'warnings'
        : 'passed';

    await this.update(id, {
      validationStatus,
      validationErrors: errors,
      validationWarnings: warnings,
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completenessScore,
      mappingScore,
    };
  }

  async mapItemToCatalog(
    boqId: string,
    itemId: string,
    mappedItemId: string,
    mappedItemCode: string,
    mappedItemName: string
  ): Promise<BOQItem> {
    const boq = await this.findOne(boqId);
    const item = boq.items.find(i => i.id === itemId);

    if (!item) {
      throw new NotFoundException(`Item ${itemId} not found in BOQ`);
    }

    item.mappedItemId = mappedItemId;
    item.mappedItemCode = mappedItemCode;
    item.mappedItemName = mappedItemName;
    item.mappingStatus = 'confirmed';
    item.mappingConfidence = 100;

    await this.update(boqId, { items: boq.items });

    return item;
  }

  async suggestItemMappings(boqId: string): Promise<BOQItem[]> {
    const boq = await this.findOne(boqId);
    const suggestions: BOQItem[] = [];

    // Mock catalog items for demonstration
    const catalogItems = [
      { id: 'cat-001', code: 'MTR-001', name: 'Industrial Motor 5HP' },
      { id: 'cat-002', code: 'PNL-001', name: 'Control Panel Assembly' },
      { id: 'cat-003', code: 'CVY-001', name: 'Conveyor Belt System' },
      { id: 'cat-004', code: 'PMP-001', name: 'Centrifugal Pump' },
      { id: 'cat-005', code: 'VLV-001', name: 'Gate Valve 2 inch' },
    ];

    for (const item of boq.items) {
      if (item.mappingStatus === 'unmapped' || item.mappingStatus === 'suggested') {
        // Simple fuzzy matching based on description keywords
        const description = item.description?.toLowerCase() || '';

        for (const catItem of catalogItems) {
          const catName = catItem.name.toLowerCase();
          const words = catName.split(' ');
          const matchingWords = words.filter(word => description.includes(word));

          if (matchingWords.length >= 2) {
            item.mappedItemId = catItem.id;
            item.mappedItemCode = catItem.code;
            item.mappedItemName = catItem.name;
            item.mappingStatus = 'suggested';
            item.mappingConfidence = Math.round((matchingWords.length / words.length) * 100);
            suggestions.push(item);
            break;
          }
        }
      }
    }

    await this.update(boqId, { items: boq.items });

    return suggestions;
  }

  async createNewVersion(id: string, changeLog: string, updatedBy: string): Promise<BOQ> {
    const originalBoq = await this.findOne(id);

    const newBoq: BOQ = {
      ...originalBoq,
      id: uuidv4(),
      version: originalBoq.version + 1,
      status: 'draft',
      previousVersionId: originalBoq.id,
      changeLog,
      validationStatus: 'pending',
      validationErrors: [],
      validationWarnings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    // Deep copy items with new IDs
    newBoq.items = originalBoq.items.map(item => ({
      ...item,
      id: uuidv4(),
    }));

    this.boqs.push(newBoq);

    return newBoq;
  }

  async compareBOQVersions(boqId1: string, boqId2: string): Promise<BOQComparison> {
    const boq1 = await this.findOne(boqId1);
    const boq2 = await this.findOne(boqId2);

    const addedItems: BOQItem[] = [];
    const removedItems: BOQItem[] = [];
    const modifiedItems: BOQComparison['modifiedItems'] = [];
    const quantityChanges: BOQComparison['quantityChanges'] = [];

    // Find removed items (in boq1 but not in boq2)
    for (const item1 of boq1.items) {
      const matchingItem = boq2.items.find(i2 =>
        i2.description?.toLowerCase() === item1.description?.toLowerCase()
      );

      if (!matchingItem) {
        removedItems.push(item1);
      }
    }

    // Find added and modified items
    for (const item2 of boq2.items) {
      const matchingItem = boq1.items.find(i1 =>
        i1.description?.toLowerCase() === item2.description?.toLowerCase()
      );

      if (!matchingItem) {
        addedItems.push(item2);
      } else {
        // Check for modifications
        if (matchingItem.quantity !== item2.quantity) {
          const percentageChange = ((item2.quantity - matchingItem.quantity) / matchingItem.quantity) * 100;
          quantityChanges.push({
            lineNumber: item2.lineNumber,
            description: item2.description,
            oldQuantity: matchingItem.quantity,
            newQuantity: item2.quantity,
            percentageChange,
          });

          modifiedItems.push({
            lineNumber: item2.lineNumber,
            field: 'quantity',
            oldValue: matchingItem.quantity,
            newValue: item2.quantity,
          });
        }

        if (matchingItem.unit !== item2.unit) {
          modifiedItems.push({
            lineNumber: item2.lineNumber,
            field: 'unit',
            oldValue: matchingItem.unit,
            newValue: item2.unit,
          });
        }

        if (matchingItem.specifications !== item2.specifications) {
          modifiedItems.push({
            lineNumber: item2.lineNumber,
            field: 'specifications',
            oldValue: matchingItem.specifications,
            newValue: item2.specifications,
          });
        }
      }
    }

    // Calculate value impact
    const oldTotal = boq1.estimatedTotalValue;
    const newTotal = boq2.estimatedTotalValue;
    const valueImpact = newTotal - oldTotal;

    const totalChanges = addedItems.length + removedItems.length + modifiedItems.length;
    const requiresReview = totalChanges > 5 || Math.abs(valueImpact) > oldTotal * 0.1;

    return {
      addedItems,
      removedItems,
      modifiedItems,
      quantityChanges,
      summary: {
        totalChanges,
        valueImpact,
        requiresReview,
      },
    };
  }

  async getBOQHistory(rfpId: string): Promise<BOQ[]> {
    return this.boqs
      .filter(b => b.rfpId === rfpId)
      .sort((a, b) => a.version - b.version);
  }

  async approveBOQ(id: string, approvedBy: string): Promise<BOQ> {
    const boq = await this.findOne(id);

    if (boq.validationStatus === 'failed') {
      throw new BadRequestException('Cannot approve BOQ with validation errors');
    }

    return this.update(id, {
      status: 'approved',
      updatedBy: approvedBy,
    });
  }

  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    averageCompleteness: number;
    averageMapping: number;
  }> {
    const byStatus: Record<string, number> = {};
    let totalCompleteness = 0;
    let totalMapping = 0;

    for (const boq of this.boqs) {
      byStatus[boq.status] = (byStatus[boq.status] || 0) + 1;

      // Calculate completeness for this BOQ
      const validItems = boq.items.filter(i =>
        i.description && i.quantity > 0 && i.unit
      ).length;
      totalCompleteness += boq.items.length > 0
        ? (validItems / boq.items.length) * 100
        : 0;

      // Calculate mapping score
      const mappedItems = boq.items.filter(i =>
        i.mappingStatus === 'confirmed'
      ).length;
      totalMapping += boq.items.length > 0
        ? (mappedItems / boq.items.length) * 100
        : 0;
    }

    return {
      total: this.boqs.length,
      byStatus,
      averageCompleteness: this.boqs.length > 0
        ? Math.round(totalCompleteness / this.boqs.length)
        : 0,
      averageMapping: this.boqs.length > 0
        ? Math.round(totalMapping / this.boqs.length)
        : 0,
    };
  }

  private calculateTotals(boq: BOQ): void {
    boq.totalItems = boq.items.length;
    boq.totalQuantity = boq.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    boq.estimatedTotalValue = boq.items.reduce((sum, item) => {
      const itemTotal = item.estimatedTotalPrice ||
        ((item.estimatedUnitPrice || 0) * (item.quantity || 0));
      return sum + itemTotal;
    }, 0);
  }

  private async generateBOQNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.boqs.length + 1).padStart(4, '0');
    return `BOQ-${year}${month}-${sequence}`;
  }

  private seedMockData(): void {
    this.create({
      rfpId: 'rfp-001',
      rfpNumber: 'RFP-202401-00001',
      customerId: 'cust-001',
      customerName: 'Acme Manufacturing',
      title: 'Manufacturing Equipment BOQ',
      description: 'Bill of quantities for new production line',
      items: [
        {
          id: uuidv4(),
          lineNumber: 1,
          description: 'Industrial Motor 5HP 3-Phase',
          specifications: '5HP, 3-Phase, 1440 RPM, IE3 efficiency',
          quantity: 10,
          unit: 'Nos',
          estimatedUnitPrice: 25000,
          priority: 'must_have',
          category: 'Motors',
          mappingStatus: 'unmapped',
        },
        {
          id: uuidv4(),
          lineNumber: 2,
          description: 'Control Panel with VFD',
          specifications: 'IP55, with 5HP VFD',
          quantity: 5,
          unit: 'Nos',
          estimatedUnitPrice: 75000,
          priority: 'must_have',
          category: 'Electrical',
          mappingStatus: 'unmapped',
        },
        {
          id: uuidv4(),
          lineNumber: 3,
          description: 'Conveyor Belt Assembly',
          specifications: '10m length, 500mm width',
          quantity: 2,
          unit: 'Set',
          estimatedUnitPrice: 150000,
          priority: 'must_have',
          category: 'Material Handling',
          mappingStatus: 'unmapped',
        },
      ],
      createdBy: 'system',
    });
  }
}
