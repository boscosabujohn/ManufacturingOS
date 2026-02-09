import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanySeederService {
    private readonly logger = new Logger(CompanySeederService.name);

    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) { }

    async seed() {
        const count = await this.companyRepository.count();
        if (count > 0) {
            this.logger.log('Companies already seeded. Skipping...');
            return;
        }

        const companies = [
            {
                name: 'KreupAI Technologies LLC',
                taxId: 'TAX123456789',
                registrationNumber: 'LLC-2020-001',
                baseCurrency: 'USD',
                fiscalYearStart: new Date('2024-01-01'),
                address: '123 Technology Drive, Suite 500, San Francisco, CA, US, 94105',
                email: 'info@kreupai.com',
                phone: '+1-555-0123',
                isActive: true,
                isEliminationEntity: false,
            },
            {
                name: 'ManufacturingOS Manufacturing',
                taxId: 'TAX987654321',
                registrationNumber: 'SUB-2021-002',
                baseCurrency: 'USD',
                fiscalYearStart: new Date('2024-01-01'),
                address: '456 Manufacturing Blvd, Detroit, MI, US, 48201',
                email: 'info@b3macbis.com',
                phone: '+1-555-0125',
                isActive: true,
                isEliminationEntity: false,
            },
            {
                name: 'ManufacturingOS Europe',
                taxId: 'EU123456789',
                registrationNumber: 'EU-2022-003',
                baseCurrency: 'EUR',
                fiscalYearStart: new Date('2024-01-01'),
                address: '789 Industrial Park, Berlin, DE, 10115',
                email: 'info@b3macbis.eu',
                phone: '+49-30-12345678',
                isActive: true,
                isEliminationEntity: false,
            },
        ];

        for (const company of companies) {
            const newCompany = this.companyRepository.create(company);
            await this.companyRepository.save(newCompany);
        }

        this.logger.log(`Seeded ${companies.length} companies.`);
    }
}
