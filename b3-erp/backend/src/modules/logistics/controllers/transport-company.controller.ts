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
import { TransportCompanyService } from '../services/transport-company.service';
import {
  CreateTransportCompanyDto,
  UpdateTransportCompanyDto,
  TransportCompanyResponseDto,
} from '../dto';

@ApiTags('Logistics - Transport Company')
@Controller('logistics/transport-companies')
export class TransportCompanyController {
  constructor(
    private readonly transportCompanyService: TransportCompanyService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transport company' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TransportCompanyResponseDto,
  })
  async create(
    @Body() createDto: CreateTransportCompanyDto,
  ): Promise<TransportCompanyResponseDto> {
    return this.transportCompanyService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transport companies' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'companyType', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TransportCompanyResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('companyType') companyType?: string,
    @Query('city') city?: string,
  ): Promise<TransportCompanyResponseDto[]> {
    return this.transportCompanyService.findAll({ status, companyType, city });
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active transport companies' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TransportCompanyResponseDto],
  })
  async findActive(): Promise<TransportCompanyResponseDto[]> {
    return this.transportCompanyService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transport company by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TransportCompanyResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<TransportCompanyResponseDto> {
    return this.transportCompanyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update transport company' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TransportCompanyResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTransportCompanyDto,
  ): Promise<TransportCompanyResponseDto> {
    return this.transportCompanyService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete transport company' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.transportCompanyService.remove(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate transport company' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TransportCompanyResponseDto,
  })
  async activate(@Param('id') id: string): Promise<TransportCompanyResponseDto> {
    return this.transportCompanyService.activate(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate transport company' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TransportCompanyResponseDto,
  })
  async deactivate(@Param('id') id: string): Promise<TransportCompanyResponseDto> {
    return this.transportCompanyService.deactivate(id);
  }

  @Post(':id/blacklist')
  @ApiOperation({ summary: 'Blacklist transport company' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: TransportCompanyResponseDto,
  })
  async blacklist(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<TransportCompanyResponseDto> {
    return this.transportCompanyService.blacklist(id, reason);
  }

  @Get(':id/performance')
  @ApiOperation({ summary: 'Get transport company performance metrics' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getPerformance(@Param('id') id: string): Promise<any> {
    return this.transportCompanyService.getPerformance(id);
  }
}
