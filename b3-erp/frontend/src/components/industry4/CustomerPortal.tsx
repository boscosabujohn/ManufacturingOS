'use client';

import React, { useState, useEffect } from 'react';

// Types
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';
export type ProjectPhase = 'design' | 'procurement' | 'production' | 'quality' | 'shipping' | 'delivered';

export interface CustomerMilestone {
  id: string;
  name: string;
  description: string;
  phase: ProjectPhase;
  plannedDate: Date;
  actualDate?: Date;
  status: 'completed' | 'in_progress' | 'upcoming';
  requiresApproval: boolean;
  approvalStatus?: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  documents?: CustomerDocument[];
}

export interface CustomerDocument {
  id: string;
  name: string;
  type: 'drawing' | 'spec' | 'report' | 'certificate' | 'photo' | 'invoice';
  uploadedAt: Date;
  size: number;
  url: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  projectName: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  currentPhase: ProjectPhase;
  orderDate: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  totalValue: number;
  currency: string;
  milestones: CustomerMilestone[];
  recentUpdates: CustomerUpdate[];
  contacts: CustomerContact[];
}

export interface CustomerUpdate {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'progress' | 'milestone' | 'document' | 'delay' | 'approval_request';
  isRead: boolean;
}

export interface CustomerContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

interface CustomerPortalProps {
  className?: string;
  orderId?: string;
}

// Mock data
const generateOrder = (): CustomerOrder => ({
  id: 'ord1',
  orderNumber: 'PO-2024-1547',
  projectName: 'Custom Assembly Project Alpha',
  status: 'active',
  progress: 58,
  currentPhase: 'production',
  orderDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  estimatedDelivery: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  totalValue: 125000,
  currency: 'USD',
  milestones: [
    {
      id: 'cm1',
      name: 'Design Approval',
      description: 'Final design review and customer approval',
      phase: 'design',
      plannedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      actualDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      status: 'completed',
      requiresApproval: true,
      approvalStatus: 'approved',
      approvedBy: 'John Smith (Customer)',
      approvedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      documents: [
        { id: 'd1', name: 'Final_Design_v3.pdf', type: 'drawing', uploadedAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000), size: 2500000, url: '#' },
        { id: 'd2', name: 'Material_Spec.pdf', type: 'spec', uploadedAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000), size: 850000, url: '#' }
      ]
    },
    {
      id: 'cm2',
      name: 'Material Procurement',
      description: 'All materials ordered and received',
      phase: 'procurement',
      plannedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      actualDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      status: 'completed',
      requiresApproval: false
    },
    {
      id: 'cm3',
      name: 'Production Start',
      description: 'Manufacturing production begins',
      phase: 'production',
      plannedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      actualDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'completed',
      requiresApproval: false,
      documents: [
        { id: 'd3', name: 'Production_Photos_Week1.zip', type: 'photo', uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), size: 15000000, url: '#' }
      ]
    },
    {
      id: 'cm4',
      name: 'Phase 1 Inspection',
      description: 'First batch quality inspection - customer review',
      phase: 'quality',
      plannedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'in_progress',
      requiresApproval: true,
      approvalStatus: 'pending',
      documents: [
        { id: 'd4', name: 'QC_Report_Batch1.pdf', type: 'report', uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), size: 1200000, url: '#' }
      ]
    },
    {
      id: 'cm5',
      name: 'Production Complete',
      description: 'All units manufactured and inspected',
      phase: 'production',
      plannedDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      requiresApproval: false
    },
    {
      id: 'cm6',
      name: 'Final QC & Certificates',
      description: 'Final quality check with certificates',
      phase: 'quality',
      plannedDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      requiresApproval: true,
      approvalStatus: 'pending'
    },
    {
      id: 'cm7',
      name: 'Shipment',
      description: 'Products shipped to customer',
      phase: 'shipping',
      plannedDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      requiresApproval: false
    },
    {
      id: 'cm8',
      name: 'Delivery Confirmation',
      description: 'Delivery confirmed and accepted',
      phase: 'delivered',
      plannedDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      requiresApproval: true,
      approvalStatus: 'pending'
    }
  ],
  recentUpdates: [
    {
      id: 'u1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      title: 'Quality Report Ready for Review',
      description: 'Phase 1 inspection complete. QC report uploaded for your review and approval.',
      type: 'approval_request',
      isRead: false
    },
    {
      id: 'u2',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      title: 'Production Photos Uploaded',
      description: 'Week 1 production photos are now available in the documents section.',
      type: 'document',
      isRead: true
    },
    {
      id: 'u3',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      title: 'Production Started',
      description: 'Manufacturing has begun. Expected Phase 1 completion in 2 weeks.',
      type: 'milestone',
      isRead: true
    },
    {
      id: 'u4',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      title: 'Materials Received',
      description: 'All materials have been received and inspected. Ready for production.',
      type: 'progress',
      isRead: true
    }
  ],
  contacts: [
    { id: 'c1', name: 'Sarah Chen', role: 'Account Manager', email: 'sarah.chen@company.com', phone: '+1 555-0123', avatar: 'SC' },
    { id: 'c2', name: 'James Park', role: 'Production Lead', email: 'james.park@company.com', phone: '+1 555-0124', avatar: 'JP' },
    { id: 'c3', name: 'Mike Rodriguez', role: 'Quality Manager', email: 'mike.rodriguez@company.com', phone: '+1 555-0125', avatar: 'MR' }
  ]
});

