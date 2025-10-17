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
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from '../dto/create-service-request.dto';
import { UpdateServiceRequestDto } from '../dto/update-service-request.dto';

@Controller('after-sales/service-requests')
export class ServiceRequestsController {
  constructor(
    private readonly serviceRequestsService: ServiceRequestsService,
  ) {}

  @Post()
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('customerId') customerId?: string,
    @Query('assignedTo') assignedTo?: string,
  ) {
    return this.serviceRequestsService.findAll({
      status,
      priority,
      customerId,
      assignedTo,
    });
  }

  @Get('overdue')
  getOverdueRequests() {
    return this.serviceRequestsService.getOverdueRequests();
  }

  @Get('statistics')
  getStatistics() {
    return this.serviceRequestsService.getStatistics();
  }

  @Get('sla-dashboard')
  getSLADashboard() {
    return this.serviceRequestsService.getSLADashboard();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceRequestDto: UpdateServiceRequestDto,
  ) {
    return this.serviceRequestsService.update(id, updateServiceRequestDto);
  }

  @Post(':id/assign')
  assignRequest(
    @Param('id') id: string,
    @Body()
    assignData: {
      assignedTo: string;
      assignedToName: string;
      assignedBy: string;
    },
  ) {
    return this.serviceRequestsService.assignRequest(
      id,
      assignData.assignedTo,
      assignData.assignedToName,
      assignData.assignedBy,
    );
  }

  @Post(':id/acknowledge')
  acknowledgeRequest(
    @Param('id') id: string,
    @Body() body: { acknowledgedBy: string },
  ) {
    return this.serviceRequestsService.acknowledgeRequest(
      id,
      body.acknowledgedBy,
    );
  }

  @Post(':id/start')
  startWork(@Param('id') id: string, @Body() body: { startedBy: string }) {
    return this.serviceRequestsService.startWork(id, body.startedBy);
  }

  @Post(':id/resolve')
  resolveRequest(
    @Param('id') id: string,
    @Body()
    resolveData: {
      resolution: string;
      resolvedBy: string;
      rootCause?: string;
      partsUsed?: string[];
    },
  ) {
    return this.serviceRequestsService.resolveRequest(
      id,
      resolveData.resolution,
      resolveData.resolvedBy,
      resolveData.rootCause,
      resolveData.partsUsed,
    );
  }

  @Post(':id/close')
  closeRequest(
    @Param('id') id: string,
    @Body() body: { closedBy: string; closureNotes?: string },
  ) {
    return this.serviceRequestsService.closeRequest(
      id,
      body.closedBy,
      body.closureNotes,
    );
  }

  @Post(':id/escalate')
  escalateRequest(
    @Param('id') id: string,
    @Body()
    escalateData: {
      escalationLevel: number;
      escalationReason: string;
      escalatedBy: string;
      escalatedTo?: string;
    },
  ) {
    return this.serviceRequestsService.escalateRequest(
      id,
      escalateData.escalationLevel,
      escalateData.escalationReason,
      escalateData.escalatedBy,
      escalateData.escalatedTo,
    );
  }

  @Post(':id/cancel')
  cancelRequest(
    @Param('id') id: string,
    @Body() body: { cancellationReason: string; cancelledBy: string },
  ) {
    return this.serviceRequestsService.cancelRequest(
      id,
      body.cancellationReason,
      body.cancelledBy,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(id);
  }
}
