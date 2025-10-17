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
import { InstallationsService } from './installations.service';
import { CreateInstallationJobDto } from '../dto/create-installation-job.dto';
import { UpdateInstallationJobDto } from '../dto/update-installation-job.dto';

@Controller('after-sales/installations')
export class InstallationsController {
  constructor(private readonly installationsService: InstallationsService) {}

  @Post()
  create(@Body() createInstallationJobDto: CreateInstallationJobDto) {
    return this.installationsService.create(createInstallationJobDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('teamLeaderId') teamLeaderId?: string,
  ) {
    return this.installationsService.findAll({
      status,
      customerId,
      teamLeaderId,
    });
  }

  @Get('scheduled')
  getScheduledJobs(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.installationsService.getScheduledJobs(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('statistics')
  getStatistics() {
    return this.installationsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.installationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstallationJobDto: UpdateInstallationJobDto,
  ) {
    return this.installationsService.update(id, updateInstallationJobDto);
  }

  @Post(':id/site-survey')
  completeSiteSurvey(
    @Param('id') id: string,
    @Body()
    surveyData: {
      surveyedBy: string;
      siteReadiness: Record<string, any>;
      recommendations: string[];
    },
  ) {
    return this.installationsService.completeSiteSurvey(
      id,
      surveyData.surveyedBy,
      surveyData.siteReadiness,
      surveyData.recommendations,
    );
  }

  @Post(':id/schedule')
  scheduleInstallation(
    @Param('id') id: string,
    @Body()
    scheduleData: {
      scheduledDate: Date;
      estimatedDuration: number;
      teamLeaderId: string;
      teamLeaderName: string;
      teamMembers: string[];
      updatedBy: string;
    },
  ) {
    return this.installationsService.scheduleInstallation(
      id,
      scheduleData.scheduledDate,
      scheduleData.estimatedDuration,
      scheduleData.teamLeaderId,
      scheduleData.teamLeaderName,
      scheduleData.teamMembers,
      scheduleData.updatedBy,
    );
  }

  @Post(':id/start')
  startInstallation(
    @Param('id') id: string,
    @Body() body: { startedBy: string },
  ) {
    return this.installationsService.startInstallation(id, body.startedBy);
  }

  @Post(':id/complete')
  completeInstallation(
    @Param('id') id: string,
    @Body()
    completionData: {
      completedBy: string;
      testResults?: Record<string, any>;
      commissioningNotes?: string;
      trainingProvided?: boolean;
      documentationHandedOver?: string[];
    },
  ) {
    return this.installationsService.completeInstallation(
      id,
      completionData.completedBy,
      completionData.testResults,
      completionData.commissioningNotes,
      completionData.trainingProvided,
      completionData.documentationHandedOver,
    );
  }

  @Post(':id/handover')
  handoverToCustomer(
    @Param('id') id: string,
    @Body()
    handoverData: {
      customerSignature: string;
      customerFeedback?: string;
      handedOverBy: string;
    },
  ) {
    return this.installationsService.handoverToCustomer(
      id,
      handoverData.customerSignature,
      handoverData.customerFeedback,
      handoverData.handedOverBy,
    );
  }

  @Post(':id/cancel')
  cancelInstallation(
    @Param('id') id: string,
    @Body() body: { cancellationReason: string; cancelledBy: string },
  ) {
    return this.installationsService.cancelInstallation(
      id,
      body.cancellationReason,
      body.cancelledBy,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.installationsService.remove(id);
  }
}
