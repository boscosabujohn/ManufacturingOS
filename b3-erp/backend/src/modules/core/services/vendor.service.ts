import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor, VendorRating } from '../entities/vendor.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';

export interface VendorFilters {
  search?: string;
  status?: string;
  vendorType?: string;
  category?: string;
  buyerId?: string;
  isApproved?: boolean;
  qualityRating?: string;
  deliveryRating?: string;
  overallRating?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async findAll(
    filters: VendorFilters = {},
    pagination: PaginationParams = {},
  ): Promise<{ data: Vendor[]; total: number; page: number; limit: number }> {
    const {
      search,
      status,
      vendorType,
      category,
      buyerId,
      isApproved,
      qualityRating,
      deliveryRating,
      overallRating,
    } = filters;

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;

    const queryBuilder = this.vendorRepository.createQueryBuilder('vendor');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(vendor.vendorCode ILIKE :search OR vendor.vendorName ILIKE :search OR vendor.email ILIKE :search OR vendor.phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('vendor.status = :status', { status });
    }

    // Apply vendor type filter
    if (vendorType) {
      queryBuilder.andWhere('vendor.vendorType = :vendorType', { vendorType });
    }

    // Apply category filter
    if (category) {
      queryBuilder.andWhere('vendor.category = :category', { category });
    }

    // Apply buyer filter
    if (buyerId) {
      queryBuilder.andWhere('vendor.buyerId = :buyerId', { buyerId });
    }

    // Apply approval filter
    if (isApproved !== undefined) {
      queryBuilder.andWhere('vendor.isApproved = :isApproved', { isApproved });
    }

    // Apply quality rating filter
    if (qualityRating) {
      queryBuilder.andWhere('vendor.qualityRating = :qualityRating', {
        qualityRating,
      });
    }

    // Apply delivery rating filter
    if (deliveryRating) {
      queryBuilder.andWhere('vendor.deliveryRating = :deliveryRating', {
        deliveryRating,
      });
    }

    // Apply overall rating filter
    if (overallRating) {
      queryBuilder.andWhere('vendor.overallRating = :overallRating', {
        overallRating,
      });
    }

    // Apply sorting
    queryBuilder.orderBy(`vendor.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    // Calculate virtual fields
    data.forEach((vendor) => {
      vendor.averageRating = this.calculateAverageRating(vendor);
      vendor.paymentStatus = this.getPaymentStatus(vendor);
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    // Calculate virtual fields
    vendor.averageRating = this.calculateAverageRating(vendor);
    vendor.paymentStatus = this.getPaymentStatus(vendor);

    return vendor;
  }

  async findByCode(vendorCode: string): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { vendorCode },
    });
  }

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    // Check if vendor code already exists
    const existingVendor = await this.findByCode(createVendorDto.vendorCode);
    if (existingVendor) {
      throw new ConflictException(
        `Vendor with code ${createVendorDto.vendorCode} already exists`,
      );
    }

    // Validate email if provided
    if (createVendorDto.email) {
      const emailExists = await this.vendorRepository.findOne({
        where: { email: createVendorDto.email },
      });
      if (emailExists) {
        throw new ConflictException(
          `Vendor with email ${createVendorDto.email} already exists`,
        );
      }
    }

    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);

    // Check if vendor code is being changed and if it already exists
    if (
      updateVendorDto.vendorCode &&
      updateVendorDto.vendorCode !== vendor.vendorCode
    ) {
      const existingVendor = await this.findByCode(updateVendorDto.vendorCode);
      if (existingVendor) {
        throw new ConflictException(
          `Vendor with code ${updateVendorDto.vendorCode} already exists`,
        );
      }
    }

    // Check if email is being changed and if it already exists
    if (updateVendorDto.email && updateVendorDto.email !== vendor.email) {
      const emailExists = await this.vendorRepository.findOne({
        where: { email: updateVendorDto.email },
      });
      if (emailExists) {
        throw new ConflictException(
          `Vendor with email ${updateVendorDto.email} already exists`,
        );
      }
    }

    Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async remove(id: string): Promise<void> {
    const vendor = await this.findOne(id);

    // Check if vendor has outstanding payables
    if (vendor.outstandingPayables > 0) {
      throw new BadRequestException(
        `Cannot delete vendor with outstanding payables of ${vendor.outstandingPayables}`,
      );
    }

    await this.vendorRepository.remove(vendor);
  }

  async approve(id: string, approvedBy: string): Promise<Vendor> {
    const vendor = await this.findOne(id);

    if (vendor.isApproved) {
      throw new BadRequestException('Vendor is already approved');
    }

    vendor.isApproved = true;
    vendor.approvedBy = approvedBy;
    vendor.approvedAt = new Date();

    return this.vendorRepository.save(vendor);
  }

  async updatePayables(
    id: string,
    amount: number,
    type: 'add' | 'subtract',
  ): Promise<Vendor> {
    const vendor = await this.findOne(id);

    if (type === 'add') {
      vendor.outstandingPayables += amount;
    } else {
      vendor.outstandingPayables -= amount;
    }

    return this.vendorRepository.save(vendor);
  }

  async updatePurchaseData(
    id: string,
    purchaseAmount: number,
    purchaseDate: Date,
  ): Promise<Vendor> {
    const vendor = await this.findOne(id);

    vendor.totalPurchases += purchaseAmount;
    vendor.lastPurchaseAmount = purchaseAmount;
    vendor.lastPurchaseDate = purchaseDate;

    return this.vendorRepository.save(vendor);
  }

  async updatePerformanceMetrics(
    id: string,
    metrics: {
      qualityRating?: VendorRating;
      deliveryRating?: VendorRating;
      priceRating?: VendorRating;
      onTimeDeliveryPercentage?: number;
      defectRate?: number;
    },
  ): Promise<Vendor> {
    const vendor = await this.findOne(id);

    Object.assign(vendor, metrics);

    // Recalculate overall rating
    vendor.overallRating = this.calculateOverallRating(vendor);

    return this.vendorRepository.save(vendor);
  }

  async getVendorsByCategory(category: string): Promise<Vendor[]> {
    return this.vendorRepository.find({
      where: { category },
      order: { vendorName: 'ASC' },
    });
  }

  async getApprovedVendors(): Promise<Vendor[]> {
    return this.vendorRepository.find({
      where: { isApproved: true },
      order: { vendorName: 'ASC' },
    });
  }

  async getTopVendorsByPurchases(limit: number = 10): Promise<Vendor[]> {
    return this.vendorRepository.find({
      order: { totalPurchases: 'DESC' },
      take: limit,
    });
  }

  async getVendorsWithOutstandingPayables(): Promise<Vendor[]> {
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.outstandingPayables > 0')
      .orderBy('vendor.outstandingPayables', 'DESC')
      .getMany();
  }

  async getTopRatedVendors(limit: number = 10): Promise<Vendor[]> {
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .where("vendor.overallRating IN ('Excellent', 'Good')")
      .orderBy('vendor.totalPurchases', 'DESC')
      .take(limit)
      .getMany();
  }

  // Private helper methods
  private calculateAverageRating(vendor: Vendor): number {
    const ratings = [
      this.getRatingScore(vendor.qualityRating),
      this.getRatingScore(vendor.deliveryRating),
      this.getRatingScore(vendor.priceRating),
    ];

    const validRatings = ratings.filter((r) => r > 0);
    if (validRatings.length === 0) return 0;

    return validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length;
  }

  private getRatingScore(rating: VendorRating): number {
    const ratingMap = {
      [VendorRating.EXCELLENT]: 5,
      [VendorRating.GOOD]: 4,
      [VendorRating.FAIR]: 3,
      [VendorRating.POOR]: 2,
      [VendorRating.NO_RATING]: 0,
    };
    return ratingMap[rating] || 0;
  }

  private calculateOverallRating(vendor: Vendor): VendorRating {
    const avgScore = this.calculateAverageRating(vendor);

    if (avgScore >= 4.5) return VendorRating.EXCELLENT;
    if (avgScore >= 3.5) return VendorRating.GOOD;
    if (avgScore >= 2.5) return VendorRating.FAIR;
    if (avgScore > 0) return VendorRating.POOR;
    return VendorRating.NO_RATING;
  }

  private getPaymentStatus(vendor: Vendor): string {
    if (vendor.outstandingPayables === 0) return 'Clear';
    if (vendor.outstandingPayables > 0) return 'Outstanding';
    return 'Unknown';
  }
}
