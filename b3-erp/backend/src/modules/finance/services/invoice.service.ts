import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Invoice, InvoiceLine, InvoiceStatus } from '../entities/invoice.entity';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceResponseDto,
} from '../dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceLine)
    private readonly invoiceLineRepository: Repository<InvoiceLine>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      // Calculate totals
      const subtotal = createDto.lines.reduce(
        (sum, line) =>
          sum + line.quantity * line.unitPrice - (line.discountAmount || 0),
        0,
      );
      const taxAmount = createDto.lines.reduce(
        (sum, line) => sum + (line.taxAmount || 0),
        0,
      );
      const totalAmount =
        subtotal +
        taxAmount +
        (createDto.shippingCharges || 0) +
        (createDto.otherCharges || 0) -
        (createDto.discountAmount || 0);

      const invoiceNumber = await this.generateInvoiceNumber(
        createDto.invoiceType,
      );

      const invoice = manager.create(Invoice, {
        ...createDto,
        invoiceNumber,
        subtotal,
        taxAmount,
        totalAmount,
        balanceAmount: totalAmount,
        paidAmount: 0,
        status: InvoiceStatus.DRAFT,
      });

      const savedInvoice = await manager.save(Invoice, invoice);

      // Create invoice lines
      const lines = createDto.lines.map((lineDto) => {
        const amount = lineDto.quantity * lineDto.unitPrice;
        const totalAmount =
          amount -
          (lineDto.discountAmount || 0) +
          (lineDto.taxAmount || 0);

        return manager.create(InvoiceLine, {
          ...lineDto,
          invoiceId: savedInvoice.id,
          amount,
          totalAmount,
        });
      });

      await manager.save(InvoiceLine, lines);

      return this.findOne(savedInvoice.id);
    });
  }

  async findAll(filters?: any): Promise<InvoiceResponseDto[]> {
    const query = this.invoiceRepository.createQueryBuilder('invoice');

    if (filters?.status) {
      query.andWhere('invoice.status = :status', { status: filters.status });
    }

    if (filters?.invoiceType) {
      query.andWhere('invoice.invoiceType = :invoiceType', {
        invoiceType: filters.invoiceType,
      });
    }

    if (filters?.partyId) {
      query.andWhere('invoice.partyId = :partyId', {
        partyId: filters.partyId,
      });
    }

    query.orderBy('invoice.invoiceDate', 'DESC');
    const invoices = await query.getMany();
    return Promise.all(invoices.map((i) => this.findOne(i.id)));
  }

  async getOverdue(): Promise<InvoiceResponseDto[]> {
    const today = new Date();
    const invoices = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .where('invoice.dueDate < :today', { today })
      .andWhere('invoice.balanceAmount > 0')
      .andWhere('invoice.status IN (:...statuses)', {
        statuses: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID],
      })
      .getMany();

    return Promise.all(invoices.map((i) => this.findOne(i.id)));
  }

  async getAgingReport(invoiceType?: string): Promise<any> {
    // Placeholder for aging report logic
    return {
      reportDate: new Date(),
      invoiceType,
      ageingBuckets: [
        { range: '0-30 days', count: 0, amount: 0 },
        { range: '31-60 days', count: 0, amount: 0 },
        { range: '61-90 days', count: 0, amount: 0 },
        { range: '90+ days', count: 0, amount: 0 },
      ],
    };
  }

  async findOne(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return this.mapToResponseDto(invoice);
  }

  async update(
    id: string,
    updateDto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    if (invoice.isPosted) {
      throw new BadRequestException('Cannot update posted invoice');
    }

    // Implementation similar to create
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    if (invoice.isPosted) {
      throw new BadRequestException('Cannot delete posted invoice');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(InvoiceLine, { invoiceId: id });
      await manager.delete(Invoice, { id });
    });
  }

  async submit(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    invoice.status = InvoiceStatus.SUBMITTED;
    await this.invoiceRepository.save(invoice);
    return this.findOne(id);
  }

  async approve(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    invoice.status = InvoiceStatus.APPROVED;
    await this.invoiceRepository.save(invoice);
    return this.findOne(id);
  }

  async postToGL(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    if (invoice.isPosted) {
      throw new BadRequestException('Invoice already posted');
    }

    // Placeholder for GL posting logic
    invoice.isPosted = true;
    invoice.postedAt = new Date();
    await this.invoiceRepository.save(invoice);

    return this.findOne(id);
  }

  async cancel(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    invoice.status = InvoiceStatus.CANCELLED;
    await this.invoiceRepository.save(invoice);
    return this.findOne(id);
  }

  async getOutstandingBalance(partyId: string): Promise<any> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.balanceAmount)', 'outstanding')
      .where('invoice.partyId = :partyId', { partyId })
      .andWhere('invoice.balanceAmount > 0')
      .getRawOne();

    return {
      partyId,
      outstandingBalance: result?.outstanding || 0,
    };
  }

  private async generateInvoiceNumber(invoiceType: string): Promise<string> {
    const prefix = invoiceType === 'Sales Invoice' ? 'INV' : 'BILL';
    const year = new Date().getFullYear();
    const count = await this.invoiceRepository.count();
    return `${prefix}-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private mapToResponseDto(invoice: Invoice): InvoiceResponseDto {
    return {
      ...invoice,
      lines: invoice.lines?.map((line) => ({ ...line })) || [],
    } as any;
  }
}
