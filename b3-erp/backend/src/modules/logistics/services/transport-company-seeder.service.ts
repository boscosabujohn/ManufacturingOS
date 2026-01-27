import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TransportCompany,
  TransportCompanyType,
  TransportCompanyStatus,
  ServiceType,
} from '../entities/transport-company.entity';

interface TransportCompanySeedData {
  companyCode: string;
  companyName: string;
  companyType: TransportCompanyType;
  serviceTypes: ServiceType[];
  description?: string;
}

@Injectable()
export class TransportCompanySeederService implements OnModuleInit {
  private readonly logger = new Logger(TransportCompanySeederService.name);

  private readonly transportCompanies: TransportCompanySeedData[] = [
    {
      companyCode: 'TC-OWN',
      companyName: 'Own Fleet',
      companyType: TransportCompanyType.OWN_FLEET,
      serviceTypes: [ServiceType.ROAD],
      description: 'Company owned vehicles and fleet for internal logistics operations',
    },
    {
      companyCode: 'TC-DHL',
      companyName: 'DHL Express',
      companyType: TransportCompanyType.COURIER,
      serviceTypes: [ServiceType.COURIER, ServiceType.AIR, ServiceType.ROAD],
      description: 'International courier and express delivery services',
    },
    {
      companyCode: 'TC-FEDEX',
      companyName: 'FedEx',
      companyType: TransportCompanyType.COURIER,
      serviceTypes: [ServiceType.COURIER, ServiceType.AIR, ServiceType.ROAD],
      description: 'Global courier delivery services with express and standard options',
    },
    {
      companyCode: 'TC-BLUEDART',
      companyName: 'Blue Dart',
      companyType: TransportCompanyType.COURIER,
      serviceTypes: [ServiceType.COURIER, ServiceType.AIR, ServiceType.ROAD],
      description: 'Leading Indian express air and integrated transportation company',
    },
    {
      companyCode: 'TC-GATI',
      companyName: 'Gati Logistics',
      companyType: TransportCompanyType.FREIGHT_FORWARDER,
      serviceTypes: [ServiceType.ROAD, ServiceType.RAIL, ServiceType.MULTIMODAL],
      description: 'Comprehensive freight and logistics solutions across India',
    },
    {
      companyCode: 'TC-SAFE',
      companyName: 'Safexpress',
      companyType: TransportCompanyType.FREIGHT_FORWARDER,
      serviceTypes: [ServiceType.ROAD, ServiceType.MULTIMODAL],
      description: 'Premium express distribution and supply chain solutions',
    },
    {
      companyCode: 'TC-DELHIVERY',
      companyName: 'Delhivery',
      companyType: TransportCompanyType.COURIER,
      serviceTypes: [ServiceType.COURIER, ServiceType.ROAD],
      description: 'Technology-driven logistics and supply chain services company',
    },
  ];

  constructor(
    @InjectRepository(TransportCompany)
    private readonly transportCompanyRepository: Repository<TransportCompany>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    this.logger.log('Starting transport company seeding...');

    for (const companyData of this.transportCompanies) {
      try {
        const existingCompany = await this.transportCompanyRepository.findOne({
          where: { companyCode: companyData.companyCode },
        });

        if (existingCompany) {
          this.logger.debug(
            `Transport company ${companyData.companyCode} already exists, skipping...`,
          );
          continue;
        }

        const transportCompany = this.transportCompanyRepository.create({
          ...companyData,
          legalName: companyData.companyName,
          status: TransportCompanyStatus.ACTIVE,
          // Default contact information
          address: 'To be updated',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
          email: `contact@${companyData.companyCode.toLowerCase().replace('tc-', '')}.com`,
          phone: '+91-22-00000000',
          contactPersonName: 'Operations Manager',
          contactPersonEmail: `operations@${companyData.companyCode.toLowerCase().replace('tc-', '')}.com`,
          contactPersonPhone: '+91-22-00000001',
          // Default capabilities
          hasGpsTracking: true,
          providesInsurance: companyData.companyType !== TransportCompanyType.OWN_FLEET,
          hasWarehouse: companyData.companyType === TransportCompanyType.FREIGHT_FORWARDER,
          // Default rates (to be updated)
          currency: 'INR',
          paymentTerms: companyData.companyType === TransportCompanyType.OWN_FLEET ? 'N/A' : 'Net 30',
          creditDays: companyData.companyType === TransportCompanyType.OWN_FLEET ? 0 : 30,
          // Initial metrics
          performanceRating: 4.0,
          totalShipmentsHandled: 0,
          onTimeDeliveries: 0,
          onTimeDeliveryRate: 100,
          damagedShipments: 0,
          lostShipments: 0,
          customerComplaints: 0,
          totalBusinessValue: 0,
          // Audit
          createdBy: 'system',
        });

        await this.transportCompanyRepository.save(transportCompany);
        this.logger.log(
          `Created transport company: ${companyData.companyCode} - ${companyData.companyName}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to seed transport company ${companyData.companyCode}: ${error.message}`,
        );
      }
    }

    this.logger.log('Transport company seeding completed.');
  }

  async getTransportCompanyByCode(code: string): Promise<TransportCompany | null> {
    return this.transportCompanyRepository.findOne({
      where: { companyCode: code },
    });
  }

  async getAllSeededCompanies(): Promise<TransportCompany[]> {
    const codes = this.transportCompanies.map((c) => c.companyCode);
    return this.transportCompanyRepository
      .createQueryBuilder('tc')
      .where('tc.companyCode IN (:...codes)', { codes })
      .getMany();
  }
}
