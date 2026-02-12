import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BOQ, BOQItem, BOQStatus } from '../entities/boq.entity';
import { BOQTemplate } from '../entities/estimate-template.entity';

@Injectable()
export class BOQService {
  constructor(
    @InjectRepository(BOQ)
    private boqRepository: Repository<BOQ>,
    @InjectRepository(BOQItem)
    private boqItemRepository: Repository<BOQItem>,
    @InjectRepository(BOQTemplate)
    private boqTemplateRepository: Repository<BOQTemplate>,
  ) {}

  async create(data: Partial<BOQ>, items?: Partial<BOQItem>[]): Promise<BOQ> {
    const boqNumber = await this.generateBOQNumber();

    const estimatedValue =
      items?.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const rate = Number(item.unitRate) || 0;
        return sum + qty * rate;
      }, 0) || 0;

    const boq = this.boqRepository.create({
      ...data,
      boqNumber,
      estimatedValue,
    });

    const savedBOQ = await this.boqRepository.save(boq);

    if (items && items.length > 0) {
      const boqItems = items.map((item) => {
        const qty = Number(item.quantity) || 0;
        const rate = Number(item.unitRate) || 0;
        return this.boqItemRepository.create({
          ...item,
          boqId: savedBOQ.id,
          totalAmount: qty * rate,
        });
      });
      await this.boqItemRepository.save(boqItems);
    }

    return this.findOne(savedBOQ.id);
  }

  async createFromTemplate(
    templateId: string,
    data: Partial<BOQ>,
  ): Promise<BOQ> {
    const template = await this.boqTemplateRepository.findOne({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${templateId} not found`);
    }

    const items: Partial<BOQItem>[] = [];
    template.sections?.forEach((section) => {
      section.items?.forEach((item) => {
        items.push({
          itemNo: item.itemNumber,
          description: item.description,
          unit: item.unit,
          quantity: item.defaultQuantity || 0,
          unitRate: item.defaultRate || 0,
          specifications: item.specifications,
          category: section.sectionName,
        });
      });
    });

    // Update template usage count
    await this.boqTemplateRepository.update(templateId, {
      usageCount: () => 'usageCount + 1',
    });

    return this.create(data, items);
  }

  async findAll(filters?: {
    status?: BOQStatus;
    clientName?: string;
  }): Promise<BOQ[]> {
    const query = this.boqRepository
      .createQueryBuilder('boq')
      .orderBy('boq.createdAt', 'DESC');

    if (filters?.status) {
      query.andWhere('boq.status = :status', { status: filters.status });
    }
    if (filters?.clientName) {
      query.andWhere('boq.clientName LIKE :clientName', {
        clientName: `%${filters.clientName}%`,
      });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<BOQ> {
    const boq = await this.boqRepository.findOne({ where: { id } });
    if (!boq) {
      throw new NotFoundException(`BOQ with ID ${id} not found`);
    }
    return boq;
  }

  async findItems(boqId: string): Promise<BOQItem[]> {
    return this.boqItemRepository.find({
      where: { boqId },
      order: { itemNo: 'ASC' },
    });
  }

  async update(id: string, data: Partial<BOQ>): Promise<BOQ> {
    const boq = await this.findOne(id);
    Object.assign(boq, data);
    return this.boqRepository.save(boq);
  }

  async updateItems(boqId: string, items: Partial<BOQItem>[]): Promise<BOQItem[]> {
    await this.boqItemRepository.delete({ boqId });

    const boqItems = items.map((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.unitRate) || 0;
      return this.boqItemRepository.create({
        ...item,
        boqId,
        totalAmount: qty * rate,
      });
    });

    const savedItems = await this.boqItemRepository.save(boqItems);

    // Update BOQ total
    const estimatedValue = savedItems.reduce(
      (sum, item) => sum + Number(item.totalAmount),
      0,
    );
    await this.boqRepository.update(boqId, { estimatedValue });

    return savedItems;
  }

  async delete(id: string): Promise<void> {
    const result = await this.boqRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`BOQ with ID ${id} not found`);
    }
  }

  async submitForReview(id: string): Promise<BOQ> {
    const boq = await this.findOne(id);
    boq.status = BOQStatus.UNDER_REVIEW;
    return this.boqRepository.save(boq);
  }

  async approve(id: string): Promise<BOQ> {
    const boq = await this.findOne(id);
    boq.status = BOQStatus.APPROVED;
    return this.boqRepository.save(boq);
  }

  async reject(id: string): Promise<BOQ> {
    const boq = await this.findOne(id);
    boq.status = BOQStatus.REJECTED;
    return this.boqRepository.save(boq);
  }

  async getAnalysis(id: string): Promise<{
    boq: BOQ;
    items: BOQItem[];
    summary: {
      totalItems: number;
      totalAmount: number;
      byCategory: { category: string; itemCount: number; totalAmount: number }[];
      topItems: { description: string; totalAmount: number; percentage: number }[];
    };
  }> {
    const boq = await this.findOne(id);
    const items = await this.findItems(id);

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.totalAmount),
      0,
    );

    // Group by category
    const categoryMap = new Map<
      string,
      { itemCount: number; totalAmount: number }
    >();
    items.forEach((item) => {
      const cat = categoryMap.get(item.category) || {
        itemCount: 0,
        totalAmount: 0,
      };
      cat.itemCount++;
      cat.totalAmount += Number(item.totalAmount);
      categoryMap.set(item.category, cat);
    });

    const byCategory = Array.from(categoryMap.entries()).map(
      ([category, stats]) => ({
        category,
        ...stats,
      }),
    );

    // Top items by value
    const topItems = [...items]
      .sort((a, b) => Number(b.totalAmount) - Number(a.totalAmount))
      .slice(0, 10)
      .map((item) => ({
        description: item.description,
        totalAmount: Number(item.totalAmount),
        percentage:
          totalAmount > 0 ? (Number(item.totalAmount) / totalAmount) * 100 : 0,
      }));

    return {
      boq,
      items,
      summary: {
        totalItems: items.length,
        totalAmount,
        byCategory,
        topItems,
      },
    };
  }

  async compareBOQs(
    boqId1: string,
    boqId2: string,
  ): Promise<{
    boq1: BOQ;
    boq2: BOQ;
    comparison: {
      valueDifference: number;
      percentageDifference: number;
      itemDifferences: {
        itemNo: string;
        description: string;
        boq1Quantity: number;
        boq2Quantity: number;
        boq1Amount: number;
        boq2Amount: number;
        difference: number;
      }[];
      onlyInBOQ1: BOQItem[];
      onlyInBOQ2: BOQItem[];
    };
  }> {
    const boq1 = await this.findOne(boqId1);
    const boq2 = await this.findOne(boqId2);
    const items1 = await this.findItems(boqId1);
    const items2 = await this.findItems(boqId2);

    const items1Map = new Map(items1.map((i) => [i.itemNo, i]));
    const items2Map = new Map(items2.map((i) => [i.itemNo, i]));

    const itemDifferences: {
      itemNo: string;
      description: string;
      boq1Quantity: number;
      boq2Quantity: number;
      boq1Amount: number;
      boq2Amount: number;
      difference: number;
    }[] = [];

    const onlyInBOQ1: BOQItem[] = [];
    const onlyInBOQ2: BOQItem[] = [];

    // Check items in BOQ1
    for (const [itemNo, item1] of items1Map) {
      const item2 = items2Map.get(itemNo);
      if (item2) {
        itemDifferences.push({
          itemNo,
          description: item1.description,
          boq1Quantity: Number(item1.quantity),
          boq2Quantity: Number(item2.quantity),
          boq1Amount: Number(item1.totalAmount),
          boq2Amount: Number(item2.totalAmount),
          difference: Number(item2.totalAmount) - Number(item1.totalAmount),
        });
      } else {
        onlyInBOQ1.push(item1);
      }
    }

    // Check items only in BOQ2
    for (const [itemNo, item2] of items2Map) {
      if (!items1Map.has(itemNo)) {
        onlyInBOQ2.push(item2);
      }
    }

    const valueDifference =
      Number(boq2.estimatedValue) - Number(boq1.estimatedValue);
    const percentageDifference =
      boq1.estimatedValue > 0
        ? (valueDifference / Number(boq1.estimatedValue)) * 100
        : 0;

    return {
      boq1,
      boq2,
      comparison: {
        valueDifference,
        percentageDifference,
        itemDifferences,
        onlyInBOQ1,
        onlyInBOQ2,
      },
    };
  }

  async importFromBOM(
    bomData: {
      itemNo: string;
      description: string;
      unit: string;
      quantity: number;
      category: string;
    }[],
    boqData: Partial<BOQ>,
  ): Promise<BOQ> {
    const items: Partial<BOQItem>[] = bomData.map((item) => ({
      itemNo: item.itemNo,
      description: item.description,
      unit: item.unit,
      quantity: item.quantity,
      unitRate: 0, // To be filled with rates
      category: item.category,
    }));

    return this.create(boqData, items);
  }

  private async generateBOQNumber(): Promise<string> {
    const count = await this.boqRepository.count();
    const year = new Date().getFullYear();
    return `BOQ-${year}-${String(count + 1).padStart(4, '0')}`;
  }
}
