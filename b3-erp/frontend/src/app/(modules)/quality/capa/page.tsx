'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Activity,
    Clock,
    CheckCircle,
    TrendingUp,
    AlertCircle,
    Search,
    User,
    Calendar,
    FileText,
    Link2,
    Target,
    Eye,
    MoreHorizontal,
    Download,
    ShieldCheck,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface CAPA {
    id: string;
    capaNumber: string;
    title: string;
    type: 'corrective' | 'preventive';
    priority: 'high' | 'medium' | 'low';
    status: 'planned' | 'in-progress' | 'completed' | 'overdue' | 'verified';
    owner: string;
    dueDate: string;
    progress: number;
    linkedNCR?: string;
    description: string;
    department: string;
    rootCause?: string;
    verifiedBy?: string;
}

const MOCK_CAPAS: CAPA[] = [
    {
        id: '1',
        capaNumber: 'CAPA-2024-001',
        title: 'Implement dimensional inspection jig for shell plates',
        type: 'corrective',
        priority: 'high',
        status: 'in-progress',
        owner: 'Suresh Patil',
        dueDate: '2024-08-01',
        progress: 65,
        linkedNCR: 'NCR-2024-001',
        description: 'Design and implement a dedicated inspection jig for verifying shell plate thickness during incoming inspection.',
        department: 'Quality Assurance',
        rootCause: 'Lack of standardized measurement fixtures led to inconsistencies in incoming inspection.'
    },
    {
        id: '2',
        capaNumber: 'CAPA-2024-002',
        title: 'Upgrade welding process with automated flux monitoring',
        type: 'corrective',
        priority: 'high',
        status: 'planned',
        owner: 'John Doe',
        dueDate: '2024-08-15',
        progress: 20,
        linkedNCR: 'NCR-2024-002',
        description: 'Install automated flux monitoring sensors on all welding stations to detect porosity issues in real-time.',
        department: 'Production Engineering',
        rootCause: 'Manual inspection of welding parameters is ineffective for detecting porosity before X-ray stage.'
    },
    {
        id: '3',
        capaNumber: 'CAPA-2024-003',
        title: 'Implement supplier quality audit program',
        type: 'preventive',
        priority: 'medium',
        status: 'completed',
        owner: 'Anita Desai',
        dueDate: '2024-07-20',
        progress: 100,
        description: 'Establish quarterly quality audits for all critical suppliers to ensure compliance with specifications.',
        department: 'Supplier Quality',
        verifiedBy: 'Quality Manager'
    },
    {
        id: '4',
        capaNumber: 'CAPA-2024-004',
        title: 'Calibration management system upgrade',
        type: 'preventive',
        priority: 'medium',
        status: 'verified',
        owner: 'Manoj Singh',
        dueDate: '2024-07-25',
        progress: 100,
        linkedNCR: 'NCR-2024-004',
        description: 'Deploy digital calibration tracking system with automated alerts for all measurement equipment.',
        department: 'Metrology',
        rootCause: 'Manual tracking of calibration schedules resulted in missed calibration deadlines.',
        verifiedBy: 'Metrology Head'
    },
    {
        id: '5',
        capaNumber: 'CAPA-2024-005',
        title: 'Enhance operator training for surface preparation',
        type: 'corrective',
        priority: 'high',
        status: 'overdue',
        owner: 'Rajesh G.',
        dueDate: '2024-07-15',
        progress: 45,
        description: 'Develop comprehensive training module for operators on degreasing and surface preparation procedures.',
        department: 'Training',
        rootCause: 'Inadequate operator training led to inconsistent surface preparation quality.'
    },
    {
        id: '6',
        capaNumber: 'CAPA-2024-006',
        title: 'Implement barcode verification at receiving',
        type: 'preventive',
        priority: 'low',
        status: 'in-progress',
        owner: 'Prakash L.',
        dueDate: '2024-08-30',
        progress: 75,
        linkedNCR: 'NCR-2024-005',
        description: 'Install barcode scanning system at receiving dock to verify material certifications automatically.',
        department: 'Receiving Inspection'
    }
];

