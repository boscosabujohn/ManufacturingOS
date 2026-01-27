import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentResponseDto,
} from '../dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }

  async create(createDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const existing = await this.departmentRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Department with code ${createDto.code} already exists`);
    }

    const department = this.departmentRepository.create(createDto);
    const saved = await this.departmentRepository.save(department);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentRepository.find({
      order: { name: 'ASC' },
    });
    return departments.map((d) => this.mapToResponseDto(d));
  }

  async findOne(id: string): Promise<DepartmentResponseDto> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return this.mapToResponseDto(department);
  }

  async update(id: string, updateDto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    Object.assign(department, updateDto);
    const updated = await this.departmentRepository.save(department);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    await this.departmentRepository.remove(department);
  }

  async getHierarchy(): Promise<any> {
    const departments = await this.departmentRepository.find();
    return this.buildHierarchy(departments);
  }

  private buildHierarchy(departments: Department[], parentId: string | null = null): any[] {
    return departments
      .filter((d) => d.parentDepartmentId === parentId)
      .map((d) => ({
        ...d,
        children: this.buildHierarchy(departments, d.id),
      }));
  }

  private mapToResponseDto(department: Department): DepartmentResponseDto {
    return { ...department } as DepartmentResponseDto;
  }
}
