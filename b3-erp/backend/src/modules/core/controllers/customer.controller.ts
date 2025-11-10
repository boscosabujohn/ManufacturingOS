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
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';

@ApiTags('Customers')
@Controller('api/v1/core/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of customers retrieved successfully',
    type: [CustomerResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'customerType', required: false, type: String })
  @ApiQuery({ name: 'territory', required: false, type: String })
  @ApiQuery({ name: 'customerGroup', required: false, type: String })
  @ApiQuery({ name: 'salesPersonId', required: false, type: String })
  @ApiQuery({ name: 'creditRating', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('customerType') customerType?: string,
    @Query('territory') territory?: string,
    @Query('customerGroup') customerGroup?: string,
    @Query('salesPersonId') salesPersonId?: string,
    @Query('creditRating') creditRating?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const filters = {
      search,
      status,
      customerType,
      territory,
      customerGroup,
      salesPersonId,
      creditRating,
    };

    const pagination = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortOrder,
    };

    return this.customerService.findAll(filters, pagination);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Customer already exists' })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.create(createCustomerDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Customer UUID' })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CustomerResponseDto> {
    return this.customerService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Customer UUID' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 409, description: 'Customer code already exists' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete customer by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Customer UUID' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete customer with outstanding balance',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.customerService.remove(id);
  }

  @Get('territory/:territory')
  @ApiOperation({ summary: 'Get customers by territory' })
  @ApiParam({ name: 'territory', type: String })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: [CustomerResponseDto],
  })
  async getCustomersByTerritory(
    @Param('territory') territory: string,
  ): Promise<CustomerResponseDto[]> {
    return this.customerService.getCustomersByTerritory(territory);
  }

  @Get('salesperson/:salesPersonId')
  @ApiOperation({ summary: 'Get customers by sales person' })
  @ApiParam({ name: 'salesPersonId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: [CustomerResponseDto],
  })
  async getCustomersBySalesPerson(
    @Param('salesPersonId') salesPersonId: string,
  ): Promise<CustomerResponseDto[]> {
    return this.customerService.getCustomersBySalesPerson(salesPersonId);
  }

  @Get('reports/top-customers')
  @ApiOperation({ summary: 'Get top customers by sales' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Top customers retrieved successfully',
    type: [CustomerResponseDto],
  })
  async getTopCustomersBySales(
    @Query('limit') limit?: number,
  ): Promise<CustomerResponseDto[]> {
    return this.customerService.getTopCustomersBySales(
      limit ? Number(limit) : undefined,
    );
  }

  @Get('reports/outstanding-balance')
  @ApiOperation({ summary: 'Get customers with outstanding balance' })
  @ApiResponse({
    status: 200,
    description: 'Customers with outstanding balance retrieved successfully',
    type: [CustomerResponseDto],
  })
  async getCustomersWithOutstandingBalance(): Promise<CustomerResponseDto[]> {
    return this.customerService.getCustomersWithOutstandingBalance();
  }

  @Get('reports/exceeding-credit-limit')
  @ApiOperation({ summary: 'Get customers exceeding credit limit' })
  @ApiResponse({
    status: 200,
    description: 'Customers exceeding credit limit retrieved successfully',
    type: [CustomerResponseDto],
  })
  async getCustomersExceedingCreditLimit(): Promise<CustomerResponseDto[]> {
    return this.customerService.getCustomersExceedingCreditLimit();
  }
}
