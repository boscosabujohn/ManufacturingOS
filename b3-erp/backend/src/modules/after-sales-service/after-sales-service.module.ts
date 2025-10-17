import { Module } from '@nestjs/common';

// Service Contracts
import { ServiceContractsController } from './service-contracts/service-contracts.controller';
import { ServiceContractsService } from './service-contracts/service-contracts.service';

// Warranties
import { WarrantiesController } from './warranties/warranties.controller';
import { WarrantiesService } from './warranties/warranties.service';

// Service Requests
import { ServiceRequestsController } from './service-requests/service-requests.controller';
import { ServiceRequestsService } from './service-requests/service-requests.service';

// Installations
import { InstallationsController } from './installations/installations.controller';
import { InstallationsService } from './installations/installations.service';

// Field Service
import { FieldServiceController } from './field-service/field-service.controller';
import { FieldServiceService } from './field-service/field-service.service';

// Service Billing
import { ServiceBillingController } from './service-billing/service-billing.controller';
import { ServiceBillingService } from './service-billing/service-billing.service';

@Module({
  controllers: [
    ServiceContractsController,
    WarrantiesController,
    ServiceRequestsController,
    InstallationsController,
    FieldServiceController,
    ServiceBillingController,
  ],
  providers: [
    ServiceContractsService,
    WarrantiesService,
    ServiceRequestsService,
    InstallationsService,
    FieldServiceService,
    ServiceBillingService,
  ],
  exports: [
    ServiceContractsService,
    WarrantiesService,
    ServiceRequestsService,
    InstallationsService,
    FieldServiceService,
    ServiceBillingService,
  ],
})
export class AfterSalesServiceModule {}
