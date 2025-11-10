import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkCenter, WorkCenterStatus } from '../entities/work-center.entity';
import { CreateWorkCenterDto, UpdateWorkCenterDto, WorkCenterResponseDto } from '../dto';

@Injectable()
export class WorkCenterService {
  constructor(
    @InjectRepository(WorkCenter)
    private readonly workCenterRepository: Repository<WorkCenter>,
  ) {}

  async create(createDto: CreateWorkCenterDto): Promise<WorkCenterResponseDto> {
    const existing = await this.workCenterRepository.findOne({
      where: { workCenterCode: createDto.workCenterCode },
    });

    if (existing) {
      throw new BadRequestException(`Work Center code ${createDto.workCenterCode} already exists`);
    }

    const workCenter = this.workCenterRepository.create({
      ...createDto,
      status: WorkCenterStatus.AVAILABLE,
    });

    // Calculate total cost
    workCenter.totalCostPerHour =
      (workCenter.hourlyOperatingCost || 0) +
      (workCenter.laborCostPerHour || 0) +
      (workCenter.overheadCostPerHour || 0);

    // Calculate available capacity
    workCenter.availableCapacityHoursPerDay =
      (workCenter.workingHoursPerDay || 8) *
      (workCenter.numberOfStations || 1) *
      ((workCenter.efficiency || 100) / 100);

    const savedWorkCenter = await this.workCenterRepository.save(workCenter);
    return this.mapToResponseDto(savedWorkCenter);
  }

  async findAll(filters?: {
    workCenterType?: string;
    department?: string;
    status?: WorkCenterStatus;
    isActive?: boolean;
  }): Promise<WorkCenterResponseDto[]> {
    const query = this.workCenterRepository.createQueryBuilder('wc');

    if (filters?.workCenterType) {
      query.andWhere('wc.workCenterType = :workCenterType', { workCenterType: filters.workCenterType });
    }

    if (filters?.department) {
      query.andWhere('wc.department = :department', { department: filters.department });
    }

    if (filters?.status) {
      query.andWhere('wc.status = :status', { status: filters.status });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('wc.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('wc.workCenterCode', 'ASC');

    const workCenters = await query.getMany();
    return workCenters.map((wc) => this.mapToResponseDto(wc));
  }

  async findOne(id: string): Promise<WorkCenterResponseDto> {
    const workCenter = await this.workCenterRepository.findOne({ where: { id } });

    if (!workCenter) {
      throw new NotFoundException(`Work Center with ID ${id} not found`);
    }

    return this.mapToResponseDto(workCenter);
  }

  async update(id: string, updateDto: UpdateWorkCenterDto): Promise<WorkCenterResponseDto> {
    const workCenter = await this.workCenterRepository.findOne({ where: { id } });

    if (!workCenter) {
      throw new NotFoundException(`Work Center with ID ${id} not found`);
    }

    Object.assign(workCenter, updateDto);

    // Recalculate costs and capacity if needed
    if (updateDto.hourlyOperatingCost !== undefined ||
        updateDto.laborCostPerHour !== undefined ||
        updateDto.overheadCostPerHour !== undefined) {
      workCenter.totalCostPerHour =
        (workCenter.hourlyOperatingCost || 0) +
        (workCenter.laborCostPerHour || 0) +
        (workCenter.overheadCostPerHour || 0);
    }

    if (updateDto.workingHoursPerDay !== undefined ||
        updateDto.numberOfStations !== undefined ||
        updateDto.efficiency !== undefined) {
      workCenter.availableCapacityHoursPerDay =
        (workCenter.workingHoursPerDay || 8) *
        (workCenter.numberOfStations || 1) *
        ((workCenter.efficiency || 100) / 100);
    }

    // Calculate utilization
    if (workCenter.availableCapacityHoursPerDay > 0) {
      workCenter.capacityUtilizationPercentage =
        (workCenter.utilisedCapacityHoursPerDay / workCenter.availableCapacityHoursPerDay) * 100;
    }

    // Calculate uptime
    if (workCenter.totalRunningHours + workCenter.totalDowntimeHours > 0) {
      workCenter.uptimePercentage =
        (workCenter.totalRunningHours / (workCenter.totalRunningHours + workCenter.totalDowntimeHours)) * 100;
    }

    const updatedWorkCenter = await this.workCenterRepository.save(workCenter);
    return this.mapToResponseDto(updatedWorkCenter);
  }

  async remove(id: string): Promise<void> {
    const workCenter = await this.workCenterRepository.findOne({ where: { id } });

    if (!workCenter) {
      throw new NotFoundException(`Work Center with ID ${id} not found`);
    }

    await this.workCenterRepository.remove(workCenter);
  }

  async updateStatus(id: string, status: WorkCenterStatus): Promise<WorkCenterResponseDto> {
    const workCenter = await this.workCenterRepository.findOne({ where: { id } });

    if (!workCenter) {
      throw new NotFoundException(`Work Center with ID ${id} not found`);
    }

    workCenter.status = status;
    const updatedWorkCenter = await this.workCenterRepository.save(workCenter);
    return this.mapToResponseDto(updatedWorkCenter);
  }

  private mapToResponseDto(workCenter: WorkCenter): WorkCenterResponseDto {
    return {
      id: workCenter.id,
      workCenterCode: workCenter.workCenterCode,
      workCenterName: workCenter.workCenterName,
      description: workCenter.description,
      workCenterType: workCenter.workCenterType,
      status: workCenter.status,
      department: workCenter.department,
      plant: workCenter.plant,
      location: workCenter.location,
      numberOfStations: workCenter.numberOfStations,
      workingHoursPerDay: workCenter.workingHoursPerDay,
      availableCapacityHoursPerDay: workCenter.availableCapacityHoursPerDay,
      utilisedCapacityHoursPerDay: workCenter.utilisedCapacityHoursPerDay,
      capacityUtilizationPercentage: workCenter.capacityUtilizationPercentage,
      efficiency: workCenter.efficiency,
      totalCostPerHour: workCenter.totalCostPerHour,
      uptimePercentage: workCenter.uptimePercentage,
      oeePercentage: workCenter.oeePercentage,
      isActive: workCenter.isActive,
      notes: workCenter.notes,
      createdBy: workCenter.createdBy,
      updatedBy: workCenter.updatedBy,
      createdAt: workCenter.createdAt,
      updatedAt: workCenter.updatedAt,
    };
  }
}
