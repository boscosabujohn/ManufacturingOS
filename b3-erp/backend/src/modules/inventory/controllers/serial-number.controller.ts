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
import { SerialNumberService } from '../services/serial-number.service';
import {
  CreateSerialNumberDto,
  UpdateSerialNumberDto,
  SerialNumberResponseDto,
} from '../dto';

@ApiTags('Inventory - Serial Number')
@Controller('inventory/serial-numbers')
export class SerialNumberController {
  constructor(private readonly serialNumberService: SerialNumberService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new serial number' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SerialNumberResponseDto })
  async create(
    @Body() createDto: CreateSerialNumberDto,
  ): Promise<SerialNumberResponseDto> {
    return this.serialNumberService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all serial numbers' })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [SerialNumberResponseDto] })
  async findAll(
    @Query('itemId') itemId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
  ): Promise<SerialNumberResponseDto[]> {
    return this.serialNumberService.findAll({ itemId, warehouseId, status });
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available serial numbers' })
  @ApiQuery({ name: 'itemId', required: true })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [SerialNumberResponseDto] })
  async findAvailable(
    @Query('itemId') itemId: string,
    @Query('warehouseId') warehouseId?: string,
  ): Promise<SerialNumberResponseDto[]> {
    return this.serialNumberService.findAvailable(itemId, warehouseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get serial number by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: SerialNumberResponseDto })
  async findOne(@Param('id') id: string): Promise<SerialNumberResponseDto> {
    return this.serialNumberService.findOne(id);
  }

  @Get('by-serial/:serialNumber')
  @ApiOperation({ summary: 'Get by serial number' })
  @ApiParam({ name: 'serialNumber' })
  @ApiResponse({ status: HttpStatus.OK, type: SerialNumberResponseDto })
  async findBySerial(
    @Param('serialNumber') serialNumber: string,
  ): Promise<SerialNumberResponseDto> {
    return this.serialNumberService.findBySerial(serialNumber);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update serial number' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: SerialNumberResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSerialNumberDto,
  ): Promise<SerialNumberResponseDto> {
    return this.serialNumberService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete serial number' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: string): Promise<void> {
    return this.serialNumberService.remove(id);
  }
}
