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
import { DeliveryNoteService } from '../services/delivery-note.service';
import {
  CreateDeliveryNoteDto,
  UpdateDeliveryNoteDto,
  DeliveryNoteResponseDto,
} from '../dto';

@ApiTags('Logistics - Delivery Note')
@Controller('logistics/delivery-notes')
export class DeliveryNoteController {
  constructor(private readonly deliveryNoteService: DeliveryNoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery note' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: DeliveryNoteResponseDto,
  })
  async create(
    @Body() createDto: CreateDeliveryNoteDto,
  ): Promise<DeliveryNoteResponseDto> {
    return this.deliveryNoteService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all delivery notes' })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [DeliveryNoteResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
  ): Promise<DeliveryNoteResponseDto[]> {
    return this.deliveryNoteService.findAll({ status, customerId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery note by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeliveryNoteResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<DeliveryNoteResponseDto> {
    return this.deliveryNoteService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update delivery note' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeliveryNoteResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDeliveryNoteDto,
  ): Promise<DeliveryNoteResponseDto> {
    return this.deliveryNoteService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete delivery note' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.deliveryNoteService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit delivery note' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeliveryNoteResponseDto,
  })
  async submit(@Param('id') id: string): Promise<DeliveryNoteResponseDto> {
    return this.deliveryNoteService.submit(id);
  }

  @Post(':id/mark-delivered')
  @ApiOperation({ summary: 'Mark delivery note as delivered' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeliveryNoteResponseDto,
  })
  async markDelivered(@Param('id') id: string): Promise<DeliveryNoteResponseDto> {
    return this.deliveryNoteService.markDelivered(id);
  }
}
