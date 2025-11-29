import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseClaim } from '../entities/expense-claim.entity';

@Injectable()
export class ExpenseClaimService {
    constructor(
        @InjectRepository(ExpenseClaim)
        private expenseClaimRepository: Repository<ExpenseClaim>,
    ) { }

    async create(data: Partial<ExpenseClaim>): Promise<ExpenseClaim> {
        const claimNumber = await this.generateClaimNumber();
        const claim = this.expenseClaimRepository.create({
            ...data,
            claimNumber,
            status: 'draft',
        });
        return await this.expenseClaimRepository.save(claim);
    }

    async findAll(employeeId?: string, status?: string): Promise<ExpenseClaim[]> {
        const query: any = {};
        if (employeeId) query.employeeId = employeeId;
        if (status) query.status = status;

        return await this.expenseClaimRepository.find({
            where: query,
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<ExpenseClaim> {
        const claim = await this.expenseClaimRepository.findOne({ where: { id } });
        if (!claim) {
            throw new NotFoundException(`Expense claim ${id} not found`);
        }
        return claim;
    }

    async update(id: string, data: Partial<ExpenseClaim>): Promise<ExpenseClaim> {
        await this.findOne(id);
        await this.expenseClaimRepository.update(id, data);
        return this.findOne(id);
    }

    async submit(id: string): Promise<ExpenseClaim> {
        const claim = await this.findOne(id);
        claim.status = 'pending';
        return await this.expenseClaimRepository.save(claim);
    }

    async approve(id: string, approvedBy: string): Promise<ExpenseClaim> {
        const claim = await this.findOne(id);
        claim.status = 'approved';
        claim.approvedBy = approvedBy;
        claim.approvedDate = new Date();
        return await this.expenseClaimRepository.save(claim);
    }

    async reject(id: string, reason: string): Promise<ExpenseClaim> {
        const claim = await this.findOne(id);
        claim.status = 'rejected';
        claim.rejectionReason = reason;
        return await this.expenseClaimRepository.save(claim);
    }

    async processPayment(id: string, paymentRef: string, paidBy: string): Promise<ExpenseClaim> {
        const claim = await this.findOne(id);
        if (claim.status !== 'approved') {
            throw new Error('Only approved claims can be paid');
        }
        claim.status = 'paid';
        claim.paidDate = new Date();
        claim.paidBy = paidBy;
        claim.paymentReference = paymentRef;
        return await this.expenseClaimRepository.save(claim);
    }

    private async generateClaimNumber(): Promise<string> {
        const count = await this.expenseClaimRepository.count();
        return `EXP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    }
}
