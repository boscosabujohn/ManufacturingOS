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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BOMService } from '../services/bom.service';
import { CreateBOMDto, UpdateBOMDto, BOMResponseDto } from '../dto';

@ApiTags('Production - BOM')
@Controller('production/bom')
export class BOMController {
  constructor(private readonly bomService: BOMService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new BOM' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'BOM created successfully', type: BOMResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(@Body() createDto: CreateBOMDto): Promise<BOMResponseDto> {
    return this.bomService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all BOMs' })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of BOMs', type: [BOMResponseDto] })
  async findAll(
    @Query('itemId') itemId?: string,
    @Query('status') status?: any,
    @Query('isActive') isActive?: boolean,
  ): Promise<BOMResponseDto[]> {
    return this.bomService.findAll({ itemId, status, isActive });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get BOM by ID' })
  @ApiParam({ name: 'id', description: 'BOM ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'BOM details', type: BOMResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'BOM not found' })
  async findOne(@Param('id') id: string): Promise<BOMResponseDto> {
    return this.bomService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update BOM' })
  @ApiParam({ name: 'id', description: 'BOM ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'BOM updated successfully', type: BOMResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'BOM not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateBOMDto): Promise<BOMResponseDto> {
    return this.bomService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete BOM' })
  @ApiParam({ name: 'id', description: 'BOM ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'BOM deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'BOM not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.bomService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit BOM for approval' })
  @ApiParam({ name: 'id', description: 'BOM ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'BOM submitted successfully' })
  async submit(@Param('id') id: string, @Body('submittedBy') submittedBy: string): Promise<BOMResponseDto> {
    return this.bomService.submit(id, submittedBy);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve BOM' })
  @ApiParam({ name: 'id', description: 'BOM ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'BOM approved successfully' })
  async approve(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
    @Body('comments') comments?: string,
  ): Promise<BOMResponseDto> {
    return this.bomService.approve(id, approvedBy, comments);
  }

  @Get(':id/explode')
  @ApiOperation({ summary: 'Explode BOM (multi-level expansion)' })
  @ApiParam({ name: 'id', description: 'BOM ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'BOM exploded successfully' })
  async explodeBOM(@Param('id') id: string): Promise<any> {
    return this.bomService.explodeBOM(id);
  }

  @Post(':id/cost-rollup')
  @ApiOperation({ summary: 'Perform cost rollup calculation' })
  @ApiParam({ name: 'id', description: 'BOM ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cost rollup completed' })
  async costRollup(@Param('id') id: string): Promise<BOMResponseDto> {
    return this.bomService.costRollup(id);
  }

  @Get('item/:itemId/where-used')
  @ApiOperation({ summary: 'Where-used analysis for an item' })
  @ApiParam({ name: 'itemId', description: 'Item ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Where-used list' })
  async whereUsed(@Param('itemId') itemId: string): Promise<any[]> {
    return this.bomService.whereUsed(itemId);
  }
}
