export class CreateInstallationJobDto {
    salesOrderId: string;
    salesOrderNumber: string;
    customerId: string;
    customerName: string;
    contactPerson: string;
    contactPhone: string;
    contactEmail?: string;
    equipmentId: string;
    equipmentModel: string;
    equipmentSerialNumber: string;
    equipmentQuantity: number;
    installationAddress: string;
    siteContactPerson?: string;
    siteContactPhone?: string;
    siteInstructions?: string;
    siteSurveyRequired: boolean;
    scheduledDate: Date;
    scheduledTimeSlot: string;
    estimatedDuration: number;
    teamLeaderId: string;
    teamLeaderName: string;
    teamMembers?: Array<{
        engineerId: string;
        engineerName: string;
        role: string;
    }>;
    toolsRequired?: string[];
    materialsRequired?: Array<{
        materialId: string;
        materialName: string;
        quantity: number;
    }>;
    vehicleRequired: boolean;
    vehicleType?: string;
    installationCost: number;
    supportPeriod: number;
    createdBy: string;
}
