import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GatePassService } from '../services/gate-pass.service';

@Controller('api/logistics/gate-pass')
export class GatePassController {
    constructor(private readonly gatePassService: GatePassService) { }

    @Get()
    async listGatePasses() {
        return {
            success: true,
            data: []
        };
    }

    @Post()
    async createGatePass(
        @Body() body: { type: string; vehicle: string; driver: string; items: any[] }
    ) {
        const result = await this.gatePassService.createGatePass(
            body.type,
            body.vehicle,
            body.driver,
            body.items
        );
        return {
            success: true,
            data: result
        };
    }

    @Post(':id/check-out')
    async recordCheckOut(
        @Param('id') passId: string,
        @Body() body: { securityOfficer: string }
    ) {
        const result = await this.gatePassService.recordCheckOut(passId, body.securityOfficer);
        return {
            success: true,
            data: result
        };
    }

    @Post(':id/check-in')
    async recordCheckIn(
        @Param('id') passId: string,
        @Body() body: { securityOfficer: string }
    ) {
        const result = await this.gatePassService.recordCheckIn(passId, body.securityOfficer);
        return {
            success: true,
            data: result
        };
    }

    @Get(':id')
    async getGatePass(@Param('id') passId: string) {
        const result = await this.gatePassService.getGatePass(passId);
        return {
            success: true,
            data: result
        };
    }
}
