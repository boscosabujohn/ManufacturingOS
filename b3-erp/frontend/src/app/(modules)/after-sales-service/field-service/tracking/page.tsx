'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, Clock, Phone, User, CheckCircle, AlertTriangle, Battery, Wifi, RefreshCw, Search, Filter, Calendar, Truck, Tool, Home, Building2, Zap, TrendingUp } from 'lucide-react';

interface TechnicianLocation {
  id: string;
  technicianId: string;
  technicianName: string;
  phone: string;
  email: string;
  currentStatus: 'available' | 'on_job' | 'in_transit' | 'on_break' | 'offline';
  currentJob?: string;
  currentCustomer?: string;
  latitude: number;
  longitude: number;
  location: string;
  lastUpdated: string;
  batteryLevel: number;
  networkStatus: 'online' | 'offline' | 'poor';
  todayJobs: number;
  completedJobs: number;
  pendingJobs: number;
  totalDistance: number; // in km
  workingHours: number;
  nextJobLocation?: string;
  nextJobTime?: string;
  vehicleNumber?: string;
  skillSet: string[];
  rating: number;
  responseTime: number; // in minutes
}

const mockTechnicians: TechnicianLocation[] = [
  {
    id: '1',
    technicianId: 'TECH001',
    technicianName: 'Suresh Patel',
    phone: '+91-98765-43210',
    email: 'suresh.patel@company.com',
    currentStatus: 'on_job',
    currentJob: 'SR-2025-145',
    currentCustomer: 'Sharma Modular Kitchens Pvt Ltd',
    latitude: 19.0760,
    longitude: 72.8777,
    location: 'Andheri West, Mumbai',
    lastUpdated: '2025-10-23T14:25:00',
    batteryLevel: 78,
    networkStatus: 'online',
    todayJobs: 5,
    completedJobs: 3,
    pendingJobs: 2,
    totalDistance: 32.5,
    workingHours: 6.5,
    nextJobLocation: 'Bandra East',
    nextJobTime: '15:30',
    vehicleNumber: 'MH-02-AB-1234',
    skillSet: ['Plumbing', 'Installation', 'Repair'],
    rating: 4.8,
    responseTime: 15
  },
  {
    id: '2',
    technicianId: 'TECH002',
    technicianName: 'Rajesh Kumar',
    phone: '+91-98765-43211',
    email: 'rajesh.kumar@company.com',
    currentStatus: 'in_transit',
    currentJob: 'SR-2025-148',
    currentCustomer: 'Kitchen World Pvt Ltd',
    latitude: 19.1136,
    longitude: 72.8697,
    location: 'Malad West, Mumbai',
    lastUpdated: '2025-10-23T14:28:00',
    batteryLevel: 92,
    networkStatus: 'online',
    todayJobs: 4,
    completedJobs: 2,
    pendingJobs: 2,
    totalDistance: 28.3,
    workingHours: 5.2,
    nextJobLocation: 'Goregaon West',
    nextJobTime: '15:00',
    vehicleNumber: 'MH-02-CD-5678',
    skillSet: ['Electrical', 'Hardware', 'Installation'],
    rating: 4.6,
    responseTime: 20
  },
  {
    id: '3',
    technicianId: 'TECH003',
    technicianName: 'Vikram Singh',
    phone: '+91-98765-43212',
    email: 'vikram.singh@company.com',
    currentStatus: 'available',
    latitude: 19.2183,
    longitude: 72.9781,
    location: 'Thane West, Mumbai',
    lastUpdated: '2025-10-23T14:30:00',
    batteryLevel: 65,
    networkStatus: 'online',
    todayJobs: 6,
    completedJobs: 4,
    pendingJobs: 2,
    totalDistance: 45.2,
    workingHours: 7.0,
    nextJobLocation: 'Dombivli',
    nextJobTime: '16:00',
    vehicleNumber: 'MH-04-EF-9012',
    skillSet: ['Carpentry', 'Installation', 'Repair'],
    rating: 4.9,
    responseTime: 12
  },
  {
    id: '4',
    technicianId: 'TECH004',
    technicianName: 'Rahul Verma',
    phone: '+91-98765-43213',
    email: 'rahul.verma@company.com',
    currentStatus: 'on_job',
    currentJob: 'SR-2025-142',
    currentCustomer: 'Modern Kitchen Solutions',
    latitude: 19.1197,
    longitude: 72.9081,
    location: 'Powai, Mumbai',
    lastUpdated: '2025-10-23T14:27:00',
    batteryLevel: 45,
    networkStatus: 'online',
    todayJobs: 4,
    completedJobs: 2,
    pendingJobs: 2,
    totalDistance: 38.7,
    workingHours: 6.0,
    nextJobLocation: 'Vikhroli',
    nextJobTime: '16:30',
    vehicleNumber: 'MH-03-GH-3456',
    skillSet: ['Electronics', 'Appliances', 'Troubleshooting'],
    rating: 4.7,
    responseTime: 18
  },
  {
    id: '5',
    technicianId: 'TECH005',
    technicianName: 'Amit Shah',
    phone: '+91-98765-43214',
    email: 'amit.shah@company.com',
    currentStatus: 'on_break',
    latitude: 18.9220,
    longitude: 72.8347,
    location: 'Worli, Mumbai',
    lastUpdated: '2025-10-23T14:15:00',
    batteryLevel: 88,
    networkStatus: 'online',
    todayJobs: 3,
    completedJobs: 3,
    pendingJobs: 0,
    totalDistance: 22.4,
    workingHours: 4.5,
    vehicleNumber: 'MH-01-IJ-7890',
    skillSet: ['General Service', 'Maintenance', 'Installation'],
    rating: 4.5,
    responseTime: 25
  },
  {
    id: '6',
    technicianId: 'TECH006',
    technicianName: 'Anita Reddy',
    phone: '+91-98765-43215',
    email: 'anita.reddy@company.com',
    currentStatus: 'offline',
    latitude: 18.9067,
    longitude: 72.8147,
    location: 'Parel, Mumbai',
    lastUpdated: '2025-10-23T13:45:00',
    batteryLevel: 15,
    networkStatus: 'offline',
    todayJobs: 2,
    completedJobs: 2,
    pendingJobs: 0,
    totalDistance: 18.9,
    workingHours: 3.5,
    vehicleNumber: 'MH-02-KL-2345',
    skillSet: ['Quality Check', 'Installation', 'Customer Service'],
    rating: 4.8,
    responseTime: 15
  },
  {
    id: '7',
    technicianId: 'TECH007',
    technicianName: 'Priya Desai',
    phone: '+91-98765-43216',
    email: 'priya.desai@company.com',
    currentStatus: 'in_transit',
    currentJob: 'SR-2025-151',
    currentCustomer: 'Elite Kitchen Designs',
    latitude: 19.0330,
    longitude: 73.0297,
    location: 'Vashi, Navi Mumbai',
    lastUpdated: '2025-10-23T14:29:00',
    batteryLevel: 72,
    networkStatus: 'online',
    todayJobs: 5,
    completedJobs: 3,
    pendingJobs: 2,
    totalDistance: 55.3,
    workingHours: 6.8,
    nextJobLocation: 'Panvel',
    nextJobTime: '15:45',
    vehicleNumber: 'MH-06-MN-6789',
    skillSet: ['Advanced Repair', 'Electronics', 'Diagnostics'],
    rating: 4.9,
    responseTime: 10
  },
  {
    id: '8',
    technicianId: 'TECH008',
    technicianName: 'Meena Iyer',
    phone: '+91-98765-43217',
    email: 'meena.iyer@company.com',
    currentStatus: 'available',
    latitude: 19.0176,
    longitude: 72.8562,
    location: 'Dadar, Mumbai',
    lastUpdated: '2025-10-23T14:30:00',
    batteryLevel: 95,
    networkStatus: 'online',
    todayJobs: 4,
    completedJobs: 3,
    pendingJobs: 1,
    totalDistance: 26.7,
    workingHours: 5.5,
    nextJobLocation: 'Matunga',
    nextJobTime: '15:15',
    vehicleNumber: 'MH-01-OP-4567',
    skillSet: ['Installation', 'Training', 'Customer Support'],
    rating: 4.7,
    responseTime: 16
  }
];

