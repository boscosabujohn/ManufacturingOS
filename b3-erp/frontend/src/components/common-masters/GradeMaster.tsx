'use client';

import React, { useState } from 'react';
import { Award, Plus, Search, Eye, Edit3, TrendingUp, Users } from 'lucide-react';

interface Grade {
  id: string;
  gradeCode: string;
  gradeName: string;
  description: string;
  
  level: number; // 1-10 hierarchy
  category: 'worker' | 'staff' | 'officer' | 'manager' | 'executive';
  
  salaryBand: {
    minBasic: number;
    maxBasic: number;
    currency: string;
  };
  
  allowances: {
    hra: number; // percentage
    da: number; // percentage
    ta: number; // fixed amount
    special?: number;
  };
  
  benefits: string[];
  leaveEntitlement: {
    casualLeave: number;
    sickLeave: number;
    privilegeLeave: number;
    maternityLeave?: number;
    paternityLeave?: number;
  };
  
  performanceReviewCycle: 'quarterly' | 'half-yearly' | 'annual';
  incrementPercentage: number;
  
  employeeCount: number;
  status: 'active' | 'inactive';
  
  createdBy: string;
  createdAt: string;
}

const GradeMaster: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([
    {
      id: '1',
      gradeCode: 'E1',
      gradeName: 'Executive Grade 1',
      description: 'Senior executive positions including CXO level',
      level: 10,
      category: 'executive',
      salaryBand: {
        minBasic: 2500000,
        maxBasic: 5000000,
        currency: 'INR'
      },
      allowances: {
        hra: 50,
        da: 20,
        ta: 50000,
        special: 100000
      },
      benefits: ['ESOP', 'Company Car', 'Driver', 'Fuel', 'Health Insurance (Family)', 'Group Insurance'],
      leaveEntitlement: {
        casualLeave: 12,
        sickLeave: 12,
        privilegeLeave: 30,
        paternityLeave: 15
      },
      performanceReviewCycle: 'annual',
      incrementPercentage: 15,
      employeeCount: 5,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      gradeCode: 'M1',
      gradeName: 'Manager Grade 1',
      description: 'Senior management positions',
      level: 8,
      category: 'manager',
      salaryBand: {
        minBasic: 1000000,
        maxBasic: 1800000,
        currency: 'INR'
      },
      allowances: {
        hra: 40,
        da: 15,
        ta: 25000,
        special: 30000
      },
      benefits: ['Health Insurance (Family)', 'Group Insurance', 'LTA', 'Performance Bonus'],
      leaveEntitlement: {
        casualLeave: 12,
        sickLeave: 12,
        privilegeLeave: 24,
        maternityLeave: 180,
        paternityLeave: 10
      },
      performanceReviewCycle: 'half-yearly',
      incrementPercentage: 12,
      employeeCount: 15,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      gradeCode: 'O2',
      gradeName: 'Officer Grade 2',
      description: 'Mid-level officers and team leads',
      level: 6,
      category: 'officer',
      salaryBand: {
        minBasic: 500000,
        maxBasic: 800000,
        currency: 'INR'
      },
      allowances: {
        hra: 35,
        da: 12,
        ta: 10000
      },
      benefits: ['Health Insurance (Self + Spouse)', 'Group Insurance', 'LTA'],
      leaveEntitlement: {
        casualLeave: 12,
        sickLeave: 12,
        privilegeLeave: 18,
        maternityLeave: 180,
        paternityLeave: 7
      },
      performanceReviewCycle: 'annual',
      incrementPercentage: 10,
      employeeCount: 45,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '4',
      gradeCode: 'S3',
      gradeName: 'Staff Grade 3',
      description: 'Junior staff and support roles',
      level: 3,
      category: 'staff',
      salaryBand: {
        minBasic: 250000,
        maxBasic: 400000,
        currency: 'INR'
      },
      allowances: {
        hra: 30,
        da: 10,
        ta: 5000
      },
      benefits: ['Health Insurance (Self)', 'Group Insurance'],
      leaveEntitlement: {
        casualLeave: 10,
        sickLeave: 10,
        privilegeLeave: 15,
        maternityLeave: 180,
        paternityLeave: 5
      },
      performanceReviewCycle: 'annual',
      incrementPercentage: 8,
      employeeCount: 120,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '5',
      gradeCode: 'W1',
      gradeName: 'Worker Grade 1',
      description: 'Skilled workers and technicians',
      level: 2,
      category: 'worker',
      salaryBand: {
        minBasic: 180000,
        maxBasic: 300000,
        currency: 'INR'
      },
      allowances: {
        hra: 25,
        da: 8,
        ta: 3000
      },
      benefits: ['ESI', 'PF', 'Group Insurance'],
      leaveEntitlement: {
        casualLeave: 8,
        sickLeave: 8,
        privilegeLeave: 12,
        maternityLeave: 180
      },
      performanceReviewCycle: 'annual',
      incrementPercentage: 6,
      employeeCount: 250,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredGrades = grades.filter(g => {
    const matchesSearch = g.gradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         g.gradeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || g.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalEmployees = grades.reduce((sum, g) => sum + g.employeeCount, 0);
  const avgIncrement = grades.reduce((sum, g) => sum + g.incrementPercentage, 0) / grades.length;

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-600" />
                Grade Master
              </h1>
              <p className="text-gray-600 mt-2">Manage employee levels and compensation grades</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Grade
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search grades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="executive">Executive</option>
              <option value="manager">Manager</option>
              <option value="officer">Officer</option>
              <option value="staff">Staff</option>
              <option value="worker">Worker</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Grades</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{grades.length}</p>
              </div>
              <Award className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{totalEmployees}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Increment</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{avgIncrement.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Grades</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {grades.filter(g => g.status === 'active').length}
                </p>
              </div>
              <Award className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Grades List */}
        <div className="space-y-2">
          {filteredGrades.map(grade => (
            <div key={grade.id} className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{grade.gradeName}</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                      Level {grade.level}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full uppercase font-medium ${
                      grade.category === 'executive' 
                        ? 'bg-indigo-100 text-indigo-800'
                        : grade.category === 'manager'
                        ? 'bg-blue-100 text-blue-800'
                        : grade.category === 'officer'
                        ? 'bg-green-100 text-green-800'
                        : grade.category === 'staff'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {grade.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{grade.gradeCode}</p>
                  <p className="text-sm text-gray-500">{grade.description}</p>
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {/* Salary Band */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Salary Band</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Basic:</span>
                      <span className="font-medium">
                        ₹{(grade.salaryBand.minBasic / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Basic:</span>
                      <span className="font-medium text-green-600">
                        ₹{(grade.salaryBand.maxBasic / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Increment:</span>
                      <span className="font-medium text-blue-600">
                        {grade.incrementPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Allowances */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Allowances</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">HRA:</span>
                      <span className="font-medium">{grade.allowances.hra}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DA:</span>
                      <span className="font-medium">{grade.allowances.da}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">TA:</span>
                      <span className="font-medium">₹{(grade.allowances.ta / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>

                {/* Leave Entitlement */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Leave Entitlement</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">CL:</span>
                      <span className="font-medium">{grade.leaveEntitlement.casualLeave} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SL:</span>
                      <span className="font-medium">{grade.leaveEntitlement.sickLeave} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PL:</span>
                      <span className="font-medium">{grade.leaveEntitlement.privilegeLeave} days</span>
                    </div>
                  </div>
                </div>

                {/* Other Details */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Other Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Review Cycle:</span>
                      <span className="font-medium capitalize">
                        {grade.performanceReviewCycle.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employees:</span>
                      <span className="font-medium">{grade.employeeCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {grade.benefits.map((benefit, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeMaster;
