'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Building2, Users, Phone, Mail, ChevronRight, ChevronDown, Download, Upload, Grid, List, UserCheck } from 'lucide-react';

interface Department {
  id: string;
  departmentCode: string;
  departmentName: string;
  parentId?: string;
  level: number;
  departmentType: 'operational' | 'administrative' | 'support' | 'production' | 'service';
  status: 'active' | 'inactive';
  description: string;
  headOfDepartment: string;
  costCenter: string;
  budgetAllocated: number;
  actualSpent: number;
  location: string;
  contact: {
    phone: string;
    email: string;
    extension: string;
  };
  employeeInfo: {
    totalEmployees: number;
    managers: number;
    staff: number;
    contractors: number;
  };
  operationalMetrics: {
    productivity: number;
    efficiency: number;
    qualityScore: number;
    targetAchievement: number;
  };
  responsibilities: string[];
  reportingStructure: {
    reportsTo?: string;
    collaboratesWith: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const mockDepartments: Department[] = [
  {
    id: '1',
    departmentCode: 'DEPT-OPS',
    departmentName: 'Operations',
    level: 1,
    departmentType: 'operational',
    status: 'active',
    description: 'Manages day-to-day business operations and process optimization',
    headOfDepartment: 'John Smith',
    costCenter: 'CC-001',
    budgetAllocated: 1500000,
    actualSpent: 1250000,
    location: 'Head Office - Floor 3',
    contact: {
      phone: '+1-555-100-2001',
      email: 'operations@company.com',
      extension: '2001'
    },
    employeeInfo: {
      totalEmployees: 45,
      managers: 5,
      staff: 35,
      contractors: 5
    },
    operationalMetrics: {
      productivity: 92,
      efficiency: 88,
      qualityScore: 95,
      targetAchievement: 94
    },
    responsibilities: [
      'Process optimization',
      'Quality control',
      'Supply chain management',
      'Production planning'
    ],
    reportingStructure: {
      collaboratesWith: ['Manufacturing', 'Quality', 'Logistics']
    },
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    departmentCode: 'DEPT-MFG',
    departmentName: 'Manufacturing',
    parentId: '1',
    level: 2,
    departmentType: 'production',
    status: 'active',
    description: 'Handles all manufacturing and production activities',
    headOfDepartment: 'Robert Chen',
    costCenter: 'CC-002',
    budgetAllocated: 2500000,
    actualSpent: 2300000,
    location: 'Manufacturing Plant',
    contact: {
      phone: '+1-555-100-3001',
      email: 'manufacturing@company.com',
      extension: '3001'
    },
    employeeInfo: {
      totalEmployees: 120,
      managers: 10,
      staff: 95,
      contractors: 15
    },
    operationalMetrics: {
      productivity: 85,
      efficiency: 82,
      qualityScore: 90,
      targetAchievement: 88
    },
    responsibilities: [
      'Production planning',
      'Equipment maintenance',
      'Quality assurance',
      'Safety compliance'
    ],
    reportingStructure: {
      reportsTo: 'Operations',
      collaboratesWith: ['Quality', 'Maintenance', 'Warehouse']
    },
    createdAt: '2023-01-01',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    departmentCode: 'DEPT-HR',
    departmentName: 'Human Resources',
    level: 1,
    departmentType: 'administrative',
    status: 'active',
    description: 'Manages employee relations, recruitment, and organizational development',
    headOfDepartment: 'Sarah Williams',
    costCenter: 'CC-003',
    budgetAllocated: 500000,
    actualSpent: 450000,
    location: 'Head Office - Floor 2',
    contact: {
      phone: '+1-555-100-4001',
      email: 'hr@company.com',
      extension: '4001'
    },
    employeeInfo: {
      totalEmployees: 12,
      managers: 2,
      staff: 10,
      contractors: 0
    },
    operationalMetrics: {
      productivity: 95,
      efficiency: 92,
      qualityScore: 96,
      targetAchievement: 97
    },
    responsibilities: [
      'Recruitment and hiring',
      'Employee relations',
      'Training and development',
      'Compensation and benefits'
    ],
    reportingStructure: {
      collaboratesWith: ['Finance', 'Legal', 'All Departments']
    },
    createdAt: '2023-01-01',
    updatedAt: '2024-01-10'
  }
];

const departmentTypes = ['operational', 'administrative', 'support', 'production', 'service'];
const locations = ['Head Office - Floor 1', 'Head Office - Floor 2', 'Head Office - Floor 3', 'Manufacturing Plant', 'Warehouse', 'Branch Office'];

export default function DepartmentMaster() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1']));
  const [activeTab, setActiveTab] = useState('basic');

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = department.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.departmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || department.departmentType === filterType;
    const matchesStatus = filterStatus === 'all' || department.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const buildDepartmentTree = (departments: Department[]): Department[] => {
    return departments.filter(dept => !dept.parentId);
  };

  const getChildDepartments = (parentId: string): Department[] => {
    return departments.filter(dept => dept.parentId === parentId);
  };

  const toggleExpanded = (departmentId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(departmentId)) {
      newExpanded.delete(departmentId);
    } else {
      newExpanded.add(departmentId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleAddDepartment = (parentId?: string) => {
    const parentDepartment = parentId ? departments.find(d => d.id === parentId) : null;
    setEditingDepartment({
      id: '',
      departmentCode: '',
      departmentName: '',
      parentId: parentId,
      level: parentDepartment ? parentDepartment.level + 1 : 1,
      departmentType: 'operational',
      status: 'active',
      description: '',
      headOfDepartment: '',
      costCenter: '',
      budgetAllocated: 0,
      actualSpent: 0,
      location: '',
      contact: {
        phone: '',
        email: '',
        extension: ''
      },
      employeeInfo: {
        totalEmployees: 0,
        managers: 0,
        staff: 0,
        contractors: 0
      },
      operationalMetrics: {
        productivity: 0,
        efficiency: 0,
        qualityScore: 0,
        targetAchievement: 0
      },
      responsibilities: [],
      reportingStructure: {
        reportsTo: parentDepartment?.departmentName,
        collaboratesWith: []
      },
      createdAt: '',
      updatedAt: ''
    } as Department);
    setShowModal(true);
    setActiveTab('basic');
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setShowModal(true);
    setActiveTab('basic');
  };

  const handleDeleteDepartment = (id: string) => {
    const hasChildren = departments.some(dept => dept.parentId === id);
    if (hasChildren) {
      alert('Cannot delete department with sub-departments. Please delete sub-departments first.');
      return;
    }
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(department => department.id !== id));
    }
  };

  const handleSaveDepartment = (departmentData: any) => {
    if (editingDepartment?.id) {
      setDepartments(departments.map(department =>
        department.id === editingDepartment.id
          ? { ...department, ...departmentData, updatedAt: new Date().toISOString().split('T')[0] }
          : department
      ));
    } else {
      const newDepartment: Department = {
        id: Date.now().toString(),
        ...departmentData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setDepartments([...departments, newDepartment]);
    }
    setShowModal(false);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      operational: 'bg-blue-100 text-blue-800',
      administrative: 'bg-purple-100 text-purple-800',
      support: 'bg-yellow-100 text-yellow-800',
      production: 'bg-green-100 text-green-800',
      service: 'bg-orange-100 text-orange-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`;
  };

  const renderTreeNode = (department: Department, depth = 0): React.ReactNode => {
    const children = getChildDepartments(department.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(department.id);
    const paddingLeft = depth * 24;

    return (
      <div key={department.id}>
        <div
          className="flex items-center py-3 px-4 hover:bg-gray-50 border-b border-gray-100"
          style={{ paddingLeft: `${paddingLeft + 16}px` }}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(department.id)}
                className="mr-2 p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-6 mr-2" />
            )}

            <Building2 className="w-5 h-5 mr-3 text-blue-500" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{department.departmentName}</span>
                <span className="text-sm text-gray-500">({department.departmentCode})</span>
                <span className={getStatusBadge(department.status)}>
                  {department.status}
                </span>
                <span className={getTypeBadge(department.departmentType)}>
                  {department.departmentType}
                </span>
              </div>
              <div className="text-sm text-gray-600">Head: {department.headOfDepartment}</div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="text-sm text-gray-600">
                <Users className="w-4 h-4 inline mr-1" />
                {department.employeeInfo.totalEmployees} employees
              </div>
              <div className="text-sm text-gray-600">
                Budget: ${department.budgetAllocated.toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddDepartment(department.id)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Add Sub-department"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditDepartment(department)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteDepartment(department.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              Department Master
            </h1>
            <p className="text-gray-600">Manage organizational departments and structure</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => handleAddDepartment()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-4 py-2 ${viewMode === 'tree' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Tree View
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                List View
              </div>
            </button>
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {departmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        )}
      </div>

      {viewMode === 'tree' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Department Hierarchy</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpandedNodes(new Set(departments.map(d => d.id)))}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setExpandedNodes(new Set())}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {buildDepartmentTree(filteredDepartments).map(department => renderTreeNode(department))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head & Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDepartments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{department.departmentName}</div>
                        <div className="text-sm text-gray-500">{department.departmentCode}</div>
                        <span className={getTypeBadge(department.departmentType)}>
                          {department.departmentType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{department.headOfDepartment}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {department.contact.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Ext: {department.contact.extension}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Total: {department.employeeInfo.totalEmployees}</div>
                      <div className="text-sm text-gray-500">Managers: {department.employeeInfo.managers}</div>
                      <div className="text-sm text-gray-500">Staff: {department.employeeInfo.staff}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${department.budgetAllocated.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Spent: ${department.actualSpent.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((department.actualSpent / department.budgetAllocated) * 100)}% utilized
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Productivity: {department.operationalMetrics.productivity}%</div>
                      <div className="text-sm text-gray-500">Efficiency: {department.operationalMetrics.efficiency}%</div>
                      <div className="text-sm text-gray-500">Quality: {department.operationalMetrics.qualityScore}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(department.status)}>
                        {department.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditDepartment(department)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">Edit</span>
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <Eye className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">View</span>
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <DepartmentModal
          department={editingDepartment}
          departments={departments}
          onSave={handleSaveDepartment}
          onClose={() => setShowModal(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

interface DepartmentModalProps {
  department: Department | null;
  departments: Department[];
  onSave: (department: any) => void;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function DepartmentModal({ department, departments, onSave, onClose, activeTab, setActiveTab }: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    departmentCode: department?.departmentCode || '',
    departmentName: department?.departmentName || '',
    parentId: department?.parentId || '',
    level: department?.level || 1,
    departmentType: department?.departmentType || 'operational',
    status: department?.status || 'active',
    description: department?.description || '',
    headOfDepartment: department?.headOfDepartment || '',
    costCenter: department?.costCenter || '',
    budgetAllocated: department?.budgetAllocated || 0,
    actualSpent: department?.actualSpent || 0,
    location: department?.location || '',
    contact: department?.contact || {
      phone: '',
      email: '',
      extension: ''
    },
    employeeInfo: department?.employeeInfo || {
      totalEmployees: 0,
      managers: 0,
      staff: 0,
      contractors: 0
    },
    operationalMetrics: department?.operationalMetrics || {
      productivity: 0,
      efficiency: 0,
      qualityScore: 0,
      targetAchievement: 0
    },
    responsibilities: department?.responsibilities || [],
    reportingStructure: department?.reportingStructure || {
      reportsTo: '',
      collaboratesWith: []
    }
  });

  const [newResponsibility, setNewResponsibility] = useState('');
  const [newCollaborator, setNewCollaborator] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addResponsibility = () => {
    if (newResponsibility) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, newResponsibility]
      });
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((_, i) => i !== index)
    });
  };

  const addCollaborator = () => {
    if (newCollaborator) {
      setFormData({
        ...formData,
        reportingStructure: {
          ...formData.reportingStructure,
          collaboratesWith: [...formData.reportingStructure.collaboratesWith, newCollaborator]
        }
      });
      setNewCollaborator('');
    }
  };

  const removeCollaborator = (index: number) => {
    setFormData({
      ...formData,
      reportingStructure: {
        ...formData.reportingStructure,
        collaboratesWith: formData.reportingStructure.collaboratesWith.filter((_, i) => i !== index)
      }
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'metrics', label: 'Metrics', icon: UserCheck }
  ];

  const availableParents = departments.filter(dept =>
    dept.id !== department?.id && dept.level < 3
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {department?.id ? 'Edit Department' : 'Add New Department'}
          </h2>
        </div>

        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-96">
          <div className="px-6 py-4">
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                  <input
                    type="text"
                    value={formData.departmentCode}
                    onChange={(e) => setFormData({...formData, departmentCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                  <input
                    type="text"
                    value={formData.departmentName}
                    onChange={(e) => setFormData({...formData, departmentName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Department</label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None (Top Level)</option>
                    {availableParents.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Type</label>
                  <select
                    value={formData.departmentType}
                    onChange={(e) => setFormData({...formData, departmentType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {departmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Head of Department</label>
                  <input
                    type="text"
                    value={formData.headOfDepartment}
                    onChange={(e) => setFormData({...formData, headOfDepartment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
                  <input
                    type="text"
                    value={formData.costCenter}
                    onChange={(e) => setFormData({...formData, costCenter: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                  <div className="space-y-2 mb-2">
                    {formData.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1">{resp}</span>
                        <button
                          type="button"
                          onClick={() => removeResponsibility(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="Add responsibility"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addResponsibility}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extension</label>
                  <input
                    type="text"
                    value={formData.contact.extension}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, extension: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reports To</label>
                  <input
                    type="text"
                    value={formData.reportingStructure.reportsTo}
                    onChange={(e) => setFormData({...formData, reportingStructure: {...formData.reportingStructure, reportsTo: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Collaborates With</label>
                  <div className="space-y-2 mb-2">
                    {formData.reportingStructure.collaboratesWith.map((dept, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1">{dept}</span>
                        <button
                          type="button"
                          onClick={() => removeCollaborator(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCollaborator}
                      onChange={(e) => setNewCollaborator(e.target.value)}
                      placeholder="Add collaborating department"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addCollaborator}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Employees</label>
                  <input
                    type="number"
                    value={formData.employeeInfo.totalEmployees}
                    onChange={(e) => setFormData({...formData, employeeInfo: {...formData.employeeInfo, totalEmployees: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Managers</label>
                  <input
                    type="number"
                    value={formData.employeeInfo.managers}
                    onChange={(e) => setFormData({...formData, employeeInfo: {...formData.employeeInfo, managers: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff</label>
                  <input
                    type="number"
                    value={formData.employeeInfo.staff}
                    onChange={(e) => setFormData({...formData, employeeInfo: {...formData.employeeInfo, staff: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contractors</label>
                  <input
                    type="number"
                    value={formData.employeeInfo.contractors}
                    onChange={(e) => setFormData({...formData, employeeInfo: {...formData.employeeInfo, contractors: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Allocated</label>
                  <input
                    type="number"
                    value={formData.budgetAllocated}
                    onChange={(e) => setFormData({...formData, budgetAllocated: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Spent</label>
                  <input
                    type="number"
                    value={formData.actualSpent}
                    onChange={(e) => setFormData({...formData, actualSpent: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Productivity (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.operationalMetrics.productivity}
                    onChange={(e) => setFormData({...formData, operationalMetrics: {...formData.operationalMetrics, productivity: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Efficiency (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.operationalMetrics.efficiency}
                    onChange={(e) => setFormData({...formData, operationalMetrics: {...formData.operationalMetrics, efficiency: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.operationalMetrics.qualityScore}
                    onChange={(e) => setFormData({...formData, operationalMetrics: {...formData.operationalMetrics, qualityScore: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Achievement (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.operationalMetrics.targetAchievement}
                    onChange={(e) => setFormData({...formData, operationalMetrics: {...formData.operationalMetrics, targetAchievement: Number(e.target.value)}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {department?.id ? 'Update Department' : 'Create Department'}
          </button>
        </div>
      </div>
    </div>
  );
}