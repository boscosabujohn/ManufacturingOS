'use client'

import { useState } from 'react'
import { Award, Target, TrendingUp, Star } from 'lucide-react'

export interface ScoringCriteria {
  criterion: string;
  weight: number;
  maxScore: number;
}

export interface VendorScore {
  vendorId: string;
  vendorName: string;
  totalScore: number;
  rank: number;
  scores: { criterion: string; score: number; maxScore: number }[];
  priceQuote: number;
  technicalScore: number;
  deliveryScore: number;
  qualityScore: number;
}

export default function ResponseScoring() {
  const [criteria] = useState<ScoringCriteria[]>([
    { criterion: 'Price Competitiveness', weight: 35, maxScore: 100 },
    { criterion: 'Technical Compliance', weight: 25, maxScore: 100 },
    { criterion: 'Delivery Timeline', weight: 20, maxScore: 100 },
    { criterion: 'Quality Certifications', weight: 15, maxScore: 100 },
    { criterion: 'Past Performance', weight: 5, maxScore: 100 }
  ]);

  const [vendorScores] = useState<VendorScore[]>([
    {
      vendorId: 'V-001',
      vendorName: 'ABC Suppliers Ltd',
      totalScore: 87.5,
      rank: 1,
      priceQuote: 2500000,
      technicalScore: 92,
      deliveryScore: 85,
      qualityScore: 90,
      scores: [
        { criterion: 'Price Competitiveness', score: 90, maxScore: 100 },
        { criterion: 'Technical Compliance', score: 92, maxScore: 100 },
        { criterion: 'Delivery Timeline', score: 85, maxScore: 100 },
        { criterion: 'Quality Certifications', score: 90, maxScore: 100 },
        { criterion: 'Past Performance', score: 75, maxScore: 100 }
      ]
    },
    {
      vendorId: 'V-002',
      vendorName: 'XYZ Industries Inc',
      totalScore: 82.3,
      rank: 2,
      priceQuote: 2650000,
      technicalScore: 88,
      deliveryScore: 80,
      qualityScore: 85,
      scores: [
        { criterion: 'Price Competitiveness', score: 85, maxScore: 100 },
        { criterion: 'Technical Compliance', score: 88, maxScore: 100 },
        { criterion: 'Delivery Timeline', score: 80, maxScore: 100 },
        { criterion: 'Quality Certifications', score: 85, maxScore: 100 },
        { criterion: 'Past Performance', score: 70, maxScore: 100 }
      ]
    },
    {
      vendorId: 'V-003',
      vendorName: 'Tech Solutions Pvt Ltd',
      totalScore: 75.8,
      rank: 3,
      priceQuote: 2850000,
      technicalScore: 75,
      deliveryScore: 70,
      qualityScore: 80,
      scores: [
        { criterion: 'Price Competitiveness', score: 75, maxScore: 100 },
        { criterion: 'Technical Compliance', score: 75, maxScore: 100 },
        { criterion: 'Delivery Timeline', score: 70, maxScore: 100 },
        { criterion: 'Quality Certifications', score: 80, maxScore: 100 },
        { criterion: 'Past Performance', score: 80, maxScore: 100 }
      ]
    }
  ]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 text-gray-700 border-gray-300';
    if (rank === 3) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-blue-100 text-blue-700 border-blue-300';
  };

  const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(2)}L`;

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Award className="h-8 w-8 text-yellow-600" />
          Response Scoring & Evaluation
        </h2>
        <p className="text-gray-600 mt-1">Weighted scoring matrix for vendor comparison</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200 p-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Scoring Criteria & Weights</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {criteria.map((c, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700 font-medium mb-2">{c.criterion}</p>
              <p className="text-3xl font-bold text-blue-900">{c.weight}%</p>
              <p className="text-xs text-gray-600 mt-1">Max: {c.maxScore}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h3 className="text-lg font-semibold text-gray-900">Vendor Rankings</h3>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {vendorScores.map((vendor) => (
              <div key={vendor.vendorId} className="p-5 border-2 border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {vendor.rank <= 3 && (
                      <div className={`p-2 rounded-full ${getRankColor(vendor.rank)}`}>
                        <Star className="h-6 w-6" fill="currentColor" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{vendor.vendorName}</h4>
                      <p className="text-sm text-gray-600">Rank #{vendor.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-900">{vendor.totalScore}</p>
                    <p className="text-sm text-gray-600">Total Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Price Quote</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(vendor.priceQuote)}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Technical</p>
                    <p className="text-lg font-bold text-blue-900">{vendor.technicalScore}/100</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Delivery</p>
                    <p className="text-lg font-bold text-purple-900">{vendor.deliveryScore}/100</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600 font-medium">Quality</p>
                    <p className="text-lg font-bold text-yellow-900">{vendor.qualityScore}/100</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {vendor.scores.map((score, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{score.criterion}</span>
                        <span className="text-sm font-bold text-gray-900">{score.score}/{score.maxScore}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${score.score >= 85 ? 'bg-green-500' : score.score >= 70 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
