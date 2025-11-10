import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RFQ, RFQStatus } from '../entities/rfq.entity';
import { CreateRFQDto, UpdateRFQDto, RFQResponseDto } from '../dto';

@Injectable()
export class RFQService {
  constructor(
    @InjectRepository(RFQ)
    private readonly rfqRepository: Repository<RFQ>,
  ) {}

  async create(createDto: CreateRFQDto): Promise<RFQResponseDto> {
    const rfqNumber = await this.generateRFQNumber();

    const rfq = this.rfqRepository.create({
      ...createDto,
      rfqNumber,
      status: RFQStatus.DRAFT,
      quotationsReceived: 0,
      quotationsPending: createDto.vendors.length,
    });

    const savedRFQ = await this.rfqRepository.save(rfq);
    return this.mapToResponse(savedRFQ);
  }

  async findAll(filters?: any): Promise<RFQResponseDto[]> {
    const rfqs = await this.rfqRepository.find({
      order: { createdAt: 'DESC' },
    });
    return rfqs.map(rfq => this.mapToResponse(rfq));
  }

  async findOne(id: string): Promise<RFQResponseDto> {
    const rfq = await this.rfqRepository.findOne({ where: { id } });
    if (!rfq) {
      throw new NotFoundException(`RFQ with ID ${id} not found`);
    }
    return this.mapToResponse(rfq);
  }

  async update(id: string, updateDto: UpdateRFQDto): Promise<RFQResponseDto> {
    const rfq = await this.rfqRepository.findOne({ where: { id } });
    if (!rfq) {
      throw new NotFoundException(`RFQ with ID ${id} not found`);
    }

    Object.assign(rfq, updateDto);
    const updatedRFQ = await this.rfqRepository.save(rfq);
    return this.mapToResponse(updatedRFQ);
  }

  async remove(id: string): Promise<void> {
    const result = await this.rfqRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RFQ with ID ${id} not found`);
    }
  }

  async sendToVendors(id: string): Promise<RFQResponseDto> {
    const rfq = await this.rfqRepository.findOne({ where: { id } });
    if (!rfq) {
      throw new NotFoundException(`RFQ with ID ${id} not found`);
    }

    rfq.status = RFQStatus.SENT;
    const updatedRFQ = await this.rfqRepository.save(rfq);
    return this.mapToResponse(updatedRFQ);
  }

  async compareQuotations(id: string): Promise<any> {
    const rfq = await this.rfqRepository.findOne({ where: { id } });
    if (!rfq) {
      throw new NotFoundException(`RFQ with ID ${id} not found`);
    }

    return {
      rfqNumber: rfq.rfqNumber,
      comparativeAnalysis: rfq.comparativeAnalysis || [],
      vendors: rfq.vendors,
      lowestQuotation: rfq.lowestQuotationAmount,
      highestQuotation: rfq.highestQuotationAmount,
    };
  }

  async awardRFQ(id: string, awardData: any): Promise<RFQResponseDto> {
    const rfq = await this.rfqRepository.findOne({ where: { id } });
    if (!rfq) {
      throw new NotFoundException(`RFQ with ID ${id} not found`);
    }

    rfq.status = RFQStatus.AWARDED;
    rfq.awardedVendorId = awardData.vendorId;
    rfq.awardedVendorName = awardData.vendorName;
    rfq.awardedAmount = awardData.amount;
    rfq.awardedDate = new Date();
    rfq.awardJustification = awardData.justification;

    const updatedRFQ = await this.rfqRepository.save(rfq);
    return this.mapToResponse(updatedRFQ);
  }

  private async generateRFQNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.rfqRepository.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `RFQ-${year}${month}-${sequence}`;
  }

  private mapToResponse(rfq: RFQ): RFQResponseDto {
    return {
      id: rfq.id,
      rfqNumber: rfq.rfqNumber,
      rfqDate: rfq.rfqDate,
      submissionDeadline: rfq.submissionDeadline,
      status: rfq.status,
      title: rfq.title,
      buyerName: rfq.buyerName,
      quotationsReceived: rfq.quotationsReceived,
      quotationsPending: rfq.quotationsPending,
      createdAt: rfq.createdAt,
      updatedAt: rfq.updatedAt,
    };
  }
}
