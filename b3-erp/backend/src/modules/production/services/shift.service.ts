import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from '../entities/shift.entity';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async create(createDto: Partial<Shift>): Promise<Shift> {
    const existing = await this.shiftRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Shift ${createDto.code} already exists`);
    }

    const shift = this.shiftRepository.create(createDto);
    return this.shiftRepository.save(shift);
  }

  async findAll(filters?: {
    companyId?: string;
    isActive?: boolean;
  }): Promise<Shift[]> {
    const query = this.shiftRepository.createQueryBuilder('shift');

    if (filters?.companyId) {
      query.andWhere('shift.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('shift.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('shift.startTime', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return shift;
  }

  async update(id: string, updateDto: Partial<Shift>): Promise<Shift> {
    const shift = await this.findOne(id);
    Object.assign(shift, updateDto);
    return this.shiftRepository.save(shift);
  }

  async remove(id: string): Promise<void> {
    const shift = await this.findOne(id);
    await this.shiftRepository.remove(shift);
  }

  async getCurrentShift(companyId: string): Promise<Shift | null> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const shifts = await this.findAll({ companyId, isActive: true });

    for (const shift of shifts) {
      if (shift.startTime <= currentTime && shift.endTime >= currentTime) {
        return shift;
      }
    }

    return null;
  }
}
