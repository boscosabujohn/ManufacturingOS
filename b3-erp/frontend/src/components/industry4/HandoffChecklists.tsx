'use client';

import React, { useState, useEffect } from 'react';

// Types
export type ShiftType = 'morning' | 'afternoon' | 'night';
export type HandoffStatus = 'pending' | 'in_progress' | 'completed' | 'acknowledged';
export type ItemPriority = 'critical' | 'high' | 'normal' | 'low';
export type ItemCategory = 'safety' | 'production' | 'quality' | 'maintenance' | 'inventory' | 'personnel';

export interface ChecklistItem {
  id: string;
  category: ItemCategory;
  description: string;
  priority: ItemPriority;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: Date;
  notes?: string;
  requiresAcknowledgment: boolean;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
}

export interface ActiveIssue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  area: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'open' | 'in_progress' | 'monitoring' | 'resolved';
  assignedTo?: string;
  estimatedResolution?: string;
}

export interface ProductionStatus {
  line: string;
  currentOrder: string;
  unitsCompleted: number;
  targetUnits: number;
  efficiency: number;
  status: 'running' | 'paused' | 'stopped' | 'changeover';
  notes?: string;
}

export interface ShiftHandoff {
  id: string;
  date: Date;
  outgoingShift: ShiftType;
  incomingShift: ShiftType;
  outgoingOperator: {
    id: string;
    name: string;
    avatar: string;
  };
  incomingOperator?: {
    id: string;
    name: string;
    avatar: string;
  };
  status: HandoffStatus;
  checklist: ChecklistItem[];
  activeIssues: ActiveIssue[];
  productionStatus: ProductionStatus[];
  generalNotes: string;
  startedAt?: Date;
  completedAt?: Date;
  acknowledgedAt?: Date;
}

interface HandoffChecklistsProps {
  className?: string;
}

// Mock data generators
const generateChecklist = (): ChecklistItem[] => [
  {
    id: 'cl1',
    category: 'safety',
    description: 'All safety equipment inspected and functional',
    priority: 'critical',
    isCompleted: true,
    completedBy: 'James Park',
    completedAt: new Date(Date.now() - 15 * 60 * 1000),
    requiresAcknowledgment: true,
    isAcknowledged: false
  },
  {
    id: 'cl2',
    category: 'safety',
    description: 'Emergency exits clear and accessible',
    priority: 'critical',
    isCompleted: true,
    completedBy: 'James Park',
    completedAt: new Date(Date.now() - 14 * 60 * 1000),
    requiresAcknowledgment: true,
    isAcknowledged: false
  },
  {
    id: 'cl3',
    category: 'production',
    description: 'Current work orders status documented',
    priority: 'high',
    isCompleted: true,
    completedBy: 'James Park',
    completedAt: new Date(Date.now() - 12 * 60 * 1000),
    requiresAcknowledgment: false,
    isAcknowledged: false
  },
  {
    id: 'cl4',
    category: 'production',
    description: 'Production targets and actual output recorded',
    priority: 'high',
    isCompleted: true,
    completedBy: 'James Park',
    completedAt: new Date(Date.now() - 10 * 60 * 1000),
    requiresAcknowledgment: false,
    isAcknowledged: false
  },
  {
    id: 'cl5',
    category: 'quality',
    description: 'Quality issues and NCRs reviewed',
    priority: 'high',
    isCompleted: true,
    completedBy: 'James Park',
    completedAt: new Date(Date.now() - 8 * 60 * 1000),
    notes: 'Minor defect rate on Line B - monitoring',
    requiresAcknowledgment: true,
    isAcknowledged: false
  },
  {
    id: 'cl6',
    category: 'maintenance',
    description: 'Equipment status and any ongoing maintenance',
    priority: 'normal',
    isCompleted: true,
    completedBy: 'James Park',
    completedAt: new Date(Date.now() - 6 * 60 * 1000),
    notes: 'CNC #3 scheduled for 2pm maintenance',
    requiresAcknowledgment: true,
    isAcknowledged: false
  },
  {
    id: 'cl7',
    category: 'inventory',
    description: 'Critical material levels verified',
    priority: 'normal',
    isCompleted: false,
    requiresAcknowledgment: false,
    isAcknowledged: false
  },
  {
    id: 'cl8',
    category: 'personnel',
    description: 'Team attendance and any absences noted',
    priority: 'normal',
    isCompleted: false,
    requiresAcknowledgment: false,
    isAcknowledged: false
  }
];

