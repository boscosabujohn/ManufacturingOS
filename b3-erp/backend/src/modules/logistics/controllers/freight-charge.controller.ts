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
import { FreightChargeService } from '../services/freight-charge.service';
import {
  CreateFreightChargeDto,
  UpdateFreightChargeDto,
  FreightChargeResponseDto,
} from '../dto';

@ApiTags('Logistics - Freight Charge')
@Controller('logistics/freight-charges')
export class FreightChargeController {
  constructor(private readonly freightChargeService: FreightChargeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new freight charge' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: FreightChargeResponseDto,
  })
  async create(
    @Body() createDto: CreateFreightChargeDto,
  ): Promise<FreightChargeResponseDto> {
    return this.freightChargeService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all freight charges' })
  @ApiQuery({ name: 'shipmentId', required: false })
  @ApiQuery({ name: 'tripId', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [FreightChargeResponseDto],
  })
  async findAll(
    @Query('shipmentId') shipmentId?: string,
    @Query('tripId') tripId?: string,
    @Query('chargeType') chargeType?: string,
  ): Promise<FreightChargeResponseDto[]> {
    return this.freightChargeService.findAll({ shipmentId, tripId, chargeType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get freight charge by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FreightChargeResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<FreightChargeResponseDto> {
    return this.freightChargeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update freight charge' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: FreightChargeResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFreightChargeDto,
  ): Promise<FreightChargeResponseDto> {
    return this.freightChargeService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete freight charge' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.freightChargeService.remove(id);
  }

  @Get('shipment/:shipmentId/calculate')
  @ApiOperation({ summary: 'Calculate total charges for a shipment' })
  @ApiParam({ name: 'shipmentId' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async calculateCharges(@Param('shipmentId') shipmentId: string): Promise<any> {
    return this.freightChargeService.calculateCharges(shipmentId);
  }

  @Get('shipment/:shipmentId/charges')
  @ApiOperation({ summary: 'Get all charges for a shipment' })
  @ApiParam({ name: 'shipmentId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [FreightChargeResponseDto],
  })
  async getShipmentCharges(
    @Param('shipmentId') shipmentId: string,
  ): Promise<FreightChargeResponseDto[]> {
    return this.freightChargeService.getShipmentCharges(shipmentId);
  }
}
