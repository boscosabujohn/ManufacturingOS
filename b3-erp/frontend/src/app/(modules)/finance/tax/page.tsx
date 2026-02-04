'use client';

import Link from 'next/link';
import { Receipt, FileText, Percent, ArrowRight } from 'lucide-react';

export default function TaxPage() {
  const modules = [
    {
      title: 'GST Management',
      description: 'Manage GST compliance, returns, and reconciliation',
      href: '/finance/tax/gst',
      icon: Receipt,
      color: 'blue',
    },
    {
      title: 'TDS Management',
      description: 'Handle TDS deductions, payments, and certificate generation',
      href: '/finance/tax/tds',
      icon: Percent,
      color: 'green',
    },
    {
      title: 'Tax Reports',
      description: 'Generate tax reports and compliance documents',
      href: '/finance/tax/tax-reports',
      icon: FileText,
      color: 'purple',
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full px-3 py-2 w-full max-w-full">
          <div className="w-full space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {modules.map((module) => (
                <Link key={module.title} href={module.href}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-lg hover:border-blue-300 transition-all">
                  <div className={`w-12 h-12 bg-${module.color}-100 rounded-lg flex items-center justify-center mb-2`}>
                    <module.icon className={`w-6 h-6 text-${module.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{module.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                  <div className="flex items-center text-blue-600 font-medium text-sm">
                    <span>Manage</span>
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
