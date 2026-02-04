'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare,
  Flag,
  Tag,
  Building,
  Wrench,
  FileText,
  ExternalLink
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  ticketNumber: string;
  customer: {
    name: string;
    company: string;
    phone: string;
    email: string;
    address: string;
  };
  product: {
    name: string;
    model: string;
    serialNumber: string;
    warrantyStatus: 'Active' | 'Expired' | 'Extended';
  };
  issue: {
    title: string;
    description: string;
    category: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    severity: 'Critical' | 'Major' | 'Minor';
  };
  status: 'Open' | 'Assigned' | 'In Progress' | 'Pending Parts' | 'Customer Response Required';
  assignedTo?: string;
  createdDate: string;
  expectedResolution: string;
  slaStatus: 'On Track' | 'At Risk' | 'Breached';
  timeRemaining: string;
  tags: string[];
  attachments: number;
  lastUpdate: string;
  contactPreference: 'Phone' | 'Email' | 'WhatsApp' | 'SMS';
}

const OpenServiceRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSLA, setFilterSLA] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const serviceRequests: ServiceRequest[] = [
    {
      id: '1',
      ticketNumber: 'SR-2024-0001',
      customer: {
        name: 'John Smith',
        company: 'ABC Manufacturing Ltd.',
        phone: '+1-555-0123',
        email: 'john.smith@abcmfg.com',
        address: '123 Industrial Ave, Manufacturing District, NY 10001'
      },
      product: {
        name: 'Industrial Mixer Unit',
        model: 'IMU-5000X',
        serialNumber: 'IMU-5000X-2023-001',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Motor overheating during operation',
        description: 'The motor overheats after 2 hours of continuous operation. Temperature gauge shows 85°C when normal operating temperature should be 45-50°C.',
        category: 'Mechanical',
        priority: 'Critical',
        severity: 'Critical'
      },
      status: 'Open',
      createdDate: '2024-01-15T08:30:00Z',
      expectedResolution: '2024-01-16T17:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '18h 30m',
      tags: ['Motor', 'Overheating', 'Critical'],
      attachments: 3,
      lastUpdate: '2024-01-15T09:15:00Z',
      contactPreference: 'Phone'
    },
    {
      id: '2',
      ticketNumber: 'SR-2024-0002',
      customer: {
        name: 'Sarah Johnson',
        company: 'TechPro Solutions',
        phone: '+1-555-0456',
        email: 'sarah.j@techpro.com',
        address: '456 Tech Park Blvd, Silicon Valley, CA 94025'
      },
      product: {
        name: 'Precision Cutting Machine',
        model: 'PCM-3000',
        serialNumber: 'PCM-3000-2023-045',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Calibration error affecting precision',
        description: 'Cutting precision has decreased significantly. Measurements are off by 0.5mm consistently. Last calibration was 6 months ago.',
        category: 'Calibration',
        priority: 'High',
        severity: 'Major'
      },
      status: 'Open',
      createdDate: '2024-01-15T10:45:00Z',
      expectedResolution: '2024-01-17T16:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '2d 5h 15m',
      tags: ['Calibration', 'Precision', 'Maintenance'],
      attachments: 2,
      lastUpdate: '2024-01-15T11:30:00Z',
      contactPreference: 'Email'
    },
    {
      id: '3',
      ticketNumber: 'SR-2024-0003',
      customer: {
        name: 'Mike Wilson',
        company: 'AutoParts Central',
        phone: '+1-555-0789',
        email: 'mike.wilson@autoparts.com',
        address: '789 Auto Drive, Detroit, MI 48201'
      },
      product: {
        name: 'Hydraulic Press System',
        model: 'HPS-800',
        serialNumber: 'HPS-800-2022-156',
        warrantyStatus: 'Extended'
      },
      issue: {
        title: 'Hydraulic fluid leak detected',
        description: 'Small hydraulic fluid leak noticed near the main cylinder. System pressure has dropped by 5% over the past week.',
        category: 'Hydraulic',
        priority: 'Medium',
        severity: 'Minor'
      },
      status: 'Open',
      createdDate: '2024-01-15T14:20:00Z',
      expectedResolution: '2024-01-18T12:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '2d 21h 40m',
      tags: ['Hydraulic', 'Leak', 'Maintenance'],
      attachments: 1,
      lastUpdate: '2024-01-15T14:20:00Z',
      contactPreference: 'WhatsApp'
    },
    {
      id: '4',
      ticketNumber: 'SR-2024-0004',
      customer: {
        name: 'Lisa Chen',
        company: 'GreenTech Industries',
        phone: '+1-555-0321',
        email: 'lisa.chen@greentech.com',
        address: '321 Eco Way, Portland, OR 97201'
      },
      product: {
        name: 'Solar Panel Controller',
        model: 'SPC-2000',
        serialNumber: 'SPC-2000-2023-089',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Display panel not responding',
        description: 'The main display panel is unresponsive to touch inputs. System continues to operate but cannot change settings.',
        category: 'Electronics',
        priority: 'Medium',
        severity: 'Major'
      },
      status: 'Open',
      createdDate: '2024-01-15T16:10:00Z',
      expectedResolution: '2024-01-18T14:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '2d 21h 50m',
      tags: ['Display', 'Touch', 'Electronics'],
      attachments: 0,
      lastUpdate: '2024-01-15T16:10:00Z',
      contactPreference: 'Email'
    },
    {
      id: '5',
      ticketNumber: 'SR-2024-0005',
      customer: {
        name: 'Robert Taylor',
        company: 'Heavy Machinery Corp',
        phone: '+1-555-0654',
        email: 'robert.taylor@heavymach.com',
        address: '654 Heavy Industry Rd, Pittsburgh, PA 15201'
      },
      product: {
        name: 'Conveyor Belt System',
        model: 'CBS-1200',
        serialNumber: 'CBS-1200-2021-234',
        warrantyStatus: 'Expired'
      },
      issue: {
        title: 'Belt alignment issues causing jams',
        description: 'Conveyor belt frequently misaligns causing product jams. Issue occurs 3-4 times per shift affecting productivity.',
        category: 'Mechanical',
        priority: 'High',
        severity: 'Major'
      },
      status: 'Open',
      createdDate: '2024-01-14T12:00:00Z',
      expectedResolution: '2024-01-16T09:00:00Z',
      slaStatus: 'At Risk',
      timeRemaining: '14h 45m',
      tags: ['Belt', 'Alignment', 'Productivity'],
      attachments: 4,
      lastUpdate: '2024-01-15T08:00:00Z',
      contactPreference: 'Phone'
    },
    {
      id: '6',
      ticketNumber: 'SR-2024-0006',
      customer: {
        name: 'Amanda Rodriguez',
        company: 'Food Processing Plus',
        phone: '+1-555-0987',
        email: 'amanda.r@foodprocessing.com',
        address: '987 Food Ave, Chicago, IL 60601'
      },
      product: {
        name: 'Food Grade Mixer',
        model: 'FGM-400',
        serialNumber: 'FGM-400-2023-067',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Unusual noise during mixing cycle',
        description: 'Grinding noise heard during mixing cycle starting yesterday. Noise increases with mixing speed.',
        category: 'Mechanical',
        priority: 'Medium',
        severity: 'Minor'
      },
      status: 'Open',
      createdDate: '2024-01-15T11:30:00Z',
      expectedResolution: '2024-01-17T15:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '2d 3h 30m',
      tags: ['Noise', 'Mixing', 'Diagnosis'],
      attachments: 1,
      lastUpdate: '2024-01-15T11:30:00Z',
      contactPreference: 'SMS'
    },
    {
      id: '7',
      ticketNumber: 'SR-2024-0007',
      customer: {
        name: 'David Kim',
        company: 'Precision Tools Ltd',
        phone: '+1-555-0147',
        email: 'david.kim@precisiontools.com',
        address: '147 Precision St, San Francisco, CA 94102'
      },
      product: {
        name: 'CNC Milling Machine',
        model: 'CNC-5000',
        serialNumber: 'CNC-5000-2022-123',
        warrantyStatus: 'Extended'
      },
      issue: {
        title: 'Software update causing errors',
        description: 'After recent software update, machine throws error codes during startup. Unable to begin operations.',
        category: 'Software',
        priority: 'Critical',
        severity: 'Critical'
      },
      status: 'Open',
      createdDate: '2024-01-15T07:45:00Z',
      expectedResolution: '2024-01-15T19:00:00Z',
      slaStatus: 'Breached',
      timeRemaining: 'Overdue by 2h 15m',
      tags: ['Software', 'Update', 'Error'],
      attachments: 2,
      lastUpdate: '2024-01-15T09:00:00Z',
      contactPreference: 'Phone'
    },
    {
      id: '8',
      ticketNumber: 'SR-2024-0008',
      customer: {
        name: 'Jennifer Brown',
        company: 'Textile Innovations',
        phone: '+1-555-0258',
        email: 'jennifer.brown@textile.com',
        address: '258 Fabric Lane, Atlanta, GA 30301'
      },
      product: {
        name: 'Industrial Loom',
        model: 'IL-3000',
        serialNumber: 'IL-3000-2023-178',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Thread tension inconsistency',
        description: 'Thread tension varies during weaving process resulting in fabric quality issues. Problem started 3 days ago.',
        category: 'Mechanical',
        priority: 'High',
        severity: 'Major'
      },
      status: 'Open',
      createdDate: '2024-01-15T13:15:00Z',
      expectedResolution: '2024-01-17T11:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '1d 21h 45m',
      tags: ['Tension', 'Quality', 'Weaving'],
      attachments: 3,
      lastUpdate: '2024-01-15T13:15:00Z',
      contactPreference: 'Email'
    }
  ];

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = !filterPriority || request.issue.priority === filterPriority;
    const matchesCategory = !filterCategory || request.issue.category === filterCategory;
    const matchesSLA = !filterSLA || request.slaStatus === filterSLA;

    return matchesSearch && matchesPriority && matchesCategory && matchesSLA;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50';
      case 'High': return 'text-orange-600 bg-orange-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'text-green-600 bg-green-50';
      case 'At Risk': return 'text-yellow-600 bg-yellow-50';
      case 'Breached': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getWarrantyColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Extended': return 'text-blue-600 bg-blue-50';
      case 'Expired': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Open Service Requests</h1>
        <p className="text-gray-600">Manage and track all open service requests requiring attention</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by ticket number, customer, company, or issue..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electronics">Electronics</option>
              <option value="Software">Software</option>
              <option value="Hydraulic">Hydraulic</option>
              <option value="Calibration">Calibration</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterSLA}
              onChange={(e) => setFilterSLA(e.target.value)}
            >
              <option value="">All SLA Status</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Breached">Breached</option>
            </select>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Open</p>
              <p className="text-2xl font-bold text-gray-900">{filteredRequests.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flag className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Flag</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredRequests.filter(r => r.issue.priority === 'Critical').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">SLA At Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredRequests.filter(r => r.slaStatus === 'At Risk' || r.slaStatus === 'Breached').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unassigned</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredRequests.filter(r => !r.assignedTo).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Requests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flag & SLA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{request.ticketNumber}</div>
                      <div className="text-sm text-gray-600 max-w-xs truncate">{request.issue.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.issue.priority)}`}>
                          {request.issue.priority}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {request.issue.category}
                        </span>
                      </div>
                      {request.attachments > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <FileText className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{request.attachments} attachments</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{request.customer.name}</div>
                      <div className="text-sm text-gray-600">{request.customer.company}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{request.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{request.customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{request.product.name}</div>
                      <div className="text-sm text-gray-600">{request.product.model}</div>
                      <div className="text-xs text-gray-500">{request.product.serialNumber}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getWarrantyColor(request.product.warrantyStatus)}`}>
                        {request.product.warrantyStatus} Warranty
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSLAStatusColor(request.slaStatus)}`}>
                        {request.slaStatus}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{request.timeRemaining}</div>
                      <div className="text-xs text-gray-400">
                        Severity: {request.issue.severity}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Created: {new Date(request.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Expected: {new Date(request.expectedResolution).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Updated: {new Date(request.lastUpdate).toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-800"

                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800"

                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800"

                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800"

                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl  w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedRequest.ticketNumber}</h2>
                  <p className="text-gray-600">{selectedRequest.issue.title}</p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.customer.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedRequest.customer.address}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.product.name}</span>
                    </div>
                    <div><strong>Model:</strong> {selectedRequest.product.model}</div>
                    <div><strong>Serial Number:</strong> {selectedRequest.product.serialNumber}</div>
                    <div>
                      <strong>Warranty:</strong>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getWarrantyColor(selectedRequest.product.warrantyStatus)}`}>
                        {selectedRequest.product.warrantyStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Issue Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedRequest.issue.description}</p>
                  <div className="flex gap-2 mt-3">
                    {selectedRequest.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>Status:</strong> {selectedRequest.status}
                </div>
                <div>
                  <strong>SLA Status:</strong>
                  <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSLAStatusColor(selectedRequest.slaStatus)}`}>
                    {selectedRequest.slaStatus}
                  </span>
                </div>
                <div>
                  <strong>Contact Preference:</strong> {selectedRequest.contactPreference}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenServiceRequestsPage;