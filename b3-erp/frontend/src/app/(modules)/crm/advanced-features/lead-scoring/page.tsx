'use client';

import { useRouter } from 'next/navigation';

import { LeadScoringQualification } from '@/components/crm';
import { ArrowLeft } from 'lucide-react';

export default function LeadScoringQualificationPage() {
  const router = useRouter();

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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lead Scoring & Qualification</h2>
          <p className="text-gray-600 mb-2">
            Enterprise-grade lead scoring with AI-powered qualification framework to prioritize high-value opportunities.
          </p>
          <LeadScoringQualification />
        </div>
      </div>
    </div>
  );
}
