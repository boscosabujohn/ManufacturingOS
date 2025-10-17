import { WarrantyCoverage } from '../entities/warranty.entity';

export class UpdateWarrantyDto {
  status?: string;
  coverage?: WarrantyCoverage;
  coverageScope?: string[];
  exclusions?: string[];

  installationSiteId?: string;
  installationAddress?: string;

  expiryAlertDays?: number[];

  warrantyCard?: string;
  installationCertificate?: string;
  invoiceCopy?: string;

  notes?: string;

  updatedBy: string;
}
