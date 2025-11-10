import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryNoteStatus } from '../entities/delivery-note.entity';

export class DeliveryNoteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deliveryNoteNumber: string;

  @ApiProperty({ enum: DeliveryNoteStatus })
  status: DeliveryNoteStatus;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  deliveryDate: Date;

  @ApiPropertyOptional()
  totalPackages?: number;

  @ApiPropertyOptional()
  totalWeight?: number;

  @ApiPropertyOptional()
  items?: any[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
