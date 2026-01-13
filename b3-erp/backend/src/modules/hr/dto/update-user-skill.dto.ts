import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserSkillDto } from './create-user-skill.dto';

export class UpdateUserSkillDto extends PartialType(
  OmitType(CreateUserSkillDto, ['employeeId', 'skillId'] as const),
) {}
