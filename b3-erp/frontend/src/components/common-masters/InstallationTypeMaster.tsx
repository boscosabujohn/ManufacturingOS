'use client';

import React, { useState, useMemo } from 'react';
import {
  Hammer, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Clock, Users, DollarSign, Wrench
} from 'lucide-react';

interface InstallationType {
  id: string;
  code: string;
  name: string;
  category: 'Wall-mounted' | 'Floor-standing' | 'Built-in' | 'Modular' | 'Island' | 'Under-counter';
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Highly Complex';
  requirements: {
    laborHours: number;
    skillLevel: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
    teamSize: number;
    specialTools: string[];
  };
  prerequisites: string[];
  steps: string[];
  materials: string[];
  suitableFor: string[];
  estimatedCost: {
    min: number;
    max: number;
  };
  duration: {
    value: number;
    unit: string;
  };
  warranty: string;
  safetyRequirements: string[];
  certifications: string[];
  status: 'Active' | 'Inactive' | 'Under Review';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

const mockInstallationTypes: InstallationType[] = [
  {
    id: '1',
    code: 'INST-WALL-001',
    name: 'Wall-mounted Cabinet Installation',
    category: 'Wall-mounted',
    complexity: 'Moderate',
    requirements: {
      laborHours: 4,
      skillLevel: 'Intermediate',
      teamSize: 2,
      specialTools: ['Level', 'Drill', 'Stud Finder', 'Wall Brackets']
    },
    prerequisites: [
      'Wall structural integrity checked',
      'Water lines and electrical identified',
      'Cabinet dimensions verified',
      'Wall surface prepared and leveled'
    ],
    steps: [
      'Mark cabinet position on wall',
      'Locate wall studs',
      'Install mounting rail/brackets',
      'Hang cabinet on mounting system',
      'Level and secure cabinet',
      'Install adjacent cabinets',
      'Connect filler strips'
    ],
    materials: ['Wall brackets', 'Screws', 'Wall plugs', 'Filler strips', 'Shims'],
    suitableFor: ['Kitchen Wall Cabinets', 'Bathroom Cabinets', 'Storage Units'],
    estimatedCost: {
      min: 1500,
      max: 3000
    },
    duration: {
      value: 4,
      unit: 'hours per unit'
    },
    warranty: '1 Year on installation',
    safetyRequirements: [
      'Use appropriate safety gear',
      'Ensure proper ventilation',
      'Check for electrical wires',
      'Use certified tools'
    ],
    certifications: ['Installation Safety Training', 'Carpentry Certification'],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'Installation Manager'
    }
  },
  {
    id: '2',
    code: 'INST-BASE-001',
    name: 'Floor-standing Base Cabinet Installation',
    category: 'Floor-standing',
    complexity: 'Simple',
    requirements: {
      laborHours: 3,
      skillLevel: 'Basic',
      teamSize: 2,
      specialTools: ['Level', 'Shims', 'Screwdriver', 'Measuring Tape']
    },
    prerequisites: [
      'Floor leveled and cleaned',
      'Plumbing rough-in completed',
      'Electrical outlets positioned',
      'Cabinet dimensions verified'
    ],
    steps: [
      'Mark cabinet layout on floor',
      'Install corner cabinet first',
      'Level cabinet using shims',
      'Secure to floor and wall',
      'Install adjacent cabinets',
      'Connect cabinets together',
      'Install toe kick'
    ],
    materials: ['Shims', 'Screws', 'Toe kick boards', 'Connecting bolts'],
    suitableFor: ['Kitchen Base Cabinets', 'Vanity Units', 'Storage Cabinets'],
    estimatedCost: {
      min: 1000,
      max: 2500
    },
    duration: {
      value: 3,
      unit: 'hours per unit'
    },
    warranty: '1 Year on installation',
    safetyRequirements: [
      'Wear safety shoes',
      'Use proper lifting techniques',
      'Keep work area clear'
    ],
    certifications: ['Basic Installation Training'],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-03-10'),
      createdBy: 'Installation Manager'
    }
  },
  {
    id: '3',
    code: 'INST-BUILT-001',
    name: 'Built-in Appliance Integration',
    category: 'Built-in',
    complexity: 'Complex',
    requirements: {
      laborHours: 6,
      skillLevel: 'Advanced',
      teamSize: 3,
      specialTools: ['Router', 'Jigsaw', 'Template', 'Clamps', 'Electrical Tester']
    },
    prerequisites: [
      'Appliance specifications confirmed',
      'Cabinet cutouts precise',
      'Electrical connections ready',
      'Ventilation planned',
      'Support structure verified'
    ],
    steps: [
      'Verify appliance dimensions',
      'Mark cutout on cabinet',
      'Cut opening for appliance',
      'Install support brackets',
      'Test fit appliance',
      'Secure appliance in place',
      'Connect electrical/plumbing',
      'Seal gaps and edges',
      'Test appliance operation'
    ],
    materials: ['Mounting brackets', 'Trim strips', 'Sealant', 'Electrical connectors'],
    suitableFor: ['Ovens', 'Dishwashers', 'Refrigerators', 'Microwaves', 'Cooktops'],
    estimatedCost: {
      min: 3000,
      max: 6000
    },
    duration: {
      value: 6,
      unit: 'hours per appliance'
    },
    warranty: '2 Years on installation',
    safetyRequirements: [
      'Certified electrician required',
      'Gas line work by licensed plumber',
      'Disconnect power before work',
      'Follow manufacturer guidelines'
    ],
    certifications: [
      'Electrical Installation License',
      'Appliance Installation Certification',
      'Safety Training'
    ],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      createdBy: 'Installation Manager'
    }
  }
];

