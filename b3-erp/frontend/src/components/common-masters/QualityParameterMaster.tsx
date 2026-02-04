'use client';

import React, { useState, useMemo } from 'react';
import {
  Shield, Plus, Search, Edit2, Trash2, CheckCircle2,
  AlertCircle, Target, TrendingUp, Activity, Ruler,
  FileText, Beaker, Settings, AlertTriangle, XCircle
} from 'lucide-react';

interface QualityParameter {
  id: string;
  code: string;
  name: string;
  category: 'Dimensional' | 'Visual' | 'Functional' | 'Material' | 'Performance' | 'Environmental';
  measurementType: 'Variable' | 'Attribute';
  unit?: string;
  specification: {
    nominal?: number;
    upperLimit?: number;
    lowerLimit?: number;
    tolerance?: number;
    acceptanceCriteria: string;
  };
  inspectionMethod: string;
  frequency: 'Every Unit' | 'Sample' | 'First/Last' | 'Periodic' | 'On Demand';
  sampleSize?: number;
  testEquipment?: string;
  applicableItems: string[];
  criticality: 'Critical' | 'Major' | 'Minor';
  documentation: boolean;
  status: 'Active' | 'Inactive' | 'Under Review';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockParameters: QualityParameter[] = [
  {
    id: '1',
    code: 'QP-DIM-001',
    name: 'Shaft Diameter',
    category: 'Dimensional',
    measurementType: 'Variable',
    unit: 'mm',
    specification: {
      nominal: 50.0,
      upperLimit: 50.05,
      lowerLimit: 49.95,
      tolerance: 0.05,
      acceptanceCriteria: '50.0 ± 0.05 mm'
    },
    inspectionMethod: 'Micrometer measurement',
    frequency: 'Every Unit',
    testEquipment: 'Digital Micrometer (0.001mm accuracy)',
    applicableItems: ['Precision Shaft', 'Main Shaft Assembly'],
    criticality: 'Critical',
    documentation: true,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Quality Engineer',
      updatedBy: 'QA Manager'
    }
  },
  {
    id: '2',
    code: 'QP-MAT-001',
    name: 'Surface Hardness',
    category: 'Material',
    measurementType: 'Variable',
    unit: 'HRC',
    specification: {
      nominal: 58,
      upperLimit: 62,
      lowerLimit: 55,
      acceptanceCriteria: '55-62 HRC'
    },
    inspectionMethod: 'Rockwell Hardness Test',
    frequency: 'Sample',
    sampleSize: 5,
    testEquipment: 'Rockwell Hardness Tester',
    applicableItems: ['Heat Treated Components', 'Bearing Surfaces'],
    criticality: 'Critical',
    documentation: true,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20'),
      createdBy: 'Materials Engineer',
      updatedBy: 'Quality Manager'
    }
  },
  {
    id: '3',
    code: 'QP-VIS-001',
    name: 'Surface Finish',
    category: 'Visual',
    measurementType: 'Attribute',
    unit: 'Ra (μm)',
    specification: {
      upperLimit: 1.6,
      acceptanceCriteria: 'Ra ≤ 1.6 μm, No visible scratches or defects'
    },
    inspectionMethod: 'Visual inspection + Surface roughness measurement',
    frequency: 'Sample',
    sampleSize: 10,
    testEquipment: 'Surface Roughness Tester',
    applicableItems: ['Machined Surfaces', 'Bearing Contact Areas'],
    criticality: 'Major',
    documentation: true,
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'QC Inspector',
      updatedBy: 'QA Manager'
    }
  }
];

