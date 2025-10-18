'use client';

import Link from 'next/link';
import { Zap, Bell, RefreshCw, ArrowRight } from 'lucide-react';

export default function AutomationPage() {
  const automationModules = [
    {
      title: 'Workflows',
      description: 'Configure automated workflows for financial processes and approvals',
      href: '/finance/automation/workflows',
      icon: Zap,
      color: 'purple',
    },
    {
      title: 'Recurring Transactions',
      description: 'Set up and manage recurring journal entries and transactions',
      href: '/finance/automation/recurring-transactions',
      icon: RefreshCw,
      color: 'blue',
    },
    {
      title: 'Alerts & Notifications',
      description: 'Configure alerts for financial thresholds and important events',
      href: '/finance/automation/alerts',
      icon: Bell,
      color: 'orange',
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {automationModules.map((module) => (
                <Link
                  key={module.title}
                  href={module.href}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all"
                >
                  <div className={`w-12 h-12 bg-${module.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <module.icon className={`w-6 h-6 text-${module.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  <div className="flex items-center text-purple-600 font-medium text-sm">
                    <span>Configure</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
