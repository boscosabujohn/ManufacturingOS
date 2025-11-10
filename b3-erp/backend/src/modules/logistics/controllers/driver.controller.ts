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
import { DriverService } from '../services/driver.service';
import {
  CreateDriverDto,
  UpdateDriverDto,
  DriverResponseDto,
} from '../dto';

@ApiTags('Logistics - Driver')
@Controller('logistics/drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: DriverResponseDto,
  })
  async create(
    @Body() createDto: CreateDriverDto,
  ): Promise<DriverResponseDto> {
    return this.driverService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isAvailable', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [DriverResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('transportCompanyId') transportCompanyId?: string,
  ): Promise<DriverResponseDto[]> {
    return this.driverService.findAll({ status, isAvailable, transportCompanyId });
  }

  @Get('available')
  @ApiOperation({ summary: 'Get all available drivers' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [DriverResponseDto],
  })
  async findAvailable(): Promise<DriverResponseDto[]> {
    return this.driverService.findAvailable();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DriverResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<DriverResponseDto> {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update driver' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DriverResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDriverDto,
  ): Promise<DriverResponseDto> {
    return this.driverService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete driver' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.driverService.remove(id);
  }

  @Post(':id/mark-on-trip')
  @ApiOperation({ summary: 'Mark driver as on trip' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DriverResponseDto,
  })
  async markOnTrip(
    @Param('id') id: string,
    @Body('tripId') tripId: string,
  ): Promise<DriverResponseDto> {
    return this.driverService.markOnTrip(id, tripId);
  }

  @Post(':id/mark-available')
  @ApiOperation({ summary: 'Mark driver as available' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DriverResponseDto,
  })
  async markAvailable(@Param('id') id: string): Promise<DriverResponseDto> {
    return this.driverService.markAvailable(id);
  }

  @Get(':id/performance')
  @ApiOperation({ summary: 'Get driver performance metrics' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getPerformance(@Param('id') id: string): Promise<any> {
    return this.driverService.getDriverPerformance(id);
  }
}
