export class UpdateServiceRequestDto {
  priority?: string;
  issueDescription?: string;
  preferredServiceDate?: Date;
  preferredServiceTime?: string;

  equipmentId?: string;
  equipmentModel?: string;
  equipmentSerialNumber?: string;

  siteAddress?: string;
  contactPerson?: string;
  contactPhone?: string;
  alternatePhone?: string;

  accessInstructions?: string;
  specialRequirements?: string;

  notes?: string;
  internalNotes?: string;

  updatedBy: string;
}
