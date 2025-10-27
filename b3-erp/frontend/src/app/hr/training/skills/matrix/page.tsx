'use client';

import { useState } from 'react';
import { Grid, Users, TrendingUp, AlertCircle, CheckCircle, Target } from 'lucide-react';

interface SkillLevel {
  level: number;
  label: string;
  color: string;
  description: string;
}

interface EmployeeSkill {
  employeeCode: string;
  employeeName: string;
  designation: string;
  cncProgramming: number;
  qualityInspection: number;
  leanManufacturing: number;
  safetyCompliance: number;
  maintenance: number;
  leadership: number;
}

export default function SkillsMatrixPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const skillLevels: SkillLevel[] = [
    { level: 0, label: 'None', color: 'bg-gray-200', description: 'No knowledge or experience' },
    { level: 1, label: 'Basic', color: 'bg-red-200', description: 'Basic theoretical knowledge' },
    { level: 2, label: 'Working', color: 'bg-yellow-200', description: 'Can perform with supervision' },
    { level: 3, label: 'Proficient', color: 'bg-blue-200', description: 'Can perform independently' },
    { level: 4, label: 'Expert', color: 'bg-green-200', description: 'Can train others' }
  ];

  const skills = [
    { id: 'cncProgramming', name: 'CNC Programming', key: 'cncProgramming' },
    { id: 'qualityInspection', name: 'Quality Inspection', key: 'qualityInspection' },
    { id: 'leanManufacturing', name: 'Lean Manufacturing', key: 'leanManufacturing' },
    { id: 'safetyCompliance', name: 'Safety Compliance', key: 'safetyCompliance' },
    { id: 'maintenance', name: 'Equipment Maintenance', key: 'maintenance' },
    { id: 'leadership', name: 'Leadership', key: 'leadership' }
  ];

  const mockEmployees: EmployeeSkill[] = [
    {
      employeeCode: 'KMF2451', employeeName: 'Rajesh Kumar', designation: 'Production Supervisor',
      cncProgramming: 4, qualityInspection: 3, leanManufacturing: 4, safetyCompliance: 4,
      maintenance: 2, leadership: 4
    },
    {
      employeeCode: 'KMF2452', employeeName: 'Priya Patel', designation: 'Quality Inspector',
      cncProgramming: 2, qualityInspection: 4, leanManufacturing: 3, safetyCompliance: 4,
      maintenance: 1, leadership: 2
    },
    {
      employeeCode: 'KMF2453', employeeName: 'Amit Kumar', designation: 'Machine Operator',
      cncProgramming: 3, qualityInspection: 2, leanManufacturing: 2, safetyCompliance: 3,
      maintenance: 2, leadership: 1
    },
    {
      employeeCode: 'KMF2454', employeeName: 'Sneha Reddy', designation: 'Production Coordinator',
      cncProgramming: 2, qualityInspection: 3, leanManufacturing: 4, safetyCompliance: 4,
      maintenance: 1, leadership: 3
    },
    {
      employeeCode: 'KMF2455', employeeName: 'Vikram Singh', designation: 'Maintenance Engineer',
      cncProgramming: 2, qualityInspection: 2, leanManufacturing: 2, safetyCompliance: 4,
      maintenance: 4, leadership: 3
    },
    {
      employeeCode: 'KMF2456', employeeName: 'Anjali Nair', designation: 'QA Analyst',
      cncProgramming: 1, qualityInspection: 4, leanManufacturing: 3, safetyCompliance: 4,
      maintenance: 1, leadership: 2
    },
    {
      employeeCode: 'KMF2457', employeeName: 'Deepa Gupta', designation: 'Assembly Technician',
      cncProgramming: 1, qualityInspection: 2, leanManufacturing: 2, safetyCompliance: 3,
      maintenance: 1, leadership: 1
    },
    {
      employeeCode: 'KMF2458', employeeName: 'Sunil Verma', designation: 'Senior Technician',
      cncProgramming: 3, qualityInspection: 3, leanManufacturing: 3, safetyCompliance: 4,
      maintenance: 3, leadership: 3
    }
  ];

  const getSkillColor = (level: number) => {
    const colors = ['bg-gray-200', 'bg-red-200', 'bg-yellow-200', 'bg-blue-200', 'bg-green-200'];
    return colors[level] || 'bg-gray-200';
  };

  const getSkillLabel = (level: number) => {
    return skillLevels.find(sl => sl.level === level)?.label || 'None';
  };

  // Calculate statistics
  const calculateSkillStats = () => {
    const stats: any = {};
    skills.forEach(skill => {
      const skillKey = skill.key as keyof EmployeeSkill;
      const levels = mockEmployees.map(emp => emp[skillKey] as number);
      const avgLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length;
      const expertCount = levels.filter(level => level === 4).length;
      const gapCount = levels.filter(level => level <= 1).length;

      stats[skill.id] = {
        avgLevel: avgLevel.toFixed(1),
        expertCount,
        gapCount
      };
    });
    return stats;
  };

  const skillStats = calculateSkillStats();

  const overallStats = {
    totalEmployees: mockEmployees.length,
    totalSkills: skills.length,
    expertCount: mockEmployees.filter(emp =>
      [emp.cncProgramming, emp.qualityInspection, emp.leanManufacturing,
       emp.safetyCompliance, emp.maintenance, emp.leadership].some(skill => skill === 4)
    ).length,
    skillGaps: mockEmployees.reduce((sum, emp) =>
      sum + [emp.cncProgramming, emp.qualityInspection, emp.leanManufacturing,
             emp.safetyCompliance, emp.maintenance, emp.leadership].filter(skill => skill <= 1).length, 0
    )
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Grid className="h-8 w-8 text-indigo-600" />
          Skills Matrix
        </h1>
        <p className="text-gray-600 mt-2">Employee competency and skill level tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-indigo-600">{overallStats.totalEmployees}</p>
            </div>
            <Users className="h-10 w-10 text-indigo-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Skills Tracked</p>
              <p className="text-2xl font-bold text-purple-600">{overallStats.totalSkills}</p>
            </div>
            <Target className="h-10 w-10 text-purple-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expert Level</p>
              <p className="text-2xl font-bold text-green-600">{overallStats.expertCount}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
        </div>
        <div className="bg-white border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Skill Gaps</p>
              <p className="text-2xl font-bold text-red-600">{overallStats.skillGaps}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
      </div>

      {/* Skill Level Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Skill Level Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {skillLevels.map(level => (
            <div key={level.level} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded ${level.color} border border-gray-300 flex items-center justify-center font-bold text-gray-700`}>
                {level.level}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{level.label}</p>
                <p className="text-xs text-gray-600">{level.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Matrix Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Employee Skills Matrix</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50">
                Employee
              </th>
              {skills.map(skill => (
                <th key={skill.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div>{skill.name}</div>
                  <div className="text-xs font-normal text-gray-500 mt-1">
                    Avg: {skillStats[skill.id].avgLevel}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockEmployees.map((employee, idx) => (
              <tr key={employee.employeeCode} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 sticky left-0 bg-inherit">
                  <div>
                    <div className="font-semibold text-gray-900">{employee.employeeName}</div>
                    <div className="text-xs text-gray-500">{employee.employeeCode} • {employee.designation}</div>
                  </div>
                </td>
                {skills.map(skill => {
                  const skillKey = skill.key as keyof EmployeeSkill;
                  const level = employee[skillKey] as number;
                  return (
                    <td key={skill.id} className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <div className={`w-16 h-16 rounded-lg ${getSkillColor(level)} border border-gray-300 flex flex-col items-center justify-center`}>
                          <span className="text-2xl font-bold text-gray-700">{level}</span>
                          <span className="text-xs text-gray-600">{getSkillLabel(level)}</span>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Skill Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Skill Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Skill Distribution Summary
          </h3>
          <div className="space-y-3">
            {skills.map(skill => {
              const stats = skillStats[skill.id];
              return (
                <div key={skill.id} className="border-b border-gray-200 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{skill.name}</p>
                    <span className="text-sm text-gray-600">Avg: {stats.avgLevel}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600">{stats.expertCount} Experts</span>
                    </div>
                    {stats.gapCount > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-gray-600">{stats.gapCount} Gaps</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Training Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Training Recommendations
          </h3>
          <div className="space-y-3">
            {skills.filter(skill => skillStats[skill.id].gapCount > 0).map(skill => (
              <div key={skill.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="font-medium text-gray-900 mb-1">{skill.name}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {skillStats[skill.id].gapCount} employee(s) need training
                </p>
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View Training Programs →
                </button>
              </div>
            ))}
            {skills.every(skill => skillStats[skill.id].gapCount === 0) && (
              <div className="text-center p-6 text-gray-500">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p>All employees meet minimum skill requirements</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-indigo-900 mb-2">Skills Matrix Guidelines</h3>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Skills are assessed on a 0-4 scale from None to Expert level</li>
          <li>• Regular skill assessments help identify training needs and succession planning</li>
          <li>• Target: All critical skills should have at least 2 experts per department</li>
          <li>• Employees with skill gaps should be enrolled in relevant training programs</li>
          <li>• Expert-level employees can mentor and train others</li>
          <li>• Skills matrix should be reviewed and updated quarterly</li>
        </ul>
      </div>
    </div>
  );
}
