import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefectCode, DefectSeverity, DefectCategory } from '../entities/defect-code.entity';

@Injectable()
export class DefectCodeSeederService implements OnModuleInit {
  private readonly logger = new Logger(DefectCodeSeederService.name);

  constructor(
    @InjectRepository(DefectCode)
    private readonly defectCodeRepository: Repository<DefectCode>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefectCodes();
  }

  async seedDefectCodes(): Promise<void> {
    this.logger.log('Seeding defect codes...');

    const defectCodes = [
      {
        code: 'DEF-DIM',
        name: 'Dimensional Out of Spec',
        description: 'Part or feature dimensions are outside the specified tolerance limits. Includes length, width, height, diameter, or any other dimensional characteristic that does not meet drawing requirements.',
        severity: DefectSeverity.MAJOR,
        category: DefectCategory.DIMENSIONAL,
        requiresNCR: true,
        requiresCAPA: false,
        requiresRework: true,
        requiresScrap: false,
        requiresQuarantine: true,
        inspectionGuidance: 'Measure all critical dimensions using calibrated instruments. Compare against drawing tolerances. Document actual vs. specified values.',
        correctiveGuidance: 'Evaluate if rework is possible. If within rework limits, machine/grind to specification. If beyond rework limits, scrap the part.',
        sortOrder: 1,
      },
      {
        code: 'DEF-SURF',
        name: 'Surface Defect',
        description: 'Visible surface imperfections including scratches, dents, pitting, waviness, or poor surface finish that do not meet appearance or functional requirements.',
        severity: DefectSeverity.MINOR,
        category: DefectCategory.SURFACE,
        requiresNCR: false,
        requiresCAPA: false,
        requiresRework: true,
        requiresScrap: false,
        requiresQuarantine: false,
        inspectionGuidance: 'Inspect surfaces under adequate lighting. Compare against approved surface finish samples. Document location and extent of defects.',
        correctiveGuidance: 'Minor defects may be buffed or polished. For cosmetic parts, evaluate against acceptance criteria. Repaint or recoat if applicable.',
        sortOrder: 2,
      },
      {
        code: 'DEF-CRACK',
        name: 'Crack/Fracture',
        description: 'Visible or detected cracks, fractures, or structural discontinuities that compromise the integrity of the part. Includes hairline cracks, stress cracks, and complete fractures.',
        severity: DefectSeverity.CRITICAL,
        category: DefectCategory.STRUCTURAL,
        requiresNCR: true,
        requiresCAPA: true,
        requiresRework: false,
        requiresScrap: true,
        requiresQuarantine: true,
        inspectionGuidance: 'Perform visual inspection and dye penetrant testing if required. Check stress concentration areas. Document location, length, and orientation of cracks.',
        correctiveGuidance: 'Cracked parts must be scrapped. Investigate root cause (material defect, process issue, handling damage). Implement corrective actions.',
        sortOrder: 3,
      },
      {
        code: 'DEF-RUST',
        name: 'Rust/Corrosion',
        description: 'Oxidation, rust, or corrosion on metal surfaces. Includes surface rust, pitting corrosion, and galvanic corrosion that may affect part function or appearance.',
        severity: DefectSeverity.MAJOR,
        category: DefectCategory.MATERIAL,
        requiresNCR: true,
        requiresCAPA: false,
        requiresRework: true,
        requiresScrap: false,
        requiresQuarantine: true,
        inspectionGuidance: 'Inspect all surfaces for signs of oxidation or corrosion. Check storage conditions and packaging. Assess extent of damage.',
        correctiveGuidance: 'Remove surface rust by mechanical or chemical means. Apply protective coating. Review storage and handling procedures.',
        sortOrder: 4,
      },
      {
        code: 'DEF-PAINT',
        name: 'Paint Defect',
        description: 'Defects in paint or coating including runs, sags, orange peel, fisheyes, adhesion failure, color mismatch, or insufficient coverage.',
        severity: DefectSeverity.MINOR,
        category: DefectCategory.COSMETIC,
        requiresNCR: false,
        requiresCAPA: false,
        requiresRework: true,
        requiresScrap: false,
        requiresQuarantine: false,
        inspectionGuidance: 'Inspect under proper lighting conditions. Check color against approved sample. Perform adhesion test if required. Measure coating thickness.',
        correctiveGuidance: 'Strip and repaint if defect is significant. Touch-up minor defects if acceptable. Adjust paint process parameters to prevent recurrence.',
        sortOrder: 5,
      },
      {
        code: 'DEF-WELD',
        name: 'Welding Defect',
        description: 'Defects in welded joints including porosity, cracks, lack of fusion, undercut, excessive spatter, or improper weld profile that do not meet weld quality standards.',
        severity: DefectSeverity.MAJOR,
        category: DefectCategory.STRUCTURAL,
        requiresNCR: true,
        requiresCAPA: false,
        requiresRework: true,
        requiresScrap: false,
        requiresQuarantine: true,
        inspectionGuidance: 'Visual inspection per AWS D1.1 or applicable standard. Check weld size, profile, and appearance. Perform NDT if required for critical welds.',
        correctiveGuidance: 'Grind out defective weld and re-weld following approved WPS. Verify welder qualification. May require NDT after repair.',
        sortOrder: 6,
      },
      {
        code: 'DEF-FUNC',
        name: 'Functional Failure',
        description: 'Part or assembly fails to perform its intended function. Includes operational failures, performance below specification, or inability to meet functional requirements.',
        severity: DefectSeverity.CRITICAL,
        category: DefectCategory.FUNCTIONAL,
        requiresNCR: true,
        requiresCAPA: true,
        requiresRework: false,
        requiresScrap: false,
        requiresQuarantine: true,
        inspectionGuidance: 'Perform functional test per test procedure. Document test conditions, parameters, and results. Compare against acceptance criteria.',
        correctiveGuidance: 'Investigate root cause of functional failure. Determine if rework is possible or if replacement is required. Document findings and actions.',
        sortOrder: 7,
      },
      {
        code: 'DEF-MISS',
        name: 'Missing Part',
        description: 'Required component or part is missing from the assembly or shipment. Includes missing fasteners, sub-components, accessories, or documentation.',
        severity: DefectSeverity.MAJOR,
        category: DefectCategory.ASSEMBLY,
        requiresNCR: true,
        requiresCAPA: false,
        requiresRework: true,
        requiresScrap: false,
        requiresQuarantine: true,
        inspectionGuidance: 'Verify all components against BOM or packing list. Check assembly is complete per drawing. Document missing items.',
        correctiveGuidance: 'Obtain and install missing parts. Review assembly process and checklists. Implement verification steps to prevent recurrence.',
        sortOrder: 8,
      },
      {
        code: 'DEF-WRONG',
        name: 'Wrong Part',
        description: 'Incorrect part installed or supplied. Includes wrong part number, wrong revision, wrong material, or wrong configuration.',
        severity: DefectSeverity.MAJOR,
        category: DefectCategory.ASSEMBLY,
        requiresNCR: true,
        requiresCAPA: false,
        requiresRework: true,
        requiresScrap: false,
        requiresQuarantine: true,
        inspectionGuidance: 'Verify part number, revision, and configuration against BOM or drawing. Check material certifications if applicable.',
        correctiveGuidance: 'Remove incorrect part and install correct part. Review procurement and assembly processes. Implement verification steps.',
        sortOrder: 9,
      },
    ];

    for (const defect of defectCodes) {
      try {
        const existing = await this.defectCodeRepository.findOne({
          where: { code: defect.code },
        });
        if (!existing) {
          await this.defectCodeRepository.save({
            ...defect,
            isActive: true,
            createdBy: 'system',
          });
          this.logger.log(`Created defect code: ${defect.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed defect code ${defect.name}: ${error.message}`);
      }
    }

    this.logger.log('Defect codes seeding completed');
  }

  /**
   * Get defect code by code
   */
  async getDefectCodeByCode(code: string): Promise<DefectCode | null> {
    return this.defectCodeRepository.findOne({ where: { code } });
  }

  /**
   * Get all active defect codes
   */
  async getActiveDefectCodes(): Promise<DefectCode[]> {
    return this.defectCodeRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  /**
   * Get defect codes by severity
   */
  async getDefectCodesBySeverity(severity: DefectSeverity): Promise<DefectCode[]> {
    return this.defectCodeRepository.find({
      where: { severity, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  /**
   * Get defect codes by category
   */
  async getDefectCodesByCategory(category: DefectCategory): Promise<DefectCode[]> {
    return this.defectCodeRepository.find({
      where: { category, isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }
}
