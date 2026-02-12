import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  VendorCollaborationService,
  CreateMessageDto,
  MessageFilter,
} from '../services/vendor-collaboration.service';
import { MessageType, MessageStatus, MessagePriority } from '../entities/vendor-message.entity';

@Controller('procurement/vendor-collaboration')
export class VendorCollaborationController {
  constructor(private readonly collaborationService: VendorCollaborationService) {}

  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  async createMessage(@Body() dto: CreateMessageDto) {
    return this.collaborationService.createMessage(dto);
  }

  @Get('messages')
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Query('companyId') companyId: string,
    @Query('rfqId') rfqId?: string,
    @Query('vendorId') vendorId?: string,
    @Query('messageType') messageType?: MessageType,
    @Query('status') status?: MessageStatus,
    @Query('isOutbound') isOutbound?: string,
    @Query('requiresResponse') requiresResponse?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filter: MessageFilter = {
      companyId,
      rfqId,
      vendorId,
      messageType,
      status,
      isOutbound: isOutbound ? isOutbound === 'true' : undefined,
      requiresResponse: requiresResponse ? requiresResponse === 'true' : undefined,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    };

    return this.collaborationService.getMessages(filter);
  }

  @Get('messages/:id')
  @HttpCode(HttpStatus.OK)
  async getMessageById(@Param('id') id: string) {
    return this.collaborationService.getMessageById(id);
  }

  @Post('messages/:id/send')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Param('id') id: string) {
    return this.collaborationService.sendMessage(id);
  }

  @Post('messages/:id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Param('id') id: string) {
    return this.collaborationService.markAsRead(id);
  }

  @Post('messages/:id/reply')
  @HttpCode(HttpStatus.CREATED)
  async replyToMessage(
    @Param('id') parentMessageId: string,
    @Body() dto: {
      companyId: string;
      messageType: MessageType;
      priority?: MessagePriority;
      subject: string;
      message: string;
      isOutbound: boolean;
      attachments?: {
        fileName: string;
        fileUrl: string;
        fileSize: number;
        fileType: string;
        uploadedAt: Date;
      }[];
      requiresResponse?: boolean;
      responseDeadline?: Date;
      createdBy: string;
      createdByName: string;
    },
  ) {
    return this.collaborationService.replyToMessage(parentMessageId, dto);
  }

  @Get('thread/:threadId')
  @HttpCode(HttpStatus.OK)
  async getThread(@Param('threadId') threadId: string) {
    return this.collaborationService.getThread(threadId);
  }

  @Get('rfq/:rfqId/messages')
  @HttpCode(HttpStatus.OK)
  async getRfqMessages(@Param('rfqId') rfqId: string) {
    return this.collaborationService.getRfqMessages(rfqId);
  }

  @Get('vendor/:vendorId/messages')
  @HttpCode(HttpStatus.OK)
  async getVendorMessages(
    @Param('vendorId') vendorId: string,
    @Query('companyId') companyId: string,
  ) {
    return this.collaborationService.getVendorMessages(vendorId, companyId);
  }

  @Get('pending-responses')
  @HttpCode(HttpStatus.OK)
  async getPendingResponses(@Query('companyId') companyId: string) {
    return this.collaborationService.getPendingResponses(companyId);
  }

  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  async getUnreadCount(
    @Query('companyId') companyId: string,
    @Query('isOutbound') isOutbound: string,
  ) {
    const count = await this.collaborationService.getUnreadMessages(
      companyId,
      isOutbound === 'true',
    );
    return { count };
  }

  @Post('messages/:id/archive')
  @HttpCode(HttpStatus.OK)
  async archiveMessage(@Param('id') id: string) {
    return this.collaborationService.archiveMessage(id);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id') id: string) {
    await this.collaborationService.deleteMessage(id);
  }
}
