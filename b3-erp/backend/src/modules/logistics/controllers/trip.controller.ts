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
import { TripService } from '../services/trip.service';
import {
  CreateTripDto,
  UpdateTripDto,
  TripResponseDto,
} from '../dto';

@ApiTags('Logistics - Trip')
@Controller('logistics/trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TripResponseDto,
  })
  async create(
    @Body() createDto: CreateTripDto,
  ): Promise<TripResponseDto> {
    return this.tripService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'vehicleId', required: false })
  @ApiQuery({ name: 'driverId', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TripResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('vehicleId') vehicleId?: string,
    @Query('driverId') driverId?: string,
  ): Promise<TripResponseDto[]> {
    return this.tripService.findAll({ status, vehicleId, driverId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TripResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<TripResponseDto> {
    return this.tripService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update trip' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TripResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTripDto,
  ): Promise<TripResponseDto> {
    return this.tripService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete trip' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.tripService.remove(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start trip' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TripResponseDto,
  })
  async start(@Param('id') id: string): Promise<TripResponseDto> {
    return this.tripService.startTrip(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete trip' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TripResponseDto,
  })
  async complete(@Param('id') id: string): Promise<TripResponseDto> {
    return this.tripService.completeTrip(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel trip' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TripResponseDto,
  })
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<TripResponseDto> {
    return this.tripService.cancelTrip(id, reason);
  }

  @Put(':id/location')
  @ApiOperation({ summary: 'Update trip location' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TripResponseDto,
  })
  async updateLocation(
    @Param('id') id: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ): Promise<TripResponseDto> {
    return this.tripService.updateLocation(id, latitude, longitude);
  }

  @Get(':id/tracking')
  @ApiOperation({ summary: 'Get trip tracking details' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getTracking(@Param('id') id: string): Promise<any> {
    return this.tripService.getTripTracking(id);
  }
}
