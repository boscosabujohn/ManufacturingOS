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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RFQService } from '../services/rfq.service';
import { CreateRFQDto, UpdateRFQDto, RFQResponseDto } from '../dto';

@ApiTags('Procurement - RFQs')
@Controller('procurement/rfqs')
export class RFQController {
  constructor(private readonly rfqService: RFQService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new RFQ' })
  async create(@Body() createDto: CreateRFQDto): Promise<RFQResponseDto> {
    return this.rfqService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all RFQs' })
  async findAll(@Query() filters?: any): Promise<RFQResponseDto[]> {
    return this.rfqService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RFQ by ID' })
  async findOne(@Param('id') id: string): Promise<RFQResponseDto> {
    return this.rfqService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update RFQ' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRFQDto,
  ): Promise<RFQResponseDto> {
    return this.rfqService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete RFQ' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.rfqService.remove(id);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send RFQ to vendors' })
  async sendToVendors(@Param('id') id: string): Promise<RFQResponseDto> {
    return this.rfqService.sendToVendors(id);
  }

  @Get(':id/compare')
  @ApiOperation({ summary: 'Compare vendor quotations' })
  async compareQuotations(@Param('id') id: string): Promise<any> {
    return this.rfqService.compareQuotations(id);
  }

  @Post(':id/award')
  @ApiOperation({ summary: 'Award RFQ to vendor' })
  async awardRFQ(@Param('id') id: string, @Body() awardData: any): Promise<RFQResponseDto> {
    return this.rfqService.awardRFQ(id, awardData);
  }
}
