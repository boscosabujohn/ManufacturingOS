'use client';

import React, { useState, useMemo } from 'react';
import {
  Box, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Layers, Ruler, DollarSign, Image, Package
} from 'lucide-react';

interface CabinetType {
  id: string;
  code: string;
  name: string;
  category: 'Base Cabinet' | 'Wall Cabinet' | 'Tall Cabinet' | 'Corner Cabinet' | 'Specialty';
  subcategory: string;
  dimensions: {
    width: number[];
    depth: number;
    height: number;
    unit: string;
  };
  configuration: {
    doors: number;
    drawers: number;
    shelves: number;
  };
  features: string[];
  materials: string[];
  finishOptions: string[];
  hardwareIncluded: string[];
  basePrice: number;
  installationType: 'Freestanding' | 'Built-in' | 'Modular';
  weightCapacity: number;
  status: 'Active' | 'Inactive' | 'Discontinued';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

const mockCabinetTypes: CabinetType[] = [
  {
    id: '1',
    code: 'CAB-BASE-001',
    name: 'Standard Base Cabinet - 3 Drawer',
    category: 'Base Cabinet',
    subcategory: 'Drawer Unit',
    dimensions: {
      width: [450, 600, 750, 900],
      depth: 600,
      height: 850,
      unit: 'mm'
    },
    configuration: {
      doors: 0,
      drawers: 3,
      shelves: 0
    },
    features: [
      'Soft-close drawers',
      'Full extension slides',
      'Adjustable legs',
      'Anti-slip mat included'
    ],
    materials: ['Plywood', 'MDF', 'Particle Board'],
    finishOptions: ['Laminate', 'Acrylic', 'PU Paint', 'Membrane'],
    hardwareIncluded: ['Drawer slides', 'Handles', 'Adjustable legs'],
    basePrice: 18000,
    installationType: 'Modular',
    weightCapacity: 50,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-05'),
      createdBy: 'Product Manager'
    }
  },
  {
    id: '2',
    code: 'CAB-WALL-001',
    name: 'Wall Cabinet - Double Door',
    category: 'Wall Cabinet',
    subcategory: 'Storage Unit',
    dimensions: {
      width: [600, 750, 900, 1200],
      depth: 350,
      height: 720,
      unit: 'mm'
    },
    configuration: {
      doors: 2,
      drawers: 0,
      shelves: 2
    },
    features: [
      'Soft-close hinges',
      'Adjustable shelves',
      'Glass panel option',
      'Under-cabinet lighting ready'
    ],
    materials: ['Plywood', 'MDF'],
    finishOptions: ['Laminate', 'Acrylic', 'PU Paint', 'Glass'],
    hardwareIncluded: ['Hinges', 'Handles', 'Wall brackets', 'Shelf supports'],
    basePrice: 15000,
    installationType: 'Modular',
    weightCapacity: 30,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-02-28'),
      createdBy: 'Product Manager'
    }
  },
  {
    id: '3',
    code: 'CAB-TALL-001',
    name: 'Tall Unit - Pantry Cabinet',
    category: 'Tall Cabinet',
    subcategory: 'Pantry',
    dimensions: {
      width: [600, 750, 900],
      depth: 600,
      height: 2400,
      unit: 'mm'
    },
    configuration: {
      doors: 2,
      drawers: 0,
      shelves: 4
    },
    features: [
      'Full height storage',
      'Wire baskets compatible',
      'Soft-close doors',
      'Interior organizers',
      'Toe kick plinth'
    ],
    materials: ['Plywood', 'MDF'],
    finishOptions: ['Laminate', 'Acrylic', 'PU Paint'],
    hardwareIncluded: ['Hinges', 'Handles', 'Shelf supports', 'Plinth'],
    basePrice: 35000,
    installationType: 'Modular',
    weightCapacity: 80,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'Product Manager'
    }
  }
];

export default function CabinetTypeMaster() {
  const [cabinetTypes, setCabinetTypes] = useState<CabinetType[]>(mockCabinetTypes);
  const [selectedCabinet, setSelectedCabinet] = useState<CabinetType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const handleEdit = (cabinet: CabinetType) => {
    setSelectedCabinet(cabinet);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this cabinet type?')) {
      setCabinetTypes(cabinetTypes.filter(c => c.id !== id));
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

  const filteredCabinets = useMemo(() => {
    return cabinetTypes.filter(cabinet => {
      const matchesSearch = cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cabinet.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || cabinet.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [cabinetTypes, searchTerm, filterCategory]);

  return (
    <div className="p-6 ">
      <div className="mb-3">
        <h2 className="text-2xl font-bold mb-2">Cabinet Type Master</h2>
        <p className="text-gray-600">Manage kitchen cabinet product categories and specifications</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cabinet types..."
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
                <option value="Base Cabinet">Base Cabinet</option>
                <option value="Wall Cabinet">Wall Cabinet</option>
                <option value="Tall Cabinet">Tall Cabinet</option>
                <option value="Corner Cabinet">Corner Cabinet</option>
                <option value="Specialty">Specialty</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedCabinet(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Cabinet Type
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cabinet Type
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Configuration
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Price
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCabinets.map((cabinet) => (
                <tr key={cabinet.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{cabinet.name}</div>
                      <div className="text-xs text-gray-500">{cabinet.code}</div>
                      <div className="text-xs text-gray-400">{cabinet.subcategory}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Box className="h-4 w-4 text-gray-400" />
                      <span>{cabinet.category}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Ruler className="h-3 w-3 text-gray-400" />
                        <span>W: {cabinet.dimensions.width.join('/')}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        D: {cabinet.dimensions.depth} × H: {cabinet.dimensions.height} {cabinet.dimensions.unit}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-xs space-y-1">
                      {cabinet.configuration.doors > 0 && (
                        <div>{cabinet.configuration.doors} Door(s)</div>
                      )}
                      {cabinet.configuration.drawers > 0 && (
                        <div>{cabinet.configuration.drawers} Drawer(s)</div>
                      )}
                      {cabinet.configuration.shelves > 0 && (
                        <div>{cabinet.configuration.shelves} Shelf/Shelves</div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <DollarSign className="h-3 w-3" />
                      ₹{cabinet.basePrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {getStatusBadge(cabinet.status)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(cabinet)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cabinet.id)}
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
                {selectedCabinet ? 'Edit Cabinet Type' : 'Add New Cabinet Type'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedCabinet?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="CAB-XXX-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedCabinet?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Cabinet type name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      defaultValue={selectedCabinet?.category || 'Base Cabinet'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Base Cabinet">Base Cabinet</option>
                      <option value="Wall Cabinet">Wall Cabinet</option>
                      <option value="Tall Cabinet">Tall Cabinet</option>
                      <option value="Corner Cabinet">Corner Cabinet</option>
                      <option value="Specialty">Specialty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedCabinet?.subcategory}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Drawer Unit, Storage Unit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Depth (mm) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCabinet?.dimensions.depth}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (mm) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCabinet?.dimensions.height}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price (₹) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCabinet?.basePrice}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Doors
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCabinet?.configuration.doors}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drawers
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCabinet?.configuration.drawers}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shelves
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCabinet?.configuration.shelves}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select 
                    defaultValue={selectedCabinet?.status || 'Active'}
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
                Save Cabinet Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
