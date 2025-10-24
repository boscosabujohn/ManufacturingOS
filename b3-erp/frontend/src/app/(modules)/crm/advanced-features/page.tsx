'use client';

import { useState } from 'react';
import { PageToolbar } from '@/components/ui';
import {
  AILeadScoreCard,
  AccountHierarchyTree,
  PipelineForecast,
  CollaborativeTimeline,
  WorkflowBuilder,
  TaskBoard,
} from '@/components/crm';
import type {
  AILeadScore,
  AccountNode,
  ForecastPeriod,
  TimelineActivity,
  Workflow,
  Task,
} from '@/components/crm';
import { TabPanel, TabContent } from '@/components/ui';
import { Brain, Network, TrendingUp, Clock, Zap, CheckCircle } from 'lucide-react';

// Mock Data
const mockAIScore: AILeadScore = {
  currentScore: 85,
  previousScore: 75,
  prediction: {
    conversionProbability: 78,
    timeToConvert: 14,
    recommendedActions: [
      'Schedule a product demo within the next 3 days',
      'Send case study about similar manufacturing companies',
      'Follow up on pricing questions from last meeting',
      'Connect decision maker with customer success story',
    ],
    confidence: 87,
  },
  factors: {
    companySize: 18,
    revenue: 19,
    engagement: 20,
    interest: 18,
    sourceQuality: 15,
    behavior: 17,
    demographic: 16,
    firmographic: 19,
  },
  rating: 'hot',
  trend: 'up',
};

const mockAccountHierarchy: AccountNode = {
  id: '1',
  name: 'TechCorp Global Inc.',
  type: 'parent',
  industry: 'Technology',
  location: 'San Francisco, CA',
  contactPerson: 'John Smith',
  email: 'john.smith@techcorp.com',
  phone: '+1 (415) 555-0100',
  website: 'www.techcorp.com',
  employees: 25000,
  annualRevenue: 5000000000,
  accountValue: 12500000,
  activeContracts: 8,
  relationshipStart: '2020-01-15',
  status: 'active',
  children: [
    {
      id: '2',
      name: 'TechCorp Europe GmbH',
      type: 'subsidiary',
      industry: 'Technology',
      location: 'Berlin, Germany',
      contactPerson: 'Anna Schmidt',
      email: 'anna.schmidt@techcorp.de',
      phone: '+49 30 555-0200',
      employees: 5000,
      annualRevenue: 800000000,
      accountValue: 2800000,
      activeContracts: 3,
      relationshipStart: '2020-06-10',
      status: 'active',
      children: [
        {
          id: '3',
          name: 'TechCorp Berlin Office',
          type: 'branch',
          location: 'Berlin, Germany',
          contactPerson: 'Klaus Weber',
          email: 'klaus.weber@techcorp.de',
          phone: '+49 30 555-0201',
          employees: 1200,
          accountValue: 850000,
          activeContracts: 1,
          relationshipStart: '2021-03-15',
          status: 'active',
        },
      ],
    },
    {
      id: '4',
      name: 'TechCorp Asia Pacific Ltd.',
      type: 'subsidiary',
      location: 'Singapore',
      contactPerson: 'Wei Chen',
      email: 'wei.chen@techcorp.sg',
      phone: '+65 6555 0400',
      employees: 3500,
      annualRevenue: 600000000,
      accountValue: 1950000,
      activeContracts: 2,
      relationshipStart: '2021-02-20',
      status: 'active',
    },
  ],
};

