'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save, CheckCircle, XCircle, Settings, Globe, Database, Cloud, Package, CreditCard, Truck, MessageSquare, RefreshCw, AlertTriangle, Link } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: 'erp' | 'payment' | 'shipping' | 'communication' | 'storage' | 'analytics';
  description: string;
  status: 'active' | 'inactive' | 'error' | 'configured';
  icon: string;
  config: {
    apiKey?: string;
    apiSecret?: string;
    webhookUrl?: string;
    authToken?: string;
    baseUrl?: string;
    [key: string]: any;
  };
  lastSync?: string;
  syncFrequency?: string;
  features: string[];
}

export default function IntegrationsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'SAP ERP',
      category: 'erp',
      description: 'Enterprise resource planning integration for finance, HR, and operations',
      status: 'active',
      icon: 'database',
      config: {
        baseUrl: 'https://api.sap.com/v1',
        apiKey: 'sap_live_••••••••••••',
        syncFrequency: 'realtime'
      },
      lastSync: '2024-01-20 14:23:00',
      syncFrequency: 'Real-time',
      features: ['Financial Data Sync', 'Purchase Orders', 'Inventory Updates', 'HR Data']
    },
    {
      id: '2',
      name: 'Stripe',
      category: 'payment',
      description: 'Payment processing and subscription management',
      status: 'active',
      icon: 'credit-card',
      config: {
        apiKey: 'pk_live_••••••••••••',
        apiSecret: 'sk_live_••••••••••••',
        webhookUrl: 'https://erp.b3manufacturing.com/webhooks/stripe'
      },
      lastSync: '2024-01-20 14:45:00',
      syncFrequency: 'Webhook-based',
      features: ['Payment Processing', 'Refunds', 'Subscriptions', 'Invoicing']
    },
    {
      id: '3',
      name: 'Razorpay',
      category: 'payment',
      description: 'Indian payment gateway for domestic transactions',
      status: 'active',
      icon: 'credit-card',
      config: {
        apiKey: 'rzp_live_••••••••••••',
        apiSecret: 'rzp_secret_••••••••••••',
        webhookUrl: 'https://erp.b3manufacturing.com/webhooks/razorpay'
      },
      lastSync: '2024-01-20 14:50:00',
      syncFrequency: 'Webhook-based',
      features: ['UPI Payments', 'Net Banking', 'Cards', 'Wallets']
    },
    {
      id: '4',
      name: 'FedEx',
      category: 'shipping',
      description: 'International shipping and tracking integration',
      status: 'configured',
      icon: 'truck',
      config: {
        apiKey: 'fedex_••••••••••••',
        accountNumber: 'FX123456789',
        baseUrl: 'https://apis.fedex.com/ship/v1'
      },
      lastSync: '2024-01-20 12:00:00',
      syncFrequency: 'On-demand',
      features: ['Rate Calculation', 'Label Generation', 'Tracking', 'Pickup Scheduling']
    },
    {
      id: '5',
      name: 'DHL',
      category: 'shipping',
      description: 'Global shipping and logistics services',
      status: 'active',
      icon: 'truck',
      config: {
        apiKey: 'dhl_••••••••••••',
        customerId: 'DHL987654321',
        baseUrl: 'https://api.dhl.com/v1'
      },
      lastSync: '2024-01-20 13:30:00',
      syncFrequency: 'Every 30 minutes',
      features: ['Shipping Quotes', 'Customs Documentation', 'Track & Trace', 'Returns']
    },
    {
      id: '6',
      name: 'Twilio',
      category: 'communication',
      description: 'SMS, voice, and WhatsApp messaging platform',
      status: 'active',
      icon: 'message-square',
      config: {
        accountSid: 'AC••••••••••••',
        authToken: 'auth_••••••••••••',
        phoneNumber: '+1234567890'
      },
      lastSync: '2024-01-20 14:55:00',
      syncFrequency: 'Real-time',
      features: ['SMS Notifications', 'Voice Calls', 'WhatsApp', '2FA']
    },
    {
      id: '7',
      name: 'SendGrid',
      category: 'communication',
      description: 'Email delivery and marketing automation',
      status: 'active',
      icon: 'message-square',
      config: {
        apiKey: 'SG.••••••••••••',
        fromEmail: 'noreply@b3manufacturing.com',
        webhookUrl: 'https://erp.b3manufacturing.com/webhooks/sendgrid'
      },
      lastSync: '2024-01-20 14:58:00',
      syncFrequency: 'Real-time',
      features: ['Transactional Emails', 'Marketing Campaigns', 'Analytics', 'Templates']
    },
    {
      id: '8',
      name: 'AWS S3',
      category: 'storage',
      description: 'Cloud object storage for files and backups',
      status: 'active',
      icon: 'cloud',
      config: {
        accessKeyId: 'AKIA••••••••••••',
        secretAccessKey: '••••••••••••',
        region: 'ap-south-1',
        bucket: 'b3-manufacturing-prod'
      },
      lastSync: '2024-01-20 15:00:00',
      syncFrequency: 'Continuous',
      features: ['File Storage', 'Backups', 'Document Management', 'CDN']
    },
    {
      id: '9',
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Web analytics and user behavior tracking',
      status: 'active',
      icon: 'globe',
      config: {
        trackingId: 'G-••••••••••',
        propertyId: 'UA-••••••••••'
      },
      lastSync: '2024-01-20 14:59:00',
      syncFrequency: 'Real-time',
      features: ['User Tracking', 'Event Analytics', 'Conversion Tracking', 'Reports']
    },
    {
      id: '10',
      name: 'Salesforce',
      category: 'erp',
      description: 'CRM integration for customer relationship management',
      status: 'inactive',
      icon: 'database',
      config: {
        instanceUrl: 'https://b3mfg.salesforce.com',
        clientId: 'sf_••••••••••••',
        clientSecret: '••••••••••••'
      },
      features: ['Lead Management', 'Contact Sync', 'Opportunity Tracking', 'Reports']
    },
    {
      id: '11',
      name: 'Slack',
      category: 'communication',
      description: 'Team collaboration and notifications',
      status: 'configured',
      icon: 'message-square',
      config: {
        webhookUrl: 'https://hooks.slack.com/services/T••••/B••••/••••',
        botToken: 'xoxb-••••••••••••',
        channel: '#erp-notifications'
      },
      features: ['Notifications', 'Approvals', 'Alerts', 'Bot Commands']
    },
    {
      id: '12',
      name: 'QuickBooks',
      category: 'erp',
      description: 'Accounting and bookkeeping integration',
      status: 'error',
      icon: 'database',
      config: {
        realmId: 'qb_••••••••••••',
        clientId: '••••••••••••',
        clientSecret: '••••••••••••'
      },
      lastSync: '2024-01-19 18:00:00',
      syncFrequency: 'Daily',
      features: ['Invoicing', 'Expense Tracking', 'Financial Reports', 'Tax Management']
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Integrations', icon: Package, count: integrations.length },
    { id: 'erp', name: 'ERP Systems', icon: Database, count: integrations.filter(i => i.category === 'erp').length },
    { id: 'payment', name: 'Payment Gateways', icon: CreditCard, count: integrations.filter(i => i.category === 'payment').length },
    { id: 'shipping', name: 'Shipping & Logistics', icon: Truck, count: integrations.filter(i => i.category === 'shipping').length },
    { id: 'communication', name: 'Communication', icon: MessageSquare, count: integrations.filter(i => i.category === 'communication').length },
    { id: 'storage', name: 'Cloud Storage', icon: Cloud, count: integrations.filter(i => i.category === 'storage').length },
    { id: 'analytics', name: 'Analytics', icon: Globe, count: integrations.filter(i => i.category === 'analytics').length }
  ];

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'database': Database,
      'credit-card': CreditCard,
      'truck': Truck,
      'message-square': MessageSquare,
      'cloud': Cloud,
      'globe': Globe
    };
    const IconComponent = iconMap[iconName] || Package;
    return IconComponent;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-300',
      inactive: 'bg-gray-100 text-gray-700 border-gray-300',
      error: 'bg-red-100 text-red-700 border-red-300',
      configured: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'configured':
        return <Settings className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredIntegrations = selectedCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === selectedCategory);

  const stats = {
    total: integrations.length,
    active: integrations.filter(i => i.status === 'active').length,
    configured: integrations.filter(i => i.status === 'configured').length,
    errors: integrations.filter(i => i.status === 'error').length
  };

  const handleSync = (integrationId: string) => {
    console.log('Syncing integration:', integrationId);
    // Implement sync logic
  };

  const handleToggleStatus = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === integrationId
          ? {
            ...integration,
            status: integration.status === 'active' ? 'inactive' : 'active'
          }
          : integration
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 w-full max-w-full">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">System Integrations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage third-party integrations and API connections</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Integration
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Integrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Configured</p>
              <p className="text-2xl font-bold text-blue-600">{stats.configured}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className={`w-4 h-4 ${selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600'}`} />
                    <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                  </div>
                  <p className="text-xs text-gray-600">{category.count} integrations</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Integrations List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredIntegrations.map((integration) => {
            const IconComponent = getIcon(integration.icon);
            return (
              <div key={integration.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <IconComponent className="w-8 h-8 text-gray-700" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{integration.name}</h3>
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                            {getStatusIcon(integration.status)}
                            {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>

                      <div className="flex gap-2">
                        {integration.status === 'active' && (
                          <button
                            onClick={() => handleSync(integration.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"

                          >
                            <RefreshCw className="w-5 h-5 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedIntegration(integration.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"

                        >
                          <Settings className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(integration.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${integration.status === 'active'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                        >
                          {integration.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {integration.lastSync && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Last Sync:</p>
                          <p className="text-sm text-gray-900">{integration.lastSync}</p>
                          <p className="text-xs text-gray-500">Frequency: {integration.syncFrequency}</p>
                        </div>
                      )}
                    </div>

                    {integration.status === 'error' && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-red-900">Connection Error</p>
                          <p className="text-xs text-red-700">Authentication failed. Please check your API credentials.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredIntegrations.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No integrations found</p>
              <p className="text-sm text-gray-500">Try selecting a different category</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Link className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Integration Best Practices</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Store API credentials securely using environment variables</li>
                  <li>• Test integrations in staging before enabling in production</li>
                  <li>• Monitor sync status and set up alerts for failures</li>
                  <li>• Regularly review and rotate API keys for security</li>
                  <li>• Document integration workflows and data mappings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
