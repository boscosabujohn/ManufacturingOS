'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, Search, Eye, Edit3, Users, TrendingUp, Award } from 'lucide-react';

interface Designation {
  id: string;
  designationCode: string;
  designationName: string;
  description: string;
  
  department: string;
  level: 'entry' | 'junior' | 'mid' | 'senior' | 'executive' | 'cxo';
  reportingTo?: string;
  
  responsibilities: string[];
  qualifications: string[];
  
  salaryRange: {
    minSalary: number;
    maxSalary: number;
    currency: string;
  };
  
  requiredExperience: {
    minYears: number;
    maxYears?: number;
  };
  
  headcount: {
    sanctioned: number;
    current: number;
    vacant: number;
  };
  
  benefits: string[];
  
  status: 'active' | 'inactive' | 'on-hold';
  createdBy: string;
  createdAt: string;
}

const DesignationMaster: React.FC = () => {
  const [designations, setDesignations] = useState<Designation[]>([
    {
      id: '1',
      designationCode: 'CEO',
      designationName: 'Chief Executive Officer',
      description: 'Head of the organization responsible for overall operations',
      department: 'Executive',
      level: 'cxo',
      responsibilities: [
        'Strategic planning and execution',
        'Business development',
        'Stakeholder management',
        'P&L responsibility'
      ],
      qualifications: ['MBA from top-tier institute', '15+ years experience', 'Proven leadership'],
      salaryRange: {
        minSalary: 3000000,
        maxSalary: 5000000,
        currency: 'INR'
      },
      requiredExperience: {
        minYears: 15
      },
      headcount: {
        sanctioned: 1,
        current: 1,
        vacant: 0
      },
      benefits: ['ESOP', 'Company Car', 'Health Insurance', 'Performance Bonus'],
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      designationCode: 'PM',
      designationName: 'Production Manager',
      description: 'Oversees manufacturing operations and production planning',
      department: 'Production',
      level: 'senior',
      reportingTo: 'Chief Operating Officer',
      responsibilities: [
        'Production planning and scheduling',
        'Quality control',
        'Team management',
        'Process optimization'
      ],
      qualifications: ['B.Tech/B.E. in Mechanical/Industrial', 'Production management experience'],
      salaryRange: {
        minSalary: 800000,
        maxSalary: 1200000,
        currency: 'INR'
      },
      requiredExperience: {
        minYears: 8,
        maxYears: 15
      },
      headcount: {
        sanctioned: 3,
        current: 2,
        vacant: 1
      },
      benefits: ['Health Insurance', 'PF', 'Performance Bonus'],
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      designationCode: 'SE',
      designationName: 'Senior Engineer',
      description: 'Senior technical role in design and development',
      department: 'Engineering',
      level: 'senior',
      reportingTo: 'Engineering Manager',
      responsibilities: [
        'Product design and development',
        'Technical documentation',
        'Mentoring junior engineers',
        'Project execution'
      ],
      qualifications: ['B.Tech/B.E. in relevant field', 'CAD/CAM proficiency'],
      salaryRange: {
        minSalary: 600000,
        maxSalary: 900000,
        currency: 'INR'
      },
      requiredExperience: {
        minYears: 5,
        maxYears: 10
      },
      headcount: {
        sanctioned: 10,
        current: 8,
        vacant: 2
      },
      benefits: ['Health Insurance', 'PF', 'Learning Allowance'],
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '4',
      designationCode: 'QCI',
      designationName: 'Quality Control Inspector',
      description: 'Ensures product quality meets standards',
      department: 'Quality',
      level: 'junior',
      reportingTo: 'Quality Manager',
      responsibilities: [
        'Product inspection',
        'Quality testing',
        'Documentation',
        'Non-conformance reporting'
      ],
      qualifications: ['Diploma/ITI in relevant field', 'Quality certification preferred'],
      salaryRange: {
        minSalary: 250000,
        maxSalary: 400000,
        currency: 'INR'
      },
      requiredExperience: {
        minYears: 2,
        maxYears: 5
      },
      headcount: {
        sanctioned: 15,
        current: 12,
        vacant: 3
      },
      benefits: ['Health Insurance', 'PF'],
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredDesignations = designations.filter(d => {
    const matchesSearch = d.designationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.designationCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || d.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const totalHeadcount = designations.reduce((sum, d) => sum + d.headcount.current, 0);
  const totalVacant = designations.reduce((sum, d) => sum + d.headcount.vacant, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-blue-600" />
                Designation Master
              </h1>
              <p className="text-gray-600 mt-2">Manage job positions and roles</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Designation
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search designations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior</option>
              <option value="executive">Executive</option>
              <option value="cxo">CXO</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Designations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{designations.length}</p>
              </div>
              <Briefcase className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Headcount</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{totalHeadcount}</p>
              </div>
              <Users className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vacant Positions</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{totalVacant}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {designations.filter(d => d.status === 'active').length}
                </p>
              </div>
              <Award className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Designations List */}
        <div className="space-y-2">
          {filteredDesignations.map(designation => (
            <div key={designation.id} className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{designation.designationName}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full uppercase font-medium ${
                      designation.level === 'cxo' 
                        ? 'bg-purple-100 text-purple-800'
                        : designation.level === 'executive' || designation.level === 'senior'
                        ? 'bg-blue-100 text-blue-800'
                        : designation.level === 'mid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {designation.level}
                    </span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {designation.department}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{designation.designationCode}</p>
                  <p className="text-sm text-gray-500">{designation.description}</p>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Headcount */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Headcount</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sanctioned:</span>
                      <span className="font-medium">{designation.headcount.sanctioned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium text-green-600">{designation.headcount.current}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vacant:</span>
                      <span className={`font-medium ${designation.headcount.vacant > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {designation.headcount.vacant}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Salary & Experience */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Compensation</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Salary:</span>
                      <span className="font-medium">
                        ₹{(designation.salaryRange.minSalary / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Salary:</span>
                      <span className="font-medium text-green-600">
                        ₹{(designation.salaryRange.maxSalary / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">
                        {designation.requiredExperience.minYears}
                        {designation.requiredExperience.maxYears ? `-${designation.requiredExperience.maxYears}` : '+'} years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reporting */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Reporting</h4>
                  <div className="space-y-1 text-sm">
                    {designation.reportingTo && (
                      <div>
                        <span className="text-gray-600">Reports To:</span>
                        <p className="font-medium">{designation.reportingTo}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Benefits:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {designation.benefits.slice(0, 3).map((benefit, index) => (
                          <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Responsibilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {designation.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{resp}</span>
                    </div>
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

export default DesignationMaster;
