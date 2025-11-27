import { apiClient } from './client';

export interface GatePass {
    id: string;
    type: string;
    vehicle: string;
    driver: string;
    items: any[];
    status: string;
    createdAt: string;
    checkOutTime?: string;
    checkInTime?: string;
}

export const gatePassApi = {
    listGatePasses: async () => {
        return apiClient.get<GatePass[]>('/api/logistics/gate-pass');
    },

    createGatePass: async (type: string, vehicle: string, driver: string, items: any[]) => {
        return apiClient.post<GatePass>('/api/logistics/gate-pass', {
            type,
            vehicle,
            driver,
            items,
        });
    },

    recordCheckOut: async (passId: string, securityOfficer: string) => {
        return apiClient.post<GatePass>(`/api/logistics/gate-pass/${passId}/check-out`, {
            securityOfficer,
        });
    },

    recordCheckIn: async (passId: string, securityOfficer: string) => {
        return apiClient.post<GatePass>(`/api/logistics/gate-pass/${passId}/check-in`, {
            securityOfficer,
        });
    },

    getGatePass: async (passId: string) => {
        return apiClient.get<GatePass>(`/api/logistics/gate-pass/${passId}`);
    },
};
