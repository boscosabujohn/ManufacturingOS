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
import { TrackingEventService } from '../services/tracking-event.service';
import {
  CreateTrackingEventDto,
  UpdateTrackingEventDto,
  TrackingEventResponseDto,
} from '../dto';

@ApiTags('Logistics - Tracking Event')
@Controller('logistics/tracking-events')
export class TrackingEventController {
  constructor(private readonly trackingEventService: TrackingEventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tracking event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TrackingEventResponseDto,
  })
  async create(
    @Body() createDto: CreateTrackingEventDto,
  ): Promise<TrackingEventResponseDto> {
    return this.trackingEventService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracking events' })
  @ApiQuery({ name: 'shipmentId', required: false })
  @ApiQuery({ name: 'tripId', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TrackingEventResponseDto],
  })
  async findAll(
    @Query('shipmentId') shipmentId?: string,
    @Query('tripId') tripId?: string,
    @Query('eventType') eventType?: string,
  ): Promise<TrackingEventResponseDto[]> {
    return this.trackingEventService.findAll({ shipmentId, tripId, eventType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tracking event by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TrackingEventResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<TrackingEventResponseDto> {
    return this.trackingEventService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tracking event' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TrackingEventResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTrackingEventDto,
  ): Promise<TrackingEventResponseDto> {
    return this.trackingEventService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tracking event' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.trackingEventService.remove(id);
  }

  @Get('shipment/:shipmentId')
  @ApiOperation({ summary: 'Get all events for a shipment' })
  @ApiParam({ name: 'shipmentId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TrackingEventResponseDto],
  })
  async getShipmentEvents(
    @Param('shipmentId') shipmentId: string,
  ): Promise<TrackingEventResponseDto[]> {
    return this.trackingEventService.getShipmentEvents(shipmentId);
  }

  @Get('trip/:tripId')
  @ApiOperation({ summary: 'Get all events for a trip' })
  @ApiParam({ name: 'tripId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TrackingEventResponseDto],
  })
  async getTripEvents(
    @Param('tripId') tripId: string,
  ): Promise<TrackingEventResponseDto[]> {
    return this.trackingEventService.getTripEvents(tripId);
  }
}
