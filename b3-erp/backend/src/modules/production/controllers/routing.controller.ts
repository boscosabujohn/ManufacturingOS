import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RoutingService } from '../services/routing.service';
import { CreateRoutingDto, UpdateRoutingDto, RoutingResponseDto } from '../dto';

@ApiTags('Production - Routing')
@Controller('production/routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new routing' })
  @ApiResponse({ status: HttpStatus.CREATED, type: RoutingResponseDto })
  async create(@Body() createDto: CreateRoutingDto): Promise<RoutingResponseDto> {
    return this.routingService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routings' })
  @ApiQuery({ name: 'itemId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [RoutingResponseDto] })
  async findAll(
    @Query('itemId') itemId?: string,
    @Query('status') status?: any,
    @Query('isActive') isActive?: boolean,
  ): Promise<RoutingResponseDto[]> {
    return this.routingService.findAll({ itemId, status, isActive });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get routing by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: RoutingResponseDto })
  async findOne(@Param('id') id: string): Promise<RoutingResponseDto> {
    return this.routingService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update routing' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: RoutingResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateRoutingDto): Promise<RoutingResponseDto> {
    return this.routingService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete routing' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.routingService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit routing for approval' })
  @ApiParam({ name: 'id' })
  async submit(@Param('id') id: string, @Body('submittedBy') submittedBy: string): Promise<RoutingResponseDto> {
    return this.routingService.submit(id, submittedBy);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve routing' })
  @ApiParam({ name: 'id' })
  async approve(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
    @Body('comments') comments?: string,
  ): Promise<RoutingResponseDto> {
    return this.routingService.approve(id, approvedBy, comments);
  }
}
