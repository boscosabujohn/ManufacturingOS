'use client';

import { useState, useMemo } from 'react';
import { MessageSquare, CheckCircle, Clock, FileText, Send } from 'lucide-react';

interface ExitInterview {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  lastWorkingDay: string;
  interviewDate?: string;
  status: 'scheduled' | 'completed' | 'pending';
  interviewer?: string;
  feedback?: {
    reasonForLeaving: string;
    workEnvironment: number;
    management: number;
    compensation: number;
    careerGrowth: number;
    workLifeBalance: number;
    wouldRecommend: boolean;
    additionalComments: string;
  };
}

export default function ExitInterviewPage() {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'scheduled' | 'completed'>('pending');
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);

  const mockInterviews: ExitInterview[] = [
    {
      id: 'EXIT001',
      employeeId: 'EMP001',
      employeeName: 'Rahul Sharma',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      lastWorkingDay: '2025-12-14',
      status: 'scheduled',
      interviewDate: '2025-12-10',
      interviewer: 'Priya Singh - HR Manager'
    },
    {
      id: 'EXIT002',
      employeeId: 'EMP002',
      employeeName: 'Priya Singh',
      designation: 'Marketing Manager',
      department: 'Marketing',
      lastWorkingDay: '2025-11-19',
      status: 'pending'
    },
    {
      id: 'EXIT003',
      employeeId: 'EMP003',
      employeeName: 'Amit Kumar',
      designation: 'Product Manager',
      department: 'Product',
      lastWorkingDay: '2025-10-20',
      status: 'completed',
      interviewDate: '2025-10-18',
      interviewer: 'Priya Singh - HR Manager',
      feedback: {
        reasonForLeaving: 'Better opportunity with higher compensation and leadership role',
        workEnvironment: 4,
        management: 4,
        compensation: 3,
        careerGrowth: 3,
        workLifeBalance: 5,
        wouldRecommend: true,
        additionalComments: 'Great team culture and work-life balance. However, limited growth opportunities in current role. Would recommend to others for mid-level positions.'
      }
    }
  ];

  const filteredInterviews = useMemo(() => {
    return mockInterviews.filter(interview => interview.status === selectedTab);
  }, [selectedTab]);

  const stats = {
    pending: mockInterviews.filter(i => i.status === 'pending').length,
    scheduled: mockInterviews.filter(i => i.status === 'scheduled').length,
    completed: mockInterviews.filter(i => i.status === 'completed').length
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700'
  };

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    scheduled: <FileText className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exit Interview</h1>
        <p className="text-sm text-gray-600 mt-1">Conduct and track exit interviews with departing employees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.scheduled}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
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
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setSelectedTab('scheduled')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'scheduled'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Scheduled ({stats.scheduled})
        </button>
        <button
          onClick={() => setSelectedTab('completed')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            selectedTab === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Completed ({stats.completed})
        </button>
      </div>

      <div className="space-y-4">
        {filteredInterviews.map(interview => (
          <div key={interview.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{interview.employeeName}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[interview.status]}`}>
                    <span className="inline-flex items-center gap-1">
                      {statusIcons[interview.status]}
                      {interview.status.toUpperCase()}
                    </span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">{interview.designation} • {interview.department}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Last Working Day: {new Date(interview.lastWorkingDay).toLocaleDateString('en-IN')}
                </p>
                {interview.interviewDate && (
                  <p className="text-xs text-gray-500">
                    Interview Date: {new Date(interview.interviewDate).toLocaleDateString('en-IN')}
                  </p>
                )}
                {interview.interviewer && (
                  <p className="text-xs text-gray-500">Interviewer: {interview.interviewer}</p>
                )}
              </div>
            </div>

            {interview.feedback && interview.status === 'completed' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Exit Interview Feedback</h4>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">Reason for Leaving</p>
                    <p className="text-sm text-gray-900">{interview.feedback.reasonForLeaving}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Work Environment</p>
                      {renderRating(interview.feedback.workEnvironment)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Management</p>
                      {renderRating(interview.feedback.management)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Compensation</p>
                      {renderRating(interview.feedback.compensation)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Career Growth</p>
                      {renderRating(interview.feedback.careerGrowth)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Work-Life Balance</p>
                      {renderRating(interview.feedback.workLifeBalance)}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">Would Recommend</p>
                      <p className={`text-sm font-semibold ${interview.feedback.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                        {interview.feedback.wouldRecommend ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">Additional Comments</p>
                    <p className="text-sm text-gray-900">{interview.feedback.additionalComments}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {interview.status === 'pending' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Schedule Interview
                </button>
              )}
              {interview.status === 'scheduled' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                  <Send className="inline h-4 w-4 mr-2" />
                  Conduct Interview
                </button>
              )}
              {interview.status === 'completed' && (
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-sm">
                  <FileText className="inline h-4 w-4 mr-2" />
                  Download Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
