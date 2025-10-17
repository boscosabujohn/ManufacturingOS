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
  Truck,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  Building,
  Weight,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Navigation,
  BoxSelect,
  Archive
} from 'lucide-react';

// ShipmentOrder Interface
interface ShipmentOrder {
  id: string;
  shipment_id: string;
  order_number: string;
  customer_name: string;
  customer_contact: string;
  customer_email: string;
  origin: string;
  destination: string;
  carrier_name: string;
  carrier_contact: string;
  shipped_date: string;
  expected_delivery: string;
  actual_delivery?: string;
  weight_kg: number;
  dimensions: string;
  tracking_number: string;
  status: 'pending' | 'picked' | 'in_transit' | 'delivered' | 'delayed' | 'cancelled';
  shipping_cost: number;
  insurance_value: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  payment_method: string;
  created_by: string;
}

export default function LogisticsShippingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample shipment orders data
  const shipmentOrders: ShipmentOrder[] = [
    {
      id: '1',
      shipment_id: 'SHP-2025-001',
      order_number: 'ORD-10234',
      customer_name: 'Tata Steel Ltd',
      customer_contact: '+91-9876543210',
      customer_email: 'procurement@tatasteel.com',
      origin: 'Mumbai, Maharashtra',
      destination: 'Jamshedpur, Jharkhand',
      carrier_name: 'BlueDart Express',
      carrier_contact: '+91-1800-233-1234',
      shipped_date: '2025-01-15',
      expected_delivery: '2025-01-18',
      weight_kg: 250.5,
      dimensions: '120x80x60 cm',
      tracking_number: 'BD123456789IN',
      status: 'in_transit',
      shipping_cost: 12500,
      insurance_value: 500000,
      priority: 'high',
      notes: 'Handle with care - Industrial equipment parts',
      payment_method: 'Credit',
      created_by: 'Rajesh Kumar'
    },
    {
      id: '2',
      shipment_id: 'SHP-2025-002',
      order_number: 'ORD-10235',
      customer_name: 'Reliance Industries',
      customer_contact: '+91-9876543211',
      customer_email: 'logistics@ril.com',
      origin: 'Delhi, NCR',
      destination: 'Ahmedabad, Gujarat',
      carrier_name: 'DTDC Courier',
      carrier_contact: '+91-1860-208-8208',
      shipped_date: '2025-01-16',
      expected_delivery: '2025-01-19',
      weight_kg: 180.0,
      dimensions: '100x70x50 cm',
      tracking_number: 'DTDC987654321IN',
      status: 'picked',
      shipping_cost: 9800,
      insurance_value: 350000,
      priority: 'urgent',
      notes: 'Urgent delivery required',
      payment_method: 'Prepaid',
      created_by: 'Priya Sharma'
    },
    {
      id: '3',
      shipment_id: 'SHP-2025-003',
      order_number: 'ORD-10236',
      customer_name: 'Mahindra & Mahindra',
      customer_contact: '+91-9876543212',
      customer_email: 'supply@mahindra.com',
      origin: 'Chennai, Tamil Nadu',
      destination: 'Pune, Maharashtra',
      carrier_name: 'Delhivery',
      carrier_contact: '+91-124-4643-000',
      shipped_date: '2025-01-14',
      expected_delivery: '2025-01-17',
      actual_delivery: '2025-01-17',
      weight_kg: 320.8,
      dimensions: '150x90x70 cm',
      tracking_number: 'DLV456789123IN',
      status: 'delivered',
      shipping_cost: 15600,
      insurance_value: 650000,
      priority: 'medium',
      notes: 'Successfully delivered to warehouse',
      payment_method: 'Credit',
      created_by: 'Amit Patel'
    },
    {
      id: '4',
      shipment_id: 'SHP-2025-004',
      order_number: 'ORD-10237',
      customer_name: 'Larsen & Toubro',
      customer_contact: '+91-9876543213',
      customer_email: 'projects@lnt.com',
      origin: 'Bangalore, Karnataka',
      destination: 'Hyderabad, Telangana',
      carrier_name: 'FedEx India',
      carrier_contact: '+91-1800-103-9000',
      shipped_date: '2025-01-13',
      expected_delivery: '2025-01-16',
      weight_kg: 450.2,
      dimensions: '180x100x80 cm',
      tracking_number: 'FDX789456123IN',
      status: 'delayed',
      shipping_cost: 21000,
      insurance_value: 800000,
      priority: 'high',
      notes: 'Delayed due to weather conditions',
      payment_method: 'Credit',
      created_by: 'Vikram Singh'
    },
    {
      id: '5',
      shipment_id: 'SHP-2025-005',
      order_number: 'ORD-10238',
      customer_name: 'Hindalco Industries',
      customer_contact: '+91-9876543214',
      customer_email: 'operations@hindalco.com',
      origin: 'Kolkata, West Bengal',
      destination: 'Bhubaneswar, Odisha',
      carrier_name: 'Gati-KWE',
      carrier_contact: '+91-1800-180-4284',
      shipped_date: '2025-01-17',
      expected_delivery: '2025-01-20',
      weight_kg: 195.5,
      dimensions: '110x75x55 cm',
      tracking_number: 'GATI321654987IN',
      status: 'pending',
      shipping_cost: 10200,
      insurance_value: 420000,
      priority: 'low',
      notes: 'Awaiting pickup confirmation',
      payment_method: 'COD',
      created_by: 'Sneha Reddy'
    },
    {
      id: '6',
      shipment_id: 'SHP-2025-006',
      order_number: 'ORD-10239',
      customer_name: 'JSW Steel',
      customer_contact: '+91-9876543215',
      customer_email: 'logistics@jsw.com',
      origin: 'Mumbai, Maharashtra',
      destination: 'Visakhapatnam, Andhra Pradesh',
      carrier_name: 'BlueDart Express',
      carrier_contact: '+91-1800-233-1234',
      shipped_date: '2025-01-12',
      expected_delivery: '2025-01-15',
      weight_kg: 280.0,
      dimensions: '130x85x65 cm',
      tracking_number: 'BD987123456IN',
      status: 'cancelled',
      shipping_cost: 0,
      insurance_value: 0,
      priority: 'medium',
      notes: 'Order cancelled by customer',
      payment_method: 'Refunded',
      created_by: 'Manoj Kumar'
    },
    {
      id: '7',
      shipment_id: 'SHP-2025-007',
      order_number: 'ORD-10240',
      customer_name: 'Adani Group',
      customer_contact: '+91-9876543216',
      customer_email: 'logistics@adani.com',
      origin: 'Ahmedabad, Gujarat',
      destination: 'Mumbai, Maharashtra',
      carrier_name: 'Delhivery',
      carrier_contact: '+91-124-4643-000',
      shipped_date: '2025-01-16',
      expected_delivery: '2025-01-19',
      weight_kg: 310.5,
      dimensions: '140x90x70 cm',
      tracking_number: 'DLV789123456IN',
      status: 'in_transit',
      shipping_cost: 14500,
      insurance_value: 720000,
      priority: 'high',
      notes: 'Fragile items - Handle with care',
      payment_method: 'Prepaid',
      created_by: 'Anil Desai'
    },
    {
      id: '8',
      shipment_id: 'SHP-2025-008',
      order_number: 'ORD-10241',
      customer_name: 'Wipro Ltd',
      customer_contact: '+91-9876543217',
      customer_email: 'supply@wipro.com',
      origin: 'Bangalore, Karnataka',
      destination: 'Chennai, Tamil Nadu',
      carrier_name: 'DTDC Courier',
      carrier_contact: '+91-1860-208-8208',
      shipped_date: '2025-01-17',
      expected_delivery: '2025-01-20',
      weight_kg: 95.0,
      dimensions: '80x60x40 cm',
      tracking_number: 'DTDC456123789IN',
      status: 'picked',
      shipping_cost: 6800,
      insurance_value: 280000,
      priority: 'medium',
      notes: 'IT equipment shipment',
      payment_method: 'Credit',
      created_by: 'Ramesh Nair'
    }
  ];

  // Calculate stats
  const stats = {
    pending: shipmentOrders.filter(s => s.status === 'pending').length,
    inTransit: shipmentOrders.filter(s => s.status === 'in_transit').length,
    deliveredToday: shipmentOrders.filter(s =>
      s.status === 'delivered' && s.actual_delivery === '2025-01-17'
    ).length,
    delayed: shipmentOrders.filter(s => s.status === 'delayed').length,
    totalShipments: shipmentOrders.length,
    totalValue: shipmentOrders.reduce((sum, s) => sum + s.shipping_cost, 0),
    avgWeight: (shipmentOrders.reduce((sum, s) => sum + s.weight_kg, 0) / shipmentOrders.length).toFixed(1)
  };

  // Get unique destinations for filter
  const destinations = Array.from(new Set(shipmentOrders.map(s => s.destination)));

  // Filter shipments
  const filteredShipments = shipmentOrders.filter(shipment => {
    const matchesSearch =
      shipment.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesDestination = destinationFilter === 'all' || shipment.destination === destinationFilter;
    const matchesPriority = priorityFilter === 'all' || shipment.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDestination && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShipments = filteredShipments.slice(startIndex, startIndex + itemsPerPage);

  // Status badge component
  const StatusBadge = ({ status }: { status: ShipmentOrder['status'] }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      picked: 'bg-blue-100 text-blue-800 border-blue-200',
      in_transit: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      delayed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const icons = {
      pending: Clock,
      picked: Package,
      in_transit: Truck,
      delivered: CheckCircle,
      delayed: AlertCircle,
      cancelled: AlertCircle
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: ShipmentOrder['priority'] }) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistics Shipping Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all shipment orders across your supply chain</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create Shipment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Shipments</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting pickup</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.inTransit}</p>
              <p className="text-xs text-gray-500 mt-1">On the way</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm font-medium text-gray-600">Delayed</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.delayed}</p>
              <p className="text-xs text-gray-500 mt-1">Needs attention</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Shipments</p>
              <p className="text-xl font-bold text-blue-900 mt-1">{stats.totalShipments}</p>
            </div>
            <Archive className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Shipping Value</p>
              <p className="text-xl font-bold text-green-900 mt-1">Rs.{stats.totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Avg Weight</p>
              <p className="text-xl font-bold text-orange-900 mt-1">{stats.avgWeight} kg</p>
            </div>
            <Weight className="w-8 h-8 text-orange-600" />
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
                placeholder="Search shipments by ID, order, customer, tracking..."
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
                <option value="pending">Pending</option>
                <option value="picked">Picked</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <BoxSelect className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
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
                  Shipment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight & Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{shipment.shipment_id}</div>
                        <div className="text-xs text-gray-500">Order: {shipment.order_number}</div>
                        <div className="text-xs text-gray-400">Track: {shipment.tracking_number}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{shipment.customer_name}</div>
                        <div className="text-xs text-gray-500">{shipment.customer_contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <Navigation className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-xs text-gray-600">From: {shipment.origin}</div>
                        <div className="text-xs text-blue-600">To: {shipment.destination}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{shipment.carrier_name}</div>
                        <div className="text-xs text-gray-500">{shipment.carrier_contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        Shipped: {shipment.shipped_date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Clock className="w-3 h-3" />
                        Expected: {shipment.expected_delivery}
                      </div>
                      {shipment.actual_delivery && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Delivered: {shipment.actual_delivery}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{shipment.weight_kg} kg</div>
                        <div className="text-xs text-gray-500">{shipment.dimensions}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={shipment.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Rs.{shipment.shipping_cost}</div>
                        <div className="text-xs text-gray-500">{shipment.payment_method}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded" title="View Details">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredShipments.length)} of {filteredShipments.length} shipments
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
