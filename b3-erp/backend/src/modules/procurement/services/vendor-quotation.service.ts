import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorQuotation, QuotationStatus } from '../entities/vendor-quotation.entity';
import { CreateVendorQuotationDto, UpdateVendorQuotationDto, VendorQuotationResponseDto } from '../dto';

@Injectable()
export class VendorQuotationService {
  constructor(
    @InjectRepository(VendorQuotation)
    private readonly quotationRepository: Repository<VendorQuotation>,
  ) {}

  async create(createDto: CreateVendorQuotationDto): Promise<VendorQuotationResponseDto> {
    const quotationNumber = await this.generateQuotationNumber();

    const subtotal = createDto.items.reduce((sum, item) => sum + item.totalAmount, 0);

    const quotation = this.quotationRepository.create({
      ...createDto,
      quotationNumber,
      subtotal,
      totalAmount: subtotal,
      status: QuotationStatus.DRAFT,
    });

    const saved = await this.quotationRepository.save(quotation);
    return this.mapToResponse(saved);
  }

  async findAll(filters?: any): Promise<VendorQuotationResponseDto[]> {
    const query = this.quotationRepository.createQueryBuilder('q');

    if (filters?.rfqId) {
      query.andWhere('q.rfqId = :rfqId', { rfqId: filters.rfqId });
    }

    if (filters?.vendorId) {
      query.andWhere('q.vendorId = :vendorId', { vendorId: filters.vendorId });
    }

    query.orderBy('q.createdAt', 'DESC');
    const quotations = await query.getMany();
    return quotations.map(q => this.mapToResponse(q));
  }

  async findOne(id: string): Promise<VendorQuotationResponseDto> {
    const quotation = await this.quotationRepository.findOne({ where: { id } });
    if (!quotation) {
      throw new NotFoundException(`Vendor Quotation with ID ${id} not found`);
    }
    return this.mapToResponse(quotation);
  }

  async update(id: string, updateDto: UpdateVendorQuotationDto): Promise<VendorQuotationResponseDto> {
    const quotation = await this.quotationRepository.findOne({ where: { id } });
    if (!quotation) {
      throw new NotFoundException(`Vendor Quotation with ID ${id} not found`);
    }

    Object.assign(quotation, updateDto);
    const updated = await this.quotationRepository.save(quotation);
    return this.mapToResponse(updated);
  }

  async remove(id: string): Promise<void> {
    await this.quotationRepository.delete(id);
  }

  async submit(id: string): Promise<VendorQuotationResponseDto> {
    const quotation = await this.quotationRepository.findOne({ where: { id } });
    if (!quotation) {
      throw new NotFoundException(`Vendor Quotation with ID ${id} not found`);
    }

    quotation.status = QuotationStatus.SUBMITTED;
    const updated = await this.quotationRepository.save(quotation);
    return this.mapToResponse(updated);
  }

  async evaluate(id: string, evaluationData: any): Promise<VendorQuotationResponseDto> {
    const quotation = await this.quotationRepository.findOne({ where: { id } });
    if (!quotation) {
      throw new NotFoundException(`Vendor Quotation with ID ${id} not found`);
    }

    quotation.isEvaluated = true;
    quotation.evaluationScore = evaluationData.score;
    quotation.rank = evaluationData.rank;
    quotation.evaluationCriteria = evaluationData.criteria;
    quotation.evaluationRemarks = evaluationData.remarks;
    quotation.evaluatedBy = evaluationData.evaluatedBy;
    quotation.evaluatedAt = new Date();

    const updated = await this.quotationRepository.save(quotation);
    return this.mapToResponse(updated);
  }

  async award(id: string, poData: any): Promise<VendorQuotationResponseDto> {
    const quotation = await this.quotationRepository.findOne({ where: { id } });
    if (!quotation) {
      throw new NotFoundException(`Vendor Quotation with ID ${id} not found`);
    }

    quotation.isAwarded = true;
    quotation.awardedDate = new Date();
    quotation.purchaseOrderId = poData.poId;
    quotation.purchaseOrderNumber = poData.poNumber;
    quotation.status = QuotationStatus.AWARDED;

    const updated = await this.quotationRepository.save(quotation);
    return this.mapToResponse(updated);
  }

  private async generateQuotationNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.quotationRepository.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `QUOT-${year}${month}-${sequence}`;
  }

  private mapToResponse(quotation: VendorQuotation): VendorQuotationResponseDto {
    return {
      id: quotation.id,
      quotationNumber: quotation.quotationNumber,
      quotationDate: quotation.quotationDate,
      validUntil: quotation.validUntil,
      status: quotation.status,
      rfqNumber: quotation.rfqNumber,
      vendorName: quotation.vendorName,
      totalAmount: quotation.totalAmount,
      isEvaluated: quotation.isEvaluated,
      isAwarded: quotation.isAwarded,
      createdAt: quotation.createdAt,
    };
  }
}
