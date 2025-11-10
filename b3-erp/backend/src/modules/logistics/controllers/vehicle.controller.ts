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
import { VehicleService } from '../services/vehicle.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleResponseDto,
} from '../dto';

@ApiTags('Logistics - Vehicle')
@Controller('logistics/vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: VehicleResponseDto,
  })
  async create(
    @Body() createDto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'vehicleType', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [VehicleResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('vehicleType') vehicleType?: string,
    @Query('transportCompanyId') transportCompanyId?: string,
  ): Promise<VehicleResponseDto[]> {
    return this.vehicleService.findAll({ status, vehicleType, transportCompanyId });
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active vehicles' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [VehicleResponseDto],
  })
  async findActive(): Promise<VehicleResponseDto[]> {
    return this.vehicleService.findActive();
  }

  @Get('utilization')
  @ApiOperation({ summary: 'Get vehicle utilization report' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getUtilization(): Promise<any> {
    return this.vehicleService.getVehicleUtilization();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VehicleResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<VehicleResponseDto> {
    return this.vehicleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update vehicle' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VehicleResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vehicle' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.vehicleService.remove(id);
  }

  @Put(':id/location')
  @ApiOperation({ summary: 'Update vehicle location' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VehicleResponseDto,
  })
  async updateLocation(
    @Param('id') id: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.updateLocation(id, latitude, longitude);
  }

  @Put(':id/odometer')
  @ApiOperation({ summary: 'Update vehicle odometer' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: VehicleResponseDto,
  })
  async updateOdometer(
    @Param('id') id: string,
    @Body('reading') reading: number,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.updateOdometer(id, reading);
  }
}
