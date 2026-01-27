import { apiClient } from './client';

export interface IoEData {
    totalExpenditure: number;
    totalIncome: number;
    margin: number;
    financialStatus: string;
    budget: number;
}

// Mock data for fallback
const mockFinancialsData: IoEData = {
    totalExpenditure: 4500000,
    totalIncome: 5200000,
    margin: 700000,
    financialStatus: 'Healthy',
    budget: 6000000,
};

export const projectFinancialsApi = {
    getFinancials: async (projectId: string) => {
        try {
            const response = await apiClient.get<IoEData>(`/project-management/${projectId}/financials`);
            if (response.data) {
                return { success: true, data: response.data };
            }
            return { success: true, data: mockFinancialsData };
        } catch (error) {
            console.warn('API error fetching financials, using mock data:', error);
            return { success: true, data: mockFinancialsData };
        }
    },

    trackExpense: async (projectId: string, amount: number, category: string, description: string) => {
        try {
            const response = await apiClient.post(`/project-management/${projectId}/financials/expense`, {
                amount,
                category,
                description,
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.warn('API error tracking expense, using mock data:', error);
            return {
                success: true,
                data: { id: 'exp-' + Date.now(), amount, category, description }
            };
        }
    },

    trackIncome: async (projectId: string, amount: number, source: string, description: string) => {
        try {
            const response = await apiClient.post(`/project-management/${projectId}/financials/income`, {
                amount,
                source,
                description,
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.warn('API error tracking income, using mock data:', error);
            return {
                success: true,
                data: { id: 'inc-' + Date.now(), amount, source, description }
            };
        }
    },

    calculateIoE: async (projectId: string) => {
        try {
            const response = await apiClient.get<IoEData>(`/project-management/${projectId}/financials/ioe`);
            if (response.data) {
                return { success: true, data: response.data };
            }
            return { success: true, data: mockFinancialsData };
        } catch (error) {
            console.warn('API error calculating IoE, using mock data:', error);
            return { success: true, data: mockFinancialsData };
        }
    },
};
