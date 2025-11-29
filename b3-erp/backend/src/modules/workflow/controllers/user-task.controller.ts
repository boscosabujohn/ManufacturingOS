import { Controller, Get, Post, Put, Body, Param, Query, Res, HttpStatus } from '@nestjs/common';
import { UserTaskService } from '../services/user-task.service';
import { NotificationService as EnhancedNotificationService } from '../services/notification-enhanced.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

@Controller('api/workflow/tasks')
export class UserTaskController {
    constructor(
        private readonly taskService: UserTaskService,
        private readonly notificationService: EnhancedNotificationService
    ) { }

    @Get('inbox/:userId')
    async getUserInbox(
        @Param('userId') userId: string,
        @Query('status') status?: string,
        @Query('priority') priority?: string,
        @Query('module') module?: string,
        @Query('taskType') taskType?: string
    ) {
        const tasks = await this.taskService.getUserInbox(userId, {
            status,
            priority,
            module,
            taskType,
        });

        return {
            success: true,
            data: tasks,
        };
    }

    @Get('counts/:userId')
    async getTaskCounts(@Param('userId') userId: string) {
        const counts = await this.taskService.getTaskCounts(userId);
        return {
            success: true,
            data: counts,
        };
    }

    @Get(':taskId')
    async getTask(@Param('taskId') taskId: string) {
        const task = await this.taskService.getTaskById(taskId);
        return {
            success: true,
            data: task,
        };
    }

    @Post('action')
    async performTaskAction(
        @Body() body: {
            taskId: string;
            userId: string;
            action: string;
            comment?: string;
        }
    ) {
        const task = await this.taskService.updateTaskStatus(
            body.taskId,
            body.userId,
            body.action,
            body.comment
        );

        return {
            success: true,
            data: task,
            message: `Task ${body.action}ed successfully`,
        };
    }

    @Get('notifications/:userId')
    async getUserNotifications(
        @Param('userId') userId: string,
        @Query('unreadOnly') unreadOnly?: string
    ) {
        const notifications = await this.notificationService.getUserNotifications(
            userId,
            unreadOnly === 'true'
        );

        return {
            success: true,
            data: notifications,
        };
    }

    @Get('notifications/:userId/count')
    async getUnreadCount(@Param('userId') userId: string) {
        const count = await this.notificationService.getUnreadCount(userId);
        return {
            success: true,
            data: { count },
        };
    }

    @Put('notifications/:id/read')
    async markNotificationAsRead(@Param('id') id: string) {
        await this.notificationService.markAsRead(id);
        return {
            success: true,
            message: 'Notification marked as read',
        };
    }

    @Put('notifications/:userId/read-all')
    async markAllAsRead(@Param('userId') userId: string) {
        await this.notificationService.markAllAsRead(userId);
        return {
            success: true,
            message: 'All notifications marked as read',
        };
    }

    // Server-Sent Events for real-time notifications
    @Get('notifications/:userId/stream')
    async streamNotifications(
        @Param('userId') userId: string,
        @Res() res: Response
    ) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // Send initial connection success
        res.write(`data: ${JSON.stringify({ type: 'connected', userId })}\n\n`);

        // TODO: Set up EventEmitter listener and send events
        // For now, keep connection open
        const keepAlive = setInterval(() => {
            res.write(': keep-alive\n\n');
        }, 30000);

        res.on('close', () => {
            clearInterval(keepAlive);
            res.end();
        });
    }
}
