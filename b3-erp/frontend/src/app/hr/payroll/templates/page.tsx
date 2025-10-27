'use client';

import { useState, useMemo } from 'react';
import { FileText, Plus, Search, Edit, Copy, Trash2, CheckCircle, Users } from 'lucide-react';

interface SalaryComponent {
  componentCode: string;
  componentName: string;
  type: 'earning' | 'deduction';
  calculationType: 'flat' | 'percentage';
  value: number;
  baseComponent?: string;
}

interface SalaryTemplate {
  id: string;
  templateCode: string;
  templateName: string;
  grade: string;
  employmentType: 'permanent' | 'contract' | 'temporary';
  ctcRange: string;
  components: SalaryComponent[];
  assignedCount: number;
  status: 'active' | 'inactive';
  createdBy: string;
  createdOn: string;
}

export default function PayrollTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const mockTemplates: SalaryTemplate[] = [
    {
      id: '1',
      templateCode: 'TPL-MFG-A',
      templateName: 'Manufacturing - Grade A',
      grade: 'A',
      employmentType: 'permanent',
      ctcRange: '₹6-8L',
      components: [
        { componentCode: 'BASIC', componentName: 'Basic Salary', type: 'earning', calculationType: 'percentage', value: 50, baseComponent: 'CTC' },
        { componentCode: 'HRA', componentName: 'HRA', type: 'earning', calculationType: 'percentage', value: 40, baseComponent: 'BASIC' },
        { componentCode: 'DA', componentName: 'DA', type: 'earning', calculationType: 'percentage', value: 10, baseComponent: 'BASIC' },
        { componentCode: 'CONV', componentName: 'Conveyance', type: 'earning', calculationType: 'flat', value: 1600 },
        { componentCode: 'MED', componentName: 'Medical', type: 'earning', calculationType: 'flat', value: 1250 },
        { componentCode: 'PF_EMP', componentName: 'PF (Employee)', type: 'deduction', calculationType: 'percentage', value: 12, baseComponent: 'BASIC' },
        { componentCode: 'ESI_EMP', componentName: 'ESI (Employee)', type: 'deduction', calculationType: 'percentage', value: 0.75, baseComponent: 'GROSS' },
        { componentCode: 'PT', componentName: 'Professional Tax', type: 'deduction', calculationType: 'flat', value: 200 }
      ],
      assignedCount: 45,
      status: 'active',
      createdBy: 'HR Admin',
      createdOn: '2025-01-15'
    },
    {
      id: '2',
      templateCode: 'TPL-MFG-B',
      templateName: 'Manufacturing - Grade B',
      grade: 'B',
      employmentType: 'permanent',
      ctcRange: '₹4-6L',
      components: [
        { componentCode: 'BASIC', componentName: 'Basic Salary', type: 'earning', calculationType: 'percentage', value: 50, baseComponent: 'CTC' },
        { componentCode: 'HRA', componentName: 'HRA', type: 'earning', calculationType: 'percentage', value: 40, baseComponent: 'BASIC' },
        { componentCode: 'DA', componentName: 'DA', type: 'earning', calculationType: 'percentage', value: 10, baseComponent: 'BASIC' },
        { componentCode: 'CONV', componentName: 'Conveyance', type: 'earning', calculationType: 'flat', value: 1600 },
        { componentCode: 'PF_EMP', componentName: 'PF (Employee)', type: 'deduction', calculationType: 'percentage', value: 12, baseComponent: 'BASIC' },
        { componentCode: 'ESI_EMP', componentName: 'ESI (Employee)', type: 'deduction', calculationType: 'percentage', value: 0.75, baseComponent: 'GROSS' },
        { componentCode: 'PT', componentName: 'Professional Tax', type: 'deduction', calculationType: 'flat', value: 200 }
      ],
      assignedCount: 62,
      status: 'active',
      createdBy: 'HR Admin',
      createdOn: '2025-01-15'
    },
    {
      id: '3',
      templateCode: 'TPL-MFG-C',
      templateName: 'Manufacturing - Grade C',
      grade: 'C',
      employmentType: 'permanent',
      ctcRange: '₹3-4L',
      components: [
        { componentCode: 'BASIC', componentName: 'Basic Salary', type: 'earning', calculationType: 'percentage', value: 50, baseComponent: 'CTC' },
        { componentCode: 'HRA', componentName: 'HRA', type: 'earning', calculationType: 'percentage', value: 40, baseComponent: 'BASIC' },
        { componentCode: 'DA', componentName: 'DA', type: 'earning', calculationType: 'percentage', value: 10, baseComponent: 'BASIC' },
        { componentCode: 'PF_EMP', componentName: 'PF (Employee)', type: 'deduction', calculationType: 'percentage', value: 12, baseComponent: 'BASIC' },
        { componentCode: 'ESI_EMP', componentName: 'ESI (Employee)', type: 'deduction', calculationType: 'percentage', value: 0.75, baseComponent: 'GROSS' },
        { componentCode: 'PT', componentName: 'Professional Tax', type: 'deduction', calculationType: 'flat', value: 200 }
      ],
      assignedCount: 38,
      status: 'active',
      createdBy: 'HR Admin',
      createdOn: '2025-01-15'
    }
  ];

  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter(template => {
      const matchesSearch = template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.templateCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || template.grade === selectedGrade;
      return matchesSearch && matchesGrade;
    });
  }, [searchTerm, selectedGrade]);

  const stats = {
    total: mockTemplates.length,
    active: mockTemplates.filter(t => t.status === 'active').length,
    totalAssigned: mockTemplates.reduce((sum, t) => sum + t.assignedCount, 0)
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Salary Templates</h1>
        <p className="text-sm text-gray-600 mt-1">Predefined salary structure templates by grade and role</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Templates</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active Templates</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Employees Assigned</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalAssigned}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{template.templateName}</h3>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                    Grade {template.grade}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    {template.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Template Code: {template.templateCode}</p>
                <p className="text-xs text-gray-500 mt-1">
                  CTC Range: {template.ctcRange} • {template.assignedCount} employees assigned
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-purple-600 hover:bg-purple-50 rounded">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3">Earnings</h4>
                <div className="space-y-2">
                  {template.components.filter(c => c.type === 'earning').map((component, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-green-700">{component.componentName}</span>
                      <span className="font-medium text-green-900">
                        {component.calculationType === 'flat'
                          ? `₹${component.value.toLocaleString('en-IN')}`
                          : `${component.value}% of ${component.baseComponent}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3">Deductions</h4>
                <div className="space-y-2">
                  {template.components.filter(c => c.type === 'deduction').map((component, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-red-700">{component.componentName}</span>
                      <span className="font-medium text-red-900">
                        {component.calculationType === 'flat'
                          ? `₹${component.value.toLocaleString('en-IN')}`
                          : `${component.value}% of ${component.baseComponent}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
              <p>Created by: {template.createdBy} on {new Date(template.createdOn).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Salary Template Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Templates define standard salary structures for different grades and roles</li>
          <li>• Each template includes earnings (Basic, HRA, DA, Allowances) and deductions (PF, ESI, PT, TDS)</li>
          <li>• Components can be flat amounts or percentages of CTC/Basic/Gross</li>
          <li>• Templates are assigned to employees based on their grade and designation</li>
          <li>• Changes to templates do not affect existing employee assignments</li>
        </ul>
      </div>
    </div>
  );
}