const CustomerPortal: React.FC<CustomerPortalProps> = ({ className = '' }) => {
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'documents' | 'updates'>('overview');
  const [selectedMilestone, setSelectedMilestone] = useState<CustomerMilestone | null>(null);

  useEffect(() => {
    setOrder(generateOrder());
  }, []);

  const getPhaseColor = (phase: ProjectPhase): string => {
    switch (phase) {
      case 'design': return '#8b5cf6';
      case 'procurement': return '#f59e0b';
      case 'production': return '#22c55e';
      case 'quality': return '#06b6d4';
      case 'shipping': return '#ec4899';
      case 'delivered': return '#10b981';
    }
  };

  const getPhaseIcon = (phase: ProjectPhase): string => {
    switch (phase) {
      case 'design': return '📐';
      case 'procurement': return '📦';
      case 'production': return '🏭';
      case 'quality': return '✓';
      case 'shipping': return '🚚';
      case 'delivered': return '📍';
    }
  };

  const getApprovalColor = (status: ApprovalStatus): string => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#22c55e';
      case 'rejected': return '#dc2626';
      case 'revision_requested': return '#8b5cf6';
    }
  };

  const getDocumentIcon = (type: CustomerDocument['type']): string => {
    switch (type) {
      case 'drawing': return '📐';
      case 'spec': return '📋';
      case 'report': return '📊';
      case 'certificate': return '📜';
      case 'photo': return '📷';
      case 'invoice': return '💰';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!order) return null;

  const pendingApprovals = order.milestones.filter(m => m.requiresApproval && m.approvalStatus === 'pending');
  const allDocuments = order.milestones.flatMap(m => m.documents || []);
  const unreadUpdates = order.recentUpdates.filter(u => !u.isRead).length;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-1">Order Progress</div>
          <div className="text-3xl font-bold text-blue-600">{order.progress}%</div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${order.progress}%` }}></div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-1">Current Phase</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl">{getPhaseIcon(order.currentPhase)}</span>
            <span className="text-lg font-semibold capitalize">{order.currentPhase}</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-1">Est. Delivery</div>
          <div className="text-xl font-semibold">{formatDate(order.estimatedDelivery)}</div>
          <div className="text-xs text-gray-400 mt-1">
            {Math.ceil((order.estimatedDelivery.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-1">Pending Approvals</div>
          <div className={`text-3xl font-bold ${pendingApprovals.length > 0 ? 'text-amber-600' : 'text-green-600'}`}>
            {pendingApprovals.length}
          </div>
          {pendingApprovals.length > 0 && (
            <button
              onClick={() => setActiveTab('milestones')}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Review now →
            </button>
          )}
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Project Timeline</h3>
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded"></div>
          <div
            className="absolute top-4 left-0 h-1 bg-blue-600 rounded transition-all"
            style={{ width: `${order.progress}%` }}
          ></div>
          <div className="flex justify-between relative">
            {(['design', 'procurement', 'production', 'quality', 'shipping', 'delivered'] as ProjectPhase[]).map((phase, idx) => {
              const isCompleted = order.milestones.filter(m => m.phase === phase).every(m => m.status === 'completed');
              const isActive = order.currentPhase === phase;
              const isPast = ['design', 'procurement', 'production', 'quality', 'shipping', 'delivered'].indexOf(order.currentPhase) > idx;

              return (
                <div key={phase} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 transition-all ${
                      isCompleted || isPast ? 'bg-blue-600 text-white' :
                      isActive ? 'bg-blue-600 text-white ring-4 ring-blue-200' :
                      'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted || isPast ? '✓' : getPhaseIcon(phase)}
                  </div>
                  <span className={`text-xs mt-2 capitalize ${isActive ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
                    {phase}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Recent Updates</h3>
          <button
            onClick={() => setActiveTab('updates')}
            className="text-sm text-blue-600 hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="space-y-3">
          {order.recentUpdates.slice(0, 3).map(update => (
            <div
              key={update.id}
              className={`p-3 rounded-lg ${update.isRead ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    {!update.isRead && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                    <span className="font-medium text-sm">{update.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{update.description}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDate(update.date)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Team */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Your Team</h3>
        <div className="grid grid-cols-3 gap-4">
          {order.contacts.map(contact => (
            <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                {contact.avatar}
              </div>
              <div>
                <div className="font-medium text-sm">{contact.name}</div>
                <div className="text-xs text-gray-500">{contact.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-4">
      {pendingApprovals.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {pendingApprovals.length} milestone(s) awaiting your approval
          </div>
          <p className="text-sm text-amber-700">Please review and approve the pending milestones to proceed.</p>
        </div>
      )}

      {order.milestones.map(milestone => (
        <div
          key={milestone.id}
          className={`bg-white border rounded-xl p-5 transition-shadow hover:shadow-md ${
            milestone.requiresApproval && milestone.approvalStatus === 'pending' ? 'border-amber-300' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  milestone.status === 'completed' ? 'bg-green-100' :
                  milestone.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                {milestone.status === 'completed' ? '✓' : getPhaseIcon(milestone.phase)}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{milestone.name}</h4>
                <p className="text-sm text-gray-500">{milestone.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {milestone.requiresApproval && (
                <span
                  className="px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: getApprovalColor(milestone.approvalStatus || 'pending') }}
                >
                  {(milestone.approvalStatus || 'pending').replace('_', ' ').toUpperCase()}
                </span>
              )}
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {milestone.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-gray-500">Planned: </span>
                <span className="font-medium">{formatDate(milestone.plannedDate)}</span>
              </div>
              {milestone.actualDate && (
                <div>
                  <span className="text-gray-500">Actual: </span>
                  <span className="font-medium text-green-600">{formatDate(milestone.actualDate)}</span>
                </div>
              )}
            </div>

            {milestone.documents && milestone.documents.length > 0 && (
              <button
                onClick={() => setSelectedMilestone(milestone)}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                📎 {milestone.documents.length} document(s)
              </button>
            )}
          </div>

          {milestone.requiresApproval && milestone.approvalStatus === 'pending' && (
            <div className="mt-4 pt-4 border-t flex justify-end gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Request Revision
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Approve Milestone
              </button>
            </div>
          )}

          {milestone.approvalStatus === 'approved' && milestone.approvedBy && (
            <div className="mt-3 text-xs text-gray-500">
              ✓ Approved by {milestone.approvedBy} on {formatDate(milestone.approvedAt!)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Document</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Milestone</th>
              <th className="text-center p-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-center p-4 text-sm font-semibold text-gray-600">Size</th>
              <th className="text-center p-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {order.milestones.filter(m => m.documents && m.documents.length > 0).flatMap(milestone =>
              milestone.documents!.map(doc => (
                <tr key={doc.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getDocumentIcon(doc.type)}</span>
                      <span className="font-medium text-sm">{doc.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{milestone.name}</td>
                  <td className="p-4 text-center text-sm">{formatDate(doc.uploadedAt)}</td>
                  <td className="p-4 text-center text-sm text-gray-500">{formatFileSize(doc.size)}</td>
                  <td className="p-4 text-center">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUpdates = () => (
    <div className="space-y-4">
      {order.recentUpdates.map(update => (
        <div
          key={update.id}
          className={`bg-white border border-gray-200 rounded-xl p-5 ${!update.isRead ? 'ring-2 ring-blue-200' : ''}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                update.type === 'approval_request' ? 'bg-amber-100' :
                update.type === 'milestone' ? 'bg-green-100' :
                update.type === 'delay' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                {update.type === 'approval_request' && '⏳'}
                {update.type === 'milestone' && '🎯'}
                {update.type === 'document' && '📄'}
                {update.type === 'progress' && '📊'}
                {update.type === 'delay' && '⚠️'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {!update.isRead && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  <h4 className="font-semibold text-gray-800">{update.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">{update.description}</p>
              </div>
            </div>
            <span className="text-sm text-gray-400">{formatDate(update.date)}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-blue-200 text-sm mb-1">Order #{order.orderNumber}</div>
            <h2 className="text-2xl font-bold mb-2">{order.projectName}</h2>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span>Order Date: {formatDate(order.orderDate)}</span>
              <span>•</span>
              <span>Value: ${order.totalValue.toLocaleString()} {order.currency}</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'active' ? 'bg-green-500' :
              order.status === 'on_hold' ? 'bg-amber-500' : 'bg-gray-500'
            }`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['overview', 'milestones', 'documents', 'updates'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab === 'overview' && '📊'}
            {tab === 'milestones' && '🎯'}
            {tab === 'documents' && '📁'}
            {tab === 'updates' && '🔔'}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'milestones' && pendingApprovals.length > 0 && (
              <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingApprovals.length}
              </span>
            )}
            {tab === 'updates' && unreadUpdates > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadUpdates}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'milestones' && renderMilestones()}
      {activeTab === 'documents' && renderDocuments()}
      {activeTab === 'updates' && renderUpdates()}

      {/* Document Modal */}
      {selectedMilestone && selectedMilestone.documents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedMilestone(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Documents - {selectedMilestone.name}</h3>
              <button onClick={() => setSelectedMilestone(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {selectedMilestone.documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getDocumentIcon(doc.type)}</span>
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-gray-500">{formatFileSize(doc.size)}</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
