import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GatePassService {
    private gatePasses: any[] = []; // Mock database

    async createGatePass(data: {
        type: 'returnable' | 'non-returnable';
        referenceId: string; // Shipment ID or Transfer ID
        vehicleNumber: string;
        driverName: string;
        items: any[];
        issuedBy: string;
    }): Promise<any> {
        const gatePass = {
            id: `GP-${Date.now()}`,
            ...data,
            status: 'Issued',
            checkOutTime: null,
            checkInTime: null,
            createdAt: new Date(),
        };
        this.gatePasses.push(gatePass);
        return gatePass;
    }

    async recordCheckOut(gatePassId: string, securityGuardId: string): Promise<any> {
        const pass = this.gatePasses.find(gp => gp.id === gatePassId);
        if (!pass) {
            throw new NotFoundException(`Gate Pass with ID ${gatePassId} not found`);
        }

        if (pass.status !== 'Issued') {
            throw new Error(`Gate Pass ${gatePassId} is not in Issued state`);
        }

        pass.status = 'Checked Out';
        pass.checkOutTime = new Date();
        pass.securityGuardOut = securityGuardId;

        return pass;
    }

    async recordCheckIn(gatePassId: string, securityGuardId: string): Promise<any> {
        const pass = this.gatePasses.find(gp => gp.id === gatePassId);
        if (!pass) {
            throw new NotFoundException(`Gate Pass with ID ${gatePassId} not found`);
        }

        if (pass.type !== 'returnable') {
            throw new Error(`Gate Pass ${gatePassId} is non-returnable`);
        }

        pass.status = 'Returned';
        pass.checkInTime = new Date();
        pass.securityGuardIn = securityGuardId;

        return pass;
    }

    async getGatePass(id: string): Promise<any> {
        const pass = this.gatePasses.find(gp => gp.id === id);
        if (!pass) {
            throw new NotFoundException(`Gate Pass with ID ${id} not found`);
        }
        return pass;
    }
}
