import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectionResult as InspectionResultEntity, ResultStatus } from '../entities/inspection-result.entity';
import { CreateInspectionResultDto, UpdateInspectionResultDto, InspectionResultResponseDto } from '../dto';

@Injectable()
export class InspectionResultService {
  constructor(
    @InjectRepository(InspectionResultEntity)
    private readonly inspectionResultRepository: Repository<InspectionResultEntity>,
  ) {}

  async create(createDto: CreateInspectionResultDto): Promise<InspectionResultResponseDto> {
    const result = this.inspectionResultRepository.create(createDto);

    // Auto-evaluate if numeric value provided
    if (result.numericValue !== null && result.numericValue !== undefined) {
      result.isWithinSpec = this.checkWithinSpec(
        result.numericValue,
        result.lowerSpecLimit,
        result.upperSpecLimit,
      );
      result.status = result.isWithinSpec ? ResultStatus.PASS : ResultStatus.FAIL;
    }

    const savedResult = await this.inspectionResultRepository.save(result);
    return this.mapToResponseDto(savedResult);
  }

  async findAll(filters?: {
    inspectionId?: string;
  }): Promise<InspectionResultResponseDto[]> {
    const query = this.inspectionResultRepository.createQueryBuilder('ir');

    if (filters?.inspectionId) {
      query.andWhere('ir.inspectionId = :inspectionId', {
        inspectionId: filters.inspectionId,
      });
    }

    query.orderBy('ir.sequence', 'ASC');

    const results = await query.getMany();
    return results.map((r) => this.mapToResponseDto(r));
  }

  async findOne(id: string): Promise<InspectionResultResponseDto> {
    const result = await this.inspectionResultRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(`Inspection Result with ID ${id} not found`);
    }

    return this.mapToResponseDto(result);
  }

  async update(
    id: string,
    updateDto: UpdateInspectionResultDto,
  ): Promise<InspectionResultResponseDto> {
    const result = await this.inspectionResultRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(`Inspection Result with ID ${id} not found`);
    }

    Object.assign(result, updateDto);

    // Re-evaluate if numeric value changed
    if (updateDto.numericValue !== undefined) {
      result.isWithinSpec = this.checkWithinSpec(
        result.numericValue,
        result.lowerSpecLimit,
        result.upperSpecLimit,
      );
      result.status = result.isWithinSpec ? ResultStatus.PASS : ResultStatus.FAIL;
    }

    const updatedResult = await this.inspectionResultRepository.save(result);
    return this.mapToResponseDto(updatedResult);
  }

  async remove(id: string): Promise<void> {
    const result = await this.inspectionResultRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException(`Inspection Result with ID ${id} not found`);
    }

    await this.inspectionResultRepository.remove(result);
  }

  private checkWithinSpec(value: number, lsl: number, usl: number): boolean {
    if (lsl !== null && lsl !== undefined && value < lsl) return false;
    if (usl !== null && usl !== undefined && value > usl) return false;
    return true;
  }

  private mapToResponseDto(result: InspectionResultEntity): InspectionResultResponseDto {
    return {
      id: result.id,
      inspectionId: result.inspectionId,
      parameterName: result.parameterName,
      sequence: result.sequence,
      status: result.status,
      measuredValue: result.measuredValue,
      numericValue: result.numericValue,
      isWithinSpec: result.isWithinSpec,
      hasDefect: result.hasDefect,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
