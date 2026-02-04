'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AILeadScoreCard } from '@/components/crm';
import type { AILeadScore } from '@/components/crm';
import { ArrowLeft } from 'lucide-react';

const mockAIScore: AILeadScore = {
  currentScore: 85,
  previousScore: 75,
  prediction: {
    conversionProbability: 78,
    timeToConvert: 14,
    recommendedActions: [
      'Schedule a product demo within the next 3 days',
      'Send case study about similar manufacturing companies',
      'Follow up on pricing questions from last meeting',
      'Connect decision maker with customer success story',
    ],
    confidence: 87,
  },
  factors: {
    companySize: 18,
    revenue: 19,
    engagement: 20,
    interest: 18,
    sourceQuality: 15,
    behavior: 17,
    demographic: 16,
    firmographic: 19,
  },
  rating: 'hot',
  trend: 'up',
};

export default function AILeadScoringPage() {
  const router = useRouter();

  const handleAcceptRecommendation = (action: string) => {
    console.log('Recommendation accepted:', action);
  };

  const handleRejectRecommendation = (action: string) => {
    console.log('Recommendation rejected:', action);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="flex-1 px-3 py-2 overflow-auto">
        <button
          onClick={() => router.push('/crm/advanced-features')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced Features
        </button>

        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h2 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Lead Scoring</h2>
            <p className="text-gray-600 mb-2">
              Machine learning algorithms analyze multiple factors to predict conversion probability and
              recommend next best actions.
            </p>
            <AILeadScoreCard
              leadName="John Smith"
              leadCompany="TechCorp Global Inc."
              score={mockAIScore}
              onAcceptRecommendation={handleAcceptRecommendation}
              onRejectRecommendation={handleRejectRecommendation}
              showPredictions={true}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Compact View</h3>
            <div className="space-y-3">
              <AILeadScoreCard
                leadName="Emily Davis"
                leadCompany="GlobalMfg Corporation"
                score={{ ...mockAIScore, currentScore: 72, rating: 'warm', trend: 'stable' }}
                compact={true}
              />
              <AILeadScoreCard
                leadName="Robert Wilson"
                leadCompany="FinanceHub International"
                score={{ ...mockAIScore, currentScore: 45, rating: 'cold', trend: 'down' }}
                compact={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
