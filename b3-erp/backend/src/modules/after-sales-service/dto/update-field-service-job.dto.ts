export class UpdateFieldServiceJobDto {
  priority?: string;
  scheduledDate?: Date;
  scheduledTimeSlot?: string;
  estimatedDuration?: number;

  engineerId?: string;
  engineerName?: string;

  siteAddress?: string;
  siteContactPerson?: string;
  siteContactPhone?: string;

  accessInstructions?: string;
  specialRequirements?: string;

  requiredParts?: string[];
  requiredTools?: string[];

  notes?: string;
  internalNotes?: string;

  updatedBy: string;
}
