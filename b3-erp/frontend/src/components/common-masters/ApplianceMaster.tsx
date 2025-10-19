'use client';

import React, { useState, useMemo } from 'react';
import {
  Zap, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Package, Ruler, DollarSign, Star, TrendingUp
} from 'lucide-react';

interface Appliance {
  id: string;
  code: string;
  name: string;
  category: 'Hob' | 'Chimney' | 'Oven' | 'Microwave' | 'Dishwasher' | 'Refrigerator' | 'Water Purifier';
  subcategory: string;
  brand: string;
  model: string;
  specifications: {
    dimensions: {
      width: number;
      depth: number;
      height: number;
      unit: string;
    };
    power: {
      voltage: string;
      wattage: number;
      frequency: string;
    };
    capacity?: string;
    features: string[];
  };
  energyRating: string;
  color: string[];
  warranty: string;
  price: number;
  installationRequired: boolean;
  installationCost: number;
  certification: string[];
  availability: 'In Stock' | 'Out of Stock' | 'On Order';
  leadTime: string;
  rating: number;
  reviews: number;
  status: 'Active' | 'Inactive' | 'Discontinued';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

const mockAppliances: Appliance[] = [
  {
    id: '1',
    code: 'APP-HOB-001',
    name: 'Gas Hob - 4 Burner Stainless Steel',
    category: 'Hob',
    subcategory: 'Built-in Gas Hob',
    brand: 'Faber',
    model: 'HT604CRS',
    specifications: {
      dimensions: {
        width: 600,
        depth: 520,
        height: 100,
        unit: 'mm'
      },
      power: {
        voltage: '230V',
        wattage: 0,
        frequency: '50Hz'
      },
      capacity: '4 Burners',
      features: [
        'Auto ignition',
        'Toughened glass top',
        'Brass burners',
        'High efficiency',
        'Spill-proof design'
      ]
    },
    energyRating: 'N/A',
    color: ['Stainless Steel', 'Black'],
    warranty: '2 Years comprehensive',
    price: 12500,
    installationRequired: true,
    installationCost: 1500,
    certification: ['ISI Certified', 'BIS'],
    availability: 'In Stock',
    leadTime: '3-5 days',
    rating: 4.5,
    reviews: 245,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Product Manager'
    }
  },
  {
    id: '2',
    code: 'APP-CHI-001',
    name: 'Auto Clean Chimney - 90cm',
    category: 'Chimney',
    subcategory: 'Wall Mount Chimney',
    brand: 'Elica',
    model: 'WD TBF HAC 90 MS',
    specifications: {
      dimensions: {
        width: 900,
        depth: 500,
        height: 650,
        unit: 'mm'
      },
      power: {
        voltage: '230V',
        wattage: 180,
        frequency: '50Hz'
      },
      capacity: '1200 m³/hr suction',
      features: [
        'Auto clean technology',
        'Filterless design',
        'Touch control',
        'LED lamps',
        'Motion sensor',
        'Quiet operation'
      ]
    },
    energyRating: '3 Star',
    color: ['Silver', 'Black'],
    warranty: '5 Years on motor, 1 Year comprehensive',
    price: 18900,
    installationRequired: true,
    installationCost: 2500,
    certification: ['ISI Certified', 'BEE'],
    availability: 'In Stock',
    leadTime: '5-7 days',
    rating: 4.7,
    reviews: 312,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'Product Manager'
    }
  },
  {
    id: '3',
    code: 'APP-OVN-001',
    name: 'Built-in Electric Oven - 60L',
    category: 'Oven',
    subcategory: 'Built-in OTG',
    brand: 'Bosch',
    model: 'HBN531E0J',
    specifications: {
      dimensions: {
        width: 595,
        depth: 548,
        height: 595,
        unit: 'mm'
      },
      power: {
        voltage: '230V',
        wattage: 2800,
        frequency: '50Hz'
      },
      capacity: '60 Liters',
      features: [
        '3D hot air distribution',
        'Multi-function cooking',
        'Digital display',
        'Telescopic rails',
        'Interior light',
        'Safety lock'
      ]
    },
    energyRating: '4 Star',
    color: ['Stainless Steel', 'Black'],
    warranty: '2 Years comprehensive',
    price: 32500,
    installationRequired: true,
    installationCost: 3000,
    certification: ['ISI Certified', 'CE', 'BEE'],
    availability: 'In Stock',
    leadTime: '7-10 days',
    rating: 4.8,
    reviews: 189,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'Product Manager'
    }
  }
];

