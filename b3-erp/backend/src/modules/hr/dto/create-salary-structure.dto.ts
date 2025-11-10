import { IsString, IsEnum, IsNotEmpty, IsDateString, IsOptional, IsBoolean, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SalaryStructureStatus } from '../entities/salary-structure.entity';

export class CreateSalaryStructureDto {
  @ApiProperty({ description: 'Salary structure code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Salary structure name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Effective from date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  effectiveFrom: string;

  @ApiPropertyOptional({ description: 'Effective to date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  effectiveTo?: string;

  @ApiProperty({ description: 'Salary components' })
  @IsArray()
  components: Array<{
    id: string;
    name: string;
    code: string;
    type: string;
    calculationType: string;
    value: number;
    isStatutory: boolean;
    isTaxable: boolean;
    displayOrder: number;
    isActive: boolean;
  }>;

  @ApiPropertyOptional({ description: 'Is PF applicable', default: true })
  @IsBoolean()
  @IsOptional()
  isPFApplicable?: boolean;

  @ApiPropertyOptional({ description: 'Is ESI applicable', default: true })
  @IsBoolean()
  @IsOptional()
  isESIApplicable?: boolean;

  @ApiPropertyOptional({ description: 'Status', enum: SalaryStructureStatus })
  @IsEnum(SalaryStructureStatus)
  @IsOptional()
  status?: SalaryStructureStatus;
}
