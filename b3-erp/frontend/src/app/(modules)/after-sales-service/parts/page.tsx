'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Eye, Edit, Plus, Package, TrendingDown, TrendingUp, AlertTriangle, BarChart3, Download, Filter, MoreVertical, Wrench, MapPin, Star, ShoppingCart, RotateCcw, FileText, Clock } from 'lucide-react';

interface ServicePart {
  id: string;
  partNumber: string;
  partName: string;
  category: 'Hardware' | 'Electronics' | 'Mechanical' | 'Consumable' | 'Tools' | 'Safety';
  description: string;
  manufacturer: string;
  model: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderLevel: number;
  unitCost: number;
  unitPrice: number;
  totalValue: number;
  location: string;
  warehouse: string;
  supplier: string;
  leadTime: number; // in days
  lastRestockDate: string;
  lastUsedDate: string;
  monthlyConsumption: number;
  totalConsumed: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked';
  partCondition: 'new' | 'refurbished' | 'used' | 'defective';
  warranty: number; // in months
  expiryDate: string;
  qualityGrade: 'A' | 'B' | 'C';
  criticality: 'critical' | 'important' | 'standard' | 'optional';
  alternativeParts: string[];
  compatibleModels: string[];
  usageFrequency: number;
  turnoverRate: number;
  stockAge: number; // in days
}

const mockServiceParts: ServicePart[] = [
  {
    id: '1',
    partNumber: 'KIT-HNG-001',
    partName: 'Cabinet Hinge - Soft Close',
    category: 'Hardware',
    description: 'Premium soft-close cabinet hinge for modular kitchen cabinets',
    manufacturer: 'Hettich',
    model: 'Sensys 8645i',
    currentStock: 245,
    minStockLevel: 50,
    maxStockLevel: 500,
    reorderLevel: 100,
    unitCost: 450,
    unitPrice: 580,
    totalValue: 142100,
    location: 'A-01-15',
    warehouse: 'Mumbai Central',
    supplier: 'Kitchen Hardware Supplies',
    leadTime: 7,
    lastRestockDate: '2025-10-15',
    lastUsedDate: '2025-10-22',
    monthlyConsumption: 85,
    totalConsumed: 1240,
    stockStatus: 'in_stock',
    partCondition: 'new',
    warranty: 24,
    expiryDate: '2027-10-15',
    qualityGrade: 'A',
    criticality: 'critical',
    alternativeParts: ['KIT-HNG-002', 'KIT-HNG-003'],
    compatibleModels: ['Premium Series', 'Executive Series'],
    usageFrequency: 85,
    turnoverRate: 4.2,
    stockAge: 8
  },
  {
    id: '2',
    partNumber: 'ELC-LED-012',
    partName: 'LED Strip Light - Under Cabinet',
    category: 'Electronics',
    description: 'Warm white LED strip for under-cabinet lighting',
    manufacturer: 'Philips',
    model: 'Hue Lightstrip Plus',
    currentStock: 35,
    minStockLevel: 40,
    maxStockLevel: 200,
    reorderLevel: 50,
    unitCost: 1250,
    unitPrice: 1580,
    totalValue: 55300,
    location: 'B-02-08',
    warehouse: 'Mumbai Central',
    supplier: 'Electrical Components Ltd',
    leadTime: 10,
    lastRestockDate: '2025-09-20',
    lastUsedDate: '2025-10-20',
    monthlyConsumption: 28,
    totalConsumed: 385,
    stockStatus: 'low_stock',
    partCondition: 'new',
    warranty: 36,
    expiryDate: '2028-09-20',
    qualityGrade: 'A',
    criticality: 'important',
    alternativeParts: ['ELC-LED-013', 'ELC-LED-014'],
    compatibleModels: ['Modern Series', 'Classic Series'],
    usageFrequency: 28,
    turnoverRate: 3.8,
    stockAge: 33
  },
  {
    id: '3',
    partNumber: 'MCH-DRW-025',
    partName: 'Drawer Slide - Heavy Duty',
    category: 'Mechanical',
    description: 'Heavy-duty full extension drawer slide for kitchen drawers',
    manufacturer: 'Blum',
    model: 'Tandem Plus Blumotion',
    currentStock: 0,
    minStockLevel: 30,
    maxStockLevel: 150,
    reorderLevel: 40,
    unitCost: 890,
    unitPrice: 1150,
    totalValue: 0,
    location: 'C-01-22',
    warehouse: 'Mumbai Central',
    supplier: 'Premium Hardware Solutions',
    leadTime: 14,
    lastRestockDate: '2025-08-15',
    lastUsedDate: '2025-10-21',
    monthlyConsumption: 45,
    totalConsumed: 678,
    stockStatus: 'out_of_stock',
    partCondition: 'new',
    warranty: 60,
    expiryDate: '2030-08-15',
    qualityGrade: 'A',
    criticality: 'critical',
    alternativeParts: ['MCH-DRW-026', 'MCH-DRW-027'],
    compatibleModels: ['All Series'],
    usageFrequency: 45,
    turnoverRate: 5.1,
    stockAge: 69
  },
  {
    id: '4',
    partNumber: 'CON-CLN-008',
    partName: 'Kitchen Cleaner - Stainless Steel',
    category: 'Consumable',
    description: 'Specialized cleaner for stainless steel surfaces',
    manufacturer: 'Weiman',
    model: 'Stainless Steel Cleaner',
    currentStock: 850,
    minStockLevel: 100,
    maxStockLevel: 1000,
    reorderLevel: 200,
    unitCost: 125,
    unitPrice: 180,
    totalValue: 153000,
    location: 'D-03-05',
    warehouse: 'Mumbai Central',
    supplier: 'Cleaning Supplies Co',
    leadTime: 5,
    lastRestockDate: '2025-10-10',
    lastUsedDate: '2025-10-23',
    monthlyConsumption: 180,
    totalConsumed: 2145,
    stockStatus: 'overstocked',
    partCondition: 'new',
    warranty: 0,
    expiryDate: '2026-10-10',
    qualityGrade: 'B',
    criticality: 'standard',
    alternativeParts: ['CON-CLN-009'],
    compatibleModels: ['All Series'],
    usageFrequency: 180,
    turnoverRate: 2.5,
    stockAge: 13
  },
  {
    id: '5',
    partNumber: 'TLS-DRL-015',
    partName: 'Cordless Drill Bit Set',
    category: 'Tools',
    description: 'Professional drill bit set for installation work',
    manufacturer: 'Bosch',
    model: 'Pro Mixed Set',
    currentStock: 12,
    minStockLevel: 8,
    maxStockLevel: 25,
    reorderLevel: 10,
    unitCost: 2500,
    unitPrice: 3200,
    totalValue: 38400,
    location: 'E-01-12',
    warehouse: 'Mumbai Central',
    supplier: 'Tool Supply Inc',
    leadTime: 12,
    lastRestockDate: '2025-09-05',
    lastUsedDate: '2025-10-18',
    monthlyConsumption: 3,
    totalConsumed: 28,
    stockStatus: 'in_stock',
    partCondition: 'new',
    warranty: 12,
    expiryDate: '',
    qualityGrade: 'A',
    criticality: 'important',
    alternativeParts: ['TLS-DRL-016'],
    compatibleModels: ['All Series'],
    usageFrequency: 3,
    turnoverRate: 1.2,
    stockAge: 48
  }
];

