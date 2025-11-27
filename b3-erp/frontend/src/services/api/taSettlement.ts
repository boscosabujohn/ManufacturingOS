import { apiClient } from './client';

export interface TAClaim {
    id: string;
    projectId: string;
    engineerId: string;
    amount: number;
    description: string;
    status: string;
    createdAt: string;
}

export const taSettlementApi = {
    listClaims: async (projectId?: string) => {
        const query = projectId ? `?projectId=${projectId}` : '';
        return apiClient.get<TAClaim[]>(`/api/project-management/ta-settlement/claims${query}`);
    },

    createClaim: async (projectId: string, engineerId: string, amount: number, description: string) => {
        return apiClient.post<TAClaim>('/api/project-management/ta-settlement/claims', {
            projectId,
            engineerId,
            amount,
            description,
        });
    },

    approveClaim: async (claimId: string, approvedBy: string) => {
        return apiClient.put<TAClaim>(`/api/project-management/ta-settlement/claims/${claimId}/approve`, {
            approvedBy,
        });
    },
};
