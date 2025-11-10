import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

export interface CustomerFilters {
  search?: string;
  status?: string;
  customerType?: string;
  territory?: string;
  customerGroup?: string;
  salesPersonId?: string;
  creditRating?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(
    filters: CustomerFilters = {},
    pagination: PaginationParams = {},
  ): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
    const {
      search,
      status,
      customerType,
      territory,
      customerGroup,
      salesPersonId,
      creditRating,
    } = filters;

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;

    const queryBuilder = this.customerRepository.createQueryBuilder('customer');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(customer.customerCode ILIKE :search OR customer.customerName ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('customer.status = :status', { status });
    }

    // Apply customer type filter
    if (customerType) {
      queryBuilder.andWhere('customer.customerType = :customerType', {
        customerType,
      });
    }

    // Apply territory filter
    if (territory) {
      queryBuilder.andWhere('customer.territory = :territory', { territory });
    }

    // Apply customer group filter
    if (customerGroup) {
      queryBuilder.andWhere('customer.customerGroup = :customerGroup', {
        customerGroup,
      });
    }

    // Apply sales person filter
    if (salesPersonId) {
      queryBuilder.andWhere('customer.salesPersonId = :salesPersonId', {
        salesPersonId,
      });
    }

    // Apply credit rating filter
    if (creditRating) {
      queryBuilder.andWhere('customer.creditRating = :creditRating', {
        creditRating,
      });
    }

    // Apply sorting
    queryBuilder.orderBy(`customer.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    // Calculate virtual fields
    data.forEach((customer) => {
      customer.creditAvailable = customer.creditLimit - customer.outstandingBalance;
      customer.isOverdue = customer.outstandingBalance > customer.creditLimit;
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Calculate virtual fields
    customer.creditAvailable = customer.creditLimit - customer.outstandingBalance;
    customer.isOverdue = customer.outstandingBalance > customer.creditLimit;

    return customer;
  }

  async findByCode(customerCode: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { customerCode },
    });
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Check if customer code already exists
    const existingCustomer = await this.findByCode(
      createCustomerDto.customerCode,
    );
    if (existingCustomer) {
      throw new ConflictException(
        `Customer with code ${createCustomerDto.customerCode} already exists`,
      );
    }

    // Validate email if provided
    if (createCustomerDto.email) {
      const emailExists = await this.customerRepository.findOne({
        where: { email: createCustomerDto.email },
      });
      if (emailExists) {
        throw new ConflictException(
          `Customer with email ${createCustomerDto.email} already exists`,
        );
      }
    }

    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    // Check if customer code is being changed and if it already exists
    if (
      updateCustomerDto.customerCode &&
      updateCustomerDto.customerCode !== customer.customerCode
    ) {
      const existingCustomer = await this.findByCode(
        updateCustomerDto.customerCode,
      );
      if (existingCustomer) {
        throw new ConflictException(
          `Customer with code ${updateCustomerDto.customerCode} already exists`,
        );
      }
    }

    // Check if email is being changed and if it already exists
    if (
      updateCustomerDto.email &&
      updateCustomerDto.email !== customer.email
    ) {
      const emailExists = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });
      if (emailExists) {
        throw new ConflictException(
          `Customer with email ${updateCustomerDto.email} already exists`,
        );
      }
    }

    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);

    // Check if customer has outstanding balance
    if (customer.outstandingBalance > 0) {
      throw new BadRequestException(
        `Cannot delete customer with outstanding balance of ${customer.outstandingBalance}`,
      );
    }

    await this.customerRepository.remove(customer);
  }

  async updateBalance(
    id: string,
    amount: number,
    type: 'add' | 'subtract',
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    if (type === 'add') {
      customer.outstandingBalance += amount;
    } else {
      customer.outstandingBalance -= amount;
    }

    return this.customerRepository.save(customer);
  }

  async updateSalesData(
    id: string,
    saleAmount: number,
    saleDate: Date,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    customer.totalSales += saleAmount;
    customer.lastSaleAmount = saleAmount;
    customer.lastSaleDate = saleDate;

    return this.customerRepository.save(customer);
  }

  async updateLoyaltyPoints(
    id: string,
    points: number,
    operation: 'add' | 'subtract',
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    if (operation === 'add') {
      customer.loyaltyPoints += points;
    } else {
      customer.loyaltyPoints = Math.max(0, customer.loyaltyPoints - points);
    }

    return this.customerRepository.save(customer);
  }

  async getCustomersByTerritory(territory: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { territory },
      order: { customerName: 'ASC' },
    });
  }

  async getCustomersBySalesPerson(salesPersonId: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { salesPersonId },
      order: { customerName: 'ASC' },
    });
  }

  async getTopCustomersBySales(limit: number = 10): Promise<Customer[]> {
    return this.customerRepository.find({
      order: { totalSales: 'DESC' },
      take: limit,
    });
  }

  async getCustomersWithOutstandingBalance(): Promise<Customer[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.outstandingBalance > 0')
      .orderBy('customer.outstandingBalance', 'DESC')
      .getMany();
  }

  async getCustomersExceedingCreditLimit(): Promise<Customer[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.outstandingBalance > customer.creditLimit')
      .orderBy('customer.outstandingBalance', 'DESC')
      .getMany();
  }
}
