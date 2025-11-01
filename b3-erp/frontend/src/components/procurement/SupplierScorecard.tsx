'use client'

import React, { useState } from 'react'
import {
  Award,
  TrendingUp,
  TrendingDown,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Activity,
  BarChart3,
  Target,
  Users,
  Package,
  Truck,
  Shield,
  DollarSign,
  FileText,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Download,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Settings,
  Eye,
  Edit,
  MessageSquare,
  PieChart,
  GitCompare,
  RefreshCw,
  Plus,
  Award as Trophy,
  Medal,
  Badge
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'

interface SupplierScore {
  supplierId: string
  supplierName: string
  category: string
  overallScore: number
  qualityScore: number
  deliveryScore: number
  priceScore: number
  serviceScore: number
  innovationScore: number
  sustainabilityScore: number
  trend: 'up' | 'down' | 'stable'
  rank: number
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  lastEvaluation: string
}

interface PerformanceMetric {
  metric: string
  weight: number
  target: number
  actual: number
  score: number
  trend: 'improving' | 'declining' | 'stable'
}

export default function SupplierScorecard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierScore | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('quarter')
  const [comparisonMode, setComparisonMode] = useState(false)

  // Handler functions
  const handleRefresh = () => {
    console.log('Refreshing supplier scorecard data...')
    alert('Refreshing Supplier Scorecard...\n\nUpdating:\n- Supplier performance scores\n- Quality metrics and KPIs\n- Delivery performance data\n- Price competitiveness analysis\n- Service ratings\n- Innovation and sustainability scores\n- Rankings and tier assignments\n\nSyncing with ERP, quality systems, and supplier portals.\nEstimated time: 15 seconds')
  }

  const handleSettings = () => {
    console.log('Opening scorecard settings...')
    alert('Supplier Scorecard Settings\n\nConfigure:\n\nSCORING WEIGHTS:\n- Quality metrics weight (default: 25%)\n- On-time delivery weight (default: 20%)\n- Price competitiveness weight (default: 20%)\n- Service & support weight (default: 15%)\n- Innovation weight (default: 10%)\n- Sustainability weight (default: 10%)\n\nTIER THRESHOLDS:\n- Platinum tier: 90+ points\n- Gold tier: 85-89 points\n- Silver tier: 75-84 points\n- Bronze tier: 65-74 points\n- Under review: <65 points\n\nEVALUATION SETTINGS:\n- Evaluation frequency (Monthly, Quarterly, Semi-annual)\n- Auto-calculation triggers\n- Alert thresholds\n- Benchmark sources\n\nDATA SOURCES:\n- Quality inspection systems\n- Delivery tracking\n- Invoice data\n- Supplier surveys\n- Innovation metrics\n- ESG/sustainability data\n\nCustom weights can be set per category or supplier type.')
  }

  const handleExport = () => {
    console.log('Exporting supplier scorecard report...')
    alert('Exporting Supplier Scorecard Report to Excel...\n\nIncludes:\n\nSUMMARY SHEET:\n- Overall scorecard dashboard\n- Key performance metrics\n- Tier distribution\n- Trend analysis\n\nDETAILED SHEETS:\n- Supplier rankings with all scores\n- Individual supplier scorecards\n- Performance metrics breakdown\n- KPI details and trends\n- Category benchmarks\n- Industry comparisons\n- Improvement action tracker\n\nCHARTS & VISUALS:\n- Radar charts for performance distribution\n- Trend line charts\n- Ranking tables with tier badges\n- Benchmark comparisons\n\nFORMAT:\n- Excel workbook (.xlsx)\n- Professional formatting\n- Embedded charts\n- Pivot-ready data tables\n\nThis comprehensive report is ready for executive review and supplier business reviews.')
  }

  const handleViewSupplierDetails = (supplier: SupplierScore) => {
    console.log('Viewing supplier details:', supplier.supplierId)

    const tierDescription = supplier.tier === 'platinum'
      ? 'PLATINUM - Top tier strategic partner'
      : supplier.tier === 'gold'
      ? 'GOLD - Preferred supplier status'
      : supplier.tier === 'silver'
      ? 'SILVER - Qualified supplier'
      : 'BRONZE - Basic qualification'

    const trendAnalysis = supplier.trend === 'up'
      ? '📈 IMPROVING TREND\n- Score increased over last 2 quarters\n- Recommended for increased business\n- Consider for strategic partnership'
      : supplier.trend === 'down'
      ? '📉 DECLINING TREND\n- Score decreased over last 2 quarters\n- Requires performance improvement plan\n- Schedule supplier review meeting'
      : '➡️ STABLE PERFORMANCE\n- Consistent score over time\n- Maintain current relationship level'

    alert(`Supplier Scorecard Details\n\nSUPPLIER: ${supplier.supplierName}\nID: ${supplier.supplierId}\nCategory: ${supplier.category}\n\nRANKING: #${supplier.rank} overall\nTIER: ${tierDescription}\n\nPERFORMANCE SCORES:\n━━━━━━━━━━━━━━━━━━━━━━━━\nOverall Score: ${supplier.overallScore}/100 ⭐\n\nQuality: ${supplier.qualityScore}/100\n- Defect rate, returns, compliance\n\nDelivery: ${supplier.deliveryScore}/100\n- On-time delivery, lead time accuracy\n\nPrice: ${supplier.priceScore}/100\n- Competitiveness, value, cost savings\n\nService: ${supplier.serviceScore}/100\n- Responsiveness, support, communication\n\nInnovation: ${supplier.innovationScore}/100\n- New solutions, process improvements\n\nSustainability: ${supplier.sustainabilityScore}/100\n- Environmental, social governance\n\nTREND ANALYSIS:\n${trendAnalysis}\n\nLAST EVALUATION: ${supplier.lastEvaluation}\nNext Review: ${new Date(new Date(supplier.lastEvaluation).setMonth(new Date(supplier.lastEvaluation).getMonth() + 3)).toISOString().split('T')[0]}\n\nRECOMMENDED ACTIONS:\n${supplier.overallScore >= 90 ? '✓ Expand partnership opportunities\n✓ Share best practices internally\n✓ Consider for strategic sourcing' : supplier.overallScore >= 85 ? '✓ Maintain current relationship\n✓ Monitor for improvement\n✓ Provide positive feedback' : supplier.overallScore >= 75 ? '⚠ Schedule performance review\n⚠ Identify improvement areas\n⚠ Set clear expectations' : '⚠️ Develop improvement plan\n⚠️ Consider alternative suppliers\n⚠️ Escalate to management'}`)
  }

  const handleEditWeights = () => {
    console.log('Opening weight editor...')
    alert('Edit Scorecard Weights\n\nCURRENT WEIGHTS:\n━━━━━━━━━━━━━━━━━━━━━━━━\nQuality: 25%\nOn-time Delivery: 20%\nPrice Competitiveness: 20%\nService & Support: 15%\nInnovation: 10%\nSustainability: 10%\n━━━━━━━━━━━━━━━━━━━━━━━━\nTotal: 100%\n\nWEIGHT ADJUSTMENT OPTIONS:\n\n1. Use Default Weights:\n   - Balanced across all criteria\n   - Suitable for most supplier types\n\n2. Quality-Focused (Manufacturing):\n   - Quality: 35%\n   - Delivery: 25%\n   - Price: 20%\n   - Service: 10%\n   - Innovation: 5%\n   - Sustainability: 5%\n\n3. Cost-Focused (Commodities):\n   - Price: 40%\n   - Quality: 25%\n   - Delivery: 20%\n   - Service: 10%\n   - Innovation: 3%\n   - Sustainability: 2%\n\n4. Innovation-Focused (Technology):\n   - Innovation: 30%\n   - Quality: 25%\n   - Service: 20%\n   - Price: 15%\n   - Delivery: 7%\n   - Sustainability: 3%\n\n5. Custom Weights:\n   - Define your own weight distribution\n   - Must total 100%\n   - Apply to specific categories or all suppliers\n\nIMPACT ANALYSIS:\nChanging weights will recalculate all supplier scores and may affect rankings and tier assignments.\n\nNote: Weight changes require approval from Procurement Director.')
  }

  const handleRecalculateScores = () => {
    console.log('Recalculating supplier scores...')
    if (confirm('Recalculate All Supplier Scores?\n\nThis will:\n- Pull latest performance data from all systems\n- Recalculate scores using current weights\n- Update rankings and tier assignments\n- Identify suppliers that changed tiers\n- Generate change report\n\nEstimated time: 2-3 minutes for 50+ suppliers\n\nProceed with recalculation?')) {
      alert('Recalculating Supplier Scores...\n\nPROCESSING:\n✓ Fetching quality metrics (ERP/QMS)\n✓ Pulling delivery performance data\n✓ Analyzing pricing data\n✓ Gathering service ratings\n✓ Collecting innovation metrics\n✓ Updating sustainability scores\n\nCALCULATION:\n✓ Normalizing raw metrics to 0-100 scale\n✓ Applying category weights\n✓ Computing weighted averages\n✓ Calculating overall scores\n\nUPDATE:\n✓ Updating supplier rankings\n✓ Reassigning tiers based on scores\n✓ Identifying tier changes\n✓ Updating trend indicators\n\nRESULTS:\n- 45 suppliers recalculated\n- 3 suppliers moved up a tier (🎉)\n- 2 suppliers moved down a tier (⚠️)\n- 40 suppliers maintained tier\n\nCHANGES REQUIRING ATTENTION:\n1. Express Logistics Ltd: Silver → Gold\n2. Tech Innovations Inc: Gold → Platinum\n3. Budget Components Co: Bronze → Silver\n4. Quality Parts Inc: Gold → Silver (⚠️ requires review)\n5. Standard Supplies: Silver → Bronze (⚠️ action needed)\n\nScorecard updated successfully!\nNotifications sent to affected suppliers.')
    }
  }

  const handleCompareSuppliers = () => {
    if (!comparisonMode) {
      alert('Supplier Comparison Mode\n\nACTIVATED: Comparison mode enabled\n\nHOW TO USE:\n1. Select 2-5 suppliers using checkboxes\n2. Click "Compare Selected" to generate report\n3. View side-by-side performance analysis\n\nCOMPARISON FEATURES:\n- Score comparison across all metrics\n- Radar chart overlay\n- Trend comparison\n- Strengths and weaknesses analysis\n- Recommendation for sourcing decisions\n\nUSE CASES:\n- Evaluate alternative suppliers\n- Make sourcing decisions\n- Identify best-in-class for each metric\n- Support supplier negotiations\n- Consolidation analysis\n\nSelect suppliers from the rankings table to begin comparison.')
    } else {
      alert('Compare Selected Suppliers\n\nSUPPLIERS SELECTED: 3\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSUPPLIER 1: Global Tech Solutions\nOverall: 92 | Quality: 95 | Delivery: 88\nTier: Platinum | Rank: #1\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSUPPLIER 2: Premier Manufacturing Co\nOverall: 88 | Quality: 90 | Delivery: 85\nTier: Gold | Rank: #2\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSUPPLIER 3: Express Logistics Ltd\nOverall: 85 | Quality: 82 | Delivery: 92\nTier: Gold | Rank: #3\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nCOMPARATIVE ANALYSIS:\n\nSTRENGTHS BY SUPPLIER:\n• Global Tech: Best quality (95), innovation (92)\n• Premier Mfg: Balanced performer, sustainability (90)\n• Express Logistics: Best delivery (92), reliable\n\nRECOMMENDATION:\n- For quality-critical items: Global Tech Solutions\n- For balanced needs: Premier Manufacturing Co\n- For time-sensitive deliveries: Express Logistics Ltd\n\nCONSIDER:\n- Dual sourcing between Global Tech and Premier for risk mitigation\n- Use Express for JIT/urgent requirements\n\nExport detailed comparison report?')
    }
    setComparisonMode(!comparisonMode)
  }

  const handleViewTrends = (supplier: SupplierScore) => {
    console.log('Viewing performance trends for:', supplier.supplierId)
    alert(`Performance Trends: ${supplier.supplierName}\n\nHISTORICAL PERFORMANCE (Last 5 Quarters):\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nQ1 2023: 85 pts (Gold)\nQ2 2023: 86 pts (Gold) +1\nQ3 2023: 87 pts (Gold) +1\nQ4 2023: 88 pts (Gold) +1\nQ1 2024: ${supplier.overallScore} pts (${supplier.tier}) ${supplier.trend === 'up' ? '+' + (supplier.overallScore - 88) : supplier.trend === 'down' ? '-' + (88 - supplier.overallScore) : '0'}\n\nTREND ANALYSIS:\n${supplier.trend === 'up' ? '📈 CONSISTENT IMPROVEMENT\n- Positive trajectory over 5 quarters\n- Score improved by ' + (supplier.overallScore - 85) + ' points\n- Successfully maintained ' + supplier.tier + ' tier\n- Trend likely to continue' : supplier.trend === 'down' ? '📉 DECLINING PERFORMANCE\n- Downward trend in recent quarters\n- Requires immediate attention\n- Risk of tier downgrade\n- Intervention recommended' : '➡️ STABLE PERFORMANCE\n- Consistent scores quarter-over-quarter\n- Reliable and predictable\n- No major issues or improvements'}\n\nMETRIC BREAKDOWN TRENDS:\n\nQuality: ${supplier.trend === 'up' ? '↗' : supplier.trend === 'down' ? '↘' : '→'}\n${supplier.qualityScore >= 90 ? 'Excellent, maintaining high standards' : supplier.qualityScore >= 85 ? 'Good, minor variations' : 'Needs improvement'}\n\nDelivery: ${supplier.deliveryScore >= 90 ? '↗' : supplier.deliveryScore >= 80 ? '→' : '↘'}\n${supplier.deliveryScore >= 90 ? 'Outstanding on-time performance' : supplier.deliveryScore >= 85 ? 'Acceptable delivery performance' : 'Delivery delays impacting score'}\n\nPrice: ${supplier.priceScore >= 90 ? '↗' : supplier.priceScore >= 85 ? '→' : '↘'}\n${supplier.priceScore >= 90 ? 'Highly competitive pricing' : supplier.priceScore >= 85 ? 'Market-competitive rates' : 'Pricing concerns identified'}\n\nPREDICTIVE FORECAST:\nQ2 2024 Expected Score: ${supplier.trend === 'up' ? supplier.overallScore + 2 : supplier.trend === 'down' ? supplier.overallScore - 2 : supplier.overallScore}\nConfidence: ${supplier.trend === 'stable' ? 'High (85%)' : 'Medium (70%)'}\n\nACTION ITEMS:\n${supplier.trend === 'up' ? '✓ Recognize supplier performance\n✓ Explore partnership expansion\n✓ Share as best practice example' : supplier.trend === 'down' ? '⚠️ Schedule urgent review meeting\n⚠️ Develop improvement plan\n⚠️ Set clear performance targets' : '✓ Continue current relationship\n✓ Monitor for changes\n✓ Conduct regular reviews'}`)
  }

  const handleCreateAction = () => {
    console.log('Creating improvement action...')
    alert('Create Supplier Improvement Action\n\nACTION DETAILS:\n\nSupplier Selection:\n- Choose from suppliers with score <85\n- Or select any supplier needing attention\n\nIssue Identification:\n- Quality issues (defects, returns, compliance)\n- Delivery problems (late deliveries, lead time)\n- Pricing concerns (competitiveness, increases)\n- Service gaps (responsiveness, support)\n- Innovation opportunities\n- Sustainability improvements\n\nAction Planning:\n- Define specific improvement action\n- Set clear, measurable targets\n- Assign owner (buyer, quality, engineering)\n- Set timeline and milestones\n- Determine priority (High, Medium, Low)\n\nPriority Guidelines:\n- HIGH: Immediate business impact, tier at risk\n- MEDIUM: Performance gap, requires attention\n- LOW: Optimization opportunity\n\nTracking:\n- Status: Planned → In Progress → Completed\n- Progress updates and notes\n- Attach supporting documents\n- Link to scorecard metrics\n- Auto-notify stakeholders\n\nMeasurement:\n- Track impact on scorecard metrics\n- Measure before/after performance\n- ROI calculation\n- Success criteria validation\n\nEXAMPLE ACTIONS:\n• "Implement weekly quality inspections" (Quality)\n• "Reduce lead time by 2 days" (Delivery)\n• "Negotiate 5% price reduction" (Price)\n• "Assign dedicated account manager" (Service)\n• "Quarterly innovation workshops" (Innovation)\n• "ISO 14001 certification support" (Sustainability)\n\nActions automatically update supplier scorecard upon completion.')
  }

  const handleViewBenchmarks = () => {
    console.log('Viewing industry benchmarks...')
    alert('Industry Benchmark Analysis\n\nYOUR SUPPLIER BASE vs INDUSTRY STANDARDS\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOVERALL PERFORMANCE:\nYour Average: 85.8\nIndustry Average: 82.0\nTop Quartile: 88.0\nYour Percentile: 75th ✓ Above average\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nMETRIC BENCHMARKS:\n\nQuality (88):\nIndustry Avg: 85 | Your Position: 82nd percentile ✓\nGap to best-in-class: -7 points\n\nOn-time Delivery (92):\nIndustry Avg: 88 | Your Position: 68th percentile\nGap to best-in-class: -8 points (Improvement opportunity)\n\nPrice Competitiveness (87):\nIndustry Avg: 80 | Your Position: 71st percentile ✓\nGap to best-in-class: -5 points\n\nService & Support (86):\nIndustry Avg: 85 | Your Position: 65th percentile\nGap to best-in-class: -9 points (Focus area)\n\nInnovation (78):\nIndustry Avg: 75 | Your Position: 85th percentile ✓✓\nGap to best-in-class: -2 points (Strength!)\n\nSustainability (82):\nIndustry Avg: 75 | Your Position: 80th percentile ✓\nGap to best-in-class: -10 points\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCATEGORY BENCHMARKS:\n\nIT Services:\nYour top: 92 | Industry top: 92 | Matched! ✓\n\nRaw Materials:\nYour top: 88 | Industry top: 90 | Gap: -2\n\nLogistics:\nYour top: 85 | Industry top: 88 | Gap: -3\n\nComponents:\nYour top: 78 | Industry top: 85 | Gap: -7 ⚠️\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nKEY INSIGHTS:\n\n✓ STRENGTHS:\n- Innovation partnerships leading industry\n- Quality metrics above average\n- Price competitiveness strong\n\n⚠️ OPPORTUNITIES:\n- Delivery performance below top quartile\n- Service ratings need improvement\n- Component suppliers underperforming\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRECOMMENDATIONS:\n\n1. Focus on delivery performance improvement\n   - Target: Move from 68th to 80th percentile\n   - Work with logistics suppliers on lead time\n\n2. Enhance service & support scores\n   - Establish SLAs for response times\n   - Implement supplier portals\n\n3. Upgrade component supplier base\n   - Evaluate top-tier alternatives\n   - Implement supplier development program\n\n4. Maintain innovation leadership\n   - Continue collaborative partnerships\n   - Share best practices across organization\n\nBenchmark data source: Industry Supplier Performance Database 2024')
  }

  const handleScheduleReview = (supplier: SupplierScore) => {
    console.log('Scheduling supplier review for:', supplier.supplierId)
    alert(`Schedule Supplier Business Review\n\nSUPPLIER: ${supplier.supplierName}\nCurrent Score: ${supplier.overallScore}\nTier: ${supplier.tier}\n\nREVIEW PURPOSE:\n${supplier.overallScore >= 90 ? '✓ Strategic partnership discussion\n✓ Capacity expansion opportunities\n✓ Innovation collaboration\n✓ Long-term agreement negotiation' : supplier.overallScore >= 85 ? '✓ Performance review and feedback\n✓ Continuous improvement discussion\n✓ Relationship strengthening\n✓ Mutual growth planning' : supplier.overallScore >= 75 ? '⚠ Performance improvement required\n⚠ Issue resolution\n⚠ Corrective action planning\n⚠ Clear expectations setting' : '⚠️ Critical performance discussion\n⚠️ Improvement plan mandatory\n⚠️ Alternative supplier consideration\n⚠️ Relationship status evaluation'}\n\nREVIEW AGENDA:\n1. Scorecard review (15 min)\n   - Overall performance discussion\n   - Metric-by-metric analysis\n   - Trend review\n\n2. Issues and concerns (20 min)\n   - Quality incidents\n   - Delivery challenges\n   - Communication gaps\n   - Pricing discussions\n\n3. Improvement opportunities (15 min)\n   - Innovation initiatives\n   - Process enhancements\n   - Cost reduction ideas\n   - Sustainability improvements\n\n4. Action items and commitments (10 min)\n   - Specific improvement actions\n   - Timelines and milestones\n   - Responsibilities\n   - Next review date\n\nPARTICIPANTS:\nYour side:\n- Procurement Manager\n- Category Manager\n- Quality Engineer\n- ${supplier.overallScore >= 90 ? 'Supply Chain Director' : ''}\n\nSupplier side:\n- Account Manager\n- Operations Manager\n- Quality Manager\n- ${supplier.overallScore >= 90 ? 'General Manager/VP' : ''}\n\nFREQUENCY:\n${supplier.tier === 'platinum' ? 'Quarterly reviews (strategic partners)' : supplier.tier === 'gold' ? 'Semi-annual reviews (preferred suppliers)' : supplier.tier === 'silver' ? 'Annual reviews (qualified suppliers)' : 'As needed or quarterly if on improvement plan'}\n\nPREPARATION REQUIRED:\n- Detailed scorecard report\n- Performance data and trends\n- Quality/delivery incident log\n- Spend analysis\n- Competitive benchmark\n- Improvement action tracker\n\nSchedule review meeting?`)
  }

  const handleExportSupplierReport = (supplier: SupplierScore) => {
    console.log('Exporting individual supplier report:', supplier.supplierId)
    alert(`Export Supplier Performance Report\n\nSUPPLIER: ${supplier.supplierName}\nREPORT TYPE: Individual Supplier Scorecard\n\nREPORT CONTENTS:\n\n📊 EXECUTIVE SUMMARY\n- Supplier profile and overview\n- Overall score and tier\n- Rank among all suppliers\n- Performance trend\n- Key highlights and concerns\n\n📈 DETAILED SCORECARD\n- Quality score breakdown\n- Delivery performance metrics\n- Price competitiveness analysis\n- Service & support ratings\n- Innovation contributions\n- Sustainability assessment\n\n📉 PERFORMANCE TRENDS\n- 5-quarter historical performance\n- Metric-by-metric trends\n- Improvement/decline analysis\n- Predictive forecast\n\n🎯 KPI DETAILS\n- Defect rate trends\n- On-time delivery %\n- Lead time variance\n- Invoice accuracy\n- Response time metrics\n- Cost savings delivered\n\n🏆 BENCHMARKING\n- Category comparison\n- Industry percentile ranking\n- Best-in-class gap analysis\n\n📋 ACTION ITEMS\n- Current improvement actions\n- Completed initiatives\n- Impact assessment\n- Next steps\n\n💬 BUSINESS REVIEW HISTORY\n- Past review summaries\n- Commitments tracking\n- Issue resolution status\n\n📄 SUPPORTING DATA\n- Quality inspection results\n- Delivery performance log\n- Spend analysis\n- Audit findings (if any)\n\nFORMAT OPTIONS:\n1. PDF Report (Executive-ready, 8-12 pages)\n2. Excel Workbook (Detailed data, charts)\n3. PowerPoint (Business review presentation)\n4. All formats (comprehensive package)\n\nUSE CASES:\n- Supplier business reviews\n- Internal stakeholder updates\n- Sourcing decisions\n- Audit documentation\n- Supplier negotiations\n- Performance improvement discussions\n\nExporting comprehensive report for ${supplier.supplierName}...')
  }

  // Mock data
  const supplierScores: SupplierScore[] = [
    {
      supplierId: 'SUP001',
      supplierName: 'Global Tech Solutions',
      category: 'IT Services',
      overallScore: 92,
      qualityScore: 95,
      deliveryScore: 88,
      priceScore: 90,
      serviceScore: 94,
      innovationScore: 92,
      sustainabilityScore: 85,
      trend: 'up',
      rank: 1,
      tier: 'platinum',
      lastEvaluation: '2024-02-15'
    },
    {
      supplierId: 'SUP002',
      supplierName: 'Premier Manufacturing Co',
      category: 'Raw Materials',
      overallScore: 88,
      qualityScore: 90,
      deliveryScore: 85,
      priceScore: 88,
      serviceScore: 86,
      innovationScore: 82,
      sustainabilityScore: 90,
      trend: 'stable',
      rank: 2,
      tier: 'gold',
      lastEvaluation: '2024-02-10'
    },
    {
      supplierId: 'SUP003',
      supplierName: 'Express Logistics Ltd',
      category: 'Logistics',
      overallScore: 85,
      qualityScore: 82,
      deliveryScore: 92,
      priceScore: 85,
      serviceScore: 88,
      innovationScore: 78,
      sustainabilityScore: 80,
      trend: 'up',
      rank: 3,
      tier: 'gold',
      lastEvaluation: '2024-02-12'
    },
    {
      supplierId: 'SUP004',
      supplierName: 'Quality Components Inc',
      category: 'Components',
      overallScore: 78,
      qualityScore: 85,
      deliveryScore: 75,
      priceScore: 82,
      serviceScore: 72,
      innovationScore: 70,
      sustainabilityScore: 75,
      trend: 'down',
      rank: 8,
      tier: 'silver',
      lastEvaluation: '2024-02-08'
    }
  ]

  const performanceMetrics: PerformanceMetric[] = [
    { metric: 'Quality', weight: 25, target: 90, actual: 88, score: 97.8, trend: 'improving' },
    { metric: 'On-time Delivery', weight: 20, target: 95, actual: 92, score: 96.8, trend: 'stable' },
    { metric: 'Price Competitiveness', weight: 20, target: 85, actual: 87, score: 102.4, trend: 'improving' },
    { metric: 'Service & Support', weight: 15, target: 90, actual: 86, score: 95.6, trend: 'declining' },
    { metric: 'Innovation', weight: 10, target: 80, actual: 78, score: 97.5, trend: 'stable' },
    { metric: 'Sustainability', weight: 10, target: 85, actual: 82, score: 96.5, trend: 'improving' }
  ]

  const scorecardHistory = [
    { quarter: 'Q1 2023', quality: 85, delivery: 88, price: 84, service: 82, overall: 85 },
    { quarter: 'Q2 2023', quality: 86, delivery: 89, price: 85, service: 84, overall: 86 },
    { quarter: 'Q3 2023', quality: 88, delivery: 90, price: 86, service: 85, overall: 87 },
    { quarter: 'Q4 2023', quality: 89, delivery: 91, price: 87, service: 86, overall: 88 },
    { quarter: 'Q1 2024', quality: 90, delivery: 92, price: 88, service: 88, overall: 90 }
  ]

  const kpiDetails = [
    { kpi: 'Defect Rate', value: '0.8%', target: '<1%', status: 'good' },
    { kpi: 'Return Rate', value: '1.2%', target: '<2%', status: 'good' },
    { kpi: 'On-Time Delivery', value: '94.5%', target: '>95%', status: 'warning' },
    { kpi: 'Lead Time Variance', value: '±2 days', target: '±1 day', status: 'warning' },
    { kpi: 'Invoice Accuracy', value: '99.2%', target: '>98%', status: 'good' },
    { kpi: 'Response Time', value: '2.5 hrs', target: '<4 hrs', status: 'good' },
    { kpi: 'Cost Savings', value: '8.5%', target: '>5%', status: 'good' },
    { kpi: 'Contract Compliance', value: '96%', target: '>95%', status: 'good' }
  ]

  const categoryBenchmarks = [
    { category: 'IT Services', avgScore: 85, topScore: 92, yourScore: 92 },
    { category: 'Raw Materials', avgScore: 82, topScore: 90, yourScore: 88 },
    { category: 'Logistics', avgScore: 80, topScore: 88, yourScore: 85 },
    { category: 'Components', avgScore: 78, topScore: 85, yourScore: 78 },
    { category: 'Professional Services', avgScore: 83, topScore: 91, yourScore: 86 }
  ]

  const improvementActions = [
    { supplier: 'Quality Components Inc', issue: 'Delivery delays', action: 'Implement buffer stock', priority: 'high', status: 'in_progress' },
    { supplier: 'Express Logistics Ltd', issue: 'Documentation errors', action: 'Process training', priority: 'medium', status: 'planned' },
    { supplier: 'Premier Manufacturing Co', issue: 'Quality variations', action: 'Enhanced QC process', priority: 'high', status: 'completed' },
    { supplier: 'Global Tech Solutions', issue: 'Response time', action: 'Dedicated account manager', priority: 'low', status: 'in_progress' }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600'
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600'
      default: return 'bg-gray-400'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return <Trophy className="w-5 h-5 text-white" />
      case 'gold': return <Medal className="w-5 h-5 text-white" />
      case 'silver': return <Award className="w-5 h-5 text-white" />
      case 'bronze': return <Badge className="w-5 h-5 text-white" />
      default: return null
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="w-8 h-8 text-blue-600" />
              Supplier Performance Scorecard
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive supplier performance evaluation and benchmarking</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleViewBenchmarks}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              title="View Industry Benchmarks"
            >
              <PieChart className="w-4 h-4" />
              Benchmarks
            </button>
            <button
              onClick={handleEditWeights}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              title="Edit Scorecard Weights"
            >
              <Settings className="w-4 h-4" />
              Edit Weights
            </button>
            <button
              onClick={handleCreateAction}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
              title="Create Improvement Action"
            >
              <Plus className="w-4 h-4" />
              New Action
            </button>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              title="Export Scorecard Report"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleSettings}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              title="Scorecard Settings"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={handleRecalculateScores}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              title="Recalculate All Scores"
            >
              <RefreshCw className="w-4 h-4" />
              Update Scores
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Average Score</span>
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">85.8</div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+2.3 pts</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Top Performers</span>
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">Score ≥90</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-600 text-sm font-medium">Need Improvement</span>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <div className="text-sm text-gray-600">Score &lt;75</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 text-sm font-medium">Evaluated</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">45/52</div>
            <div className="text-sm text-gray-600">This quarter</div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-600 text-sm font-medium">Action Items</span>
              <Zap className="w-5 h-5 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">18</div>
            <div className="text-sm text-orange-600">5 overdue</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-t-xl">
          {['overview', 'rankings', 'metrics', 'benchmarks', 'trends', 'actions'].map((tab) => (
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
              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={performanceMetrics}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="metric" stroke="#6B7280" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#6B7280" />
                      <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      <Radar name="Actual" dataKey="actual" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trend Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={scorecardHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="quarter" stroke="#6B7280" />
                      <YAxis domain={[80, 95]} stroke="#6B7280" />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                      <Legend />
                      <Line type="monotone" dataKey="overall" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} name="Overall" />
                      <Line type="monotone" dataKey="quality" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Quality" />
                      <Line type="monotone" dataKey="delivery" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Delivery" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Performing Suppliers</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {supplierScores.slice(0, 3).map((supplier, index) => (
                      <div key={supplier.supplierId} className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                        <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center ${getTierColor(supplier.tier)}`}>
                          {getTierIcon(supplier.tier)}
                        </div>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`text-3xl font-bold ${
                            index === 0 ? 'text-yellow-500' :
                            index === 1 ? 'text-gray-400' :
                            'text-orange-500'
                          }`}>
                            #{supplier.rank}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{supplier.supplierName}</h4>
                            <div className="text-sm text-gray-600">{supplier.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-3xl font-bold text-gray-900">{supplier.overallScore}</div>
                            <div className="text-sm text-gray-600">Overall Score</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {supplier.trend === 'up' ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : supplier.trend === 'down' ? (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            ) : (
                              <Activity className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-gray-600">Quality</div>
                            <div className="font-medium">{supplier.qualityScore}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Delivery</div>
                            <div className="font-medium">{supplier.deliveryScore}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Service</div>
                            <div className="font-medium">{supplier.serviceScore}</div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                          <button
                            onClick={() => handleViewSupplierDetails(supplier)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                            title="View Full Details"
                          >
                            <Eye className="w-3 h-3" />
                            Details
                          </button>
                          <button
                            onClick={() => handleViewTrends(supplier)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs font-medium"
                            title="View Performance Trends"
                          >
                            <TrendingUp className="w-3 h-3" />
                            Trends
                          </button>
                          <button
                            onClick={() => handleScheduleReview(supplier)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-xs font-medium"
                            title="Schedule Business Review"
                          >
                            <Calendar className="w-3 h-3" />
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPI Performance */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {kpiDetails.map((kpi) => (
                    <div key={kpi.kpi} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm text-gray-600">{kpi.kpi}</div>
                        {kpi.status === 'good' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : kpi.status === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
                      <div className="text-xs text-gray-500 mt-1">Target: {kpi.target}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rankings' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Categories</option>
                  <option>IT Services</option>
                  <option>Raw Materials</option>
                  <option>Logistics</option>
                  <option>Components</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Tiers</option>
                  <option>Platinum</option>
                  <option>Gold</option>
                  <option>Silver</option>
                  <option>Bronze</option>
                </select>
                <button
                  onClick={handleCompareSuppliers}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    comparisonMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={comparisonMode ? 'Compare Selected Suppliers' : 'Enable Comparison Mode'}
                >
                  <GitCompare className="w-4 h-4" />
                  {comparisonMode ? 'Compare Selected' : 'Compare'}
                </button>
              </div>

              {/* Rankings Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      {comparisonMode && (
                        <th className="px-4 py-3 text-left">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Overall</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Quality</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Delivery</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Service</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tier</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Trend</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {supplierScores.map((supplier) => (
                      <tr key={supplier.supplierId} className="hover:bg-gray-50">
                        {comparisonMode && (
                          <td className="px-4 py-3">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </td>
                        )}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${
                              supplier.rank === 1 ? 'text-yellow-500' :
                              supplier.rank === 2 ? 'text-gray-400' :
                              supplier.rank === 3 ? 'text-orange-500' :
                              'text-gray-600'
                            }`}>
                              {supplier.rank}
                            </span>
                            {supplier.rank <= 3 && (
                              <Medal className={`w-4 h-4 ${
                                supplier.rank === 1 ? 'text-yellow-500' :
                                supplier.rank === 2 ? 'text-gray-400' :
                                'text-orange-500'
                              }`} />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{supplier.supplierName}</div>
                          <div className="text-sm text-gray-500">{supplier.supplierId}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{supplier.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-bold text-gray-900">{supplier.overallScore}</div>
                            <div className="flex -space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(supplier.overallScore / 20)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium">{supplier.qualityScore}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium">{supplier.deliveryScore}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium">{supplier.priceScore}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium">{supplier.serviceScore}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            supplier.tier === 'platinum' ? 'bg-gray-100 text-gray-700' :
                            supplier.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                            supplier.tier === 'silver' ? 'bg-gray-100 text-gray-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {getTierIcon(supplier.tier)}
                            {supplier.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {supplier.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : supplier.trend === 'down' ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <Activity className="w-4 h-4 text-gray-600" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewSupplierDetails(supplier)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-xs"
                              title="View Scorecard"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => handleViewTrends(supplier)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-xs"
                              title="Performance Trends"
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleExportSupplierReport(supplier)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs"
                              title="Export Report"
                            >
                              <Download className="w-3.5 h-3.5" />
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

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Weighted Metrics */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics & Weights</h3>
                <div className="space-y-3">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.metric} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-900">{metric.metric}</div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {metric.weight}% weight
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {metric.trend === 'improving' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : metric.trend === 'declining' ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <Activity className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-sm text-gray-600">{metric.trend}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-600">Target</div>
                          <div className="font-medium">{metric.target}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Actual</div>
                          <div className="font-medium">{metric.actual}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Score</div>
                          <div className={`font-medium ${
                            metric.score >= 100 ? 'text-green-600' :
                            metric.score >= 90 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {metric.score.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metric.score >= 100 ? 'bg-green-500' :
                            metric.score >= 90 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, metric.score)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculation Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scorecard Calculation Method</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Data Collection</h4>
                      <p className="text-sm text-gray-600 mt-1">Gather performance data from ERP, quality systems, and supplier feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Normalization</h4>
                      <p className="text-sm text-gray-600 mt-1">Convert raw metrics to 0-100 scale based on targets and benchmarks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Weighted Calculation</h4>
                      <p className="text-sm text-gray-600 mt-1">Apply category weights and calculate weighted average score</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Tier Assignment</h4>
                      <p className="text-sm text-gray-600 mt-1">Assign supplier tiers based on overall score thresholds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benchmarks' && (
            <div className="space-y-6">
              {/* Category Benchmarks */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Benchmarking</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryBenchmarks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} stroke="#6B7280" />
                    <YAxis domain={[70, 95]} stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Legend />
                    <Bar dataKey="avgScore" fill="#6B7280" name="Category Average" />
                    <Bar dataKey="topScore" fill="#10B981" name="Top Performer" />
                    <Bar dataKey="yourScore" fill="#3B82F6" name="Your Suppliers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Industry Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Industry Percentile Ranking</h4>
                  <div className="space-y-3">
                    {[
                      { metric: 'Overall Score', percentile: 75, industry: 82 },
                      { metric: 'Quality', percentile: 82, industry: 85 },
                      { metric: 'Delivery', percentile: 68, industry: 88 },
                      { metric: 'Cost', percentile: 71, industry: 80 },
                      { metric: 'Innovation', percentile: 85, industry: 75 }
                    ].map((item) => (
                      <div key={item.metric}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">{item.metric}</span>
                          <span className="text-sm font-medium">P{item.percentile}</span>
                        </div>
                        <div className="relative bg-gray-200 rounded-full h-2">
                          <div
                            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                            style={{ width: `${item.percentile}%` }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-red-500"
                            style={{ left: `${item.industry}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      Your Position
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-0.5 h-3 bg-red-500"></div>
                      Industry Avg
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Best Practices Gap Analysis</h4>
                  <div className="space-y-3">
                    {[
                      { practice: 'Digital Integration', adoption: 65, bestInClass: 90 },
                      { practice: 'Sustainability', adoption: 70, bestInClass: 85 },
                      { practice: 'Risk Management', adoption: 75, bestInClass: 92 },
                      { practice: 'Innovation Partnership', adoption: 55, bestInClass: 80 },
                      { practice: 'Performance Tracking', adoption: 80, bestInClass: 95 }
                    ].map((item) => (
                      <div key={item.practice} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{item.practice}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{item.adoption}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(item.adoption / item.bestInClass) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{item.bestInClass}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              {/* Historical Performance */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={scorecardHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="quarter" stroke="#6B7280" />
                    <YAxis yAxisId="left" domain={[80, 95]} stroke="#6B7280" />
                    <YAxis yAxisId="right" orientation="right" domain={[80, 95]} stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="overall" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} name="Overall Score" />
                    <Line yAxisId="right" type="monotone" dataKey="quality" stroke="#10B981" strokeWidth={2} name="Quality" />
                    <Line yAxisId="right" type="monotone" dataKey="delivery" stroke="#F59E0B" strokeWidth={2} name="Delivery" />
                    <Line yAxisId="right" type="monotone" dataKey="service" stroke="#8B5CF6" strokeWidth={2} name="Service" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Predictive Analytics */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Predictions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">88.5</div>
                    <div className="text-sm text-gray-600 mt-1">Q2 2024 Forecast</div>
                    <div className="text-xs text-green-600 mt-2">+1.2 pts improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">3</div>
                    <div className="text-sm text-gray-600 mt-1">Suppliers to Platinum</div>
                    <div className="text-xs text-gray-500 mt-2">Next quarter</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600">5</div>
                    <div className="text-sm text-gray-600 mt-1">At Risk Suppliers</div>
                    <div className="text-xs text-amber-600 mt-2">Need intervention</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">92%</div>
                    <div className="text-sm text-gray-600 mt-1">Target Achievement</div>
                    <div className="text-xs text-purple-600 mt-2">End of year projection</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Actions & Initiatives</h3>

              {/* Action Items */}
              <div className="space-y-3">
                {improvementActions.map((action, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            action.priority === 'high' ? 'bg-red-100 text-red-700' :
                            action.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {action.priority} priority
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            action.status === 'completed' ? 'bg-green-100 text-green-700' :
                            action.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {action.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">{action.supplier}</h4>
                        <div className="text-sm text-gray-600 mt-1">Issue: {action.issue}</div>
                        <div className="text-sm text-gray-600">Action: {action.action}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-600 text-sm font-medium">High Priority</span>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <div className="text-sm text-gray-600">Immediate action required</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-600 text-sm font-medium">In Progress</span>
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Being addressed</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600 text-sm font-medium">Completed</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">24</div>
                  <div className="text-sm text-gray-600">This quarter</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}