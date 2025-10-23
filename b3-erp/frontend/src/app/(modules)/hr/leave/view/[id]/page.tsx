'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy: string;
  approvedDate: string;
  rejectionReason: string;
  contactDuringLeave: string;
  emergencyContact: string;
  handoverTo: string;
  handoverNotes: string;
  attachments: string[];
}

export default function ViewLeavePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'documents' | 'insights'>('details');

  // Mock leave request data
  const leaveRequest: LeaveRequest = {
    id: params.id,
    employeeId: 'B3-001',
    employeeName: 'Rajesh Kumar',
    department: 'Production',
    position: 'Production Manager',
    leaveType: 'Sick Leave',
    startDate: '2024-01-22',
    endDate: '2024-01-24',
    totalDays: 3,
    reason: 'Medical treatment and recovery required',
    status: 'approved',
    appliedDate: '2024-01-20',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-01-20 14:30',
    rejectionReason: '',
    contactDuringLeave: '+91 98765 43210',
    emergencyContact: '+91 98765 43212',
    handoverTo: 'Amit Patel',
    handoverNotes: 'Daily production reports to be reviewed. Any critical issues to be escalated to VP Operations.',
    attachments: ['Medical Certificate.pdf', 'Doctor Note.jpg'],
  };

  // Mock leave history
  const leaveHistory = [
    { date: '2024-01-20 14:30', action: 'Approved by Sarah Johnson', user: 'Sarah Johnson', type: 'success' },
    { date: '2024-01-20 10:15', action: 'Leave request submitted', user: 'Rajesh Kumar', type: 'info' },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-4 h-4" /> };
      case 'pending':
        return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-4 h-4" /> };
      case 'rejected':
        return { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: null };
    }
  };

  const statusConfig = getStatusConfig(leaveRequest.status);

  const handleEdit = () => {
    router.push(`/hr/leave/edit/${params.id}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this leave request?')) {
      router.push('/hr/leave');
    }
  };

  const handleBack = () => {
    router.push('/hr/leave');
  };

  const handleApprove = () => {
    if (confirm('Are you sure you want to approve this leave request?')) {
      // API call to approve
      alert('Leave request approved!');
    }
  };

  const handleReject = () => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      // API call to reject
      alert('Leave request rejected!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Leave Request</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${statusConfig.color}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                {leaveRequest.leaveType} • {leaveRequest.employeeName}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {leaveRequest.status === 'pending' && (
              <>
                <button
                  onClick={handleReject}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 font-medium transition-all flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
              </>
            )}
            <button
              onClick={handleEdit}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 font-medium transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <Calendar className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{leaveRequest.totalDays}</div>
            <div className="text-blue-100 text-sm">Days Requested</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <FileText className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-3xl font-bold mb-1">{leaveRequest.leaveType}</div>
            <div className="text-purple-100 text-sm">Leave Type</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
            <User className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-2xl font-bold mb-1">{leaveRequest.department}</div>
            <div className="text-green-100 text-sm">Department</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
            <Clock className="w-8 h-8 mb-3 opacity-80" />
            <div className="text-2xl font-bold mb-1">
              {new Date(leaveRequest.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
            <div className="text-orange-100 text-sm">Applied Date</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Leave Details
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'documents'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'insights'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Insights & Analytics
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Employee Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Employee Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Employee Name</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.employeeName}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Employee ID</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.employeeId}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Department</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.department}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Position</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.position}</div>
                    </div>
                  </div>
                </div>

                {/* Leave Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Leave Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Leave Type</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.leaveType}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Days</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.totalDays} days</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Start Date</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(leaveRequest.startDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">End Date</div>
                      <div className="font-semibold text-gray-900">
                        {new Date(leaveRequest.endDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Reason</div>
                      <div className="text-gray-900">{leaveRequest.reason}</div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Contact During Leave</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.contactDuringLeave}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Emergency Contact</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.emergencyContact}</div>
                    </div>
                  </div>
                </div>

                {/* Handover Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Handover Details
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Handover To</div>
                      <div className="font-semibold text-gray-900">{leaveRequest.handoverTo}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Handover Notes</div>
                      <div className="text-gray-900">{leaveRequest.handoverNotes}</div>
                    </div>
                  </div>
                </div>

                {/* Approval Information */}
                {leaveRequest.status !== 'pending' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      {leaveRequest.status === 'approved' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      {leaveRequest.status === 'approved' ? 'Approval' : 'Rejection'} Information
                    </h3>
                    <div className={`p-4 rounded-lg border-2 ${
                      leaveRequest.status === 'approved'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            {leaveRequest.status === 'approved' ? 'Approved By' : 'Rejected By'}
                          </div>
                          <div className="font-semibold text-gray-900">{leaveRequest.approvedBy}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Date</div>
                          <div className="font-semibold text-gray-900">{leaveRequest.approvedDate}</div>
                        </div>
                        {leaveRequest.rejectionReason && (
                          <div className="col-span-2">
                            <div className="text-sm text-gray-600 mb-1">Rejection Reason</div>
                            <div className="text-gray-900">{leaveRequest.rejectionReason}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Request History</h3>
                <div className="space-y-4">
                  {leaveHistory.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {item.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        {index < leaveHistory.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="text-sm text-gray-600 mb-1">{item.date}</div>
                        <div className="font-semibold text-gray-900">{item.action}</div>
                        <div className="text-sm text-gray-600">by {item.user}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Attached Documents</h3>
                {leaveRequest.attachments.length > 0 ? (
                  <div className="space-y-3">
                    {leaveRequest.attachments.map((doc, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-gray-900">{doc}</span>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No documents attached</p>
                  </div>
                )}
              </div>
            )}

            {/* Insights & Analytics Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Insights & Analytics</h3>

                {/* Leave Balance Forecast */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Leave Balance Forecast
                  </h4>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-1">24</div>
                      <div className="text-sm text-gray-600">Total Annual</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-3xl font-bold text-red-600 mb-1">7</div>
                      <div className="text-sm text-gray-600">Used YTD</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-1">17</div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-1">2</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">Casual Leave</span>
                        <span className="font-semibold">8 / 12 remaining</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '67%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">Sick Leave</span>
                        <span className="font-semibold">6 / 8 remaining</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">Earned Leave</span>
                        <span className="font-semibold">3 / 4 remaining</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Availability Heatmap */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Team Availability During Leave Period
                  </h4>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['22 Jan', '23 Jan', '24 Jan', '25 Jan', '26 Jan', '27 Jan', '28 Jan'].map((date, idx) => (
                      <div key={date} className="text-center">
                        <div className="text-xs text-gray-600 mb-2">{date}</div>
                        <div className={`h-20 rounded-lg flex items-center justify-center font-bold text-sm ${
                          idx >= 0 && idx <= 2 ? 'bg-red-200 text-red-700' :
                          idx === 5 || idx === 6 ? 'bg-gray-200 text-gray-600' :
                          'bg-green-200 text-green-700'
                        }`}>
                          {idx >= 0 && idx <= 2 ? '65%' :
                           idx === 5 || idx === 6 ? 'WO' :
                           '92%'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {idx >= 0 && idx <= 2 ? '7/12 present' :
                           idx === 5 || idx === 6 ? 'Weekend' :
                           '11/12 present'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Team Coverage Alert</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Team availability drops to 65% during leave period (Jan 22-24). Consider staggering leaves or arranging backup coverage.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval Workflow Visualizer */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    Approval Workflow Status
                  </h4>
                  <div className="space-y-4">
                    {[
                      { stage: 'Employee Submission', status: 'completed', user: 'Rajesh Kumar', date: 'Jan 20, 10:15 AM', time: '0h' },
                      { stage: 'Manager Review', status: 'completed', user: 'Sarah Johnson', date: 'Jan 20, 2:30 PM', time: '4h 15m' },
                      { stage: 'HR Verification', status: 'completed', user: 'Priya Patel', date: 'Jan 20, 3:45 PM', time: '1h 15m' },
                      { stage: 'Final Approval', status: 'completed', user: 'Sarah Johnson', date: 'Jan 20, 4:00 PM', time: '15m' },
                    ].map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-green-100' :
                            step.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            {step.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                          {idx < 3 && (
                            <div className={`w-0.5 h-12 my-1 ${
                              step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="font-semibold text-gray-900">{step.stage}</div>
                          <div className="text-sm text-gray-600 mt-1">{step.user}</div>
                          <div className="text-xs text-gray-500 mt-1">{step.date}</div>
                          <div className="text-xs text-purple-600 mt-1 font-medium">Turnaround: {step.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">Total Approval Time</div>
                        <div className="text-sm text-gray-600">From submission to final approval</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">5h 45m</div>
                    </div>
                  </div>
                </div>

                {/* Policy Compliance Check */}
                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    Policy Compliance Check
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">Advance Notice Met</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Leave applied 2 days in advance (policy requires 1 day minimum for sick leave)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">Balance Available</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Sufficient sick leave balance (6 days remaining, 3 days requested)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">Medical Certificate Attached</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Required documentation provided (policy mandates certificate for sick leave ≥ 3 days)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">Handover Completed</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Work handover assigned to Amit Patel with detailed notes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Integration Preview */}
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Calendar Integration
                  </h4>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    <div className="text-center font-semibold text-gray-700 text-xs">Sun</div>
                    <div className="text-center font-semibold text-gray-700 text-xs">Mon</div>
                    <div className="text-center font-semibold text-gray-700 text-xs">Tue</div>
                    <div className="text-center font-semibold text-gray-700 text-xs">Wed</div>
                    <div className="text-center font-semibold text-gray-700 text-xs">Thu</div>
                    <div className="text-center font-semibold text-gray-700 text-xs">Fri</div>
                    <div className="text-center font-semibold text-gray-700 text-xs">Sat</div>
                    {[...Array(31)].map((_, idx) => {
                      const isLeaveDay = idx >= 21 && idx <= 23;
                      const isWeekend = idx % 7 === 0 || idx % 7 === 6;
                      return (
                        <div
                          key={idx}
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                            isLeaveDay ? 'bg-red-500 text-white' :
                            isWeekend ? 'bg-gray-200 text-gray-500' :
                            'bg-white border border-gray-200 text-gray-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-gray-700">Leave Days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <span className="text-gray-700">Weekends</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                      <span className="text-gray-700">Working Days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
