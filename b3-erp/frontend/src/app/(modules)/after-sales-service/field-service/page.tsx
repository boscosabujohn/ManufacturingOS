'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Eye, Edit, MapPin, Navigation, CheckCircle, Clock, XCircle, Wrench, User, Phone, TrendingUp, Download, Package } from 'lucide-react';

interface FieldServiceJob {
  id: string;
  jobNumber: string;
  customerId: string;
  customerName: string;
  status: 'scheduled' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'P1 - Critical' | 'P2 - High' | 'P3 - Medium' | 'P4 - Low';
  engineerId?: string;
  engineerName?: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  estimatedDuration: number; // hours
  actualDuration?: number; // hours
  equipmentModel: string;
  issueType: string;
  siteAddress: string;
  siteContactPerson: string;
  siteContactPhone: string;
  checkInTime?: string;
  checkOutTime?: string;
  travelDistance?: number; // km
  partsConsumed: number;
  totalPartsValue: number;
  serviceReportSubmitted: boolean;
  customerSignature: boolean;
}

const mockFieldServiceJobs: FieldServiceJob[] = [
  {
    id: '1',
    jobNumber: 'FS-2025-000456',
    customerId: 'CUST001',
    customerName: 'Sharma Modular Kitchens Pvt Ltd',
    status: 'in_progress',
    priority: 'P1 - Critical',
    engineerId: 'ENG001',
    engineerName: 'Rajesh Kumar',
    scheduledDate: '2025-10-17',
    scheduledTimeSlot: '09:00 - 11:00',
    estimatedDuration: 2,
    actualDuration: 1.5,
    equipmentModel: 'Chimney Auto Clean 90cm',
    issueType: 'Motor Replacement',
    siteAddress: 'Shop 12, MG Road, Bangalore - 560001',
    siteContactPerson: 'Rajesh Sharma',
    siteContactPhone: '+91-98765-43210',
    checkInTime: '2025-10-17T09:15:00',
    travelDistance: 8.5,
    partsConsumed: 2,
    totalPartsValue: 8500,
    serviceReportSubmitted: false,
    customerSignature: false,
  },
  {
    id: '2',
    jobNumber: 'FS-2025-000423',
    customerId: 'CUST002',
    customerName: 'Prestige Developers Bangalore',
    status: 'dispatched',
    priority: 'P2 - High',
    engineerId: 'ENG002',
    engineerName: 'Amit Sharma',
    scheduledDate: '2025-10-17',
    scheduledTimeSlot: '11:00 - 13:00',
    estimatedDuration: 2,
    equipmentModel: 'Built-in Oven 60L',
    issueType: 'Temperature Sensor Issue',
    siteAddress: 'Flat 501, Prestige Sunrise Park, Bangalore - 560102',
    siteContactPerson: 'Suresh Menon',
    siteContactPhone: '+91-80-2345-6789',
    travelDistance: 12.3,
    partsConsumed: 0,
    totalPartsValue: 0,
    serviceReportSubmitted: false,
    customerSignature: false,
  },
  {
    id: '3',
    jobNumber: 'FS-2025-000398',
    customerId: 'CUST003',
    customerName: 'Urban Interiors & Designers',
    status: 'completed',
    priority: 'P3 - Medium',
    engineerId: 'ENG003',
    engineerName: 'Priya Patel',
    scheduledDate: '2025-10-16',
    scheduledTimeSlot: '14:00 - 16:00',
    estimatedDuration: 2,
    actualDuration: 1.8,
    equipmentModel: 'Built-in Hob 4 Burner Gas',
    issueType: 'Auto-ignition Repair',
    siteAddress: 'Showroom 3, Koramangala, Bangalore - 560095',
    siteContactPerson: 'Anita Desai',
    siteContactPhone: '+91-98123-45678',
    checkInTime: '2025-10-16T14:10:00',
    checkOutTime: '2025-10-16T15:58:00',
    travelDistance: 6.2,
    partsConsumed: 1,
    totalPartsValue: 450,
    serviceReportSubmitted: true,
    customerSignature: true,
  },
  {
    id: '4',
    jobNumber: 'FS-2025-000501',
    customerId: 'CUST004',
    customerName: 'Elite Contractors & Builders',
    status: 'scheduled',
    priority: 'P1 - Critical',
    engineerId: 'ENG001',
    engineerName: 'Rajesh Kumar',
    scheduledDate: '2025-10-17',
    scheduledTimeSlot: '13:00 - 15:00',
    estimatedDuration: 2,
    equipmentModel: 'Dishwasher 14 Place Settings',
    issueType: 'Water Leakage - Emergency',
    siteAddress: '2BHK, Elite Heights, Whitefield, Bangalore - 560066',
    siteContactPerson: 'Karan Malhotra',
    siteContactPhone: '+91-99876-54321',
    partsConsumed: 0,
    totalPartsValue: 0,
    serviceReportSubmitted: false,
    customerSignature: false,
  },
  {
    id: '5',
    jobNumber: 'FS-2025-000467',
    customerId: 'CUST005',
    customerName: 'DLF Universal Projects',
    status: 'completed',
    priority: 'P4 - Low',
    engineerId: 'ENG004',
    engineerName: 'Sanjay Gupta',
    scheduledDate: '2025-10-15',
    scheduledTimeSlot: '10:00 - 12:00',
    estimatedDuration: 2,
    actualDuration: 1.5,
    equipmentModel: 'Microwave Oven 30L',
    issueType: 'Turntable Motor Replacement',
    siteAddress: 'Villa 12, DLF Garden City, Bangalore - 560067',
    siteContactPerson: 'Vikram Singh',
    siteContactPhone: '+91-98765-12345',
    checkInTime: '2025-10-15T10:05:00',
    checkOutTime: '2025-10-15T11:35:00',
    travelDistance: 15.7,
    partsConsumed: 1,
    totalPartsValue: 1200,
    serviceReportSubmitted: true,
    customerSignature: true,
  },
  {
    id: '6',
    jobNumber: 'FS-2025-000489',
    customerId: 'CUST006',
    customerName: 'Signature Interiors Pune',
    status: 'in_progress',
    priority: 'P2 - High',
    engineerId: 'ENG005',
    engineerName: 'Neha Singh',
    scheduledDate: '2025-10-17',
    scheduledTimeSlot: '10:00 - 12:00',
    estimatedDuration: 2,
    actualDuration: 1,
    equipmentModel: 'Induction Hob 4 Burner',
    issueType: 'Cookware Detection Issue',
    siteAddress: 'Flat 302, Baner, Pune - 411045',
    siteContactPerson: 'Pooja Mehta',
    siteContactPhone: '+91-20-4567-8901',
    checkInTime: '2025-10-17T10:05:00',
    travelDistance: 10.2,
    partsConsumed: 0,
    totalPartsValue: 0,
    serviceReportSubmitted: false,
    customerSignature: false,
  },
  {
    id: '7',
    jobNumber: 'FS-2025-000512',
    customerId: 'CUST007',
    customerName: 'Royal Homes Hyderabad',
    status: 'scheduled',
    priority: 'P3 - Medium',
    engineerId: 'ENG006',
    engineerName: 'Krishna Murthy',
    scheduledDate: '2025-10-18',
    scheduledTimeSlot: '14:00 - 16:00',
    estimatedDuration: 2,
    equipmentModel: 'RO Water Purifier 10L',
    issueType: 'Filter Replacement & Service',
    siteAddress: 'Penthouse, Royal Towers, Hyderabad - 500034',
    siteContactPerson: 'Vikram Reddy',
    siteContactPhone: '+91-40-4567-8901',
    partsConsumed: 0,
    totalPartsValue: 0,
    serviceReportSubmitted: false,
    customerSignature: false,
  },
  {
    id: '8',
    jobNumber: 'FS-2025-000478',
    customerId: 'CUST008',
    customerName: 'Modern Living Ahmedabad',
    status: 'dispatched',
    priority: 'P2 - High',
    engineerId: 'ENG007',
    engineerName: 'Mehul Patel',
    scheduledDate: '2025-10-17',
    scheduledTimeSlot: '15:00 - 17:00',
    estimatedDuration: 2,
    equipmentModel: 'Chimney Curved Glass 60cm',
    issueType: 'Suction Power Reduced',
    siteAddress: 'Flat 804, SG Highway, Ahmedabad - 380015',
    siteContactPerson: 'Mehul Patel',
    siteContactPhone: '+91-79-8765-4321',
    travelDistance: 18.5,
    partsConsumed: 0,
    totalPartsValue: 0,
    serviceReportSubmitted: false,
    customerSignature: false,
  },
  {
    id: '9',
    jobNumber: 'FS-2025-000534',
    customerId: 'CUST009',
    customerName: 'Decor Studio Chennai',
    status: 'scheduled',
    priority: 'P3 - Medium',
    engineerId: 'ENG008',
    engineerName: 'Lakshmi Iyer',
    scheduledDate: '2025-10-19',
    scheduledTimeSlot: '09:00 - 11:00',
    estimatedDuration: 2,
    equipmentModel: 'Built-in Microwave',
    issueType: 'Control Panel Issue',
    siteAddress: 'Villa 23, Anna Nagar, Chennai - 600040',
    siteContactPerson: 'Lakshmi Iyer',
    siteContactPhone: '+91-44-2876-5432',
    partsConsumed: 0,
    totalPartsValue: 0,
    serviceReportSubmitted: false,
    customerSignature: false,
  },
  {
    id: '10',
    jobNumber: 'FS-2025-000445',
    customerId: 'CUST010',
    customerName: 'Cosmos Furniture Mart',
    status: 'completed',
    priority: 'P3 - Medium',
    engineerId: 'ENG003',
    engineerName: 'Priya Patel',
    scheduledDate: '2025-10-14',
    scheduledTimeSlot: '11:00 - 13:00',
    estimatedDuration: 2,
    actualDuration: 2.2,
    equipmentModel: 'Chimney Auto Clean 90cm',
    issueType: 'Filter Cleaning & Maintenance',
    siteAddress: 'Showroom, MG Road, Mumbai - 400001',
    siteContactPerson: 'Ramesh Agarwal',
    siteContactPhone: '+91-22-3456-7890',
    checkInTime: '2025-10-14T11:00:00',
    checkOutTime: '2025-10-14T13:12:00',
    travelDistance: 22.5,
    partsConsumed: 2,
    totalPartsValue: 850,
    serviceReportSubmitted: true,
    customerSignature: true,
  },
];

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  dispatched: 'bg-cyan-100 text-cyan-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusIcons = {
  scheduled: Clock,
  dispatched: Navigation,
  in_progress: Wrench,
  completed: CheckCircle,
  cancelled: XCircle,
};

