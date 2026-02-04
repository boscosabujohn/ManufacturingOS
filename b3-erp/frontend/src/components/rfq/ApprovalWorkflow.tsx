'use client'

import { useState } from 'react'
import { GitBranch, CheckCircle, XCircle, Clock, User } from 'lucide-react'

export interface ApprovalStep {
  step: number;
  approver: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  date?: string;
}

export default function ApprovalWorkflow() {
  const [workflow] = useState<ApprovalStep[]>([
    { step: 1, approver: 'Procurement Manager', role: 'Manager', status: 'approved', comments: 'Approved for processing', date: '2025-10-18' },
    { step: 2, approver: 'Finance Director', role: 'Director', status: 'approved', comments: 'Budget approved', date: '2025-10-19' },
    { step: 3, approver: 'CEO', role: 'Executive', status: 'pending', comments: undefined, date: undefined }
  ]);

  const getStatusIcon = (status: string) => {
    if (status === 'approved') return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (status === 'rejected') return <XCircle className="h-6 w-6 text-red-600" />;
    return <Clock className="h-6 w-6 text-yellow-600" />;
  };

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-purple-600" />
          Approval Workflow
        </h2>
        <p className="text-gray-600 mt-1">Multi-level approval tracking</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200 p-3">
        <div className="space-y-3">
          {workflow.map((step, idx) => (
            <div key={step.step} className="relative">
              {idx < workflow.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-300"></div>
              )}
              <div className="flex items-start gap-2">
                <div className={`p-2 rounded-full ${step.status === 'approved' ? 'bg-green-100' : step.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{step.approver}</h4>
                      <p className="text-sm text-gray-600">{step.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      step.status === 'approved' ? 'bg-green-100 text-green-700' :
                      step.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {step.status.toUpperCase()}
                    </span>
                  </div>
                  {step.comments && <p className="text-sm text-gray-700 mt-2">{step.comments}</p>}
                  {step.date && <p className="text-xs text-gray-600 mt-2">{step.date}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
