'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
 FolderKanban,
 TrendingUp,
 AlertTriangle,
 CheckCircle,
 DollarSign,
 Clock,
 Users,
 Calendar,
 Package,
 BarChart3,
 ArrowRight,
 Filter,
 RefreshCw,
 Layout,
 Download,
 Bell,
 Zap,
} from 'lucide-react';
import {
 CreateProjectModal,
 QuickActionsModal,
 FilterDashboardModal,
 CustomizeWidgetsModal,
 ExportDashboardModal,
 ViewAlertsModal,
 RefreshDashboardModal,
 ViewDetailsModal,
} from '@/components/project-management/DashboardModals';

export default function ProjectDashboardPage() {
 // Modal states
 const [showCreateModal, setShowCreateModal] = useState(false);
 const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
 const [showFilterModal, setShowFilterModal] = useState(false);
 const [showCustomizeModal, setShowCustomizeModal] = useState(false);
 const [showExportModal, setShowExportModal] = useState(false);
 const [showAlertsModal, setShowAlertsModal] = useState(false);
 const [showRefreshModal, setShowRefreshModal] = useState(false);
 const [showDetailsModal, setShowDetailsModal] = useState(false);
 const [selectedProject, setSelectedProject] = useState<any>(null);

 // Statistics
 const stats = {
  totalProjects: 10,
  activeProjects: 7,
  completedProjects: 1,
  delayedProjects: 2,
  totalBudget: 95000000,
  spentAmount: 47400000,
  plannedRevenue: 118750000,
  actualRevenue: 62000000,
  resourceUtilization: 78,
  avgProjectHealth: 72,
 };

 // Recent Projects
 const recentProjects = [
  {
   id: '1',
   name: 'Taj Hotel Commercial Kitchen Installation',
   progress: 65,
   status: 'On Track',
   dueDate: '2024-04-30',
   manager: 'Rajesh Kumar',
   budget: 8500000,
   spent: 5200000,
  },
  {
   id: '2',
   name: 'BigBasket Cold Storage Facility',
   progress: 45,
   status: 'On Track',
   dueDate: '2024-05-15',
   manager: 'Priya Sharma',
   budget: 12000000,
   spent: 4800000,
  },
  {
   id: '3',
   name: 'L&T Switchgear Panel Manufacturing',
   progress: 75,
   status: 'At Risk',
   dueDate: '2024-03-20',
   manager: 'Amit Patel',
   budget: 6500000,
   spent: 5400000,
  },
  {
   id: '4',
   name: 'Siemens HT Switchgear Project',
   progress: 35,
   status: 'On Track',
   dueDate: '2024-06-15',
   manager: 'Manoj Kumar',
   budget: 15000000,
   spent: 4500000,
  },
 ];

 // Upcoming Milestones
 const upcomingMilestones = [
  { project: 'Taj Hotel Kitchen', milestone: 'Equipment Installation Complete', date: '2024-03-25', days: 8 },
  { project: 'BigBasket Cold Storage', milestone: 'Panel Assembly Complete', date: '2024-03-30', days: 13 },
  { project: 'L&T Switchgear', milestone: 'Final Testing & Documentation', date: '2024-03-20', days: 3 },
  { project: 'ITC Grand Kitchen', milestone: 'Design Approval', date: '2024-03-15', days: -2 },
 ];

 // Resource Utilization
 const resourceData = [
  { role: 'Project Managers', allocated: 8, available: 2, utilization: 80 },
  { role: 'Civil Engineers', allocated: 12, available: 3, utilization: 80 },
  { role: 'Installation Team', allocated: 45, available: 8, utilization: 85 },
  { role: 'QC Inspectors', allocated: 6, available: 2, utilization: 75 },
  { role: 'Commissioning Team', allocated: 10, available: 4, utilization: 71 },
 ];

 // Project Health Trend (last 6 months)
 const healthTrend = [
  { month: 'Oct', score: 68 },
  { month: 'Nov', score: 72 },
  { month: 'Dec', score: 70 },
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 73 },
  { month: 'Mar', score: 72 },
 ];

 const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
   style: 'currency',
   currency: 'INR',
   minimumFractionDigits: 0,
   maximumFractionDigits: 0,
  }).format(amount);
 };

 const getStatusColor = (status: string) => {
  switch (status) {
   case 'On Track': return 'bg-green-100 text-green-700';
   case 'At Risk': return 'bg-yellow-100 text-yellow-700';
   case 'Delayed': return 'bg-red-100 text-red-700';
   default: return 'bg-gray-100 text-gray-700';
  }
 };

 // Handler functions
 const handleCreateProject = (data: any) => {
  console.log('Create Project:', data);
  setShowCreateModal(false);
 };

 const handleQuickAction = (action: string) => {
  console.log('Quick Action:', action);
  setShowQuickActionsModal(false);
 };

 const handleApplyFilters = (filters: any) => {
  console.log('Apply Filters:', filters);
  setShowFilterModal(false);
 };

 const handleSaveWidgets = (widgets: any) => {
  console.log('Save Widgets:', widgets);
  setShowCustomizeModal(false);
 };

 const handleExport = (settings: any) => {
  console.log('Export Dashboard:', settings);
  setShowExportModal(false);
 };

 const handleRefresh = () => {
  console.log('Refresh Dashboard');
  setShowRefreshModal(false);
 };

 const openDetailsModal = (project: any) => {
  setSelectedProject(project);
  setShowDetailsModal(true);
 };

 return (
  <div className="w-full min-h-screen px-3 py-2 space-y-3">
   {/* Header Actions */}
   <div className="flex justify-between items-start gap-3 mb-2">
    <div className="flex items-center gap-3">
     <button
      onClick={() => setShowQuickActionsModal(true)}
      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
     >
      <Zap className="h-5 w-5" />
      <span>Quick Actions</span>
     </button>
     <button
      onClick={() => setShowFilterModal(true)}
      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
     >
      <Filter className="h-5 w-5" />
      <span>Filter</span>
     </button>
     <button
      onClick={() => setShowAlertsModal(true)}
      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
     >
      <Bell className="h-5 w-5" />
      <span>Alerts</span>
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
     </button>
    </div>
    <div className="flex items-center gap-3">
     <button
      onClick={() => setShowCustomizeModal(true)}
      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
     >
      <Layout className="h-5 w-5" />
      <span>Customize</span>
     </button>
     <button
      onClick={() => setShowExportModal(true)}
      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
     >
      <Download className="h-5 w-5" />
      <span>Export</span>
     </button>
     <button
      onClick={() => setShowRefreshModal(true)}
      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
     >
      <RefreshCw className="h-5 w-5" />
      <span>Refresh</span>
     </button>
     <Link
      href="/project-management"
      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
     >
      View All Projects
     </Link>
     <button
      onClick={() => setShowCreateModal(true)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
     >
      Create Project
     </button>
    </div>
   </div>

   {/* Key Metrics */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between mb-2">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
       <FolderKanban className="w-6 h-6 text-blue-600" />
      </div>
      <span className="text-sm text-green-600 font-medium">+2 this month</span>
     </div>
     <p className="text-sm text-gray-600 mb-1">Total Projects</p>
     <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
     <p className="text-sm text-gray-500 mt-2">{stats.activeProjects} active · {stats.completedProjects} completed</p>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between mb-2">
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
       <DollarSign className="w-6 h-6 text-green-600" />
      </div>
      <span className="text-sm text-blue-600 font-medium">
       {Math.round((stats.spentAmount / stats.totalBudget) * 100)}% spent
      </span>
     </div>
     <p className="text-sm text-gray-600 mb-1">Total Budget</p>
     <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
     <p className="text-sm text-gray-500 mt-2">Spent: {formatCurrency(stats.spentAmount)}</p>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between mb-2">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
       <TrendingUp className="w-6 h-6 text-purple-600" />
      </div>
      <span className="text-sm text-green-600 font-medium">↑ 12%</span>
     </div>
     <p className="text-sm text-gray-600 mb-1">Revenue Pipeline</p>
     <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.plannedRevenue)}</p>
     <p className="text-sm text-gray-500 mt-2">Realized: {formatCurrency(stats.actualRevenue)}</p>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between mb-2">
      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
       <AlertTriangle className="w-6 h-6 text-orange-600" />
      </div>
      <span className="text-sm text-red-600 font-medium">Needs attention</span>
     </div>
     <p className="text-sm text-gray-600 mb-1">Projects at Risk</p>
     <p className="text-3xl font-bold text-orange-900">{stats.delayedProjects}</p>
     <p className="text-sm text-gray-500 mt-2">Out of {stats.activeProjects} active projects</p>
    </div>
   </div>

   {/* Charts Row */}
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
    {/* Project Health Trend */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Health Trend</h3>
     <div className="h-64 flex items-end justify-between gap-2">
      {healthTrend.map((data, index) => (
       <div key={index} className="flex-1 flex flex-col items-center">
        <div className="w-full bg-gray-100 rounded-t relative group">
         <div
          className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
          style={{ height: `${(data.score / 100) * 200}px` }}
         >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-sm font-semibold text-gray-900">{data.score}%</span>
          </div>
         </div>
        </div>
        <span className="text-xs text-gray-600 mt-2">{data.month}</span>
       </div>
      ))}
     </div>
     <div className="mt-4 flex items-center justify-center gap-2">
      <div className="text-sm text-gray-600">Average Project Health Score:</div>
      <div className="text-lg font-bold text-blue-600">{stats.avgProjectHealth}%</div>
     </div>
    </div>

    {/* Resource Utilization */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
     <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-900">Resource Utilization</h3>
      <div className="flex items-center gap-2">
       <Users className="w-5 h-5 text-gray-400" />
       <span className="text-sm text-gray-600">Overall: {stats.resourceUtilization}%</span>
      </div>
     </div>
     <div className="space-y-2">
      {resourceData.map((resource, index) => (
       <div key={index}>
        <div className="flex items-center justify-between mb-1">
         <span className="text-sm font-medium text-gray-900">{resource.role}</span>
         <span className="text-sm text-gray-600">
          {resource.allocated} / {resource.allocated + resource.available}
         </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
         <div
          className={`h-2 rounded-full ${resource.utilization >= 85 ? 'bg-red-500' :
            resource.utilization >= 75 ? 'bg-orange-500' :
             'bg-green-500'
           }`}
          style={{ width: `${resource.utilization}%` }}
         ></div>
        </div>
        <div className="flex justify-between mt-1">
         <span className="text-xs text-gray-500">{resource.utilization}% utilized</span>
         <span className="text-xs text-green-600">{resource.available} available</span>
        </div>
       </div>
      ))}
     </div>
    </div>
   </div>

   {/* Recent Projects & Milestones */}
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
    {/* Recent Projects */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
     <div className="p-6 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
      <Link href="/project-management" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
       View All <ArrowRight className="w-4 h-4" />
      </Link>
     </div>
     <div className="divide-y divide-gray-200">
      {recentProjects.map((project) => (
       <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between mb-3">
         <div className="flex-1">
          <Link href={`/project-management/view/${project.id}`} className="text-base font-semibold text-gray-900 hover:text-blue-600">
           {project.name}
          </Link>
          <p className="text-sm text-gray-600 mt-1">PM: {project.manager}</p>
         </div>
         <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
         </span>
        </div>
        <div className="mb-3">
         <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Progress</span>
          <span className="text-xs font-medium text-gray-900">{project.progress}%</span>
         </div>
         <div className="w-full bg-gray-200 rounded-full h-2">
          <div
           className="bg-blue-600 h-2 rounded-full"
           style={{ width: `${project.progress}%` }}
          ></div>
         </div>
        </div>
        <div className="flex items-center justify-between text-sm">
         <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="w-4 h-4" />
          Due: {new Date(project.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
         </div>
         <div className="text-gray-900">
          {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
         </div>
        </div>
       </div>
      ))}
     </div>
    </div>

    {/* Upcoming Milestones */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
     <div className="p-6 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Upcoming Milestones</h3>
      <Link href="/project-management/deliverables" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
       View All <ArrowRight className="w-4 h-4" />
      </Link>
     </div>
     <div className="divide-y divide-gray-200">
      {upcomingMilestones.map((milestone, index) => (
       <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-3">
         <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${milestone.days < 0 ? 'bg-red-100' :
           milestone.days <= 7 ? 'bg-orange-100' :
            'bg-blue-100'
          }`}>
          <Package className={`w-5 h-5 ${milestone.days < 0 ? 'text-red-600' :
            milestone.days <= 7 ? 'text-orange-600' :
             'text-blue-600'
           }`} />
         </div>
         <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{milestone.milestone}</h4>
          <p className="text-sm text-gray-600 mt-1">{milestone.project}</p>
          <div className="flex items-center gap-2 mt-2">
           <Calendar className="w-4 h-4 text-gray-400" />
           <span className="text-sm text-gray-600">
            {new Date(milestone.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
           </span>
           <span className={`text-sm font-medium ${milestone.days < 0 ? 'text-red-600' :
             milestone.days <= 7 ? 'text-orange-600' :
              'text-gray-600'
            }`}>
            {milestone.days < 0 ? `${Math.abs(milestone.days)} days overdue` :
             milestone.days === 0 ? 'Due today' :
              `${milestone.days} days left`}
           </span>
          </div>
         </div>
        </div>
       </div>
      ))}
     </div>
    </div>
   </div>

   {/* Quick Actions */}
   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
     <Link href="/project-management/create" className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
       <FolderKanban className="w-6 h-6 text-blue-600" />
      </div>
      <span className="text-sm font-medium text-gray-900">Create Project</span>
     </Link>
     <Link href="/project-management/tasks" className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
       <CheckCircle className="w-6 h-6 text-purple-600" />
      </div>
      <span className="text-sm font-medium text-gray-900">View Tasks</span>
     </Link>
     <Link href="/project-management/resources" className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
       <Users className="w-6 h-6 text-green-600" />
      </div>
      <span className="text-sm font-medium text-gray-900">Manage Resources</span>
     </Link>
     <Link href="/project-management/analytics" className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
       <BarChart3 className="w-6 h-6 text-orange-600" />
      </div>
      <span className="text-sm font-medium text-gray-900">View Analytics</span>
     </Link>
    </div>
   </div>

   {/* All Modals */}
   <CreateProjectModal
    isOpen={showCreateModal}
    onClose={() => setShowCreateModal(false)}
    onCreate={handleCreateProject}
   />

   <QuickActionsModal
    isOpen={showQuickActionsModal}
    onClose={() => setShowQuickActionsModal(false)}
    onAction={handleQuickAction}
   />

   <FilterDashboardModal
    isOpen={showFilterModal}
    onClose={() => setShowFilterModal(false)}
    onApply={handleApplyFilters}
   />

   <CustomizeWidgetsModal
    isOpen={showCustomizeModal}
    onClose={() => setShowCustomizeModal(false)}
    onSave={handleSaveWidgets}
   />

   <ExportDashboardModal
    isOpen={showExportModal}
    onClose={() => setShowExportModal(false)}
    onExport={handleExport}
   />

   <ViewAlertsModal
    isOpen={showAlertsModal}
    onClose={() => setShowAlertsModal(false)}
   />

   <RefreshDashboardModal
    isOpen={showRefreshModal}
    onClose={() => setShowRefreshModal(false)}
    onRefresh={handleRefresh}
   />

   <ViewDetailsModal
    isOpen={showDetailsModal}
    onClose={() => {
     setShowDetailsModal(false);
     setSelectedProject(null);
    }}
    project={selectedProject}
   />
  </div>
 );
}
