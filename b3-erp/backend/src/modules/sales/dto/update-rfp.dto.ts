import { PartialType } from '@nestjs/mapped-types';
import { CreateRFPDto } from './create-rfp.dto';
import { IsString } from 'class-validator';

export class UpdateRFPDto extends PartialType(CreateRFPDto) {
  @IsString()
  updatedBy: string;
}
