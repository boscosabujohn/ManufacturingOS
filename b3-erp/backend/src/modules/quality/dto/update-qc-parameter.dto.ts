import { PartialType } from '@nestjs/swagger';
import { CreateQCParameterDto } from './create-qc-parameter.dto';

export class UpdateQCParameterDto extends PartialType(CreateQCParameterDto) {}
