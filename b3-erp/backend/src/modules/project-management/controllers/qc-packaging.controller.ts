import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { QCPackagingService } from '../services/qc-packaging.service';

@Controller('api/qc-packaging')
export class QCPackagingController {
    constructor(private readonly service: QCPackagingService) { }

    @Post('qc')
    recordQC(@Body() data: any) {
        return this.service.recordQC(data);
    }

    @Post('crate')
    createCrate(@Body() data: { projectId: string; crateNumber: string; designWeight: number }) {
        return this.service.createCrate(data.projectId, data.crateNumber, data.designWeight);
    }

    @Post('pack')
    packItem(@Body() data: { crateId: string; itemId: string; quantity: number }) {
        return this.service.packItem(data.crateId, data.itemId, data.quantity);
    }

    @Patch('crate/:id/seal')
    sealCrate(@Param('id') id: string, @Body('actualWeight') actualWeight: number) {
        return this.service.sealCrate(id, actualWeight);
    }

    @Get('crates/:projectId')
    getCrates(@Param('projectId') projectId: string) {
        return this.service.getCrates(projectId);
    }
}
