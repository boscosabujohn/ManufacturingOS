'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Ruler, DollarSign, Droplet, Shield, Star
} from 'lucide-react';

interface CounterMaterial {
  id: string;
  code: string;
  name: string;
  category: 'Granite' | 'Quartz' | 'Marble' | 'Solid Surface' | 'Laminate' | 'Wood' | 'Stainless Steel';
  origin: string;
  properties: {
    thickness: number[];
    hardness: 'Very High' | 'High' | 'Medium' | 'Low';
    porosity: 'Non-porous' | 'Low' | 'Medium' | 'High';
    heatResistance: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    stainResistance: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    scratchResistance: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  };
  colors: string[];
  patterns: string[];
  edgeProfiles: string[];
  finishes: string[];
  pricePerSqFt: number;
  installation: {
    complexity: 'Simple' | 'Moderate' | 'Complex';
    costPerSqFt: number;
  };
  maintenance: {
    sealing: boolean;
    frequency: string;
    difficulty: 'Easy' | 'Moderate' | 'Difficult';
  };
  applications: string[];
  warranty: string;
  leadTime: string;
  ecoFriendly: boolean;
  rating: number;
  status: 'Active' | 'Inactive' | 'Discontinued';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

const mockCounterMaterials: CounterMaterial[] = [
  {
    id: '1',
    code: 'CTR-GRN-001',
    name: 'Black Galaxy Granite',
    category: 'Granite',
    origin: 'India (Andhra Pradesh)',
    properties: {
      thickness: [15, 18, 20, 30],
      hardness: 'Very High',
      porosity: 'Low',
      heatResistance: 'Excellent',
      stainResistance: 'Good',
      scratchResistance: 'Excellent'
    },
    colors: ['Black with Gold Flecks'],
    patterns: ['Speckled', 'Uniform'],
    edgeProfiles: ['Straight', 'Beveled', 'Ogee', 'Bullnose', 'Waterfall'],
    finishes: ['Polished', 'Honed', 'Leathered'],
    pricePerSqFt: 350,
    installation: {
      complexity: 'Moderate',
      costPerSqFt: 80
    },
    maintenance: {
      sealing: true,
      frequency: 'Annually',
      difficulty: 'Easy'
    },
    applications: ['Kitchen Countertop', 'Island Top', 'Bathroom Vanity'],
    warranty: '10 Years against manufacturing defects',
    leadTime: '7-10 days',
    ecoFriendly: true,
    rating: 4.7,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Product Manager'
    }
  },
  {
    id: '2',
    code: 'CTR-QTZ-001',
    name: 'Caesarstone Quartz - Pure White',
    category: 'Quartz',
    origin: 'Israel',
    properties: {
      thickness: [15, 20, 30],
      hardness: 'Very High',
      porosity: 'Non-porous',
      heatResistance: 'Good',
      stainResistance: 'Excellent',
      scratchResistance: 'Excellent'
    },
    colors: ['Pure White', 'Warm White', 'Cool White'],
    patterns: ['Solid', 'Veined'],
    edgeProfiles: ['Straight', 'Beveled', 'Mitered', 'Bullnose'],
    finishes: ['Polished', 'Matt', 'Textured'],
    pricePerSqFt: 450,
    installation: {
      complexity: 'Moderate',
      costPerSqFt: 100
    },
    maintenance: {
      sealing: false,
      frequency: 'N/A',
      difficulty: 'Easy'
    },
    applications: ['Kitchen Countertop', 'Island Top', 'Backsplash', 'Tabletop'],
    warranty: '15 Years limited warranty',
    leadTime: '10-14 days',
    ecoFriendly: true,
    rating: 4.9,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'Product Manager'
    }
  },
  {
    id: '3',
    code: 'CTR-MAR-001',
    name: 'Italian Carrara Marble',
    category: 'Marble',
    origin: 'Italy',
    properties: {
      thickness: [18, 20, 30],
      hardness: 'Medium',
      porosity: 'Medium',
      heatResistance: 'Good',
      stainResistance: 'Fair',
      scratchResistance: 'Fair'
    },
    colors: ['White with Grey Veining'],
    patterns: ['Veined', 'Cloudy'],
    edgeProfiles: ['Straight', 'Beveled', 'Ogee', 'Bullnose'],
    finishes: ['Polished', 'Honed'],
    pricePerSqFt: 500,
    installation: {
      complexity: 'Complex',
      costPerSqFt: 120
    },
    maintenance: {
      sealing: true,
      frequency: 'Every 6 months',
      difficulty: 'Moderate'
    },
    applications: ['Premium Kitchen', 'Bathroom Vanity', 'Feature Wall'],
    warranty: '5 Years with proper maintenance',
    leadTime: '14-21 days',
    ecoFriendly: true,
    rating: 4.6,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'Product Manager'
    }
  }
];

