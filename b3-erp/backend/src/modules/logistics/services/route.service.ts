import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route, RouteStatus } from '../entities';
import {
  CreateRouteDto,
  UpdateRouteDto,
  RouteResponseDto,
} from '../dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async create(createDto: CreateRouteDto): Promise<RouteResponseDto> {
    const existing = await this.routeRepository.findOne({
      where: { routeCode: createDto.routeCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Route with code ${createDto.routeCode} already exists`,
      );
    }

    const route = this.routeRepository.create({
      ...createDto,
      status: RouteStatus.ACTIVE,
    });

    const saved = await this.routeRepository.save(route);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<RouteResponseDto[]> {
    const query = this.routeRepository.createQueryBuilder('route');

    if (filters?.status) {
      query.andWhere('route.status = :status', { status: filters.status });
    }

    if (filters?.routeType) {
      query.andWhere('route.routeType = :type', { type: filters.routeType });
    }

    if (filters?.originCity) {
      query.andWhere('route.originCity = :city', { city: filters.originCity });
    }

    if (filters?.destinationCity) {
      query.andWhere('route.destinationCity = :city', {
        city: filters.destinationCity,
      });
    }

    query.orderBy('route.routeName', 'ASC');
    const routes = await query.getMany();
    return routes.map((r) => this.mapToResponseDto(r));
  }

  async findActive(): Promise<RouteResponseDto[]> {
    const routes = await this.routeRepository.find({
      where: { status: RouteStatus.ACTIVE },
      order: { routeName: 'ASC' },
    });
    return routes.map((r) => this.mapToResponseDto(r));
  }

  async findOne(id: string): Promise<RouteResponseDto> {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['trips'],
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    return this.mapToResponseDto(route);
  }

  async update(
    id: string,
    updateDto: UpdateRouteDto,
  ): Promise<RouteResponseDto> {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    Object.assign(route, updateDto);
    const updated = await this.routeRepository.save(route);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    await this.routeRepository.remove(route);
  }

  async optimizeRoute(id: string): Promise<RouteResponseDto> {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    // Placeholder for route optimization logic
    route.isOptimized = true;
    route.lastOptimizedAt = new Date();

    const updated = await this.routeRepository.save(route);
    return this.mapToResponseDto(updated);
  }

  async calculateDistance(id: string): Promise<any> {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    return {
      routeId: route.id,
      routeName: route.routeName,
      totalDistance: route.totalDistance,
      distanceUnit: route.distanceUnit,
      estimatedDuration: route.estimatedDurationMinutes,
      numberOfStops: route.numberOfStops,
    };
  }

  async getRoutePerformance(id: string): Promise<any> {
    const route = await this.routeRepository.findOne({ where: { id } });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    return {
      routeId: route.id,
      routeName: route.routeName,
      totalTripsCompleted: route.totalTripsCompleted,
      lastUsedDate: route.lastUsedDate,
      averageActualDuration: route.averageActualDuration,
      onTimePercentage: route.onTimePercentage,
    };
  }

  private mapToResponseDto(route: Route): RouteResponseDto {
    return {
      ...route,
    } as RouteResponseDto;
  }
}
