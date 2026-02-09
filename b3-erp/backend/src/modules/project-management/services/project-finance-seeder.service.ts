import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus, ProjectPriority } from '../../project/entities/project.entity';
import { Invoice, InvoiceType, InvoiceStatus } from '../../finance/entities/invoice.entity';
import { PurchaseOrder, POStatus } from '../../procurement/entities/purchase-order.entity';
import { TimeLog } from '../entities/time-log.entity';
import { ProjectFinancialsService } from './project-financials.service';

@Injectable()
export class ProjectFinanceSeederService implements OnModuleInit {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        @InjectRepository(PurchaseOrder)
        private poRepository: Repository<PurchaseOrder>,
        @InjectRepository(TimeLog)
        private timeLogRepository: Repository<TimeLog>,
        private financialsService: ProjectFinancialsService,
    ) { }

    async onModuleInit() {
        await this.seedFinanceData();
    }

    async seedFinanceData() {
        const projects = await this.projectRepository.find();

        // Ensure we have at least 5 projects
        if (projects.length < 5) {
            const extraProjects = [
                {
                    name: 'Solar Panel Array Installation',
                    clientName: 'GreenEnergy Co',
                    projectCode: 'PRJ-2026-0005',
                    status: ProjectStatus.ACTIVE,
                    priority: ProjectPriority.MEDIUM,
                    budgetAllocated: 1500000,
                    location: 'Jebel Ali, Dubai',
                },
                {
                    name: 'Automation Line Upgrade',
                    clientName: 'AutoParts Ltd',
                    projectCode: 'PRJ-2026-0006',
                    status: ProjectStatus.PLANNING,
                    priority: ProjectPriority.HIGH,
                    budgetAllocated: 800000,
                    location: 'Sharjah, UAE',
                }
            ];

            for (const pData of extraProjects) {
                if (!(await this.projectRepository.findOne({ where: { projectCode: pData.projectCode } }))) {
                    const p = this.projectRepository.create(pData);
                    await this.projectRepository.save(p);
                }
            }
        }

        const allProjects = await this.projectRepository.find();

        for (const project of allProjects) {
            // 1. Seed Invoices (Revenue)
            const invCount = await this.invoiceRepository.count({ where: { projectId: project.id } });
            if (invCount === 0) {
                const invoice = this.invoiceRepository.create({
                    invoiceNumber: `INV-${project.projectCode}-01`,
                    invoiceType: InvoiceType.SALES_INVOICE,
                    invoiceDate: new Date(),
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    partyId: project.clientName || 'Walk-in Client',
                    partyName: project.clientName || 'Walk-in Client',
                    partyType: 'Customer',
                    totalAmount: Math.floor(Math.random() * (project.budgetAllocated || 100000) * 1.2),
                    projectId: project.id,
                    status: InvoiceStatus.PAID,
                    isPosted: true,
                });
                await this.invoiceRepository.save(invoice);
            }

            // 2. Seed Purchase Orders (Expenses)
            const poCount = await this.poRepository.count({ where: { project: project.projectCode } });
            if (poCount === 0) {
                const po = this.poRepository.create({
                    poNumber: `PO-${project.projectCode}-01`,
                    poDate: new Date(),
                    deliveryDate: new Date(),
                    status: POStatus.APPROVED,
                    vendorId: 'VND-GENERIC',
                    vendorName: 'Global Supplies',
                    deliveryAddress: project.location || 'HQ',
                    totalAmount: Math.floor(Math.random() * (project.budgetAllocated || 100000) * 0.4),
                    project: project.projectCode,
                    buyerId: 'USR-SEED',
                    buyerName: 'System Seeder',
                });
                await this.poRepository.save(po);
            }

            // 3. Seed Time Logs (Labor Expense)
            const timeLogCount = await this.timeLogRepository.count({ where: { projectId: project.id } });
            if (timeLogCount === 0) {
                const log = this.timeLogRepository.create({
                    projectId: project.id,
                    userId: 'USR-SEED',
                    date: new Date(),
                    hours: 40 + Math.floor(Math.random() * 60),
                    description: 'Initial engineering and setup',
                    billable: true,
                });
                await this.timeLogRepository.save(log);
            }

            // Sync final totals
            await this.financialsService.syncProjectFinancials(project.id);
        }

        console.log('Project Finance seeding completed.');
    }
}
