'use client';

import { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  Settings,
  ChevronRight,
  DollarSign,
  Clock,
  Users,
  FileText,
  CheckCircle,
  Tag,
} from 'lucide-react';

interface ProjectType {
  id: string;
  typeName: string;
  typeCode: string;
  category: 'Manufacturing' | 'Service' | 'Hybrid';
  description: string;
  industry: string;
  defaultDuration: string;
  budgetRange: string;
  requiredApprovals: number;
  defaultWorkflow: string;
  customFields: CustomField[];
  projectCount: number;
  activeProjects: number;
  avgSuccessRate: number;
  totalRevenue: number;
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

interface CustomField {
  fieldName: string;
  fieldType: 'Text' | 'Number' | 'Date' | 'Dropdown' | 'Boolean';
  isMandatory: boolean;
  options?: string[];
}

interface ProjectCategory {
  id: string;
  categoryName: string;
  categoryCode: string;
  description: string;
  parentCategory?: string;
  projectTypes: string[];
  color: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export default function ProjectTypesPage() {
  const [activeTab, setActiveTab] = useState<'types' | 'categories'>('types');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock project types - 8 records
  const mockProjectTypes: ProjectType[] = [
    {
      id: '1',
      typeName: 'Commercial Kitchen - Full Installation',
      typeCode: 'CK-FULL',
      category: 'Manufacturing',
      description: 'Complete commercial kitchen design, manufacturing, installation, and commissioning for hotels, restaurants, and institutional facilities',
      industry: 'Hospitality & F&B',
      defaultDuration: '5-6 months',
      budgetRange: '₹75L - ₹1.5Cr',
      requiredApprovals: 3,
      defaultWorkflow: 'Design → Approval → Procurement → Manufacturing → Installation → Testing → Handover',
      customFields: [
        { fieldName: 'Kitchen Capacity', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Cuisine Type', fieldType: 'Dropdown', isMandatory: true, options: ['Multi-cuisine', 'Indian', 'Continental', 'Chinese', 'Bakery'] },
        { fieldName: 'FSSAI License Number', fieldType: 'Text', isMandatory: true },
        { fieldName: 'Fire NOC Required', fieldType: 'Boolean', isMandatory: true },
        { fieldName: 'Expected Service Date', fieldType: 'Date', isMandatory: true },
      ],
      projectCount: 48,
      activeProjects: 12,
      avgSuccessRate: 92.5,
      totalRevenue: 435000000,
      isActive: true,
      createdDate: '2023-06-15',
      lastModified: '2024-04-20',
    },
    {
      id: '2',
      typeName: 'Commercial Kitchen - Upgrade',
      typeCode: 'CK-UPG',
      category: 'Service',
      description: 'Kitchen equipment upgrade and modernization for existing facilities with minimal downtime',
      industry: 'Hospitality & F&B',
      defaultDuration: '2-3 months',
      budgetRange: '₹30L - ₹75L',
      requiredApprovals: 2,
      defaultWorkflow: 'Assessment → Design → Approval → Procurement → Installation → Testing → Handover',
      customFields: [
        { fieldName: 'Existing Equipment Details', fieldType: 'Text', isMandatory: true },
        { fieldName: 'Downtime Window', fieldType: 'Text', isMandatory: true },
        { fieldName: 'Equipment Disposal Required', fieldType: 'Boolean', isMandatory: false },
      ],
      projectCount: 65,
      activeProjects: 18,
      avgSuccessRate: 94.8,
      totalRevenue: 312000000,
      isActive: true,
      createdDate: '2023-07-20',
      lastModified: '2024-05-10',
    },
    {
      id: '3',
      typeName: 'Cold Room - Standard Installation',
      typeCode: 'CR-STD',
      category: 'Manufacturing',
      description: 'Standard cold room and cold storage installation for warehousing, food processing, and pharmaceutical facilities',
      industry: 'Food Processing & Logistics',
      defaultDuration: '4-5 months',
      budgetRange: '₹90L - ₹2Cr',
      requiredApprovals: 3,
      defaultWorkflow: 'Site Survey → Design → Approval → Civil Work → Panel Installation → Refrigeration → Testing → Commissioning',
      customFields: [
        { fieldName: 'Storage Capacity (MT)', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Temperature Range', fieldType: 'Text', isMandatory: true },
        { fieldName: 'Commodity Type', fieldType: 'Dropdown', isMandatory: true, options: ['Fruits & Vegetables', 'Frozen Food', 'Dairy', 'Pharmaceuticals', 'General'] },
        { fieldName: 'Ambient Temperature', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Power Backup Required', fieldType: 'Boolean', isMandatory: true },
      ],
      projectCount: 38,
      activeProjects: 10,
      avgSuccessRate: 89.5,
      totalRevenue: 528000000,
      isActive: true,
      createdDate: '2023-08-10',
      lastModified: '2024-05-15',
    },
    {
      id: '4',
      typeName: 'Cold Room - Modular (Small Scale)',
      typeCode: 'CR-MOD',
      category: 'Manufacturing',
      description: 'Modular cold room solutions for small businesses, restaurants, and retail outlets',
      industry: 'Retail & F&B',
      defaultDuration: '1-2 months',
      budgetRange: '₹15L - ₹40L',
      requiredApprovals: 1,
      defaultWorkflow: 'Site Survey → Design → Procurement → Installation → Testing → Handover',
      customFields: [
        { fieldName: 'Room Size (sq ft)', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Temperature Requirement', fieldType: 'Text', isMandatory: true },
        { fieldName: 'Installation Location', fieldType: 'Dropdown', isMandatory: true, options: ['Indoor', 'Outdoor', 'Semi-Outdoor'] },
      ],
      projectCount: 82,
      activeProjects: 15,
      avgSuccessRate: 96.3,
      totalRevenue: 185000000,
      isActive: true,
      createdDate: '2023-09-05',
      lastModified: '2024-05-20',
    },
    {
      id: '5',
      typeName: 'Switchgear - Industrial Installation',
      typeCode: 'SG-IND',
      category: 'Manufacturing',
      description: 'Industrial switchgear design, manufacturing, installation, testing, and commissioning for factories and industrial facilities',
      industry: 'Manufacturing & Industrial',
      defaultDuration: '5-7 months',
      budgetRange: '₹1.5Cr - ₹4Cr',
      requiredApprovals: 4,
      defaultWorkflow: 'Design → Engineering → Approval → Manufacturing → FAT → Site Installation → Testing → SAT → Commissioning',
      customFields: [
        { fieldName: 'Voltage Level', fieldType: 'Dropdown', isMandatory: true, options: ['LT (up to 1kV)', 'HT (11kV)', 'HT (33kV)', 'EHT (66kV+)'] },
        { fieldName: 'Rated Current', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Panel Type', fieldType: 'Dropdown', isMandatory: true, options: ['Fixed', 'Withdrawable', 'Fixed with Isolators'] },
        { fieldName: 'Busbar Material', fieldType: 'Dropdown', isMandatory: true, options: ['Copper', 'Aluminum'] },
        { fieldName: 'Certification Required', fieldType: 'Text', isMandatory: true },
      ],
      projectCount: 28,
      activeProjects: 8,
      avgSuccessRate: 91.2,
      totalRevenue: 682000000,
      isActive: true,
      createdDate: '2023-08-25',
      lastModified: '2024-05-05',
    },
    {
      id: '6',
      typeName: 'Switchgear - Maintenance & Upgrade',
      typeCode: 'SG-MNT',
      category: 'Service',
      description: 'Switchgear maintenance, testing, retrofitting, and selective upgrades',
      industry: 'Manufacturing & Industrial',
      defaultDuration: '2-3 months',
      budgetRange: '₹40L - ₹1Cr',
      requiredApprovals: 2,
      defaultWorkflow: 'Assessment → Testing → Report → Approval → Execution → Validation → Certification',
      customFields: [
        { fieldName: 'Installation Year', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Last Service Date', fieldType: 'Date', isMandatory: false },
        { fieldName: 'Issues Reported', fieldType: 'Text', isMandatory: true },
        { fieldName: 'Shutdown Window Available', fieldType: 'Text', isMandatory: true },
      ],
      projectCount: 42,
      activeProjects: 11,
      avgSuccessRate: 97.1,
      totalRevenue: 258000000,
      isActive: true,
      createdDate: '2023-10-10',
      lastModified: '2024-05-12',
    },
    {
      id: '7',
      typeName: 'Central Kitchen - Large Scale',
      typeCode: 'CK-CENT',
      category: 'Hybrid',
      description: 'Large-scale central kitchen for cloud kitchens, catering companies, and institutional facilities',
      industry: 'Cloud Kitchen & Catering',
      defaultDuration: '8-10 months',
      budgetRange: '₹2Cr - ₹6Cr',
      requiredApprovals: 4,
      defaultWorkflow: 'Concept → Design → Approval → Civil Work → MEP → Equipment → Installation → Testing → FSSAI → Commissioning',
      customFields: [
        { fieldName: 'Meal Capacity (per day)', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Number of Brands/Kitchens', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Automation Level', fieldType: 'Dropdown', isMandatory: true, options: ['Manual', 'Semi-Automated', 'Fully Automated'] },
        { fieldName: 'Delivery Integration Required', fieldType: 'Boolean', isMandatory: true },
      ],
      projectCount: 12,
      activeProjects: 4,
      avgSuccessRate: 87.5,
      totalRevenue: 385000000,
      isActive: true,
      createdDate: '2023-11-15',
      lastModified: '2024-04-25',
    },
    {
      id: '8',
      typeName: 'Blast Freezer Installation',
      typeCode: 'BF-INS',
      category: 'Manufacturing',
      description: 'Blast freezer installation for seafood processing, ice cream manufacturing, and quick freezing applications',
      industry: 'Food Processing',
      defaultDuration: '4-5 months',
      budgetRange: '₹1Cr - ₹2.5Cr',
      requiredApprovals: 3,
      defaultWorkflow: 'Design → Thermal Calculation → Approval → Civil Work → Installation → Refrigeration → Testing → Commissioning',
      customFields: [
        { fieldName: 'Freezing Capacity (kg/hr)', fieldType: 'Number', isMandatory: true },
        { fieldName: 'Target Temperature', fieldType: 'Text', isMandatory: true },
        { fieldName: 'Product Type', fieldType: 'Dropdown', isMandatory: true, options: ['Seafood', 'Meat', 'Bakery', 'Ice Cream', 'General'] },
        { fieldName: 'Freezing Time Required', fieldType: 'Text', isMandatory: true },
      ],
      projectCount: 15,
      activeProjects: 3,
      avgSuccessRate: 93.8,
      totalRevenue: 225000000,
      isActive: true,
      createdDate: '2023-12-01',
      lastModified: '2024-05-08',
    },
  ];

  // Mock project categories - 6 records
  const mockCategories: ProjectCategory[] = [
    {
      id: '1',
      categoryName: 'Commercial Kitchen Solutions',
      categoryCode: 'CK',
      description: 'Kitchen design, manufacturing, installation, and support services',
      projectTypes: ['CK-FULL', 'CK-UPG', 'CK-CENT'],
      color: '#3B82F6',
      icon: 'UtensilsCrossed',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: '2',
      categoryName: 'Cold Storage & Refrigeration',
      categoryCode: 'CR',
      description: 'Cold room, blast freezer, and refrigeration solutions',
      projectTypes: ['CR-STD', 'CR-MOD', 'BF-INS'],
      color: '#06B6D4',
      icon: 'Snowflake',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: '3',
      categoryName: 'Electrical & Switchgear',
      categoryCode: 'SG',
      description: 'Switchgear manufacturing, installation, and maintenance',
      projectTypes: ['SG-IND', 'SG-MNT'],
      color: '#F59E0B',
      icon: 'Zap',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: '4',
      categoryName: 'Installation Services',
      categoryCode: 'INS',
      description: 'On-site installation and commissioning services',
      parentCategory: 'Service Delivery',
      projectTypes: ['CK-FULL', 'CR-STD', 'SG-IND'],
      color: '#10B981',
      icon: 'Settings',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: '5',
      categoryName: 'Maintenance & Support',
      categoryCode: 'MNT',
      description: 'Ongoing maintenance, upgrades, and technical support',
      parentCategory: 'Service Delivery',
      projectTypes: ['CK-UPG', 'SG-MNT'],
      color: '#8B5CF6',
      icon: 'Wrench',
      sortOrder: 5,
      isActive: true,
    },
    {
      id: '6',
      categoryName: 'Custom Solutions',
      categoryCode: 'CUST',
      description: 'Tailored solutions for unique customer requirements',
      projectTypes: ['CK-CENT', 'BF-INS'],
      color: '#EC4899',
      icon: 'Sparkles',
      sortOrder: 6,
      isActive: true,
    },
  ];

  const filteredTypes = mockProjectTypes.filter((type) => {
    const matchesSearch =
      type.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.typeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || type.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredCategories = mockCategories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.categoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Manufacturing':
        return 'text-blue-600 bg-blue-50';
      case 'Service':
        return 'text-green-600 bg-green-50';
      case 'Hybrid':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Types & Categories</h1>
            <p className="text-gray-600 mt-1">Define and manage project types with custom workflows and fields</p>
          </div>
          <button
            onClick={() => activeTab === 'types' ? setShowCreateTypeModal(true) : setShowCreateCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'types' ? 'Create Project Type' : 'Create Category'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Project Types</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockProjectTypes.length}</p>
                <p className="text-xs text-green-600 mt-1">{mockProjectTypes.filter(t => t.isActive).length} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockCategories.length}</p>
                <p className="text-xs text-green-600 mt-1">{mockCategories.filter(c => c.isActive).length} active</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockProjectTypes.reduce((sum, t) => sum + t.projectCount, 0)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {mockProjectTypes.reduce((sum, t) => sum + t.activeProjects, 0)} active
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{(mockProjectTypes.reduce((sum, t) => sum + t.totalRevenue, 0) / 10000000).toFixed(0)}Cr
                </p>
                <p className="text-xs text-green-600 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('types')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'types'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Project Types ({mockProjectTypes.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'categories'
              ? 'text-cyan-600 border-b-2 border-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Categories ({mockCategories.length})
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'types' ? 'project types' : 'categories'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          {activeTab === 'types' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Service">Service</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          )}
        </div>
      </div>

      {/* Project Types Tab */}
      {activeTab === 'types' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTypes.map((type) => (
            <div key={type.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{type.typeName}</h3>
                    <span className="text-xs font-mono text-gray-500">{type.typeCode}</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(type.category)}`}>
                    {type.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedType(type);
                      setShowDetailModal(true);
                    }}
                    className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{type.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Industry</p>
                  <p className="text-sm font-medium text-gray-900">{type.industry}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Duration</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {type.defaultDuration}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 mb-1">Budget Range</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> {type.budgetRange}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{type.projectCount}</p>
                  <p className="text-xs text-gray-600">Total Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{type.activeProjects}</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{type.avgSuccessRate}%</p>
                  <p className="text-xs text-gray-600">Success Rate</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-medium text-gray-900">₹{(type.totalRevenue / 10000000).toFixed(1)}Cr</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Custom Fields:</span>
                  <span className="font-medium text-gray-900">{type.customFields.length} fields</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              style={{ borderTopColor: category.color, borderTopWidth: '4px' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.categoryName}</h3>
                  <span className="text-xs font-mono text-gray-500">{category.categoryCode}</span>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{category.description}</p>

              {category.parentCategory && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <ChevronRight className="w-4 h-4" />
                  <span>Parent: {category.parentCategory}</span>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 mb-2">Linked Project Types:</p>
                <div className="flex flex-wrap gap-1">
                  {category.projectTypes.map((typeCode, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white border border-gray-200 text-gray-700">
                      {typeCode}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sort Order:</span>
                <span className="font-medium text-gray-900">{category.sortOrder}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Type Detail Modal */}
      {showDetailModal && selectedType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedType.typeName}</h2>
                  <p className="text-gray-600 mt-1">{selectedType.typeCode}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedType(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Workflow */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Default Workflow</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedType.defaultWorkflow}</p>
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Fields</h3>
                <div className="space-y-2">
                  {selectedType.customFields.map((field, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{field.fieldName}</p>
                          {field.isMandatory && (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">Required</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Type: {field.fieldType}</p>
                        {field.options && (
                          <p className="text-xs text-gray-500 mt-1">Options: {field.options.join(', ')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-600">{selectedType.projectCount}</p>
                    <p className="text-xs text-gray-600">Total Projects</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-600">{selectedType.activeProjects}</p>
                    <p className="text-xs text-gray-600">Active Now</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-purple-600">{selectedType.avgSuccessRate}%</p>
                    <p className="text-xs text-gray-600">Success Rate</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <p className="text-xl font-bold text-cyan-600">₹{(selectedType.totalRevenue / 10000000).toFixed(1)}Cr</p>
                    <p className="text-xs text-gray-600">Total Revenue</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedType(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                Edit Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Type Modal */}
      {showCreateTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create Project Type</h2>
              <p className="text-gray-600 mt-1">Define a new project type with custom settings</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type Name</label>
                <input
                  type="text"
                  placeholder="Enter project type name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type Code</label>
                  <input
                    type="text"
                    placeholder="e.g., CK-FULL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option>Manufacturing</option>
                    <option>Service</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the project type..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateTypeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                Create Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create Category</h2>
              <p className="text-gray-600 mt-1">Define a new project category</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Code</label>
                  <input
                    type="text"
                    placeholder="e.g., CK"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="color"
                    className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the category..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateCategoryModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
