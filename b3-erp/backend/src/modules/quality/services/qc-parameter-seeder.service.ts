import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QCParameter, ParameterType, ParameterDataType, ParameterCriticality } from '../entities/qc-parameter.entity';
import { QCTemplate } from '../entities/qc-template.entity';

interface ParameterDefinition {
  parameterCode: string;
  parameterName: string;
  description: string;
  parameterType: ParameterType;
  dataType: ParameterDataType;
  criticality: ParameterCriticality;
  uom?: string;
  tolerance?: number;
  lowerSpecLimit?: number;
  upperSpecLimit?: number;
  nominalValue?: number;
  isMandatory: boolean;
  measuringInstrument?: string;
  testMethod?: string;
}

@Injectable()
export class QCParameterSeederService implements OnModuleInit {
  private readonly logger = new Logger(QCParameterSeederService.name);

  // Master parameter definitions that can be added to templates
  private readonly masterParameters: ParameterDefinition[] = [
    // Dimensional Parameters
    {
      parameterCode: 'DIM-LEN',
      parameterName: 'Length',
      description: 'Length measurement - primary dimensional check for linear dimension along the longest axis',
      parameterType: ParameterType.DIMENSIONAL,
      dataType: ParameterDataType.NUMERIC,
      criticality: ParameterCriticality.MAJOR,
      uom: 'MM',
      tolerance: 0.5,
      isMandatory: true,
      measuringInstrument: 'Vernier Caliper / Tape Measure',
      testMethod: 'Direct measurement using calibrated instrument',
    },
    {
      parameterCode: 'DIM-WID',
      parameterName: 'Width',
      description: 'Width measurement - dimensional check for width dimension perpendicular to length',
      parameterType: ParameterType.DIMENSIONAL,
      dataType: ParameterDataType.NUMERIC,
      criticality: ParameterCriticality.MAJOR,
      uom: 'MM',
      tolerance: 0.5,
      isMandatory: true,
      measuringInstrument: 'Vernier Caliper / Tape Measure',
      testMethod: 'Direct measurement using calibrated instrument',
    },
    {
      parameterCode: 'DIM-THK',
      parameterName: 'Thickness',
      description: 'Thickness measurement - dimensional check for material thickness or wall thickness',
      parameterType: ParameterType.DIMENSIONAL,
      dataType: ParameterDataType.NUMERIC,
      criticality: ParameterCriticality.CRITICAL,
      uom: 'MM',
      tolerance: 0.1,
      isMandatory: true,
      measuringInstrument: 'Micrometer / Thickness Gauge',
      testMethod: 'Direct measurement at multiple points using calibrated micrometer',
    },
    {
      parameterCode: 'DIM-DIA',
      parameterName: 'Diameter',
      description: 'Diameter measurement - dimensional check for circular features (holes, shafts, etc.)',
      parameterType: ParameterType.DIMENSIONAL,
      dataType: ParameterDataType.NUMERIC,
      criticality: ParameterCriticality.MAJOR,
      uom: 'MM',
      tolerance: 0.2,
      isMandatory: true,
      measuringInstrument: 'Vernier Caliper / Bore Gauge',
      testMethod: 'Measure at minimum two perpendicular positions',
    },

    // Visual Parameters
    {
      parameterCode: 'VIS-SURF',
      parameterName: 'Surface Finish',
      description: 'Visual inspection of surface finish quality - check for roughness, waviness, and overall appearance',
      parameterType: ParameterType.VISUAL,
      dataType: ParameterDataType.PASS_FAIL,
      criticality: ParameterCriticality.MAJOR,
      isMandatory: true,
      testMethod: 'Visual comparison against approved samples under standard lighting',
    },
    {
      parameterCode: 'VIS-COLOR',
      parameterName: 'Color Match',
      description: 'Visual verification of color against approved color standard or sample',
      parameterType: ParameterType.VISUAL,
      dataType: ParameterDataType.PASS_FAIL,
      criticality: ParameterCriticality.MINOR,
      isMandatory: true,
      testMethod: 'Compare against approved color sample in daylight or D65 light booth',
    },
    {
      parameterCode: 'VIS-SCRATCH',
      parameterName: 'No Scratches',
      description: 'Visual inspection to verify absence of scratches, scuffs, or surface damage',
      parameterType: ParameterType.VISUAL,
      dataType: ParameterDataType.PASS_FAIL,
      criticality: ParameterCriticality.MINOR,
      isMandatory: true,
      testMethod: 'Visual inspection under adequate lighting at 30cm distance',
    },

    // Functional Parameters
    {
      parameterCode: 'FUNC-OP',
      parameterName: 'Operational Test',
      description: 'Functional test to verify operational performance meets specifications',
      parameterType: ParameterType.FUNCTIONAL,
      dataType: ParameterDataType.PASS_FAIL,
      criticality: ParameterCriticality.CRITICAL,
      isMandatory: true,
      testMethod: 'Execute standard operational test procedure per test specification',
    },
    {
      parameterCode: 'FUNC-FIT',
      parameterName: 'Fitment Check',
      description: 'Functional verification of proper fit and assembly with mating components',
      parameterType: ParameterType.FUNCTIONAL,
      dataType: ParameterDataType.PASS_FAIL,
      criticality: ParameterCriticality.CRITICAL,
      isMandatory: true,
      testMethod: 'Trial fit with mating component or gauge - verify proper engagement',
    },

    // Material Parameters
    {
      parameterCode: 'MAT-HARD',
      parameterName: 'Hardness',
      description: 'Material hardness measurement using Rockwell C scale (HRC)',
      parameterType: ParameterType.MECHANICAL,
      dataType: ParameterDataType.NUMERIC,
      criticality: ParameterCriticality.MAJOR,
      uom: 'HRC',
      tolerance: 2,
      isMandatory: true,
      measuringInstrument: 'Rockwell Hardness Tester',
      testMethod: 'Rockwell C hardness test per ASTM E18',
    },
    {
      parameterCode: 'MAT-THICK',
      parameterName: 'Coating Thickness',
      description: 'Measurement of coating/plating thickness on substrate material',
      parameterType: ParameterType.MECHANICAL,
      dataType: ParameterDataType.NUMERIC,
      criticality: ParameterCriticality.MAJOR,
      uom: 'MICRON',
      tolerance: 5,
      isMandatory: true,
      measuringInstrument: 'Coating Thickness Gauge',
      testMethod: 'Measure at minimum 3 locations using calibrated coating thickness gauge',
    },
  ];

