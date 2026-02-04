'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Save,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  FileText,
  Target,
  Activity,
  Settings,
  Upload,
  Download,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Layers,
} from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Resource {
  id?: string;
  employeeId?: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  skills: string[];
  currentProject?: string;
  currentProjectId?: string;
  allocation?: number;
  availability?: number;
  status: 'Available' | 'Partially Available' | 'Fully Allocated' | 'On Leave';
  totalProjects?: number;
  completedProjects?: number;
  efficiency?: number;
  costRate: number;
  location: string;
  experienceYears: number;
}

// ==============================================
// 1. ADD RESOURCE MODAL
// ==============================================
interface AddResourceModalProps extends BaseModalProps {
  onSubmit: (data: Resource) => void;
}

export function AddResourceModal({ isOpen, onClose, onSubmit }: AddResourceModalProps) {
  const [formData, setFormData] = useState<Resource>({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    skills: [],
    status: 'Available',
    costRate: 0,
    location: '',
    experienceYears: 0,
  });
  const [skillInput, setSkillInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Add New Resource</h2>
              <p className="text-blue-100 text-sm">Create a new resource profile</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.employeeId || ''}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="EMP-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select role</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Electrical Engineer">Electrical Engineer</option>
                  <option value="Senior Designer">Senior Designer</option>
                  <option value="Installation Supervisor">Installation Supervisor</option>
                  <option value="Project Coordinator">Project Coordinator</option>
                  <option value="Installation Technician">Installation Technician</option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Commissioning Engineer">Commissioning Engineer</option>
                  <option value="Site Supervisor">Site Supervisor</option>
                  <option value="Civil Engineer">Civil Engineer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Commissioning">Commissioning</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91-98765-43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Skills & Expertise
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cost & Status */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Cost & Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Rate (per day) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.costRate}
                  onChange={(e) => setFormData({ ...formData, costRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Status <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Available">Available</option>
                  <option value="Partially Available">Partially Available</option>
                  <option value="Fully Allocated">Fully Allocated</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 2. EDIT RESOURCE MODAL
// ==============================================
interface EditResourceModalProps extends BaseModalProps {
  resource: Resource;
  onSubmit: (data: Resource) => void;
}

export function EditResourceModal({ isOpen, onClose, resource, onSubmit }: EditResourceModalProps) {
  const [formData, setFormData] = useState<Resource>(resource);
  const [skillInput, setSkillInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Resource</h2>
              <p className="text-purple-100 text-sm">Update resource profile</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Similar to Add Resource Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  required
                  value={formData.employeeId || ''}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Skills & Expertise
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:bg-purple-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cost & Status */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Cost & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Rate (per day)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.costRate}
                  onChange={(e) => setFormData({ ...formData, costRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Available">Available</option>
                  <option value="Partially Available">Partially Available</option>
                  <option value="Fully Allocated">Fully Allocated</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 3. ASSIGN TO PROJECT MODAL
// ==============================================
interface AssignToProjectModalProps extends BaseModalProps {
  resource: Resource;
  onSubmit: (data: { projectId: string; projectName: string; allocation: number; startDate: string; endDate: string }) => void;
}

export function AssignToProjectModal({ isOpen, onClose, resource, onSubmit }: AssignToProjectModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    allocation: 50,
    startDate: '',
    endDate: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const mockProjects = [
    { id: 'PRJ-2024-001', name: 'Taj Hotel Commercial Kitchen' },
    { id: 'PRJ-2024-002', name: 'BigBasket Cold Storage' },
    { id: 'PRJ-2024-003', name: 'L&T Switchgear Panel' },
    { id: 'PRJ-2024-004', name: 'ITC Grand Kitchen' },
    { id: 'PRJ-2024-005', name: 'Godrej Cold Room' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Assign to Project</h2>
              <p className="text-green-100 text-sm">Assign {resource.name} to a project</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.projectId}
              onChange={(e) => {
                const project = mockProjects.find(p => p.id === e.target.value);
                setFormData({ ...formData, projectId: e.target.value, projectName: project?.name || '' });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select project</option>
              {mockProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.id} - {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allocation Percentage <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={formData.allocation}
                onChange={(e) => setFormData({ ...formData, allocation: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">0%</span>
                <span className="font-semibold text-green-600 text-lg">{formData.allocation}%</span>
                <span className="text-gray-600">100%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Current availability warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Current Availability</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {resource.name} currently has {resource.availability}% availability. New allocation: {formData.allocation}%
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Assign Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 4. RESOURCE CALENDAR MODAL
// ==============================================
interface ResourceCalendarModalProps extends BaseModalProps {
  resource: Resource;
}

export function ResourceCalendarModal({ isOpen, onClose, resource }: ResourceCalendarModalProps) {
  if (!isOpen) return null;

  const mockBookings = [
    { id: 1, project: 'Taj Hotel Kitchen', start: '2024-01-15', end: '2024-03-30', allocation: 100, status: 'Active' },
    { id: 2, project: 'ITC Grand Design', start: '2024-04-01', end: '2024-05-15', allocation: 60, status: 'Scheduled' },
    { id: 3, project: 'Prestige Modular Kitchen', start: '2024-05-20', end: '2024-06-30', allocation: 80, status: 'Scheduled' },
  ];

  const mockLeaves = [
    { id: 1, type: 'Annual Leave', start: '2024-03-10', end: '2024-03-15' },
    { id: 2, type: 'Sick Leave', start: '2024-04-20', end: '2024-04-22' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resource Calendar</h2>
              <p className="text-indigo-100 text-sm">{resource.name} - Availability & Bookings</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {/* Current Status */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-sm text-gray-600">Current Allocation</p>
                <p className="text-2xl font-bold text-indigo-900">{resource.allocation}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-900">{resource.availability}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {resource.status}
                </span>
              </div>
            </div>
          </div>

          {/* Project Bookings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Project Bookings
            </h3>
            <div className="space-y-3">
              {mockBookings.map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{booking.project}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-medium">{booking.start}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-medium">{booking.end}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Allocation</p>
                      <p className="font-medium text-indigo-600">{booking.allocation}%</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${booking.allocation}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaves */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Scheduled Leaves
            </h3>
            <div className="space-y-3">
              {mockLeaves.map(leave => (
                <div key={leave.id} className="border border-orange-200 bg-orange-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{leave.type}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {leave.start} to {leave.end}
                      </p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 5. RESOURCE WORKLOAD MODAL
// ==============================================
interface ResourceWorkloadModalProps extends BaseModalProps {
  resource: Resource;
}

export function ResourceWorkloadModal({ isOpen, onClose, resource }: ResourceWorkloadModalProps) {
  if (!isOpen) return null;

  const mockWorkload = {
    currentWeek: { planned: 40, actual: 35, overtime: 5 },
    nextWeek: { planned: 40, actual: 0, overtime: 0 },
    projects: [
      { name: 'Taj Hotel Kitchen', hours: 32, percentage: 80, color: 'bg-blue-500' },
      { name: 'ITC Grand Design', hours: 8, percentage: 20, color: 'bg-green-500' },
    ],
    tasks: [
      { id: 1, task: 'Site Installation - Phase 1', project: 'Taj Hotel Kitchen', hours: 20, dueDate: '2024-03-15', priority: 'High', status: 'In Progress' },
      { id: 2, task: 'Equipment Testing', project: 'Taj Hotel Kitchen', hours: 12, dueDate: '2024-03-18', priority: 'High', status: 'In Progress' },
      { id: 3, task: '3D Design Review', project: 'ITC Grand Design', hours: 8, dueDate: '2024-03-20', priority: 'Medium', status: 'Pending' },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resource Workload</h2>
              <p className="text-cyan-100 text-sm">{resource.name} - All Assignments & Capacity</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {/* Weekly Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Current Week</h3>
              </div>
              <p className="text-3xl font-bold text-blue-900">{mockWorkload.currentWeek.planned}h</p>
              <p className="text-sm text-gray-600 mt-1">Planned Hours</p>
              <div className="mt-2 text-sm">
                <span className="text-green-600">✓ {mockWorkload.currentWeek.actual}h completed</span>
                {mockWorkload.currentWeek.overtime > 0 && (
                  <span className="text-orange-600 ml-2">+{mockWorkload.currentWeek.overtime}h overtime</span>
                )}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Capacity</h3>
              </div>
              <p className="text-3xl font-bold text-green-900">{resource.allocation}%</p>
              <p className="text-sm text-gray-600 mt-1">Current Allocation</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${resource.allocation}%` }}></div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Efficiency</h3>
              </div>
              <p className="text-3xl font-bold text-purple-900">{resource.efficiency}%</p>
              <p className="text-sm text-gray-600 mt-1">Performance Rating</p>
            </div>
          </div>

          {/* Project Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-cyan-600" />
              Project Distribution
            </h3>
            <div className="space-y-3">
              {mockWorkload.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <span className="text-sm font-medium text-gray-600">{project.hours}h/week</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className={`${project.color} h-3 rounded-full`} style={{ width: `${project.percentage}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-12 text-right">{project.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tasks */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Active Tasks ({mockWorkload.tasks.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Task</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Project</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockWorkload.tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.task}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{task.project}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{task.hours}h</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{task.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-between items-center rounded-b-xl">
          <button className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 6. REQUEST RESOURCE MODAL
// ==============================================
interface RequestResourceModalProps extends BaseModalProps {
  onSubmit: (data: any) => void;
}

export function RequestResourceModal({ isOpen, onClose, onSubmit }: RequestResourceModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    role: '',
    skillsRequired: [] as string[],
    allocation: 100,
    startDate: '',
    endDate: '',
    urgency: 'Medium',
    justification: '',
  });
  const [skillInput, setSkillInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({ ...formData, skillsRequired: [...formData.skillsRequired, skillInput.trim()] });
      setSkillInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Request Resource</h2>
              <p className="text-orange-100 text-sm">Submit resource request to PMO</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select project</option>
                <option value="PRJ-2024-001">PRJ-2024-001 - Taj Hotel Kitchen</option>
                <option value="PRJ-2024-002">PRJ-2024-002 - BigBasket Cold Storage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Required <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select role</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Electrical Engineer">Electrical Engineer</option>
                <option value="Installation Supervisor">Installation Supervisor</option>
                <option value="Quality Inspector">Quality Inspector</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Add required skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skillsRequired.map((skill, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  {skill}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, skillsRequired: formData.skillsRequired.filter(s => s !== skill) })}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allocation Percentage <span className="text-red-500">*</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">0%</span>
              <span className="font-semibold text-orange-600 text-lg">{formData.allocation}%</span>
              <span className="text-gray-600">100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="Low">Low - Planning ahead</option>
              <option value="Medium">Medium - Standard timeline</option>
              <option value="High">High - Urgent requirement</option>
              <option value="Critical">Critical - Immediate need</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justification <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Explain why this resource is needed..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 7. SKILLS MATRIX MODAL
// ==============================================
interface SkillsMatrixModalProps extends BaseModalProps {
  resource: Resource;
  onSubmit: (skills: any[]) => void;
}

export function SkillsMatrixModal({ isOpen, onClose, resource, onSubmit }: SkillsMatrixModalProps) {
  const [skills, setSkills] = useState([
    { skill: 'Project Planning', level: 4, yearsOfExp: 8, certifications: ['PMP', 'Prince2'] },
    { skill: 'Budgeting', level: 5, yearsOfExp: 10, certifications: ['CPA'] },
    { skill: 'Team Leadership', level: 4, yearsOfExp: 12, certifications: [] },
    { skill: 'Client Management', level: 5, yearsOfExp: 12, certifications: [] },
  ]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(skills);
    onClose();
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'bg-green-500';
    if (level >= 3) return 'bg-blue-500';
    if (level >= 2) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getLevelText = (level: number) => {
    if (level === 5) return 'Expert';
    if (level === 4) return 'Advanced';
    if (level === 3) return 'Intermediate';
    if (level === 2) return 'Beginner';
    return 'Novice';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-pink-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Skills Matrix</h2>
              <p className="text-pink-100 text-sm">{resource.name} - Skills & Certifications</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 border border-pink-200">
            <h3 className="font-semibold text-gray-900 mb-2">Skill Level Guide</h3>
            <div className="grid grid-cols-5 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>1 - Novice</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>2 - Beginner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>3 - Intermediate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>4 - Advanced</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span>5 - Expert</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-lg">{skill.skill}</h4>
                  <span className={`px-3 py-1 ${getLevelColor(skill.level)} text-white rounded-full text-sm font-medium`}>
                    {getLevelText(skill.level)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Proficiency Level</p>
                    <div className="flex items-center gap-2 mt-1">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div
                          key={level}
                          className={`w-8 h-2 rounded ${level <= skill.level ? getLevelColor(skill.level) : 'bg-gray-200'}`}
                        ></div>
                      ))}
                      <span className="text-sm font-medium text-gray-700">{skill.level}/5</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{skill.yearsOfExp} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Certifications</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {skill.certifications.length > 0 ? (
                        skill.certifications.map((cert, certIndex) => (
                          <span key={certIndex} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-pink-500 hover:text-pink-600 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Skill
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Skills
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 8. COST RATES MODAL
// ==============================================
interface CostRatesModalProps extends BaseModalProps {
  resource: Resource;
  onSubmit: (rates: any) => void;
}

export function CostRatesModal({ isOpen, onClose, resource, onSubmit }: CostRatesModalProps) {
  const [rates, setRates] = useState({
    standardRate: resource.costRate,
    overtimeRate: resource.costRate * 1.5,
    holidayRate: resource.costRate * 2,
    billingRate: resource.costRate * 1.3,
    currency: 'INR',
    effectiveFrom: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rates);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Cost Rates</h2>
              <p className="text-teal-100 text-sm">{resource.name} - Billing & Cost Rates</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2">Current Standard Rate</h3>
            <p className="text-3xl font-bold text-teal-900">{formatCurrency(rates.standardRate)}<span className="text-lg text-gray-600">/day</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard Rate (per day) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={rates.standardRate}
                onChange={(e) => setRates({ ...rates, standardRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-500 mt-1">Regular working hours rate</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overtime Rate (per day)
              </label>
              <input
                type="number"
                min="0"
                value={rates.overtimeRate}
                onChange={(e) => setRates({ ...rates, overtimeRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-500 mt-1">Typically 1.5x standard rate</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holiday Rate (per day)
              </label>
              <input
                type="number"
                min="0"
                value={rates.holidayRate}
                onChange={(e) => setRates({ ...rates, holidayRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-500 mt-1">Typically 2x standard rate</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Rate (per day)
              </label>
              <input
                type="number"
                min="0"
                value={rates.billingRate}
                onChange={(e) => setRates({ ...rates, billingRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-500 mt-1">Client billing rate (includes markup)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={rates.currency}
                onChange={(e) => setRates({ ...rates, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={rates.effectiveFrom}
                onChange={(e) => setRates({ ...rates, effectiveFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Rate Summary */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Rate Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Standard:</span>
                <span className="font-semibold">{formatCurrency(rates.standardRate)}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Overtime:</span>
                <span className="font-semibold">{formatCurrency(rates.overtimeRate)}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Holiday:</span>
                <span className="font-semibold">{formatCurrency(rates.holidayRate)}/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing:</span>
                <span className="font-semibold text-teal-600">{formatCurrency(rates.billingRate)}/day</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-600">Markup:</span>
                <span className="font-semibold text-green-600">
                  {((rates.billingRate - rates.standardRate) / rates.standardRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Rates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 9. AVAILABILITY PLANNING MODAL
// ==============================================
interface AvailabilityPlanningModalProps extends BaseModalProps {
  resource: Resource;
  onSubmit: (data: any) => void;
}

export function AvailabilityPlanningModal({ isOpen, onClose, resource, onSubmit }: AvailabilityPlanningModalProps) {
  const [leaveData, setLeaveData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [leaves, setLeaves] = useState([
    { id: 1, type: 'Annual Leave', start: '2024-03-10', end: '2024-03-15', days: 5, status: 'Approved' },
    { id: 2, type: 'Training', start: '2024-04-05', end: '2024-04-07', days: 3, status: 'Pending' },
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(leaveData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Availability Planning</h2>
              <p className="text-amber-100 text-sm">{resource.name} - Leaves, Training & Vacations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {/* Add New Leave */}
          <form onSubmit={handleSubmit} className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
            <h3 className="font-semibold text-gray-900">Schedule New Unavailability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={leaveData.leaveType}
                  onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select type</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Training">Training</option>
                  <option value="Conference">Conference</option>
                  <option value="Public Holiday">Public Holiday</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveData.startDate}
                    onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveData.endDate}
                    onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                value={leaveData.reason}
                onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="Optional reason..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Unavailability
            </button>
          </form>

          {/* Scheduled Leaves */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Scheduled Unavailability</h3>
            <div className="space-y-3">
              {leaves.map(leave => (
                <div key={leave.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{leave.type}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-medium">{leave.start}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-medium">{leave.end}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium">{leave.days} days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Balance */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Leave Balance</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Annual Leave</p>
                <p className="text-lg font-bold text-blue-900">12 days</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
              <div>
                <p className="text-gray-600">Sick Leave</p>
                <p className="text-lg font-bold text-green-900">8 days</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
              <div>
                <p className="text-gray-600">Training Days</p>
                <p className="text-lg font-bold text-purple-900">5 days</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 10. RESOURCE HISTORY MODAL
// ==============================================
interface ResourceHistoryModalProps extends BaseModalProps {
  resource: Resource;
}

export function ResourceHistoryModal({ isOpen, onClose, resource }: ResourceHistoryModalProps) {
  if (!isOpen) return null;

  const projectHistory = [
    {
      id: 1,
      project: 'Taj Hotel Commercial Kitchen',
      projectId: 'PRJ-2024-001',
      role: 'Project Manager',
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      status: 'In Progress',
      allocation: 100,
      performance: 92,
      deliverables: 8,
      completedDeliverables: 6,
    },
    {
      id: 2,
      project: 'ITC Grand Kitchen Design',
      projectId: 'PRJ-2023-045',
      role: 'Senior Designer',
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      status: 'Completed',
      allocation: 80,
      performance: 95,
      deliverables: 12,
      completedDeliverables: 12,
    },
    {
      id: 3,
      project: 'Oberoi Cold Room Installation',
      projectId: 'PRJ-2023-032',
      role: 'Project Manager',
      startDate: '2023-07-15',
      endDate: '2023-09-30',
      status: 'Completed',
      allocation: 100,
      performance: 88,
      deliverables: 10,
      completedDeliverables: 10,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Resource History</h2>
              <p className="text-slate-100 text-sm">{resource.name} - Past Project Assignments</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-blue-900">{resource.totalProjects}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-900">{resource.completedProjects}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-3xl font-bold text-purple-900">{resource.efficiency}%</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Experience</p>
              <p className="text-3xl font-bold text-orange-900">{resource.experienceYears}y</p>
            </div>
          </div>

          {/* Project History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Assignment History</h3>
            <div className="space-y-2">
              {projectHistory.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{project.project}</h4>
                      <p className="text-sm text-gray-600">{project.projectId} • {project.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Start Date</p>
                      <p className="text-sm font-medium">{project.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">End Date</p>
                      <p className="text-sm font-medium">{project.endDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Allocation</p>
                      <p className="text-sm font-medium text-blue-600">{project.allocation}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Performance</p>
                      <p className="text-sm font-medium text-green-600">{project.performance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Deliverables</p>
                      <p className="text-sm font-medium">
                        {project.completedDeliverables}/{project.deliverables}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(project.completedDeliverables / project.deliverables) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-between items-center rounded-b-xl">
          <button className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export History
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==============================================
// 11. BULK ASSIGN MODAL
// ==============================================
interface BulkAssignModalProps extends BaseModalProps {
  selectedResources: Resource[];
  onSubmit: (data: any) => void;
}

export function BulkAssignModal({ isOpen, onClose, selectedResources, onSubmit }: BulkAssignModalProps) {
  const [formData, setFormData] = useState({
    projectId: '',
    allocation: 50,
    startDate: '',
    endDate: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Bulk Assign Resources</h2>
              <p className="text-violet-100 text-sm">Assign {selectedResources.length} resources to a project</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Selected Resources */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Resources ({selectedResources.length})</h3>
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {selectedResources.map(resource => (
                  <span key={resource.id} className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
                    {resource.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select project</option>
              <option value="PRJ-2024-001">PRJ-2024-001 - Taj Hotel Kitchen</option>
              <option value="PRJ-2024-002">PRJ-2024-002 - BigBasket Cold Storage</option>
              <option value="PRJ-2024-003">PRJ-2024-003 - L&T Switchgear Panel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allocation Percentage <span className="text-red-500">*</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={formData.allocation}
              onChange={(e) => setFormData({ ...formData, allocation: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">0%</span>
              <span className="font-semibold text-violet-600 text-lg">{formData.allocation}%</span>
              <span className="text-gray-600">100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Assign All Resources
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==============================================
// 12. RESOURCE COMPARISON MODAL
// ==============================================
interface ResourceComparisonModalProps extends BaseModalProps {
  resources: Resource[];
  onSelect: (resource: Resource) => void;
}

export function ResourceComparisonModal({ isOpen, onClose, resources, onSelect }: ResourceComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl  w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-3 py-2 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Compare Resources</h2>
              <p className="text-rose-100 text-sm">Compare {resources.length} resources for selection</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase sticky left-0 bg-gray-50">Resource</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Experience</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Availability</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Cost Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Efficiency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Projects</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Skills</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resources.map(resource => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {resource.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{resource.name}</p>
                          <p className="text-xs text-gray-500">{resource.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{resource.role}</p>
                      <p className="text-xs text-gray-500">{resource.department}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{resource.experienceYears} years</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (resource.availability ?? 0) >= 50 ? 'bg-green-500' :
                              (resource.availability ?? 0) >= 20 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${resource.availability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{resource.availability}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">₹{resource.costRate.toLocaleString()}/day</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-4 h-4 ${
                          (resource.efficiency ?? 0) >= 90 ? 'text-green-500' :
                          (resource.efficiency ?? 0) >= 80 ? 'text-blue-500' :
                          'text-yellow-500'
                        }`} />
                        <span className="text-sm font-medium">{resource.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {resource.completedProjects}/{resource.totalProjects}
                      </p>
                      <p className="text-xs text-gray-500">completed</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {resource.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {resource.skills.length > 3 && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{resource.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onSelect(resource)}
                        className="px-3 py-1 bg-rose-600 text-white rounded text-sm hover:bg-rose-700 transition-colors"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
