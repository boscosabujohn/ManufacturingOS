import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationService } from './services/notification.service';
import { EmailService } from './services/email.service';
import { NotificationsController } from './notifications.controller';
import { ItAdminModule } from '../it-admin/it-admin.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        EventEmitterModule.forRoot(),
        ItAdminModule,
    ],
    controllers: [NotificationsController],
    providers: [NotificationService, EmailService],
    exports: [NotificationService, EmailService],
})
export class NotificationsModule { }
