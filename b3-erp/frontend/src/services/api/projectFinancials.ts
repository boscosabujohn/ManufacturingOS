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
        return apiClient.get<IoEData>(`/api/project-management/${projectId}/financials`);
    },

    trackExpense: async (projectId: string, amount: number, category: string, description: string) => {
        return apiClient.post(`/api/project-management/${projectId}/financials/expense`, {
            amount,
            category,
            description,
        });
    },

    trackIncome: async (projectId: string, amount: number, source: string, description: string) => {
        return apiClient.post(`/api/project-management/${projectId}/financials/income`, {
            amount,
            source,
            description,
        });
    },

    calculateIoE: async (projectId: string) => {
        return apiClient.get<IoEData>(`/api/project-management/${projectId}/financials/ioe`);
    },
};
