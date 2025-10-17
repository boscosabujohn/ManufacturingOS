export class UpdateInstallationJobDto {
  scheduledDate?: Date;
  estimatedDuration?: number;

  teamLeaderId?: string;
  teamLeaderName?: string;
  teamMembers?: string[];

  siteAddress?: string;
  siteContactPerson?: string;
  siteContactPhone?: string;

  accessInstructions?: string;
  specialRequirements?: string;

  requiredTools?: string[];
  requiredMaterials?: string[];

  notes?: string;
  internalNotes?: string;

  updatedBy: string;
}
