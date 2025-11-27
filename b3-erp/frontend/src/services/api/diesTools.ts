import { apiClient } from './client';

export interface DiesTool {
    id: string;
    toolId: string;
    name: string;
    type: string;
    status: string;
    currentLife: number;
    maxLife: number;
}

export const diesToolsApi = {
    listTools: async () => {
        return apiClient.get<DiesTool[]>('/api/production/dies-tools');
    },

    createTool: async (toolId: string, name: string, type: string, maxLife: number) => {
        return apiClient.post<DiesTool>('/api/production/dies-tools', {
            toolId,
            name,
            type,
            maxLife,
        });
    },

    issueTool: async (toolId: string, workOrderId: string, issuedTo: string) => {
        return apiClient.post<DiesTool>(`/api/production/dies-tools/${toolId}/issue`, {
            workOrderId,
            issuedTo,
        });
    },

    returnTool: async (toolId: string, cyclesUsed: number) => {
        return apiClient.post<DiesTool>(`/api/production/dies-tools/${toolId}/return`, {
            cyclesUsed,
        });
    },

    getToolStatus: async (toolId: string) => {
        return apiClient.get<DiesTool>(`/api/production/dies-tools/${toolId}/status`);
    },
};
