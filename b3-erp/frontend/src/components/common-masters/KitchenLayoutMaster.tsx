'use client';

import React, { useState, useMemo } from 'react';
import {
  Layout, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Ruler, Home, Grid, Maximize2, Image,
  Copy, FileText, Eye, Download
} from 'lucide-react';

interface KitchenLayout {
  id: string;
  code: string;
  name: string;
  layoutType: 'L-Shape' | 'U-Shape' | 'Straight' | 'Island' | 'Parallel' | 'G-Shape';
  style: 'Modern' | 'Contemporary' | 'Traditional' | 'Transitional' | 'Industrial' | 'Minimalist';
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  features: string[];
  cabinetUnits: {
    baseUnits: number;
    wallUnits: number;
    tallUnits: number;
    cornerUnits: number;
  };
  workTriangle: {
    sink: string;
    stove: string;
    refrigerator: string;
    optimized: boolean;
  };
  specifications: {
    counterHeight: number;
    wallCabinetHeight: number;
    depthBase: number;
    depthWall: number;
  };
  appliances: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  estimatedCost: number;
  popularity: number;
  status: 'Active' | 'Inactive' | 'Draft';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

const mockLayouts: KitchenLayout[] = [
  {
    id: '1',
    code: 'KL-001',
    name: 'Modern L-Shape Premium',
    layoutType: 'L-Shape',
    style: 'Modern',
    dimensions: {
      length: 4200,
      width: 3600,
      height: 2400,
      unit: 'mm'
    },
    features: [
      'Breakfast Counter',
      'Under-cabinet Lighting',
      'Pull-out Drawers',
      'Soft-close Hinges',
      'Modular Design'
    ],
    cabinetUnits: {
      baseUnits: 8,
      wallUnits: 6,
      tallUnits: 2,
      cornerUnits: 1
    },
    workTriangle: {
      sink: 'Main Wall (Left)',
      stove: 'Main Wall (Center)',
      refrigerator: 'Adjacent Wall',
      optimized: true
    },
    specifications: {
      counterHeight: 900,
      wallCabinetHeight: 720,
      depthBase: 600,
      depthWall: 350
    },
    appliances: ['Built-in Hob', 'Chimney', 'Dishwasher', 'Microwave'],
    estimatedCost: 250000,
    popularity: 95,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'Design Team'
    }
  },
  {
    id: '2',
    code: 'KL-002',
    name: 'Contemporary Island Kitchen',
    layoutType: 'Island',
    style: 'Contemporary',
    dimensions: {
      length: 5400,
      width: 4200,
      height: 2400,
      unit: 'mm'
    },
    features: [
      'Central Island',
      'Breakfast Bar',
      'Pendant Lighting',
      'Wine Cooler Space',
      'Integrated Appliances',
      'Quartz Countertop'
    ],
    cabinetUnits: {
      baseUnits: 12,
      wallUnits: 8,
      tallUnits: 3,
      cornerUnits: 0
    },
    workTriangle: {
      sink: 'Island',
      stove: 'Main Wall',
      refrigerator: 'Side Wall',
      optimized: true
    },
    specifications: {
      counterHeight: 900,
      wallCabinetHeight: 720,
      depthBase: 600,
      depthWall: 350
    },
    appliances: [
      'Built-in Hob',
      'Chimney',
      'Dishwasher',
      'Wine Cooler',
      'Built-in Oven',
      'Microwave'
    ],
    estimatedCost: 450000,
    popularity: 88,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Design Team'
    }
  },
  {
    id: '3',
    code: 'KL-003',
    name: 'Traditional U-Shape',
    layoutType: 'U-Shape',
    style: 'Traditional',
    dimensions: {
      length: 3900,
      width: 3600,
      height: 2400,
      unit: 'mm'
    },
    features: [
      'Crown Molding',
      'Glass Display Cabinets',
      'Decorative Hardware',
      'Wooden Finish',
      'Under-cabinet Valance'
    ],
    cabinetUnits: {
      baseUnits: 10,
      wallUnits: 10,
      tallUnits: 2,
      cornerUnits: 2
    },
    workTriangle: {
      sink: 'Center Wall',
      stove: 'Left Wall',
      refrigerator: 'Right Wall',
      optimized: true
    },
    specifications: {
      counterHeight: 900,
      wallCabinetHeight: 720,
      depthBase: 600,
      depthWall: 350
    },
    appliances: ['Gas Hob', 'Chimney', 'Built-in Oven'],
    estimatedCost: 320000,
    popularity: 75,
    status: 'Active',
    metadata: {
      createdAt: new Date('2023-11-20'),
      updatedAt: new Date('2024-02-28'),
      createdBy: 'Design Team'
    }
  }
];

