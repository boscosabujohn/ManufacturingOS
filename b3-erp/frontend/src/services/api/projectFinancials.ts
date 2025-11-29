import { apiClient } from './client';

export interface IoEData {
    totalExpenditure: number;
    totalIncome: number;
    margin: number;
    financialStatus: string;
    budget: number;
}

export const projectFinancialsApi = {
    getFinancials: async (projectId: string) => {
        // Mock data for frontend-only mode
        return new Promise<{ success: boolean; data: IoEData }>((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        totalExpenditure: 4500000,
                        totalIncome: 5200000,
                        margin: 700000,
                        financialStatus: 'Healthy',
                        budget: 6000000,
                    }
                });
            }, 500);
        });
        // return apiClient.get<IoEData>(`/api/project-management/${projectId}/financials`);
    },

    trackExpense: async (projectId: string, amount: number, category: string, description: string) => {
        return new Promise<{ success: boolean; data: any }>((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: { id: 'exp-' + Date.now(), amount, category, description }
                });
            }, 500);
        });
        /*
        return apiClient.post(`/api/project-management/${projectId}/financials/expense`, {
            amount,
            category,
            description,
        });
        */
    },

    trackIncome: async (projectId: string, amount: number, source: string, description: string) => {
        return new Promise<{ success: boolean; data: any }>((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: { id: 'inc-' + Date.now(), amount, source, description }
                });
            }, 500);
        });
        /*
        return apiClient.post(`/api/project-management/${projectId}/financials/income`, {
            amount,
            source,
            description,
        });
        */
    },

    calculateIoE: async (projectId: string) => {
        return new Promise<{ success: boolean; data: IoEData }>((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        totalExpenditure: 4500000,
                        totalIncome: 5200000,
                        margin: 700000,
                        financialStatus: 'Healthy',
                        budget: 6000000,
                    }
                });
            }, 500);
        });
        // return apiClient.get<IoEData>(`/api/project-management/${projectId}/financials/ioe`);
    },
};
