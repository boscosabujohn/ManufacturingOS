import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
})
export class ApprovalsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (userId) {
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId)!.add(client.id);
            console.log(`✅ User ${userId} connected (socket: ${client.id})`);
        }
    }

    handleDisconnect(client: Socket) {
        // Remove socket from user's set
        for (const [userId, sockets] of this.userSockets.entries()) {
            if (sockets.has(client.id)) {
                sockets.delete(client.id);
                if (sockets.size === 0) {
                    this.userSockets.delete(userId);
                }
                console.log(`❌ User ${userId} disconnected (socket: ${client.id})`);
                break;
            }
        }
    }

    /**
     * Subscribe to approval updates
     */
    @SubscribeMessage('subscribe:approvals')
    handleSubscribeApprovals(client: Socket, userId: string) {
        client.join(`user:${userId}`);
        console.log(`📡 User ${userId} subscribed to approval updates`);
    }

    /**
     * Emit notification to specific user
     */
    @OnEvent('notification.created')
    handleNotificationCreated(data: { userId: string; notification: any }) {
        this.server.to(`user:${data.userId}`).emit('notification:new', data.notification);
    }

    /**
     * Emit notification read event
     */
    @OnEvent('notification.read')
    handleNotificationRead(data: { userId: string; notificationId: string }) {
        this.server.to(`user:${data.userId}`).emit('notification:read', {
            notificationId: data.notificationId,
        });
    }

    /**
     * Emit all notifications read
     */
    @OnEvent('notifications.all_read')
    handleAllNotificationsRead(data: { userId: string }) {
        this.server.to(`user:${data.userId}`).emit('notifications:all_read');
    }

    /**
     * Emit approval update
     */
    @OnEvent('approval.updated')
    handleApprovalUpdated(data: { approvalId: string; status: string; updatedBy: string }) {
        this.server.emit('approval:updated', data);
    }

    /**
     * Emit approval created
     */
    @OnEvent('approval.created')
    handleApprovalCreated(data: { approval: any; assignedTo: string[] }) {
        for (const userId of data.assignedTo) {
            this.server.to(`user:${userId}`).emit('approval:assigned', data.approval);
        }
    }

    /**
     * Emit SLA status change
     */
    @OnEvent('sla.status_changed')
    handleSLAStatusChanged(data: { approvalId: string; slaStatus: string; userId: string }) {
        this.server.to(`user:${data.userId}`).emit('sla:status_changed', {
            approvalId: data.approvalId,
            slaStatus: data.slaStatus,
        });
    }

    /**
     * Send real-time notification
     */
    notifyUser(userId: string, event: string, data: any) {
        this.server.to(`user:${userId}`).emit(event, data);
    }

    /**
     * Broadcast to all users
     */
    broadcast(event: string, data: any) {
        this.server.emit(event, data);
    }

    /**
     * Get online users count
     */
    getOnlineUsersCount(): number {
        return this.userSockets.size;
    }

    /**
     * Check if user is online
     */
    isUserOnline(userId: string): boolean {
        return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
    }
}
