import { PartialType } from '@nestjs/swagger';
import { CreateInspectionResultDto } from './create-inspection-result.dto';

export class UpdateInspectionResultDto extends PartialType(CreateInspectionResultDto) {}
