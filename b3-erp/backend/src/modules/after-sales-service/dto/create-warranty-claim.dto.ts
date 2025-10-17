export class CreateWarrantyClaimDto {
  warrantyId: string;
  equipmentId: string;
  faultDescription: string;
  faultCategory: string;
  faultDate: Date;

  customerId: string;
  customerName: string;
  contactPerson?: string;
  contactPhone?: string;

  claimDate: Date;
  claimReason: string;
  actionRequired: string;

  faultPhotos?: string[];
  attachments?: string[];

  createdBy: string;
}
