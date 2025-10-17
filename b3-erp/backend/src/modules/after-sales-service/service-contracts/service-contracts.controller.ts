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
import { ServiceContractsService } from './service-contracts.service';
import { CreateServiceContractDto } from '../dto/create-service-contract.dto';
import { UpdateServiceContractDto } from '../dto/update-service-contract.dto';

@Controller('after-sales/contracts')
export class ServiceContractsController {
  constructor(
    private readonly serviceContractsService: ServiceContractsService,
  ) {}

  @Post()
  create(@Body() createServiceContractDto: CreateServiceContractDto) {
    return this.serviceContractsService.create(createServiceContractDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('contractType') contractType?: string,
  ) {
    return this.serviceContractsService.findAll({
      status,
      customerId,
      contractType,
    });
  }

  @Get('expiring')
  getExpiringContracts(@Query('days') days: number = 30) {
    return this.serviceContractsService.getExpiringContracts(days);
  }

  @Get('statistics')
  getStatistics() {
    return this.serviceContractsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceContractsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceContractDto: UpdateServiceContractDto,
  ) {
    return this.serviceContractsService.update(id, updateServiceContractDto);
  }

  @Post(':id/renew')
  renewContract(
    @Param('id') id: string,
    @Body() renewalData: { duration: number; startDate: Date; updatedBy: string },
  ) {
    return this.serviceContractsService.renewContract(
      id,
      renewalData.duration,
      renewalData.startDate,
      renewalData.updatedBy,
    );
  }

  @Post(':id/activate')
  activateContract(@Param('id') id: string, @Body() body: { updatedBy: string }) {
    return this.serviceContractsService.activateContract(id, body.updatedBy);
  }

  @Post(':id/suspend')
  suspendContract(
    @Param('id') id: string,
    @Body() body: { reason: string; updatedBy: string },
  ) {
    return this.serviceContractsService.suspendContract(
      id,
      body.reason,
      body.updatedBy,
    );
  }

  @Post(':id/terminate')
  terminateContract(
    @Param('id') id: string,
    @Body() body: { reason: string; updatedBy: string },
  ) {
    return this.serviceContractsService.terminateContract(
      id,
      body.reason,
      body.updatedBy,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceContractsService.remove(id);
  }
}
