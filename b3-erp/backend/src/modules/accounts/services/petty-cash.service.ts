import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PettyCash } from '../entities/petty-cash.entity';

@Injectable()
export class PettyCashService {
    constructor(
        @InjectRepository(PettyCash)
        private pettyCashRepository: Repository<PettyCash>,
    ) { }

    async create(data: Partial<PettyCash>): Promise<PettyCash> {
        const transaction = this.pettyCashRepository.create(data);
        return await this.pettyCashRepository.save(transaction);
    }

    async findAll(custodian?: string, status?: string): Promise<PettyCash[]> {
        const query: any = {};
        if (custodian) query.custodian = custodian;
        if (status) query.status = status;

        return await this.pettyCashRepository.find({
            where: query,
            order: { date: 'DESC' },
        });
    }

    async findOne(id: string): Promise<PettyCash> {
        const transaction = await this.pettyCashRepository.find({ where: { id } });
        if (!transaction) {
            throw new NotFoundException(`Petty cash transaction ${id} not found`);
        }
        return transaction[0];
    }

    async update(id: string, data: Partial<PettyCash>): Promise<PettyCash> {
        await this.findOne(id);
        await this.pettyCashRepository.update(id, data);
        return this.findOne(id);
    }

    async approve(id: string, approvedBy: string): Promise<PettyCash> {
        const transaction = await this.findOne(id);
        transaction.status = 'approved';
        transaction.approvedBy = approvedBy;
        return await this.pettyCashRepository.save(transaction);
    }

    async reject(id: string): Promise<PettyCash> {
        const transaction = await this.findOne(id);
        transaction.status = 'rejected';
        return await this.pettyCashRepository.save(transaction);
    }

    async getBalance(custodian?: string): Promise<number> {
        const query = this.pettyCashRepository.createQueryBuilder('petty')
            .where('petty.status = :status', { status: 'approved' });

        if (custodian) {
            query.andWhere('petty.custodian = :custodian', { custodian });
        }

        const transactions = await query.getMany();
        return transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    }

    async requestReplenishment(custodian: string, amount: number, remarks: string): Promise<PettyCash> {
        return await this.create({
            custodian,
            amount,
            date: new Date(),
            purpose: 'Replenishment',
            category: 'Replenishment',
            status: 'pending',
            remarks,
        });
    }
}
