'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Eye,
  Search,
  Package,
  MapPin,
  Calendar,
  TrendingDown,
  CheckCircle,
  Clock,
  DollarSign,
  Truck
} from 'lucide-react';

interface ConsolidationOpportunity {
  id: number;
  consolidationId: string;
  opportunityName: string;
  origin: string;
  destination: string;
  targetDate: string;
  numberOfShipments: number;
  totalWeight: number; // in kg
  totalVolume: number; // in cubic meters
  estimatedVehicleType: string;
  vehicleCapacityWeight: number;
  vehicleCapacityVolume: number;
  utilizationPercentage: number;
  potentialSavings: number;
  currentCost: number;
  consolidatedCost: number;
  shipmentDetails: {
    shipmentId: string;
    weight: number;
    volume: number;
    priority: 'urgent' | 'high' | 'normal' | 'low';
  }[];
  status: 'identified' | 'planned' | 'confirmed' | 'consolidated' | 'rejected';
  createdDate: string;
  createdBy: string;
  lastModified: string;
  remarks: string;
}

export default function ConsolidationPlanningPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');

  const [opportunities, setOpportunities] = useState<ConsolidationOpportunity[]>([
    {
      id: 1,
      consolidationId: 'CON-2024-001',
      opportunityName: 'Mumbai-Delhi Consolidation',
      origin: 'Mumbai Warehouse',
      destination: 'Delhi Distribution Center',
      targetDate: '2024-10-25',
      numberOfShipments: 8,
      totalWeight: 16500,
      totalVolume: 38,
      estimatedVehicleType: '32-Ft Truck',
      vehicleCapacityWeight: 20000,
      vehicleCapacityVolume: 45,
      utilizationPercentage: 84,
      potentialSavings: 25000,
      currentCost: 75000,
      consolidatedCost: 50000,
      shipmentDetails: [
        { shipmentId: 'SH-001', weight: 2500, volume: 6, priority: 'normal' },
        { shipmentId: 'SH-002', weight: 1800, volume: 4, priority: 'normal' },
        { shipmentId: 'SH-003', weight: 3200, volume: 7, priority: 'high' },
        { shipmentId: 'SH-004', weight: 2100, volume: 5, priority: 'normal' },
        { shipmentId: 'SH-005', weight: 1900, volume: 4, priority: 'low' },
        { shipmentId: 'SH-006', weight: 2000, volume: 5, priority: 'normal' },
        { shipmentId: 'SH-007', weight: 1500, volume: 3, priority: 'low' },
        { shipmentId: 'SH-008', weight: 1500, volume: 4, priority: 'normal' }
      ],
      status: 'identified',
      createdDate: '2024-10-20',
      createdBy: 'Rajesh Kumar',
      lastModified: '2024-10-21',
      remarks: 'High savings potential, recommend consolidation'
    },
    {
      id: 2,
      consolidationId: 'CON-2024-002',
      opportunityName: 'Bangalore-Chennai Small Shipments',
      origin: 'Bangalore Plant',
      destination: 'Chennai Port',
      targetDate: '2024-10-24',
      numberOfShipments: 5,
      totalWeight: 6800,
      totalVolume: 15,
      estimatedVehicleType: '20-Ft Truck',
      vehicleCapacityWeight: 10000,
      vehicleCapacityVolume: 22,
      utilizationPercentage: 68,
      potentialSavings: 12000,
      currentCost: 42000,
      consolidatedCost: 30000,
      shipmentDetails: [
        { shipmentId: 'SH-012', weight: 1500, volume: 3, priority: 'urgent' },
        { shipmentId: 'SH-013', weight: 1200, volume: 3, priority: 'normal' },
        { shipmentId: 'SH-014', weight: 1600, volume: 4, priority: 'normal' },
        { shipmentId: 'SH-015', weight: 1400, volume: 3, priority: 'low' },
        { shipmentId: 'SH-016', weight: 1100, volume: 2, priority: 'normal' }
      ],
      status: 'planned',
      createdDate: '2024-10-19',
      createdBy: 'Priya Singh',
      lastModified: '2024-10-21',
      remarks: 'Planned for Oct 24 dispatch'
    },
    {
      id: 3,
      consolidationId: 'CON-2024-003',
      opportunityName: 'Pune Regional Consolidation',
      origin: 'Pune Hub',
      destination: 'Multiple Regional',
      targetDate: '2024-10-26',
      numberOfShipments: 12,
      totalWeight: 9500,
      totalVolume: 28,
      estimatedVehicleType: '24-Ft Truck',
      vehicleCapacityWeight: 15000,
      vehicleCapacityVolume: 32,
      utilizationPercentage: 88,
      potentialSavings: 18000,
      currentCost: 65000,
      consolidatedCost: 47000,
      shipmentDetails: [
        { shipmentId: 'SH-025', weight: 800, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-026', weight: 750, volume: 2, priority: 'low' },
        { shipmentId: 'SH-027', weight: 900, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-028', weight: 650, volume: 2, priority: 'low' },
        { shipmentId: 'SH-029', weight: 850, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-030', weight: 700, volume: 2, priority: 'low' },
        { shipmentId: 'SH-031', weight: 900, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-032', weight: 800, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-033', weight: 750, volume: 2, priority: 'low' },
        { shipmentId: 'SH-034', weight: 850, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-035', weight: 750, volume: 2, priority: 'low' },
        { shipmentId: 'SH-036', weight: 800, volume: 3, priority: 'normal' }
      ],
      status: 'confirmed',
      createdDate: '2024-10-18',
      createdBy: 'Sunita Desai',
      lastModified: '2024-10-21',
      remarks: 'Confirmed and ready for execution'
    },
    {
      id: 4,
      consolidationId: 'CON-2024-004',
      opportunityName: 'Hyderabad-Bangalore Component Shipments',
      origin: 'Hyderabad Factory',
      destination: 'Bangalore Plant',
      targetDate: '2024-10-23',
      numberOfShipments: 6,
      totalWeight: 9800,
      totalVolume: 22,
      estimatedVehicleType: '24-Ft Truck',
      vehicleCapacityWeight: 15000,
      vehicleCapacityVolume: 32,
      utilizationPercentage: 69,
      potentialSavings: 8000,
      currentCost: 38000,
      consolidatedCost: 30000,
      shipmentDetails: [
        { shipmentId: 'SH-045', weight: 1800, volume: 4, priority: 'high' },
        { shipmentId: 'SH-046', weight: 1500, volume: 3, priority: 'normal' },
        { shipmentId: 'SH-047', weight: 1700, volume: 4, priority: 'normal' },
        { shipmentId: 'SH-048', weight: 1600, volume: 4, priority: 'normal' },
        { shipmentId: 'SH-049', weight: 1400, volume: 3.5, priority: 'low' },
        { shipmentId: 'SH-050', weight: 1800, volume: 3.5, priority: 'normal' }
      ],
      status: 'consolidated',
      createdDate: '2024-10-17',
      createdBy: 'Vikram Malhotra',
      lastModified: '2024-10-20',
      remarks: 'Successfully consolidated and dispatched'
    },
    {
      id: 5,
      consolidationId: 'CON-2024-005',
      opportunityName: 'Delhi North Zone Consolidation',
      origin: 'Delhi Distribution Center',
      destination: 'North Zone Multiple',
      targetDate: '2024-10-27',
      numberOfShipments: 15,
      totalWeight: 11200,
      totalVolume: 32,
      estimatedVehicleType: '28-Ft Truck',
      vehicleCapacityWeight: 18000,
      vehicleCapacityVolume: 38,
      utilizationPercentage: 84,
      potentialSavings: 22000,
      currentCost: 78000,
      consolidatedCost: 56000,
      shipmentDetails: [
        { shipmentId: 'SH-055', weight: 750, volume: 2, priority: 'normal' },
        { shipmentId: 'SH-056', weight: 800, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-057', weight: 700, volume: 2, priority: 'low' },
        { shipmentId: 'SH-058', weight: 750, volume: 2, priority: 'normal' },
        { shipmentId: 'SH-059', weight: 800, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-060', weight: 650, volume: 2, priority: 'low' },
        { shipmentId: 'SH-061', weight: 850, volume: 2.5, priority: 'high' },
        { shipmentId: 'SH-062', weight: 750, volume: 2, priority: 'normal' },
        { shipmentId: 'SH-063', weight: 700, volume: 2, priority: 'low' },
        { shipmentId: 'SH-064', weight: 800, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-065', weight: 750, volume: 2, priority: 'normal' },
        { shipmentId: 'SH-066', weight: 700, volume: 2, priority: 'low' },
        { shipmentId: 'SH-067', weight: 800, volume: 2.5, priority: 'normal' },
        { shipmentId: 'SH-068', weight: 750, volume: 2, priority: 'normal' },
        { shipmentId: 'SH-069', weight: 850, volume: 2.5, priority: 'normal' }
      ],
      status: 'identified',
      createdDate: '2024-10-21',
      createdBy: 'Rajesh Kumar',
      lastModified: '2024-10-21',
      remarks: 'Excellent consolidation opportunity'
    },
    {
      id: 6,
      consolidationId: 'CON-2024-006',
      opportunityName: 'Chennai-Kochi Export Consolidation',
      origin: 'Chennai Port',
      destination: 'Kochi Depot',
      targetDate: '2024-10-24',
      numberOfShipments: 4,
      totalWeight: 5200,
      totalVolume: 12,
      estimatedVehicleType: '18-Ft Truck',
      vehicleCapacityWeight: 8000,
      vehicleCapacityVolume: 16,
      utilizationPercentage: 75,
      potentialSavings: 6000,
      currentCost: 28000,
      consolidatedCost: 22000,
      shipmentDetails: [
        { shipmentId: 'SH-075', weight: 1400, volume: 3, priority: 'urgent' },
        { shipmentId: 'SH-076', weight: 1300, volume: 3, priority: 'high' },
        { shipmentId: 'SH-077', weight: 1200, volume: 3, priority: 'normal' },
        { shipmentId: 'SH-078', weight: 1300, volume: 3, priority: 'normal' }
      ],
      status: 'rejected',
      createdDate: '2024-10-19',
      createdBy: 'Priya Singh',
      lastModified: '2024-10-20',
      remarks: 'Rejected due to urgent shipment requirements'
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'identified': 'text-blue-600 bg-blue-50 border-blue-200',
      'planned': 'text-purple-600 bg-purple-50 border-purple-200',
      'confirmed': 'text-green-600 bg-green-50 border-green-200',
      'consolidated': 'text-gray-600 bg-gray-50 border-gray-200',
      'rejected': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'consolidated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'identified':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-purple-500" />;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 85) return 'text-green-600';
    if (utilization >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalOpportunities = opportunities.length;
  const activeOpportunities = opportunities.filter(o => o.status === 'identified' || o.status === 'planned' || o.status === 'confirmed').length;
  const totalPotentialSavings = opportunities.filter(o => o.status !== 'rejected' && o.status !== 'consolidated').reduce((sum, o) => sum + o.potentialSavings, 0);
  const avgUtilization = (opportunities.reduce((sum, o) => sum + o.utilizationPercentage, 0) / totalOpportunities).toFixed(1);

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.consolidationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.opportunityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || opportunity.status === selectedStatus;
    const matchesDestination = selectedDestination === 'all' || opportunity.destination.includes(selectedDestination);
    return matchesSearch && matchesStatus && matchesDestination;
  });

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Layers className="w-8 h-8 text-teal-600" />
            <span>Shipment Consolidation</span>
          </h1>
          <p className="text-gray-600 mt-1">Identify and plan shipment consolidation opportunities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Consolidation</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 border border-teal-200">
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-bold text-teal-900">{totalOpportunities}</span>
          </div>
          <div className="text-sm font-medium text-teal-700">Total Opportunities</div>
          <div className="text-xs text-teal-600 mt-1">All Status</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{activeOpportunities}</span>
          </div>
          <div className="text-sm font-medium text-blue-700">Active Opportunities</div>
          <div className="text-xs text-blue-600 mt-1">Ready to Consolidate</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">₹{(totalPotentialSavings / 1000).toFixed(0)}K</span>
          </div>
          <div className="text-sm font-medium text-green-700">Potential Savings</div>
          <div className="text-xs text-green-600 mt-1">Cost Reduction</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{avgUtilization}%</span>
          </div>
          <div className="text-sm font-medium text-purple-700">Avg Utilization</div>
          <div className="text-xs text-purple-600 mt-1">Target: 85%+</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search consolidations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="identified">Identified</option>
            <option value="planned">Planned</option>
            <option value="confirmed">Confirmed</option>
            <option value="consolidated">Consolidated</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Destinations</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Kochi">Kochi</option>
          </select>
        </div>
      </div>

      {/* Consolidation Opportunities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consolidation Details</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipments</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost Savings</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOpportunities.map((opportunity) => (
                <tr key={opportunity.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="font-medium text-gray-900">{opportunity.consolidationId}</div>
                    <div className="text-sm text-gray-600">{opportunity.opportunityName}</div>
                    <div className="text-xs text-gray-500 mt-1">By: {opportunity.createdBy}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>{opportunity.origin}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{opportunity.destination}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(opportunity.targetDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">{opportunity.numberOfShipments}</span>
                    </div>
                    <div className="text-xs text-gray-600">{(opportunity.totalWeight / 1000).toFixed(1)}T</div>
                    <div className="text-xs text-gray-600">{opportunity.totalVolume}m³</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span>{opportunity.estimatedVehicleType}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Cap: {(opportunity.vehicleCapacityWeight / 1000).toFixed(1)}T / {opportunity.vehicleCapacityVolume}m³
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                        <div
                          className={`h-2 rounded-full ${
                            opportunity.utilizationPercentage >= 85 ? 'bg-green-500' :
                            opportunity.utilizationPercentage >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${opportunity.utilizationPercentage}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${getUtilizationColor(opportunity.utilizationPercentage)}`}>
                        {opportunity.utilizationPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-1 text-sm font-bold text-green-600">
                      <TrendingDown className="w-4 h-4" />
                      <span>₹{(opportunity.potentialSavings / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      ₹{(opportunity.currentCost / 1000).toFixed(1)}K → ₹{(opportunity.consolidatedCost / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-gray-500">
                      {((opportunity.potentialSavings / opportunity.currentCost) * 100).toFixed(0)}% reduction
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(opportunity.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(opportunity.status)}`}>
                        {opportunity.status.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">View</span>
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consolidation Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Layers className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Consolidation Benefits</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Combine multiple shipments to the same destination to maximize vehicle utilization and reduce costs.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Reduced transportation costs per shipment</div>
            <div>• Improved vehicle capacity utilization</div>
            <div>• Lower carbon footprint per shipment</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Cost Optimization</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Achieve significant cost savings by consolidating shipments and optimizing vehicle usage.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Single vehicle vs. multiple trips</div>
            <div>• Shared fuel and toll costs</div>
            <div>• Reduced labor and overhead</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Shipment Planning</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Plan consolidations based on destination, delivery dates, and shipment priorities.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>• Same destination grouping</div>
            <div>• Compatible delivery windows</div>
            <div>• Priority-based consolidation</div>
          </div>
        </div>
      </div>
    </div>
  );
}
