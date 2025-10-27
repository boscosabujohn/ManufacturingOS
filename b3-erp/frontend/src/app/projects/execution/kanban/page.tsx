'use client';

import { useState, useMemo } from 'react';
import { Trello, Search, Filter, Settings, User, Calendar, Tag, AlertCircle, Clock } from 'lucide-react';

interface KanbanCard {
  id: string;
  taskNumber: string;
  title: string;
  description: string;
  projectCode: string;
  projectName: string;
  assignee: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate: string;
  estimatedHours: number;
  tags: string[];
  column: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
}

const mockKanbanData: KanbanCard[] = [
  {
    id: '1',
    taskNumber: 'TASK-1001',
    title: 'Design Kitchen Layout',
    description: 'Create detailed layout drawings with measurements',
    projectCode: 'PRJ-2025-001',
    projectName: 'Kitchen Fitout - Tower A',
    assignee: 'Priya Patel',
    priority: 'high',
    dueDate: '2025-10-28',
    estimatedHours: 16,
    tags: ['design', 'planning'],
    column: 'done'
  },
  {
    id: '2',
    taskNumber: 'TASK-1002',
    title: 'Procure Hardware',
    description: 'Order hinges, handles, and drawer slides',
    projectCode: 'PRJ-2025-001',
    projectName: 'Kitchen Fitout - Tower A',
    assignee: 'Procurement Team',
    priority: 'critical',
    dueDate: '2025-10-29',
    estimatedHours: 8,
    tags: ['procurement', 'materials'],
    column: 'in-progress'
  },
  {
    id: '3',
    taskNumber: 'TASK-1003',
    title: 'Fabricate Base Cabinets',
    description: '12 base cabinet units with soft-close drawers',
    projectCode: 'PRJ-2025-001',
    projectName: 'Kitchen Fitout - Tower A',
    assignee: 'Workshop A',
    priority: 'high',
    dueDate: '2025-11-01',
    estimatedHours: 120,
    tags: ['fabrication', 'carpentry'],
    column: 'in-progress'
  },
  {
    id: '4',
    taskNumber: 'TASK-1004',
    title: 'Install Countertop',
    description: 'Black galaxy granite countertop installation',
    projectCode: 'PRJ-2025-001',
    projectName: 'Kitchen Fitout - Tower A',
    assignee: 'Stone Contractor',
    priority: 'medium',
    dueDate: '2025-11-03',
    estimatedHours: 16,
    tags: ['installation', 'granite'],
    column: 'todo'
  },
  {
    id: '5',
    taskNumber: 'TASK-1005',
    title: 'Quality Inspection',
    description: 'Final QC check before handover',
    projectCode: 'PRJ-2025-001',
    projectName: 'Kitchen Fitout - Tower A',
    assignee: 'QC Team',
    priority: 'high',
    dueDate: '2025-11-09',
    estimatedHours: 8,
    tags: ['quality', 'inspection'],
    column: 'backlog'
  },
  {
    id: '6',
    taskNumber: 'TASK-2001',
    title: 'Wardrobe Design Approval',
    description: 'Get client sign-off on wardrobe designs',
    projectCode: 'PRJ-2025-002',
    projectName: 'Luxury Villa Wardrobes',
    assignee: 'Design Lead',
    priority: 'critical',
    dueDate: '2025-10-27',
    estimatedHours: 12,
    tags: ['design', 'approval'],
    column: 'review'
  },
  {
    id: '7',
    taskNumber: 'TASK-2002',
    title: 'Fabricate Wardrobe Frames',
    description: 'Build 6 wardrobe carcass units',
    projectCode: 'PRJ-2025-002',
    projectName: 'Luxury Villa Wardrobes',
    assignee: 'Carpentry Team',
    priority: 'high',
    dueDate: '2025-11-05',
    estimatedHours: 160,
    tags: ['fabrication', 'carpentry'],
    column: 'in-progress'
  },
  {
    id: '8',
    taskNumber: 'TASK-2003',
    title: 'Install Wardrobe Internals',
    description: 'Drawers, shelves, and accessories installation',
    projectCode: 'PRJ-2025-002',
    projectName: 'Luxury Villa Wardrobes',
    assignee: 'Fitting Team',
    priority: 'medium',
    dueDate: '2025-11-10',
    estimatedHours: 68,
    tags: ['installation', 'fitting'],
    column: 'todo'
  },
  {
    id: '9',
    taskNumber: 'TASK-3001',
    title: 'Site Survey',
    description: 'Measure pantry area and confirm dimensions',
    projectCode: 'PRJ-2025-003',
    projectName: 'Corporate Pantry Rollout',
    assignee: 'Site Engineer',
    priority: 'high',
    dueDate: '2025-10-26',
    estimatedHours: 8,
    tags: ['survey', 'planning'],
    column: 'done'
  },
  {
    id: '10',
    taskNumber: 'TASK-3002',
    title: 'Fabricate Pantry Units',
    description: 'Modular pantry base and wall units',
    projectCode: 'PRJ-2025-003',
    projectName: 'Corporate Pantry Rollout',
    assignee: 'Production Head',
    priority: 'critical',
    dueDate: '2025-10-30',
    estimatedHours: 192,
    tags: ['fabrication', 'production'],
    column: 'in-progress'
  },
  {
    id: '11',
    taskNumber: 'TASK-3003',
    title: 'Install & Commission',
    description: 'Site installation and final commissioning',
    projectCode: 'PRJ-2025-003',
    projectName: 'Corporate Pantry Rollout',
    assignee: 'Installation Manager',
    priority: 'high',
    dueDate: '2025-11-02',
    estimatedHours: 80,
    tags: ['installation', 'commissioning'],
    column: 'todo'
  },
  {
    id: '12',
    taskNumber: 'TASK-4001',
    title: 'Demolition Work',
    description: 'Remove existing fixtures and fittings',
    projectCode: 'PRJ-2025-004',
    projectName: 'Showroom Refurbishment',
    assignee: 'Demolition Contractor',
    priority: 'high',
    dueDate: '2025-10-25',
    estimatedHours: 64,
    tags: ['demolition', 'site-prep'],
    column: 'done'
  },
  {
    id: '13',
    taskNumber: 'TASK-4002',
    title: 'Build Display Wall',
    description: 'Modular display wall system with LED lighting',
    projectCode: 'PRJ-2025-004',
    projectName: 'Showroom Refurbishment',
    assignee: 'Installation Team',
    priority: 'critical',
    dueDate: '2025-11-01',
    estimatedHours: 160,
    tags: ['fabrication', 'installation'],
    column: 'in-progress'
  },
  {
    id: '14',
    taskNumber: 'TASK-4003',
    title: 'Reception Desk Setup',
    description: 'Custom reception desk with Corian top',
    projectCode: 'PRJ-2025-004',
    projectName: 'Showroom Refurbishment',
    assignee: 'Fabrication Team',
    priority: 'medium',
    dueDate: '2025-11-05',
    estimatedHours: 80,
    tags: ['fabrication', 'furniture'],
    column: 'review'
  },
  {
    id: '15',
    taskNumber: 'TASK-5001',
    title: 'Hotel Room Refurbishment',
    description: 'Wardrobe and furniture refurbishment for 50 rooms',
    projectCode: 'PRJ-2025-005',
    projectName: 'Hotel Renovation Phase 2',
    assignee: 'Project Team',
    priority: 'high',
    dueDate: '2025-11-15',
    estimatedHours: 400,
    tags: ['furniture', 'refurbishment'],
    column: 'todo'
  }
];

