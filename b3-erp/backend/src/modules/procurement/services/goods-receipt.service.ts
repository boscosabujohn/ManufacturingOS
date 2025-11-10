import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodsReceipt, GRNStatus } from '../entities/goods-receipt.entity';
import { GoodsReceiptItem, GRNItemStatus } from '../entities/goods-receipt-item.entity';
import { CreateGoodsReceiptDto, UpdateGoodsReceiptDto, GoodsReceiptResponseDto } from '../dto';

@Injectable()
export class GoodsReceiptService {
  constructor(
    @InjectRepository(GoodsReceipt)
    private readonly grnRepository: Repository<GoodsReceipt>,
    @InjectRepository(GoodsReceiptItem)
    private readonly grnItemRepository: Repository<GoodsReceiptItem>,
  ) {}

  async create(createDto: CreateGoodsReceiptDto): Promise<GoodsReceiptResponseDto> {
    const grnNumber = await this.generateGRNNumber();

    const grn = this.grnRepository.create({
      ...createDto,
      grnNumber,
      receiptDateTime: new Date(),
      status: GRNStatus.DRAFT,
    });

    const savedGRN = await this.grnRepository.save(grn);

    // Create GRN items
    const grnItems = createDto.items.map((item: any) =>
      this.grnItemRepository.create({
        goodsReceiptId: savedGRN.id,
        ...item,
        status: GRNItemStatus.PENDING_INSPECTION,
      })
    );

    await this.grnItemRepository.save(grnItems);

    return this.mapToResponse(savedGRN);
  }

  async findAll(filters?: any): Promise<GoodsReceiptResponseDto[]> {
    const grns = await this.grnRepository.find({
      order: { createdAt: 'DESC' },
    });
    return grns.map(grn => this.mapToResponse(grn));
  }

  async findOne(id: string): Promise<GoodsReceiptResponseDto> {
    const grn = await this.grnRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!grn) {
      throw new NotFoundException(`Goods Receipt with ID ${id} not found`);
    }

    return this.mapToResponse(grn);
  }

  async update(id: string, updateDto: UpdateGoodsReceiptDto): Promise<GoodsReceiptResponseDto> {
    const grn = await this.grnRepository.findOne({ where: { id } });
    if (!grn) {
      throw new NotFoundException(`Goods Receipt with ID ${id} not found`);
    }

    Object.assign(grn, updateDto);
    const updated = await this.grnRepository.save(grn);
    return this.mapToResponse(updated);
  }

  async remove(id: string): Promise<void> {
    await this.grnRepository.delete(id);
  }

  async qualityCheck(id: string, checkData: any): Promise<GoodsReceiptResponseDto> {
    const grn = await this.grnRepository.findOne({ where: { id } });
    if (!grn) {
      throw new NotFoundException(`Goods Receipt with ID ${id} not found`);
    }

    grn.qualityCheckCompleted = true;
    grn.qualityCheckPassed = checkData.passed;
    grn.qualityCheckRemarks = checkData.remarks;
    grn.qualityCheckResults = checkData.results;
    grn.status = checkData.passed ? GRNStatus.QUALITY_CHECK_PASSED : GRNStatus.QUALITY_CHECK_FAILED;

    const updated = await this.grnRepository.save(grn);
    return this.mapToResponse(updated);
  }

  async postToInventory(id: string): Promise<GoodsReceiptResponseDto> {
    const grn = await this.grnRepository.findOne({ where: { id } });
    if (!grn) {
      throw new NotFoundException(`Goods Receipt with ID ${id} not found`);
    }

    if (!grn.qualityCheckPassed) {
      throw new BadRequestException('Quality check must pass before posting to inventory');
    }

    grn.isPostedToInventory = true;
    grn.inventoryPostedAt = new Date();
    grn.status = GRNStatus.POSTED;

    const updated = await this.grnRepository.save(grn);
    return this.mapToResponse(updated);
  }

  async getPendingReceipts(): Promise<any[]> {
    const grns = await this.grnRepository.find({
      where: [
        { status: GRNStatus.QUALITY_CHECK_PENDING },
        { status: GRNStatus.DRAFT },
      ],
    });

    return grns.map(grn => ({
      id: grn.id,
      grnNumber: grn.grnNumber,
      grnDate: grn.grnDate,
      vendorName: grn.vendorName,
      poNumber: grn.purchaseOrderNumber,
      totalReceivedAmount: grn.totalReceivedAmount,
      status: grn.status,
    }));
  }

  private async generateGRNNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.grnRepository.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `GRN-${year}${month}-${sequence}`;
  }

  private mapToResponse(grn: GoodsReceipt): GoodsReceiptResponseDto {
    return {
      id: grn.id,
      grnNumber: grn.grnNumber,
      grnDate: grn.grnDate,
      status: grn.status,
      grnType: grn.grnType,
      vendorName: grn.vendorName,
      warehouseName: grn.warehouseName,
      totalReceivedAmount: grn.totalReceivedAmount,
      totalAcceptedAmount: grn.totalAcceptedAmount,
      isPostedToInventory: grn.isPostedToInventory,
      createdAt: grn.createdAt,
    };
  }
}
