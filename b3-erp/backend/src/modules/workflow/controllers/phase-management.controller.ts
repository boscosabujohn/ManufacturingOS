
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StateMachineService } from '../services/state-machine.service';
import { PhaseTransitionDto, PhaseStatusResponseDto } from '../dto/phase-transition.dto';

@ApiTags('Workflow Phase Management')
@Controller('workflow/phases')
export class PhaseManagementController {
    constructor(private readonly stateMachineService: StateMachineService) { }

    @Get(':projectId')
    @ApiOperation({ summary: 'Get current phase status for a project' })
    @ApiResponse({ status: 200, type: PhaseStatusResponseDto })
    async getPhaseStatus(@Param('projectId') projectId: string) {
        const phase = await this.stateMachineService.getCurrentPhase(projectId);
        // Transform to DTO if needed, or return entity directly if it matches
        return phase;
    }

    @Post(':projectId/transition')
    @ApiOperation({ summary: 'Transition project to a new phase' })
    @ApiResponse({ status: 201, description: 'Phase transition successful' })
    async transitionPhase(
        @Param('projectId') projectId: string,
        @Body() transitionDto: PhaseTransitionDto,
    ) {
        return this.stateMachineService.transitionPhase(
            projectId,
            transitionDto.toPhase,
            transitionDto.userId,
        );
    }
}
