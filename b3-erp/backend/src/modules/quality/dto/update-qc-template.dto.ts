import { PartialType } from '@nestjs/swagger';
import { CreateQCTemplateDto } from './create-qc-template.dto';

export class UpdateQCTemplateDto extends PartialType(CreateQCTemplateDto) {}
