'use client';

import { useState } from 'react';
import { MessageSquare, Star, ThumbsUp, AlertCircle, TrendingUp, Users } from 'lucide-react';

interface Feedback {
  id: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  department: string;
  feedbackFrom: string;
  feedbackType: 'manager' | 'peer' | 'self';
  submittedDate: string;
  overallRating: number;
  categories: {
    technicalSkills: number;
    communication: number;
    teamwork: number;
    initiative: number;
    attendance: number;
  };
  strengths: string;
  improvements: string;
  recommendation: 'confirm' | 'extend' | 'terminate';
}

export default function Page() {
  const [selectedType, setSelectedType] = useState('all');

  const mockFeedback: Feedback[] = [
    {
      id: '1',
      employeeCode: 'EMP567',
      employeeName: 'Arjun Nair',
      designation: 'Production Engineer',
      department: 'Production',
      feedbackFrom: 'Suresh Iyer',
      feedbackType: 'manager',
      submittedDate: '2025-10-05',
      overallRating: 4.2,
      categories: {
        technicalSkills: 5,
        communication: 4,
        teamwork: 4,
        initiative: 4,
        attendance: 5
      },
      strengths: 'Strong technical knowledge, quick learner, excellent at problem-solving on the shop floor',
      improvements: 'Needs to work on documentation and communication with cross-functional teams',
      recommendation: 'confirm'
    },
    {
      id: '2',
      employeeCode: 'EMP612',
      employeeName: 'Aditya Sharma',
      designation: 'IT Support Engineer',
      department: 'Information Technology',
      feedbackFrom: 'Vikram Singh',
      feedbackType: 'manager',
      submittedDate: '2025-09-01',
      overallRating: 3.4,
      categories: {
        technicalSkills: 4,
        communication: 3,
        teamwork: 3,
        initiative: 3,
        attendance: 4
      },
      strengths: 'Good technical knowledge, willing to learn',
      improvements: 'Lacks initiative, needs improvement in communication and proactive problem solving',
      recommendation: 'extend'
    },
    {
      id: '3',
      employeeCode: 'EMP578',
      employeeName: 'Priyanka Joshi',
      designation: 'HR Executive',
      department: 'Human Resources',
      feedbackFrom: 'Kavita Sharma',
      feedbackType: 'manager',
      submittedDate: '2025-08-20',
      overallRating: 4.6,
      categories: {
        technicalSkills: 5,
        communication: 5,
        teamwork: 5,
        initiative: 4,
        attendance: 5
      },
      strengths: 'Excellent communication, highly collaborative, takes initiative, quick to adapt to HR processes',
      improvements: 'Minor improvements needed in time management during peak recruitment seasons',
      recommendation: 'confirm'
    }
  ];

  const filteredFeedback = mockFeedback.filter(f =>
    selectedType === 'all' || f.feedbackType === selectedType
  );

  const stats = {
    total: mockFeedback.length,
    avgRating: (mockFeedback.reduce((sum, f) => sum + f.overallRating, 0) / mockFeedback.length).toFixed(1),
    confirmRecommendations: mockFeedback.filter(f => f.recommendation === 'confirm').length,
    extendRecommendations: mockFeedback.filter(f => f.recommendation === 'extend').length
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Probation Feedback</h1>
        <p className="text-sm text-gray-600 mt-1">Review feedback collected during probation period</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Feedback</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgRating}/5</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Confirm</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.confirmRecommendations}</p>
            </div>
            <ThumbsUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Extend</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{stats.extendRecommendations}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          {['all', 'manager', 'peer', 'self'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredFeedback.map(feedback => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{feedback.employeeName}</h3>
                <p className="text-sm text-gray-600">{feedback.designation} • {feedback.department}</p>
                <p className="text-xs text-gray-500 mt-1">Feedback by: {feedback.feedbackFrom} ({feedback.feedbackType})</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getRatingColor(feedback.overallRating)}`}>
                  {feedback.overallRating}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(feedback.overallRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {Object.entries(feedback.categories).map(([category, rating]) => (
                <div key={category} className="text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 mb-2">Strengths</p>
                <p className="text-sm text-green-800">{feedback.strengths}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-orange-900 mb-2">Areas for Improvement</p>
                <p className="text-sm text-orange-800">{feedback.improvements}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className={`px-3 py-1 text-sm font-semibold rounded ${
                feedback.recommendation === 'confirm' ? 'bg-green-100 text-green-700' :
                feedback.recommendation === 'extend' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                Recommendation: {feedback.recommendation.charAt(0).toUpperCase() + feedback.recommendation.slice(1)}
              </span>
              <span className="text-xs text-gray-500">Submitted on {feedback.submittedDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
