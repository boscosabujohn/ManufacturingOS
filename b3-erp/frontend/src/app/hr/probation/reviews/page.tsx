'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface Review {
  id: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  department: string;
  reviewNumber: number;
  totalReviews: number;
  scheduledDate: string;
  reviewType: '1_month' | '3_month' | '6_month' | 'final';
  reviewer: string;
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled';
  performanceRating?: number;
  areasStrength?: string[];
  areasImprovement?: string[];
  recommendation?: 'confirm' | 'extend' | 'terminate';
  completedDate?: string;
}

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockReviews: Review[] = [
    {
      id: '1',
      employeeCode: 'EMP567',
      employeeName: 'Arjun Nair',
      designation: 'Production Engineer',
      department: 'Production',
      reviewNumber: 3,
      totalReviews: 3,
      scheduledDate: '2025-10-13',
      reviewType: 'final',
      reviewer: 'Suresh Iyer',
      status: 'scheduled'
    },
    {
      id: '2',
      employeeCode: 'EMP601',
      employeeName: 'Rahul Verma',
      designation: 'Maintenance Technician',
      department: 'Maintenance',
      reviewNumber: 2,
      totalReviews: 3,
      scheduledDate: '2025-11-01',
      reviewType: '3_month',
      reviewer: 'Ramesh Nair',
      status: 'scheduled'
    },
    {
      id: '3',
      employeeCode: 'EMP578',
      employeeName: 'Priyanka Joshi',
      designation: 'HR Executive',
      department: 'Human Resources',
      reviewNumber: 3,
      totalReviews: 3,
      scheduledDate: '2025-08-25',
      reviewType: 'final',
      reviewer: 'Kavita Sharma',
      status: 'completed',
      performanceRating: 92,
      areasStrength: ['Communication', 'Team Collaboration', 'Learning Agility'],
      areasImprovement: ['Time Management'],
      recommendation: 'confirm',
      completedDate: '2025-08-25'
    },
    {
      id: '4',
      employeeCode: 'EMP612',
      employeeName: 'Aditya Sharma',
      designation: 'IT Support Engineer',
      department: 'Information Technology',
      reviewNumber: 2,
      totalReviews: 4,
      scheduledDate: '2025-09-01',
      reviewType: '3_month',
      reviewer: 'Vikram Singh',
      status: 'completed',
      performanceRating: 68,
      areasStrength: ['Technical Knowledge'],
      areasImprovement: ['Communication', 'Initiative', 'Problem Solving'],
      recommendation: 'extend',
      completedDate: '2025-09-01'
    }
  ];

  const filteredReviews = mockReviews.filter(r =>
    selectedStatus === 'all' || r.status === selectedStatus
  );

  const stats = {
    total: mockReviews.length,
    scheduled: mockReviews.filter(r => r.status === 'scheduled').length,
    completed: mockReviews.filter(r => r.status === 'completed').length,
    avgRating: Math.round(
      mockReviews.filter(r => r.performanceRating).reduce((sum, r) => sum + (r.performanceRating || 0), 0) /
      mockReviews.filter(r => r.performanceRating).length
    )
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    missed: 'bg-red-100 text-red-700',
    rescheduled: 'bg-orange-100 text-orange-700'
  };

  const reviewTypeLabels = {
    '1_month': '1 Month Review',
    '3_month': '3 Month Review',
    '6_month': '6 Month Review',
    'final': 'Final Review'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Probation Reviews</h1>
        <p className="text-sm text-gray-600 mt-1">Schedule and track probation review meetings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Reviews</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Scheduled</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.scheduled}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgRating}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          {['all', 'scheduled', 'completed', 'missed', 'rescheduled'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{review.employeeName}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[review.status]}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{review.designation} • {review.department} • {review.employeeCode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-600">{reviewTypeLabels[review.reviewType]}</p>
                <p className="text-xs text-gray-500">Review {review.reviewNumber}/{review.totalReviews}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Reviewer</p>
                <p className="text-sm font-semibold text-gray-900">{review.reviewer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Scheduled Date</p>
                <p className="text-sm font-semibold text-gray-900">{review.scheduledDate}</p>
              </div>
              {review.completedDate && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Completed Date</p>
                  <p className="text-sm font-semibold text-green-600">{review.completedDate}</p>
                </div>
              )}
            </div>

            {review.status === 'completed' && review.performanceRating && (
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Performance Rating</p>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-blue-600">{review.performanceRating}%</div>
                      {review.recommendation && (
                        <span className={`px-3 py-1 text-xs font-semibold rounded ${
                          review.recommendation === 'confirm' ? 'bg-green-100 text-green-700' :
                          review.recommendation === 'extend' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {review.recommendation.charAt(0).toUpperCase() + review.recommendation.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {review.areasStrength && review.areasStrength.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Strengths</p>
                        <div className="flex flex-wrap gap-2">
                          {review.areasStrength.map((strength, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {review.areasImprovement && review.areasImprovement.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Areas for Improvement</p>
                        <div className="flex flex-wrap gap-2">
                          {review.areasImprovement.map((area, idx) => (
                            <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {review.status === 'scheduled' && (
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  Conduct Review
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                  Reschedule
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
