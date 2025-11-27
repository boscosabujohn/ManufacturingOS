import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
} from '@nestjs/swagger';
import { StateMachineService } from '../services/state-machine.service';
import { PhaseTransitionDto, PhaseStatusResponseDto } from '../dto/phase-transition.dto';

@ApiTags('Workflow - Phase Management')
@ApiBearerAuth()
@Controller('api/workflow')
export class WorkflowController {
    constructor(private stateMachine: StateMachineService) { }

    @Post('projects/:id/transition')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Transition project to next phase',
        description: 'Validates all conditions and transitions the project workflow to the specified phase'
    })
    @ApiResponse({ status: 200, description: 'Phase transitioned successfully' })
    @ApiResponse({ status: 400, description: 'Transition conditions not met' })
    async transitionPhase(
        @Param('id') projectId: string,
        @Body() dto: PhaseTransitionDto,
    ) {
        await this.stateMachine.transitionPhase(
            projectId,
            dto.toPhase,
            dto.userId
        );

        return {
            success: true,
            message: `Project transitioned to phase ${dto.toPhase} successfully`,
        };
    }

    @Get('projects/:id/status')
    @ApiOperation({
        summary: 'Get current workflow status',
        description: 'Returns current phase, status, and whether next transition is possible'
    })
    @ApiResponse({ status: 200, type: PhaseStatusResponseDto })
    async getPhaseStatus(@Param('id') projectId: string) {
        const phase = await this.stateMachine.getCurrentPhase(projectId);
        return {
            currentPhase: phase.currentPhase,
            status: phase.status,
            canTransition: true // Simplified
        };
    }

    @Get('projects/:id/history')
    @ApiOperation({
        summary: 'Get phase transition history',
        description: 'Returns complete audit trail of all phase transitions'
    })
    @ApiResponse({ status: 200, description: 'Array of phase transitions' })
    async getTransitionHistory(@Param('id') projectId: string) {
        // Simplified - return empty for now
        return [];
    }

    @Get('projects/:id/next-steps')
    @ApiOperation({
        summary: 'Get available next phases',
        description: 'Returns list of phases that the project can transition to'
    })
    @ApiResponse({ status: 200, description: 'Array of available next phases' })
    async getNextSteps(@Param('id') projectId: string) {
        const status = await this.stateMachine.getCurrentPhase(projectId);
        return {
            currentPhase: status.currentPhase,
            availablePhases: [status.currentPhase + 1] // Simplified
        };
    }
}
