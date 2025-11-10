import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEvaluation, EvaluationStatus, VendorPerformanceGrade } from '../entities/vendor-evaluation.entity';
import { CreateVendorEvaluationDto, UpdateVendorEvaluationDto, VendorEvaluationResponseDto } from '../dto';

@Injectable()
export class VendorEvaluationService {
  constructor(
    @InjectRepository(VendorEvaluation)
    private readonly evaluationRepository: Repository<VendorEvaluation>,
  ) {}

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
