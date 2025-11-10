import { PartialType } from '@nestjs/swagger';
import { CreateQualityAlertDto } from './create-quality-alert.dto';

export class UpdateQualityAlertDto extends PartialType(CreateQualityAlertDto) {}
