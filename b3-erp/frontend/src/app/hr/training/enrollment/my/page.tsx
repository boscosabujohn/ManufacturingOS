'use client';

import { useState } from 'react';
import { User, BookOpen, Calendar, Clock, Award, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import DataTable from '@/components/DataTable';

interface MyTraining {
  id: string;
  programCode: string;
  programTitle: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  attendance: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  instructor: string;
  location?: string;
  mode: string;
  certification: boolean;
}

export default function MyTrainingsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockTrainings: MyTraining[] = [
    {
      id: '1', programCode: 'TRN-TECH-001', programTitle: 'Advanced CNC Programming', category: 'Technical',
      startDate: '2024-11-15', endDate: '2024-12-15', duration: 40, progress: 0, attendance: 0,
      status: 'upcoming', instructor: 'Rajesh Kumar', location: 'Training Center A', mode: 'Hybrid', certification: true
    },
    {
      id: '2', programCode: 'TRN-SAFE-001', programTitle: 'Workplace Safety & OSHA Compliance', category: 'Safety',
      startDate: '2024-10-01', endDate: '2024-10-20', duration: 16, progress: 75, attendance: 88,
      status: 'ongoing', instructor: 'Suresh Patel', location: 'Training Center B', mode: 'Classroom', certification: true
    },
    {
      id: '3', programCode: 'TRN-QUAL-001', programTitle: 'Quality Management Systems (ISO 9001)', category: 'Quality',
      startDate: '2024-08-01', endDate: '2024-09-15', duration: 24, progress: 100, attendance: 95,
      status: 'completed', instructor: 'Meena Rao', location: 'Training Center A', mode: 'Hybrid', certification: true
    },
    {
      id: '4', programCode: 'TRN-TECH-002', programTitle: 'Lean Manufacturing Fundamentals', category: 'Technical',
      startDate: '2024-09-10', endDate: '2024-10-05', duration: 20, progress: 100, attendance: 100,
      status: 'completed', instructor: 'Vikram Mehta', mode: 'Online', certification: true
    },
    {
      id: '5', programCode: 'TRN-SOFT-001', programTitle: 'Effective Communication Skills', category: 'Soft Skills',
      startDate: '2024-10-15', endDate: '2024-11-10', duration: 12, progress: 60, attendance: 90,
      status: 'ongoing', instructor: 'Anjali Nair', mode: 'Online', certification: false
    },
    {
      id: '6', programCode: 'TRN-LEAD-001', programTitle: 'Leadership & Team Management', category: 'Leadership',
      startDate: '2024-07-01', endDate: '2024-08-15', duration: 32, progress: 100, attendance: 92,
      status: 'completed', instructor: 'Priya Sharma', location: 'Training Center C', mode: 'Classroom', certification: false
    }
  ];

  const filteredTrainings = mockTrainings.filter(training => {
    return selectedStatus === 'all' || training.status === selectedStatus;
  });

  const stats = {
    total: mockTrainings.length,
    ongoing: mockTrainings.filter(t => t.status === 'ongoing').length,
    completed: mockTrainings.filter(t => t.status === 'completed').length,
    upcoming: mockTrainings.filter(t => t.status === 'upcoming').length,
    totalHours: mockTrainings.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.duration, 0),
    certifications: mockTrainings.filter(t => t.status === 'completed' && t.certification).length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      upcoming: 'Upcoming',
      ongoing: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status as keyof typeof labels];
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const columns = [
    { key: 'programCode', label: 'Program', sortable: true,
      render: (v: string, row: MyTraining) => (
        <div>
          <div className="font-semibold text-gray-900">{row.programTitle}</div>
          <div className="text-xs text-gray-500">{v} • {row.category}</div>
        </div>
      )
    },
    { key: 'startDate', label: 'Duration', sortable: true,
      render: (v: string, row: MyTraining) => (
        <div className="text-sm text-gray-700">
          <div>{new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - </div>
          <div>{new Date(row.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      )
    },
    { key: 'duration', label: 'Hours', sortable: true,
      render: (v: number) => <div className="text-sm text-gray-700">{v}h</div>
    },
    { key: 'progress', label: 'Progress', sortable: true,
      render: (v: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
            <div className={`h-2 rounded-full ${getProgressColor(v)}`} style={{ width: `${v}%` }} />
          </div>
          <span className="text-sm font-semibold text-gray-900">{v}%</span>
        </div>
      )
    },
    { key: 'attendance', label: 'Attendance', sortable: true,
      render: (v: number) => <div className="text-sm text-gray-700">{v}%</div>
    },
    { key: 'instructor', label: 'Instructor', sortable: true,
      render: (v: string) => <div className="text-sm text-gray-700">{v}</div>
    },
    { key: 'status', label: 'Status', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(v)}`}>
          {getStatusLabel(v)}
        </span>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <User className="h-8 w-8 text-purple-600" />
          My Trainings
        </h1>
        <p className="text-gray-600 mt-2">Track your enrolled training programs and progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Trainings</p>
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
            </div>
            <BookOpen className="h-10 w-10 text-purple-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.ongoing}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
            </div>
            <Calendar className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Training Hours</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalHours}h</p>
            </div>
            <Clock className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Certifications</p>
              <p className="text-2xl font-bold text-orange-600">{stats.certifications}</p>
            </div>
            <Award className="h-10 w-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Alert for ongoing trainings */}
      {stats.ongoing > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-900">Active Trainings</h3>
              <p className="text-sm text-yellow-700">
                You have {stats.ongoing} training program(s) in progress. Keep up with your attendance and assignments!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Trainings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Enrolled Programs</h3>
        </div>
        <DataTable data={filteredTrainings} columns={columns} />
      </div>

      {/* Completed Certifications */}
      {stats.certifications > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Earned Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTrainings
              .filter(t => t.status === 'completed' && t.certification)
              .map(training => (
                <div key={training.id} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-start gap-3">
                    <Award className="h-8 w-8 text-purple-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{training.programTitle}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Completed: {new Date(training.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-600">Duration: {training.duration} hours</p>
                      <button className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Download Certificate →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">Training Participation Guidelines</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Maintain at least 80% attendance to be eligible for certification</li>
          <li>• Complete all assignments and assessments within the deadline</li>
          <li>• Actively participate in classroom discussions and activities</li>
          <li>• For online trainings, ensure you complete all modules in sequence</li>
          <li>• Contact your instructor or HR if you face any challenges</li>
          <li>• Certificates are issued within 7 days of successful completion</li>
        </ul>
      </div>
    </div>
  );
}
