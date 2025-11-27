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
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SystemConfigService } from '../services/system-config.service';
import { CreateSystemConfigDto } from '../dto/create-system-config.dto';
import { UpdateSystemConfigDto } from '../dto/update-system-config.dto';
import { ConfigCategory } from '../entities/system-config.entity';

@ApiTags('IT Admin - System Config')
@Controller('it-admin/system-config')
export class SystemConfigController {
  constructor(private readonly configService: SystemConfigService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new system config' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Config created successfully',
  })
  async create(@Body() createDto: CreateSystemConfigDto): Promise<any> {
    return this.configService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all system configs' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'module', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of configs',
  })
  async findAll(@Query() filters: any): Promise<any[]> {
    return this.configService.findAll(filters);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get configs by category' })
  @ApiParam({ name: 'category', description: 'Category name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of configs',
  })
  async getByCategory(@Param('category') category: string): Promise<any[]> {
    return this.configService.getByCategory(category as ConfigCategory);
  }

  @Get('module/:module')
  @ApiOperation({ summary: 'Get configs by module' })
  @ApiParam({ name: 'module', description: 'Module name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of configs',
  })
  async getByModule(@Param('module') module: string): Promise<any[]> {
    return this.configService.getByModule(module);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get config by ID' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Config details',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Config not found' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.configService.findOne(id);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get config by key' })
  @ApiParam({ name: 'key', description: 'Config key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Config details',
  })
  async findByKey(@Param('key') key: string): Promise<any> {
    return this.configService.findByKey(key);
  }

  @Get('value/:key')
  @ApiOperation({ summary: 'Get config value by key' })
  @ApiParam({ name: 'key', description: 'Config key' })
  @ApiQuery({ name: 'default', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Config value',
  })
  async getValue(
    @Param('key') key: string,
    @Query('default') defaultValue?: any,
  ): Promise<any> {
    return this.configService.getValue(key, defaultValue);
  }

  @Patch('value/:key')
  @ApiOperation({ summary: 'Set config value by key' })
  @ApiParam({ name: 'key', description: 'Config key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Config value updated',
  })
  async setValue(
    @Param('key') key: string,
    @Body() body: { value: any },
  ): Promise<any> {
    return this.configService.setValue(key, body.value);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update config' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Config updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSystemConfigDto,
  ): Promise<any> {
    return this.configService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete config' })
  @ApiParam({ name: 'id', description: 'Config ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Config deleted successfully',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.configService.remove(id);
  }
}