const generateActiveIssues = (): ActiveIssue[] => [
  {
    id: 'ai1',
    title: 'CNC Machine #3 Vibration',
    description: 'Unusual vibration detected during operation. Scheduled for preventive maintenance.',
    severity: 'major',
    area: 'CNC Department',
    reportedBy: 'David Kim',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'in_progress',
    assignedTo: 'Maintenance Team',
    estimatedResolution: '2:00 PM today'
  },
  {
    id: 'ai2',
    title: 'Material Shortage - Aluminum 6061',
    description: 'Running low on aluminum stock. Emergency order placed.',
    severity: 'minor',
    area: 'Supply Chain',
    reportedBy: 'Emily Watson',
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'monitoring',
    assignedTo: 'Supply Chain Team',
    estimatedResolution: 'Delivery expected tomorrow AM'
  }
];

const generateProductionStatus = (): ProductionStatus[] => [
  {
    line: 'Assembly Line A',
    currentOrder: 'WO-2024-1547',
    unitsCompleted: 450,
    targetUnits: 600,
    efficiency: 94,
    status: 'running',
    notes: 'On track for completion by EOD'
  },
  {
    line: 'Assembly Line B',
    currentOrder: 'WO-2024-1548',
    unitsCompleted: 280,
    targetUnits: 400,
    efficiency: 87,
    status: 'running',
    notes: 'Slight delay due to component issue - resolved'
  },
  {
    line: 'CNC Department',
    currentOrder: 'WO-2024-1542',
    unitsCompleted: 75,
    targetUnits: 100,
    efficiency: 91,
    status: 'paused',
    notes: 'Paused for scheduled maintenance on Machine #3'
  }
];

const generateCurrentHandoff = (): ShiftHandoff => ({
  id: 'hf1',
  date: new Date(),
  outgoingShift: 'morning',
  incomingShift: 'afternoon',
  outgoingOperator: {
    id: 'u4',
    name: 'James Park',
    avatar: 'JP'
  },
  incomingOperator: {
    id: 'u8',
    name: 'Robert Chen',
    avatar: 'RC'
  },
  status: 'in_progress',
  checklist: generateChecklist(),
  activeIssues: generateActiveIssues(),
  productionStatus: generateProductionStatus(),
  generalNotes: 'Busy shift with good output. Watch CNC #3 after maintenance. New safety briefing scheduled for tomorrow morning.',
  startedAt: new Date(Date.now() - 20 * 60 * 1000)
});

