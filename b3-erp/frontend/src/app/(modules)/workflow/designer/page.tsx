'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Workflow,
  ArrowLeft,
  Plus,
  Save,
  Play,
  GitBranch,
  Circle,
  Square,
  Diamond,
  Zap,
  Users,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
} from 'lucide-react';

export default function WorkflowDesignerPage() {
  const [workflowName, setWorkflowName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('manual');

  const nodeTypes = [
    { id: 'start', name: 'Start', icon: Circle, color: 'bg-green-500' },
    { id: 'action', name: 'Action', icon: Square, color: 'bg-blue-500' },
    { id: 'condition', name: 'Condition', icon: Diamond, color: 'bg-yellow-500' },
    { id: 'approval', name: 'Approval', icon: Users, color: 'bg-purple-500' },
    { id: 'notification', name: 'Notification', icon: Mail, color: 'bg-orange-500' },
    { id: 'delay', name: 'Delay', icon: Clock, color: 'bg-gray-500' },
    { id: 'end', name: 'End', icon: CheckCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/workflow"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-cyan-600" />
                <h1 className="text-xl font-bold text-gray-900">Workflow Designer</h1>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                <Play className="w-4 h-4" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Workflow Details */}
          <div className="col-span-3 space-y-6">
            {/* Workflow Info */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Workflow Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Enter workflow name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this workflow"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trigger Type
                  </label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="manual">Manual Trigger</option>
                    <option value="automatic">Automatic</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Node Palette */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Workflow Elements</h3>
              <div className="space-y-2">
                {nodeTypes.map((node) => {
                  const Icon = node.icon;
                  return (
                    <button
                      key={node.id}
                      className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors"
                    >
                      <div className={`${node.color} w-8 h-8 rounded flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{node.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center - Canvas */}
          <div className="col-span-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 h-[calc(100vh-200px)]">
              <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Workflow Canvas</h3>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="p-6 h-full overflow-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Design Your Workflow
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Drag and drop elements from the left panel to create your workflow
                    </p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 mx-auto">
                      <Plus className="w-4 h-4" />
                      Add Start Node
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Node Properties</h3>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  Select a node to view and edit its properties
                </p>
              </div>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Templates</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors">
                  <p className="font-medium text-gray-900 text-sm">Approval Workflow</p>
                  <p className="text-xs text-gray-600 mt-1">Simple approval process</p>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors">
                  <p className="font-medium text-gray-900 text-sm">Document Review</p>
                  <p className="text-xs text-gray-600 mt-1">Multi-stage review</p>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors">
                  <p className="font-medium text-gray-900 text-sm">Escalation Flow</p>
                  <p className="text-xs text-gray-600 mt-1">Auto-escalation rules</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Workflow className="w-8 h-8 text-cyan-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Workflow Designer</h2>
          <p className="text-gray-600 mb-6">
            The visual workflow designer is coming soon! You'll be able to create complex automated workflows with a drag-and-drop interface.
          </p>
          <div className="space-y-2 mb-6 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Drag-and-drop workflow builder</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Pre-built templates</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Real-time testing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Version control</span>
            </div>
          </div>
          <Link
            href="/workflow"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Workflows
          </Link>
        </div>
      </div>
    </div>
  );
}
