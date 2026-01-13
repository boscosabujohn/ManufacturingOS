import { PartialType } from '@nestjs/swagger';
import { CreateSkillGapDto } from './create-skill-gap.dto';

export class UpdateSkillGapDto extends PartialType(CreateSkillGapDto) {}