const mockForecastPeriods: ForecastPeriod[] = [
  {
    month: 'Oct 2025',
    committed: 420000,
    bestCase: 680000,
    pipeline: 855000,
    closed: 320000,
    target: 650000,
    opportunities: 7,
    aiPrediction: {
      expectedRevenue: 590000,
      confidence: 85,
      risk: 'low',
      factors: [
        'Strong historical conversion rate in Q4',
        '3 high-value deals in negotiation stage',
        'Sales team velocity 15% above average',
        'Market conditions favorable for closing',
      ],
    },
  },
  {
    month: 'Nov 2025',
    committed: 580000,
    bestCase: 825000,
    pipeline: 1150000,
    closed: 0,
    target: 700000,
    opportunities: 9,
    aiPrediction: {
      expectedRevenue: 720000,
      confidence: 78,
      risk: 'medium',
      factors: [
        'Pipeline coverage ratio is healthy at 1.6x',
        'Holiday season may slow decision making',
        'Need to accelerate 2 key opportunities',
      ],
    },
  },
  {
    month: 'Dec 2025',
    committed: 450000,
    bestCase: 720000,
    pipeline: 920000,
    closed: 0,
    target: 750000,
    opportunities: 6,
    aiPrediction: {
      expectedRevenue: 650000,
      confidence: 72,
      risk: 'medium',
      factors: [
        'End-of-year budget flush expected',
        'Shorter working days may impact closings',
        'Strong Q4 finish historically',
      ],
    },
  },
];

