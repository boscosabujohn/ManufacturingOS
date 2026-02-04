'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function EditLeadNoId() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to leads list after a short delay
    const timer = setTimeout(() => {
      router.push('/crm/leads');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Lead ID Required
        </h1>
        
        <p className="text-gray-600 mb-3">
          You need to specify which lead to edit. Please select a lead from the list.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/crm/leads')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Leads List
          </button>

          <p className="text-sm text-gray-500">
            Redirecting automatically in 3 seconds...
          </p>
        </div>

        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-left">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> To edit a specific lead, use the edit button on the leads list page, 
            or navigate to <code className="bg-white px-2 py-1 rounded text-xs">/crm/leads/edit/[id]</code>
          </p>
        </div>
      </div>
    </div>
  );
}
