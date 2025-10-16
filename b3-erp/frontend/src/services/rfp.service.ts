import { RFP, RFPStatus, RFPDashboard, RFPStatistics } from '@/types/rfp';
import { MOCK_RFPS } from '@/data/mock-rfps';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const USE_MOCK_DATA = true; // Set to false to use real API

export class RFPService {
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async getAllRFPs(filters?: {
    status?: RFPStatus;
    priority?: string;
    type?: string;
    customerId?: string;
    assignedTo?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
  }): Promise<RFP[]> {
    // Use mock data for development
    if (USE_MOCK_DATA) {
      console.log('[RFP Service] Using mock data, returning', MOCK_RFPS.length, 'RFPs');
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredData = [...MOCK_RFPS];

      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          filteredData = filteredData.filter((rfp) => rfp.status === filters.status);
        }
        if (filters.priority) {
          filteredData = filteredData.filter((rfp) => rfp.priority === filters.priority);
        }
        if (filters.type) {
          filteredData = filteredData.filter((rfp) => rfp.type === filters.type);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(
            (rfp) =>
              rfp.title.toLowerCase().includes(searchLower) ||
              rfp.rfpNumber.toLowerCase().includes(searchLower) ||
              rfp.customerName.toLowerCase().includes(searchLower) ||
              rfp.description.toLowerCase().includes(searchLower)
          );
        }
      }

      return filteredData;
    }

    // Use real API
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const queryString = params.toString();
    const url = `/sales/rfp${queryString ? `?${queryString}` : ''}`;
    console.log('[RFP Service] Fetching from:', `${API_BASE_URL}${url}`);
    return this.request<RFP[]>(url);
  }

  static async getRFPById(id: string): Promise<RFP> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const rfp = MOCK_RFPS.find((r) => r.id === id);
      if (!rfp) {
        throw new Error('RFP not found');
      }
      return rfp;
    }
    return this.request<RFP>(`/sales/rfp/${id}`);
  }

  static async createRFP(data: Partial<RFP>): Promise<RFP> {
    return this.request<RFP>('/sales/rfp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateRFP(id: string, data: Partial<RFP>): Promise<RFP> {
    return this.request<RFP>(`/sales/rfp/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteRFP(id: string): Promise<void> {
    await this.request(`/sales/rfp/${id}`, {
      method: 'DELETE',
    });
  }

  static async updateStatus(
    id: string,
    status: RFPStatus,
    updatedBy: string,
    comments?: string
  ): Promise<RFP> {
    return this.request<RFP>(`/sales/rfp/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, updatedBy, comments }),
    });
  }

  static async addAttachment(
    id: string,
    attachment: any,
    uploadedBy: string
  ): Promise<RFP> {
    return this.request<RFP>(`/sales/rfp/${id}/attachments`, {
      method: 'POST',
      body: JSON.stringify({ attachment, uploadedBy }),
    });
  }

  static async removeAttachment(
    id: string,
    attachmentId: string,
    updatedBy: string
  ): Promise<RFP> {
    return this.request<RFP>(`/sales/rfp/${id}/attachments/${attachmentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ updatedBy }),
    });
  }

  static async addEvaluation(id: string, evaluation: any): Promise<RFP> {
    return this.request<RFP>(`/sales/rfp/${id}/evaluations`, {
      method: 'POST',
      body: JSON.stringify(evaluation),
    });
  }

  static async approveRFP(
    id: string,
    approver: string,
    comments?: string
  ): Promise<RFP> {
    return this.request<RFP>(`/sales/rfp/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approver, comments }),
    });
  }

  static async rejectRFP(
    id: string,
    approver: string,
    comments: string
  ): Promise<RFP> {
    return this.request<RFP>(`/sales/rfp/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ approver, comments }),
    });
  }

  static async getStatistics(): Promise<RFPStatistics> {
    return this.request<RFPStatistics>('/sales/rfp/statistics');
  }

  static async getDashboard(): Promise<RFPDashboard> {
    return this.request<RFPDashboard>('/sales/rfp/dashboard');
  }
}
