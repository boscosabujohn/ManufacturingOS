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
import { VendorEvaluationService } from '../services/vendor-evaluation.service';
import {
  CreateVendorEvaluationDto,
  UpdateVendorEvaluationDto,
  VendorEvaluationResponseDto,
} from '../dto';

@ApiTags('Procurement - Vendor Evaluations')
@Controller('procurement/vendor-evaluations')
export class VendorEvaluationController {
  constructor(private readonly evaluationService: VendorEvaluationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor evaluation' })
  async create(@Body() createDto: CreateVendorEvaluationDto): Promise<VendorEvaluationResponseDto> {
    return this.evaluationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendor evaluations' })
  async findAll(@Query() filters?: any): Promise<VendorEvaluationResponseDto[]> {
    return this.evaluationService.findAll(filters);
  }

  @Get('vendor/:vendorId/performance')
  @ApiOperation({ summary: 'Get vendor performance report' })
  async getVendorPerformanceReport(@Param('vendorId') vendorId: string): Promise<any> {
    return this.evaluationService.getVendorPerformanceReport(vendorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor evaluation by ID' })
  async findOne(@Param('id') id: string): Promise<VendorEvaluationResponseDto> {
    return this.evaluationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vendor evaluation' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateVendorEvaluationDto,
  ): Promise<VendorEvaluationResponseDto> {
    return this.evaluationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vendor evaluation' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.evaluationService.remove(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve vendor evaluation' })
  async approve(@Param('id') id: string, @Body() approverData: any): Promise<VendorEvaluationResponseDto> {
    return this.evaluationService.approve(id, approverData);
  }
}
