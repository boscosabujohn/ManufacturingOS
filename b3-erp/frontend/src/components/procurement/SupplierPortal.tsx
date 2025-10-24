'use client';

import React, { useState } from 'react';
import { Users, MessageSquare, FileText, TrendingUp, CheckCircle, AlertCircle, Clock, Building2 } from 'lucide-react';

export type SupplierStatus = 'active' | 'pending' | 'suspended' | 'inactive';
export type CollaborationType = 'rfq' | 'po' | 'invoice' | 'quality' | 'general';
export type MessageStatus = 'unread' | 'read' | 'responded';

export interface SupplierProfile {
  id: string;
  name: string;
  code: string;
  status: SupplierStatus;
  category: string;
  rating: number;
  totalSpend: number;
  activeOrders: number;
  onTimeDelivery: number;
  qualityScore: number;
  paymentTerms: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  lastActivity: string;
}

export interface CollaborationMessage {
  id: string;
  supplierId: string;
  supplierName: string;
  type: CollaborationType;
  subject: string;
  message: string;
  status: MessageStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  respondedAt?: string;
  attachments?: number;
}

export interface SupplierDocument {
  id: string;
  supplierId: string;
  supplierName: string;
  documentType: string;
  fileName: string;
  uploadedAt: string;
  expiryDate?: string;
  status: 'valid' | 'expiring' | 'expired';
  size: string;
}

