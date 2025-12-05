import { apiClient } from './api/client';

export interface Project {
    id: string;
    name: string;
    clientName: string;
    description?: string;
    projectCode?: string;
    startDate?: string;
    endDate?: string;
    status: string;
    priority: string;
    progress: number;
    budgetAllocated: number;
    budgetSpent: number;
    projectManagerId?: string;
    location?: string;
    projectType?: string;
}

export interface ProjectTask {
    id: string;
    projectId: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    status: string;
    priority: string;
    progress: number;
    assignedTo?: string[];
    parentTaskId?: string;
    subtasks?: ProjectTask[];
}

export interface ProjectResource {
    id: string;
    projectId: string;
    userId: string;
    role?: string;
    allocationPercentage: number;
    startDate?: string;
    endDate?: string;
}

export interface ProjectBudget {
    id: string;
    projectId: string;
    category: string;
    budgetAllocated: number;
    budgetSpent: number;
    forecastCost: number;
}

export interface ProjectMilestone {
    id: string;
    projectId: string;
    name: string;
    dueDate?: string;
    status: string;
}

export interface TimeLog {
    id: string;
    projectId: string;
    taskId?: string;
    userId: string;
    date: string;
    hours: number;
    description?: string;
}

export interface TAClaim {
    id: string;
    date: string;
    amount: number;
    description: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    projectId: string;
}

export interface EmergencySpareRequest {
    id: string;
    partId: string;
    quantity: number;
    urgency: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Approved' | 'Pending Approval' | 'Rejected';
    requestedBy: string;
    projectId: string;
    reason: string;
}

export interface FieldScheduleItem {
    id: number;
    project: string;
    location: string;
    time: string;
    status: 'Upcoming' | 'Completed' | 'In Progress';
}

export interface Measurement {
    id: string;
    label: string;
    value: string;
    unit: string;
    description?: string;
}

export interface RoomMeasurements {
    id: string;
    roomName: string;
    measurements: Measurement[];
}

export interface Discrepancy {
    id: string;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'In Review' | 'Resolved';
    date: string;
    reportedBy: string;
}

export interface BOQItem {
    id: string;
    description: string;
    boqQty: number;
    drawingQty: number;
    status: 'Match' | 'Mismatch';
    notes?: string;
}

export interface Drawing {
    id: string;
    name: string;
    type: 'Layout' | 'Structural' | 'MEP';
    version: string;
    status: 'Pending' | 'Verified' | 'Rejected';
    uploadDate: string;
    url: string;
    notes?: string;
}

class ProjectManagementService {
    // ... existing mock data stores ...
    private claims: TAClaim[] = [
        { id: 'CLM-001', date: '2023-10-25', amount: 1500, description: 'Site visit travel', status: 'Approved', projectId: 'proj-001' },
        { id: 'CLM-002', date: '2023-10-28', amount: 800, description: 'Local conveyance', status: 'Pending', projectId: 'proj-001' },
    ];

    private spareRequests: EmergencySpareRequest[] = [
        { id: 'SPR-001', partId: 'PT-123', quantity: 5, urgency: 'High', status: 'Approved', requestedBy: 'John Doe', projectId: 'proj-001', reason: 'Broken during install' },
        { id: 'SPR-002', partId: 'PT-456', quantity: 2, urgency: 'Medium', status: 'Pending Approval', requestedBy: 'Jane Smith', projectId: 'proj-001', reason: 'Missing from kit' },
    ];

    private schedule: FieldScheduleItem[] = [
        { id: 1, project: 'Metro Rail Phase 1', location: 'Site A', time: '09:00 AM', status: 'Upcoming' },
        { id: 2, project: 'Solar Power Plant', location: 'Site B', time: '02:00 PM', status: 'Upcoming' },
    ];

    private siteMeasurements: RoomMeasurements[] = [
        {
            id: 'RM-001',
            roomName: 'Kitchen',
            measurements: [
                { id: 'M-001', label: 'Wall A Length', value: '3000', unit: 'mm', description: 'North facing wall' },
                { id: 'M-002', label: 'Ceiling Height', value: '2800', unit: 'mm' },
            ]
        },
        {
            id: 'RM-002',
            roomName: 'Pantry',
            measurements: [
                { id: 'M-003', label: 'Floor Area', value: '4.5', unit: 'sqm', description: 'Tiled flooring' },
            ]
        }
    ];

    private drawings: Drawing[] = [
        { id: 'DRW-001', name: 'Ground Floor Layout', type: 'Layout', version: 'v1.0', status: 'Pending', uploadDate: '2023-10-20', url: '#' },
        { id: 'DRW-002', name: 'Structural Columns', type: 'Structural', version: 'v1.2', status: 'Verified', uploadDate: '2023-10-22', url: '#' },
        { id: 'DRW-003', name: 'HVAC Plan', type: 'MEP', version: 'v0.5', status: 'Rejected', uploadDate: '2023-10-25', url: '#', notes: 'Clash with beams' },
        { id: 'DRW-004', name: 'Electrical Layout', type: 'MEP', version: 'v1.0', status: 'Pending', uploadDate: '2023-10-26', url: '#' },
    ];