const mockTimelineActivities: TimelineActivity[] = [
  {
    id: '1',
    type: 'email',
    title: 'Sent proposal and pricing',
    description: 'Sent comprehensive proposal with custom pricing for 500+ user licenses',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: { id: '1', name: 'Sarah Johnson', role: 'Account Executive' },
    metadata: {
      recipients: 'john.smith@techcorp.com, procurement@techcorp.com',
      subject: 'Custom Enterprise Proposal - TechCorp',
    },
    attachments: [
      { name: 'Proposal_TechCorp_2025.pdf', url: '#', type: 'PDF' },
      { name: 'Pricing_Sheet.xlsx', url: '#', type: 'Excel' },
    ],
    comments: [
      {
        id: 'c1',
        user: { id: '2', name: 'Mike Chen', role: 'Sales Manager' },
        text: 'Great proposal! Make sure to follow up in 48 hours.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
    likes: ['2', '3'],
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Product demo with decision makers',
    description: 'Conducted 90-minute product demonstration for C-level executives',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: { id: '1', name: 'Sarah Johnson', role: 'Account Executive' },
    metadata: {
      attendees: 'John Smith (CTO), Jane Doe (CFO), Internal: Sarah, Mike',
      duration: '90 minutes',
      outcome: 'Positive - requesting POC',
    },
    likes: ['1', '2', '3', '4'],
  },
  {
    id: '3',
    type: 'call',
    title: 'Discovery call completed',
    description: 'Initial discovery call to understand requirements and pain points',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: '1', name: 'Sarah Johnson', role: 'Account Executive' },
    metadata: {
      duration: '45 minutes',
      keyPoints: 'Looking to replace legacy CRM, 500+ users, Q4 timeline',
    },
  },
  {
    id: '4',
    type: 'task',
    title: 'Prepare custom POC environment',
    description: 'Set up demo environment with customer-specific data',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    user: { id: '3', name: 'David Park', role: 'Solutions Engineer' },
    status: 'completed',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up on proposal with TechCorp',
    description: 'Check if decision makers have reviewed the pricing proposal',
    status: 'todo',
    priority: 'high',
    assignedTo: { id: '1', name: 'Sarah Johnson' },
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: { id: '2', name: 'Mike Chen' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    relatedTo: { type: 'opportunity', id: 'opp-1', name: 'TechCorp Enterprise Deal' },
    tags: ['high-value', 'enterprise'],
    comments: 2,
    attachments: 1,
  },
  {
    id: '2',
    title: 'Prepare ROI calculator for manufacturing prospect',
    description: 'Create custom ROI analysis showing cost savings',
    status: 'in_progress',
    priority: 'critical',
    assignedTo: { id: '3', name: 'David Park' },
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: { id: '1', name: 'Sarah Johnson' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    relatedTo: { type: 'lead', id: 'lead-2', name: 'GlobalMfg Corp' },
    tags: ['roi', 'manufacturing'],
    comments: 5,
  },
  {
    id: '3',
    title: 'Schedule product demo',
    description: 'Book calendar time for comprehensive platform walkthrough',
    status: 'review',
    priority: 'medium',
    assignedTo: { id: '1', name: 'Sarah Johnson' },
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: { id: '1', name: 'Sarah Johnson' },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['demo'],
    comments: 1,
  },
  {
    id: '4',
    title: 'Send contract for e-signature',
    description: 'Get final approval and send contract via DocuSign',
    status: 'completed',
    priority: 'high',
    assignedTo: { id: '1', name: 'Sarah Johnson' },
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: { id: '2', name: 'Mike Chen' },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    relatedTo: { type: 'opportunity', id: 'opp-3', name: 'FinanceHub Deal' },
    tags: ['contract', 'closing'],
  },
];

export default function CRMAdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState('ai-scoring');

  const tabs = [
    { id: 'ai-scoring', label: 'AI Lead Scoring', icon: Brain, count: undefined },
    { id: 'hierarchy', label: 'Account Hierarchy', icon: Network, count: undefined },
    { id: 'forecast', label: 'Pipeline Forecast', icon: TrendingUp, count: undefined },
    { id: 'timeline', label: 'Activity Timeline', icon: Clock, count: 12 },
    { id: 'workflow', label: 'Workflow Automation', icon: Zap, count: undefined },
    { id: 'tasks', label: 'Task Management', icon: CheckCircle, count: 4 },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <PageToolbar
        title="Advanced CRM Features"
        subtitle="Industry-leading AI and automation capabilities"
        breadcrumbs={[
          { label: 'CRM', href: '/crm' },
          { label: 'Advanced Features', href: '/crm/advanced-features' },
        ]}
      />

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
        {/* Tab Navigation */}
        <div className="mb-6">
          <TabPanel
            tabs={tabs.map((tab) => ({
              id: tab.id,
              label: tab.label,
              icon: tab.icon,
              count: tab.count,
            }))}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="underline"
            fullWidth={false}
          />
        </div>

        {/* Tab Content */}
        <TabContent activeTab={activeTab} tabId="ai-scoring">
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Lead Scoring</h2>
              <p className="text-gray-600 mb-6">
                Machine learning algorithms analyze multiple factors to predict conversion probability and
                recommend next best actions.
              </p>
              <AILeadScoreCard
                leadName="John Smith"
                leadCompany="TechCorp Global Inc."
                score={mockAIScore}
                onAcceptRecommendation={(action) => alert(`Accepted: ${action}`)}
                onRejectRecommendation={(action) => alert(`Rejected: ${action}`)}
                showPredictions={true}
              />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Compact View</h3>
              <div className="space-y-3">
                <AILeadScoreCard
                  leadName="Emily Davis"
                  leadCompany="GlobalMfg Corporation"
                  score={{ ...mockAIScore, currentScore: 72, rating: 'warm', trend: 'stable' }}
                  compact={true}
                />
                <AILeadScoreCard
                  leadName="Robert Wilson"
                  leadCompany="FinanceHub International"
                  score={{ ...mockAIScore, currentScore: 45, rating: 'cold', trend: 'down' }}
                  compact={true}
                />
              </div>
            </div>
          </div>
        </TabContent>

        <TabContent activeTab={activeTab} tabId="hierarchy">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account Hierarchy Visualization</h2>
            <p className="text-gray-600 mb-6">
              Visual representation of parent companies, subsidiaries, branches, and divisions with full
              contact and financial details.
            </p>
            <AccountHierarchyTree
              rootAccount={mockAccountHierarchy}
              onAddChild={(id) => alert(`Add child to: ${id}`)}
              onEdit={(id) => alert(`Edit account: ${id}`)}
              onView={(id) => alert(`View account: ${id}`)}
              onLink={(id) => alert(`Link account: ${id}`)}
              showActions={true}
              expandAll={false}
            />
          </div>
        </TabContent>

        <TabContent activeTab={activeTab} tabId="forecast">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">AI Pipeline Forecasting</h2>
            <p className="text-gray-600 mb-6">
              Advanced revenue predictions with confidence intervals, risk assessment, and scenario analysis
              powered by machine learning.
            </p>
            <PipelineForecast
              periods={mockForecastPeriods}
              scenarios={[
                {
                  name: 'Conservative',
                  probability: 90,
                  revenue: 1450000,
                  description: 'Only committed deals close',
                },
                {
                  name: 'Likely',
                  probability: 70,
                  revenue: 1960000,
                  description: 'Best case scenario with some slippage',
                },
                {
                  name: 'Optimistic',
                  probability: 40,
                  revenue: 2225000,
                  description: 'All pipeline deals close',
                },
              ]}
              currentPeriodIndex={0}
              showAIPredictions={true}
              showScenarios={true}
            />
          </div>
        </TabContent>

        <TabContent activeTab={activeTab} tabId="timeline">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Collaborative Activity Timeline</h2>
            <p className="text-gray-600 mb-6">
              Complete interaction history with comments, likes, @mentions, and attachments for full team
              collaboration.
            </p>
            <CollaborativeTimeline
              activities={mockTimelineActivities}
              currentUser={{ id: '2', name: 'Mike Chen' }}
              teamMembers={[
                { id: '1', name: 'Sarah Johnson', role: 'Account Executive' },
                { id: '2', name: 'Mike Chen', role: 'Sales Manager' },
                { id: '3', name: 'David Park', role: 'Solutions Engineer' },
              ]}
              onAddComment={(activityId, comment, mentions) =>
                alert(`Comment on ${activityId}: ${comment}. Mentions: ${mentions.join(', ')}`)
              }
              onLike={(activityId) => alert(`Liked activity: ${activityId}`)}
              onEdit={(activityId) => alert(`Edit activity: ${activityId}`)}
              onDelete={(activityId) => alert(`Delete activity: ${activityId}`)}
              showComments={true}
              showActions={true}
            />
          </div>
        </TabContent>

        <TabContent activeTab={activeTab} tabId="workflow">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Workflow Automation Builder</h2>
            <p className="text-gray-600 mb-6">
              Visual workflow builder with triggers, conditions, and actions to automate repetitive tasks
              and ensure consistency.
            </p>
            <WorkflowBuilder
              availableFields={[
                { name: 'status', label: 'Lead Status', type: 'string' },
                { name: 'score', label: 'Lead Score', type: 'number' },
                { name: 'value', label: 'Deal Value', type: 'number' },
                { name: 'source', label: 'Lead Source', type: 'string' },
              ]}
              availableUsers={[
                { id: '1', name: 'Sarah Johnson' },
                { id: '2', name: 'Mike Chen' },
                { id: '3', name: 'David Park' },
              ]}
              onSave={(workflow) => alert(`Workflow saved: ${workflow.name}`)}
              onTest={(workflow) => alert(`Testing workflow: ${workflow.name}`)}
            />
          </div>
        </TabContent>

        <TabContent activeTab={activeTab} tabId="tasks">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Task Management & Collaboration</h2>
            <p className="text-gray-600 mb-6">
              Kanban-style task board with priorities, assignments, due dates, and integration with CRM
              records.
            </p>
            <TaskBoard
              tasks={mockTasks}
              currentUser={{ id: '1', name: 'Sarah Johnson' }}
              onAddTask={() => alert('Add new task')}
              onEditTask={(id) => alert(`Edit task: ${id}`)}
              onDeleteTask={(id) => alert(`Delete task: ${id}`)}
              onViewTask={(id) => alert(`View task: ${id}`)}
              onStatusChange={(id, status) => alert(`Change task ${id} to ${status}`)}
              showFilters={true}
              viewMode="board"
            />
          </div>
        </TabContent>
      </div>
    </div>
  );
}
