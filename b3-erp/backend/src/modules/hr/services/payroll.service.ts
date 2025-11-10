import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payroll, PayrollStatus } from '../entities/payroll.entity';
import { SalarySlip, SalarySlipStatus } from '../entities/salary-slip.entity';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private readonly repository: Repository<Payroll>,
    @InjectRepository(SalarySlip)
    private readonly salarySlipRepository: Repository<SalarySlip>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: any): Promise<any> {
    const payrollNumber = await this.generatePayrollNumber();
    const entity = this.repository.create({
      ...createDto,
      payrollNumber,
      status: PayrollStatus.DRAFT,
    });
    return await this.repository.save(entity);
  }

  async findAll(filters?: any): Promise<any[]> {
    const query = this.repository.createQueryBuilder('entity');

    if (filters) {
      if (filters.month) {
        query.andWhere('entity.month = :month', { month: filters.month });
      }
      if (filters.year) {
        query.andWhere('entity.year = :year', { year: filters.year });
      }
      if (filters.status) {
        query.andWhere('entity.status = :status', { status: filters.status });
      }
    }

    query.orderBy('entity.year', 'DESC').addOrderBy('entity.month', 'DESC');
    return await query.getMany();
  }

  async findOne(id: string): Promise<any> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['salarySlips'],
    });
    if (!entity) {
      throw new NotFoundException(`Payroll with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, updateDto: any): Promise<any> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return await this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    if (entity.status !== PayrollStatus.DRAFT) {
      throw new BadRequestException('Only draft payrolls can be deleted');
    }
    await this.repository.remove(entity);
  }

  // Special Operations
  async processPayroll(id: string): Promise<any> {
    const payroll = await this.findOne(id);

    if (payroll.status !== PayrollStatus.DRAFT) {
      throw new BadRequestException('Only draft payrolls can be processed');
    }

    return await this.dataSource.transaction(async (manager) => {
      payroll.status = PayrollStatus.PROCESSING;
      await manager.save(Payroll, payroll);

      // Get all active employees
      const employees = await this.employeeRepository.find({
        where: { status: 'Active' as any },
      });

      let totalGross = 0;
      let totalDeductions = 0;
      let totalNet = 0;

      // Generate salary slips for each employee
      for (const employee of employees) {
        const slipNumber = await this.generateSlipNumber(payroll.id);

        const salarySlip = manager.create(SalarySlip, {
          slipNumber,
          payrollId: payroll.id,
          employeeId: employee.id,
          employeeCode: employee.employeeCode,
          employeeName: employee.fullName,
          designation: employee.designationId,
          department: employee.departmentId,
          month: payroll.month,
          year: payroll.year,
          paymentDate: payroll.paymentDate,
          workingDays: 26,
          presentDays: 26,
          paidDays: 26,
          earnings: [
            { component: 'Basic Salary', amount: employee.basicSalary, isTaxable: true },
          ],
          grossSalary: employee.grossSalary,
          deductions: [],
          totalDeductions: 0,
          netSalary: employee.grossSalary,
          status: SalarySlipStatus.GENERATED,
        });

        await manager.save(SalarySlip, salarySlip);

        totalGross += employee.grossSalary;
        totalNet += employee.grossSalary;
      }

      payroll.totalEmployees = employees.length;
      payroll.processedEmployees = employees.length;
      payroll.totalGrossSalary = totalGross;
      payroll.totalDeductions = totalDeductions;
      payroll.totalNetSalary = totalNet;
      payroll.status = PayrollStatus.PROCESSED;
      payroll.processedAt = new Date();

      return await manager.save(Payroll, payroll);
    });
  }

  async approvePayroll(id: string, approvedBy: string): Promise<any> {
    const payroll = await this.findOne(id);

    if (payroll.status !== PayrollStatus.PROCESSED) {
      throw new BadRequestException('Only processed payrolls can be approved');
    }

    payroll.status = PayrollStatus.APPROVED;
    payroll.approvedBy = approvedBy;
    payroll.approvedAt = new Date();

    return await this.repository.save(payroll);
  }

  async postToGL(id: string, postedBy: string): Promise<any> {
    const payroll = await this.findOne(id);

    if (payroll.status !== PayrollStatus.APPROVED) {
      throw new BadRequestException('Only approved payrolls can be posted');
    }

    payroll.status = PayrollStatus.POSTED;
    payroll.isPosted = true;
    payroll.postedBy = postedBy;
    payroll.postedAt = new Date();

    return await this.repository.save(payroll);
  }

  async markAsPaid(id: string, paidBy: string, paymentRef: string): Promise<any> {
    const payroll = await this.findOne(id);

    if (payroll.status !== PayrollStatus.POSTED) {
      throw new BadRequestException('Only posted payrolls can be marked as paid');
    }

    payroll.status = PayrollStatus.PAID;
    payroll.isPaid = true;
    payroll.paidBy = paidBy;
    payroll.paidAt = new Date();
    payroll.paymentReferenceNumber = paymentRef;

    return await this.repository.save(payroll);
  }

  async generatePayAdvice(id: string): Promise<any> {
    const payroll = await this.findOne(id);
    return {
      payrollNumber: payroll.payrollNumber,
      month: payroll.month,
      year: payroll.year,
      totalEmployees: payroll.totalEmployees,
      totalAmount: payroll.totalNetSalary,
      paymentDate: payroll.paymentDate,
    };
  }

  private async generatePayrollNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.repository.count();
    return `PAY-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private async generateSlipNumber(payrollId: string): Promise<string> {
    const count = await this.salarySlipRepository.count({ where: { payrollId } });
    const year = new Date().getFullYear();
    return `SLIP-${year}-${String(count + 1).padStart(6, '0')}`;
  }
}
