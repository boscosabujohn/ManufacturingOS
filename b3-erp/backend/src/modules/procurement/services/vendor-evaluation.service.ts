import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { VendorEvaluation, EvaluationStatus, VendorPerformanceGrade } from '../entities/vendor-evaluation.entity';
import { CreateVendorEvaluationDto, UpdateVendorEvaluationDto, VendorEvaluationResponseDto } from '../dto';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { GoodsReceipt } from '../entities/goods-receipt.entity';
import { GoodsReceiptItem } from '../entities/goods-receipt-item.entity';

@Injectable()
export class VendorEvaluationService {
  constructor(
    @InjectRepository(VendorEvaluation)
    private readonly evaluationRepository: Repository<VendorEvaluation>,
    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,
    @InjectRepository(GoodsReceipt)
    private readonly grnRepository: Repository<GoodsReceipt>,
    @InjectRepository(GoodsReceiptItem)
    private readonly grnItemRepository: Repository<GoodsReceiptItem>,
  ) { }

  async create(createDto: CreateVendorEvaluationDto): Promise<VendorEvaluationResponseDto> {
    const evaluationNumber = await this.generateEvaluationNumber();

    // Calculate overall score based on weighted criteria
    const overallScore = this.calculateOverallScore({
      qualityScore: createDto.qualityScore,
      deliveryScore: createDto.deliveryScore,
      priceScore: createDto.priceScore,
      responsivenessScore: createDto.responsivenessScore,
      complianceScore: createDto.complianceScore,
    });

    const performanceGrade = this.calculateGrade(overallScore);

    const evaluation = this.evaluationRepository.create({
      ...createDto,
      evaluationNumber,
      overallScore,
      performanceGrade,
      status: EvaluationStatus.DRAFT,
      qualityWeightage: 30,
      deliveryWeightage: 25,
      priceWeightage: 20,
      responsivenessWeightage: 15,
      complianceWeightage: 10,
    });

    const saved = await this.evaluationRepository.save(evaluation);
    return this.mapToResponse(saved);
  }

  async findAll(filters?: any): Promise<VendorEvaluationResponseDto[]> {
    const query = this.evaluationRepository.createQueryBuilder('eval');

    if (filters?.vendorId) {
      query.andWhere('eval.vendorId = :vendorId', { vendorId: filters.vendorId });
    }

    if (filters?.evaluationPeriod) {
      query.andWhere('eval.evaluationPeriod = :period', { period: filters.evaluationPeriod });
    }

    query.orderBy('eval.createdAt', 'DESC');
    const evaluations = await query.getMany();
    return evaluations.map(e => this.mapToResponse(e));
  }

  async findOne(id: string): Promise<VendorEvaluationResponseDto> {
    const evaluation = await this.evaluationRepository.findOne({ where: { id } });
    if (!evaluation) {
      throw new NotFoundException(`Vendor Evaluation with ID ${id} not found`);
    }
    return this.mapToResponse(evaluation);
  }

  async update(id: string, updateDto: UpdateVendorEvaluationDto): Promise<VendorEvaluationResponseDto> {
    const evaluation = await this.evaluationRepository.findOne({ where: { id } });
    if (!evaluation) {
      throw new NotFoundException(`Vendor Evaluation with ID ${id} not found`);
    }

    // Recalculate overall score
    const overallScore = this.calculateOverallScore({
      qualityScore: updateDto.qualityScore || evaluation.qualityScore,
      deliveryScore: updateDto.deliveryScore || evaluation.deliveryScore,
      priceScore: updateDto.priceScore || evaluation.priceScore,
      responsivenessScore: updateDto.responsivenessScore || evaluation.responsivenessScore,
      complianceScore: updateDto.complianceScore || evaluation.complianceScore,
    });

    const performanceGrade = this.calculateGrade(overallScore);

    Object.assign(evaluation, updateDto, { overallScore, performanceGrade });
    const updated = await this.evaluationRepository.save(evaluation);
    return this.mapToResponse(updated);
  }

  async remove(id: string): Promise<void> {
    await this.evaluationRepository.delete(id);
  }

  async approve(id: string, approverData: any): Promise<VendorEvaluationResponseDto> {
    const evaluation = await this.evaluationRepository.findOne({ where: { id } });
    if (!evaluation) {
      throw new NotFoundException(`Vendor Evaluation with ID ${id} not found`);
    }

    evaluation.status = EvaluationStatus.APPROVED;
    evaluation.isApproved = true;
    evaluation.approvedBy = approverData.approvedBy;
    evaluation.approverName = approverData.approverName;
    evaluation.approvedAt = new Date();

    const updated = await this.evaluationRepository.save(evaluation);
    return this.mapToResponse(updated);
  }

