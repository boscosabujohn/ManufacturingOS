'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Plus,
    AlertTriangle,
    Clock,
    XCircle,
    CheckCircle,
    Filter,
    Search,
    ChevronRight,
    MoreHorizontal,
    FileText,
    User,
    Calendar,
    MapPin,
    Tag,
    AlertCircle,
    Eye,
    Download,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { NCRService, NCR as ServiceNCR, NCRStatus, NCRSeverity, NCRPriority } from '@/services/ncr.service';

interface NCR {
    id: string;
    ncrNumber: string;
    title: string;
    source: string;
    severity: 'critical' | 'major' | 'minor';
    priority: 'high' | 'medium' | 'low';
    status: 'open' | 'in-progress' | 'closed';
    reportedBy: string;
    reportedDate: string;
    assignedTo?: string;
    description: string;
    project: string;
    location: string;
    category: string;
}

// NCR data is now fetched from NCRService

export default function NCRPage() {
    const [ncrs, setNcrs] = useState<NCR[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');

    // Transform service NCR to page format
    const transformNCR = (ncr: ServiceNCR): NCR => {
        // Map severity
        const severityMap: Record<string, NCR['severity']> = {
            'critical': 'critical',
            'major': 'major',
            'minor': 'minor',
        };

        // Map priority
        const priorityMap: Record<string, NCR['priority']> = {
            'high': 'high',
            'medium': 'medium',
            'low': 'low',
        };

        // Map status - normalize the various statuses
        let status: NCR['status'] = 'open';
        if (ncr.status === NCRStatus.CLOSED) {
            status = 'closed';
        } else if (
            ncr.status === NCRStatus.CONTAINMENT ||
            ncr.status === NCRStatus.ROOT_CAUSE ||
            ncr.status === NCRStatus.DISPOSITION ||
            ncr.status === NCRStatus.CAPA_IN_PROGRESS ||
            ncr.status === NCRStatus.VERIFICATION
        ) {
            status = 'in-progress';
        }

        return {
            id: ncr.id,
            ncrNumber: ncr.ncrNumber,
            title: ncr.title,
            source: ncr.sourceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            severity: severityMap[ncr.severity] || 'minor',
            priority: priorityMap[ncr.priority] || 'medium',
            status: status,
            reportedBy: ncr.discoveredByName,
            reportedDate: new Date(ncr.reportedDate).toISOString(),
            assignedTo: ncr.containmentActions[0]?.assignedToName,
            description: ncr.description,
            project: ncr.productName,
            location: ncr.discoveredLocation,
            category: ncr.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        };
    };

    const fetchNCRs = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await NCRService.getAllNCRs();
            const transformedData = data.map(transformNCR);
            setNcrs(transformedData);
        } catch (err) {
            console.error('Failed to fetch NCRs:', err);
            setError('Failed to load NCRs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNCRs();
    }, []);

    const filteredNCRs = useMemo(() => {
        return ncrs.filter(n => {
            const matchesStatus = filter === 'all' || n.status === filter;
            const matchesSeverity = severityFilter === 'all' || n.severity === severityFilter;
            const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.ncrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.project.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSeverity && matchesSearch;
        });
    }, [ncrs, filter, severityFilter, searchTerm]);

    const stats = {
        total: ncrs.length,
        open: ncrs.filter(n => n.status === 'open').length,
        inProgress: ncrs.filter(n => n.status === 'in-progress').length,
        closed: ncrs.filter(n => n.status === 'closed').length,
    };

    const getSeverityBadge = (severity: string) => {
        const config: any = {
            critical: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
            major: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle },
            minor: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
        };
        const { color, icon: Icon } = config[severity] || config.minor;
        return (
            <Badge variant="outline" className={`${color} font-semibold capitalize`}>
                <Icon className="mr-1 h-3 w-3" />
                {severity}
            </Badge>
        );
    };

    const getStatusBadge = (status: string) => {
        const config: any = {
            open: 'bg-red-50 text-red-600 border-red-200',
            'in-progress': 'bg-blue-50 text-blue-600 border-blue-200',
            closed: 'bg-green-50 text-green-600 border-green-200',
        };
        return (
            <Badge variant="outline" className={`${config[status] || 'bg-gray-50'} font-medium capitalize`}>
                {status.replace('-', ' ')}
            </Badge>
        );
    };

    return (
        <div className="w-full px-4 py-6 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Non-Conformance Reports</h1>
                    <p className="text-gray-500 mt-1">Manage and track quality deviations and corrective actions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="hidden sm:flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Link href="/quality/ncr/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Report NCR
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total NCRs</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600">Open Issues</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.open}</h3>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">In Progress</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.inProgress}</h3>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Resolved</p>
                            <h3 className="text-2xl font-bold mt-1">{stats.closed}</h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
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
                                placeholder="Search by NCR #, title, or project..."
                                className="pl-10 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {['all', 'open', 'in-progress', 'closed'].map((status) => (
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
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                            >
                                <option value="all">Any Severity</option>
                                <option value="critical">Critical</option>
                                <option value="major">Major</option>
                                <option value="minor">Minor</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* NCR List */}
            <div className="flex flex-col gap-4">
                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-4">
                            <p className="text-red-600">{error}</p>
                            <Button
                                variant="link"
                                onClick={fetchNCRs}
                                className="text-red-700 p-0 h-auto mt-1"
                            >
                                Try again
                            </Button>
                        </CardContent>
                    </Card>
                )}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        <span className="ml-3 text-gray-600">Loading NCRs...</span>
                    </div>
                ) : filteredNCRs.length === 0 ? (
                    <Card className="border-dashed border-2 py-20 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No NCRs match your criteria</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                        <Button variant="outline" className="mt-6" onClick={() => { setFilter('all'); setSeverityFilter('all'); setSearchTerm(''); }}>
                            Clear All Filters
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredNCRs.map((ncr) => (
                            <Card key={ncr.id} className="group hover:border-blue-400 transition-all duration-200 shadow-sm overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    {/* Left highlight bar based on severity */}
                                    <div className={`w-1 md:w-2 ${ncr.severity === 'critical' ? 'bg-red-500' : ncr.severity === 'major' ? 'bg-orange-500' : 'bg-yellow-500'}`} />

                                    <CardContent className="p-6 flex-1">
                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                {/* Header info */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-bold text-blue-600">{ncr.ncrNumber}</span>
                                                    <span className="text-gray-300">•</span>
                                                    {getSeverityBadge(ncr.severity)}
                                                    {getStatusBadge(ncr.status)}
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs text-gray-500 flex items-center">
                                                        <Tag className="w-3 h-3 mr-1" />
                                                        {ncr.category}
                                                    </span>
                                                </div>

                                                {/* Title and Description */}
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{ncr.title}</h3>
                                                    <p className="text-gray-600 mt-2 line-clamp-2">{ncr.description}</p>
                                                </div>

                                                {/* Details Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-semibold">Location</p>
                                                            <p className="text-sm font-medium text-gray-700">{ncr.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                                            <FileText className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-semibold">Project</p>
                                                            <p className="text-sm font-medium text-gray-700">{ncr.project}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                                            <User className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-semibold">Assigned To</p>
                                                            <p className="text-sm font-medium text-gray-700">{ncr.assignedTo || 'Pending'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-1.5 bg-gray-50 rounded-md">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 uppercase font-semibold">Reported Date</p>
                                                            <p className="text-sm font-medium text-gray-700">{new Date(ncr.reportedDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Sidebar */}
                                            <div className="flex lg:flex-col justify-end items-end gap-2 shrink-0 md:border-l border-gray-100 md:pl-6">
                                                <Link href={`/quality/ncr/${ncr.id}`} className="w-full">
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
