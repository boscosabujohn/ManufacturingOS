import { PartialType } from '@nestjs/swagger';
import { CreateSerialNumberDto } from './create-serial-number.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SerialNumberStatus } from '../entities/serial-number.entity';

export class UpdateSerialNumberDto extends PartialType(CreateSerialNumberDto) {
  @ApiPropertyOptional({
    description: 'Serial number status',
    enum: SerialNumberStatus,
  })
  @IsEnum(SerialNumberStatus)
  @IsOptional()
  status?: SerialNumberStatus;
}
