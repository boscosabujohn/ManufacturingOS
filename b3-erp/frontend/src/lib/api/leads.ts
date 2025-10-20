import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface LeadFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  title?: string;
  company: string;
  website?: string;
  industry?: string;
  employeeCount?: string;
  annualRevenue?: string;

  // Contact Information
  email: string;
  phone?: string;
  mobile?: string;
  fax?: string;

  // Address Information
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  // Lead Details
  status?: string;
  rating?: string;
  leadSource: string;
  leadSubSource?: string;
  referredBy?: string;
  campaign?: string;

  // Opportunity Information
  estimatedValue?: number;
  estimatedCloseDate?: string;
  probability?: number;
  productInterest?: string[];
  customProducts?: string[];

  // Assignment & Ownership
  assignedTo?: string;
  teamAssignment?: string;

  // Additional Details
  description?: string;
  tags?: string[];
  customFields?: Record<string, any>;

  // Social Media
  linkedIn?: string;
  twitter?: string;
  facebook?: string;

  // Compliance & Privacy
  gdprConsent?: boolean;
  emailOptIn?: boolean;
  smsOptIn?: boolean;
  doNotCall?: boolean;

  // Lead Score
  leadScore?: number;

  // Attachments
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}

export interface Lead extends LeadFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
}

export interface LeadFilterParams {
  search?: string;
  status?: string;
  rating?: string;
  assignedTo?: string;
  leadSource?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface LeadListResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  byRating: Record<string, number>;
  totalValue: number;
}

export const leadsApi = {
  // Create a new lead
  create: async (data: LeadFormData): Promise<Lead> => {
    const response = await axios.post(`${API_BASE_URL}/crm/leads`, data);
    return response.data;
  },

  // Get all leads with filters
  getAll: async (filters?: LeadFilterParams): Promise<LeadListResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.rating) params.append('rating', filters.rating);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters?.leadSource) params.append('leadSource', filters.leadSource);
    if (filters?.tags) params.append('tags', filters.tags.join(','));
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await axios.get(`${API_BASE_URL}/crm/leads?${params.toString()}`);
    return response.data;
  },

  // Get a single lead by ID
  getById: async (id: string): Promise<Lead> => {
    const response = await axios.get(`${API_BASE_URL}/crm/leads/${id}`);
    return response.data;
  },

  // Update a lead
  update: async (id: string, data: Partial<LeadFormData>): Promise<Lead> => {
    const response = await axios.patch(`${API_BASE_URL}/crm/leads/${id}`, data);
    return response.data;
  },

  // Delete a lead
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/crm/leads/${id}`);
  },

  // Get lead statistics
  getStats: async (): Promise<LeadStats> => {
    const response = await axios.get(`${API_BASE_URL}/crm/leads/stats`);
    return response.data;
  },

  // Convert lead to customer
  convertToCustomer: async (id: string): Promise<Lead> => {
    const response = await axios.post(`${API_BASE_URL}/crm/leads/${id}/convert-to-customer`);
    return response.data;
  },

  // Update last contact date
  updateContactDate: async (id: string): Promise<Lead> => {
    const response = await axios.post(`${API_BASE_URL}/crm/leads/${id}/update-contact-date`);
    return response.data;
  },
};
