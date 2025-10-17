import { JobType } from '../entities/field-service.entity';

export class CreateFieldServiceJobDto {
  jobType: JobType;
  priority: string;

  serviceRequestId?: string;
  serviceTicketId?: string;
  installationId?: string;
  contractId?: string;
  warrantyId?: string;

  customerId: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;

  equipmentId?: string;
  equipmentModel?: string;
  equipmentSerialNumber?: string;

  serviceAddress: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  siteContactPerson?: string;
  siteContactPhone?: string;
  siteInstructions?: string;

  scheduledDate: Date;
  scheduledTimeSlot: string;
  estimatedDuration: number;

  assignedEngineerId: string;
  assignedEngineerName: string;

  problemDescription: string;
  symptomsReported?: string[];
  customerRequirements?: string;

  partsRequired?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    availability: string;
  }>;
  toolsRequired?: string[];

  billable: boolean;

  createdBy: string;
}
