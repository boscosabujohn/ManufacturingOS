import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Invoice } from '../../finance/entities/invoice.entity';
import { PurchaseOrder } from '../../procurement/entities/purchase-order.entity';
import { TimeLog } from '../entities/time-log.entity';
import { GeneralLedger } from '../../finance/entities/general-ledger.entity';
import { ProjectBudget } from '../entities/project-budget.entity';

@Injectable()
export class ProjectFinancialsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        @InjectRepository(PurchaseOrder)
        private poRepository: Repository<PurchaseOrder>,
        @InjectRepository(TimeLog)
        private timeLogRepository: Repository<TimeLog>,
        @InjectRepository(GeneralLedger)
        private ledgerRepository: Repository<GeneralLedger>,
        @InjectRepository(ProjectBudget)
        private budgetRepository: Repository<ProjectBudget>,
        private dataSource: DataSource,
    ) { }

    async trackExpense(projectId: string, amount: number, category: string, description?: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        project.budgetSpent = (Number(project.budgetSpent) || 0) + amount;
        // this.calculateFinancials(project); // Disabled until fields exist

        return this.projectRepository.save(project);
    }

    async trackIncome(projectId: string, amount: number, source: string, description?: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        // project.totalIncome += amount; // Field does not exist
        // this.calculateFinancials(project);

        return project; // No-op for now
    }

    async syncProjectFinancials(projectId: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Project not found');

        // 1. Aggregate Revenue (Sales Invoices)
        const invoices = await this.invoiceRepository.find({ where: { projectId } });
        const totalIncome = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);

        // 2. Aggregate Material Costs (Purchase Orders)
        const pos = await this.poRepository.find({ where: { project: project.projectCode } });
        const materialExpenditure = pos.reduce((sum, po) => sum + Number(po.totalAmount || 0), 0);

        // 3. Aggregate Labor Costs (Time Logs)
        // Note: For now using a standard hourly rate of 500 until employee-specific rates are implemented
        const timeLogs = await this.timeLogRepository.find({ where: { projectId } });
        const laborExpenditure = timeLogs.reduce((sum, log) => sum + (Number(log.hours) * 500), 0);

        // 4. Aggregate Manual Ledger Entries
        const ledgerEntries = await this.ledgerRepository.find({ where: { project: project.projectCode } });
        const miscExpenditure = ledgerEntries.reduce((sum, entry) => sum + (Number(entry.debitAmount) - Number(entry.creditAmount)), 0);

        project.totalIncome = totalIncome;
        project.totalExpenditure = materialExpenditure + laborExpenditure + miscExpenditure;
        project.netProfit = project.totalIncome - project.totalExpenditure;
        project.profitMargin = project.totalIncome > 0 ? (project.netProfit / project.totalIncome) * 100 : 0;
        project.budgetSpent = project.totalExpenditure;

        return await this.projectRepository.save(project);
    }

    async calculateIoE(projectId: string): Promise<{ income: number; expenditure: number; margin: number; status: string }> {
        const project = await this.syncProjectFinancials(projectId);

        return {
            income: Number(project.totalIncome),
            expenditure: Number(project.totalExpenditure),
            margin: Number(project.netProfit),
            status: project.netProfit >= 0 ? 'Profitable' : 'Loss',
        };
    }
}
