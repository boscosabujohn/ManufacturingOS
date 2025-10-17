import { ContractType, PricingTier } from '../entities/service-contract.entity';

export class CreateServiceContractDto {
  contractType: ContractType;
  customerId: string;
  customerName: string;
  customerContactPerson?: string;
  customerEmail?: string;
  customerPhone?: string;

  equipmentIds: string[];
  coverageScope: string;

  startDate: Date;
  endDate: Date;
  duration: number;

  pricingTier: PricingTier;
  contractValue: number;
  currency: string;
  billingFrequency: string;
  paymentTerms: string;

  responseTimeSLA: number;
  resolutionTimeSLA: number;
  visitFrequency: string;
  serviceCoverage: string[];

  inclusions: string[];
  exclusions: string[];
  partsIncluded: boolean;
  laborIncluded: boolean;
  consumablesIncluded: boolean;

  autoRenewal: boolean;
  renewalNotificationDays?: number[];

  salesOrderId?: string;
  salesPersonId?: string;

  notes?: string;
  internalNotes?: string;

  createdBy: string;
}
