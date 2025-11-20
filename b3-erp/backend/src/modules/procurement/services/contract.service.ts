import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EventBusService } from '../../workflow/services/event-bus.service';

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
  RENEWED = 'renewed',
}

export enum ContractType {
  FRAMEWORK = 'framework',
  RATE = 'rate',
  QUANTITY = 'quantity',
  VALUE = 'value',
  SERVICE = 'service',
  MAINTENANCE = 'maintenance',
}

export interface ContractItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  unitPrice: number;
  currency: string;
  minimumQuantity?: number;
  maximumQuantity?: number;
  unitOfMeasure: string;
  leadTimeDays: number;
  qualitySpecs?: string;
}

export interface ContractSLA {
  id: string;
  metric: string;
  target: string;
  measurement: string;
  penalty?: string;
  bonus?: string;
}

export interface PriceRevision {
  id: string;
  revisionDate: string;
  previousPrice: number;
  newPrice: number;
  percentageChange: number;
  reason: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  description?: string;
  contractType: ContractType;
  status: ContractStatus;

  // Vendor Information
  vendorId: string;
  vendorName: string;
  vendorCode?: string;
  vendorContact?: string;
  vendorEmail?: string;
  vendorPhone?: string;

  // Contract Period
  startDate: string;
  endDate: string;
  effectiveDate?: string;
  terminationDate?: string;

  // Financial Terms
  totalValue?: number;
  currency: string;
  paymentTerms: string;
  minimumOrderValue?: number;
  maximumOrderValue?: number;

  // Contract Items
  items: ContractItem[];

  // SLA Terms
  slaTerms: ContractSLA[];

  // Price Revision
  priceRevisionPolicy?: string;
  priceRevisionFrequency?: string; // Annual, Semi-annual, Quarterly
  priceRevisionHistory: PriceRevision[];

  // Delivery Terms
  deliveryTerms: string;
  defaultLeadTime: number;
  deliveryLocations?: string[];

  // Renewal
  autoRenewal: boolean;
  renewalNoticeDays: number;
  renewalTerms?: string;

  // Termination
  terminationNoticeDays: number;
  terminationClauses?: string;
  earlyTerminationPenalty?: number;

  // Compliance
  complianceRequirements?: string[];
  certifications?: string[];
  insuranceRequirements?: string;

  // Utilization
  totalOrdered: number;
  totalDelivered: number;
  utilizationPercentage: number;

  // Approval
  approvedBy?: string;
  approvedAt?: string;
  approvalNotes?: string;

  // Documents
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }>;

  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  // Notes
  internalNotes?: string;
  tags?: string[];
}

@Injectable()
export class ContractService {
  private contracts: Contract[] = [];

  constructor(private readonly eventBusService: EventBusService) {
    this.seedMockData();
  }

  async create(createDto: Partial<Contract>): Promise<Contract> {
    const contractNumber = await this.generateContractNumber();

    const contract: Contract = {
      id: uuidv4(),
      contractNumber,
      title: createDto.title || '',
      contractType: createDto.contractType || ContractType.FRAMEWORK,
      status: ContractStatus.DRAFT,
      vendorId: createDto.vendorId || '',
      vendorName: createDto.vendorName || '',
      startDate: createDto.startDate || new Date().toISOString(),
      endDate: createDto.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      currency: createDto.currency || 'INR',
      paymentTerms: createDto.paymentTerms || 'Net 30',
      items: createDto.items || [],
      slaTerms: createDto.slaTerms || [],
      priceRevisionHistory: [],
      deliveryTerms: createDto.deliveryTerms || 'DAP',
      defaultLeadTime: createDto.defaultLeadTime || 7,
      autoRenewal: createDto.autoRenewal ?? false,
      renewalNoticeDays: createDto.renewalNoticeDays || 30,
      terminationNoticeDays: createDto.terminationNoticeDays || 30,
      totalOrdered: 0,
      totalDelivered: 0,
      utilizationPercentage: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: createDto.createdBy || 'system',
      updatedBy: createDto.updatedBy || 'system',
      ...createDto,
    };

    this.contracts.push(contract);

    await this.eventBusService.emit({
      type: 'contract-created',
      payload: { contractId: contract.id, contractNumber },
      source: 'procurement',
      timestamp: new Date(),
    });

    return contract;
  }

  async findAll(filters?: {
    status?: ContractStatus;
    vendorId?: string;
    contractType?: ContractType;
    expiringWithinDays?: number;
  }): Promise<Contract[]> {
    let result = [...this.contracts];

    if (filters?.status) {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters?.vendorId) {
      result = result.filter(c => c.vendorId === filters.vendorId);
    }
    if (filters?.contractType) {
      result = result.filter(c => c.contractType === filters.contractType);
    }
    if (filters?.expiringWithinDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + filters.expiringWithinDays);
      result = result.filter(c =>
        c.status === ContractStatus.ACTIVE &&
        new Date(c.endDate) <= cutoffDate
      );
    }