  constructor(
    @InjectRepository(QCParameter)
    private readonly qcParameterRepository: Repository<QCParameter>,
    @InjectRepository(QCTemplate)
    private readonly qcTemplateRepository: Repository<QCTemplate>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedParametersForTemplates();
  }

  async seedParametersForTemplates(): Promise<void> {
    this.logger.log('Seeding QC parameters for templates...');

    // Template-specific parameter configurations
    const templateParameterMappings: Record<string, string[]> = {
      'TMPL-INCOMING': ['DIM-LEN', 'DIM-WID', 'DIM-THK', 'VIS-SURF', 'VIS-SCRATCH', 'MAT-HARD'],
      'TMPL-INPROCESS': ['DIM-LEN', 'DIM-WID', 'DIM-THK', 'DIM-DIA', 'VIS-SURF'],
      'TMPL-FINAL': ['DIM-LEN', 'DIM-WID', 'DIM-THK', 'DIM-DIA', 'VIS-SURF', 'VIS-COLOR', 'VIS-SCRATCH', 'FUNC-OP', 'FUNC-FIT'],
      'TMPL-PAINT': ['VIS-SURF', 'VIS-COLOR', 'VIS-SCRATCH', 'MAT-THICK'],
      'TMPL-WELD': ['DIM-LEN', 'DIM-WID', 'VIS-SURF', 'VIS-SCRATCH', 'FUNC-FIT', 'MAT-HARD'],
    };

    for (const [templateCode, parameterCodes] of Object.entries(templateParameterMappings)) {
      try {
        const template = await this.qcTemplateRepository.findOne({
          where: { templateCode },
        });

        if (!template) {
          this.logger.warn(`Template ${templateCode} not found, skipping parameter seeding`);
          continue;
        }

        let sequence = 1;
        for (const paramCode of parameterCodes) {
          const masterParam = this.masterParameters.find(p => p.parameterCode === paramCode);
          if (!masterParam) {
            this.logger.warn(`Parameter definition ${paramCode} not found`);
            continue;
          }

          const existing = await this.qcParameterRepository.findOne({
            where: {
              qcTemplateId: template.id,
              parameterCode: paramCode,
            },
          });

          if (!existing) {
            const parameter = this.qcParameterRepository.create({
              qcTemplateId: template.id,
              parameterCode: masterParam.parameterCode,
              parameterName: masterParam.parameterName,
              description: masterParam.description,
              parameterType: masterParam.parameterType,
              dataType: masterParam.dataType,
              criticality: masterParam.criticality,
              sequence: sequence,
              isMandatory: masterParam.isMandatory,
              uom: masterParam.uom,
              tolerance: masterParam.tolerance,
              measuringInstrument: masterParam.measuringInstrument,
              testMethod: masterParam.testMethod,
              isActive: true,
              createdBy: 'system',
            });

            await this.qcParameterRepository.save(parameter);
            this.logger.log(`Created parameter ${paramCode} for template ${templateCode}`);
          }
          sequence++;
        }
      } catch (error) {
        this.logger.error(`Failed to seed parameters for template ${templateCode}: ${error.message}`);
      }
    }

    this.logger.log('QC parameters seeding completed');
  }

  /**
   * Get all master parameter definitions
   */
  getMasterParameters(): ParameterDefinition[] {
    return [...this.masterParameters];
  }

  /**
   * Get a specific master parameter by code
   */
  getMasterParameterByCode(code: string): ParameterDefinition | undefined {
    return this.masterParameters.find(p => p.parameterCode === code);
  }

  /**
   * Add a parameter to a specific template
   */
  async addParameterToTemplate(
    templateId: string,
    parameterCode: string,
    sequence: number,
    overrides?: Partial<QCParameter>,
  ): Promise<QCParameter | null> {
    const masterParam = this.getMasterParameterByCode(parameterCode);
    if (!masterParam) {
      this.logger.warn(`Master parameter ${parameterCode} not found`);
      return null;
    }

    const existing = await this.qcParameterRepository.findOne({
      where: {
        qcTemplateId: templateId,
        parameterCode: parameterCode,
      },
    });

    if (existing) {
      this.logger.warn(`Parameter ${parameterCode} already exists for template ${templateId}`);
      return existing;
    }

    const parameter = this.qcParameterRepository.create({
      qcTemplateId: templateId,
      parameterCode: masterParam.parameterCode,
      parameterName: masterParam.parameterName,
      description: masterParam.description,
      parameterType: masterParam.parameterType,
      dataType: masterParam.dataType,
      criticality: masterParam.criticality,
      sequence: sequence,
      isMandatory: masterParam.isMandatory,
      uom: masterParam.uom,
      tolerance: masterParam.tolerance,
      measuringInstrument: masterParam.measuringInstrument,
      testMethod: masterParam.testMethod,
      isActive: true,
      createdBy: 'system',
      ...overrides,
    });

    return this.qcParameterRepository.save(parameter);
  }
}
