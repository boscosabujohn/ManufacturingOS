import { PartialType } from '@nestjs/swagger';
import { CreateProficiencyLevelDto } from './create-proficiency-level.dto';

export class UpdateProficiencyLevelDto extends PartialType(CreateProficiencyLevelDto) {}
