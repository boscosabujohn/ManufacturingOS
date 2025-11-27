import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../entities/shift.entity';
import {
  CreateShiftDto,
  UpdateShiftDto,
  ShiftResponseDto,
} from '../dto';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) { }

  async create(createDto: CreateShiftDto): Promise<ShiftResponseDto> {
    const existing = await this.shiftRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Shift with code ${createDto.code} already exists`);
    }

    const shift = this.shiftRepository.create(createDto);
    const saved = await this.shiftRepository.save(shift);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<ShiftResponseDto[]> {
    const shifts = await this.shiftRepository.find({
      order: { name: 'ASC' },
    });
    return shifts.map((s) => this.mapToResponseDto(s));
  }

  async findOne(id: string): Promise<ShiftResponseDto> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return this.mapToResponseDto(shift);
  }

  async update(id: string, updateDto: UpdateShiftDto): Promise<ShiftResponseDto> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    Object.assign(shift, updateDto);
    const updated = await this.shiftRepository.save(shift);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    await this.shiftRepository.remove(shift);
  }

  private mapToResponseDto(shift: Shift): ShiftResponseDto {
    return { ...shift } as ShiftResponseDto;
  }
}
