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

    private mockProjectResources: any[] = [
        {
            id: 'RES-001',
            projectId: 'proj-001',
            userId: 'USR-001',
            role: 'Project Manager',
            allocationPercentage: 100,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            user: {
                id: 'USR-001',
                name: 'Vikram Malhotra',
                employeeId: 'EMP-2023-001',
                email: 'vikram.m@optiforge.com',
                phone: '+91 98765 43210',
                department: 'Project Management',
                skills: ['Project Planning', 'Risk Management', 'Stakeholder Management', 'Agile'],
                avatar: '/avatars/vikram.jpg'
            }
        },
        {
            id: 'RES-002',
            projectId: 'proj-001',
            userId: 'USR-002',
            role: 'Senior Electrical Engineer',
            allocationPercentage: 80,
            startDate: '2024-01-15',
            endDate: '2024-11-30',
            user: {
                id: 'USR-002',
                name: 'Anjali Sharma',
                employeeId: 'EMP-2023-045',
                email: 'anjali.s@optiforge.com',
                phone: '+91 98765 43211',
                department: 'Engineering',
                skills: ['Electrical Design', 'AutoCAD', 'Power Systems', 'Safety Compliance'],
                avatar: '/avatars/anjali.jpg'
            }
        },
        {
            id: 'RES-003',
            projectId: 'proj-001',
            userId: 'USR-003',
            role: 'Site Supervisor',
            allocationPercentage: 100,
            startDate: '2024-02-01',
            endDate: '2024-12-31',
            user: {
                id: 'USR-003',
                name: 'Rahul Verma',
                employeeId: 'EMP-2023-089',
                email: 'rahul.v@optiforge.com',
                phone: '+91 98765 43212',
                department: 'Operations',
                skills: ['Site Supervision', 'Team Leadership', 'Quality Control', 'Safety Regulations'],
                avatar: '/avatars/rahul.jpg'
            }
        },
        {
            id: 'RES-004',
            projectId: 'proj-001',
            userId: 'USR-004',
            role: 'HVAC Specialist',
            allocationPercentage: 50,
            startDate: '2024-03-01',
            endDate: '2024-08-30',
            user: {
                id: 'USR-004',
                name: 'David Fernades',
                employeeId: 'EMP-2023-102',
                email: 'david.f@optiforge.com',
                phone: '+91 98765 43213',
                department: 'Engineering',
                skills: ['HVAC Systems', 'Thermal Analysis', 'Installation', 'Maintenance'],
                avatar: '/avatars/david.jpg'
            }
        },
        {
            id: 'RES-005',
            projectId: 'proj-001',
            userId: 'USR-005',
            role: 'Quality Inspector',
            allocationPercentage: 40,
            startDate: '2024-04-01',
            endDate: '2024-12-31',
            user: {
                id: 'USR-005',
                name: 'Priya Nair',
                employeeId: 'EMP-2023-156',
                email: 'priya.n@optiforge.com',
                phone: '+91 98765 43214',
                department: 'Quality Control',
                skills: ['Quality Assurance', 'ISO Standards', 'Inspection', 'Reporting'],
                avatar: '/avatars/priya.jpg'
            }
        },
        {
            id: 'RES-006',
            projectId: 'proj-002',
            userId: 'USR-006',
            role: 'Project Manager',
            allocationPercentage: 100,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            user: {
                id: 'USR-006',
                name: 'Suresh Raina',
                employeeId: 'EMP-2023-002',
                email: 'suresh.r@optiforge.com',
                phone: '+91 98765 43215',
                department: 'Project Management',
                skills: ['Project Coordination', 'Budgeting', 'Client Relations'],
                avatar: '/avatars/suresh.jpg'
            }
        },
        {
            id: 'RES-007',
            projectId: 'proj-002',
            userId: 'USR-007',
            role: 'Cold Storage Expert',
            allocationPercentage: 100,
            startDate: '2024-01-10',
            endDate: '2024-09-30',
            user: {
                id: 'USR-007',
                name: 'Michael Chen',
                employeeId: 'EMP-2023-210',
                email: 'michael.c@optiforge.com',
                phone: '+91 98765 43216',
                department: 'Engineering',
                skills: ['Refrigeration', 'Insulation', 'Thermal Dynamics', 'Energy Efficiency'],
                avatar: '/avatars/michael.jpg'
            }
        },
        {
            id: 'RES-008',
            projectId: 'proj-001',
            userId: 'USR-008',
            role: 'Safety Officer',
            allocationPercentage: 30,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            user: {
                id: 'USR-008',
                name: 'Karthik S',
                employeeId: 'EMP-2023-301',
                email: 'karthik.s@optiforge.com',
                phone: '+91 98765 43217',
                department: 'Safety',
                skills: ['Occupational Health', 'Risk Assessment', 'Safety Training', 'Compliance'],
                avatar: '/avatars/karthik.jpg'
            }
        },
        {
            id: 'RES-009',
            projectId: 'proj-001',
            userId: 'USR-009',
            role: 'Installation Technician',
            allocationPercentage: 100,
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            user: {
                id: 'USR-009',
                name: 'Manoj Kumar',
                employeeId: 'EMP-2023-405',
                email: 'manoj.k@optiforge.com',
                phone: '+91 98765 43218',
                department: 'Operations',
                skills: ['Equipment Installation', 'Blueprint Reading', 'Tool Handling', 'Physical Endurance'],
                avatar: '/avatars/manoj.jpg'
            }
        },
        {
            id: 'RES-010',
            projectId: 'proj-001',
            userId: 'USR-010',
            role: 'Junior Designer',
            allocationPercentage: 60,
            startDate: '2024-02-01',
            endDate: '2024-10-31',
            user: {
                id: 'USR-010',
                name: 'Sarah Lee',
                employeeId: 'EMP-2023-512',
                email: 'sarah.l@optiforge.com',
                phone: '+91 98765 43219',
                department: 'Design',
                skills: ['CAD', '3D Modeling', 'Sketching', 'Material Selection'],
                avatar: '/avatars/sarah.jpg'
            }
        }
    ];


    private mockProjectBudgets: ProjectBudget[] = [
        // Project 1: Commercial Kitchen (On Track / Slightly Under)
        { id: 'BUD-001', projectId: 'proj-001', category: 'Labor', budgetAllocated: 50000, budgetSpent: 45000, forecastCost: 48000 },
        { id: 'BUD-002', projectId: 'proj-001', category: 'Materials', budgetAllocated: 120000, budgetSpent: 110000, forecastCost: 118000 },
        { id: 'BUD-003', projectId: 'proj-001', category: 'Equipment', budgetAllocated: 80000, budgetSpent: 75000, forecastCost: 78000 },
        { id: 'BUD-004', projectId: 'proj-001', category: 'Subcontractor', budgetAllocated: 30000, budgetSpent: 32000, forecastCost: 35000 }, // Overspend
        { id: 'BUD-005', projectId: 'proj-001', category: 'Logistics', budgetAllocated: 15000, budgetSpent: 12000, forecastCost: 14000 },
        { id: 'BUD-006', projectId: 'proj-001', category: 'Design', budgetAllocated: 25000, budgetSpent: 25000, forecastCost: 25000 },
        { id: 'BUD-007', projectId: 'proj-001', category: 'Contingency', budgetAllocated: 20000, budgetSpent: 5000, forecastCost: 10000 },

        // Project 2: Cold Storage (Over Budget)
        { id: 'BUD-008', projectId: 'proj-002', category: 'Labor', budgetAllocated: 40000, budgetSpent: 48000, forecastCost: 55000 }, // Significant Overspend
        { id: 'BUD-009', projectId: 'proj-002', category: 'Materials', budgetAllocated: 90000, budgetSpent: 95000, forecastCost: 100000 },
        { id: 'BUD-010', projectId: 'proj-002', category: 'Equipment', budgetAllocated: 150000, budgetSpent: 145000, forecastCost: 152000 },
        { id: 'BUD-011', projectId: 'proj-002', category: 'Subcontractor', budgetAllocated: 20000, budgetSpent: 22000, forecastCost: 24000 },
        { id: 'BUD-012', projectId: 'proj-002', category: 'Logistics', budgetAllocated: 10000, budgetSpent: 11000, forecastCost: 12000 },

        // Project 3: Industrial Kitchen (Under Budget)
        { id: 'BUD-013', projectId: 'proj-003', category: 'Labor', budgetAllocated: 60000, budgetSpent: 40000, forecastCost: 55000 },
        { id: 'BUD-014', projectId: 'proj-003', category: 'Materials', budgetAllocated: 140000, budgetSpent: 100000, forecastCost: 135000 },
        { id: 'BUD-015', projectId: 'proj-003', category: 'Equipment', budgetAllocated: 100000, budgetSpent: 60000, forecastCost: 95000 },
        { id: 'BUD-016', projectId: 'proj-003', category: 'Design', budgetAllocated: 30000, budgetSpent: 28000, forecastCost: 30000 },
    ];

    private mockProjects: Project[] = [
        {
            id: 'proj-001',
            name: 'Taj Hotel Commercial Kitchen Installation',
            clientName: 'Taj Hotels Limited',
            projectCode: 'PRJ-2024-001',
            status: 'In Progress',
            priority: 'High',
            progress: 65,
            budgetAllocated: 8500000,
            budgetSpent: 5200000,
            location: 'Mumbai',
            projectType: 'Commercial Kitchen'
        },
        {
            id: 'proj-002',
            name: 'BigBasket Cold Storage Facility',
            clientName: 'BigBasket Pvt Ltd',
            projectCode: 'PRJ-2024-002',
            status: 'In Progress',
            priority: 'High',
            progress: 45,
            budgetAllocated: 12000000,
            budgetSpent: 4800000,
            location: 'Bangalore',
            projectType: 'Cold Room'
        }
    ];

    // --- Projects ---
    async getProjects(): Promise<Project[]> {
        try {
            const response = await apiClient.get<Project[]>('/projects');
            const data = response.data || [];
            return data.length > 0 ? data : this.mockProjects;
        } catch (error) {
            console.error('API Error fetching projects, using mocks:', error);
            return this.mockProjects;
        }
    }

    async getProject(id: string): Promise<Project> {
        try {
            const response = await apiClient.get<Project>(`/projects/${id}`);
            return response.data;
        } catch (error) {
            console.error(`API Error fetching project ${id}, using mocks:`, error);
            const mock = this.mockProjects.find(p => p.id === id);
            if (mock) return mock;
            throw error;
        }
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
        try {
            const response = await apiClient.get<ProjectResource[]>(`/project-resources?projectId=${projectId}`);
            if (response.data?.length > 0) return response.data;
            // If API returns empty, fallback to mock data
            const projectResources = this.mockProjectResources.filter(r => r.projectId === projectId);
            return projectResources;
        } catch (error) {
            console.warn('API error fetching resources, using mock data:', error);
            const projectResources = this.mockProjectResources.filter(r => r.projectId === projectId);
            return projectResources;
        }
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
        try {
            const response = await apiClient.get<ProjectBudget[]>(`/project-budgets?projectId=${projectId}`);
            if (response.data?.length > 0) return response.data;
            // If API returns empty, fallback to mock data
            const budgets = this.mockProjectBudgets.filter(b => b.projectId === projectId);
            return budgets;
        } catch (error) {
            console.warn('API error fetching budgets, using mock data:', error);
            const budgets = this.mockProjectBudgets.filter(b => b.projectId === projectId);
            return budgets;
        }
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
        try {
            const response = await apiClient.get<TAClaim[]>(`/ta-claims?projectId=${projectId}`);
            if (response.data?.length > 0) return response.data;
            return this.claims.filter(c => c.projectId === projectId);
        } catch (error) {
            console.warn('API error fetching claims, using mock data:', error);
            return this.claims.filter(c => c.projectId === projectId);
        }
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
        try {
            const response = await apiClient.get<EmergencySpareRequest[]>(`/spare-requests?projectId=${projectId}`);
            if (response.data?.length > 0) return response.data;
            return this.spareRequests.filter(r => r.projectId === projectId);
        } catch (error) {
            console.warn('API error fetching spare requests, using mock data:', error);
            return this.spareRequests.filter(r => r.projectId === projectId);
        }
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
        try {
            const response = await apiClient.get<FieldScheduleItem[]>('/field-schedule');
            if (response.data?.length > 0) return response.data;
            return [...this.schedule];
        } catch (error) {
            console.warn('API error fetching schedule, using mock data:', error);
            return [...this.schedule];
        }
    }

    async checkIn(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 600));
        // In a real app, this would verify location, etc.
    }

    async checkOut(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 600));
    }

    async getSiteMeasurements(projectId: string): Promise<RoomMeasurements[]> {
        try {
            const response = await apiClient.get<RoomMeasurements[]>(`/site-measurements?projectId=${projectId}`);
            if (response.data?.length > 0) return response.data;
            return JSON.parse(JSON.stringify(this.siteMeasurements));
        } catch (error) {
            console.warn('API error fetching site measurements, using mock data:', error);
            return JSON.parse(JSON.stringify(this.siteMeasurements));
        }
    }

    async saveSiteMeasurements(projectId: string, data: RoomMeasurements[]): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 800));
        this.siteMeasurements = data;
    }

    // Drawing Verification Methods
    async getDrawings(projectId: string): Promise<Drawing[]> {
        try {
            const response = await apiClient.get<Drawing[]>(`/drawings?projectId=${projectId}`);
            if (response.data?.length > 0) return response.data;
            return [...this.drawings];
        } catch (error) {
            console.warn('API error fetching drawings, using mock data:', error);
            return [...this.drawings];
        }
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
        try {
            const response = await apiClient.get<BOQItem[]>(`/boq-items?projectId=${projectId}`);
            if (response.data?.length > 0) return response.data;
            return [...this.boqItems];
        } catch (error) {
            console.warn('API error fetching BOQ items, using mock data:', error);
            return [...this.boqItems];
        }
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
        try {
            const response = await apiClient.get<Discrepancy[]>(`/discrepancies?projectId=${projectId}`);
            if (response.data?.length > 0) return response.data;
            return [...this.discrepancies];
        } catch (error) {
            console.warn('API error fetching discrepancies, using mock data:', error);
            return [...this.discrepancies];
        }
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
