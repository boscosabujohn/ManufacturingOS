'use client';

import { useRouter } from 'next/navigation';
import { PageToolbar } from '@/components/ui';
import { Brain, Network, TrendingUp, Clock, Zap, CheckCircle, Target, Building2, Activity, User, ArrowRight } from 'lucide-react';

export default function CRMAdvancedFeaturesPage() {
  const router = useRouter();

  const features = [
    {
      id: 'ai-scoring',
      label: 'AI Lead Scoring',
      icon: Brain,
      description: 'Machine learning algorithms analyze multiple factors to predict conversion probability and recommend next best actions.',
      href: '/crm/advanced-features/ai-scoring',
      category: 'AI & Intelligence',
    },
    {
      id: 'lead-scoring',
      label: 'Lead Scoring & Qualification',
      icon: Target,
      description: 'Enterprise-grade lead scoring with AI-powered qualification framework to prioritize high-value opportunities.',
      href: '/crm/advanced-features/lead-scoring',
      category: 'Sales Excellence',
    },
    {
      id: 'hierarchy',
      label: 'Account Hierarchy',
      icon: Network,
      description: 'Visual representation of parent companies, subsidiaries, branches, and divisions with full contact and financial details.',
      href: '/crm/advanced-features/account-hierarchy',
      category: 'Account Management',
    },
    {
      id: 'accounts',
      label: 'Account & Contact Management',
      icon: Building2,
      description: 'Comprehensive account and contact management with relationship hierarchies, org charts, and interaction history.',
      href: '/crm/advanced-features/accounts',
      category: 'Account Management',
    },
    {
      id: 'forecast',
      label: 'Pipeline Forecast',
      icon: TrendingUp,
      description: 'Advanced revenue predictions with confidence intervals, risk assessment, and scenario analysis powered by machine learning.',
      href: '/crm/advanced-features/pipeline-forecast',
      category: 'Forecasting & Analytics',
    },
    {
      id: 'pipeline',
      label: 'Sales Pipeline Management',
      icon: TrendingUp,
      description: 'Visual pipeline management with drag-and-drop functionality, stage-based workflows, and AI-powered forecasting.',
      href: '/crm/advanced-features/pipeline',
      category: 'Sales Excellence',
    },
    {
      id: 'timeline',
      label: 'Activity Timeline',
      icon: Clock,
      description: 'Complete interaction history with comments, likes, @mentions, and attachments for full team collaboration.',
      href: '/crm/advanced-features/activity-timeline',
      category: 'Collaboration',
    },
    {
      id: 'activity',
      label: 'Activity Management & Tracking',
      icon: Activity,
      description: 'Track all customer interactions including calls, emails, meetings, and tasks with comprehensive activity logging.',
      href: '/crm/advanced-features/activity',
      category: 'Activity Tracking',
    },
    {
      id: 'workflow',
      label: 'Workflow Automation',
      icon: Zap,
      description: 'Visual workflow builder with triggers, conditions, and actions to automate repetitive tasks and ensure consistency.',
      href: '/crm/advanced-features/workflow-automation',
      category: 'Automation',
    },
    {
      id: 'automation',
      label: 'Sales Automation',
      icon: Zap,
      description: 'Automate repetitive sales tasks, follow-ups, and workflows to increase efficiency and ensure consistency.',
      href: '/crm/advanced-features/automation',
      category: 'Automation',
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: CheckCircle,
      description: 'Kanban-style task board with priorities, assignments, due dates, and integration with CRM records.',
      href: '/crm/advanced-features/task-management',
      category: 'Productivity',
    },
    {
      id: 'collaboration',
      label: 'Collaboration & Intelligence',
      icon: Brain,
      description: 'Team collaboration tools with AI-powered insights, recommendations, and shared knowledge base.',
      href: '/crm/advanced-features/collaboration',
      category: 'Collaboration',
    },
    {
      id: 'customer360',
      label: 'Customer 360° View',
      icon: User,
      description: 'Complete 360-degree view of customer relationships with unified data, interaction history, and business insights.',
      href: '/crm/advanced-features/customer360',
      category: 'Customer Intelligence',
    },
  ];

  // Group features by category
  const categories = Array.from(new Set(features.map(f => f.category)));

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <PageToolbar
        subtitle="Enterprise AI & Automation capabilities for modern sales teams"
        breadcrumbs={[
          { label: 'CRM', href: '/crm' },
          { label: 'Advanced Features', href: '/crm/advanced-features' },
        ]}
      />

      <div className="flex-1 px-3 py-2 overflow-auto">
        <div className="mb-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced CRM Features</h2>
          <p className="text-gray-600">
            Comprehensive suite of enterprise-grade features combining AI-powered insights, advanced automation, and intelligent collaboration tools to supercharge your sales process.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {features
                .filter(f => f.category === category)
                .map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      onClick={() => router.push(feature.href)}
                      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">{feature.label}</h4>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
