'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, User, Bell, Shield, Database, Globe, Palette, Zap, ChevronRight } from 'lucide-react';

const settingsCategories = [
  {
    id: 'account',
    name: 'Account Settings',
    description: 'Manage your personal account preferences',
    icon: User,
    color: 'bg-blue-500',
    href: '/profile',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure notification preferences',
    icon: Bell,
    color: 'bg-green-500',
    href: '/settings/notifications',
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    description: 'Password, 2FA, and security settings',
    icon: Shield,
    color: 'bg-red-500',
    href: '/profile#security',
  },
  {
    id: 'system',
    name: 'System Configuration',
    description: 'System-wide settings and preferences',
    icon: Settings,
    color: 'bg-purple-500',
    href: '/it-admin/system',
  },
  {
    id: 'data',
    name: 'Data Management',
    description: 'Backup, import, and export settings',
    icon: Database,
    color: 'bg-orange-500',
    href: '/it-admin/database/backup',
  },
  {
    id: 'localization',
    name: 'Localization',
    description: 'Language, timezone, and regional settings',
    icon: Globe,
    color: 'bg-indigo-500',
    href: '/settings/localization',
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Theme and display preferences',
    icon: Palette,
    color: 'bg-pink-500',
    href: '/settings/appearance',
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Third-party integrations and APIs',
    icon: Zap,
    color: 'bg-yellow-500',
    href: '/it-admin/system/integrations',
  },
];

const quickSettings = [
  { name: 'Change Password', href: '/profile#security' },
  { name: 'Manage Notifications', href: '/settings/notifications' },
  { name: 'User Permissions', href: '/it-admin/roles/permissions' },
  { name: 'System Backup', href: '/it-admin/database/backup' },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and system preferences</p>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickSettings.map((setting) => (
              <Link
                key={setting.name}
                href={setting.href}
                className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-lg transition-all text-center"
              >
                <h3 className="font-medium text-gray-900">{setting.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Categories */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-12 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Version</p>
              <p className="font-semibold text-gray-900">ManufacturingOS v2.5.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Environment</p>
              <p className="font-semibold text-gray-900">Production</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Last Updated</p>
              <p className="font-semibold text-gray-900">October 27, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
