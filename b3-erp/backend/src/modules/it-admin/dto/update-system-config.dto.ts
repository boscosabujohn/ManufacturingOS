import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateSystemConfigDto } from './create-system-config.dto';

export class UpdateSystemConfigDto extends PartialType(
  OmitType(CreateSystemConfigDto, ['key'] as const)
) {}
