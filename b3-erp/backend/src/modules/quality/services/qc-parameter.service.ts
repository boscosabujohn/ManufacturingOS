import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QCParameter } from '../entities/qc-parameter.entity';
import { CreateQCParameterDto, UpdateQCParameterDto, QCParameterResponseDto } from '../dto';

@Injectable()
export class QCParameterService {
  constructor(
    @InjectRepository(QCParameter)
    private readonly qcParameterRepository: Repository<QCParameter>,
  ) {}

  async create(createDto: CreateQCParameterDto): Promise<QCParameterResponseDto> {
    const parameter = this.qcParameterRepository.create(createDto);
    const savedParameter = await this.qcParameterRepository.save(parameter);
    return this.mapToResponseDto(savedParameter);
  }

  async findAll(filters?: {
    qcTemplateId?: string;
    isActive?: boolean;
  }): Promise<QCParameterResponseDto[]> {
    const query = this.qcParameterRepository.createQueryBuilder('qp');

    if (filters?.qcTemplateId) {
      query.andWhere('qp.qcTemplateId = :qcTemplateId', {
        qcTemplateId: filters.qcTemplateId,
      });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('qp.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('qp.sequence', 'ASC');

    const parameters = await query.getMany();
    return parameters.map((p) => this.mapToResponseDto(p));
  }

  async findOne(id: string): Promise<QCParameterResponseDto> {
    const parameter = await this.qcParameterRepository.findOne({
      where: { id },
    });

    if (!parameter) {
      throw new NotFoundException(`QC Parameter with ID ${id} not found`);
    }

    return this.mapToResponseDto(parameter);
  }

  async update(
    id: string,
    updateDto: UpdateQCParameterDto,
  ): Promise<QCParameterResponseDto> {
    const parameter = await this.qcParameterRepository.findOne({
      where: { id },
    });

    if (!parameter) {
      throw new NotFoundException(`QC Parameter with ID ${id} not found`);
    }

    Object.assign(parameter, updateDto);
    const updatedParameter = await this.qcParameterRepository.save(parameter);
    return this.mapToResponseDto(updatedParameter);
  }

  async remove(id: string): Promise<void> {
    const parameter = await this.qcParameterRepository.findOne({
      where: { id },
    });

    if (!parameter) {
      throw new NotFoundException(`QC Parameter with ID ${id} not found`);
    }

    await this.qcParameterRepository.remove(parameter);
  }

  private mapToResponseDto(parameter: QCParameter): QCParameterResponseDto {
    return {
      id: parameter.id,
      qcTemplateId: parameter.qcTemplateId,
      parameterCode: parameter.parameterCode,
      parameterName: parameter.parameterName,
      parameterType: parameter.parameterType,
      dataType: parameter.dataType,
      criticality: parameter.criticality,
      sequence: parameter.sequence,
      isMandatory: parameter.isMandatory,
      uom: parameter.uom,
      lowerSpecLimit: parameter.lowerSpecLimit,
      upperSpecLimit: parameter.upperSpecLimit,
      targetValue: parameter.targetValue,
      isActive: parameter.isActive,
      createdAt: parameter.createdAt,
      updatedAt: parameter.updatedAt,
    };
  }
}
