import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QCTemplate, QCTemplateStatus } from '../entities/qc-template.entity';
import { CreateQCTemplateDto, UpdateQCTemplateDto, QCTemplateResponseDto } from '../dto';

@Injectable()
export class QCTemplateService {
  constructor(
    @InjectRepository(QCTemplate)
    private readonly qcTemplateRepository: Repository<QCTemplate>,
  ) {}

  async create(createDto: CreateQCTemplateDto): Promise<QCTemplateResponseDto> {
    const existing = await this.qcTemplateRepository.findOne({
      where: { templateCode: createDto.templateCode },
    });

    if (existing) {
      throw new BadRequestException(
        `QC Template ${createDto.templateCode} already exists`,
      );
    }

    const template = this.qcTemplateRepository.create({
      ...createDto,
      status: QCTemplateStatus.DRAFT,
    });

    const savedTemplate = await this.qcTemplateRepository.save(template);
    return this.mapToResponseDto(savedTemplate);
  }

  async findAll(filters?: {
    status?: QCTemplateStatus;
    templateType?: string;
    itemId?: string;
  }): Promise<QCTemplateResponseDto[]> {
    const query = this.qcTemplateRepository.createQueryBuilder('qt');

    if (filters?.status) {
      query.andWhere('qt.status = :status', { status: filters.status });
    }

    if (filters?.templateType) {
      query.andWhere('qt.templateType = :templateType', {
        templateType: filters.templateType,
      });
    }

    if (filters?.itemId) {
      query.andWhere('qt.itemId = :itemId', { itemId: filters.itemId });
    }

    query.orderBy('qt.createdAt', 'DESC');

    const templates = await query.getMany();
    return templates.map((t) => this.mapToResponseDto(t));
  }

  async findOne(id: string): Promise<QCTemplateResponseDto> {
    const template = await this.qcTemplateRepository.findOne({
      where: { id },
      relations: ['parameters'],
    });

    if (!template) {
      throw new NotFoundException(`QC Template with ID ${id} not found`);
    }

    return this.mapToResponseDto(template);
  }

  async update(
    id: string,
    updateDto: UpdateQCTemplateDto,
  ): Promise<QCTemplateResponseDto> {
    const template = await this.qcTemplateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`QC Template with ID ${id} not found`);
    }

    Object.assign(template, updateDto);
    const updatedTemplate = await this.qcTemplateRepository.save(template);
    return this.mapToResponseDto(updatedTemplate);
  }

  async remove(id: string): Promise<void> {
    const template = await this.qcTemplateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`QC Template with ID ${id} not found`);
    }

    if (template.status === QCTemplateStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete active QC templates');
    }

    await this.qcTemplateRepository.remove(template);
  }

  async activate(id: string, approvedBy: string): Promise<QCTemplateResponseDto> {
    const template = await this.qcTemplateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`QC Template with ID ${id} not found`);
    }

    template.status = QCTemplateStatus.ACTIVE;
    template.approvedBy = approvedBy;
    template.approvedAt = new Date();

    const updatedTemplate = await this.qcTemplateRepository.save(template);
    return this.mapToResponseDto(updatedTemplate);
  }

  async deactivate(id: string): Promise<QCTemplateResponseDto> {
    const template = await this.qcTemplateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`QC Template with ID ${id} not found`);
    }

    template.status = QCTemplateStatus.INACTIVE;

    const updatedTemplate = await this.qcTemplateRepository.save(template);
    return this.mapToResponseDto(updatedTemplate);
  }

  async createNewVersion(id: string): Promise<QCTemplateResponseDto> {
    const template = await this.qcTemplateRepository.findOne({
      where: { id },
      relations: ['parameters'],
    });

    if (!template) {
      throw new NotFoundException(`QC Template with ID ${id} not found`);
    }

    const { id: _id, ...templateData } = template;
    const newTemplate = this.qcTemplateRepository.create({
      ...templateData,
      version: template.version + 1,
      status: QCTemplateStatus.DRAFT,
      approvedBy: undefined,
      approvedAt: undefined,
    });

    const savedTemplate = await this.qcTemplateRepository.save(newTemplate);
    return this.mapToResponseDto(savedTemplate);
  }

  private mapToResponseDto(template: QCTemplate): QCTemplateResponseDto {
    return {
      id: template.id,
      templateCode: template.templateCode,
      templateName: template.templateName,
      description: template.description,
      templateType: template.templateType,
      status: template.status,
      version: template.version,
      itemId: template.itemId,
      itemCode: template.itemCode,
      itemName: template.itemName,
      sampleSize: template.sampleSize,
      acceptableQualityLevel: template.acceptableQualityLevel,
      inspectionLevel: template.inspectionLevel,
      samplingPlan: template.samplingPlan,
      requirePhotos: template.requirePhotos,
      requireSignature: template.requireSignature,
      referenceStandard: template.referenceStandard,
      effectiveDate: template.effectiveDate,
      expiryDate: template.expiryDate,
      createdBy: template.createdBy,
      updatedBy: template.updatedBy,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}
