'use client';

import React, { useState } from 'react';
import { Award, Target, TrendingUp, Star, MessageSquare, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';

export type ReviewStatus = 'not-started' | 'self-assessment' | 'manager-review' | 'calibration' | 'completed';
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface PerformanceGoal {
  id: string;
  title: string;
  description: string;
  weight: number;
  selfRating?: Rating;
  managerRating?: Rating;
  status: 'on-track' | 'at-risk' | 'achieved' | 'not-achieved';
}

export interface PerformanceReviewData {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  status: ReviewStatus;
  goals: PerformanceGoal[];
  overallSelfRating?: Rating;
  overallManagerRating?: Rating;
  feedback?: string;
  dueDate: string;
}

export default function PerformanceReview() {
  const [reviews] = useState<PerformanceReviewData[]>([
    {
      id: 'rev-001',
      employeeId: 'EMP2025001',
      employeeName: 'John Doe',
      reviewPeriod: 'Q4 2024 (Oct - Dec)',
      status: 'manager-review',
      dueDate: '2025-01-31',
      goals: [
        { id: 'g1', title: 'Deliver Project Alpha', description: 'Complete on time', weight: 30, selfRating: 4, status: 'achieved' },
        { id: 'g2', title: 'Mentor 2 junior developers', description: 'Knowledge transfer', weight: 20, selfRating: 5, status: 'achieved' },
        { id: 'g3', title: 'Improve code quality metrics', description: 'Reduce bugs by 30%', weight: 25, selfRating: 3, status: 'on-track' },
        { id: 'g4', title: 'Complete certification', description: 'AWS Solutions Architect', weight: 25, selfRating: 4, status: 'achieved' },
      ],
      overallSelfRating: 4,
    },
  ]);

  const getRatingStars = (rating?: Rating) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'calibration': return 'bg-purple-100 text-purple-800';
      case 'manager-review': return 'bg-blue-100 text-blue-800';
      case 'self-assessment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Review Management</h1>
          <p className="text-gray-600">Goal-based performance reviews and feedback</p>
        </div>

        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{review.employeeName}</h2>
                <p className="text-gray-600">{review.reviewPeriod} • Due: {review.dueDate}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
                {review.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            {review.overallSelfRating && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 mb-6 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Overall Self-Assessment</p>
                    {getRatingStars(review.overallSelfRating)}
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-yellow-600">{review.overallSelfRating}/5</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Performance Goals
              </h3>

              {review.goals.map((goal) => (
                <div key={goal.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          Weight: {goal.weight}%
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          goal.status === 'achieved' ? 'bg-green-100 text-green-700' :
                          goal.status === 'on-track' ? 'bg-blue-100 text-blue-700' :
                          goal.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {goal.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {goal.selfRating && (
                      <div className="bg-white rounded p-3">
                        <p className="text-xs text-gray-600 mb-2">Self Rating</p>
                        {getRatingStars(goal.selfRating)}
                      </div>
                    )}
                    {goal.managerRating && (
                      <div className="bg-white rounded p-3">
                        <p className="text-xs text-gray-600 mb-2">Manager Rating</p>
                        {getRatingStars(goal.managerRating)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              {review.status === 'self-assessment' && (
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <CheckCircle className="w-4 h-4" />
                  Submit Self-Assessment
                </button>
              )}
              {review.status === 'manager-review' && (
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Award className="w-4 h-4" />
                  Complete Manager Review
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <MessageSquare className="w-4 h-4" />
                Add Feedback
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
