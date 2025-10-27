'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  X,
  Plus,
  Trash2,
  Building2,
  User,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Package,
} from 'lucide-react';

interface TeamMember {
  id: string;
  role: string;
  name: string;
  allocation: number;
}

interface Deliverable {
  id: string;
  name: string;
  type: string;
  plannedDate: string;
}

export default function CreateProjectPage() {
  const router = useRouter();

  // Basic Information
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Commercial Kitchen');
  const [salesOrderNumber, setSalesOrderNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Timeline & Budget
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [currency, setCurrency] = useState('INR');

  // Project Management
  const [projectManager, setProjectManager] = useState('');
  const [priority, setPriority] = useState('P2');
  const [department, setDepartment] = useState('Project Management');

  // Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', role: 'Project Manager', name: '', allocation: 100 },
  ]);

  // Deliverables
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: '1', name: '', type: 'Equipment', plannedDate: '' },
  ]);

  // Scope & Requirements
  const [scope, setScope] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [safetyRequirements, setSafetyRequirements] = useState('');

  // Functions
  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now().toString(),
        role: '',
        name: '',
        allocation: 100,
      },
    ]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: any) => {
    setTeamMembers(teamMembers.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const addDeliverable = () => {
    setDeliverables([
      ...deliverables,
      {
        id: Date.now().toString(),
        name: '',
        type: 'Equipment',
        plannedDate: '',
      },
    ]);
  };

  const removeDeliverable = (id: string) => {
    setDeliverables(deliverables.filter(del => del.id !== id));
  };

  const updateDeliverable = (id: string, field: keyof Deliverable, value: any) => {
    setDeliverables(deliverables.map(del =>
      del.id === id ? { ...del, [field]: value } : del
    ));
  };

  const calculateDuration = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `${diff} days` : 'Invalid date range';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      projectName,
      projectType,
      salesOrderNumber,
      customerId,
      customerName,
      location,
      description,
      startDate,
      endDate,
      estimatedBudget,
      contractValue,
      currency,
      projectManager,
      priority,
      department,
      teamMembers,
      deliverables,
      scope,
      specialRequirements,
      safetyRequirements,
    });
    // Redirect to project list or details page
    router.push('/project-management');
  };

  const handleCancel = () => {
    router.push('/project-management');
  };

  return (
    <div className="w-full h-screen overflow-y-auto overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Taj Hotel Commercial Kitchen Installation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Commercial Kitchen">Commercial Kitchen</option>
                  <option value="Cold Room">Cold Room</option>
                  <option value="Switchgear">Switchgear</option>
                  <option value="HVAC System">HVAC System</option>
                  <option value="Modular Kitchen">Modular Kitchen</option>
                  <option value="Food Processing">Food Processing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sales Order Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={salesOrderNumber}
                  onChange={(e) => setSalesOrderNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SO-2024-XXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer ID
                </label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CUST-XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Taj Hotels Limited"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mumbai, Maharashtra"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the project scope and objectives..."
                />
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Timeline & Budget</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {startDate && endDate && (
                <div className="md:col-span-2">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Project Duration:</span> {calculateDuration()}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Budget <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {estimatedBudget && contractValue && (
                <div className="md:col-span-2">
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-900">
                      <span className="font-semibold">Estimated Profit Margin:</span>{' '}
                      {(((parseFloat(contractValue) - parseFloat(estimatedBudget)) / parseFloat(contractValue)) * 100).toFixed(2)}%
                      {' '}(₹{(parseFloat(contractValue) - parseFloat(estimatedBudget)).toLocaleString('en-IN')})
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Project Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Manager <span className="text-red-500">*</span>
                </label>
                <select
                  value={projectManager}
                  onChange={(e) => setProjectManager(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Manager</option>
                  <option value="Rajesh Kumar">Rajesh Kumar</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                  <option value="Amit Patel">Amit Patel</option>
                  <option value="Sunita Reddy">Sunita Reddy</option>
                  <option value="Manoj Kumar">Manoj Kumar</option>
                  <option value="Neha Gupta">Neha Gupta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="P1">P1 - Critical</option>
                  <option value="P2">P2 - High</option>
                  <option value="P3">P3 - Medium</option>
                  <option value="P4">P4 - Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Project Management">Project Management</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              </div>
              <button
                type="button"
                onClick={addTeamMember}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="e.g., Site Supervisor"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Employee name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Allocation (%)</label>
                      <input
                        type="number"
                        value={member.allocation}
                        onChange={(e) => updateTeamMember(member.id, 'allocation', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(member.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                     
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Deliverables */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Key Deliverables</h2>
              </div>
              <button
                type="button"
                onClick={addDeliverable}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Deliverable
              </button>
            </div>

            <div className="space-y-3">
              {deliverables.map((deliverable) => (
                <div key={deliverable.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Deliverable Name</label>
                      <input
                        type="text"
                        value={deliverable.name}
                        onChange={(e) => updateDeliverable(deliverable.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="e.g., Equipment Installation"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={deliverable.type}
                        onChange={(e) => updateDeliverable(deliverable.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="Equipment">Equipment</option>
                        <option value="Installation">Installation</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Training">Training</option>
                        <option value="Service">Service</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Planned Date</label>
                      <input
                        type="date"
                        value={deliverable.plannedDate}
                        onChange={(e) => updateDeliverable(deliverable.id, 'plannedDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  {deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverable(deliverable.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                     
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scope & Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Scope & Requirements</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Scope
                </label>
                <textarea
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Define the project scope, inclusions, and exclusions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special client requirements, certifications needed, etc..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Safety Requirements
                </label>
                <textarea
                  value={safetyRequirements}
                  onChange={(e) => setSafetyRequirements(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Safety protocols, PPE requirements, site restrictions..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