export default function InstallationTypeMaster() {
  const [installationTypes, setInstallationTypes] = useState<InstallationType[]>(mockInstallationTypes);
  const [selectedType, setSelectedType] = useState<InstallationType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterComplexity, setFilterComplexity] = useState<string>('All');

  const handleEdit = (type: InstallationType) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this installation type?')) {
      setInstallationTypes(installationTypes.filter(t => t.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Under Review': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock }
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

  const getComplexityBadge = (complexity: string) => {
    const complexityConfig = {
      'Simple': 'bg-green-100 text-green-800',
      'Moderate': 'bg-blue-100 text-blue-800',
      'Complex': 'bg-orange-100 text-orange-800',
      'Highly Complex': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${complexityConfig[complexity as keyof typeof complexityConfig]}`}>
        {complexity}
      </span>
    );
  };

  const filteredTypes = useMemo(() => {
    return installationTypes.filter(type => {
      const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           type.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           type.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesComplexity = filterComplexity === 'All' || type.complexity === filterComplexity;
      return matchesSearch && matchesComplexity;
    });
  }, [installationTypes, searchTerm, filterComplexity]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Installation Type Master</h2>
        <p className="text-gray-600">Manage installation methods, requirements, and labor specifications</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search installation types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterComplexity}
                onChange={(e) => setFilterComplexity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Complexity</option>
                <option value="Simple">Simple</option>
                <option value="Moderate">Moderate</option>
                <option value="Complex">Complex</option>
                <option value="Highly Complex">Highly Complex</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedType(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Installation Type
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installation Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Complexity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requirements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration & Cost
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
              {filteredTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1 text-sm mb-1">
                        <Hammer className="h-4 w-4 text-gray-400" />
                        <span>{type.category}</span>
                      </div>
                      {getComplexityBadge(type.complexity)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>{type.requirements.laborHours} hrs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span>{type.requirements.teamSize} person(s)</span>
                      </div>
                      <div className="text-gray-500">{type.requirements.skillLevel}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span>{type.duration.value} {type.duration.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-medium mt-1">
                        <DollarSign className="h-3 w-3" />
                        ₹{type.estimatedCost.min} - ₹{type.estimatedCost.max}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(type.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(type)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
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
                {selectedType ? 'Edit Installation Type' : 'Add New Installation Type'}
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
                      defaultValue={selectedType?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="INST-XXX-XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedType?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Installation type name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      defaultValue={selectedType?.category || 'Floor-standing'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Wall-mounted">Wall-mounted</option>
                      <option value="Floor-standing">Floor-standing</option>
                      <option value="Built-in">Built-in</option>
                      <option value="Modular">Modular</option>
                      <option value="Island">Island</option>
                      <option value="Under-counter">Under-counter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complexity *
                    </label>
                    <select 
                      defaultValue={selectedType?.complexity || 'Moderate'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Simple">Simple</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Complex">Complex</option>
                      <option value="Highly Complex">Highly Complex</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Labor Hours *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedType?.requirements.laborHours}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Size *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedType?.requirements.teamSize}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Level *
                    </label>
                    <select 
                      defaultValue={selectedType?.requirements.skillLevel || 'Intermediate'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Cost (₹) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedType?.estimatedCost.min}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Cost (₹) *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedType?.estimatedCost.max}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select 
                    defaultValue={selectedType?.status || 'Active'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Under Review">Under Review</option>
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
                Save Installation Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
