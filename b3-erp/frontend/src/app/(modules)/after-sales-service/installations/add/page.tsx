'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Save,
  X,
  Plus,
  Trash2,
  Search,
  Calendar,
  Clock,
  Users,
  Info
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: 'Lead' | 'Technician' | 'Helper';
}

interface Equipment {
  id: string;
  name: string;
  quantity: number;
  serialNumbers: string;
}

export default function AddInstallationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [jobNumber, setJobNumber] = useState('INS-2025-AUTO');
  const [status, setStatus] = useState<'Scheduled' | 'Draft'>('Draft');
  const [priority, setPriority] = useState<'Standard' | 'Urgent' | 'Express'>('Standard');

  // Customer Details
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Installation Details
  const [installationType, setInstallationType] = useState<'New Installation' | 'Replacement' | 'Upgrade'>('New Installation');
  const [installationAddress, setInstallationAddress] = useState('');

  // Schedule
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('4');

  // Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: '', role: 'Lead' }
  ]);

  // Equipment
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: '1', name: '', quantity: 1, serialNumbers: '' }
  ]);

  // Additional Details
  const [siteRequirements, setSiteRequirements] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Site Survey
  const [requiresSiteSurvey, setRequiresSiteSurvey] = useState(false);
  const [siteSurveyCompleted, setSiteSurveyCompleted] = useState(false);
  const [siteSurveyDate, setSiteSurveyDate] = useState('');

  // Mock customer list
  const mockCustomers = [
    {
      id: 'CUST-001',
      name: 'Sharma Kitchens Pvt Ltd',
      contact: 'Rajesh Sharma',
      phone: '+91-98765-43210',
      email: 'rajesh.sharma@sharmakitchens.com',
      address: '123, MG Road, Koramangala, Bangalore - 560034'
    },
    {
      id: 'CUST-002',
      name: 'Prestige Developers',
      contact: 'Priya Menon',
      phone: '+91-98765-43211',
      email: 'priya@prestigedev.com',
      address: '45, Brigade Road, Mumbai - 400001'
    }
  ];

  // Mock engineers
  const mockEngineers = [
    'Rajesh Kumar', 'Amit Patel', 'Priya Singh', 'Suresh Reddy', 'Neha Sharma',
    'Vikram Rao', 'Anjali Gupta', 'Karthik Menon'
  ];

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { id: Date.now().toString(), name: '', role: 'Technician' }]);
  };

  const removeTeamMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
    }
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: any) => {
    setTeamMembers(teamMembers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addEquipment = () => {
    setEquipment([...equipment, { id: Date.now().toString(), name: '', quantity: 1, serialNumbers: '' }]);
  };

  const removeEquipment = (id: string) => {
    if (equipment.length > 1) {
      setEquipment(equipment.filter(e => e.id !== id));
    }
  };

  const updateEquipment = (id: string, field: keyof Equipment, value: any) => {
    setEquipment(equipment.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/after-sales-service/installations');
    }, 1500);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Installation</h1>
            <p className="text-sm text-gray-500 mt-1">Create new installation job</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Schedule Installation'}
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Number</label>
              <input
                type="text"
                value={jobNumber}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation Type <span className="text-red-500">*</span>
              </label>
              <select
                value={installationType}
                onChange={(e) => setInstallationType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="New Installation">New Installation</option>
                <option value="Replacement">Replacement</option>
                <option value="Upgrade">Upgrade</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Standard">Standard</option>
                <option value="Urgent">Urgent</option>
                <option value="Express">Express (24h)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Customer <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type to search customer..."
                required
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              {customerName && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {mockCustomers
                    .filter(c => c.name.toLowerCase().includes(customerName.toLowerCase()))
                    .map(customer => (
                      <div
                        key={customer.id}
                        onClick={() => {
                          setCustomerId(customer.id);
                          setCustomerName(customer.name);
                          setContactPerson(customer.contact);
                          setContactPhone(customer.phone);
                          setContactEmail(customer.email);
                          setInstallationAddress(customer.address);
                        }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.id}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={installationAddress}
                onChange={(e) => setInstallationAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration (hours) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Installation Team */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Installation Team</h2>
            <button
              type="button"
              onClick={addTeamMember}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={member.name}
                      onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Engineer</option>
                      {mockEngineers.map(eng => (
                        <option key={eng} value={eng}>{eng}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={member.role}
                      onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Lead">Team Lead</option>
                      <option value="Technician">Technician</option>
                      <option value="Helper">Helper</option>
                    </select>
                  </div>
                </div>
                {teamMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTeamMember(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Equipment to Install */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Equipment to Install</h2>
            <button
              type="button"
              onClick={addEquipment}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Equipment
            </button>
          </div>

          <div className="space-y-3">
            {equipment.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-md p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Equipment Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateEquipment(item.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Commercial Gas Range - 6 Burner"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateEquipment(item.id, 'quantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Serial Numbers <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.serialNumbers}
                        onChange={(e) => updateEquipment(item.id, 'serialNumbers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Comma-separated serial numbers"
                        required
                      />
                    </div>
                  </div>
                  {equipment.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEquipment(item.id)}
                      className="text-red-600 hover:text-red-700 mt-6"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Site Survey */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Survey</h2>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={requiresSiteSurvey}
                  onChange={(e) => setRequiresSiteSurvey(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Requires site survey before installation</span>
              </label>
            </div>

            {requiresSiteSurvey && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={siteSurveyCompleted}
                      onChange={(e) => setSiteSurveyCompleted(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Site survey completed</span>
                  </label>
                </div>
                {siteSurveyCompleted && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Survey Date</label>
                    <input
                      type="date"
                      value={siteSurveyDate}
                      onChange={(e) => setSiteSurveyDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Requirements</label>
              <textarea
                value={siteRequirements}
                onChange={(e) => setSiteRequirements(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Power requirements, space constraints, access instructions, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Special handling, customer preferences, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Internal notes (not visible to customer)"
              />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Installation Scheduling Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Ensure site survey is completed for complex installations</li>
                <li>Assign team lead with appropriate expertise</li>
                <li>Verify all equipment serial numbers before scheduling</li>
                <li>Customer will receive installation confirmation via SMS and email</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Installation'}
          </button>
        </div>
      </form>
    </div>
  );
}
