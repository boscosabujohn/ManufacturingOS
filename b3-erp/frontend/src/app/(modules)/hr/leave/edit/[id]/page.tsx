'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Calendar,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  FileText,
  UserCheck,
  Upload,
  X,
  Download,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  contactDuringLeave: string;
  emergencyContact: string;
  emergencyPhone: string;
  handoverTo: string;
  handoverNotes: string;
  attachments: string[];
}

export default function EditLeavePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Mock data - replace with API call
  const [leaveRequest] = useState<LeaveRequest>({
    id: params.id,
    employeeId: 'B3-0001',
    employeeName: 'Rajesh Kumar',
    department: 'Production',
    position: 'Production Supervisor',
    email: 'rajesh.kumar@b3erp.com',
    phone: '+91 98765 43210',
    leaveType: 'Casual Leave',
    startDate: '2025-11-01',
    endDate: '2025-11-05',
    totalDays: 5,
    reason: 'Family function',
    status: 'pending',
    contactDuringLeave: '+91 98765 43210',
    emergencyContact: 'Priya Kumar',
    emergencyPhone: '+91 98765 43211',
    handoverTo: 'Amit Sharma',
    handoverNotes: 'Complete pending work orders WO-2025-001 and WO-2025-002. Review daily production reports.',
    attachments: ['invitation.pdf', 'travel-booking.pdf'],
  });

  const [formData, setFormData] = useState({
    leaveType: leaveRequest.leaveType,
    startDate: leaveRequest.startDate,
    endDate: leaveRequest.endDate,
    reason: leaveRequest.reason,
    contactDuringLeave: leaveRequest.contactDuringLeave,
    emergencyContact: leaveRequest.emergencyContact,
    emergencyPhone: leaveRequest.emergencyPhone,
    handoverTo: leaveRequest.handoverTo,
    handoverNotes: leaveRequest.handoverNotes,
  });

  const [attachments, setAttachments] = useState<string[]>(leaveRequest.attachments);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const leaveTypes = [
    'Casual Leave',
    'Sick Leave',
    'Privilege Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Compassionate Leave',
    'Loss of Pay',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate total days when dates change
    if (field === 'startDate' || field === 'endDate') {
      const start = field === 'startDate' ? new Date(value) : new Date(formData.startDate);
      const end = field === 'endDate' ? new Date(value) : new Date(formData.endDate);
      if (start && end && end >= start) {
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        console.log('Total days:', days);
      }
    }
  };

  const calculateTotalDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return 0;
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setAttachments(prev => [...prev, file.name]);
      }
    };
    input.click();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    if (formData.contactDuringLeave && !/^[+]?[\d\s-]{10,}$/.test(formData.contactDuringLeave)) {
      newErrors.contactDuringLeave = 'Invalid phone number';
    }

    if (formData.emergencyPhone && !/^[+]?[\d\s-]{10,}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = 'Invalid phone number';
    }

    if (!formData.handoverTo) {
      newErrors.handoverTo = 'Handover person is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix all errors before submitting');
      return;
    }

    // API call would go here
    console.log('Updating leave request:', {
      id: params.id,
      ...formData,
      totalDays: calculateTotalDays(),
      attachments,
    });

    alert('Leave request updated successfully!');
    router.push(`/hr/leave/view/${params.id}`);
  };

  const totalDays = calculateTotalDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Leave Request</h1>
              <p className="text-gray-600 mt-1">Leave ID: {params.id}</p>
            </div>
          </div>
        </div>

        {/* Employee Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Employee Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-600">Employee ID</label>
              <p className="font-semibold text-gray-900">{leaveRequest.employeeId}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Employee Name</label>
              <p className="font-semibold text-gray-900">{leaveRequest.employeeName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Department</label>
              <p className="font-semibold text-gray-900">{leaveRequest.department}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Position</label>
              <p className="font-semibold text-gray-900">{leaveRequest.position}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {leaveRequest.email}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {leaveRequest.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Leave Request Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Leave Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type *
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => handleInputChange('leaveType', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.leaveType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.leaveType && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.leaveType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Days
                </label>
                <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold text-gray-900">
                  {totalDays} {totalDays === 1 ? 'day' : 'days'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  min={formData.startDate}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.endDate}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  rows={4}
                  placeholder="Please provide a detailed reason for your leave request"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.reason}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number During Leave
                </label>
                <input
                  type="tel"
                  value={formData.contactDuringLeave}
                  onChange={(e) => handleInputChange('contactDuringLeave', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contactDuringLeave ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactDuringLeave && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.contactDuringLeave}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact person"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  placeholder="+91 98765 43211"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.emergencyPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.emergencyPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Handover Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Handover Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Handover To *
                </label>
                <input
                  type="text"
                  value={formData.handoverTo}
                  onChange={(e) => handleInputChange('handoverTo', e.target.value)}
                  placeholder="Employee name to handover responsibilities"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.handoverTo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.handoverTo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.handoverTo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Handover Notes
                </label>
                <textarea
                  value={formData.handoverNotes}
                  onChange={(e) => handleInputChange('handoverNotes', e.target.value)}
                  rows={4}
                  placeholder="Provide detailed handover instructions and pending tasks"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Supporting Documents
            </h3>

            <div className="space-y-4">
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{file}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleAddAttachment}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <Upload className="w-5 h-5" />
                Upload Document
              </button>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
              </p>
            </div>
          </div>

          {/* Status Banner */}
          {leaveRequest.status === 'approved' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Approved Leave Request</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This leave request has been approved. Any changes will require re-approval.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Save className="w-4 h-4" />
              Update Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
