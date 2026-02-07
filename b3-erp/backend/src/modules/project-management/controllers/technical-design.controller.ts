import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { TechnicalDesignService } from '../services/technical-design.service';

@Controller('api/technical-design')
export class TechnicalDesignController {
    constructor(private readonly service: TechnicalDesignService) { }

    @Get('at-risk/:projectId')
    getAtRiskTasks(@Param('projectId') projectId: string) {
        return this.service.getAtRiskDesignTasks(projectId);
    }

    @Post('bom')
    createBOM(@Body() data: { projectId: string; name: string }) {
        return this.service.createBOMHeader(data.projectId, data.name);
    }

    @Get('bom/:id')
    getBOM(@Param('id') id: string) {
        return this.service.getBOM(id);
    }

    @Post('bom/:id/explode')
    explodeBOM(@Param('id') id: string, @Body() data: { itemId: string; quantity: number }) {
        return this.service.explodePrototypeToBOM(id, data.itemId, data.quantity);
    }

    @Patch('bom/:id/verify')
    verifyBOM(@Param('id') id: string, @Body('verifiedBy') verifiedBy: string) {
        return this.service.verifyAndLockBOM(id, verifiedBy);
    }

    @Patch('bom/:id/release')
    releaseBOM(@Param('id') id: string) {
        return this.service.releaseBOM(id);
    }
}
