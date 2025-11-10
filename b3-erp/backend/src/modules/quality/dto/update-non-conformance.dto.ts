import { PartialType } from '@nestjs/swagger';
import { CreateNonConformanceDto } from './create-non-conformance.dto';

export class UpdateNonConformanceDto extends PartialType(CreateNonConformanceDto) {}