const columns = [
  { id: 'backlog', name: 'Backlog', color: 'gray' },
  { id: 'todo', name: 'To Do', color: 'blue' },
  { id: 'in-progress', name: 'In Progress', color: 'yellow' },
  { id: 'review', name: 'Review', color: 'purple' },
  { id: 'done', name: 'Done', color: 'green' }
] as const;

export default function KanbanBoardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Get unique projects
  const projects = useMemo(() =>
    ['all', ...Array.from(new Set(mockKanbanData.map(c => c.projectName)))],
    []
  );

  // Filter cards
  const filteredCards = useMemo(() => {
    return mockKanbanData.filter(card => {
      const matchesSearch = searchTerm === '' ||
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.taskNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesProject = projectFilter === 'all' || card.projectName === projectFilter;
      const matchesPriority = priorityFilter === 'all' || card.priority === priorityFilter;

      return matchesSearch && matchesProject && matchesPriority;
    });
  }, [searchTerm, projectFilter, priorityFilter]);

  // Group cards by column
  const cardsByColumn = useMemo(() => {
    const grouped: Record<string, KanbanCard[]> = {
      'backlog': [],
      'todo': [],
      'in-progress': [],
      'review': [],
      'done': []
    };

    filteredCards.forEach(card => {
      grouped[card.column].push(card);
    });

    return grouped;
  }, [filteredCards]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCards = mockKanbanData.length;
    const backlogCount = mockKanbanData.filter(c => c.column === 'backlog').length;
    const todoCount = mockKanbanData.filter(c => c.column === 'todo').length;
    const inProgressCount = mockKanbanData.filter(c => c.column === 'in-progress').length;
    const reviewCount = mockKanbanData.filter(c => c.column === 'review').length;
    const doneCount = mockKanbanData.filter(c => c.column === 'done').length;

    return {
      totalCards,
      backlogCount,
      todoCount,
      inProgressCount,
      reviewCount,
      doneCount
    };
  }, []);

  const getPriorityColor = (priority: KanbanCard['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getColumnColor = (color: string) => {
    switch (color) {
      case 'gray': return 'bg-gray-50 border-gray-300';
      case 'blue': return 'bg-blue-50 border-blue-300';
      case 'yellow': return 'bg-yellow-50 border-yellow-300';
      case 'purple': return 'bg-purple-50 border-purple-300';
      case 'green': return 'bg-green-50 border-green-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Trello className="h-8 w-8 text-teal-600" />
          Kanban Board
        </h1>
        <p className="text-gray-600 mt-2">Visual task management with drag-and-drop workflow</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tasks by title, number, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <Settings className="h-4 w-4" />
              Board Settings
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Backlog</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.backlogCount}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">To Do</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.todoCount}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">In Progress</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.inProgressCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Review</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{stats.reviewCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-600 text-sm font-medium">Done</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.doneCount}</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
          <p className="text-teal-600 text-sm font-medium">Total Tasks</p>
          <p className="text-2xl font-bold text-teal-900 mt-1">{stats.totalCards}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="h-4 w-4 text-gray-500" />

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {projects.map(project => (
              <option key={project} value={project}>
                {project === 'all' ? 'All Projects' : project}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredCards.length} of {mockKanbanData.length} tasks
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-full">
          {columns.map((column) => (
            <div key={column.id} className="flex-1 min-w-[300px]">
              <div className={`rounded-lg border-2 ${getColumnColor(column.color)} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">{column.name}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-white rounded-full border border-gray-300">
                    {cardsByColumn[column.id].length}
                  </span>
                </div>

                <div className="space-y-3">
                  {cardsByColumn[column.id].map((card) => (
                    <div key={card.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(card.priority)}`}>
                          {card.priority.toUpperCase()}
                        </span>
                        {isOverdue(card.dueDate) && card.column !== 'done' && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded border border-red-300 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            OVERDUE
                          </span>
                        )}
                      </div>

                      <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>

                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <span className="font-medium">{card.taskNumber}</span>
                        <span>•</span>
                        <span className="truncate">{card.projectName}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {card.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                        {card.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{card.tags.length - 2}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <User className="h-4 w-4" />
                          <span className="text-xs">{card.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs">{new Date(card.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{card.estimatedHours}h estimated</span>
                      </div>
                    </div>
                  ))}

                  {cardsByColumn[column.id].length === 0 && (
                    <div className="bg-white bg-opacity-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                      <p className="text-sm text-gray-500">No tasks in this column</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Kanban Board Guidelines</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Workflow Stages</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium">Backlog:</span> Tasks identified but not yet scheduled for work</li>
              <li><span className="font-medium">To Do:</span> Tasks ready to start, prioritized and assigned</li>
              <li><span className="font-medium">In Progress:</span> Active work in progress</li>
              <li><span className="font-medium">Review:</span> Work completed, pending review or approval</li>
              <li><span className="font-medium">Done:</span> Completed and approved tasks</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">WIP Limits</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Limit work in progress to improve focus and flow</li>
              <li>• Recommended WIP limit: 3-5 tasks per person</li>
              <li>• Pull tasks from To Do only when capacity available</li>
              <li>• Complete tasks before starting new ones</li>
              <li>• Identify and resolve bottlenecks quickly</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Card Management</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Keep cards updated with current status and progress</li>
              <li>• Add comments for important updates and decisions</li>
              <li>• Use tags to categorize and filter tasks</li>
              <li>• Set due dates and track deadlines</li>
              <li>• Assign ownership clearly to team members</li>
              <li>• Break down large tasks into smaller cards</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Best Practices</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Hold daily standup meetings using the board</li>
              <li>• Review and groom backlog regularly</li>
              <li>• Prioritize tasks based on business value</li>
              <li>• Move cards left-to-right through workflow</li>
              <li>• Address blocked tasks immediately</li>
              <li>• Celebrate completed tasks as team wins</li>
              <li>• Continuously improve workflow based on metrics</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Kanban Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="font-medium mb-1">Visualize Work:</p>
              <p>Make all work visible on the board to improve transparency</p>
            </div>
            <div>
              <p className="font-medium mb-1">Limit WIP:</p>
              <p>Control work in progress to optimize flow and reduce multitasking</p>
            </div>
            <div>
              <p className="font-medium mb-1">Manage Flow:</p>
              <p>Monitor and optimize the movement of work through stages</p>
            </div>
            <div>
              <p className="font-medium mb-1">Continuous Improvement:</p>
              <p>Regularly review metrics and adjust process for better efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
