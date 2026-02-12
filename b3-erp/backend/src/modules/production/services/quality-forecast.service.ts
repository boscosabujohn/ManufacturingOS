import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QualityForecast, ForecastType, ForecastStatus } from '../entities/quality-forecast.entity';

@Injectable()
export class QualityForecastService {
  constructor(
    @InjectRepository(QualityForecast)
    private readonly qualityForecastRepository: Repository<QualityForecast>,
  ) {}

  async create(createDto: Partial<QualityForecast>): Promise<QualityForecast> {
    const existing = await this.qualityForecastRepository.findOne({
      where: { forecastNumber: createDto.forecastNumber },
    });

    if (existing) {
      throw new BadRequestException(`Quality Forecast ${createDto.forecastNumber} already exists`);
    }

    const forecast = this.qualityForecastRepository.create(createDto);
    return this.qualityForecastRepository.save(forecast);
  }

  async findAll(filters?: {
    companyId?: string;
    forecastType?: ForecastType;
    status?: ForecastStatus;
    productId?: string;
  }): Promise<QualityForecast[]> {
    const query = this.qualityForecastRepository.createQueryBuilder('forecast');

    if (filters?.companyId) {
      query.andWhere('forecast.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.forecastType) {
      query.andWhere('forecast.forecastType = :forecastType', { forecastType: filters.forecastType });
    }

    if (filters?.status) {
      query.andWhere('forecast.status = :status', { status: filters.status });
    }

    if (filters?.productId) {
      query.andWhere('forecast.productId = :productId', { productId: filters.productId });
    }

    query.orderBy('forecast.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<QualityForecast> {
    const forecast = await this.qualityForecastRepository.findOne({ where: { id } });
    if (!forecast) {
      throw new NotFoundException(`Quality Forecast with ID ${id} not found`);
    }
    return forecast;
  }

  async update(id: string, updateDto: Partial<QualityForecast>): Promise<QualityForecast> {
    const forecast = await this.findOne(id);
    Object.assign(forecast, updateDto);
    return this.qualityForecastRepository.save(forecast);
  }

  async remove(id: string): Promise<void> {
    const forecast = await this.findOne(id);
    if (forecast.status !== 'draft') {
      throw new BadRequestException('Only draft forecasts can be deleted');
    }
    await this.qualityForecastRepository.remove(forecast);
  }

  async activate(id: string): Promise<QualityForecast> {
    const forecast = await this.findOne(id);
    forecast.status = 'active';
    return this.qualityForecastRepository.save(forecast);
  }

  async validate(id: string, validatedBy: string): Promise<QualityForecast> {
    const forecast = await this.findOne(id);
    forecast.status = 'validated';
    forecast.validatedBy = validatedBy;
    forecast.validatedAt = new Date();
    return this.qualityForecastRepository.save(forecast);
  }

  async addValidationResult(id: string, result: any): Promise<QualityForecast> {
    const forecast = await this.findOne(id);
    if (!forecast.validationResults) {
      forecast.validationResults = [];
    }
    forecast.validationResults.push(result);
    return this.qualityForecastRepository.save(forecast);
  }

  async getForecastAccuracy(id: string): Promise<any> {
    const forecast = await this.findOne(id);

    if (!forecast.validationResults || forecast.validationResults.length === 0) {
      return {
        forecastId: forecast.id,
        hasValidation: false,
        accuracy: null,
      };
    }

    const avgAccuracy = forecast.validationResults.reduce((sum, r) => sum + r.accuracy, 0) / forecast.validationResults.length;

    return {
      forecastId: forecast.id,
      hasValidation: true,
      accuracy: avgAccuracy,
      validationCount: forecast.validationResults.length,
    };
  }
}
