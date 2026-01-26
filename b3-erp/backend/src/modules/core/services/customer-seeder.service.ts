import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Customer,
  CustomerType,
  CustomerStatus,
  CreditRating,
} from '../entities/customer.entity';

@Injectable()
export class CustomerSeederService implements OnModuleInit {
  private readonly logger = new Logger(CustomerSeederService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedCustomers();
  }

  async seedCustomers(): Promise<void> {
    this.logger.log('Seeding demo customers...');

    const customers = [
      {
        customerCode: 'CUST-001',
        customerName: 'Acme Manufacturing Co.',
        customerType: CustomerType.COMPANY,
        status: CustomerStatus.ACTIVE,
        contactPerson: 'John Smith',
        email: 'john.smith@acme-mfg.com',
        phone: '+1-555-0101',
        mobile: '+1-555-0102',
        billingAddress: '123 Industrial Park Drive',
        billingCity: 'Chicago',
        billingState: 'Illinois',
        billingCountry: 'USA',
        billingZipCode: '60601',
        shippingAddress: '123 Industrial Park Drive',
        shippingCity: 'Chicago',
        shippingState: 'Illinois',
        shippingCountry: 'USA',
        shippingZipCode: '60601',
        taxId: 'US-123456789',
        creditLimit: 500000,
        creditDays: 30,
        creditRating: CreditRating.EXCELLENT,
        paymentTerms: 'Net 30',
        currency: 'USD',
        industry: 'Manufacturing',
        territory: 'North America',
        customerGroup: 'Premium',
      },
      {
        customerCode: 'CUST-002',
        customerName: 'TechParts Industries Ltd.',
        customerType: CustomerType.COMPANY,
        status: CustomerStatus.ACTIVE,
        contactPerson: 'Sarah Johnson',
        email: 'sarah.johnson@techparts.com',
        phone: '+1-555-0201',
        mobile: '+1-555-0202',
        billingAddress: '456 Technology Boulevard',
        billingCity: 'San Jose',
        billingState: 'California',
        billingCountry: 'USA',
        billingZipCode: '95110',
        taxId: 'US-987654321',
        creditLimit: 750000,
        creditDays: 45,
        creditRating: CreditRating.EXCELLENT,
        paymentTerms: 'Net 45',
        currency: 'USD',
        industry: 'Electronics',
        territory: 'West Coast',
        customerGroup: 'Premium',
      },
      {
        customerCode: 'CUST-003',
        customerName: 'Global Steel Works',
        customerType: CustomerType.COMPANY,
        status: CustomerStatus.ACTIVE,
        contactPerson: 'Michael Chen',
        email: 'mchen@globalsteel.com',
        phone: '+1-555-0301',
        billingAddress: '789 Steel Mill Road',
        billingCity: 'Pittsburgh',
        billingState: 'Pennsylvania',
        billingCountry: 'USA',
        billingZipCode: '15222',
        taxId: 'US-456789123',
        creditLimit: 1000000,
        creditDays: 30,
        creditRating: CreditRating.GOOD,
        paymentTerms: 'Net 30',
        currency: 'USD',
        industry: 'Steel & Metals',
        territory: 'East Coast',
        customerGroup: 'Enterprise',
      },
      {
        customerCode: 'CUST-004',
        customerName: 'Precision Engineering Pvt. Ltd.',
        customerType: CustomerType.COMPANY,
        status: CustomerStatus.ACTIVE,
        contactPerson: 'Rajesh Kumar',
        email: 'rajesh@precisioneng.in',
        phone: '+91-22-55001234',
        mobile: '+91-9820012345',
        billingAddress: '45 MIDC Industrial Area',
        billingCity: 'Mumbai',
        billingState: 'Maharashtra',
        billingCountry: 'India',
        billingZipCode: '400093',
        gstNumber: '27AABCP1234A1ZX',
        panNumber: 'AABCP1234A',
        creditLimit: 2500000,
        creditDays: 30,
        creditRating: CreditRating.GOOD,
        paymentTerms: 'Net 30',
        currency: 'INR',
        industry: 'Precision Engineering',
        territory: 'South Asia',
        customerGroup: 'Standard',
      },
      {
        customerCode: 'CUST-005',
        customerName: 'AutoParts Distributors Inc.',
        customerType: CustomerType.DISTRIBUTOR,
        status: CustomerStatus.ACTIVE,
        contactPerson: 'Emily Davis',
        email: 'edavis@autopartsdist.com',
        phone: '+1-555-0501',
        mobile: '+1-555-0502',
        billingAddress: '321 Distribution Center Way',
        billingCity: 'Detroit',
        billingState: 'Michigan',
        billingCountry: 'USA',
        billingZipCode: '48201',
        taxId: 'US-321654987',
        creditLimit: 350000,
        creditDays: 15,
        creditRating: CreditRating.FAIR,
        paymentTerms: 'Net 15',
        currency: 'USD',
        industry: 'Automotive',
        territory: 'Midwest',
        customerGroup: 'Distributor',
        defaultDiscountPercentage: 10,
      },
      {
        customerCode: 'CUST-006',
        customerName: 'EuroMach GmbH',
        customerType: CustomerType.COMPANY,
        status: CustomerStatus.ACTIVE,
        contactPerson: 'Hans Mueller',
        email: 'h.mueller@euromach.de',
        phone: '+49-89-12345678',
        billingAddress: 'Industriestrasse 42',
        billingCity: 'Munich',
        billingState: 'Bavaria',
        billingCountry: 'Germany',
        billingZipCode: '80331',
        taxId: 'DE123456789',
        creditLimit: 600000,
        creditDays: 30,
        creditRating: CreditRating.EXCELLENT,
        paymentTerms: 'Net 30',
        currency: 'EUR',
        industry: 'Machinery',
        territory: 'Europe',
        customerGroup: 'Premium',
      },
      {
        customerCode: 'CUST-007',
        customerName: 'Pacific Manufacturing Solutions',
        customerType: CustomerType.RESELLER,
        status: CustomerStatus.ACTIVE,
        contactPerson: 'Lisa Wang',
        email: 'lwang@pacificmfg.com',
        phone: '+1-555-0701',
        billingAddress: '567 Harbor View Road',
        billingCity: 'Seattle',
        billingState: 'Washington',
        billingCountry: 'USA',
        billingZipCode: '98101',
        taxId: 'US-789123456',
        creditLimit: 200000,
        creditDays: 30,
        creditRating: CreditRating.GOOD,
        paymentTerms: 'Net 30',
        currency: 'USD',
        industry: 'Manufacturing',
        territory: 'Pacific Northwest',
        customerGroup: 'Reseller',
        defaultDiscountPercentage: 15,
      },
      {
        customerCode: 'CUST-008',
        customerName: 'Government Defense Supplies',
        customerType: CustomerType.GOVERNMENT,
        status: CustomerStatus.ACTIVE,
        contactPerson: 'James Wilson',
        email: 'jwilson@gov-defense.gov',
        phone: '+1-555-0801',
        billingAddress: '1000 Pentagon Way',
        billingCity: 'Arlington',
        billingState: 'Virginia',
        billingCountry: 'USA',
        billingZipCode: '22202',
        taxId: 'GOV-EXEMPT-001',
        isTaxExempt: true,
        creditLimit: 2000000,
        creditDays: 60,
        creditRating: CreditRating.EXCELLENT,
        paymentTerms: 'Net 60',
        currency: 'USD',
        industry: 'Defense',
        territory: 'Government',
        customerGroup: 'Government',
      },
    ];

    for (const customer of customers) {
      try {
        const existing = await this.customerRepository.findOne({
          where: { customerCode: customer.customerCode },
        });
        if (!existing) {
          await this.customerRepository.save(customer);
          this.logger.log(`Created customer: ${customer.customerName} (${customer.customerCode})`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed customer ${customer.customerName}: ${error.message}`);
      }
    }

    this.logger.log('Demo customers seeding completed');
  }
}