  async calculateRealTimeMetrics(vendorId: string): Promise<any> {
    // 1. Fetch all POs for this vendor
    const pos = await this.poRepository.find({
      where: { vendorId },
    });

    if (pos.length === 0) {
      return {
        onTimeDeliveryPercentage: 0,
        qualityPassRate: 0,
        totalOrders: 0,
      };
    }

    const poIds = pos.map(po => po.id);

    // 2. Fetch all completed GRNs for these POs
    const grns = await this.grnRepository.find({
      where: {
        purchaseOrderId: In(poIds),
        // status should be something indicating completion
      },
    });

    // 3. Calculate Delivery Accuracy
    let onTimeCount = 0;
    let validGrnCount = 0;

    grns.forEach(grn => {
      const po = pos.find(p => p.id === grn.purchaseOrderId);
      if (po && po.deliveryDate) {
        validGrnCount++;
        const receivedDate = new Date(grn.receiptDateTime);
        const promisedDate = new Date(po.deliveryDate);
        if (receivedDate <= promisedDate) {
          onTimeCount++;
        }
      }
    });

    const onTimeDeliveryPercentage = validGrnCount > 0
      ? (onTimeCount / validGrnCount) * 100
      : 0;

    // 4. Calculate Quality Rate
    const grnIds = grns.map(grn => grn.id);
    let totalReceived = 0;
    let totalAccepted = 0;

    if (grnIds.length > 0) {
      const items = await this.grnItemRepository.find({
        where: { goodsReceiptId: In(grnIds) },
      });

      items.forEach(item => {
        totalReceived += Number(item.receivedQuantity || 0);
        totalAccepted += Number(item.acceptedQuantity || 0);
      });
    }

    const qualityPassRate = totalReceived > 0
      ? (totalAccepted / totalReceived) * 100
      : 0;

    return {
      onTimeDeliveryPercentage: Math.round(onTimeDeliveryPercentage * 100) / 100,
      qualityPassRate: Math.round(qualityPassRate * 100) / 100,
      totalOrders: pos.length,
      totalDeliveries: grns.length,
    };
  }

  async getVendorPerformanceReport(vendorId: string): Promise<any> {
    const evaluations = await this.evaluationRepository.find({
      where: { vendorId },
      order: { evaluationDate: 'DESC' },
    });

    if (evaluations.length === 0) {
      throw new NotFoundException(`No evaluations found for vendor ${vendorId}`);
    }

    const latestEvaluation = evaluations[0];
    const averageScore = evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length;

    return {
      vendorId,
      vendorName: latestEvaluation.vendorName,
      totalEvaluations: evaluations.length,
      latestEvaluation: this.mapToResponse(latestEvaluation),
      averageScore,
      trend: this.calculateTrend(evaluations),
      performanceHistory: evaluations.map(e => ({
        evaluationDate: e.evaluationDate,
        overallScore: e.overallScore,
        performanceGrade: e.performanceGrade,
      })),
    };
  }

  private calculateOverallScore(scores: any): number {
    // Weighted average with default weightages
    const weighted = (
      scores.qualityScore * 0.30 +
      scores.deliveryScore * 0.25 +
      scores.priceScore * 0.20 +
      scores.responsivenessScore * 0.15 +
      scores.complianceScore * 0.10
    );
    return Math.round(weighted * 100) / 100;
  }

  private calculateGrade(score: number): VendorPerformanceGrade {
    if (score >= 95) return VendorPerformanceGrade.A_PLUS;
    if (score >= 90) return VendorPerformanceGrade.A;
    if (score >= 85) return VendorPerformanceGrade.B_PLUS;
    if (score >= 80) return VendorPerformanceGrade.B;
    if (score >= 70) return VendorPerformanceGrade.C;
    if (score >= 60) return VendorPerformanceGrade.D;
    return VendorPerformanceGrade.F;
  }

  private calculateTrend(evaluations: VendorEvaluation[]): string {
    if (evaluations.length < 2) return 'Insufficient data';

    const latest = evaluations[0].overallScore;
    const previous = evaluations[1].overallScore;

    if (latest > previous) return 'Improving';
    if (latest < previous) return 'Declining';
    return 'Stable';
  }

  private async generateEvaluationNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.evaluationRepository.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `VE-${year}${month}-${sequence}`;
  }

  private mapToResponse(evaluation: VendorEvaluation): VendorEvaluationResponseDto {
    return {
      id: evaluation.id,
      evaluationNumber: evaluation.evaluationNumber,
      evaluationDate: evaluation.evaluationDate,
      vendorName: evaluation.vendorName,
      evaluationPeriod: evaluation.evaluationPeriod,
      overallScore: evaluation.overallScore,
      performanceGrade: evaluation.performanceGrade,
      status: evaluation.status,
      isApproved: evaluation.isApproved,
      createdAt: evaluation.createdAt,
    };
  }
}
