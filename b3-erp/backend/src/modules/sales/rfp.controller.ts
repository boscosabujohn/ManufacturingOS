import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RFPService } from './rfp.service';
import { CreateRFPDto } from './dto/create-rfp.dto';
import { UpdateRFPDto } from './dto/update-rfp.dto';
import { RFPStatus } from './entities/rfp.entity';

@Controller('sales/rfp')
export class RFPController {
  constructor(private readonly rfpService: RFPService) {}

  @Post()
  create(@Body() createRFPDto: CreateRFPDto) {
    return this.rfpService.create(createRFPDto);
  }

  @Get()
  findAll(
    @Query('status') status?: RFPStatus,
    @Query('priority') priority?: string,
    @Query('type') type?: string,
    @Query('customerId') customerId?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('search') search?: string,
  ) {
    return this.rfpService.findAll({
      status,
      priority,
      type,
      customerId,
      assignedTo,
      fromDate,
      toDate,
      search,
    });
  }

  @Get('statistics')
  getStatistics() {
    return this.rfpService.getStatistics();
  }

  @Get('dashboard')
  getDashboard() {
    return this.rfpService.getDashboard();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rfpService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRFPDto: UpdateRFPDto) {
    return this.rfpService.update(id, updateRFPDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.rfpService.remove(id);
    return { message: 'RFP deleted successfully' };
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: RFPStatus;
      updatedBy: string;
      comments?: string;
    },
  ) {
    return this.rfpService.updateStatus(
      id,
      body.status,
      body.updatedBy,
      body.comments,
    );
  }

  @Post(':id/attachments')
  addAttachment(
    @Param('id') id: string,
    @Body() body: { attachment: any; uploadedBy: string },
  ) {
    return this.rfpService.addAttachment(id, body.attachment, body.uploadedBy);
  }

  @Delete(':id/attachments/:attachmentId')
  removeAttachment(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
    @Body() body: { updatedBy: string },
  ) {
    return this.rfpService.removeAttachment(id, attachmentId, body.updatedBy);
  }

  @Post(':id/evaluations')
  addEvaluation(@Param('id') id: string, @Body() evaluation: any) {
    return this.rfpService.addEvaluation(id, evaluation);
  }

  @Post(':id/approve')
  approve(
    @Param('id') id: string,
    @Body() body: { approver: string; comments?: string },
  ) {
    return this.rfpService.approve(id, body.approver, body.comments);
  }

  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Body() body: { approver: string; comments: string },
  ) {
    return this.rfpService.reject(id, body.approver, body.comments);
  }
}
