import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErgonomicAlert, AlertSeverity, AlertStatus, AlertCategory } from '../entities/ergonomic-alert.entity';

@Injectable()
export class ErgonomicAlertService {
  constructor(
    @InjectRepository(ErgonomicAlert)
    private readonly ergonomicAlertRepository: Repository<ErgonomicAlert>,
  ) {}

  async create(createDto: Partial<ErgonomicAlert>): Promise<ErgonomicAlert> {
    const alert = this.ergonomicAlertRepository.create(createDto);
    return this.ergonomicAlertRepository.save(alert);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: AlertStatus;
    severity?: AlertSeverity;
    category?: AlertCategory;
    employeeId?: string;
  }): Promise<ErgonomicAlert[]> {
    const query = this.ergonomicAlertRepository.createQueryBuilder('alert');

    if (filters?.companyId) {
      query.andWhere('alert.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('alert.status = :status', { status: filters.status });
    }

    if (filters?.severity) {
      query.andWhere('alert.severity = :severity', { severity: filters.severity });
    }

    if (filters?.category) {
      query.andWhere('alert.category = :category', { category: filters.category });
    }

    if (filters?.employeeId) {
      query.andWhere('alert.employeeId = :employeeId', { employeeId: filters.employeeId });
    }

    query.orderBy('alert.triggeredAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ErgonomicAlert> {
    const alert = await this.ergonomicAlertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException(`Ergonomic Alert with ID ${id} not found`);
    }
    return alert;
  }

  async update(id: string, updateDto: Partial<ErgonomicAlert>): Promise<ErgonomicAlert> {
    const alert = await this.findOne(id);
    Object.assign(alert, updateDto);
    return this.ergonomicAlertRepository.save(alert);
  }

  async remove(id: string): Promise<void> {
    const alert = await this.findOne(id);
    await this.ergonomicAlertRepository.remove(alert);
  }

  async acknowledge(id: string, acknowledgedBy: string): Promise<ErgonomicAlert> {
    const alert = await this.findOne(id);
    alert.status = 'acknowledged';
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();
    return this.ergonomicAlertRepository.save(alert);
  }

  async resolve(id: string, resolutionAction: string, resolvedBy: string): Promise<ErgonomicAlert> {
    const alert = await this.findOne(id);
    alert.status = 'resolved';
    alert.resolutionAction = resolutionAction;
    alert.resolvedBy = resolvedBy;
    alert.resolvedAt = new Date();
    return this.ergonomicAlertRepository.save(alert);
  }

  async dismiss(id: string, notes: string): Promise<ErgonomicAlert> {
    const alert = await this.findOne(id);
    alert.status = 'dismissed';
    alert.notes = notes;
    return this.ergonomicAlertRepository.save(alert);
  }

  async scheduleFollowUp(id: string, followUpDate: Date): Promise<ErgonomicAlert> {
    const alert = await this.findOne(id);
    alert.followUpRequired = true;
    alert.followUpDate = followUpDate;
    return this.ergonomicAlertRepository.save(alert);
  }

  async getAlertDashboard(companyId: string): Promise<any> {
    const alerts = await this.findAll({ companyId });

    const activeAlerts = alerts.filter(a => a.status === 'active');
    const bySeverity = {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
      info: alerts.filter(a => a.severity === 'info').length,
    };

    const byCategory = {
      posture: alerts.filter(a => a.category === 'posture').length,
      repetition: alerts.filter(a => a.category === 'repetition').length,
      force: alerts.filter(a => a.category === 'force').length,
      environment: alerts.filter(a => a.category === 'environment').length,
      fatigue: alerts.filter(a => a.category === 'fatigue').length,
      safety: alerts.filter(a => a.category === 'safety').length,
    };

    const pendingFollowUps = alerts.filter(a => a.followUpRequired && a.followUpDate && new Date(a.followUpDate) <= new Date());

    return {
      totalAlerts: alerts.length,
      activeAlerts: activeAlerts.length,
      severityDistribution: bySeverity,
      categoryDistribution: byCategory,
      pendingFollowUps: pendingFollowUps.length,
      recentAlerts: activeAlerts.slice(0, 10),
    };
  }

  async getEmployeeErgonomicHistory(employeeId: string): Promise<any> {
    const alerts = await this.findAll({ employeeId });

    return {
      employeeId,
      totalAlerts: alerts.length,
      resolvedAlerts: alerts.filter(a => a.status === 'resolved').length,
      alertsByCategory: alerts.reduce((acc, a) => {
        acc[a.category] = (acc[a.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentAlerts: alerts.slice(0, 5),
    };
  }
}
