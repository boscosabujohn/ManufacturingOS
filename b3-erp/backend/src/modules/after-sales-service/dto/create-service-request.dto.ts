import { ServiceRequestPriority, ServiceRequestType, RequestChannel } from '../entities/service-request.entity';

export class CreateServiceRequestDto {
  priority: ServiceRequestPriority;
  serviceType: ServiceRequestType;
  channel: RequestChannel;

  customerId: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;

  equipmentId?: string;
  equipmentModel?: string;
  equipmentSerialNumber?: string;
  equipmentLocation?: string;

  subject: string;
  description: string;
  faultCategory?: string;
  symptoms?: string[];
  errorCodes?: string[];

  requestedDate: Date;
  preferredServiceDate?: Date;
  preferredTimeSlot?: string;
  serviceAddress: string;
  siteContactPerson?: string;
  siteContactPhone?: string;

  underWarranty: boolean;
  warrantyId?: string;
  underContract: boolean;
  contractId?: string;
  billable: boolean;

  attachments?: string[];
  photos?: string[];
  videos?: string[];

  createdBy: string;
}
