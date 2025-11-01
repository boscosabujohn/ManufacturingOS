'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Factory,
  Users,
  Clock,
  GitBranch,
  Cog,
  Database,
  Shield,
  Bell,
  FileText,
  Zap
} from 'lucide-react';

interface SettingsCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}

export default function ProductionSettingsPage() {
  const router = useRouter();

  const settingsCategories: SettingsCategory[] = [
    {
      id: 'work-centers',
      title: 'Work Centers',
      description: 'Configure production work centers, machines, and equipment',
      icon: <Factory className="w-8 h-8" />,
      path: '/production/settings/work-centers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'lines',
      title: 'Production Lines',
      description: 'Manage production lines, assembly lines, and manufacturing cells',
      icon: <GitBranch className="w-8 h-8" />,
      path: '/production/settings/lines',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'shifts',
      title: 'Shift Management',
      description: 'Set up work shifts, calendars, and production schedules',
      icon: <Clock className="w-8 h-8" />,
      path: '/production/settings/shifts',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      id: 'routing',
      title: 'Routing Configuration',
      description: 'Define production routings, operations, and workflows',
      icon: <Cog className="w-8 h-8" />,
      path: '/production/settings/routing',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    }
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              Production Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Configure production parameters, work centers, shifts, and manufacturing settings
            </p>
          </div>
        </div>
      </div>

      {/* Settings Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {settingsCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleNavigate(category.path)}
            className={`${category.bgColor} ${category.hoverColor} border-2 border-gray-200 rounded-xl p-6 text-left transition-all hover:shadow-lg hover:border-${category.color.split('-')[1]}-300 group`}
          >
            <div className="flex items-start gap-4">
              <div className={`${category.color} ${category.bgColor} p-4 rounded-lg group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${category.color} mb-2`}>
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </div>
              <ArrowLeft className={`w-5 h-5 ${category.color} transform rotate-180 group-hover:translate-x-1 transition-transform`} />
            </div>
          </button>
        ))}
      </div>

      {/* Additional Settings Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Additional Configuration Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Quality Standards</h3>
            </div>
            <p className="text-sm text-gray-600">Configure quality check parameters and tolerances</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Alerts & Notifications</h3>
            </div>
            <p className="text-sm text-gray-600">Set up production alerts and notification rules</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Document Templates</h3>
            </div>
            <p className="text-sm text-gray-600">Manage work order and report templates</p>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Quick Tips</h3>
            <ul className="space-y-1 text-sm text-blue-100">
              <li>• Configure work centers before setting up production lines</li>
              <li>• Define shift patterns to enable accurate capacity planning</li>
              <li>• Routing configurations determine production flow and lead times</li>
              <li>• Regular review of settings ensures optimal production efficiency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Work Centers</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Factory className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Production Lines</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <GitBranch className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Shifts</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Routing Templates</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <Cog className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
