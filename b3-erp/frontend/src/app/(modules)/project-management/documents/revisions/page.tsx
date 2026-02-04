'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  GitCompare,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Calendar,
  User,
  MessageSquare,
  Upload,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DrawingRevision {
  id: string;
  documentNumber: string;
  documentName: string;
  version: string;
  revisionDate: string;
  revisedBy: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Superseded';
  changeDescription: string;
  changesCount: number;
  reviewedBy?: string;
  approvedDate?: string;
  previousVersion?: string;
}

const mockRevisions: DrawingRevision[] = [
  {
    id: '1',
    documentNumber: 'D-2025-001',
    documentName: 'Equipment Layout Drawing',
    version: '3.0',
    revisionDate: '2025-01-20',
    revisedBy: 'Design Team',
    status: 'Approved',
    changeDescription: 'Updated kitchen equipment positions based on site measurements. Adjusted spacing for exhaust hoods.',
    changesCount: 8,
    reviewedBy: 'Project Manager',
    approvedDate: '2025-01-21',
    previousVersion: '2.0',
  },
  {
    id: '2',
    documentNumber: 'D-2025-001',
    documentName: 'Equipment Layout Drawing',
    version: '2.0',
    revisionDate: '2025-01-15',
    revisedBy: 'Design Team',
    status: 'Superseded',
    changeDescription: 'Added MEP connection points and updated dimensions per client comments.',
    changesCount: 5,
    reviewedBy: 'Project Manager',
    approvedDate: '2025-01-16',
    previousVersion: '1.0',
  },
  {
    id: '3',
    documentNumber: 'D-2025-002',
    documentName: 'Electrical SLD',
    version: '2.0',
    revisionDate: '2025-01-19',
    revisedBy: 'Electrical Engineer',
    status: 'Under Review',
    changeDescription: 'Revised power distribution based on updated load calculations. Added backup circuits.',
    changesCount: 12,
    previousVersion: '1.0',
  },
  {
    id: '4',
    documentNumber: 'D-2025-005',
    documentName: 'Plumbing Layout',
    version: '2.0',
    revisionDate: '2025-01-22',
    revisedBy: 'Plumbing Designer',
    status: 'Draft',
    changeDescription: 'Modified drainage lines to avoid structural conflicts. Updated hot water circulation.',
    changesCount: 6,
    previousVersion: '1.0',
  },
];

export default function DrawingRevisionsPage() {
  const { toast } = useToast();
  const [revisions] = useState<DrawingRevision[]>(mockRevisions);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRevision, setSelectedRevision] = useState<DrawingRevision | null>(null);

  const filteredRevisions = revisions.filter(
    (r) => statusFilter === 'All' || r.status === statusFilter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Superseded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Under Review':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const stats = {
    total: revisions.length,
    draft: revisions.filter((r) => r.status === 'Draft').length,
    underReview: revisions.filter((r) => r.status === 'Under Review').length,
    approved: revisions.filter((r) => r.status === 'Approved').length,
    superseded: revisions.filter((r) => r.status === 'Superseded').length,
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden bg-gray-50">
      <div className="px-3 py-2 space-y-3">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/project-management/documents"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Drawing Revisions & Version Control
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Phase 2: Track and compare drawing revisions based on site feedback
                </p>
              </div>
            </div>
            <button
              onClick={() => toast({ title: "Upload Revision", description: "Upload modal would open here" })}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Revision
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revisions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Superseded</p>
                <p className="text-2xl font-bold text-red-600">{stats.superseded}</p>
              </div>
              <FileText className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Superseded">Superseded</option>
            </select>
          </div>
        </div>

        {/* Revisions List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Drawing Revisions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredRevisions.map((revision) => (
              <div key={revision.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(revision.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {revision.documentName} - v{revision.version}
                        </h3>
                        <p className="text-sm text-gray-600">{revision.documentNumber}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-blue-900 mb-1">
                            Revision Description:
                          </p>
                          <p className="text-sm text-blue-700">{revision.changeDescription}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Revision Date</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {revision.revisionDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Revised By</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {revision.revisedBy}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Changes Count</p>
                        <p className="font-medium text-gray-900">
                          {revision.changesCount} modifications
                        </p>
                      </div>
                      {revision.previousVersion && (
                        <div>
                          <p className="text-xs text-gray-500">Previous Version</p>
                          <p className="font-medium text-gray-900">v{revision.previousVersion}</p>
                        </div>
                      )}
                    </div>

                    {revision.reviewedBy && (
                      <div className="mt-3 text-sm">
                        <p className="text-gray-600">
                          Reviewed by <span className="font-medium">{revision.reviewedBy}</span>
                          {revision.approvedDate && (
                            <> on {revision.approvedDate}</>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col items-end gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(revision.status)}`}
                    >
                      {revision.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Drawing"
                        onClick={() => toast({ title: "View Drawing", description: `Viewing ${revision.documentName} v${revision.version}` })}
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {revision.previousVersion && (
                        <button
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                          title="Compare Versions"
                          onClick={() => setSelectedRevision(revision)}
                        >
                          <GitCompare className="w-4 h-4" />
                          Compare
                        </button>
                      )}
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download"
                        onClick={() => toast({ title: "Download Started", description: `Downloading ${revision.documentName}...` })}
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Modal (when selectedRevision is set) */}
        {selectedRevision && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-3  w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Version Comparison</h2>
                <button
                  onClick={() => setSelectedRevision(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">
                    Previous Version (v{selectedRevision.previousVersion})
                  </h3>
                  <p className="text-xs text-red-700">Original design before site feedback</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-green-900 mb-2">
                    Current Version (v{selectedRevision.version})
                  </h3>
                  <p className="text-xs text-green-700">{selectedRevision.changeDescription}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  {selectedRevision.changesCount} Changes Identified
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span className="text-blue-700">Equipment positions adjusted based on actual site dimensions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span className="text-blue-700">MEP connection points updated per site survey</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span className="text-blue-700">Safety clearances modified to meet local codes</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedRevision(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toast({ title: "Revision Approved", description: "Status updated to Approved" });
                    setSelectedRevision(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Approve Revision
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">About Drawing Revisions</h3>
              <p className="text-sm text-blue-700 mt-1">
                Step 2.6: Track all drawing revisions made based on site measurements and client
                feedback. Compare versions to review changes before approval. Maintains complete
                revision history with change descriptions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