export default function TechnicianTrackingPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianLocation | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter technicians
  const filteredTechnicians = mockTechnicians.filter(tech => {
    const matchesSearch = tech.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.technicianId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tech.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalTechnicians = mockTechnicians.length;
  const activeTechnicians = mockTechnicians.filter(t => t.currentStatus === 'on_job' || t.currentStatus === 'in_transit').length;
  const availableTechnicians = mockTechnicians.filter(t => t.currentStatus === 'available').length;
  const totalJobsToday = mockTechnicians.reduce((sum, t) => sum + t.todayJobs, 0);
  const completedJobsToday = mockTechnicians.reduce((sum, t) => sum + t.completedJobs, 0);
  const avgResponseTime = Math.round(mockTechnicians.reduce((sum, t) => sum + t.responseTime, 0) / totalTechnicians);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'on_job': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on_break': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'on_job': return <Tool className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'on_break': return <Clock className="h-4 w-4" />;
      case 'offline': return <AlertTriangle className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTimeSinceUpdate = (lastUpdated: string) => {
    const diff = currentTime.getTime() - new Date(lastUpdated).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Navigation className="h-8 w-8 text-emerald-600" />
          Technician Tracking
        </h1>
        <p className="text-gray-600 mt-1">Real-time GPS tracking and monitoring of field technicians</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Technicians</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalTechnicians}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{activeTechnicians}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{availableTechnicians}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jobs Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalJobsToday}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Tool className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{completedJobsToday}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{avgResponseTime}m</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="on_job">On Job</option>
              <option value="in_transit">In Transit</option>
              <option value="on_break">On Break</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Placeholder & Technicians List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Live Map View
                </h3>
                <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm flex items-center gap-2 transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
            </div>
            <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
              {/* Placeholder for actual map integration */}
              <div className="text-center">
                <MapPin className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map View</h3>
                <p className="text-gray-600 mb-4">Integrate with Google Maps, Mapbox, or OpenStreetMap</p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {mockTechnicians.slice(0, 6).map((tech) => (
                    <div key={tech.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(tech.currentStatus)}
                        <span className="text-xs font-medium text-gray-900">{tech.technicianName.split(' ')[0]}</span>
                      </div>
                      <div className="text-xs text-gray-600">{tech.location.split(',')[0]}</div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(tech.currentStatus)}`}>
                        {tech.currentStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technicians List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Technicians ({filteredTechnicians.length})
              </h3>
            </div>
            <div className="overflow-y-auto max-h-[600px] divide-y divide-gray-200">
              {filteredTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedTechnician?.id === tech.id ? 'bg-emerald-50 border-l-4 border-emerald-600' : ''
                  }`}
                  onClick={() => setSelectedTechnician(tech)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{tech.technicianName}</div>
                      <div className="text-xs text-gray-500">{tech.technicianId}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(tech.currentStatus)}`}>
                      {getStatusIcon(tech.currentStatus)}
                      {tech.currentStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{tech.location}</span>
                    </div>

                    {tech.currentJob && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Tool className="h-3 w-3" />
                        <span className="truncate">{tech.currentJob} - {tech.currentCustomer}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Battery className={`h-3 w-3 ${getBatteryColor(tech.batteryLevel)}`} />
                          <span className={getBatteryColor(tech.batteryLevel)}>{tech.batteryLevel}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wifi className={`h-3 w-3 ${tech.networkStatus === 'online' ? 'text-green-600' : 'text-red-600'}`} />
                          <span className={tech.networkStatus === 'online' ? 'text-green-600' : 'text-red-600'}>
                            {tech.networkStatus}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-3 w-3" />
                        {getTimeSinceUpdate(tech.lastUpdated)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="text-xs">
                        <span className="font-medium text-emerald-600">{tech.completedJobs}</span>
                        <span className="text-gray-500"> / {tech.todayJobs} jobs</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {tech.totalDistance.toFixed(1)} km
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Technician Info Modal */}
      {selectedTechnician && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedTechnician.technicianName}</h2>
                <p className="text-sm text-gray-600">{selectedTechnician.technicianId}</p>
              </div>
              <button
                onClick={() => setSelectedTechnician(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <AlertTriangle className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Status & Location */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedTechnician.currentStatus)}`}>
                    {getStatusIcon(selectedTechnician.currentStatus)}
                    {selectedTechnician.currentStatus.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Battery className={`h-5 w-5 ${getBatteryColor(selectedTechnician.batteryLevel)}`} />
                      <span className={`font-medium ${getBatteryColor(selectedTechnician.batteryLevel)}`}>
                        {selectedTechnician.batteryLevel}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className={`h-5 w-5 ${selectedTechnician.networkStatus === 'online' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`font-medium ${selectedTechnician.networkStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedTechnician.networkStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">Current Location</div>
                      <div className="text-sm text-gray-600">{selectedTechnician.location}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last updated: {getTimeSinceUpdate(selectedTechnician.lastUpdated)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Job */}
              {selectedTechnician.currentJob && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Job</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tool className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">{selectedTechnician.currentJob}</span>
                    </div>
                    <div className="text-sm text-blue-700">
                      <Building2 className="h-4 w-4 inline mr-2" />
                      {selectedTechnician.currentCustomer}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact & Vehicle */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      {selectedTechnician.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 truncate">
                      <User className="h-4 w-4" />
                      {selectedTechnician.email}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Vehicle</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4" />
                    {selectedTechnician.vehicleNumber}
                  </div>
                </div>
              </div>

              {/* Today's Stats */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Today's Performance</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedTechnician.todayJobs}</div>
                    <div className="text-xs text-gray-600">Total Jobs</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{selectedTechnician.completedJobs}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedTechnician.pendingJobs}</div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedTechnician.totalDistance.toFixed(1)}</div>
                    <div className="text-xs text-gray-600">Distance (km)</div>
                  </div>
                </div>
              </div>

              {/* Skills & Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills & Performance</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTechnician.skillSet.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium">Rating:</span>
                    <span className="text-lg font-bold text-emerald-600">{selectedTechnician.rating}/5.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Avg Response:</span>
                    <span className="text-lg font-bold text-blue-600">{selectedTechnician.responseTime}m</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedTechnician(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.location.href = `tel:${selectedTechnician.phone}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Technician
                </button>
                <button
                  onClick={() => router.push(`/after-sales-service/field-service/view/${selectedTechnician.technicianId}`)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
