'use client';

import { useState, useMemo } from 'react';
import { UserPlus, CheckCircle, Clock, AlertCircle, Calendar, Users, TrendingUp, FileText, ClipboardCheck, Award, Shield, Briefcase, Heart, Key, BookOpen, Package, IdCard, Eye, Play, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/DataTable';
import { toast } from '@/hooks/use-toast';

interface OnboardingCandidate {
  id: string;
  employeeCode: string;
  candidateName: string;
  designation: string;
  department: string;
  joiningDate: string;
  offerAcceptedDate: string;
  onboardingStatus: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  completionPercentage: number;
  daysToJoining: number;
  assignedBuddy?: string;
  documentsStatus: 'pending' | 'partial' | 'complete';
  verificationStatus: 'pending' | 'in_progress' | 'complete';
  accessProvisionStatus: 'pending' | 'in_progress' | 'complete';
  trainingStatus: 'not_started' | 'in_progress' | 'complete';
  location: string;
  reportingTo: string;
}

export default function Page() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<OnboardingCandidate | null>(null);

  const mockCandidates: OnboardingCandidate[] = [
    {
      id: '1', employeeCode: 'EMP-2024-101', candidateName: 'Arun Verma', designation: 'CNC Operator',
      department: 'Manufacturing', joiningDate: '2024-12-01', offerAcceptedDate: '2024-10-20',
      onboardingStatus: 'in_progress', completionPercentage: 65, daysToJoining: 15,
      assignedBuddy: 'Rajesh Kumar', documentsStatus: 'complete', verificationStatus: 'in_progress',
      accessProvisionStatus: 'pending', trainingStatus: 'not_started', location: 'Pune Factory',
      reportingTo: 'Rajesh Kumar'
    },
    {
      id: '2', employeeCode: 'EMP-2024-102', candidateName: 'Sneha Patil', designation: 'Quality Inspector',
      department: 'Quality Assurance', joiningDate: '2024-12-05', offerAcceptedDate: '2024-10-20',
      onboardingStatus: 'in_progress', completionPercentage: 80, daysToJoining: 19,
      assignedBuddy: 'Meena Rao', documentsStatus: 'complete', verificationStatus: 'complete',
      accessProvisionStatus: 'in_progress', trainingStatus: 'in_progress', location: 'Pune Factory',
      reportingTo: 'Meena Rao'
    },
    {
      id: '3', employeeCode: 'EMP-2024-103', candidateName: 'Karthik Reddy', designation: 'Production Supervisor',
      department: 'Manufacturing', joiningDate: '2024-11-25', offerAcceptedDate: '2024-10-14',
      onboardingStatus: 'completed', completionPercentage: 100, daysToJoining: 9,
      assignedBuddy: 'Suresh Patel', documentsStatus: 'complete', verificationStatus: 'complete',
      accessProvisionStatus: 'complete', trainingStatus: 'complete', location: 'Pune Factory',
      reportingTo: 'Rajesh Kumar'
    },
    {
      id: '4', employeeCode: 'EMP-2024-104', candidateName: 'Neha Singh', designation: 'Maintenance Technician',
      department: 'Maintenance', joiningDate: '2024-12-10', offerAcceptedDate: '2024-10-22',
      onboardingStatus: 'in_progress', completionPercentage: 45, daysToJoining: 24,
      assignedBuddy: 'Anil Verma', documentsStatus: 'partial', verificationStatus: 'pending',
      accessProvisionStatus: 'pending', trainingStatus: 'not_started', location: 'Pune Factory',
      reportingTo: 'Suresh Patel'
    },
    {
      id: '5', employeeCode: 'EMP-2024-105', candidateName: 'Divya Nair', designation: 'Safety Officer',
      department: 'Safety & Compliance', joiningDate: '2024-12-15', offerAcceptedDate: '2024-10-23',
      onboardingStatus: 'not_started', completionPercentage: 0, daysToJoining: 29,
      documentsStatus: 'pending', verificationStatus: 'pending',
      accessProvisionStatus: 'pending', trainingStatus: 'not_started', location: 'Pune Factory',
      reportingTo: 'Suresh Patel'
    },
    {
      id: '6', employeeCode: 'EMP-2024-106', candidateName: 'Priyanka Desai', designation: 'HR Executive',
      department: 'Human Resources', joiningDate: '2024-12-01', offerAcceptedDate: '2024-10-26',
      onboardingStatus: 'delayed', completionPercentage: 30, daysToJoining: 15,
      assignedBuddy: 'Priya Sharma', documentsStatus: 'partial', verificationStatus: 'pending',
      accessProvisionStatus: 'pending', trainingStatus: 'not_started', location: 'Pune Factory',
      reportingTo: 'Priya Sharma'
    }
  ];

  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(candidate => {
      const matchesStatus = selectedStatus === 'all' || candidate.onboardingStatus === selectedStatus;
      const matchesDepartment = selectedDepartment === 'all' || candidate.department === selectedDepartment;
      return matchesStatus && matchesDepartment;
    });
  }, [selectedStatus, selectedDepartment]);

  const stats = {
    totalCandidates: mockCandidates.length,
    notStarted: mockCandidates.filter(c => c.onboardingStatus === 'not_started').length,
    inProgress: mockCandidates.filter(c => c.onboardingStatus === 'in_progress').length,
    completed: mockCandidates.filter(c => c.onboardingStatus === 'completed').length,
    delayed: mockCandidates.filter(c => c.onboardingStatus === 'delayed').length,
    avgCompletion: Math.round(mockCandidates.reduce((sum, c) => sum + c.completionPercentage, 0) / mockCandidates.length),
    joiningThisWeek: mockCandidates.filter(c => c.daysToJoining <= 7).length
  };

  // Onboarding modules with links
  const onboardingModules = [
    { id: 'offers', name: 'Offer Letters', icon: FileText, path: '/hr/onboarding/offers', color: 'blue', description: 'Manage job offers' },
    { id: 'documents', name: 'Documents', icon: FileText, path: '/hr/onboarding/documents', color: 'indigo', description: 'Document collection' },
    { id: 'verification', name: 'Verification', icon: Shield, path: '/hr/onboarding/verification', color: 'purple', description: 'Background verification' },
    { id: 'checklist', name: 'Checklist', icon: ClipboardCheck, path: '/hr/onboarding/checklist', color: 'green', description: 'Onboarding tasks' },
    { id: 'access', name: 'Access & Systems', icon: Key, path: '/hr/onboarding/access', color: 'orange', description: 'System access setup' },
    { id: 'id-card', name: 'ID Cards', icon: IdCard, path: '/hr/onboarding/id-card', color: 'teal', description: 'Employee ID cards' },
    { id: 'welcome-kit', name: 'Welcome Kit', icon: Package, path: '/hr/onboarding/welcome-kit', color: 'pink', description: 'Welcome kit dispatch' },
    { id: 'training', name: 'Training', icon: BookOpen, path: '/hr/onboarding/training', color: 'yellow', description: 'Induction training' },
    { id: 'policies', name: 'Policies', icon: Award, path: '/hr/onboarding/policies', color: 'red', description: 'Company policies' },
    { id: 'medical', name: 'Medical', icon: Heart, path: '/hr/onboarding/medical', color: 'rose', description: 'Health checkup' },
    { id: 'first-day', name: 'First Day', icon: Calendar, path: '/hr/onboarding/first-day', color: 'cyan', description: 'First day schedule' },
    { id: 'induction-hr', name: 'HR Induction', icon: Users, path: '/hr/onboarding/induction/hr', color: 'violet', description: 'HR orientation' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      not_started: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      delayed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      not_started: Clock,
      in_progress: Play,
      completed: CheckCircle,
      delayed: AlertCircle
    };
    return icons[status as keyof typeof icons];
  };

  const getDocumentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      partial: 'bg-yellow-100 text-yellow-800',
      complete: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors];
  };

  const handleViewDetails = (candidate: OnboardingCandidate) => {
    setSelectedCandidate(candidate);
    setShowDetailsModal(true);
  };

  const handleStartOnboarding = (candidate: OnboardingCandidate) => {
    toast({
      title: "Onboarding Started",
      description: `Onboarding process initiated for ${candidate.candidateName}`
    });
  };

  const columns = [
    { key: 'employeeCode', label: 'Employee Code', sortable: true,
      render: (v: string) => <div className="font-mono font-semibold text-gray-900">{v}</div>
    },
    { key: 'candidateName', label: 'Candidate', sortable: true,
      render: (v: string, row: OnboardingCandidate) => (
        <div>
          <div className="font-medium text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">{row.designation}</div>
        </div>
      )
    },
    { key: 'department', label: 'Department', sortable: true,
      render: (v: string, row: OnboardingCandidate) => (
        <div>
          <div className="text-sm text-gray-900">{v}</div>
          <div className="text-xs text-gray-500">Reports to: {row.reportingTo}</div>
        </div>
      )
    },
    { key: 'joiningDate', label: 'Joining Date', sortable: true,
      render: (v: string, row: OnboardingCandidate) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div className={`text-xs ${row.daysToJoining <= 7 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
            {row.daysToJoining} days to go
          </div>
        </div>
      )
    },
    { key: 'completionPercentage', label: 'Progress', sortable: true,
      render: (v: number) => (
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-700 mb-1">
            <span>{v}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                v === 100 ? 'bg-green-600' :
                v >= 70 ? 'bg-blue-600' :
                v >= 40 ? 'bg-yellow-600' :
                'bg-red-600'
              }`}
              style={{ width: `${v}%` }}
            />
          </div>
        </div>
      )
    },
    { key: 'documentsStatus', label: 'Documents', sortable: true,
      render: (v: string) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDocumentStatusColor(v)}`}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </span>
      )
    },
    { key: 'onboardingStatus', label: 'Status', sortable: true,
      render: (v: string) => {
        const Icon = getStatusIcon(v);
        return (
          <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(v)}`}>
            <Icon className="h-3 w-3" />
            {v.replace('_', ' ').toUpperCase()}
          </span>
        );
      }
    },
    { key: 'actions', label: 'Actions', sortable: false,
      render: (_: any, row: OnboardingCandidate) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1 hover:bg-gray-100 rounded"
            title="View details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          {row.onboardingStatus === 'not_started' && (
            <button
              onClick={() => handleStartOnboarding(row)}
              className="p-1 hover:bg-blue-100 rounded"
              title="Start onboarding"
            >
              <Play className="h-4 w-4 text-blue-600" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserPlus className="h-8 w-8 text-blue-600" />
          Employee Onboarding Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Track and manage new employee onboarding process</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCandidates}</p>
            </div>
            <Users className="h-10 w-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Not Started</p>
              <p className="text-2xl font-bold text-gray-600">{stats.notStarted}</p>
            </div>
            <Clock className="h-10 w-10 text-gray-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Play className="h-10 w-10 text-blue-400" />
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
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delayed</p>
              <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgCompletion}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Joining Soon</p>
              <p className="text-2xl font-bold text-orange-600">{stats.joiningThisWeek}</p>
            </div>
            <Calendar className="h-10 w-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Onboarding Modules Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Onboarding Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {onboardingModules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => router.push(module.path)}
                className={`bg-white border-2 border-${module.color}-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 text-left`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 bg-${module.color}-100 rounded-lg`}>
                    <Icon className={`h-6 w-6 text-${module.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{module.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{module.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Safety & Compliance">Safety & Compliance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <DataTable data={filteredCandidates} columns={columns} />

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Onboarding Process Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Onboarding process should be initiated immediately after offer acceptance</li>
          <li>• All documents must be collected at least 7 days before joining date</li>
          <li>• Background verification should be completed before the joining date</li>
          <li>• System access and ID cards should be ready on the first day</li>
          <li>• Assign a buddy/mentor to help new employees during their first week</li>
          <li>• HR and department induction should be completed within the first week</li>
          <li>• Track completion percentage to ensure timely onboarding</li>
        </ul>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-blue-600" />
                Onboarding Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Employee Code</p>
                  <p className="font-mono font-semibold text-gray-900">{selectedCandidate.employeeCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Candidate Name</p>
                  <p className="font-semibold text-gray-900">{selectedCandidate.candidateName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-semibold text-gray-900">{selectedCandidate.designation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-900">{selectedCandidate.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedCandidate.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Days to Joining</p>
                  <p className={`font-semibold ${selectedCandidate.daysToJoining <= 7 ? 'text-red-600' : 'text-gray-900'}`}>
                    {selectedCandidate.daysToJoining} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reporting To</p>
                  <p className="font-semibold text-gray-900">{selectedCandidate.reportingTo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assigned Buddy</p>
                  <p className="font-semibold text-gray-900">{selectedCandidate.assignedBuddy || 'Not Assigned'}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Overall Progress</h3>
                <div className="w-full">
                  <div className="flex justify-between text-sm text-gray-700 mb-2">
                    <span>Completion</span>
                    <span className="font-bold">{selectedCandidate.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        selectedCandidate.completionPercentage === 100 ? 'bg-green-600' :
                        selectedCandidate.completionPercentage >= 70 ? 'bg-blue-600' :
                        selectedCandidate.completionPercentage >= 40 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${selectedCandidate.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Module Status</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Documents</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDocumentStatusColor(selectedCandidate.documentsStatus)}`}>
                      {selectedCandidate.documentsStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Verification</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDocumentStatusColor(selectedCandidate.verificationStatus)}`}>
                      {selectedCandidate.verificationStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Access Provision</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDocumentStatusColor(selectedCandidate.accessProvisionStatus)}`}>
                      {selectedCandidate.accessProvisionStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Training</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCandidate.trainingStatus)}`}>
                      {selectedCandidate.trainingStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    router.push(`/hr/onboarding/checklist`);
                    setShowDetailsModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  View Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