export default function ApplianceMaster() {
  const [appliances, setAppliances] = useState<Appliance[]>(mockAppliances);
  const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const handleEdit = (appliance: Appliance) => {
    setSelectedAppliance(appliance);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this appliance?')) {
      setAppliances(appliances.filter(a => a.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Discontinued': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const getAvailabilityBadge = (availability: string) => {
    const colors = {
      'In Stock': 'bg-green-100 text-green-800',
      'Out of Stock': 'bg-red-100 text-red-800',
      'On Order': 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[availability as keyof typeof colors]}`}>
        {availability}
      </span>
    );
  };

  const filteredAppliances = useMemo(() => {
    return appliances.filter(appliance => {
      const matchesSearch = appliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appliance.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appliance.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || appliance.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [appliances, searchTerm, filterCategory]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Appliance Master</h2>
        <p className="text-gray-600">Manage kitchen appliance catalog with specifications and pricing</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appliances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Hob">Hob</option>
                <option value="Chimney">Chimney</option>
                <option value="Oven">Oven</option>
                <option value="Microwave">Microwave</option>
                <option value="Dishwasher">Dishwasher</option>
                <option value="Refrigerator">Refrigerator</option>
                <option value="Water Purifier">Water Purifier</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedAppliance(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Appliance
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating & Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppliances.map((appliance) => (
                <tr key={appliance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appliance.name}</div>
                      <div className="text-xs text-gray-500">{appliance.code}</div>
                      <div className="text-xs text-gray-400">{appliance.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <Zap className="h-4 w-4 text-gray-400" />
                        <span>{appliance.category}</span>
                      </div>
                      <div className="text-xs text-gray-500">{appliance.brand}</div>
                      <div className="text-xs text-gray-400">{appliance.subcategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Ruler className="h-3 w-3 text-gray-400" />
                        <span>{appliance.specifications.dimensions.width}×{appliance.specifications.dimensions.depth}×{appliance.specifications.dimensions.height} {appliance.specifications.dimensions.unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span>{appliance.specifications.power.wattage}W</span>
                      </div>
                      {appliance.specifications.capacity && (
                        <div className="text-gray-600">{appliance.specifications.capacity}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <DollarSign className="h-3 w-3" />
                        ₹{appliance.price.toLocaleString()}
                      </div>
                      {appliance.installationRequired && (
                        <div className="text-xs text-gray-500">
                          + ₹{appliance.installationCost} installation
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{appliance.rating}</span>
                        <span className="text-xs text-gray-500">({appliance.reviews})</span>
                      </div>
                      {getAvailabilityBadge(appliance.availability)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(appliance.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(appliance)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(appliance.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedAppliance ? 'Edit Appliance' : 'Add New Appliance'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedAppliance?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="APP-XXX-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedAppliance?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Appliance name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      defaultValue={selectedAppliance?.category || 'Hob'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Hob">Hob</option>
                      <option value="Chimney">Chimney</option>
                      <option value="Oven">Oven</option>
                      <option value="Microwave">Microwave</option>
                      <option value="Dishwasher">Dishwasher</option>
                      <option value="Refrigerator">Refrigerator</option>
                      <option value="Water Purifier">Water Purifier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedAppliance?.brand}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Bosch, Faber"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedAppliance?.model}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Model number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width (mm) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedAppliance?.specifications.dimensions.width}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Depth (mm) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedAppliance?.specifications.dimensions.depth}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (mm) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedAppliance?.specifications.dimensions.height}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedAppliance?.price}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Installation Cost (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedAppliance?.installationCost}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <select 
                      defaultValue={selectedAppliance?.availability || 'In Stock'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                      <option value="On Order">On Order</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select 
                      defaultValue={selectedAppliance?.status || 'Active'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Appliance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
