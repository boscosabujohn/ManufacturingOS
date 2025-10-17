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
import { FieldServiceService } from './field-service.service';
import { CreateFieldServiceJobDto } from '../dto/create-field-service-job.dto';
import { UpdateFieldServiceJobDto } from '../dto/update-field-service-job.dto';

@Controller('after-sales/field-service')
export class FieldServiceController {
  constructor(private readonly fieldServiceService: FieldServiceService) {}

  @Post('jobs')
  createJob(@Body() createFieldServiceJobDto: CreateFieldServiceJobDto) {
    return this.fieldServiceService.createJob(createFieldServiceJobDto);
  }

  @Get('jobs')
  findAllJobs(
    @Query('status') status?: string,
    @Query('engineerId') engineerId?: string,
    @Query('customerId') customerId?: string,
  ) {
    return this.fieldServiceService.findAllJobs({
      status,
      engineerId,
      customerId,
    });
  }

  @Get('jobs/scheduled')
  getScheduledJobs(@Query('engineerId') engineerId?: string, @Query('date') date?: string) {
    return this.fieldServiceService.getScheduledJobs(
      engineerId,
      date ? new Date(date) : undefined,
    );
  }

  @Get('jobs/statistics')
  getStatistics() {
    return this.fieldServiceService.getStatistics();
  }

  @Get('jobs/:id')
  findOneJob(@Param('id') id: string) {
    return this.fieldServiceService.findOneJob(id);
  }

  @Patch('jobs/:id')
  updateJob(
    @Param('id') id: string,
    @Body() updateFieldServiceJobDto: UpdateFieldServiceJobDto,
  ) {
    return this.fieldServiceService.updateJob(id, updateFieldServiceJobDto);
  }

  @Post('jobs/:id/assign')
  assignEngineer(
    @Param('id') id: string,
    @Body()
    assignData: {
      engineerId: string;
      engineerName: string;
      assignedBy: string;
    },
  ) {
    return this.fieldServiceService.assignEngineer(
      id,
      assignData.engineerId,
      assignData.engineerName,
      assignData.assignedBy,
    );
  }

  @Post('jobs/:id/dispatch')
  dispatchJob(@Param('id') id: string, @Body() body: { dispatchedBy: string }) {
    return this.fieldServiceService.dispatchJob(id, body.dispatchedBy);
  }

  @Post('jobs/:id/check-in')
  checkIn(
    @Param('id') id: string,
    @Body()
    checkInData: {
      engineerId: string;
      location?: { latitude: number; longitude: number };
      notes?: string;
    },
  ) {
    return this.fieldServiceService.checkIn(
      id,
      checkInData.engineerId,
      checkInData.location,
      checkInData.notes,
    );
  }

  @Post('jobs/:id/check-out')
  checkOut(
    @Param('id') id: string,
    @Body()
    checkOutData: {
      engineerId: string;
      location?: { latitude: number; longitude: number };
      workSummary?: string;
    },
  ) {
    return this.fieldServiceService.checkOut(
      id,
      checkOutData.engineerId,
      checkOutData.location,
      checkOutData.workSummary,
    );
  }

  @Post('jobs/:id/parts-consumed')
  recordPartsConsumed(
    @Param('id') id: string,
    @Body()
    partsData: {
      parts: Array<{
        partId: string;
        partName: string;
        quantity: number;
        unitPrice: number;
      }>;
      recordedBy: string;
    },
  ) {
    return this.fieldServiceService.recordPartsConsumed(
      id,
      partsData.parts,
      partsData.recordedBy,
    );
  }

  @Post('jobs/:id/service-report')
  submitServiceReport(
    @Param('id') id: string,
    @Body()
    reportData: {
      workPerformed: string;
      partsReplaced?: string[];
      issuesFound?: string[];
      recommendations?: string[];
      customerSignature?: string;
      customerFeedback?: string;
      photos?: string[];
      submittedBy: string;
    },
  ) {
    return this.fieldServiceService.submitServiceReport(id, reportData);
  }

  @Post('jobs/:id/complete')
  completeJob(
    @Param('id') id: string,
    @Body() body: { completedBy: string; completionNotes?: string },
  ) {
    return this.fieldServiceService.completeJob(
      id,
      body.completedBy,
      body.completionNotes,
    );
  }

  @Post('jobs/:id/cancel')
  cancelJob(
    @Param('id') id: string,
    @Body() body: { cancellationReason: string; cancelledBy: string },
  ) {
    return this.fieldServiceService.cancelJob(
      id,
      body.cancellationReason,
      body.cancelledBy,
    );
  }

  @Get('engineers/schedule')
  getEngineerSchedule(@Query('engineerId') engineerId: string, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.fieldServiceService.getEngineerSchedule(
      engineerId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('engineers/:engineerId/performance')
  getEngineerPerformance(@Param('engineerId') engineerId: string) {
    return this.fieldServiceService.getEngineerPerformance(engineerId);
  }

  @Delete('jobs/:id')
  removeJob(@Param('id') id: string) {
    return this.fieldServiceService.removeJob(id);
  }
}
