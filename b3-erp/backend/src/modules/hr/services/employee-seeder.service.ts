import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Employee,
  EmployeeStatus,
  EmploymentType,
  Gender,
  MaritalStatus,
  BloodGroup,
} from '../entities/employee.entity';
import { Department } from '../entities/department.entity';
import { Designation } from '../entities/designation.entity';
import { Shift } from '../entities/shift.entity';

interface DemoEmployeeData {
  firstName: string;
  lastName: string;
  gender: Gender;
  departmentCode: string;
  designationCode: string;
  shiftCode: string;
  employmentType: EmploymentType;
  yearsOfExperience: number;
  basicSalary: number;
}

@Injectable()
export class EmployeeSeederService implements OnModuleInit {
  private readonly logger = new Logger(EmployeeSeederService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async onModuleInit(): Promise<void> {
    // Delay to ensure departments, designations, and shifts are seeded first
    setTimeout(() => this.seedEmployees(), 4000);
  }

  async seedEmployees(): Promise<void> {
    this.logger.log('Seeding demo employees...');

    // Demo employee data
    const demoEmployees: DemoEmployeeData[] = [
      // Management
      { firstName: 'Rajesh', lastName: 'Kumar', gender: Gender.MALE, departmentCode: 'MGMT', designationCode: 'CEO', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 20, basicSalary: 250000 },
      { firstName: 'Priya', lastName: 'Sharma', gender: Gender.FEMALE, departmentCode: 'MGMT', designationCode: 'COO', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 15, basicSalary: 200000 },

      // HR Department
      { firstName: 'Anita', lastName: 'Desai', gender: Gender.FEMALE, departmentCode: 'HR', designationCode: 'MANAGER', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 10, basicSalary: 80000 },
      { firstName: 'Vikram', lastName: 'Singh', gender: Gender.MALE, departmentCode: 'HR', designationCode: 'SR_EXEC', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 5, basicSalary: 50000 },

      // Finance Department
      { firstName: 'Suresh', lastName: 'Patel', gender: Gender.MALE, departmentCode: 'FIN', designationCode: 'CFO', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 18, basicSalary: 180000 },
      { firstName: 'Meera', lastName: 'Nair', gender: Gender.FEMALE, departmentCode: 'FIN', designationCode: 'MANAGER', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 8, basicSalary: 75000 },

      // Production Department
      { firstName: 'Amit', lastName: 'Verma', gender: Gender.MALE, departmentCode: 'PROD', designationCode: 'GM', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 12, basicSalary: 120000 },
      { firstName: 'Kiran', lastName: 'Reddy', gender: Gender.MALE, departmentCode: 'PROD', designationCode: 'ASST_MANAGER', shiftCode: 'MORNING', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 6, basicSalary: 55000 },
      { firstName: 'Deepak', lastName: 'Joshi', gender: Gender.MALE, departmentCode: 'PROD', designationCode: 'EXEC', shiftCode: 'EVENING', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 3, basicSalary: 35000 },
      { firstName: 'Ravi', lastName: 'Menon', gender: Gender.MALE, departmentCode: 'PROD', designationCode: 'JR_EXEC', shiftCode: 'NIGHT', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 1, basicSalary: 25000 },

      // Quality Control
      { firstName: 'Sunita', lastName: 'Rao', gender: Gender.FEMALE, departmentCode: 'QC', designationCode: 'MANAGER', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 9, basicSalary: 70000 },
      { firstName: 'Ajay', lastName: 'Pillai', gender: Gender.MALE, departmentCode: 'QC', designationCode: 'SR_EXEC', shiftCode: 'MORNING', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 4, basicSalary: 45000 },

      // Stores & Inventory
      { firstName: 'Mohan', lastName: 'Das', gender: Gender.MALE, departmentCode: 'STORE', designationCode: 'ASST_MANAGER', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 7, basicSalary: 50000 },
      { firstName: 'Lakshmi', lastName: 'Iyer', gender: Gender.FEMALE, departmentCode: 'STORE', designationCode: 'EXEC', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 2, basicSalary: 32000 },

      // IT Department
      { firstName: 'Arun', lastName: 'Gupta', gender: Gender.MALE, departmentCode: 'IT', designationCode: 'CTO', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 14, basicSalary: 150000 },
      { firstName: 'Neha', lastName: 'Agarwal', gender: Gender.FEMALE, departmentCode: 'IT', designationCode: 'SR_EXEC', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 5, basicSalary: 60000 },

      // Sales & Marketing
      { firstName: 'Sanjay', lastName: 'Malhotra', gender: Gender.MALE, departmentCode: 'SALES', designationCode: 'AGM', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 10, basicSalary: 90000 },
      { firstName: 'Pooja', lastName: 'Mehta', gender: Gender.FEMALE, departmentCode: 'SALES', designationCode: 'EXEC', shiftCode: 'GENERAL', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 3, basicSalary: 40000 },

      // Maintenance
      { firstName: 'Ramesh', lastName: 'Yadav', gender: Gender.MALE, departmentCode: 'MAINT', designationCode: 'ASST_MANAGER', shiftCode: 'MORNING', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 8, basicSalary: 48000 },

      // Dispatch & Logistics
      { firstName: 'Ganesh', lastName: 'Patil', gender: Gender.MALE, departmentCode: 'DISPATCH', designationCode: 'EXEC', shiftCode: 'MORNING', employmentType: EmploymentType.FULL_TIME, yearsOfExperience: 4, basicSalary: 35000 },
    ];

    // Load departments, designations, and shifts into maps for quick lookup
    const departments = await this.departmentRepository.find();
    const designations = await this.designationRepository.find();
    const shifts = await this.shiftRepository.find();

    const departmentMap = new Map(departments.map(d => [d.code, d]));
    const designationMap = new Map(designations.map(d => [d.code, d]));
    const shiftMap = new Map(shifts.map(s => [s.code, s]));

    let employeeCounter = 1;

    for (const empData of demoEmployees) {
      try {
        const employeeCode = `EMP${String(employeeCounter).padStart(4, '0')}`;

        // Check if employee already exists
        const existing = await this.employeeRepository.findOne({
          where: { employeeCode },
        });

        if (existing) {
          this.logger.debug(`Employee ${employeeCode} already exists, skipping...`);
          employeeCounter++;
          continue;
        }

        // Get related entities
        const department = departmentMap.get(empData.departmentCode);
        const designation = designationMap.get(empData.designationCode);
        const shift = shiftMap.get(empData.shiftCode);

        if (!department || !designation) {
          this.logger.warn(`Missing department or designation for ${empData.firstName} ${empData.lastName}, skipping...`);
          employeeCounter++;
          continue;
        }

        // Calculate dates
        const joiningDate = new Date();
        joiningDate.setFullYear(joiningDate.getFullYear() - empData.yearsOfExperience);
        joiningDate.setMonth(Math.floor(Math.random() * 12));

        const dateOfBirth = new Date();
        dateOfBirth.setFullYear(dateOfBirth.getFullYear() - (22 + empData.yearsOfExperience + Math.floor(Math.random() * 10)));
        dateOfBirth.setMonth(Math.floor(Math.random() * 12));
        dateOfBirth.setDate(Math.floor(Math.random() * 28) + 1);

        // Calculate salary components
        const grossSalary = Math.round(empData.basicSalary * 1.4);
        const ctc = Math.round(empData.basicSalary * 1.6);

        // Generate email
        const email = `${empData.firstName.toLowerCase()}.${empData.lastName.toLowerCase()}@manufacturingos.com`;
        const personalEmail = `${empData.firstName.toLowerCase()}.${empData.lastName.toLowerCase()}@gmail.com`;

        // Random blood group
        const bloodGroups = Object.values(BloodGroup);
        const randomBloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];

        // Random marital status (weighted toward married for senior employees)
        const isMarried = empData.yearsOfExperience > 5 ? Math.random() > 0.3 : Math.random() > 0.7;
        const maritalStatus = isMarried ? MaritalStatus.MARRIED : MaritalStatus.SINGLE;

        // Determine employee status
        let status = EmployeeStatus.ACTIVE;
        if (empData.yearsOfExperience < 1) {
          status = EmployeeStatus.ON_PROBATION;
        }

        const employee = this.employeeRepository.create({
          employeeCode,
          firstName: empData.firstName,
          lastName: empData.lastName,
          fullName: `${empData.firstName} ${empData.lastName}`,
          dateOfBirth,
          gender: empData.gender,
          maritalStatus,
          bloodGroup: randomBloodGroup,
          nationality: 'Indian',
          personalEmail,
          companyEmail: email,
          mobileNumber: `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`,
          currentAddress: `${Math.floor(Math.random() * 500) + 1}, Sector ${Math.floor(Math.random() * 50) + 1}, Industrial Area, City`,
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: `${Math.floor(400000 + Math.random() * 99999)}`,
          country: 'India',
          departmentId: department.id,
          designationId: designation.id,
          shiftId: shift?.id,
          employmentType: empData.employmentType,
          joiningDate,
          confirmationDate: empData.yearsOfExperience > 0 ? new Date(joiningDate.getTime() + 180 * 24 * 60 * 60 * 1000) : undefined,
          status,
          basicSalary: empData.basicSalary,
          grossSalary,
          ctc,
          salaryFrequency: 'Monthly',
          paymentMode: 'Bank Transfer',
          bankName: 'State Bank of India',
          bankBranch: 'Industrial Area Branch',
          accountNumber: `${Math.floor(10000000000 + Math.random() * 89999999999)}`,
          ifscCode: 'SBIN0001234',
          accountHolderName: `${empData.firstName} ${empData.lastName}`,
          panNumber: `ABCDE${Math.floor(1000 + Math.random() * 8999)}F`,
          emergencyContactName: empData.gender === Gender.MALE ? 'Spouse/Parent' : 'Spouse/Parent',
          emergencyContactRelation: isMarried ? 'Spouse' : 'Parent',
          emergencyContactPhone: `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`,
          education: [
            {
              degree: empData.yearsOfExperience > 10 ? 'MBA' : 'Bachelor of Engineering',
              institution: 'University of Mumbai',
              yearOfPassing: new Date().getFullYear() - empData.yearsOfExperience - 4,
              percentage: Math.floor(60 + Math.random() * 30),
            },
          ],
          skills: this.getSkillsForDepartment(empData.departmentCode),
          notes: `Demo employee for ${department.name} department`,
          customFields: {
            seededAt: new Date().toISOString(),
            source: 'system-seeder',
          },
          createdBy: 'system',
        } as Partial<Employee>);

        await this.employeeRepository.save(employee);
        this.logger.log(`Created employee: ${employeeCode} - ${empData.firstName} ${empData.lastName} (${department.name})`);
        employeeCounter++;
      } catch (error) {
        this.logger.error(`Failed to seed employee ${empData.firstName} ${empData.lastName}: ${error.message}`);
        employeeCounter++;
      }
    }

    this.logger.log(`Employee seeding completed. Total: ${employeeCounter - 1} employees`);
  }

