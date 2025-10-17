export class UpdateServiceContractDto {
  contractType?: string;
  customerContactPerson?: string;
  customerEmail?: string;
  customerPhone?: string;

  equipmentIds?: string[];
  coverageScope?: string;

  endDate?: Date;
  duration?: number;

  pricingTier?: string;
  contractValue?: number;
  billingFrequency?: string;
  paymentTerms?: string;

  responseTimeSLA?: number;
  resolutionTimeSLA?: number;
  visitFrequency?: string;
  serviceCoverage?: string[];

  inclusions?: string[];
  exclusions?: string[];
  partsIncluded?: boolean;
  laborIncluded?: boolean;
  consumablesIncluded?: boolean;

  autoRenewal?: boolean;
  renewalNotificationDays?: number[];

  notes?: string;
  internalNotes?: string;

  updatedBy: string;
}