    private boqItems: BOQItem[] = [
        { id: 'BOQ-001', description: 'Base Cabinet 600mm', boqQty: 12, drawingQty: 12, status: 'Match' },
        { id: 'BOQ-002', description: 'Wall Cabinet 900mm', boqQty: 8, drawingQty: 8, status: 'Match' },
        { id: 'BOQ-003', description: 'Tall Unit 2100mm', boqQty: 2, drawingQty: 3, status: 'Mismatch', notes: 'Extra unit added in layout' },
        { id: 'BOQ-004', description: 'Island Countertop', boqQty: 1, drawingQty: 1, status: 'Match' },
        { id: 'BOQ-005', description: 'Drawer Unit 450mm', boqQty: 5, drawingQty: 4, status: 'Mismatch', notes: 'Removed due to space constraint' },
    ];

    private discrepancies: Discrepancy[] = [
        { id: 'DIS-001', title: 'Tall Unit Quantity Mismatch', description: 'BOQ says 2, Drawing shows 3', priority: 'High', status: 'Open', date: '2025-01-20', reportedBy: 'Site Supervisor' },
        { id: 'DIS-002', title: 'Sink Position Conflict', description: 'Plumbing not aligned with cabinet', priority: 'Medium', status: 'In Review', date: '2025-01-19', reportedBy: 'MEP Engineer' },
        { id: 'DIS-003', title: 'Material Finish Unavailable', description: 'Selected laminate out of stock', priority: 'Low', status: 'Resolved', date: '2025-01-18', reportedBy: 'Procurement' },
    ];

    // --- Projects ---
    async getProjects(): Promise<Project[]> {
        const response = await apiClient.get<Project[]>('/projects');
        return response.data || []; // Handle if data is wrapped or direct
    }

    async getProject(id: string): Promise<Project> {
        const response = await apiClient.get<Project>(`/projects/${id}`);
        return response.data;
    }

    async createProject(data: any): Promise<Project> {
        const response = await apiClient.post<Project>('/projects', data);
        return response.data;
    }

    async updateProject(id: string, data: any): Promise<Project> {
        const response = await apiClient.put<Project>(`/projects/${id}`, data); // or patch
        return response.data; // Assuming patch is supported or use put
    }

    async deleteProject(id: string): Promise<void> {
        await apiClient.delete(`/projects/${id}`);
    }

    // --- Tasks ---
    async getTasks(projectId: string): Promise<ProjectTask[]> {
        const response = await apiClient.get<ProjectTask[]>(`/project-tasks?projectId=${projectId}`);
        return response.data || [];
    }

    async createTask(data: any): Promise<ProjectTask> {
        const response = await apiClient.post<ProjectTask>('/project-tasks', data);
        return response.data;
    }

    async updateTask(id: string, data: any): Promise<ProjectTask> {
        const response = await apiClient.put<ProjectTask>(`/project-tasks/${id}`, data); // Using put for now, maybe patch
        return response.data;
    }

    async deleteTask(id: string): Promise<void> {
        await apiClient.delete(`/project-tasks/${id}`);
    }

    // --- Resources ---
    async getResources(projectId: string): Promise<ProjectResource[]> {
        const response = await apiClient.get<ProjectResource[]>(`/project-resources?projectId=${projectId}`);
        return response.data || [];
    }

    async createResource(data: any): Promise<ProjectResource> {
        const response = await apiClient.post<ProjectResource>('/project-resources', data);
        return response.data;
    }

    async updateResource(id: string, data: any): Promise<ProjectResource> {
        const response = await apiClient.put<ProjectResource>(`/project-resources/${id}`, data);
        return response.data;
    }

    async deleteResource(id: string): Promise<void> {
        await apiClient.delete(`/project-resources/${id}`);
    }

    // --- Budgets ---
    async getBudgets(projectId: string): Promise<ProjectBudget[]> {
        const response = await apiClient.get<ProjectBudget[]>(`/project-budgets?projectId=${projectId}`);
        return response.data || [];
    }

    async createBudget(data: any): Promise<ProjectBudget> {
        const response = await apiClient.post<ProjectBudget>('/project-budgets', data);
        return response.data;
    }

    async updateBudget(id: string, data: any): Promise<ProjectBudget> {
        const response = await apiClient.put<ProjectBudget>(`/project-budgets/${id}`, data);
        return response.data;
    }

