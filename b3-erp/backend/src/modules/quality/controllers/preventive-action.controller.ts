import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PreventiveActionService } from '../services/preventive-action.service';
import { CreatePreventiveActionDto, UpdatePreventiveActionDto, PreventiveActionResponseDto } from '../dto';

@ApiTags('Quality - Preventive Action')
@Controller('quality/preventive-action')
export class PreventiveActionController {
  constructor(private readonly paService: PreventiveActionService) {}

  @Post()
  @ApiOperation({ summary: 'Create preventive action' })
  async create(@Body() createDto: CreatePreventiveActionDto): Promise<PreventiveActionResponseDto> {
    return this.paService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all preventive actions' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<PreventiveActionResponseDto[]> {
    return this.paService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get preventive action by ID' })
  async findOne(@Param('id') id: string): Promise<PreventiveActionResponseDto> {
    return this.paService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update preventive action' })
  async update(@Param('id') id: string, @Body() updateDto: UpdatePreventiveActionDto): Promise<PreventiveActionResponseDto> {
    return this.paService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete preventive action' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.paService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit preventive action' })
  async submit(@Param('id') id: string, @Body('submittedBy') submittedBy: string): Promise<PreventiveActionResponseDto> {
    return this.paService.submit(id, submittedBy);
  }

  @Post(':id/implement')
  @ApiOperation({ summary: 'Implement preventive action' })
  async implement(@Param('id') id: string, @Body('implementedBy') implementedBy: string): Promise<PreventiveActionResponseDto> {
    return this.paService.implement(id, implementedBy);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify preventive action' })
  async verify(
    @Param('id') id: string,
    @Body('verifiedBy') verifiedBy: string,
    @Body('isEffective') isEffective: boolean,
  ): Promise<PreventiveActionResponseDto> {
    return this.paService.verify(id, verifiedBy, isEffective);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close preventive action' })
  async close(@Param('id') id: string, @Body('closedBy') closedBy: string): Promise<PreventiveActionResponseDto> {
    return this.paService.close(id, closedBy);
  }
}