const SupplierPortal: React.FC = () => {
  const [activeView, setActiveView] = useState<'suppliers' | 'collaboration' | 'documents'>('suppliers');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  // Mock data - Supplier profiles
  const suppliers: SupplierProfile[] = [
    {
      id: 'SUP001',
      name: 'Acme Manufacturing Co.',
      code: 'ACM-001',
      status: 'active',
      category: 'Raw Materials',
      rating: 4.8,
      totalSpend: 2450000,
      activeOrders: 12,
      onTimeDelivery: 96.5,
      qualityScore: 98.2,
      paymentTerms: 'Net 30',
      contact: { name: 'John Smith', email: 'john@acme.com', phone: '+1-555-0101' },
      lastActivity: '2025-10-23',
    },
    {
      id: 'SUP002',
      name: 'Global Components Ltd.',
      code: 'GCL-002',
      status: 'active',
      category: 'Electronic Components',
      rating: 4.6,
      totalSpend: 1850000,
      activeOrders: 8,
      onTimeDelivery: 94.2,
      qualityScore: 96.8,
      paymentTerms: 'Net 45',
      contact: { name: 'Sarah Johnson', email: 'sarah@globalcomp.com', phone: '+1-555-0102' },
      lastActivity: '2025-10-24',
    },
    {
      id: 'SUP003',
      name: 'Quality Steel Industries',
      code: 'QSI-003',
      status: 'active',
      category: 'Metals & Alloys',
      rating: 4.9,
      totalSpend: 3200000,
      activeOrders: 15,
      onTimeDelivery: 98.1,
      qualityScore: 99.5,
      paymentTerms: 'Net 60',
      contact: { name: 'Michael Chen', email: 'michael@qualitysteel.com', phone: '+1-555-0103' },
      lastActivity: '2025-10-24',
    },
    {
      id: 'SUP004',
      name: 'Tech Solutions Inc.',
      code: 'TSI-004',
      status: 'pending',
      category: 'IT Services',
      rating: 4.3,
      totalSpend: 980000,
      activeOrders: 3,
      onTimeDelivery: 91.5,
      qualityScore: 93.7,
      paymentTerms: 'Net 30',
      contact: { name: 'Emily Davis', email: 'emily@techsol.com', phone: '+1-555-0104' },
      lastActivity: '2025-10-22',
    },
    {
      id: 'SUP005',
      name: 'Precision Parts Manufacturing',
      code: 'PPM-005',
      status: 'active',
      category: 'Machined Parts',
      rating: 4.7,
      totalSpend: 1650000,
      activeOrders: 10,
      onTimeDelivery: 95.8,
      qualityScore: 97.4,
      paymentTerms: 'Net 45',
      contact: { name: 'Robert Wilson', email: 'robert@precisionparts.com', phone: '+1-555-0105' },
      lastActivity: '2025-10-23',
    },
    {
      id: 'SUP006',
      name: 'Eco Packaging Solutions',
      code: 'EPS-006',
      status: 'suspended',
      category: 'Packaging Materials',
      rating: 3.8,
      totalSpend: 450000,
      activeOrders: 0,
      onTimeDelivery: 87.3,
      qualityScore: 89.2,
      paymentTerms: 'Net 30',
      contact: { name: 'Lisa Anderson', email: 'lisa@ecopack.com', phone: '+1-555-0106' },
      lastActivity: '2025-10-15',
    },
  ];

  // Mock data - Collaboration messages
  const messages: CollaborationMessage[] = [
    {
      id: 'MSG001',
      supplierId: 'SUP001',
      supplierName: 'Acme Manufacturing Co.',
      type: 'rfq',
      subject: 'RFQ-2025-089 - Steel Rods Quotation Request',
      message: 'Please provide quotation for 5000 units of steel rods (Grade A36, 12mm diameter) for delivery by Nov 15.',
      status: 'unread',
      priority: 'high',
      createdAt: '2025-10-24 09:30',
      attachments: 2,
    },
    {
      id: 'MSG002',
      supplierId: 'SUP002',
      supplierName: 'Global Components Ltd.',
      type: 'po',
      subject: 'PO-2025-1245 - Delivery Date Confirmation',
      message: 'Confirming delivery date for PO-2025-1245. Can you ship by October 30th as requested?',
      status: 'responded',
      priority: 'medium',
      createdAt: '2025-10-23 14:15',
      respondedAt: '2025-10-23 16:45',
      attachments: 1,
    },
    {
      id: 'MSG003',
      supplierId: 'SUP003',
      supplierName: 'Quality Steel Industries',
      type: 'quality',
      subject: 'Quality Issue - Batch QS-2025-456',
      message: 'Minor surface defects detected in recent batch. Please review attached quality report and advise on corrective actions.',
      status: 'read',
      priority: 'high',
      createdAt: '2025-10-23 11:20',
      attachments: 3,
    },
    {
      id: 'MSG004',
      supplierId: 'SUP005',
      supplierName: 'Precision Parts Manufacturing',
      type: 'invoice',
      subject: 'Invoice Discrepancy - INV-2025-789',
      message: 'Noted pricing discrepancy in invoice INV-2025-789. Unit price should be $45.00, not $48.00 as invoiced.',
      status: 'unread',
      priority: 'medium',
      createdAt: '2025-10-24 08:00',
    },
    {
      id: 'MSG005',
      supplierId: 'SUP001',
      supplierName: 'Acme Manufacturing Co.',
      type: 'general',
      subject: 'New Product Catalog Available',
      message: 'We have launched new eco-friendly material options. Would you like to schedule a presentation?',
      status: 'read',
      priority: 'low',
      createdAt: '2025-10-22 16:30',
      attachments: 1,
    },
  ];

  // Mock data - Supplier documents
  const documents: SupplierDocument[] = [
    {
      id: 'DOC001',
      supplierId: 'SUP001',
      supplierName: 'Acme Manufacturing Co.',
      documentType: 'ISO 9001 Certificate',
      fileName: 'ISO9001_Certificate_2025.pdf',
      uploadedAt: '2025-01-15',
      expiryDate: '2026-01-14',
      status: 'valid',
      size: '2.4 MB',
    },
    {
      id: 'DOC002',
      supplierId: 'SUP001',
      supplierName: 'Acme Manufacturing Co.',
      documentType: 'Insurance Certificate',
      fileName: 'Liability_Insurance_2025.pdf',
      uploadedAt: '2025-03-10',
      expiryDate: '2025-11-30',
      status: 'expiring',
      size: '1.8 MB',
    },
    {
      id: 'DOC003',
      supplierId: 'SUP002',
      supplierName: 'Global Components Ltd.',
      documentType: 'W9 Tax Form',
      fileName: 'W9_Form_2025.pdf',
      uploadedAt: '2025-01-05',
      status: 'valid',
      size: '450 KB',
    },
    {
      id: 'DOC004',
      supplierId: 'SUP003',
      supplierName: 'Quality Steel Industries',
      documentType: 'ISO 14001 Certificate',
      fileName: 'ISO14001_Environmental.pdf',
      uploadedAt: '2024-06-20',
      expiryDate: '2025-10-15',
      status: 'expired',
      size: '3.1 MB',
    },
    {
      id: 'DOC005',
      supplierId: 'SUP003',
      supplierName: 'Quality Steel Industries',
      documentType: 'Material Safety Data Sheet',
      fileName: 'MSDS_Steel_Alloys.pdf',
      uploadedAt: '2025-02-28',
      status: 'valid',
      size: '5.2 MB',
    },
    {
      id: 'DOC006',
      supplierId: 'SUP005',
      supplierName: 'Precision Parts Manufacturing',
      documentType: 'Quality Assurance Plan',
      fileName: 'QA_Plan_2025.pdf',
      uploadedAt: '2025-01-20',
      expiryDate: '2025-12-31',
      status: 'valid',
      size: '1.2 MB',
    },
  ];

  const getStatusColor = (status: SupplierStatus): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMessageStatusColor = (status: MessageStatus): string => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getDocumentStatusColor = (status: string): string => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSuppliers = () => (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spend (YTD)</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(suppliers.reduce((sum, s) => sum + s.totalSpend, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.reduce((sum, s) => sum + s.activeOrders, 0)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. On-Time Delivery</p>
              <p className="text-2xl font-bold text-gray-900">
                {(suppliers.reduce((sum, s) => sum + s.onTimeDelivery, 0) / suppliers.length).toFixed(1)}%
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Supplier List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Spend</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Active Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">On-Time %</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quality Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm font-medium text-gray-900">{supplier.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(supplier.totalSpend / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.activeOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${supplier.onTimeDelivery >= 95 ? 'text-green-600' : supplier.onTimeDelivery >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {supplier.onTimeDelivery}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${supplier.qualityScore >= 95 ? 'text-green-600' : supplier.qualityScore >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {supplier.qualityScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{supplier.contact.name}</div>
                    <div className="text-xs">{supplier.contact.email}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCollaboration = () => (
    <div className="space-y-4">
      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'unread').length}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'responded').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.priority === 'high').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-6 hover:bg-gray-50 ${msg.status === 'unread' ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMessageStatusColor(msg.status)}`}>
                      {msg.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${msg.type === 'rfq' ? 'bg-purple-100 text-purple-800' : msg.type === 'po' ? 'bg-blue-100 text-blue-800' : msg.type === 'quality' ? 'bg-red-100 text-red-800' : msg.type === 'invoice' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {msg.type.toUpperCase()}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(msg.priority)}`}>
                      {msg.priority} priority
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{msg.subject}</h4>
                  <p className="text-sm text-gray-600 mb-2">{msg.supplierName}</p>
                  <p className="text-sm text-gray-700 mb-3">{msg.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Created: {msg.createdAt}</span>
                    {msg.respondedAt && <span>Responded: {msg.respondedAt}</span>}
                    {msg.attachments && (
                      <span className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {msg.attachments} attachment{msg.attachments > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      {/* Document Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valid Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === 'valid').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === 'expiring').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">
                {documents.filter(d => d.status === 'expired').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Document Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Size</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.supplierName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.documentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <FileText className="h-4 w-4 mr-1" />
                      {doc.fileName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.expiryDate || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDocumentStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Supplier Portal</h2>
            <p className="text-blue-100">Supplier collaboration, documents, and performance tracking</p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveView('suppliers')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'suppliers'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Suppliers</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('collaboration')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'collaboration'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Collaboration</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('documents')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'documents'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </div>
        </button>
      </div>

      {/* Content */}
      {activeView === 'suppliers' && renderSuppliers()}
      {activeView === 'collaboration' && renderCollaboration()}
      {activeView === 'documents' && renderDocuments()}
    </div>
  );
};

export default SupplierPortal;
