'use client';

import React, { useState } from 'react';
import {
  Settings,
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
  ExternalLink,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  AlertTriangle,
  BarChart3
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
  status: 'In Progress' | 'Diagnostic' | 'Waiting Parts' | 'On Hold' | 'Testing';
  assignedTo: string;
  assignedTeam: string;
  createdDate: string;
  startedDate: string;
  expectedResolution: string;
  slaStatus: 'On Track' | 'At Risk' | 'Breached';
  timeRemaining: string;
  progressPercentage: number;
  currentStep: string;
  tags: string[];
  attachments: number;
  lastUpdate: string;
  contactPreference: 'Phone' | 'Email' | 'WhatsApp' | 'SMS';
  estimatedHours: number;
  actualHours: number;
  partsRequired: string[];
}

const InProgressServiceRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const serviceRequests: ServiceRequest[] = [
    {
      id: '1',
      ticketNumber: 'SR-2024-0009',
      customer: {
        name: 'Mark Johnson',
        company: 'Industrial Solutions Inc.',
        phone: '+1-555-0190',
        email: 'mark.johnson@indsol.com',
        address: '190 Industrial Park, Detroit, MI 48202'
      },
      product: {
        name: 'Robotic Welding Station',
        model: 'RWS-2000',
        serialNumber: 'RWS-2000-2023-045',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Robotic arm calibration drift',
        description: 'Robotic arm positioning accuracy has decreased over past month. Welding points are off by 2-3mm requiring manual adjustments.',
        category: 'Calibration',
        priority: 'High',
        severity: 'Major'
      },
      status: 'In Progress',
      assignedTo: 'Alex Chen',
      assignedTeam: 'Robotics Team',
      createdDate: '2024-01-10T09:00:00Z',
      startedDate: '2024-01-11T08:30:00Z',
      expectedResolution: '2024-01-16T17:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '1d 15h 30m',
      progressPercentage: 65,
      currentStep: 'Recalibrating XY axis positioning',
      tags: ['Robotics', 'Calibration', 'Precision'],
      attachments: 4,
      lastUpdate: '2024-01-15T14:30:00Z',
      contactPreference: 'Phone',
      estimatedHours: 24,
      actualHours: 16,
      partsRequired: ['Servo Motor Encoder', 'Position Sensor']
    },
    {
      id: '2',
      ticketNumber: 'SR-2024-0010',
      customer: {
        name: 'Sarah Mitchell',
        company: 'PackTech Automation',
        phone: '+1-555-0287',
        email: 'sarah.mitchell@packtech.com',
        address: '287 Automation Blvd, Phoenix, AZ 85001'
      },
      product: {
        name: 'Packaging Line Controller',
        model: 'PLC-3000',
        serialNumber: 'PLC-3000-2022-178',
        warrantyStatus: 'Extended'
      },
      issue: {
        title: 'PLC communication errors',
        description: 'Intermittent communication failures between main PLC and remote I/O modules causing production line stops.',
        category: 'Electronics',
        priority: 'Critical',
        severity: 'Critical'
      },
      status: 'Diagnostic',
      assignedTo: 'Maria Rodriguez',
      assignedTeam: 'Electronics Team',
      createdDate: '2024-01-12T11:15:00Z',
      startedDate: '2024-01-12T13:00:00Z',
      expectedResolution: '2024-01-15T16:00:00Z',
      slaStatus: 'At Risk',
      timeRemaining: '6h 30m',
      progressPercentage: 40,
      currentStep: 'Testing network infrastructure',
      tags: ['PLC', 'Communication', 'Network'],
      attachments: 6,
      lastUpdate: '2024-01-15T11:00:00Z',
      contactPreference: 'Email',
      estimatedHours: 16,
      actualHours: 12,
      partsRequired: ['Network Switch', 'Ethernet Cables']
    },
    {
      id: '3',
      ticketNumber: 'SR-2024-0011',
      customer: {
        name: 'Robert Davis',
        company: 'MetalWorks Pro',
        phone: '+1-555-0356',
        email: 'robert.davis@metalworks.com',
        address: '356 Steel Avenue, Pittsburgh, PA 15219'
      },
      product: {
        name: 'CNC Plasma Cutter',
        model: 'CPC-1500',
        serialNumber: 'CPC-1500-2023-089',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Plasma torch replacement needed',
        description: 'Plasma torch showing signs of wear with reduced cutting quality and increased consumable usage.',
        category: 'Maintenance',
        priority: 'Medium',
        severity: 'Minor'
      },
      status: 'Waiting Parts',
      assignedTo: 'Tom Wilson',
      assignedTeam: 'Field Service',
      createdDate: '2024-01-08T14:20:00Z',
      startedDate: '2024-01-09T09:00:00Z',
      expectedResolution: '2024-01-17T12:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '2d 21h 30m',
      progressPercentage: 25,
      currentStep: 'Waiting for torch assembly delivery',
      tags: ['Plasma', 'Torch', 'Replacement'],
      attachments: 2,
      lastUpdate: '2024-01-15T10:00:00Z',
      contactPreference: 'Phone',
      estimatedHours: 8,
      actualHours: 3,
      partsRequired: ['Plasma Torch Assembly', 'Consumable Kit']
    },
    {
      id: '4',
      ticketNumber: 'SR-2024-0012',
      customer: {
        name: 'Jennifer Adams',
        company: 'FoodTech Systems',
        phone: '+1-555-0423',
        email: 'jennifer.adams@foodtech.com',
        address: '423 Food Processing Way, Chicago, IL 60616'
      },
      product: {
        name: 'Conveyor Control System',
        model: 'CCS-800',
        serialNumber: 'CCS-800-2023-134',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Variable frequency drive malfunction',
        description: 'VFD showing fault codes and causing erratic conveyor speeds affecting production throughput.',
        category: 'Electronics',
        priority: 'High',
        severity: 'Major'
      },
      status: 'Testing',
      assignedTo: 'Lisa Park',
      assignedTeam: 'Electronics Team',
      createdDate: '2024-01-11T16:45:00Z',
      startedDate: '2024-01-12T08:00:00Z',
      expectedResolution: '2024-01-16T14:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '22h 30m',
      progressPercentage: 80,
      currentStep: 'Testing VFD replacement under load',
      tags: ['VFD', 'Motor Control', 'Testing'],
      attachments: 3,
      lastUpdate: '2024-01-15T13:15:00Z',
      contactPreference: 'Email',
      estimatedHours: 12,
      actualHours: 10,
      partsRequired: ['VFD Unit', 'Control Cables']
    },
    {
      id: '5',
      ticketNumber: 'SR-2024-0013',
      customer: {
        name: 'Michael Brown',
        company: 'Precision Manufacturing',
        phone: '+1-555-0512',
        email: 'michael.brown@precision.com',
        address: '512 Precision Drive, San Jose, CA 95112'
      },
      product: {
        name: 'Coordinate Measuring Machine',
        model: 'CMM-400',
        serialNumber: 'CMM-400-2022-267',
        warrantyStatus: 'Extended'
      },
      issue: {
        title: 'Software license expired',
        description: 'Measurement software license has expired preventing use of advanced measuring functions.',
        category: 'Software',
        priority: 'Medium',
        severity: 'Major'
      },
      status: 'On Hold',
      assignedTo: 'David Lee',
      assignedTeam: 'Software Team',
      createdDate: '2024-01-13T10:30:00Z',
      startedDate: '2024-01-13T11:00:00Z',
      expectedResolution: '2024-01-18T16:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '3d 1h 30m',
      progressPercentage: 15,
      currentStep: 'Waiting for license approval from vendor',
      tags: ['Software', 'License', 'CMM'],
      attachments: 1,
      lastUpdate: '2024-01-15T09:00:00Z',
      contactPreference: 'Email',
      estimatedHours: 4,
      actualHours: 1,
      partsRequired: []
    },
    {
      id: '6',
      ticketNumber: 'SR-2024-0014',
      customer: {
        name: 'Amanda Taylor',
        company: 'TextileCorp Industries',
        phone: '+1-555-0634',
        email: 'amanda.taylor@textilecorp.com',
        address: '634 Textile Street, Charlotte, NC 28201'
      },
      product: {
        name: 'Industrial Dyeing Machine',
        model: 'IDM-1200',
        serialNumber: 'IDM-1200-2023-156',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Temperature control system failure',
        description: 'Temperature sensors providing inconsistent readings causing poor dye quality and batch rejections.',
        category: 'Electronics',
        priority: 'High',
        severity: 'Major'
      },
      status: 'In Progress',
      assignedTo: 'Carlos Santos',
      assignedTeam: 'Field Service',
      createdDate: '2024-01-09T12:00:00Z',
      startedDate: '2024-01-10T07:30:00Z',
      expectedResolution: '2024-01-16T15:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '23h 30m',
      progressPercentage: 70,
      currentStep: 'Installing new temperature sensors',
      tags: ['Temperature', 'Sensors', 'Dyeing'],
      attachments: 5,
      lastUpdate: '2024-01-15T15:30:00Z',
      contactPreference: 'WhatsApp',
      estimatedHours: 20,
      actualHours: 14,
      partsRequired: ['Temperature Sensors', 'Control Module']
    },
    {
      id: '7',
      ticketNumber: 'SR-2024-0015',
      customer: {
        name: 'Kevin Zhang',
        company: 'AutoAssembly Tech',
        phone: '+1-555-0745',
        email: 'kevin.zhang@autoassembly.com',
        address: '745 Assembly Line Rd, Toledo, OH 43601'
      },
      product: {
        name: 'Pneumatic Assembly Station',
        model: 'PAS-600',
        serialNumber: 'PAS-600-2023-203',
        warrantyStatus: 'Active'
      },
      issue: {
        title: 'Air pressure fluctuations',
        description: 'Pneumatic system experiencing pressure drops during peak operation affecting assembly precision.',
        category: 'Pneumatic',
        priority: 'Medium',
        severity: 'Minor'
      },
      status: 'Diagnostic',
      assignedTo: 'Rachel Green',
      assignedTeam: 'Mechanical Team',
      createdDate: '2024-01-14T15:30:00Z',
      startedDate: '2024-01-15T08:00:00Z',
      expectedResolution: '2024-01-19T12:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '3d 21h 30m',
      progressPercentage: 30,
      currentStep: 'Checking air compressor capacity',
      tags: ['Pneumatic', 'Pressure', 'Assembly'],
      attachments: 2,
      lastUpdate: '2024-01-15T12:00:00Z',
      contactPreference: 'Email',
      estimatedHours: 16,
      actualHours: 4,
      partsRequired: ['Pressure Regulator', 'Air Filter']
    },
    {
      id: '8',
      ticketNumber: 'SR-2024-0016',
      customer: {
        name: 'Patricia Moore',
        company: 'ChemProcess Solutions',
        phone: '+1-555-0856',
        email: 'patricia.moore@chemprocess.com',
        address: '856 Chemical Way, Houston, TX 77001'
      },
      product: {
        name: 'Chemical Mixing Reactor',
        model: 'CMR-2500',
        serialNumber: 'CMR-2500-2022-089',
        warrantyStatus: 'Extended'
      },
      issue: {
        title: 'Agitator motor bearing replacement',
        description: 'Motor bearings showing signs of wear with increased vibration and noise levels.',
        category: 'Mechanical',
        priority: 'High',
        severity: 'Major'
      },
      status: 'In Progress',
      assignedTo: 'James Miller',
      assignedTeam: 'Mechanical Team',
      createdDate: '2024-01-07T11:00:00Z',
      startedDate: '2024-01-08T09:00:00Z',
      expectedResolution: '2024-01-16T16:00:00Z',
      slaStatus: 'On Track',
      timeRemaining: '1d 0h 30m',
      progressPercentage: 85,
      currentStep: 'Final bearing installation and testing',
      tags: ['Motor', 'Bearings', 'Agitator'],
      attachments: 4,
      lastUpdate: '2024-01-15T16:00:00Z',
      contactPreference: 'Phone',
      estimatedHours: 32,
      actualHours: 28,
      partsRequired: ['Motor Bearings', 'Coupling Kit']
    }
  ];

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = !filterPriority || request.issue.priority === filterPriority;
    const matchesCategory = !filterCategory || request.issue.category === filterCategory;
    const matchesAssignee = !filterAssignee || request.assignedTo === filterAssignee;
    const matchesStatus = !filterStatus || request.status === filterStatus;

    return matchesSearch && matchesPriority && matchesCategory && matchesAssignee && matchesStatus;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'text-blue-600 bg-blue-50';
      case 'Diagnostic': return 'text-purple-600 bg-purple-50';
      case 'Testing': return 'text-green-600 bg-green-50';
      case 'Waiting Parts': return 'text-orange-600 bg-orange-50';
      case 'On Hold': return 'text-red-600 bg-red-50';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress': return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'Diagnostic': return <Settings className="h-4 w-4 text-purple-600" />;
      case 'Testing': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Waiting Parts': return <PauseCircle className="h-4 w-4 text-orange-600" />;
      case 'On Hold': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">In Progress Service Requests</h1>
        <p className="text-gray-600">Monitor and manage service requests currently being worked on</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by ticket, customer, assignee, or issue..."
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
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <option value="Calibration">Calibration</option>
              <option value="Pneumatic">Pneumatic</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Testing">Testing</option>
              <option value="Waiting Parts">Waiting Parts</option>
              <option value="On Hold">On Hold</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
            >
              <option value="">All Assignees</option>
              <option value="Alex Chen">Alex Chen</option>
              <option value="Maria Rodriguez">Maria Rodriguez</option>
              <option value="Tom Wilson">Tom Wilson</option>
              <option value="Lisa Park">Lisa Park</option>
              <option value="David Lee">David Lee</option>
              <option value="Carlos Santos">Carlos Santos</option>
              <option value="Rachel Green">Rachel Green</option>
              <option value="James Miller">James Miller</option>
            </select>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total In Progress</p>
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
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(filteredRequests.reduce((sum, r) => sum + r.progressPercentage, 0) / filteredRequests.length)}%
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
                  Assigned Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline & SLA
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
                      <div className="text-xs text-gray-500">{request.product.name}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getWarrantyColor(request.product.warrantyStatus)}`}>
                        {request.product.warrantyStatus} Warranty
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{request.assignedTo}</div>
                      <div className="text-sm text-gray-600">{request.assignedTeam}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {request.actualHours}h / {request.estimatedHours}h
                      </div>
                      {request.partsRequired.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Wrench className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{request.partsRequired.length} parts needed</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${request.progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{request.progressPercentage}% Complete</div>
                      <div className="text-xs text-gray-600 mt-1">{request.currentStep}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSLAStatusColor(request.slaStatus)}`}>
                        {request.slaStatus}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{request.timeRemaining}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Started: {new Date(request.startedDate).toLocaleDateString()}
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
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusIcon(selectedRequest.status)}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">{selectedRequest.progressPercentage}% Complete</span>
                  </div>
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
                  <h3 className="font-semibold text-gray-900 mb-3">Assignment & Progress</h3>
                  <div className="space-y-2">
                    <div><strong>Assigned To:</strong> {selectedRequest.assignedTo}</div>
                    <div><strong>Team:</strong> {selectedRequest.assignedTeam}</div>
                    <div><strong>Current Step:</strong> {selectedRequest.currentStep}</div>
                    <div><strong>Hours:</strong> {selectedRequest.actualHours} / {selectedRequest.estimatedHours}</div>
                    {selectedRequest.partsRequired.length > 0 && (
                      <div>
                        <strong>Parts Required:</strong>
                        <div className="mt-1">
                          {selectedRequest.partsRequired.map((part, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-1 mb-1">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Progress Tracking</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full flex items-center justify-center"
                    style={{ width: `${selectedRequest.progressPercentage}%` }}
                  >
                    <span className="text-xs text-white font-medium">{selectedRequest.progressPercentage}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>SLA Status:</strong>
                  <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSLAStatusColor(selectedRequest.slaStatus)}`}>
                    {selectedRequest.slaStatus}
                  </span>
                </div>
                <div>
                  <strong>Time Remaining:</strong> {selectedRequest.timeRemaining}
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

export default InProgressServiceRequestsPage;