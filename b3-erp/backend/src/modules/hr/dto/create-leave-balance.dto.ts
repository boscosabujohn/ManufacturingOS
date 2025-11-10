import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveBalanceDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Leave type ID' })
  @IsString()
  @IsNotEmpty()
  leaveTypeId: string;

  @ApiProperty({ description: 'Year' })
  @IsNumber()
  @Type(() => Number)
  year: number;

  @ApiPropertyOptional({ description: 'Allocated days' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  allocated?: number;

  @ApiPropertyOptional({ description: 'Opening balance' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  openingBalance?: number;
}
