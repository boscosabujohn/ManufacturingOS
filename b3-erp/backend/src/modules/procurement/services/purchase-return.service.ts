import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseReturn, PurchaseReturnStatus } from '../entities/purchase-return.entity';
import { CreatePurchaseReturnDto, UpdatePurchaseReturnDto, PurchaseReturnResponseDto } from '../dto';

@Injectable()
export class PurchaseReturnService {
  constructor(
    @InjectRepository(PurchaseReturn)
    private readonly returnRepository: Repository<PurchaseReturn>,
  ) {}

  async create(createDto: CreatePurchaseReturnDto): Promise<PurchaseReturnResponseDto> {
    const returnNumber = await this.generateReturnNumber();

    const subtotal = createDto.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxAmount = createDto.items.reduce((sum, item) => sum + item.taxAmount, 0);

    const purchaseReturn = this.returnRepository.create({
      ...createDto,
      returnNumber,
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      status: PurchaseReturnStatus.DRAFT,
    });

    const saved = await this.returnRepository.save(purchaseReturn);
    return this.mapToResponse(saved);
  }

  async findAll(filters?: any): Promise<PurchaseReturnResponseDto[]> {
    const returns = await this.returnRepository.find({
      order: { createdAt: 'DESC' },
    });
    return returns.map(r => this.mapToResponse(r));
  }

  async findOne(id: string): Promise<PurchaseReturnResponseDto> {
    const purchaseReturn = await this.returnRepository.findOne({ where: { id } });
    if (!purchaseReturn) {
      throw new NotFoundException(`Purchase Return with ID ${id} not found`);
    }
    return this.mapToResponse(purchaseReturn);
  }

  async update(id: string, updateDto: UpdatePurchaseReturnDto): Promise<PurchaseReturnResponseDto> {
    const purchaseReturn = await this.returnRepository.findOne({ where: { id } });
    if (!purchaseReturn) {
      throw new NotFoundException(`Purchase Return with ID ${id} not found`);
    }

    Object.assign(purchaseReturn, updateDto);
    const updated = await this.returnRepository.save(purchaseReturn);
    return this.mapToResponse(updated);
  }

  async remove(id: string): Promise<void> {
    await this.returnRepository.delete(id);
  }

  async approve(id: string, approverData: any): Promise<PurchaseReturnResponseDto> {
    const purchaseReturn = await this.returnRepository.findOne({ where: { id } });
    if (!purchaseReturn) {
      throw new NotFoundException(`Purchase Return with ID ${id} not found`);
    }

    purchaseReturn.status = PurchaseReturnStatus.APPROVED;
    purchaseReturn.isApproved = true;
    purchaseReturn.approvedBy = approverData.approvedBy;
    purchaseReturn.approverName = approverData.approverName;
    purchaseReturn.approvedAt = new Date();

    const updated = await this.returnRepository.save(purchaseReturn);
    return this.mapToResponse(updated);
  }

  private async generateReturnNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.returnRepository.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `PRN-${year}${month}-${sequence}`;
  }

  private mapToResponse(purchaseReturn: PurchaseReturn): PurchaseReturnResponseDto {
    return {
      id: purchaseReturn.id,
      returnNumber: purchaseReturn.returnNumber,
      returnDate: purchaseReturn.returnDate,
      status: purchaseReturn.status,
      vendorName: purchaseReturn.vendorName,
      returnReason: purchaseReturn.returnReason,
      totalAmount: purchaseReturn.totalAmount,
      isApproved: purchaseReturn.isApproved,
      isCreditNoteReceived: purchaseReturn.isCreditNoteReceived,
      createdAt: purchaseReturn.createdAt,
    };
  }
}
