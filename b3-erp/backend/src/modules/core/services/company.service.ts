import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) { }

    async create(createCompanyDto: any): Promise<Company> {
        const company = this.companyRepository.create(createCompanyDto as object); // Force object context? Or just Company
        return this.companyRepository.save(company);
    }

    async findAll(query: any = {}): Promise<Company[]> {
        const where: any = {};

        if (query.search) {
            where.name = Like(`%${query.search}%`);
        }

        if (query.status && query.status !== 'all') {
            where.isActive = query.status === 'active';
        }

        return this.companyRepository.find({
            where,
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findOne(id: string): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id } });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async update(id: string, updateCompanyDto: any): Promise<Company> {
        const company = await this.findOne(id);
        Object.assign(company, updateCompanyDto);
        return this.companyRepository.save(company);
    }

    async remove(id: string): Promise<void> {
        const company = await this.findOne(id);
        await this.companyRepository.remove(company);
    }
}
