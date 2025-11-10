import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationPreferenceService } from '../services/notification-preference.service';
import { CreateNotificationPreferenceDto } from '../dto/create-notification-preference.dto';
import { UpdateNotificationPreferenceDto } from '../dto/update-notification-preference.dto';

@ApiTags('IT Admin - Notification Preferences')
@Controller('it-admin/notification-preferences')
export class NotificationPreferenceController {
  constructor(
    private readonly preferenceService: NotificationPreferenceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create notification preference' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Preference created successfully',
  })
  async create(
    @Body() createDto: CreateNotificationPreferenceDto,
  ): Promise<any> {
    return this.preferenceService.create(createDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all preferences for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of preferences',
  })
  async findAll(@Param('userId') userId: string): Promise<any[]> {
    return this.preferenceService.findAll(userId);
  }

  @Get('user/:userId/category/:category')
  @ApiOperation({ summary: 'Get preference by user and category' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'category', description: 'Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Preference details',
  })
  async findOne(
    @Param('userId') userId: string,
    @Param('category') category: string,
  ): Promise<any> {
    return this.preferenceService.findOne(userId, category);
  }

  @Put('user/:userId/category/:category')
  @ApiOperation({ summary: 'Update preference' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'category', description: 'Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Preference updated successfully',
  })
  async update(
    @Param('userId') userId: string,
    @Param('category') category: string,
    @Body() updateDto: UpdateNotificationPreferenceDto,
  ): Promise<any> {
    return this.preferenceService.update(userId, category, updateDto);
  }

  @Post('user/:userId/category/:category/upsert')
  @ApiOperation({ summary: 'Upsert preference (create or update)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'category', description: 'Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Preference upserted successfully',
  })
  async upsert(
    @Param('userId') userId: string,
    @Param('category') category: string,
    @Body() data: UpdateNotificationPreferenceDto,
  ): Promise<any> {
    return this.preferenceService.upsert(userId, category, data);
  }

  @Get('user/:userId/category/:category/enabled')
  @ApiOperation({ summary: 'Check if category is enabled for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'category', description: 'Category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Enabled status',
  })
  async isEnabled(
    @Param('userId') userId: string,
    @Param('category') category: string,
  ): Promise<any> {
    const enabled = await this.preferenceService.isEnabled(userId, category);
    return { enabled };
  }

  @Delete('user/:userId/category/:category')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete preference' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'category', description: 'Category' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Preference deleted successfully',
  })
  async remove(
    @Param('userId') userId: string,
    @Param('category') category: string,
  ): Promise<void> {
    return this.preferenceService.remove(userId, category);
  }
}
