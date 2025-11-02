'use client';

import React, { useState } from 'react';
import { UserPlus, CheckCircle, Clock, FileText, Briefcase, GraduationCap, Key, Mail } from 'lucide-react';
import { AddComplianceRuleModal, CreateAnalyticsReportModal, CreateOnboardingWorkflowModal, InitiateReviewCycleModal, CreatePolicyModal } from './HRAdvancedModals';

export type OnboardingStage = 'pre-joining' | 'day-1' | 'week-1' | 'month-1' | 'completed';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  assignedTo: 'hr' | 'it' | 'manager' | 'employee';
  status: TaskStatus;
  dueDate: string;
  completedAt?: string;
}

export interface OnboardingEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  stage: OnboardingStage;
  progress: number;
  tasks: OnboardingTask[];
}

export default function OnboardingWorkflow() {
  const [employees] = useState<OnboardingEmployee[]>([
    {
      id: 'emp-001',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: 'Engineering',
      designation: 'Senior Developer',
      joiningDate: '2025-02-01',
      stage: 'week-1',
      progress: 65,
      tasks: [
        { id: 't1', title: 'Send offer letter', description: 'Email signed offer letter', assignedTo: 'hr', status: 'completed', dueDate: '2025-01-15', completedAt: '2025-01-14' },
        { id: 't2', title: 'Setup email account', description: 'Create corporate email', assignedTo: 'it', status: 'completed', dueDate: '2025-01-31', completedAt: '2025-01-30' },
        { id: 't3', title: 'Assign buddy', description: 'Assign onboarding buddy', assignedTo: 'manager', status: 'in-progress', dueDate: '2025-02-05' },
        { id: 't4', title: 'Complete compliance training', description: 'Code of conduct training', assignedTo: 'employee', status: 'pending', dueDate: '2025-02-10' },
      ],
    },
  ]);

  const getStageColor = (stage: OnboardingStage) => {
    switch (stage) {
      case 'pre-joining': return 'bg-blue-100 text-blue-800';
      case 'day-1': return 'bg-purple-100 text-purple-800';
      case 'week-1': return 'bg-orange-100 text-orange-800';
      case 'month-1': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'overdue': return <Clock className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 p-6">
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Onboarding Workflow</h1>
          <p className="text-gray-600">Streamlined onboarding process for new hires</p>
        </div>

        <div className="space-y-6">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
                    <p className="text-sm text-gray-600">{employee.designation} • {employee.department}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(employee.stage)}`}>
                  {employee.stage.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Onboarding Progress</span>
                  <span className="text-sm font-bold text-gray-900">{employee.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all" style={{ width: `${employee.progress}%` }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Onboarding Tasks</h3>
                {employee.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.assignedTo === 'hr' ? 'bg-blue-100 text-blue-700' :
                      task.assignedTo === 'it' ? 'bg-purple-100 text-purple-700' :
                      task.assignedTo === 'manager' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {task.assignedTo.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
