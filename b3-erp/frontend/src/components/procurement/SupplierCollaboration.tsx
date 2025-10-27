'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, MessageCircle, FileText, Calendar, Bell, Share2,
  Briefcase, Target, TrendingUp, Clock, CheckCircle, AlertTriangle,
  Plus, Search, Filter, Download, Upload, Eye, Edit3,
  Video, Phone, Mail, Globe, Star, Award, Shield, Zap,
  BarChart3, PieChart, Activity, Package, DollarSign
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface SupplierCollaborationProps {}

const SupplierCollaboration: React.FC<SupplierCollaborationProps> = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showNewProject, setShowNewProject] = useState(false);

  // Mock supplier data
  const suppliers = [
    {
      id: 'SUP001',
      name: 'Tech Components Ltd',
      contact: 'John Smith',
      email: 'john@techcomponents.com',
      phone: '+1-555-0123',
      status: 'active',
      tier: 'strategic',
      projects: 8,
      rating: 4.8,
      lastActivity: '2024-12-16',
      collaborationScore: 92
    },
    {
      id: 'SUP002',
      name: 'Metal Works Inc',
      contact: 'Sarah Johnson',
      email: 'sarah@metalworks.com',
      phone: '+1-555-0234',
      status: 'active',
      tier: 'preferred',
      projects: 5,
      rating: 4.6,
      lastActivity: '2024-12-15',
      collaborationScore: 87
    },
    {
      id: 'SUP003',
      name: 'Global Electronics',
      contact: 'Mike Chen',
      email: 'mike@globalelectronics.com',
      phone: '+1-555-0345',
      status: 'active',
      tier: 'approved',
      projects: 3,
      rating: 4.4,
      lastActivity: '2024-12-14',
      collaborationScore: 79
    }
  ];

  // Mock collaboration projects
  const collaborationProjects = [
    {
      id: 'PROJ001',
      title: 'Product Cost Reduction Initiative',
      supplier: 'Tech Components Ltd',
      status: 'in_progress',
      priority: 'high',
      startDate: '2024-11-01',
      endDate: '2025-02-28',
      progress: 65,
      savings: 45000,
      team: ['John Smith', 'Lisa Wong', 'Mark Davis'],
      description: 'Joint initiative to reduce component costs by 15% through design optimization'
    },
    {
      id: 'PROJ002',
      title: 'Sustainability Program',
      supplier: 'Metal Works Inc',
      status: 'planning',
      priority: 'medium',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      progress: 15,
      savings: 28000,
      team: ['Sarah Johnson', 'David Lee'],
      description: 'Implementing sustainable manufacturing practices and materials'
    },
    {
      id: 'PROJ003',
      title: 'Innovation Partnership',
      supplier: 'Global Electronics',
      status: 'completed',
      priority: 'high',
      startDate: '2024-08-01',
      endDate: '2024-12-15',
      progress: 100,
      savings: 62000,
      team: ['Mike Chen', 'Anna Wilson', 'Tom Brown'],
      description: 'Joint R&D project for next-generation electronic components'
    }
  ];

  // Mock communication threads
  const communicationThreads = [
    {
      id: 'THREAD001',
      subject: 'Q1 2025 Pricing Discussion',
      supplier: 'Tech Components Ltd',
      participants: ['John Smith', 'Lisa Wong'],
      lastMessage: 'Updated pricing proposal attached for review',
      timestamp: '2024-12-16 14:30',
      unread: 2,
      priority: 'high'
    },
    {
      id: 'THREAD002',
      subject: 'Delivery Schedule Update',
      supplier: 'Metal Works Inc',
      participants: ['Sarah Johnson', 'David Lee'],
      lastMessage: 'Confirming delivery for next week as scheduled',
      timestamp: '2024-12-16 11:15',
      unread: 0,
      priority: 'medium'
    },
    {
      id: 'THREAD003',
      subject: 'Quality Improvement Plan',
      supplier: 'Global Electronics',
      participants: ['Mike Chen', 'Anna Wilson'],
      lastMessage: 'Action items from yesterday\'s meeting attached',
      timestamp: '2024-12-15 16:45',
      unread: 1,
      priority: 'medium'
    }
  ];

  // Mock shared documents
  const sharedDocuments = [
    {
      id: 'DOC001',
      name: 'Technical Specifications v2.1',
      supplier: 'Tech Components Ltd',
      type: 'specification',
      size: '2.3 MB',
      lastModified: '2024-12-16',
      status: 'current',
      version: '2.1'
    },
    {
      id: 'DOC002',
      name: 'Quality Agreement 2025',
      supplier: 'Metal Works Inc',
      type: 'contract',
      size: '1.8 MB',
      lastModified: '2024-12-15',
      status: 'pending_approval',
      version: '1.0'
    },
    {
      id: 'DOC003',
      name: 'Innovation Roadmap',
      supplier: 'Global Electronics',
      type: 'presentation',
      size: '5.2 MB',
      lastModified: '2024-12-14',
      status: 'current',
      version: '3.0'
    }
  ];

  // Mock performance metrics
  const performanceMetrics = [
    { metric: 'Communication Response Time', value: '2.3 hours', target: '< 4 hours', status: 'good' },
    { metric: 'Project Completion Rate', value: '94%', target: '> 90%', status: 'good' },
    { metric: 'Innovation Score', value: '8.7/10', target: '> 8.0', status: 'good' },
    { metric: 'Collaboration Satisfaction', value: '4.6/5', target: '> 4.0', status: 'good' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Collaboration Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-blue-500" />
            <span className="text-sm text-green-600">+5 this month</span>
          </div>
          <p className="text-2xl font-bold">{suppliers.length}</p>
          <p className="text-sm text-gray-600">Active Partners</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="h-8 w-8 text-green-500" />
            <span className="text-sm text-blue-600">8 active</span>
          </div>
          <p className="text-2xl font-bold">{collaborationProjects.length}</p>
          <p className="text-sm text-gray-600">Joint Projects</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="h-8 w-8 text-purple-500" />
            <span className="text-sm text-orange-600">3 unread</span>
          </div>
          <p className="text-2xl font-bold">{communicationThreads.length}</p>
          <p className="text-sm text-gray-600">Active Discussions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-orange-500" />
            <span className="text-sm text-green-600">+12% YTD</span>
          </div>
          <p className="text-2xl font-bold">$135K</p>
          <p className="text-sm text-gray-600">Collaboration Value</p>
        </div>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New message from Tech Components Ltd</p>
                <p className="text-xs text-gray-600">Q1 2025 Pricing Discussion - 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Innovation Partnership project completed</p>
                <p className="text-xs text-gray-600">Global Electronics - 1 day ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Document shared: Quality Agreement 2025</p>
                <p className="text-xs text-gray-600">Metal Works Inc - 1 day ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Meeting scheduled: Cost Reduction Review</p>
                <p className="text-xs text-gray-600">Tech Components Ltd - 2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Collaboration Performance</h3>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <span className={`text-sm ${
                    metric.status === 'good' ? 'text-green-600' :
                    metric.status === 'warning' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {metric.value}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        metric.status === 'good' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} style={{ width: '85%' }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{metric.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Active Collaboration Projects</h3>
          <button
            onClick={() => setShowNewProject(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {collaborationProjects.filter(p => p.status !== 'completed').map((project) => (
            <div key={project.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{project.title}</h4>
                  <p className="text-sm text-gray-600">{project.supplier}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.priority === 'high' ? 'bg-red-100 text-red-800' :
                  project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {project.priority.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">{project.description}</p>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Start:</span>
                  <span className="ml-1">{project.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">End:</span>
                  <span className="ml-1">{project.endDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Savings:</span>
                  <span className="ml-1 font-semibold">${(project.savings / 1000).toFixed(0)}K</span>
                </div>
                <div>
                  <span className="text-gray-600">Team:</span>
                  <span className="ml-1">{project.team.length} members</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
                  View Details
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                  <MessageCircle className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">Message</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-6">
      {/* Supplier Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search suppliers..."
                className="outline-none"
              />
            </div>
            <select className="px-3 py-2 border rounded-lg">
              <option>All Tiers</option>
              <option>Strategic</option>
              <option>Preferred</option>
              <option>Approved</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Filter</span>
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Invite Supplier
            </button>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-semibold">{supplier.name}</h4>
                  <p className="text-sm text-gray-600">{supplier.contact}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                supplier.tier === 'strategic' ? 'bg-purple-100 text-purple-800' :
                supplier.tier === 'preferred' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {supplier.tier.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{supplier.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Projects</p>
                <p className="font-semibold">{supplier.projects}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{supplier.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Collaboration Score</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${supplier.collaborationScore}%` }}
                    />
                  </div>
                  <span className="text-sm">{supplier.collaborationScore}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Activity</p>
                <p className="text-sm">{supplier.lastActivity}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
                Collaborate
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <MessageCircle className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Message</span>
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Video className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Video</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Supplier Performance Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Supplier Collaboration Scores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={suppliers.map(s => ({
            name: s.name.split(' ')[0],
            score: s.collaborationScore,
            projects: s.projects,
            rating: s.rating * 20
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#3B82F6" name="Collaboration Score" />
            <Bar dataKey="rating" fill="#10B981" name="Rating (scaled)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-6">
      {/* Communication Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Communication Center</h3>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Discussion
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Notifications</span>
            </button>
          </div>
        </div>
      </div>

      {/* Communication Threads */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg px-3 py-2 flex-1">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="outline-none flex-1"
              />
            </div>
            <select className="px-3 py-2 border rounded-lg">
              <option>All Suppliers</option>
              <option>Tech Components Ltd</option>
              <option>Metal Works Inc</option>
              <option>Global Electronics</option>
            </select>
            <select className="px-3 py-2 border rounded-lg">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        <div className="divide-y">
          {communicationThreads.map((thread) => (
            <div key={thread.id} className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{thread.subject}</h4>
                    {thread.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {thread.unread}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      thread.priority === 'high' ? 'bg-red-100 text-red-800' :
                      thread.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {thread.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{thread.supplier}</p>
                  <p className="text-sm">{thread.lastMessage}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{thread.timestamp}</span>
                    <span>Participants: {thread.participants.join(', ')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <MessageCircle className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">Message</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Response Time Trends</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { week: 'W1', avgResponse: 3.2, target: 4 },
              { week: 'W2', avgResponse: 2.8, target: 4 },
              { week: 'W3', avgResponse: 3.5, target: 4 },
              { week: 'W4', avgResponse: 2.3, target: 4 },
              { week: 'W5', avgResponse: 2.9, target: 4 },
              { week: 'W6', avgResponse: 2.1, target: 4 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgResponse" stroke="#3B82F6" name="Avg Response (hours)" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#10B981" strokeDasharray="5 5" name="Target (hours)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Communication Volume</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={[
              { month: 'Jul', messages: 45, meetings: 12 },
              { month: 'Aug', messages: 52, meetings: 15 },
              { month: 'Sep', messages: 48, meetings: 11 },
              { month: 'Oct', messages: 58, meetings: 18 },
              { month: 'Nov', messages: 61, meetings: 16 },
              { month: 'Dec', messages: 55, meetings: 14 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="messages" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Messages" />
              <Area type="monotone" dataKey="meetings" stackId="1" stroke="#10B981" fill="#10B981" name="Meetings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {/* Document Management Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Shared Documents</h3>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Share2 className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg px-3 py-2 flex-1">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search documents..."
              className="outline-none flex-1"
            />
          </div>
          <select className="px-3 py-2 border rounded-lg">
            <option>All Suppliers</option>
            <option>Tech Components Ltd</option>
            <option>Metal Works Inc</option>
            <option>Global Electronics</option>
          </select>
          <select className="px-3 py-2 border rounded-lg">
            <option>All Types</option>
            <option>Contracts</option>
            <option>Specifications</option>
            <option>Presentations</option>
            <option>Reports</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <span className="font-medium">Recent Documents</span>
            <span className="text-sm text-gray-600">{sharedDocuments.length} documents</span>
          </div>
        </div>

        <div className="divide-y">
          {sharedDocuments.map((doc) => (
            <div key={doc.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{doc.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{doc.supplier}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Type: {doc.type}</span>
                      <span>Size: {doc.size}</span>
                      <span>Modified: {doc.lastModified}</span>
                      <span>Version: {doc.version}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    doc.status === 'current' ? 'bg-green-100 text-green-800' :
                    doc.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Download className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Download</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Share2 className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Document Types Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={[
                  { name: 'Contracts', value: 35, color: '#3B82F6' },
                  { name: 'Specifications', value: 30, color: '#10B981' },
                  { name: 'Presentations', value: 20, color: '#F59E0B' },
                  { name: 'Reports', value: 15, color: '#EF4444' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { color: '#3B82F6' },
                  { color: '#10B981' },
                  { color: '#F59E0B' },
                  { color: '#EF4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-4">Document Activity</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Documents Shared This Month</span>
              <span className="font-semibold">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending Approvals</span>
              <span className="font-semibold text-yellow-600">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Version Control Updates</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Download Activity</span>
              <span className="font-semibold">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Storage Used</span>
              <span className="font-semibold">2.3 GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Plus = ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Supplier Collaboration Portal</h2>
        <p className="text-gray-600">Enhance supplier partnerships through seamless collaboration</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {['dashboard', 'suppliers', 'communication', 'documents'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'suppliers' && renderSuppliers()}
      {activeTab === 'communication' && renderCommunication()}
      {activeTab === 'documents' && renderDocuments()}
    </div>
  );
};

export default SupplierCollaboration;