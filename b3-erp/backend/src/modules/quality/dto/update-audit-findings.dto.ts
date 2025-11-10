import { PartialType } from '@nestjs/swagger';
import { CreateAuditFindingsDto } from './create-audit-findings.dto';

export class UpdateAuditFindingsDto extends PartialType(CreateAuditFindingsDto) {}
