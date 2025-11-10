import { ApiProperty } from '@nestjs/swagger';
import { ResultStatus } from '../entities/inspection-result.entity';

export class InspectionResultResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  inspectionId: string;

  @ApiProperty()
  parameterName: string;

  @ApiProperty()
  sequence: number;

  @ApiProperty({ enum: ResultStatus })
  status: ResultStatus;

  @ApiProperty({ required: false })
  measuredValue?: string;

  @ApiProperty({ required: false })
  numericValue?: number;

  @ApiProperty()
  isWithinSpec: boolean;

  @ApiProperty()
  hasDefect: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
