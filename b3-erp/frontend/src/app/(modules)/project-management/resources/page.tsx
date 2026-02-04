'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
 Search,
 Plus,
 Users,
 Briefcase,
 CheckCircle,
 Clock,
 AlertCircle,
 TrendingUp,
 Calendar,
 Eye,
 Edit,
 Mail,
 Phone,
 MoreVertical,
 UserPlus,
 Activity,
 Award,
 DollarSign,
 FileText,
 GitCompare,
} from 'lucide-react';
import {
 AddResourceModal,
 EditResourceModal,
 AssignToProjectModal,
 ResourceCalendarModal,
 ResourceWorkloadModal,
 RequestResourceModal,
 SkillsMatrixModal,
 CostRatesModal,
 AvailabilityPlanningModal,
 ResourceHistoryModal,
 BulkAssignModal,
 ResourceComparisonModal,
} from '@/components/project-management/ResourceModals';

import { projectManagementService, Project, ProjectResource } from '@/services/ProjectManagementService'

interface PageResource {
 id: string;
 employeeId: string;
 name: string;
 role: string;
 department: string;
 email: string;
 phone: string;
 skills: string[];
 currentProject: string;
 currentProjectId: string;
 allocation: number;
 availability: number;
 status: 'Available' | 'Partially Available' | 'Fully Allocated' | 'On Leave';
 totalProjects: number;
 completedProjects: number;
 efficiency: number;
 costRate: number;
 location: string;
 experienceYears: number;
}

