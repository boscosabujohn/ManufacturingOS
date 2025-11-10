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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QCTemplateService } from '../services/qc-template.service';
import { CreateQCTemplateDto, UpdateQCTemplateDto, QCTemplateResponseDto } from '../dto';

@ApiTags('Quality - QC Template')
@Controller('quality/qc-template')
export class QCTemplateController {
  constructor(private readonly qcTemplateService: QCTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new QC template' })
  @ApiResponse({ status: HttpStatus.CREATED, type: QCTemplateResponseDto })
  async create(@Body() createDto: CreateQCTemplateDto): Promise<QCTemplateResponseDto> {
    return this.qcTemplateService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all QC templates' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'templateType', required: false })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [QCTemplateResponseDto] })
  async findAll(
    @Query('status') status?: any,
    @Query('templateType') templateType?: string,
    @Query('itemId') itemId?: string,
  ): Promise<QCTemplateResponseDto[]> {
    return this.qcTemplateService.findAll({ status, templateType, itemId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get QC template by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: QCTemplateResponseDto })
  async findOne(@Param('id') id: string): Promise<QCTemplateResponseDto> {
    return this.qcTemplateService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update QC template' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: QCTemplateResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateQCTemplateDto,
  ): Promise<QCTemplateResponseDto> {
    return this.qcTemplateService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete QC template' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.qcTemplateService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate QC template' })
  @ApiParam({ name: 'id' })
  async activate(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
  ): Promise<QCTemplateResponseDto> {
    return this.qcTemplateService.activate(id, approvedBy);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate QC template' })
  @ApiParam({ name: 'id' })
  async deactivate(@Param('id') id: string): Promise<QCTemplateResponseDto> {
    return this.qcTemplateService.deactivate(id);
  }

  @Post(':id/new-version')
  @ApiOperation({ summary: 'Create new version of QC template' })
  @ApiParam({ name: 'id' })
  async createNewVersion(@Param('id') id: string): Promise<QCTemplateResponseDto> {
    return this.qcTemplateService.createNewVersion(id);
  }
}