export default function KitchenLayoutMaster() {
  const [layouts, setLayouts] = useState<KitchenLayout[]>(mockLayouts);
  const [selectedLayout, setSelectedLayout] = useState<KitchenLayout | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStyle, setFilterStyle] = useState<string>('All');

  const handleEdit = (layout: KitchenLayout) => {
    setSelectedLayout(layout);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this kitchen layout?')) {
      setLayouts(layouts.filter(l => l.id !== id));
    }
  };

  const handleCopy = (layout: KitchenLayout) => {
    const newLayout = {
      ...layout,
      id: Date.now().toString(),
      code: `${layout.code}-COPY`,
      name: `${layout.name} (Copy)`,
      status: 'Draft' as const
    };
    setLayouts([...layouts, newLayout]);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Draft': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FileText }
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

  const filteredLayouts = useMemo(() => {
    return layouts.filter(layout => {
      const matchesSearch = layout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           layout.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || layout.layoutType === filterType;
      const matchesStyle = filterStyle === 'All' || layout.style === filterStyle;
      return matchesSearch && matchesType && matchesStyle;
    });
  }, [layouts, searchTerm, filterType, filterStyle]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Kitchen Layout Master</h2>
        <p className="text-gray-600">Manage kitchen design templates and configurations</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search layouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Types</option>
                <option value="L-Shape">L-Shape</option>
                <option value="U-Shape">U-Shape</option>
                <option value="Straight">Straight</option>
                <option value="Island">Island</option>
                <option value="Parallel">Parallel</option>
                <option value="G-Shape">G-Shape</option>
              </select>
              <select
                value={filterStyle}
                onChange={(e) => setFilterStyle(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Styles</option>
                <option value="Modern">Modern</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Traditional">Traditional</option>
                <option value="Transitional">Transitional</option>
                <option value="Industrial">Industrial</option>
                <option value="Minimalist">Minimalist</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedLayout(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Layout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredLayouts.map((layout) => (
            <div key={layout.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center h-48">
                <Layout className="h-24 w-24 text-blue-400" />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{layout.name}</h3>
                    <p className="text-xs text-gray-500">{layout.code}</p>
                  </div>
                  {getStatusBadge(layout.status)}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Grid className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{layout.layoutType}</span>
                    <span className="text-gray-500">• {layout.style}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Ruler className="h-4 w-4 text-gray-400" />
                    <span>{layout.dimensions.length} × {layout.dimensions.width} {layout.dimensions.unit}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Home className="h-4 w-4 text-gray-400" />
                    <span>{layout.cabinetUnits.baseUnits + layout.cabinetUnits.wallUnits + layout.cabinetUnits.tallUnits} Total Units</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    ₹{layout.estimatedCost.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {layout.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {layout.features.length > 3 && (
                    <span className="text-xs text-blue-600">+{layout.features.length - 3} more</span>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(layout)}
                    className="flex-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleCopy(layout)}
                    className="flex-1 px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded hover:bg-purple-100 flex items-center justify-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    onClick={() => handleDelete(layout.id)}
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedLayout ? 'Edit Kitchen Layout' : 'Add New Kitchen Layout'}
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
                      Layout Code *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedLayout?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="KL-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Layout Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedLayout?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter layout name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Layout Type *
                    </label>
                    <select 
                      defaultValue={selectedLayout?.layoutType || 'L-Shape'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="L-Shape">L-Shape</option>
                      <option value="U-Shape">U-Shape</option>
                      <option value="Straight">Straight</option>
                      <option value="Island">Island</option>
                      <option value="Parallel">Parallel</option>
                      <option value="G-Shape">G-Shape</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Style *
                    </label>
                    <select 
                      defaultValue={selectedLayout?.style || 'Modern'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Modern">Modern</option>
                      <option value="Contemporary">Contemporary</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Transitional">Transitional</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Minimalist">Minimalist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select 
                      defaultValue={selectedLayout?.status || 'Active'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Length (mm) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedLayout?.dimensions.length}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width (mm) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedLayout?.dimensions.width}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (mm) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedLayout?.dimensions.height}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedLayout?.estimatedCost}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
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
                Save Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