    return result.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findOne(id: string): Promise<Contract> {
    const contract = this.contracts.find(c => c.id === id);
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async update(id: string, updateDto: Partial<Contract>): Promise<Contract> {
    const index = this.contracts.findIndex(c => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    this.contracts[index] = {
      ...this.contracts[index],
      ...updateDto,
      updatedAt: new Date().toISOString(),
    };

    return this.contracts[index];
  }

  async submitForApproval(id: string, submittedBy: string): Promise<Contract> {
    const contract = await this.findOne(id);

    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException('Only draft contracts can be submitted for approval');
    }

    const updatedContract = await this.update(id, {
      status: ContractStatus.PENDING_APPROVAL,
      updatedBy: submittedBy,
    });

    await this.eventBusService.emit({
      type: 'contract-submitted-for-approval',
      payload: { contractId: id, contractNumber: contract.contractNumber },
      source: 'procurement',
      timestamp: new Date(),
    });

    return updatedContract;
  }

  async approve(id: string, approvedBy: string, notes?: string): Promise<Contract> {
    const contract = await this.findOne(id);

    if (contract.status !== ContractStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Contract is not pending approval');
    }

    const updatedContract = await this.update(id, {
      status: ContractStatus.ACTIVE,
      approvedBy,
      approvedAt: new Date().toISOString(),
      approvalNotes: notes,
      effectiveDate: contract.startDate,
      updatedBy: approvedBy,
    });

    await this.eventBusService.emit({
      type: 'contract-approved',
      payload: { contractId: id, approvedBy },
      source: 'procurement',
      timestamp: new Date(),
    });

    return updatedContract;
  }

  async terminate(id: string, terminatedBy: string, reason: string): Promise<Contract> {
    const contract = await this.findOne(id);

    if (contract.status !== ContractStatus.ACTIVE) {
      throw new BadRequestException('Only active contracts can be terminated');
    }

    const updatedContract = await this.update(id, {
      status: ContractStatus.TERMINATED,
      terminationDate: new Date().toISOString(),
      internalNotes: `${contract.internalNotes || ''}\nTerminated by ${terminatedBy}: ${reason}`,
      updatedBy: terminatedBy,
    });

    await this.eventBusService.emit({
      type: 'contract-terminated',
      payload: { contractId: id, reason },
      source: 'procurement',
      timestamp: new Date(),
    });

    return updatedContract;
  }

  async renew(id: string, renewedBy: string, newEndDate: string): Promise<Contract> {
    const contract = await this.findOne(id);

    if (contract.status !== ContractStatus.ACTIVE && contract.status !== ContractStatus.EXPIRED) {
      throw new BadRequestException('Contract cannot be renewed in current status');
    }

    const updatedContract = await this.update(id, {
      status: ContractStatus.RENEWED,
      endDate: newEndDate,
      internalNotes: `${contract.internalNotes || ''}\nRenewed by ${renewedBy} until ${newEndDate}`,
      updatedBy: renewedBy,
    });

    // Reset to active after renewal
    await this.update(id, { status: ContractStatus.ACTIVE });

    await this.eventBusService.emit({
      type: 'contract-renewed',
      payload: { contractId: id, newEndDate },
      source: 'procurement',
      timestamp: new Date(),
    });

    return updatedContract;
  }

  async checkContractAvailability(
    itemId: string,
    vendorId?: string
  ): Promise<Contract | null> {
    const now = new Date().toISOString();

    const activeContracts = this.contracts.filter(c =>
      c.status === ContractStatus.ACTIVE &&
      c.startDate <= now &&
      c.endDate >= now &&
      c.items.some(i => i.itemId === itemId) &&
      (!vendorId || c.vendorId === vendorId)
    );

    // Return the contract with best price if multiple found
    if (activeContracts.length === 0) return null;

    return activeContracts.reduce((best, current) => {
      const currentItem = current.items.find(i => i.itemId === itemId);
      const bestItem = best.items.find(i => i.itemId === itemId);
      return (currentItem?.unitPrice || Infinity) < (bestItem?.unitPrice || Infinity)
        ? current
        : best;
    });
  }

  async getContractPrice(contractId: string, itemId: string): Promise<ContractItem | null> {
    const contract = await this.findOne(contractId);
    return contract.items.find(i => i.itemId === itemId) || null;
  }

  async addPriceRevision(
    contractId: string,
    itemId: string,
    newPrice: number,
    reason: string,
    revisedBy: string
  ): Promise<Contract> {
    const contract = await this.findOne(contractId);
    const itemIndex = contract.items.findIndex(i => i.itemId === itemId);

    if (itemIndex === -1) {
      throw new NotFoundException(`Item ${itemId} not found in contract`);
    }

    const previousPrice = contract.items[itemIndex].unitPrice;
    const percentageChange = ((newPrice - previousPrice) / previousPrice) * 100;

    const revision: PriceRevision = {
      id: uuidv4(),
      revisionDate: new Date().toISOString(),
      previousPrice,
      newPrice,
      percentageChange,
      reason,
    };

    contract.items[itemIndex].unitPrice = newPrice;
    contract.priceRevisionHistory.push(revision);

    await this.eventBusService.emit({
      type: 'contract-price-revised',
      payload: {
        contractId,
        itemId,
        previousPrice,
        newPrice,
        percentageChange,
      },
      source: 'procurement',
      timestamp: new Date(),
    });

    return this.update(contractId, {
      items: contract.items,
      priceRevisionHistory: contract.priceRevisionHistory,
      updatedBy: revisedBy,
    });
  }

  async updateUtilization(
    contractId: string,
    orderedAmount: number,
    deliveredAmount: number
  ): Promise<Contract> {
    const contract = await this.findOne(contractId);

    const newTotalOrdered = contract.totalOrdered + orderedAmount;
    const newTotalDelivered = contract.totalDelivered + deliveredAmount;
    const utilizationPercentage = contract.totalValue
      ? (newTotalOrdered / contract.totalValue) * 100
      : 0;

    return this.update(contractId, {
      totalOrdered: newTotalOrdered,
      totalDelivered: newTotalDelivered,
      utilizationPercentage,
    });
  }

  async checkExpiringContracts(days: number = 30): Promise<Contract[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    const expiring = this.contracts.filter(c =>
      c.status === ContractStatus.ACTIVE &&
      new Date(c.endDate) <= cutoffDate
    );

    // Emit alerts for expiring contracts
    for (const contract of expiring) {
      const daysUntilExpiry = Math.ceil(
        (new Date(contract.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      await this.eventBusService.emit({
        type: 'contract-expiring-soon',
        payload: {
          contractId: contract.id,
          contractNumber: contract.contractNumber,
          vendorName: contract.vendorName,
          daysUntilExpiry,
        },
        source: 'procurement',
        timestamp: new Date(),
      });
    }

    return expiring;
  }

  async getContractStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    totalValue: number;
    averageUtilization: number;
    expiringSoon: number;
  }> {
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let totalValue = 0;
    let totalUtilization = 0;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + 30);

    this.contracts.forEach(c => {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      byType[c.contractType] = (byType[c.contractType] || 0) + 1;
      totalValue += c.totalValue || 0;
      totalUtilization += c.utilizationPercentage;
    });

    const expiringSoon = this.contracts.filter(c =>
      c.status === ContractStatus.ACTIVE &&
      new Date(c.endDate) <= cutoffDate
    ).length;

    return {
      total: this.contracts.length,
      byStatus,
      byType,
      totalValue,
      averageUtilization: this.contracts.length > 0
        ? totalUtilization / this.contracts.length
        : 0,
      expiringSoon,
    };
  }

  private async generateContractNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.contracts.length + 1).padStart(5, '0');
    return `CTR-${year}${month}-${sequence}`;
  }

