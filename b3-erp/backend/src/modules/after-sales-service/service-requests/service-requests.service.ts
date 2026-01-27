import { Injectable } from '@nestjs/common';
import { CreateServiceRequestDto } from '../dto/create-service-request.dto';
import { UpdateServiceRequestDto } from '../dto/update-service-request.dto';
import {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestPriority,
} from '../entities/service-request.entity';

@Injectable()
export class ServiceRequestsService {
  private requests: ServiceRequest[] = [];
  private idCounter = 1;

  // SLA times in hours based on priority
  private readonly SLA_RESPONSE_TIMES = {
    [ServiceRequestPriority.P1_CRITICAL]: 2,
    [ServiceRequestPriority.P2_HIGH]: 4,
    [ServiceRequestPriority.P3_MEDIUM]: 8,
    [ServiceRequestPriority.P4_LOW]: 24,
  };

  private readonly SLA_RESOLUTION_TIMES = {
    [ServiceRequestPriority.P1_CRITICAL]: 6,
    [ServiceRequestPriority.P2_HIGH]: 24,
    [ServiceRequestPriority.P3_MEDIUM]: 48,
    [ServiceRequestPriority.P4_LOW]: 72,
  };

  create(createServiceRequestDto: CreateServiceRequestDto): ServiceRequest {
    const now = new Date();
    const priority =
      (createServiceRequestDto.priority as ServiceRequestPriority) || ServiceRequestPriority.P3_MEDIUM;

    // Calculate SLA deadlines
    const responseDeadline = new Date(now);
    responseDeadline.setHours(
      responseDeadline.getHours() + this.SLA_RESPONSE_TIMES[priority],
    );

    const resolutionDeadline = new Date(now);
    resolutionDeadline.setHours(
      resolutionDeadline.getHours() + this.SLA_RESOLUTION_TIMES[priority],
    );

    const request: ServiceRequest = {
      ...createServiceRequestDto,
      id: `SR-${String(this.idCounter++).padStart(6, '0')}`,
      requestNumber: `SR-${new Date().getFullYear()}-${String(this.idCounter).padStart(6, '0')}`,
      status: ServiceRequestStatus.OPEN,
      priority,
      responseDeadline,
      resolutionDeadline,
      slaStatus: 'on_track',
      escalationLevel: 0,
      isOverdue: false,
      createdAt: now,
      updatedAt: now,
      responseTimeSLA: this.SLA_RESPONSE_TIMES[priority],
      resolutionTimeSLA: this.SLA_RESOLUTION_TIMES[priority],
      slaBreached: false,
      assignmentMethod: 'manual',
      escalated: false,
      customerConfirmed: false,
      billable: false,
      underWarranty: false,
      underContract: false,
      subject: createServiceRequestDto.description || 'Service Request',
      description: createServiceRequestDto.description || '',
      channel: createServiceRequestDto.channel as any || 'web_portal', // Cast or default
      serviceType: createServiceRequestDto.serviceType as any || 'repair', // Cast or default
      customerId: createServiceRequestDto.customerId || 'unknown',
      customerName: 'Unknown', // Should fetch customer
      contactPerson: 'Unknown',
      contactPhone: 'Unknown',
      serviceAddress: 'Unknown',
      requestedDate: now,
    };

    this.requests.push(request);
    this.checkAndUpdateSLAStatus(request);
    return request;
  }

  findAll(filters?: {
    status?: string;
    priority?: string;
    customerId?: string;
    assignedTo?: string;
  }): ServiceRequest[] {
    let filtered = [...this.requests];

    if (filters?.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter((r) => r.priority === filters.priority);
    }
    if (filters?.customerId) {
      filtered = filtered.filter((r) => r.customerId === filters.customerId);
    }
    if (filters?.assignedTo) {
      filtered = filtered.filter((r) => r.assignedTo === filters.assignedTo);
    }

    // Update SLA status for all filtered requests
    filtered.forEach((r) => this.checkAndUpdateSLAStatus(r));

    return filtered;
  }

  findOne(id: string): ServiceRequest | null {
    const request = this.requests.find((r) => r.id === id) || null;
    if (request) {
      this.checkAndUpdateSLAStatus(request);
    }
    return request;
  }

  update(
    id: string,
    updateServiceRequestDto: UpdateServiceRequestDto,
  ): ServiceRequest | null {
    const index = this.requests.findIndex((r) => r.id === id);
    if (index === -1) return null;

    this.requests[index] = {
      ...this.requests[index],
      ...updateServiceRequestDto,
      priority: (updateServiceRequestDto.priority as ServiceRequestPriority) || this.requests[index].priority,
      updatedAt: new Date(),
    };

    this.checkAndUpdateSLAStatus(this.requests[index]);
    return this.requests[index];
  }

