'use client';

import { useState } from 'react';
import { X, CheckCircle, Clock, AlertCircle, User, FileText, Shield, DollarSign, Users, Award, Calendar, ArrowRight } from 'lucide-react';

interface WorkflowStage {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending' | 'rejected';
  assignedTo: string;
  completedBy?: string;
  completedDate?: string;
  comments?: string;
  requiredDocuments?: string[];
  action?: string;
}

interface TransferPromotionWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: {
    id: string;
    employeeCode: string;
    employeeName: string;
    type: string;
    fromDesignation: string;
    toDesignation: string;
    fromDepartment: string;
    toDepartment: string;
    effectiveDate: string;
    salaryIncrement?: number;
  };
}

export function TransferPromotionWorkflowModal({ isOpen, onClose, requestData }: TransferPromotionWorkflowModalProps) {
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([
    {
      id: 'stage1',
      name: 'Request Submission',
      status: 'completed',
      assignedTo: 'Requesting Manager',
      completedBy: 'Production Manager',
      completedDate: new Date().toISOString().split('T')[0],
      comments: 'Request submitted for employee promotion',
      action: 'Submit'
    },
    {
      id: 'stage2',
      name: 'HR Verification',
      status: 'completed',
      assignedTo: 'HR Department',
      completedBy: 'HR Manager',
      completedDate: new Date().toISOString().split('T')[0],
      comments: 'Verified employee records, performance history, and eligibility',
      requiredDocuments: ['Performance Appraisal', 'Attendance Record', 'Disciplinary Check'],
      action: 'Verify'
    },
    {
      id: 'stage3',
      name: 'Department Head Approval',
      status: 'in_progress',
      assignedTo: 'Department Head',
      comments: 'Pending review from department head',
      action: 'Approve'
    },
    {
      id: 'stage4',
      name: 'Finance Approval',
      status: 'pending',
      assignedTo: 'Finance Department',
      comments: 'Budget allocation and salary increment approval',
      requiredDocuments: ['Budget Approval Form', 'Salary Structure'],
      action: 'Approve'
    },
    {
      id: 'stage5',
      name: 'VP/Director Approval',
      status: 'pending',
      assignedTo: 'VP Operations',
      comments: 'Final management approval',
      action: 'Approve'
    },
    {
      id: 'stage6',
      name: 'Offer Letter Generation',
      status: 'pending',
      assignedTo: 'HR Department',
      comments: 'Generate and send offer letter',
      requiredDocuments: ['Offer Letter', 'Revised Job Description'],
      action: 'Generate'
    },
    {
      id: 'stage7',
      name: 'Employee Acceptance',
      status: 'pending',
      assignedTo: requestData.employeeName,
      comments: 'Awaiting employee acceptance',
      action: 'Accept'
    },
    {
      id: 'stage8',
      name: 'System Update',
      status: 'pending',
      assignedTo: 'HR Admin',
      comments: 'Update HRMS, payroll, and access systems',
      requiredDocuments: ['System Update Form', 'Access Rights Form'],
      action: 'Update'
    },
    {
      id: 'stage9',
      name: 'Implementation',
      status: 'pending',
      assignedTo: 'HR Department',
      comments: 'Complete the transfer/promotion process',
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

  const handleStageAction = (stage: WorkflowStage, action: 'approve' | 'reject') => {
    const updatedStages = workflowStages.map(s => {
      if (s.id === stage.id) {
        return {
          ...s,
          status: action === 'approve' ? 'completed' : 'rejected',
          completedBy: 'Current User',
          completedDate: new Date().toISOString().split('T')[0],
          comments: actionComment || s.comments
        } as WorkflowStage;
      }
      // Move next stage to in_progress if current stage is approved
      if (action === 'approve' && s.id === getNextStageId(stage.id)) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Users className="w-6 h-6" />
                Transfer/Promotion Workflow
              </h2>
              <div className="text-indigo-100 text-sm space-y-1">
                <p><strong>Request ID:</strong> {requestData.id}</p>
                <p><strong>Employee:</strong> {requestData.employeeName} ({requestData.employeeCode})</p>
                <p><strong>Type:</strong> {requestData.type.toUpperCase()}</p>
                <p><strong>From:</strong> {requestData.fromDesignation} → <strong>To:</strong> {requestData.toDesignation}</p>
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
              <span>Progress: {completedStages} of {totalStages} stages completed</span>
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

                      {/* Action Buttons */}
                      {stage.status === 'in_progress' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setSelectedStage(stage)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                          >
                            {stage.action || 'Approve'} & Continue
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStage(stage);
                              // Auto-set to reject mode
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                          >
                            Reject
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
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Workflow Information:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Each stage must be completed before moving to the next</li>
                  <li>All approvers will be notified via email when their approval is required</li>
                  <li>Workflow can be paused or cancelled at any stage with proper justification</li>
                  <li>Documents must be uploaded before stage completion</li>
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
                {selectedStage.action || 'Approve'} Stage: {selectedStage.name}
              </h3>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments / Notes
                </label>
                <textarea
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  rows={4}
                  placeholder="Add any comments or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleStageAction(selectedStage, 'approve')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {selectedStage.action || 'Approve'}
                </button>
                <button
                  onClick={() => handleStageAction(selectedStage, 'reject')}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Reject
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
