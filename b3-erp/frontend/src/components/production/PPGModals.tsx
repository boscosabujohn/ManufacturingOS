'use client';

import { useState } from 'react';
import { X, Calendar, Factory, Package, Users, Clock, TrendingUp, Activity, FileText, Download, CheckCircle, AlertTriangle, Info, Plus, Trash2 } from 'lucide-react';

interface ProductionPlan {
  id: string;
  planNumber: string;
  planName: string;
  productLine: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  totalCapacity: number;
  usedCapacity: number;
  capacityUnit: string;
  materialsReady: number;
  materialsRequired: number;
  workOrdersTotal: number;
  workOrdersCompleted: number;
  onSchedulePercentage: number;
  shiftPlan: string;
  planner: string;
  notes: string;
}

interface WorkOrder {
  id: string;
  woNumber: string;
  product: string;
  quantity: number;
  status: string;
  startDate: string;
  endDate: string;
}

interface Material {
  id: string;
  itemCode: string;
  itemName: string;
  requiredQty: number;
  availableQty: number;
  unit: string;
  status: 'available' | 'partial' | 'unavailable';
}

// Create/Edit Plan Modal
interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: ProductionPlan | null;
  onSave: (plan: Partial<ProductionPlan>) => void;
}

export function PlanModal({ isOpen, onClose, plan, onSave }: PlanModalProps) {
  const [formData, setFormData] = useState({
    planNumber: plan?.planNumber || '',
    planName: plan?.planName || '',
    productLine: plan?.productLine || '',
    startDate: plan?.startDate || '',
    endDate: plan?.endDate || '',
    status: plan?.status || 'draft',
    totalCapacity: plan?.totalCapacity || 0,
    usedCapacity: plan?.usedCapacity || 0,
    capacityUnit: plan?.capacityUnit || 'hours',
    shiftPlan: plan?.shiftPlan || '2 Shifts - Day & Evening',
    planner: plan?.planner || '',
    notes: plan?.notes || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">{plan ? 'Edit Production Plan' : 'Create New Production Plan'}</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Number *</label>
                <input
                  type="text"
                  required
                  value={formData.planNumber}
                  onChange={(e) => setFormData({ ...formData, planNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PPG-2025-W42"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Week 42 - Commercial Kitchen Production"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Line *</label>
                <select
                  value={formData.productLine}
                  onChange={(e) => setFormData({ ...formData, productLine: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product Line</option>
                  <option value="Kitchen Equipment Line A">Kitchen Equipment Line A</option>
                  <option value="Oven Manufacturing Line B">Oven Manufacturing Line B</option>
                  <option value="Refrigeration Line C">Refrigeration Line C</option>
                  <option value="Fabrication Shop 1">Fabrication Shop 1</option>
                  <option value="Mixer Assembly Line D">Mixer Assembly Line D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Schedule & Capacity
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity *</label>
                <input
                  type="number"
                  required
                  value={formData.totalCapacity}
                  onChange={(e) => setFormData({ ...formData, totalCapacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Used Capacity</label>
                <input
                  type="number"
                  value={formData.usedCapacity}
                  onChange={(e) => setFormData({ ...formData, usedCapacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="420"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity Unit *</label>
                <select
                  value={formData.capacityUnit}
                  onChange={(e) => setFormData({ ...formData, capacityUnit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hours">Hours</option>
                  <option value="units">Units</option>
                  <option value="pieces">Pieces</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Plan *</label>
                <select
                  value={formData.shiftPlan}
                  onChange={(e) => setFormData({ ...formData, shiftPlan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1 Shift - Day">1 Shift - Day</option>
                  <option value="2 Shifts - Day & Evening">2 Shifts - Day & Evening</option>
                  <option value="2 Shifts - Day & Night">2 Shifts - Day & Night</option>
                  <option value="3 Shifts - 24x7">3 Shifts - 24x7</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planner *</label>
                <input
                  type="text"
                  required
                  value={formData.planner}
                  onChange={(e) => setFormData({ ...formData, planner: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Planning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any notes or special instructions..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View Plan Details Modal
interface ViewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ProductionPlan | null;
}

export function ViewPlanModal({ isOpen, onClose, plan }: ViewPlanModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'workorders' | 'materials' | 'timeline'>('overview');

  if (!isOpen || !plan) return null;

  const mockWorkOrders: WorkOrder[] = [
    { id: '1', woNumber: 'WO-2025-001', product: 'Commercial Oven 48"', quantity: 10, status: 'Completed', startDate: '2025-10-14', endDate: '2025-10-16' },
    { id: '2', woNumber: 'WO-2025-002', product: 'Prep Table Stainless', quantity: 15, status: 'In Progress', startDate: '2025-10-15', endDate: '2025-10-18' },
    { id: '3', woNumber: 'WO-2025-003', product: 'Industrial Mixer', quantity: 8, status: 'Scheduled', startDate: '2025-10-17', endDate: '2025-10-20' },
  ];

  const mockMaterials: Material[] = [
    { id: '1', itemCode: 'SS-304-001', itemName: 'Stainless Steel Sheet 304', requiredQty: 500, availableQty: 500, unit: 'kg', status: 'available' },
    { id: '2', itemCode: 'MTR-001', itemName: 'Electric Motor 3HP', requiredQty: 20, availableQty: 18, unit: 'pcs', status: 'partial' },
    { id: '3', itemCode: 'GLZ-001', itemName: 'Tempered Glass Panel', requiredQty: 30, availableQty: 0, unit: 'pcs', status: 'unavailable' },
  ];

  const capacityPercentage = Math.round((plan.usedCapacity / plan.totalCapacity) * 100);
  const materialsPercentage = Math.round((plan.materialsReady / plan.materialsRequired) * 100);
  const completionPercentage = Math.round((plan.workOrdersCompleted / plan.workOrdersTotal) * 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{plan.planNumber}</h2>
            <p className="text-sm opacity-90">{plan.planName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('workorders')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'workorders'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Work Orders ({plan.workOrdersTotal})
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'materials'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Materials ({plan.materialsRequired})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Capacity Utilization</span>
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{capacityPercentage}%</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {plan.usedCapacity}/{plan.totalCapacity} {plan.capacityUnit}
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${capacityPercentage}%` }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Materials Readiness</span>
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900">{materialsPercentage}%</div>
                  <div className="text-xs text-green-600 mt-1">
                    {plan.materialsReady}/{plan.materialsRequired} items ready
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-green-600" style={{ width: `${materialsPercentage}%` }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Work Orders Progress</span>
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900">{completionPercentage}%</div>
                  <div className="text-xs text-purple-600 mt-1">
                    {plan.workOrdersCompleted}/{plan.workOrdersTotal} completed
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-purple-600" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plan Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Line</label>
                    <p className="text-base font-semibold text-gray-900 mt-1">{plan.productLine}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Shift Plan</label>
                    <p className="text-base font-semibold text-gray-900 mt-1">{plan.shiftPlan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                    <p className="text-base font-semibold text-gray-900 mt-1">{plan.startDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">End Date</label>
                    <p className="text-base font-semibold text-gray-900 mt-1">{plan.endDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Planner</label>
                    <p className="text-base font-semibold text-gray-900 mt-1">{plan.planner}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">On Schedule</label>
                    <p className="text-base font-semibold text-green-600 mt-1">{plan.onSchedulePercentage}%</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {plan.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-yellow-900 mb-2">Notes</h3>
                  <p className="text-sm text-yellow-800">{plan.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Work Orders Tab */}
          {activeTab === 'workorders' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Orders</h3>
              <div className="space-y-3">
                {mockWorkOrders.map((wo) => (
                  <div key={wo.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-900">{wo.woNumber}</span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              wo.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : wo.status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {wo.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{wo.product}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Qty: {wo.quantity}</span>
                          <span>Start: {wo.startDate}</span>
                          <span>End: {wo.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Materials Requirement</h3>
              <div className="space-y-3">
                {mockMaterials.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm text-gray-600">{material.itemCode}</span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              material.status === 'available'
                                ? 'bg-green-100 text-green-700'
                                : material.status === 'partial'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {material.status === 'available' ? 'Available' : material.status === 'partial' ? 'Partial' : 'Unavailable'}
                          </span>
                        </div>
                        <p className="text-base font-semibold text-gray-900 mt-1">{material.itemName}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-600">
                            Required: <span className="font-semibold">{material.requiredQty} {material.unit}</span>
                          </span>
                          <span className="text-sm text-gray-600">
                            Available: <span className="font-semibold">{material.availableQty} {material.unit}</span>
                          </span>
                        </div>
                      </div>
                      {material.status === 'available' && <CheckCircle className="h-6 w-6 text-green-600" />}
                      {material.status === 'unavailable' && <AlertTriangle className="h-6 w-6 text-red-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Production Timeline</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Plan Created</p>
                    <p className="text-sm text-gray-600">Production plan PPG-2025-W42 created</p>
                    <p className="text-xs text-gray-500 mt-1">{plan.startDate} 09:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Plan Scheduled</p>
                    <p className="text-sm text-gray-600">Plan scheduled for execution with {plan.workOrdersTotal} work orders</p>
                    <p className="text-xs text-gray-500 mt-1">{plan.startDate} 10:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Production Started</p>
                    <p className="text-sm text-gray-600">Production started on {plan.productLine}</p>
                    <p className="text-xs text-gray-500 mt-1">{plan.startDate} 06:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Progress Update</p>
                    <p className="text-sm text-gray-600">{plan.workOrdersCompleted} work orders completed - {plan.onSchedulePercentage}% on schedule</p>
                    <p className="text-xs text-gray-500 mt-1">Today 02:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export Modal
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, filters: any) => void;
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [includeScheduled, setIncludeScheduled] = useState(true);
  const [includeInProgress, setIncludeInProgress] = useState(true);
  const [includeDraft, setIncludeDraft] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const filters = {
      includeCompleted,
      includeScheduled,
      includeInProgress,
      includeDraft,
    };
    onExport(exportFormat, filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold">Export Production Plans</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Export Format */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">CSV</p>
                  <p className="text-xs text-gray-500">Comma-separated values for Excel/Sheets</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Excel</p>
                  <p className="text-xs text-gray-500">Microsoft Excel format (.xlsx)</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">PDF</p>
                  <p className="text-xs text-gray-500">Portable Document Format</p>
                </div>
              </label>
            </div>
          </div>

          {/* Filter Options */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Status</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeCompleted}
                  onChange={(e) => setIncludeCompleted(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-700">Completed Plans</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeScheduled}
                  onChange={(e) => setIncludeScheduled(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-700">Scheduled Plans</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeInProgress}
                  onChange={(e) => setIncludeInProgress(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-700">In Progress Plans</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeDraft}
                  onChange={(e) => setIncludeDraft(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-700">Draft Plans</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
