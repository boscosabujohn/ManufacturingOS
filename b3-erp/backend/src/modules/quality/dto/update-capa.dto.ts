import { PartialType } from '@nestjs/swagger';
import { CreateCAPADto } from './create-capa.dto';

export class UpdateCAPADto extends PartialType(CreateCAPADto) {}