export default function ServicePartsPage() {
  const router = useRouter();
  const [parts, setParts] = useState<ServicePart[]>(mockServiceParts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('criticality');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPart, setSelectedPart] = useState<ServicePart | null>(null);
  const [showPartModal, setShowPartModal] = useState(false);

  // Filter and search parts
  const filteredParts = parts.filter(part => {
    const matchesSearch = 
      part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || part.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || part.stockStatus === selectedStatus;
    const matchesCriticality = selectedCriticality === 'all' || part.criticality === selectedCriticality;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesCriticality;
  });

  // Sort parts
  const sortedParts = [...filteredParts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof ServicePart];
    let bValue: any = b[sortBy as keyof ServicePart];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hardware': return 'bg-blue-100 text-blue-800';
      case 'Electronics': return 'bg-purple-100 text-purple-800';
      case 'Mechanical': return 'bg-green-100 text-green-800';
      case 'Consumable': return 'bg-yellow-100 text-yellow-800';
      case 'Tools': return 'bg-orange-100 text-orange-800';
      case 'Safety': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'overstocked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'important': return 'bg-orange-100 text-orange-800';
      case 'standard': return 'bg-yellow-100 text-yellow-800';
      case 'optional': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-yellow-600';
      case 'C': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handlePartClick = (part: ServicePart) => {
    setSelectedPart(part);
    setShowPartModal(true);
  };

  const calculateStats = () => {
    const totalValue = parts.reduce((sum, part) => sum + part.totalValue, 0);
    const totalItems = parts.reduce((sum, part) => sum + part.currentStock, 0);
    const lowStockItems = parts.filter(p => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock').length;
    const criticalItems = parts.filter(p => p.criticality === 'critical').length;
    const avgTurnover = parts.reduce((sum, part) => sum + part.turnoverRate, 0) / parts.length;
    const outOfStockItems = parts.filter(p => p.stockStatus === 'out_of_stock').length;

    return {
      totalValue,
      totalItems,
      lowStockItems,
      criticalItems,
      avgTurnover,
      outOfStockItems
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Parts Management</h1>
          <p className="text-gray-600">Manage inventory for after-sales service operations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => router.push('/after-sales-service/parts/requisition')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ShoppingCart className="w-4 h-4" />
            New Requisition
          </button>
          <button
            onClick={() => router.push('/inventory/parts/add')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Part
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => router.push('/after-sales-service/parts/requisition')}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Requisition</p>
              <p className="text-lg font-semibold text-blue-600">Request Parts</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </button>

        <button
          onClick={() => router.push('/after-sales-service/parts/consumption')}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Track Usage</p>
              <p className="text-lg font-semibold text-green-600">Consumption</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </button>

        <button
          onClick={() => router.push('/after-sales-service/parts/returns')}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Return Parts</p>
              <p className="text-lg font-semibold text-orange-600">Returns</p>
            </div>
            <RotateCcw className="w-8 h-8 text-orange-600" />
          </div>
        </button>

        <button
          onClick={() => router.push('/reports/parts-analytics')}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Analytics</p>
              <p className="text-lg font-semibold text-purple-600">Reports</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Parts</p>
              <p className="text-2xl font-bold text-gray-900">{parts.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalValue / 100000).toFixed(1)}L</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems.toLocaleString()}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Turnover</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgTurnover.toFixed(1)}x</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search parts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="criticality">Sort by Criticality</option>
            <option value="stockStatus">Sort by Stock Status</option>
            <option value="currentStock">Sort by Stock Level</option>
            <option value="turnoverRate">Sort by Turnover</option>
            <option value="totalValue">Sort by Value</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Hardware">Hardware</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Consumable">Consumable</option>
              <option value="Tools">Tools</option>
              <option value="Safety">Safety</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="overstocked">Overstocked</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCriticality}
              onChange={(e) => setSelectedCriticality(e.target.value)}
            >
              <option value="all">All Criticality</option>
              <option value="critical">Critical</option>
              <option value="important">Important</option>
              <option value="standard">Standard</option>
              <option value="optional">Optional</option>
            </select>
          </div>
        )}
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier & Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage & Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Quality
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedParts.map((part) => (
                <tr 
                  key={part.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePartClick(part)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{part.partNumber}</div>
                      <div className="text-sm text-gray-900">{part.partName}</div>
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(part.category)}`}>
                        {part.category}
                      </div>
                      <div className="text-xs text-gray-500">{part.manufacturer} - {part.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Stock: {part.currentStock.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {part.minStockLevel} | Max: {part.maxStockLevel}
                      </div>
                      <div className="text-xs text-gray-500">
                        Reorder: {part.reorderLevel}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {part.location} - {part.warehouse}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Cost: ₹{part.unitCost.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Price: ₹{part.unitPrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: ₹{(part.totalValue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-500">{part.supplier}</div>
                      <div className="text-xs text-gray-500">Lead: {part.leadTime} days</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Monthly: {part.monthlyConsumption}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total Used: {part.totalConsumed.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Turnover: {part.turnoverRate.toFixed(1)}x
                      </div>
                      <div className="text-xs text-gray-500">
                        Age: {part.stockAge} days
                      </div>
                      <div className="text-xs text-gray-500">
                        Last Used: {new Date(part.lastUsedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(part.stockStatus)}`}>
                        {part.stockStatus.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCriticalityColor(part.criticality)}`}>
                        {part.criticality.toUpperCase()}
                      </div>
                      <div className={`text-sm font-medium ${getQualityColor(part.qualityGrade)}`}>
                        Grade {part.qualityGrade}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{part.partCondition}</div>
                      {part.warranty > 0 && (
                        <div className="text-xs text-gray-500">{part.warranty}m warranty</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/after-sales-service/parts/requisition?part=${part.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                       
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/inventory/parts/view/${part.id}`);
                        }}
                        className="text-green-600 hover:text-green-900"
                       
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/inventory/parts/edit/${part.id}`);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                       
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part Details Modal */}
      {showPartModal && selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full  max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Part Details</h2>
              <button
                onClick={() => setShowPartModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Part Number:</span>
                    <span className="font-medium">{selectedPart.partNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedPart.partName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedPart.category)}`}>
                      {selectedPart.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manufacturer:</span>
                    <span className="font-medium">{selectedPart.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{selectedPart.model}</span>
                  </div>
                </div>
              </div>

              {/* Stock Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Stock Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Stock:</span>
                    <span className="font-medium">{selectedPart.currentStock.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPart.stockStatus)}`}>
                      {selectedPart.stockStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Level:</span>
                    <span className="font-medium">{selectedPart.minStockLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reorder Level:</span>
                    <span className="font-medium">{selectedPart.reorderLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{selectedPart.location}</span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit Cost:</span>
                    <span className="font-medium">₹{selectedPart.unitCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit Price:</span>
                    <span className="font-medium">₹{selectedPart.unitPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-medium">₹{(selectedPart.totalValue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Supplier:</span>
                    <span className="font-medium">{selectedPart.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lead Time:</span>
                    <span className="font-medium">{selectedPart.leadTime} days</span>
                  </div>
                </div>
              </div>

              {/* Usage Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Usage Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Consumption:</span>
                    <span className="font-medium">{selectedPart.monthlyConsumption}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Consumed:</span>
                    <span className="font-medium">{selectedPart.totalConsumed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Turnover Rate:</span>
                    <span className="font-medium">{selectedPart.turnoverRate.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Used:</span>
                    <span className="font-medium">{new Date(selectedPart.lastUsedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock Age:</span>
                    <span className="font-medium">{selectedPart.stockAge} days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPartModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/after-sales-service/parts/requisition?part=${selectedPart.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Requisition
              </button>
              <button
                onClick={() => router.push(`/inventory/parts/view/${selectedPart.id}`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}