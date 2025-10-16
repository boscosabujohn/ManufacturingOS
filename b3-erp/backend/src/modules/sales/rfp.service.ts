import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRFPDto } from './dto/create-rfp.dto';
import { UpdateRFPDto } from './dto/update-rfp.dto';
import { RFP, RFPStatus } from './entities/rfp.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RFPService {
  private rfps: Map<string, RFP> = new Map();

  constructor() {
    this.seedMockData();
  }

  create(createRFPDto: CreateRFPDto): RFP {
    const rfpNumber = this.generateRFPNumber();
    const now = new Date().toISOString();

    const rfp: RFP = {
      id: uuidv4(),
      rfpNumber,
      ...createRFPDto,
      status: createRFPDto.status || RFPStatus.DRAFT,
      currency: createRFPDto.currency || 'USD',
      items: createRFPDto.items.map((item) => ({
        ...item,
        id: uuidv4(),
      })),
      requirements: createRFPDto.requirements?.map((req) => ({
        ...req,
        id: uuidv4(),
      })) || [],
      timeline: createRFPDto.timeline || [],
      attachments: [],
      createdAt: now,
      updatedAt: now,
      updatedBy: createRFPDto.createdBy,
    };

    this.rfps.set(rfp.id, rfp);
    return rfp;
  }

  findAll(filters?: {
    status?: RFPStatus;
    priority?: string;
    type?: string;
    customerId?: string;
    assignedTo?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
  }): RFP[] {
    let rfps = Array.from(this.rfps.values());

    if (filters) {
      if (filters.status) {
        rfps = rfps.filter((rfp) => rfp.status === filters.status);
      }
      if (filters.priority) {
        rfps = rfps.filter((rfp) => rfp.priority === filters.priority);
      }
      if (filters.type) {
        rfps = rfps.filter((rfp) => rfp.type === filters.type);
      }
      if (filters.customerId) {
        rfps = rfps.filter((rfp) => rfp.customerId === filters.customerId);
      }
      if (filters.assignedTo) {
        rfps = rfps.filter((rfp) => rfp.assignedTo === filters.assignedTo);
      }
      if (filters.fromDate) {
        rfps = rfps.filter(
          (rfp) => new Date(rfp.issueDate) >= new Date(filters.fromDate),
        );
      }
      if (filters.toDate) {
        rfps = rfps.filter(
          (rfp) => new Date(rfp.issueDate) <= new Date(filters.toDate),
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        rfps = rfps.filter(
          (rfp) =>
            rfp.title.toLowerCase().includes(searchLower) ||
            rfp.description.toLowerCase().includes(searchLower) ||
            rfp.rfpNumber.toLowerCase().includes(searchLower) ||
            rfp.customerName.toLowerCase().includes(searchLower),
        );
      }
    }

    return rfps.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  findOne(id: string): RFP {
    const rfp = this.rfps.get(id);
    if (!rfp) {
      throw new NotFoundException(`RFP with ID ${id} not found`);
    }
    return rfp;
  }

  findByNumber(rfpNumber: string): RFP | undefined {
    return Array.from(this.rfps.values()).find(
      (rfp) => rfp.rfpNumber === rfpNumber,
    );
  }

  update(id: string, updateRFPDto: UpdateRFPDto): RFP {
    const rfp = this.findOne(id);

    const updatedRFP: RFP = {
      ...rfp,
      ...updateRFPDto,
      id: rfp.id,
      rfpNumber: rfp.rfpNumber,
      createdAt: rfp.createdAt,
      createdBy: rfp.createdBy,
      updatedAt: new Date().toISOString(),
      items: updateRFPDto.items
        ? updateRFPDto.items.map((item: any) => ({
            ...item,
            id: item.id || uuidv4(),
          }))
        : rfp.items,
      requirements: updateRFPDto.requirements
        ? updateRFPDto.requirements.map((req: any) => ({
            ...req,
            id: req.id || uuidv4(),
          }))
        : rfp.requirements,
    };

    this.rfps.set(id, updatedRFP);
    return updatedRFP;
  }

  remove(id: string): void {
    const rfp = this.findOne(id);
    this.rfps.delete(id);
  }

  updateStatus(
    id: string,
    status: RFPStatus,
    updatedBy: string,
    comments?: string,
  ): RFP {
    const rfp = this.findOne(id);
    const updatedRFP: RFP = {
      ...rfp,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy,
      notes: comments ? `${rfp.notes || ''}\n${comments}` : rfp.notes,
    };

    this.rfps.set(id, updatedRFP);
    return updatedRFP;
  }

  addAttachment(id: string, attachment: any, uploadedBy: string): RFP {
    const rfp = this.findOne(id);

    const newAttachment = {
      id: uuidv4(),
      fileName: attachment.fileName,
      fileType: attachment.fileType,
      fileSize: attachment.fileSize,
      fileUrl: attachment.fileUrl,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
    };

    const updatedRFP: RFP = {
      ...rfp,
      attachments: [...rfp.attachments, newAttachment],
      updatedAt: new Date().toISOString(),
      updatedBy: uploadedBy,
    };

    this.rfps.set(id, updatedRFP);
    return updatedRFP;
  }

  removeAttachment(id: string, attachmentId: string, updatedBy: string): RFP {
    const rfp = this.findOne(id);

    const updatedRFP: RFP = {
      ...rfp,
      attachments: rfp.attachments.filter((att) => att.id !== attachmentId),
      updatedAt: new Date().toISOString(),
      updatedBy,
    };

    this.rfps.set(id, updatedRFP);
    return updatedRFP;
  }

  addEvaluation(id: string, evaluation: any): RFP {
    const rfp = this.findOne(id);

    const newEvaluation = {
      ...evaluation,
      evaluationDate: new Date().toISOString(),
    };

    const updatedRFP: RFP = {
      ...rfp,
      evaluations: [...(rfp.evaluations || []), newEvaluation],
      updatedAt: new Date().toISOString(),
      updatedBy: evaluation.evaluatedBy,
    };

    this.rfps.set(id, updatedRFP);
    return updatedRFP;
  }

  approve(id: string, approver: string, comments?: string): RFP {
    const rfp = this.findOne(id);

    const approval = {
      approver,
      action: 'approved' as const,
      date: new Date().toISOString(),
      comments,
    };

    const updatedRFP: RFP = {
      ...rfp,
      status: RFPStatus.APPROVED,
      approvalHistory: [...(rfp.approvalHistory || []), approval],
      updatedAt: new Date().toISOString(),
      updatedBy: approver,
    };

    this.rfps.set(id, updatedRFP);
    return updatedRFP;
  }

  reject(id: string, approver: string, comments: string): RFP {
    const rfp = this.findOne(id);

    const rejection = {
      approver,
      action: 'rejected' as const,
      date: new Date().toISOString(),
      comments,
    };

    const updatedRFP: RFP = {
      ...rfp,
      status: RFPStatus.REJECTED,
      approvalHistory: [...(rfp.approvalHistory || []), rejection],
      updatedAt: new Date().toISOString(),
      updatedBy: approver,
    };

    this.rfps.set(id, updatedRFP);
    return updatedRFP;
  }

  getStatistics(): any {
    const rfps = Array.from(this.rfps.values());

    const stats = {
      total: rfps.length,
      byStatus: {} as Record<RFPStatus, number>,
      byPriority: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      totalEstimatedValue: 0,
      totalProposalValue: 0,
      averageWinProbability: 0,
      upcoming: 0,
      overdue: 0,
    };

    // Initialize counters
    Object.values(RFPStatus).forEach((status) => {
      stats.byStatus[status] = 0;
    });

    const now = new Date();
    let totalWinProb = 0;
    let winProbCount = 0;

    rfps.forEach((rfp) => {
      stats.byStatus[rfp.status]++;
      stats.byPriority[rfp.priority] = (stats.byPriority[rfp.priority] || 0) + 1;
      stats.byType[rfp.type] = (stats.byType[rfp.type] || 0) + 1;

      if (rfp.estimatedBudget) {
        stats.totalEstimatedValue += rfp.estimatedBudget;
      }
      if (rfp.proposalValue) {
        stats.totalProposalValue += rfp.proposalValue;
      }

      if (rfp.winProbability !== undefined) {
        totalWinProb += rfp.winProbability;
        winProbCount++;
      }

      const deadline = new Date(rfp.submissionDeadline);
      const daysUntilDeadline = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (
        daysUntilDeadline > 0 &&
        daysUntilDeadline <= 7 &&
        rfp.status !== RFPStatus.APPROVED &&
        rfp.status !== RFPStatus.REJECTED
      ) {
        stats.upcoming++;
      }

      if (
        daysUntilDeadline < 0 &&
        rfp.status !== RFPStatus.APPROVED &&
        rfp.status !== RFPStatus.REJECTED
      ) {
        stats.overdue++;
      }
    });

    if (winProbCount > 0) {
      stats.averageWinProbability = totalWinProb / winProbCount;
    }

    return stats;
  }

  getDashboard(): any {
    const stats = this.getStatistics();
    const rfps = Array.from(this.rfps.values());

    const recentRFPs = rfps
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);

    const highPriorityRFPs = rfps
      .filter((rfp) => rfp.priority === 'urgent' || rfp.priority === 'high')
      .filter(
        (rfp) =>
          rfp.status !== RFPStatus.APPROVED &&
          rfp.status !== RFPStatus.REJECTED,
      );

    const upcomingDeadlines = rfps
      .filter((rfp) => {
        const deadline = new Date(rfp.submissionDeadline);
        const now = new Date();
        const daysUntil = Math.ceil(
          (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        return (
          daysUntil > 0 &&
          daysUntil <= 14 &&
          rfp.status !== RFPStatus.APPROVED &&
          rfp.status !== RFPStatus.REJECTED
        );
      })
      .sort(
        (a, b) =>
          new Date(a.submissionDeadline).getTime() -
          new Date(b.submissionDeadline).getTime(),
      );

    return {
      statistics: stats,
      recentRFPs,
      highPriorityRFPs,
      upcomingDeadlines,
    };
  }

  private generateRFPNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = this.rfps.size + 1;
    return `RFP-${year}${month}-${String(count).padStart(4, '0')}`;
  }

  private seedMockData(): void {
    const now = new Date();
    const mockRFPs = [
      {
        title: 'Automated CNC Machine Tool Production Line',
        description: 'Request for proposals to design, manufacture and install a fully automated CNC machine tool production line for high-precision aerospace components.',
        type: 'new_project' as any,
        status: 'submitted' as any,
        priority: 'urgent' as any,
        customerName: 'AeroTech Industries Ltd.',
        contactPerson: 'John Mitchell',
        contactEmail: 'j.mitchell@aerotech.com',
        contactPhone: '+1-555-0123',
        issueDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        submissionDeadline: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        expectedStartDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        expectedCompletionDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        projectScope: 'Design and installation of automated production line including robotic arms, CNC machines, quality control systems, and integrated ERP connectivity.',
        deliverables: ['5-Axis CNC Machines', 'Robotic Arms', 'Quality Control Systems', 'Training & Documentation'],
        items: [
          { itemName: '5-Axis CNC Machine', description: 'High-precision 5-axis CNC machining center', quantity: 4, unit: 'units', estimatedCost: 250000 },
          { itemName: 'Industrial Robot Arm', description: '6-axis collaborative robot', quantity: 6, unit: 'units', estimatedCost: 75000 },
          { itemName: 'Quality Control System', description: 'Automated inspection and measurement', quantity: 2, unit: 'systems', estimatedCost: 120000 },
        ],
        requirements: [
          { category: 'Technical', requirement: 'ISO 9001 certification', priority: 'must_have' as any },
          { category: 'Performance', requirement: 'Production capacity 500 parts/day', priority: 'must_have' as any },
          { category: 'Integration', requirement: 'ERP system integration', priority: 'should_have' as any },
        ],
        timeline: [
          { milestone: 'Design Approval', expectedDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString() },
          { milestone: 'Equipment Delivery', expectedDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString() },
          { milestone: 'Installation Complete', expectedDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        estimatedBudget: 1850000,
        currency: 'USD',
        paymentTerms: '30% upfront, 40% on delivery, 30% on completion',
        winProbability: 75,
        assignedTo: 'Sarah Johnson',
        salesPerson: 'Michael Chen',
        estimator: 'Robert Davis',
        technicalLead: 'Emily Wilson',
        tags: ['CNC', 'Automation', 'Aerospace'],
        createdBy: 'system',
      },
      {
        title: 'Industrial IoT Sensors for Smart Factory',
        description: 'Supply and installation of IoT sensors and monitoring systems for predictive maintenance and real-time production monitoring.',
        type: 'product' as any,
        status: 'in_progress' as any,
        priority: 'high' as any,
        customerName: 'TechManufacturing Corp',
        contactPerson: 'Lisa Anderson',
        contactEmail: 'l.anderson@techmanuf.com',
        contactPhone: '+1-555-0456',
        issueDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        submissionDeadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        expectedStartDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        projectScope: 'Deployment of 500+ IoT sensors across manufacturing facility with cloud-based monitoring platform.',
        deliverables: ['Vibration Sensors', 'Temperature Sensors', 'Cloud Platform', 'Mobile App'],
        items: [
          { itemName: 'Vibration Sensor', description: 'Industrial-grade vibration monitoring', quantity: 200, unit: 'units', estimatedCost: 250 },
          { itemName: 'Temperature Sensor', description: 'High-precision temperature monitoring', quantity: 300, unit: 'units', estimatedCost: 180 },
          { itemName: 'IoT Gateway', description: 'Edge computing gateway', quantity: 20, unit: 'units', estimatedCost: 1500 },
          { itemName: 'Cloud Platform License', description: '3-year subscription', quantity: 1, unit: 'license', estimatedCost: 75000 },
        ],
        requirements: [
          { category: 'Connectivity', requirement: 'LoRaWAN support', priority: 'must_have' as any },
          { category: 'Security', requirement: 'End-to-end encryption', priority: 'must_have' as any },
          { category: 'Analytics', requirement: 'Predictive maintenance AI', priority: 'should_have' as any },
        ],
        estimatedBudget: 250000,
        winProbability: 85,
        assignedTo: 'David Park',
        salesPerson: 'Jennifer Lee',
        tags: ['IoT', 'Smart Factory', 'Industry 4.0'],
        createdBy: 'system',
      },
      {
        title: 'Warehouse Automation & AGV System',
        description: 'Implementation of automated guided vehicle (AGV) system and warehouse management software for 50,000 sq ft facility.',
        type: 'new_project' as any,
        status: 'under_review' as any,
        priority: 'medium' as any,
        customerName: 'LogisticsPro Inc.',
        contactPerson: 'Mark Thompson',
        contactEmail: 'm.thompson@logisticspro.com',
        issueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        submissionDeadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        projectScope: 'Complete warehouse automation including AGVs, conveyor systems, automated storage and retrieval system (ASRS), and WMS integration.',
        deliverables: ['10 AGV Units', 'ASRS System', 'WMS Software', 'Conveyor Network'],
        items: [
          { itemName: 'Automated Guided Vehicle', description: 'Lift capacity 2000kg', quantity: 10, unit: 'units', estimatedCost: 85000 },
          { itemName: 'ASRS System', description: '30ft high automated storage', quantity: 1, unit: 'system', estimatedCost: 450000 },
          { itemName: 'Conveyor System', description: '500ft conveyor network', quantity: 1, unit: 'system', estimatedCost: 120000 },
          { itemName: 'WMS Software', description: 'Warehouse management system', quantity: 1, unit: 'license', estimatedCost: 95000 },
        ],
        estimatedBudget: 1650000,
        winProbability: 60,
        assignedTo: 'Alex Martinez',
        salesPerson: 'Patricia White',
        tags: ['Warehouse', 'AGV', 'Automation'],
        createdBy: 'system',
      },
      {
        title: 'Quality Control Lab Equipment Upgrade',
        description: 'Replacement and upgrade of quality control laboratory equipment including coordinate measuring machines and material testing equipment.',
        type: 'product' as any,
        status: 'awaiting_approval' as any,
        priority: 'medium' as any,
        customerName: 'Precision Parts Manufacturing',
        contactPerson: 'Dr. Susan Roberts',
        contactEmail: 's.roberts@precisionparts.com',
        issueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        submissionDeadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        projectScope: 'Supply and installation of advanced metrology equipment for aerospace component quality verification.',
        deliverables: ['CMM Machines', 'Material Testing Equipment', 'Calibration Services'],
        items: [
          { itemName: 'CMM Machine', description: 'Coordinate Measuring Machine - 1000x800x600mm', quantity: 2, unit: 'units', estimatedCost: 185000 },
          { itemName: 'Hardness Tester', description: 'Universal hardness testing machine', quantity: 3, unit: 'units', estimatedCost: 45000 },
          { itemName: 'Optical Comparator', description: '30" optical comparator system', quantity: 1, unit: 'unit', estimatedCost: 75000 },
        ],
        estimatedBudget: 545000,
        proposalValue: 520000,
        winProbability: 90,
        assignedTo: 'Thomas Anderson',
        salesPerson: 'Michael Chen',
        tags: ['QC', 'Metrology', 'Testing'],
        createdBy: 'system',
      },
      {
        title: 'Energy Management & Solar Installation',
        description: 'Installation of solar panels and energy management system to reduce facility energy costs and carbon footprint.',
        type: 'service' as any,
        status: 'approved' as any,
        priority: 'low' as any,
        customerName: 'GreenTech Manufacturing',
        contactPerson: 'Rachel Green',
        contactEmail: 'r.green@greentech.com',
        issueDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        submissionDeadline: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        projectScope: '500kW solar installation with battery storage and real-time energy monitoring system.',
        deliverables: ['Solar Panels', 'Battery Storage', 'Energy Management Software'],
        items: [
          { itemName: 'Solar Panel', description: '450W monocrystalline panels', quantity: 1200, unit: 'units', estimatedCost: 280 },
          { itemName: 'Battery Storage', description: '100kWh lithium battery system', quantity: 5, unit: 'units', estimatedCost: 85000 },
          { itemName: 'Inverter System', description: '500kW grid-tie inverter', quantity: 1, unit: 'system', estimatedCost: 75000 },
        ],
        estimatedBudget: 850000,
        proposalValue: 825000,
        winProbability: 95,
        assignedTo: 'Laura Martinez',
        salesPerson: 'David Park',
        tags: ['Solar', 'Energy', 'Sustainability'],
        createdBy: 'system',
      },
      {
        title: 'Powder Coating Line Installation',
        description: 'Design and installation of automated powder coating line with pre-treatment, curing oven, and quality control systems.',
        type: 'new_project' as any,
        status: 'draft' as any,
        priority: 'high' as any,
        customerName: 'MetalWorks Industries',
        contactPerson: 'James Wilson',
        contactEmail: 'j.wilson@metalworks.com',
        issueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        submissionDeadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        projectScope: 'Complete powder coating facility including conveyors, booths, curing ovens, and waste treatment.',
        deliverables: ['Coating Booths', 'Curing Oven', 'Pre-treatment System', 'Conveyor System'],
        items: [
          { itemName: 'Powder Coating Booth', description: 'Automatic powder coating booth', quantity: 2, unit: 'units', estimatedCost: 95000 },
          { itemName: 'Gas Curing Oven', description: '40ft gas-fired curing oven', quantity: 1, unit: 'unit', estimatedCost: 180000 },
          { itemName: 'Overhead Conveyor', description: 'Power and free conveyor 200ft', quantity: 1, unit: 'system', estimatedCost: 75000 },
        ],
        estimatedBudget: 650000,
        winProbability: 70,
        assignedTo: 'Robert Davis',
        tags: ['Coating', 'Finishing', 'Manufacturing'],
        createdBy: 'system',
      },
      {
        title: 'ERP System Implementation & Integration',
        description: 'Implementation of comprehensive ERP system with modules for production, inventory, finance, and HR.',
        type: 'consulting' as any,
        status: 'rejected' as any,
        priority: 'medium' as any,
        customerName: 'MidSize Manufacturing Co.',
        contactPerson: 'Angela Martinez',
        contactEmail: 'a.martinez@midsize.com',
        issueDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        submissionDeadline: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        projectScope: 'Full ERP implementation including data migration, customization, training, and go-live support.',
        deliverables: ['ERP Software License', 'Implementation Services', 'Training', 'Support'],
        items: [
          { itemName: 'ERP Software License', description: '100 user licenses', quantity: 1, unit: 'license', estimatedCost: 150000 },
          { itemName: 'Implementation Services', description: '6-month implementation', quantity: 1, unit: 'project', estimatedCost: 200000 },
          { itemName: 'Training Program', description: 'On-site and online training', quantity: 1, unit: 'program', estimatedCost: 35000 },
        ],
        estimatedBudget: 450000,
        proposalValue: 495000,
        winProbability: 20,
        notes: 'Lost to competitor due to pricing',
        tags: ['ERP', 'Software', 'Implementation'],
        createdBy: 'system',
      },
      {
        title: 'Preventive Maintenance Contract - 2026',
        description: 'Annual preventive maintenance contract for all manufacturing equipment including emergency support.',
        type: 'maintenance' as any,
        status: 'submitted' as any,
        priority: 'low' as any,
        customerName: 'Reliable Manufacturing Ltd.',
        contactPerson: 'Tom Jackson',
        contactEmail: 't.jackson@reliable.com',
        issueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        submissionDeadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        projectScope: 'Quarterly preventive maintenance visits, emergency support, spare parts supply, and annual equipment audits.',
        deliverables: ['Quarterly Maintenance', 'Emergency Support', 'Parts Supply', 'Annual Audit'],
        items: [
          { itemName: 'Quarterly Maintenance', description: 'Preventive maintenance visits', quantity: 4, unit: 'visits', estimatedCost: 15000 },
          { itemName: 'Emergency Support', description: '24/7 emergency support', quantity: 1, unit: 'year', estimatedCost: 25000 },
          { itemName: 'Spare Parts Budget', description: 'Annual spare parts allowance', quantity: 1, unit: 'year', estimatedCost: 50000 },
        ],
        estimatedBudget: 140000,
        winProbability: 80,
        assignedTo: 'Emily Wilson',
        tags: ['Maintenance', 'Support', 'Service'],
        createdBy: 'system',
      },
    ];

    mockRFPs.forEach((mockRFP) => {
      this.create(mockRFP as any);
    });
  }
}
