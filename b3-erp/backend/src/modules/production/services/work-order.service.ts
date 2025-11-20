import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrder, WorkOrderStatus } from '../entities/work-order.entity';
import { WorkOrderItem } from '../entities/work-order-item.entity';
import { CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderResponseDto } from '../dto';
import { EventBusService } from '../../workflow/services/event-bus.service';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(WorkOrderItem)
    private readonly workOrderItemRepository: Repository<WorkOrderItem>,
    private readonly eventBus: EventBusService,
  ) {}

  async create(createDto: CreateWorkOrderDto): Promise<WorkOrderResponseDto> {
    const existing = await this.workOrderRepository.findOne({
      where: { workOrderNumber: createDto.workOrderNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Work Order ${createDto.workOrderNumber} already exists`,
      );
    }

    const workOrder = this.workOrderRepository.create({
      ...createDto,
      status: WorkOrderStatus.DRAFT,
      pendingQuantity: createDto.plannedQuantity,
    });

    const savedWorkOrder = await this.workOrderRepository.save(workOrder);

    // Emit work order created event
    this.eventBus.emitWorkOrderCreated({
      workOrderId: savedWorkOrder.id,
      workOrderNumber: savedWorkOrder.workOrderNumber,
      orderId: savedWorkOrder.salesOrderId,
      orderNumber: savedWorkOrder.salesOrderNumber,
      itemId: savedWorkOrder.itemId,
      itemName: savedWorkOrder.itemName,
      quantity: savedWorkOrder.plannedQuantity,
      unit: savedWorkOrder.uom,
      plannedStartDate: savedWorkOrder.plannedStartDate,
      plannedEndDate: savedWorkOrder.plannedEndDate,
      status: savedWorkOrder.status,
      priority: savedWorkOrder.priority as any,
      userId: savedWorkOrder.createdBy,
    });

    return this.mapToResponseDto(savedWorkOrder);
  }

  async findAll(filters?: {
    status?: WorkOrderStatus;
    itemId?: string;
    workCenterId?: string;
    customerId?: string;
  }): Promise<WorkOrderResponseDto[]> {
    const query = this.workOrderRepository.createQueryBuilder('wo');

    if (filters?.status) {
      query.andWhere('wo.status = :status', { status: filters.status });
    }

    if (filters?.itemId) {
      query.andWhere('wo.itemId = :itemId', { itemId: filters.itemId });
    }

    if (filters?.workCenterId) {
      query.andWhere('wo.workCenterId = :workCenterId', {
        workCenterId: filters.workCenterId,
      });
    }

    if (filters?.customerId) {
      query.andWhere('wo.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }

    query.orderBy('wo.createdAt', 'DESC');

    const workOrders = await query.getMany();
    return workOrders.map((wo) => this.mapToResponseDto(wo));
  }

  async findOne(id: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    return this.mapToResponseDto(workOrder);
  }

  async update(
    id: string,
    updateDto: UpdateWorkOrderDto,
  ): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    // Validate status transitions
    if (
      workOrder.status === WorkOrderStatus.COMPLETED ||
      workOrder.status === WorkOrderStatus.CLOSED
    ) {
      throw new BadRequestException(
        'Cannot modify completed or closed work orders',
      );
    }

    Object.assign(workOrder, updateDto);
    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);
    return this.mapToResponseDto(updatedWorkOrder);
  }

  async remove(id: string): Promise<void> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    if (workOrder.status !== WorkOrderStatus.DRAFT) {
      throw new BadRequestException('Only draft work orders can be deleted');
    }

    await this.workOrderRepository.remove(workOrder);
  }

  // Workflow operations
  async submit(id: string, submittedBy: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    if (workOrder.status !== WorkOrderStatus.DRAFT) {
      throw new BadRequestException('Only draft work orders can be submitted');
    }

    workOrder.status = WorkOrderStatus.SUBMITTED;
    workOrder.submittedBy = submittedBy;
    workOrder.submittedAt = new Date();

    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);
    return this.mapToResponseDto(updatedWorkOrder);
  }

  async release(id: string, releasedBy: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    if (workOrder.status !== WorkOrderStatus.SUBMITTED) {
      throw new BadRequestException(
        'Only submitted work orders can be released',
      );
    }

    workOrder.status = WorkOrderStatus.RELEASED;
    workOrder.releasedBy = releasedBy;
    workOrder.releasedAt = new Date();

    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);

    // Emit work order released event - triggers material issue
    this.eventBus.emitWorkOrderReleased({
      workOrderId: updatedWorkOrder.id,
      workOrderNumber: updatedWorkOrder.workOrderNumber,
      orderId: updatedWorkOrder.salesOrderId,
      orderNumber: updatedWorkOrder.salesOrderNumber,
      itemId: updatedWorkOrder.itemId,
      itemName: updatedWorkOrder.itemName,
      quantity: updatedWorkOrder.plannedQuantity,
      unit: updatedWorkOrder.uom,
      plannedStartDate: updatedWorkOrder.plannedStartDate,
      plannedEndDate: updatedWorkOrder.plannedEndDate,
      status: updatedWorkOrder.status,
      priority: updatedWorkOrder.priority as any,
      userId: releasedBy,
    });

    return this.mapToResponseDto(updatedWorkOrder);
  }

  async start(id: string, startedBy: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    if (workOrder.status !== WorkOrderStatus.RELEASED) {
      throw new BadRequestException(
        'Only released work orders can be started',
      );
    }

    workOrder.status = WorkOrderStatus.IN_PROGRESS;
    workOrder.startedBy = startedBy;
    workOrder.startedAt = new Date();
    workOrder.actualStartDate = new Date();

    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);

    // Emit work order started event
    this.eventBus.emitWorkOrderStarted({
      workOrderId: updatedWorkOrder.id,
      workOrderNumber: updatedWorkOrder.workOrderNumber,
      orderId: updatedWorkOrder.salesOrderId,
      orderNumber: updatedWorkOrder.salesOrderNumber,
      itemId: updatedWorkOrder.itemId,
      itemName: updatedWorkOrder.itemName,
      quantity: updatedWorkOrder.plannedQuantity,
      unit: updatedWorkOrder.uom,
      plannedStartDate: updatedWorkOrder.plannedStartDate,
      plannedEndDate: updatedWorkOrder.plannedEndDate,
      status: updatedWorkOrder.status,
      priority: updatedWorkOrder.priority as any,
      userId: startedBy,
    });

    return this.mapToResponseDto(updatedWorkOrder);
  }

  async complete(
    id: string,
    completedBy: string,
  ): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    if (workOrder.status !== WorkOrderStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Only in-progress work orders can be completed',
      );
    }

    workOrder.status = WorkOrderStatus.COMPLETED;
    workOrder.completedBy = completedBy;
    workOrder.completedAt = new Date();
    workOrder.actualEndDate = new Date();
    workOrder.productionCompleted = true;
    workOrder.progressPercentage = 100;

    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);

    // Emit work order completed event - triggers QC and finished goods receipt
    this.eventBus.emitWorkOrderCompleted({
      workOrderId: updatedWorkOrder.id,
      workOrderNumber: updatedWorkOrder.workOrderNumber,
      orderId: updatedWorkOrder.salesOrderId,
      orderNumber: updatedWorkOrder.salesOrderNumber,
      itemId: updatedWorkOrder.itemId,
      itemName: updatedWorkOrder.itemName,
      quantity: updatedWorkOrder.producedQuantity || updatedWorkOrder.plannedQuantity,
      unit: updatedWorkOrder.uom,
      plannedStartDate: updatedWorkOrder.plannedStartDate,
      plannedEndDate: updatedWorkOrder.plannedEndDate,
      status: updatedWorkOrder.status,
      priority: updatedWorkOrder.priority as any,
      userId: completedBy,
    });

    return this.mapToResponseDto(updatedWorkOrder);
  }

  async close(id: string, closedBy: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    if (workOrder.status !== WorkOrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Only completed work orders can be closed',
      );
    }

    workOrder.status = WorkOrderStatus.CLOSED;
    workOrder.closedBy = closedBy;
    workOrder.closedAt = new Date();

    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);
    return this.mapToResponseDto(updatedWorkOrder);
  }

  async cancel(
    id: string,
    cancelledBy: string,
    reason: string,
  ): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    if (
      workOrder.status === WorkOrderStatus.COMPLETED ||
      workOrder.status === WorkOrderStatus.CLOSED
    ) {
      throw new BadRequestException(
        'Cannot cancel completed or closed work orders',
      );
    }

    workOrder.status = WorkOrderStatus.CANCELLED;
    workOrder.cancelledBy = cancelledBy;
    workOrder.cancelledAt = new Date();
    workOrder.cancellationReason = reason;

    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);
    return this.mapToResponseDto(updatedWorkOrder);
  }

  async updateProgress(id: string, producedQty: number): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
    });

    if (!workOrder) {
      throw new NotFoundException(`Work Order with ID ${id} not found`);
    }

    workOrder.producedQuantity = producedQty;
    workOrder.pendingQuantity = workOrder.plannedQuantity - producedQty;
    workOrder.progressPercentage =
      (producedQty / workOrder.plannedQuantity) * 100;

    const updatedWorkOrder = await this.workOrderRepository.save(workOrder);
    return this.mapToResponseDto(updatedWorkOrder);
  }

  private mapToResponseDto(workOrder: WorkOrder): WorkOrderResponseDto {
    return {
      id: workOrder.id,
      workOrderNumber: workOrder.workOrderNumber,
      workOrderName: workOrder.workOrderName,
      description: workOrder.description,
      workOrderType: workOrder.workOrderType,
      status: workOrder.status,
      priority: workOrder.priority,
      itemId: workOrder.itemId,
      itemCode: workOrder.itemCode,
      itemName: workOrder.itemName,
      uom: workOrder.uom,
      plannedQuantity: workOrder.plannedQuantity,
      producedQuantity: workOrder.producedQuantity,
      acceptedQuantity: workOrder.acceptedQuantity,
      rejectedQuantity: workOrder.rejectedQuantity,
      scrapQuantity: workOrder.scrapQuantity,
      pendingQuantity: workOrder.pendingQuantity,
      bomId: workOrder.bomId,
      bomCode: workOrder.bomCode,
      routingId: workOrder.routingId,
      routingCode: workOrder.routingCode,
      plannedStartDate: workOrder.plannedStartDate,
      plannedEndDate: workOrder.plannedEndDate,
      actualStartDate: workOrder.actualStartDate,
      actualEndDate: workOrder.actualEndDate,
      requiredByDate: workOrder.requiredByDate,
      workCenterId: workOrder.workCenterId,
      workCenterCode: workOrder.workCenterCode,
      estimatedTotalCost: workOrder.estimatedTotalCost,
      actualTotalCost: workOrder.actualTotalCost,
      progressPercentage: workOrder.progressPercentage,
      materialsIssued: workOrder.materialsIssued,
      productionCompleted: workOrder.productionCompleted,
      customerId: workOrder.customerId,
      customerName: workOrder.customerName,
      notes: workOrder.notes,
      createdBy: workOrder.createdBy,
      updatedBy: workOrder.updatedBy,
      createdAt: workOrder.createdAt,
      updatedAt: workOrder.updatedAt,
    };
  }
}
