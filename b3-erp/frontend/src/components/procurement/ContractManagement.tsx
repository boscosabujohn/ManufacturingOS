'use client'

import React, { useState } from 'react'
import {
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Shield,
  Users,
  Building2,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Bell,
  Timer,
  Award,
  Briefcase,
  Tag,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Paperclip,
  MessageSquare,
  Settings,
  MoreVertical,
  AlertCircle,
  CheckSquare,
  XSquare,
  Copy,
  Archive,
  Trash2,
  Star,
  GitBranch,
  Key,
  Lock,
  Unlock,
  FileEdit
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Scatter
} from 'recharts'

interface Contract {
  id: string
  title: string
  supplier: string
  type: 'master' | 'purchase' | 'service' | 'nda' | 'framework'
  status: 'draft' | 'negotiation' | 'active' | 'expiring' | 'expired' | 'terminated'
  value: number
  startDate: string
  endDate: string
  renewalDate?: string
  owner: string
  department: string
  compliance: number
  risk: 'low' | 'medium' | 'high'
  autoRenew: boolean
  notifications: number
}

interface ContractMilestone {
  id: string
  contractId: string
  title: string
  dueDate: string
  status: 'pending' | 'completed' | 'overdue'
  value?: number
  responsible: string
}

export default function ContractManagement() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showRenewalAlert, setShowRenewalAlert] = useState(true)
  const [showRealTimeMonitoring, setShowRealTimeMonitoring] = useState(true)
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Handler functions
  const handleCreateContract = () => {
    console.log('Creating new contract...');
    alert('Create New Contract\n\nCONTRACT TYPE SELECTION:\n\n📄 Master Service Agreement (MSA):\n   - Long-term relationship framework\n   - Governs multiple transactions\n   - Typical duration: 2-5 years\n   - Use for: Strategic suppliers\n\n🛒 Purchase Agreement:\n   - Specific goods purchase\n   - Fixed quantity and price\n   - Typical duration: 6-24 months\n   - Use for: Material suppliers\n\n⚙️ Service Contract:\n   - Ongoing services delivery\n   - Performance-based terms\n   - Typical duration: 1-3 years\n   - Use for: Service providers\n\n🤝 Framework Agreement:\n   - Call-off contract structure\n   - Multiple orders over time\n   - Typical duration: 1-4 years\n   - Use for: Recurring needs\n\n🔒 Non-Disclosure Agreement (NDA):\n   - Confidentiality protection\n   - Bilateral or unilateral\n   - Typical duration: 2-5 years\n   - Use for: Information sharing\n\nCONTRACT CREATION WIZARD:\n\n1. BASIC INFORMATION:\n   - Contract title and number\n   - Contract type selection\n   - Supplier/vendor details\n   - Department and owner\n   - Priority level\n\n2. COMMERCIAL TERMS:\n   - Total contract value\n   - Payment terms (Net 30/60/90)\n   - Currency and exchange rate\n   - Price adjustment clauses\n   - Volume commitments\n\n3. TIMELINE:\n   - Start date\n   - End date (duration)\n   - Renewal date (if applicable)\n   - Key milestone dates\n   - Notice periods\n\n4. SCOPE & SPECIFICATIONS:\n   - Deliverables description\n   - Performance standards\n   - Quality requirements\n   - Service level agreements (SLAs)\n   - Technical specifications\n\n5. LEGAL TERMS:\n   - Liability limits\n   - Indemnification clauses\n   - Intellectual property rights\n   - Termination conditions\n   - Dispute resolution\n   - Governing law\n\n6. COMPLIANCE & RISK:\n   - Compliance requirements\n   - Insurance requirements\n   - Security/confidentiality\n   - Audit rights\n   - Risk classification\n\n7. RENEWAL OPTIONS:\n   - Auto-renewal settings\n   - Renewal terms (same/renegotiate)\n   - Notification periods (60/90/120 days)\n   - Price escalation rules\n\n8. APPROVALS:\n   - Contract review workflow\n   - Legal review (>$500K)\n   - Finance approval (budget)\n   - Executive approval (>$1M)\n   - Signature authority\n\n9. ATTACHMENTS:\n   - Contract document (PDF)\n   - Appendices and schedules\n   - Technical specifications\n   - Supplier certifications\n   - Previous agreements\n\nREQUIRED APPROVALS:\n- Legal review: All contracts\n- Procurement director: >$100K\n- CFO: >$500K\n- CEO: >$1M\n\nNext: Select contract type to begin');
  };

  const handleEditContract = (contract: Contract) => {
    console.log('Editing contract:', contract.id);

    if (contract.status === 'active') {
      alert(`Edit Active Contract: ${contract.id}\n\n⚠️ ACTIVE CONTRACT - AMENDMENT REQUIRED\n\nContract: ${contract.title}\nSupplier: ${contract.supplier}\nValue: $${(contract.value / 1000).toFixed(0)}K\n\nEDITABLE ACTIONS:\n\n1. CREATE AMENDMENT:\n   - Formal contract modification\n   - Requires both parties\' consent\n   - Legal review required\n   - All changes tracked\n\n2. UPDATE ADMINISTRATIVE DATA:\n   ✓ Owner/contact person\n   ✓ Department assignment\n   ✓ Internal reference notes\n   ✓ Notification settings\n   ✗ Cannot change terms\n\nAMENDMENT PROCESS:\n\nWhen to use amendments:\n- Change in scope or deliverables\n- Price adjustments\n- Timeline extensions\n- Additional services\n- Volume changes\n- Payment term modifications\n\nAmendment workflow:\n1. Draft amendment document\n2. Internal approval (same as original)\n3. Supplier negotiation\n4. Legal review\n5. Mutual signature\n6. Effective date\n\nADMIN UPDATES (No Amendment):\n- Owner reassignment\n- Tag/category changes\n- Alert preferences\n- Document uploads\n- Comments/notes\n\n⚠️ IMPORTANT:\nChanging contract terms requires formal amendment.\nChanges become part of permanent contract record.\n\nProceed with:\n1. Create Amendment?\n2. Update Admin Data?');
      return;
    }

    if (contract.status === 'expired' || contract.status === 'terminated') {
      alert(`Cannot Edit ${contract.status.toUpperCase()} Contract\n\nContract ${contract.id} is ${contract.status}.\n\nThis contract cannot be edited.\n\nOptions:\n- View historical record\n- Create new contract (reference old)\n- Renew if recently expired`);
      return;
    }

    alert(`Edit Contract: ${contract.id}\n\n${contract.status === 'draft' || contract.status === 'negotiation' ? '✓ FULL EDITING AVAILABLE' : '⚠️ LIMITED EDITING'}\n\nContract: ${contract.title}\nSupplier: ${contract.supplier}\nStatus: ${contract.status.toUpperCase()}\n\nEDITABLE FIELDS:\n\nBASIC INFORMATION:\n- Contract title ✓\n- Supplier ${contract.status === 'draft' ? '✓' : '✗'}\n- Type ${contract.status === 'draft' ? '✓' : '✗'}\n- Owner/Department ✓\n\nCOMMERCIAL TERMS:\n- Contract value ${contract.status === 'draft' ? '✓' : 'Amendment'}\n- Payment terms ${contract.status === 'draft' ? '✓' : 'Amendment'}\n- Pricing ${contract.status === 'draft' ? '✓' : 'Amendment'}\n\nTIMELINE:\n- Start date ${contract.status === 'draft' ? '✓' : '✗'}\n- End date ${contract.status === 'draft' ? '✓' : 'Amendment'}\n- Renewal options ✓\n- Milestones ✓\n\nSCOPE & SPECIFICATIONS:\n- Deliverables ${contract.status === 'draft' ? '✓' : 'Amendment'}\n- SLAs ${contract.status === 'draft' ? '✓' : 'Amendment'}\n- Quality standards ${contract.status === 'draft' ? '✓' : 'Amendment'}\n\nLEGAL TERMS:\n- Clauses ${contract.status === 'draft' ? '✓' : 'Legal review'}\n- Liability limits ${contract.status === 'draft' ? '✓' : 'Legal review'}\n- Termination terms ${contract.status === 'draft' ? '✓' : 'Legal review'}\n\nDOCUMENTS:\n- Attach documents ✓\n- Update versions ✓\n- Add appendices ✓\n\n${contract.status === 'negotiation' ? '\n⚠️ CONTRACT IN NEGOTIATION:\n- Track all changes\n- Document discussions\n- Version control maintained\n- All parties notified of updates' : ''}\n\nProceed with editing?');
  };

  const handleRenewContract = (contract: Contract) => {
    console.log('Renewing contract:', contract.id);

    const daysToExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    alert(`Renew Contract: ${contract.id}\n\n${contract.title}\nSupplier: ${contract.supplier}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCURRENT CONTRACT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nStatus: ${contract.status.toUpperCase()}\nValue: $${(contract.value / 1000).toFixed(0)}K\nStart: ${contract.startDate}\nEnd: ${contract.endDate}\nDays to Expiry: ${daysToExpiry}\n\n${daysToExpiry < 90 ? '⚠️ RENEWAL DEADLINE APPROACHING' : daysToExpiry < 0 ? '❌ CONTRACT EXPIRED' : '✓ Sufficient time for renewal'}\n\nAuto-Renewal: ${contract.autoRenew ? 'YES (will auto-renew unless cancelled)' : 'NO (requires manual renewal)'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRENEWAL OPTIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. RENEW AS-IS:\n   - Same terms and conditions\n   - Same pricing\n   - Same scope\n   - Quick process (5-7 days)\n   - Minimal approvals needed\n   \n   Use when:\n   ✓ Satisfied with current terms\n   ✓ Pricing still competitive\n   ✓ Supplier performing well\n   ✓ Market conditions stable\n\n2. RENEW WITH RENEGOTIATION:\n   - Review all terms\n   - Negotiate pricing (current + escalation)\n   - Update scope if needed\n   - Longer process (30-60 days)\n   - Full approval cycle\n   \n   Use when:\n   ⚠ Price increase proposed\n   ⚠ Market rates changed\n   ⚠ Scope needs adjustment\n   ⚠ Performance issues\n\n3. COMPETITIVE RE-SOURCING:\n   - Go to market with RFQ/RFP\n   - Evaluate alternatives\n   - May keep current supplier\n   - Longest process (60-90 days)\n   - Risk of supplier change\n   \n   Use when:\n   ⚠ Significant price increase\n   ⚠ Poor supplier performance\n   ⚠ New requirements\n   ⚠ Market has better options\n\n4. DO NOT RENEW:\n   - Let contract expire\n   - Wind down services\n   - Transfer to new supplier\n   - Close out process\n   \n   Use when:\n   ✗ Requirement no longer exists\n   ✗ Insourcing planned\n   ✗ Budget constraints\n   ✗ Supplier issues\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRENEWAL WORKFLOW (Option 1 or 2)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. INITIATE RENEWAL (Day -90):\n   - Review current performance\n   - Gather stakeholder feedback\n   - Analyze spend data\n   - Check market rates\n\n2. DECISION & STRATEGY (Day -75):\n   - Renew as-is or renegotiate\n   - Define negotiation goals\n   - Identify BATNA\n   - Approval for approach\n\n3. SUPPLIER ENGAGEMENT (Day -60):\n   - Formal renewal notice\n   - Request pricing (if renegotiating)\n   - Schedule meetings\n   - Exchange proposals\n\n4. NEGOTIATION (Day -45 to -30):\n   - Discuss terms\n   - Price negotiations\n   - Scope adjustments\n   - Legal terms review\n\n5. APPROVAL (Day -25 to -15):\n   - Internal review\n   - Legal approval\n   - Finance sign-off\n   - Executive approval (if needed)\n\n6. EXECUTION (Day -10 to 0):\n   - Final contract signature\n   - System updates\n   - Stakeholder notification\n   - Transition planning\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRECOMMENDATION FOR ${contract.title}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${contract.compliance >= 90 && contract.risk === 'low' ? '✓ RENEW AS-IS RECOMMENDED\n- Strong performance\n- Low risk\n- Good compliance\n- Current pricing acceptable' : contract.compliance >= 80 ? '⚠️ RENEW WITH RENEGOTIATION\n- Good but not excellent performance\n- Opportunity for improvements\n- Review pricing and terms' : '⚠️ COMPETITIVE RE-SOURCING RECOMMENDED\n- Performance concerns\n- Compliance issues\n- Better alternatives may exist'}\n\nNext: Select renewal option?');
  };

  const handleAmendContract = (contract: Contract) => {
    console.log('Amending contract:', contract.id);

    if (contract.status !== 'active') {
      alert(`Cannot Amend ${contract.status.toUpperCase()} Contract\n\nAmendments can only be created for ACTIVE contracts.\n\nCurrent status: ${contract.status}\n\nOptions:\n- Wait for contract activation\n- Edit draft contract directly\n- Contact contract owner`);
      return;
    }

    alert(`Create Contract Amendment: ${contract.id}\n\n${contract.title}\nSupplier: ${contract.supplier}\nCurrent Value: $${(contract.value / 1000).toFixed(0)}K\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAMENDMENT PURPOSE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCommon Amendment Types:\n\n📊 SCOPE CHANGES:\n□ Additional deliverables/services\n□ Reduced scope\n□ Change in specifications\n□ New locations/sites\n\n💰 FINANCIAL CHANGES:\n□ Price adjustments\n□ Volume discounts\n□ Payment term changes\n□ Currency changes\n\n📅 TIMELINE CHANGES:\n□ Extension of contract period\n□ Accelerated delivery\n□ Milestone date changes\n□ Early termination\n\n📋 ADMINISTRATIVE CHANGES:\n□ Change of key personnel\n□ Updated contact information\n□ Reporting requirements\n□ Document updates\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAMENDMENT WORKFLOW\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. DRAFT AMENDMENT (Day 1-3):\n   - Document proposed changes\n   - Specify effective date\n   - Update contract value (if applicable)\n   - Attach supporting documents\n\n2. INTERNAL REVIEW (Day 4-7):\n   - Department head approval\n   - Finance review (if value changes)\n   - Legal review (mandatory)\n   - Procurement approval\n\n3. SUPPLIER NEGOTIATION (Day 8-15):\n   - Present amendment to supplier\n   - Negotiate terms if needed\n   - Reach mutual agreement\n   - Document discussions\n\n4. APPROVAL & SIGNATURE (Day 16-21):\n   - Final internal approvals:\n     ${contract.value > 1000000 ? '• CEO approval required' : contract.value > 500000 ? '• CFO approval required' : '• Procurement Director'}\n   - Prepare final amendment document\n   - Execute signatures\n   - Distribute executed copies\n\n5. IMPLEMENTATION (Day 22+):\n   - Update contract management system\n   - Notify all stakeholders\n   - Update PO/invoicing systems\n   - Communicate to operations\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAMENDMENT REQUIREMENTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✓ MANDATORY:\n- Business justification\n- Impact analysis (cost, schedule, risk)\n- Supplier agreement letter/email\n- Legal review approval\n- Authorized signatures\n- Amendment number (sequential)\n\n📄 DOCUMENTS NEEDED:\n- Amendment cover sheet\n- Redline comparison (old vs new)\n- Clean amended sections\n- Supporting documentation\n- Approval chain\n\n⚠️ IMPORTANT NOTES:\n- All amendments part of contract\n- Cannot override original terms (unless specified)\n- Cumulative effect tracked\n- Material changes may require re-approval\n- Audit trail maintained\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINANCIAL IMPACT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCurrent Contract Value: $${(contract.value / 1000).toFixed(0)}K\n\nIf increasing scope/value:\n□ Budget availability confirmed?\n□ PO amendment required?\n□ Finance approval obtained?\n□ Value threshold approvals?\n\nProceed with amendment creation?');
  };

  const handleViewTerms = (contract: Contract) => {
    console.log('Viewing contract terms:', contract.id);

    alert(`Contract Terms & Conditions\n\n${contract.title}\nContract ID: ${contract.id}\nSupplier: ${contract.supplier}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nKEY COMMERCIAL TERMS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nContract Value: $${(contract.value / 1000).toFixed(0)}K\nContract Type: ${contract.type.toUpperCase()}\nTerm: ${contract.startDate} to ${contract.endDate}\nDuration: ${Math.ceil((new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365 * 100)) / 100} years\n\nPayment Terms: Net 30\nCurrency: USD\nPrice Adjustment: Annual CPI-based\nVolume Commitment: ${contract.type === 'purchase' ? 'Yes' : 'No'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRENEWAL & TERMINATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nRenewal Options:\n- Auto-Renewal: ${contract.autoRenew ? 'YES' : 'NO'}\n- Renewal Term: ${contract.autoRenew ? '1 year' : 'N/A'}\n- Renewal Notice: ${contract.renewalDate ? '90 days' : 'N/A'}\n- Price Escalation: CPI + 0.5%\n\nTermination Rights:\n- For Convenience: 90 days notice\n- For Cause: Immediate (breach)\n- Material Breach: 30 days cure period\n- Termination Fee: ${contract.value > 1000000 ? 'Yes (pro-rata)' : 'No'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPERFORMANCE & QUALITY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${contract.type === 'service' ? 'Service Level Agreements (SLAs):\n- Availability: 99.5% uptime\n- Response Time: 4 hours\n- Resolution Time: 24 hours\n- Penalties: 5% monthly fee per violation\n\nPerformance Reviews:\n- Quarterly business reviews\n- Annual performance assessment\n- Continuous improvement plans\n\nKey Performance Indicators:\n- Quality metrics: 95% target\n- Delivery performance: 98% on-time\n- Customer satisfaction: 4.5/5 stars' : contract.type === 'purchase' ? 'Quality Standards:\n- ISO 9001 certified\n- Defect rate: < 0.5%\n- Inspection: 100% critical items\n- Warranty: 12 months\n\nDelivery Terms:\n- Incoterms: DDP\n- Lead time: 4-6 weeks\n- On-time delivery: 95% target\n- Expedited options: Available (surcharge)' : 'Deliverables:\n- As per Statement of Work\n- Acceptance criteria defined\n- Milestones with payments'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nLIABILITY & INSURANCE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nLiability Limits:\n- General: Equal to contract value\n- IP Infringement: Unlimited\n- Data Breach: $${(contract.value * 2 / 1000).toFixed(0)}K\n- Consequential: Excluded\n\nInsurance Requirements:\n- General Liability: $${Math.max(1000, contract.value / 1000).toFixed(0)}K\n- Professional Liability: $${Math.max(1000, contract.value / 1000).toFixed(0)}K\n- Workers Comp: Statutory\n- Cyber Insurance: $${contract.type === 'service' ? (contract.value / 1000).toFixed(0) : '0'}K\n\nIndemnification:\n- IP Claims: Supplier indemnifies\n- Negligence: Mutual indemnification\n- Third Party Claims: As applicable\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCONFIDENTIALITY & IP\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nConfidential Information:\n- Mutual NDA included\n- 5-year confidentiality period\n- Return of information on termination\n- Permitted disclosures: Legal/regulatory\n\nIntellectual Property:\n- Pre-existing IP: Retained by owner\n- Developed IP: ${contract.type === 'service' ? 'Customer owns' : 'Supplier owns (licensed)'}\n- License: ${contract.type !== 'nda' ? 'Perpetual, non-exclusive' : 'N/A'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDISPUTE RESOLUTION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nEscalation Process:\n1. Project level (immediate)\n2. Manager level (5 days)\n3. Executive level (10 days)\n4. Formal mediation\n\nGoverning Law: State of Delaware\nVenue: Delaware courts\nArbitration: Optional (before litigation)\nClass Action Waiver: Yes\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOMPLIANCE & AUDIT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nRegulatory Compliance:\n- Industry standards: Applicable\n- Data protection: GDPR/CCPA compliant\n- Export controls: Acknowledged\n- Anti-corruption: Certified\n\nAudit Rights:\n- Annual audit permitted\n- 30 days notice required\n- Cost: Customer bears\n- Remediation: 60 days\n\nDocument Retention: 7 years\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nDOCUMENT HIERARCHY\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. Master Agreement\n2. Amendments (in chronological order)\n3. Statement of Work\n4. Purchase Orders\n5. Technical Specifications\n6. Service Level Agreements\n\nView full contract document?');
  };

  const handleExportContract = () => {
    console.log('Exporting contract data...');
    alert('Export Contract Management Report\n\nEXPORT OPTIONS:\n\n1. CONTRACT REGISTER:\n   - All contracts with details\n   - Status and timeline\n   - Value and compliance\n   - Owner and department\n   - Risk classification\n\n2. FINANCIAL SUMMARY:\n   - Total contract value\n   - Value by status\n   - Value by supplier\n   - Value by department\n   - Upcoming commitments\n\n3. RENEWAL SCHEDULE:\n   - Contracts expiring soon\n   - Renewal decisions needed\n   - Auto-renewal list\n   - Renegotiation queue\n\n4. COMPLIANCE REPORT:\n   - Compliance scores\n   - Risk assessment\n   - Audit findings\n   - Required actions\n\n5. PERFORMANCE ANALYSIS:\n   - Supplier performance\n   - Contract utilization\n   - Savings achieved\n   - Cycle time metrics\n\nFORMAT OPTIONS:\n- Excel workbook (detailed data)\n- PDF report (executive summary)\n- CSV export (data analysis)\n- PowerPoint (presentation)\n\nTIME PERIOD:\n- Active contracts only\n- All contracts (including expired)\n- Date range selection\n- Specific departments\n- Specific suppliers\n\nINCLUDES:\n- Contract summaries\n- Key terms highlight\n- Amendment history\n- Performance data\n- Compliance status\n- Risk indicators\n- Renewal recommendations\n\nExporting comprehensive contract management report...');
  };

  const handleRefresh = () => {
    console.log('Refreshing contract data...');
    alert('Refreshing Contract Management...\n\nUpdating:\n- Contract status changes\n- Compliance scores\n- Renewal dates approaching\n- Milestone completions\n- Performance metrics\n- Risk assessments\n\nSyncing with:\n- Legal contract repository\n- Financial systems (invoices, POs)\n- Supplier portal\n- Approval workflows\n\nEstimated time: 12 seconds');
  };

  const handleSettings = () => {
    console.log('Opening contract settings...');
    alert('Contract Management Settings\n\nGENERAL SETTINGS:\n- Default contract durations\n- Renewal notification periods\n- Auto-renewal preferences\n- Contract numbering format\n\nAPPROVAL WORKFLOWS:\n- Value thresholds for approvals\n- Routing rules by type\n- Signature authority matrix\n- Escalation procedures\n\nRENEWAL MANAGEMENT:\n- Reminder schedule (90/60/30 days)\n- Auto-renewal defaults\n- Renegotiation triggers\n- Performance thresholds\n\nCOMPLIANCE & RISK:\n- Risk assessment criteria\n- Compliance scoring method\n- Audit requirements\n- Insurance verification\n\nNOTIFICATIONS:\n- Renewal alerts\n- Milestone reminders\n- Compliance violations\n- Performance issues\n- Approval requests\n\nTEMPLATE MANAGEMENT:\n- Contract templates library\n- Standard clauses\n- Approval matrices\n- Legal language\n\nINTEGRATIONS:\n- Document management system\n- E-signature platform\n- ERP/Finance systems\n- Legal database\n- Supplier portal');
  };

  const handleViewContract = (contract: Contract) => {
    console.log('Viewing contract details:', contract.id);

    const daysRemaining = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const contractDuration = Math.ceil((new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const percentComplete = Math.min(100, Math.max(0, ((contractDuration - daysRemaining) / contractDuration) * 100));

    alert(`Contract Details\n\n${contract.id}: ${contract.title}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nBASIC INFORMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSupplier: ${contract.supplier}\nType: ${contract.type.toUpperCase()}\nStatus: ${contract.status.toUpperCase()}\nOwner: ${contract.owner}\nDepartment: ${contract.department}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nFINANCIAL\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nTotal Value: $${(contract.value / 1000).toFixed(0)}K\nAnnual Value: $${(contract.value / (contractDuration / 365) / 1000).toFixed(0)}K\nSpend to Date: ~$${((contract.value * percentComplete / 100) / 1000).toFixed(0)}K (${percentComplete.toFixed(0)}%)\nRemaining: ~$${((contract.value * (100 - percentComplete) / 100) / 1000).toFixed(0)}K\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTIMELINE\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nStart Date: ${contract.startDate}\nEnd Date: ${contract.endDate}\nDuration: ${(contractDuration / 365).toFixed(1)} years\n\nDays Remaining: ${daysRemaining}\nProgress: ${percentComplete.toFixed(0)}% complete\n\n${contract.renewalDate ? `Renewal Date: ${contract.renewalDate}\nDays to Renewal: ${Math.ceil((new Date(contract.renewalDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}` : 'No renewal date set'}\n\n${daysRemaining < 90 ? '⚠️ CONTRACT EXPIRING SOON!' : daysRemaining < 0 ? '❌ CONTRACT EXPIRED' : '✓ Active and in good standing'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOMPLIANCE & RISK\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCompliance Score: ${contract.compliance}%\n${contract.compliance >= 90 ? '✓ Excellent compliance' : contract.compliance >= 80 ? '⚠️ Good, minor issues' : '❌ Requires attention'}\n\nRisk Level: ${contract.risk.toUpperCase()}\n${contract.risk === 'low' ? '✓ Low risk - standard monitoring' : contract.risk === 'medium' ? '⚠️ Medium risk - increased oversight' : '❌ High risk - executive attention'}\n\nInsurance: ${contract.value > 500000 ? 'Verified current' : 'N/A'}\nAudit Status: Last audit ${contract.status === 'active' ? '6 months ago' : 'N/A'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRENEWAL SETTINGS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nAuto-Renewal: ${contract.autoRenew ? 'YES - Will auto-renew unless cancelled' : 'NO - Requires manual renewal'}\n${contract.autoRenew ? 'Cancellation Notice: 90 days\nRenewal Terms: Same as current\nPrice Escalation: CPI-based' : 'Renewal Decision: Required before expiry\nNotification Period: 90 days\nRenegotiation: Likely needed'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nNOTIFICATIONS & ALERTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nActive Alerts: ${contract.notifications}\n${contract.notifications > 0 ? `\nRecent notifications:\n- ${contract.renewalDate && daysRemaining < 90 ? 'Renewal decision needed' : ''}\n- ${contract.compliance < 90 ? 'Compliance review required' : ''}\n- ${daysRemaining < 30 ? 'Contract expiring soon' : ''}` : 'No active notifications'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nQUICK ACTIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${contract.status === 'active' ? '• Create Amendment\n• Schedule Review\n• Request Performance Report\n• View Terms & Conditions' : contract.status === 'expiring' ? '• Initiate Renewal\n• Request Pricing\n• Evaluate Alternatives\n• Cancel if not renewing' : contract.status === 'negotiation' ? '• Review Draft\n• Track Changes\n• Request Legal Review\n• Schedule Meeting' : '• View Details\n• Edit Contract'}\n\nDOCUMENTS AVAILABLE:\n- Master agreement (PDF)\n- ${contract.status === 'active' ? 'Amendments (2)' : ''}\n- Statement of work\n- Performance reports\n- Insurance certificates\n\nView full contract repository?`);
  };

  // Mock data
  const contracts: Contract[] = [
    {
      id: 'CTR-2024-001',
      title: 'Master Service Agreement - IT Support',
      supplier: 'TechPro Solutions',
      type: 'master',
      status: 'active',
      value: 2500000,
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      renewalDate: '2025-10-01',
      owner: 'John Matthews',
      department: 'IT',
      compliance: 95,
      risk: 'low',
      autoRenew: true,
      notifications: 2
    },
    {
      id: 'CTR-2024-002',
      title: 'Raw Materials Supply Agreement',
      supplier: 'Global Materials Inc',
      type: 'purchase',
      status: 'expiring',
      value: 5200000,
      startDate: '2022-03-01',
      endDate: '2024-03-31',
      renewalDate: '2024-02-28',
      owner: 'Sarah Chen',
      department: 'Procurement',
      compliance: 88,
      risk: 'medium',
      autoRenew: false,
      notifications: 5
    },
    {
      id: 'CTR-2024-003',
      title: 'Logistics Services Contract',
      supplier: 'FastTrack Logistics',
      type: 'service',
      status: 'negotiation',
      value: 1800000,
      startDate: '2024-04-01',
      endDate: '2026-03-31',
      owner: 'Mike Johnson',
      department: 'Operations',
      compliance: 0,
      risk: 'medium',
      autoRenew: false,
      notifications: 3
    },
    {
      id: 'CTR-2024-004',
      title: 'Software License Agreement',
      supplier: 'Software Corp',
      type: 'purchase',
      status: 'active',
      value: 450000,
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      renewalDate: '2024-04-01',
      owner: 'Lisa Wong',
      department: 'IT',
      compliance: 92,
      risk: 'low',
      autoRenew: true,
      notifications: 1
    }
  ]

  const milestones: ContractMilestone[] = [
    {
      id: 'MS-001',
      contractId: 'CTR-2024-001',
      title: 'Quarterly Performance Review',
      dueDate: '2024-03-31',
      status: 'pending',
      responsible: 'John Matthews'
    },
    {
      id: 'MS-002',
      contractId: 'CTR-2024-002',
      title: 'Price Negotiation Deadline',
      dueDate: '2024-02-28',
      status: 'pending',
      value: 100000,
      responsible: 'Sarah Chen'
    },
    {
      id: 'MS-003',
      contractId: 'CTR-2024-001',
      title: 'Annual Audit',
      dueDate: '2024-06-30',
      status: 'pending',
      responsible: 'Audit Team'
    },
    {
      id: 'MS-004',
      contractId: 'CTR-2024-004',
      title: 'License Renewal Decision',
      dueDate: '2024-04-01',
      status: 'pending',
      responsible: 'Lisa Wong'
    }
  ]

  const contractValueTrend = [
    { month: 'Jan', active: 8500000, new: 450000, expired: 200000 },
    { month: 'Feb', active: 8750000, new: 680000, expired: 150000 },
    { month: 'Mar', active: 9100000, new: 520000, expired: 300000 },
    { month: 'Apr', active: 9300000, new: 750000, expired: 100000 },
    { month: 'May', active: 9600000, new: 380000, expired: 250000 },
    { month: 'Jun', active: 9850000, new: 620000, expired: 180000 }
  ]

  const contractsByType = [
    { type: 'Master Agreement', count: 12, value: 4500000 },
    { type: 'Purchase', count: 28, value: 3200000 },
    { type: 'Service', count: 18, value: 2800000 },
    { type: 'Framework', count: 8, value: 1500000 },
    { type: 'NDA', count: 45, value: 0 }
  ]

  const contractLifecycle = [
    { stage: 'Initiation', days: 5, contracts: 3 },
    { stage: 'Negotiation', days: 15, contracts: 8 },
    { stage: 'Approval', days: 7, contracts: 5 },
    { stage: 'Execution', days: 2, contracts: 2 },
    { stage: 'Active', days: 730, contracts: 68 },
    { stage: 'Renewal', days: 30, contracts: 12 }
  ]

  const complianceMetrics = [
    { metric: 'On-time Renewals', value: 92, target: 95, status: 'warning' },
    { metric: 'Compliance Score', value: 88, target: 90, status: 'warning' },
    { metric: 'Risk Assessment', value: 95, target: 85, status: 'good' },
    { metric: 'Audit Readiness', value: 78, target: 90, status: 'critical' },
    { metric: 'Vendor Performance', value: 86, target: 85, status: 'good' }
  ]

  const upcomingRenewals = contracts
    .filter(c => c.renewalDate && new Date(c.renewalDate) > new Date())
    .sort((a, b) => new Date(a.renewalDate!).getTime() - new Date(b.renewalDate!).getTime())
    .slice(0, 5)

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Contract Management
            </h1>
            <p className="text-gray-600 mt-2">Manage contract lifecycle, compliance, and renewals</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleRefresh} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2" title="Refresh Data">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleSettings} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2" title="Settings">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={handleExportContract} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2" title="Export Report">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button onClick={handleCreateContract} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2" title="Create New Contract">
              <Plus className="w-4 h-4" />
              New Contract
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Active Contracts</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">86</div>
            <div className="text-sm text-gray-600">Total active</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Total Value</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">$12.8M</div>
            <div className="text-sm text-green-600">↑ 8% YoY</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-600 text-sm font-medium">Expiring Soon</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-red-600">Next 30 days</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Compliance</span>
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">88%</div>
            <div className="text-sm text-yellow-600">2% below target</div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-600 text-sm font-medium">Risk Level</span>
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">Medium</div>
            <div className="text-sm text-gray-600">8 high risk</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-600 text-sm font-medium">Savings</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">$1.2M</div>
            <div className="text-sm text-gray-600">Through negotiation</div>
          </div>
        </div>

        {/* Renewal Alert */}
        {showRenewalAlert && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Upcoming Renewals Require Attention</h4>
              <p className="text-sm text-gray-600 mt-1">
                You have 12 contracts expiring in the next 30 days. 5 require immediate action for renewal negotiations.
              </p>
            </div>
            <button
              onClick={() => setShowRenewalAlert(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Real-Time Monitoring Dashboard */}
      {showRealTimeMonitoring && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              Real-Time Contract Monitoring
            </h3>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Auto-refresh
              </label>
              <button
                onClick={() => setShowRealTimeMonitoring(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Active Changes</span>
                <FileEdit className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-xs text-blue-600 mt-1">2 amendments pending</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Renewals This Week</span>
                <RefreshCw className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-xs text-amber-600 mt-1">Decisions needed</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Compliance Alerts</span>
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-xs text-red-600 mt-1">1 critical</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Contract Value Change</span>
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">+$1.2M</div>
              <div className="text-xs text-green-600 mt-1">This month</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Contract Activity</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-600">CTR-2024-003 executed and activated</span>
                <span className="text-gray-400 text-xs ml-auto">10 min ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileEdit className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-gray-600">Amendment #2 submitted for CTR-2024-001</span>
                <span className="text-gray-400 text-xs ml-auto">1 hour ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span className="text-gray-600">Insurance certificate expiring for CTR-2024-002</span>
                <span className="text-gray-400 text-xs ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span className="text-gray-600">Renewal initiated for Software License Agreement</span>
                <span className="text-gray-400 text-xs ml-auto">4 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Insights */}
      {showAIInsights && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border border-purple-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              AI-Powered Contract Intelligence
            </h3>
            <button
              onClick={() => setShowAIInsights(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">Renewal Prediction</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
              <p className="text-xs text-gray-600">Success rate predicted for upcoming renewals based on supplier performance and market conditions</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-semibold text-gray-900">Risk Alert</span>
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-1">3</div>
              <p className="text-xs text-gray-600">Contracts with compliance or performance issues requiring immediate attention before renewal</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-900">Savings Opportunity</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">$380K</div>
              <p className="text-xs text-gray-600">Potential savings through renegotiation and contract consolidation opportunities identified</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Smart Contract Recommendations</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2 bg-amber-50 rounded">
                <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Early Renewal Action:</span>
                  <span className="text-gray-600"> Start CTR-2024-002 renewal process now (120 days out) to secure better pricing before market rates increase</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 bg-blue-50 rounded">
                <GitBranch className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Consolidation Opportunity:</span>
                  <span className="text-gray-600"> Merge 3 IT service contracts into single MSA to reduce management overhead and improve terms</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 bg-red-50 rounded">
                <Shield className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Compliance Update Needed:</span>
                  <span className="text-gray-600"> 5 contracts require updated data protection clauses to meet new regulatory requirements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
          {['overview', 'contracts', 'lifecycle', 'compliance', 'renewals', 'analytics'].map((tab) => (
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
              {/* Contract Value Trend */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Value Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={contractValueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="active" fill="#DBEAFE" stroke="#3B82F6" name="Active Value" />
                    <Bar dataKey="new" fill="#10B981" name="New Contracts" />
                    <Bar dataKey="expired" fill="#EF4444" name="Expired" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Contract Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contracts by Type</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={contractsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {contractsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Lifecycle Stages</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="100%" data={contractLifecycle}>
                      <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="contracts">
                        {contractLifecycle.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RadialBar>
                      <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Upcoming Milestones */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Milestones & Deadlines</h3>
                </div>
                <div className="p-4 space-y-3">
                  {milestones.filter(m => m.status === 'pending').map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          milestone.status === 'completed' ? 'bg-green-100 text-green-600' :
                          milestone.status === 'overdue' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          <CheckSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{milestone.title}</div>
                          <div className="text-sm text-gray-600">Contract: {milestone.contractId} • {milestone.responsible}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{milestone.dueDate}</div>
                        {milestone.value && (
                          <div className="text-sm text-gray-600">${(milestone.value / 1000).toFixed(0)}K impact</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search contracts..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expiring">Expiring Soon</option>
                  <option value="negotiation">In Negotiation</option>
                  <option value="expired">Expired</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>

              {/* Contracts Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Contract ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Value</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Period</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Compliance</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Risk</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-medium text-blue-600">{contract.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{contract.title}</div>
                            <div className="text-sm text-gray-500">{contract.type} • {contract.department}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{contract.supplier}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">${(contract.value / 1000000).toFixed(2)}M</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm text-gray-900">{contract.startDate}</div>
                            <div className="text-sm text-gray-500">to {contract.endDate}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            contract.status === 'active' ? 'bg-green-100 text-green-700' :
                            contract.status === 'expiring' ? 'bg-amber-100 text-amber-700' :
                            contract.status === 'negotiation' ? 'bg-blue-100 text-blue-700' :
                            contract.status === 'expired' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {contract.status === 'active' && <CheckCircle className="w-3 h-3" />}
                            {contract.status === 'expiring' && <Clock className="w-3 h-3" />}
                            {contract.status === 'negotiation' && <RefreshCw className="w-3 h-3" />}
                            {contract.status === 'expired' && <XCircle className="w-3 h-3" />}
                            {contract.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  contract.compliance >= 90 ? 'bg-green-500' :
                                  contract.compliance >= 70 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${contract.compliance}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{contract.compliance}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            contract.risk === 'low' ? 'bg-green-100 text-green-700' :
                            contract.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            <Shield className="w-3 h-3" />
                            {contract.risk}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewContract(contract)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                              title="View Contract Details"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">View</span>
                            </button>

                            {contract.status !== 'expired' && contract.status !== 'terminated' && (
                              <button
                                onClick={() => handleEditContract(contract)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 text-sm transition-colors"
                                title="Edit Contract"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                                <span className="text-blue-700">Edit</span>
                              </button>
                            )}

                            {(contract.status === 'active' || contract.status === 'expiring') && (
                              <button
                                onClick={() => handleRenewContract(contract)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100 text-sm transition-colors"
                                title="Renew Contract"
                              >
                                <RefreshCw className="w-4 h-4 text-green-600" />
                                <span className="text-green-700">Renew</span>
                              </button>
                            )}

                            {contract.status === 'active' && (
                              <button
                                onClick={() => handleAmendContract(contract)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 text-sm transition-colors"
                                title="Create Amendment"
                              >
                                <FileEdit className="w-4 h-4 text-purple-600" />
                                <span className="text-purple-700">Amend</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleViewTerms(contract)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                              title="View Terms & Conditions"
                            >
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">Terms</span>
                            </button>

                            <button
                              className="p-2 hover:bg-gray-100 rounded relative transition-colors"
                              title={`${contract.notifications} notification${contract.notifications !== 1 ? 's' : ''}`}
                            >
                              <Bell className="w-4 h-4 text-gray-600" />
                              {contract.notifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-medium">
                                  {contract.notifications > 9 ? '9+' : contract.notifications}
                                </span>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'lifecycle' && (
            <div className="space-y-6">
              {/* Lifecycle Overview */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                {contractLifecycle.map((stage) => (
                  <div key={stage.stage} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-blue-600 text-sm font-medium mb-1">{stage.stage}</div>
                    <div className="text-2xl font-bold text-gray-900">{stage.contracts}</div>
                    <div className="text-sm text-gray-600">Avg: {stage.days}d</div>
                  </div>
                ))}
              </div>

              {/* Lifecycle Process */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Lifecycle Process</h3>
                <div className="relative">
                  <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-300"></div>
                  <div className="flex justify-between relative">
                    {['Request', 'Draft', 'Review', 'Negotiate', 'Approve', 'Execute', 'Manage', 'Renew/Close'].map((step, index) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 ${
                          index <= 5 ? 'bg-green-500 text-white' :
                          index === 6 ? 'bg-yellow-500 text-white animate-pulse' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {index <= 5 ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : index === 6 ? (
                            <Clock className="w-8 h-8" />
                          ) : (
                            <span className="text-lg font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <div className="text-xs font-medium text-gray-900">{step}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lifecycle Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Average Cycle Times</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Contract Creation</span>
                      <span className="font-medium">5 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Negotiation</span>
                      <span className="font-medium">15 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Approval</span>
                      <span className="font-medium">7 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Cycle</span>
                      <span className="font-medium">29 days</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Bottleneck Analysis</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Legal Review</span>
                        <span className="text-sm font-medium text-red-600">8 pending</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Finance Approval</span>
                        <span className="text-sm font-medium text-yellow-600">5 pending</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Signature</span>
                        <span className="text-sm font-medium text-green-600">2 pending</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Automation Opportunities</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition flex items-center justify-between">
                      <span className="text-sm text-gray-700">Template Generation</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition flex items-center justify-between">
                      <span className="text-sm text-gray-700">Approval Workflows</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition flex items-center justify-between">
                      <span className="text-sm text-gray-700">Renewal Reminders</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition flex items-center justify-between">
                      <span className="text-sm text-gray-700">Compliance Checks</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              {/* Compliance Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {complianceMetrics.map((metric) => (
                  <div key={metric.metric} className={`p-4 rounded-lg border ${
                    metric.status === 'good' ? 'bg-green-50 border-green-200' :
                    metric.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="text-sm font-medium text-gray-700 mb-2">{metric.metric}</div>
                    <div className="flex items-end gap-2">
                      <div className="text-2xl font-bold text-gray-900">{metric.value}%</div>
                      <div className="text-sm text-gray-500 pb-0.5">/ {metric.target}%</div>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.status === 'good' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(metric.value / metric.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance Issues */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Compliance Issues & Actions</h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { issue: 'Missing insurance certificates', contracts: 5, severity: 'high', dueDate: '2024-03-01' },
                    { issue: 'Expired vendor licenses', contracts: 3, severity: 'critical', dueDate: '2024-02-28' },
                    { issue: 'Incomplete audit documentation', contracts: 8, severity: 'medium', dueDate: '2024-03-15' },
                    { issue: 'Unsigned amendments', contracts: 2, severity: 'low', dueDate: '2024-03-30' }
                  ].map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          issue.severity === 'critical' ? 'bg-red-100 text-red-600' :
                          issue.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{issue.issue}</div>
                          <div className="text-sm text-gray-600">Affects {issue.contracts} contracts • Due: {issue.dueDate}</div>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                        Take Action
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Trail */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Audit Activities</h3>
                <div className="space-y-2">
                  {[
                    { action: 'Contract CTR-2024-001 compliance review completed', user: 'John Matthews', time: '2 hours ago' },
                    { action: 'Risk assessment updated for supplier contracts', user: 'Sarah Chen', time: '5 hours ago' },
                    { action: 'Quarterly compliance report generated', user: 'System', time: '1 day ago' },
                    { action: 'Insurance certificate uploaded for CTR-2024-003', user: 'Mike Johnson', time: '2 days ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <Activity className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.user} • {activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'renewals' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Renewal Management</h3>

              {/* Renewal Timeline */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Upcoming Renewals Timeline</h4>
                <div className="space-y-3">
                  {upcomingRenewals.map((contract) => {
                    const daysUntilRenewal = Math.ceil((new Date(contract.renewalDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={contract.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-medium text-gray-500">{contract.id}</span>
                              {contract.autoRenew && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Auto-renew
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900">{contract.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {contract.supplier}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${(contract.value / 1000000).toFixed(2)}M
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Expires: {contract.endDate}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${
                              daysUntilRenewal <= 30 ? 'text-red-600' :
                              daysUntilRenewal <= 60 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {daysUntilRenewal}
                            </div>
                            <div className="text-sm text-gray-500">days left</div>
                            <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
                              Start Renewal
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Renewal Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Renewal Checklist</h4>
                  <div className="space-y-2">
                    {[
                      { task: 'Review contract performance', completed: true },
                      { task: 'Assess market rates', completed: true },
                      { task: 'Negotiate new terms', completed: false },
                      { task: 'Update compliance docs', completed: false },
                      { task: 'Obtain approvals', completed: false },
                      { task: 'Execute new contract', completed: false }
                    ].map((task, index) => (
                      <label key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          className="rounded border-gray-300"
                          readOnly
                        />
                        <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {task.task}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Renewal Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Period</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>30 days before expiry</option>
                        <option>60 days before expiry</option>
                        <option>90 days before expiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Auto-renewal Default</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Disabled</option>
                        <option>Enabled for low-value contracts</option>
                        <option>Enabled for all contracts</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-700">Email notifications</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                        <span className="text-sm text-gray-700">Dashboard alerts</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-gray-300" />
                        <span className="text-sm text-gray-700">SMS notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Contract Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Value by Department</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { dept: 'IT', value: 3500000 },
                      { dept: 'Operations', value: 4200000 },
                      { dept: 'Procurement', value: 2800000 },
                      { dept: 'Finance', value: 1500000 },
                      { dept: 'HR', value: 800000 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="dept" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`} />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">On-time Renewals</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Cost Savings</span>
                        <span className="font-medium">$1.2M</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Supplier Satisfaction</span>
                        <span className="font-medium">4.2/5.0</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '84%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Contract Utilization</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { insight: '15% of contracts are underutilized', action: 'Review and consolidate', impact: 'Save $200K/year' },
                    { insight: '8 contracts expiring without renewal plans', action: 'Initiate renewal process', impact: 'Avoid disruption' },
                    { insight: 'Compliance score below target', action: 'Update documentation', impact: 'Reduce risk' },
                    { insight: 'Opportunity for volume discounts', action: 'Consolidate suppliers', impact: 'Save $150K/year' }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.insight}</div>
                          <div className="text-sm text-gray-600 mt-1">Action: {item.action}</div>
                          <div className="text-sm text-green-600 mt-1">Impact: {item.impact}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}