'use client';

import Link from 'next/link';
import { Factory, ShoppingCart, ArrowRight } from 'lucide-react';

export default function IntegrationPage() {
  const modules = [
    {
      title: 'Production Integration',
      description: 'Integration with production module for cost accounting and WIP management',
      href: '/finance/integration/production',
      icon: Factory,
      color: 'blue',
    },
    {
      title: 'Procurement Integration',
      description: 'Seamless integration with procurement for purchase accounting',
      href: '/finance/integration/procurement',
      icon: ShoppingCart,
      color: 'purple',
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module) => (
                <Link key={module.title} href={module.href}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all">
                  <div className={`w-12 h-12 bg-${module.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <module.icon className={`w-6 h-6 text-${module.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{module.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  <div className="flex items-center text-blue-600 font-medium text-sm">
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
