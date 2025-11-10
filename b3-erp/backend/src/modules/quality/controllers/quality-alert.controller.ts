import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QualityAlertService } from '../services/quality-alert.service';
import { CreateQualityAlertDto, UpdateQualityAlertDto, QualityAlertResponseDto } from '../dto';

@ApiTags('Quality - Quality Alert')
@Controller('quality/quality-alert')
export class QualityAlertController {
  constructor(private readonly alertService: QualityAlertService) {}

  @Post()
  @ApiOperation({ summary: 'Create quality alert' })
  async create(@Body() createDto: CreateQualityAlertDto): Promise<QualityAlertResponseDto> {
    return this.alertService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quality alerts' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<QualityAlertResponseDto[]> {
    return this.alertService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quality alert by ID' })
  async findOne(@Param('id') id: string): Promise<QualityAlertResponseDto> {
    return this.alertService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update quality alert' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateQualityAlertDto): Promise<QualityAlertResponseDto> {
    return this.alertService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete quality alert' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.alertService.remove(id);
  }

  @Post(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge quality alert' })
  async acknowledge(@Param('id') id: string, @Body('acknowledgedBy') acknowledgedBy: string): Promise<QualityAlertResponseDto> {
    return this.alertService.acknowledge(id, acknowledgedBy);
  }

  @Post(':id/resolve')
  @ApiOperation({ summary: 'Resolve quality alert' })
  async resolve(
    @Param('id') id: string,
    @Body('resolvedBy') resolvedBy: string,
    @Body('resolution') resolution: string,
  ): Promise<QualityAlertResponseDto> {
    return this.alertService.resolve(id, resolvedBy, resolution);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close quality alert' })
  async close(@Param('id') id: string, @Body('closedBy') closedBy: string): Promise<QualityAlertResponseDto> {
    return this.alertService.close(id, closedBy);
  }
}
