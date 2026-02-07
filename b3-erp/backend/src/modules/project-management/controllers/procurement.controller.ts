import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ProcurementService } from '../services/procurement.service';

@Controller('api/procurement')
export class ProcurementController {
    constructor(private readonly service: ProcurementService) { }

    @Post('reserve/:projectId/:bomHeaderId')
    reserveStock(@Param('projectId') projectId: string, @Param('bomHeaderId') bomHeaderId: string) {
        return this.service.reserveBOMItems(projectId, bomHeaderId);
    }

    @Post('pr')
    createPR(@Body() data: { projectId: string; bomHeaderId: string; requestedBy: string }) {
        return this.service.generatePRFromBOM(data.projectId, data.bomHeaderId, data.requestedBy);
    }

    @Get('pr/:projectId')
    getPRs(@Param('projectId') projectId: string) {
        return this.service.getPRs(projectId);
    }

    @Post('grn')
    createGRN(@Body() data: { purchaseOrderId: string; receivedBy: string; deliveryNoteRef: string }) {
        return this.service.createGRN(data.purchaseOrderId, data.receivedBy, data.deliveryNoteRef);
    }

    @Patch('grn/:id/qc')
    updateQC(@Param('id') id: string, @Body() data: { passed: boolean; notes: string }) {
        return this.service.updateQCStatus(id, data.passed, data.notes);
    }
}
