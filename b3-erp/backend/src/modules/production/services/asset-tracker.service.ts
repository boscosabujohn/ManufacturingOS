import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetTracker, AssetStatus, AssetType } from '../entities/asset-tracker.entity';

@Injectable()
export class AssetTrackerService {
  constructor(
    @InjectRepository(AssetTracker)
    private readonly assetTrackerRepository: Repository<AssetTracker>,
  ) {}

  async create(createDto: Partial<AssetTracker>): Promise<AssetTracker> {
    const existing = await this.assetTrackerRepository.findOne({
      where: { assetCode: createDto.assetCode },
    });

    if (existing) {
      throw new BadRequestException(`Asset ${createDto.assetCode} already exists`);
    }

    const asset = this.assetTrackerRepository.create(createDto);
    return this.assetTrackerRepository.save(asset);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: AssetStatus;
    assetType?: AssetType;
  }): Promise<AssetTracker[]> {
    const query = this.assetTrackerRepository.createQueryBuilder('asset');

    if (filters?.companyId) {
      query.andWhere('asset.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('asset.status = :status', { status: filters.status });
    }

    if (filters?.assetType) {
      query.andWhere('asset.assetType = :assetType', { assetType: filters.assetType });
    }

    query.orderBy('asset.assetName', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<AssetTracker> {
    const asset = await this.assetTrackerRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async findByCode(assetCode: string): Promise<AssetTracker> {
    const asset = await this.assetTrackerRepository.findOne({ where: { assetCode } });
    if (!asset) {
      throw new NotFoundException(`Asset with code ${assetCode} not found`);
    }
    return asset;
  }

  async findByRFID(rfidTag: string): Promise<AssetTracker> {
    const asset = await this.assetTrackerRepository.findOne({ where: { rfidTag } });
    if (!asset) {
      throw new NotFoundException(`Asset with RFID ${rfidTag} not found`);
    }
    return asset;
  }

  async update(id: string, updateDto: Partial<AssetTracker>): Promise<AssetTracker> {
    const asset = await this.findOne(id);
    Object.assign(asset, updateDto);
    return this.assetTrackerRepository.save(asset);
  }

  async remove(id: string): Promise<void> {
    const asset = await this.findOne(id);
    await this.assetTrackerRepository.remove(asset);
  }

  async updateLocation(id: string, location: any, movedBy: string, reason: string): Promise<AssetTracker> {
    const asset = await this.findOne(id);

    if (!asset.locationHistory) {
      asset.locationHistory = [];
    }

    asset.locationHistory.push({
      location: JSON.stringify(asset.currentLocation),
      timestamp: new Date().toISOString(),
      movedBy,
      reason,
    });

    asset.currentLocation = {
      ...location,
      lastUpdated: new Date().toISOString(),
    };

    return this.assetTrackerRepository.save(asset);
  }

  async assignToWorkOrder(id: string, workOrderId: string): Promise<AssetTracker> {
    const asset = await this.findOne(id);
    asset.currentWorkOrder = workOrderId;
    asset.status = 'in_use';
    return this.assetTrackerRepository.save(asset);
  }

  async releaseFromWorkOrder(id: string): Promise<AssetTracker> {
    const asset = await this.findOne(id);
    asset.currentWorkOrder = null;
    asset.status = 'idle';
    return this.assetTrackerRepository.save(asset);
  }

  async getAssetUtilization(id: string): Promise<any> {
    const asset = await this.findOne(id);

    return {
      assetId: asset.id,
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      status: asset.status,
      totalUsageHours: asset.totalUsageHours,
      currentValue: asset.currentValue,
      lastMaintenanceDate: asset.lastMaintenanceDate,
      nextMaintenanceDate: asset.nextMaintenanceDate,
    };
  }
}
