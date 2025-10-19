'use client';

import React, { useState, useMemo } from 'react';
import {
  Award, Plus, Search, Edit2, Trash2, CheckCircle2,
  XCircle, Star, TrendingUp, BookOpen, Briefcase,
  GraduationCap, Wrench, Target, BarChart3
} from 'lucide-react';

interface Skill {
  id: string;
  code: string;
  name: string;
  category: 'Technical' | 'Operational' | 'Quality' | 'Safety' | 'Managerial' | 'Soft Skills';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  prerequisites: string[];
  certificationRequired: boolean;
  certificationName?: string;
  validityPeriod?: number;
  trainingHours: number;
  assessmentMethod: string;
  competencyIndicators: string[];
  applicableRoles: string[];
  status: 'Active' | 'Inactive' | 'Under Development';
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

const mockSkills: Skill[] = [
  {
    id: '1',
    code: 'SKL-TEC-001',
    name: 'CNC Machine Operation',
    category: 'Technical',
    level: 'Advanced',
    description: 'Ability to set up, program, and operate CNC milling and turning machines',
    prerequisites: ['Basic Machining', 'Blueprint Reading', 'CAD/CAM Basics'],
    certificationRequired: true,
    certificationName: 'Certified CNC Operator',
    validityPeriod: 36,
    trainingHours: 120,
    assessmentMethod: 'Practical test + Written exam',
    competencyIndicators: [
      'Can program CNC machines using G-code',
      'Sets up fixtures and tooling correctly',
      'Maintains dimensional accuracy within ±0.01mm',
      'Troubleshoots machine errors'
    ],
    applicableRoles: ['CNC Operator', 'Machinist', 'Production Technician'],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      createdBy: 'HR Manager',
      updatedBy: 'Training Coordinator'
    }
  },
  {
    id: '2',
    code: 'SKL-QUA-001',
    name: 'Quality Inspection',
    category: 'Quality',
    level: 'Intermediate',
    description: 'Proficiency in using measurement tools and conducting quality inspections',
    prerequisites: ['Basic Mathematics', 'Measurement Fundamentals'],
    certificationRequired: true,
    certificationName: 'Quality Inspector Level II',
    validityPeriod: 24,
    trainingHours: 80,
    assessmentMethod: 'Practical measurement tests + Theory exam',
    competencyIndicators: [
      'Proficient with micrometers, calipers, and gauges',
      'Can interpret GD&T symbols',
      'Conducts first article inspections',
      'Completes inspection reports accurately'
    ],
    applicableRoles: ['QC Inspector', 'Quality Technician', 'Final Inspector'],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20'),
      createdBy: 'QA Manager',
      updatedBy: 'QA Manager'
    }
  },
  {
    id: '3',
    code: 'SKL-SAF-001',
    name: 'Safety Compliance',
    category: 'Safety',
    level: 'Beginner',
    description: 'Understanding of workplace safety regulations and emergency procedures',
    prerequisites: [],
    certificationRequired: true,
    certificationName: 'OSHA 30-Hour General Industry',
    validityPeriod: 12,
    trainingHours: 30,
    assessmentMethod: 'Written exam + Practical demonstration',
    competencyIndicators: [
      'Identifies workplace hazards',
      'Uses PPE correctly',
      'Follows lockout/tagout procedures',
      'Responds appropriately to emergencies'
    ],
    applicableRoles: ['All Manufacturing Roles'],
    status: 'Active',
    metadata: {
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-03-01'),
      createdBy: 'Safety Officer',
      updatedBy: 'Safety Officer'
    }
  }
];

export default function SkillMaster() {
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterLevel, setFilterLevel] = useState<string>('All');

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      setSkills(skills.filter(s => s.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      'Inactive': { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle },
      'Under Development': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Wrench }
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

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      'Beginner': { bg: 'bg-blue-100', text: 'text-blue-800', stars: 1 },
      'Intermediate': { bg: 'bg-purple-100', text: 'text-purple-800', stars: 2 },
      'Advanced': { bg: 'bg-orange-100', text: 'text-orange-800', stars: 3 },
      'Expert': { bg: 'bg-red-100', text: 'text-red-800', stars: 4 }
    };
    const config = levelConfig[level as keyof typeof levelConfig];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {Array.from({ length: config.stars }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-current" />
        ))}
        {level}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Technical': Wrench,
      'Operational': Briefcase,
      'Quality': Target,
      'Safety': Award,
      'Managerial': TrendingUp,
      'Soft Skills': BookOpen
    };
    return icons[category as keyof typeof icons] || Award;
  };

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || skill.category === filterCategory;
      const matchesLevel = filterLevel === 'All' || skill.level === filterLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [skills, searchTerm, filterCategory, filterLevel]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Skill Master</h2>
        <p className="text-gray-600">Manage worker capabilities and competency requirements</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Operational">Operational</option>
                <option value="Quality">Quality</option>
                <option value="Safety">Safety</option>
                <option value="Managerial">Managerial</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedSkill(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Training
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicable Roles
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
              {filteredSkills.map((skill) => {
                const CategoryIcon = getCategoryIcon(skill.category);
                return (
                  <tr key={skill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                        <div className="text-sm text-gray-500">{skill.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <CategoryIcon className="h-4 w-4 text-gray-400" />
                          <span>{skill.category}</span>
                        </div>
                        {getLevelBadge(skill.level)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {skill.certificationRequired ? (
                          <>
                            <div className="font-medium text-green-600 flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              Required
                            </div>
                            <div className="text-xs text-gray-500">{skill.certificationName}</div>
                            {skill.validityPeriod && (
                              <div className="text-xs text-gray-400">Valid: {skill.validityPeriod} months</div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">Not required</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3 text-gray-400" />
                          <span>{skill.trainingHours} hours</span>
                        </div>
                        <div className="text-xs text-gray-500">{skill.assessmentMethod}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600">
                        {skill.applicableRoles.slice(0, 2).map((role, i) => (
                          <div key={i} className="mb-0.5">{role}</div>
                        ))}
                        {skill.applicableRoles.length > 2 && (
                          <div className="text-blue-600">+{skill.applicableRoles.length - 2} more</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(skill.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedSkill ? 'Edit Skill' : 'Add New Skill'}
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
                      Skill Code *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedSkill?.code}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="SKL-XXX-000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedSkill?.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter skill name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      defaultValue={selectedSkill?.category || 'Technical'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Operational">Operational</option>
                      <option value="Quality">Quality</option>
                      <option value="Safety">Safety</option>
                      <option value="Managerial">Managerial</option>
                      <option value="Soft Skills">Soft Skills</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level *
                    </label>
                    <select 
                      defaultValue={selectedSkill?.level || 'Beginner'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    defaultValue={selectedSkill?.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Describe the skill"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="certificationRequired"
                    defaultChecked={selectedSkill?.certificationRequired}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="certificationRequired" className="text-sm text-gray-700">
                    Certification Required
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Training Hours *
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedSkill?.trainingHours}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select 
                      defaultValue={selectedSkill?.status || 'Active'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Under Development">Under Development</option>
                    </select>
                  </div>
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
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
