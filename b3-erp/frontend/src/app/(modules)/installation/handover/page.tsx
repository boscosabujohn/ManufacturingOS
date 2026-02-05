'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { projectManagementService, Project } from '@/services/ProjectManagementService';
import {
    CheckCircle,
    Camera,
    User,
    Calendar,
    ArrowLeft,
    FileText,
    Award,
    Sparkles,
    Search,
    Loader2,
    FolderKanban,
    Building2
} from 'lucide-react';

interface ProjectInfo {
    id: string;
    name: string;
    clientName: string;
    status: string;
}

interface ClientHandover {
    id: string;
    woNumber: string;
    projectName: string;
    client: string;
    status: 'Preparing' | 'Client Review' | 'Final Approval' | 'Handover Complete' | 'Closed';
    handover: {
        workPhotosUploaded: boolean;
        clientDailyReviews: number;
        finalApproval: boolean;
        cleaningComplete: boolean;
        toolsReturned: boolean;
        handoverCeremonyDone: boolean;
        clientSigned: boolean;
        projectClosed: boolean;
    };
    completionDate?: string;
    signatureDate?: string;
    closureDate?: string;
}

export default function ClientHandoverPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [projects, setProjects] = useState<ProjectInfo[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
    const [projectSearch, setProjectSearch] = useState('');
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const [handovers] = useState<ClientHandover[]>([
        {
            id: '1',
            woNumber: 'WO-2025-001',
            projectName: 'Hotel Paradise Kitchen',
            client: 'Hotel Paradise Ltd',
            status: 'Closed',
            handover: {
                workPhotosUploaded: true,
                clientDailyReviews: 5,
                finalApproval: true,
                cleaningComplete: true,
                toolsReturned: true,
                handoverCeremonyDone: true,
                clientSigned: true,
                projectClosed: true,
            },
            completionDate: '2025-01-30',
            signatureDate: '2025-01-30',
            closureDate: '2025-01-31',
        },
    ]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const allProjects = await projectManagementService.getProjects();
            const projectInfos: ProjectInfo[] = allProjects.map((p: Project) => ({
                id: p.id,
                name: p.name || `Project ${p.id}`,
                clientName: p.clientName || 'Unknown Client',
                status: p.status || 'active',
            }));
            setProjects(projectInfos);

            const projectId = searchParams.get('projectId');
            if (projectId) {
                const found = projectInfos.find(p => p.id === projectId);
                if (found) setSelectedProject(found);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const handleProjectSelect = (project: ProjectInfo) => {
        setSelectedProject(project);
        toast({ title: 'Project Selected', description: `Viewing handover for ${project.name}` });
    };

    const handleChangeProject = () => setSelectedProject(null);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.clientName.toLowerCase().includes(projectSearch.toLowerCase())
    );

    const filteredHandovers = handovers.filter(
        (h) => filterStatus === 'all' || h.status === filterStatus
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Closed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Handover Complete':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Final Approval':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Client Review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Preparing':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const stats = {
        total: handovers.length,
        closed: handovers.filter((h) => h.status === 'Closed').length,
        pending: handovers.filter((h) => h.status !== 'Closed').length,
    };

    if (!selectedProject) {
        return (
            <div className="w-full h-screen overflow-y-auto bg-gray-50">
                <div className="px-4 py-4 space-y-4">
                    <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Award className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Client Handover & Closure</h1>
                                <p className="text-sm text-gray-600">Select a project for handover</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {isLoadingProjects ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                            <span className="ml-2 text-gray-600">Loading projects...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredProjects.map((project) => (
                                <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProjectSelect(project)}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <FolderKanban className="h-5 w-5 text-orange-600" />
                                                <CardTitle className="text-base">{project.name}</CardTitle>
                                            </div>
                                            <Badge variant="outline" className="capitalize">{project.status}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Building2 className="h-4 w-4" />
                                            <span>{project.clientName}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full bg-orange-600 hover:bg-orange-700">Select Project</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen overflow-y-auto bg-gray-50">
            <div className="px-3 py-2 space-y-3">
                {/* Header */}
                <div className="bg-white rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => router.push(`/installation/progress?projectId=${selectedProject.id}`)}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Client Handover & Closure</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedProject.name} • {selectedProject.clientName}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleChangeProject}>
                            Change Project
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Projects</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <FileText className="w-8 h-8 text-gray-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600">Closed</p>
                                <p className="text-2xl font-bold text-green-900">{stats.closed}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                            </div>
                            <Award className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg border p-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Client Review">Client Review</option>
                        <option value="Final Approval">Final Approval</option>
                        <option value="Handover Complete">Handover Complete</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                {/* Handovers List */}
                <div className="grid gap-2">
                    {filteredHandovers.map((handover) => {
                        const handoverArray = Object.values(handover.handover).filter(v => typeof v === 'boolean');
                        const completedSteps = handoverArray.filter(Boolean).length;
                        const totalSteps = handoverArray.length;
                        const percentage = (completedSteps / totalSteps) * 100;

                        return (
                            <div key={handover.id} className="bg-white rounded-lg border p-3 hover:shadow-lg transition">
                                <div className="flex items-start gap-2">
                                    <div className={`w-16 h-16 rounded-lg ${handover.status === 'Closed' ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center`}>
                                        {handover.status === 'Closed' ? (
                                            <Award className="w-8 h-8 text-white" />
                                        ) : (
                                            <FileText className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold">{handover.projectName}</h3>
                                                <p className="text-sm text-gray-600">{handover.woNumber} - {handover.client}</p>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(handover.status)}`}>
                                                {handover.status}
                                            </span>
                                        </div>

                                        {/* Progress */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="font-semibold text-gray-700">
                                                    Handover Progress: {completedSteps}/{totalSteps} steps ({percentage.toFixed(0)}%)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${handover.status === 'Closed' ? 'bg-green-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Handover Checklist */}
                                        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Handover Checklist (8.13-8.20):</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.workPhotosUploaded ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.workPhotosUploaded ? <CheckCircle className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                                                    <span>8.13 - Work Photos Uploaded</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                                    <User className="w-4 h-4" />
                                                    <span>8.14 - {handover.handover.clientDailyReviews} Client Reviews</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.finalApproval ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.finalApproval ? <CheckCircle className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                                                    <span>8.15 - Final Approval</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.cleaningComplete ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.cleaningComplete ? <CheckCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                                    <span>8.16 - Cleaning Complete</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.toolsReturned ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.toolsReturned ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    <span>8.17 - Tools Returned</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.handoverCeremonyDone ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.handoverCeremonyDone ? <CheckCircle className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                                                    <span>8.18 - Handover Ceremony</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.clientSigned ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.clientSigned ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    <span>8.19 - Client Signature</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs ${handover.handover.projectClosed ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {handover.handover.projectClosed ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                    <span>8.20 - Project Closed</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            {handover.completionDate && (
                                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                                    <p className="text-xs text-blue-600">Completion</p>
                                                    <p className="font-medium text-blue-800 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {handover.completionDate}
                                                    </p>
                                                </div>
                                            )}
                                            {handover.signatureDate && (
                                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                                    <p className="text-xs text-green-600">Signature</p>
                                                    <p className="font-medium text-green-800 flex items-center gap-1">
                                                        <FileText className="w-3 h-3" />
                                                        {handover.signatureDate}
                                                    </p>
                                                </div>
                                            )}
                                            {handover.closureDate && (
                                                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                                                    <p className="text-xs text-purple-600">Closure</p>
                                                    <p className="font-medium text-purple-800 flex items-center gap-1">
                                                        <Award className="w-3 h-3" />
                                                        {handover.closureDate}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
