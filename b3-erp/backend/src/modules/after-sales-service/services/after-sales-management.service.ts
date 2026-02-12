import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AfterSalesManagementService {
  constructor(private prisma: PrismaService) {}

  // ========================================
  // SERVICE TYPES
  // ========================================

  async getServiceTypes(companyId: string, filters?: any) {
    return this.prisma.serviceType.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { serviceTypeName: 'asc' },
    });
  }

  async getServiceType(companyId: string, id: string) {
    return this.prisma.serviceType.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createServiceType(companyId: string, data: any) {
    return this.prisma.serviceType.create({
      data: { ...data, companyId },
    });
  }

  async updateServiceType(companyId: string, id: string, data: any) {
    return this.prisma.serviceType.update({
      where: { id },
      data,
    });
  }

  // ========================================
  // WARRANTY TYPES
  // ========================================

  async getWarrantyTypes(companyId: string, filters?: any) {
    return this.prisma.warrantyType.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { warrantyTypeName: 'asc' },
    });
  }

  async getWarrantyType(companyId: string, id: string) {
    return this.prisma.warrantyType.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createWarrantyType(companyId: string, data: any) {
    return this.prisma.warrantyType.create({
      data: { ...data, companyId },
    });
  }

  async updateWarrantyType(companyId: string, id: string, data: any) {
    return this.prisma.warrantyType.update({
      where: { id },
      data,
    });
  }

  // ========================================
  // EQUIPMENT REGISTRY
  // ========================================

  async getEquipmentRegistry(companyId: string, filters?: any) {
    return this.prisma.equipmentRegistry.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { createdAt: 'desc' },
      include: {
        serviceRequests: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async getEquipment(companyId: string, id: string) {
    return this.prisma.equipmentRegistry.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        serviceRequests: true,
        warranties: true,
        serviceContracts: true,
      },
    });
  }

  async createEquipment(companyId: string, data: any) {
    return this.prisma.equipmentRegistry.create({
      data: { ...data, companyId },
    });
  }

  async updateEquipment(companyId: string, id: string, data: any) {
    return this.prisma.equipmentRegistry.update({
      where: { id },
      data,
    });
  }

  // ========================================
  // SERVICE REQUESTS
  // ========================================

  async getServiceRequests(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.customerId) where.customerId = filters.customerId;

    return this.prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        equipment: true,
        history: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async getServiceRequest(companyId: string, id: string) {
    return this.prisma.serviceRequest.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        equipment: true,
        history: { orderBy: { createdAt: 'desc' } },
        fieldJobs: true,
      },
    });
  }

  async createServiceRequest(companyId: string, data: any) {
    const request = await this.prisma.serviceRequest.create({
      data: { ...data, companyId },
    });

    // Create history entry
    await this.prisma.serviceRequestHistory.create({
      data: {
        serviceRequestId: request.id,
        action: 'created',
        newStatus: request.status,
        notes: 'Service request created',
        companyId,
      },
    });

    return request;
  }

  async updateServiceRequest(companyId: string, id: string, data: any) {
    const existing = await this.prisma.serviceRequest.findFirst({
      where: { id, companyId },
    });

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data,
    });

    // Create history entry if status changed
    if (existing && data.status && existing.status !== data.status) {
      await this.prisma.serviceRequestHistory.create({
        data: {
          serviceRequestId: id,
          action: 'status_changed',
          previousStatus: existing.status,
          newStatus: data.status,
          companyId,
        },
      });
    }

    return updated;
  }

  async getOpenServiceRequests(companyId: string) {
    return this.prisma.serviceRequest.findMany({
      where: {
        companyId,
        isActive: true,
        status: { in: ['open', 'acknowledged', 'scheduled', 'in_progress', 'pending_parts'] },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async getServiceRequestsByStatus(companyId: string, status: string) {
    return this.prisma.serviceRequest.findMany({
      where: { companyId, isActive: true, status },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ========================================
  // SLA CONFIGURATION
  // ========================================

  async getSLAConfigurations(companyId: string) {
    return this.prisma.sLAConfiguration.findMany({
      where: { companyId, isActive: true },
      orderBy: { slaName: 'asc' },
    });
  }

  async getSLAConfiguration(companyId: string, id: string) {
    return this.prisma.sLAConfiguration.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createSLAConfiguration(companyId: string, data: any) {
    return this.prisma.sLAConfiguration.create({
      data: { ...data, companyId },
    });
  }

  async updateSLAConfiguration(companyId: string, id: string, data: any) {
    return this.prisma.sLAConfiguration.update({
      where: { id },
      data,
    });
  }

  // ========================================
  // SERVICE CONTRACTS (AMC)
  // ========================================

  async getServiceContracts(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.customerId) where.customerId = filters.customerId;

    return this.prisma.serviceContract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        equipment: { include: { equipment: true } },
      },
    });
  }

  async getServiceContract(companyId: string, id: string) {
    return this.prisma.serviceContract.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        equipment: { include: { equipment: true } },
        renewals: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { invoiceDate: 'desc' } },
      },
    });
  }

  async createServiceContract(companyId: string, data: any) {
    const { equipment, ...contractData } = data;
    return this.prisma.serviceContract.create({
      data: {
        ...contractData,
        companyId,
        equipment: equipment
          ? {
              create: equipment.map((eq: any) => ({
                equipmentId: eq.equipmentId,
                serialNumber: eq.serialNumber,
                productName: eq.productName,
                companyId,
              })),
            }
          : undefined,
      },
      include: { equipment: true },
    });
  }

  async updateServiceContract(companyId: string, id: string, data: any) {
    return this.prisma.serviceContract.update({
      where: { id },
      data,
    });
  }

  async getActiveContracts(companyId: string) {
    return this.prisma.serviceContract.findMany({
      where: { companyId, isActive: true, status: 'active' },
      orderBy: { endDate: 'asc' },
    });
  }

  async getExpiringContracts(companyId: string, daysAhead: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.prisma.serviceContract.findMany({
      where: {
        companyId,
        isActive: true,
        status: 'active',
        endDate: { lte: futureDate },
      },
      orderBy: { endDate: 'asc' },
    });
  }

  // ========================================
  // CONTRACT RENEWALS
  // ========================================

  async getContractRenewals(companyId: string, contractId?: string) {
    const where: any = { companyId, isActive: true };
    if (contractId) where.contractId = contractId;

    return this.prisma.contractRenewal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { contract: true },
    });
  }

  async createContractRenewal(companyId: string, data: any) {
    return this.prisma.contractRenewal.create({
      data: { ...data, companyId },
    });
  }

  async updateContractRenewal(companyId: string, id: string, data: any) {
    return this.prisma.contractRenewal.update({
      where: { id },
      data,
    });
  }

  // ========================================
  // WARRANTIES
  // ========================================

  async getWarrantyRegistrations(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.customerId) where.customerId = filters.customerId;

    return this.prisma.warrantyRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { claims: { take: 5 } },
    });
  }

  async getWarrantyRegistration(companyId: string, id: string) {
    return this.prisma.warrantyRegistration.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        equipment: true,
        claims: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async createWarrantyRegistration(companyId: string, data: any) {
    return this.prisma.warrantyRegistration.create({
      data: { ...data, companyId },
    });
  }

  async updateWarrantyRegistration(companyId: string, id: string, data: any) {
    return this.prisma.warrantyRegistration.update({
      where: { id },
      data,
    });
  }

  async getActiveWarranties(companyId: string) {
    return this.prisma.warrantyRegistration.findMany({
      where: { companyId, isActive: true, status: 'active' },
      orderBy: { warrantyEndDate: 'asc' },
    });
  }

  async getExpiredWarranties(companyId: string) {
    return this.prisma.warrantyRegistration.findMany({
      where: {
        companyId,
        isActive: true,
        status: 'expired',
      },
      orderBy: { warrantyEndDate: 'desc' },
    });
  }

  // ========================================
  // WARRANTY CLAIMS
  // ========================================

  async getWarrantyClaims(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.warrantyId) where.warrantyId = filters.warrantyId;

    return this.prisma.warrantyClaim.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { warranty: true },
    });
  }

  async getWarrantyClaim(companyId: string, id: string) {
    return this.prisma.warrantyClaim.findFirst({
      where: { id, companyId, isActive: true },
      include: { warranty: true },
    });
  }

  async createWarrantyClaim(companyId: string, data: any) {
    const claim = await this.prisma.warrantyClaim.create({
      data: { ...data, companyId },
    });

    // Update claims used on warranty
    await this.prisma.warrantyRegistration.update({
      where: { id: data.warrantyId },
      data: { claimsUsed: { increment: 1 } },
    });

    return claim;
  }

  async updateWarrantyClaim(companyId: string, id: string, data: any) {
    return this.prisma.warrantyClaim.update({
      where: { id },
      data,
    });
  }

  async getPendingClaimApprovals(companyId: string) {
    return this.prisma.warrantyClaim.findMany({
      where: {
        companyId,
        isActive: true,
        status: { in: ['submitted', 'under_review'] },
      },
      orderBy: { createdAt: 'asc' },
      include: { warranty: true },
    });
  }

  // ========================================
  // INSTALLATIONS
  // ========================================

  async getInstallations(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;

    return this.prisma.installation.findMany({
      where,
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async getInstallation(companyId: string, id: string) {
    return this.prisma.installation.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createInstallation(companyId: string, data: any) {
    return this.prisma.installation.create({
      data: { ...data, companyId },
    });
  }

  async updateInstallation(companyId: string, id: string, data: any) {
    return this.prisma.installation.update({
      where: { id },
      data,
    });
  }

  async getPendingInstallations(companyId: string) {
    return this.prisma.installation.findMany({
      where: {
        companyId,
        isActive: true,
        status: { in: ['pending', 'scheduled'] },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async getCompletedInstallations(companyId: string) {
    return this.prisma.installation.findMany({
      where: {
        companyId,
        isActive: true,
        status: 'completed',
      },
      orderBy: { actualEndDate: 'desc' },
    });
  }

  // ========================================
  // FIELD SERVICE JOBS
  // ========================================

  async getFieldServiceJobs(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.technicianId) where.technicianId = filters.technicianId;
    if (filters?.scheduledDate) where.scheduledDate = filters.scheduledDate;

    return this.prisma.fieldServiceJob.findMany({
      where,
      orderBy: [{ scheduledDate: 'asc' }, { priority: 'desc' }],
      include: { serviceRequest: true },
    });
  }

  async getFieldServiceJob(companyId: string, id: string) {
    return this.prisma.fieldServiceJob.findFirst({
      where: { id, companyId, isActive: true },
      include: { serviceRequest: true },
    });
  }

  async createFieldServiceJob(companyId: string, data: any) {
    return this.prisma.fieldServiceJob.create({
      data: { ...data, companyId },
    });
  }

  async updateFieldServiceJob(companyId: string, id: string, data: any) {
    return this.prisma.fieldServiceJob.update({
      where: { id },
      data,
    });
  }

  async getDispatchBoard(companyId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const jobs = await this.prisma.fieldServiceJob.findMany({
      where: {
        companyId,
        isActive: true,
        scheduledDate: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: [{ priority: 'desc' }, { scheduledDate: 'asc' }],
    });

    const technicians = await this.prisma.technician.findMany({
      where: { companyId, isActive: true, isAvailable: true },
    });

    return {
      date,
      jobs,
      technicians,
      summary: {
        totalJobs: jobs.length,
        dispatched: jobs.filter((j) => j.status === 'dispatched').length,
        inProgress: jobs.filter((j) => j.status === 'in_progress').length,
        completed: jobs.filter((j) => j.status === 'completed').length,
      },
    };
  }

  // ========================================
  // TECHNICIANS
  // ========================================

  async getTechnicians(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.isAvailable !== undefined) where.isAvailable = filters.isAvailable;

    return this.prisma.technician.findMany({
      where,
      orderBy: { technicianName: 'asc' },
    });
  }

  async getTechnician(companyId: string, id: string) {
    return this.prisma.technician.findFirst({
      where: { id, companyId, isActive: true },
      include: { assignments: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
  }

  async createTechnician(companyId: string, data: any) {
    return this.prisma.technician.create({
      data: { ...data, companyId },
    });
  }

  async updateTechnician(companyId: string, id: string, data: any) {
    return this.prisma.technician.update({
      where: { id },
      data,
    });
  }

  async getAvailableTechnicians(companyId: string) {
    return this.prisma.technician.findMany({
      where: { companyId, isActive: true, isAvailable: true, status: 'active' },
      orderBy: { technicianName: 'asc' },
    });
  }

  // ========================================
  // FIELD SCHEDULES
  // ========================================

  async getFieldSchedules(companyId: string, startDate: Date, endDate: Date) {
    return this.prisma.fieldSchedule.findMany({
      where: {
        companyId,
        isActive: true,
        scheduleDate: { gte: startDate, lte: endDate },
      },
      orderBy: { scheduleDate: 'asc' },
      include: { assignments: { include: { technician: true } } },
    });
  }

  async createFieldSchedule(companyId: string, data: any) {
    return this.prisma.fieldSchedule.create({
      data: { ...data, companyId },
    });
  }

  async assignToSchedule(companyId: string, data: any) {
    return this.prisma.fieldScheduleAssignment.create({
      data: { ...data, companyId },
    });
  }

  // ========================================
  // SPARE PARTS
  // ========================================

  async getSpareParts(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.category) where.category = filters.category;
    if (filters?.isCritical !== undefined) where.isCritical = filters.isCritical;

    return this.prisma.serviceSparePart.findMany({
      where,
      orderBy: { partName: 'asc' },
    });
  }

  async getSparePart(companyId: string, id: string) {
    return this.prisma.serviceSparePart.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createSparePart(companyId: string, data: any) {
    return this.prisma.serviceSparePart.create({
      data: { ...data, companyId },
    });
  }

  async updateSparePart(companyId: string, id: string, data: any) {
    return this.prisma.serviceSparePart.update({
      where: { id },
      data,
    });
  }

  async getLowStockParts(companyId: string) {
    return this.prisma.$queryRaw`
      SELECT * FROM service_spare_parts
      WHERE company_id = ${companyId}
      AND is_active = true
      AND available_quantity <= reorder_level
    `;
  }

  // ========================================
  // PARTS REQUISITION
  // ========================================

  async getPartsRequisitions(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;

    return this.prisma.partsRequisition.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPartsRequisition(companyId: string, data: any) {
    return this.prisma.partsRequisition.create({
      data: { ...data, companyId },
    });
  }

  async updatePartsRequisition(companyId: string, id: string, data: any) {
    return this.prisma.partsRequisition.update({
      where: { id },
      data,
    });
  }

  // ========================================
  // PARTS CONSUMPTION
  // ========================================

  async getPartsConsumption(companyId: string, filters?: any) {
    return this.prisma.partsConsumption.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { consumptionDate: 'desc' },
    });
  }

  async createPartsConsumption(companyId: string, data: any) {
    const consumption = await this.prisma.partsConsumption.create({
      data: { ...data, companyId },
    });

    // Update stock quantity
    if (data.partId) {
      await this.prisma.serviceSparePart.update({
        where: { id: data.partId },
        data: {
          stockQuantity: { decrement: data.quantity },
          availableQuantity: { decrement: data.quantity },
        },
      });
    }

    return consumption;
  }

  // ========================================
  // PARTS RETURNS
  // ========================================

  async getPartsReturns(companyId: string, filters?: any) {
    return this.prisma.partsReturn.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { returnDate: 'desc' },
    });
  }

  async createPartsReturn(companyId: string, data: any) {
    return this.prisma.partsReturn.create({
      data: { ...data, companyId },
    });
  }

  async updatePartsReturn(companyId: string, id: string, data: any) {
    return this.prisma.partsReturn.update({
      where: { id },
      data,
    });
  }

  // ========================================
  // SERVICE BILLING
  // ========================================

  async getServiceInvoices(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.paymentStatus) where.paymentStatus = filters.paymentStatus;

    return this.prisma.serviceInvoice.findMany({
      where,
      orderBy: { invoiceDate: 'desc' },
      include: { payments: true },
    });
  }

  async getServiceInvoice(companyId: string, id: string) {
    return this.prisma.serviceInvoice.findFirst({
      where: { id, companyId, isActive: true },
      include: { contract: true, payments: true },
    });
  }

  async createServiceInvoice(companyId: string, data: any) {
    return this.prisma.serviceInvoice.create({
      data: { ...data, companyId },
    });
  }

  async updateServiceInvoice(companyId: string, id: string, data: any) {
    return this.prisma.serviceInvoice.update({
      where: { id },
      data,
    });
  }

  async getPendingInvoices(companyId: string) {
    return this.prisma.serviceInvoice.findMany({
      where: {
        companyId,
        isActive: true,
        paymentStatus: { in: ['pending', 'partial'] },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  // ========================================
  // SERVICE PAYMENTS
  // ========================================

  async getServicePayments(companyId: string, invoiceId?: string) {
    const where: any = { companyId, isActive: true };
    if (invoiceId) where.invoiceId = invoiceId;

    return this.prisma.servicePayment.findMany({
      where,
      orderBy: { paymentDate: 'desc' },
      include: { invoice: true },
    });
  }

  async createServicePayment(companyId: string, data: any) {
    const payment = await this.prisma.servicePayment.create({
      data: { ...data, companyId },
    });

    // Update invoice paid amount
    await this.prisma.serviceInvoice.update({
      where: { id: data.invoiceId },
      data: {
        amountPaid: { increment: data.amount },
        balanceDue: { decrement: data.amount },
      },
    });

    return payment;
  }

  // ========================================
  // KNOWLEDGE BASE
  // ========================================

  async getKnowledgeArticles(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;

    return this.prisma.knowledgeArticle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getKnowledgeArticle(companyId: string, id: string) {
    const article = await this.prisma.knowledgeArticle.findFirst({
      where: { id, companyId, isActive: true },
    });

    if (article) {
      await this.prisma.knowledgeArticle.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return article;
  }

  async createKnowledgeArticle(companyId: string, data: any) {
    return this.prisma.knowledgeArticle.create({
      data: { ...data, companyId },
    });
  }

  async updateKnowledgeArticle(companyId: string, id: string, data: any) {
    return this.prisma.knowledgeArticle.update({
      where: { id },
      data,
    });
  }

  async searchKnowledgeArticles(companyId: string, searchTerm: string) {
    return this.prisma.knowledgeArticle.findMany({
      where: {
        companyId,
        isActive: true,
        status: 'published',
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
          { tags: { has: searchTerm } },
          { keywords: { has: searchTerm } },
        ],
      },
      orderBy: { viewCount: 'desc' },
    });
  }

  // ========================================
  // TROUBLESHOOTING GUIDES
  // ========================================

  async getTroubleshootingGuides(companyId: string, filters?: any) {
    return this.prisma.troubleshootingGuide.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { title: 'asc' },
    });
  }

  async getTroubleshootingGuide(companyId: string, id: string) {
    const guide = await this.prisma.troubleshootingGuide.findFirst({
      where: { id, companyId, isActive: true },
    });

    if (guide) {
      await this.prisma.troubleshootingGuide.update({
        where: { id },
        data: { usageCount: { increment: 1 } },
      });
    }

    return guide;
  }

  async createTroubleshootingGuide(companyId: string, data: any) {
    return this.prisma.troubleshootingGuide.create({
      data: { ...data, companyId },
    });
  }

  // ========================================
  // PRODUCT MANUALS
  // ========================================

  async getProductManuals(companyId: string, filters?: any) {
    return this.prisma.productManual.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { title: 'asc' },
    });
  }

  async getProductManual(companyId: string, id: string) {
    return this.prisma.productManual.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createProductManual(companyId: string, data: any) {
    return this.prisma.productManual.create({
      data: { ...data, companyId },
    });
  }

  // ========================================
  // FAQs
  // ========================================

  async getFAQs(companyId: string, filters?: any) {
    return this.prisma.serviceFAQ.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: [{ displayOrder: 'asc' }, { question: 'asc' }],
    });
  }

  async getFAQ(companyId: string, id: string) {
    const faq = await this.prisma.serviceFAQ.findFirst({
      where: { id, companyId, isActive: true },
    });

    if (faq) {
      await this.prisma.serviceFAQ.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return faq;
  }

  async createFAQ(companyId: string, data: any) {
    return this.prisma.serviceFAQ.create({
      data: { ...data, companyId },
    });
  }

  // ========================================
  // CUSTOMER FEEDBACK
  // ========================================

  async getFeedbackSurveys(companyId: string, filters?: any) {
    return this.prisma.feedbackSurvey.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFeedbackSurvey(companyId: string, id: string) {
    return this.prisma.feedbackSurvey.findFirst({
      where: { id, companyId, isActive: true },
      include: { responses: { take: 100 } },
    });
  }

  async createFeedbackSurvey(companyId: string, data: any) {
    return this.prisma.feedbackSurvey.create({
      data: { ...data, companyId },
    });
  }

  async submitSurveyResponse(companyId: string, data: any) {
    const response = await this.prisma.surveyResponse.create({
      data: { ...data, companyId },
    });

    // Update survey response count
    await this.prisma.feedbackSurvey.update({
      where: { id: data.surveyId },
      data: { totalResponses: { increment: 1 } },
    });

    return response;
  }

  // ========================================
  // SERVICE RATINGS
  // ========================================

  async getServiceRatings(companyId: string, filters?: any) {
    return this.prisma.serviceRating.findMany({
      where: { companyId, isActive: true, ...filters },
      orderBy: { ratingDate: 'desc' },
    });
  }

  async createServiceRating(companyId: string, data: any) {
    const rating = await this.prisma.serviceRating.create({
      data: {
        ...data,
        npsCategory:
          data.npsScore >= 9 ? 'promoter' : data.npsScore >= 7 ? 'passive' : 'detractor',
        companyId,
      },
    });

    // Update technician rating if applicable
    if (data.technicianId) {
      const techRatings = await this.prisma.serviceRating.aggregate({
        where: { companyId, technicianId: data.technicianId, isActive: true },
        _avg: { overallRating: true },
        _count: true,
      });

      await this.prisma.technician.update({
        where: { id: data.technicianId },
        data: {
          averageRating: techRatings._avg.overallRating || data.overallRating,
          totalJobsCompleted: { increment: 1 },
        },
      });
    }

    return rating;
  }

  // ========================================
  // CUSTOMER COMPLAINTS
  // ========================================

  async getComplaints(companyId: string, filters?: any) {
    const where: any = { companyId, isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;

    return this.prisma.customerComplaint.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async getComplaint(companyId: string, id: string) {
    return this.prisma.customerComplaint.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createComplaint(companyId: string, data: any) {
    return this.prisma.customerComplaint.create({
      data: { ...data, companyId },
    });
  }

  async updateComplaint(companyId: string, id: string, data: any) {
    return this.prisma.customerComplaint.update({
      where: { id },
      data,
    });
  }

  async getOpenComplaints(companyId: string) {
    return this.prisma.customerComplaint.findMany({
      where: {
        companyId,
        isActive: true,
        status: { in: ['open', 'investigating', 'pending_action', 'escalated'] },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    });
  }

  // ========================================
  // SETTINGS
  // ========================================

  async getSettings(companyId: string) {
    let settings = await this.prisma.afterSalesSettings.findUnique({
      where: { companyId },
    });

    if (!settings) {
      settings = await this.prisma.afterSalesSettings.create({
        data: { companyId },
      });
    }

    return settings;
  }

  async updateSettings(companyId: string, data: any) {
    return this.prisma.afterSalesSettings.upsert({
      where: { companyId },
      update: data,
      create: { ...data, companyId },
    });
  }

  // ========================================
  // DASHBOARD & ANALYTICS
  // ========================================

  async getDashboardStats(companyId: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalRequests,
      openRequests,
      inProgressRequests,
      resolvedThisMonth,
      activeContracts,
      expiringContracts,
      activeWarranties,
      pendingClaims,
      openComplaints,
      availableTechnicians,
    ] = await Promise.all([
      this.prisma.serviceRequest.count({ where: { companyId, isActive: true } }),
      this.prisma.serviceRequest.count({
        where: { companyId, isActive: true, status: 'open' },
      }),
      this.prisma.serviceRequest.count({
        where: { companyId, isActive: true, status: 'in_progress' },
      }),
      this.prisma.serviceRequest.count({
        where: {
          companyId,
          isActive: true,
          status: 'resolved',
          completedAt: { gte: startOfMonth },
        },
      }),
      this.prisma.serviceContract.count({
        where: { companyId, isActive: true, status: 'active' },
      }),
      this.prisma.serviceContract.count({
        where: {
          companyId,
          isActive: true,
          status: 'active',
          endDate: { lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      this.prisma.warrantyRegistration.count({
        where: { companyId, isActive: true, status: 'active' },
      }),
      this.prisma.warrantyClaim.count({
        where: { companyId, isActive: true, status: { in: ['submitted', 'under_review'] } },
      }),
      this.prisma.customerComplaint.count({
        where: { companyId, isActive: true, status: { in: ['open', 'investigating'] } },
      }),
      this.prisma.technician.count({
        where: { companyId, isActive: true, isAvailable: true },
      }),
    ]);

    return {
      serviceRequests: {
        total: totalRequests,
        open: openRequests,
        inProgress: inProgressRequests,
        resolvedThisMonth,
      },
      contracts: {
        active: activeContracts,
        expiringSoon: expiringContracts,
      },
      warranties: {
        active: activeWarranties,
        pendingClaims,
      },
      complaints: {
        open: openComplaints,
      },
      technicians: {
        available: availableTechnicians,
      },
    };
  }

  async getSLAPerformanceReport(companyId: string, startDate: Date, endDate: Date) {
    const requests = await this.prisma.serviceRequest.findMany({
      where: {
        companyId,
        isActive: true,
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        slaBreached: true,
        priority: true,
        status: true,
        createdAt: true,
        completedAt: true,
      },
    });

    const total = requests.length;
    const breached = requests.filter((r) => r.slaBreached).length;
    const compliant = total - breached;
    const complianceRate = total > 0 ? ((compliant / total) * 100).toFixed(2) : 0;

    return {
      period: { startDate, endDate },
      total,
      compliant,
      breached,
      complianceRate,
      byPriority: this.groupByField(requests, 'priority'),
    };
  }

  async getTechnicianPerformanceReport(companyId: string, startDate: Date, endDate: Date) {
    const jobs = await this.prisma.fieldServiceJob.findMany({
      where: {
        companyId,
        isActive: true,
        scheduledDate: { gte: startDate, lte: endDate },
      },
      select: {
        technicianId: true,
        technicianName: true,
        status: true,
        customerRating: true,
        laborHours: true,
      },
    });

    const byTechnician = this.groupByTechnician(jobs);

    return {
      period: { startDate, endDate },
      totalJobs: jobs.length,
      byTechnician,
    };
  }

  async getFirstTimeFixRateReport(companyId: string, startDate: Date, endDate: Date) {
    const completedJobs = await this.prisma.fieldServiceJob.findMany({
      where: {
        companyId,
        isActive: true,
        status: 'completed',
        actualEndTime: { gte: startDate, lte: endDate },
      },
      select: {
        technicianId: true,
        technicianName: true,
        serviceRequestId: true,
      },
    });

    // Group by service request to identify revisits
    const requestJobs = new Map<string, number>();
    completedJobs.forEach((job) => {
      if (job.serviceRequestId) {
        requestJobs.set(job.serviceRequestId, (requestJobs.get(job.serviceRequestId) || 0) + 1);
      }
    });

    const totalRequests = requestJobs.size;
    const firstTimeFixes = Array.from(requestJobs.values()).filter((count) => count === 1).length;
    const ftfRate = totalRequests > 0 ? ((firstTimeFixes / totalRequests) * 100).toFixed(2) : 0;

    return {
      period: { startDate, endDate },
      totalRequests,
      firstTimeFixes,
      revisits: totalRequests - firstTimeFixes,
      ftfRate,
    };
  }

  async getNPSReport(companyId: string, startDate: Date, endDate: Date) {
    const ratings = await this.prisma.serviceRating.findMany({
      where: {
        companyId,
        isActive: true,
        ratingDate: { gte: startDate, lte: endDate },
        npsScore: { not: null },
      },
      select: {
        npsScore: true,
        npsCategory: true,
      },
    });

    const total = ratings.length;
    const promoters = ratings.filter((r) => r.npsCategory === 'promoter').length;
    const detractors = ratings.filter((r) => r.npsCategory === 'detractor').length;
    const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

    return {
      period: { startDate, endDate },
      totalResponses: total,
      promoters,
      passives: ratings.filter((r) => r.npsCategory === 'passive').length,
      detractors,
      npsScore,
    };
  }

  // Helper functions
  private groupByField(items: any[], field: string) {
    return items.reduce(
      (acc, item) => {
        const key = item[field] || 'Unknown';
        if (!acc[key]) acc[key] = 0;
        acc[key]++;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private groupByTechnician(jobs: any[]) {
    const result = new Map<string, any>();

    jobs.forEach((job) => {
      const key = job.technicianId || 'Unassigned';
      if (!result.has(key)) {
        result.set(key, {
          technicianId: job.technicianId,
          technicianName: job.technicianName || 'Unassigned',
          totalJobs: 0,
          completed: 0,
          totalRating: 0,
          ratingCount: 0,
        });
      }
      const tech = result.get(key);
      tech.totalJobs++;
      if (job.status === 'completed') tech.completed++;
      if (job.customerRating) {
        tech.totalRating += job.customerRating;
        tech.ratingCount++;
      }
    });

    return Array.from(result.values()).map((tech) => ({
      ...tech,
      avgRating: tech.ratingCount > 0 ? (tech.totalRating / tech.ratingCount).toFixed(2) : null,
      completionRate:
        tech.totalJobs > 0 ? ((tech.completed / tech.totalJobs) * 100).toFixed(2) : 0,
    }));
  }
}
