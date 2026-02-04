'use client';

import { useState, useMemo } from 'react';
import { Users, Star, TrendingUp, Award } from 'lucide-react';

interface TalentEmployee {
  id: string;
  name: string;
  employeeCode: string;
  currentPosition: string;
  department: string;
  performance: number;
  potential: number;
  classification: 'star' | 'high_potential' | 'core_player' | 'solid_performer';
  readyFor: string[];
  strengths: string[];
  developmentAreas: string[];
  experienceYears: number;
}

export default function Page() {
  const [selectedClassification, setSelectedClassification] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const mockTalent: TalentEmployee[] = [
    {
      id: '1',
      name: 'Kavita Singh',
      employeeCode: 'EMP008',
      currentPosition: 'IT Lead',
      department: 'IT',
      performance: 95,
      potential: 95,
      classification: 'star',
      readyFor: ['CTO', 'VP Technology'],
      strengths: ['Strategic Thinking', 'Technical Excellence', 'Team Leadership'],
      developmentAreas: ['Executive Communication', 'Business Acumen'],
      experienceYears: 12
    },
    {
      id: '2',
      name: 'Arjun Kapoor',
      employeeCode: 'EMP007',
      currentPosition: 'Sales Lead',
      department: 'Sales',
      performance: 85,
      potential: 95,
      classification: 'high_potential',
      readyFor: ['Sales Manager', 'VP Sales'],
      strengths: ['Client Relations', 'Negotiation', 'Results Orientation'],
      developmentAreas: ['Strategic Planning', 'Team Management'],
      experienceYears: 8
    },
    {
      id: '3',
      name: 'Divya Nair',
      employeeCode: 'EMP010',
      currentPosition: 'Financial Analyst',
      department: 'Finance',
      performance: 75,
      potential: 90,
      classification: 'high_potential',
      readyFor: ['Finance Manager'],
      strengths: ['Analytical Skills', 'Attention to Detail', 'Problem Solving'],
      developmentAreas: ['Leadership', 'Strategic Thinking'],
      experienceYears: 5
    },
    {
      id: '4',
      name: 'Amit Patel',
      employeeCode: 'EMP003',
      currentPosition: 'Marketing Manager',
      department: 'Marketing',
      performance: 90,
      potential: 80,
      classification: 'core_player',
      readyFor: ['Senior Marketing Manager'],
      strengths: ['Marketing Strategy', 'Brand Management', 'Digital Marketing'],
      developmentAreas: ['People Leadership', 'Executive Presence'],
      experienceYears: 10
    },
    {
      id: '5',
      name: 'Rohan Mehta',
      employeeCode: 'EMP009',
      currentPosition: 'Production Supervisor',
      department: 'Operations',
      performance: 85,
      potential: 85,
      classification: 'high_potential',
      readyFor: ['Operations Manager'],
      strengths: ['Operational Excellence', 'Process Improvement', 'Quality Focus'],
      developmentAreas: ['Strategic Planning', 'Cross-Functional Collaboration'],
      experienceYears: 7
    }
  ];

  const filteredTalent = mockTalent.filter(emp => {
    if (selectedClassification !== 'all' && emp.classification !== selectedClassification) return false;
    if (selectedDepartment !== 'all' && emp.department !== selectedDepartment) return false;
    return true;
  });

  const stats = useMemo(() => ({
    total: mockTalent.length,
    stars: mockTalent.filter(e => e.classification === 'star').length,
    highPotential: mockTalent.filter(e => e.classification === 'high_potential').length,
    corePlayers: mockTalent.filter(e => e.classification === 'core_player').length
  }), [mockTalent]);

  const classificationColors = {
    star: 'bg-green-100 text-green-700 border-green-300',
    high_potential: 'bg-teal-100 text-teal-700 border-teal-300',
    core_player: 'bg-blue-100 text-blue-700 border-blue-300',
    solid_performer: 'bg-gray-100 text-gray-700 border-gray-300'
  };

  return (
    <div className="w-full h-full px-3 py-2">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-6 w-6 text-teal-600" />
          Identify Talent (HiPo)
        </h1>
        <p className="text-sm text-gray-600 mt-1">High potential employee identification and tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Total Talent</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-600">Stars</p>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.stars}</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 border border-teal-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            <p className="text-sm font-medium text-teal-600">High Potential</p>
          </div>
          <p className="text-2xl font-bold text-teal-900">{stats.highPotential}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-600">Core Players</p>
          <p className="text-2xl font-bold text-blue-900">{stats.corePlayers}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Classification</label>
            <select value={selectedClassification} onChange={(e) => setSelectedClassification(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Classifications</option>
              <option value="star">Stars</option>
              <option value="high_potential">High Potential</option>
              <option value="core_player">Core Players</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
              Add to Talent Pool
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTalent.map(emp => (
          <div key={emp.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{emp.name}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border-2 ${classificationColors[emp.classification]}`}>
                    {emp.classification.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{emp.employeeCode} • {emp.currentPosition} • {emp.department} • {emp.experienceYears} years exp</p>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Performance</p>
                    <p className="text-xl font-bold text-blue-600">{emp.performance}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Potential</p>
                    <p className="text-xl font-bold text-teal-600">{emp.potential}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <h4 className="text-sm font-bold text-gray-900">Ready For</h4>
                </div>
                <div className="space-y-1">
                  {emp.readyFor.map((role, idx) => (
                    <div key={idx} className="text-sm text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                      {role}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Strengths</h4>
                <div className="flex flex-wrap gap-1">
                  {emp.strengths.map((strength, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Development Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {emp.developmentAreas.map((area, idx) => (
                    <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded border border-orange-200">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Profile
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm">
                Create Development Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
