import { PartialType } from '@nestjs/swagger';
import {
  CreateFinancialPeriodDto,
  CreateFinancialYearDto,
} from './create-financial-period.dto';

export class UpdateFinancialPeriodDto extends PartialType(
  CreateFinancialPeriodDto,
) {}

export class UpdateFinancialYearDto extends PartialType(
  CreateFinancialYearDto,
) {}
