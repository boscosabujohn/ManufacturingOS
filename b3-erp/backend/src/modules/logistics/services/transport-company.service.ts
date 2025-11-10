import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportCompany, TransportCompanyStatus } from '../entities';
import {
  CreateTransportCompanyDto,
  UpdateTransportCompanyDto,
  TransportCompanyResponseDto,
} from '../dto';

@Injectable()
export class TransportCompanyService {
  constructor(
    @InjectRepository(TransportCompany)
    private readonly transportCompanyRepository: Repository<TransportCompany>,
  ) {}

  async create(
    createDto: CreateTransportCompanyDto,
  ): Promise<TransportCompanyResponseDto> {
    const existing = await this.transportCompanyRepository.findOne({
      where: { companyCode: createDto.companyCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Transport Company with code ${createDto.companyCode} already exists`,
      );
    }

    const company = this.transportCompanyRepository.create({
      ...createDto,
      status: TransportCompanyStatus.ACTIVE,
    });

    const saved = await this.transportCompanyRepository.save(company);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<TransportCompanyResponseDto[]> {
    const query = this.transportCompanyRepository.createQueryBuilder('company');

    if (filters?.status) {
      query.andWhere('company.status = :status', { status: filters.status });
    }

    if (filters?.companyType) {
      query.andWhere('company.companyType = :type', {
        type: filters.companyType,
      });
    }

    if (filters?.city) {
      query.andWhere('company.city = :city', { city: filters.city });
    }

    query.orderBy('company.companyName', 'ASC');
    const companies = await query.getMany();
    return companies.map((c) => this.mapToResponseDto(c));
  }

  async findActive(): Promise<TransportCompanyResponseDto[]> {
    const companies = await this.transportCompanyRepository.find({
      where: { status: TransportCompanyStatus.ACTIVE },
      order: { companyName: 'ASC' },
    });
    return companies.map((c) => this.mapToResponseDto(c));
  }

  async findOne(id: string): Promise<TransportCompanyResponseDto> {
    const company = await this.transportCompanyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Transport Company with ID ${id} not found`);
    }

    return this.mapToResponseDto(company);
  }

  async update(
    id: string,
    updateDto: UpdateTransportCompanyDto,
  ): Promise<TransportCompanyResponseDto> {
    const company = await this.transportCompanyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Transport Company with ID ${id} not found`);
    }

    Object.assign(company, updateDto);
    const updated = await this.transportCompanyRepository.save(company);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const company = await this.transportCompanyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Transport Company with ID ${id} not found`);
    }

    await this.transportCompanyRepository.remove(company);
  }

  async activate(id: string): Promise<TransportCompanyResponseDto> {
    const company = await this.transportCompanyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Transport Company with ID ${id} not found`);
    }

    company.status = TransportCompanyStatus.ACTIVE;
    const updated = await this.transportCompanyRepository.save(company);
    return this.mapToResponseDto(updated);
  }

  async deactivate(id: string): Promise<TransportCompanyResponseDto> {
    const company = await this.transportCompanyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Transport Company with ID ${id} not found`);
    }

    company.status = TransportCompanyStatus.INACTIVE;
    const updated = await this.transportCompanyRepository.save(company);
    return this.mapToResponseDto(updated);
  }

  async blacklist(id: string, reason: string): Promise<TransportCompanyResponseDto> {
    const company = await this.transportCompanyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Transport Company with ID ${id} not found`);
    }

    company.status = TransportCompanyStatus.BLACKLISTED;
    company.blacklistReason = reason;
    const updated = await this.transportCompanyRepository.save(company);
    return this.mapToResponseDto(updated);
  }

  async getPerformance(id: string): Promise<any> {
    const company = await this.transportCompanyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Transport Company with ID ${id} not found`);
    }

    return {
      companyId: company.id,
      companyCode: company.companyCode,
      companyName: company.companyName,
      performanceRating: company.performanceRating,
      totalShipmentsHandled: company.totalShipmentsHandled,
      onTimeDeliveries: company.onTimeDeliveries,
      onTimeDeliveryRate: company.onTimeDeliveryRate,
      damagedShipments: company.damagedShipments,
      lostShipments: company.lostShipments,
      customerComplaints: company.customerComplaints,
      totalBusinessValue: company.totalBusinessValue,
    };
  }

  private mapToResponseDto(
    company: TransportCompany,
  ): TransportCompanyResponseDto {
    return {
      ...company,
    } as TransportCompanyResponseDto;
  }
}
