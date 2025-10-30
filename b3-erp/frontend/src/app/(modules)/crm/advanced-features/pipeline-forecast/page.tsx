'use client';

import { useRouter } from 'next/navigation';

import { PipelineForecast } from '@/components/crm';
import type { ForecastPeriod } from '@/components/crm';
import { ArrowLeft } from 'lucide-react';

const mockForecastPeriods: ForecastPeriod[] = [
  {
    month: 'Oct 2025',
    committed: 420000,
    bestCase: 680000,
    pipeline: 855000,
    closed: 320000,
    target: 650000,
    opportunities: 7,
    aiPrediction: {
      expectedRevenue: 590000,
      confidence: 85,
      risk: 'low',
      factors: [
        'Strong historical conversion rate in Q4',
        '3 high-value deals in negotiation stage',
        'Sales team velocity 15% above average',
        'Market conditions favorable for closing',
      ],
    },
  },
  {
    month: 'Nov 2025',
    committed: 580000,
    bestCase: 825000,
    pipeline: 1150000,
    closed: 0,
    target: 700000,
    opportunities: 9,
    aiPrediction: {
      expectedRevenue: 720000,
      confidence: 78,
      risk: 'medium',
      factors: [
        'Pipeline coverage ratio is healthy at 1.6x',
        'Holiday season may slow decision making',
        'Need to accelerate 2 key opportunities',
      ],
    },
  },
  {
    month: 'Dec 2025',
    committed: 450000,
    bestCase: 720000,
    pipeline: 920000,
    closed: 0,
    target: 750000,
    opportunities: 6,
    aiPrediction: {
      expectedRevenue: 650000,
      confidence: 72,
      risk: 'medium',
      factors: [
        'End-of-year budget flush expected',
        'Shorter working days may impact closings',
        'Strong Q4 finish historically',
      ],
    },
  },
];

export default function PipelineForecastPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
        <button
          onClick={() => router.push('/crm/advanced-features')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Advanced Features
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">AI Pipeline Forecasting</h2>
          <p className="text-gray-600 mb-4">
            Advanced revenue predictions with confidence intervals, risk assessment, and scenario analysis
            powered by machine learning.
          </p>
          <PipelineForecast
            periods={mockForecastPeriods}
            scenarios={[
              {
                name: 'Conservative',
                probability: 90,
                revenue: 1450000,
                description: 'Only committed deals close',
              },
              {
                name: 'Likely',
                probability: 70,
                revenue: 1960000,
                description: 'Best case scenario with some slippage',
              },
              {
                name: 'Optimistic',
                probability: 40,
                revenue: 2225000,
                description: 'All pipeline deals close',
              },
            ]}
            currentPeriodIndex={0}
            showAIPredictions={true}
            showScenarios={true}
          />
        </div>
      </div>
    </div>
  );
}
