import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { ApprovalChainService } from './services/approval-chain.service';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { ApproveRequestDto, RejectRequestDto } from './dto/approval-action.dto';

@Controller('api/approvals')
export class ApprovalsController {
    constructor(
        private readonly workflowService: ApprovalWorkflowService,
        private readonly chainService: ApprovalChainService,
    ) { }

    /**
     * Create a new approval request
     * POST /api/approvals/request
     */
    @Post('request')
    @HttpCode(HttpStatus.CREATED)
    async createApprovalRequest(@Body() dto: CreateApprovalRequestDto) {
        const request = await this.workflowService.createApprovalRequest(dto);
        return {
            success: true,
            data: request,
            message: 'Approval request created successfully',
        };
    }

    /**
     * Get pending approvals for a user
     * GET /api/approvals/pending?userId=xxx
     */
    @Get('pending')
    async getPendingApprovals(@Query('userId') userId: string) {
        const approvals =
            await this.workflowService.getPendingApprovalsForUser(userId);
        return {
            success: true,
            data: approvals,
            count: approvals.length,
        };
    }

    /**
     * Approve a request
     * POST /api/approvals/:id/approve
     */
    @Post(':id/approve')
    async approveRequest(
        @Param('id') id: string,
        @Body() dto: ApproveRequestDto,
    ) {
        const request = await this.workflowService.approveRequest(
            id,
            dto.userId,
            dto.comment,
        );
        return {
            success: true,
            data: request,
            message: 'Approval submitted successfully',
        };
    }

    /**
     * Reject a request
     * POST /api/approvals/:id/reject
     */
    @Post(':id/reject')
    async rejectRequest(
        @Param('id') id: string,
        @Body() dto: RejectRequestDto,
    ) {
        const request = await this.workflowService.rejectRequest(
            id,
            dto.userId,
            dto.reason,
        );
        return {
            success: true,
            data: request,
            message: 'Request rejected',
        };
    }

    /**
     * Get approval history for a request
     * GET /api/approvals/:id/history
     */
    @Get(':id/history')
    async getHistory(@Param('id') id: string) {
        const history = await this.workflowService.getApprovalHistory(id);
        return {
            success: true,
            data: history,
        };
    }

    /**
     * Get approval chain configuration
     * GET /api/approvals/chains/:entityType
     */
    @Get('chains/:entityType')
    async getChain(@Param('entityType') entityType: string) {
        const chain = await this.chainService.getChainForEntity(entityType, {});
        return {
            success: true,
            data: chain,
        };
    }

    /**
     * Get all approval chains
     * GET /api/approvals/chains
     */
    @Get('chains')
    async getAllChains() {
        const chains = await this.chainService.getAllChains();
        return {
            success: true,
            data: chains,
        };
    }
}
