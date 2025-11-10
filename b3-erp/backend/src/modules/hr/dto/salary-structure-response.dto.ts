import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SalaryStructureStatus } from '../entities/salary-structure.entity';

export class SalaryStructureResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  effectiveFrom: Date;

  @ApiPropertyOptional()
  effectiveTo?: Date;

  @ApiProperty()
  components: any[];

  @ApiProperty()
  isPFApplicable: boolean;

  @ApiProperty()
  isESIApplicable: boolean;

  @ApiProperty({ enum: SalaryStructureStatus })
  status: SalaryStructureStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
