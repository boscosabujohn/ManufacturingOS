import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CAPAService } from '../services/capa.service';
import { CreateCAPADto, UpdateCAPADto, CAPAResponseDto } from '../dto';

@ApiTags('Quality - CAPA')
@Controller('quality/capa')
export class CAPAController {
  constructor(private readonly capaService: CAPAService) {}

  @Post()
  @ApiOperation({ summary: 'Create CAPA' })
  async create(@Body() createDto: CreateCAPADto): Promise<CAPAResponseDto> {
    return this.capaService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all CAPAs' })
  @ApiQuery({ name: 'status', required: false })
  async findAll(@Query('status') status?: any): Promise<CAPAResponseDto[]> {
    return this.capaService.findAll({ status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CAPA by ID' })
  async findOne(@Param('id') id: string): Promise<CAPAResponseDto> {
    return this.capaService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update CAPA' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCAPADto): Promise<CAPAResponseDto> {
    return this.capaService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete CAPA' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.capaService.remove(id);
  }

  @Post(':id/initiate')
  @ApiOperation({ summary: 'Initiate CAPA' })
  async initiate(@Param('id') id: string, @Body('initiatedBy') initiatedBy: string): Promise<CAPAResponseDto> {
    return this.capaService.initiate(id, initiatedBy);
  }

  @Post(':id/implement')
  @ApiOperation({ summary: 'Implement CAPA' })
  async implement(@Param('id') id: string, @Body('implementedBy') implementedBy: string): Promise<CAPAResponseDto> {
    return this.capaService.implement(id, implementedBy);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify CAPA' })
  async verify(
    @Param('id') id: string,
    @Body('verifiedBy') verifiedBy: string,
    @Body('isEffective') isEffective: boolean,
  ): Promise<CAPAResponseDto> {
    return this.capaService.verify(id, verifiedBy, isEffective);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Close CAPA' })
  async close(@Param('id') id: string, @Body('closedBy') closedBy: string): Promise<CAPAResponseDto> {
    return this.capaService.close(id, closedBy);
  }
}