  assignRequest(
    id: string,
    assignedTo: string,
    assignedToName: string,
    assignedBy: string,
  ): ServiceRequest | null {
    const request = this.findOne(id);
    if (!request) return null;

    request.assignedTo = assignedTo;
    request.assignedToName = assignedToName;
    request.assignmentDate = new Date();
    request.updatedBy = assignedBy;
    request.updatedAt = new Date();

    this.checkAndUpdateSLAStatus(request);
    return request;
  }

  acknowledgeRequest(
    id: string,
    acknowledgedBy: string,
  ): ServiceRequest | null {
    const request = this.findOne(id);
    if (!request) return null;

    const now = new Date();
    request.status = ServiceRequestStatus.ACKNOWLEDGED;
    request.acknowledgedDate = now;
    request.updatedBy = acknowledgedBy;
    request.updatedAt = now;

    // Calculate response time
    const responseTime =
      (now.getTime() - request.createdAt.getTime()) / (1000 * 60 * 60); // in hours
    request.responseTime = responseTime;

    // Check if response SLA was met
    if (now <= request.responseDeadline) {
      request.slaStatus = 'on_track';
    } else {
      request.slaStatus = 'breached';
    }

    this.checkAndUpdateSLAStatus(request);
    return request;
  }

  startWork(id: string, startedBy: string): ServiceRequest | null {
    const request = this.findOne(id);
    if (!request) return null;

    request.status = ServiceRequestStatus.IN_PROGRESS;
    request.workStartDate = new Date();
    request.updatedBy = startedBy;
    request.updatedAt = new Date();

    this.checkAndUpdateSLAStatus(request);
    return request;
  }

  resolveRequest(
    id: string,
    resolution: string,
    resolvedBy: string,
    rootCause?: string,
    partsUsed?: string[],
  ): ServiceRequest | null {
    const request = this.findOne(id);
    if (!request) return null;

    const now = new Date();
    request.status = ServiceRequestStatus.RESOLVED;
    request.resolutionDate = now;
    request.resolution = resolution;
    request.rootCause = rootCause;
    request.partsUsed = partsUsed;
    request.updatedBy = resolvedBy;
    request.updatedAt = now;

    // Calculate resolution time
    const resolutionTime =
      (now.getTime() - request.createdAt.getTime()) / (1000 * 60 * 60); // in hours
    request.resolutionTime = resolutionTime;

    // Check if resolution SLA was met
    if (now <= request.resolutionDeadline) {
      if (request.slaStatus !== 'breached') {
        request.slaStatus = 'met';
      }
    } else {
      request.slaStatus = 'breached';
    }

    this.checkAndUpdateSLAStatus(request);
    return request;
  }

  closeRequest(
    id: string,
    closedBy: string,
    closureNotes?: string,
  ): ServiceRequest | null {
    const request = this.findOne(id);
    if (!request) return null;

    request.status = ServiceRequestStatus.CLOSED;
    request.closureDate = new Date();
    request.closureNotes = closureNotes;
    request.updatedBy = closedBy;
    request.updatedAt = new Date();

    return request;
  }

  escalateRequest(
    id: string,
    escalationLevel: number,
    escalationReason: string,
    escalatedBy: string,
    escalatedTo?: string,
  ): ServiceRequest | null {
    const request = this.findOne(id);
    if (!request) return null;

    request.escalationLevel = escalationLevel;
    request.escalationDate = new Date();
    request.escalationReason = escalationReason;
    request.escalatedTo = escalatedTo ? [escalatedTo] : [];
    request.updatedBy = escalatedBy;
    request.updatedAt = new Date();

    return request;
  }

  cancelRequest(
    id: string,
    cancellationReason: string,
    cancelledBy: string,
  ): ServiceRequest | null {
    const request = this.findOne(id);
    if (!request) return null;

    request.status = ServiceRequestStatus.CANCELLED;
    request.cancellationDate = new Date();
    request.cancellationReason = cancellationReason;
    request.updatedBy = cancelledBy;
    request.updatedAt = new Date();

    return request;
  }

  getOverdueRequests(): ServiceRequest[] {
    const now = new Date();
    return this.requests.filter((request) => {
      const isOpen = [
        ServiceRequestStatus.OPEN,
        ServiceRequestStatus.ACKNOWLEDGED,
        ServiceRequestStatus.IN_PROGRESS,
      ].includes(request.status);

      const isPastDeadline = request.resolutionDeadline < now;

      return isOpen && isPastDeadline;
    });
  }

