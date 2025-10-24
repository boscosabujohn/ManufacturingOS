'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShoppingCart,
  Package,
  Factory,
  DollarSign,
  UserCog,
  ShoppingBag,
  Calculator,
  Truck,
  Headphones,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  Wrench,
  FolderKanban,
  LucideIcon,
  Database,
  Layers,
  GitBranch,
  BarChart3,
} from 'lucide-react';

interface SubMenuItem {
  id: string;
  name: string;
  href: string;
  description?: string;
  subItems?: SubMenuItem[]; // Support for nested sub-menus
}

interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
  href?: string;
  color: string;
  bgColor: string; // Background color for active state
  hoverColor: string; // Hover background color
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
  },
  {
    id: 'crm',
    name: 'CRM',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100',
    subItems: [
      { id: 'crm-dashboard', name: 'CRM Dashboard', href: '/crm', description: 'CRM overview' },
      {
        id: 'lead-management',
        name: 'Lead Management',
        href: '#',
        description: 'Lead tracking & conversion',
        subItems: [
          { id: 'all-leads', name: 'All Leads', href: '/crm/leads', description: 'View all leads' },
          { id: 'add-lead', name: 'Add New Lead', href: '/crm/leads/add', description: 'Create a new lead' },
          { id: 'new-leads', name: 'New Leads', href: '/crm/leads?status=new', description: 'New incoming leads' },
          { id: 'qualified-leads', name: 'Qualified Leads', href: '/crm/leads?status=qualified', description: 'Qualified prospects' },
          { id: 'lead-scoring', name: 'Lead Scoring', href: '/crm/leads/scoring', description: 'Score & prioritize leads' },
          { id: 'lead-sources', name: 'Lead Sources', href: '/crm/leads/sources', description: 'Track lead sources' },
          { id: 'lead-assignment', name: 'Lead Assignment', href: '/crm/leads/assignment', description: 'Auto-assign leads' },
        ],
      },
      {
        id: 'opportunity-management',
        name: 'Opportunities',
        href: '#',
        description: 'Sales opportunities',
        subItems: [
          { id: 'all-opportunities', name: 'All Opportunities', href: '/crm/opportunities', description: 'View all opportunities' },
          { id: 'pipeline-view', name: 'Sales Pipeline', href: '/crm/opportunities/pipeline', description: 'Visual pipeline' },
          { id: 'won-deals', name: 'Won Deals', href: '/crm/opportunities/won', description: 'Closed won deals' },
          { id: 'lost-deals', name: 'Lost Deals', href: '/crm/opportunities/lost', description: 'Lost opportunities' },
          { id: 'forecast', name: 'Sales Forecast', href: '/crm/opportunities/forecast', description: 'Revenue forecast' },
        ],
      },
      {
        id: 'customer-management',
        name: 'Customers',
        href: '#',
        description: 'Customer database',
        subItems: [
          { id: 'all-customers', name: 'All Customers', href: '/crm/customers', description: 'Customer database' },
          { id: 'customer-segments', name: 'Customer Segments', href: '/crm/customers/segments', description: 'Segment customers' },
          { id: 'customer-hierarchy', name: 'Customer Hierarchy', href: '/crm/customers/hierarchy', description: 'Parent-child accounts' },
          { id: 'customer-portal', name: 'Customer Portal', href: '/crm/customers/portal', description: 'Self-service portal' },
        ],
      },
      {
        id: 'contact-management',
        name: 'Contacts',
        href: '#',
        description: 'Contact database',
        subItems: [
          { id: 'all-contacts', name: 'All Contacts', href: '/crm/contacts', description: 'Contact database' },
          { id: 'contact-roles', name: 'Contact Roles', href: '/crm/contacts/roles', description: 'Define contact roles' },
          { id: 'contact-lists', name: 'Contact Lists', href: '/crm/contacts/lists', description: 'Segmented lists' },
        ],
      },
      {
        id: 'activities',
        name: 'Activities & Tasks',
        href: '#',
        description: 'CRM activities',
        subItems: [
          { id: 'all-activities', name: 'All Activities', href: '/crm/activities', description: 'View all activities' },
          { id: 'my-tasks', name: 'My Tasks', href: '/crm/activities/tasks', description: 'Personal task list' },
          { id: 'calendar', name: 'Calendar', href: '/crm/activities/calendar', description: 'Activity calendar' },
          { id: 'meetings', name: 'Meetings', href: '/crm/activities/meetings', description: 'Schedule meetings' },
          { id: 'calls', name: 'Calls', href: '/crm/activities/calls', description: 'Call logs' },
          { id: 'emails', name: 'Emails', href: '/crm/activities/emails', description: 'Email tracking' },
        ],
      },
      {
        id: 'interactions',
        name: 'Interactions',
        href: '#',
        description: 'Customer interactions',
        subItems: [
          { id: 'all-interactions', name: 'All Interactions', href: '/crm/interactions', description: 'Interaction history' },
          { id: 'interaction-timeline', name: 'Timeline View', href: '/crm/interactions/timeline', description: 'Chronological view' },
          { id: 'touchpoint-analysis', name: 'Touchpoint Analysis', href: '/crm/interactions/analysis', description: 'Analyze touchpoints' },
        ],
      },
      {
        id: 'campaigns',
        name: 'Marketing Campaigns',
        href: '#',
        description: 'Campaign management',
        subItems: [
          { id: 'all-campaigns', name: 'All Campaigns', href: '/crm/campaigns', description: 'View campaigns' },
          { id: 'email-campaigns', name: 'Email Campaigns', href: '/crm/campaigns/email', description: 'Email marketing' },
          { id: 'campaign-performance', name: 'Campaign Performance', href: '/crm/campaigns/performance', description: 'Track ROI' },
          { id: 'email-templates', name: 'Email Templates', href: '/crm/campaigns/templates', description: 'Manage templates' },
          { id: 'automation', name: 'Marketing Automation', href: '/crm/campaigns/automation', description: 'Automated workflows' },
        ],
      },
      {
        id: 'quotes-proposals',
        name: 'Quotes & Proposals',
        href: '#',
        description: 'Sales documents',
        subItems: [
          { id: 'all-quotes', name: 'All Quotes', href: '/crm/quotes', description: 'View all quotes' },
          { id: 'create-quote', name: 'Create Quote', href: '/crm/quotes/create', description: 'New quotation' },
          { id: 'quote-templates', name: 'Quote Templates', href: '/crm/quotes/templates', description: 'Manage templates' },
          { id: 'proposals', name: 'Proposals', href: '/crm/proposals', description: 'Sales proposals' },
          { id: 'pricing', name: 'Price Books', href: '/crm/quotes/pricing', description: 'Manage pricing' },
        ],
      },
      {
        id: 'contracts',
        name: 'Contracts',
        href: '#',
        description: 'Contract management',
        subItems: [
          { id: 'all-contracts', name: 'All Contracts', href: '/crm/contracts', description: 'View contracts' },
          { id: 'contract-templates', name: 'Contract Templates', href: '/crm/contracts/templates', description: 'Manage templates' },
          { id: 'renewals', name: 'Renewals', href: '/crm/contracts/renewals', description: 'Contract renewals' },
          { id: 'amendments', name: 'Amendments', href: '/crm/contracts/amendments', description: 'Contract changes' },
        ],
      },
      {
        id: 'support',
        name: 'Customer Support',
        href: '#',
        description: 'Support tickets',
        subItems: [
          { id: 'tickets', name: 'Support Tickets', href: '/crm/support/tickets', description: 'Manage tickets' },
          { id: 'knowledge-base', name: 'Knowledge Base', href: '/crm/support/knowledge', description: 'Help articles' },
          { id: 'sla-management', name: 'SLA Management', href: '/crm/support/sla', description: 'Service levels' },
        ],
      },
      {
        id: 'analytics',
        name: 'Reports & Analytics',
        href: '#',
        description: 'CRM insights',
        subItems: [
          { id: 'crm-analytics', name: 'CRM Analytics', href: '/crm/analytics', description: 'Key metrics' },
          { id: 'sales-reports', name: 'Sales Reports', href: '/crm/analytics/sales', description: 'Sales performance' },
          { id: 'customer-analytics', name: 'Customer Analytics', href: '/crm/analytics/customers', description: 'Customer insights' },
          { id: 'revenue-analytics', name: 'Revenue Analytics', href: '/crm/analytics/revenue', description: 'Revenue tracking' },
          { id: 'team-performance', name: 'Team Performance', href: '/crm/analytics/team', description: 'Team metrics' },
          { id: 'custom-reports', name: 'Custom Reports', href: '/crm/analytics/custom', description: 'Build reports' },
        ],
      },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'AI & Automation',
        subItems: [
          { id: 'ai-lead-scoring', name: 'AI Lead Scoring', href: '/crm/advanced-features#ai-scoring', description: 'AI-powered lead scoring' },
          { id: 'account-hierarchy', name: 'Account Hierarchy', href: '/crm/advanced-features#hierarchy', description: 'Visual org charts' },
          { id: 'pipeline-forecast', name: 'Pipeline Forecast', href: '/crm/advanced-features#forecast', description: 'AI revenue forecasting' },
          { id: 'activity-timeline', name: 'Activity Timeline', href: '/crm/advanced-features#timeline', description: 'Collaborative timeline' },
          { id: 'workflow-automation', name: 'Workflow Automation', href: '/crm/advanced-features#workflow', description: 'Visual workflow builder' },
          { id: 'task-management', name: 'Task Management', href: '/crm/advanced-features#tasks', description: 'Kanban task board' },
          { id: 'all-advanced-features', name: '→ View All Features', href: '/crm/advanced-features', description: 'Complete feature showcase' },
        ],
      },
      {
        id: 'crm-settings',
        name: 'CRM Settings',
        href: '#',
        description: 'Configuration',
        subItems: [
          { id: 'sales-stages', name: 'Sales Stages', href: '/crm/settings/stages', description: 'Define stages' },
          { id: 'lead-statuses', name: 'Lead Statuses', href: '/crm/settings/statuses', description: 'Lead status options' },
          { id: 'territories', name: 'Sales Territories', href: '/crm/settings/territories', description: 'Define territories' },
          { id: 'teams', name: 'Sales Teams', href: '/crm/settings/teams', description: 'Team structure' },
          { id: 'custom-fields', name: 'Custom Fields', href: '/crm/settings/fields', description: 'Customize CRM' },
        ],
      },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: ShoppingCart,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    subItems: [
      { id: 'sales-dashboard', name: 'Sales Dashboard', href: '/sales', description: 'Sales overview' },
      {
        id: 'quotation-management',
        name: 'Quotations',
        href: '#',
        description: 'Sales quotations',
        subItems: [
          { id: 'all-quotations', name: 'All Quotations', href: '/sales/quotations', description: 'View all quotations' },
          { id: 'create-quotation', name: 'Create Quotation', href: '/sales/quotations/create', description: 'New quotation' },
          { id: 'pending-quotations', name: 'Pending Approval', href: '/sales/quotations/pending', description: 'Awaiting approval' },
          { id: 'approved-quotations', name: 'Approved', href: '/sales/quotations/approved', description: 'Approved quotes' },
          { id: 'converted-quotations', name: 'Converted to Orders', href: '/sales/quotations/converted', description: 'Quote to order' },
          { id: 'expired-quotations', name: 'Expired', href: '/sales/quotations/expired', description: 'Expired quotes' },
        ],
      },
      {
        id: 'order-management',
        name: 'Sales Orders',
        href: '#',
        description: 'Order management',
        subItems: [
          { id: 'all-orders', name: 'All Orders', href: '/sales/orders', description: 'View all orders' },
          { id: 'create-order', name: 'Create Order', href: '/sales/orders/create', description: 'New sales order' },
          { id: 'confirmed-orders', name: 'Confirmed Orders', href: '/sales/orders/confirmed', description: 'Confirmed orders' },
          { id: 'in-production', name: 'In Production', href: '/sales/orders/production', description: 'Manufacturing stage' },
          { id: 'ready-ship', name: 'Ready to Ship', href: '/sales/orders/ready', description: 'Ready for dispatch' },
          { id: 'shipped-orders', name: 'Shipped', href: '/sales/orders/shipped', description: 'In transit' },
          { id: 'delivered-orders', name: 'Delivered', href: '/sales/orders/delivered', description: 'Completed orders' },
          { id: 'order-tracking', name: 'Order Tracking', href: '/sales/orders/tracking', description: 'Track shipments' },
        ],
      },
      {
        id: 'rfp-management',
        name: 'RFP Management',
        href: '#',
        description: 'Request for Proposals',
        subItems: [
          { id: 'all-rfp', name: 'All RFPs', href: '/sales/rfp', description: 'View all RFPs' },
          { id: 'create-rfp', name: 'Create RFP Response', href: '/sales/rfp/create', description: 'New RFP response' },
          { id: 'submitted-rfp', name: 'Submitted RFPs', href: '/sales/rfp/submitted', description: 'Submitted proposals' },
          { id: 'shortlisted-rfp', name: 'Shortlisted', href: '/sales/rfp/shortlisted', description: 'Shortlisted RFPs' },
          { id: 'won-rfp', name: 'Won RFPs', href: '/sales/rfp/won', description: 'Successful bids' },
        ],
      },
      {
        id: 'invoicing',
        name: 'Invoicing',
        href: '#',
        description: 'Sales invoices',
        subItems: [
          { id: 'all-invoices', name: 'All Invoices', href: '/sales/invoices', description: 'View invoices' },
          { id: 'create-invoice', name: 'Create Invoice', href: '/sales/invoices/create', description: 'New invoice' },
          { id: 'pending-invoices', name: 'Pending Payment', href: '/sales/invoices/pending', description: 'Awaiting payment' },
          { id: 'paid-invoices', name: 'Paid', href: '/sales/invoices/paid', description: 'Completed payments' },
          { id: 'overdue-invoices', name: 'Overdue', href: '/sales/invoices/overdue', description: 'Overdue invoices' },
          { id: 'credit-notes', name: 'Credit Notes', href: '/sales/invoices/credit-notes', description: 'Issue credits' },
        ],
      },
      {
        id: 'delivery-handover',
        name: 'Delivery & Handover',
        href: '#',
        description: 'Project completion',
        subItems: [
          { id: 'all-handovers', name: 'All Handovers', href: '/sales/handover', description: 'Project handovers' },
          { id: 'pending-handover', name: 'Pending Handover', href: '/sales/handover/pending', description: 'Awaiting handover' },
          { id: 'accepted-handover', name: 'Accepted', href: '/sales/handover/accepted', description: 'Customer accepted' },
          { id: 'delivery-notes', name: 'Delivery Notes', href: '/sales/delivery/notes', description: 'Delivery documentation' },
          { id: 'installation', name: 'Installation Tracking', href: '/sales/delivery/installation', description: 'Track installations' },
        ],
      },
      {
        id: 'pricing',
        name: 'Pricing & Discounts',
        href: '#',
        description: 'Price management',
        subItems: [
          { id: 'price-lists', name: 'Price Lists', href: '/sales/pricing/lists', description: 'Manage price lists' },
          { id: 'discount-rules', name: 'Discount Rules', href: '/sales/pricing/discounts', description: 'Discount policies' },
          { id: 'special-pricing', name: 'Special Pricing', href: '/sales/pricing/special', description: 'Customer-specific pricing' },
          { id: 'promotions', name: 'Promotions', href: '/sales/pricing/promotions', description: 'Sales promotions' },
        ],
      },
      {
        id: 'returns',
        name: 'Returns & Replacements',
        href: '#',
        description: 'Manage returns',
        subItems: [
          { id: 'sales-returns', name: 'Sales Returns', href: '/sales/returns', description: 'Return requests' },
          { id: 'replacements', name: 'Replacements', href: '/sales/returns/replacements', description: 'Product replacements' },
          { id: 'refunds', name: 'Refunds', href: '/sales/returns/refunds', description: 'Process refunds' },
        ],
      },
      {
        id: 'sales-analytics',
        name: 'Sales Analytics',
        href: '#',
        description: 'Sales insights',
        subItems: [
          { id: 'sales-dashboard-analytics', name: 'Sales Analytics', href: '/sales/analytics', description: 'Performance metrics' },
          { id: 'sales-reports', name: 'Sales Reports', href: '/sales/analytics/reports', description: 'Sales reports' },
          { id: 'product-performance', name: 'Product Performance', href: '/sales/analytics/products', description: 'Product analysis' },
          { id: 'customer-analytics', name: 'Customer Analytics', href: '/sales/analytics/customers', description: 'Customer insights' },
          { id: 'sales-forecast', name: 'Sales Forecast', href: '/sales/analytics/forecast', description: 'Revenue forecasting' },
          { id: 'sales-targets', name: 'Sales Targets', href: '/sales/analytics/targets', description: 'Track targets' },
        ],
      },
      {
        id: 'sales-settings',
        name: 'Sales Settings',
        href: '#',
        description: 'Configuration',
        subItems: [
          { id: 'sales-terms', name: 'Terms & Conditions', href: '/sales/settings/terms', description: 'Sales T&C' },
          { id: 'payment-terms', name: 'Payment Terms', href: '/sales/settings/payment-terms', description: 'Payment conditions' },
          { id: 'shipping-terms', name: 'Shipping Terms', href: '/sales/settings/shipping', description: 'Shipping policies' },
          { id: 'tax-settings', name: 'Tax Settings', href: '/sales/settings/tax', description: 'Tax configuration' },
        ],
      },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise automation',
        subItems: [
          { id: 'quote-automation', name: 'Quote-to-Order Automation', href: '/sales/advanced-features#automation', description: 'Automated conversion' },
          { id: 'territory-mgmt', name: 'Territory Management', href: '/sales/advanced-features#territory', description: 'Sales territories' },
          { id: 'incentive-tracking', name: 'Incentive Tracking', href: '/sales/advanced-features#incentive', description: 'Commissions & bonuses' },
          { id: 'predictive-forecast', name: 'Predictive Forecasting', href: '/sales/advanced-features#forecasting', description: 'AI-powered forecasts' },
          { id: 'cpq-handoff', name: 'CPQ Handoff', href: '/sales/advanced-features#cpq', description: 'CPQ integration' },
          { id: 'revenue-recognition', name: 'Revenue Recognition', href: '/sales/advanced-features#revenue', description: 'Revenue schedules' },
          { id: 'pipeline-analytics', name: 'Pipeline Analytics', href: '/sales/advanced-features#pipeline', description: 'Sales funnel analysis' },
          { id: 'all-sales-features', name: '→ View All Features', href: '/sales/advanced-features', description: 'Complete feature set' },
        ],
      },
    ],
  },
  {
    id: 'rfq',
    name: 'RFQ Management',
    icon: FileText,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    hoverColor: 'hover:bg-amber-100',
    subItems: [
      { id: 'rfq-list', name: 'RFQ List', href: '/rfq', description: 'All RFQs' },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise RFQ capabilities',
        subItems: [
          { id: 'vendor-collaboration', name: 'Vendor Collaboration', href: '/rfq/advanced-features#collaboration', description: 'Vendor portals' },
          { id: 'response-scoring', name: 'Response Scoring', href: '/rfq/advanced-features#scoring', description: 'Weighted scoring' },
          { id: 'bid-comparison', name: 'Bid Comparison', href: '/rfq/advanced-features#comparison', description: 'Automated comparison' },
          { id: 'approval-workflow', name: 'Approval Workflow', href: '/rfq/advanced-features#approval', description: 'Multi-level approvals' },
          { id: 'audit-trail', name: 'Audit Trail', href: '/rfq/advanced-features#audit', description: 'Activity logging' },
          { id: 'sourcing-integration', name: 'Sourcing Integration', href: '/rfq/advanced-features#sourcing', description: 'Event linkage' },
          { id: 'contract-generation', name: 'Contract Generation', href: '/rfq/advanced-features#contract', description: 'Auto contracts' },
          { id: 'all-rfq-features', name: '→ View All Features', href: '/rfq/advanced-features', description: 'Complete feature set' },
        ],
      },
    ],
  },
  {
    id: 'estimation',
    name: 'Estimation',
    icon: Calculator,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    subItems: [
      { id: 'estimation-dashboard', name: 'Estimation Dashboard', href: '/estimation', description: 'Overview of estimates' },
      {
        id: 'estimation-advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise estimation tools',
        subItems: [
          { id: 'cost-breakdown-analysis', name: 'Cost Breakdown', href: '/estimation/advanced-features#cost-breakdown', description: 'Detailed cost analysis' },
          { id: 'version-comparison', name: 'Version Comparison', href: '/estimation/advanced-features#version-comparison', description: 'Compare estimate versions' },
          { id: 'risk-analysis', name: 'Risk Analysis', href: '/estimation/advanced-features#risk-analysis', description: 'Project risk assessment' },
          { id: 'workflow-approvals', name: 'Workflow & Approvals', href: '/estimation/advanced-features#workflow-approvals', description: 'Multi-level approvals' },
          { id: 'bom-import', name: 'BOM Import', href: '/estimation/advanced-features#bom-import', description: 'Bill of Materials import' },
          { id: 'historical-benchmarking', name: 'Historical Benchmarking', href: '/estimation/advanced-features#benchmarking', description: 'Compare with history' },
          { id: 'what-if-simulation', name: 'What-If Simulation', href: '/estimation/advanced-features#what-if', description: 'Scenario modeling' },
          { id: 'all-estimation-features', name: '→ View All Features', href: '/estimation/advanced-features', description: 'Complete feature showcase' },
        ],
      },
      {
        id: 'boq-management',
        name: 'BOQ (Bill of Quantities)',
        href: '#',
        description: 'Bill of quantities',
        subItems: [
          { id: 'all-boq', name: 'All BOQs', href: '/estimation/boq', description: 'View all BOQs' },
          { id: 'create-boq', name: 'Create BOQ', href: '/estimation/boq/add', description: 'New BOQ' },
          { id: 'boq-templates', name: 'BOQ Templates', href: '/estimation/boq/templates', description: 'Reusable templates' },
          { id: 'boq-analysis', name: 'BOQ Analysis', href: '/estimation/boq/analysis', description: 'Analyze BOQs' },
          { id: 'boq-comparison', name: 'BOQ Comparison', href: '/estimation/boq/comparison', description: 'Compare BOQs' },
        ],
      },
      {
        id: 'cost-estimation',
        name: 'Cost Estimation',
        href: '#',
        description: 'Cost calculations',
        subItems: [
          { id: 'all-costings', name: 'All Cost Estimates', href: '/estimation/costing', description: 'View cost estimates' },
          { id: 'create-costing', name: 'Create Cost Estimate', href: '/estimation/costing/add', description: 'New estimate' },
          { id: 'material-costs', name: 'Material Costs', href: '/estimation/costing/materials', description: 'Material pricing' },
          { id: 'labor-costs', name: 'Labor Costs', href: '/estimation/costing/labor', description: 'Labor rates' },
          { id: 'overhead-costs', name: 'Overhead Costs', href: '/estimation/costing/overhead', description: 'Overhead allocation' },
          { id: 'cost-breakdown', name: 'Cost Breakdown', href: '/estimation/costing/breakdown', description: 'Detailed breakdown' },
        ],
      },
      {
        id: 'pricing-management',
        name: 'Pricing & Margins',
        href: '#',
        description: 'Price calculations',
        subItems: [
          { id: 'all-pricing', name: 'All Pricing', href: '/estimation/pricing', description: 'View pricing' },
          { id: 'create-pricing', name: 'Create Pricing', href: '/estimation/pricing/add', description: 'New pricing' },
          { id: 'margin-analysis', name: 'Margin Analysis', href: '/estimation/pricing/margins', description: 'Profit margins' },
          { id: 'markup-rules', name: 'Markup Rules', href: '/estimation/pricing/markup', description: 'Pricing rules' },
          { id: 'competitive-pricing', name: 'Competitive Pricing', href: '/estimation/pricing/competitive', description: 'Market pricing' },
        ],
      },
      {
        id: 'estimate-workflow',
        name: 'Estimate Workflow',
        href: '#',
        description: 'Approval process',
        subItems: [
          { id: 'draft-estimates', name: 'Draft Estimates', href: '/estimation/workflow/drafts', description: 'Work in progress' },
          { id: 'pending-approval', name: 'Pending Approval', href: '/estimation/workflow/pending', description: 'Awaiting approval' },
          { id: 'approved-estimates', name: 'Approved Estimates', href: '/estimation/workflow/approved', description: 'Approved estimates' },
          { id: 'rejected-estimates', name: 'Rejected Estimates', href: '/estimation/workflow/rejected', description: 'Rejected estimates' },
          { id: 'converted-estimates', name: 'Converted to Orders', href: '/estimation/workflow/converted', description: 'Won estimates' },
        ],
      },
      {
        id: 'resource-rates',
        name: 'Resource Rates',
        href: '#',
        description: 'Rate cards',
        subItems: [
          { id: 'material-rates', name: 'Material Rate Cards', href: '/estimation/rates/materials', description: 'Material pricing' },
          { id: 'labor-rates', name: 'Labor Rate Cards', href: '/estimation/rates/labor', description: 'Labor rates' },
          { id: 'equipment-rates', name: 'Equipment Rates', href: '/estimation/rates/equipment', description: 'Equipment rental' },
          { id: 'subcontractor-rates', name: 'Subcontractor Rates', href: '/estimation/rates/subcontractors', description: 'Subcontractor pricing' },
        ],
      },
      {
        id: 'estimation-analytics',
        name: 'Analytics & Reports',
        href: '#',
        description: 'Estimation insights',
        subItems: [
          { id: 'estimation-reports', name: 'Estimation Reports', href: '/estimation/analytics/reports', description: 'Key reports' },
          { id: 'win-loss-analysis', name: 'Win/Loss Analysis', href: '/estimation/analytics/win-loss', description: 'Track success rate' },
          { id: 'accuracy-analysis', name: 'Accuracy Analysis', href: '/estimation/analytics/accuracy', description: 'Estimate vs. actual' },
          { id: 'estimator-performance', name: 'Estimator Performance', href: '/estimation/analytics/performance', description: 'Team metrics' },
        ],
      },
      {
        id: 'estimation-settings',
        name: 'Estimation Settings',
        href: '#',
        description: 'Configuration',
        subItems: [
          { id: 'estimation-templates', name: 'Estimate Templates', href: '/estimation/settings/templates', description: 'Template library' },
          { id: 'markup-settings', name: 'Markup Settings', href: '/estimation/settings/markup', description: 'Default markups' },
          { id: 'approval-workflow', name: 'Approval Workflow', href: '/estimation/settings/workflow', description: 'Configure approvals' },
          { id: 'cost-categories', name: 'Cost Categories', href: '/estimation/settings/categories', description: 'Define categories' },
        ],
      },
    ],
  },
  {
    id: 'cpq',
    name: 'CPQ (Configure, Price, Quote)',
    icon: Layers,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100',
    subItems: [
      { id: 'cpq-dashboard', name: 'CPQ Dashboard', href: '/cpq', description: 'CPQ overview' },
      {
        id: 'cpq-advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise CPQ capabilities',
        subItems: [
          { id: 'pricing-rules-engine', name: 'Pricing Rules Engine', href: '/cpq/advanced-features#pricing-rules', description: 'Automated pricing logic' },
          { id: 'version-control', name: 'Version Control', href: '/cpq/advanced-features#version-control', description: 'Track pricing changes' },
          { id: 'guided-selling-wizard', name: 'Guided Selling Wizard', href: '/cpq/advanced-features#guided-selling', description: 'Product configuration wizard' },
          { id: 'approval-workflows', name: 'Approval Workflows', href: '/cpq/advanced-features#approvals', description: 'Multi-level approvals' },
          { id: 'document-generation', name: 'Document Generation', href: '/cpq/advanced-features#documents', description: 'Template-based documents' },
          { id: 'e-signature-integration', name: 'E-Signature Integration', href: '/cpq/advanced-features#e-signature', description: 'Digital signatures' },
          { id: 'margin-analysis', name: 'Margin Analysis', href: '/cpq/advanced-features#margin-analysis', description: 'Real-time margin analytics' },
          { id: 'all-cpq-features', name: '→ View All Features', href: '/cpq/advanced-features', description: 'Complete feature showcase' },
        ],
      },
      {
        id: 'product-configuration',
        name: 'Product Configuration',
        href: '#',
        description: 'Configure products',
        subItems: [
          { id: 'product-catalog', name: 'Product Catalog', href: '/cpq/products/catalog', description: 'Browse products' },
          { id: 'product-configurator', name: 'Visual Configurator', href: '/cpq/products/configurator', description: 'Configure products' },
          { id: 'product-bundles', name: 'Product Bundles', href: '/cpq/products/bundles', description: 'Bundle products' },
          { id: 'product-options', name: 'Options & Variants', href: '/cpq/products/options', description: 'Manage options' },
          { id: 'product-rules', name: 'Configuration Rules', href: '/cpq/products/rules', description: 'Business rules' },
          { id: 'compatibility-matrix', name: 'Compatibility Matrix', href: '/cpq/products/compatibility', description: 'Product compatibility' },
        ],
      },
      {
        id: 'pricing-engine',
        name: 'Pricing Engine',
        href: '#',
        description: 'Dynamic pricing',
        subItems: [
          { id: 'price-rules', name: 'Pricing Rules', href: '/cpq/pricing/rules', description: 'Define pricing logic' },
          { id: 'dynamic-pricing', name: 'Dynamic Pricing', href: '/cpq/pricing/dynamic', description: 'Real-time pricing' },
          { id: 'volume-discounts', name: 'Volume Discounts', href: '/cpq/pricing/volume', description: 'Quantity breaks' },
          { id: 'customer-pricing', name: 'Customer-Specific Pricing', href: '/cpq/pricing/customer', description: 'Special pricing' },
          { id: 'contract-pricing', name: 'Contract Pricing', href: '/cpq/pricing/contracts', description: 'Contract rates' },
          { id: 'promotional-pricing', name: 'Promotional Pricing', href: '/cpq/pricing/promotions', description: 'Time-based offers' },
        ],
      },
      {
        id: 'quote-generation',
        name: 'Quote Generation',
        href: '#',
        description: 'Create quotes',
        subItems: [
          { id: 'all-quotes', name: 'All Quotes', href: '/cpq/quotes', description: 'View quotes' },
          { id: 'create-quote', name: 'Create Quote', href: '/cpq/quotes/create', description: 'New quote' },
          { id: 'quote-templates', name: 'Quote Templates', href: '/cpq/quotes/templates', description: 'Template library' },
          { id: 'quote-versions', name: 'Quote Versions', href: '/cpq/quotes/versions', description: 'Version control' },
          { id: 'quote-approval', name: 'Quote Approvals', href: '/cpq/quotes/approvals', description: 'Approval workflow' },
          { id: 'quote-comparison', name: 'Quote Comparison', href: '/cpq/quotes/comparison', description: 'Compare quotes' },
        ],
      },
      {
        id: 'guided-selling',
        name: 'Guided Selling',
        href: '#',
        description: 'Sales assistance',
        subItems: [
          { id: 'sales-playbooks', name: 'Sales Playbooks', href: '/cpq/guided-selling/playbooks', description: 'Sales scripts' },
          { id: 'product-recommendations', name: 'Product Recommendations', href: '/cpq/guided-selling/recommendations', description: 'AI suggestions' },
          { id: 'cross-sell-upsell', name: 'Cross-sell & Up-sell', href: '/cpq/guided-selling/cross-sell', description: 'Sales opportunities' },
          { id: 'sales-questionnaire', name: 'Sales Questionnaire', href: '/cpq/guided-selling/questionnaire', description: 'Needs assessment' },
        ],
      },
      {
        id: 'proposal-generation',
        name: 'Proposal Generation',
        href: '#',
        description: 'Professional proposals',
        subItems: [
          { id: 'proposal-builder', name: 'Proposal Builder', href: '/cpq/proposals/builder', description: 'Create proposals' },
          { id: 'proposal-templates', name: 'Proposal Templates', href: '/cpq/proposals/templates', description: 'Template library' },
          { id: 'content-library', name: 'Content Library', href: '/cpq/proposals/content', description: 'Reusable content' },
          { id: 'e-signatures', name: 'E-Signatures', href: '/cpq/proposals/signatures', description: 'Digital signing' },
        ],
      },
      {
        id: 'contract-management',
        name: 'Contract Management',
        href: '#',
        description: 'Contract lifecycle',
        subItems: [
          { id: 'contract-generation', name: 'Contract Generation', href: '/cpq/contracts/generate', description: 'Auto-generate contracts' },
          { id: 'contract-templates', name: 'Contract Templates', href: '/cpq/contracts/templates', description: 'Legal templates' },
          { id: 'contract-clauses', name: 'Contract Clauses', href: '/cpq/contracts/clauses', description: 'Clause library' },
          { id: 'contract-approval', name: 'Contract Approvals', href: '/cpq/contracts/approvals', description: 'Approval workflow' },
          { id: 'contract-execution', name: 'Contract Execution', href: '/cpq/contracts/execution', description: 'Sign & execute' },
        ],
      },
      {
        id: 'cpq-workflow',
        name: 'Workflow & Approvals',
        href: '#',
        description: 'Process automation',
        subItems: [
          { id: 'approval-workflows', name: 'Approval Workflows', href: '/cpq/workflow/approvals', description: 'Configure approvals' },
          { id: 'discount-approvals', name: 'Discount Approvals', href: '/cpq/workflow/discounts', description: 'Discount thresholds' },
          { id: 'legal-review', name: 'Legal Review', href: '/cpq/workflow/legal', description: 'Legal approval' },
          { id: 'executive-approval', name: 'Executive Approval', href: '/cpq/workflow/executive', description: 'C-level sign-off' },
        ],
      },
      {
        id: 'cpq-analytics',
        name: 'CPQ Analytics',
        href: '#',
        description: 'Performance insights',
        subItems: [
          { id: 'quote-analytics', name: 'Quote Analytics', href: '/cpq/analytics/quotes', description: 'Quote metrics' },
          { id: 'win-rate-analysis', name: 'Win Rate Analysis', href: '/cpq/analytics/win-rate', description: 'Success tracking' },
          { id: 'pricing-analytics', name: 'Pricing Analytics', href: '/cpq/analytics/pricing', description: 'Price optimization' },
          { id: 'sales-cycle-analysis', name: 'Sales Cycle Analysis', href: '/cpq/analytics/sales-cycle', description: 'Time to close' },
          { id: 'discount-analysis', name: 'Discount Analysis', href: '/cpq/analytics/discounts', description: 'Discount patterns' },
          { id: 'product-performance', name: 'Product Performance', href: '/cpq/analytics/products', description: 'Product insights' },
        ],
      },
      {
        id: 'cpq-integration',
        name: 'Integrations',
        href: '#',
        description: 'System connections',
        subItems: [
          { id: 'crm-integration', name: 'CRM Integration', href: '/cpq/integration/crm', description: 'Connect to CRM' },
          { id: 'erp-integration', name: 'ERP Integration', href: '/cpq/integration/erp', description: 'Connect to ERP' },
          { id: 'cad-integration', name: 'CAD Integration', href: '/cpq/integration/cad', description: 'Engineering tools' },
          { id: 'e-commerce-integration', name: 'E-Commerce Integration', href: '/cpq/integration/ecommerce', description: 'Online sales' },
        ],
      },
      {
        id: 'cpq-settings',
        name: 'CPQ Settings',
        href: '#',
        description: 'Configuration',
        subItems: [
          { id: 'cpq-general-settings', name: 'General Settings', href: '/cpq/settings/general', description: 'System config' },
          { id: 'user-permissions', name: 'User Permissions', href: '/cpq/settings/permissions', description: 'Access control' },
          { id: 'notification-settings', name: 'Notifications', href: '/cpq/settings/notifications', description: 'Alert settings' },
          { id: 'quote-numbering', name: 'Quote Numbering', href: '/cpq/settings/numbering', description: 'ID generation' },
        ],
      },
    ],
  },
  {
    id: 'production',
    name: 'Production',
    icon: Factory,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
    subItems: [
      { id: 'production-dashboard', name: 'Production Dashboard', href: '/production', description: 'Production overview' },
      {
        id: 'production-planning',
        name: 'Production Planning',
        href: '#',
        description: 'Plan production',
        subItems: [
          { id: 'ppg-planning', name: 'PPG Planning', href: '/production/ppg', description: 'Production planning group' },
          { id: 'master-planning', name: 'Master Planning', href: '/production/planning', description: 'Master production plan' },
          { id: 'capacity-planning', name: 'Capacity Planning', href: '/production/capacity-planning', description: 'Resource capacity' },
          { id: 'demand-planning', name: 'Demand Planning', href: '/production/planning/demand', description: 'Forecast demand' },
          { id: 'aggregate-planning', name: 'Aggregate Planning', href: '/production/planning/aggregate', description: 'Long-term planning' },
        ],
      },
      {
        id: 'mrp-management',
        name: 'MRP (Material Requirements)',
        href: '#',
        description: 'Material planning',
        subItems: [
          { id: 'mrp-run', name: 'MRP Run', href: '/production/mrp', description: 'Run MRP' },
          { id: 'mrp-results', name: 'MRP Results', href: '/production/mrp/results', description: 'View MRP output' },
          { id: 'planned-orders', name: 'Planned Orders', href: '/production/mrp/planned-orders', description: 'Suggested orders' },
          { id: 'material-requirements', name: 'Material Requirements', href: '/production/mrp/requirements', description: 'Material needs' },
          { id: 'shortage-analysis', name: 'Shortage Analysis', href: '/production/mrp/shortage', description: 'Identify shortages' },
        ],
      },
      {
        id: 'work-order-management',
        name: 'Work Orders',
        href: '#',
        description: 'Production orders',
        subItems: [
          { id: 'all-work-orders', name: 'All Work Orders', href: '/production/work-orders', description: 'View all WOs' },
          { id: 'create-work-order', name: 'Create Work Order', href: '/production/work-orders/add', description: 'New WO' },
          { id: 'pending-work-orders', name: 'Pending', href: '/production/work-orders/pending', description: 'Not started' },
          { id: 'in-progress-work-orders', name: 'In Progress', href: '/production/work-orders/progress', description: 'Active WOs' },
          { id: 'completed-work-orders', name: 'Completed', href: '/production/work-orders/completed', description: 'Finished WOs' },
          { id: 'work-order-tracking', name: 'WO Tracking', href: '/production/work-orders/tracking', description: 'Track progress' },
        ],
      },
      {
        id: 'bom-management',
        name: 'Bill of Materials (BOM)',
        href: '#',
        description: 'BOM management',
        subItems: [
          { id: 'all-bom', name: 'All BOMs', href: '/production/bom', description: 'View BOMs' },
          { id: 'create-bom', name: 'Create BOM', href: '/production/bom/add', description: 'New BOM' },
          { id: 'multi-level-bom', name: 'Multi-level BOM', href: '/production/bom/multi-level', description: 'Nested BOMs' },
          { id: 'bom-comparison', name: 'BOM Comparison', href: '/production/bom/comparison', description: 'Compare BOMs' },
          { id: 'bom-costing', name: 'BOM Costing', href: '/production/bom/costing', description: 'Cost analysis' },
          { id: 'bom-version-control', name: 'Version Control', href: '/production/bom/versions', description: 'BOM history' },
        ],
      },
      {
        id: 'production-scheduling',
        name: 'Production Scheduling',
        href: '#',
        description: 'Schedule production',
        subItems: [
          { id: 'all-schedules', name: 'All Schedules', href: '/production/scheduling', description: 'View schedules' },
          { id: 'create-schedule', name: 'Create Schedule', href: '/production/scheduling/add', description: 'New schedule' },
          { id: 'gantt-chart', name: 'Gantt Chart', href: '/production/scheduling/gantt', description: 'Visual timeline' },
          { id: 'resource-scheduling', name: 'Resource Scheduling', href: '/production/scheduling/resources', description: 'Allocate resources' },
          { id: 'job-sequencing', name: 'Job Sequencing', href: '/production/scheduling/sequencing', description: 'Optimize sequence' },
          { id: 'schedule-optimization', name: 'Schedule Optimization', href: '/production/scheduling/optimize', description: 'Auto-optimize' },
        ],
      },
      {
        id: 'shopfloor-execution',
        name: 'Shop Floor Execution',
        href: '#',
        description: 'Floor operations',
        subItems: [
          { id: 'shopfloor-control', name: 'Shop Floor Control', href: '/production/shopfloor', description: 'Floor management' },
          { id: 'floor-operations', name: 'Floor Operations', href: '/production/floor', description: 'Track operations' },
          { id: 'job-tracking', name: 'Job Tracking', href: '/production/shopfloor/tracking', description: 'Real-time tracking' },
          { id: 'operator-dashboard', name: 'Operator Dashboard', href: '/production/shopfloor/operator', description: 'Operator view' },
          { id: 'production-logs', name: 'Production Logs', href: '/production/shopfloor/logs', description: 'Activity logs' },
        ],
      },
      {
        id: 'quality-control',
        name: 'Quality Control',
        href: '#',
        description: 'Quality management',
        subItems: [
          { id: 'all-quality', name: 'Quality Inspections', href: '/production/quality', description: 'All inspections' },
          { id: 'create-inspection', name: 'Create Inspection', href: '/production/quality/add', description: 'New inspection' },
          { id: 'quality-plans', name: 'Quality Plans', href: '/production/quality/plans', description: 'Inspection plans' },
          { id: 'non-conformance', name: 'Non-Conformance', href: '/production/quality/ncr', description: 'NCR tracking' },
          { id: 'quality-reports', name: 'Quality Reports', href: '/production/quality/reports', description: 'Quality metrics' },
        ],
      },
      {
        id: 'maintenance',
        name: 'Maintenance Management',
        href: '#',
        description: 'Equipment maintenance',
        subItems: [
          { id: 'maintenance-overview', name: 'Maintenance Overview', href: '/production/maintenance', description: 'All maintenance' },
          { id: 'preventive-maintenance', name: 'Preventive Maintenance', href: '/production/maintenance/preventive', description: 'Scheduled PM' },
          { id: 'work-requests', name: 'Work Requests', href: '/production/maintenance/requests', description: 'Maintenance requests' },
          { id: 'equipment-history', name: 'Equipment History', href: '/production/maintenance/history', description: 'Maintenance logs' },
          { id: 'spare-parts', name: 'Spare Parts', href: '/production/maintenance/spares', description: 'Parts inventory' },
        ],
      },
      {
        id: 'downtime-tracking',
        name: 'Downtime Tracking',
        href: '#',
        description: 'Track downtime',
        subItems: [
          { id: 'downtime-overview', name: 'Downtime Overview', href: '/production/downtime', description: 'All downtime' },
          { id: 'downtime-entry', name: 'Log Downtime', href: '/production/downtime/log', description: 'Record downtime' },
          { id: 'downtime-analysis', name: 'Downtime Analysis', href: '/production/downtime/analysis', description: 'Analyze patterns' },
          { id: 'root-cause', name: 'Root Cause Analysis', href: '/production/downtime/rca', description: 'Find causes' },
        ],
      },
      {
        id: 'production-analytics',
        name: 'Production Analytics',
        href: '#',
        description: 'Performance insights',
        subItems: [
          { id: 'production-dashboard-analytics', name: 'Analytics Dashboard', href: '/production/analytics', description: 'Key metrics' },
          { id: 'oee-analysis', name: 'OEE Analysis', href: '/production/analytics/oee', description: 'Overall Equipment Effectiveness' },
          { id: 'productivity-analysis', name: 'Productivity Analysis', href: '/production/analytics/productivity', description: 'Output metrics' },
          { id: 'efficiency-reports', name: 'Efficiency Reports', href: '/production/analytics/efficiency', description: 'Efficiency tracking' },
          { id: 'variance-analysis', name: 'Variance Analysis', href: '/production/analytics/variance', description: 'Plan vs. actual' },
        ],
      },
      {
        id: 'production-settings',
        name: 'Production Settings',
        href: '#',
        description: 'Configuration',
        subItems: [
          { id: 'production-lines', name: 'Production Lines', href: '/production/settings/lines', description: 'Configure lines' },
          { id: 'work-centers', name: 'Work Centers', href: '/production/settings/work-centers', description: 'Define work centers' },
          { id: 'shift-management', name: 'Shift Management', href: '/production/settings/shifts', description: 'Manage shifts' },
          { id: 'routing', name: 'Routing', href: '/production/settings/routing', description: 'Process routing' },
        ],
      },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'MES-grade capabilities',
        subItems: [
          { id: 'finite-scheduling', name: 'Finite Scheduling', href: '/production/advanced-features#scheduling', description: 'Constraint-based planning' },
          { id: 'mes-integration', name: 'MES Integration', href: '/production/advanced-features#mes', description: 'Shop-floor data streaming' },
          { id: 'quality-checks', name: 'Quality Checks', href: '/production/advanced-features#quality', description: 'Inspection workflows' },
          { id: 'oee-analytics', name: 'OEE Analytics', href: '/production/advanced-features#oee', description: 'OEE drill-downs' },
          { id: 'maintenance-coord', name: 'Maintenance Coordination', href: '/production/advanced-features#maintenance', description: 'Preventive maintenance' },
          { id: 'traceability', name: 'Traceability & Genealogy', href: '/production/advanced-features#traceability', description: 'Product traceability' },
          { id: 'shopfloor-control', name: 'Shop Floor Control', href: '/production/advanced-features#shopfloor', description: 'Real-time monitoring' },
          { id: 'all-production-features', name: '→ View All Features', href: '/production/advanced-features', description: 'Complete feature set' },
        ],
      },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
    subItems: [
      { id: 'inventory-dashboard', name: 'Inventory Dashboard', href: '/inventory', description: 'Inventory overview' },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'WMS-grade capabilities',
        subItems: [
          { id: 'demand-planning', name: 'Demand Planning', href: '/inventory/advanced-features#demand', description: 'AI forecasting' },
          { id: 'abc-analysis', name: 'ABC Analysis', href: '/inventory/advanced-features#abc', description: 'Inventory classification' },
          { id: 'warehouse-tasking', name: 'Warehouse Tasking', href: '/inventory/advanced-features#tasking', description: 'Task management' },
          { id: 'barcode-scanning', name: 'Barcode Scanning', href: '/inventory/advanced-features#barcode', description: 'Mobile scanning' },
          { id: 'cycle-count', name: 'Cycle Count', href: '/inventory/advanced-features#cycle-count', description: 'Perpetual counting' },
          { id: 'auto-replenishment', name: 'Auto Replenishment', href: '/inventory/advanced-features#replenishment', description: 'Automated reordering' },
          { id: 'multi-warehouse', name: 'Multi-Warehouse', href: '/inventory/advanced-features#multi-warehouse', description: 'Network optimization' },
          { id: 'all-inventory-features', name: '→ View All Features', href: '/inventory/advanced-features', description: 'Complete feature showcase' },
        ],
      },
      {
        id: 'stock-management',
        name: 'Stock Management',
        href: '#',
        description: 'Manage stock levels',
        subItems: [
          { id: 'all-stock', name: 'All Stock Items', href: '/inventory/stock', description: 'View all stock' },
          { id: 'create-stock', name: 'Add Stock Item', href: '/inventory/stock/add', description: 'New item' },
          { id: 'stock-levels', name: 'Stock Levels', href: '/inventory/stock/levels', description: 'Current levels' },
          { id: 'low-stock', name: 'Low Stock Alert', href: '/inventory/stock/low-stock', description: 'Reorder alerts' },
          { id: 'stock-valuation', name: 'Stock Valuation', href: '/inventory/stock/valuation', description: 'Inventory value' },
          { id: 'stock-aging', name: 'Stock Aging', href: '/inventory/stock/aging', description: 'Aging analysis' },
        ],
      },
      {
        id: 'warehouse-management',
        name: 'Warehouse Management',
        href: '#',
        description: 'Warehouse operations',
        subItems: [
          { id: 'all-warehouses', name: 'All Warehouses', href: '/inventory/warehouse', description: 'View warehouses' },
          { id: 'warehouse-locations', name: 'Storage Locations', href: '/inventory/warehouse/locations', description: 'Bin locations' },
          { id: 'warehouse-capacity', name: 'Warehouse Capacity', href: '/inventory/warehouse/capacity', description: 'Space utilization' },
          { id: 'warehouse-zones', name: 'Warehouse Zones', href: '/inventory/warehouse/zones', description: 'Zone management' },
        ],
      },
      {
        id: 'stock-movements',
        name: 'Stock Movements',
        href: '#',
        description: 'Track movements',
        subItems: [
          { id: 'all-movements', name: 'All Movements', href: '/inventory/movements', description: 'Movement history' },
          { id: 'create-movement', name: 'Record Movement', href: '/inventory/movements/add', description: 'Log movement' },
          { id: 'goods-receipt', name: 'Goods Receipt', href: '/inventory/movements/receipt', description: 'Receive goods' },
          { id: 'goods-issue', name: 'Goods Issue', href: '/inventory/movements/issue', description: 'Issue materials' },
          { id: 'movement-reports', name: 'Movement Reports', href: '/inventory/movements/reports', description: 'Movement analytics' },
        ],
      },
      {
        id: 'inventory-adjustments',
        name: 'Inventory Adjustments',
        href: '#',
        description: 'Stock adjustments',
        subItems: [
          { id: 'all-adjustments', name: 'All Adjustments', href: '/inventory/adjustments', description: 'View adjustments' },
          { id: 'create-adjustment', name: 'Create Adjustment', href: '/inventory/adjustments/create', description: 'New adjustment' },
          { id: 'quantity-adjustments', name: 'Quantity Adjustments', href: '/inventory/adjustments/quantity', description: 'Adjust quantities' },
          { id: 'value-adjustments', name: 'Value Adjustments', href: '/inventory/adjustments/value', description: 'Adjust values' },
          { id: 'adjustment-approval', name: 'Adjustment Approvals', href: '/inventory/adjustments/approvals', description: 'Pending approvals' },
          { id: 'adjustment-reasons', name: 'Adjustment Reasons', href: '/inventory/adjustments/reasons', description: 'Reason codes' },
          { id: 'write-offs', name: 'Write-offs & Scrapping', href: '/inventory/adjustments/write-offs', description: 'Write off stock' },
        ],
      },
      {
        id: 'stock-transfers',
        name: 'Stock Transfers',
        href: '#',
        description: 'Inter-warehouse transfers',
        subItems: [
          { id: 'all-transfers', name: 'All Transfers', href: '/inventory/transfers', description: 'View transfers' },
          { id: 'create-transfer', name: 'Create Transfer', href: '/inventory/transfers/create', description: 'New transfer' },
          { id: 'pending-transfers', name: 'Pending Transfers', href: '/inventory/transfers/pending', description: 'In transit' },
          { id: 'completed-transfers', name: 'Completed Transfers', href: '/inventory/transfers/completed', description: 'Finished' },
        ],
      },
      {
        id: 'physical-inventory',
        name: 'Physical Inventory',
        href: '#',
        description: 'Cycle counting',
        subItems: [
          { id: 'cycle-counts', name: 'Cycle Counts', href: '/inventory/cycle-count', description: 'Schedule counts' },
          { id: 'physical-count', name: 'Physical Count', href: '/inventory/cycle-count/physical', description: 'Perform count' },
          { id: 'count-variance', name: 'Count Variance', href: '/inventory/cycle-count/variance', description: 'Variance analysis' },
          { id: 'stock-reconciliation', name: 'Stock Reconciliation', href: '/inventory/cycle-count/reconciliation', description: 'Reconcile stock' },
        ],
      },
      {
        id: 'inventory-tracking',
        name: 'Inventory Tracking',
        href: '#',
        description: 'Track inventory',
        subItems: [
          { id: 'serial-numbers', name: 'Serial Numbers', href: '/inventory/tracking/serial', description: 'Serial tracking' },
          { id: 'batch-lots', name: 'Batch/Lot Numbers', href: '/inventory/tracking/batch', description: 'Batch tracking' },
          { id: 'expiry-tracking', name: 'Expiry Tracking', href: '/inventory/tracking/expiry', description: 'Expiration dates' },
          { id: 'barcode-scanning', name: 'Barcode Scanning', href: '/inventory/tracking/barcode', description: 'Barcode management' },
        ],
      },
      {
        id: 'replenishment-orders',
        name: 'Replenishment Orders',
        href: '#',
        description: 'Automatic replenishment',
        subItems: [
          { id: 'all-replenishment', name: 'All Replenishment Orders', href: '/inventory/replenishment', description: 'View all orders' },
          { id: 'create-replenishment', name: 'Create Replenishment', href: '/inventory/replenishment/create', description: 'New order' },
          { id: 'auto-replenishment', name: 'Auto Replenishment', href: '/inventory/replenishment/auto', description: 'Automatic ordering' },
          { id: 'replenishment-suggestions', name: 'Replenishment Suggestions', href: '/inventory/replenishment/suggestions', description: 'AI suggestions' },
          { id: 'replenishment-rules', name: 'Replenishment Rules', href: '/inventory/replenishment/rules', description: 'Define rules' },
          { id: 'min-max-planning', name: 'Min-Max Planning', href: '/inventory/replenishment/min-max', description: 'Min/Max levels' },
        ],
      },
      {
        id: 'inventory-optimization',
        name: 'Inventory Optimization',
        href: '#',
        description: 'Optimize inventory',
        subItems: [
          { id: 'reorder-points', name: 'Reorder Points', href: '/inventory/optimization/reorder', description: 'Min/Max levels' },
          { id: 'safety-stock', name: 'Safety Stock', href: '/inventory/optimization/safety-stock', description: 'Safety levels' },
          { id: 'abc-analysis', name: 'ABC Analysis', href: '/inventory/optimization/abc', description: 'Classify items' },
          { id: 'demand-forecasting', name: 'Demand Forecasting', href: '/inventory/optimization/forecast', description: 'Predict demand' },
          { id: 'inventory-planning', name: 'Inventory Planning', href: '/inventory/optimization/planning', description: 'Strategic planning' },
          { id: 'eoq-calculation', name: 'EOQ Calculation', href: '/inventory/optimization/eoq', description: 'Economic Order Quantity' },
        ],
      },
      {
        id: 'kitting-assembly',
        name: 'Kitting & Assembly',
        href: '#',
        description: 'Kit management',
        subItems: [
          { id: 'kits', name: 'Kits', href: '/inventory/kitting/kits', description: 'Manage kits' },
          { id: 'kit-assembly', name: 'Kit Assembly', href: '/inventory/kitting/assembly', description: 'Assemble kits' },
          { id: 'kit-disassembly', name: 'Kit Disassembly', href: '/inventory/kitting/disassembly', description: 'Break down kits' },
        ],
      },
      {
        id: 'inventory-analytics',
        name: 'Inventory Analytics',
        href: '#',
        description: 'Inventory insights',
        subItems: [
          { id: 'inventory-reports', name: 'Inventory Reports', href: '/inventory/analytics/reports', description: 'Standard reports' },
          { id: 'turnover-analysis', name: 'Inventory Turnover', href: '/inventory/analytics/turnover', description: 'Turnover ratio' },
          { id: 'dead-stock', name: 'Dead Stock Analysis', href: '/inventory/analytics/dead-stock', description: 'Non-moving items' },
          { id: 'carrying-cost', name: 'Carrying Cost', href: '/inventory/analytics/carrying-cost', description: 'Holding costs' },
          { id: 'stock-velocity', name: 'Stock Velocity', href: '/inventory/analytics/velocity', description: 'Movement speed' },
        ],
      },
      {
        id: 'inventory-settings',
        name: 'Inventory Settings',
        href: '#',
        description: 'Configuration',
        subItems: [
          { id: 'inventory-categories', name: 'Item Categories', href: '/inventory/settings/categories', description: 'Define categories' },
          { id: 'unit-of-measure', name: 'Unit of Measure', href: '/inventory/settings/uom', description: 'UOM configuration' },
          { id: 'storage-types', name: 'Storage Types', href: '/inventory/settings/storage', description: 'Storage config' },
          { id: 'inventory-policies', name: 'Inventory Policies', href: '/inventory/settings/policies', description: 'Business rules' },
        ],
      },
    ],
  },
  {
    id: 'procurement',
    name: 'Procurement',
    icon: ShoppingBag,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    hoverColor: 'hover:bg-cyan-100',
    subItems: [
      { id: 'dashboard', name: 'Procurement Dashboard', href: '/procurement', description: 'Overview & analytics' },
      { id: 'calendar', name: 'Procurement Calendar', href: '/procurement/calendar', description: 'Schedule & deadlines' },
      {
        id: 'purchase-requisitions',
        name: 'Purchase Requisitions',
        href: '#',
        description: 'PR management',
        subItems: [
          { id: 'all-requisitions', name: 'All Requisitions', href: '/procurement/requisitions', description: 'PR list' },
          { id: 'create-pr', name: 'Create Requisition', href: '/procurement/requisitions/add', description: 'New PR' },
          { id: 'pr-approvals', name: 'PR Approvals', href: '/procurement/approvals', description: 'Approve PRs' },
        ],
      },
      {
        id: 'rfq-rfp',
        name: 'RFQ & RFP',
        href: '#',
        description: 'Quotations & proposals',
        subItems: [
          { id: 'rfq-list', name: 'RFQ Management', href: '/procurement/rfq', description: 'All RFQs' },
          { id: 'rfq-comparison', name: 'Quote Comparison', href: '/procurement/rfq-rfp', description: 'Compare quotes' },
        ],
      },
      {
        id: 'purchase-orders',
        name: 'Purchase Orders',
        href: '#',
        description: 'PO management',
        subItems: [
          { id: 'all-po', name: 'All Purchase Orders', href: '/procurement/purchase-orders', description: 'PO list' },
          { id: 'create-po', name: 'Create PO', href: '/procurement/purchase-orders/create', description: 'New PO' },
          { id: 'po-tracking', name: 'PO Tracking', href: '/procurement/po', description: 'Track orders' },
        ],
      },
      {
        id: 'grn-receiving',
        name: 'GRN & Receiving',
        href: '#',
        description: 'Goods receipt',
        subItems: [
          { id: 'grn-list', name: 'Goods Receipt Notes', href: '/procurement/grn', description: 'All GRNs' },
          { id: 'create-grn', name: 'Create GRN', href: '/procurement/grn/add', description: 'New GRN' },
          { id: 'quality-inspection', name: 'Quality Inspection', href: '/procurement/quality-assurance', description: 'QC at receiving' },
        ],
      },
      {
        id: 'vendor-management',
        name: 'Vendor Management',
        href: '#',
        description: 'Supplier management',
        subItems: [
          { id: 'vendor-list', name: 'Vendor Master', href: '/procurement/vendors', description: 'All vendors' },
          { id: 'add-vendor', name: 'Add Vendor', href: '/procurement/vendors/add', description: 'New vendor' },
          { id: 'vendor-portal', name: 'Supplier Portal', href: '/procurement/supplier-portal', description: 'Vendor portal' },
          { id: 'vendor-onboarding', name: 'Vendor Onboarding', href: '/procurement/supplier-onboarding', description: 'Onboard suppliers' },
          { id: 'vendor-performance', name: 'Vendor Performance', href: '/procurement/vendor-performance', description: 'Performance metrics' },
          { id: 'vendor-scorecard', name: 'Supplier Scorecard', href: '/procurement/supplier-scorecard', description: 'Vendor ratings' },
        ],
      },
      {
        id: 'contracts',
        name: 'Contract Management',
        href: '#',
        description: 'Supplier contracts',
        subItems: [
          { id: 'contract-list', name: 'All Contracts', href: '/procurement/contracts', description: 'Contract repository' },
          { id: 'contract-mgmt', name: 'Contract Lifecycle', href: '/procurement/contract-management', description: 'Manage contracts' },
        ],
      },
      {
        id: 'strategic-sourcing',
        name: 'Strategic Sourcing',
        href: '#',
        description: 'Sourcing strategy',
        subItems: [
          { id: 'sourcing', name: 'Strategic Sourcing', href: '/procurement/strategic-sourcing', description: 'Sourcing initiatives' },
          { id: 'category-mgmt', name: 'Category Management', href: '/procurement/category-management', description: 'Spend categories' },
          { id: 'e-marketplace', name: 'E-Marketplace', href: '/procurement/e-marketplace', description: 'Online marketplace' },
        ],
      },
      {
        id: 'financial',
        name: 'Financial & Invoicing',
        href: '#',
        description: 'Procurement finance',
        subItems: [
          { id: 'invoices', name: 'Vendor Invoices', href: '/procurement/invoices', description: 'Invoice processing' },
          { id: 'budget', name: 'Procurement Budget', href: '/procurement/budget', description: 'Budget allocation' },
          { id: 'budget-tracking', name: 'Budget Tracking', href: '/procurement/budget-tracking', description: 'Track spending' },
          { id: 'savings-tracker', name: 'Savings Tracker', href: '/procurement/savings-tracker', description: 'Cost savings' },
        ],
      },
      {
        id: 'analytics-reporting',
        name: 'Analytics & Reporting',
        href: '#',
        description: 'Procurement insights',
        subItems: [
          { id: 'analytics', name: 'Procurement Analytics', href: '/procurement/analytics', description: 'BI dashboard' },
          { id: 'spend-analysis', name: 'Spend Analysis', href: '/procurement/spend-analysis', description: 'Analyze spending' },
        ],
      },
      {
        id: 'compliance-risk',
        name: 'Compliance & Risk',
        href: '#',
        description: 'Risk management',
        subItems: [
          { id: 'compliance', name: 'Compliance', href: '/procurement/compliance', description: 'Regulatory compliance' },
          { id: 'risk-management', name: 'Risk Management', href: '/procurement/risk-management', description: 'Identify risks' },
          { id: 'supplier-diversity', name: 'Supplier Diversity', href: '/procurement/supplier-diversity', description: 'Diversity programs' },
        ],
      },
      {
        id: 'automation-tools',
        name: 'Automation & Tools',
        href: '#',
        description: 'Process automation',
        subItems: [
          { id: 'automation', name: 'Process Automation', href: '/procurement/automation', description: 'Automated workflows' },
          { id: 'collaboration', name: 'Collaboration Tools', href: '/procurement/collaboration', description: 'Team collaboration' },
          { id: 'notifications', name: 'Notifications', href: '/procurement/notifications', description: 'Alerts & reminders' },
        ],
      },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise procurement capabilities',
        subItems: [
          { id: 'supplier-portal', name: 'Supplier Portal', href: '/procurement/advanced-features#portal', description: 'Supplier collaboration' },
          { id: 'contract-compliance', name: 'Contract Compliance', href: '/procurement/advanced-features#contracts', description: 'Contract management' },
          { id: 'sourcing-events', name: 'Sourcing Events', href: '/procurement/advanced-features#sourcing', description: 'RFQ/RFP/Auctions' },
          { id: 'approval-workflows', name: 'Approval Workflows', href: '/procurement/advanced-features#approvals', description: 'Multi-level approvals' },
          { id: 'risk-scoring', name: 'Supplier Risk Scoring', href: '/procurement/advanced-features#risk', description: 'Risk assessment' },
          { id: 'savings-tracking', name: 'Savings Tracking', href: '/procurement/advanced-features#savings', description: 'Cost savings dashboard' },
          { id: 'spend-analytics', name: 'Spend Analytics', href: '/procurement/advanced-features#spend', description: 'Spend analysis' },
          { id: 'all-procurement-features', name: '→ View All Features', href: '/procurement/advanced-features', description: 'Complete feature set' },
        ],
      },
    ],
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: FolderKanban,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    hoverColor: 'hover:bg-teal-100',
    subItems: [
      { id: 'dashboard', name: 'Projects Dashboard', href: '/project-management/dashboard', description: 'Overview of all projects' },
      { id: 'all-projects', name: 'All Projects', href: '/project-management', description: 'Project list' },
      { id: 'create-project', name: 'Create Project', href: '/project-management/create', description: 'New project' },
      {
        id: 'project-planning',
        name: 'Project Planning',
        href: '#',
        description: 'Planning & execution',
        subItems: [
          { id: 'wbs', name: 'Work Breakdown Structure', href: '/project-management/wbs', description: 'Task hierarchy' },
          { id: 'schedule', name: 'Project Schedule', href: '/project-management/schedule', description: 'Timeline planning' },
          { id: 'timeline', name: 'Timeline View', href: '/project-management/timeline', description: 'Gantt chart' },
          { id: 'tasks', name: 'Tasks', href: '/project-management/tasks', description: 'Task management' },
          { id: 'milestones', name: 'Milestone Templates', href: '/project-management/milestone-templates', description: 'Project milestones' },
          { id: 'deliverables', name: 'Deliverables', href: '/project-management/deliverables', description: 'Project outputs' },
        ],
      },
      {
        id: 'execution-tracking',
        name: 'Execution & Tracking',
        href: '#',
        description: 'Project execution',
        subItems: [
          { id: 'progress', name: 'Progress Tracking', href: '/project-management/progress', description: 'Track progress' },
          { id: 'issues', name: 'Issues & Problems', href: '/project-management/issues', description: 'Issue tracking' },
          { id: 'site-issues', name: 'Site Issues', href: '/project-management/site-issues', description: 'On-site problems' },
          { id: 'change-orders', name: 'Change Orders', href: '/project-management/change-orders', description: 'Scope changes' },
          { id: 'site-survey', name: 'Site Survey', href: '/project-management/site-survey', description: 'Site inspection' },
          { id: 'installation-tracking', name: 'Installation Tracking', href: '/project-management/installation-tracking', description: 'Track installations' },
          { id: 'quality-inspection', name: 'Quality Inspection', href: '/project-management/quality-inspection', description: 'QC checks' },
        ],
      },
      {
        id: 'resource-management',
        name: 'Resource Management',
        href: '#',
        description: 'Resource allocation',
        subItems: [
          { id: 'resources', name: 'Resources', href: '/project-management/resources', description: 'Resource master' },
          { id: 'resource-allocation', name: 'Resource Allocation', href: '/project-management/resource-allocation', description: 'Allocate resources' },
          { id: 'resource-utilization', name: 'Resource Utilization', href: '/project-management/resource-utilization', description: 'Usage analytics' },
          { id: 'labor-tracking', name: 'Labor Tracking', href: '/project-management/labor-tracking', description: 'Track workforce' },
        ],
      },
      {
        id: 'financial-management',
        name: 'Financial Management',
        href: '#',
        description: 'Budget & costs',
        subItems: [
          { id: 'budget', name: 'Project Budget', href: '/project-management/budget', description: 'Budget planning' },
          { id: 'project-costing', name: 'Project Costing', href: '/project-management/project-costing', description: 'Cost tracking' },
          { id: 'profitability', name: 'Profitability Analysis', href: '/project-management/profitability', description: 'Project P&L' },
        ],
      },
      {
        id: 'material-management',
        name: 'Material Management',
        href: '#',
        description: 'Project materials',
        subItems: [
          { id: 'mrp', name: 'Material Requirements Planning', href: '/project-management/mrp', description: 'MRP for projects' },
          { id: 'material-consumption', name: 'Material Consumption', href: '/project-management/material-consumption', description: 'Track usage' },
        ],
      },
      {
        id: 'commissioning-closeout',
        name: 'Commissioning & Closeout',
        href: '#',
        description: 'Project closure',
        subItems: [
          { id: 'commissioning', name: 'Commissioning', href: '/project-management/commissioning', description: 'System commissioning' },
          { id: 'customer-acceptance', name: 'Customer Acceptance', href: '/project-management/customer-acceptance', description: 'Client sign-off' },
        ],
      },
      {
        id: 'collaboration',
        name: 'Documents & Reports',
        href: '#',
        description: 'Documentation',
        subItems: [
          { id: 'documents', name: 'Project Documents', href: '/project-management/documents', description: 'Project files' },
          { id: 'reports', name: 'Reports', href: '/project-management/reports', description: 'Project reports' },
          { id: 'analytics', name: 'Analytics', href: '/project-management/analytics', description: 'Project analytics' },
        ],
      },
      {
        id: 'settings',
        name: 'Settings & Configuration',
        href: '#',
        description: 'Project configuration',
        subItems: [
          { id: 'templates', name: 'Project Templates', href: '/project-management/templates', description: 'Reusable templates' },
          { id: 'project-types', name: 'Project Types', href: '/project-management/project-types', description: 'Project categories' },
          { id: 'settings', name: 'Settings', href: '/project-management/settings', description: 'Configuration' },
        ],
      },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise-grade capabilities',
        subItems: [
          { id: 'project-health', name: 'Project Health Scoring', href: '/projects/advanced-features#health', description: 'Real-time health monitoring' },
          { id: 'dependencies', name: 'Cross-Project Dependencies', href: '/projects/advanced-features#dependencies', description: 'Dependency tracking' },
          { id: 'financial-rollup', name: 'Financial Rollup', href: '/projects/advanced-features#financial', description: 'Multi-project consolidation' },
          { id: 'resource-leveling', name: 'Resource Leveling', href: '/projects/advanced-features#resources', description: 'Resource optimization' },
          { id: 'change-control', name: 'Change Control', href: '/projects/advanced-features#changes', description: 'Change management' },
          { id: 'stakeholder-hub', name: 'Stakeholder Hub', href: '/projects/advanced-features#stakeholders', description: 'Communication platform' },
          { id: 'all-project-features', name: '→ View All Features', href: '/projects/advanced-features', description: 'Complete feature set' },
        ],
      },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: DollarSign,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    hoverColor: 'hover:bg-yellow-100',
    subItems: [
      { id: 'dashboard', name: 'Finance Dashboard', href: '/finance/dashboard', description: 'Financial overview' },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise finance tools',
        subItems: [
          { id: 'general-ledger-advanced', name: 'General Ledger & Journals', href: '/finance/advanced-features#general-ledger', description: 'Advanced GL operations' },
          { id: 'multi-entity-consolidation', name: 'Multi-Entity Consolidation', href: '/finance/advanced-features#consolidation', description: 'Group consolidation' },
          { id: 'audit-trail-advanced', name: 'Advanced Audit Trail', href: '/finance/advanced-features#audit-trail', description: 'Comprehensive audit logs' },
          { id: 'compliance-automation', name: 'Compliance Automation', href: '/finance/advanced-features#compliance', description: 'Automated compliance' },
          { id: 'treasury-management', name: 'Treasury Management', href: '/finance/advanced-features#treasury', description: 'Cash & investments' },
          { id: 'predictive-forecasting', name: 'Predictive Cash Forecasting', href: '/finance/advanced-features#cash-forecast', description: 'AI-powered forecasts' },
          { id: 'financial-controls-advanced', name: 'Financial Controls & SOD', href: '/finance/controls', description: 'Internal controls' },
          { id: 'all-advanced-features', name: '→ View All Features', href: '/finance/advanced-features', description: 'Complete feature showcase' },
        ],
      },
      {
        id: 'accounting',
        name: 'Accounting',
        href: '#',
        description: 'General ledger & accounts',
        subItems: [
          { id: 'chart-of-accounts', name: 'Chart of Accounts', href: '/finance/accounting/chart-of-accounts', description: 'COA management' },
          { id: 'general-ledger', name: 'General Ledger', href: '/finance/accounting/general-ledger', description: 'GL entries' },
          { id: 'journal-entries', name: 'Journal Entries', href: '/finance/accounting/journal-entries', description: 'Manual journals' },
          { id: 'trial-balance', name: 'Trial Balance', href: '/finance/accounting/trial-balance', description: 'Trial balance report' },
          { id: 'ledger-report', name: 'Ledger Report', href: '/finance/accounting/ledger-report', description: 'Ledger reports' },
          { id: 'periods', name: 'Accounting Periods', href: '/finance/accounting/periods', description: 'Period management' },
        ],
      },
      {
        id: 'receivables',
        name: 'Accounts Receivable',
        href: '#',
        description: 'Customer invoices & payments',
        subItems: [
          { id: 'ar-invoices', name: 'Customer Invoices', href: '/finance/receivables/invoices', description: 'Sales invoices' },
          { id: 'ar-payments', name: 'Customer Payments', href: '/finance/receivables', description: 'Payment receipts' },
          { id: 'credit-management', name: 'Credit Management', href: '/finance/receivables/credit-management', description: 'Credit limits' },
          { id: 'aging-report', name: 'Aging Report', href: '/finance/receivables/aging', description: 'AR aging' },
        ],
      },
      {
        id: 'payables',
        name: 'Accounts Payable',
        href: '#',
        description: 'Vendor bills & payments',
        subItems: [
          { id: 'ap-bills', name: 'Vendor Bills', href: '/finance/payables', description: 'Purchase bills' },
          { id: 'ap-payments', name: 'Vendor Payments', href: '/finance/payables/payments', description: 'Payment processing' },
          { id: 'aging-payables', name: 'Aging Report', href: '/finance/payables/aging', description: 'AP aging' },
        ],
      },
      {
        id: 'cash-bank',
        name: 'Cash & Bank',
        href: '#',
        description: 'Cash flow & banking',
        subItems: [
          { id: 'bank-accounts', name: 'Bank Accounts', href: '/finance/cash/bank-accounts', description: 'Bank account setup' },
          { id: 'bank-reconciliation', name: 'Bank Reconciliation', href: '/finance/cash/bank-reconciliation', description: 'Reconcile statements' },
          { id: 'cash-flow-forecast', name: 'Cash Flow Forecast', href: '/finance/cash/cash-flow-forecast', description: 'Cash projections' },
          { id: 'anticipated-receipts', name: 'Anticipated Receipts', href: '/finance/cash/anticipated-receipts', description: 'Expected inflows' },
          { id: 'anticipated-payments', name: 'Anticipated Payments', href: '/finance/cash/anticipated-payments', description: 'Expected outflows' },
        ],
      },
      {
        id: 'fixed-assets',
        name: 'Fixed Assets',
        href: '#',
        description: 'Asset management',
        subItems: [
          { id: 'asset-register', name: 'Asset Register', href: '/finance/assets/fixed-assets', description: 'Asset list' },
          { id: 'depreciation', name: 'Depreciation', href: '/finance/assets/depreciation', description: 'Calculate depreciation' },
          { id: 'asset-disposal', name: 'Asset Disposal', href: '/finance/assets/asset-disposal', description: 'Dispose assets' },
        ],
      },
      {
        id: 'budgeting',
        name: 'Budgeting',
        href: '#',
        description: 'Budget planning',
        subItems: [
          { id: 'budgets', name: 'Budgets', href: '/finance/budgeting/budgets', description: 'Budget management' },
          { id: 'budget-vs-actual', name: 'Budget vs Actual', href: '/finance/budgeting/budget-vs-actual', description: 'Variance analysis' },
          { id: 'multi-year-planning', name: 'Multi-Year Planning', href: '/finance/budgeting/multi-year-planning', description: 'Long-term plans' },
        ],
      },
      {
        id: 'costing',
        name: 'Costing',
        href: '#',
        description: 'Cost accounting',
        subItems: [
          { id: 'cost-centers', name: 'Cost Centers', href: '/finance/costing/cost-centers', description: 'Cost center setup' },
          { id: 'profit-centers', name: 'Profit Centers', href: '/finance/costing/profit-centers', description: 'Profit center setup' },
          { id: 'job-costing', name: 'Job Costing', href: '/finance/costing/job-costing', description: 'Project costing' },
          { id: 'standard-costing', name: 'Standard Costing', href: '/finance/costing/standard-costing', description: 'Standard costs' },
          { id: 'variance-analysis', name: 'Variance Analysis', href: '/finance/costing/variance-analysis', description: 'Cost variances' },
          { id: 'wip-accounting', name: 'WIP Accounting', href: '/finance/costing/wip-accounting', description: 'Work in progress' },
        ],
      },
      {
        id: 'tax',
        name: 'Tax Management',
        href: '#',
        description: 'Tax compliance',
        subItems: [
          { id: 'gst', name: 'GST/VAT', href: '/finance/tax/gst', description: 'GST management' },
          { id: 'tds', name: 'TDS/Withholding Tax', href: '/finance/tax/tds', description: 'TDS processing' },
          { id: 'tax-reports', name: 'Tax Reports', href: '/finance/tax/tax-reports', description: 'Tax filing reports' },
        ],
      },
      {
        id: 'currency',
        name: 'Multi-Currency',
        href: '#',
        description: 'Currency management',
        subItems: [
          { id: 'currency-setup', name: 'Currency Setup', href: '/finance/currency/management', description: 'Currency master' },
          { id: 'exchange-rates', name: 'Exchange Rates', href: '/finance/currency/exchange-rates', description: 'Rate management' },
          { id: 'gain-loss', name: 'Forex Gain/Loss', href: '/finance/currency/gain-loss', description: 'Currency adjustments' },
        ],
      },
      {
        id: 'financial-reports',
        name: 'Financial Reports',
        href: '#',
        description: 'Statutory reports',
        subItems: [
          { id: 'profit-loss', name: 'Profit & Loss', href: '/finance/reports/profit-loss', description: 'P&L statement' },
          { id: 'balance-sheet', name: 'Balance Sheet', href: '/finance/reports/balance-sheet', description: 'Balance sheet' },
          { id: 'cash-flow-statement', name: 'Cash Flow Statement', href: '/finance/reports/cash-flow', description: 'Cash flow report' },
          { id: 'trial-balance-report', name: 'Trial Balance', href: '/finance/reports/trial-balance', description: 'Trial balance' },
        ],
      },
      {
        id: 'analytics',
        name: 'Financial Analytics',
        href: '#',
        description: 'Business intelligence',
        subItems: [
          { id: 'kpi-dashboard', name: 'KPI Dashboard', href: '/finance/analytics/kpi-dashboard', description: 'Key metrics' },
          { id: 'financial-ratios', name: 'Financial Ratios', href: '/finance/analytics/financial-ratios', description: 'Ratio analysis' },
          { id: 'profitability-analysis', name: 'Profitability Analysis', href: '/finance/analytics/profitability-analysis', description: 'Profit analytics' },
        ],
      },
      {
        id: 'consolidation',
        name: 'Consolidation',
        href: '#',
        description: 'Multi-entity consolidation',
        subItems: [
          { id: 'intercompany', name: 'Intercompany Transactions', href: '/finance/consolidation/intercompany', description: 'IC eliminations' },
          { id: 'financial-consolidation', name: 'Financial Consolidation', href: '/finance/consolidation/financial-consolidation', description: 'Group reporting' },
        ],
      },
      {
        id: 'period-operations',
        name: 'Period Operations',
        href: '#',
        description: 'Period close',
        subItems: [
          { id: 'period-close', name: 'Period Close', href: '/finance/period-operations/period-close', description: 'Monthly close' },
          { id: 'year-end', name: 'Year End Close', href: '/finance/period-operations/year-end', description: 'Annual close' },
        ],
      },
      {
        id: 'controls',
        name: 'Controls & Compliance',
        href: '#',
        description: 'Internal controls',
        subItems: [
          { id: 'audit-trail', name: 'Audit Trail', href: '/finance/controls/audit-trail', description: 'Transaction history' },
          { id: 'approval-workflows', name: 'Approval Workflows', href: '/finance/controls/approval-workflows', description: 'Approval setup' },
          { id: 'document-attachments', name: 'Documents', href: '/finance/controls/documents', description: 'Supporting docs' },
        ],
      },
      {
        id: 'automation',
        name: 'Automation',
        href: '#',
        description: 'Process automation',
        subItems: [
          { id: 'recurring-transactions', name: 'Recurring Transactions', href: '/finance/automation/recurring-transactions', description: 'Auto transactions' },
          { id: 'auto-workflows', name: 'Automated Workflows', href: '/finance/automation/workflows', description: 'Workflow automation' },
          { id: 'alerts-notifications', name: 'Alerts & Notifications', href: '/finance/automation/alerts', description: 'Smart alerts' },
        ],
      },
      {
        id: 'integration',
        name: 'Integration',
        href: '#',
        description: 'Module integration',
        subItems: [
          { id: 'production-integration', name: 'Production Integration', href: '/finance/integration/production', description: 'Production costs' },
          { id: 'procurement-integration', name: 'Procurement Integration', href: '/finance/integration/procurement', description: 'Purchase costs' },
        ],
      },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    icon: UserCog,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100',
    subItems: [
      { id: 'hr-dashboard', name: 'HR Dashboard', href: '/hr', description: 'HR overview' },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise HCM capabilities',
        subItems: [
          { id: 'self-service', name: 'Employee Self-Service', href: '/hr/advanced-features#self-service', description: 'Employee portal' },
          { id: 'advanced-payroll', name: 'Advanced Payroll', href: '/hr/advanced-features#payroll', description: 'Payroll calculations' },
          { id: 'compliance-tracking', name: 'Compliance Tracking', href: '/hr/advanced-features#compliance', description: 'Regulatory compliance' },
          { id: 'talent-analytics', name: 'Talent Analytics', href: '/hr/advanced-features#analytics', description: 'Workforce insights' },
          { id: 'onboarding-workflow', name: 'Onboarding Workflow', href: '/hr/advanced-features#onboarding', description: 'New hire onboarding' },
          { id: 'performance-review', name: 'Performance Review', href: '/hr/advanced-features#performance', description: 'Performance management' },
          { id: 'policy-management', name: 'Policy Management', href: '/hr/advanced-features#policy', description: 'Company policies' },
          { id: 'all-hr-features', name: '→ View All Features', href: '/hr/advanced-features', description: 'Complete feature showcase' },
        ],
      },
      {
        id: 'employee-management',
        name: 'Employee Management',
        href: '#',
        description: 'Employee data & organization',
        subItems: [
          {
            id: 'employee-directory',
            name: 'Employee Directory',
            href: '#',
            description: 'All employees',
            subItems: [
              { id: 'all-employees', name: 'All Employees', href: '/hr/employees/directory/all', description: 'Complete employee list' },
              { id: 'active-employees', name: 'Active Employees', href: '/hr/employees/directory/active', description: 'Currently working' },
              { id: 'inactive-employees', name: 'Inactive Employees', href: '/hr/employees/directory/inactive', description: 'Separated employees' },
              { id: 'probation-employees', name: 'On Probation', href: '/hr/employees/directory/probation', description: 'Probation period' },
              { id: 'contract-employees', name: 'Contract Employees', href: '/hr/employees/directory/contract', description: 'Contract workers' },
            ],
          },
          { id: 'employee-profiles', name: 'Employee Profiles', href: '/hr/employees/profiles', description: 'Detailed employee information' },
          {
            id: 'organization-structure',
            name: 'Organization Structure',
            href: '#',
            description: 'Hierarchy & structure',
            subItems: [
              { id: 'org-chart', name: 'Organization Chart', href: '/hr/employees/org-chart', description: 'Visual hierarchy' },
              { id: 'departments', name: 'Departments', href: '/hr/employees/departments', description: 'Department management' },
              { id: 'teams', name: 'Teams', href: '/hr/employees/teams', description: 'Team structure' },
              { id: 'designations', name: 'Designations', href: '/hr/employees/designations', description: 'Job positions' },
            ],
          },
          { id: 'transfers-promotions', name: 'Transfers & Promotions', href: '/hr/employees/transfers-promotions', description: 'Employee movements' },
          { id: 'separations', name: 'Separations', href: '/hr/employees/separations', description: 'Exit management' },
        ],
      },
      {
        id: 'time-attendance',
        name: 'Time & Attendance',
        href: '#',
        description: 'Attendance tracking',
        subItems: [
          {
            id: 'attendance',
            name: 'Attendance',
            href: '#',
            description: 'Daily attendance',
            subItems: [
              { id: 'mark-attendance', name: 'Mark Attendance', href: '/hr/attendance/mark', description: 'Check in/out' },
              { id: 'daily-attendance', name: 'Daily Attendance', href: '/hr/attendance/daily', description: 'Today\'s attendance' },
              { id: 'monthly-register', name: 'Monthly Register', href: '/hr/attendance/monthly', description: 'Monthly view' },
              { id: 'attendance-calendar', name: 'Attendance Calendar', href: '/hr/attendance/calendar', description: 'Calendar view' },
              { id: 'attendance-reports', name: 'Attendance Reports', href: '/hr/attendance/reports', description: 'Analytics & reports' },
            ],
          },
          {
            id: 'shift-management',
            name: 'Shift Management',
            href: '#',
            description: 'Work shifts',
            subItems: [
              { id: 'shift-master', name: 'Shift Master', href: '/hr/shifts/master', description: 'Define shifts' },
              { id: 'shift-roster', name: 'Shift Roster', href: '/hr/shifts/roster', description: 'Shift schedule' },
              { id: 'shift-assignment', name: 'Shift Assignment', href: '/hr/shifts/assignment', description: 'Assign shifts' },
              { id: 'shift-swaps', name: 'Shift Swaps', href: '/hr/shifts/swaps', description: 'Exchange shifts' },
            ],
          },
          {
            id: 'overtime',
            name: 'Overtime Management',
            href: '#',
            description: 'OT tracking',
            subItems: [
              { id: 'ot-requests', name: 'OT Requests', href: '/hr/overtime/requests', description: 'Request overtime' },
              { id: 'ot-approval', name: 'OT Approval', href: '/hr/overtime/approval', description: 'Approve OT' },
              { id: 'ot-reports', name: 'OT Reports', href: '/hr/overtime/reports', description: 'OT analytics' },
              { id: 'compensatory-off', name: 'Compensatory Off', href: '/hr/overtime/comp-off', description: 'Comp off management' },
            ],
          },
          {
            id: 'timesheets',
            name: 'Timesheets',
            href: '#',
            description: 'Project hours',
            subItems: [
              { id: 'timesheet-entry', name: 'Timesheet Entry', href: '/hr/timesheets/entry', description: 'Log hours' },
              { id: 'timesheet-approval', name: 'Timesheet Approval', href: '/hr/timesheets/approval', description: 'Approve timesheets' },
              { id: 'project-hours', name: 'Project Hours', href: '/hr/timesheets/project-hours', description: 'Project-wise tracking' },
            ],
          },
          {
            id: 'attendance-settings',
            name: 'Settings',
            href: '#',
            description: 'Configuration',
            subItems: [
              { id: 'attendance-policies', name: 'Attendance Policies', href: '/hr/attendance/policies', description: 'Policy setup' },
              { id: 'working-hours', name: 'Working Hours', href: '/hr/attendance/working-hours', description: 'Define work hours' },
              { id: 'biometric-devices', name: 'Biometric Devices', href: '/hr/attendance/biometric', description: 'Device management' },
            ],
          },
        ],
      },
      {
        id: 'leave-management',
        name: 'Leave Management',
        href: '#',
        description: 'Leave tracking',
        subItems: [
          {
            id: 'leave-application',
            name: 'Leave Application',
            href: '#',
            description: 'Apply & manage',
            subItems: [
              { id: 'apply-leave', name: 'Apply Leave', href: '/hr/leave/apply', description: 'New leave request' },
              { id: 'my-leave-history', name: 'My Leave History', href: '/hr/leave/history', description: 'Past leaves' },
              { id: 'team-calendar', name: 'Team Leave Calendar', href: '/hr/leave/team-calendar', description: 'Team availability' },
              { id: 'leave-status', name: 'Leave Status', href: '/hr/leave/status', description: 'Request status' },
            ],
          },
          { id: 'leave-approvals', name: 'Leave Approvals', href: '/hr/leave/approvals', description: 'Pending approvals' },
          {
            id: 'leave-balance',
            name: 'Leave Balance',
            href: '#',
            description: 'Available leaves',
            subItems: [
              { id: 'my-balance', name: 'My Balance', href: '/hr/leave/balance/my', description: 'Personal balance' },
              { id: 'team-balance', name: 'Team Balance', href: '/hr/leave/balance/team', description: 'Team balances' },
              { id: 'department-balance', name: 'Department Balance', href: '/hr/leave/balance/department', description: 'Dept balances' },
            ],
          },
          {
            id: 'leave-encashment',
            name: 'Leave Encashment',
            href: '#',
            description: 'Encash leaves',
            subItems: [
              { id: 'encashment-requests', name: 'Encashment Requests', href: '/hr/leave/encashment/requests', description: 'Apply for encashment' },
              { id: 'encashment-approval', name: 'Encashment Approval', href: '/hr/leave/encashment/approval', description: 'Approve requests' },
              { id: 'encashment-history', name: 'Encashment History', href: '/hr/leave/encashment/history', description: 'Past encashments' },
            ],
          },
          { id: 'leave-types', name: 'Leave Types', href: '/hr/leave/types', description: 'Leave categories' },
          { id: 'leave-policies', name: 'Leave Policies', href: '/hr/leave/policies', description: 'Policy configuration' },
          {
            id: 'leave-reports',
            name: 'Leave Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'leave-summary', name: 'Leave Summary', href: '/hr/leave/reports/summary', description: 'Overall summary' },
              { id: 'department-report', name: 'Department Report', href: '/hr/leave/reports/department', description: 'Dept-wise report' },
              { id: 'leave-analytics', name: 'Analytics', href: '/hr/leave/reports/analytics', description: 'Trends & insights' },
            ],
          },
        ],
      },
      {
        id: 'payroll',
        name: 'Payroll Management',
        href: '#',
        description: 'Salary processing',
        subItems: [
          {
            id: 'salary-structure',
            name: 'Salary Structure',
            href: '#',
            description: 'Components & templates',
            subItems: [
              { id: 'components-master', name: 'Components Master', href: '/hr/payroll/components', description: 'Salary components' },
              { id: 'salary-templates', name: 'Salary Templates', href: '/hr/payroll/templates', description: 'Template management' },
              { id: 'employee-assignments', name: 'Employee Assignments', href: '/hr/payroll/assignments', description: 'Assign templates' },
              { id: 'revision-history', name: 'Revision History', href: '/hr/payroll/revisions', description: 'Past revisions' },
            ],
          },
          {
            id: 'payroll-processing',
            name: 'Payroll Processing',
            href: '#',
            description: 'Monthly payroll',
            subItems: [
              { id: 'run-payroll', name: 'Run Payroll', href: '/hr/payroll/run', description: 'Process payroll' },
              { id: 'payroll-calendar', name: 'Payroll Calendar', href: '/hr/payroll/calendar', description: 'Payroll schedule' },
              { id: 'payroll-verification', name: 'Payroll Verification', href: '/hr/payroll/verification', description: 'Verify before disbursement' },
              { id: 'salary-disbursement', name: 'Salary Disbursement', href: '/hr/payroll/disbursement', description: 'Payment processing' },
            ],
          },
          {
            id: 'statutory-compliance',
            name: 'Statutory Compliance',
            href: '#',
            description: 'Tax & compliance',
            subItems: [
              {
                id: 'income-tax',
                name: 'Income Tax',
                href: '#',
                description: 'TDS & returns',
                subItems: [
                  { id: 'tds-calculation', name: 'TDS Calculation', href: '/hr/payroll/tax/tds', description: 'Calculate TDS' },
                  { id: 'tax-declarations', name: 'Tax Declarations', href: '/hr/payroll/tax/declarations', description: 'Employee declarations' },
                  { id: 'form-16', name: 'Form 16', href: '/hr/payroll/tax/form16', description: 'Generate Form 16' },
                  { id: 'tax-reports', name: 'Tax Reports', href: '/hr/payroll/tax/reports', description: 'Tax analytics' },
                ],
              },
              {
                id: 'provident-fund',
                name: 'Provident Fund',
                href: '#',
                description: 'PF management',
                subItems: [
                  { id: 'pf-contribution', name: 'PF Contribution', href: '/hr/payroll/pf/contribution', description: 'Monthly PF' },
                  { id: 'pf-returns', name: 'PF Returns (ECR)', href: '/hr/payroll/pf/returns', description: 'ECR filing' },
                  { id: 'uan-management', name: 'UAN Management', href: '/hr/payroll/pf/uan', description: 'Universal account numbers' },
                ],
              },
              {
                id: 'esi',
                name: 'ESI',
                href: '#',
                description: 'Employee insurance',
                subItems: [
                  { id: 'esi-contribution', name: 'ESI Contribution', href: '/hr/payroll/esi/contribution', description: 'Monthly ESI' },
                  { id: 'esi-returns', name: 'ESI Returns', href: '/hr/payroll/esi/returns', description: 'ESI filing' },
                ],
              },
              { id: 'professional-tax', name: 'Professional Tax', href: '/hr/payroll/pt', description: 'PT calculation' },
            ],
          },
          {
            id: 'salary-revisions',
            name: 'Salary Revisions',
            href: '#',
            description: 'Increments',
            subItems: [
              { id: 'annual-increment', name: 'Annual Increment', href: '/hr/payroll/increment/annual', description: 'Yearly increment' },
              { id: 'performance-increment', name: 'Performance Increment', href: '/hr/payroll/increment/performance', description: 'Merit increase' },
              { id: 'arrears', name: 'Arrears Calculation', href: '/hr/payroll/increment/arrears', description: 'Backpay calculation' },
              { id: 'revision-letters', name: 'Revision Letters', href: '/hr/payroll/increment/letters', description: 'Generate letters' },
            ],
          },
          {
            id: 'bonus-incentives',
            name: 'Bonus & Incentives',
            href: '#',
            description: 'Variable pay',
            subItems: [
              { id: 'annual-bonus', name: 'Annual Bonus', href: '/hr/payroll/bonus/annual', description: 'Yearly bonus' },
              { id: 'performance-bonus', name: 'Performance Bonus', href: '/hr/payroll/bonus/performance', description: 'Based on KPIs' },
              { id: 'incentive-schemes', name: 'Incentive Schemes', href: '/hr/payroll/bonus/schemes', description: 'Sales & production' },
              { id: 'bonus-processing', name: 'Processing', href: '/hr/payroll/bonus/processing', description: 'Calculate & disburse' },
            ],
          },
          {
            id: 'loans-advances',
            name: 'Loans & Advances',
            href: '#',
            description: 'Employee loans',
            subItems: [
              { id: 'loan-requests', name: 'Loan Requests', href: '/hr/payroll/loans/requests', description: 'Apply for loan' },
              { id: 'loan-approval', name: 'Loan Approval', href: '/hr/payroll/loans/approval', description: 'Approve loans' },
              { id: 'emi-schedule', name: 'EMI Schedule', href: '/hr/payroll/loans/emi', description: 'Repayment schedule' },
              { id: 'advance-requests', name: 'Advance Requests', href: '/hr/payroll/advances/requests', description: 'Salary advance' },
              { id: 'recovery-tracking', name: 'Recovery Tracking', href: '/hr/payroll/loans/recovery', description: 'Track recoveries' },
            ],
          },
          {
            id: 'payroll-reports',
            name: 'Payroll Reports',
            href: '#',
            description: 'Reports & analytics',
            subItems: [
              { id: 'payslips', name: 'Payslips', href: '/hr/payroll/reports/payslips', description: 'Generate payslips' },
              { id: 'salary-register', name: 'Salary Register', href: '/hr/payroll/reports/register', description: 'Monthly register' },
              { id: 'bank-statement', name: 'Bank Statement', href: '/hr/payroll/reports/bank', description: 'Bank transfer file' },
              { id: 'department-cost', name: 'Department Cost', href: '/hr/payroll/reports/dept-cost', description: 'Dept-wise cost' },
              { id: 'pf-report', name: 'PF Report', href: '/hr/payroll/reports/pf', description: 'PF summary' },
              { id: 'esi-report', name: 'ESI Report', href: '/hr/payroll/reports/esi', description: 'ESI summary' },
              { id: 'tds-report', name: 'TDS Report', href: '/hr/payroll/reports/tds', description: 'TDS summary' },
            ],
          },
        ],
      },
      {
        id: 'expenses-travel',
        name: 'Expenses & Travel',
        href: '#',
        description: 'Claims & reimbursements',
        subItems: [
          {
            id: 'expense-management',
            name: 'Expense Management',
            href: '#',
            description: 'Expense claims',
            subItems: [
              { id: 'submit-expense', name: 'Submit Expense', href: '/hr/expenses/submit', description: 'New expense claim' },
              { id: 'my-expenses', name: 'My Expenses', href: '/hr/expenses/my', description: 'My submissions' },
              { id: 'pending-approvals', name: 'Pending Approvals', href: '/hr/expenses/pending', description: 'Awaiting approval' },
              { id: 'approved-expenses', name: 'Approved Expenses', href: '/hr/expenses/approved', description: 'Approved claims' },
              { id: 'rejected-expenses', name: 'Rejected Expenses', href: '/hr/expenses/rejected', description: 'Rejected claims' },
            ],
          },
          {
            id: 'travel-management',
            name: 'Travel Management',
            href: '#',
            description: 'Business travel',
            subItems: [
              { id: 'travel-requests', name: 'Travel Requests', href: '/hr/travel/requests', description: 'Request travel' },
              {
                id: 'travel-bookings',
                name: 'Travel Bookings',
                href: '#',
                description: 'Book travel',
                subItems: [
                  { id: 'flight-booking', name: 'Flight Booking', href: '/hr/travel/booking/flight', description: 'Book flights' },
                  { id: 'hotel-booking', name: 'Hotel Booking', href: '/hr/travel/booking/hotel', description: 'Book hotels' },
                  { id: 'cab-booking', name: 'Cab Booking', href: '/hr/travel/booking/cab', description: 'Book cabs' },
                ],
              },
              { id: 'travel-advances', name: 'Travel Advances', href: '/hr/travel/advances', description: 'Travel advance' },
              { id: 'travel-history', name: 'Travel History', href: '/hr/travel/history', description: 'Past travels' },
            ],
          },
          {
            id: 'reimbursements',
            name: 'Reimbursements',
            href: '#',
            description: 'Payment processing',
            subItems: [
              { id: 'pending-claims', name: 'Pending Claims', href: '/hr/reimbursement/pending', description: 'Awaiting payment' },
              { id: 'processing-claims', name: 'Processing', href: '/hr/reimbursement/processing', description: 'In progress' },
              { id: 'paid-claims', name: 'Paid Claims', href: '/hr/reimbursement/paid', description: 'Completed payments' },
              { id: 'settlement', name: 'Settlement', href: '/hr/reimbursement/settlement', description: 'Final settlement' },
            ],
          },
          {
            id: 'corporate-cards',
            name: 'Corporate Cards',
            href: '#',
            description: 'Card management',
            subItems: [
              { id: 'card-management', name: 'Card Management', href: '/hr/cards/management', description: 'Manage cards' },
              { id: 'card-transactions', name: 'Transactions', href: '/hr/cards/transactions', description: 'Card transactions' },
              { id: 'card-reconciliation', name: 'Reconciliation', href: '/hr/cards/reconciliation', description: 'Reconcile expenses' },
            ],
          },
          {
            id: 'expense-settings',
            name: 'Settings',
            href: '#',
            description: 'Configuration',
            subItems: [
              { id: 'expense-categories', name: 'Expense Categories', href: '/hr/expenses/settings/categories', description: 'Define categories' },
              { id: 'expense-policies', name: 'Expense Policies', href: '/hr/expenses/settings/policies', description: 'Policy rules' },
              { id: 'per-diem-rates', name: 'Per Diem Rates', href: '/hr/expenses/settings/per-diem', description: 'Daily allowances' },
              { id: 'approval-matrix', name: 'Approval Matrix', href: '/hr/expenses/settings/approval', description: 'Approval workflow' },
            ],
          },
          {
            id: 'expense-reports',
            name: 'Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'expense-summary', name: 'Expense Summary', href: '/hr/expenses/reports/summary', description: 'Overall summary' },
              { id: 'travel-analytics', name: 'Travel Analytics', href: '/hr/expenses/reports/travel', description: 'Travel insights' },
              { id: 'dept-expenses', name: 'Department Expenses', href: '/hr/expenses/reports/department', description: 'Dept-wise expenses' },
              { id: 'budget-actual', name: 'Budget vs Actual', href: '/hr/expenses/reports/budget', description: 'Budget comparison' },
            ],
          },
        ],
      },
      {
        id: 'onboarding-offboarding',
        name: 'Onboarding & Offboarding',
        href: '#',
        description: 'Employee lifecycle',
        subItems: [
          {
            id: 'onboarding',
            name: 'Onboarding',
            href: '#',
            description: 'New joiners',
            subItems: [
              {
                id: 'pre-joining',
                name: 'Pre-joining',
                href: '#',
                description: 'Before joining',
                subItems: [
                  { id: 'offer-management', name: 'Offer Management', href: '/hr/onboarding/offers', description: 'Manage offers' },
                  { id: 'document-collection', name: 'Document Collection', href: '/hr/onboarding/documents', description: 'Collect docs' },
                  { id: 'background-verification', name: 'Background Verification', href: '/hr/onboarding/verification', description: 'BGV process' },
                  { id: 'medical-checkup', name: 'Medical Checkup', href: '/hr/onboarding/medical', description: 'Health checkup' },
                ],
              },
              {
                id: 'joining-process',
                name: 'Joining Process',
                href: '#',
                description: 'First day',
                subItems: [
                  { id: 'first-day-setup', name: 'First Day Setup', href: '/hr/onboarding/first-day', description: 'Day 1 checklist' },
                  { id: 'id-card', name: 'ID Card Generation', href: '/hr/onboarding/id-card', description: 'Generate ID' },
                  { id: 'system-access', name: 'System Access', href: '/hr/onboarding/access', description: 'Provision access' },
                  { id: 'welcome-kit', name: 'Welcome Kit', href: '/hr/onboarding/welcome-kit', description: 'Welcome package' },
                ],
              },
              {
                id: 'orientation',
                name: 'Orientation',
                href: '#',
                description: 'Induction program',
                subItems: [
                  { id: 'hr-induction', name: 'HR Induction', href: '/hr/onboarding/induction/hr', description: 'HR orientation' },
                  { id: 'dept-induction', name: 'Department Induction', href: '/hr/onboarding/induction/department', description: 'Dept introduction' },
                  { id: 'training-schedule', name: 'Training Schedule', href: '/hr/onboarding/training', description: 'Initial training' },
                  { id: 'policy-acknowledgment', name: 'Policy Acknowledgment', href: '/hr/onboarding/policies', description: 'Accept policies' },
                ],
              },
              { id: 'onboarding-checklist', name: 'Onboarding Checklist', href: '/hr/onboarding/checklist', description: 'Track progress' },
            ],
          },
          {
            id: 'probation',
            name: 'Probation Management',
            href: '#',
            description: 'Probation period',
            subItems: [
              { id: 'probation-tracking', name: 'Probation Tracking', href: '/hr/probation/tracking', description: 'Monitor probation' },
              { id: 'review-schedule', name: 'Review Schedule', href: '/hr/probation/reviews', description: 'Performance reviews' },
              { id: 'feedback-collection', name: 'Feedback Collection', href: '/hr/probation/feedback', description: 'Gather feedback' },
              { id: 'confirmation', name: 'Confirmation Process', href: '/hr/probation/confirmation', description: 'Confirm employment' },
            ],
          },
          {
            id: 'offboarding',
            name: 'Offboarding',
            href: '#',
            description: 'Employee exit',
            subItems: [
              {
                id: 'resignations',
                name: 'Resignations',
                href: '#',
                description: 'Exit requests',
                subItems: [
                  { id: 'resignation-requests', name: 'Resignation Requests', href: '/hr/offboarding/resignations', description: 'Submit resignation' },
                  { id: 'notice-period', name: 'Notice Period', href: '/hr/offboarding/notice-period', description: 'Track notice' },
                  { id: 'early-release', name: 'Early Release', href: '/hr/offboarding/early-release', description: 'Waive notice' },
                  { id: 'acceptance', name: 'Acceptance', href: '/hr/offboarding/acceptance', description: 'Accept resignation' },
                ],
              },
              {
                id: 'exit-clearance',
                name: 'Exit Clearance',
                href: '#',
                description: 'Clearance process',
                subItems: [
                  { id: 'clearance-checklist', name: 'Clearance Checklist', href: '/hr/offboarding/clearance/checklist', description: 'Exit checklist' },
                  { id: 'it-clearance', name: 'IT Clearance', href: '/hr/offboarding/clearance/it', description: 'IT assets return' },
                  { id: 'hr-clearance', name: 'HR Clearance', href: '/hr/offboarding/clearance/hr', description: 'HR formalities' },
                  { id: 'finance-clearance', name: 'Finance Clearance', href: '/hr/offboarding/clearance/finance', description: 'Pending dues' },
                  { id: 'asset-return', name: 'Asset Return', href: '/hr/offboarding/clearance/assets', description: 'Return all assets' },
                ],
              },
              { id: 'exit-interview', name: 'Exit Interview', href: '/hr/offboarding/exit-interview', description: 'Conduct interview' },
              {
                id: 'fnf-settlement',
                name: 'Full & Final Settlement',
                href: '#',
                description: 'Final dues',
                subItems: [
                  { id: 'salary-calculation', name: 'Salary Calculation', href: '/hr/offboarding/fnf/salary', description: 'Calculate final salary' },
                  { id: 'leave-encashment', name: 'Leave Encashment', href: '/hr/offboarding/fnf/leave', description: 'Encash leaves' },
                  { id: 'gratuity', name: 'Gratuity', href: '/hr/offboarding/fnf/gratuity', description: 'Calculate gratuity' },
                  { id: 'final-payment', name: 'Final Payment', href: '/hr/offboarding/fnf/payment', description: 'Process payment' },
                ],
              },
              {
                id: 'exit-documents',
                name: 'Exit Documents',
                href: '#',
                description: 'Certificates',
                subItems: [
                  { id: 'experience-certificate', name: 'Experience Certificate', href: '/hr/offboarding/docs/experience', description: 'Issue experience cert' },
                  { id: 'relieving-letter', name: 'Relieving Letter', href: '/hr/offboarding/docs/relieving', description: 'Issue relieving letter' },
                  { id: 'service-certificate', name: 'Service Certificate', href: '/hr/offboarding/docs/service', description: 'Issue service cert' },
                ],
              },
            ],
          },
          {
            id: 'alumni',
            name: 'Alumni Management',
            href: '#',
            description: 'Ex-employees',
            subItems: [
              { id: 'alumni-directory', name: 'Alumni Directory', href: '/hr/alumni/directory', description: 'Alumni database' },
              { id: 'rehire-process', name: 'Rehire Process', href: '/hr/alumni/rehire', description: 'Rehire alumni' },
              { id: 'alumni-network', name: 'Alumni Network', href: '/hr/alumni/network', description: 'Stay connected' },
            ],
          },
        ],
      },
      {
        id: 'assets',
        name: 'Asset Management',
        href: '#',
        description: 'Company assets',
        subItems: [
          {
            id: 'asset-allocation',
            name: 'Asset Allocation',
            href: '#',
            description: 'Allocate assets',
            subItems: [
              {
                id: 'it-assets',
                name: 'IT Assets',
                href: '#',
                description: 'IT equipment',
                subItems: [
                  { id: 'laptops', name: 'Laptops', href: '/hr/assets/it/laptops', description: 'Laptop allocation' },
                  { id: 'desktops', name: 'Desktops', href: '/hr/assets/it/desktops', description: 'Desktop allocation' },
                  { id: 'mobile-phones', name: 'Mobile Phones', href: '/hr/assets/it/mobiles', description: 'Phone allocation' },
                  { id: 'monitors', name: 'Monitors', href: '/hr/assets/it/monitors', description: 'Monitor allocation' },
                  { id: 'accessories', name: 'Accessories', href: '/hr/assets/it/accessories', description: 'IT accessories' },
                ],
              },
              {
                id: 'office-assets',
                name: 'Office Assets',
                href: '#',
                description: 'Office items',
                subItems: [
                  { id: 'furniture', name: 'Furniture', href: '/hr/assets/office/furniture', description: 'Office furniture' },
                  { id: 'stationery', name: 'Stationery', href: '/hr/assets/office/stationery', description: 'Office supplies' },
                  { id: 'id-cards', name: 'ID Cards', href: '/hr/assets/office/id-cards', description: 'Identity cards' },
                  { id: 'access-cards', name: 'Access Cards', href: '/hr/assets/office/access-cards', description: 'Access control' },
                ],
              },
              {
                id: 'vehicles',
                name: 'Vehicles',
                href: '#',
                description: 'Company vehicles',
                subItems: [
                  { id: 'company-vehicles', name: 'Company Vehicles', href: '/hr/assets/vehicles/list', description: 'Vehicle list' },
                  { id: 'vehicle-assignment', name: 'Assignment', href: '/hr/assets/vehicles/assignment', description: 'Assign vehicles' },
                  { id: 'fuel-management', name: 'Fuel Management', href: '/hr/assets/vehicles/fuel', description: 'Fuel tracking' },
                ],
              },
            ],
          },
          { id: 'asset-requests', name: 'Asset Requests', href: '/hr/assets/requests', description: 'Request assets' },
          { id: 'asset-transfer', name: 'Asset Transfer', href: '/hr/assets/transfer', description: 'Transfer assets' },
          { id: 'asset-return', name: 'Asset Return', href: '/hr/assets/return', description: 'Return assets' },
          {
            id: 'maintenance',
            name: 'Maintenance & Repairs',
            href: '#',
            description: 'Asset maintenance',
            subItems: [
              { id: 'service-requests', name: 'Service Requests', href: '/hr/assets/maintenance/requests', description: 'Raise service request' },
              { id: 'preventive-maintenance', name: 'Preventive Maintenance', href: '/hr/assets/maintenance/preventive', description: 'Scheduled maintenance' },
              { id: 'amc-management', name: 'AMC Management', href: '/hr/assets/maintenance/amc', description: 'AMC contracts' },
              { id: 'repair-history', name: 'Repair History', href: '/hr/assets/maintenance/history', description: 'Past repairs' },
            ],
          },
          {
            id: 'asset-inventory',
            name: 'Asset Inventory',
            href: '#',
            description: 'Stock management',
            subItems: [
              { id: 'stock-management', name: 'Stock Management', href: '/hr/assets/inventory/stock', description: 'Available stock' },
              { id: 'stock-requests', name: 'Stock Requests', href: '/hr/assets/inventory/requests', description: 'Request from stock' },
              { id: 'stock-allocation', name: 'Stock Allocation', href: '/hr/assets/inventory/allocation', description: 'Allocate stock' },
              { id: 'stock-audit', name: 'Stock Audit', href: '/hr/assets/inventory/audit', description: 'Audit inventory' },
            ],
          },
          {
            id: 'asset-reports',
            name: 'Asset Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'asset-register', name: 'Asset Register', href: '/hr/assets/reports/register', description: 'Complete register' },
              { id: 'allocation-report', name: 'Allocation Report', href: '/hr/assets/reports/allocation', description: 'Allocation status' },
              { id: 'employee-assets', name: 'Employee Assets', href: '/hr/assets/reports/employee', description: 'Employee-wise assets' },
              { id: 'department-assets', name: 'Department Assets', href: '/hr/assets/reports/department', description: 'Dept-wise assets' },
              { id: 'maintenance-costs', name: 'Maintenance Costs', href: '/hr/assets/reports/costs', description: 'Maintenance expenses' },
            ],
          },
        ],
      },
      {
        id: 'documents',
        name: 'Document Management',
        href: '#',
        description: 'Digital documents',
        subItems: [
          {
            id: 'employee-documents',
            name: 'Employee Documents',
            href: '#',
            description: 'Personal docs',
            subItems: [
              { id: 'personal-documents', name: 'Personal Documents', href: '/hr/documents/personal', description: 'ID proofs, photos' },
              { id: 'educational-documents', name: 'Educational Documents', href: '/hr/documents/education', description: 'Degrees, certificates' },
              { id: 'employment-documents', name: 'Employment Documents', href: '/hr/documents/employment', description: 'Employment records' },
              { id: 'upload-documents', name: 'Upload Documents', href: '/hr/documents/upload', description: 'Upload new docs' },
            ],
          },
          {
            id: 'compliance-documents',
            name: 'Compliance Documents',
            href: '#',
            description: 'Statutory docs',
            subItems: [
              { id: 'statutory-forms', name: 'Statutory Forms', href: '/hr/documents/statutory', description: 'PF, ESI forms' },
              { id: 'declarations', name: 'Declarations', href: '/hr/documents/declarations', description: 'Tax declarations' },
              { id: 'nominations', name: 'Nominations', href: '/hr/documents/nominations', description: 'PF, Gratuity nominations' },
              { id: 'insurance-forms', name: 'Insurance Forms', href: '/hr/documents/insurance', description: 'Insurance docs' },
            ],
          },
          {
            id: 'hr-policies',
            name: 'HR Policies',
            href: '#',
            description: 'Company policies',
            subItems: [
              { id: 'employee-handbook', name: 'Employee Handbook', href: '/hr/documents/policies/handbook', description: 'Company handbook' },
              { id: 'leave-policy', name: 'Leave Policy', href: '/hr/documents/policies/leave', description: 'Leave guidelines' },
              { id: 'attendance-policy', name: 'Attendance Policy', href: '/hr/documents/policies/attendance', description: 'Attendance rules' },
              { id: 'expense-policy', name: 'Expense Policy', href: '/hr/documents/policies/expense', description: 'Expense guidelines' },
              { id: 'code-of-conduct', name: 'Code of Conduct', href: '/hr/documents/policies/conduct', description: 'Conduct policy' },
              { id: 'other-policies', name: 'Other Policies', href: '/hr/documents/policies/other', description: 'Other policies' },
            ],
          },
          {
            id: 'document-repository',
            name: 'Document Repository',
            href: '#',
            description: 'Document storage',
            subItems: [
              { id: 'browse-documents', name: 'Browse Documents', href: '/hr/documents/repository/browse', description: 'Browse all docs' },
              { id: 'search-documents', name: 'Search Documents', href: '/hr/documents/repository/search', description: 'Search docs' },
              { id: 'upload-docs', name: 'Upload Documents', href: '/hr/documents/repository/upload', description: 'Upload files' },
              { id: 'document-archive', name: 'Document Archive', href: '/hr/documents/repository/archive', description: 'Archived docs' },
            ],
          },
          {
            id: 'certificate-requests',
            name: 'Certificate Requests',
            href: '#',
            description: 'Request certificates',
            subItems: [
              { id: 'experience-cert-request', name: 'Experience Certificate', href: '/hr/documents/certificates/experience', description: 'Request experience cert' },
              { id: 'salary-cert-request', name: 'Salary Certificate', href: '/hr/documents/certificates/salary', description: 'Request salary cert' },
              { id: 'employment-cert-request', name: 'Employment Certificate', href: '/hr/documents/certificates/employment', description: 'Request employment cert' },
              { id: 'request-status', name: 'Request Status', href: '/hr/documents/certificates/status', description: 'Track requests' },
            ],
          },
          {
            id: 'compliance-tracking',
            name: 'Compliance Tracking',
            href: '#',
            description: 'Document compliance',
            subItems: [
              { id: 'missing-documents', name: 'Missing Documents', href: '/hr/documents/compliance/missing', description: 'Docs not uploaded' },
              { id: 'expired-documents', name: 'Expired Documents', href: '/hr/documents/compliance/expired', description: 'Expired docs' },
              { id: 'renewal-reminders', name: 'Renewal Reminders', href: '/hr/documents/compliance/renewals', description: 'Renewal alerts' },
              { id: 'audit-trail', name: 'Audit Trail', href: '/hr/documents/compliance/audit', description: 'Document audit log' },
            ],
          },
        ],
      },
      {
        id: 'performance',
        name: 'Performance Management',
        href: '#',
        description: 'Performance & appraisals',
        subItems: [
          {
            id: 'goal-setting',
            name: 'Goal Setting & OKRs',
            href: '#',
            description: 'Objectives & key results',
            subItems: [
              { id: 'set-goals', name: 'Set Goals', href: '/hr/performance/goals/set', description: 'Create objectives' },
              { id: 'my-goals', name: 'My Goals', href: '/hr/performance/goals/my', description: 'Personal goals' },
              { id: 'team-goals', name: 'Team Goals', href: '/hr/performance/goals/team', description: 'Team objectives' },
              { id: 'department-goals', name: 'Department Goals', href: '/hr/performance/goals/department', description: 'Dept objectives' },
              { id: 'goal-alignment', name: 'Goal Alignment', href: '/hr/performance/goals/alignment', description: 'Cascade goals' },
              { id: 'goal-tracking', name: 'Goal Tracking', href: '/hr/performance/goals/tracking', description: 'Progress tracking' },
            ],
          },
          {
            id: 'performance-reviews',
            name: 'Performance Reviews',
            href: '#',
            description: 'Appraisal cycles',
            subItems: [
              { id: 'review-cycles', name: 'Review Cycles', href: '/hr/performance/reviews/cycles', description: 'Appraisal periods' },
              { id: 'self-appraisal', name: 'Self Appraisal', href: '/hr/performance/reviews/self', description: 'Employee self-review' },
              { id: 'manager-review', name: 'Manager Review', href: '/hr/performance/reviews/manager', description: 'Manager assessment' },
              { id: 'peer-review', name: 'Peer Review', href: '/hr/performance/reviews/peer', description: '360-degree feedback' },
              { id: 'final-rating', name: 'Final Rating', href: '/hr/performance/reviews/rating', description: 'Consolidated ratings' },
              { id: 'review-meetings', name: 'Review Meetings', href: '/hr/performance/reviews/meetings', description: 'Schedule discussions' },
            ],
          },
          {
            id: 'continuous-feedback',
            name: 'Continuous Feedback',
            href: '#',
            description: 'Real-time feedback',
            subItems: [
              { id: 'give-feedback', name: 'Give Feedback', href: '/hr/performance/feedback/give', description: 'Provide feedback' },
              { id: 'received-feedback', name: 'Received Feedback', href: '/hr/performance/feedback/received', description: 'View feedback' },
              { id: 'feedback-requests', name: 'Feedback Requests', href: '/hr/performance/feedback/requests', description: 'Request feedback' },
              { id: 'recognition', name: 'Recognition & Praise', href: '/hr/performance/feedback/recognition', description: 'Appreciate colleagues' },
            ],
          },
          {
            id: 'kpi-management',
            name: 'KPI Management',
            href: '#',
            description: 'Key performance indicators',
            subItems: [
              { id: 'kpi-master', name: 'KPI Master', href: '/hr/performance/kpi/master', description: 'Define KPIs' },
              { id: 'kpi-assignment', name: 'KPI Assignment', href: '/hr/performance/kpi/assignment', description: 'Assign KPIs' },
              { id: 'kpi-tracking', name: 'KPI Tracking', href: '/hr/performance/kpi/tracking', description: 'Monitor KPIs' },
              { id: 'kpi-dashboard', name: 'KPI Dashboard', href: '/hr/performance/kpi/dashboard', description: 'KPI analytics' },
            ],
          },
          {
            id: 'pip',
            name: 'Performance Improvement',
            href: '#',
            description: 'PIP management',
            subItems: [
              { id: 'pip-creation', name: 'Create PIP', href: '/hr/performance/pip/create', description: 'Improvement plans' },
              { id: 'pip-tracking', name: 'PIP Tracking', href: '/hr/performance/pip/tracking', description: 'Monitor progress' },
              { id: 'pip-review', name: 'PIP Review', href: '/hr/performance/pip/review', description: 'Review outcomes' },
            ],
          },
          {
            id: 'performance-reports',
            name: 'Performance Reports',
            href: '#',
            description: 'Analytics & insights',
            subItems: [
              { id: 'performance-analytics', name: 'Performance Analytics', href: '/hr/performance/reports/analytics', description: 'Overall analytics' },
              { id: 'rating-distribution', name: 'Rating Distribution', href: '/hr/performance/reports/distribution', description: 'Rating spread' },
              { id: 'department-performance', name: 'Department Performance', href: '/hr/performance/reports/department', description: 'Dept-wise analysis' },
              { id: 'trend-analysis', name: 'Trend Analysis', href: '/hr/performance/reports/trends', description: 'Historical trends' },
            ],
          },
        ],
      },
      {
        id: 'training',
        name: 'Training & Development',
        href: '#',
        description: 'Learning & growth',
        subItems: [
          {
            id: 'training-programs',
            name: 'Training Programs',
            href: '#',
            description: 'Training catalog',
            subItems: [
              { id: 'program-catalog', name: 'Program Catalog', href: '/hr/training/programs/catalog', description: 'Available programs' },
              { id: 'create-program', name: 'Create Program', href: '/hr/training/programs/create', description: 'New training' },
              { id: 'program-schedule', name: 'Program Schedule', href: '/hr/training/programs/schedule', description: 'Training calendar' },
              { id: 'external-training', name: 'External Training', href: '/hr/training/programs/external', description: 'Outside programs' },
            ],
          },
          {
            id: 'training-enrollment',
            name: 'Enrollment & Attendance',
            href: '#',
            description: 'Registration',
            subItems: [
              { id: 'enroll-training', name: 'Enroll in Training', href: '/hr/training/enrollment/enroll', description: 'Register for training' },
              { id: 'my-trainings', name: 'My Trainings', href: '/hr/training/enrollment/my', description: 'Enrolled programs' },
              { id: 'training-attendance', name: 'Training Attendance', href: '/hr/training/enrollment/attendance', description: 'Mark attendance' },
              { id: 'waiting-list', name: 'Waiting List', href: '/hr/training/enrollment/waiting', description: 'Training waitlist' },
            ],
          },
          {
            id: 'skill-development',
            name: 'Skill Development',
            href: '#',
            description: 'Competency building',
            subItems: [
              { id: 'skill-matrix', name: 'Skill Matrix', href: '/hr/training/skills/matrix', description: 'Competency framework' },
              { id: 'skill-assessment', name: 'Skill Assessment', href: '/hr/training/skills/assessment', description: 'Evaluate skills' },
              { id: 'skill-gap-analysis', name: 'Skill Gap Analysis', href: '/hr/training/skills/gap', description: 'Identify gaps' },
              { id: 'certification-tracking', name: 'Certification Tracking', href: '/hr/training/skills/certifications', description: 'Track certifications' },
            ],
          },
          {
            id: 'training-effectiveness',
            name: 'Training Effectiveness',
            href: '#',
            description: 'Evaluation',
            subItems: [
              { id: 'training-feedback', name: 'Training Feedback', href: '/hr/training/effectiveness/feedback', description: 'Participant feedback' },
              { id: 'assessments', name: 'Assessments & Tests', href: '/hr/training/effectiveness/assessments', description: 'Evaluate learning' },
              { id: 'training-impact', name: 'Training Impact', href: '/hr/training/effectiveness/impact', description: 'Measure effectiveness' },
            ],
          },
          {
            id: 'elearning',
            name: 'E-Learning',
            href: '#',
            description: 'Online learning',
            subItems: [
              { id: 'course-library', name: 'Course Library', href: '/hr/training/elearning/library', description: 'Online courses' },
              { id: 'my-courses', name: 'My Courses', href: '/hr/training/elearning/my', description: 'Enrolled courses' },
              { id: 'course-progress', name: 'Course Progress', href: '/hr/training/elearning/progress', description: 'Learning progress' },
              { id: 'certifications', name: 'Certifications', href: '/hr/training/elearning/certifications', description: 'Course certificates' },
            ],
          },
          {
            id: 'training-budget',
            name: 'Training Budget',
            href: '#',
            description: 'Budget management',
            subItems: [
              { id: 'budget-allocation', name: 'Budget Allocation', href: '/hr/training/budget/allocation', description: 'Allocate budget' },
              { id: 'budget-tracking', name: 'Budget Tracking', href: '/hr/training/budget/tracking', description: 'Track spending' },
              { id: 'training-costs', name: 'Training Costs', href: '/hr/training/budget/costs', description: 'Cost analysis' },
            ],
          },
          {
            id: 'training-reports',
            name: 'Training Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'training-summary', name: 'Training Summary', href: '/hr/training/reports/summary', description: 'Overall summary' },
              { id: 'employee-training', name: 'Employee Training', href: '/hr/training/reports/employee', description: 'Employee-wise report' },
              { id: 'department-training', name: 'Department Training', href: '/hr/training/reports/department', description: 'Dept-wise report' },
              { id: 'training-hours', name: 'Training Hours', href: '/hr/training/reports/hours', description: 'Hours analytics' },
            ],
          },
        ],
      },
      {
        id: 'succession',
        name: 'Succession Planning',
        href: '#',
        description: 'Leadership pipeline',
        subItems: [
          {
            id: 'critical-positions',
            name: 'Critical Positions',
            href: '#',
            description: 'Key roles',
            subItems: [
              { id: 'identify-positions', name: 'Identify Positions', href: '/hr/succession/positions/identify', description: 'Define critical roles' },
              { id: 'position-profiles', name: 'Position Profiles', href: '/hr/succession/positions/profiles', description: 'Role requirements' },
              { id: 'risk-assessment', name: 'Risk Assessment', href: '/hr/succession/positions/risk', description: 'Succession risk' },
            ],
          },
          {
            id: 'talent-pool',
            name: 'Talent Pool',
            href: '#',
            description: 'High potential employees',
            subItems: [
              { id: 'identify-talent', name: 'Identify Talent', href: '/hr/succession/talent/identify', description: 'HiPo identification' },
              { id: 'talent-profiles', name: 'Talent Profiles', href: '/hr/succession/talent/profiles', description: 'Successor profiles' },
              { id: 'readiness-assessment', name: 'Readiness Assessment', href: '/hr/succession/talent/readiness', description: 'Successor readiness' },
              { id: 'talent-development', name: 'Talent Development', href: '/hr/succession/talent/development', description: 'Development plans' },
            ],
          },
          {
            id: 'succession-plans',
            name: 'Succession Plans',
            href: '#',
            description: 'Succession strategies',
            subItems: [
              { id: 'create-plan', name: 'Create Plan', href: '/hr/succession/plans/create', description: 'New succession plan' },
              { id: 'plan-tracking', name: 'Plan Tracking', href: '/hr/succession/plans/tracking', description: 'Monitor plans' },
              { id: 'succession-matrix', name: 'Succession Matrix', href: '/hr/succession/plans/matrix', description: '9-box grid' },
            ],
          },
          {
            id: 'development-programs',
            name: 'Development Programs',
            href: '#',
            description: 'Leadership development',
            subItems: [
              { id: 'leadership-programs', name: 'Leadership Programs', href: '/hr/succession/development/leadership', description: 'Leadership training' },
              { id: 'mentoring', name: 'Mentoring Programs', href: '/hr/succession/development/mentoring', description: 'Mentorship' },
              { id: 'job-rotation', name: 'Job Rotation', href: '/hr/succession/development/rotation', description: 'Cross-functional moves' },
            ],
          },
          {
            id: 'succession-reports',
            name: 'Succession Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'bench-strength', name: 'Bench Strength', href: '/hr/succession/reports/bench-strength', description: 'Talent depth' },
              { id: 'succession-coverage', name: 'Succession Coverage', href: '/hr/succession/reports/coverage', description: 'Coverage ratio' },
              { id: 'talent-analytics', name: 'Talent Analytics', href: '/hr/succession/reports/analytics', description: 'Talent insights' },
            ],
          },
        ],
      },
      {
        id: 'health-safety',
        name: 'Health & Safety',
        href: '#',
        description: 'Workplace safety',
        subItems: [
          {
            id: 'safety-management',
            name: 'Safety Management',
            href: '#',
            description: 'Safety programs',
            subItems: [
              { id: 'safety-policies', name: 'Safety Policies', href: '/hr/safety/management/policies', description: 'Safety guidelines' },
              { id: 'safety-procedures', name: 'Safety Procedures', href: '/hr/safety/management/procedures', description: 'SOP documents' },
              { id: 'safety-training', name: 'Safety Training', href: '/hr/safety/management/training', description: 'Safety programs' },
              { id: 'safety-committee', name: 'Safety Committee', href: '/hr/safety/management/committee', description: 'Committee management' },
            ],
          },
          {
            id: 'incident-management',
            name: 'Incident Management',
            href: '#',
            description: 'Incident tracking',
            subItems: [
              { id: 'report-incident', name: 'Report Incident', href: '/hr/safety/incidents/report', description: 'Log incidents' },
              { id: 'incident-investigation', name: 'Incident Investigation', href: '/hr/safety/incidents/investigation', description: 'Root cause analysis' },
              { id: 'incident-tracking', name: 'Incident Tracking', href: '/hr/safety/incidents/tracking', description: 'Monitor incidents' },
              { id: 'near-miss', name: 'Near Miss Reports', href: '/hr/safety/incidents/near-miss', description: 'Near miss logging' },
            ],
          },
          {
            id: 'risk-assessment',
            name: 'Risk Assessment',
            href: '#',
            description: 'Hazard identification',
            subItems: [
              { id: 'hazard-identification', name: 'Hazard Identification', href: '/hr/safety/risk/hazards', description: 'Identify hazards' },
              { id: 'risk-evaluation', name: 'Risk Evaluation', href: '/hr/safety/risk/evaluation', description: 'Assess risks' },
              { id: 'control-measures', name: 'Control Measures', href: '/hr/safety/risk/controls', description: 'Risk mitigation' },
              { id: 'risk-register', name: 'Risk Register', href: '/hr/safety/risk/register', description: 'Risk database' },
            ],
          },
          {
            id: 'inspections-audits',
            name: 'Inspections & Audits',
            href: '#',
            description: 'Safety audits',
            subItems: [
              { id: 'safety-inspections', name: 'Safety Inspections', href: '/hr/safety/audits/inspections', description: 'Conduct inspections' },
              { id: 'audit-schedule', name: 'Audit Schedule', href: '/hr/safety/audits/schedule', description: 'Plan audits' },
              { id: 'audit-findings', name: 'Audit Findings', href: '/hr/safety/audits/findings', description: 'Findings & actions' },
              { id: 'corrective-actions', name: 'Corrective Actions', href: '/hr/safety/audits/actions', description: 'CAPA tracking' },
            ],
          },
          {
            id: 'ppe-management',
            name: 'PPE Management',
            href: '#',
            description: 'Personal protective equipment',
            subItems: [
              { id: 'ppe-issuance', name: 'PPE Issuance', href: '/hr/safety/ppe/issuance', description: 'Issue PPE' },
              { id: 'ppe-tracking', name: 'PPE Tracking', href: '/hr/safety/ppe/tracking', description: 'Track PPE usage' },
              { id: 'ppe-inventory', name: 'PPE Inventory', href: '/hr/safety/ppe/inventory', description: 'Stock management' },
            ],
          },
          {
            id: 'emergency-response',
            name: 'Emergency Response',
            href: '#',
            description: 'Emergency preparedness',
            subItems: [
              { id: 'emergency-plans', name: 'Emergency Plans', href: '/hr/safety/emergency/plans', description: 'Response plans' },
              { id: 'evacuation-drills', name: 'Evacuation Drills', href: '/hr/safety/emergency/drills', description: 'Drill management' },
              { id: 'emergency-contacts', name: 'Emergency Contacts', href: '/hr/safety/emergency/contacts', description: 'Contact list' },
            ],
          },
          {
            id: 'health-wellness',
            name: 'Health & Wellness',
            href: '#',
            description: 'Employee wellbeing',
            subItems: [
              { id: 'health-checkups', name: 'Health Checkups', href: '/hr/safety/wellness/checkups', description: 'Medical exams' },
              { id: 'wellness-programs', name: 'Wellness Programs', href: '/hr/safety/wellness/programs', description: 'Wellness initiatives' },
              { id: 'occupational-health', name: 'Occupational Health', href: '/hr/safety/wellness/occupational', description: 'Work-related health' },
              { id: 'ergonomics', name: 'Ergonomics', href: '/hr/safety/wellness/ergonomics', description: 'Workplace ergonomics' },
            ],
          },
          {
            id: 'safety-reports',
            name: 'Safety Reports',
            href: '#',
            description: 'Analytics',
            subItems: [
              { id: 'incident-analytics', name: 'Incident Analytics', href: '/hr/safety/reports/analytics', description: 'Incident trends' },
              { id: 'safety-kpi', name: 'Safety KPIs', href: '/hr/safety/reports/kpi', description: 'Safety metrics' },
              { id: 'compliance-reports', name: 'Compliance Reports', href: '/hr/safety/reports/compliance', description: 'Regulatory compliance' },
            ],
          },
        ],
      },
      {
        id: 'hr-compliance',
        name: 'HR Compliance',
        href: '#',
        description: 'Legal & regulatory',
        subItems: [
          {
            id: 'labor-laws',
            name: 'Labor Laws',
            href: '#',
            description: 'Labor compliance',
            subItems: [
              { id: 'compliance-tracker', name: 'Compliance Tracker', href: '/hr/compliance/labor/tracker', description: 'Track compliance' },
              { id: 'labor-registers', name: 'Labor Registers', href: '/hr/compliance/labor/registers', description: 'Statutory registers' },
              { id: 'compliance-calendar', name: 'Compliance Calendar', href: '/hr/compliance/labor/calendar', description: 'Due dates' },
            ],
          },
          {
            id: 'statutory-returns',
            name: 'Statutory Returns',
            href: '#',
            description: 'Government filings',
            subItems: [
              { id: 'pf-returns', name: 'PF Returns', href: '/hr/compliance/returns/pf', description: 'PF filing' },
              { id: 'esi-returns', name: 'ESI Returns', href: '/hr/compliance/returns/esi', description: 'ESI filing' },
              { id: 'tds-returns', name: 'TDS Returns', href: '/hr/compliance/returns/tds', description: 'TDS filing' },
              { id: 'pt-returns', name: 'PT Returns', href: '/hr/compliance/returns/pt', description: 'Professional tax' },
              { id: 'lwf-returns', name: 'LWF Returns', href: '/hr/compliance/returns/lwf', description: 'Labor welfare fund' },
            ],
          },
          {
            id: 'license-registrations',
            name: 'Licenses & Registrations',
            href: '#',
            description: 'License management',
            subItems: [
              { id: 'license-master', name: 'License Master', href: '/hr/compliance/licenses/master', description: 'All licenses' },
              { id: 'renewal-tracking', name: 'Renewal Tracking', href: '/hr/compliance/licenses/renewals', description: 'License renewals' },
              { id: 'compliance-certificates', name: 'Compliance Certificates', href: '/hr/compliance/licenses/certificates', description: 'Certificates' },
            ],
          },
          {
            id: 'policy-compliance',
            name: 'Policy Compliance',
            href: '#',
            description: 'Internal policies',
            subItems: [
              { id: 'policy-acknowledgment', name: 'Policy Acknowledgment', href: '/hr/compliance/policy/acknowledgment', description: 'Employee acceptance' },
              { id: 'policy-violations', name: 'Policy Violations', href: '/hr/compliance/policy/violations', description: 'Track violations' },
              { id: 'disciplinary-actions', name: 'Disciplinary Actions', href: '/hr/compliance/policy/disciplinary', description: 'Disciplinary process' },
            ],
          },
          {
            id: 'equal-opportunity',
            name: 'Equal Opportunity',
            href: '#',
            description: 'Diversity & inclusion',
            subItems: [
              { id: 'diversity-metrics', name: 'Diversity Metrics', href: '/hr/compliance/diversity/metrics', description: 'D&I analytics' },
              { id: 'eeo-reports', name: 'EEO Reports', href: '/hr/compliance/diversity/eeo', description: 'Equal opportunity' },
              { id: 'grievance-redressal', name: 'Grievance Redressal', href: '/hr/compliance/diversity/grievance', description: 'Complaint handling' },
              { id: 'posh-compliance', name: 'POSH Compliance', href: '/hr/compliance/diversity/posh', description: 'Sexual harassment prevention' },
            ],
          },
          {
            id: 'audit-compliance',
            name: 'Audit & Compliance',
            href: '#',
            description: 'Compliance audits',
            subItems: [
              { id: 'compliance-audits', name: 'Compliance Audits', href: '/hr/compliance/audit/audits', description: 'Schedule audits' },
              { id: 'audit-findings', name: 'Audit Findings', href: '/hr/compliance/audit/findings', description: 'Audit results' },
              { id: 'remediation', name: 'Remediation Plans', href: '/hr/compliance/audit/remediation', description: 'Fix non-compliance' },
            ],
          },
          {
            id: 'compliance-reports',
            name: 'Compliance Reports',
            href: '#',
            description: 'Reporting',
            subItems: [
              { id: 'compliance-dashboard', name: 'Compliance Dashboard', href: '/hr/compliance/reports/dashboard', description: 'Overall status' },
              { id: 'statutory-reports', name: 'Statutory Reports', href: '/hr/compliance/reports/statutory', description: 'Legal reports' },
              { id: 'compliance-alerts', name: 'Compliance Alerts', href: '/hr/compliance/reports/alerts', description: 'Due date alerts' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: Truck,
    color: 'text-lime-600',
    bgColor: 'bg-lime-50',
    hoverColor: 'hover:bg-lime-100',
    subItems: [
      { id: 'logistics-dashboard', name: 'Logistics Dashboard', href: '/logistics', description: 'Logistics overview' },
      {
        id: 'shipping-management',
        name: 'Shipping Management',
        href: '#',
        description: 'Shipment operations',
        subItems: [
          { id: 'all-shipments', name: 'All Shipments', href: '/logistics/shipping', description: 'View all shipments' },
          { id: 'create-shipment', name: 'Create Shipment', href: '/logistics/shipping/add', description: 'New shipment' },
          { id: 'inbound-shipments', name: 'Inbound Shipments', href: '/logistics/shipping/inbound', description: 'Incoming goods' },
          { id: 'outbound-shipments', name: 'Outbound Shipments', href: '/logistics/shipping/outbound', description: 'Outgoing goods' },
          { id: 'shipment-scheduling', name: 'Shipment Scheduling', href: '/logistics/shipping/schedule', description: 'Schedule deliveries' },
          { id: 'loading-unloading', name: 'Loading/Unloading', href: '/logistics/shipping/loading', description: 'Dock operations' },
        ],
      },
      {
        id: 'tracking-visibility',
        name: 'Tracking & Visibility',
        href: '#',
        description: 'Track shipments',
        subItems: [
          { id: 'shipment-tracking', name: 'Shipment Tracking', href: '/logistics/tracking', description: 'Real-time tracking' },
          { id: 'track-trace', name: 'Track & Trace', href: '/logistics/tracking/trace', description: 'Trace shipments' },
          { id: 'delivery-status', name: 'Delivery Status', href: '/logistics/tracking/status', description: 'Delivery updates' },
          { id: 'pod-management', name: 'POD Management', href: '/logistics/tracking/pod', description: 'Proof of delivery' },
          { id: 'exceptions', name: 'Exceptions & Delays', href: '/logistics/tracking/exceptions', description: 'Handle exceptions' },
        ],
      },
      {
        id: 'carrier-management',
        name: 'Carrier Management',
        href: '#',
        description: 'Manage carriers',
        subItems: [
          { id: 'all-carriers', name: 'All Carriers', href: '/logistics/carriers', description: 'Carrier database' },
          { id: 'create-carrier', name: 'Add Carrier', href: '/logistics/carriers/add', description: 'New carrier' },
          { id: 'carrier-performance', name: 'Carrier Performance', href: '/logistics/carriers/performance', description: 'Performance metrics' },
          { id: 'carrier-rates', name: 'Carrier Rates', href: '/logistics/carriers/rates', description: 'Rate management' },
          { id: 'carrier-contracts', name: 'Carrier Contracts', href: '/logistics/carriers/contracts', description: 'Contract terms' },
        ],
      },
      {
        id: 'transportation-planning',
        name: 'Transportation Planning',
        href: '#',
        description: 'Plan transport',
        subItems: [
          { id: 'route-planning', name: 'Route Planning', href: '/logistics/planning/routes', description: 'Optimize routes' },
          { id: 'load-planning', name: 'Load Planning', href: '/logistics/planning/loads', description: 'Plan loads' },
          { id: 'trip-planning', name: 'Trip Planning', href: '/logistics/planning/trips', description: 'Plan trips' },
          { id: 'consolidation', name: 'Shipment Consolidation', href: '/logistics/planning/consolidation', description: 'Consolidate shipments' },
          { id: 'dispatch-board', name: 'Dispatch Board', href: '/logistics/planning/dispatch', description: 'Dispatch operations' },
        ],
      },
      {
        id: 'fleet-management',
        name: 'Fleet Management',
        href: '#',
        description: 'Manage fleet',
        subItems: [
          { id: 'vehicles', name: 'Vehicles', href: '/logistics/vehicle-master', description: 'Fleet database' },
          { id: 'vehicle-tracking', name: 'Vehicle Tracking', href: '/logistics/fleet/tracking', description: 'GPS tracking' },
          { id: 'vehicle-maintenance', name: 'Vehicle Maintenance', href: '/logistics/fleet/maintenance', description: 'Fleet maintenance' },
          { id: 'fuel-management', name: 'Fuel Management', href: '/logistics/fleet/fuel', description: 'Fuel tracking' },
          { id: 'vehicle-utilization', name: 'Vehicle Utilization', href: '/logistics/fleet/utilization', description: 'Utilization metrics' },
        ],
      },
      {
        id: 'driver-management',
        name: 'Driver Management',
        href: '#',
        description: 'Manage drivers',
        subItems: [
          { id: 'drivers', name: 'Drivers', href: '/logistics/driver-master', description: 'Driver database' },
          { id: 'driver-assignments', name: 'Driver Assignments', href: '/logistics/drivers/assignments', description: 'Assign drivers' },
          { id: 'driver-performance', name: 'Driver Performance', href: '/logistics/drivers/performance', description: 'Performance tracking' },
          { id: 'driver-compliance', name: 'Driver Compliance', href: '/logistics/drivers/compliance', description: 'License & compliance' },
        ],
      },
      {
        id: 'freight-management',
        name: 'Freight Management',
        href: '#',
        description: 'Freight operations',
        subItems: [
          { id: 'freight-quotes', name: 'Freight Quotes', href: '/logistics/freight/quotes', description: 'Get quotes' },
          { id: 'freight-booking', name: 'Freight Booking', href: '/logistics/freight/booking', description: 'Book freight' },
          { id: 'freight-invoicing', name: 'Freight Invoicing', href: '/logistics/freight/invoicing', description: 'Freight bills' },
          { id: 'freight-audit', name: 'Freight Audit', href: '/logistics/freight/audit', description: 'Audit charges' },
        ],
      },
      {
        id: 'warehouse-logistics',
        name: 'Warehouse Logistics',
        href: '#',
        description: 'Warehouse operations',
        subItems: [
          { id: 'dock-scheduling', name: 'Dock Scheduling', href: '/logistics/warehouse/dock', description: 'Dock appointments' },
          { id: 'cross-docking', name: 'Cross-Docking', href: '/logistics/warehouse/cross-dock', description: 'Cross-dock operations' },
          { id: 'yard-management', name: 'Yard Management', href: '/logistics/warehouse/yard', description: 'Yard operations' },
        ],
      },
      {
        id: 'logistics-masters',
        name: 'Master Data',
        href: '#',
        description: 'Configuration data',
        subItems: [
          { id: 'transporters', name: 'Transporters', href: '/logistics/transporter-master', description: 'Transport companies' },
          { id: 'routes', name: 'Routes', href: '/logistics/route-master', description: 'Delivery routes' },
          { id: 'packaging', name: 'Packaging Types', href: '/logistics/packaging-master', description: 'Packaging config' },
          { id: 'freight-terms', name: 'Freight Terms', href: '/logistics/freight-master', description: 'Incoterms' },
          { id: 'ports', name: 'Ports/Terminals', href: '/logistics/port-master', description: 'Port locations' },
        ],
      },
      {
        id: 'logistics-analytics',
        name: 'Logistics Analytics',
        href: '#',
        description: 'Performance insights',
        subItems: [
          { id: 'logistics-reports', name: 'Logistics Reports', href: '/logistics/analytics/reports', description: 'Standard reports' },
          { id: 'delivery-performance', name: 'Delivery Performance', href: '/logistics/analytics/delivery', description: 'On-time delivery' },
          { id: 'freight-spend', name: 'Freight Spend Analysis', href: '/logistics/analytics/spend', description: 'Cost analysis' },
          { id: 'route-optimization', name: 'Route Optimization', href: '/logistics/analytics/optimization', description: 'Optimize routes' },
        ],
      },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'TMS-grade capabilities',
        subItems: [
          { id: 'live-telematics', name: 'Live Telematics', href: '/logistics/advanced-features#telematics', description: 'Real-time GPS tracking' },
          { id: 'route-opt', name: 'Route Optimization', href: '/logistics/advanced-features#routing', description: 'AI-powered routing' },
          { id: 'carrier-mgmt', name: 'Carrier Management', href: '/logistics/advanced-features#carriers', description: 'Carrier performance' },
          { id: 'exception-handling', name: 'Exception Handling', href: '/logistics/advanced-features#exceptions', description: 'Shipment exceptions' },
          { id: 'dock-sched', name: 'Dock Scheduling', href: '/logistics/advanced-features#dock', description: 'Dock appointments' },
          { id: 'freight-cost', name: 'Freight Cost Analytics', href: '/logistics/advanced-features#cost', description: 'Cost breakdown' },
          { id: 'customer-portal', name: 'Customer Portal', href: '/logistics/advanced-features#customer', description: 'Self-service tracking' },
          { id: 'all-logistics-features', name: '→ View All Features', href: '/logistics/advanced-features', description: 'Complete feature set' },
        ],
      },
    ],
  },
  {
    id: 'after-sales-service',
    name: 'After Sales Service',
    icon: Wrench,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hoverColor: 'hover:bg-emerald-100',
    subItems: [
      { id: 'ass-main-dashboard', name: 'Service Overview', href: '/after-sales-service', description: 'Main dashboard' },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise field service',
        subItems: [
          { id: 'live-sla', name: 'Live SLA Tracking', href: '/after-sales-service/advanced-features#sla', description: 'Real-time SLA' },
          { id: 'tech-routing', name: 'Technician Routing', href: '/after-sales-service/advanced-features#routing', description: 'AI-optimized routes' },
          { id: 'spare-parts', name: 'Spare Parts Integration', href: '/after-sales-service/advanced-features#parts', description: 'Inventory sync' },
          { id: 'service-dispatch', name: 'Service Dispatch', href: '/after-sales-service/advanced-features#dispatch', description: 'Field dispatch' },
          { id: 'auto-escalations', name: 'Automated Escalations', href: '/after-sales-service/advanced-features#escalations', description: 'Smart escalation' },
          { id: 'self-service', name: 'Self-Service Portal', href: '/after-sales-service/advanced-features#self-service', description: 'Customer portal' },
          { id: 'feedback-loop', name: 'Customer Feedback Loop', href: '/after-sales-service/advanced-features#feedback', description: 'Post-service surveys' },
          { id: 'all-ass-features', name: '→ View All Features', href: '/after-sales-service/advanced-features', description: 'Complete feature set' },
        ],
      },
      {
        id: 'service-requests-management',
        name: 'Service Requests',
        href: '#',
        description: 'Ticket management',
        subItems: [
          { id: 'all-service-requests', name: 'All Service Requests', href: '/after-sales-service/service-requests', description: 'View all tickets' },
          { id: 'create-service-request', name: 'Create Request', href: '/after-sales-service/service-requests/add', description: 'New ticket' },
          { id: 'open-requests', name: 'Open Requests', href: '/after-sales-service/service-requests/open', description: 'Pending tickets' },
          { id: 'in-progress-requests', name: 'In Progress', href: '/after-sales-service/service-requests/in-progress', description: 'Active tickets' },
          { id: 'resolved-requests', name: 'Resolved', href: '/after-sales-service/service-requests/resolved', description: 'Closed tickets' },
          { id: 'sla-dashboard', name: 'SLA Dashboard', href: '/after-sales-service/service-requests/sla-dashboard', description: 'SLA tracking' },
        ],
      },
      {
        id: 'service-contracts-management',
        name: 'Service Contracts (AMC)',
        href: '#',
        description: 'Contract management',
        subItems: [
          { id: 'all-contracts', name: 'All Contracts', href: '/after-sales-service/service-contracts', description: 'View contracts' },
          { id: 'create-contract', name: 'Create Contract', href: '/after-sales-service/service-contracts/add', description: 'New contract' },
          { id: 'active-contracts', name: 'Active Contracts', href: '/after-sales-service/service-contracts/active', description: 'Active AMCs' },
          { id: 'expiring-contracts', name: 'Expiring Contracts', href: '/after-sales-service/service-contracts/expiring', description: 'Renewal alerts' },
          { id: 'contract-renewal', name: 'Contract Renewals', href: '/after-sales-service/service-contracts/renewals', description: 'Renew contracts' },
          { id: 'contract-terms', name: 'Contract Terms', href: '/after-sales-service/service-contracts/terms', description: 'Terms templates' },
        ],
      },
      {
        id: 'warranties-management',
        name: 'Warranties',
        href: '#',
        description: 'Warranty management',
        subItems: [
          { id: 'all-warranties', name: 'All Warranties', href: '/after-sales-service/warranties', description: 'Warranty register' },
          { id: 'create-warranty', name: 'Register Warranty', href: '/after-sales-service/warranties/add', description: 'New warranty' },
          { id: 'active-warranties', name: 'Active Warranties', href: '/after-sales-service/warranties/active', description: 'In warranty' },
          { id: 'expired-warranties', name: 'Expired Warranties', href: '/after-sales-service/warranties/expired', description: 'Out of warranty' },
          { id: 'warranty-claims', name: 'Warranty Claims', href: '/after-sales-service/warranties/claims', description: 'Claims processing' },
          { id: 'claim-approval', name: 'Claim Approvals', href: '/after-sales-service/warranties/claims/approvals', description: 'Approve claims' },
        ],
      },
      {
        id: 'installations-management',
        name: 'Installations',
        href: '#',
        description: 'Installation services',
        subItems: [
          { id: 'all-installations', name: 'All Installations', href: '/after-sales-service/installations', description: 'Installation jobs' },
          { id: 'create-installation', name: 'Schedule Installation', href: '/after-sales-service/installations/add', description: 'New installation' },
          { id: 'pending-installations', name: 'Pending Installations', href: '/after-sales-service/installations/pending', description: 'Scheduled jobs' },
          { id: 'completed-installations', name: 'Completed', href: '/after-sales-service/installations/completed', description: 'Finished jobs' },
          { id: 'installation-calendar', name: 'Installation Calendar', href: '/after-sales-service/installations/calendar', description: 'Calendar view' },
        ],
      },
      {
        id: 'field-service-management',
        name: 'Field Service',
        href: '#',
        description: 'Field operations',
        subItems: [
          { id: 'all-field-jobs', name: 'All Field Jobs', href: '/after-sales-service/field-service', description: 'View all jobs' },
          { id: 'field-dispatch', name: 'Dispatch Board', href: '/after-sales-service/field-service/dispatch', description: 'Dispatch technicians' },
          { id: 'field-schedule', name: 'Field Schedule', href: '/after-sales-service/field-service/schedule', description: 'Schedule calendar' },
          { id: 'technician-tracking', name: 'Technician Tracking', href: '/after-sales-service/field-service/tracking', description: 'GPS tracking' },
          { id: 'mobile-app', name: 'Mobile App', href: '/after-sales-service/field-service/mobile', description: 'Technician app' },
        ],
      },
      {
        id: 'parts-inventory',
        name: 'Spare Parts & Inventory',
        href: '#',
        description: 'Service parts',
        subItems: [
          { id: 'spare-parts', name: 'Spare Parts', href: '/after-sales-service/parts', description: 'Parts catalog' },
          { id: 'parts-requisition', name: 'Parts Requisition', href: '/after-sales-service/parts/requisition', description: 'Request parts' },
          { id: 'parts-consumption', name: 'Parts Consumption', href: '/after-sales-service/parts/consumption', description: 'Usage tracking' },
          { id: 'parts-returns', name: 'Parts Returns', href: '/after-sales-service/parts/returns', description: 'Return parts' },
        ],
      },
      {
        id: 'service-billing',
        name: 'Service Billing',
        href: '#',
        description: 'Billing & invoicing',
        subItems: [
          { id: 'all-service-invoices', name: 'All Invoices', href: '/after-sales-service/billing', description: 'Service invoices' },
          { id: 'create-invoice', name: 'Create Invoice', href: '/after-sales-service/billing/create', description: 'New invoice' },
          { id: 'pending-billing', name: 'Pending Billing', href: '/after-sales-service/billing/pending', description: 'Unbilled services' },
          { id: 'billing-payments', name: 'Payment Tracking', href: '/after-sales-service/billing/payments', description: 'Payment status' },
        ],
      },
      {
        id: 'service-knowledge-base',
        name: 'Knowledge Base',
        href: '#',
        description: 'Service documentation',
        subItems: [
          { id: 'knowledge-articles', name: 'Knowledge Articles', href: '/after-sales-service/knowledge/articles', description: 'Help articles' },
          { id: 'troubleshooting', name: 'Troubleshooting Guides', href: '/after-sales-service/knowledge/troubleshooting', description: 'Resolution guides' },
          { id: 'manuals', name: 'Product Manuals', href: '/after-sales-service/knowledge/manuals', description: 'User manuals' },
          { id: 'faqs', name: 'FAQs', href: '/after-sales-service/knowledge/faqs', description: 'Common questions' },
        ],
      },
      {
        id: 'customer-feedback',
        name: 'Customer Feedback',
        href: '#',
        description: 'Service feedback',
        subItems: [
          { id: 'feedback-surveys', name: 'Feedback Surveys', href: '/after-sales-service/feedback/surveys', description: 'Customer surveys' },
          { id: 'service-ratings', name: 'Service Ratings', href: '/after-sales-service/feedback/ratings', description: 'Rating tracking' },
          { id: 'nps-score', name: 'NPS Score', href: '/after-sales-service/feedback/nps', description: 'Net Promoter Score' },
          { id: 'complaints', name: 'Complaints', href: '/after-sales-service/feedback/complaints', description: 'Handle complaints' },
        ],
      },
      {
        id: 'service-analytics',
        name: 'Analytics & Reports',
        href: '#',
        description: 'Service insights',
        subItems: [
          { id: 'service-dashboard', name: 'Service Dashboard', href: '/after-sales-service/dashboard', description: 'KPI dashboard' },
          { id: 'service-analytics', name: 'Service Analytics', href: '/after-sales-service/dashboard/analytics', description: 'Analytics' },
          { id: 'service-reports', name: 'Service Reports', href: '/after-sales-service/dashboard/reports', description: 'Reports' },
          { id: 'technician-performance', name: 'Technician Performance', href: '/after-sales-service/analytics/technicians', description: 'Technician metrics' },
          { id: 'first-time-fix', name: 'First Time Fix Rate', href: '/after-sales-service/analytics/ftf', description: 'FTF tracking' },
        ],
      },
    ],
  },
  {
    id: 'support',
    name: 'Support',
    icon: Headphones,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    hoverColor: 'hover:bg-rose-100',
    subItems: [
      { id: 'support-dashboard', name: 'Support Dashboard', href: '/support', description: 'Support overview' },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise service desk',
        subItems: [
          { id: 'omnichannel-routing', name: 'Omnichannel Routing', href: '/support/advanced-features#omnichannel', description: 'Unified routing' },
          { id: 'knowledge-base', name: 'Knowledge Base Integration', href: '/support/advanced-features#knowledge', description: 'Self-service KB' },
          { id: 'ai-responses', name: 'AI-Assisted Responses', href: '/support/advanced-features#ai', description: 'AI suggestions' },
          { id: 'sla-automation', name: 'SLA Automation', href: '/support/advanced-features#sla', description: 'Automated SLA' },
          { id: 'csat-surveys', name: 'CSAT Surveys', href: '/support/advanced-features#csat', description: 'Satisfaction tracking' },
          { id: 'backlog-forecasting', name: 'Backlog Forecasting', href: '/support/advanced-features#backlog', description: 'AI forecasts' },
          { id: 'itil-workflows', name: 'ITIL Workflows', href: '/support/advanced-features#itil', description: 'ITIL compliance' },
          { id: 'all-support-features', name: '→ View All Features', href: '/support/advanced-features', description: 'Complete feature set' },
        ],
      },
      {
        id: 'omnichannel-support',
        name: '🎧 Omnichannel Inbox',
        href: '/support/omnichannel',
        description: 'Unified multi-channel support',
      },
      {
        id: 'ticket-management',
        name: 'Ticket Management',
        href: '#',
        description: 'Support tickets',
        subItems: [
          { id: 'all-tickets', name: 'All Tickets', href: '/support/tickets', description: 'View all tickets' },
          { id: 'create-ticket', name: 'Create Ticket', href: '/support/tickets/create', description: 'New ticket' },
          { id: 'open-tickets', name: 'Open Tickets', href: '/support/tickets/open', description: 'Pending tickets' },
          { id: 'assigned-tickets', name: 'My Assigned Tickets', href: '/support/tickets/assigned', description: 'Assigned to me' },
          { id: 'resolved-tickets', name: 'Resolved Tickets', href: '/support/tickets/resolved', description: 'Closed tickets' },
          { id: 'ticket-categories', name: 'Ticket Categories', href: '/support/tickets/categories', description: 'Manage categories' },
        ],
      },
      {
        id: 'incident-management',
        name: 'Incident Management',
        href: '#',
        description: 'IT incidents',
        subItems: [
          { id: 'all-incidents', name: 'All Incidents', href: '/support/incidents', description: 'View incidents' },
          { id: 'create-incident', name: 'Log Incident', href: '/support/incidents/create', description: 'New incident' },
          { id: 'critical-incidents', name: 'Critical Incidents', href: '/support/incidents/critical', description: 'P1 incidents' },
          { id: 'incident-tracking', name: 'Incident Tracking', href: '/support/incidents/tracking', description: 'Track status' },
          { id: 'major-incidents', name: 'Major Incidents', href: '/support/incidents/major', description: 'Major incidents' },
        ],
      },
      {
        id: 'problem-management',
        name: 'Problem Management',
        href: '#',
        description: 'Root cause analysis',
        subItems: [
          { id: 'problems', name: 'All Problems', href: '/support/problems', description: 'Problem register' },
          { id: 'create-problem', name: 'Create Problem', href: '/support/problems/create', description: 'New problem' },
          { id: 'known-errors', name: 'Known Errors', href: '/support/problems/known-errors', description: 'Error database' },
          { id: 'root-cause-analysis', name: 'Root Cause Analysis', href: '/support/problems/rca', description: 'RCA tracking' },
        ],
      },
      {
        id: 'knowledge-management',
        name: 'Knowledge Base',
        href: '#',
        description: 'Documentation',
        subItems: [
          { id: 'knowledge-articles', name: 'Knowledge Articles', href: '/support/knowledge', description: 'All articles' },
          { id: 'create-article', name: 'Create Article', href: '/support/knowledge/create', description: 'New article' },
          { id: 'faqs', name: 'FAQs', href: '/support/knowledge/faqs', description: 'Frequent questions' },
          { id: 'how-to-guides', name: 'How-To Guides', href: '/support/knowledge/guides', description: 'Step-by-step guides' },
          { id: 'troubleshooting', name: 'Troubleshooting', href: '/support/knowledge/troubleshooting', description: 'Problem solutions' },
        ],
      },
      {
        id: 'change-management',
        name: 'Change Management',
        href: '#',
        description: 'Change requests',
        subItems: [
          { id: 'change-requests', name: 'Change Requests', href: '/support/changes', description: 'All changes' },
          { id: 'create-change', name: 'Create Change', href: '/support/changes/create', description: 'New change' },
          { id: 'pending-approval', name: 'Pending Approval', href: '/support/changes/pending', description: 'Awaiting approval' },
          { id: 'scheduled-changes', name: 'Scheduled Changes', href: '/support/changes/scheduled', description: 'Upcoming changes' },
          { id: 'emergency-changes', name: 'Emergency Changes', href: '/support/changes/emergency', description: 'Emergency CABs' },
        ],
      },
      {
        id: 'asset-management',
        name: 'Asset Management',
        href: '#',
        description: 'IT assets',
        subItems: [
          { id: 'it-assets', name: 'IT Assets', href: '/support/assets', description: 'Asset inventory' },
          { id: 'hardware', name: 'Hardware', href: '/support/assets/hardware', description: 'Hardware assets' },
          { id: 'software', name: 'Software Licenses', href: '/support/assets/software', description: 'Software tracking' },
          { id: 'asset-tracking', name: 'Asset Tracking', href: '/support/assets/tracking', description: 'Track locations' },
          { id: 'depreciation', name: 'Depreciation', href: '/support/assets/depreciation', description: 'Asset depreciation' },
        ],
      },
      {
        id: 'sla-management',
        name: 'SLA Management',
        href: '#',
        description: 'Service level agreements',
        subItems: [
          { id: 'sla-dashboard', name: 'SLA Dashboard', href: '/support/sla', description: 'SLA metrics' },
          { id: 'sla-compliance', name: 'SLA Compliance', href: '/support/sla/compliance', description: 'Track compliance' },
          { id: 'sla-breaches', name: 'SLA Breaches', href: '/support/sla/breaches', description: 'Breach tracking' },
          { id: 'sla-settings', name: 'SLA Settings', href: '/support/sla/settings', description: 'Configure SLAs' },
        ],
      },
      {
        id: 'support-automation',
        name: 'Automation',
        href: '#',
        description: 'Workflow automation',
        subItems: [
          { id: 'automation-rules', name: 'Automation Rules', href: '/support/automation/rules', description: 'Workflow rules' },
          { id: 'auto-assignment', name: 'Auto Assignment', href: '/support/automation/assignment', description: 'Ticket routing' },
          { id: 'escalation-rules', name: 'Escalation Rules', href: '/support/automation/escalation', description: 'Auto escalation' },
          { id: 'canned-responses', name: 'Canned Responses', href: '/support/automation/responses', description: 'Quick replies' },
        ],
      },
      {
        id: 'support-team',
        name: 'Support Team',
        href: '#',
        description: 'Team management',
        subItems: [
          { id: 'support-agents', name: 'Support Agents', href: '/support/team/agents', description: 'Agent directory' },
          { id: 'team-performance', name: 'Team Performance', href: '/support/team/performance', description: 'Agent metrics' },
          { id: 'workload-distribution', name: 'Workload Distribution', href: '/support/team/workload', description: 'Ticket distribution' },
          { id: 'skill-matrix', name: 'Skill Matrix', href: '/support/team/skills', description: 'Agent skills' },
        ],
      },
      {
        id: 'support-analytics',
        name: 'Analytics & Reports',
        href: '#',
        description: 'Support insights',
        subItems: [
          { id: 'support-reports', name: 'Support Reports', href: '/support/reports', description: 'Standard reports' },
          { id: 'ticket-analytics', name: 'Ticket Analytics', href: '/support/analytics/tickets', description: 'Ticket metrics' },
          { id: 'resolution-time', name: 'Resolution Time', href: '/support/analytics/resolution', description: 'Time tracking' },
          { id: 'customer-satisfaction', name: 'Customer Satisfaction', href: '/support/analytics/csat', description: 'CSAT scores' },
          { id: 'first-response-time', name: 'First Response Time', href: '/support/analytics/frt', description: 'FRT metrics' },
        ],
      },
    ],
  },
  {
    id: 'workflow',
    name: 'Workflow',
    icon: GitBranch,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100',
    subItems: [
      { id: 'workflow-dashboard', name: 'Workflow Dashboard', href: '/workflow', description: 'Workflow overview' },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise workflow automation',
        subItems: [
          { id: 'orchestration-engine', name: 'Orchestration Engine', href: '/workflow/automation/advanced-features#orchestration', description: 'Visual workflow builder' },
          { id: 'conditional-branching', name: 'Conditional Branching', href: '/workflow/automation/advanced-features#branching', description: 'IF/THEN/ELSE logic' },
          { id: 'testing-sandbox', name: 'Testing Sandbox', href: '/workflow/automation/advanced-features#testing', description: 'Test workflows' },
          { id: 'integration-catalog', name: 'Integration Catalog', href: '/workflow/automation/advanced-features#integrations', description: 'Available integrations' },
          { id: 'execution-logs', name: 'Execution Logs', href: '/workflow/automation/advanced-features#logs', description: 'Runtime monitoring' },
          { id: 'kpi-monitoring', name: 'KPI Monitoring', href: '/workflow/automation/advanced-features#kpi', description: 'Performance metrics' },
          { id: 'error-handling', name: 'Error Handling', href: '/workflow/automation/advanced-features#errors', description: 'Error recovery' },
          { id: 'version-control', name: 'Version Control', href: '/workflow/automation/advanced-features#versions', description: 'Workflow versioning' },
          { id: 'all-workflow-features', name: '→ View All Features', href: '/workflow/automation/advanced-features', description: 'Complete feature set' },
        ],
      },
      {
        id: 'automation',
        name: 'Automation',
        href: '#',
        description: 'Automated workflows',
        subItems: [
          { id: 'automation-list', name: 'All Automations', href: '/workflow/automation', description: 'View all' },
          { id: 'create-automation', name: 'Create Automation', href: '/workflow/automation/create', description: 'New workflow' },
        ],
      },
      {
        id: 'approvals',
        name: 'Approvals',
        href: '#',
        description: 'Approval workflows',
        subItems: [
          { id: 'approval-list', name: 'All Approvals', href: '/workflow/approvals', description: 'View all' },
          { id: 'pending-approvals', name: 'Pending Approvals', href: '/workflow/approvals/pending', description: 'Action required' },
        ],
      },
      {
        id: 'templates',
        name: 'Templates',
        href: '#',
        description: 'Workflow templates',
        subItems: [
          { id: 'template-list', name: 'All Templates', href: '/workflow/templates', description: 'Browse templates' },
          { id: 'create-template', name: 'Create Template', href: '/workflow/templates/create', description: 'New template' },
        ],
      },
    ],
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    icon: BarChart3,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    hoverColor: 'hover:bg-cyan-100',
    subItems: [
      { id: 'reports-dashboard', name: 'Reports Dashboard', href: '/reports', description: 'Overview' },
      {
        id: 'advanced-features',
        name: '✨ Advanced Features',
        href: '#',
        description: 'Enterprise BI & Analytics',
        subItems: [
          { id: 'self-service-bi', name: 'Self-Service BI', href: '/reports/advanced-features#self-service', description: 'No-code analytics' },
          { id: 'drill-through', name: 'Drill-Through Analysis', href: '/reports/advanced-features#drill-through', description: 'Interactive exploration' },
          { id: 'data-models', name: 'Governed Data Models', href: '/reports/advanced-features#data-models', description: 'Centralized governance' },
          { id: 'ml-forecasting', name: 'ML Forecasting', href: '/reports/advanced-features#ml-forecasting', description: 'AI predictions' },
          { id: 'export-scheduling', name: 'Export Scheduling', href: '/reports/advanced-features#export', description: 'Automated distribution' },
          { id: 'role-based-insights', name: 'Role-Based Insights', href: '/reports/advanced-features#role-based', description: 'Personalized views' },
          { id: 'kpi-alerts', name: 'KPI Alerts', href: '/reports/advanced-features#kpi-alerts', description: 'Real-time notifications' },
          { id: 'all-reports-features', name: '→ View All Features', href: '/reports/advanced-features', description: 'Complete feature set' },
        ],
      },
      {
        id: 'analytics',
        name: 'Analytics',
        href: '#',
        description: 'Business intelligence',
        subItems: [
          { id: 'analytics-home', name: 'Analytics Home', href: '/reports/analytics', description: 'Main analytics' },
          { id: 'custom-reports', name: 'Custom Reports', href: '/reports/custom', description: 'Build reports' },
          { id: 'dashboards', name: 'Dashboards', href: '/reports/dashboards', description: 'Visual dashboards' },
        ],
      },
    ],
  },
  {
    id: 'common-masters',
    name: 'Common Masters',
    icon: Database,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    hoverColor: 'hover:bg-slate-100',
    subItems: [
      {
        id: 'organization-masters',
        name: 'Organization Masters',
        href: '#',
        description: 'Company & branch setup',
        subItems: [
          { id: 'company-master', name: 'Company Master', href: '/common-masters/company-master', description: 'Multiple company/entity management' },
          { id: 'branch-master', name: 'Branch/Location Master', href: '/common-masters/branch-master', description: 'All operational locations' },
          { id: 'department-master', name: 'Department Master', href: '/common-masters/department-master', description: 'Organizational departments' },
          { id: 'cost-center-master', name: 'Cost Center Master', href: '/common-masters/cost-center-master', description: 'Cost allocation centers' },
          { id: 'plant-master', name: 'Plant/Factory Master', href: '/common-masters/plant-master', description: 'Manufacturing facilities' },
          { id: 'warehouse-master', name: 'Warehouse Master', href: '/common-masters/warehouse-master', description: 'Storage locations' },
          { id: 'currency-master', name: 'Currency Master', href: '/common-masters/currency-master', description: 'Multi-currency support' },
          { id: 'exchange-rate-master', name: 'Exchange Rate Master', href: '/common-masters/exchange-rate-master', description: 'Currency conversion rates' },
        ],
      },
      {
        id: 'product-item-masters',
        name: 'Product & Item Masters',
        href: '#',
        description: 'Product catalog & materials',
        subItems: [
          { id: 'item-master', name: 'Item Master', href: '/common-masters/item-master', description: 'Complete product/material catalog' },
          { id: 'item-category-master', name: 'Item Category Master', href: '/common-masters/item-category-master', description: 'Product categorization' },
          { id: 'item-group-master', name: 'Item Group Master', href: '/common-masters/item-group-master', description: 'Product grouping' },
          { id: 'brand-master', name: 'Brand Master', href: '/common-masters/brand-master', description: 'Product brands' },
          { id: 'uom-master', name: 'Unit of Measure Master', href: '/common-masters/uom-master', description: 'Measurement units' },
          { id: 'uom-conversion-master', name: 'UOM Conversion Master', href: '/common-masters/uom-conversion-master', description: 'Unit conversions' },
          { id: 'hsn-sac-master', name: 'HSN/SAC Code Master', href: '/common-masters/hsn-sac-master', description: 'Tax classification codes' },
          { id: 'barcode-master', name: 'Barcode Master', href: '/common-masters/barcode-master', description: 'Product identification' },
        ],
      },
      {
        id: 'customer-vendor-masters',
        name: 'Customer & Vendor Masters',
        href: '#',
        description: 'Business partners',
        subItems: [
          { id: 'customer-master', name: 'Customer Master', href: '/common-masters/customer-master', description: 'Client database' },
          { id: 'customer-category-master', name: 'Customer Category Master', href: '/common-masters/customer-category-master', description: 'Customer classification' },
          { id: 'vendor-master', name: 'Vendor/Supplier Master', href: '/common-masters/vendor-master', description: 'Supplier database' },
          { id: 'vendor-category-master', name: 'Vendor Category Master', href: '/common-masters/vendor-category-master', description: 'Supplier classification' },
        ],
      },
      {
        id: 'financial-masters',
        name: 'Financial Masters',
        href: '#',
        description: 'Accounting & finance',
        subItems: [
          { id: 'chart-of-accounts-master', name: 'Chart of Accounts Master', href: '/common-masters/chart-of-accounts-master', description: 'Account structure' },
          { id: 'bank-master', name: 'Bank Master', href: '/common-masters/bank-master', description: 'Banking information' },
          { id: 'tax-master', name: 'Tax Master', href: '/common-masters/tax-master', description: 'Tax codes and rates' },
          { id: 'payment-terms-master', name: 'Payment Terms Master', href: '/common-masters/payment-terms-master', description: 'Payment conditions' },
          { id: 'price-list-master', name: 'Price List Master', href: '/common-masters/price-list-master', description: 'Pricing structures' },
        ],
      },
      {
        id: 'geographic-masters',
        name: 'Geographic Masters',
        href: '#',
        description: 'Locations & territories',
        subItems: [
          { id: 'country-master', name: 'Country Master', href: '/common-masters/country-master', description: 'Global locations' },
          { id: 'state-master', name: 'State/Province Master', href: '/common-masters/state-master', description: 'Regional divisions' },
          { id: 'city-master', name: 'City Master', href: '/common-masters/city-master', description: 'City database' },
          { id: 'territory-master', name: 'Territory Master', href: '/common-masters/territory-master', description: 'Sales territories' },
        ],
      },
      {
        id: 'hr-masters',
        name: 'HR Masters',
        href: '#',
        description: 'Human resources',
        subItems: [
          { id: 'employee-master', name: 'Employee Master', href: '/common-masters/employee-master', description: 'Personnel database' },
          { id: 'designation-master', name: 'Designation Master', href: '/common-masters/designation-master', description: 'Job positions' },
          { id: 'shift-master', name: 'Shift Master', href: '/common-masters/shift-master', description: 'Work schedules' },
          { id: 'holiday-master', name: 'Holiday Master', href: '/common-masters/holiday-master', description: 'Calendar management' },
        ],
      },
      {
        id: 'manufacturing-masters',
        name: 'Manufacturing Masters',
        href: '#',
        description: 'Production resources',
        subItems: [
          { id: 'machine-master', name: 'Machine Master', href: '/common-masters/machine-master', description: 'Equipment database' },
          { id: 'work-center-master', name: 'Work Center Master', href: '/common-masters/work-center-master', description: 'Production centers' },
          { id: 'operation-master', name: 'Operation Master', href: '/common-masters/operation-master', description: 'Manufacturing processes' },
          { id: 'routing-master', name: 'Routing Master', href: '/common-masters/routing-master', description: 'Process routing' },
          { id: 'tool-master', name: 'Tool Master', href: '/common-masters/tool-master', description: 'Manufacturing tools' },
          { id: 'quality-parameter-master', name: 'Quality Parameter Master', href: '/common-masters/quality-parameter-master', description: 'Quality standards' },
          { id: 'skill-master', name: 'Skill Master', href: '/common-masters/skill-master', description: 'Worker skills' },
          { id: 'batch-lot-master', name: 'Batch/Lot Master', href: '/common-masters/batch-lot-master', description: 'Batch tracking' },
        ],
      },
      {
        id: 'kitchen-masters',
        name: 'Kitchen Manufacturing',
        href: '#',
        description: 'Kitchen specific masters',
        subItems: [
          { id: 'cabinet-type-master', name: 'Cabinet Type Master', href: '/common-masters/cabinet-type-master', description: 'Cabinet categories' },
          { id: 'hardware-master', name: 'Hardware Master', href: '/common-masters/hardware-master', description: 'Fittings & accessories' },
          { id: 'finish-master', name: 'Finish Master', href: '/common-masters/finish-master', description: 'Surface treatments' },
          { id: 'material-grade-master', name: 'Material Grade Master', href: '/common-masters/material-grade-master', description: 'Quality grades' },
          { id: 'kitchen-layout-master', name: 'Kitchen Layout Master', href: '/common-masters/kitchen-layout-master', description: 'Layout templates' },
          { id: 'installation-type-master', name: 'Installation Type Master', href: '/common-masters/installation-type-master', description: 'Installation methods' },
          { id: 'appliance-master', name: 'Appliance Master', href: '/common-masters/appliance-master', description: 'Appliance catalog' },
          { id: 'counter-material-master', name: 'Counter Material Master', href: '/common-masters/counter-material-master', description: 'Counter materials' },
        ],
      },
      {
        id: 'system-masters',
        name: 'System Masters',
        href: '#',
        description: 'System configuration',
        subItems: [
          { id: 'user-master', name: 'User Master', href: '/common-masters/user-master', description: 'System users' },
          { id: 'role-master', name: 'Role Master', href: '/common-masters/role-master', description: 'User permissions' },
          { id: 'document-type-master', name: 'Document Type Master', href: '/common-masters/document-type-master', description: 'Document categories' },
          { id: 'number-series-master', name: 'Number Series Master', href: '/common-masters/number-series-master', description: 'Auto-numbering' },
        ],
      },
    ],
  },
  {
    id: 'it-admin',
    name: 'IT Admin',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    hoverColor: 'hover:bg-gray-100',
    subItems: [
      { id: 'it-admin-dashboard', name: 'Admin Dashboard', href: '/it-admin', description: 'System overview' },
      {
        id: 'user-management',
        name: 'User Management',
        href: '#',
        description: 'Manage users',
        subItems: [
          { id: 'all-users', name: 'All Users', href: '/it-admin/users', description: 'User directory' },
          { id: 'create-user', name: 'Create User', href: '/it-admin/users/create', description: 'Add new user' },
          { id: 'active-users', name: 'Active Users', href: '/it-admin/users/active', description: 'Active accounts' },
          { id: 'inactive-users', name: 'Inactive Users', href: '/it-admin/users/inactive', description: 'Disabled accounts' },
          { id: 'user-groups', name: 'User Groups', href: '/it-admin/users/groups', description: 'Manage groups' },
          { id: 'bulk-operations', name: 'Bulk Operations', href: '/it-admin/users/bulk', description: 'Bulk user actions' },
        ],
      },
      {
        id: 'role-permission-management',
        name: 'Roles & Permissions',
        href: '#',
        description: 'Access control',
        subItems: [
          { id: 'all-roles', name: 'All Roles', href: '/it-admin/roles', description: 'Role directory' },
          { id: 'create-role', name: 'Create Role', href: '/it-admin/roles/create', description: 'New role' },
          { id: 'permission-matrix', name: 'Permission Matrix', href: '/it-admin/roles/permissions', description: 'Permission grid' },
          { id: 'role-hierarchy', name: 'Role Hierarchy', href: '/it-admin/roles/hierarchy', description: 'Role structure' },
          { id: 'access-policies', name: 'Access Policies', href: '/it-admin/roles/policies', description: 'Security policies' },
        ],
      },
      {
        id: 'security-management',
        name: 'Security',
        href: '#',
        description: 'Security settings',
        subItems: [
          { id: 'password-policies', name: 'Password Policies', href: '/it-admin/security/password', description: 'Password rules' },
          { id: 'two-factor-auth', name: 'Two-Factor Auth', href: '/it-admin/security/2fa', description: '2FA settings' },
          { id: 'session-management', name: 'Session Management', href: '/it-admin/security/sessions', description: 'Active sessions' },
          { id: 'ip-whitelist', name: 'IP Whitelist', href: '/it-admin/security/ip-whitelist', description: 'IP restrictions' },
          { id: 'security-alerts', name: 'Security Alerts', href: '/it-admin/security/alerts', description: 'Security events' },
        ],
      },
      {
        id: 'system-settings',
        name: 'System Settings',
        href: '#',
        description: 'System configuration',
        subItems: [
          { id: 'general-settings', name: 'General Settings', href: '/it-admin/system', description: 'System config' },
          { id: 'company-settings', name: 'Company Settings', href: '/it-admin/system/company', description: 'Company info' },
          { id: 'email-settings', name: 'Email Settings', href: '/it-admin/system/email', description: 'Email config' },
          { id: 'notification-settings', name: 'Notifications', href: '/it-admin/system/notifications', description: 'Notification config' },
          { id: 'integration-settings', name: 'Integrations', href: '/it-admin/system/integrations', description: 'API integrations' },
        ],
      },
      {
        id: 'audit-compliance',
        name: 'Audit & Compliance',
        href: '#',
        description: 'Audit trails',
        subItems: [
          { id: 'audit-logs', name: 'Audit Logs', href: '/it-admin/audit', description: 'Activity logs' },
          { id: 'login-history', name: 'Login History', href: '/it-admin/audit/logins', description: 'User logins' },
          { id: 'change-logs', name: 'Change Logs', href: '/it-admin/audit/changes', description: 'Data changes' },
          { id: 'compliance-reports', name: 'Compliance Reports', href: '/it-admin/audit/compliance', description: 'Compliance tracking' },
        ],
      },
      {
        id: 'database-management',
        name: 'Database Management',
        href: '#',
        description: 'Database admin',
        subItems: [
          { id: 'database-backup', name: 'Database Backup', href: '/it-admin/database/backup', description: 'Backup management' },
          { id: 'data-export', name: 'Data Export', href: '/it-admin/database/export', description: 'Export data' },
          { id: 'data-import', name: 'Data Import', href: '/it-admin/database/import', description: 'Import data' },
          { id: 'database-cleanup', name: 'Database Cleanup', href: '/it-admin/database/cleanup', description: 'Cleanup tools' },
        ],
      },
      {
        id: 'system-monitoring',
        name: 'System Monitoring',
        href: '#',
        description: 'Performance monitoring',
        subItems: [
          { id: 'system-health', name: 'System Health', href: '/it-admin/monitoring/health', description: 'Health dashboard' },
          { id: 'performance-metrics', name: 'Performance Metrics', href: '/it-admin/monitoring/performance', description: 'Performance stats' },
          { id: 'server-logs', name: 'Server Logs', href: '/it-admin/monitoring/logs', description: 'Server logs' },
          { id: 'error-tracking', name: 'Error Tracking', href: '/it-admin/monitoring/errors', description: 'Error logs' },
        ],
      },
      {
        id: 'customization',
        name: 'Customization',
        href: '#',
        description: 'System customization',
        subItems: [
          { id: 'custom-fields', name: 'Custom Fields', href: '/it-admin/customization/fields', description: 'Custom field config' },
          { id: 'workflows', name: 'Workflows', href: '/it-admin/customization/workflows', description: 'Workflow builder' },
          { id: 'templates', name: 'Templates', href: '/it-admin/customization/templates', description: 'Template management' },
          { id: 'branding', name: 'Branding', href: '/it-admin/customization/branding', description: 'Logo & theme' },
        ],
      },
      {
        id: 'automation-scheduler',
        name: 'Automation & Scheduler',
        href: '#',
        description: 'Scheduled jobs',
        subItems: [
          { id: 'scheduled-jobs', name: 'Scheduled Jobs', href: '/it-admin/scheduler/jobs', description: 'Cron jobs' },
          { id: 'job-history', name: 'Job History', href: '/it-admin/scheduler/history', description: 'Execution history' },
          { id: 'automation-rules', name: 'Automation Rules', href: '/it-admin/scheduler/automation', description: 'Auto workflows' },
        ],
      },
      {
        id: 'license-management',
        name: 'License Management',
        href: '#',
        description: 'License tracking',
        subItems: [
          { id: 'license-info', name: 'License Information', href: '/it-admin/license', description: 'Current license' },
          { id: 'user-limits', name: 'User Limits', href: '/it-admin/license/users', description: 'User allocation' },
          { id: 'feature-access', name: 'Feature Access', href: '/it-admin/license/features', description: 'Enabled features' },
        ],
      },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedSubItems, setExpandedSubItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);

    // Auto-close other menus
    if (!newExpanded.has(itemId)) {
      newExpanded.clear();
      newExpanded.add(itemId);
    } else {
      newExpanded.delete(itemId);
      // Clear sub-items when closing main item
      const newSubExpanded = new Set(expandedSubItems);
      newSubExpanded.forEach(subId => {
        if (subId.startsWith(itemId + '-')) {
          newSubExpanded.delete(subId);
        }
      });
      setExpandedSubItems(newSubExpanded);
    }

    setExpandedItems(newExpanded);
  };

  const toggleSubItem = (parentId: string, subItemId: string) => {
    const fullId = `${parentId}-${subItemId}`;
    const newExpanded = new Set(expandedSubItems);

    if (newExpanded.has(fullId)) {
      newExpanded.delete(fullId);
    } else {
      newExpanded.add(fullId);
    }

    setExpandedSubItems(newExpanded);
  };

  const renderSubMenu = (subItems: SubMenuItem[], parentId: string, level: number = 1) => {
    return (
      <div className={`${level === 1 ? 'bg-gradient-to-r from-slate-50 to-white' : 'bg-white'} border-l-2 border-slate-300 ml-4`}>
        {subItems.map((subItem) => {
          const hasNestedItems = subItem.subItems && subItem.subItems.length > 0;
          const fullId = `${parentId}-${subItem.id}`;
          const isExpanded = expandedSubItems.has(fullId);

          return (
            <div key={subItem.id}>
              {hasNestedItems ? (
                <button
                  onClick={() => toggleSubItem(parentId, subItem.id)}
                  className={`w-full flex items-center justify-between px-${6 + level * 2} py-2.5 text-sm hover:bg-slate-100 transition-all duration-200 group ${
                    isExpanded ? 'bg-slate-100 font-medium' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ChevronRight className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {subItem.name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={subItem.href}
                  className={`block px-${6 + level * 2} py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                      {subItem.name}
                    </span>
                  </div>
                  {subItem.description && (
                    <span className="text-xs text-gray-500 block mt-0.5">
                      {subItem.description}
                    </span>
                  )}
                </Link>
              )}

              {/* Nested sub-items */}
              {hasNestedItems && isExpanded && isOpen && (
                <div className="animate-slideDown">
                  {renderSubMenu(subItem.subItems!, parentId, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isOpen ? 'w-80' : 'w-0 lg:w-20'
        } overflow-hidden flex flex-col shadow-xl`}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          {isOpen && (
            <h2 className="text-lg font-bold text-white tracking-wide">B3 MACBIS</h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/20 text-white transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedItems.has(item.id);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.id} className="mb-1">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-200 ${
                      isExpanded
                        ? `${item.bgColor} border-l-4 border-${item.color.replace('text-', '')}`
                        : item.hoverColor
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${item.color} ${isExpanded ? 'scale-110' : ''} transition-transform duration-200`} />
                      {isOpen && (
                        <span className={`font-medium ${isExpanded ? item.color : 'text-gray-700'} transition-colors duration-200`}>
                          {item.name}
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      <ChevronDown
                        className={`h-4 w-4 ${item.color} transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className={`flex items-center space-x-3 px-4 py-3 ${item.hoverColor} transition-all duration-200 border-l-4 border-transparent hover:border-${item.color.replace('text-', '')}`}
                  >
                    <Icon className={`h-5 w-5 ${item.color} hover:scale-110 transition-transform duration-200`} />
                    {isOpen && (
                      <span className="font-medium text-gray-700">{item.name}</span>
                    )}
                  </Link>
                )}

                {/* Sub-items with smooth animation */}
                {hasSubItems && isExpanded && isOpen && (
                  <div className="animate-slideDown">
                    {renderSubMenu(item.subItems!, item.id)}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-slate-50 to-white">
            <p className="text-xs text-gray-600 text-center font-semibold">
              B3 MACBIS - Kitchen Manufacturing ERP
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Powered by KreupAI Technologies LLC
            </p>
          </div>
        )}
      </aside>

      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </>
  );
}
