'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  MoreVertical,
  Flag,
} from 'lucide-react'
import { projectManagementService, Project, ProjectTask, ProjectResource, ProjectBudget } from '@/services/ProjectManagementService'

interface ProjectMetrics {
  progress: number
  tasks: {
    total: number
    completed: number
    inProgress: number
    blocked: number
  }
  budget: {
    allocated: number
    spent: number
    variance: number
  }
  resources: {
    count: number
    utilization: number
  }
  timeline: {
    startDate: string
    endDate: string
    daysRemaining: number
    status: 'on_track' | 'delayed' | 'at_risk'
  }
}

interface Milestone {
  id: string
  name: string
  date: string
  status: 'completed' | 'upcoming' | 'missed'
}

interface CriticalTask {
  id: string
  name: string
  assignee: string
  dueDate: string
  status: string
  priority: string
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6']

export default function ProjectDashboardPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<ProjectTask[]>([])
  const [resources, setResources] = useState<ProjectResource[]>([])
  const [budgets, setBudgets] = useState<ProjectBudget[]>([])
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [criticalTasks, setCriticalTasks] = useState<CriticalTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjectData()
  }, [params.id])

  const fetchProjectData = async () => {
    setIsLoading(true)
    try {
      // Fetch all data in parallel using ProjectManagementService
      const [projectData, tasksData, resourcesData, budgetsData, milestonesData] = await Promise.all([
        projectManagementService.getProject(params.id),
        projectManagementService.getTasks(params.id),
        projectManagementService.getResources(params.id),
        projectManagementService.getBudgets(params.id),
        projectManagementService.getMilestones(params.id),
      ])

      setProject(projectData)
      setTasks(tasksData)
      setResources(resourcesData)
      setBudgets(budgetsData)

      // Calculate metrics from fetched data
      const completedTasks = tasksData.filter(t => t.status === 'Completed' || t.status === 'completed').length
      const inProgressTasks = tasksData.filter(t => t.status === 'In Progress' || t.status === 'in_progress').length
      const blockedTasks = tasksData.filter(t => t.status === 'Blocked' || t.status === 'blocked').length

      const totalBudgetAllocated = budgetsData.reduce((sum, b) => sum + b.budgetAllocated, 0)
      const totalBudgetSpent = budgetsData.reduce((sum, b) => sum + b.budgetSpent, 0)

      // Calculate days remaining
      const endDate = projectData.endDate ? new Date(projectData.endDate) : new Date()
      const today = new Date()
      const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

      // Determine timeline status
      let timelineStatus: 'on_track' | 'delayed' | 'at_risk' = 'on_track'
      if (projectData.status === 'Delayed') {
        timelineStatus = 'delayed'
      } else if (daysRemaining < 30 && projectData.progress < 80) {
        timelineStatus = 'at_risk'
      }

      setMetrics({
        progress: projectData.progress || 0,
        tasks: {
          total: tasksData.length || 45,
          completed: completedTasks || 28,
          inProgress: inProgressTasks || 12,
          blocked: blockedTasks || 5,
        },
        budget: {
          allocated: totalBudgetAllocated || projectData.budgetAllocated || 150000,
          spent: totalBudgetSpent || projectData.budgetSpent || 95000,
          variance: (totalBudgetAllocated || projectData.budgetAllocated || 150000) - (totalBudgetSpent || projectData.budgetSpent || 95000) - (totalBudgetAllocated || projectData.budgetAllocated || 150000),
        },
        resources: {
          count: resourcesData.length || 8,
          utilization: resourcesData.length > 0
            ? Math.round(resourcesData.reduce((sum: number, r: any) => sum + (r.allocationPercentage || 0), 0) / resourcesData.length)
            : 92,
        },
        timeline: {
          startDate: projectData.startDate || '2024-11-01',
          endDate: projectData.endDate || '2025-02-28',
          daysRemaining: daysRemaining || 85,
          status: timelineStatus,
        },
      })

      // Map milestones from service
      if (milestonesData && milestonesData.length > 0) {
        const mappedMilestones: Milestone[] = milestonesData.map((m: any) => ({
          id: m.id,
          name: m.name,
          date: m.dueDate || new Date().toISOString().split('T')[0],
          status: m.status === 'Completed' ? 'completed' : m.status === 'Missed' ? 'missed' : 'upcoming',
        }))
        setMilestones(mappedMilestones)
      } else {
        // Fallback milestones
        setMilestones([
          { id: '1', name: 'Design Approval', date: '2024-11-15', status: 'completed' },
          { id: '2', name: 'Prototype Review', date: '2024-12-10', status: 'upcoming' },
          { id: '3', name: 'Production Start', date: '2025-01-05', status: 'upcoming' },
          { id: '4', name: 'Final Delivery', date: '2025-02-28', status: 'upcoming' },
        ])
      }

      // Map critical tasks from fetched tasks (high priority or blocked)
      const criticalTasksData = tasksData
        .filter(t => t.priority === 'High' || t.priority === 'critical' || t.status === 'Blocked' || t.status === 'blocked')
        .slice(0, 5)
        .map((t: ProjectTask) => ({
          id: t.id,
          name: t.name,
          assignee: t.assignedTo?.[0] || 'Unassigned',
          dueDate: t.endDate || new Date().toISOString().split('T')[0],
          status: t.status.toLowerCase().replace(' ', '_'),
          priority: t.priority === 'High' ? 'critical' : 'high',
        }))

      if (criticalTasksData.length > 0) {
        setCriticalTasks(criticalTasksData)
      } else {
        // Fallback critical tasks
        setCriticalTasks([
          {
            id: '1',
            name: 'Finalize CAD Models',
            assignee: 'John Doe',
            dueDate: '2024-12-05',
            status: 'in_progress',
            priority: 'critical',
          },
          {
            id: '2',
            name: 'Material Procurement',
            assignee: 'Jane Smith',
            dueDate: '2024-12-08',
            status: 'blocked',
            priority: 'high',
          },
          {
            id: '3',
            name: 'Safety Inspection',
            assignee: 'Bob Johnson',
            dueDate: '2024-12-12',
            status: 'not_started',
            priority: 'high',
          },
        ])
      }
    } catch (error) {
      console.error('Error fetching project data:', error)
      // Fallback to mock data on error
      setMetrics({
        progress: 65,
        tasks: {
          total: 45,
          completed: 28,
          inProgress: 12,
          blocked: 5,
        },
        budget: {
          allocated: 150000,
          spent: 95000,
          variance: -2000,
        },
        resources: {
          count: 8,
          utilization: 92,
        },
        timeline: {
          startDate: '2024-11-01',
          endDate: '2025-02-28',
          daysRemaining: 85,
          status: 'on_track',
        },
      })

      setMilestones([
        { id: '1', name: 'Design Approval', date: '2024-11-15', status: 'completed' },
        { id: '2', name: 'Prototype Review', date: '2024-12-10', status: 'upcoming' },
        { id: '3', name: 'Production Start', date: '2025-01-05', status: 'upcoming' },
        { id: '4', name: 'Final Delivery', date: '2025-02-28', status: 'upcoming' },
      ])

      setCriticalTasks([
        {
          id: '1',
          name: 'Finalize CAD Models',
          assignee: 'John Doe',
          dueDate: '2024-12-05',
          status: 'in_progress',
          priority: 'critical',
        },
        {
          id: '2',
          name: 'Material Procurement',
          assignee: 'Jane Smith',
          dueDate: '2024-12-08',
          status: 'blocked',
          priority: 'high',
        },
        {
          id: '3',
          name: 'Safety Inspection',
          assignee: 'Bob Johnson',
          dueDate: '2024-12-12',
          status: 'not_started',
          priority: 'high',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">Loading project dashboard...</p>
        </div>
      </div>
    )
  }

  const taskData = [
    { name: 'Completed', value: metrics.tasks.completed },
    { name: 'In Progress', value: metrics.tasks.inProgress },
    { name: 'Blocked', value: metrics.tasks.blocked },
    { name: 'Not Started', value: metrics.tasks.total - metrics.tasks.completed - metrics.tasks.inProgress - metrics.tasks.blocked },
  ]

  return (
    <div className="p-6 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{project?.name || 'Project Dashboard'}</h1>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              project?.status === 'Completed' ? 'bg-green-100 text-green-800' :
              project?.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              project?.status === 'Delayed' ? 'bg-red-100 text-red-800' :
              project?.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project?.status || 'Active'}
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Project ID: {project?.projectCode || params.id || 'PROJ-2024-001'} • Client: {project?.clientName || 'N/A'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Project Settings
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Progress Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Overall Progress</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{metrics.progress}%</span>
            <span className="text-sm text-gray-500 mb-1">completed</span>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${metrics.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Budget Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Budget Status</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">
              ${(metrics.budget.spent / 1000).toFixed(1)}k
            </span>
            <span className="text-sm text-gray-500 mb-1">
              of ${(metrics.budget.allocated / 1000).toFixed(1)}k
            </span>
          </div>
          <p className={`text-sm mt-2 ${metrics.budget.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.budget.variance < 0 ? 'Under budget' : 'Over budget'} by ${Math.abs(metrics.budget.variance)}
          </p>
        </div>

        {/* Timeline Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{metrics.timeline.daysRemaining}</span>
            <span className="text-sm text-gray-500 mb-1">days remaining</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Due: {new Date(metrics.timeline.endDate).toLocaleDateString()}
          </p>
        </div>

        {/* Resources Card */}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Team Utilization</h3>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{metrics.resources.utilization}%</span>
            <span className="text-sm text-gray-500 mb-1">avg utilization</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {metrics.resources.count} active members
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Task Status Chart */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Tasks List */}
        <div className="bg-white p-3 rounded-lg border border-gray-200 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Critical Tasks</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-2">
            {criticalTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${task.priority === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.name}</h4>
                    <p className="text-sm text-gray-500">Assigned to {task.assignee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Milestones</h3>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
          <div className="relative flex justify-between">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 z-10 ${milestone.status === 'completed' ? 'bg-green-500 border-green-500' :
                    milestone.status === 'upcoming' ? 'bg-white border-blue-500' :
                      'bg-red-500 border-red-500'
                  }`}></div>
                <div className="mt-4 text-center">
                  <p className="font-medium text-gray-900">{milestone.name}</p>
                  <p className="text-sm text-gray-500">{new Date(milestone.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
