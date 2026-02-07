import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ProductionService } from '../services/production.service';

@Controller('api/production')
export class ProductionController {
    constructor(private readonly service: ProductionService) { }

    @Post('log')
    logOperation(@Body() data: any) {
        return this.service.logOperation(data);
    }

    @Get('oee/:machineId')
    getOEE(@Param('machineId') machineId: string, @Query('start') start: string, @Query('end') end: string) {
        return this.service.calculateMachineOEE(machineId, new Date(start), new Date(end));
    }

    @Get('nesting/:projectId')
    getNesting(@Param('projectId') projectId: string) {
        return this.service.getNestingAssets(projectId);
    }

    @Post('trial/:projectId')
    createTrial(@Param('projectId') projectId: string, @Body('inspectedBy') inspectedBy: string) {
        return this.service.createTrialReport(projectId, inspectedBy);
    }

    @Patch('trial/:id')
    updateTrial(@Param('id') id: string, @Body() data: { result: string; notes: string }) {
        return this.service.updateTrialResult(id, data.result, data.notes);
    }
}
