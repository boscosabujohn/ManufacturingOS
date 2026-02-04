'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { POApprovalWorkflowUI } from '@/components/procurement/POApprovalWorkflowUI';

export default function POApprovalWorkflowPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PO Approval Workflow</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visual approval chain with multi-level authorization tracking</p>
          </div>
        </div>
      </div>

      {/* PO Approval Workflow Component */}
      <div className="p-6">
        <POApprovalWorkflowUI
          onApprove={(poId, stepId, comments) => {
            console.log('Approved:', poId, stepId, comments);
            // In a real app, this would call an API to approve
          }}
          onReject={(poId, stepId, reason) => {
            console.log('Rejected:', poId, stepId, reason);
            // In a real app, this would call an API to reject
          }}
          onDelegate={(poId, stepId, delegateToId) => {
            console.log('Delegated:', poId, stepId, delegateToId);
          }}
          onRequestInfo={(poId, message) => {
            console.log('Info requested:', poId, message);
          }}
        />
      </div>
    </div>
  );
}
