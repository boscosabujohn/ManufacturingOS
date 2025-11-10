import { PartialType } from '@nestjs/swagger';
import { CreateStockBalanceDto } from './create-stock-balance.dto';

export class UpdateStockBalanceDto extends PartialType(CreateStockBalanceDto) {}
