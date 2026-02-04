'use client';

import React, { useState } from 'react';
import { FileText, Plus, Search, Eye, Edit3, Download, Upload, CheckCircle, Layers, Ruler } from 'lucide-react';

interface ItemSpecification {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  status: 'active' | 'inactive';
  
  specifications: {
    dimension?: {
      length?: number;
      width?: number;
      height?: number;
      unit: string;
      tolerance?: string;
    };
    weight?: {
      value: number;
      unit: string;
      tolerance?: string;
    };
    material?: {
      primary: string;
      secondary?: string[];
      grade?: string;
    };
    finish?: {
      type: string;
      color?: string;
      thickness?: string;
    };
    performance?: {
      loadCapacity?: string;
      temperatureRange?: string;
      humidity?: string;
    };
    compliance?: {
      standards?: string[];
      certifications?: string[];
    };
  };
  
  customFields: {
    [key: string]: string | number | boolean;
  };
  
  attachments?: {
    drawings?: string[];
    testReports?: string[];
    certifications?: string[];
  };
  
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

const ItemSpecificationMaster: React.FC = () => {
  const [specs, setSpecs] = useState<ItemSpecification[]>([
    {
      id: '1',
      itemCode: 'KIT-PREM-001',
      itemName: 'Premium Kitchen Cabinet Set',
      category: 'Finished Goods',
      status: 'active',
      specifications: {
        dimension: {
          length: 2400,
          width: 600,
          height: 900,
          unit: 'mm',
          tolerance: '±2mm'
        },
        weight: {
          value: 250,
          unit: 'kg',
          tolerance: '±5kg'
        },
        material: {
          primary: 'Marine Plywood',
          secondary: ['MDF', 'Particle Board'],
          grade: 'BWP Grade'
        },
        finish: {
          type: 'PU Coating',
          color: 'Glossy White',
          thickness: '0.5mm'
        },
        performance: {
          loadCapacity: '50kg per shelf',
          temperatureRange: '-10°C to 60°C',
          humidity: 'Up to 80% RH'
        },
        compliance: {
          standards: ['IS 303', 'IS 2202'],
          certifications: ['CARB P2', 'FSC']
        }
      },
      customFields: {
        shelfLife: '25 years',
        warranty: '5 years',
        fireRating: 'Class A'
      },
      attachments: {
        drawings: ['CAD-KIT-001.dwg', 'CAD-KIT-001.pdf'],
        certifications: ['FSC-CERT.pdf', 'CARB-CERT.pdf']
      },
      createdBy: 'admin',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      itemCode: 'WOOD-OAK-001',
      itemName: 'Premium Oak Wood - 1 inch',
      category: 'Raw Materials',
      status: 'active',
      specifications: {
        dimension: {
          length: 2440,
          width: 1220,
          height: 25,
          unit: 'mm',
          tolerance: '±1mm'
        },
        material: {
          primary: 'Oak Wood',
          grade: 'Prime Grade'
        },
        performance: {
          temperatureRange: '15°C to 25°C',
          humidity: '45-55% RH'
        },
        compliance: {
          certifications: ['FSC Certified']
        }
      },
      customFields: {
        moistureContent: '8-12%',
        density: '720 kg/m³'
      },
      createdBy: 'admin',
      createdAt: '2024-01-10T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecs = specs.filter(s =>
    s.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.itemCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Item Specifications Master
              </h1>
              <p className="text-gray-600 mt-2">Manage technical specifications and standards</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Specification
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Specifications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{specs.length}</p>
              </div>
              <FileText className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Specs</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {specs.filter(s => s.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Drawings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {specs.filter(s => s.attachments?.drawings && s.attachments.drawings.length > 0).length}
                </p>
              </div>
              <Layers className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certified</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {specs.filter(s => s.specifications.compliance?.certifications && s.specifications.compliance.certifications.length > 0).length}
                </p>
              </div>
              <Ruler className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Specifications List */}
        <div className="space-y-2">
          {filteredSpecs.map(spec => (
            <div key={spec.id} className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{spec.itemName}</h3>
                  <p className="text-sm text-gray-600">{spec.itemCode} • {spec.category}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Download className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Download</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* Dimensions */}
                {spec.specifications.dimension && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Dimensions</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">L × W × H:</span>
                        <span className="font-medium">
                          {spec.specifications.dimension.length} × {spec.specifications.dimension.width} × {spec.specifications.dimension.height} {spec.specifications.dimension.unit}
                        </span>
                      </div>
                      {spec.specifications.dimension.tolerance && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tolerance:</span>
                          <span className="font-medium">{spec.specifications.dimension.tolerance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Material */}
                {spec.specifications.material && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Material</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Primary:</span>
                        <span className="font-medium">{spec.specifications.material.primary}</span>
                      </div>
                      {spec.specifications.material.grade && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grade:</span>
                          <span className="font-medium">{spec.specifications.material.grade}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Finish */}
                {spec.specifications.finish && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Finish</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{spec.specifications.finish.type}</span>
                      </div>
                      {spec.specifications.finish.color && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium">{spec.specifications.finish.color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Compliance */}
              {spec.specifications.compliance && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Compliance & Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {spec.specifications.compliance.certifications?.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {cert}
                      </span>
                    ))}
                    {spec.specifications.compliance.standards?.map((std, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemSpecificationMaster;
