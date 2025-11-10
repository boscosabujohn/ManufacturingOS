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
  ApiBody,
} from '@nestjs/swagger';
import { JournalEntryService } from '../services/journal-entry.service';
import {
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  JournalEntryResponseDto,
} from '../dto';

@ApiTags('Finance - Journal Entry')
@Controller('finance/journal-entries')
export class JournalEntryController {
  constructor(private readonly journalEntryService: JournalEntryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new journal entry' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Journal entry created successfully',
    type: JournalEntryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or unbalanced entry' })
  async create(
    @Body() createDto: CreateJournalEntryDto,
  ): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all journal entries' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'journalType', required: false, description: 'Filter by journal type' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Filter by period' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of journal entries',
    type: [JournalEntryResponseDto],
  })
  async findAll(
    @Query('status') status?: string,
    @Query('journalType') journalType?: string,
    @Query('periodId') periodId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<JournalEntryResponseDto[]> {
    return this.journalEntryService.findAll({
      status,
      journalType,
      periodId,
      startDate,
      endDate,
    });
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all journal entry templates' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of templates',
    type: [JournalEntryResponseDto],
  })
  async getTemplates(): Promise<JournalEntryResponseDto[]> {
    return this.journalEntryService.getTemplates();
  }

  @Get('recurring')
  @ApiOperation({ summary: 'Get all recurring journal entries' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of recurring journal entries',
    type: [JournalEntryResponseDto],
  })
  async getRecurring(): Promise<JournalEntryResponseDto[]> {
    return this.journalEntryService.getRecurring();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get journal entry by ID' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journal entry details',
    type: JournalEntryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Journal entry not found' })
  async findOne(@Param('id') id: string): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journal entry updated successfully',
    type: JournalEntryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Journal entry not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot update posted entry or invalid input' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateJournalEntryDto,
  ): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Journal entry deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Journal entry not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot delete posted entry' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.journalEntryService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit journal entry for approval' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journal entry submitted successfully',
    type: JournalEntryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Entry not in draft status or not balanced' })
  async submit(@Param('id') id: string): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.submit(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        approvedBy: { type: 'string', description: 'Approver user ID' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journal entry approved successfully',
    type: JournalEntryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Entry not in pending approval status' })
  async approve(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string,
  ): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.approve(id, approvedBy);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rejectedBy: { type: 'string', description: 'Rejector user ID' },
        reason: { type: 'string', description: 'Rejection reason' },
      },
      required: ['rejectedBy', 'reason'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journal entry rejected successfully',
    type: JournalEntryResponseDto,
  })
  async reject(
    @Param('id') id: string,
    @Body() body: { rejectedBy: string; reason: string },
  ): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.reject(id, body.rejectedBy, body.reason);
  }

  @Post(':id/post')
  @ApiOperation({ summary: 'Post journal entry to general ledger' })
  @ApiParam({ name: 'id', description: 'Journal entry ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        postedBy: { type: 'string', description: 'User ID who is posting' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journal entry posted successfully',
    type: JournalEntryResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Entry not approved or already posted' })
  async post(
    @Param('id') id: string,
    @Body('postedBy') postedBy: string,
  ): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.post(id, postedBy);
  }

  @Post(':id/reverse')
  @ApiOperation({ summary: 'Reverse a posted journal entry' })
  @ApiParam({ name: 'id', description: 'Journal entry ID to reverse' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reversedBy: { type: 'string', description: 'User ID who is reversing' },
        reversalDate: { type: 'string', format: 'date', description: 'Reversal date (YYYY-MM-DD)' },
        reason: { type: 'string', description: 'Reason for reversal' },
      },
      required: ['reversedBy', 'reversalDate'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Journal entry reversed successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Entry not posted or already reversed' })
  async reverse(
    @Param('id') id: string,
    @Body() body: { reversedBy: string; reversalDate: string; reason?: string },
  ): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.reverse(id, body);
  }

  @Post('recurring/:id/generate')
  @ApiOperation({ summary: 'Generate next occurrence of recurring journal entry' })
  @ApiParam({ name: 'id', description: 'Recurring journal entry ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New journal entry generated from recurring template',
    type: JournalEntryResponseDto,
  })
  async generateRecurring(
    @Param('id') id: string,
  ): Promise<JournalEntryResponseDto> {
    return this.journalEntryService.generateRecurring(id);
  }
}
