'use client'

import { useState } from 'react'
import { Plus, Mail, TrendingUp, Target, BarChart, Clock, Copy, Edit2, Trash2 } from 'lucide-react'

interface ResponseTemplate {
  id: string
  name: string
  category: 'Acknowledgment' | 'Update' | 'Resolution' | 'Escalation' | 'Survey' | 'Follow-up'
  subject: string
  body: string
  trigger: {
    type: 'On Creation' | 'Status Change' | 'Priority Change' | 'Time-based' | 'Manual'
    conditions: string[]
  }
  language: string
  active: boolean
  usageCount: number
  effectivenessRate: number
  avgResponseTime: string
}

export default function AutoResponses() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null)

  const templates: ResponseTemplate[] = [
    {
      id: '1',
      name: 'Ticket Acknowledgment - Critical',
      category: 'Acknowledgment',
      subject: 'Your critical ticket has been received - {{ticket_id}}',
      body: `Dear {{customer_name}},

Thank you for contacting us. We have received your critical ticket ({{ticket_id}}) and understand the urgency.

Our team is immediately reviewing your issue: {{issue_summary}}

Expected Response Time: Within 30 minutes
Priority Level: Critical (P0)

You can track your ticket status at: {{tracking_link}}

We will keep you updated on progress.

Best regards,
{{agent_name}}
Support Team`,
      trigger: {
        type: 'On Creation',
        conditions: ['Priority = P0', 'Auto-assign = true']
      },
      language: 'English',
      active: true,
      usageCount: 234,
      effectivenessRate: 96.5,
      avgResponseTime: '< 1 min'
    },
    {
      id: '2',
      name: 'Ticket Acknowledgment - Standard',
      category: 'Acknowledgment',
      subject: 'Ticket Confirmation - {{ticket_id}}',
      body: `Hello {{customer_name}},

We have received your support request ({{ticket_id}}).

Issue: {{issue_summary}}
Priority: {{priority}}
Expected Response: {{expected_response_time}}

Our team will review and respond shortly.

Track your ticket: {{tracking_link}}

Thank you,
{{agent_name}}`,
      trigger: {
        type: 'On Creation',
        conditions: ['Priority IN (P1, P2, P3)']
      },
      language: 'English',
      active: true,
      usageCount: 1245,
      effectivenessRate: 94.2,
      avgResponseTime: '< 1 min'
    },
    {
      id: '3',
      name: 'Status Update - In Progress',
      category: 'Update',
      subject: 'Update: Your ticket is being worked on - {{ticket_id}}',
      body: `Hi {{customer_name}},

Good news! We are now actively working on your ticket {{ticket_id}}.

Current Status: In Progress
Assigned To: {{agent_name}}
Last Update: {{last_update_time}}

Recent Activity:
{{recent_activity}}

Estimated Resolution: {{estimated_resolution}}

We will continue to keep you updated.

Best regards,
Support Team`,
      trigger: {
        type: 'Status Change',
        conditions: ['New Status = In Progress']
      },
      language: 'English',
      active: true,
      usageCount: 892,
      effectivenessRate: 91.8,
      avgResponseTime: '2 min'
    },
    {
      id: '4',
      name: 'Resolution Confirmation',
      category: 'Resolution',
      subject: 'Resolved: {{ticket_id}} - {{issue_summary}}',
      body: `Dear {{customer_name}},

Great news! We have resolved your ticket {{ticket_id}}.

Issue: {{issue_summary}}
Resolution: {{resolution_summary}}
Resolved By: {{agent_name}}
Resolution Time: {{resolution_time}}

Please verify the resolution and confirm it meets your needs. If you continue to experience issues, simply reply to this email.

We value your feedback! Please take a moment to rate your support experience:
{{survey_link}}

Thank you for your patience.

Best regards,
{{agent_name}}
Support Team`,
      trigger: {
        type: 'Status Change',
        conditions: ['New Status = Resolved']
      },
      language: 'English',
      active: true,
      usageCount: 756,
      effectivenessRate: 88.4,
      avgResponseTime: '1 min'
    },
    {
      id: '5',
      name: 'Escalation Notification',
      category: 'Escalation',
      subject: 'Your ticket has been escalated - {{ticket_id}}',
      body: `Hello {{customer_name}},

We want to keep you informed that your ticket {{ticket_id}} has been escalated to our senior support team for specialized attention.

Escalation Reason: {{escalation_reason}}
New Priority: {{new_priority}}
Escalated To: {{escalated_to}}

We are committed to resolving your issue as quickly as possible and will provide updates every {{update_frequency}}.

You can reach out directly to: {{escalation_contact}}

Thank you for your understanding.

Best regards,
Support Team`,
      trigger: {
        type: 'Manual',
        conditions: ['Escalation Event']
      },
      language: 'English',
      active: true,
      usageCount: 145,
      effectivenessRate: 93.7,
      avgResponseTime: '3 min'
    },
    {
      id: '6',
      name: 'CSAT Survey Request',
      category: 'Survey',
      subject: 'How did we do? Share your feedback - {{ticket_id}}',
      body: `Hi {{customer_name}},

Thank you for allowing us to assist you with ticket {{ticket_id}}.

We would greatly appreciate your feedback on your support experience.

Please take 1 minute to complete our survey:
{{survey_link}}

Your feedback helps us improve our service.

Rate your experience:
⭐⭐⭐⭐⭐ {{rating_link}}

Thank you!
Support Team`,
      trigger: {
        type: 'Time-based',
        conditions: ['24 hours after resolution']
      },
      language: 'English',
      active: true,
      usageCount: 623,
      effectivenessRate: 67.3,
      avgResponseTime: 'Scheduled'
    },
    {
      id: '7',
      name: 'Follow-up - No Response',
      category: 'Follow-up',
      subject: 'Following up on your ticket - {{ticket_id}}',
      body: `Hello {{customer_name}},

We noticed we haven't heard back from you regarding ticket {{ticket_id}}.

We requested additional information:
{{requested_info}}

To help us resolve your issue quickly, please provide the requested details at your earliest convenience.

If your issue has been resolved, please let us know so we can close the ticket.

Reply to this email or visit: {{tracking_link}}

Best regards,
{{agent_name}}`,
      trigger: {
        type: 'Time-based',
        conditions: ['48 hours since last response', 'Status = Waiting on Customer']
      },
      language: 'English',
      active: true,
      usageCount: 445,
      effectivenessRate: 72.8,
      avgResponseTime: 'Scheduled'
    },
    {
      id: '8',
      name: 'Auto-Close Warning',
      category: 'Follow-up',
      subject: 'Action Required: Ticket {{ticket_id}} will be auto-closed',
      body: `Dear {{customer_name}},

This is a reminder that ticket {{ticket_id}} has been in "Resolved" status for {{days_resolved}} days.

If no further action is needed, this ticket will be automatically closed in {{days_until_close}} days.

If you still need assistance, please respond to keep the ticket active.

Issue Summary: {{issue_summary}}
Resolution Date: {{resolution_date}}

Reply to reopen or visit: {{tracking_link}}

Thank you,
Support Team`,
      trigger: {
        type: 'Time-based',
        conditions: ['Status = Resolved', '5 days since resolution']
      },
      language: 'English',
      active: true,
      usageCount: 312,
      effectivenessRate: 85.6,
      avgResponseTime: 'Scheduled'
    },
    {
      id: '9',
      name: 'SLA Breach Notification',
      category: 'Update',
      subject: 'Important: SLA Breach Alert - {{ticket_id}}',
      body: `Dear {{customer_name}},

We want to inform you that ticket {{ticket_id}} has exceeded our service level agreement timeframe.

Original SLA: {{original_sla}}
Current Time: {{current_time}}
Breach Duration: {{breach_duration}}

We sincerely apologize for this delay. Your ticket has been escalated and is receiving priority attention from our senior team.

Contact for immediate assistance: {{escalation_contact}}

We are committed to resolving this as quickly as possible.

Best regards,
{{manager_name}}
Support Manager`,
      trigger: {
        type: 'Manual',
        conditions: ['SLA Breach Event']
      },
      language: 'English',
      active: true,
      usageCount: 67,
      effectivenessRate: 91.2,
      avgResponseTime: '< 1 min'
    },
    {
      id: '10',
      name: 'VIP Customer Acknowledgment',
      category: 'Acknowledgment',
      subject: 'Priority Support: Your ticket has been received - {{ticket_id}}',
      body: `Dear {{customer_name}},

Thank you for contacting us. As a valued VIP customer, your ticket {{ticket_id}} has been assigned priority status.

Issue: {{issue_summary}}
Priority: VIP - Critical Attention
Assigned To: Senior Support Specialist

Direct Contact: {{agent_phone}}
Email: {{agent_email}}

Expected First Response: Within 15 minutes
Dedicated Support: Yes

We appreciate your business and are committed to providing exceptional service.

Best regards,
{{agent_name}}
Senior Support Team`,
      trigger: {
        type: 'On Creation',
        conditions: ['Customer Type = VIP']
      },
      language: 'English',
      active: true,
      usageCount: 189,
      effectivenessRate: 98.3,
      avgResponseTime: '< 1 min'
    }
  ]

  const categories = ['All', 'Acknowledgment', 'Update', 'Resolution', 'Escalation', 'Survey', 'Follow-up']

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const stats = [
    {
      label: 'Total Templates',
      value: templates.length,
      change: `${templates.filter(t => t.active).length} active`,
      icon: Mail,
      color: 'blue'
    },
    {
      label: 'Sent Today',
      value: '1,234',
      change: '+18% vs yesterday',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Avg Effectiveness',
      value: `${(templates.reduce((sum, t) => sum + t.effectivenessRate, 0) / templates.length).toFixed(1)}%`,
      change: 'All templates',
      icon: Target,
      color: 'purple'
    },
    {
      label: 'Total Usage',
      value: templates.reduce((sum, t) => sum + t.usageCount, 0).toLocaleString(),
      change: 'All time',
      icon: BarChart,
      color: 'orange'
    },
    {
      label: 'Response Time',
      value: '< 2 min',
      change: 'Average delivery',
      icon: Clock,
      color: 'green'
    },
    {
      label: 'Categories',
      value: categories.length - 1,
      change: 'Template types',
      icon: Copy,
      color: 'gray'
    }
  ]

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Acknowledgment': 'bg-blue-100 text-blue-700',
      'Update': 'bg-purple-100 text-purple-700',
      'Resolution': 'bg-green-100 text-green-700',
      'Escalation': 'bg-orange-100 text-orange-700',
      'Survey': 'bg-pink-100 text-pink-700',
      'Follow-up': 'bg-yellow-100 text-yellow-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getTriggerColor = (type: string) => {
    const colors: Record<string, string> = {
      'On Creation': 'bg-green-100 text-green-700',
      'Status Change': 'bg-blue-100 text-blue-700',
      'Priority Change': 'bg-orange-100 text-orange-700',
      'Time-based': 'bg-purple-100 text-purple-700',
      'Manual': 'bg-gray-100 text-gray-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auto-Response Templates</h1>
          <p className="text-gray-600 mt-1">Manage automated response templates and track effectiveness</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500',
            gray: 'bg-gray-500'
          }
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">{stat.label}</span>
                <div className={`${colorClasses[stat.color as keyof typeof colorClasses]} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTriggerColor(template.trigger.type)}`}>
                    {template.trigger.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {template.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  <strong>Subject:</strong> {template.subject}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Copy className="h-4 w-4 text-blue-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded p-3 mb-4 max-h-32 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{template.body.substring(0, 200)}...</pre>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-xs font-medium text-gray-700">TRIGGER CONDITIONS:</div>
              <div className="flex flex-wrap gap-2">
                {template.trigger.conditions.map((condition, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <div className="text-xs text-gray-500">Usage</div>
                <div className="text-lg font-semibold text-gray-900">{template.usageCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Effectiveness</div>
                <div className={`text-lg font-semibold ${
                  template.effectivenessRate >= 90 ? 'text-green-600' :
                  template.effectivenessRate >= 75 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {template.effectivenessRate}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Avg Time</div>
                <div className="text-lg font-semibold text-blue-600">{template.avgResponseTime}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No templates found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
