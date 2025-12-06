'use client';

import React, { useState, useMemo } from 'react';

// Types
export type SkillLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type SkillCategory = 'technical' | 'operational' | 'quality' | 'safety' | 'soft_skills';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  requiredLevel: SkillLevel;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  skills: EmployeeSkill[];
  certifications: Certification[];
}

export interface EmployeeSkill {
  skillId: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  lastAssessed: Date;
  assessedBy: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  expiryDate?: Date;
  status: 'valid' | 'expiring' | 'expired';
}

export interface SkillGap {
  skill: Skill;
  employee: Employee;
  currentLevel: SkillLevel;
  requiredLevel: SkillLevel;
  gap: number;
}

export interface SkillMatrixVisualizationProps {
  employees?: Employee[];
  skills?: Skill[];
  selectedDepartment?: string;
  onEmployeeClick?: (employee: Employee) => void;
  onSkillClick?: (skill: Skill) => void;
  onTrainingRequest?: (employee: Employee, skill: Skill) => void;
  className?: string;
}

// Mock data generators
const skillCategories: Record<SkillCategory, { name: string; color: string; icon: string }> = {
  technical: { name: 'Technical', color: 'blue', icon: '⚙️' },
  operational: { name: 'Operational', color: 'green', icon: '🏭' },
  quality: { name: 'Quality', color: 'purple', icon: '✅' },
  safety: { name: 'Safety', color: 'red', icon: '🛡️' },
  soft_skills: { name: 'Soft Skills', color: 'amber', icon: '🤝' },
};

const generateMockSkills = (): Skill[] => [
  { id: 's1', name: 'CNC Operation', category: 'technical', requiredLevel: 4, description: 'Operating CNC machines' },
  { id: 's2', name: 'CAD/CAM', category: 'technical', requiredLevel: 3, description: 'Design software proficiency' },
  { id: 's3', name: 'PLC Programming', category: 'technical', requiredLevel: 3, description: 'Industrial automation' },
  { id: 's4', name: 'Welding', category: 'technical', requiredLevel: 4, description: 'Various welding techniques' },
  { id: 's5', name: 'Assembly Line', category: 'operational', requiredLevel: 3, description: 'Production line work' },
  { id: 's6', name: 'Forklift Operation', category: 'operational', requiredLevel: 2, description: 'Material handling' },
  { id: 's7', name: 'Machine Setup', category: 'operational', requiredLevel: 3, description: 'Equipment preparation' },
  { id: 's8', name: 'SPC/SQC', category: 'quality', requiredLevel: 3, description: 'Statistical process control' },
  { id: 's9', name: 'Inspection Tools', category: 'quality', requiredLevel: 4, description: 'CMM, calipers, gauges' },
  { id: 's10', name: 'ISO Standards', category: 'quality', requiredLevel: 3, description: 'Quality management' },
  { id: 's11', name: 'Lockout/Tagout', category: 'safety', requiredLevel: 5, description: 'Safety procedures' },
  { id: 's12', name: 'Hazmat Handling', category: 'safety', requiredLevel: 3, description: 'Hazardous materials' },
  { id: 's13', name: 'First Aid', category: 'safety', requiredLevel: 2, description: 'Emergency response' },
  { id: 's14', name: 'Team Leadership', category: 'soft_skills', requiredLevel: 3, description: 'Leading teams' },
  { id: 's15', name: 'Problem Solving', category: 'soft_skills', requiredLevel: 4, description: 'Analytical thinking' },
];

