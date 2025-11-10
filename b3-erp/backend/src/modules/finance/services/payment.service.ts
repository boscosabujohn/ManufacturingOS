import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentResponseDto,
} from '../dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const paymentNumber = await this.generatePaymentNumber(
      createDto.paymentType,
    );

    const payment = this.paymentRepository.create({
      ...createDto,
      paymentNumber,
      baseCurrencyAmount: createDto.amount * (createDto.exchangeRate || 1),
      status: PaymentStatus.DRAFT,
      isPosted: false,
      isReconciled: false,
      isBounced: false,
    });

    const savedPayment = await this.paymentRepository.save(payment);
    return this.mapToResponseDto(savedPayment);
  }

  async findAll(filters?: any): Promise<PaymentResponseDto[]> {
    const query = this.paymentRepository.createQueryBuilder('payment');

    if (filters?.status) {
      query.andWhere('payment.status = :status', { status: filters.status });
    }

    if (filters?.paymentType) {
      query.andWhere('payment.paymentType = :paymentType', {
        paymentType: filters.paymentType,
      });
    }

    if (filters?.partyId) {
      query.andWhere('payment.partyId = :partyId', {
        partyId: filters.partyId,
      });
    }

    query.orderBy('payment.paymentDate', 'DESC');
    const payments = await query.getMany();
    return payments.map((p) => this.mapToResponseDto(p));
  }

  async getUnreconciled(bankAccountId?: string): Promise<PaymentResponseDto[]> {
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.isReconciled = false')
      .andWhere('payment.isPosted = true');

    if (bankAccountId) {
      query.andWhere('payment.bankAccountId = :bankAccountId', {
        bankAccountId,
      });
    }

    const payments = await query.getMany();
    return payments.map((p) => this.mapToResponseDto(p));
  }

  async findOne(id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.mapToResponseDto(payment);
  }

  async update(
    id: string,
    updateDto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    if (payment.isPosted) {
      throw new BadRequestException('Cannot update posted payment');
    }

    Object.assign(payment, updateDto);
    const updatedPayment = await this.paymentRepository.save(payment);
    return this.mapToResponseDto(updatedPayment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    if (payment.isPosted) {
      throw new BadRequestException('Cannot delete posted payment');
    }

    await this.paymentRepository.remove(payment);
  }

  async approve(id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    payment.status = PaymentStatus.APPROVED;
    payment.approvedAt = new Date();
    await this.paymentRepository.save(payment);
    return this.mapToResponseDto(payment);
  }

  async postToGL(id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    if (payment.isPosted) {
      throw new BadRequestException('Payment already posted');
    }

    // Placeholder for GL posting logic
    payment.isPosted = true;
    payment.postedAt = new Date();
    payment.status = PaymentStatus.PROCESSED;
    await this.paymentRepository.save(payment);

    return this.mapToResponseDto(payment);
  }

  async reconcile(id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    payment.isReconciled = true;
    payment.reconciledDate = new Date();
    payment.status = PaymentStatus.RECONCILED;
    await this.paymentRepository.save(payment);

    return this.mapToResponseDto(payment);
  }

  async markBounced(id: string, reason: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    payment.isBounced = true;
    payment.bouncedDate = new Date();
    payment.bounceReason = reason;
    payment.status = PaymentStatus.BOUNCED;
    await this.paymentRepository.save(payment);

    return this.mapToResponseDto(payment);
  }

  async cancel(id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    payment.status = PaymentStatus.CANCELLED;
    await this.paymentRepository.save(payment);
    return this.mapToResponseDto(payment);
  }

  private async generatePaymentNumber(paymentType: string): Promise<string> {
    const prefix = paymentType === 'Receipt' ? 'RCT' : 'PAY';
    const year = new Date().getFullYear();
    const count = await this.paymentRepository.count();
    return `${prefix}-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private mapToResponseDto(payment: Payment): PaymentResponseDto {
    return { ...payment } as any;
  }
}
