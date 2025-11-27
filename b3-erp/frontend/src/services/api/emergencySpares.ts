import { apiClient } from './client';

export interface EmergencySpareRequest {
    id: string;
    projectId: string;
    partId: string;
    quantity: number;
    urgency: string;
    reason: string;
    status: string;
    createdAt: string;
}

export const emergencySparesApi = {
    listRequests: async (projectId?: string) => {
        const query = projectId ? `?projectId=${projectId}` : '';
        return apiClient.get<EmergencySpareRequest[]>(`/api/project-management/emergency-spares${query}`);
    },

    requestSpare: async (
        projectId: string,
        partId: string,
        quantity: number,
        urgency: string,
        reason: string
    ) => {
        return apiClient.post<EmergencySpareRequest>('/api/project-management/emergency-spares', {
            projectId,
            partId,
            quantity,
            urgency,
            reason,
        });
    },

    approveRequest: async (requestId: string, approvedBy: string) => {
        return apiClient.put<EmergencySpareRequest>(
            `/api/project-management/emergency-spares/${requestId}/approve`,
            { approvedBy }
        );
    },

    rejectRequest: async (requestId: string, rejectedBy: string, reason: string) => {
        return apiClient.put<EmergencySpareRequest>(
            `/api/project-management/emergency-spares/${requestId}/reject`,
            { rejectedBy, reason }
        );
    },
};
