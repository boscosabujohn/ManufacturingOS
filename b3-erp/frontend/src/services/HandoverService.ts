import axiosInstance from '@/lib/api-client';

export enum HandoverStatus {
    PENDING = 'pending',
    SIGNED = 'signed',
    ARCHIVED = 'archived',
}

export interface HandoverCertificate {
    id: string;
    projectId: string;
    clientSignatory?: string;
    signatoryTitle?: string;
    signedAt?: string;
    status: HandoverStatus;
    certificateUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClosureStatus {
    snagClearance: boolean;
    billingCleared: boolean;
    handoverReady: boolean;
}

export class HandoverService {
    static async getClosureStatus(projectId: string): Promise<ClosureStatus> {
        const response = await axiosInstance.get(`/project-closure/status/${projectId}`);
        return response.data;
    }

    static async initiateHandover(projectId: string): Promise<HandoverCertificate> {
        const response = await axiosInstance.post(`/project-closure/initiate/${projectId}`);
        return response.data;
    }

    static async signHandover(id: string, signatory: string, title: string, signatureData?: string): Promise<HandoverCertificate> {
        const response = await axiosInstance.patch(`/project-closure/sign/${id}`, {
            signatory,
            title,
            signatureData, // Base64 signature image
        });
        return response.data;
    }

    static async getCertificate(projectId: string): Promise<HandoverCertificate> {
        const response = await axiosInstance.get(`/project-closure/certificate/${projectId}`);
        return response.data;
    }
}
