'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Palette, Droplet, Shield, DollarSign
} from 'lucide-react';

interface Finish {
  id: string;
  code: string;
  name: string;
  category: 'Paint' | 'Laminate' | 'Veneer' | 'Lacquer' | 'PU Finish' | 'Acrylic' | 'Membrane';
  subcategory: string;
  properties: {
    texture: 'Matt' | 'Glossy' | 'Semi-Glossy' | 'Satin' | 'Textured';
    sheen: string;
    durability: 'High' | 'Medium' | 'Low';
    waterResistance: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    scratchResistance: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  };
  colors: string[];
  applicationMethod: string[];
  suitableFor: string[];
  coverage: {
    value: number;
    unit: string;
  };
  dryingTime: {
    touch: string;
    recoat: string;
    fullCure: string;
  };
  pricePerUnit: number;
  maintenance: string;
  warranty: string;
  certifications: string[];
  status: 'Active' | 'Inactive' | 'Discontinued';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

const mockFinishes: Finish[] = [
  {
    id: '1',
    code: 'FIN-LAM-001',
    name: 'High Gloss Acrylic Laminate',
    category: 'Laminate',
    subcategory: 'Acrylic Finish',
    properties: {
      texture: 'Glossy',
      sheen: '90-95%',
      durability: 'High',
      waterResistance: 'Excellent',
      scratchResistance: 'Good'
    },
    colors: ['White', 'Black', 'Red', 'Blue', 'Grey', 'Custom'],
    applicationMethod: ['Press Bonding', 'Contact Adhesive'],
    suitableFor: ['Kitchen Cabinets', 'Wardrobes', 'Furniture'],
    coverage: {
      value: 1,
      unit: 'sqm per sheet'
    },
    dryingTime: {
      touch: 'N/A',
      recoat: 'N/A',
      fullCure: 'Immediate'
    },
    pricePerUnit: 850,
    maintenance: 'Wipe with damp cloth. Avoid abrasive cleaners.',
    warranty: '10 Years against delamination',
    certifications: ['IS 14276', 'Greenguard'],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Product Manager'
    }
  },
  {
    id: '2',
    code: 'FIN-PU-001',
    name: 'Premium PU Paint - Matt Finish',
    category: 'PU Finish',
    subcategory: 'Polyurethane Coating',
    properties: {
      texture: 'Matt',
      sheen: '5-10%',
      durability: 'High',
      waterResistance: 'Excellent',
      scratchResistance: 'Excellent'
    },
    colors: ['White', 'Cream', 'Grey', 'Custom RAL/Pantone'],
    applicationMethod: ['Spray Gun', 'HVLP'],
    suitableFor: ['High-end Kitchens', 'Premium Furniture', 'Doors'],
    coverage: {
      value: 10,
      unit: 'sqm per liter'
    },
    dryingTime: {
      touch: '2 hours',
      recoat: '6 hours',
      fullCure: '7 days'
    },
    pricePerUnit: 450,
    maintenance: 'Clean with mild soap solution. Highly resistant to stains.',
    warranty: '15 Years against yellowing and peeling',
    certifications: ['IS 15489', 'Low VOC'],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'Product Manager'
    }
  },
  {
    id: '3',
    code: 'FIN-VEN-001',
    name: 'Natural Wood Veneer - Oak',
    category: 'Veneer',
    subcategory: 'Natural Wood',
    properties: {
      texture: 'Textured',
      sheen: 'Natural',
      durability: 'Medium',
      waterResistance: 'Fair',
      scratchResistance: 'Fair'
    },
    colors: ['Natural Oak', 'Light Oak', 'Dark Oak'],
    applicationMethod: ['Contact Adhesive', 'Hot Press'],
    suitableFor: ['Premium Furniture', 'Wall Panels', 'Doors'],
    coverage: {
      value: 1,
      unit: 'sqm per sheet'
    },
    dryingTime: {
      touch: 'N/A',
      recoat: 'N/A',
      fullCure: '24 hours'
    },
    pricePerUnit: 1200,
    maintenance: 'Requires periodic polishing. Avoid water exposure.',
    warranty: '5 Years with proper maintenance',
    certifications: ['FSC Certified', 'CARB P2'],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'Product Manager'
    }
  }
];

