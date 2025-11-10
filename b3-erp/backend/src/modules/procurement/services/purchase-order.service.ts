import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder, POStatus } from '../entities/purchase-order.entity';
import { PurchaseOrderItem, POItemStatus } from '../entities/purchase-order-item.entity';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  PurchaseOrderResponseDto,
} from '../dto';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly poItemRepository: Repository<PurchaseOrderItem>,
  ) {}

  async create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrderResponseDto> {
    const poNumber = await this.generatePONumber();

    // Calculate financial details
    const subtotal = createDto.items.reduce((sum, item) => {
      const lineTotal = item.orderedQuantity * item.unitPrice;
      const discount = (lineTotal * (item.discountPercentage || 0)) / 100;
      return sum + (lineTotal - discount);
    }, 0);

    const taxAmount = createDto.items.reduce((sum, item) => {
      const lineTotal = item.orderedQuantity * item.unitPrice;
      const discount = (lineTotal * (item.discountPercentage || 0)) / 100;
      const netAmount = lineTotal - discount;
      return sum + (netAmount * (item.taxRate || 0)) / 100;
    }, 0);

    const totalAmount = subtotal + taxAmount;

    const po = this.poRepository.create({
      ...createDto,
      poNumber,
      subtotal,
      taxAmount,
      totalAmount,
      balanceAmount: totalAmount,
      status: POStatus.DRAFT,
    });

    const savedPO = await this.poRepository.save(po);

    // Create PO items
    const poItems = createDto.items.map((item, index) => {
      const lineTotal = item.orderedQuantity * item.unitPrice;
      const discountAmount = (lineTotal * (item.discountPercentage || 0)) / 100;
      const netUnitPrice = item.unitPrice - (discountAmount / item.orderedQuantity);
      const netLineTotal = lineTotal - discountAmount;
      const itemTaxAmount = (netLineTotal * (item.taxRate || 0)) / 100;

      return this.poItemRepository.create({
        purchaseOrderId: savedPO.id,
        lineNumber: item.lineNumber,
        itemId: item.itemId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        description: item.description,
        uom: item.uom,
        orderedQuantity: item.orderedQuantity,
        pendingQuantity: item.orderedQuantity,
        unitPrice: item.unitPrice,
        discountPercentage: item.discountPercentage || 0,
        discountAmount: discountAmount,
        netUnitPrice: netUnitPrice,
        lineTotal: netLineTotal,
        taxCode: item.taxCode,
        taxRate: item.taxRate || 0,
        taxAmount: itemTaxAmount,
        totalAmount: netLineTotal + itemTaxAmount,
        requiredDate: item.requiredDate ? new Date(item.requiredDate) : null,
        accountCode: item.accountCode,
        status: POItemStatus.PENDING,
      });
    });

    await this.poItemRepository.save(poItems);

    return this.mapToResponse(savedPO);
  }

  async findAll(filters?: any): Promise<PurchaseOrderResponseDto[]> {
    const query = this.poRepository.createQueryBuilder('po');

    if (filters?.status) {
      query.andWhere('po.status = :status', { status: filters.status });
    }

    if (filters?.vendorId) {
      query.andWhere('po.vendorId = :vendorId', { vendorId: filters.vendorId });
    }

    if (filters?.buyerId) {
      query.andWhere('po.buyerId = :buyerId', { buyerId: filters.buyerId });
    }

    query.orderBy('po.createdAt', 'DESC');
    const pos = await query.getMany();
    return pos.map(po => this.mapToResponse(po));
  }

  async findOne(id: string): Promise<PurchaseOrderResponseDto> {
    const po = await this.poRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    return this.mapToResponse(po);
  }

  async update(id: string, updateDto: UpdatePurchaseOrderDto): Promise<PurchaseOrderResponseDto> {
    const po = await this.poRepository.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    if (po.status !== POStatus.DRAFT) {
      throw new BadRequestException('Only draft POs can be updated');
    }

    Object.assign(po, updateDto);
    const updatedPO = await this.poRepository.save(po);
    return this.mapToResponse(updatedPO);
  }

  async remove(id: string): Promise<void> {
    const po = await this.poRepository.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    if (po.status !== POStatus.DRAFT) {
      throw new BadRequestException('Only draft POs can be deleted');
    }

    await this.poRepository.remove(po);
  }

  async submit(id: string): Promise<PurchaseOrderResponseDto> {
    const po = await this.poRepository.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    po.status = POStatus.SUBMITTED;
    const updatedPO = await this.poRepository.save(po);
    return this.mapToResponse(updatedPO);
  }

  async approve(id: string, approverData: any): Promise<PurchaseOrderResponseDto> {
    const po = await this.poRepository.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    po.status = POStatus.APPROVED;
    po.isApproved = true;
    po.approvedBy = approverData.approvedBy;
    po.approverName = approverData.approverName;
    po.approvedAt = new Date();
    po.approvalNotes = approverData.notes;

    const updatedPO = await this.poRepository.save(po);
    return this.mapToResponse(updatedPO);
  }

  async close(id: string): Promise<PurchaseOrderResponseDto> {
    const po = await this.poRepository.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    po.status = POStatus.CLOSED;
    const updatedPO = await this.poRepository.save(po);
    return this.mapToResponse(updatedPO);
  }

  async cancel(id: string, reason: string): Promise<PurchaseOrderResponseDto> {
    const po = await this.poRepository.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    po.status = POStatus.CANCELLED;
    const updatedPO = await this.poRepository.save(po);
    return this.mapToResponse(updatedPO);
  }

  async getOutstandingOrders(): Promise<any[]> {
    const pos = await this.poRepository.find({
      where: [
        { status: POStatus.APPROVED },
        { status: POStatus.IN_PROGRESS },
        { status: POStatus.PARTIALLY_RECEIVED },
      ],
    });

    return pos.map(po => ({
      id: po.id,
      poNumber: po.poNumber,
      poDate: po.poDate,
      vendorName: po.vendorName,
      totalAmount: po.totalAmount,
      receivedAmount: po.receivedAmount,
      balanceAmount: po.totalAmount - po.receivedAmount,
      status: po.status,
    }));
  }

  private async generatePONumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.poRepository.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `PO-${year}${month}-${sequence}`;
  }

  private mapToResponse(po: PurchaseOrder): PurchaseOrderResponseDto {
    return {
      id: po.id,
      poNumber: po.poNumber,
      poDate: po.poDate,
      deliveryDate: po.deliveryDate,
      status: po.status,
      poType: po.poType,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      deliveryAddress: po.deliveryAddress,
      deliveryTerms: po.deliveryTerms,
      currency: po.currency,
      paymentTerms: po.paymentTerms,
      subtotal: po.subtotal,
      taxAmount: po.taxAmount,
      totalAmount: po.totalAmount,
      buyerId: po.buyerId,
      buyerName: po.buyerName,
      isApproved: po.isApproved,
      approvedBy: po.approvedBy,
      approvedAt: po.approvedAt,
      receivedAmount: po.receivedAmount,
      receivedPercentage: po.receivedPercentage,
      notes: po.notes,
      createdBy: po.createdBy,
      createdAt: po.createdAt,
      updatedAt: po.updatedAt,
    };
  }
}
