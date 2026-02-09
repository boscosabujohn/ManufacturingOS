import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation, QuotationItem, QuotationStatus, MarginStatus } from '../entities/quotation.entity';
import { CreateQuotationDto, UpdateQuotationDto } from '../dto/quotation.dto';
import { PricingService } from './pricing.service';
import { Item } from '../../core/entities/item.entity';
import { TaxMaster } from '../../finance/entities/tax.entity';

@Injectable()
export class QuotationService {
    private readonly MARGIN_WARNING_THRESHOLD = 0.25; // 25% for Warning
    private readonly MARGIN_CRITICAL_THRESHOLD = 0.15; // 15% for Critical (per TODO)

    constructor(
        @InjectRepository(Quotation)
        private readonly quotationRepository: Repository<Quotation>,
        @InjectRepository(QuotationItem)
        private readonly itemRepository: Repository<QuotationItem>,
        @InjectRepository(Item)
        private readonly coreItemRepository: Repository<Item>,
        @InjectRepository(TaxMaster)
        private readonly taxRepository: Repository<TaxMaster>,
        private readonly pricingService: PricingService,
    ) { }

    async findAll(filters?: any): Promise<Quotation[]> {
        return await this.quotationRepository.find({
            relations: ['items'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Quotation> {
        const quotation = await this.quotationRepository.findOne({
            where: { id },
            relations: ['items'],
        });
        if (!quotation) {
            throw new NotFoundException(`Quotation with ID ${id} not found`);
        }
        return quotation;
    }

    async create(dto: CreateQuotationDto): Promise<Quotation> {
        const quotationNo = await this.generateQuotationNumber();
        const quotation = this.quotationRepository.create({
            ...dto,
            quotationNumber: quotationNo,
            quotationDate: new Date(dto.quotationDate),
            validUntil: new Date(dto.validUntil),
        });

        await this.calculateTotals(quotation);
        return await this.quotationRepository.save(quotation);
    }

    async update(id: string, dto: UpdateQuotationDto): Promise<Quotation> {
        const quotation = await this.findOne(id);

        // Update basic fields
        Object.assign(quotation, {
            ...dto,
            quotationDate: new Date(dto.quotationDate),
            validUntil: new Date(dto.validUntil),
        });

        // Handle items update (simplified: replace all)
        if (dto.items) {
            await this.itemRepository.delete({ quotationId: id });
            quotation.items = dto.items.map(itemDto => this.itemRepository.create(itemDto));
        }

        await this.calculateTotals(quotation);
        return await this.quotationRepository.save(quotation);
    }

    async delete(id: string): Promise<void> {
        const quotation = await this.findOne(id);
        await this.quotationRepository.remove(quotation);
    }

    private async calculateTotals(quotation: Quotation): Promise<void> {
        let subtotal = 0;
        let totalTax = 0;
        let totalDiscount = 0;
        let totalCost = 0;

        for (const item of quotation.items) {
            // Get core item for cost data
            const coreItem = await this.coreItemRepository.findOne({ where: { id: item.productId } });
            const unitCost = coreItem ? Number(coreItem.averageCost || coreItem.standardCost || 0) : 0;
            item.unitCost = unitCost;

            const lineSubtotal = Number(item.quantity) * Number(item.unitPrice);
            const lineDiscount = lineSubtotal * (Number(item.discountPercentage || 0) / 100);
            const lineTaxable = lineSubtotal - lineDiscount;
            const lineTax = lineTaxable * (Number(item.taxRate || 0) / 100);
            const lineTotal = lineTaxable + lineTax;

            const lineCost = Number(item.quantity) * unitCost;
            const lineMargin = lineTaxable - lineCost;
            item.marginPercentage = lineTaxable > 0 ? (lineMargin / lineTaxable) * 100 : 0;
            item.totalAmount = lineTotal;

            subtotal += lineSubtotal;
            totalTax += lineTax;
            totalDiscount += lineDiscount;
            totalCost += lineCost;
        }

        quotation.subtotal = subtotal;
        quotation.taxAmount = totalTax;
        quotation.discountAmount = totalDiscount;
        quotation.totalAmount = subtotal - totalDiscount + totalTax;

        const totalTaxable = subtotal - totalDiscount;
        const overallMargin = totalTaxable > 0 ? (totalTaxable - totalCost) / totalTaxable : 0;
        quotation.overallMarginPercentage = overallMargin * 100;

        if (overallMargin < this.MARGIN_CRITICAL_THRESHOLD) {
            quotation.marginStatus = MarginStatus.CRITICAL;
        } else if (overallMargin < this.MARGIN_WARNING_THRESHOLD) {
            quotation.marginStatus = MarginStatus.WARNING;
        } else {
            quotation.marginStatus = MarginStatus.HEALTHY;
        }
    }

    private async generateQuotationNumber(): Promise<string> {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const count = await this.quotationRepository.count();
        return `QTN-${year}${month}-${String(count + 1).padStart(4, '0')}`;
    }
}