export default function FinishMaster() {
  const [finishes, setFinishes] = useState<Finish[]>(mockFinishes);
  const [selectedFinish, setSelectedFinish] = useState<Finish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const handleEdit = (finish: Finish) => {
    setSelectedFinish(finish);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this finish?')) {
      setFinishes(finishes.filter(f => f.id !== id));
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

  const getDurabilityBadge = (durability: string) => {
    const colors = {
      'High': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[durability as keyof typeof colors]}`}>
        {durability}
      </span>
    );
  };

  const filteredFinishes = useMemo(() => {
    return finishes.filter(finish => {
      const matchesSearch = finish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           finish.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || finish.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [finishes, searchTerm, filterCategory]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Finish Master</h2>
        <p className="text-gray-600">Manage surface treatments, coatings, and finishing options</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search finishes..."
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
                <option value="Paint">Paint</option>
                <option value="Laminate">Laminate</option>
                <option value="Veneer">Veneer</option>
                <option value="Lacquer">Lacquer</option>
                <option value="PU Finish">PU Finish</option>
                <option value="Acrylic">Acrylic</option>
                <option value="Membrane">Membrane</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedFinish(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Finish
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Finish Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Properties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resistance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Unit
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
              {filteredFinishes.map((finish) => (
                <tr key={finish.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{finish.name}</div>
                      <div className="text-xs text-gray-500">{finish.code}</div>
                      <div className="text-xs text-gray-400">{finish.subcategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Sparkles className="h-4 w-4 text-gray-400" />
                      <span>{finish.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Palette className="h-3 w-3 text-gray-400" />
                        <span>{finish.properties.texture}</span>
                      </div>
                      <div>Sheen: {finish.properties.sheen}</div>
                      <div>Durability: {getDurabilityBadge(finish.properties.durability)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Droplet className="h-3 w-3 text-blue-500" />
                        <span>Water: {finish.properties.waterResistance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-green-500" />
                        <span>Scratch: {finish.properties.scratchResistance}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <DollarSign className="h-3 w-3" />
                      ₹{finish.pricePerUnit}
                    </div>
                    <div className="text-xs text-gray-500">{finish.coverage.value} {finish.coverage.unit}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(finish.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(finish)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(finish.id)}
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
                {selectedFinish ? 'Edit Finish' : 'Add New Finish'}
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
                      defaultValue={selectedFinish?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="FIN-XXX-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedFinish?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Finish name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      defaultValue={selectedFinish?.category || 'Laminate'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Paint">Paint</option>
                      <option value="Laminate">Laminate</option>
                      <option value="Veneer">Veneer</option>
                      <option value="Lacquer">Lacquer</option>
                      <option value="PU Finish">PU Finish</option>
                      <option value="Acrylic">Acrylic</option>
                      <option value="Membrane">Membrane</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texture *
                    </label>
                    <select 
                      defaultValue={selectedFinish?.properties.texture || 'Matt'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Matt">Matt</option>
                      <option value="Glossy">Glossy</option>
                      <option value="Semi-Glossy">Semi-Glossy</option>
                      <option value="Satin">Satin</option>
                      <option value="Textured">Textured</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durability
                    </label>
                    <select 
                      defaultValue={selectedFinish?.properties.durability || 'High'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Water Resistance
                    </label>
                    <select 
                      defaultValue={selectedFinish?.properties.waterResistance || 'Good'}
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
                      defaultValue={selectedFinish?.properties.scratchResistance || 'Good'}
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
                      Price per Unit (₹) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedFinish?.pricePerUnit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedFinish?.warranty}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10 Years"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select 
                    defaultValue={selectedFinish?.status || 'Active'}
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
                Save Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
