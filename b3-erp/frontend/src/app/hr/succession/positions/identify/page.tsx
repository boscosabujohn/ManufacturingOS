'use client';

import { useState, useMemo } from 'react';
import { Target, AlertCircle, TrendingUp, Users } from 'lucide-react';

interface CriticalPosition {
  id: string;
  title: string;
  department: string;
  currentHolder: string;
  employeeCode: string;
  location: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  businessImpact: 'low' | 'medium' | 'high' | 'critical';
  replacementDifficulty: 'easy' | 'moderate' | 'difficult' | 'very_difficult';
  timeToFill: number;
  successorsPipeline: number;
  retirementRisk: boolean;
  expectedVacancy?: string;
  keyResponsibilities: string[];
  riskFactors: string[];
}

export default function Page() {
  const [selectedCriticality, setSelectedCriticality] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockPositions: CriticalPosition[] = [
    {
      id: '1',
      title: 'Chief Technology Officer',
      department: 'IT',
      currentHolder: 'Rajesh Kumar',
      employeeCode: 'EMP001',
      location: 'Mumbai Office',
      criticality: 'critical',
      businessImpact: 'critical',
      replacementDifficulty: 'very_difficult',
      timeToFill: 180,
      successorsPipeline: 2,
      retirementRisk: true,
      expectedVacancy: '2025-12-31',
      keyResponsibilities: ['Technology strategy', 'Team leadership', 'Digital transformation', 'IT infrastructure'],
      riskFactors: ['Retirement planned', 'Specialized knowledge', 'Limited internal pipeline']
    },
    {
      id: '2',
      title: 'VP Sales',
      department: 'Sales',
      currentHolder: 'Priya Sharma',
      employeeCode: 'EMP002',
      location: 'Delhi Office',
      criticality: 'critical',
      businessImpact: 'critical',
      replacementDifficulty: 'difficult',
      timeToFill: 120,
      successorsPipeline: 3,
      retirementRisk: false,
      keyResponsibilities: ['Sales strategy', 'Revenue growth', 'Client relationships', 'Team management'],
      riskFactors: ['High performer', 'External opportunities', 'Critical client relationships']
    },
    {
      id: '3',
      title: 'Finance Manager',
      department: 'Finance',
      currentHolder: 'Neha Gupta',
      employeeCode: 'EMP004',
      location: 'Bangalore Office',
      criticality: 'high',
      businessImpact: 'high',
      replacementDifficulty: 'moderate',
      timeToFill: 90,
      successorsPipeline: 2,
      retirementRisk: false,
      keyResponsibilities: ['Financial planning', 'Compliance', 'Reporting', 'Budget management'],
      riskFactors: ['Regulatory knowledge', 'Audit relationships']
    },
    {
      id: '4',
      title: 'Operations Lead',
      department: 'Operations',
      currentHolder: 'Vikram Singh',
      employeeCode: 'EMP005',
      location: 'Pune Office',
      criticality: 'high',
      businessImpact: 'high',
      replacementDifficulty: 'difficult',
      timeToFill: 120,
      successorsPipeline: 1,
      retirementRisk: false,
      keyResponsibilities: ['Production oversight', 'Supply chain', 'Quality control', 'Vendor management'],
      riskFactors: ['Plant operations knowledge', 'Limited successors']
    },
    {
      id: '5',
      title: 'HR Manager',
      department: 'HR',
      currentHolder: 'Sunita Reddy',
      employeeCode: 'EMP006',
      location: 'Hyderabad Office',
      criticality: 'medium',
      businessImpact: 'high',
      replacementDifficulty: 'moderate',
      timeToFill: 60,
      successorsPipeline: 2,
      retirementRisk: false,
      keyResponsibilities: ['Talent management', 'Employee relations', 'Policy compliance', 'Compensation'],
      riskFactors: ['Employee relationships', 'Policy expertise']
    },
    {
      id: '6',
      title: 'Quality Manager',
      department: 'Quality',
      currentHolder: 'Karthik Iyer',
      employeeCode: 'EMP011',
      location: 'Chennai Office',
      criticality: 'high',
      businessImpact: 'critical',
      replacementDifficulty: 'difficult',
      timeToFill: 90,
      successorsPipeline: 1,
      retirementRisk: false,
      keyResponsibilities: ['Quality assurance', 'ISO compliance', 'Audit management', 'Process improvement'],
      riskFactors: ['Certification expertise', 'Regulatory compliance']
    }
  ];

  const filteredPositions = mockPositions.filter(pos => {
    if (selectedCriticality !== 'all' && pos.criticality !== selectedCriticality) return false;
    if (selectedDepartment !== 'all' && pos.department !== selectedDepartment) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockPositions.length,
    critical: mockPositions.filter(p => p.criticality === 'critical').length,
    high: mockPositions.filter(p => p.criticality === 'high').length,
    retirementRisk: mockPositions.filter(p => p.retirementRisk).length,
    noPipeline: mockPositions.filter(p => p.successorsPipeline === 0).length
  }), [mockPositions]);

  const criticalityColors = {
    low: 'bg-gray-100 text-gray-700 border-gray-300',
    medium: 'bg-blue-100 text-blue-700 border-blue-300',
    high: 'bg-orange-100 text-orange-700 border-orange-300',
    critical: 'bg-red-100 text-red-700 border-red-300'
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    moderate: 'bg-blue-100 text-blue-700',
    difficult: 'bg-orange-100 text-orange-700',
    very_difficult: 'bg-red-100 text-red-700'
  };

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="h-6 w-6 text-teal-600" />
          Identify Critical Positions
        </h1>
        <p className="text-sm text-gray-600 mt-1">Identify and assess succession-critical roles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Positions</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm font-medium text-red-600">Critical</p>
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.critical}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-sm font-medium text-orange-600">High Priority</p>
          <p className="text-2xl font-bold text-orange-900">{stats.high}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-600">Retirement Risk</p>
          </div>
          <p className="text-2xl font-bold text-yellow-900">{stats.retirementRisk}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Criticality</label>
            <select value={selectedCriticality} onChange={(e) => setSelectedCriticality(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="HR">HR</option>
              <option value="Quality">Quality</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
              Add Position
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPositions.map(position => (
          <div key={position.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{position.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${criticalityColors[position.criticality]}`}>
                    {position.criticality.charAt(0).toUpperCase() + position.criticality.slice(1)}
                  </span>
                  {position.retirementRisk && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Retirement Risk
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{position.currentHolder} ({position.employeeCode}) • {position.department} • {position.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="text-xs text-red-600 uppercase font-medium mb-1">Business Impact</p>
                <p className="text-sm font-bold text-red-900">{position.businessImpact.charAt(0).toUpperCase() + position.businessImpact.slice(1)}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-xs text-purple-600 uppercase font-medium mb-1">Replacement</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${difficultyColors[position.replacementDifficulty]}`}>
                  {position.replacementDifficulty.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-600 uppercase font-medium mb-1">Time to Fill</p>
                <p className="text-lg font-bold text-blue-900">{position.timeToFill} days</p>
              </div>
              <div className={`rounded-lg p-3 border ${position.successorsPipeline === 0 ? 'bg-red-50 border-red-200' : position.successorsPipeline < 2 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <p className={`text-xs uppercase font-medium mb-1 flex items-center gap-1 ${position.successorsPipeline === 0 ? 'text-red-600' : position.successorsPipeline < 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                  <Users className="h-3 w-3" />
                  Successors
                </p>
                <p className={`text-lg font-bold ${position.successorsPipeline === 0 ? 'text-red-900' : position.successorsPipeline < 2 ? 'text-yellow-900' : 'text-green-900'}`}>
                  {position.successorsPipeline}
                </p>
              </div>
            </div>

            {position.expectedVacancy && (
              <div className="bg-yellow-50 rounded-lg p-3 mb-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <p className="text-xs text-yellow-700 uppercase font-medium">Expected Vacancy</p>
                </div>
                <p className="text-sm text-yellow-900">
                  Position expected to become vacant on {new Date(position.expectedVacancy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Key Responsibilities</h4>
                <ul className="space-y-1">
                  {position.keyResponsibilities.map((resp, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Risk Factors</h4>
                <ul className="space-y-1">
                  {position.riskFactors.map((risk, idx) => (
                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
                Create Succession Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
