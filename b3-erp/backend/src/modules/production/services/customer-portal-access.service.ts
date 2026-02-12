import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerPortalAccess, PortalAccessLevel, ApprovalStatus } from '../entities/customer-portal-access.entity';

@Injectable()
export class CustomerPortalAccessService {
  constructor(
    @InjectRepository(CustomerPortalAccess)
    private readonly customerPortalAccessRepository: Repository<CustomerPortalAccess>,
  ) {}

  async create(createDto: Partial<CustomerPortalAccess>): Promise<CustomerPortalAccess> {
    const record = this.customerPortalAccessRepository.create(createDto);
    return this.customerPortalAccessRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    customerId?: string;
    orderId?: string;
    projectId?: string;
    accessLevel?: PortalAccessLevel;
    isActive?: boolean;
  }): Promise<CustomerPortalAccess[]> {
    const query = this.customerPortalAccessRepository.createQueryBuilder('portal');

    if (filters?.companyId) {
      query.andWhere('portal.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.customerId) {
      query.andWhere('portal.customerId = :customerId', { customerId: filters.customerId });
    }
    if (filters?.orderId) {
      query.andWhere('portal.orderId = :orderId', { orderId: filters.orderId });
    }
    if (filters?.projectId) {
      query.andWhere('portal.projectId = :projectId', { projectId: filters.projectId });
    }
    if (filters?.accessLevel) {
      query.andWhere('portal.accessLevel = :accessLevel', { accessLevel: filters.accessLevel });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('portal.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('portal.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<CustomerPortalAccess> {
    const record = await this.customerPortalAccessRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Customer Portal Access with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<CustomerPortalAccess>): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.customerPortalAccessRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.customerPortalAccessRepository.remove(record);
  }

  async logAccess(id: string, action: string, ipAddress: string, userAgent: string): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    if (!record.accessLog) {
      record.accessLog = [];
    }
    record.accessLog.push({
      accessedAt: new Date(),
      action,
      ipAddress,
      userAgent,
    });
    record.lastAccessedAt = new Date();
    return this.customerPortalAccessRepository.save(record);
  }

  async addDocument(id: string, document: any): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    if (!record.sharedDocuments) {
      record.sharedDocuments = [];
    }
    record.sharedDocuments.push({
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date(),
      approvalStatus: document.requiresApproval ? 'pending' : 'approved',
    });
    return this.customerPortalAccessRepository.save(record);
  }

  async updateDocumentApproval(id: string, documentId: string, status: ApprovalStatus, approvedBy?: string, comments?: string): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    if (record.sharedDocuments) {
      const doc = record.sharedDocuments.find(d => d.id === documentId);
      if (doc) {
        doc.approvalStatus = status;
        doc.approvedBy = approvedBy || '';
        doc.approvedAt = new Date();
        doc.comments = comments || '';
      }
    }
    return this.customerPortalAccessRepository.save(record);
  }

  async addApprovalRequest(id: string, request: any): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    if (!record.pendingApprovals) {
      record.pendingApprovals = [];
    }
    record.pendingApprovals.push({
      ...request,
      id: `approval-${Date.now()}`,
      requestedAt: new Date(),
      status: 'pending',
    });
    return this.customerPortalAccessRepository.save(record);
  }

  async respondToApproval(id: string, approvalId: string, status: ApprovalStatus): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    if (record.pendingApprovals) {
      const approval = record.pendingApprovals.find(a => a.id === approvalId);
      if (approval) {
        approval.status = status;
      }
    }
    return this.customerPortalAccessRepository.save(record);
  }

  async addUpdate(id: string, update: any): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    if (!record.updates) {
      record.updates = [];
    }
    record.updates.push({
      ...update,
      id: `update-${Date.now()}`,
      date: new Date(),
      isRead: false,
    });
    return this.customerPortalAccessRepository.save(record);
  }

  async markUpdateAsRead(id: string, updateId: string): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    if (record.updates) {
      const update = record.updates.find(u => u.id === updateId);
      if (update) {
        update.isRead = true;
        update.readAt = new Date();
      }
    }
    return this.customerPortalAccessRepository.save(record);
  }

  async updateMilestone(id: string, milestoneId: string, updates: any): Promise<CustomerPortalAccess> {
    const record = await this.findOne(id);
    if (record.milestones) {
      const milestone = record.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        Object.assign(milestone, updates);
      }
    }
    return this.customerPortalAccessRepository.save(record);
  }

  async getPendingApprovals(companyId: string): Promise<any[]> {
    const portals = await this.findAll({ companyId, isActive: true });

    const pending: any[] = [];
    portals.forEach(p => {
      (p.pendingApprovals || [])
        .filter(a => a.status === 'pending')
        .forEach(a => {
          pending.push({
            portalId: p.id,
            customerId: p.customerId,
            customerName: p.customerName,
            orderId: p.orderId,
            orderNumber: p.orderNumber,
            ...a,
          });
        });
    });

    return pending.sort((a, b) =>
      new Date(a.dueDate || a.requestedAt).getTime() - new Date(b.dueDate || b.requestedAt).getTime()
    );
  }

  async getPortalSummary(companyId: string): Promise<any> {
    const portals = await this.findAll({ companyId, isActive: true });

    const activeOrders = portals.filter(p => p.orderId).length;
    const pendingApprovals = portals.reduce((sum, p) =>
      sum + (p.pendingApprovals?.filter(a => a.status === 'pending').length || 0), 0
    );
    const documentsShared = portals.reduce((sum, p) =>
      sum + (p.sharedDocuments?.length || 0), 0
    );

    const byPhase: Record<string, number> = {};
    portals.forEach(p => {
      if (p.currentPhase) {
        byPhase[p.currentPhase] = (byPhase[p.currentPhase] || 0) + 1;
      }
    });

    return {
      totalPortals: portals.length,
      activeOrders,
      pendingApprovals,
      documentsShared,
      byPhase,
      avgProgress: portals.length > 0
        ? portals.reduce((sum, p) => sum + Number(p.overallProgress), 0) / portals.length
        : 0,
    };
  }
}
