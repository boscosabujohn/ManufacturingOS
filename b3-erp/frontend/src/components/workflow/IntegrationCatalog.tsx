'use client'

import { useState } from 'react'
import { Grid, Search, Star, Zap, Database, Mail, MessageSquare, Cloud, Code, Lock, Globe, Check } from 'lucide-react'

export type IntegrationCategory = 'communication' | 'database' | 'cloud' | 'api' | 'security' | 'analytics' | 'productivity' | 'custom';
export type IntegrationStatus = 'active' | 'available' | 'coming-soon';

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  icon: any;
  color: string;
  features: string[];
  actions: string[];
  triggers: string[];
  rating: number;
  installations: number;
  documentation?: string;
}

export default function IntegrationCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'all'>('all');

  const integrations: Integration[] = [
    {
      id: 'INT-001',
      name: 'Email (SMTP)',
      description: 'Send emails via SMTP server with attachments and templates',
      category: 'communication',
      status: 'active',
      icon: Mail,
      color: 'blue',
      features: ['Template support', 'Attachments', 'HTML emails', 'Batch sending'],
      actions: ['send_email', 'send_email_with_attachment', 'send_bulk_email'],
      triggers: ['email_received', 'email_bounced'],
      rating: 4.8,
      installations: 1250,
      documentation: '/docs/integrations/email'
    },
    {
      id: 'INT-002',
      name: 'Slack',
      description: 'Send messages, notifications, and files to Slack channels',
      category: 'communication',
      status: 'active',
      icon: MessageSquare,
      color: 'purple',
      features: ['Channel messages', 'Direct messages', 'File uploads', 'Rich formatting'],
      actions: ['send_message', 'send_dm', 'upload_file', 'create_channel'],
      triggers: ['message_received', 'mention_received', 'channel_created'],
      rating: 4.9,
      installations: 2100,
      documentation: '/docs/integrations/slack'
    },
    {
      id: 'INT-003',
      name: 'PostgreSQL',
      description: 'Connect to PostgreSQL databases for data operations',
      category: 'database',
      status: 'active',
      icon: Database,
      color: 'indigo',
      features: ['Query execution', 'Transactions', 'Connection pooling', 'Prepared statements'],
      actions: ['execute_query', 'insert_record', 'update_record', 'delete_record', 'bulk_insert'],
      triggers: ['record_inserted', 'record_updated', 'record_deleted'],
      rating: 4.7,
      installations: 890,
      documentation: '/docs/integrations/postgresql'
    },
    {
      id: 'INT-004',
      name: 'REST API',
      description: 'Make HTTP requests to any REST API endpoint',
      category: 'api',
      status: 'active',
      icon: Globe,
      color: 'green',
      features: ['GET/POST/PUT/DELETE', 'Headers support', 'Authentication', 'JSON/XML parsing'],
      actions: ['http_get', 'http_post', 'http_put', 'http_delete', 'http_patch'],
      triggers: ['webhook_received', 'api_response'],
      rating: 4.9,
      installations: 3500,
      documentation: '/docs/integrations/rest-api'
    },
    {
      id: 'INT-005',
      name: 'AWS S3',
      description: 'Upload, download, and manage files in Amazon S3 buckets',
      category: 'cloud',
      status: 'active',
      icon: Cloud,
      color: 'orange',
      features: ['File upload', 'File download', 'Bucket management', 'Presigned URLs'],
      actions: ['upload_file', 'download_file', 'delete_file', 'list_files', 'create_presigned_url'],
      triggers: ['file_uploaded', 'file_deleted'],
      rating: 4.6,
      installations: 750,
      documentation: '/docs/integrations/aws-s3'
    },
    {
      id: 'INT-006',
      name: 'Custom Script',
      description: 'Execute custom JavaScript/Python code',
      category: 'custom',
      status: 'active',
      icon: Code,
      color: 'yellow',
      features: ['JavaScript execution', 'Python execution', 'Variable passing', 'Error handling'],
      actions: ['execute_javascript', 'execute_python', 'evaluate_expression'],
      triggers: ['script_completed', 'script_failed'],
      rating: 4.5,
      installations: 1680,
      documentation: '/docs/integrations/custom-script'
    },
    {
      id: 'INT-007',
      name: 'Auth0',
      description: 'Authentication and user management with Auth0',
      category: 'security',
      status: 'active',
      icon: Lock,
      color: 'red',
      features: ['User authentication', 'Token validation', 'Role management', 'SSO support'],
      actions: ['authenticate_user', 'validate_token', 'get_user_profile', 'assign_role'],
      triggers: ['user_logged_in', 'user_registered', 'password_reset'],
      rating: 4.8,
      installations: 620,
      documentation: '/docs/integrations/auth0'
    },
    {
      id: 'INT-008',
      name: 'Google Analytics',
      description: 'Track events and send analytics data',
      category: 'analytics',
      status: 'active',
      icon: Zap,
      color: 'cyan',
      features: ['Event tracking', 'Custom dimensions', 'E-commerce tracking', 'User tracking'],
      actions: ['track_event', 'track_pageview', 'track_transaction', 'set_user_property'],
      triggers: ['goal_completed', 'conversion_tracked'],
      rating: 4.7,
      installations: 980,
      documentation: '/docs/integrations/google-analytics'
    },
    {
      id: 'INT-009',
      name: 'Microsoft Teams',
      description: 'Send messages and notifications to Teams channels',
      category: 'communication',
      status: 'available',
      icon: MessageSquare,
      color: 'blue',
      features: ['Channel messages', 'Adaptive cards', 'Mentions', 'File sharing'],
      actions: ['send_message', 'send_card', 'create_meeting'],
      triggers: ['message_received', 'meeting_created'],
      rating: 4.6,
      installations: 540,
      documentation: '/docs/integrations/microsoft-teams'
    },
    {
      id: 'INT-010',
      name: 'MongoDB',
      description: 'NoSQL database operations with MongoDB',
      category: 'database',
      status: 'available',
      icon: Database,
      color: 'green',
      features: ['Document operations', 'Aggregations', 'Indexing', 'Transactions'],
      actions: ['insert_document', 'find_documents', 'update_document', 'delete_document', 'aggregate'],
      triggers: ['document_inserted', 'document_updated'],
      rating: 4.5,
      installations: 430,
      documentation: '/docs/integrations/mongodb'
    },
    {
      id: 'INT-011',
      name: 'Twilio SMS',
      description: 'Send SMS messages via Twilio',
      category: 'communication',
      status: 'coming-soon',
      icon: MessageSquare,
      color: 'red',
      features: ['SMS sending', 'MMS support', 'Delivery tracking', 'Two-way messaging'],
      actions: ['send_sms', 'send_mms', 'check_delivery_status'],
      triggers: ['sms_received', 'delivery_confirmed'],
      rating: 0,
      installations: 0,
      documentation: '/docs/integrations/twilio'
    },
    {
      id: 'INT-012',
      name: 'Stripe',
      description: 'Payment processing and subscription management',
      category: 'productivity',
      status: 'coming-soon',
      icon: Zap,
      color: 'purple',
      features: ['Payment processing', 'Subscriptions', 'Invoicing', 'Refunds'],
      actions: ['create_payment', 'create_subscription', 'issue_refund', 'send_invoice'],
      triggers: ['payment_received', 'subscription_created', 'payment_failed'],
      rating: 0,
      installations: 0,
      documentation: '/docs/integrations/stripe'
    }
  ];

  const categories: { id: IntegrationCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Grid },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'cloud', label: 'Cloud', icon: Cloud },
    { id: 'api', label: 'API', icon: Code },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'analytics', label: 'Analytics', icon: Zap },
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: IntegrationStatus) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      available: 'bg-blue-100 text-blue-700',
      'coming-soon': 'bg-gray-100 text-gray-700'
    };
    return colors[status];
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      indigo: 'from-indigo-500 to-indigo-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      yellow: 'from-yellow-500 to-yellow-600',
      red: 'from-red-500 to-red-600',
      cyan: 'from-cyan-500 to-cyan-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Grid className="h-8 w-8 text-blue-600" />
              Integration Catalog
            </h2>
            <p className="text-gray-600 mt-1">{integrations.length} integrations available</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div key={integration.id} className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`p-4 bg-gradient-to-r ${getColorClass(integration.color)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-gray-900" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status === 'coming-soon' ? 'Coming Soon' : integration.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{integration.name}</h3>
                <p className="text-white/90 text-sm">{integration.description}</p>
              </div>

              <div className="p-4 space-y-3">
                {/* Rating and Installations */}
                {integration.status !== 'coming-soon' && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{integration.rating}</span>
                    </div>
                    <span className="text-gray-600">{integration.installations.toLocaleString()} installs</span>
                  </div>
                )}

                {/* Features */}
                <div>
                  <div className="text-xs font-medium text-gray-700 uppercase mb-2">Features</div>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {feature}
                      </span>
                    ))}
                    {integration.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{integration.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <div className="text-xs font-medium text-gray-700 uppercase mb-2">Actions ({integration.actions.length})</div>
                  <div className="space-y-1">
                    {integration.actions.slice(0, 3).map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="h-3 w-3 text-green-600" />
                        {action}
                      </div>
                    ))}
                    {integration.actions.length > 3 && (
                      <div className="text-xs text-gray-500">+{integration.actions.length - 3} more actions</div>
                    )}
                  </div>
                </div>

                {/* Triggers */}
                <div>
                  <div className="text-xs font-medium text-gray-700 uppercase mb-2">Triggers ({integration.triggers.length})</div>
                  <div className="space-y-1">
                    {integration.triggers.slice(0, 2).map((trigger, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <Zap className="h-3 w-3 text-yellow-600" />
                        {trigger}
                      </div>
                    ))}
                    {integration.triggers.length > 2 && (
                      <div className="text-xs text-gray-500">+{integration.triggers.length - 2} more triggers</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                <button
                  disabled={integration.status === 'coming-soon'}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {integration.status === 'active' ? 'Configure' : integration.status === 'coming-soon' ? 'Coming Soon' : 'Install'}
                </button>
                {integration.documentation && integration.status !== 'coming-soon' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100">
                    Docs
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-12 text-center">
          <Search className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600">No integrations found matching your search.</p>
        </div>
      )}
    </div>
  );
}
