import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlannedOrder, PlannedOrderStatus, PlannedOrderType } from '../entities/planned-order.entity';

@Injectable()
export class PlannedOrderService {
  constructor(
    @InjectRepository(PlannedOrder)
    private readonly plannedOrderRepository: Repository<PlannedOrder>,
  ) {}

  async create(createDto: Partial<PlannedOrder>): Promise<PlannedOrder> {
    const existing = await this.plannedOrderRepository.findOne({
      where: { orderNumber: createDto.orderNumber },
    });

    if (existing) {
      throw new BadRequestException(`Planned Order ${createDto.orderNumber} already exists`);
    }

    const order = this.plannedOrderRepository.create(createDto);
    return this.plannedOrderRepository.save(order);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: PlannedOrderStatus;
    orderType?: PlannedOrderType;
    itemId?: string;
  }): Promise<PlannedOrder[]> {
    const query = this.plannedOrderRepository.createQueryBuilder('order');

    if (filters?.companyId) {
      query.andWhere('order.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters?.orderType) {
      query.andWhere('order.orderType = :orderType', { orderType: filters.orderType });
    }

    if (filters?.itemId) {
      query.andWhere('order.itemId = :itemId', { itemId: filters.itemId });
    }

    query.orderBy('order.plannedStartDate', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<PlannedOrder> {
    const order = await this.plannedOrderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Planned Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateDto: Partial<PlannedOrder>): Promise<PlannedOrder> {
    const order = await this.findOne(id);
    if (order.status === 'released') {
      throw new BadRequestException('Cannot modify released order');
    }
    Object.assign(order, updateDto);
    return this.plannedOrderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    if (order.status !== 'planned') {
      throw new BadRequestException('Only planned orders can be deleted');
    }
    await this.plannedOrderRepository.remove(order);
  }

  async release(id: string, releasedOrderId: string): Promise<PlannedOrder> {
    const order = await this.findOne(id);
    order.status = 'released';
    order.releasedOrderId = releasedOrderId;
    return this.plannedOrderRepository.save(order);
  }

  async firm(id: string, firmedBy: string): Promise<PlannedOrder> {
    const order = await this.findOne(id);
    order.status = 'firmed';
    order.firmedBy = firmedBy;
    order.firmedAt = new Date();
    return this.plannedOrderRepository.save(order);
  }
}
