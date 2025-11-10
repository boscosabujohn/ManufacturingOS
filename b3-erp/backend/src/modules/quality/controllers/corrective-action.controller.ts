import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CorrectiveActionService } from '../services/corrective-action.service';
import { CreateCorrectiveActionDto, UpdateCorrectiveActionDto, CorrectiveActionResponseDto } from '../dto';

@ApiTags('Quality - Corrective Action')
@Controller('quality/corrective-action')
export class CorrectiveActionController {
  constructor(private readonly caService: CorrectiveActionService) {}

  @Post()
  @ApiOperation({ summary: 'Create corrective action' })
  async create(@Body() createDto: CreateCorrectiveActionDto): Promise<CorrectiveActionResponseDto> {
    return this.caService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all corrective actions' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<CorrectiveActionResponseDto[]> {
    return this.caService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get corrective action by ID' })
  async findOne(@Param('id') id: string): Promise<CorrectiveActionResponseDto> {
    return this.caService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update corrective action' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCorrectiveActionDto): Promise<CorrectiveActionResponseDto> {
    return this.caService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete corrective action' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.caService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit corrective action' })
  async submit(@Param('id') id: string, @Body('submittedBy') submittedBy: string): Promise<CorrectiveActionResponseDto> {
    return this.caService.submit(id, submittedBy);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve corrective action' })
  async approve(@Param('id') id: string, @Body('approvedBy') approvedBy: string): Promise<CorrectiveActionResponseDto> {
    return this.caService.approve(id, approvedBy);
  }

  @Post(':id/implement')
  @ApiOperation({ summary: 'Implement corrective action' })
  async implement(@Param('id') id: string, @Body('implementedBy') implementedBy: string): Promise<CorrectiveActionResponseDto> {
    return this.caService.implement(id, implementedBy);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify corrective action' })
  async verify(
    @Param('id') id: string,
    @Body('verifiedBy') verifiedBy: string,
    @Body('isEffective') isEffective: boolean,
  ): Promise<CorrectiveActionResponseDto> {
    return this.caService.verify(id, verifiedBy, isEffective);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close corrective action' })
  async close(@Param('id') id: string, @Body('closedBy') closedBy: string): Promise<CorrectiveActionResponseDto> {
    return this.caService.close(id, closedBy);
  }
}
