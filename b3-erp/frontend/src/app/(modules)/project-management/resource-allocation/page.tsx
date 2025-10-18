'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Save,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Search,
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  role: string;
  currentAllocation: number;
  availability: number;
  costRate: number;
  skills: string[];
}

interface Allocation {
  id: string;
  resourceId: string;
  resourceName: string;
  role: string;
  projectPhase: string;
  allocatedHours: number;
  startDate: string;
  endDate: string;
  allocation: number;
}

const mockResources: Resource[] = [
  { id: '1', name: 'Rajesh Kumar', role: 'Project Manager', currentAllocation: 100, availability: 0, costRate: 3500, skills: ['Project Planning', 'Leadership'] },
  { id: '2', name: 'Suresh Patel', role: 'Installation Supervisor', currentAllocation: 100, availability: 0, costRate: 2200, skills: ['Installation', 'Site Management'] },
  { id: '3', name: 'Ramesh Nair', role: 'Civil Engineer', currentAllocation: 50, availability: 50, costRate: 2400, skills: ['Civil Work', 'Site Survey'] },
  { id: '4', name: 'Anjali Verma', role: 'Quality Inspector', currentAllocation: 30, availability: 70, costRate: 2300, skills: ['Quality Control', 'ISO Standards'] },
  { id: '5', name: 'Amit Patel', role: 'Electrical Engineer', currentAllocation: 80, availability: 20, costRate: 2800, skills: ['Electrical', 'Switchgear'] },
  { id: '6', name: 'Vikram Singh', role: 'Installation Supervisor', currentAllocation: 100, availability: 0, costRate: 2200, skills: ['Installation', 'Cold Room'] },
  { id: '7', name: 'Deepak Joshi', role: 'Commissioning Engineer', currentAllocation: 90, availability: 10, costRate: 2600, skills: ['Commissioning', 'Testing'] },
  { id: '8', name: 'Neha Gupta', role: 'Project Coordinator', currentAllocation: 70, availability: 30, costRate: 2000, skills: ['Coordination', 'Documentation'] },
];

const mockAllocations: Allocation[] = [
  { id: '1', resourceId: '1', resourceName: 'Rajesh Kumar', role: 'Project Manager', projectPhase: 'Overall Management', allocatedHours: 2080, startDate: '2024-01-15', endDate: '2024-04-30', allocation: 100 },
  { id: '2', resourceId: '2', resourceName: 'Suresh Patel', role: 'Installation Supervisor', projectPhase: 'Equipment Installation', allocatedHours: 600, startDate: '2024-03-06', endDate: '2024-03-25', allocation: 100 },
  { id: '3', resourceId: '3', resourceName: 'Ramesh Nair', role: 'Civil Engineer', projectPhase: 'Civil Work & Site Prep', allocatedHours: 200, startDate: '2024-02-15', endDate: '2024-03-05', allocation: 50 },
  { id: '4', resourceId: '4', resourceName: 'Anjali Verma', role: 'Quality Inspector', projectPhase: 'Quality Control', allocatedHours: 120, startDate: '2024-02-21', endDate: '2024-04-20', allocation: 30 },
  { id: '5', resourceId: '5', resourceName: 'Amit Patel', role: 'Electrical Engineer', projectPhase: 'Electrical Infrastructure', allocatedHours: 320, startDate: '2024-02-25', endDate: '2024-03-25', allocation: 80 },
  { id: '6', resourceId: '7', resourceName: 'Deepak Joshi', role: 'Commissioning Engineer', projectPhase: 'Testing & Commissioning', allocatedHours: 360, startDate: '2024-03-26', endDate: '2024-04-20', allocation: 90 },
];

