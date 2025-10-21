'use client'

import { useState } from 'react'
import {
  CheckCircle, XCircle, Zap, Shield, Cloud, Globe, Smartphone,
  Database, Lock, BarChart, Users, Mail, FileText, RefreshCw,
  Settings, Code, Package, Workflow, Calendar, HelpCircle
} from 'lucide-react'

interface Feature {
  id: string
  name: string
  category: string
  description: string
  licensed: boolean
  icon: any
  tier: 'Basic' | 'Standard' | 'Enterprise' | 'Premium'
  limitations?: string
}

interface FeatureCategory {
  name: string
  description: string
  features: Feature[]
}

export default function LicenseFeatures() {
  const [selectedTier, setSelectedTier] = useState('all')

  const [categories] = useState<FeatureCategory[]>([
    {
      name: 'Core Features',
      description: 'Essential system functionality',
      features: [
        {
          id: '1',
          name: 'Multi-Company Support',
          category: 'Core',
          description: 'Manage multiple companies within a single instance',
          licensed: true,
          icon: Globe,
          tier: 'Enterprise'
        },
        {
          id: '2',
          name: 'Multi-Currency',
          category: 'Core',
          description: 'Support for multiple currencies with real-time conversion',
          licensed: true,
          icon: RefreshCw,
          tier: 'Enterprise'
        },
        {
          id: '3',
          name: 'Multi-Language',
          category: 'Core',
          description: 'Interface available in 20+ languages',
          licensed: true,
          icon: Globe,
          tier: 'Standard'
        },
        {
          id: '4',
          name: 'Workflow Automation',
          category: 'Core',
          description: 'Create custom automated workflows and business rules',
          licensed: true,
          icon: Workflow,
          tier: 'Enterprise'
        }
      ]
    },
    {
      name: 'Data & Analytics',
      description: 'Reporting and business intelligence tools',
      features: [
        {
          id: '5',
          name: 'Advanced Reporting',
          category: 'Analytics',
          description: 'Custom report builder with 100+ templates',
          licensed: true,
          icon: BarChart,
          tier: 'Enterprise'
        },
        {
          id: '6',
          name: 'Real-time Dashboards',
          category: 'Analytics',
          description: 'Live dashboards with customizable widgets',
          licensed: true,
          icon: BarChart,
          tier: 'Standard'
        },
        {
          id: '7',
          name: 'Data Export',
          category: 'Analytics',
          description: 'Export data to Excel, CSV, PDF, and other formats',
          licensed: true,
          icon: FileText,
          tier: 'Standard'
        },
        {
          id: '8',
          name: 'Predictive Analytics',
          category: 'Analytics',
          description: 'AI-powered forecasting and trend analysis',
          licensed: true,
          icon: BarChart,
          tier: 'Premium',
          limitations: 'Limited to 1000 predictions/month'
        }
      ]
    },
    {
      name: 'Security & Access',
      description: 'Security features and access controls',
      features: [
        {
          id: '9',
          name: 'Two-Factor Authentication',
          category: 'Security',
          description: 'Enhanced security with 2FA support',
          licensed: true,
          icon: Shield,
          tier: 'Enterprise'
        },
        {
          id: '10',
          name: 'Single Sign-On (SSO)',
          category: 'Security',
          description: 'SAML/OAuth integration for enterprise authentication',
          licensed: true,
          icon: Lock,
          tier: 'Enterprise'
        },
        {
          id: '11',
          name: 'IP Whitelisting',
          category: 'Security',
          description: 'Restrict access by IP address ranges',
          licensed: true,
          icon: Shield,
          tier: 'Enterprise'
        },
        {
          id: '12',
          name: 'Advanced Audit Logs',
          category: 'Security',
          description: 'Comprehensive activity tracking and compliance logging',
          licensed: true,
          icon: FileText,
          tier: 'Enterprise'
        },
        {
          id: '13',
          name: 'Role-Based Access Control',
          category: 'Security',
          description: 'Granular permission management at field level',
          licensed: true,
          icon: Users,
          tier: 'Standard'
        }
      ]
    },
    {
      name: 'Integration & API',
      description: 'Third-party integrations and API access',
      features: [
        {
          id: '14',
          name: 'REST API Access',
          category: 'Integration',
          description: 'Full API access for custom integrations',
          licensed: true,
          icon: Code,
          tier: 'Enterprise',
          limitations: '10,000 API calls/day'
        },
        {
          id: '15',
          name: 'Webhook Support',
          category: 'Integration',
          description: 'Real-time event notifications via webhooks',
          licensed: true,
          icon: Zap,
          tier: 'Enterprise'
        },
        {
          id: '16',
          name: 'Third-Party Integrations',
          category: 'Integration',
          description: 'Pre-built integrations with popular services',
          licensed: true,
          icon: Package,
          tier: 'Standard'
        },
        {
          id: '17',
          name: 'Email Integration',
          category: 'Integration',
          description: 'SMTP/IMAP email server integration',
          licensed: true,
          icon: Mail,
          tier: 'Standard'
        }
      ]
    },
    {
      name: 'Cloud & Infrastructure',
      description: 'Cloud services and infrastructure features',
      features: [
        {
          id: '18',
          name: 'Cloud Backup',
          category: 'Infrastructure',
          description: 'Automated daily backups to cloud storage',
          licensed: true,
          icon: Cloud,
          tier: 'Enterprise'
        },
        {
          id: '19',
          name: 'Disaster Recovery',
          category: 'Infrastructure',
          description: 'Point-in-time recovery with 30-day retention',
          licensed: true,
          icon: RefreshCw,
          tier: 'Enterprise'
        },
        {
          id: '20',
          name: 'High Availability',
          category: 'Infrastructure',
          description: '99.9% uptime SLA with failover support',
          licensed: true,
          icon: Shield,
          tier: 'Premium'
        },
        {
          id: '21',
          name: 'CDN Distribution',
          category: 'Infrastructure',
          description: 'Global content delivery network for faster access',
          licensed: true,
          icon: Globe,
          tier: 'Premium'
        }
      ]
    },
    {
      name: 'Mobile & Remote Access',
      description: 'Mobile applications and remote access',
      features: [
        {
          id: '22',
          name: 'Mobile Application',
          category: 'Mobile',
          description: 'Native iOS and Android apps',
          licensed: true,
          icon: Smartphone,
          tier: 'Enterprise'
        },
        {
          id: '23',
          name: 'Offline Mode',
          category: 'Mobile',
          description: 'Work offline and sync when connected',
          licensed: true,
          icon: Smartphone,
          tier: 'Enterprise'
        },
        {
          id: '24',
          name: 'Remote Desktop Access',
          category: 'Mobile',
          description: 'Secure remote access to desktop interface',
          licensed: true,
          icon: Globe,
          tier: 'Standard'
        }
      ]
    },
    {
      name: 'Customization',
      description: 'Customization and branding options',
      features: [
        {
          id: '25',
          name: 'Custom Fields',
          category: 'Customization',
          description: 'Add unlimited custom fields to modules',
          licensed: true,
          icon: Settings,
          tier: 'Standard'
        },
        {
          id: '26',
          name: 'Custom Branding',
          category: 'Customization',
          description: 'White-label with your company branding',
          licensed: true,
          icon: Zap,
          tier: 'Enterprise'
        },
        {
          id: '27',
          name: 'Custom Templates',
          category: 'Customization',
          description: 'Create custom email and document templates',
          licensed: true,
          icon: FileText,
          tier: 'Standard'
        }
      ]
    },
    {
      name: 'Support & Training',
      description: 'Customer support and training resources',
      features: [
        {
          id: '28',
          name: '24/7 Priority Support',
          category: 'Support',
          description: 'Round-the-clock email and phone support',
          licensed: true,
          icon: HelpCircle,
          tier: 'Enterprise'
        },
        {
          id: '29',
          name: 'Dedicated Account Manager',
          category: 'Support',
          description: 'Personal account manager for strategic guidance',
          licensed: true,
          icon: Users,
          tier: 'Premium'
        },
        {
          id: '30',
          name: 'Online Training',
          category: 'Support',
          description: 'Access to video tutorials and documentation',
          licensed: true,
          icon: Calendar,
          tier: 'Standard'
        },
        {
          id: '31',
          name: 'Custom Training',
          category: 'Support',
          description: 'On-site training sessions for your team',
          licensed: true,
          icon: Users,
          tier: 'Enterprise',
          limitations: '2 sessions per year'
        }
      ]
    }
  ])

  const allFeatures = categories.flatMap(cat => cat.features)

  const filteredFeatures = selectedTier === 'all'
    ? allFeatures
    : allFeatures.filter(f => f.tier === selectedTier)

  const stats = {
    totalFeatures: allFeatures.length,
    licensedFeatures: allFeatures.filter(f => f.licensed).length,
    enterpriseFeatures: allFeatures.filter(f => f.tier === 'Enterprise').length,
    premiumFeatures: allFeatures.filter(f => f.tier === 'Premium').length
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic':
        return 'text-gray-600 bg-gray-50'
      case 'Standard':
        return 'text-blue-600 bg-blue-50'
      case 'Enterprise':
        return 'text-purple-600 bg-purple-50'
      case 'Premium':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Licensed Features</h1>
          <p className="text-gray-600 mt-1">View all available features and capabilities in your license</p>
        </div>
        <div>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Tiers</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Features</p>
              <p className="text-3xl font-bold mt-1">{stats.totalFeatures}</p>
            </div>
            <Zap className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Licensed Features</p>
              <p className="text-3xl font-bold mt-1">{stats.licensedFeatures}</p>
            </div>
            <CheckCircle className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Enterprise Features</p>
              <p className="text-3xl font-bold mt-1">{stats.enterpriseFeatures}</p>
            </div>
            <Shield className="h-12 w-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Premium Features</p>
              <p className="text-3xl font-bold mt-1">{stats.premiumFeatures}</p>
            </div>
            <Zap className="h-12 w-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Feature Categories */}
      {categories.map((category) => {
        const categoryFeatures = selectedTier === 'all'
          ? category.features
          : category.features.filter(f => f.tier === selectedTier)

        if (categoryFeatures.length === 0) return null

        return (
          <div key={category.name} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.id}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        feature.licensed
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${
                          feature.licensed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            feature.licensed ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTierColor(feature.tier)}`}>
                            {feature.tier}
                          </span>
                          {feature.licensed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        {feature.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">
                        {feature.description}
                      </p>

                      {feature.limitations && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                            <strong>Limitation:</strong> {feature.limitations}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}

      {/* License Tier Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">License Tier Comparison</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-2 border-gray-300 rounded-lg p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Basic</h3>
              <p className="text-sm text-gray-600 mt-1">Essential features</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Core modules</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Basic reporting</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <XCircle className="h-4 w-4" />
                <span>API access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <XCircle className="h-4 w-4" />
                <span>Cloud backup</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-blue-900">Standard</h3>
              <p className="text-sm text-blue-700 mt-1">Full functionality</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>All Basic features</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Advanced reporting</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Custom fields</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <XCircle className="h-4 w-4" />
                <span>SSO integration</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-purple-500 rounded-lg p-6 bg-purple-50">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-purple-900">Enterprise</h3>
              <p className="text-sm text-purple-700 mt-1">Large organizations</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>All Standard features</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Full API access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>SSO integration</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Priority support</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-yellow-500 rounded-lg p-6 bg-yellow-50">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-yellow-900">Premium</h3>
              <p className="text-sm text-yellow-700 mt-1">Ultimate package</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>All Enterprise features</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>High availability</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>CDN distribution</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Account manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