  private seedMockData(): void {
    const now = new Date();
    const oneYear = new Date(now);
    oneYear.setFullYear(oneYear.getFullYear() + 1);

    this.contracts.push({
      id: uuidv4(),
      contractNumber: 'CTR-202401-00001',
      title: 'Annual Steel Supply Agreement',
      description: 'Framework agreement for steel supply',
      contractType: ContractType.FRAMEWORK,
      status: ContractStatus.ACTIVE,
      vendorId: 'vendor-001',
      vendorName: 'Steel Corp India',
      startDate: now.toISOString(),
      endDate: oneYear.toISOString(),
      effectiveDate: now.toISOString(),
      totalValue: 5000000,
      currency: 'INR',
      paymentTerms: 'Net 45',
      items: [
        {
          id: uuidv4(),
          itemId: 'item-steel-001',
          itemCode: 'STL-001',
          itemName: 'Mild Steel Sheet 2mm',
          unitPrice: 75,
          currency: 'INR',
          unitOfMeasure: 'Kg',
          leadTimeDays: 5,
        },
        {
          id: uuidv4(),
          itemId: 'item-steel-002',
          itemCode: 'STL-002',
          itemName: 'Stainless Steel Bar',
          unitPrice: 250,
          currency: 'INR',
          unitOfMeasure: 'Kg',
          leadTimeDays: 7,
        },
      ],
      slaTerms: [
        {
          id: uuidv4(),
          metric: 'On-time Delivery',
          target: '95%',
          measurement: 'Monthly',
          penalty: '1% of order value for each 5% below target',
        },
        {
          id: uuidv4(),
          metric: 'Quality Acceptance',
          target: '99%',
          measurement: 'Per delivery',
          penalty: 'Replacement at vendor cost',
        },
      ],
      priceRevisionHistory: [],
      deliveryTerms: 'DAP Factory',
      defaultLeadTime: 7,
      autoRenewal: true,
      renewalNoticeDays: 60,
      terminationNoticeDays: 30,
      totalOrdered: 1500000,
      totalDelivered: 1450000,
      utilizationPercentage: 30,
      approvedBy: 'procurement-manager',
      approvedAt: now.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
    });
  }
}
