'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { WorkflowBuilder } from '@/components/crm';
import { WorkflowTestModal, type WorkflowTest } from '@/components/modals';
import { ArrowLeft } from 'lucide-react';

export default function WorkflowAutomationPage() {
  const router = useRouter();
  const [showWorkflowTestModal, setShowWorkflowTestModal] = useState(false);

  const handleSaveWorkflow = (workflow: { name: string }) => {
    console.log('Workflow saved:', workflow);
  };

  const handleTestWorkflow = (workflow: { name: string }) => {
    setShowWorkflowTestModal(true);
  };

  const handleSaveWorkflowTest = (test: WorkflowTest) => {
    console.log('Workflow test completed:', test);
    setShowWorkflowTestModal(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">

      <div className="flex-1 px-3 py-2 overflow-auto">
        <button
          onClick={() => router.push('/crm/advanced-features')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced Features
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Workflow Automation Builder</h2>
          <p className="text-gray-600 mb-2">
            Visual workflow builder with triggers, conditions, and actions to automate repetitive tasks
            and ensure consistency.
          </p>
          <WorkflowBuilder
            availableFields={[
              { name: 'status', label: 'Lead Status', type: 'string' },
              { name: 'score', label: 'Lead Score', type: 'number' },
              { name: 'value', label: 'Deal Value', type: 'number' },
              { name: 'source', label: 'Lead Source', type: 'string' },
            ]}
            availableUsers={[
              { id: '1', name: 'Sarah Johnson' },
              { id: '2', name: 'Mike Chen' },
              { id: '3', name: 'David Park' },
            ]}
            onSave={handleSaveWorkflow}
            onTest={handleTestWorkflow}
          />
        </div>
      </div>

      <WorkflowTestModal
        isOpen={showWorkflowTestModal}
        onClose={() => setShowWorkflowTestModal(false)}
        onSave={handleSaveWorkflowTest}
        mode="add"
      />
    </div>
  );
}
