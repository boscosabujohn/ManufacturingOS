import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Employee, EmployeeStatus } from '../entities/employee.entity';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeResponseDto,
} from '../dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const existing = await this.employeeRepository.findOne({
      where: { employeeCode: createDto.employeeCode },
    });

    if (existing) {
      throw new BadRequestException(`Employee with code ${createDto.employeeCode} already exists`);
    }

    const middleName = createDto.middleName || '';
    const fullName = `${createDto.firstName} ${middleName} ${createDto.lastName}`.replace(/\s+/g, ' ').trim();

    const employee = this.employeeRepository.create({
      ...createDto,
      fullName,
    });

    const saved = await this.employeeRepository.save(employee);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<EmployeeResponseDto[]> {
    const query = this.employeeRepository.createQueryBuilder('employee');

    if (filters?.departmentId) {
      query.andWhere('employee.departmentId = :departmentId', {
        departmentId: filters.departmentId,
      });
    }

    if (filters?.status) {
      query.andWhere('employee.status = :status', { status: filters.status });
    }

    if (filters?.search) {
      query.andWhere(
        '(employee.fullName ILIKE :search OR employee.employeeCode ILIKE :search OR employee.personalEmail ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    query.orderBy('employee.fullName', 'ASC');
    const employees = await query.getMany();
    return employees.map((e) => this.mapToResponseDto(e));
  }

  async findOne(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department', 'designation'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return this.mapToResponseDto(employee);
  }

  async update(id: string, updateDto: UpdateEmployeeDto): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    if (updateDto.firstName || updateDto.lastName) {
      const firstName = updateDto.firstName || employee.firstName;
      const middleName = updateDto.middleName || employee.middleName || '';
      const lastName = updateDto.lastName || employee.lastName;
      const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
      updateDto['fullName'] = fullName;
    }

    Object.assign(employee, updateDto);
    const updated = await this.employeeRepository.save(employee);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    await this.employeeRepository.remove(employee);
  }

  // Special HR Operations
  async onboard(id: string, data: any): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    employee.status = EmployeeStatus.ON_PROBATION;
    if (data.confirmationDate) {
      employee.confirmationDate = data.confirmationDate;
    }
    if (data.probationEndDate) {
      employee.probationEndDate = data.probationEndDate;
    }

    const updated = await this.employeeRepository.save(employee);
    return this.mapToResponseDto(updated);
  }

  async confirm(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    employee.status = EmployeeStatus.ACTIVE;
    employee.confirmationDate = new Date();

    const updated = await this.employeeRepository.save(employee);
    return this.mapToResponseDto(updated);
  }

  async transfer(id: string, data: { departmentId: string; designationId?: string; location?: string }): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    employee.departmentId = data.departmentId;
    if (data.designationId) {
      employee.designationId = data.designationId;
    }
    if (data.location) {
      employee.workLocation = data.location;
    }

    const updated = await this.employeeRepository.save(employee);
    return this.mapToResponseDto(updated);
  }

  async promote(id: string, data: { designationId: string; newSalary?: number }): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    employee.designationId = data.designationId;
    if (data.newSalary) {
      employee.basicSalary = data.newSalary;
      employee.grossSalary = data.newSalary;
    }

    const updated = await this.employeeRepository.save(employee);
    return this.mapToResponseDto(updated);
  }

  async terminate(id: string, data: { relievingDate: Date; lastWorkingDay: Date; exitReason: string }): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    employee.status = EmployeeStatus.TERMINATED;
    employee.relievingDate = data.relievingDate;
    employee.lastWorkingDay = data.lastWorkingDay;
    employee.exitReason = data.exitReason;
    employee.isExited = true;

    const updated = await this.employeeRepository.save(employee);
    return this.mapToResponseDto(updated);
  }

  async resign(id: string, data: { relievingDate: Date; lastWorkingDay: Date; exitReason: string }): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    employee.status = EmployeeStatus.RESIGNED;
    employee.relievingDate = data.relievingDate;
    employee.lastWorkingDay = data.lastWorkingDay;
    employee.exitReason = data.exitReason;
    employee.isExited = true;

    const updated = await this.employeeRepository.save(employee);
    return this.mapToResponseDto(updated);
  }

  async getActiveCount(): Promise<number> {
    return await this.employeeRepository.count({
      where: { status: EmployeeStatus.ACTIVE },
    });
  }

  async getByDepartment(departmentId: string): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeeRepository.find({
      where: { departmentId },
      order: { fullName: 'ASC' },
    });
    return employees.map((e) => this.mapToResponseDto(e));
  }

  private mapToResponseDto(employee: Employee): EmployeeResponseDto {
    return { ...employee } as any;
  }
}
