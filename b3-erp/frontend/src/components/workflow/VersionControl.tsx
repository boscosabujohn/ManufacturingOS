'use client'

import { useState } from 'react'
import { GitBranch, Clock, User, CheckCircle, ArrowRight, RotateCcw, Eye, GitCommit } from 'lucide-react'

export interface WorkflowVersion {
  version: string;
  workflowId: string;
  workflowName: string;
  createdBy: string;
  createdAt: string;
  changeDescription: string;
  nodeCount: number;
  status: 'draft' | 'active' | 'deprecated';
  deployedAt?: string;
  rollbackAvailable: boolean;
  changelog: ChangelogEntry[];
}

export interface ChangelogEntry {
  id: string;
  type: 'added' | 'modified' | 'removed';
  component: string;
  description: string;
  impact?: 'breaking' | 'non-breaking';
}

export default function VersionControl() {
  const [versions] = useState<WorkflowVersion[]>([
    {
      version: 'v3.2.0',
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      createdBy: 'john.doe@company.com',
      createdAt: '2025-01-24 10:30:00',
      changeDescription: 'Added parallel approval paths for finance and operations teams',
      nodeCount: 12,
      status: 'active',
      deployedAt: '2025-01-24 11:00:00',
      rollbackAvailable: true,
      changelog: [
        {
          id: 'CH1',
          type: 'added',
          component: 'Approval Node',
          description: 'Added parallel finance approval for orders > ₹5L',
          impact: 'non-breaking'
        },
        {
          id: 'CH2',
          type: 'added',
          component: 'Condition Node',
          description: 'Added condition to check department budget availability',
          impact: 'non-breaking'
        },
        {
          id: 'CH3',
          type: 'modified',
          component: 'Notification Action',
          description: 'Updated email template with new approval hierarchy',
          impact: 'non-breaking'
        }
      ]
    },
    {
      version: 'v3.1.0',
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      createdBy: 'sarah.wilson@company.com',
      createdAt: '2025-01-20 14:15:00',
      changeDescription: 'Fixed timeout issue in approval notification step',
      nodeCount: 10,
      status: 'deprecated',
      deployedAt: '2025-01-20 14:45:00',
      rollbackAvailable: true,
      changelog: [
        {
          id: 'CH4',
          type: 'modified',
          component: 'Action Node',
          description: 'Increased email timeout from 10s to 30s',
          impact: 'non-breaking'
        },
        {
          id: 'CH5',
          type: 'added',
          component: 'Error Handler',
          description: 'Added retry logic for email failures (3 attempts)',
          impact: 'non-breaking'
        }
      ]
    },
    {
      version: 'v3.0.0',
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      createdBy: 'admin@company.com',
      createdAt: '2025-01-15 09:00:00',
      changeDescription: 'Major refactor: Simplified approval logic and removed legacy conditions',
      nodeCount: 9,
      status: 'deprecated',
      deployedAt: '2025-01-15 10:00:00',
      rollbackAvailable: true,
      changelog: [
        {
          id: 'CH6',
          type: 'removed',
          component: 'Condition Node',
          description: 'Removed legacy supplier type condition',
          impact: 'breaking'
        },
        {
          id: 'CH7',
          type: 'modified',
          component: 'Approval Logic',
          description: 'Simplified approval threshold calculation',
          impact: 'breaking'
        },
        {
          id: 'CH8',
          type: 'added',
          component: 'Integration',
          description: 'Added ERP integration for real-time budget checks',
          impact: 'non-breaking'
        }
      ]
    },
    {
      version: 'v2.5.1',
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      createdBy: 'jane.smith@company.com',
      createdAt: '2025-01-10 16:30:00',
      changeDescription: 'Hotfix: Corrected approval amount comparison logic',
      nodeCount: 11,
      status: 'deprecated',
      deployedAt: '2025-01-10 17:00:00',
      rollbackAvailable: false,
      changelog: [
        {
          id: 'CH9',
          type: 'modified',
          component: 'Condition Node',
          description: 'Fixed amount comparison (was using string comparison instead of numeric)',
          impact: 'non-breaking'
        }
      ]
    },
    {
      version: 'v4.0.0-beta',
      workflowId: 'WF-001',
      workflowName: 'Purchase Order Approval Flow',
      createdBy: 'john.doe@company.com',
      createdAt: '2025-01-25 09:00:00',
      changeDescription: 'Beta: AI-powered approval routing based on historical data',
      nodeCount: 15,
      status: 'draft',
      rollbackAvailable: false,
      changelog: [
        {
          id: 'CH10',
          type: 'added',
          component: 'AI Node',
          description: 'Added ML model to predict approval likelihood',
          impact: 'non-breaking'
        },
        {
          id: 'CH11',
          type: 'added',
          component: 'Data Collection',
          description: 'Added analytics tracking for approval patterns',
          impact: 'non-breaking'
        }
      ]
    }
  ]);

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      deprecated: 'bg-gray-100 text-gray-700',
      draft: 'bg-blue-100 text-blue-700'
    };
    return colors[status as keyof typeof colors];
  };

  const getChangeTypeColor = (type: string) => {
    const colors = {
      added: 'bg-green-50 text-green-700 border-green-300',
      modified: 'bg-blue-50 text-blue-700 border-blue-300',
      removed: 'bg-red-50 text-red-700 border-red-300'
    };
    return colors[type as keyof typeof colors];
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'modified':
        return <GitCommit className="h-4 w-4 text-blue-600" />;
      case 'removed':
        return <RotateCcw className="h-4 w-4 text-red-600" />;
    }
  };

  const activeVersion = versions.find(v => v.status === 'active');

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <GitBranch className="h-8 w-8 text-blue-600" />
              Version Control System
            </h2>
            <p className="text-gray-600 mt-1">Track changes, compare versions, and rollback workflows</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-4 py-2 rounded-lg ${
                compareMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Compare Mode
            </button>
          </div>
        </div>

        {activeVersion && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Currently Active: {activeVersion.version}
                  </div>
                  <div className="text-sm text-gray-600">
                    Deployed {activeVersion.deployedAt} by {activeVersion.createdBy}
                  </div>
                </div>
              </div>
              <div className="text-sm text-green-700 font-medium">
                {activeVersion.nodeCount} nodes
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Version Timeline */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>

        <div className="space-y-4">
          {versions.map((version, idx) => (
            <div key={version.version} className="relative">
              {/* Timeline connector */}
              {idx < versions.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-300" />
              )}

              <div
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedVersion === version.version
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${compareMode ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (compareMode) {
                    setCompareVersions(prev => {
                      if (prev.includes(version.version)) {
                        return prev.filter(v => v !== version.version);
                      } else if (prev.length < 2) {
                        return [...prev, version.version];
                      }
                      return prev;
                    });
                  } else {
                    setSelectedVersion(selectedVersion === version.version ? null : version.version);
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    version.status === 'active' ? 'bg-green-500' :
                    version.status === 'draft' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`}>
                    <GitBranch className="h-5 w-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-gray-900">{version.version}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(version.status)}`}>
                          {version.status.toUpperCase()}
                        </span>
                        {compareMode && compareVersions.includes(version.version) && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{version.nodeCount} nodes</div>
                    </div>

                    <p className="text-gray-900 mb-2">{version.changeDescription}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {version.createdBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {version.createdAt}
                      </div>
                      {version.deployedAt && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Deployed {version.deployedAt}
                        </div>
                      )}
                    </div>

                    {selectedVersion === version.version && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-3">Changelog:</div>
                        <div className="space-y-2">
                          {version.changelog.map((change) => (
                            <div key={change.id} className={`p-3 rounded border ${getChangeTypeColor(change.type)}`}>
                              <div className="flex items-start gap-2">
                                {getChangeTypeIcon(change.type)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{change.component}</span>
                                    <span className="text-xs uppercase font-bold">{change.type}</span>
                                    {change.impact && (
                                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                        change.impact === 'breaking' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                      }`}>
                                        {change.impact === 'breaking' ? 'BREAKING' : 'SAFE'}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm">{change.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVersion(selectedVersion === version.version ? null : version.version);
                        }}
                        className="px-3 py-1 text-blue-700 hover:bg-blue-100 rounded text-sm flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      {version.status !== 'active' && version.status !== 'draft' && version.rollbackAvailable && (
                        <button className="px-3 py-1 text-orange-700 hover:bg-orange-100 rounded text-sm flex items-center gap-1">
                          <RotateCcw className="h-4 w-4" />
                          Rollback
                        </button>
                      )}
                      {version.status === 'draft' && (
                        <button className="px-3 py-1 text-green-700 hover:bg-green-100 rounded text-sm flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Deploy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare View */}
      {compareMode && compareVersions.length === 2 && (
        <div className="bg-white shadow-lg border border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-blue-600" />
            Comparing Versions
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {compareVersions.map((versionId) => {
              const version = versions.find(v => v.version === versionId);
              if (!version) return null;

              return (
                <div key={versionId} className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="font-bold text-lg text-gray-900 mb-2">{version.version}</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Created: {version.createdAt}</div>
                      <div>Nodes: {version.nodeCount}</div>
                      <div>Status: <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(version.status)}`}>
                        {version.status}
                      </span></div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Changes:</div>
                    <div className="space-y-2">
                      {version.changelog.map((change) => (
                        <div key={change.id} className={`p-2 rounded text-xs border ${getChangeTypeColor(change.type)}`}>
                          <div className="font-medium mb-1">{change.component}</div>
                          <div>{change.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setCompareMode(false);
              setCompareVersions([]);
            }}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Close Comparison
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">{versions.length}</div>
          <div className="text-sm text-gray-600">Total Versions</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {versions.filter(v => v.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {versions.filter(v => v.status === 'draft').length}
          </div>
          <div className="text-sm text-gray-600">In Development</div>
        </div>
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {versions.filter(v => v.rollbackAvailable).length}
          </div>
          <div className="text-sm text-gray-600">Rollback Available</div>
        </div>
      </div>
    </div>
  );
}