const generateMockEmployees = (skills: Skill[]): Employee[] => [
  {
    id: 'e1',
    name: 'John Smith',
    role: 'Senior Machinist',
    department: 'CNC',
    skills: [
      { skillId: 's1', currentLevel: 5, targetLevel: 5, lastAssessed: new Date('2024-01-15'), assessedBy: 'Manager' },
      { skillId: 's2', currentLevel: 4, targetLevel: 4, lastAssessed: new Date('2024-01-15'), assessedBy: 'Manager' },
      { skillId: 's7', currentLevel: 4, targetLevel: 4, lastAssessed: new Date('2024-01-15'), assessedBy: 'Manager' },
      { skillId: 's9', currentLevel: 4, targetLevel: 4, lastAssessed: new Date('2024-01-15'), assessedBy: 'Manager' },
      { skillId: 's11', currentLevel: 5, targetLevel: 5, lastAssessed: new Date('2024-01-15'), assessedBy: 'Manager' },
      { skillId: 's15', currentLevel: 3, targetLevel: 4, lastAssessed: new Date('2024-01-15'), assessedBy: 'Manager' },
    ],
    certifications: [
      { id: 'c1', name: 'CNC Level 3', issuer: 'NIMS', status: 'valid' },
      { id: 'c2', name: 'Safety Certified', issuer: 'OSHA', status: 'valid' },
    ],
  },
  {
    id: 'e2',
    name: 'Maria Garcia',
    role: 'Quality Inspector',
    department: 'Quality',
    skills: [
      { skillId: 's8', currentLevel: 4, targetLevel: 4, lastAssessed: new Date('2024-02-10'), assessedBy: 'Manager' },
      { skillId: 's9', currentLevel: 5, targetLevel: 5, lastAssessed: new Date('2024-02-10'), assessedBy: 'Manager' },
      { skillId: 's10', currentLevel: 4, targetLevel: 4, lastAssessed: new Date('2024-02-10'), assessedBy: 'Manager' },
      { skillId: 's11', currentLevel: 4, targetLevel: 5, lastAssessed: new Date('2024-02-10'), assessedBy: 'Manager' },
      { skillId: 's15', currentLevel: 4, targetLevel: 4, lastAssessed: new Date('2024-02-10'), assessedBy: 'Manager' },
    ],
    certifications: [
      { id: 'c3', name: 'ASQ CQI', issuer: 'ASQ', status: 'valid' },
      { id: 'c4', name: 'ISO 9001 Auditor', issuer: 'BSI', expiryDate: new Date('2024-06-15'), status: 'expiring' },
    ],
  },
  {
    id: 'e3',
    name: 'Robert Johnson',
    role: 'Assembly Technician',
    department: 'Assembly',
    skills: [
      { skillId: 's5', currentLevel: 4, targetLevel: 4, lastAssessed: new Date('2024-03-01'), assessedBy: 'Supervisor' },
      { skillId: 's6', currentLevel: 3, targetLevel: 3, lastAssessed: new Date('2024-03-01'), assessedBy: 'Supervisor' },
      { skillId: 's7', currentLevel: 2, targetLevel: 3, lastAssessed: new Date('2024-03-01'), assessedBy: 'Supervisor' },
      { skillId: 's11', currentLevel: 4, targetLevel: 5, lastAssessed: new Date('2024-03-01'), assessedBy: 'Supervisor' },
      { skillId: 's13', currentLevel: 2, targetLevel: 2, lastAssessed: new Date('2024-03-01'), assessedBy: 'Supervisor' },
    ],
    certifications: [
      { id: 'c5', name: 'Forklift License', issuer: 'State', status: 'valid' },
    ],
  },
  {
    id: 'e4',
    name: 'Sarah Williams',
    role: 'Automation Engineer',
    department: 'Engineering',
    skills: [
      { skillId: 's2', currentLevel: 5, targetLevel: 5, lastAssessed: new Date('2024-01-20'), assessedBy: 'Manager' },
      { skillId: 's3', currentLevel: 4, targetLevel: 5, lastAssessed: new Date('2024-01-20'), assessedBy: 'Manager' },
      { skillId: 's7', currentLevel: 3, targetLevel: 4, lastAssessed: new Date('2024-01-20'), assessedBy: 'Manager' },
      { skillId: 's11', currentLevel: 3, targetLevel: 5, lastAssessed: new Date('2024-01-20'), assessedBy: 'Manager' },
      { skillId: 's14', currentLevel: 3, targetLevel: 4, lastAssessed: new Date('2024-01-20'), assessedBy: 'Manager' },
      { skillId: 's15', currentLevel: 5, targetLevel: 5, lastAssessed: new Date('2024-01-20'), assessedBy: 'Manager' },
    ],
    certifications: [
      { id: 'c6', name: 'Siemens PLC', issuer: 'Siemens', status: 'valid' },
      { id: 'c7', name: 'Allen-Bradley', issuer: 'Rockwell', expiryDate: new Date('2023-12-01'), status: 'expired' },
    ],
  },
  {
    id: 'e5',
    name: 'Michael Brown',
    role: 'Welder',
    department: 'Fabrication',
    skills: [
      { skillId: 's4', currentLevel: 5, targetLevel: 5, lastAssessed: new Date('2024-02-15'), assessedBy: 'Supervisor' },
      { skillId: 's5', currentLevel: 3, targetLevel: 3, lastAssessed: new Date('2024-02-15'), assessedBy: 'Supervisor' },
      { skillId: 's11', currentLevel: 5, targetLevel: 5, lastAssessed: new Date('2024-02-15'), assessedBy: 'Supervisor' },
      { skillId: 's12', currentLevel: 3, targetLevel: 3, lastAssessed: new Date('2024-02-15'), assessedBy: 'Supervisor' },
      { skillId: 's13', currentLevel: 3, targetLevel: 2, lastAssessed: new Date('2024-02-15'), assessedBy: 'Supervisor' },
    ],
    certifications: [
      { id: 'c8', name: 'AWS D1.1', issuer: 'AWS', status: 'valid' },
      { id: 'c9', name: 'TIG Certified', issuer: 'AWS', status: 'valid' },
    ],
  },
];

