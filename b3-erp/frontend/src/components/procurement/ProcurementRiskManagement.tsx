'use client';

import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Users,
  Package,
  Zap,
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckSquare,
  XSquare,
  Globe,
  Building2
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area
} from 'recharts';

interface Risk {
  id: string;
  title: string;
  category: 'supply-chain' | 'financial' | 'compliance' | 'operational' | 'strategic' | 'geopolitical';
  severity: 'critical' | 'high' | 'medium' | 'low';
  likelihood: number; // 1-100
  impact: number; // 1-100
  riskScore: number; // likelihood × impact
  status: 'identified' | 'assessed' | 'mitigating' | 'monitoring' | 'closed';
  owner: string;
  supplier?: string;
  identifiedDate: string;
  lastReviewDate: string;
  mitigationPlan?: string;
  residualRisk: number;
}

export default function ProcurementRiskManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  // Mock data - Risks
  const risks: Risk[] = [
    {
      id: 'RISK001',
      title: 'Single Source Dependency - Critical Components',
      category: 'supply-chain',
      severity: 'critical',
      likelihood: 75,
      impact: 90,
      riskScore: 6750,
      status: 'mitigating',
      owner: 'Sarah Johnson',
      supplier: 'Tech Components Ltd',
      identifiedDate: '2024-01-15',
      lastReviewDate: '2024-02-10',
      mitigationPlan: 'Identify and qualify alternate suppliers',
      residualRisk: 4500
    },
    {
      id: 'RISK002',
      title: 'Supplier Financial Instability',
      category: 'financial',
      severity: 'high',
      likelihood: 60,
      impact: 80,
      riskScore: 4800,
      status: 'monitoring',
      owner: 'Michael Chen',
      supplier: 'Metal Works Inc',
      identifiedDate: '2024-02-01',
      lastReviewDate: '2024-02-15',
      mitigationPlan: 'Enhanced financial monitoring, payment terms adjustment',
      residualRisk: 3200
    },
    {
      id: 'RISK003',
      title: 'Geopolitical Disruption - APAC Region',
      category: 'geopolitical',
      severity: 'high',
      likelihood: 40,
      impact: 95,
      riskScore: 3800,
      status: 'assessed',
      owner: 'Emily Davis',
      identifiedDate: '2024-01-20',
      lastReviewDate: '2024-02-05',
      mitigationPlan: 'Diversify geographic sourcing, increase safety stock',
      residualRisk: 2500
    },
    {
      id: 'RISK004',
      title: 'Regulatory Compliance Changes',
      category: 'compliance',
      severity: 'medium',
      likelihood: 70,
      impact: 50,
      riskScore: 3500,
      status: 'mitigating',
      owner: 'Robert Wilson',
      identifiedDate: '2024-01-10',
      lastReviewDate: '2024-02-12',
      mitigationPlan: 'Compliance assessment, supplier certification updates',
      residualRisk: 2000
    },
    {
      id: 'RISK005',
      title: 'Capacity Constraints - Peak Season',
      category: 'operational',
      severity: 'medium',
      likelihood: 65,
      impact: 60,
      riskScore: 3900,
      status: 'monitoring',
      owner: 'Lisa Anderson',
      supplier: 'Express Logistics Ltd',
      identifiedDate: '2024-02-05',
      lastReviewDate: '2024-02-14',
      mitigationPlan: 'Capacity planning, backup suppliers identified',
      residualRisk: 2300
    }
  ];

  const riskTrends = [
    { month: 'Jan', critical: 2, high: 5, medium: 8, low: 3 },
    { month: 'Feb', critical: 1, high: 6, medium: 7, low: 4 },
    { month: 'Mar', critical: 1, high: 5, medium: 9, low: 5 },
    { month: 'Apr', critical: 2, high: 4, medium: 8, low: 6 },
    { month: 'May', critical: 1, high: 5, medium: 7, low: 7 },
    { month: 'Jun', critical: 1, high: 4, medium: 8, low: 8 }
  ];

  const categoryDistribution = [
    { name: 'Supply Chain', value: 35, color: '#3B82F6' },
    { name: 'Financial', value: 25, color: '#EF4444' },
    { name: 'Compliance', value: 15, color: '#F59E0B' },
    { name: 'Operational', value: 15, color: '#10B981' },
    { name: 'Strategic', value: 7, color: '#8B5CF6' },
    { name: 'Geopolitical', value: 3, color: '#EC4899' }
  ];

  const riskMatrix = [
    { x: 75, y: 90, z: 6750, name: 'Single Source Dependency', severity: 'critical' },
    { x: 60, y: 80, z: 4800, name: 'Financial Instability', severity: 'high' },
    { x: 40, y: 95, z: 3800, name: 'Geopolitical', severity: 'high' },
    { x: 70, y: 50, z: 3500, name: 'Compliance', severity: 'medium' },
    { x: 65, y: 60, z: 3900, name: 'Capacity', severity: 'medium' },
    { x: 30, y: 40, z: 1200, name: 'Quality Variance', severity: 'low' }
  ];

  const mitigationProgress = [
    { name: 'RISK001', completion: 65, onTrack: true },
    { name: 'RISK002', completion: 80, onTrack: true },
    { name: 'RISK003', completion: 45, onTrack: false },
    { name: 'RISK004', completion: 90, onTrack: true },
    { name: 'RISK005', completion: 70, onTrack: true }
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899'];

  // Handler 1: Identify Risks - Risk identification wizard
  const handleIdentifyRisks = () => {
    alert(`🔍 Risk Identification Wizard

RISK IDENTIFICATION PROCESS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: RISK DISCOVERY METHODS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Select identification approach:

☑️ Supplier Assessment Review
   • Financial health analysis
   • Performance trend analysis
   • Dependency mapping
   • Geographic concentration

☑️ Supply Chain Mapping
   • Single point of failure identification
   • Critical path analysis
   • Tier 2/3 supplier visibility
   • Material availability assessment

☑️ Market Intelligence
   • Industry trend analysis
   • Competitive landscape
   • Technology disruption
   • Regulatory changes

☑️ Historical Data Analysis
   • Past incidents and issues
   • Disruption patterns
   • Seasonal variations
   • Quality trends

☑️ Stakeholder Interviews
   • Category managers input
   • Operations team feedback
   • Supplier discussions
   • Quality team insights

STEP 2: RISK CATEGORIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supply Chain Risks:
✓ Single source dependency
✓ Geographic concentration
✓ Capacity constraints
✓ Lead time variability
✓ Transportation disruptions
✓ Inventory availability

Financial Risks:
✓ Supplier financial instability
✓ Currency fluctuations
✓ Price volatility
✓ Payment term issues
✓ Credit risk
✓ Cost inflation

Compliance Risks:
✓ Regulatory changes
✓ Certification lapses
✓ Environmental standards
✓ Labor practices
✓ Data privacy requirements
✓ Trade restrictions

Operational Risks:
✓ Quality issues
✓ Delivery failures
✓ IT system failures
✓ Communication breakdowns
✓ Process inefficiencies
✓ Resource constraints

Strategic Risks:
✓ Technology obsolescence
✓ Market changes
✓ Competitive threats
✓ Innovation lag
✓ Partnership failures
✓ Strategic misalignment

Geopolitical Risks:
✓ Political instability
✓ Trade wars
✓ Sanctions
✓ Natural disasters
✓ Pandemics
✓ Security threats

STEP 3: NEW RISK IDENTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risk Title:
> Semiconductor Shortage - Extended Lead Times

Risk Category: Supply Chain

Risk Description:
> Global semiconductor shortage causing extended lead times
> from 12 weeks to 26+ weeks. Affecting production planning
> for Q2-Q3 2024. Multiple suppliers impacted across APAC
> and EMEA regions.

Affected Suppliers:
• Tech Components Ltd (Critical)
• Global Electronics Corp (High)
• Component Supply Inc (Medium)

Affected Products/Categories:
• Electronic assemblies
• Control systems
• Sensor modules

Business Impact:
• Production delays: 15-20%
• Revenue at risk: $2.5M
• Customer satisfaction impact
• Market share risk

Trigger Events:
• Supplier notification received
• Industry reports confirm shortage
• Customer inquiries increasing
• Inventory analysis shows gap

STEP 4: INITIAL ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Likelihood (1-100): 85
• Historical data: 90
• Market intelligence: 85
• Supplier feedback: 80
• Expert judgment: 85
→ Average Likelihood: 85%

Impact (1-100): 75
• Financial impact: 80 ($2.5M at risk)
• Operational impact: 75 (production delays)
• Reputational impact: 70
• Strategic impact: 75
→ Average Impact: 75%

Risk Score Calculation:
Likelihood (85) × Impact (75) = 6,375
Severity Level: CRITICAL

Urgency Assessment:
• Time to impact: 4-6 weeks
• Mitigation complexity: High
• Resource requirements: Significant
→ Urgency: HIGH - Immediate action required

STEP 5: RISK ASSIGNMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risk Owner: Sarah Johnson (Category Manager)
Support Team:
• Michael Chen (Procurement Director) - Escalation
• Emily Davis (Operations Manager) - Impact assessment
• Robert Wilson (Strategic Sourcing) - Alternative suppliers

Review Frequency: Weekly
Escalation Threshold: Risk score > 7,000

STEP 6: IMMEDIATE ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Priority Actions (Next 48 hours):
1. ✓ Contact all affected suppliers for latest updates
2. ✓ Conduct inventory analysis - identify shortfalls
3. ✓ Alert production planning team
4. ✓ Schedule emergency stakeholder meeting
5. ✓ Begin alternate supplier search

Documentation Required:
✓ Risk assessment form completed
✓ Supplier communications logged
✓ Impact analysis documented
✓ Stakeholder notifications sent

AUTOMATED WORKFLOWS TRIGGERED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Risk added to central register
✅ Risk owner notified
✅ Support team members assigned
✅ Initial assessment scheduled (within 5 days)
✅ Dashboard updated with new risk
✅ Weekly review calendar entry created
✅ Executive summary report generated

RISK IDENTIFICATION METRICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Risks identified this month: 8
• Critical risks: 1 (new)
• High risks: 3
• Average identification to assessment: 2.5 days
• Identification sources:
  - Supplier notifications: 35%
  - Market intelligence: 25%
  - Internal assessment: 20%
  - Historical analysis: 15%
  - Stakeholder input: 5%

✅ Risk successfully identified and registered!
📊 Risk ID: RISK006 assigned
🔔 Notifications sent to all stakeholders
📅 Assessment meeting scheduled: ${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
⏱️  Time to action: 2 hours 15 minutes

Next Step: Proceed to detailed risk assessment
Risk Owner: Complete assessment within 5 business days`);
  };

  // Handler 2: Assess Impact - Detailed impact assessment
  const handleAssessImpact = () => {
    alert(`📊 Risk Impact Assessment

COMPREHENSIVE IMPACT ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RISK: Single Source Dependency - Critical Components
Risk ID: RISK001
Assessment Date: ${new Date().toLocaleDateString()}
Assessor: Sarah Johnson, Category Manager

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. FINANCIAL IMPACT ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Direct Financial Impact:
• Revenue at Risk: $5,200,000
  - Q1 2024: $1,800,000
  - Q2 2024: $2,100,000
  - Q3 2024: $1,300,000

• Additional Costs:
  - Expedited shipping: $150,000
  - Alternative sourcing: $280,000
  - Inventory carrying: $95,000
  - Quality issues: $75,000
  → Total Additional Costs: $600,000

• Opportunity Costs:
  - Lost sales: $1,200,000
  - Market share erosion: $800,000
  - Customer penalties: $350,000
  → Total Opportunity Costs: $2,350,000

Total Financial Impact (worst case): $8,150,000
Probability-Adjusted Impact: $6,112,500 (75% likelihood)

Financial Impact Score: 90/100 (Critical)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. OPERATIONAL IMPACT ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Production Impact:
• Production lines affected: 3 of 8
• Capacity reduction: 35%
• Lead time extension: +8 weeks
• Inventory buffer: 4 weeks (insufficient)
• SKUs impacted: 45 products
• Production downtime risk: 15-20 days

Supply Chain Impact:
• Tier 1 suppliers affected: 1 (critical)
• Tier 2 visibility: Limited
• Alternative suppliers available: 2 (not qualified)
• Qualification timeline: 12-16 weeks
• Geographic concentration: 85% APAC
• Logistics complexity: High

Quality Impact:
• Quality risk from alternatives: Medium-High
• Testing requirements: Extensive
• Certification needs: ISO 9001, UL, CE
• Validation timeline: 8-10 weeks

Operational Impact Score: 85/100 (High)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. CUSTOMER & MARKET IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Customer Impact:
• Customers affected: 28 key accounts
• Strategic customers at risk: 8
• Contract penalties exposure: $350,000
• Relationship damage: High
• Satisfaction score impact: -15 points
• Churn risk: 12% for affected customers

Market Position Impact:
• Market share at risk: 3.5%
• Competitive disadvantage: 6-9 months
• Brand reputation impact: Moderate
• New customer acquisition: Delayed
• Industry perception: Negative

Delivery Performance:
• On-time delivery impact: -25%
• Order fulfillment rate: -18%
• Backorder increase: +45%
• Customer complaints: +120%

Customer Impact Score: 75/100 (High)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. STRATEGIC IMPACT ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Strategic Objectives Impact:
• Growth targets: At risk (-15%)
• Innovation roadmap: Delayed (3-6 months)
• Market expansion: Postponed
• Digital transformation: Partially affected
• Sustainability goals: No impact

Competitive Position:
• Competitive advantage erosion: High
• Time to recover: 12-18 months
• Alternative supplier development: Critical
• Technology leadership: At risk

Partnership Impact:
• Supplier relationship: Strained
• Customer partnerships: At risk
• Strategic alliances: Review needed

Strategic Impact Score: 70/100 (High)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. COMPLIANCE & REGULATORY IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regulatory Compliance:
• Contract obligations: At risk
• SLA compliance: 8 contracts affected
• Regulatory reporting: Enhanced monitoring
• Certification requirements: All maintained

Legal & Contractual:
• Contract breach risk: Medium
• Legal liability: $200,000 exposure
• Insurance coverage: Partial
• Dispute resolution: May be required

Environmental & Social:
• Sustainability commitments: On track
• Social responsibility: No impact
• Environmental standards: Maintained

Compliance Impact Score: 45/100 (Medium)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. ORGANIZATIONAL IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Resource Impact:
• Team capacity: 25% redirected
• Overtime requirements: +30%
• Consultant/contractor needs: 2 FTE
• Training requirements: Moderate
• Budget reallocation: $150,000

Employee Impact:
• Morale impact: Moderate
• Stress levels: Elevated
• Turnover risk: Low
• Skills gap: Alternative sourcing

Stakeholder Impact:
• Board reporting: Required
• Investor communication: Recommended
• Internal communication: Essential
• External communication: Selective

Organizational Impact Score: 60/100 (Medium)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERALL IMPACT ASSESSMENT SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Weighted Impact Scores:
• Financial (35%): 90 × 0.35 = 31.5
• Operational (25%): 85 × 0.25 = 21.3
• Customer (20%): 75 × 0.20 = 15.0
• Strategic (10%): 70 × 0.10 = 7.0
• Compliance (5%): 45 × 0.05 = 2.3
• Organizational (5%): 60 × 0.05 = 3.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL IMPACT SCORE: 80.1/100

Impact Rating: CRITICAL
Likelihood: 75%
Risk Score: 6,008 (Critical)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIME HORIZON ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Immediate (0-30 days):
• Financial impact: $1,800,000
• Operational disruption: High
• Mitigation urgency: Critical

Short-term (1-6 months):
• Financial impact: $4,500,000
• Market share risk: 3.5%
• Alternative supplier qualification

Long-term (6-12 months):
• Strategic repositioning required
• Relationship recovery: 12-18 months
• Competitive position rebuild

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENARIO ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best Case (20% probability):
• Supplier resolves issues: 8 weeks
• Limited disruption
• Financial impact: $1,200,000
• Risk score: 2,400

Most Likely (60% probability):
• Supplier partial recovery: 16 weeks
• Moderate disruption
• Financial impact: $6,100,000
• Risk score: 6,000

Worst Case (20% probability):
• Supplier failure: Complete switch
• Severe disruption: 24+ weeks
• Financial impact: $12,500,000
• Risk score: 9,000

Expected Value Impact: $6,380,000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Immediate Actions:
1. ✓ Activate mitigation plan immediately
2. ✓ Engage alternative suppliers urgently
3. ✓ Increase inventory buffer (6-8 weeks)
4. ✓ Customer communication plan
5. ✓ Daily monitoring and reporting

Risk Treatment:
→ MITIGATE (Primary strategy)
→ TRANSFER (Insurance, contracts)
→ AVOID (Long-term diversification)

Investment Required: $850,000
Expected Risk Reduction: 45%
Residual Risk Score: 3,300 (Medium-High)

✅ Impact assessment completed
📊 Risk score updated: 6,008 (Critical)
📧 Assessment report distributed to stakeholders
📅 Mitigation planning meeting scheduled
⚠️  Executive escalation recommended

Assessment approved by: Sarah Johnson
Review date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
  };

  // Handler 3: Create Mitigation Plan
  const handleCreateMitigationPlan = () => {
    alert(`📋 Risk Mitigation Plan Development

MITIGATION STRATEGY FRAMEWORK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RISK: Single Source Dependency - Critical Components
Risk ID: RISK001
Risk Score: 6,750 (Critical)
Target Residual Risk: 3,000 (Medium)
Plan Owner: Sarah Johnson

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MITIGATION APPROACH SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Strategy: MITIGATE (Reduce likelihood & impact)
Secondary Strategy: TRANSFER (Insurance, contracts)
Tertiary Strategy: ACCEPT (Residual risk)

Risk Treatment Objectives:
• Reduce likelihood from 75% to 40%
• Reduce impact from 90 to 60
• Target risk score: 2,400
• Timeline: 6 months

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MITIGATION ACTION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1: IMMEDIATE ACTIONS (Weeks 1-4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 1.1: Alternative Supplier Identification
Owner: Robert Wilson (Strategic Sourcing)
Timeline: Week 1-2
Budget: $25,000

Activities:
✓ Market research for qualified suppliers
✓ RFI to 8 potential suppliers
✓ Technical capability assessment
✓ Site visit planning (top 3)

Success Criteria:
• Minimum 2 viable alternatives identified
• Technical capabilities confirmed
• Preliminary pricing obtained

Status: In Progress (60% complete)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 1.2: Inventory Buffer Increase
Owner: Emily Davis (Operations)
Timeline: Week 1-3
Budget: $180,000

Activities:
✓ Inventory analysis - critical items
✓ Place emergency orders (8-week buffer)
✓ Warehouse capacity planning
✓ Just-in-case inventory strategy

Success Criteria:
• 8 weeks safety stock established
• Inventory turnover impact < 5%
• Storage optimized

Status: Completed ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 1.3: Customer Communication
Owner: Sales Director
Timeline: Week 1
Budget: $5,000

Activities:
✓ Customer notification plan
✓ Key account meetings scheduled
✓ Alternative solutions prepared
✓ Transparent communication

Success Criteria:
• 100% key customers informed
• Contingency plans accepted
• Relationship maintained

Status: Completed ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 1.4: Existing Supplier Engagement
Owner: Sarah Johnson
Timeline: Week 1-4
Budget: $15,000

Activities:
✓ Weekly supplier meetings
✓ Production capacity review
✓ Quality assurance plan
✓ Communication protocol

Success Criteria:
• Real-time visibility established
• Early warning system active
• Performance commitments documented

Status: In Progress (75% complete)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: SHORT-TERM ACTIONS (Weeks 5-16)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 2.1: Alternative Supplier Qualification
Owner: Quality Assurance Manager
Timeline: Week 5-16
Budget: $120,000

Activities:
• Supplier audits (2 suppliers)
• Sample testing and validation
• Process capability studies
• Quality agreement finalization
• Small production runs
• Full qualification approval

Success Criteria:
• 2 suppliers fully qualified
• Quality parity achieved
• Production capability confirmed
• Pricing within 5% of current

Target Completion: Week 16

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 2.2: Dual Sourcing Implementation
Owner: Sarah Johnson
Timeline: Week 12-16
Budget: $80,000

Activities:
• Sourcing strategy development
• Volume allocation (60/40 split)
• Contract negotiations
• Integration planning
• Pilot production runs

Success Criteria:
• 2 active suppliers operational
• No quality issues
• Cost increase < 3%
• Supply reliability improved

Target Completion: Week 16

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 2.3: Supply Chain Visibility Enhancement
Owner: IT/Supply Chain Manager
Timeline: Week 8-14
Budget: $95,000

Activities:
• Supplier portal implementation
• Real-time tracking integration
• Automated alerts setup
• Dashboard development
• Tier 2 supplier mapping

Success Criteria:
• Real-time inventory visibility
• Lead time tracking automated
• Early warning system active
• 3-tier supply chain mapped

Target Completion: Week 14

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3: LONG-TERM ACTIONS (Months 4-12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 3.1: Strategic Sourcing Redesign
Owner: Procurement Director
Timeline: Month 4-8
Budget: $150,000

Activities:
• Category strategy review
• Make vs buy analysis
• Geographic diversification
• Supplier development program
• Long-term agreements

Success Criteria:
• Single source risks eliminated
• Geographic diversity >3 regions
• Tier 1 suppliers: minimum 3
• Contract terms optimized

Target Completion: Month 8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 3.2: Risk Transfer Mechanisms
Owner: Risk Manager
Timeline: Month 5-6
Budget: $45,000

Activities:
• Supply chain insurance review
• Contractual risk transfer
• Performance guarantees
• Business continuity insurance

Success Criteria:
• 70% financial risk transferred
• Insurance coverage adequate
• Contract protections in place

Target Completion: Month 6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action 3.3: Continuous Monitoring System
Owner: Risk Management Team
Timeline: Month 6-12
Budget: $75,000

Activities:
• Risk monitoring framework
• KPI dashboard development
• Quarterly risk reviews
• Supplier performance tracking
• Automated reporting

Success Criteria:
• Real-time risk visibility
• Proactive alerts working
• Quarterly reviews completed
• Executive reporting automated

Target Completion: Month 12

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESOURCE REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Budget Summary:
• Phase 1 (Immediate): $225,000
• Phase 2 (Short-term): $295,000
• Phase 3 (Long-term): $270,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Budget: $790,000

Personnel Resources:
• Sarah Johnson (Plan Owner): 40% time
• Robert Wilson (Sourcing): 60% time
• Emily Davis (Operations): 30% time
• Quality Team: 2 FTE for 12 weeks
• IT Support: 1 FTE for 8 weeks
• External Consultants: 3 months

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUCCESS METRICS & MONITORING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Key Performance Indicators:
1. Supplier Diversity Index
   Baseline: 1 supplier (0%)
   Target: 3+ suppliers (100%)
   Current: 2 suppliers (50%)

2. Geographic Diversification
   Baseline: 1 region (APAC 100%)
   Target: 3 regions (APAC 50%, Americas 30%, EMEA 20%)
   Current: 2 regions (APAC 80%, Americas 20%)

3. Inventory Buffer
   Baseline: 2 weeks
   Target: 6-8 weeks
   Current: 6 weeks ✅

4. Risk Score Reduction
   Baseline: 6,750
   Target: 2,400 (65% reduction)
   Current: 4,500 (33% reduction)

5. Supply Continuity
   Baseline: 75% uptime
   Target: 99% uptime
   Current: 92% uptime

Monitoring Frequency:
• Daily: Inventory levels, supplier performance
• Weekly: Action plan progress, KPI review
• Monthly: Risk score reassessment
• Quarterly: Comprehensive risk review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK REDUCTION PROJECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current State:
• Likelihood: 75%
• Impact: 90
• Risk Score: 6,750

After Phase 1 (Month 1):
• Likelihood: 60% (-15%)
• Impact: 75 (-15)
• Risk Score: 4,500 (-33%)

After Phase 2 (Month 4):
• Likelihood: 45% (-30%)
• Impact: 65 (-25)
• Risk Score: 2,925 (-57%)

After Phase 3 (Month 12):
• Likelihood: 30% (-45%)
• Impact: 55 (-35)
• Risk Score: 1,650 (-76%) ✅

Target Achieved: Month 12
Residual Risk: ACCEPTABLE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTINGENCY PLANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contingency Triggers:
• Supplier failure/bankruptcy
• Quality issues with alternatives
• Budget overrun >20%
• Timeline delays >4 weeks

Contingency Actions:
1. Emergency sourcing (spot market)
2. Customer allocation plan
3. Production rationalization
4. Executive escalation

Contingency Budget: $200,000 (25% reserve)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOVERNANCE & APPROVAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Plan Approval:
✅ Risk Owner: Sarah Johnson
✅ Procurement Director: Michael Chen
✅ CFO: Budget approved
✅ VP Operations: Resources committed
⏳ Executive Committee: Pending (Feb 20)

Review Schedule:
• Weekly: Steering committee
• Monthly: Executive update
• Quarterly: Board reporting

Escalation Path:
Level 1: Sarah Johnson (Risk Owner)
Level 2: Michael Chen (Procurement Director)
Level 3: COO (Executive Sponsor)
Level 4: CEO/Board (Critical issues)

✅ Mitigation plan created successfully!
📊 Plan ID: MP-RISK001
💰 Total Budget: $790,000 (Approved)
📅 Timeline: 12 months
🎯 Target Risk Reduction: 76%
📧 Plan distributed to all stakeholders
⏱️  Implementation start: Immediate

Next Review: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
Plan Status: ACTIVE`);
  };

  // Handler 4: Monitor Risks
  const handleMonitorRisks = () => {
    alert(`📡 Risk Monitoring Dashboard

REAL-TIME RISK MONITORING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Active Risks: 21
├─ Critical: 1 ⚠️
├─ High: 4 ⚠️
├─ Medium: 9
└─ Low: 7 ✅

Risk Trend: ↓ Improving (Last 30 days)
• New risks identified: 3
• Risks closed: 5
• Risks escalated: 1
• Risks de-escalated: 2

Overall Risk Exposure: $18.5M
• Critical risks: $6.1M
• High risks: $9.2M
• Medium risks: $2.8M
• Low risks: $0.4M

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL RISK MONITORING (1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 RISK001: Single Source Dependency
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: MITIGATING
Risk Score: 4,500 (Was 6,750 - Improved 33%)
Owner: Sarah Johnson
Last Update: 2 hours ago

Current Metrics:
• Likelihood: 60% (Target: 40%)
• Impact: 75 (Target: 60)
• Financial Exposure: $4.6M
• Days Open: 32 days

Mitigation Progress:
✅ Phase 1 Actions: 85% complete
⏳ Phase 2 Actions: 45% complete
⏳ Phase 3 Actions: Not started

Recent Activity (Last 7 days):
✓ Alternative supplier site visits completed
✓ Sample testing initiated (2 suppliers)
✓ Inventory buffer increased to 6 weeks
✓ Weekly supplier meetings ongoing
⚠️  Qualification timeline extended (+2 weeks)

Key Performance Indicators:
• Supplier Diversity: 2 of 3 target ⚠️
• Geographic Diversity: 2 regions (Target: 3) ⚠️
• Inventory Coverage: 6 weeks ✅
• Supply Continuity: 92% (Target: 99%) ⚠️

Alerts & Warnings:
⚠️  WARNING: Qualification delayed 2 weeks
⚠️  ATTENTION: Budget utilization at 78%
✅ ON TRACK: Inventory levels adequate

Next Actions (This Week):
1. Complete supplier quality audits
2. Finalize pricing negotiations
3. Update executive stakeholders
4. Review contingency plan

Review Schedule: Daily monitoring
Next Milestone: Week 16 - Dual sourcing active

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HIGH RISK MONITORING (4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟠 RISK002: Supplier Financial Instability
Status: MONITORING
Risk Score: 4,800
Progress: Stable
Recent Change: None

Monitoring Indicators:
• D&B Credit Rating: BB (Stable)
• Payment Terms: Net 45 (extended from 30)
• Financial Health Score: 65/100 ⚠️
• Last Financial Review: 15 days ago

Active Controls:
✓ Monthly financial monitoring
✓ Payment terms adjusted
✓ Backup supplier identified
✓ Insurance coverage reviewed

Next Review: ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟠 RISK003: Geopolitical Disruption - APAC
Status: ASSESSED
Risk Score: 3,800
Progress: Plan development
Recent Change: ↑ Increased (Political tensions)

Monitoring Indicators:
• Geopolitical Risk Index: 72 (High) ⚠️
• Trade Restrictions: Monitoring
• Supply Route Status: Normal ✅
• Alternative Routes: 2 identified

Active Controls:
⏳ Geographic diversification in progress
✓ Safety stock increased
✓ Alternative logistics planned
⏳ EMEA/Americas sourcing development

Next Review: Weekly
Escalation: Executive awareness required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟠 RISK004: Regulatory Compliance Changes
Status: MITIGATING
Risk Score: 3,500
Progress: 90% complete
Recent Change: ↓ Improving

Monitoring Indicators:
• Compliance Score: 94% ✅
• Certifications: All current
• Regulatory Changes: 2 pending
• Supplier Compliance: 18 of 20 certified

Active Controls:
✅ Compliance assessments complete
✅ Supplier certifications updated
✅ Training completed
⏳ Final audits in progress

Next Review: Monthly
Target Closure: 2 weeks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟠 RISK005: Capacity Constraints - Peak Season
Status: MONITORING
Risk Score: 3,900
Progress: Prepared
Recent Change: → Stable

Monitoring Indicators:
• Capacity Utilization: 78% ✅
• Peak Season: 6 weeks away
• Backup Capacity: 25% reserved
• Demand Forecast Accuracy: 85%

Active Controls:
✓ Capacity planning complete
✓ Backup suppliers contracted
✓ Overtime pre-approved
✓ Production scheduling optimized

Next Review: Weekly (during peak season)
Confidence Level: High

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEDIUM & LOW RISKS (16)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Medium Risks (9):
• All under active management
• Mitigation plans in place
• No escalation required
• Average risk score: 2,800

Low Risks (7):
• Routine monitoring
• Minimal intervention required
• Average risk score: 1,200
• 3 risks eligible for closure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMERGING RISKS & EARLY WARNINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Early Warning Indicators:
⚠️  Semiconductor market volatility increasing
⚠️  Currency fluctuations (USD/EUR)
⚠️  Energy costs trending upward
✅ Supplier performance stable
✅ Quality metrics within targets

Potential New Risks Identified:
1. Energy cost inflation (Monitoring)
2. Labor shortage - skilled trades (Watching)
3. Cybersecurity threats (Assessment planned)

Proactive Actions:
• Market intelligence reports reviewed weekly
• Supplier early warning system active
• Industry trend analysis ongoing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RISK MONITORING METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Response Time Performance:
• Average time to identify: 2.5 days ✅
• Average time to assess: 4.8 days ✅
• Average time to mitigate: 12.3 days ⚠️
• Target response time: <15 days

Risk Treatment Effectiveness:
• Risks mitigated successfully: 87% ✅
• Residual risk within tolerance: 92% ✅
• Average risk reduction: 58%
• Mitigation plan completion: 78%

Monitoring Coverage:
• Risks with active monitoring: 100% ✅
• Automated alerts configured: 95% ✅
• Real-time dashboards: Operational ✅
• Stakeholder reporting: Current ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTOMATED MONITORING ALERTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Active Alert Rules:
✓ Risk score increase >20%: Email + SMS
✓ Critical risk identified: Immediate escalation
✓ Mitigation deadline approaching: 5-day warning
✓ Supplier performance degradation: Daily report
✓ Budget variance >10%: Finance notification
✓ Timeline delay >1 week: Stakeholder alert

Recent Alerts (Last 24 hours):
• RISK001: Qualification timeline extended
• RISK003: Geopolitical risk index increased
• Daily digest sent: 6:00 AM
• Weekly summary scheduled: Friday 9:00 AM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOVERNANCE & REPORTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risk Review Schedule:
• Daily: Critical risks (automated)
• Weekly: High risks (steering committee)
• Monthly: All risks (management review)
• Quarterly: Portfolio review (executive/board)

Last Reviews Completed:
✓ Daily critical risk scan: Today 6:00 AM
✓ Weekly steering meeting: Yesterday
✓ Monthly management review: Feb 10
✓ Quarterly board report: Jan 25

Upcoming Reviews:
📅 Weekly steering: Tomorrow 2:00 PM
📅 Monthly management: March 5
📅 Quarterly board: April 15

Stakeholder Engagement:
• Risk owners: Daily updates
• Management: Weekly summaries
• Executives: Monthly dashboards
• Board: Quarterly comprehensive reports

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MONITORING SYSTEM STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System Health:
✅ Risk register: Updated (real-time)
✅ Dashboard: Operational (99.8% uptime)
✅ Alert system: Active (24/7 monitoring)
✅ Data integration: Connected (ERP, suppliers)
✅ Reporting engine: Functional
✅ Mobile access: Available

Data Quality:
• Risk data completeness: 98% ✅
• KPI tracking: 100% ✅
• Document attachments: 95% ✅
• Audit trail: Complete ✅

Integration Status:
✅ ERP system: Real-time sync
✅ Supplier portals: Connected
✅ Financial systems: Integrated
✅ Quality management: Linked
✅ Business intelligence: Operational

✅ Risk monitoring systems fully operational
📊 All critical risks under active management
🔔 Automated alerts functioning correctly
📧 Stakeholder notifications current
⏱️  Next system update: 1 hour
🎯 Monitoring effectiveness: 94%

Last updated: ${new Date().toLocaleString()}
Next automated scan: ${new Date(Date.now() + 60 * 60 * 1000).toLocaleTimeString()}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              Procurement Risk Management
            </h1>
            <p className="text-gray-600 mt-2">Identify, assess, and mitigate supply chain risks proactively</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleIdentifyRisks}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Identify Risks
            </button>
            <button
              onClick={handleAssessImpact}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Assess Impact
            </button>
            <button
              onClick={handleCreateMitigationPlan}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Mitigation Plan
            </button>
            <button
              onClick={handleMonitorRisks}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Monitor
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-600 text-sm font-medium">Critical Risks</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">1</div>
            <div className="text-sm text-gray-600">Immediate action</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-600 text-sm font-medium">High Risks</span>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-600">Active monitoring</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Total Risks</span>
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">21</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowDownRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">-3 this month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Risk Exposure</span>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">$18.5M</div>
            <div className="text-sm text-gray-600">Total financial impact</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Mitigation Rate</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">87%</div>
            <div className="text-sm text-gray-600">Successfully mitigated</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
          {['overview', 'risks', 'matrix', 'mitigation', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Risk Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Trends by Severity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={riskTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      <Legend />
                      <Area type="monotone" dataKey="low" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Low" />
                      <Area type="monotone" dataKey="medium" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Medium" />
                      <Area type="monotone" dataKey="high" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="High" />
                      <Area type="monotone" dataKey="critical" stackId="1" stroke="#DC2626" fill="#DC2626" fillOpacity={0.8} name="Critical" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Matrix Scatter */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Impact Matrix</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" dataKey="x" name="Likelihood" unit="%" domain={[0, 100]} stroke="#6B7280" />
                    <YAxis type="number" dataKey="y" name="Impact" domain={[0, 100]} stroke="#6B7280" />
                    <ZAxis type="number" dataKey="z" range={[100, 1000]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Risks" data={riskMatrix} fill="#3B82F6">
                      {riskMatrix.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.severity === 'critical' ? '#DC2626' :
                            entry.severity === 'high' ? '#EF4444' :
                            entry.severity === 'medium' ? '#F59E0B' : '#10B981'
                          }
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Mitigation Progress */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Mitigation Plan Progress</h3>
                </div>
                <div className="p-4">
                  {mitigationProgress.map((item, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.completion}%</span>
                          {item.onTrack ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.onTrack ? 'bg-green-500' : 'bg-orange-500'}`}
                          style={{ width: `${item.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

{activeTab === 'risks' && (
            <div className="space-y-4">
              {/* Risk Cards */}
              <div className="grid grid-cols-1 gap-4">
                {risks.map((risk) => (
                  <div
                    key={risk.id}
                    className={`border-l-4 bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition ${
                      risk.severity === 'critical' ? 'border-red-600' :
                      risk.severity === 'high' ? 'border-orange-500' :
                      risk.severity === 'medium' ? 'border-yellow-500' :
                      'border-green-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{risk.title}</h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            risk.severity === 'critical' ? 'bg-red-100 text-red-700' :
                            risk.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                            risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {risk.severity.toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            risk.status === 'mitigating' ? 'bg-blue-100 text-blue-700' :
                            risk.status === 'monitoring' ? 'bg-purple-100 text-purple-700' :
                            risk.status === 'assessed' ? 'bg-gray-100 text-gray-700' :
                            risk.status === 'closed' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {risk.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {risk.category}
                          </span>
                          {risk.supplier && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {risk.supplier}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {risk.owner}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{risk.riskScore}</div>
                        <div className="text-xs text-gray-500">Risk Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Likelihood</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${risk.likelihood}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{risk.likelihood}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Impact</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${risk.impact}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{risk.impact}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Residual Risk</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(risk.residualRisk / risk.riskScore) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{risk.residualRisk}</span>
                        </div>
                      </div>
                    </div>

                    {risk.mitigationPlan && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-1">Mitigation Plan:</div>
                        <div className="text-sm text-gray-600">{risk.mitigationPlan}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Identified: {risk.identifiedDate}</span>
                        <span>Last Review: {risk.lastReviewDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1">
                          <Edit className="w-4 h-4" />
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