  private checkAndUpdateSLAStatus(request: ServiceRequest): void {
    const now = new Date();

    // Check if request is overdue
    if (
      [
        ServiceRequestStatus.OPEN,
        ServiceRequestStatus.ACKNOWLEDGED,
        ServiceRequestStatus.IN_PROGRESS,
      ].includes(request.status)
    ) {
      if (now > request.resolutionDeadline) {
        request.isOverdue = true;
        request.slaStatus = 'breached';
      } else if (now > request.responseDeadline && !request.acknowledgedDate) {
        request.slaStatus = 'at_risk';
      }
    }
  }

  getSLADashboard() {
    const allRequests = this.requests;
    const openRequests = allRequests.filter(
      (r) => r.status === ServiceRequestStatus.OPEN,
    );
    const overdueRequests = this.getOverdueRequests();

    const totalClosed = allRequests.filter(
      (r) => r.status === ServiceRequestStatus.CLOSED,
    ).length;
    const slaMetCount = allRequests.filter((r) => r.slaStatus === 'met').length;

    return {
      totalRequests: allRequests.length,
      openRequests: openRequests.length,
      overdueRequests: overdueRequests.length,
      slaComplianceRate: totalClosed > 0 ? (slaMetCount / totalClosed) * 100 : 0,
      averageResponseTime:
        this.calculateAverageTime('responseTime', allRequests),
      averageResolutionTime: this.calculateAverageTime(
        'resolutionTime',
        allRequests,
      ),
      byPriority: this.getRequestsByPriority(),
      byStatus: this.getRequestsByStatus(),
    };
  }

  private calculateAverageTime(
    field: 'responseTime' | 'resolutionTime',
    requests: ServiceRequest[],
  ): number {
    const validRequests = requests.filter((r) => r[field] !== undefined);
    if (validRequests.length === 0) return 0;

    const total = validRequests.reduce((sum, r) => sum + (r[field] || 0), 0);
    return total / validRequests.length;
  }

  private getRequestsByPriority() {
    return {
      p1_critical: this.requests.filter(
        (r) => r.priority === ServiceRequestPriority.P1_CRITICAL,
      ).length,
      p2_high: this.requests.filter(
        (r) => r.priority === ServiceRequestPriority.P2_HIGH,
      ).length,
      p3_medium: this.requests.filter(
        (r) => r.priority === ServiceRequestPriority.P3_MEDIUM,
      ).length,
      p4_low: this.requests.filter(
        (r) => r.priority === ServiceRequestPriority.P4_LOW,
      ).length,
    };
  }

  private getRequestsByStatus() {
    return {
      open: this.requests.filter(
        (r) => r.status === ServiceRequestStatus.OPEN,
      ).length,
      acknowledged: this.requests.filter(
        (r) => r.status === ServiceRequestStatus.ACKNOWLEDGED,
      ).length,
      in_progress: this.requests.filter(
        (r) => r.status === ServiceRequestStatus.IN_PROGRESS,
      ).length,
      resolved: this.requests.filter(
        (r) => r.status === ServiceRequestStatus.RESOLVED,
      ).length,
      closed: this.requests.filter(
        (r) => r.status === ServiceRequestStatus.CLOSED,
      ).length,
      cancelled: this.requests.filter(
        (r) => r.status === ServiceRequestStatus.CANCELLED,
      ).length,
    };
  }

  getStatistics() {
    return this.getSLADashboard();
  }

  remove(id: string): { message: string } {
    const index = this.requests.findIndex((r) => r.id === id);
    if (index === -1) {
      return { message: 'Service request not found' };
    }

    this.requests.splice(index, 1);
    return { message: 'Service request deleted successfully' };
  }
  async checkSpareAvailability(partId: string, siteId: string): Promise<{
    available: boolean;
    source: 'site' | 'factory' | 'oem' | 'none';
    quantity: number;
    leadTime: number; // in hours
  }> {
    // 1. Check Site Inventory
    // Mock: 30% chance available at site
    if (Math.random() > 0.7) {
      return { available: true, source: 'site', quantity: 5, leadTime: 0 };
    }

    // 2. Check Factory Store
    // Mock: 50% chance available at factory
    if (Math.random() > 0.5) {
      return { available: true, source: 'factory', quantity: 20, leadTime: 24 }; // 24h shipping
    }

    // 3. Check OEM Procurement (or assume available to order)
    return { available: true, source: 'oem', quantity: 100, leadTime: 168 }; // 7 days
  }
}