export function SkillMatrixVisualization({
  employees: initialEmployees,
  skills: initialSkills,
  onEmployeeClick,
  onSkillClick,
  onTrainingRequest,
  className = '',
}: SkillMatrixVisualizationProps) {
  const skills = useMemo(() => initialSkills || generateMockSkills(), [initialSkills]);
  const employees = useMemo(() => initialEmployees || generateMockEmployees(skills), [initialEmployees, skills]);

  const [view, setView] = useState<'matrix' | 'gaps' | 'individual'>('matrix');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [showTrainingModal, setShowTrainingModal] = useState<{ employee: Employee; skill: Skill } | null>(null);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') return skills;
    return skills.filter(s => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  const skillGaps = useMemo(() => {
    const gaps: SkillGap[] = [];
    employees.forEach(employee => {
      filteredSkills.forEach(skill => {
        const empSkill = employee.skills.find(s => s.skillId === skill.id);
        const currentLevel = empSkill?.currentLevel || 0;
        if (currentLevel < skill.requiredLevel) {
          gaps.push({
            skill,
            employee,
            currentLevel,
            requiredLevel: skill.requiredLevel,
            gap: skill.requiredLevel - currentLevel,
          });
        }
      });
    });
    return gaps.sort((a, b) => b.gap - a.gap);
  }, [employees, filteredSkills]);

  const getSkillLevel = (employee: Employee, skillId: string): SkillLevel => {
    const empSkill = employee.skills.find(s => s.skillId === skillId);
    return empSkill?.currentLevel || 0;
  };

  const getSkillCellColor = (current: SkillLevel, required: SkillLevel) => {
    if (current === 0) return 'bg-gray-700';
    if (current >= required) return 'bg-green-600';
    if (current >= required - 1) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getLevelLabel = (level: SkillLevel): string => {
    const labels = ['None', 'Basic', 'Intermediate', 'Proficient', 'Advanced', 'Expert'];
    return labels[level];
  };

  const renderMatrix = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-gray-800 p-3 text-left text-gray-400 font-medium min-w-48 z-10">
              Employee
            </th>
            {filteredSkills.map(skill => (
              <th
                key={skill.id}
                className="p-2 text-center text-gray-400 font-medium min-w-16 cursor-pointer hover:bg-gray-700"
                onClick={() => onSkillClick?.(skill)}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{skillCategories[skill.category].icon}</span>
                  <span className="text-xs whitespace-nowrap truncate max-w-16" title={skill.name}>
                    {skill.name.split(' ')[0]}
                  </span>
                  <span className="text-xs text-gray-500">Req: {skill.requiredLevel}</span>
                </div>
              </th>
            ))}
            <th className="p-3 text-center text-gray-400 font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => {
            const totalScore = filteredSkills.reduce((sum, skill) => sum + getSkillLevel(employee, skill.id), 0);
            const maxScore = filteredSkills.length * 5;
            const scorePercent = Math.round((totalScore / maxScore) * 100);

            return (
              <tr key={employee.id} className="hover:bg-gray-800/50">
                <td
                  className="sticky left-0 bg-gray-900 p-3 cursor-pointer hover:bg-gray-800 z-10"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setView('individual');
                    onEmployeeClick?.(employee);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-white font-medium">{employee.name}</p>
                      <p className="text-xs text-gray-400">{employee.role}</p>
                    </div>
                  </div>
                </td>
                {filteredSkills.map(skill => {
                  const level = getSkillLevel(employee, skill.id);
                  return (
                    <td
                      key={skill.id}
                      className="p-2 text-center"
                      onClick={() => {
                        if (level < skill.requiredLevel) {
                          setShowTrainingModal({ employee, skill });
                        }
                      }}
                    >
                      <div
                        className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-white font-bold cursor-pointer transition-transform hover:scale-110 ${getSkillCellColor(level, skill.requiredLevel)}`}
                        title={`${skill.name}: ${getLevelLabel(level)} (Required: ${skill.requiredLevel})`}
                      >
                        {level}
                      </div>
                    </td>
                  );
                })}
                <td className="p-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          scorePercent >= 80 ? 'bg-green-600' : scorePercent >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                    <span className="text-white font-medium text-sm">{scorePercent}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderGaps = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-3xl font-bold text-red-400">{skillGaps.filter(g => g.gap >= 3).length}</p>
          <p className="text-sm text-gray-400">Critical Gaps (3+ levels)</p>
        </div>
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
          <p className="text-3xl font-bold text-yellow-400">{skillGaps.filter(g => g.gap === 2).length}</p>
          <p className="text-sm text-gray-400">Moderate Gaps (2 levels)</p>
        </div>
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <p className="text-3xl font-bold text-blue-400">{skillGaps.filter(g => g.gap === 1).length}</p>
          <p className="text-sm text-gray-400">Minor Gaps (1 level)</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-left text-gray-400 font-medium">Employee</th>
              <th className="p-3 text-left text-gray-400 font-medium">Skill</th>
              <th className="p-3 text-center text-gray-400 font-medium">Current</th>
              <th className="p-3 text-center text-gray-400 font-medium">Required</th>
              <th className="p-3 text-center text-gray-400 font-medium">Gap</th>
              <th className="p-3 text-center text-gray-400 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {skillGaps.slice(0, 15).map((gap, i) => (
              <tr key={i} className="border-t border-gray-700 hover:bg-gray-700/50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {gap.employee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-white">{gap.employee.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span>{skillCategories[gap.skill.category].icon}</span>
                    <span className="text-white">{gap.skill.name}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="text-white">{gap.currentLevel}</span>
                </td>
                <td className="p-3 text-center">
                  <span className="text-white">{gap.requiredLevel}</span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    gap.gap >= 3 ? 'bg-red-600 text-white' :
                    gap.gap === 2 ? 'bg-yellow-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    -{gap.gap}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setShowTrainingModal({ employee: gap.employee, skill: gap.skill });
                    }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Request Training
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderIndividual = () => {
    if (!selectedEmployee) {
      return (
        <div className="text-center py-12 text-gray-400">
          Select an employee from the matrix to view their skill profile
        </div>
      );
    }

    const employeeSkillMap = new Map(selectedEmployee.skills.map(s => [s.skillId, s]));

    return (
      <div className="space-y-6">
        {/* Employee Header */}
        <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{selectedEmployee.name}</h3>
              <p className="text-gray-400">{selectedEmployee.role} - {selectedEmployee.department}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setView('matrix');
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Back to Matrix
          </button>
        </div>

        {/* Skills Radar Chart (simplified) */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Skill Levels</h4>
            <div className="space-y-3">
              {filteredSkills.map(skill => {
                const empSkill = employeeSkillMap.get(skill.id);
                const current = empSkill?.currentLevel || 0;
                const required = skill.requiredLevel;
                const isGap = current < required;

                return (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm flex items-center gap-2">
                        {skillCategories[skill.category].icon} {skill.name}
                      </span>
                      <span className={`text-sm font-medium ${isGap ? 'text-red-400' : 'text-green-400'}`}>
                        {current}/{required}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${isGap ? 'bg-red-600' : 'bg-green-600'}`}
                        style={{ width: `${(current / 5) * 100}%` }}
                      />
                      <div
                        className="absolute top-0 h-full w-0.5 bg-white"
                        style={{ left: `${(required / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Certifications</h4>
            <div className="space-y-3">
              {selectedEmployee.certifications.map(cert => (
                <div
                  key={cert.id}
                  className={`p-3 rounded-lg border ${
                    cert.status === 'valid' ? 'bg-green-900/30 border-green-700' :
                    cert.status === 'expiring' ? 'bg-yellow-900/30 border-yellow-700' :
                    'bg-red-900/30 border-red-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{cert.name}</p>
                      <p className="text-sm text-gray-400">{cert.issuer}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      cert.status === 'valid' ? 'bg-green-600 text-white' :
                      cert.status === 'expiring' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {cert.status.toUpperCase()}
                    </span>
                  </div>
                  {cert.expiryDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      Expires: {cert.expiryDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Recommendations */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Recommended Training</h4>
          <div className="grid grid-cols-3 gap-4">
            {filteredSkills
              .filter(skill => {
                const empSkill = employeeSkillMap.get(skill.id);
                return !empSkill || empSkill.currentLevel < skill.requiredLevel;
              })
              .slice(0, 6)
              .map(skill => (
                <div key={skill.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{skillCategories[skill.category].icon}</span>
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">
                    Current: {employeeSkillMap.get(skill.id)?.currentLevel || 0} → Target: {skill.requiredLevel}
                  </p>
                  <button
                    onClick={() => setShowTrainingModal({ employee: selectedEmployee, skill })}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Request Training
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Skill Matrix</h2>
          <p className="text-gray-400">Employee skills vs. required skills gap analysis</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as SkillCategory | 'all')}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 outline-none"
          >
            <option value="all">All Categories</option>
            {Object.entries(skillCategories).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.name}</option>
            ))}
          </select>

          {/* View Tabs */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {[
              { id: 'matrix', label: 'Matrix', icon: '📊' },
              { id: 'gaps', label: 'Gaps', icon: '⚠️' },
              { id: 'individual', label: 'Individual', icon: '👤' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as typeof view)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 p-3 bg-gray-800 rounded-lg">
        <span className="text-gray-400 text-sm">Skill Level:</span>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-600 rounded" />
          <span className="text-gray-300 text-sm">Meets/Exceeds</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-600 rounded" />
          <span className="text-gray-300 text-sm">1 Level Below</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded" />
          <span className="text-gray-300 text-sm">2+ Levels Below</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-700 rounded" />
          <span className="text-gray-300 text-sm">No Skill</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        {view === 'matrix' && renderMatrix()}
        {view === 'gaps' && renderGaps()}
        {view === 'individual' && renderIndividual()}
      </div>

      {/* Training Request Modal */}
      {showTrainingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Request Training</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-400 text-sm">Employee</label>
                <p className="text-white font-medium">{showTrainingModal.employee.name}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Skill</label>
                <p className="text-white font-medium flex items-center gap-2">
                  {skillCategories[showTrainingModal.skill.category].icon}
                  {showTrainingModal.skill.name}
                </p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Current Level</label>
                <p className="text-white">{getSkillLevel(showTrainingModal.employee, showTrainingModal.skill.id)}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Required Level</label>
                <p className="text-white">{showTrainingModal.skill.requiredLevel}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTrainingModal(null)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onTrainingRequest?.(showTrainingModal.employee, showTrainingModal.skill);
                  setShowTrainingModal(null);
                }}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillMatrixVisualization;
