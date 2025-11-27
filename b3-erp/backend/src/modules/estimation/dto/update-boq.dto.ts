import { PartialType } from '@nestjs/mapped-types';
import { CreateBOQDto } from './create-boq.dto';

export class UpdateBOQDto extends PartialType(CreateBOQDto) { }
