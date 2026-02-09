import axiosInstance from '@/lib/api-client';

export interface ToolDeployment {
    id: string;
    toolId: string;
    projectId: string;
    status: 'ISSUED' | 'RETURNED' | 'LOST' | 'DAMAGED';
    issuedAt: string;
    returnedAt?: string;
    conditionAtIssue?: string;
    conditionAtReturn?: string;
    depreciationValue: number;
    issuedBy?: string;
    returnedBy?: string;
}

export const toolDeploymentService = {
    async issueTool(data: { toolId: string; projectId: string; condition: string; issuedBy?: string }): Promise<ToolDeployment> {
        const response = await axiosInstance.post('/project-management/tools/issue', data);
        return response.data;
    },

    async returnTool(data: { deploymentId: string; condition: string; depreciation: number; returnedBy?: string }): Promise<ToolDeployment> {
        const response = await axiosInstance.post('/project-management/tools/return', data);
        return response.data;
    },

    async getDeployedTools(projectId: string): Promise<ToolDeployment[]> {
        const response = await axiosInstance.get(`/project-management/tools/project/${projectId}`);
        return response.data;
    },

    async getAllDeployments(): Promise<ToolDeployment[]> {
        const response = await axiosInstance.get('/project-management/tools/all');
        return response.data;
    }
};