export default function CAPAPage() {
    const [capas, setCapas] = useState<CAPA[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        const fetchCAPAs = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/quality/capa');
                if (response.ok) {
                    const data = await response.json();
                    setCapas(data.data?.length > 0 ? data.data : MOCK_CAPAS);
                } else {
                    setCapas(MOCK_CAPAS);
                }
            } catch (error) {
                console.error('Failed to fetch CAPAs:', error);
                setCapas(MOCK_CAPAS);
            } finally {
                setLoading(false);
            }
        };
        fetchCAPAs();
    }, []);

    const filteredCAPAs = useMemo(() => {
        return capas.filter(c => {
            const matchesStatus = filter === 'all' || c.status === filter;
            const matchesType = typeFilter === 'all' || c.type === typeFilter;
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.capaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.department.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesType && matchesSearch;
        });
    }, [capas, filter, typeFilter, searchTerm]);

    const stats = {
        total: capas.length,
        active: capas.filter(c => c.status === 'in-progress' || c.status === 'planned').length,
        completed: capas.filter(c => c.status === 'completed' || c.status === 'verified').length,
        overdue: capas.filter(c => c.status === 'overdue').length,
    };

    const getPriorityBadge = (priority: string) => {
        const config: any = {
            high: 'bg-red-100 text-red-700 border-red-200',
            medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            low: 'bg-green-100 text-green-700 border-green-200',
        };
        return (
            <Badge variant="outline" className={`${config[priority] || 'bg-gray-100'} font-semibold capitalize`}>
                {priority}
            </Badge>
        );
    };

    const getStatusBadge = (status: string) => {
        const config: any = {
            planned: { color: 'bg-blue-50 text-blue-600 border-blue-200', icon: Clock },
            'in-progress': { color: 'bg-amber-50 text-amber-600 border-amber-200', icon: RefreshCw },
            completed: { color: 'bg-green-50 text-green-600 border-green-200', icon: CheckCircle },
            verified: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ShieldCheck },
            overdue: { color: 'bg-red-50 text-red-600 border-red-200', icon: AlertCircle },
        };
        const { color, icon: Icon } = config[status] || config.planned;
        return (
            <Badge variant="outline" className={`${color} font-medium capitalize`}>
                <Icon className="mr-1 h-3 w-3" />
                {status.replace('-', ' ')}
            </Badge>
        );
    };

    const getTypeBadge = (type: string) => {
        const config: any = {
            corrective: 'bg-orange-50 text-orange-700 border-orange-200',
            preventive: 'bg-purple-50 text-purple-700 border-purple-200',
        };
        return (
            <Badge variant="outline" className={`${config[type] || 'bg-gray-50'} font-medium capitalize`}>
                {type}
            </Badge>
        );
    };

    return (
        <div className="w-full px-4 py-6 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CAPA Management</h1>
                    <p className="text-gray-500 mt-1">Corrective and Preventive Actions tracking</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Link href="/quality/capa/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Create CAPA
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total CAPAs</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-600">Active</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.active}</h3>
                        </div>
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Completed</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.completed}</h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600">Overdue</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.overdue}</h3>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="shadow-sm border-gray-200">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative w-full lg:flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by CAPA #, title, or department..."
                                className="pl-10 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {['all', 'planned', 'in-progress', 'completed', 'overdue'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${filter === status
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {status === 'all' ? 'All Status' : status.replace('-', ' ').charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                            <select
                                className="text-sm border-gray-200 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all border"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">Any Type</option>
                                <option value="corrective">Corrective</option>
                                <option value="preventive">Preventive</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* CAPA List */}
            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredCAPAs.length === 0 ? (
                    <Card className="border-dashed border-2 py-20 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Activity className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No CAPAs match your criteria</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                        <Button variant="outline" className="mt-6" onClick={() => { setFilter('all'); setTypeFilter('all'); setSearchTerm(''); }}>
                            Clear All Filters
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredCAPAs.map((capa) => (
                            <Card key={capa.id} className="group hover:border-blue-400 transition-all duration-200 shadow-sm overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    {/* Left highlight bar based on status */}
                                    <div className={`w-1 md:w-2 ${capa.status === 'overdue' ? 'bg-red-500' : capa.status === 'in-progress' ? 'bg-amber-500' : capa.status === 'completed' || capa.status === 'verified' ? 'bg-green-500' : 'bg-blue-500'}`} />

                                    <CardContent className="p-6 flex-1">
                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                {/* Header info */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-bold text-blue-600">{capa.capaNumber}</span>
                                                    <span className="text-gray-300">•</span>
                                                    {getTypeBadge(capa.type)}
                                                    {getPriorityBadge(capa.priority)}
                                                    {getStatusBadge(capa.status)}
                                                </div>

                                                {/* Title and Description */}
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{capa.title}</h3>
                                                    <p className="text-gray-600 mt-2 line-clamp-2">{capa.description}</p>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="pt-2">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-500 font-medium">Progress</span>
                                                        <span className="font-bold text-gray-700">{capa.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div
                                                            className={`h-2.5 rounded-full transition-all ${capa.progress === 100 ? 'bg-green-500' : capa.status === 'overdue' ? 'bg-red-500' : 'bg-blue-600'}`}
                                                            style={{ width: `${capa.progress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Details Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-semibold">Owner</p>
                                                            <p className="text-sm font-medium text-gray-700">{capa.owner}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                                            <Target className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-semibold">Department</p>
                                                            <p className="text-sm font-medium text-gray-700">{capa.department}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-semibold">Due Date</p>
                                                            <p className={`text-sm font-medium ${capa.status === 'overdue' ? 'text-red-600' : 'text-gray-700'}`}>
                                                                {new Date(capa.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {capa.linkedNCR && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="p-1.5 bg-gray-50 rounded-md">
                                                                <Link2 className="w-4 h-4 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400 uppercase font-semibold">Linked NCR</p>
                                                                <Link href={`/quality/ncr`} className="text-sm font-medium text-blue-600 hover:underline">
                                                                    {capa.linkedNCR}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Root Cause (if available) */}
                                                {capa.rootCause && (
                                                    <div className="pt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                        <p className="text-xs font-semibold text-amber-700 uppercase mb-1">Root Cause</p>
                                                        <p className="text-sm text-gray-700">{capa.rootCause}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Sidebar */}
                                            <div className="flex lg:flex-col justify-end items-end gap-2 shrink-0 md:border-l border-gray-100 md:pl-6">
                                                <Link href={`/quality/capa/${capa.id}`} className="w-full">
                                                    <Button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-none shadow-none" size="sm">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-600">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
