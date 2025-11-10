import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PurchaseReturnService } from '../services/purchase-return.service';
import {
  CreatePurchaseReturnDto,
  UpdatePurchaseReturnDto,
  PurchaseReturnResponseDto,
} from '../dto';

@ApiTags('Procurement - Purchase Returns')
@Controller('procurement/purchase-returns')
export class PurchaseReturnController {
  constructor(private readonly returnService: PurchaseReturnService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase return' })
  async create(@Body() createDto: CreatePurchaseReturnDto): Promise<PurchaseReturnResponseDto> {
    return this.returnService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchase returns' })
  async findAll(@Query() filters?: any): Promise<PurchaseReturnResponseDto[]> {
    return this.returnService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get purchase return by ID' })
  async findOne(@Param('id') id: string): Promise<PurchaseReturnResponseDto> {
    return this.returnService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update purchase return' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePurchaseReturnDto,
  ): Promise<PurchaseReturnResponseDto> {
    return this.returnService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete purchase return' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.returnService.remove(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve purchase return' })
  async approve(@Param('id') id: string, @Body() approverData: any): Promise<PurchaseReturnResponseDto> {
    return this.returnService.approve(id, approverData);
  }
}
