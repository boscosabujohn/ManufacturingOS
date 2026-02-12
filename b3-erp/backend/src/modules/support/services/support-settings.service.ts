import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupportSettingsService {
    private readonly logger = new Logger(SupportSettingsService.name);

    constructor(private readonly prisma: PrismaService) {}

    async getSettings(companyId: string) {
        let settings = await this.prisma.supportSettings.findUnique({
            where: { companyId },
        });

        // Create default settings if none exist
        if (!settings) {
            settings = await this.createDefaultSettings(companyId);
        }

        return settings;
    }

    async createDefaultSettings(companyId: string) {
        return this.prisma.supportSettings.create({
            data: {
                companyId,
                ticketPrefix: 'TKT',
                autoAssignEnabled: true,
                businessHoursStart: '09:00',
                businessHoursEnd: '18:00',
                businessDays: [1, 2, 3, 4, 5],
                timezone: 'Asia/Kolkata',
                defaultResponseTime: 240,
                defaultResolutionTime: 1440,
                csatEnabled: true,
                csatAutoSend: true,
                csatDelay: 60,
                aiSuggestionsEnabled: true,
                aiAutoResponse: false,
                aiConfidenceThreshold: 0.8,
                itilEnabled: false,
                incidentPrefix: 'INC',
                problemPrefix: 'PRB',
                changePrefix: 'CHG',
                escalationNotifyEmail: true,
                breachNotifyEmail: true,
            },
        });
    }

    async updateSettings(companyId: string, data: Partial<{
        ticketPrefix: string;
        autoAssignEnabled: boolean;
        businessHoursStart: string;
        businessHoursEnd: string;
        businessDays: number[];
        timezone: string;
        defaultResponseTime: number;
        defaultResolutionTime: number;
        csatEnabled: boolean;
        csatAutoSend: boolean;
        csatDelay: number;
        aiSuggestionsEnabled: boolean;
        aiAutoResponse: boolean;
        aiConfidenceThreshold: number;
        itilEnabled: boolean;
        incidentPrefix: string;
        problemPrefix: string;
        changePrefix: string;
        escalationNotifyEmail: boolean;
        breachNotifyEmail: boolean;
    }>) {
        // Ensure settings exist
        await this.getSettings(companyId);

        return this.prisma.supportSettings.update({
            where: { companyId },
            data,
        });
    }

    async isWithinBusinessHours(companyId: string, date?: Date): Promise<boolean> {
        const settings = await this.getSettings(companyId);
        const checkDate = date || new Date();

        // Get current day (1-7, Monday-Sunday)
        const day = checkDate.getDay() || 7;
        if (!settings.businessDays.includes(day)) {
            return false;
        }

        // Check time
        const currentTime = `${checkDate.getHours().toString().padStart(2, '0')}:${checkDate.getMinutes().toString().padStart(2, '0')}`;
        return currentTime >= settings.businessHoursStart && currentTime <= settings.businessHoursEnd;
    }

    async calculateSLADeadline(companyId: string, responseMinutes: number, fromDate?: Date): Promise<Date> {
        const settings = await this.getSettings(companyId);
        const start = fromDate || new Date();
        let deadline = new Date(start);
        let remainingMinutes = responseMinutes;

        // Simple calculation - add minutes during business hours
        while (remainingMinutes > 0) {
            deadline.setMinutes(deadline.getMinutes() + 1);

            if (await this.isWithinBusinessHours(companyId, deadline)) {
                remainingMinutes--;
            }

            // Safety limit to prevent infinite loop
            if (deadline.getTime() - start.getTime() > 30 * 24 * 60 * 60 * 1000) {
                break;
            }
        }

        return deadline;
    }
}
