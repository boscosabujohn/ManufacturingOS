import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EventBusService } from '../../workflow/services/event-bus.service';
import { WorkflowEventType } from '../../workflow/events/event-types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProductionRequest {
  id: string;
  requestNumber: string;
  requestType: 'customer_order' | 'stock_maintenance' | 'sample' | 'prototype' | 'rework';
  sourceId: string;
  sourceNumber: string;
  customerId?: string;
  customerName?: string;
  items: ProductionItem[];
  requestedDeliveryDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
  status: 'pending_validation' | 'validated' | 'approved' | 'rejected' | 'in_production';
  validations: {
    creditVerification: ValidationResult;
    technicalSpecification: ValidationResult;
    deliveryFeasibility: ValidationResult;
    capacityAvailability: ValidationResult;
    profitabilityAnalysis: ValidationResult;
  };
  overallValidation: ValidationResult;
  createdAt: string;
  createdBy: string;
}

export interface ProductionItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  bomId?: string;
  routingId?: string;
  specifications?: string;
  qualityRequirements?: string;
}

export interface CapacityCheck {
  isAvailable: boolean;
  requiredHours: number;
  availableHours: number;
  utilizationPercentage: number;
  bottlenecks: string[];
  earliestStartDate: string;
  estimatedCompletionDate: string;
}

export interface DeliveryFeasibility {
  isFeasible: boolean;
  requestedDate: string;
  estimatedDate: string;
  bufferDays: number;
  risks: string[];
}

@Injectable()
export class ProductionInitiationService {
  private productionRequests: ProductionRequest[] = [];

  constructor(private readonly eventBusService: EventBusService) { }

  async initiateFromSalesOrder(
    salesOrderId: string,
    salesOrderNumber: string,
    customerId: string,
    customerName: string,
    items: ProductionItem[],
    requestedDeliveryDate: string,
    createdBy: string
  ): Promise<ProductionRequest> {
    const requestNumber = await this.generateRequestNumber();

    const request: ProductionRequest = {
      id: uuidv4(),
      requestNumber,
      requestType: 'customer_order',
      sourceId: salesOrderId,
      sourceNumber: salesOrderNumber,
      customerId,
      customerName,
      items,
      requestedDeliveryDate,
      priority: 'normal',
      status: 'pending_validation',
      validations: {
        creditVerification: { isValid: false, errors: [], warnings: [] },
        technicalSpecification: { isValid: false, errors: [], warnings: [] },
        deliveryFeasibility: { isValid: false, errors: [], warnings: [] },
        capacityAvailability: { isValid: false, errors: [], warnings: [] },
        profitabilityAnalysis: { isValid: false, errors: [], warnings: [] },
      },
      overallValidation: { isValid: false, errors: [], warnings: [] },
      createdAt: new Date().toISOString(),
      createdBy,
    };

    this.productionRequests.push(request);

    await this.eventBusService.emit<any>(WorkflowEventType.PRODUCTION_REQUEST_CREATED, {
      requestId: request.id,
      requestNumber,
      sourceType: 'sales_order',
      userId: createdBy,
    });

    return request;
  }

  async validateProductionRequest(requestId: string): Promise<ProductionRequest> {
    const request = this.productionRequests.find(r => r.id === requestId);
    if (!request) {
      throw new BadRequestException(`Production request ${requestId} not found`);
    }

    // Perform all validations
    request.validations.creditVerification = await this.validateCustomerCredit(request.customerId);
    request.validations.technicalSpecification = await this.validateTechnicalSpecs(request.items);
    request.validations.deliveryFeasibility = await this.assessDeliveryFeasibility(request);
    request.validations.capacityAvailability = await this.checkCapacityAvailability(request);
    request.validations.profitabilityAnalysis = await this.analyzeProfitability(request);

    // Calculate overall validation
    const allValidations = Object.values(request.validations);
    const errors = allValidations.flatMap(v => v.errors);
    const warnings = allValidations.flatMap(v => v.warnings);
    const isValid = allValidations.every(v => v.isValid);

    request.overallValidation = { isValid, errors, warnings };
    request.status = isValid ? 'validated' : 'pending_validation';

    await this.eventBusService.emit<any>(isValid ? WorkflowEventType.PRODUCTION_REQUEST_VALIDATED : WorkflowEventType.PRODUCTION_REQUEST_VALIDATION_FAILED, {
      requestId,
      isValid,
      errorCount: errors.length,
      warningCount: warnings.length,
      userId: 'SYSTEM',
    });

    return request;
  }

  async validateCustomerCredit(customerId?: string): Promise<ValidationResult> {
    // In production, this would check actual customer credit status
    if (!customerId) {
      return { isValid: true, errors: [], warnings: ['No customer ID provided - credit check skipped'] };
    }

    // Mock credit check
    const creditLimit = 5000000;
    const currentUtilization = 3500000;
    const availableCredit = creditLimit - currentUtilization;

    const warnings: string[] = [];
    if (availableCredit < 500000) {
      warnings.push(`Customer credit utilization is high (${((currentUtilization / creditLimit) * 100).toFixed(1)}%)`);
    }

    return {
      isValid: availableCredit > 0,
      errors: availableCredit <= 0 ? ['Customer has exceeded credit limit'] : [],
      warnings,
    };
  }

