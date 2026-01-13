import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProposalService, ProposalFilters } from '../services/proposal.service';
import { CreateProposalDto } from '../dto/create-proposal.dto';
import { UpdateProposalDto } from '../dto/update-proposal.dto';
import { ProposalType, ProposalStatus } from '../entities/proposal.entity';

@ApiTags('Proposals')
@ApiBearerAuth()
@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get()
  @ApiOperation({ summary: 'Get all proposals with filters' })
  async findAll(
    @Query('search') search?: string,
    @Query('type') type?: ProposalType,
    @Query('status') status?: ProposalStatus,
    @Query('customerId') customerId?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const filters: ProposalFilters = { search, type, status, customerId, assignedToId };
    return this.proposalService.findAll(filters, page, limit);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get proposal dashboard stats' })
  async getDashboardStats() {
    return this.proposalService.getDashboardStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get proposal by ID' })
  async findOne(@Param('id') id: string) {
    return this.proposalService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new proposal' })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  async create(@Body() createDto: CreateProposalDto) {
    return this.proposalService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update proposal' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateProposalDto) {
    return this.proposalService.update(id, updateDto);
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit proposal for review' })
  async submit(@Param('id') id: string) {
    return this.proposalService.submit(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve proposal' })
  async approve(@Param('id') id: string) {
    return this.proposalService.approve(id);
  }

  @Patch(':id/send')
  @ApiOperation({ summary: 'Send proposal to customer' })
  async send(@Param('id') id: string) {
    return this.proposalService.send(id);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Mark proposal as accepted' })
  async markAccepted(@Param('id') id: string) {
    return this.proposalService.markAccepted(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Mark proposal as rejected' })
  async markRejected(@Param('id') id: string) {
    return this.proposalService.markRejected(id);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate proposal' })
  async duplicate(@Param('id') id: string) {
    return this.proposalService.duplicate(id);
  }

  @Post(':id/generate-pdf')
  @ApiOperation({ summary: 'Generate PDF for proposal' })
  async generatePdf(@Param('id') id: string) {
    const pdfUrl = await this.proposalService.generatePdf(id);
    return { pdfUrl };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete proposal' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.proposalService.remove(id);
  }
}
