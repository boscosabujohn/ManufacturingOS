import { PartialType } from '@nestjs/swagger';
import { CreatePreventiveActionDto } from './create-preventive-action.dto';

export class UpdatePreventiveActionDto extends PartialType(CreatePreventiveActionDto) {}
