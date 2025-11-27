import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DiesToolsService {
    private tools: any[] = []; // Mock database

    constructor() {
        this.seedMockData();
    }

    async createTool(toolData: any): Promise<any> {
        const tool = {
            id: `TOOL-${Date.now()}`,
            ...toolData,
            status: 'Available',
            lifeUsed: 0,
            maintenanceDue: false,
            createdAt: new Date(),
        };
        this.tools.push(tool);
        return tool;
    }

    async issueTool(toolId: string, workOrderId: string, issuedTo: string): Promise<any> {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) {
            throw new NotFoundException(`Tool with ID ${toolId} not found`);
        }

        if (tool.status !== 'Available') {
            throw new Error(`Tool ${toolId} is not available (Status: ${tool.status})`);
        }

        tool.status = 'Issued';
        tool.currentWorkOrder = workOrderId;
        tool.issuedTo = issuedTo;
        tool.issuedAt = new Date();

        return tool;
    }

    async returnTool(toolId: string, condition: string, usageCount: number): Promise<any> {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) {
            throw new NotFoundException(`Tool with ID ${toolId} not found`);
        }

        tool.status = 'Available';
        tool.currentWorkOrder = null;
        tool.issuedTo = null;
        tool.lifeUsed += usageCount;

        // Check maintenance condition
        if (tool.lifeUsed >= tool.maxLife) {
            tool.status = 'Retired';
        } else if (tool.lifeUsed % tool.maintenanceInterval === 0) {
            tool.maintenanceDue = true;
            tool.status = 'Maintenance';
        }

        return tool;
    }

    async getToolStatus(toolId: string): Promise<any> {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) {
            throw new NotFoundException(`Tool with ID ${toolId} not found`);
        }
        return tool;
    }

    private seedMockData() {
        this.tools.push({
            id: 'DIE-001',
            name: 'Sheet Metal Cutter Die',
            type: 'Die',
            maxLife: 10000,
            maintenanceInterval: 1000,
            lifeUsed: 500,
            status: 'Available',
            location: 'Dies & Tools Store',
        });
    }
}