export default function CounterMaterialMaster() {
  const [materials, setMaterials] = useState<CounterMaterial[]>(mockCounterMaterials);
  const [selectedMaterial, setSelectedMaterial] = useState<CounterMaterial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const handleEdit = (material: CounterMaterial) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this counter material?')) {
      setMaterials(materials.filter(m => m.id !== id));
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

  const getResistanceBadge = (resistance: string) => {
    const colors = {
      'Excellent': 'bg-green-100 text-green-800',
      'Good': 'bg-blue-100 text-blue-800',
      'Fair': 'bg-yellow-100 text-yellow-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${colors[resistance as keyof typeof colors]}`}>
        {resistance}
      </span>
    );
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.origin.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || material.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, filterCategory]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Counter Material Master</h2>
        <p className="text-gray-600">Manage worktop material options, specifications, and pricing</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search counter materials..."
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
                <option value="Granite">Granite</option>
                <option value="Quartz">Quartz</option>
                <option value="Marble">Marble</option>
                <option value="Solid Surface">Solid Surface</option>
                <option value="Laminate">Laminate</option>
                <option value="Wood">Wood</option>
                <option value="Stainless Steel">Stainless Steel</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedMaterial(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Counter Material
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Origin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Properties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resistance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/SqFt
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
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{material.name}</div>
                      <div className="text-xs text-gray-500">{material.code}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{material.rating}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <Layers className="h-4 w-4 text-gray-400" />
                        <span>{material.category}</span>
                      </div>
                      <div className="text-xs text-gray-500">{material.origin}</div>
                      {material.ecoFriendly && (
                        <div className="text-xs text-green-600 mt-1">♻️ Eco-friendly</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Ruler className="h-3 w-3 text-gray-400" />
                        <span>{material.properties.thickness.join('/')}mm</span>
                      </div>
                      <div>Hardness: {material.properties.hardness}</div>
                      <div>Porosity: {material.properties.porosity}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-orange-500" />
                        <span>Heat: {getResistanceBadge(material.properties.heatResistance)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplet className="h-3 w-3 text-blue-500" />
                        <span>Stain: {getResistanceBadge(material.properties.stainResistance)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-green-500" />
                        <span>Scratch: {getResistanceBadge(material.properties.scratchResistance)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <DollarSign className="h-3 w-3" />
                        ₹{material.pricePerSqFt}
                      </div>
                      <div className="text-xs text-gray-500">
                        + ₹{material.installation.costPerSqFt} install
                      </div>
                      <div className="text-xs text-gray-400">Lead: {material.leadTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(material.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
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
                {selectedMaterial ? 'Edit Counter Material' : 'Add New Counter Material'}
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
                      defaultValue={selectedMaterial?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="CTR-XXX-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedMaterial?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Material name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      defaultValue={selectedMaterial?.category || 'Granite'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Granite">Granite</option>
                      <option value="Quartz">Quartz</option>
                      <option value="Marble">Marble</option>
                      <option value="Solid Surface">Solid Surface</option>
                      <option value="Laminate">Laminate</option>
                      <option value="Wood">Wood</option>
                      <option value="Stainless Steel">Stainless Steel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedMaterial?.origin}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., India, Italy, China"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hardness
                    </label>
                    <select 
                      defaultValue={selectedMaterial?.properties.hardness || 'High'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Very High">Very High</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heat Resistance
                    </label>
                    <select 
                      defaultValue={selectedMaterial?.properties.heatResistance || 'Good'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scratch Resistance
                    </label>
                    <select 
                      defaultValue={selectedMaterial?.properties.scratchResistance || 'Good'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Sq.Ft (₹) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedMaterial?.pricePerSqFt}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Installation Cost/Sq.Ft (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedMaterial?.installation.costPerSqFt}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select 
                    defaultValue={selectedMaterial?.status || 'Active'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
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
                Save Counter Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