const HandoffChecklists: React.FC<HandoffChecklistsProps> = ({ className = '' }) => {
  const [handoff, setHandoff] = useState<ShiftHandoff | null>(null);
  const [activeTab, setActiveTab] = useState<'checklist' | 'issues' | 'production' | 'notes'>('checklist');
  const [expandedCategories, setExpandedCategories] = useState<Set<ItemCategory>>(new Set(['safety', 'production', 'quality', 'maintenance']));

  useEffect(() => {
    setHandoff(generateCurrentHandoff());
  }, []);

  const getShiftLabel = (shift: ShiftType): string => {
    switch (shift) {
      case 'morning': return 'Morning (6AM - 2PM)';
      case 'afternoon': return 'Afternoon (2PM - 10PM)';
      case 'night': return 'Night (10PM - 6AM)';
    }
  };

  const getPriorityColor = (priority: ItemPriority): string => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'normal': return '#3b82f6';
      case 'low': return '#22c55e';
    }
  };

  const getCategoryIcon = (category: ItemCategory): string => {
    switch (category) {
      case 'safety': return '🦺';
      case 'production': return '🏭';
      case 'quality': return '✓';
      case 'maintenance': return '🔧';
      case 'inventory': return '📦';
      case 'personnel': return '👥';
    }
  };

  const getSeverityColor = (severity: ActiveIssue['severity']): string => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'major': return '#f59e0b';
      case 'minor': return '#3b82f6';
    }
  };

  const getStatusColor = (status: ProductionStatus['status']): string => {
    switch (status) {
      case 'running': return '#22c55e';
      case 'paused': return '#f59e0b';
      case 'stopped': return '#dc2626';
      case 'changeover': return '#8b5cf6';
    }
  };

  const toggleCategory = (category: ItemCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleItemComplete = (itemId: string) => {
    if (!handoff) return;
    setHandoff({
      ...handoff,
      checklist: handoff.checklist.map(item =>
        item.id === itemId
          ? { ...item, isCompleted: !item.isCompleted, completedBy: 'You', completedAt: new Date() }
          : item
      )
    });
  };

  const handleItemAcknowledge = (itemId: string) => {
    if (!handoff) return;
    setHandoff({
      ...handoff,
      checklist: handoff.checklist.map(item =>
        item.id === itemId
          ? { ...item, isAcknowledged: true, acknowledgedBy: 'You' }
          : item
      )
    });
  };

  if (!handoff) return null;

  const completedItems = handoff.checklist.filter(i => i.isCompleted).length;
  const totalItems = handoff.checklist.length;
  const requiresAck = handoff.checklist.filter(i => i.requiresAcknowledgment && !i.isAcknowledged).length;

  const groupedChecklist = handoff.checklist.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<ItemCategory, ChecklistItem[]>);

  const renderChecklist = () => (
    <div className="space-y-4">
      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Handoff Progress</span>
          <span className="text-sm font-bold text-blue-600">{completedItems}/{totalItems} items</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${(completedItems / totalItems) * 100}%` }}
          ></div>
        </div>
        {requiresAck > 0 && (
          <div className="mt-2 flex items-center gap-2 text-amber-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">{requiresAck} items require acknowledgment</span>
          </div>
        )}
      </div>

      {/* Categorized Checklist */}
      {(Object.entries(groupedChecklist) as [ItemCategory, ChecklistItem[]][]).map(([category, items]) => (
        <div key={category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleCategory(category)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <span className="font-medium text-gray-800 capitalize">{category}</span>
              <span className="text-xs text-gray-500">
                ({items.filter(i => i.isCompleted).length}/{items.length})
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategories.has(category) ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedCategories.has(category) && (
            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleItemComplete(item.id)}
                      className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        item.isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {item.isCompleted && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${item.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}
                        >
                          {item.description}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getPriorityColor(item.priority) }}
                        >
                          {item.priority}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded">
                          📝 {item.notes}
                        </p>
                      )}

                      {item.isCompleted && (
                        <p className="text-xs text-gray-400 mt-1">
                          Completed by {item.completedBy} at {item.completedAt?.toLocaleTimeString()}
                        </p>
                      )}

                      {item.requiresAcknowledgment && item.isCompleted && !item.isAcknowledged && (
                        <button
                          onClick={() => handleItemAcknowledge(item.id)}
                          className="mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded hover:bg-amber-200 transition-colors"
                        >
                          ✓ Acknowledge
                        </button>
                      )}

                      {item.isAcknowledged && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Acknowledged by {item.acknowledgedBy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderIssues = () => (
    <div className="space-y-4">
      {handoff.activeIssues.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="font-medium text-gray-800">No Active Issues</h3>
          <p className="text-sm text-gray-500">All systems operating normally</p>
        </div>
      ) : (
        handoff.activeIssues.map(issue => (
          <div
            key={issue.id}
            className="bg-white border border-gray-200 rounded-lg p-4 border-l-4"
            style={{ borderLeftColor: getSeverityColor(issue.severity) }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">{issue.title}</h4>
                <p className="text-xs text-gray-500">{issue.area}</p>
              </div>
              <div className="flex gap-2">
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getSeverityColor(issue.severity) }}
                >
                  {issue.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  issue.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {issue.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{issue.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Reported by:</span>
                <span className="ml-2 font-medium">{issue.reportedBy}</span>
              </div>
              <div>
                <span className="text-gray-500">Assigned to:</span>
                <span className="ml-2 font-medium">{issue.assignedTo || 'Unassigned'}</span>
              </div>
              {issue.estimatedResolution && (
                <div className="col-span-2">
                  <span className="text-gray-500">Est. Resolution:</span>
                  <span className="ml-2 font-medium text-blue-600">{issue.estimatedResolution}</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderProduction = () => (
    <div className="space-y-4">
      {handoff.productionStatus.map(line => (
        <div key={line.line} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-800">{line.line}</h4>
              <p className="text-xs text-gray-500">Order: {line.currentOrder}</p>
            </div>
            <span
              className="px-2 py-1 rounded text-xs font-medium text-white capitalize"
              style={{ backgroundColor: getStatusColor(line.status) }}
            >
              {line.status}
            </span>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{line.unitsCompleted} / {line.targetUnits} units</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(line.unitsCompleted / line.targetUnits) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Efficiency:</span>
              <span className={`font-bold ${line.efficiency >= 90 ? 'text-green-600' : line.efficiency >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                {line.efficiency}%
              </span>
            </div>
          </div>

          {line.notes && (
            <p className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              📝 {line.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">General Notes from Outgoing Shift</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{handoff.generalNotes}</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          From {handoff.outgoingOperator.name} • {handoff.startedAt?.toLocaleTimeString()}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Add Notes for Incoming Shift</h4>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Add any additional notes or observations..."
        ></textarea>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          Save Notes
        </button>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Shift Handoff</h2>
          <p className="text-sm text-gray-600">Digital shift handover interface</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            handoff.status === 'completed' ? 'bg-green-100 text-green-700' :
            handoff.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {handoff.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Shift Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium mb-1">
                {handoff.outgoingOperator.avatar}
              </div>
              <div className="text-xs text-gray-500">Outgoing</div>
              <div className="text-sm font-medium">{handoff.outgoingOperator.name}</div>
            </div>
            <div className="text-center px-4">
              <div className="text-xs text-gray-500">{getShiftLabel(handoff.outgoingShift)}</div>
              <div className="text-2xl">→</div>
              <div className="text-xs text-gray-500">{getShiftLabel(handoff.incomingShift)}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-medium mb-1">
                {handoff.incomingOperator?.avatar || '?'}
              </div>
              <div className="text-xs text-gray-500">Incoming</div>
              <div className="text-sm font-medium">{handoff.incomingOperator?.name || 'Awaiting'}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Handoff Date</div>
            <div className="font-medium">{handoff.date.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['checklist', 'issues', 'production', 'notes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab === 'checklist' && '✓ Checklist'}
            {tab === 'issues' && `⚠️ Issues (${handoff.activeIssues.length})`}
            {tab === 'production' && '📊 Production'}
            {tab === 'notes' && '📝 Notes'}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'checklist' && renderChecklist()}
      {activeTab === 'issues' && renderIssues()}
      {activeTab === 'production' && renderProduction()}
      {activeTab === 'notes' && renderNotes()}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Save Draft
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          disabled={completedItems < totalItems}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Complete Handoff
        </button>
      </div>
    </div>
  );
};

export default HandoffChecklists;
