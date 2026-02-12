import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TeamMessageService } from '../services/team-message.service';
import { TeamMessage, MessageType, ChannelType } from '../entities/team-message.entity';

@ApiTags('Production - Collaboration - Team Messages')
@Controller('production/collaboration/team-messages')
export class TeamMessageController {
  constructor(private readonly teamMessageService: TeamMessageService) {}

  @Post()
  @ApiOperation({ summary: 'Create team message' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createDto: Partial<TeamMessage>): Promise<TeamMessage> {
    return this.teamMessageService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all team messages' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'channelId', required: false })
  @ApiQuery({ name: 'channelType', required: false })
  @ApiQuery({ name: 'senderId', required: false })
  @ApiQuery({ name: 'threadId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('channelId') channelId?: string,
    @Query('channelType') channelType?: ChannelType,
    @Query('senderId') senderId?: string,
    @Query('threadId') threadId?: string,
    @Query('limit') limit?: number,
  ): Promise<TeamMessage[]> {
    return this.teamMessageService.findAll({ companyId, channelId, channelType, senderId, threadId, limit });
  }

  @Get('channel/:channelId')
  @ApiOperation({ summary: 'Get messages by channel' })
  @ApiParam({ name: 'channelId' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'before', required: false })
  @ApiQuery({ name: 'after', required: false })
  async getChannelMessages(
    @Param('channelId') channelId: string,
    @Query('limit') limit?: number,
    @Query('before') before?: string,
    @Query('after') after?: string,
  ): Promise<TeamMessage[]> {
    return this.teamMessageService.getChannelMessages(channelId, {
      limit,
      before: before ? new Date(before) : undefined,
      after: after ? new Date(after) : undefined,
    });
  }

  @Get('thread/:threadId')
  @ApiOperation({ summary: 'Get thread messages' })
  @ApiParam({ name: 'threadId' })
  @ApiQuery({ name: 'limit', required: false })
  async getThreadMessages(
    @Param('threadId') threadId: string,
    @Query('limit') limit?: number,
  ): Promise<TeamMessage[]> {
    return this.teamMessageService.getThreadMessages(threadId, limit);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread messages count' })
  @ApiQuery({ name: 'channelId', required: true })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'since', required: true })
  async getUnreadCount(
    @Query('channelId') channelId: string,
    @Query('userId') userId: string,
    @Query('since') since: string,
  ): Promise<{ count: number }> {
    const count = await this.teamMessageService.getUnreadCount(channelId, userId, new Date(since));
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team message by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string): Promise<TeamMessage> {
    return this.teamMessageService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update team message' })
  @ApiParam({ name: 'id' })
  async update(
    @Param('id') id: string,
    @Body() body: { content: string; userId: string },
  ): Promise<TeamMessage> {
    return this.teamMessageService.update(id, { content: body.content }, body.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete team message' })
  @ApiParam({ name: 'id' })
  async remove(@Param('id') id: string, @Body('userId') userId: string): Promise<void> {
    return this.teamMessageService.remove(id, userId);
  }

  @Post(':id/reaction')
  @ApiOperation({ summary: 'Add reaction to message' })
  @ApiParam({ name: 'id' })
  async addReaction(
    @Param('id') id: string,
    @Body() reaction: { userId: string; userName: string; emoji: string },
  ): Promise<TeamMessage> {
    return this.teamMessageService.addReaction(id, reaction.userId, reaction.userName, reaction.emoji);
  }

  @Delete(':id/reaction')
  @ApiOperation({ summary: 'Remove reaction from message' })
  @ApiParam({ name: 'id' })
  async removeReaction(
    @Param('id') id: string,
    @Body() reaction: { userId: string; emoji: string },
  ): Promise<TeamMessage> {
    return this.teamMessageService.removeReaction(id, reaction.userId, reaction.emoji);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiParam({ name: 'id' })
  async markAsRead(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ): Promise<TeamMessage> {
    return this.teamMessageService.markAsRead(id, userId);
  }

  @Post(':id/pin')
  @ApiOperation({ summary: 'Pin message' })
  @ApiParam({ name: 'id' })
  async pinMessage(@Param('id') id: string): Promise<TeamMessage> {
    return this.teamMessageService.pinMessage(id);
  }

  @Post(':id/unpin')
  @ApiOperation({ summary: 'Unpin message' })
  @ApiParam({ name: 'id' })
  async unpinMessage(@Param('id') id: string): Promise<TeamMessage> {
    return this.teamMessageService.unpinMessage(id);
  }

  @Post(':id/reply')
  @ApiOperation({ summary: 'Reply to message' })
  @ApiParam({ name: 'id' })
  async createReply(
    @Param('id') id: string,
    @Body() replyDto: Partial<TeamMessage>,
  ): Promise<TeamMessage> {
    return this.teamMessageService.createReply(id, replyDto);
  }
}
