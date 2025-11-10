import {
  Controller,
  Get,
  Post,
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
} from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationQueryDto } from '../dto/notification-query.dto';

@ApiTags('IT Admin - Notifications')
@Controller('it-admin/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create notification(s)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Notification created successfully',
  })
  async create(@Body() createDto: CreateNotificationDto): Promise<any> {
    return this.notificationService.create(createDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of notifications',
  })
  async findAll(
    @Param('userId') userId: string,
    @Query() query: NotificationQueryDto,
  ): Promise<any> {
    return this.notificationService.findAll(userId, query);
  }

  @Get(':id/user/:userId')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification details',
  })
  async findOne(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<any> {
    return this.notificationService.findOne(id, userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification marked as read',
  })
  async markAsRead(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<any> {
    return this.notificationService.markAsRead(id, body.userId);
  }

  @Patch(':id/unread')
  @ApiOperation({ summary: 'Mark notification as unread' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification marked as unread',
  })
  async markAsUnread(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<any> {
    return this.notificationService.markAsUnread(id, body.userId);
  }

  @Patch('user/:userId/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All notifications marked as read',
  })
  async markAllAsRead(@Param('userId') userId: string): Promise<any> {
    return this.notificationService.markAllAsRead(userId);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification archived',
  })
  async archive(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<any> {
    return this.notificationService.archive(id, body.userId);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification unarchived',
  })
  async unarchive(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<any> {
    return this.notificationService.unarchive(id, body.userId);
  }

  @Patch(':id/pin')
  @ApiOperation({ summary: 'Pin notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification pinned',
  })
  async pin(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<any> {
    return this.notificationService.pin(id, body.userId);
  }

  @Patch(':id/unpin')
  @ApiOperation({ summary: 'Unpin notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification unpinned',
  })
  async unpin(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<any> {
    return this.notificationService.unpin(id, body.userId);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk delete notifications' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notifications deleted',
  })
  async bulkDelete(
    @Body() body: { ids: string[]; userId: string },
  ): Promise<any> {
    return this.notificationService.bulkDelete(body.ids, body.userId);
  }

  @Get('user/:userId/unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unread count',
  })
  async getUnreadCount(@Param('userId') userId: string): Promise<any> {
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Delete(':id/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Notification deleted successfully',
  })
  async remove(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.notificationService.remove(id, userId);
  }
}
