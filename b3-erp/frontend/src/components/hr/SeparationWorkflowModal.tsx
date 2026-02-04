'use client';

import { useState } from 'react';
import { X, CheckCircle, Clock, AlertCircle, User, FileText, Shield, DollarSign, Users, Package, Key, Calendar, ArrowRight, UserX } from 'lucide-react';

interface WorkflowStage {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'rejected';
  assignedTo: string;
  completedBy?: string;
  completedDate?: string;
  comments?: string;
  requiredDocuments?: string[];
  checklist?: { item: string; completed: boolean }[];
  action?: string;
}

interface SeparationWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  separationData: {
    id: string;
    employeeCode: string;
    employeeName: string;
    designation: string;
    department: string;
    separationType: string;
    reason: string;
    resignationDate: string;
    lastWorkingDay: string;
    noticePeriod: number;
  };
}

export function SeparationWorkflowModal({ isOpen, onClose, separationData }: SeparationWorkflowModalProps) {
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([
    {
      id: 'stage1',
      name: 'Resignation Submission',
      status: 'completed',
      assignedTo: separationData.employeeName,
      completedBy: separationData.employeeName,
      completedDate: separationData.resignationDate,
      comments: `Resignation submitted: ${separationData.reason}`,
      requiredDocuments: ['Resignation Letter'],
      action: 'Submit'
    },
    {
      id: 'stage2',
      name: 'Manager Acknowledgment',
      status: 'completed',
      assignedTo: 'Reporting Manager',
      completedBy: 'Department Manager',
      completedDate: new Date().toISOString().split('T')[0],
      comments: 'Resignation acknowledged and forwarded to HR',
      action: 'Acknowledge'
    },
    {
      id: 'stage3',
      name: 'HR Processing & Exit Interview',
      status: 'in_progress',
      assignedTo: 'HR Department',
      comments: 'Schedule and conduct exit interview',
      requiredDocuments: ['Exit Interview Form', 'Feedback Form', 'Notice Period Calculation'],
      checklist: [
        { item: 'Exit Interview Scheduled', completed: true },
        { item: 'Exit Interview Conducted', completed: false },
        { item: 'Notice Period Verified', completed: true },
        { item: 'Handover Plan Prepared', completed: false }
      ],
      action: 'Process'
    },
    {
      id: 'stage4',
      name: 'Knowledge Transfer & Handover',
      status: 'pending',
      assignedTo: separationData.employeeName,
      comments: 'Complete handover of responsibilities and documentation',
      requiredDocuments: ['Handover Document', 'Project Status Report', 'Access/Password List'],
      checklist: [
        { item: 'Project Handover Completed', completed: false },
        { item: 'Documentation Updated', completed: false },
        { item: 'Training Provided to Successor', completed: false }
      ],
      action: 'Handover'
    },
    {
      id: 'stage5',
      name: 'Asset Return',
      status: 'pending',
      assignedTo: 'IT/Admin Department',
      comments: 'Collect all company assets from employee',
      requiredDocuments: ['Asset Return Form', 'IT Clearance Form'],
      checklist: [
        { item: 'Laptop/Desktop Returned', completed: false },
        { item: 'Mobile Phone Returned', completed: false },
        { item: 'ID Card Returned', completed: false },
        { item: 'Access Cards Returned', completed: false },
        { item: 'Office Keys Returned', completed: false },
        { item: 'Other Equipment Returned', completed: false }
      ],
      action: 'Collect'
    },
    {
      id: 'stage6',
      name: 'System Access Revocation',
      status: 'pending',
      assignedTo: 'IT Department',
      comments: 'Revoke all system access and accounts',
      requiredDocuments: ['Access Revocation Form'],
      checklist: [
        { item: 'Email Account Disabled', completed: false },
        { item: 'ERP Access Removed', completed: false },
        { item: 'VPN Access Revoked', completed: false },
        { item: 'Database Access Removed', completed: false },
        { item: 'Cloud Storage Access Revoked', completed: false },
        { item: 'Building Access Disabled', completed: false }
      ],
      action: 'Revoke'
    },
    {
      id: 'stage7',
      name: 'Department Clearance',
      status: 'pending',
      assignedTo: 'All Departments',
      comments: 'Obtain clearance from all relevant departments',
      requiredDocuments: ['Department Clearance Form'],
      checklist: [
        { item: 'Finance Clearance', completed: false },
        { item: 'HR Clearance', completed: false },
        { item: 'IT Clearance', completed: false },
        { item: 'Admin Clearance', completed: false },
        { item: 'Library/Training Clearance', completed: false }
      ],
      action: 'Clear'
    },
    {
      id: 'stage8',
      name: 'Full & Final Settlement',
      status: 'pending',
      assignedTo: 'Finance Department',
      comments: 'Calculate and process final settlement',
      requiredDocuments: ['F&F Statement', 'Bank Details', 'Tax Documents', 'PF Withdrawal Form'],
      checklist: [
        { item: 'Salary Calculated', completed: false },
        { item: 'Leave Encashment Calculated', completed: false },
        { item: 'Gratuity Calculated', completed: false },
        { item: 'Bonus/Incentive Settled', completed: false },
        { item: 'Advance/Loan Recovery', completed: false },
        { item: 'Final Payment Processed', completed: false }
      ],
      action: 'Settle'
    },
    {
      id: 'stage9',
      name: 'Document Issuance',
      status: 'pending',
      assignedTo: 'HR Department',
      comments: 'Issue all exit documents to employee',
      requiredDocuments: ['Experience Certificate', 'Relieving Letter', 'Service Certificate', 'F&F Statement'],
      checklist: [
        { item: 'Experience Certificate Issued', completed: false },
        { item: 'Relieving Letter Issued', completed: false },
        { item: 'F&F Statement Shared', completed: false },
        { item: 'PF Transfer Documents', completed: false }
      ],
      action: 'Issue'
    },
    {
      id: 'stage10',
      name: 'Exit Formalities Completion',
      status: 'pending',
      assignedTo: 'HR Department',
      comments: 'Complete all exit formalities and close the separation process',
      checklist: [
        { item: 'All Clearances Verified', completed: false },
        { item: 'Employee Records Updated', completed: false },
        { item: 'Separation Marked Complete', completed: false },
        { item: 'Alumni Database Updated', completed: false }
      ],
      action: 'Complete'
    }
  ]);

  const [selectedStage, setSelectedStage] = useState<WorkflowStage | null>(null);
  const [actionComment, setActionComment] = useState('');

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const completedStages = workflowStages.filter(s => s.status === 'completed').length;
  const totalStages = workflowStages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  const handleStageAction = (stage: WorkflowStage, action: 'complete' | 'reject') => {
    const updatedStages = workflowStages.map(s => {
      if (s.id === stage.id) {
        return {
          ...s,
          status: action === 'complete' ? 'completed' : 'rejected',
          completedBy: 'Current User',
          completedDate: new Date().toISOString().split('T')[0],
          comments: actionComment || s.comments,
          checklist: s.checklist?.map(item => ({ ...item, completed: true }))
        } as WorkflowStage;
      }
      // Move next stage to in_progress if current stage is completed
      if (action === 'complete' && s.id === getNextStageId(stage.id)) {
        return { ...s, status: 'in_progress' as const };
      }
      return s;
    });

    setWorkflowStages(updatedStages);
    setSelectedStage(null);
    setActionComment('');
  };

  const getNextStageId = (currentId: string) => {
    const currentIndex = workflowStages.findIndex(s => s.id === currentId);
    return workflowStages[currentIndex + 1]?.id;
  };

  const getSeparationTypeColor = (type: string) => {
    switch (type) {
      case 'resignation':
        return 'text-blue-600';
      case 'retirement':
        return 'text-purple-600';
      case 'termination':
        return 'text-red-600';
      case 'contract_end':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-2 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <UserX className="w-6 h-6" />
                Employee Separation Workflow
              </h2>
              <div className="text-red-100 text-sm space-y-1">
                <p><strong>Separation ID:</strong> {separationData.id}</p>
                <p><strong>Employee:</strong> {separationData.employeeName} ({separationData.employeeCode})</p>
                <p><strong>Designation:</strong> {separationData.designation} - {separationData.department}</p>
                <p>
                  <strong>Type:</strong>
                  <span className={`ml-2 ${getSeparationTypeColor(separationData.separationType)}`}>
                    {separationData.separationType.toUpperCase().replace('_', ' ')}
                  </span>
                </p>
                <p><strong>Last Working Day:</strong> {new Date(separationData.lastWorkingDay).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p><strong>Notice Period:</strong> {separationData.noticePeriod} days</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Exit Process Progress: {completedStages} of {totalStages} stages completed</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div
                className="bg-green-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Workflow Timeline */}
          <div className="space-y-2">
            {workflowStages.map((stage, index) => (
              <div key={stage.id} className="relative">
                {/* Connector Line */}
                {index < workflowStages.length - 1 && (
                  <div className="absolute left-[19px] top-12 w-0.5 h-full bg-gray-300" />
                )}

                <div className={`border-2 rounded-lg p-3 ${getStatusColor(stage.status)} transition-all hover:shadow-md`}>
                  <div className="flex gap-2">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 relative z-10 bg-white rounded-full p-1">
                      {getStatusIcon(stage.status)}
                    </div>

                    {/* Stage Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            Step {index + 1}: {stage.name}
                            {stage.status === 'in_progress' && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full animate-pulse">
                                Current Stage
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <User className="w-4 h-4" />
                            Assigned to: <strong>{stage.assignedTo}</strong>
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(stage.status)}`}>
                          {stage.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* Stage Comments */}
                      {stage.comments && (
                        <div className="mb-3 bg-white/50 rounded p-3 text-sm text-gray-700">
                          <FileText className="w-4 h-4 inline mr-2 text-gray-500" />
                          {stage.comments}
                        </div>
                      )}

                      {/* Completion Details */}
                      {stage.status === 'completed' && stage.completedBy && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Completed by: <strong>{stage.completedBy}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {stage.completedDate && new Date(stage.completedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}

                      {/* Required Documents */}
                      {stage.requiredDocuments && stage.requiredDocuments.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Required Documents:</p>
                          <div className="flex flex-wrap gap-2">
                            {stage.requiredDocuments.map((doc, idx) => (
                              <span key={idx} className="text-xs bg-white px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                                📄 {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Checklist */}
                      {stage.checklist && stage.checklist.length > 0 && (
                        <div className="mb-3 bg-white/70 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Checklist:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {stage.checklist.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={item.completed}
                                  readOnly
                                  className="w-4 h-4 text-green-600"
                                />
                                <span className={item.completed ? 'text-green-700 line-through' : 'text-gray-700'}>
                                  {item.item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {stage.status === 'in_progress' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setSelectedStage(stage)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                          >
                            {stage.action || 'Complete'} Stage
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStage(stage);
                            }}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium transition-colors"
                          >
                            Mark Issue
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important Separation Guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All stages must be completed in sequence before final separation</li>
                  <li>Employee cannot leave until F&F settlement is processed</li>
                  <li>All company assets must be returned and verified</li>
                  <li>System access will be revoked on last working day</li>
                  <li>Experience certificate issued only after complete clearance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Modal */}
        {selectedStage && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-3 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-3">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {selectedStage.action || 'Complete'} Stage: {selectedStage.name}
              </h3>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments / Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  rows={4}
                  placeholder="Add completion notes, observations, or issues..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleStageAction(selectedStage, 'complete')}
                  disabled={!actionComment.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Complete Stage
                </button>
                <button
                  onClick={() => handleStageAction(selectedStage, 'reject')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Mark Issue
                </button>
                <button
                  onClick={() => {
                    setSelectedStage(null);
                    setActionComment('');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
