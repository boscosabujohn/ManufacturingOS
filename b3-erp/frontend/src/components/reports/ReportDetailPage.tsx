import React from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';

interface ReportDetailPageProps {
    title: string;
    description?: string;
    breadcrumbs: Array<{ label: string; href?: string }>;
    children: React.ReactNode;
    onBack?: () => void;
    onExport?: () => void;
    filters?: React.ReactNode;
}

export function ReportDetailPage({
    title,
    description,
    breadcrumbs,
    children,
    onBack,
    onExport,
    filters,
}: ReportDetailPageProps) {
    return (
        <div className="w-full p-3">
            {/* Breadcrumb Navigation */}
            <div className="mb-3">
                <Breadcrumb items={breadcrumbs} />
            </div>

            {/* Page Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {onBack && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onBack}
                                className="h-8 w-8"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <h1 className="text-3xl font-bold">{title}</h1>
                    </div>
                    {description && (
                        <p className="text-gray-600">{description}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {onExport && (
                        <Button variant="outline" onClick={onExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters */}
            {filters && (
                <div className="mb-3">
                    {filters}
                </div>
            )}

            {/* Content */}
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
}

export default ReportDetailPage;
