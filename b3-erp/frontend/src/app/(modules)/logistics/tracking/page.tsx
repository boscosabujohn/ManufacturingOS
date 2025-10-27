'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Thermometer,
  Navigation,
  Calendar,
  TrendingUp,
  Map,
  Route,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Truck,
  Activity,
  Droplet,
  Wind,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

// TrackingEvent Interface
interface TrackingEvent {
  id: string;
  tracking_id: string;
  shipment_number: string;
  current_location: string;
  last_update: string;
  event_type: 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception' | 'customs_clearance';
  status: string;
  temperature?: number;
  humidity?: number;
  estimated_delivery: string;
  actual_delivery?: string;
  carrier: string;
  origin: string;
  destination: string;
  distance_remaining_km: number;
  notes: string;
  checkpoints_passed: number;
  total_checkpoints: number;
  delay_hours: number;
  customer_name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function LogisticsTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample tracking events data
  const trackingEvents: TrackingEvent[] = [
    {
      id: '1',
      tracking_id: 'TRK-2025-001',
      shipment_number: 'SHP-2025-001',
      current_location: 'Nagpur Hub, Maharashtra',
      last_update: '2025-01-17 14:30:00',
      event_type: 'in_transit',
      status: 'In Transit - On Schedule',
      temperature: 22,
      humidity: 45,
      estimated_delivery: '2025-01-18 16:00:00',
      carrier: 'BlueDart Express',
      origin: 'Mumbai, Maharashtra',
      destination: 'Jamshedpur, Jharkhand',
      distance_remaining_km: 850,
      notes: 'Package on schedule, weather conditions favorable',
      checkpoints_passed: 3,
      total_checkpoints: 5,
      delay_hours: 0,
      customer_name: 'Tata Steel Ltd',
      priority: 'high'
    },
    {
      id: '2',
      tracking_id: 'TRK-2025-002',
      shipment_number: 'SHP-2025-002',
      current_location: 'Ahmedabad Sorting Center',
      last_update: '2025-01-17 12:15:00',
      event_type: 'picked_up',
      status: 'Picked Up - Processing',
      estimated_delivery: '2025-01-19 10:00:00',
      carrier: 'DTDC Courier',
      origin: 'Delhi, NCR',
      destination: 'Ahmedabad, Gujarat',
      distance_remaining_km: 920,
      notes: 'Collected from sender, sorting in progress',
      checkpoints_passed: 1,
      total_checkpoints: 4,
      delay_hours: 0,
      customer_name: 'Reliance Industries',
      priority: 'critical'
    },
    {
      id: '3',
      tracking_id: 'TRK-2025-003',
      shipment_number: 'SHP-2025-003',
      current_location: 'Pune Warehouse',
      last_update: '2025-01-17 09:45:00',
      event_type: 'delivered',
      status: 'Delivered Successfully',
      temperature: 24,
      estimated_delivery: '2025-01-17 10:00:00',
      actual_delivery: '2025-01-17 09:45:00',
      carrier: 'Delhivery',
      origin: 'Chennai, Tamil Nadu',
      destination: 'Pune, Maharashtra',
      distance_remaining_km: 0,
      notes: 'Successfully delivered to receiver, signature obtained',
      checkpoints_passed: 5,
      total_checkpoints: 5,
      delay_hours: 0,
      customer_name: 'Mahindra & Mahindra',
      priority: 'medium'
    },
    {
      id: '4',
      tracking_id: 'TRK-2025-004',
      shipment_number: 'SHP-2025-004',
      current_location: 'Bangalore Hub',
      last_update: '2025-01-17 16:20:00',
      event_type: 'exception',
      status: 'Delayed - Weather Conditions',
      temperature: 28,
      humidity: 72,
      estimated_delivery: '2025-01-18 14:00:00',
      carrier: 'FedEx India',
      origin: 'Bangalore, Karnataka',
      destination: 'Hyderabad, Telangana',
      distance_remaining_km: 562,
      notes: 'Delayed due to heavy rain, expecting clearance soon',
      checkpoints_passed: 2,
      total_checkpoints: 4,
      delay_hours: 6,
      customer_name: 'Larsen & Toubro',
      priority: 'high'
    },
    {
      id: '5',
      tracking_id: 'TRK-2025-005',
      shipment_number: 'SHP-2025-005',
      current_location: 'Kolkata Facility',
      last_update: '2025-01-17 11:00:00',
      event_type: 'in_transit',
      status: 'In Transit',
      temperature: 26,
      estimated_delivery: '2025-01-20 15:00:00',
      carrier: 'Gati-KWE',
      origin: 'Kolkata, West Bengal',
      destination: 'Bhubaneswar, Odisha',
      distance_remaining_km: 440,
      notes: 'On route to destination',
      checkpoints_passed: 2,
      total_checkpoints: 3,
      delay_hours: 0,
      customer_name: 'Hindalco Industries',
      priority: 'low'
    },
    {
      id: '6',
      tracking_id: 'TRK-2025-006',
      shipment_number: 'SHP-2025-007',
      current_location: 'Chennai Local Office',
      last_update: '2025-01-17 08:30:00',
      event_type: 'out_for_delivery',
      status: 'Out for Delivery',
      temperature: 26,
      humidity: 60,
      estimated_delivery: '2025-01-17 18:00:00',
      carrier: 'BlueDart Express',
      origin: 'Mumbai, Maharashtra',
      destination: 'Chennai, Tamil Nadu',
      distance_remaining_km: 15,
      notes: 'Delivery scheduled for today, driver en route',
      checkpoints_passed: 4,
      total_checkpoints: 5,
      delay_hours: 0,
      customer_name: 'Adani Group',
      priority: 'high'
    },
    {
      id: '7',
      tracking_id: 'TRK-2025-007',
      shipment_number: 'SHP-2025-008',
      current_location: 'Mumbai Customs',
      last_update: '2025-01-17 15:45:00',
      event_type: 'customs_clearance',
      status: 'Customs Clearance in Progress',
      temperature: 23,
      humidity: 55,
      estimated_delivery: '2025-01-20 12:00:00',
      carrier: 'DHL Express',
      origin: 'Singapore',
      destination: 'Mumbai, Maharashtra',
      distance_remaining_km: 0,
      notes: 'International shipment - customs documentation under review',
      checkpoints_passed: 3,
      total_checkpoints: 6,
      delay_hours: 12,
      customer_name: 'Infosys Technologies',
      priority: 'critical'
    },
    {
      id: '8',
      tracking_id: 'TRK-2025-008',
      shipment_number: 'SHP-2025-009',
      current_location: 'Delhi Distribution Center',
      last_update: '2025-01-17 13:20:00',
      event_type: 'in_transit',
      status: 'In Transit',
      temperature: 21,
      humidity: 42,
      estimated_delivery: '2025-01-19 09:00:00',
      carrier: 'Safexpress',
      origin: 'Jaipur, Rajasthan',
      destination: 'Delhi, NCR',
      distance_remaining_km: 285,
      notes: 'Standard transit, no issues reported',
      checkpoints_passed: 2,
      total_checkpoints: 3,
      delay_hours: 0,
      customer_name: 'Hero MotoCorp',
      priority: 'medium'
    },
    {
      id: '9',
      tracking_id: 'TRK-2025-009',
      shipment_number: 'SHP-2025-010',
      current_location: 'Hyderabad Warehouse',
      last_update: '2025-01-17 10:15:00',
      event_type: 'delivered',
      status: 'Delivered',
      temperature: 25,
      estimated_delivery: '2025-01-17 11:00:00',
      actual_delivery: '2025-01-17 10:15:00',
      carrier: 'VRL Logistics',
      origin: 'Bangalore, Karnataka',
      destination: 'Hyderabad, Telangana',
      distance_remaining_km: 0,
      notes: 'Early delivery completed',
      checkpoints_passed: 4,
      total_checkpoints: 4,
      delay_hours: 0,
      customer_name: 'Wipro Ltd',
      priority: 'medium'
    },
    {
      id: '10',
      tracking_id: 'TRK-2025-010',
      shipment_number: 'SHP-2025-011',
      current_location: 'Pune Sorting Hub',
      last_update: '2025-01-17 17:00:00',
      event_type: 'exception',
      status: 'Exception - Address Verification Required',
      temperature: 27,
      estimated_delivery: '2025-01-19 14:00:00',
      carrier: 'XpressBees',
      origin: 'Mumbai, Maharashtra',
      destination: 'Pune, Maharashtra',
      distance_remaining_km: 145,
      notes: 'Customer contact required for address verification',
      checkpoints_passed: 1,
      total_checkpoints: 3,
      delay_hours: 24,
      customer_name: 'Tech Mahindra',
      priority: 'medium'
    }
  ];

