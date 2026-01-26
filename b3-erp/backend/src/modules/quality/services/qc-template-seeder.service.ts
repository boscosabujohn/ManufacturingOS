import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QCTemplate, QCTemplateType, QCTemplateStatus } from '../entities/qc-template.entity';

@Injectable()
export class QCTemplateSeederService implements OnModuleInit {
  private readonly logger = new Logger(QCTemplateSeederService.name);

  constructor(
    @InjectRepository(QCTemplate)
    private readonly qcTemplateRepository: Repository<QCTemplate>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedTemplates();
  }

  async seedTemplates(): Promise<void> {
    this.logger.log('Seeding QC templates...');

    const templates = [
      {
        templateCode: 'TMPL-INCOMING',
        templateName: 'Incoming Inspection',
        description: 'Standard inspection template for incoming raw materials and components from suppliers. Includes dimensional, visual, and material verification checks.',
        templateType: QCTemplateType.INCOMING,
        status: QCTemplateStatus.ACTIVE,
        version: 1,
        sampleSize: 10,
        acceptableQualityLevel: 2.5,
        inspectionLevel: 'Normal',
        samplingPlan: 'Single',
        requirePhotos: true,
        requireSignature: true,
        inspectionFrequency: 'Per Lot',
        autoReject: false,
        autoCreateNCR: true,
        autoNotify: true,
        referenceStandard: 'ISO 2859-1',
        inspectionInstructions: 'Perform inspection upon receipt of materials. Verify against purchase order specifications. Document any deviations.',
        checklistItems: [
          { sequence: 1, item: 'Verify delivery documentation', required: true },
          { sequence: 2, item: 'Check packaging condition', required: true },
          { sequence: 3, item: 'Verify quantity against PO', required: true },
          { sequence: 4, item: 'Perform visual inspection', required: true },
          { sequence: 5, item: 'Take dimensional measurements', required: true },
          { sequence: 6, item: 'Check material certificates', required: false },
        ],
        createdBy: 'system',
      },
      {
        templateCode: 'TMPL-INPROCESS',
        templateName: 'In-Process Inspection',
        description: 'Quality checks performed during manufacturing operations to ensure process conformance and early defect detection.',
        templateType: QCTemplateType.IN_PROCESS,
        status: QCTemplateStatus.ACTIVE,
        version: 1,
        sampleSize: 5,
        acceptableQualityLevel: 1.5,
        inspectionLevel: 'Normal',
        samplingPlan: 'Single',
        requirePhotos: false,
        requireSignature: false,
        inspectionFrequency: 'Per Hour',
        frequencyValue: 1,
        autoReject: true,
        autoCreateNCR: true,
        autoNotify: true,
        referenceStandard: 'ISO 9001',
        inspectionInstructions: 'Perform inspection at designated process checkpoints. Record all measurements. Stop production if critical defects are found.',
        checklistItems: [
          { sequence: 1, item: 'Verify machine settings', required: true },
          { sequence: 2, item: 'Check tool condition', required: true },
          { sequence: 3, item: 'Measure critical dimensions', required: true },
          { sequence: 4, item: 'Visual inspection for defects', required: true },
          { sequence: 5, item: 'Record process parameters', required: false },
        ],
        createdBy: 'system',
      },
      {
        templateCode: 'TMPL-FINAL',
        templateName: 'Final Inspection',
        description: 'Comprehensive quality inspection performed on finished goods before shipment to ensure full compliance with specifications.',
        templateType: QCTemplateType.FINAL,
        status: QCTemplateStatus.ACTIVE,
        version: 1,
        sampleSize: 20,
        acceptableQualityLevel: 1.0,
        inspectionLevel: 'Tightened',
        samplingPlan: 'Double',
        requirePhotos: true,
        requireSignature: true,
        inspectionFrequency: 'Per Lot',
        autoReject: true,
        autoCreateNCR: true,
        autoNotify: true,
        referenceStandard: 'ISO 2859-1',
        inspectionInstructions: 'Complete all inspection parameters before release. Ensure all documentation is complete. Verify packaging and labeling.',
        checklistItems: [
          { sequence: 1, item: 'Complete dimensional inspection', required: true },
          { sequence: 2, item: 'Perform functional tests', required: true },
          { sequence: 3, item: 'Visual inspection - all surfaces', required: true },
          { sequence: 4, item: 'Verify packaging requirements', required: true },
          { sequence: 5, item: 'Check labeling and documentation', required: true },
          { sequence: 6, item: 'Record serial numbers', required: false },
        ],
        createdBy: 'system',
      },
      {
        templateCode: 'TMPL-PAINT',
        templateName: 'Paint Inspection',
        description: 'Specialized inspection template for painted surfaces including color matching, adhesion, and coating thickness verification.',
        templateType: QCTemplateType.CUSTOM,
        status: QCTemplateStatus.ACTIVE,
        version: 1,
        sampleSize: 5,
        acceptableQualityLevel: 2.5,
        inspectionLevel: 'Normal',
        samplingPlan: 'Single',
        requirePhotos: true,
        requireSignature: false,
        inspectionFrequency: 'Per Batch',
        autoReject: false,
        autoCreateNCR: true,
        autoNotify: true,
        referenceStandard: 'ASTM D3359',
        inspectionInstructions: 'Inspect paint finish under proper lighting conditions. Use calibrated instruments for thickness measurement. Compare color against approved samples.',
        checklistItems: [
          { sequence: 1, item: 'Check surface preparation', required: true },
          { sequence: 2, item: 'Verify paint batch/lot number', required: true },
          { sequence: 3, item: 'Color matching against standard', required: true },
          { sequence: 4, item: 'Measure coating thickness', required: true },
          { sequence: 5, item: 'Perform adhesion test', required: true },
          { sequence: 6, item: 'Check for runs, sags, and orange peel', required: true },
        ],
        createdBy: 'system',
      },
      {
        templateCode: 'TMPL-WELD',
        templateName: 'Weld Inspection',
        description: 'Quality inspection template for welded joints and assemblies including visual inspection and dimensional verification.',
        templateType: QCTemplateType.CUSTOM,
        status: QCTemplateStatus.ACTIVE,
        version: 1,
        sampleSize: 100,
        acceptableQualityLevel: 0,
        inspectionLevel: 'Tightened',
        samplingPlan: 'Single',
        requirePhotos: true,
        requireSignature: true,
        inspectionFrequency: 'Per Weld',
        autoReject: true,
        autoCreateNCR: true,
        autoNotify: true,
        referenceStandard: 'AWS D1.1',
        inspectionInstructions: 'Inspect each weld for visual defects. Verify weld size and profile. Document any discontinuities. Critical welds require 100% inspection.',
        checklistItems: [
          { sequence: 1, item: 'Verify welder certification', required: true },
          { sequence: 2, item: 'Check WPS compliance', required: true },
          { sequence: 3, item: 'Visual inspection for cracks', required: true },
          { sequence: 4, item: 'Check for porosity and inclusions', required: true },
          { sequence: 5, item: 'Verify weld size and profile', required: true },
          { sequence: 6, item: 'Check for undercut and overlap', required: true },
          { sequence: 7, item: 'Verify joint alignment', required: true },
        ],
        createdBy: 'system',
      },
    ];

    for (const template of templates) {
      try {
        const existing = await this.qcTemplateRepository.findOne({
          where: { templateCode: template.templateCode },
        });
        if (!existing) {
          await this.qcTemplateRepository.save(template);
          this.logger.log(`Created QC template: ${template.templateName}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed QC template ${template.templateName}: ${error.message}`);
      }
    }

    this.logger.log('QC templates seeding completed');
  }

  async getTemplateByCode(code: string): Promise<QCTemplate | null> {
    return this.qcTemplateRepository.findOne({ where: { templateCode: code } });
  }
}
