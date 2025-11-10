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
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UomService } from '../services/uom.service';
import { CreateUomDto } from '../dto/create-uom.dto';
import { UpdateUomDto } from '../dto/update-uom.dto';
import { UomResponseDto } from '../dto/uom-response.dto';

@ApiTags('Unit of Measures')
@Controller('api/v1/core/uoms')
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Get()
  @ApiOperation({ summary: 'Get all UOMs with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of UOMs retrieved successfully',
    type: [UomResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'uomType', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('uomType') uomType?: string,
    @Query('isActive') isActive?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters = {
      search,
      uomType,
      isActive,
    };

    const pagination = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
    };

    return this.uomService.findAll(filters, pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new UOM' })
  @ApiResponse({
    status: 201,
    description: 'UOM created successfully',
    type: UomResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'UOM already exists' })
  async create(@Body() createUomDto: CreateUomDto): Promise<UomResponseDto> {
    return this.uomService.create(createUomDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get UOM by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UOM UUID' })
  @ApiResponse({
    status: 200,
    description: 'UOM retrieved successfully',
    type: UomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'UOM not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UomResponseDto> {
    return this.uomService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update UOM by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UOM UUID' })
  @ApiResponse({
    status: 200,
    description: 'UOM updated successfully',
    type: UomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'UOM not found' })
  @ApiResponse({ status: 409, description: 'UOM code already exists' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUomDto: UpdateUomDto,
  ): Promise<UomResponseDto> {
    return this.uomService.update(id, updateUomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete UOM by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UOM UUID' })
  @ApiResponse({ status: 204, description: 'UOM deleted successfully' })
  @ApiResponse({ status: 404, description: 'UOM not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete UOM that is used as a base',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.uomService.remove(id);
  }

  @Get('filter/active')
  @ApiOperation({ summary: 'Get all active UOMs' })
  @ApiResponse({
    status: 200,
    description: 'Active UOMs retrieved successfully',
    type: [UomResponseDto],
  })
  async getActiveUoms(): Promise<UomResponseDto[]> {
    return this.uomService.getActiveUoms();
  }

  @Get('type/:uomType')
  @ApiOperation({ summary: 'Get UOMs by type' })
  @ApiParam({ name: 'uomType', type: String })
  @ApiResponse({
    status: 200,
    description: 'UOMs retrieved successfully',
    type: [UomResponseDto],
  })
  async getUomsByType(
    @Param('uomType') uomType: string,
  ): Promise<UomResponseDto[]> {
    return this.uomService.getUomsByType(uomType);
  }

  @Get('filter/base')
  @ApiOperation({ summary: 'Get all base UOMs' })
  @ApiResponse({
    status: 200,
    description: 'Base UOMs retrieved successfully',
    type: [UomResponseDto],
  })
  async getBaseUoms(): Promise<UomResponseDto[]> {
    return this.uomService.getBaseUoms();
  }

  @Get(':baseUOMId/derived')
  @ApiOperation({ summary: 'Get derived UOMs by base UOM ID' })
  @ApiParam({ name: 'baseUOMId', type: String, description: 'Base UOM UUID' })
  @ApiResponse({
    status: 200,
    description: 'Derived UOMs retrieved successfully',
    type: [UomResponseDto],
  })
  async getDerivedUoms(
    @Param('baseUOMId', ParseUUIDPipe) baseUOMId: string,
  ): Promise<UomResponseDto[]> {
    return this.uomService.getDerivedUoms(baseUOMId);
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert quantity between UOMs' })
  @ApiResponse({
    status: 200,
    description: 'Quantity converted successfully',
  })
  @ApiResponse({ status: 400, description: 'Cannot convert between different UOM types' })
  async convertQuantity(
    @Body('quantity') quantity: number,
    @Body('fromUomId') fromUomId: string,
    @Body('toUomId') toUomId: string,
  ): Promise<{ quantity: number; fromUomId: string; toUomId: string; convertedQuantity: number }> {
    const convertedQuantity = await this.uomService.convertQuantity(
      quantity,
      fromUomId,
      toUomId,
    );
    return {
      quantity,
      fromUomId,
      toUomId,
      convertedQuantity,
    };
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle UOM active status' })
  @ApiParam({ name: 'id', type: String, description: 'UOM UUID' })
  @ApiResponse({
    status: 200,
    description: 'UOM active status toggled successfully',
    type: UomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'UOM not found' })
  async toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UomResponseDto> {
    return this.uomService.toggleActive(id);
  }
}
