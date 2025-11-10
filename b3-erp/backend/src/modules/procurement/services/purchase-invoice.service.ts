import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseInvoice, PurchaseInvoiceStatus, MatchingStatus } from '../entities/purchase-invoice.entity';
import { CreatePurchaseInvoiceDto, UpdatePurchaseInvoiceDto, PurchaseInvoiceResponseDto } from '../dto';

@Injectable()
export class PurchaseInvoiceService {
  constructor(
    @InjectRepository(PurchaseInvoice)
    private readonly invoiceRepository: Repository<PurchaseInvoice>,
  ) {}

  async create(createDto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoiceResponseDto> {
    const internalInvoiceNumber = await this.generateInvoiceNumber();

    const subtotal = createDto.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalTaxAmount = createDto.items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = subtotal + totalTaxAmount;

    const invoice = this.invoiceRepository.create({
      ...createDto,
      internalInvoiceNumber,
      subtotal,
      totalTaxAmount,
      totalAmount,
      balanceAmount: totalAmount,
      status: PurchaseInvoiceStatus.DRAFT,
      matchingStatus: MatchingStatus.NOT_MATCHED,
    });

    const saved = await this.invoiceRepository.save(invoice);
    return this.mapToResponse(saved);
  }

  async findAll(filters?: any): Promise<PurchaseInvoiceResponseDto[]> {
    const query = this.invoiceRepository.createQueryBuilder('invoice');

    if (filters?.status) {
      query.andWhere('invoice.status = :status', { status: filters.status });
    }

    if (filters?.vendorId) {
      query.andWhere('invoice.vendorId = :vendorId', { vendorId: filters.vendorId });
    }

    query.orderBy('invoice.createdAt', 'DESC');
    const invoices = await query.getMany();
    return invoices.map(inv => this.mapToResponse(inv));
  }

  async findOne(id: string): Promise<PurchaseInvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Purchase Invoice with ID ${id} not found`);
    }
    return this.mapToResponse(invoice);
  }

  async update(id: string, updateDto: UpdatePurchaseInvoiceDto): Promise<PurchaseInvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Purchase Invoice with ID ${id} not found`);
    }

    Object.assign(invoice, updateDto);
    const updated = await this.invoiceRepository.save(invoice);
    return this.mapToResponse(updated);
  }

  async remove(id: string): Promise<void> {
    await this.invoiceRepository.delete(id);
  }

  async performThreeWayMatching(id: string): Promise<any> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Purchase Invoice with ID ${id} not found`);
    }

    // Placeholder for 3-way matching logic
    // In production, this would compare PO, GRN, and Invoice
    const matchingResult = {
      isMatched: true,
      matchingStatus: MatchingStatus.THREE_WAY_MATCHED,
      variances: [],
      exceptions: [],
    };

    invoice.isMatched = matchingResult.isMatched;
    invoice.matchingStatus = matchingResult.matchingStatus;
    invoice.matchedAt = new Date();
    invoice.status = PurchaseInvoiceStatus.MATCHED;

    const updated = await this.invoiceRepository.save(invoice);
    return {
      invoice: this.mapToResponse(updated),
      matchingDetails: matchingResult,
    };
  }

  async approve(id: string, approverData: any): Promise<PurchaseInvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Purchase Invoice with ID ${id} not found`);
    }

    invoice.status = PurchaseInvoiceStatus.APPROVED;
    invoice.isApproved = true;
    invoice.approvedBy = approverData.approvedBy;
    invoice.approverName = approverData.approverName;
    invoice.approvedAt = new Date();
    invoice.approvalNotes = approverData.notes;

    const updated = await this.invoiceRepository.save(invoice);
    return this.mapToResponse(updated);
  }

  async postToAccounting(id: string): Promise<PurchaseInvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Purchase Invoice with ID ${id} not found`);
    }

    if (!invoice.isApproved) {
      throw new BadRequestException('Invoice must be approved before posting to accounting');
    }

    invoice.isPostedToAccounting = true;
    invoice.accountingPostedAt = new Date();
    invoice.status = PurchaseInvoiceStatus.POSTED;

    const updated = await this.invoiceRepository.save(invoice);
    return this.mapToResponse(updated);
  }

  async getPendingInvoices(): Promise<any[]> {
    const invoices = await this.invoiceRepository.find({
      where: [
        { status: PurchaseInvoiceStatus.SUBMITTED },
        { status: PurchaseInvoiceStatus.UNDER_VERIFICATION },
        { status: PurchaseInvoiceStatus.MATCHED },
      ],
    });

    return invoices.map(inv => ({
      id: inv.id,
      internalInvoiceNumber: inv.internalInvoiceNumber,
      vendorInvoiceNumber: inv.vendorInvoiceNumber,
      invoiceDate: inv.invoiceDate,
      dueDate: inv.dueDate,
      vendorName: inv.vendorName,
      totalAmount: inv.totalAmount,
      balanceAmount: inv.balanceAmount,
      status: inv.status,
      matchingStatus: inv.matchingStatus,
    }));
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.invoiceRepository.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `PINV-${year}${month}-${sequence}`;
  }

  private mapToResponse(invoice: PurchaseInvoice): PurchaseInvoiceResponseDto {
    return {
      id: invoice.id,
      internalInvoiceNumber: invoice.internalInvoiceNumber,
      vendorInvoiceNumber: invoice.vendorInvoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      vendorName: invoice.vendorName,
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount,
      balanceAmount: invoice.balanceAmount,
      matchingStatus: invoice.matchingStatus,
      isApproved: invoice.isApproved,
      isPostedToAccounting: invoice.isPostedToAccounting,
      createdAt: invoice.createdAt,
    };
  }
}