export default function QualityParameterMaster() {
  const [parameters, setParameters] = useState<QualityParameter[]>(mockParameters);
  const [selectedParameter, setSelectedParameter] = useState<QualityParameter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterCriticality, setFilterCriticality] = useState<string>('All');

  const handleEdit = (parameter: QualityParameter) => {
    setSelectedParameter(parameter);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this quality parameter?')) {
      setParameters(parameters.filter(p => p.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Under Review': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle }
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

  const getCriticalityBadge = (criticality: string) => {
    const criticalityConfig = {
      'Critical': { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle },
      'Major': { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertCircle },
      'Minor': { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle }
    };
    const config = criticalityConfig[criticality as keyof typeof criticalityConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {criticality}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Dimensional': Ruler,
      'Visual': Target,
      'Functional': Settings,
      'Material': Beaker,
      'Performance': TrendingUp,
      'Environmental': Activity
    };
    return icons[category as keyof typeof icons] || FileText;
  };

  const filteredParameters = useMemo(() => {
    return parameters.filter(param => {
      const matchesSearch = param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           param.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || param.category === filterCategory;
      const matchesCriticality = filterCriticality === 'All' || param.criticality === filterCriticality;
      return matchesSearch && matchesCategory && matchesCriticality;
    });
  }, [parameters, searchTerm, filterCategory, filterCriticality]);

  return (
    <div className="p-6 ">
      <div className="mb-3">
        <h2 className="text-2xl font-bold mb-2">Quality Parameter Master</h2>
        <p className="text-gray-600">Manage quality control standards and inspection parameters</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search quality parameters..."
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
                <option value="Dimensional">Dimensional</option>
                <option value="Visual">Visual</option>
                <option value="Functional">Functional</option>
                <option value="Material">Material</option>
                <option value="Performance">Performance</option>
                <option value="Environmental">Environmental</option>
              </select>
              <select
                value={filterCriticality}
                onChange={(e) => setFilterCriticality(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Criticality</option>
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedParameter(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Parameter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Type
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specification
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inspection
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criticality
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
              {filteredParameters.map((param) => {
                const CategoryIcon = getCategoryIcon(param.category);
                return (
                  <tr key={param.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{param.name}</div>
                        <div className="text-sm text-gray-500">{param.code}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <CategoryIcon className="h-4 w-4 text-gray-400" />
                          <span>{param.category}</span>
                        </div>
                        <div className="text-xs text-gray-500">{param.measurementType}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm">
                        <div className="font-medium">{param.specification.acceptanceCriteria}</div>
                        {param.unit && (
                          <div className="text-xs text-gray-500">Unit: {param.unit}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm">
                        <div>{param.frequency}</div>
                        {param.sampleSize && (
                          <div className="text-xs text-gray-500">Sample: {param.sampleSize}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {getCriticalityBadge(param.criticality)}
                    </td>
                    <td className="px-3 py-2">
                      {getStatusBadge(param.status)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(param)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(param.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedParameter ? 'Edit Quality Parameter' : 'Add New Quality Parameter'}
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
                      Parameter Code *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedParameter?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="QP-XXX-000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parameter Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedParameter?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter parameter name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      defaultValue={selectedParameter?.category || 'Dimensional'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Dimensional">Dimensional</option>
                      <option value="Visual">Visual</option>
                      <option value="Functional">Functional</option>
                      <option value="Material">Material</option>
                      <option value="Performance">Performance</option>
                      <option value="Environmental">Environmental</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Measurement Type *
                    </label>
                    <select 
                      defaultValue={selectedParameter?.measurementType || 'Variable'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Variable">Variable</option>
                      <option value="Attribute">Attribute</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedParameter?.unit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="mm, HRC, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Criticality *
                    </label>
                    <select 
                      defaultValue={selectedParameter?.criticality || 'Major'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Critical">Critical</option>
                      <option value="Major">Major</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency *
                    </label>
                    <select 
                      defaultValue={selectedParameter?.frequency || 'Sample'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Every Unit">Every Unit</option>
                      <option value="Sample">Sample</option>
                      <option value="First/Last">First/Last</option>
                      <option value="Periodic">Periodic</option>
                      <option value="On Demand">On Demand</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select 
                      defaultValue={selectedParameter?.status || 'Active'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acceptance Criteria *
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedParameter?.specification.acceptanceCriteria}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50.0 ± 0.05 mm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspection Method
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedParameter?.inspectionMethod}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe inspection method"
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
                Save Parameter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