const priorityColors = {
  'P1 - Critical': 'bg-red-100 text-red-700 border-red-300',
  'P2 - High': 'bg-orange-100 text-orange-700 border-orange-300',
  'P3 - Medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'P4 - Low': 'bg-blue-100 text-blue-700 border-blue-300',
};

export default function FieldServicePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter jobs
  const filteredJobs = mockFieldServiceJobs.filter((job) => {
    const matchesSearch =
      job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.engineerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.equipmentModel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    totalJobs: mockFieldServiceJobs.length,
    scheduledJobs: mockFieldServiceJobs.filter(j => j.status === 'scheduled').length,
    dispatchedJobs: mockFieldServiceJobs.filter(j => j.status === 'dispatched').length,
    inProgressJobs: mockFieldServiceJobs.filter(j => j.status === 'in_progress').length,
    completedJobs: mockFieldServiceJobs.filter(j => j.status === 'completed').length,
    avgJobDuration: mockFieldServiceJobs.filter(j => j.actualDuration).length > 0
      ? mockFieldServiceJobs
          .filter(j => j.actualDuration)
          .reduce((sum, j) => sum + (j.actualDuration || 0), 0) /
        mockFieldServiceJobs.filter(j => j.actualDuration).length
      : 0,
    totalPartsValue: mockFieldServiceJobs.reduce((sum, j) => sum + j.totalPartsValue, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Field Service Jobs</h1>
        <p className="text-gray-600">Manage engineer dispatch and on-site service operations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
            </div>
            <Wrench className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduledJobs}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dispatched</p>
              <p className="text-2xl font-bold text-cyan-600">{stats.dispatchedJobs}</p>
            </div>
            <Navigation className="h-8 w-8 text-cyan-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inProgressJobs}</p>
            </div>
            <Wrench className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedJobs}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Time</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgJobDuration.toFixed(1)}h</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Parts Value</p>
              <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.totalPartsValue)}</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by job number, customer, engineer, or equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="dispatched">Dispatched</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Priority</option>
              <option value="P1 - Critical">P1 - Critical</option>
              <option value="P2 - High">P2 - High</option>
              <option value="P3 - Medium">P3 - Medium</option>
              <option value="P4 - Low">P4 - Low</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push('/after-sales-service/field-service/dispatch')}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Dispatch Board
            </button>
            <button
              onClick={() => router.push('/after-sales-service/field-service/engineer-schedule')}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Engineer Schedule
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Field Service Jobs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment & Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engineer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parts & Report
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedJobs.map((job) => {
                const StatusIcon = statusIcons[job.status];
                return (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{job.jobNumber}</span>
                        <span className="text-sm text-gray-600">{job.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border w-fit ${priorityColors[job.priority]}`}>
                          {job.priority}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${statusColors[job.status]}`}>
                          <StatusIcon className="h-3 w-3" />
                          {job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{job.equipmentModel}</span>
                        <span className="text-xs text-gray-600">{job.issueType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm">
                        <span className="text-gray-900">
                          {new Date(job.scheduledDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </span>
                        <span className="text-xs text-gray-600">{job.scheduledTimeSlot}</span>
                        {job.actualDuration && (
                          <span className="text-xs text-green-600">Done in {job.actualDuration}h</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {job.engineerName ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-900">{job.engineerName}</span>
                          </div>
                          {job.checkInTime && !job.checkOutTime && (
                            <span className="text-xs text-green-600">Checked In</span>
                          )}
                          {job.checkOutTime && (
                            <span className="text-xs text-gray-600">Checked Out</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-xs">
                        <div className="flex items-start gap-1">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-gray-600 truncate">{job.siteAddress}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{job.siteContactPerson}</span>
                        </div>
                        {job.travelDistance && (
                          <span className="text-xs text-blue-600 mt-1">{job.travelDistance} km</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {job.partsConsumed > 0 ? (
                          <span className="text-sm text-gray-900">{job.partsConsumed} parts</span>
                        ) : (
                          <span className="text-sm text-gray-400">No parts</span>
                        )}
                        {job.totalPartsValue > 0 && (
                          <span className="text-xs text-gray-600">{formatCurrency(job.totalPartsValue)}</span>
                        )}
                        {job.serviceReportSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                            <CheckCircle className="h-3 w-3" />
                            Report Submitted
                          </span>
                        ) : job.status === 'completed' ? (
                          <span className="text-xs text-orange-600 mt-1">Report Pending</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/after-sales-service/field-service/view/${job.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                         
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/after-sales-service/field-service/edit/${job.id}`)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                         
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