    async deleteBudget(id: string): Promise<void> {
        await apiClient.delete(`/project-budgets/${id}`);
    }

    // --- Milestones ---
    async getMilestones(projectId: string): Promise<ProjectMilestone[]> {
        const response = await apiClient.get<ProjectMilestone[]>(`/project-milestones?projectId=${projectId}`);
        return response.data || [];
    }

    async createMilestone(data: any): Promise<ProjectMilestone> {
        const response = await apiClient.post<ProjectMilestone>('/project-milestones', data);
        return response.data;
    }

    async updateMilestone(id: string, data: any): Promise<ProjectMilestone> {
        const response = await apiClient.put<ProjectMilestone>(`/project-milestones/${id}`, data);
        return response.data;
    }

    async deleteMilestone(id: string): Promise<void> {
        await apiClient.delete(`/project-milestones/${id}`);
    }

    // --- Time Logs ---
    async getTimeLogs(projectId: string, userId?: string): Promise<TimeLog[]> {
        let url = `/time-logs?projectId=${projectId}`;
        if (userId) url += `&userId=${userId}`;
        const response = await apiClient.get<TimeLog[]>(url);
        return response.data || [];
    }

    async createTimeLog(data: any): Promise<TimeLog> {
        const response = await apiClient.post<TimeLog>('/time-logs', data);
        return response.data;
    }

    async updateTimeLog(id: string, data: any): Promise<TimeLog> {
        const response = await apiClient.put<TimeLog>(`/time-logs/${id}`, data);
        return response.data;
    }

    async deleteTimeLog(id: string): Promise<void> {
        await apiClient.delete(`/time-logs/${id}`);
    }

    // ... existing methods ...
    // TA Settlement Methods
    async getClaims(projectId: string): Promise<TAClaim[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.claims.filter(c => c.projectId === projectId);
    }

    async createClaim(claim: Omit<TAClaim, 'id' | 'status'>): Promise<TAClaim> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newClaim: TAClaim = {
            ...claim,
            id: `CLM-${Date.now()}`,
            status: 'Pending',
        };
        this.claims.push(newClaim);
        return newClaim;
    }

    // Emergency Spares Methods
    async getSpareRequests(projectId: string): Promise<EmergencySpareRequest[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.spareRequests.filter(r => r.projectId === projectId);
    }

    async createSpareRequest(request: Omit<EmergencySpareRequest, 'id' | 'status'>): Promise<EmergencySpareRequest> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newRequest: EmergencySpareRequest = {
            ...request,
            id: `SPR-${Date.now()}`,
            status: 'Pending Approval',
        };
        this.spareRequests.push(newRequest);
        return newRequest;
    }

    async updateSpareRequestStatus(id: string, status: EmergencySpareRequest['status']): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const request = this.spareRequests.find(r => r.id === id);
        if (request) {
            request.status = status;
        }
    }

    // Field View Methods
    async getSchedule(): Promise<FieldScheduleItem[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...this.schedule];
    }

    async checkIn(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 600));
        // In a real app, this would verify location, etc.
    }

    async checkOut(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 600));
    }

    async getSiteMeasurements(projectId: string): Promise<RoomMeasurements[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return JSON.parse(JSON.stringify(this.siteMeasurements));
    }

    async saveSiteMeasurements(projectId: string, data: RoomMeasurements[]): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 800));
        this.siteMeasurements = data;
    }

    // Drawing Verification Methods
    async getDrawings(projectId: string): Promise<Drawing[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        // In a real app, we'd filter by projectId
        return [...this.drawings];
    }

    async verifyDrawing(id: string, status: 'Verified' | 'Rejected', notes?: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const drawing = this.drawings.find(d => d.id === id);
        if (drawing) {
            drawing.status = status;
            if (notes) drawing.notes = notes;
        }
    }

    async getBOQItems(projectId: string): Promise<BOQItem[]> {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
        return [...this.boqItems];
    }

    async updateBOQItem(id: string, drawingQty: number, notes?: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const itemIndex = this.boqItems.findIndex(i => i.id === id);
        if (itemIndex > -1) {
            const item = this.boqItems[itemIndex];
            const status = item.boqQty === drawingQty ? 'Match' : 'Mismatch';
            this.boqItems[itemIndex] = { ...item, drawingQty, status, notes };
        }
    }

    async getDiscrepancies(projectId: string): Promise<Discrepancy[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [...this.discrepancies];
    }

    async createDiscrepancy(discrepancy: Omit<Discrepancy, 'id' | 'date' | 'status'>): Promise<Discrepancy> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newDiscrepancy: Discrepancy = {
            ...discrepancy,
            id: `DIS-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Open'
        };
        this.discrepancies.unshift(newDiscrepancy);
        return newDiscrepancy;
    }
}

export const projectManagementService = new ProjectManagementService();
