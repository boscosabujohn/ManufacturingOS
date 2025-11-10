import { PartialType } from '@nestjs/swagger';
import { CreateTransportCompanyDto } from './create-transport-company.dto';

export class UpdateTransportCompanyDto extends PartialType(
  CreateTransportCompanyDto,
) {}
