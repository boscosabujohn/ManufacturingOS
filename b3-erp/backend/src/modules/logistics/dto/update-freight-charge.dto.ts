import { PartialType } from '@nestjs/swagger';
import { CreateFreightChargeDto } from './create-freight-charge.dto';

export class UpdateFreightChargeDto extends PartialType(
  CreateFreightChargeDto,
) {}