  async validateTechnicalSpecs(items: ProductionItem[]): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const item of items) {
      // Check if BOM exists
      if (!item.bomId) {
        errors.push(`Item ${item.itemCode}: No BOM defined`);
      }

      // Check if routing exists
      if (!item.routingId) {
        warnings.push(`Item ${item.itemCode}: No routing defined - using default`);
      }

      // Check quantity
      if (item.quantity <= 0) {
        errors.push(`Item ${item.itemCode}: Invalid quantity ${item.quantity}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async assessDeliveryFeasibility(request: ProductionRequest): Promise<ValidationResult> {
    const requestedDate = new Date(request.requestedDeliveryDate);
    const today = new Date();

    // Calculate lead time (mock calculation)
    const totalLeadTimeDays = request.items.reduce((sum, item) => {
      // Assume 5-10 days per item based on complexity
      return sum + (item.bomId ? 7 : 14);
    }, 0);

    const estimatedCompletionDate = new Date(today);
    estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + totalLeadTimeDays);

    const bufferDays = Math.ceil((requestedDate.getTime() - estimatedCompletionDate.getTime()) / (1000 * 60 * 60 * 24));

    const errors: string[] = [];
    const warnings: string[] = [];

    if (bufferDays < 0) {
      errors.push(`Delivery not feasible: Estimated completion is ${Math.abs(bufferDays)} days after requested date`);
    } else if (bufferDays < 3) {
      warnings.push(`Tight delivery schedule: Only ${bufferDays} days buffer`);
    }

    return {
      isValid: bufferDays >= 0,
      errors,
      warnings,
    };
  }

  async checkCapacityAvailability(request: ProductionRequest): Promise<ValidationResult> {
    // Mock capacity calculation
    const requiredHours = request.items.reduce((sum, item) => sum + item.quantity * 2, 0);
    const availableHours = 160; // Weekly capacity
    const utilizationPercentage = (requiredHours / availableHours) * 100;

    const errors: string[] = [];
    const warnings: string[] = [];

    if (utilizationPercentage > 100) {
      errors.push(`Capacity exceeded: Requires ${requiredHours}hrs but only ${availableHours}hrs available`);
    } else if (utilizationPercentage > 80) {
      warnings.push(`High capacity utilization: ${utilizationPercentage.toFixed(1)}%`);
    }

    // Check for bottlenecks (mock)
    if (request.items.length > 5) {
      warnings.push('Multiple items may create bottlenecks at assembly work center');
    }

    return {
      isValid: utilizationPercentage <= 100,
      errors,
      warnings,
    };
  }

  async analyzeProfitability(request: ProductionRequest): Promise<ValidationResult> {
    // Mock profitability analysis
    const estimatedRevenue = request.items.reduce((sum, item) => sum + item.quantity * 1000, 0);
    const estimatedCost = request.items.reduce((sum, item) => sum + item.quantity * 700, 0);
    const margin = ((estimatedRevenue - estimatedCost) / estimatedRevenue) * 100;

    const errors: string[] = [];
    const warnings: string[] = [];

    if (margin < 10) {
      errors.push(`Profitability below threshold: ${margin.toFixed(1)}% margin (minimum 10%)`);
    } else if (margin < 15) {
      warnings.push(`Low margin: ${margin.toFixed(1)}% (target 15%+)`);
    }

    return {
      isValid: margin >= 10,
      errors,
      warnings,
    };
  }

  async approveRequest(requestId: string, approvedBy: string): Promise<ProductionRequest> {
    const request = this.productionRequests.find(r => r.id === requestId);
    if (!request) {
      throw new BadRequestException(`Production request ${requestId} not found`);
    }

    if (request.status !== 'validated') {
      throw new BadRequestException('Request must be validated before approval');
    }

    request.status = 'approved';

    await this.eventBusService.emit<any>(WorkflowEventType.PRODUCTION_REQUEST_APPROVED, {
      requestId,
      approvedBy,
      userId: approvedBy,
    });

    return request;
  }

  async createWorkOrders(requestId: string, createdBy: string): Promise<string[]> {
    const request = this.productionRequests.find(r => r.id === requestId);
    if (!request) {
      throw new BadRequestException(`Production request ${requestId} not found`);
    }

    if (request.status !== 'approved') {
      throw new BadRequestException('Request must be approved before creating work orders');
    }

    const workOrderIds: string[] = [];

    // Create work order for each item
    for (const item of request.items) {
      const workOrderId = uuidv4();
      workOrderIds.push(workOrderId);

      await this.eventBusService.emit<any>(WorkflowEventType.WORK_ORDER_CREATED, {
        workOrderId,
        productionRequestId: requestId,
        itemId: item.itemId,
        itemCode: item.itemCode,
        quantity: item.quantity,
        bomId: item.bomId,
        routingId: item.routingId,
        userId: createdBy,
      });
    }

    request.status = 'in_production';

    return workOrderIds;
  }

  async findAll(filters?: {
    status?: string;
    requestType?: string;
    customerId?: string;
  }): Promise<ProductionRequest[]> {
    let result = [...this.productionRequests];

    if (filters?.status) {
      result = result.filter(r => r.status === filters.status);
    }
    if (filters?.requestType) {
      result = result.filter(r => r.requestType === filters.requestType);
    }
    if (filters?.customerId) {
      result = result.filter(r => r.customerId === filters.customerId);
    }

    return result.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    validationPassRate: number;
  }> {
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let validatedCount = 0;
    let passedCount = 0;

    this.productionRequests.forEach(r => {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
      byType[r.requestType] = (byType[r.requestType] || 0) + 1;
      if (r.status !== 'pending_validation') {
        validatedCount++;
        if (r.overallValidation.isValid) {
          passedCount++;
        }
      }
    });

    return {
      total: this.productionRequests.length,
      byStatus,
      byType,
      validationPassRate: validatedCount > 0 ? (passedCount / validatedCount) * 100 : 0,
    };
  }

  private async generateRequestNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.productionRequests.length + 1).padStart(5, '0');
    return `PR-${year}${month}-${sequence}`;
  }
}
