
import axiosInstance from '@/lib/api-client';

export interface Discrepancy {
    id: string;
    projectId: string;
    type: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'OPEN' | 'RESOLVED';
    resolvedBy?: string;
    resolutionNotes?: string;
    createdAt: string;
}

class DesignVerificationService {
    async getDiscrepancies(projectId: string): Promise<Discrepancy[]> {
        const response = await axiosInstance.get(`/api/design-verification/discrepancies/${projectId}`);
        return response.data;
    }

    async detect(projectId: string): Promise<number> {
        const response = await axiosInstance.post(`/api/design-verification/detect/${projectId}`);
        return response.data;
    }

    async resolveDiscrepancy(id: string, data: { resolvedBy: string; notes: string }): Promise<Discrepancy> {
        const response = await axiosInstance.patch(`/api/design-verification/discrepancies/${id}/resolve`, data);
        return response.data;
    }

    async getSurveys(projectId: string): Promise<any[]> {
        const response = await axiosInstance.get(`/api/design-verification/surveys/${projectId}`);
        return response.data;
    }

    async requestClientApproval(projectId: string, attachmentId: string, clientEmail: string): Promise<any> {
        const response = await axiosInstance.post('/api/design-verification/approvals/request', {
            projectId,
            attachmentId,
            clientEmail
        });
        return response.data;
    }

    async getApprovalByToken(token: string): Promise<any> {
        const response = await axiosInstance.get(`/api/design-verification/approvals/token/${token}`);
        return response.data;
    }

    async submitApproval(data: { token: string; status: string; signatureUrl?: string; comments?: string }): Promise<any> {
        const response = await axiosInstance.post('/api/design-verification/approvals/submit', data);
        return response.data;
    }
}

export const designVerificationService = new DesignVerificationService();
