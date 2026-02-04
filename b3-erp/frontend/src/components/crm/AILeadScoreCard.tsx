'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  AlertCircle,
  Brain,
  Target,
  Zap,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

export interface LeadScoringFactors {
  companySize: number;
  revenue: number;
  engagement: number;
  interest: number;
  sourceQuality: number;
  behavior: number;
  demographic: number;
  firmographic: number;
}

export interface AILeadScore {
  currentScore: number;
  previousScore: number;
  prediction: {
    conversionProbability: number;
    timeToConvert: number; // days
    recommendedActions: string[];
    confidence: number; // 0-100
  };
  factors: LeadScoringFactors;
  rating: 'hot' | 'warm' | 'cold';
  trend: 'up' | 'down' | 'stable';
}

export interface AILeadScoreCardProps {
  leadName: string;
  leadCompany: string;
  score: AILeadScore;
  onAcceptRecommendation?: (action: string) => void;
  onRejectRecommendation?: (action: string) => void;
  compact?: boolean;
  showPredictions?: boolean;
  className?: string;
}

export const AILeadScoreCard: React.FC<AILeadScoreCardProps> = ({
  leadName,
  leadCompany,
  score,
  onAcceptRecommendation,
  onRejectRecommendation,
  compact = false,
  showPredictions = true,
  className = '',
}) => {
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 75) return 'text-green-600 bg-green-50 border-green-300';
    if (scoreValue >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-300';
    return 'text-red-600 bg-red-50 border-red-300';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'hot':
        return 'bg-red-500 text-white';
      case 'warm':
        return 'bg-orange-500 text-white';
      case 'cold':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = () => {
    switch (score.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <ChevronRight className="h-4 w-4 text-gray-400" />;
    }
  };

  const scoreChange = score.currentScore - score.previousScore;

  if (compact) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getScoreColor(
                score.currentScore
              )}`}
            >
              <span className="text-lg font-bold">{score.currentScore}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{leadName}</p>
              <p className="text-sm text-gray-600">{leadCompany}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRatingColor(score.rating)}`}>
              {score.rating.toUpperCase()}
            </span>
            {getTrendIcon()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {/* Score Circle */}
            <div
              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${getScoreColor(
                score.currentScore
              )}`}
            >
              <span className="text-2xl font-bold">{score.currentScore}</span>
              <div className="flex items-center mt-1">
                {getTrendIcon()}
                <span className="text-xs ml-1">{Math.abs(scoreChange)}</span>
              </div>
            </div>

            {/* Lead Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{leadName}</h3>
              <p className="text-gray-600 mt-1">{leadCompany}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRatingColor(score.rating)}`}>
                  {score.rating.toUpperCase()} LEAD
                </span>
                <span className="text-sm text-gray-500">
                  {scoreChange > 0 ? '+' : ''}
                  {scoreChange} pts from last week
                </span>
              </div>
            </div>
          </div>

          {/* AI Badge */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Score Breakdown</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(score.factors).map(([key, value]) => {
            const maxScore = 20; // Assuming max 20 per factor
            const percentage = (value / maxScore) * 100;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-xs font-semibold text-gray-900">{value}/20</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Predictions */}
      {showPredictions && (
        <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <h4 className="text-sm font-semibold text-gray-700">AI Predictions</h4>
            <span className="ml-auto text-xs text-purple-700 font-medium">
              {score.prediction.confidence}% Confidence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-600">Conversion Probability</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {score.prediction.conversionProbability}%
              </p>
            </div>

            <div className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex items-center space-x-2 mb-1">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-600">Est. Time to Convert</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{score.prediction.timeToConvert} days</p>
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <h5 className="text-xs font-semibold text-gray-700 mb-2">Recommended Next Steps</h5>
            <div className="space-y-2">
              {score.prediction.recommendedActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between bg-white rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-start space-x-2 flex-1">
                    <Award className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{action}</span>
                  </div>
                  {(onAcceptRecommendation || onRejectRecommendation) && (
                    <div className="flex items-center space-x-1 ml-2">
                      {onAcceptRecommendation && (
                        <button
                          onClick={() => onAcceptRecommendation(action)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Accept"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </button>
                      )}
                      {onRejectRecommendation && (
                        <button
                          onClick={() => onRejectRecommendation(action)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Reject"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confidence Meter */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">AI Model Confidence</span>
          <span className="font-semibold text-gray-900">{score.prediction.confidence}%</span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
            style={{ width: `${score.prediction.confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
