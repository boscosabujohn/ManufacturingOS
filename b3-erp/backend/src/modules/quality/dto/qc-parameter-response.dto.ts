import { ApiProperty } from '@nestjs/swagger';
import { ParameterType, ParameterDataType, ParameterCriticality } from '../entities/qc-parameter.entity';

export class QCParameterResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  qcTemplateId: string;

  @ApiProperty()
  parameterCode: string;

  @ApiProperty()
  parameterName: string;

  @ApiProperty({ enum: ParameterType })
  parameterType: ParameterType;

  @ApiProperty({ enum: ParameterDataType })
  dataType: ParameterDataType;

  @ApiProperty({ enum: ParameterCriticality })
  criticality: ParameterCriticality;

  @ApiProperty()
  sequence: number;

  @ApiProperty()
  isMandatory: boolean;

  @ApiProperty({ required: false })
  uom?: string;

  @ApiProperty({ required: false })
  lowerSpecLimit?: number;

  @ApiProperty({ required: false })
  upperSpecLimit?: number;

  @ApiProperty({ required: false })
  targetValue?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