export default function ResourcesListPage() {
 const [resources, setResources] = useState<PageResource[]>([])
 const [projects, setProjects] = useState<Project[]>([])
 const [selectedProjectId, setSelectedProjectId] = useState<string>('')
 const [isLoading, setIsLoading] = useState(true)
 const [searchTerm, setSearchTerm] = useState('');
 const [statusFilter, setStatusFilter] = useState('All');
 const [roleFilter, setRoleFilter] = useState('All');
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 10;

 // Modal states
 const [modals, setModals] = useState({
  addResource: false,
  editResource: false,
  assignToProject: false,
  resourceCalendar: false,
  resourceWorkload: false,
  requestResource: false,
  skillsMatrix: false,
  costRates: false,
  availabilityPlanning: false,
  resourceHistory: false,
  bulkAssign: false,
  resourceComparison: false,
 });

 const [selectedResource, setSelectedResource] = useState<PageResource | null>(null);
 const [selectedResources, setSelectedResources] = useState<PageResource[]>([]);
 const [showResourceMenu, setShowResourceMenu] = useState<string | null>(null);

 useEffect(() => {
  fetchProjects()
 }, [])

 useEffect(() => {
  if (selectedProjectId) {
   fetchProjectResources(selectedProjectId)
  }
 }, [selectedProjectId])

 const fetchProjects = async () => {
  try {
   const data = await projectManagementService.getProjects()
   setProjects(data)
   if (data.length > 0) {
    setSelectedProjectId(data[0].id)
   } else {
    setIsLoading(false)
   }
  } catch (error) {
   console.error('Failed to fetch projects:', error)
   setIsLoading(false)
  }
 }

 const fetchProjectResources = async (projectId: string) => {
  setIsLoading(true)
  try {
   const data = await projectManagementService.getResources(projectId)
   const mappedResources: PageResource[] = data.map((r: any) => ({
    id: r.id,
    employeeId: r.user?.employeeId || 'N/A',
    name: r.user?.name || 'Unknown User',
    role: r.role || 'Team Member',
    department: r.user?.department || 'Engineering',
    email: r.user?.email || '',
    phone: r.user?.phone || '',
    skills: r.user?.skills || [],
    currentProject: projects.find(p => p.id === projectId)?.name || 'Unknown',
    currentProjectId: projectId,
    allocation: r.allocationPercentage,
    availability: 100 - r.allocationPercentage,
    status: r.allocationPercentage >= 100 ? 'Fully Allocated' : r.allocationPercentage > 0 ? 'Partially Available' : 'Available',
    totalProjects: 0,
    completedProjects: 0,
    efficiency: 90,
    costRate: 0,
    location: 'On Site',
    experienceYears: 0,
   }))
   setResources(mappedResources)
  } catch (error) {
   console.error('Failed to fetch resources:', error)
  } finally {
   setIsLoading(false)
  }
 }

 const openModal = (modalName: keyof typeof modals, resource?: PageResource) => {
  if (resource) setSelectedResource(resource);
  setModals({ ...modals, [modalName]: true });
 };

 const closeModal = (modalName: keyof typeof modals) => {
  setModals({ ...modals, [modalName]: false });
  setSelectedResource(null);
 };

 const handleModalSubmit = (modalName: string, data: any) => {
  console.log(`${modalName} submitted:`, data);
  // Here you would typically make an API call to save the data
 };

 // Calculate statistics
 const stats = {
  total: resources.length,
  available: resources.filter(r => r.status === 'Available').length,
  fullyAllocated: resources.filter(r => r.status === 'Fully Allocated').length,
  partiallyAvailable: resources.filter(r => r.status === 'Partially Available').length,
  avgUtilization: resources.length > 0 ? Math.round(resources.reduce((sum, r) => sum + r.allocation, 0) / resources.length) : 0,
  avgEfficiency: resources.length > 0 ? Math.round(resources.reduce((sum, r) => sum + r.efficiency, 0) / resources.length) : 0,
 };

 // Filter resources
 const filteredResources = resources.filter(resource => {
  const matchesSearch =
   resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
   resource.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
   resource.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
   resource.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
  const matchesStatus = statusFilter === 'All' || resource.status === statusFilter;
  const matchesRole = roleFilter === 'All' || resource.role === roleFilter;
  return matchesSearch && matchesStatus && matchesRole;
 });

 // Pagination
 const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
 const startIndex = (currentPage - 1) * itemsPerPage;
 const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage);

 const getStatusColor = (status: string) => {
  switch (status) {
   case 'Available': return 'bg-green-100 text-green-700';
   case 'Partially Available': return 'bg-yellow-100 text-yellow-700';
   case 'Fully Allocated': return 'bg-blue-100 text-blue-700';
   case 'On Leave': return 'bg-gray-100 text-gray-700';
   default: return 'bg-gray-100 text-gray-700';
  }
 };

 const getStatusIcon = (status: string) => {
  switch (status) {
   case 'Available': return <CheckCircle className="w-4 h-4" />;
   case 'Partially Available': return <Clock className="w-4 h-4" />;
   case 'Fully Allocated': return <AlertCircle className="w-4 h-4" />;
   default: return <Clock className="w-4 h-4" />;
  }
 };

 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
   style: 'currency',
   currency: 'INR',
   minimumFractionDigits: 0,
  }).format(amount);
 };

 const roles = Array.from(new Set(resources.map(r => r.role)));

 return (
  <div className="w-full min-h-screen px-3 py-2 space-y-3">
   {/* Header Actions */}
   <div className="flex justify-between items-center mb-2">
    <div className="flex gap-2 items-center">
     <select
      value={selectedProjectId}
      onChange={(e) => setSelectedProjectId(e.target.value)}
      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
     >
      {projects.map((project) => (
       <option key={project.id} value={project.id}>
        {project.name}
       </option>
      ))}
     </select>
     {selectedResources.length > 0 && (
      <>
       <button
        onClick={() => openModal('bulkAssign')}
        className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
       >
        <UserPlus className="w-5 h-5" />
        Bulk Assign ({selectedResources.length})
       </button>
       <button
        onClick={() => setSelectedResources([])}
        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
       >
        Clear Selection
       </button>
      </>
     )}
    </div>
    <div className="flex gap-2">
     <button
      onClick={() => openModal('resourceComparison')}
      className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
     >
      <GitCompare className="w-5 h-5" />
      Compare Resources
     </button>
     <button
      onClick={() => openModal('requestResource')}
      className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
     >
      <Users className="w-5 h-5" />
      Request Resource
     </button>
     <button
      onClick={() => openModal('addResource')}
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
     >
      <Plus className="w-5 h-5" />
      Add Resource
     </button>
    </div>
   </div>

   {/* Statistics Cards */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Total Resources</p>
       <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
       <Users className="w-6 h-6 text-blue-600" />
      </div>
     </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Available</p>
       <p className="text-3xl font-bold text-green-900 mt-1">{stats.available}</p>
      </div>
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
       <CheckCircle className="w-6 h-6 text-green-600" />
      </div>
     </div>
     <div className="mt-2">
      <span className="text-sm text-gray-500">{stats.partiallyAvailable} partially available</span>
     </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Avg Utilization</p>
       <p className="text-3xl font-bold text-blue-900 mt-1">{stats.avgUtilization}%</p>
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
       <TrendingUp className="w-6 h-6 text-blue-600" />
      </div>
     </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between">
      <div>
       <p className="text-sm text-gray-600">Avg Efficiency</p>
       <p className="text-3xl font-bold text-purple-900 mt-1">{stats.avgEfficiency}%</p>
      </div>
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
       <TrendingUp className="w-6 h-6 text-purple-600" />
      </div>
     </div>
    </div>
   </div>

   {/* Filters */}
   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
     {/* Search */}
     <div className="lg:col-span-2">
      <div className="relative">
       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
       <input
        type="text"
        placeholder="Search by name, role, or skills..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
       />
      </div>
     </div>

     {/* Status Filter */}
     <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     >
      <option value="All">All Status</option>
      <option value="Available">Available</option>
      <option value="Partially Available">Partially Available</option>
      <option value="Fully Allocated">Fully Allocated</option>
      <option value="On Leave">On Leave</option>
     </select>

     {/* Role Filter */}
     <select
      value={roleFilter}
      onChange={(e) => setRoleFilter(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     >
      <option value="All">All Roles</option>
      {roles.map(role => (
       <option key={role} value={role}>{role}</option>
      ))}
     </select>
    </div>
   </div>

   {/* Resources List */}
   <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="divide-y divide-gray-200">
     {paginatedResources.map((resource) => (
      <div key={resource.id} className="p-6 hover:bg-gray-50 transition-colors">
       <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
         {/* Avatar */}
         <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xl font-bold">
          {resource.name.split(' ').map(n => n[0]).join('')}
         </div>

         {/* Details */}
         <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
           <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
           <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
            {getStatusIcon(resource.status)}
            {resource.status}
           </span>
           <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {resource.employeeId}
           </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
           <div>
            <p className="text-xs text-gray-500">Role</p>
            <div className="flex items-center gap-1 mt-1">
             <Briefcase className="w-3 h-3 text-gray-400" />
             <p className="text-sm font-medium text-gray-900">{resource.role}</p>
            </div>
            <p className="text-xs text-gray-500">{resource.department}</p>
           </div>
           <div>
            <p className="text-xs text-gray-500">Experience</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{resource.experienceYears} years</p>
            <p className="text-xs text-gray-500">{resource.location}</p>
           </div>
           <div>
            <p className="text-xs text-gray-500">Projects</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
             {resource.completedProjects}/{resource.totalProjects} completed
            </p>
            <p className="text-xs text-green-600">Efficiency: {resource.efficiency}%</p>
           </div>
           <div>
            <p className="text-xs text-gray-500">Cost Rate</p>
            <p className="text-sm font-medium text-gray-900 mt-1">{formatCurrency(resource.costRate)}/day</p>
           </div>
          </div>

          {/* Allocation Progress */}
          <div className="mb-3">
           <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Current Allocation</span>
            <span className="text-xs font-medium text-gray-900">
             {resource.allocation}% allocated · {resource.availability}% available
            </span>
           </div>
           <div className="w-full bg-gray-200 rounded-full h-2">
            <div
             className={`h-2 rounded-full ${resource.allocation === 100 ? 'bg-red-500' :
              resource.allocation >= 70 ? 'bg-yellow-500' :
               'bg-green-500'
              }`}
             style={{ width: `${resource.allocation}%` }}
            ></div>
           </div>
          </div>

          {/* Current Project */}
          {resource.currentProject && (
           <div className="mb-3 bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
             <Calendar className="w-4 h-4 text-blue-600" />
             <span className="text-xs text-gray-600">Current Project:</span>
             <Link
              href={`/project-management/view/${resource.currentProjectId}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
             >
              {resource.currentProject}
             </Link>
            </div>
           </div>
          )}

          {/* Skills */}
          <div className="mb-3">
           <p className="text-xs text-gray-500 mb-2">Skills</p>
           <div className="flex flex-wrap gap-2">
            {resource.skills.map((skill, index) => (
             <span
              key={index}
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
             >
              {skill}
             </span>
            ))}
           </div>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2 text-sm">
           <div className="flex items-center gap-1 text-gray-600">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${resource.email}`} className="hover:text-blue-600">
             {resource.email}
            </a>
           </div>
           <div className="flex items-center gap-1 text-gray-600">
            <Phone className="w-4 h-4" />
            <a href={`tel:${resource.phone}`} className="hover:text-blue-600">
             {resource.phone}
            </a>
           </div>
          </div>
         </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
         <input
          type="checkbox"
          checked={selectedResources.some(r => r.id === resource.id)}
          onChange={(e) => {
           if (e.target.checked) {
            setSelectedResources([...selectedResources, resource]);
           } else {
            setSelectedResources(selectedResources.filter(r => r.id !== resource.id));
           }
          }}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
         />
         <div className="relative">
          <button
           onClick={() => setShowResourceMenu(showResourceMenu === resource.id ? null : resource.id)}
           className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
           <MoreVertical className="w-4 h-4" />
          </button>
          {showResourceMenu === resource.id && (
           <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
             <button
              onClick={() => {
               openModal('editResource', resource);
               setShowResourceMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             >
              <Edit className="w-4 h-4" />
              Edit Resource
             </button>
             <button
              onClick={() => {
               openModal('assignToProject', resource);
               setShowResourceMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             >
              <UserPlus className="w-4 h-4" />
              Assign to Project
             </button>
             <button
              onClick={() => {
               openModal('resourceCalendar', resource);
               setShowResourceMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             >
              <Calendar className="w-4 h-4" />
              View Calendar
             </button>
             <button
              onClick={() => {
               openModal('resourceWorkload', resource);
               setShowResourceMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             >
              <Activity className="w-4 h-4" />
              View Workload
             </button>
             <button
              onClick={() => {
               openModal('skillsMatrix', resource);
               setShowResourceMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             >
              <Award className="w-4 h-4" />
              Skills Matrix
             </button>
             <button
              onClick={() => {
               openModal('costRates', resource);
               setShowResourceMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             >
              <DollarSign className="w-4 h-4" />
              Cost Rates
             </button>
             <button
              onClick={() => {
               openModal('availabilityPlanning', resource);
               setShowResourceMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             >
              <Clock className="w-4 h-4" />
              Availability Planning
             </button>
             <button
              onClick={() => {
               openModal('resourceHistory', resource);
               setShowResourceMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
             >
              <FileText className="w-4 h-4" />
              Resource History
             </button>
            </div>
           </div>
          )}
         </div>
        </div>
       </div>
      </div>
     ))}
    </div>

    {/* Pagination */}
    <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex items-center justify-between">
     <div className="text-sm text-gray-700">
      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResources.length)} of{' '}
      {filteredResources.length} resources
     </div>
     <div className="flex gap-2">
      <button
       onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
       disabled={currentPage === 1}
       className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
       Previous
      </button>
      <button
       onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
       disabled={currentPage === totalPages}
       className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
       Next
      </button>
     </div>
    </div>
   </div>

   {/* All Modals */}
   <AddResourceModal
    isOpen={modals.addResource}
    onClose={() => closeModal('addResource')}
    onSubmit={(data) => handleModalSubmit('addResource', data)}
   />

   {selectedResource && (
    <>
     <EditResourceModal
      isOpen={modals.editResource}
      onClose={() => closeModal('editResource')}
      resource={selectedResource}
      onSubmit={(data) => handleModalSubmit('editResource', data)}
     />

     <AssignToProjectModal
      isOpen={modals.assignToProject}
      onClose={() => closeModal('assignToProject')}
      resource={selectedResource}
      onSubmit={(data) => handleModalSubmit('assignToProject', data)}
     />

     <ResourceCalendarModal
      isOpen={modals.resourceCalendar}
      onClose={() => closeModal('resourceCalendar')}
      resource={selectedResource}
     />

     <ResourceWorkloadModal
      isOpen={modals.resourceWorkload}
      onClose={() => closeModal('resourceWorkload')}
      resource={selectedResource}
     />

     <SkillsMatrixModal
      isOpen={modals.skillsMatrix}
      onClose={() => closeModal('skillsMatrix')}
      resource={selectedResource}
      onSubmit={(data) => handleModalSubmit('skillsMatrix', data)}
     />

     <CostRatesModal
      isOpen={modals.costRates}
      onClose={() => closeModal('costRates')}
      resource={selectedResource}
      onSubmit={(data) => handleModalSubmit('costRates', data)}
     />

     <AvailabilityPlanningModal
      isOpen={modals.availabilityPlanning}
      onClose={() => closeModal('availabilityPlanning')}
      resource={selectedResource}
      onSubmit={(data) => handleModalSubmit('availabilityPlanning', data)}
     />

     <ResourceHistoryModal
      isOpen={modals.resourceHistory}
      onClose={() => closeModal('resourceHistory')}
      resource={selectedResource}
     />
    </>
   )}

   <RequestResourceModal
    isOpen={modals.requestResource}
    onClose={() => closeModal('requestResource')}
    onSubmit={(data) => handleModalSubmit('requestResource', data)}
   />

   <BulkAssignModal
    isOpen={modals.bulkAssign}
    onClose={() => closeModal('bulkAssign')}
    selectedResources={selectedResources}
    onSubmit={(data) => handleModalSubmit('bulkAssign', data)}
   />

   <ResourceComparisonModal
    isOpen={modals.resourceComparison}
    onClose={() => closeModal('resourceComparison')}
    resources={resources as any}
    onSelect={(resource) => {
     setSelectedResource(resource as any);
     closeModal('resourceComparison');
     openModal('editResource', resource as any);
    }}
   />
  </div>
 );
}
