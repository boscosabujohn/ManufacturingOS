import apiClient from '@/lib/api-client';

export interface InteractionFormData {
  type: string;
  customer?: string;
  contactPerson?: string;
  subject: string;
  description?: string;
  outcome?: string;
  duration?: string;
  location?: string;
  performedBy?: string;
  dateTime?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  assignedTo?: string;
  tags?: string[];
  relatedOpportunity?: string;
  relatedOrder?: string;
}

export interface Interaction extends InteractionFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface InteractionStatistics {
  total: number;
  thisWeek: number;
  calls: number;
  meetings: number;
  pageVisits: number;
  byType: Record<string, number>;
  byOutcome: Record<string, number>;
}

class InteractionsService {
  private baseUrl = '/crm/interactions';

  async getAllInteractions(): Promise<Interaction[]> {
    try {
      const response = await apiClient.get<Interaction[]>(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch interactions:', error);
      return [];
    }
  }

  async getInteractionById(id: string): Promise<Interaction | null> {
    try {
      const response = await apiClient.get<Interaction>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch interaction ${id}:`, error);
      return null;
    }
  }

  async createInteraction(data: InteractionFormData): Promise<Interaction | null> {
    try {
      const response = await apiClient.post<Interaction>(this.baseUrl, data);
      console.log('Interaction created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create interaction:', error);
      return null;
    }
  }

  async updateInteraction(id: string, data: Partial<InteractionFormData>): Promise<Interaction | null> {
    try {
      const response = await apiClient.patch<Interaction>(`${this.baseUrl}/${id}`, data);
      console.log('Interaction updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update interaction ${id}:`, error);
      return null;
    }
  }

  async deleteInteraction(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
      console.log('Interaction deleted successfully');
      return true;
    } catch (error) {
      console.error(`Failed to delete interaction ${id}:`, error);
      return false;
    }
  }

  async getStatistics(): Promise<InteractionStatistics | null> {
    try {
      const response = await apiClient.get<InteractionStatistics>(`${this.baseUrl}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      return null;
    }
  }

  async logPageVisit(pageUrl: string, metadata?: Record<string, any>): Promise<Interaction | null> {
    try {
      const response = await apiClient.post<Interaction>(`${this.baseUrl}/log-visit`, {
        pageUrl,
        metadata,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to log page visit:', error);
      return null;
    }
  }
}

export const interactionsService = new InteractionsService();
export default interactionsService;
