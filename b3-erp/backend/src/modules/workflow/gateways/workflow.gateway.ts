
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'workflow',
})
export class WorkflowGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(WorkflowGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinProject')
    handleJoinProject(
        @MessageBody() projectId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`project:${projectId}`);
        this.logger.log(`Client ${client.id} joined project ${projectId}`);
        return { event: 'joinedProject', data: projectId };
    }

    @SubscribeMessage('leaveProject')
    handleLeaveProject(
        @MessageBody() projectId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.leave(`project:${projectId}`);
        this.logger.log(`Client ${client.id} left project ${projectId}`);
        return { event: 'leftProject', data: projectId };
    }

    @OnEvent('workflow.event')
    handleWorkflowEvent(payload: { type: string; payload: any }) {
        // Broadcast to relevant project room if projectId is present
        if (payload.payload && payload.payload.projectId) {
            this.server.to(`project:${payload.payload.projectId}`).emit('workflowEvent', payload);
        }

        // Also broadcast to global listeners (e.g. dashboard)
        this.server.emit('globalWorkflowEvent', payload);
    }

    @OnEvent('workflow.phase.changed')
    handlePhaseChange(payload: any) {
        this.server.to(`project:${payload.projectId}`).emit('phaseChanged', payload);
    }
}
