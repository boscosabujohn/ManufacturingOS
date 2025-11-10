import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Holiday } from '../entities/holiday.entity';
import {
  CreateHolidayDto,
  UpdateHolidayDto,
  HolidayResponseDto,
} from '../dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
  ) {}

  async create(createDto: CreateHolidayDto): Promise<HolidayResponseDto> {
    const holiday = this.holidayRepository.create(createDto);
    const saved = await this.holidayRepository.save(holiday);
    return this.mapToResponseDto(saved);
  }

  async findAll(): Promise<HolidayResponseDto[]> {
    const holidays = await this.holidayRepository.find({
      order: { date: 'ASC' },
    });
    return holidays.map((h) => this.mapToResponseDto(h));
  }

  async findOne(id: string): Promise<HolidayResponseDto> {
    const holiday = await this.holidayRepository.findOne({ where: { id } });
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return this.mapToResponseDto(holiday);
  }

  async update(id: string, updateDto: UpdateHolidayDto): Promise<HolidayResponseDto> {
    const holiday = await this.holidayRepository.findOne({ where: { id } });
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }

    Object.assign(holiday, updateDto);
    const updated = await this.holidayRepository.save(holiday);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const holiday = await this.holidayRepository.findOne({ where: { id } });
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    await this.holidayRepository.remove(holiday);
  }

  async getByYear(year: number): Promise<HolidayResponseDto[]> {
    const holidays = await this.holidayRepository.find({
      where: { year },
      order: { date: 'ASC' },
    });
    return holidays.map((h) => this.mapToResponseDto(h));
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<HolidayResponseDto[]> {
    const holidays = await this.holidayRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
    return holidays.map((h) => this.mapToResponseDto(h));
  }

  private mapToResponseDto(holiday: Holiday): HolidayResponseDto {
    return { ...holiday } as HolidayResponseDto;
  }
}
