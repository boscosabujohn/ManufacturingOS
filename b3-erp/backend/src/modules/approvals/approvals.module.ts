import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    ApprovalChain,
    ApprovalLevel,
    ApprovalRequest,
    ApprovalHistory,
    ApprovalComment,
    ApprovalAttachment,
    UserTask,
} from './entities';
import { ApprovalChainService } from './services/approval-chain.service';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { ApprovalsController } from './approvals.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ApprovalChain,
            ApprovalLevel,
            ApprovalRequest,
            ApprovalHistory,
            ApprovalComment,
            ApprovalAttachment,
            UserTask,
        ]),
    ],
    controllers: [ApprovalsController],
    providers: [ApprovalChainService, ApprovalWorkflowService],
    exports: [ApprovalChainService, ApprovalWorkflowService],
})
export class ApprovalsModule implements OnModuleInit {
    constructor(private readonly chainService: ApprovalChainService) { }

    /**
     * Initialize default approval chains on module startup
     */
    async onModuleInit() {
        try {
            await this.chainService.initializeDefaultChains();
        } catch (error) {
            console.error('Failed to initialize approval chains:', error);
        }
    }
}
