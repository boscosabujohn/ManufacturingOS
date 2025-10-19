'use client';

import React, { useState, useMemo } from 'react';
import {
  Wrench, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Package, DollarSign, Palette, Box
} from 'lucide-react';

interface Hardware {
  id: string;
  code: string;
  name: string;
  category: 'Hinges' | 'Handles' | 'Drawer Slides' | 'Locks' | 'Knobs' | 'Pull-outs' | 'Accessories';
  subcategory: string;
  specifications: {
    material: string;
    finish: string;
    size: string;
    weight: number;
    loadCapacity?: number;
  };
  finishOptions: string[];
  suitableFor: string[];
  brand: string;
  priceRange: {
    min: number;
    max: number;
  };
  warranty: string;
  installationType: 'Surface Mount' | 'Concealed' | 'Overlay' | 'Insert';
  features: string[];
  stock: number;
  reorderLevel: number;
  status: 'Active' | 'Inactive' | 'Discontinued';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

const mockHardware: Hardware[] = [
  {
    id: '1',
    code: 'HW-HNG-001',
    name: 'Soft-Close Cabinet Hinge - 110°',
    category: 'Hinges',
    subcategory: 'Concealed Hinge',
    specifications: {
      material: 'Cold Rolled Steel',
      finish: 'Nickel Plated',
      size: '110° Opening Angle',
      weight: 0.12,
      loadCapacity: 20
    },
    finishOptions: ['Nickel Plated', 'Chrome', 'Black'],
    suitableFor: ['Base Cabinets', 'Wall Cabinets', 'Tall Units'],
    brand: 'Hettich',
    priceRange: {
      min: 120,
      max: 180
    },
    warranty: '5 Years',
    installationType: 'Concealed',
    features: [
      'Soft-close mechanism',
      '110° opening angle',
      'Tool-free adjustment',
      'Corrosion resistant',
      'Silent operation'
    ],
    stock: 5000,
    reorderLevel: 1000,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Procurement Manager'
    }
  },
  {
    id: '2',
    code: 'HW-HDL-001',
    name: 'Modern D-Handle - Stainless Steel',
    category: 'Handles',
    subcategory: 'Cabinet Handle',
    specifications: {
      material: 'Stainless Steel 304',
      finish: 'Brushed',
      size: '128mm C-C',
      weight: 0.08
    },
    finishOptions: ['Brushed SS', 'Polished SS', 'Black Matt', 'Rose Gold'],
    suitableFor: ['Drawers', 'Doors', 'Base Cabinets'],
    brand: 'Hafele',
    priceRange: {
      min: 80,
      max: 150
    },
    warranty: '2 Years',
    installationType: 'Surface Mount',
    features: [
      'Ergonomic design',
      'Anti-fingerprint coating',
      'Modern aesthetics',
      'Rust resistant',
      'Easy installation'
    ],
    stock: 3000,
    reorderLevel: 500,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'Procurement Manager'
    }
  },
  {
    id: '3',
    code: 'HW-SLD-001',
    name: 'Full Extension Soft-Close Drawer Slide',
    category: 'Drawer Slides',
    subcategory: 'Ball Bearing Slide',
    specifications: {
      material: 'Cold Rolled Steel',
      finish: 'Zinc Plated',
      size: '450mm',
      weight: 0.5,
      loadCapacity: 45
    },
    finishOptions: ['Zinc Plated', 'White', 'Black'],
    suitableFor: ['Kitchen Drawers', 'Wardrobe Drawers', 'Desk Drawers'],
    brand: 'Blum',
    priceRange: {
      min: 350,
      max: 500
    },
    warranty: '10 Years',
    installationType: 'Concealed',
    features: [
      'Full extension 100%',
      'Soft-close mechanism',
      '45kg load capacity',
      'Silent operation',
      'Easy release'
    ],
    stock: 2000,
    reorderLevel: 400,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'Procurement Manager'
    }
  }
];

export default function HardwareMaster() {
  const [hardware, setHardware] = useState<Hardware[]>(mockHardware);
  const [selectedHardware, setSelectedHardware] = useState<Hardware | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const handleEdit = (item: Hardware) => {
    setSelectedHardware(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this hardware item?')) {
      setHardware(hardware.filter(h => h.id !== id));
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

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return <span className="text-red-600 font-medium">Out of Stock</span>;
    if (stock <= reorderLevel) return <span className="text-orange-600 font-medium">Low Stock</span>;
    return <span className="text-green-600">In Stock</span>;
  };

  const filteredHardware = useMemo(() => {
    return hardware.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [hardware, searchTerm, filterCategory]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Hardware Master</h2>
        <p className="text-gray-600">Manage kitchen cabinet fittings, accessories, and hardware components</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hardware..."
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
                <option value="Hinges">Hinges</option>
                <option value="Handles">Handles</option>
                <option value="Drawer Slides">Drawer Slides</option>
                <option value="Locks">Locks</option>
                <option value="Knobs">Knobs</option>
                <option value="Pull-outs">Pull-outs</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedHardware(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Hardware
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hardware Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
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
              {filteredHardware.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.code}</div>
                      <div className="text-xs text-gray-400">{item.brand}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1 text-sm">
                        <Wrench className="h-4 w-4 text-gray-400" />
                        <span>{item.category}</span>
                      </div>
                      <div className="text-xs text-gray-500">{item.subcategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Box className="h-3 w-3 text-gray-400" />
                        <span>{item.specifications.material}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Palette className="h-3 w-3 text-gray-400" />
                        <span>{item.specifications.finish}</span>
                      </div>
                      <div className="text-gray-500">{item.specifications.size}</div>
                      {item.specifications.loadCapacity && (
                        <div className="font-medium text-blue-600">
                          Load: {item.specifications.loadCapacity}kg
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <DollarSign className="h-3 w-3" />
                        ₹{item.priceRange.min} - ₹{item.priceRange.max}
                      </div>
                      <div className="text-xs text-gray-500">Warranty: {item.warranty}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{item.stock.toLocaleString()} units</div>
                      <div className="text-xs">{getStockStatus(item.stock, item.reorderLevel)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
                {selectedHardware ? 'Edit Hardware Item' : 'Add New Hardware'}
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
                      defaultValue={selectedHardware?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="HW-XXX-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedHardware?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Hardware item name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      defaultValue={selectedHardware?.category || 'Hinges'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Hinges">Hinges</option>
                      <option value="Handles">Handles</option>
                      <option value="Drawer Slides">Drawer Slides</option>
                      <option value="Locks">Locks</option>
                      <option value="Knobs">Knobs</option>
                      <option value="Pull-outs">Pull-outs</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedHardware?.brand}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Hettich, Hafele, Blum"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedHardware?.specifications.material}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Stainless Steel, Cold Rolled Steel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Finish *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedHardware?.specifications.finish}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Brushed, Polished, Matt"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price (₹) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedHardware?.priceRange.min}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price (₹) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedHardware?.priceRange.max}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedHardware?.warranty}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 5 Years"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedHardware?.stock}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reorder Level
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedHardware?.reorderLevel}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select 
                    defaultValue={selectedHardware?.status || 'Active'}
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
                Save Hardware
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
