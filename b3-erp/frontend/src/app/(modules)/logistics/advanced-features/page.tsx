'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Truck,
  AlertTriangle,
  Calendar,
  DollarSign,
  Eye,
  Sparkles,
} from 'lucide-react';
import {
  LiveTelematicsTracking,
  RouteOptimization,
  CarrierManagement,
  ExceptionHandling,
  DockScheduling,
  FreightCostAnalytics,
  CustomerVisibilityPortal,
} from '@/components/logistics';

type TabId = 'telematics' | 'routing' | 'carriers' | 'exceptions' | 'dock' | 'cost' | 'customer';

export default function LogisticsAdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('telematics');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabId;
      if (hash) setActiveTab(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const tabs = [
    { id: 'telematics', label: 'Live Telematics', icon: MapPin, component: LiveTelematicsTracking },
    { id: 'routing', label: 'Route Optimization', icon: Navigation, component: RouteOptimization },
    { id: 'carriers', label: 'Carrier Management', icon: Truck, component: CarrierManagement },
    { id: 'exceptions', label: 'Exception Handling', icon: AlertTriangle, component: ExceptionHandling },
    { id: 'dock', label: 'Dock Scheduling', icon: Calendar, component: DockScheduling },
    { id: 'cost', label: 'Freight Cost Analytics', icon: DollarSign, component: FreightCostAnalytics },
    { id: 'customer', label: 'Customer Portal', icon: Eye, component: CustomerVisibilityPortal },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || LiveTelematicsTracking;

  return (
    <div className="w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="h-full flex flex-col px-2 py-2">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Logistics Advanced Features</h1>
              <p className="text-sm text-gray-600">TMS-grade transportation management capabilities</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabId);
                    window.location.hash = tab.id;
                  }}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600 bg-blue-50'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
