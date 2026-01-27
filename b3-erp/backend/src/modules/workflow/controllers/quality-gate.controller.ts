
import { Controller, Post, Get, Param, Body, Put } from '@nestjs/common';
import { QualityGateService } from '../services/quality-gate.service';

@Controller('workflow/quality-gates')
export class QualityGateController {
    constructor(private readonly qualityGateService: QualityGateService) { }

    @Post()
    async createQualityGate(
        @Body('projectId') projectId: string,
        @Body('phase') phase: number,
        @Body('gateType') gateType: 'material_qa' | 'production_qc' | 'final_qc' | 'installation_review',
        @Body('items') items: { description: string; metadata?: any }[],
        @Body('inspectorId') inspectorId?: string,
    ) {
        return this.qualityGateService.createQualityGate(
            projectId,
            phase,
            gateType,
            items,
            inspectorId,
        );
    }

    @Put('items/:itemId')
    async updateChecklistItem(
        @Param('itemId') itemId: string,
        @Body('passed') passed: boolean,
        @Body('comments') comments?: string,
        @Body('photos') photos?: string[],
    ) {
        return this.qualityGateService.updateChecklistItem(
            itemId,
            passed,
            comments,
            photos,
        );
    }

    @Post(':id/finalize')
    async finalizeInspection(
        @Param('id') id: string,
        @Body('passed') passed: boolean,
        @Body('comments') comments?: string,
    ) {
        return this.qualityGateService.finalizeInspection(id, passed, comments ?? '');
    }

    @Post('defects')
    async reportDefect(
        @Body('projectId') projectId: string,
        @Body('qualityGateId') qualityGateId: string | null,
        @Body('severity') severity: 'critical' | 'major' | 'minor',
        @Body('description') description: string,
        @Body('location') location?: string,
        @Body('assignedTo') assignedTo?: string,
        @Body('photos') photos?: string[],
    ) {
        return this.qualityGateService.reportDefect(
            projectId,
            qualityGateId,
            severity,
            description,
            location,
            assignedTo,
            photos,
        );
    }

    @Put('defects/:id/resolve')
    async resolveDefect(
        @Param('id') id: string,
        @Body('resolutionNotes') resolutionNotes: string,
        @Body('resolvedBy') resolvedBy: string,
    ) {
        return this.qualityGateService.resolveDefect(id, resolutionNotes, resolvedBy);
    }

    @Get('project/:projectId')
    async getProjectQualityGates(@Param('projectId') projectId: string) {
        return this.qualityGateService.getProjectQualityGates(projectId);
    }
}
