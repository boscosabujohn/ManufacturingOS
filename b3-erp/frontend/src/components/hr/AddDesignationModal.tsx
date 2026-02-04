'use client';

import { useState } from 'react';
import { X, Briefcase, Users, DollarSign, Award, Building2, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface AddDesignationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AddDesignationModal({ isOpen, onClose, onSubmit }: AddDesignationModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    department: '',
    level: 'mid',
    grade: '',
    labourCategory: '',
    labourGrade: '',
    minSalary: '',
    maxSalary: '',
    reportingTo: '',
    description: '',
    status: 'active'
  });

  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);

  // State for custom entries
  const [showCustomGrade, setShowCustomGrade] = useState(false);
  const [showCustomLabourCategory, setShowCustomLabourCategory] = useState(false);
  const [showCustomLabourGrade, setShowCustomLabourGrade] = useState(false);
  const [customGrade, setCustomGrade] = useState('');
  const [customLabourCategory, setCustomLabourCategory] = useState('');
  const [customLabourGrade, setCustomLabourGrade] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredResponsibilities = responsibilities.filter(r => r.trim() !== '');
    const filteredRequirements = requirements.filter(r => r.trim() !== '');
    onSubmit({
      ...formData,
      responsibilities: filteredResponsibilities,
      requirements: filteredRequirements
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, '']);
  };

  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const updateResponsibility = (index: number, value: string) => {
    const updated = [...responsibilities];
    updated[index] = value;
    setResponsibilities(updated);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div className="bg-white rounded-lg  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 flex justify-between items-center rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Add New Designation
            </h2>
            <p className="text-purple-100 text-sm mt-1">Define a new job role with responsibilities and requirements</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Production Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="e.g., PM-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Unique designation code (max 10 characters)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Production">Production</option>
                  <option value="Quality">Quality</option>
                  <option value="IT">IT</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Safety">Safety</option>
                  <option value="Research">Research</option>
                  <option value="Finance">Finance</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                  <option value="director">Director</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade <span className="text-red-500">*</span>
                </label>
                {!showCustomGrade ? (
                  <div className="space-y-2">
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowCustomGrade(true);
                          setFormData(prev => ({ ...prev, grade: '' }));
                        } else {
                          handleChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Grade</option>
                      <optgroup label="Employee Grades">
                        <option value="E1">E1 - Entry Level Employee</option>
                        <option value="E2">E2 - Junior Employee</option>
                        <option value="E3">E3 - Senior Employee</option>
                        <option value="E4">E4 - Principal Employee</option>
                      </optgroup>
                      <optgroup label="Supervisor Grades">
                        <option value="S1">S1 - Junior Supervisor</option>
                        <option value="S2">S2 - Senior Supervisor</option>
                      </optgroup>
                      <optgroup label="Manager Grades">
                        <option value="M1">M1 - Assistant Manager</option>
                        <option value="M2">M2 - Manager</option>
                        <option value="M3">M3 - Senior Manager</option>
                      </optgroup>
                      <optgroup label="Director Grades">
                        <option value="D1">D1 - Deputy Director</option>
                        <option value="D2">D2 - Director</option>
                        <option value="D3">D3 - Senior Director</option>
                      </optgroup>
                      <optgroup label="Executive Grades">
                        <option value="EX1">EX1 - VP Level</option>
                        <option value="EX2">EX2 - SVP Level</option>
                        <option value="EX3">EX3 - CXO Level</option>
                      </optgroup>
                      <optgroup label="Custom">
                        <option value="custom">➕ Add Custom Grade</option>
                      </optgroup>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customGrade}
                        onChange={(e) => setCustomGrade(e.target.value.toUpperCase())}
                        placeholder="Enter custom grade (e.g., T1, C4)"
                        maxLength={5}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customGrade.trim()) {
                            setFormData(prev => ({ ...prev, grade: customGrade.trim() }));
                            setShowCustomGrade(false);
                            setCustomGrade('');
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomGrade(false);
                          setCustomGrade('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Enter a custom grade code (max 5 characters)</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Labour Category (GCC) <span className="text-red-500">*</span>
                </label>
                {!showCustomLabourCategory ? (
                  <div className="space-y-2">
                    <select
                      name="labourCategory"
                      value={formData.labourCategory}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowCustomLabourCategory(true);
                          setFormData(prev => ({ ...prev, labourCategory: '' }));
                        } else {
                          handleChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Labour Category</option>
                      <option value="skilled">Skilled Labour</option>
                      <option value="semi-skilled">Semi-Skilled Labour</option>
                      <option value="unskilled">Unskilled Labour</option>
                      <option value="professional">Professional</option>
                      <option value="technical">Technical</option>
                      <option value="clerical">Clerical</option>
                      <option value="administrative">Administrative</option>
                      <option value="managerial">Managerial</option>
                      <option value="executive">Executive</option>
                      <option value="custom">➕ Add Custom Category</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customLabourCategory}
                        onChange={(e) => setCustomLabourCategory(e.target.value)}
                        placeholder="Enter custom labour category"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customLabourCategory.trim()) {
                            setFormData(prev => ({ ...prev, labourCategory: customLabourCategory.trim() }));
                            setShowCustomLabourCategory(false);
                            setCustomLabourCategory('');
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomLabourCategory(false);
                          setCustomLabourCategory('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Enter a custom labour category</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Labour Grade (GCC) <span className="text-red-500">*</span>
                </label>
                {!showCustomLabourGrade ? (
                  <div className="space-y-2">
                    <select
                      name="labourGrade"
                      value={formData.labourGrade}
                      onChange={(e) => {
                        if (e.target.value === 'custom') {
                          setShowCustomLabourGrade(true);
                          setFormData(prev => ({ ...prev, labourGrade: '' }));
                        } else {
                          handleChange(e);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Labour Grade</option>
                      <optgroup label="Grade A (Highest)">
                        <option value="A1">A1 - Executive Management</option>
                        <option value="A2">A2 - Senior Management</option>
                        <option value="A3">A3 - Middle Management</option>
                      </optgroup>
                      <optgroup label="Grade B (Professional)">
                        <option value="B1">B1 - Senior Professional</option>
                        <option value="B2">B2 - Professional</option>
                        <option value="B3">B3 - Junior Professional</option>
                      </optgroup>
                      <optgroup label="Grade C (Skilled)">
                        <option value="C1">C1 - Highly Skilled Technician</option>
                        <option value="C2">C2 - Skilled Technician</option>
                        <option value="C3">C3 - Skilled Worker</option>
                      </optgroup>
                      <optgroup label="Grade D (Semi-Skilled)">
                        <option value="D1">D1 - Semi-Skilled Worker Level 1</option>
                        <option value="D2">D2 - Semi-Skilled Worker Level 2</option>
                      </optgroup>
                      <optgroup label="Grade E (Support)">
                        <option value="E1">E1 - General Worker</option>
                        <option value="E2">E2 - Helper</option>
                      </optgroup>
                      <optgroup label="Custom">
                        <option value="custom">➕ Add Custom Labour Grade</option>
                      </optgroup>
                    </select>
                    <p className="text-xs text-gray-500">As per GCC Labour Law classification</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customLabourGrade}
                        onChange={(e) => setCustomLabourGrade(e.target.value.toUpperCase())}
                        placeholder="Enter custom labour grade (e.g., F1, G2)"
                        maxLength={5}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customLabourGrade.trim()) {
                            setFormData(prev => ({ ...prev, labourGrade: customLabourGrade.trim() }));
                            setShowCustomLabourGrade(false);
                            setCustomLabourGrade('');
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomLabourGrade(false);
                          setCustomLabourGrade('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Enter a custom labour grade code (max 5 characters)</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reports To
                </label>
                <input
                  type="text"
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={handleChange}
                  placeholder="e.g., VP Operations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief overview of the role, its purpose, and key objectives..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Salary Range Section */}
          <div className="mb-3 bg-green-50 rounded-lg p-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Salary Range
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary (Annual) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="minSalary"
                    value={formData.minSalary}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g., 350000"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary (Annual) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="maxSalary"
                    value={formData.maxSalary}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g., 550000"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            {formData.minSalary && formData.maxSalary && (
              <div className="mt-3 text-sm text-gray-600">
                <p>Salary Range: ₹{(Number(formData.minSalary)/100000).toFixed(1)}L - ₹{(Number(formData.maxSalary)/100000).toFixed(1)}L per annum</p>
              </div>
            )}
          </div>

          {/* Responsibilities Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Key Responsibilities
            </h3>
            <div className="space-y-3">
              {responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => updateResponsibility(index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addResponsibility}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Responsibility
              </button>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Qualifications & Requirements
            </h3>
            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Requirement
              </button>
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Designation Status</h3>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Inactive</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="deprecated"
                  checked={formData.status === 'deprecated'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Deprecated</span>
              </label>
            </div>
          </div>

          {/* Summary Card */}
          <div className="mb-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-900 mb-3">Designation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Designation Code</p>
                <p className="font-semibold text-gray-900">{formData.code || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Department</p>
                <p className="font-semibold text-gray-900">{formData.department || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Level</p>
                <p className="font-semibold text-gray-900">{formData.level.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Grade</p>
                <p className="font-semibold text-gray-900">{formData.grade || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Labour Category</p>
                <p className="font-semibold text-gray-900">{formData.labourCategory || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Labour Grade (GCC)</p>
                <p className="font-semibold text-gray-900">{formData.labourGrade || '-'}</p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Designation code must be unique across the organization</li>
                  <li>Labour Category & Grade are mandatory as per GCC Labour Law requirements</li>
                  <li>Salary ranges should align with labour grade and industry standards</li>
                  <li>Responsibilities and requirements help in job postings and evaluations</li>
                  <li>Deprecated designations won't appear in active hiring workflows</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Add Designation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
