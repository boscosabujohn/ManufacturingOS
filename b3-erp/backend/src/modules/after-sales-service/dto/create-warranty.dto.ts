import { WarrantyType, WarrantyCoverage } from '../entities/warranty.entity';

export class CreateWarrantyDto {
  warrantyType: WarrantyType;

  equipmentId: string;
  equipmentModel: string;
  equipmentSerialNumber: string;
  equipmentCategory: string;

  customerId: string;
  customerName: string;
  installationSiteId?: string;
  installationAddress?: string;

  startDate: Date;
  endDate: Date;
  durationMonths: number;

  coverage: WarrantyCoverage;
  coverageScope: string[];
  exclusions: string[];

  registrationDate: Date;
  activationDate: Date;
  installationDate?: Date;
  commissioningDate?: Date;

  salesOrderId?: string;
  invoiceId?: string;
  installationJobId?: string;

  isExtended: boolean;
  baseWarrantyId?: string;

  manufacturerWarranty: boolean;
  manufacturerId?: string;
  manufacturerWarrantyNumber?: string;

  expiryAlertDays?: number[];

  warrantyCard?: string;
  installationCertificate?: string;
  invoiceCopy?: string;

  termsAndConditions: string;

  createdBy: string;
}