  // Calculate stats
  const stats = {
    trackedShipments: trackingEvents.length,
    activeRoutes: trackingEvents.filter(t => t.event_type === 'in_transit' || t.event_type === 'out_for_delivery').length,
    checkpointsPassed: trackingEvents.reduce((sum, t) => sum + t.checkpoints_passed, 0),
    avgTransitTime: '2.5 days',
    deliveredToday: trackingEvents.filter(t => t.event_type === 'delivered' && t.actual_delivery?.startsWith('2025-01-17')).length,
    exceptions: trackingEvents.filter(t => t.event_type === 'exception').length,
    onTimeRate: ((trackingEvents.filter(t => t.delay_hours === 0).length / trackingEvents.length) * 100).toFixed(1)
  };

  // Get unique locations for filter
  const locations = Array.from(new Set(trackingEvents.map(t => t.current_location)));

  // Filter tracking events
  const filteredEvents = trackingEvents.filter(event => {
    const matchesSearch =
      event.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.shipment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.current_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.customer_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || event.event_type === statusFilter;
    const matchesLocation = locationFilter === 'all' || event.current_location === locationFilter;
    const matchesPriority = priorityFilter === 'all' || event.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesLocation && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  // Event type badge component
  const EventTypeBadge = ({ type }: { type: TrackingEvent['event_type'] }) => {
    const styles = {
      picked_up: 'bg-blue-100 text-blue-800 border-blue-200',
      in_transit: 'bg-purple-100 text-purple-800 border-purple-200',
      out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      exception: 'bg-red-100 text-red-800 border-red-200',
      customs_clearance: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const icons = {
      picked_up: Package,
      in_transit: Navigation,
      out_for_delivery: Route,
      delivered: CheckCircle,
      exception: AlertCircle,
      customs_clearance: Clock
    };

    const Icon = icons[type];

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type]}`}>
        <Icon className="w-3 h-3" />
        {type.replace(/_/g, ' ').toUpperCase()}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: TrackingEvent['priority'] }) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  // Progress bar component
  const ProgressBar = ({ current, total }: { current: number; total: number }) => {
    const percentage = (current / total) * 100;
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{current}/{total} checkpoints</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistics Tracking System</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time shipment tracking, monitoring, and analytics dashboard</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Track New Shipment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tracked Shipments</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.trackedShipments}</p>
              <p className="text-xs text-gray-500 mt-1">Total active</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeRoutes}</p>
              <p className="text-xs text-gray-500 mt-1">In transit</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Navigation className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.deliveredToday}</p>
              <p className="text-xs text-gray-500 mt-1">Completed</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Exceptions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.exceptions}</p>
              <p className="text-xs text-gray-500 mt-1">Need attention</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-600">Checkpoints Passed</p>
              <p className="text-xl font-bold text-cyan-900 mt-1">{stats.checkpointsPassed}</p>
            </div>
            <Target className="w-8 h-8 text-cyan-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Transit Time</p>
              <p className="text-xl font-bold text-orange-900 mt-1">{stats.avgTransitTime}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">On-Time Rate</p>
              <p className="text-xl font-bold text-green-900 mt-1">{stats.onTimeRate}%</p>
            </div>
            <Zap className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking ID, shipment, location, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="exception">Exception</option>
                <option value="customs_clearance">Customs Clearance</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <Activity className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conditions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.tracking_id}</div>
                        <div className="text-xs text-gray-500">Shipment: {event.shipment_number}</div>
                        <div className="text-xs text-gray-400">Carrier: {event.carrier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.customer_name}</div>
                    <div className="text-xs text-gray-500">{event.destination}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-900">{event.current_location}</div>
                        <div className="text-xs text-gray-500">Updated: {event.last_update}</div>
                        {event.distance_remaining_km > 0 && (
                          <div className="text-xs text-blue-600">{event.distance_remaining_km} km remaining</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ minWidth: '200px' }}>
                    <ProgressBar current={event.checkpoints_passed} total={event.total_checkpoints} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <EventTypeBadge type={event.event_type} />
                    {event.delay_hours > 0 && (
                      <div className="text-xs text-red-600 mt-1">Delayed {event.delay_hours}h</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {event.temperature && (
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-900">{event.temperature}°C</span>
                        </div>
                      )}
                      {event.humidity && (
                        <div className="flex items-center gap-2">
                          <Droplet className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-900">{event.humidity}%</span>
                        </div>
                      )}
                      {!event.temperature && !event.humidity && (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Est: {event.estimated_delivery}</span>
                      </div>
                      {event.actual_delivery && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span>Act: {event.actual_delivery}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={event.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Map className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length} tracking events
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