  private getSkillsForDepartment(departmentCode: string): string[] {
    const skillsMap: Record<string, string[]> = {
      MGMT: ['Leadership', 'Strategic Planning', 'Decision Making', 'Team Building', 'Business Development'],
      HR: ['Recruitment', 'Employee Relations', 'Payroll Management', 'Training & Development', 'Compliance'],
      FIN: ['Financial Analysis', 'Budgeting', 'Accounting', 'Tax Planning', 'Auditing'],
      SALES: ['Sales Management', 'Customer Relations', 'Negotiation', 'Market Analysis', 'CRM'],
      PROD: ['Production Planning', 'Quality Control', 'Lean Manufacturing', 'Machine Operation', 'Safety Management'],
      QC: ['Quality Assurance', 'Testing', 'ISO Standards', 'Statistical Analysis', 'Documentation'],
      STORE: ['Inventory Management', 'Warehouse Operations', 'Stock Control', 'ERP Systems', 'Logistics'],
      MAINT: ['Equipment Maintenance', 'Preventive Maintenance', 'Troubleshooting', 'Electrical Systems', 'Mechanical Systems'],
      IT: ['System Administration', 'Network Management', 'Database Management', 'Cybersecurity', 'Software Development'],
      ADMIN: ['Office Management', 'Document Management', 'Scheduling', 'Communication', 'Vendor Management'],
      DISPATCH: ['Logistics Coordination', 'Route Planning', 'Shipment Tracking', 'Customer Service', 'Documentation'],
    };

    return skillsMap[departmentCode] || ['General Skills'];
  }
}
