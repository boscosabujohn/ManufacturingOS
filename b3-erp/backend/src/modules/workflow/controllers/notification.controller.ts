
import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('workflow/notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Post('send')
    async sendNotification(
        @Body('userId') userId: string,
        @Body('templateCode') templateCode: string,
        @Body('data') data: Record<string, any>,
        @Body('channels') channels?: ('email' | 'sms' | 'push' | 'in_app')[],
    ) {
        await this.notificationService.sendTemplatedNotification(
            userId,
            templateCode,
            data,
            channels,
        );
        return { success: true };
    }

    @Post('alert')
    async sendAlert(
        @Body('alertType') alertType: 'error' | 'warning' | 'critical',
        @Body('title') title: string,
        @Body('message') message: string,
        @Body('affectedTeams') affectedTeams: string[],
        @Body('data') data?: Record<string, any>,
    ) {
        await this.notificationService.sendAlert(
            alertType,
            title,
            message,
            affectedTeams,
            data,
        );
        return { success: true };
    }
}