export default function ResourceAllocationPage() {
  const [resources] = useState<Resource[]>(mockResources);
  const [allocations, setAllocations] = useState<Allocation[]>(mockAllocations);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState('');
  const [newAllocation, setNewAllocation] = useState({
    projectPhase: '',
    allocatedHours: 0,
    startDate: '',
    endDate: '',
    allocation: 0,
  });

  const filteredResources = resources.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateResourceCost = (resource: Resource, hours: number) => {
    const days = hours / 8;
    return days * resource.costRate;
  };

  const totalAllocatedCost = allocations.reduce((sum, alloc) => {
    const resource = resources.find(r => r.id === alloc.resourceId);
    if (resource) {
      return sum + calculateResourceCost(resource, alloc.allocatedHours);
    }
    return sum;
  }, 0);

  const handleAddAllocation = () => {
    if (!selectedResource || !newAllocation.projectPhase) return;

    const resource = resources.find(r => r.id === selectedResource);
    if (!resource) return;

    const allocation: Allocation = {
      id: Date.now().toString(),
      resourceId: resource.id,
      resourceName: resource.name,
      role: resource.role,
      projectPhase: newAllocation.projectPhase,
      allocatedHours: newAllocation.allocatedHours,
      startDate: newAllocation.startDate,
      endDate: newAllocation.endDate,
      allocation: newAllocation.allocation,
    };

    setAllocations([...allocations, allocation]);
    setShowAddModal(false);
    setSelectedResource('');
    setNewAllocation({
      projectPhase: '',
      allocatedHours: 0,
      startDate: '',
      endDate: '',
      allocation: 0,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 50) return 'text-green-600';
    if (availability >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Allocation</h1>
          <p className="text-gray-600 mt-1">Manage team member allocation across project phases</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Allocate Resource
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Resources</p>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{resources.length}</p>
          <p className="text-sm text-gray-500 mt-1">{allocations.length} allocations</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Fully Allocated</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-900">
            {resources.filter(r => r.availability === 0).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">0% available</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Available</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900">
            {resources.filter(r => r.availability > 50).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">50%+ available</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Cost</p>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalAllocatedCost)}</p>
          <p className="text-sm text-gray-500 mt-1">Resource cost</p>
        </div>
      </div>

      {/* Resource Availability Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Resource Availability</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Allocation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {resource.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p className="font-medium text-gray-900">{resource.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{resource.role}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 w-24">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                resource.currentAllocation === 100 ? 'bg-red-500' :
                                resource.currentAllocation >= 70 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${resource.currentAllocation}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{resource.currentAllocation}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm font-semibold ${getAvailabilityColor(resource.availability)}`}>
                      {resource.availability}%
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{formatCurrency(resource.costRate)}/day</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Current Allocations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Current Allocations</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {allocations.map((allocation) => {
            const resource = resources.find(r => r.id === allocation.resourceId);
            const cost = resource ? calculateResourceCost(resource, allocation.allocatedHours) : 0;

            return (
              <div key={allocation.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{allocation.resourceName}</h3>
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                        {allocation.role}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {allocation.allocation}% allocated
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Project Phase</p>
                        <p className="text-sm font-medium text-gray-900">{allocation.projectPhase}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(allocation.startDate)} - {formatDate(allocation.endDate)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Allocated Hours</p>
                        <p className="text-sm font-medium text-gray-900">{allocation.allocatedHours} hours</p>
                        <p className="text-xs text-gray-500">{Math.round(allocation.allocatedHours / 8)} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Estimated Cost</p>
                        <p className="text-sm font-semibold text-purple-900">{formatCurrency(cost)}</p>
                      </div>
                    </div>
                  </div>

                  <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Allocation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Allocate Resource</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Resource</label>
                <select
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a resource</option>
                  {resources.filter(r => r.availability > 0).map(resource => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name} - {resource.role} ({resource.availability}% available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Phase</label>
                <input
                  type="text"
                  value={newAllocation.projectPhase}
                  onChange={(e) => setNewAllocation({ ...newAllocation, projectPhase: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Equipment Installation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newAllocation.startDate}
                    onChange={(e) => setNewAllocation({ ...newAllocation, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newAllocation.endDate}
                    onChange={(e) => setNewAllocation({ ...newAllocation, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allocated Hours</label>
                  <input
                    type="number"
                    value={newAllocation.allocatedHours}
                    onChange={(e) => setNewAllocation({ ...newAllocation, allocatedHours: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allocation %</label>
                  <input
                    type="number"
                    value={newAllocation.allocation}
                    onChange={(e) => setNewAllocation({ ...newAllocation, allocation: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAllocation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Allocate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
