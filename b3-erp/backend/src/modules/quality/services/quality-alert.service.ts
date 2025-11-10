import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QualityAlert, AlertStatus } from '../entities/quality-alert.entity';
import { CreateQualityAlertDto, UpdateQualityAlertDto, QualityAlertResponseDto } from '../dto';

@Injectable()
export class QualityAlertService {
  constructor(
    @InjectRepository(QualityAlert)
    private readonly alertRepository: Repository<QualityAlert>,
  ) {}

  async create(createDto: CreateQualityAlertDto): Promise<QualityAlertResponseDto> {
    const alert = this.alertRepository.create({ ...createDto, status: AlertStatus.NEW, alertTime: new Date() });
    const saved = await this.alertRepository.save(alert);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: { status?: AlertStatus; severity?: string }): Promise<QualityAlertResponseDto[]> {
    const query = this.alertRepository.createQueryBuilder('qa');
    if (filters?.status) query.andWhere('qa.status = :status', { status: filters.status });
    if (filters?.severity) query.andWhere('qa.severity = :severity', { severity: filters.severity });
    query.orderBy('qa.createdAt', 'DESC');
    const results = await query.getMany();
    return results.map((r) => this.mapToResponseDto(r));
  }

  async findOne(id: string): Promise<QualityAlertResponseDto> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) throw new NotFoundException(`Quality Alert with ID ${id} not found`);
    return this.mapToResponseDto(alert);
  }

  async update(id: string, updateDto: UpdateQualityAlertDto): Promise<QualityAlertResponseDto> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) throw new NotFoundException(`Quality Alert with ID ${id} not found`);
    Object.assign(alert, updateDto);
    const updated = await this.alertRepository.save(alert);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) throw new NotFoundException(`Quality Alert with ID ${id} not found`);
    await this.alertRepository.remove(alert);
  }

  async acknowledge(id: string, acknowledgedBy: string): Promise<QualityAlertResponseDto> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) throw new NotFoundException(`Quality Alert with ID ${id} not found`);
    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();
    const updated = await this.alertRepository.save(alert);
    return this.mapToResponseDto(updated);
  }

  async resolve(id: string, resolvedBy: string, resolution: string): Promise<QualityAlertResponseDto> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) throw new NotFoundException(`Quality Alert with ID ${id} not found`);
    alert.status = AlertStatus.RESOLVED;
    alert.resolvedBy = resolvedBy;
    alert.resolvedAt = new Date();
    alert.resolution = resolution;
    const updated = await this.alertRepository.save(alert);
    return this.mapToResponseDto(updated);
  }

  async close(id: string, closedBy: string): Promise<QualityAlertResponseDto> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) throw new NotFoundException(`Quality Alert with ID ${id} not found`);
    alert.status = AlertStatus.CLOSED;
    alert.closedBy = closedBy;
    alert.closedAt = new Date();
    const updated = await this.alertRepository.save(alert);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(alert: QualityAlert): QualityAlertResponseDto {
    return {
      id: alert.id,
      alertNumber: alert.alertNumber,
      title: alert.title,
      alertType: alert.alertType,
      severity: alert.severity,
      status: alert.status,
      alertDate: alert.alertDate,
      assignedToName: alert.assignedToName,
      acknowledgedBy: alert.acknowledgedBy,
      ncrGenerated: alert.ncrGenerated,
      capaGenerated: alert.capaGenerated,
      isOverdue: alert.isOverdue,
      createdAt: alert.createdAt,
      updatedAt: alert.updatedAt,
    };
  }
}
