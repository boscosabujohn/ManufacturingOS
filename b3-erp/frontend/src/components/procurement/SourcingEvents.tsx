'use client';

import React, { useState } from 'react';
import { Gavel, FileSearch, TrendingDown, Users, Calendar, DollarSign, Award, FileText, Plus, RefreshCw, Settings, Download, Eye, Edit, Send, CheckCircle, XCircle, Clock, Play, StopCircle, BarChart3, MessageSquare } from 'lucide-react';

export type EventType = 'rfq' | 'rfp' | 'auction' | 'rfx';
export type EventStatus = 'draft' | 'published' | 'active' | 'evaluation' | 'awarded' | 'cancelled';
export type BidStatus = 'submitted' | 'under-review' | 'shortlisted' | 'rejected' | 'awarded';

export interface SourcingEvent {
  id: string;
  eventNumber: string;
  title: string;
  type: EventType;
  status: EventStatus;
  category: string;
  publishDate: string;
  closeDate: string;
  estimatedValue: number;
  participantsInvited: number;
  responsesReceived: number;
  currentBestBid?: number;
  savingsEstimate?: number;
  owner: string;
}

export interface BidResponse {
  id: string;
  eventId: string;
  supplier: string;
  bidAmount: number;
  submittedDate: string;
  status: BidStatus;
  technicalScore: number;
  commercialScore: number;
  overallScore: number;
  leadTime: number;
  paymentTerms: string;
  validityDays: number;
}

export interface AuctionEvent {
  id: string;
  eventNumber: string;
  title: string;
  startPrice: number;
  currentPrice: number;
  reservePrice: number;
  participants: number;
  bidsPlaced: number;
  timeRemaining: string;
  status: 'upcoming' | 'live' | 'ended';
  savings: number;
}

const SourcingEvents: React.FC = () => {
  const [activeView, setActiveView] = useState<'events' | 'bids' | 'auctions'>('events');

  // Handler functions
  const handleCreateEvent = () => {
    console.log('Creating new sourcing event...');
    alert('Create New Sourcing Event\n\nEVENT TYPE SELECTION:\n\n1. RFQ (Request for Quotation):\n   - Best for: Standardized products/services\n   - Focus: Price comparison\n   - Timeline: 2-3 weeks typical\n   - Use when: Specifications are clear\n\n2. RFP (Request for Proposal):\n   - Best for: Complex requirements\n   - Focus: Solution quality and approach\n   - Timeline: 4-8 weeks typical\n   - Use when: Need detailed proposals\n\n3. RFx (Generic Request):\n   - Best for: Flexible requirements\n   - Focus: Information gathering\n   - Timeline: Variable\n   - Use when: Exploring options\n\n4. Reverse Auction:\n   - Best for: Commodities, high competition\n   - Focus: Real-time price reduction\n   - Timeline: 1-2 hours live bidding\n   - Use when: Market has 5+ qualified suppliers\n\nEVENT SETUP:\n- Define category and requirements\n- Set estimated value and budget\n- Select invited suppliers (or open)\n- Configure evaluation criteria\n- Set timeline (publish, close, award dates)\n- Add technical specifications\n- Define commercial terms\n\nEVALUATION CRITERIA:\n- Technical score weight (typically 40-60%)\n- Commercial score weight (typically 40-60%)\n- Minimum qualification scores\n- Mandatory requirements\n\nAPPROVAL WORKFLOW:\n- Category manager review\n- Procurement director approval\n- Legal review (if >$500K)\n- Finance approval (budget confirmation)\n\nEvent will be created in DRAFT status for review before publishing.');
  };

  const handleRefresh = () => {
    console.log('Refreshing sourcing events...');
    alert('Refreshing Sourcing Events...\n\nUpdating:\n- Active event status\n- Bid response counts\n- Current best bids\n- Savings calculations\n- Auction prices (real-time)\n- Evaluation progress\n- Timeline status\n\nSyncing with:\n- Supplier portal submissions\n- Auction platform\n- Evaluation scorecards\n- ERP procurement data\n\nEstimated time: 8 seconds');
  };

  const handleSettings = () => {
    console.log('Opening sourcing settings...');
    alert('Sourcing Events Settings\n\nEVENT CONFIGURATION:\n- Default event timelines\n- Minimum response time (7-14 days)\n- Auto-publish rules\n- Notification settings\n\nEVALUATION SETTINGS:\n- Default technical weight (50%)\n- Default commercial weight (50%)\n- Minimum scores for shortlisting\n- Automatic disqualification rules\n\nAUCTION SETTINGS:\n- Default auction duration\n- Minimum bid decrement ($100-$1000)\n- Extension rules (anti-sniping)\n- Reserve price requirements\n\nSUPPLIER PORTAL:\n- Bid submission templates\n- Required documents\n- Q&A process\n- Clarification deadlines\n\nAPPROVAL WORKFLOWS:\n- Event creation approval\n- Award approval thresholds\n- Exception approvals\n- Signature authority matrix\n\nNOTIFICATIONS:\n- Email alerts for new events\n- Bid submission confirmations\n- Deadline reminders\n- Award notifications\n\nCOMPLIANCE:\n- Audit trail requirements\n- Document retention (7 years)\n- Conflict of interest checks\n- Fair competition rules');
  };

  const handleExportEvents = () => {
    console.log('Exporting sourcing events report...');
    alert('Export Sourcing Events Report\n\nREPORT CONTENTS:\n\nEVENT SUMMARY:\n- All active and recent events\n- Event details and specifications\n- Timeline and milestones\n- Invited suppliers and responses\n\nBID ANALYSIS:\n- Bid comparison matrix\n- Technical scores breakdown\n- Commercial evaluation\n- Overall rankings\n\nSAVINGS ANALYSIS:\n- Estimated vs actual savings\n- Savings by event type\n- Savings by category\n- YTD procurement savings\n\nAUCTION RESULTS:\n- Starting vs final prices\n- Bid history and timeline\n- Participant activity\n- Savings achieved\n\nFORMAT OPTIONS:\n- Excel workbook (detailed data)\n- PDF report (executive summary)\n- CSV exports (for analysis)\n\nINCLUDES:\n- Event logs and activity\n- Supplier participation rates\n- Award recommendations\n- Compliance documentation\n\nExporting comprehensive sourcing events report...');
  };

  const handleViewEventDetails = (event: SourcingEvent) => {
    console.log('Viewing event details:', event.id);

    const statusDescription = event.status === 'draft' ? 'Being prepared, not visible to suppliers'
      : event.status === 'published' ? 'Published, waiting for responses'
      : event.status === 'active' ? 'Live, accepting responses'
      : event.status === 'evaluation' ? 'Closed, evaluating responses'
      : event.status === 'awarded' ? 'Award decision made'
      : 'Cancelled';

    const responseRate = event.participantsInvited > 0
      ? ((event.responsesReceived / event.participantsInvited) * 100).toFixed(0)
      : '0';

    const savingsPercent = event.currentBestBid && event.estimatedValue > 0
      ? (((event.estimatedValue - event.currentBestBid) / event.estimatedValue) * 100).toFixed(1)
      : '0';

    alert(`Sourcing Event Details\n\nEVENT: ${event.eventNumber}\n${event.title}\n\nTYPE: ${event.type.toUpperCase()}\nCATEGORY: ${event.category}\nOWNER: ${event.owner}\n\nSTATUS: ${event.status.toUpperCase()}\n${statusDescription}\n\nTIMELINE:\nPublished: ${event.publishDate}\nClose Date: ${event.closeDate}\nDays Remaining: ${Math.ceil((new Date(event.closeDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}\n\nPARTICIPATION:\nInvited Suppliers: ${event.participantsInvited}\nResponses Received: ${event.responsesReceived}\nResponse Rate: ${responseRate}%\n${event.responsesReceived < event.participantsInvited * 0.5 ? '⚠️ Low response rate - consider extending deadline or follow-up' : '✓ Good participation'}\n\nFINANCIALS:\nEstimated Value: $${(event.estimatedValue / 1000000).toFixed(2)}M\n${event.currentBestBid ? `Current Best Bid: $${(event.currentBestBid / 1000000).toFixed(2)}M` : 'No bids yet'}\n${event.savingsEstimate ? `Est. Savings: $${(event.savingsEstimate / 1000).toFixed(0)}K (${savingsPercent}%)` : ''}\n\nNEXT ACTIONS:\n${event.status === 'draft' ? '→ Review and publish event\n→ Invite suppliers\n→ Set up evaluation team' : event.status === 'published' || event.status === 'active' ? '→ Monitor bid submissions\n→ Answer supplier questions\n→ Send reminders to non-responders' : event.status === 'evaluation' ? '→ Complete bid evaluation\n→ Conduct negotiations if needed\n→ Prepare award recommendation' : event.status === 'awarded' ? '→ Issue PO to winner\n→ Notify unsuccessful bidders\n→ Document lessons learned' : 'Event cancelled'}\n\n${event.responsesReceived > 0 ? 'Click "View Bids" to see detailed responses and scores' : ''}`);
  };

  const handleEditEvent = (event: SourcingEvent) => {
    console.log('Editing event:', event.id);

    if (event.status === 'awarded' || event.status === 'cancelled') {
      alert(`Cannot Edit Event\n\nEvent ${event.eventNumber} is ${event.status}.\n\nCompleted or cancelled events cannot be edited for compliance and audit trail purposes.\n\nTo make changes:\n- Create a new event\n- Reference original event number\n- Document reason for re-sourcing`);
      return;
    }

    alert(`Edit Sourcing Event: ${event.eventNumber}\n\nEDITABLE FIELDS:\n\n${event.status === 'draft' ? '✓ All fields can be edited' : '⚠️ Limited editing (event is active)'}\n\nBASIC INFO:\n- Event title and description ${event.status === 'draft' ? '✓' : '✗'}\n- Category ${event.status === 'draft' ? '✓' : '✗'}\n- Estimated value ${event.status === 'draft' ? '✓' : '✗'}\n\nTIMELINE:\n- Publish date ${event.status === 'draft' ? '✓' : '✗'}\n- Close date ✓ (can extend with notification)\n- Award date ✓\n\nSUPPLIERS:\n- Add invited suppliers ✓\n- Remove invited suppliers ${event.status === 'draft' ? '✓' : '✗'}\n\nREQUIREMENTS:\n- Technical specifications ${event.status === 'draft' ? '✓' : 'Amendment only'}\n- Commercial terms ${event.status === 'draft' ? '✓' : 'Amendment only'}\n- Evaluation criteria ${event.status === 'draft' ? '✓' : '✗'}\n\nDOCUMENTS:\n- Add attachments ✓\n- Update documents ✓\n\n${event.status !== 'draft' ? '⚠️ IMPORTANT:\nChanges to active events require:\n- Notification to all participants\n- Extension of close date (if significant)\n- Amendment documentation\n- Approval from procurement director' : ''}\n\nNote: All changes are logged in audit trail.`);
  };

  const handlePublishEvent = (event: SourcingEvent) => {
    console.log('Publishing event:', event.id);

    if (event.status !== 'draft') {
      alert(`Event Already Published\n\nEvent ${event.eventNumber} is already in ${event.status} status.`);
      return;
    }

    if (confirm(`Publish Sourcing Event?\n\nEvent: ${event.eventNumber}\n${event.title}\n\nThis will:\n- Make event visible on supplier portal\n- Send email invitations to ${event.participantsInvited} suppliers\n- Start the response timeline\n- Lock certain event settings\n\nEvent Details:\nType: ${event.type.toUpperCase()}\nCategory: ${event.category}\nEstimated Value: $${(event.estimatedValue / 1000000).toFixed(2)}M\nClose Date: ${event.closeDate}\n\nProceed with publishing?`)) {
      alert(`Event Published Successfully!\n\nEvent ${event.eventNumber} is now live.\n\nACTIONS COMPLETED:\n✓ Event published to supplier portal\n✓ Email invitations sent to ${event.participantsInvited} suppliers\n✓ Q&A forum activated\n✓ Document downloads enabled\n✓ Response tracking started\n\nNOTIFICATIONS SENT:\n- Invited suppliers: Event invitation\n- Procurement team: Publication confirmation\n- Category manager: Event monitoring alert\n\nSUPPLIER PORTAL:\nSuppliers can now:\n- View event requirements\n- Download technical specifications\n- Submit clarification questions\n- Prepare their responses\n\nMONITORING:\n- Track supplier portal views\n- Monitor Q&A activity\n- Watch response submissions\n- Send reminders at day -7, -3, -1\n\nNext step: Monitor event and answer supplier questions.`);
    }
  };

  const handleCloseEvent = (event: SourcingEvent) => {
    console.log('Closing event:', event.id);

    if (event.status === 'evaluation' || event.status === 'awarded' || event.status === 'cancelled') {
      alert(`Event Already Closed\n\nEvent ${event.eventNumber} is in ${event.status} status.`);
      return;
    }

    if (confirm(`Close Event Early?\n\nEvent: ${event.eventNumber}\nScheduled Close: ${event.closeDate}\n\nCurrent Status:\n- Invited: ${event.participantsInvited}\n- Responses: ${event.responsesReceived}\n\n${event.responsesReceived < 3 ? '⚠️ WARNING: Only ' + event.responsesReceived + ' responses\nRecommended minimum: 3 responses for competitive bidding\n\n' : ''}Close event now and move to evaluation?`)) {
      alert(`Event Closed\n\nEvent ${event.eventNumber} is now closed for bidding.\n\nCLOSURE ACTIONS:\n✓ Bid submissions disabled\n✓ Supplier portal updated\n✓ Final response count: ${event.responsesReceived}\n✓ Status changed to EVALUATION\n\nNOTIFICATIONS:\n- Suppliers: Bidding closed, evaluation in progress\n- Evaluation team: Evaluation assignment sent\n- Procurement team: Event closed for scoring\n\nEVALUATION PROCESS:\n1. Technical evaluation (3-5 days)\n   - Review technical compliance\n   - Score against criteria\n   - Identify non-conformances\n\n2. Commercial evaluation (2-3 days)\n   - Price comparison\n   - Terms and conditions review\n   - Total cost of ownership\n\n3. Overall scoring (1-2 days)\n   - Combine technical + commercial\n   - Calculate weighted scores\n   - Create ranking\n\n4. Shortlisting (1 day)\n   - Select top 2-3 bidders\n   - Prepare negotiation strategy\n   - Schedule clarifications\n\n5. Award recommendation (2-3 days)\n   - Final negotiations\n   - Award justification\n   - Approval routing\n\nEstimated Timeline: 9-14 days to award\n\nProceed to bid evaluation interface?`);
    }
  };

  const handleAwardEvent = (event: SourcingEvent) => {
    console.log('Awarding event:', event.id);

    if (event.status !== 'evaluation') {
      alert(`Event Not Ready for Award\n\nEvent ${event.eventNumber} is in ${event.status} status.\n\nAwards can only be made from EVALUATION status after all bids have been scored.`);
      return;
    }

    if (!event.currentBestBid) {
      alert('No Bids to Award\n\nThis event has no valid bids. Consider:\n- Extending the deadline\n- Inviting more suppliers\n- Revising requirements\n- Cancelling and re-issuing');
      return;
    }

    alert(`Award Sourcing Event: ${event.eventNumber}\n\nEVALUATION SUMMARY:\nTotal Responses: ${event.responsesReceived}\nQualified Bids: ${Math.floor(event.responsesReceived * 0.6)}\nShortlisted: ${Math.min(3, event.responsesReceived)}\n\nRECOMMENDED WINNER:\n[View bid responses to see top-ranked supplier]\n\nBest Bid: $${event.currentBestBid ? (event.currentBestBid / 1000000).toFixed(2) : '0'}M\nEstimated Value: $${(event.estimatedValue / 1000000).toFixed(2)}M\nSavings: $${event.savingsEstimate ? (event.savingsEstimate / 1000).toFixed(0) : '0'}K (${event.savingsEstimate && event.estimatedValue ? ((event.savingsEstimate / event.estimatedValue) * 100).toFixed(1) : '0'}%)\n\nAWARD PROCESS:\n\n1. Verify Evaluation Complete:\n   □ All bids scored\n   □ Technical evaluation approved\n   □ Commercial evaluation approved\n   □ Conflict of interest checks done\n   □ References checked\n\n2. Award Justification:\n   □ Document selection rationale\n   □ Explain why winner chosen\n   □ Address any concerns\n   □ Compare to alternatives\n\n3. Approvals Required:\n   ${event.estimatedValue > 1000000 ? '□ Procurement Director\n   □ CFO\n   □ CEO' : event.estimatedValue > 500000 ? '□ Procurement Director\n   □ CFO' : '□ Category Manager\n   □ Procurement Manager'}\n\n4. Supplier Notifications:\n   - Winner: Award letter with PO\n   - Shortlisted: Regret letter with feedback\n   - Others: Standard regret letter\n\n5. Contract Execution:\n   - Issue purchase order\n   - Execute contract (if required)\n   - Supplier onboarding\n   - Performance monitoring setup\n\nREQUIRED DOCUMENTS:\n- Evaluation scorecard (complete)\n- Award justification memo\n- Approval signatures\n- Debriefing notes (if requested)\n\nSelect winning bid from bid responses to proceed with award.');
  };

  const handleCancelEvent = (event: SourcingEvent) => {
    console.log('Cancelling event:', event.id);

    if (event.status === 'awarded') {
      alert('Cannot Cancel Awarded Event\n\nEvent has been awarded. To cancel:\n- Cancel the purchase order\n- Document business reason\n- Notify supplier formally');
      return;
    }

    if (confirm(`Cancel Sourcing Event?\n\nEvent: ${event.eventNumber}\n${event.title}\n\nStatus: ${event.status}\nResponses: ${event.responsesReceived}\n\n${event.responsesReceived > 0 ? '⚠️ WARNING: ' + event.responsesReceived + ' suppliers have submitted responses.\nCancellation will require formal notification and explanation.\n\n' : ''}This action:\n- Closes the event permanently\n- Notifies all participants\n- Cannot be undone\n\nReason for cancellation required.\n\nProceed with cancellation?`)) {
      alert(`Event Cancellation Process\n\nEvent ${event.eventNumber} marked for cancellation.\n\nREQUIRED INFORMATION:\n\n1. Cancellation Reason:\n   - Requirements changed\n   - Budget not approved\n   - Business need eliminated\n   - Insufficient responses\n   - Technical issues\n   - Other (specify)\n\n2. Impact Assessment:\n   - Suppliers to notify: ${event.responsesReceived > 0 ? event.responsesReceived + ' (submitted bids)' : event.participantsInvited + ' (invited)'}\n   - Debriefing required: ${event.responsesReceived > 0 ? 'Yes' : 'No'}\n   - Compensation due: None (standard T&Cs)\n\n3. Communication Plan:\n   ${event.responsesReceived > 0 ? '- Send formal cancellation letter\n   - Offer debriefing calls\n   - Document in supplier records\n   - Update supplier scorecard' : '- Send brief notification\n   - Update supplier portal'}\n\n4. Internal Actions:\n   - Document reason in event log\n   - Update forecast/budget\n   - Plan alternative sourcing (if needed)\n   - Lessons learned session\n\nAPPROVAL:\nCancellation requires ${event.estimatedValue > 500000 ? 'Procurement Director' : 'Category Manager'} approval.\n\nSubmit cancellation request?`);
    }
  };

  const handleViewBid = (bid: BidResponse, event?: SourcingEvent) => {
    console.log('Viewing bid details:', bid.id);

    const statusColor = bid.status === 'awarded' ? '🏆'
      : bid.status === 'shortlisted' ? '⭐'
      : bid.status === 'under-review' ? '🔍'
      : bid.status === 'rejected' ? '❌'
      : '📋';

    alert(`Bid Response Details\n\n${statusColor} STATUS: ${bid.status.toUpperCase()}\n\nSUPPLIER: ${bid.supplier}\nEvent: ${event ? event.eventNumber : bid.eventId}\nSubmitted: ${bid.submittedDate}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOMMERCIAL EVALUATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nBid Amount: $${(bid.bidAmount / 1000000).toFixed(2)}M\nCommercial Score: ${bid.commercialScore}/100\n\nPayment Terms: ${bid.paymentTerms}\nLead Time: ${bid.leadTime} days\nBid Validity: ${bid.validityDays} days\n\nPRICE ANALYSIS:\n${event && event.estimatedValue ? `vs Estimate: ${bid.bidAmount < event.estimatedValue ? '✓ ' + (((event.estimatedValue - bid.bidAmount) / event.estimatedValue) * 100).toFixed(1) + '% below' : '⚠️ ' + (((bid.bidAmount - event.estimatedValue) / event.estimatedValue) * 100).toFixed(1) + '% above'}` : ''}\n${event && event.currentBestBid ? (bid.bidAmount === event.currentBestBid ? '🏆 Current best bid' : `vs Best: ${(((bid.bidAmount - event.currentBestBid) / event.currentBestBid) * 100).toFixed(1)}% higher`) : ''}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTECHNICAL EVALUATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nTechnical Score: ${bid.technicalScore}/100\n${bid.technicalScore >= 90 ? '✓ Excellent technical compliance' : bid.technicalScore >= 75 ? '✓ Good technical compliance' : bid.technicalScore >= 60 ? '⚠️ Acceptable with concerns' : '❌ Below minimum threshold'}\n\nTechnical Breakdown:\n- Compliance with specs: ${bid.technicalScore >= 80 ? 'Full' : 'Partial'}\n- Quality certifications: ${bid.technicalScore >= 85 ? 'Complete' : 'Some missing'}\n- Experience/references: ${bid.technicalScore >= 90 ? 'Excellent' : 'Adequate'}\n- Delivery capability: ${bid.leadTime <= 30 ? 'Excellent' : bid.leadTime <= 45 ? 'Good' : 'Slow'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nOVERALL EVALUATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nOverall Score: ${bid.overallScore}/100\nRank: ${bid.status === 'awarded' ? '#1 - Winner' : bid.status === 'shortlisted' ? 'Top 3' : bid.status === 'under-review' ? 'Under Review' : 'Not Shortlisted'}\n\n${bid.overallScore >= 90 ? '🌟 HIGHLY RECOMMENDED\nExcellent bid - strong technical and commercial\nRecommend for award or shortlist' : bid.overallScore >= 80 ? '✓ RECOMMENDED\nGood bid - meets requirements well\nConsider for shortlist' : bid.overallScore >= 70 ? '⚠️ ACCEPTABLE\nMeets minimum requirements\nMay need clarifications/negotiations' : '❌ NOT RECOMMENDED\nBelow threshold - technical or commercial gaps\nDo not shortlist'}\n\nRECOMMENDED ACTIONS:\n${bid.status === 'submitted' ? '→ Complete evaluation scoring\n→ Verify references\n→ Check compliance documents' : bid.status === 'under-review' ? '→ Finish technical review\n→ Complete commercial analysis\n→ Make shortlist decision' : bid.status === 'shortlisted' ? '→ Schedule clarification meeting\n→ Conduct negotiations\n→ Request best and final offer' : bid.status === 'awarded' ? '→ Issue purchase order\n→ Execute contract\n→ Supplier onboarding' : '→ Send regret letter\n→ Offer debriefing\n→ Update supplier records'}\n\nDocuments: [Technical Proposal] [Price Sheet] [Compliance Matrix] [References]`);
  };

  const handleCompareBids = (event: SourcingEvent) => {
    console.log('Comparing bids for event:', event.id);

    if (event.responsesReceived === 0) {
      alert('No Bids to Compare\n\nThis event has no bid responses yet.');
      return;
    }

    alert(`Bid Comparison Analysis\n\nEvent: ${event.eventNumber}\n${event.title}\n\nRESPONSES RECEIVED: ${event.responsesReceived}/${event.participantsInvited}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCOMPARATIVE ANALYSIS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nPRICE COMPARISON:\nLowest Bid: $${event.currentBestBid ? (event.currentBestBid / 1000000).toFixed(2) : '0'}M\nHighest Bid: $${event.currentBestBid ? ((event.currentBestBid * 1.15) / 1000000).toFixed(2) : '0'}M\nPrice Range: ${event.currentBestBid ? '15%' : '0%'}\nEstimate: $${(event.estimatedValue / 1000000).toFixed(2)}M\n\nQUALITY COMPARISON:\nTop Technical Score: 92-95\nAverage Score: 85\nLowest Qualifying: 75\n\nTOP 3 BIDS (Example):\n\n🥇 RANK 1:\nSupplier: [Best Bidder]\nPrice: $${event.currentBestBid ? (event.currentBestBid / 1000000).toFixed(2) : '0'}M\nTechnical: 92\nCommercial: 88\nOverall: 90.0\nLead Time: 30 days\nStrength: Best overall balance\n\n🥈 RANK 2:\nSupplier: [Second Place]\nPrice: $${event.currentBestBid ? ((event.currentBestBid * 1.03) / 1000000).toFixed(2) : '0'}M\nTechnical: 88\nCommercial: 85\nOverall: 86.5\nLead Time: 35 days\nStrength: Good technical, slightly higher price\n\n🥉 RANK 3:\nSupplier: [Third Place]\nPrice: $${event.currentBestBid ? ((event.currentBestBid * 1.06) / 1000000).toFixed(2) : '0'}M\nTechnical: 85\nCommercial: 82\nOverall: 83.5\nLead Time: 40 days\nStrength: Acceptable, higher price\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nKEY INSIGHTS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n✓ Good Competition: ${event.responsesReceived >= 3 ? event.responsesReceived + ' responses' : 'Limited'}\n✓ Price Competition: ${event.currentBestBid && event.estimatedValue > event.currentBestBid ? 'Achieved savings' : 'At estimate'}\n✓ Quality: ${event.responsesReceived >= 2 ? 'Multiple qualified bidders' : 'Limited options'}\n\nRECOMMENDATION:\n${event.currentBestBid && event.estimatedValue > event.currentBestBid ? '→ Award to top-ranked bidder\n→ Price below estimate with good quality\n→ Competitive outcome achieved' : '→ Consider negotiation with top bidders\n→ Request best and final offers\n→ May need to re-evaluate requirements'}\n\nNEXT STEPS:\n1. Review detailed bid analysis\n2. Conduct reference checks\n3. Negotiate with top 2-3 bidders\n4. Request clarifications if needed\n5. Prepare award recommendation\n\nView detailed bid-by-bid comparison matrix?`);
  };

  const handleMonitorAuction = (auction: AuctionEvent) => {
    console.log('Monitoring auction:', auction.id);

    alert(`Live Auction Monitor\n\nAUCTION: ${auction.eventNumber}\n${auction.title}\n\n${auction.status === 'live' ? '🔴 LIVE NOW' : auction.status === 'upcoming' ? '⏰ STARTS IN ' + auction.timeRemaining : '✓ ENDED'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCURRENT STATUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nTime Remaining: ${auction.timeRemaining}\n${auction.status === 'live' ? (auction.timeRemaining.includes('m') ? '⚠️ Final minutes - watch for last-minute bids!' : '✓ Bidding active') : ''}\n\nPRICE MOVEMENT:\nStarting Price: $${(auction.startPrice / 1000).toFixed(0)}K\nCurrent Price: $${(auction.currentPrice / 1000).toFixed(0)}K ⬇\nReserve Price: $${(auction.reservePrice / 1000).toFixed(0)}K (${auction.currentPrice <= auction.reservePrice ? '✓ Met' : 'Not met'})\nPrice Drop: $${((auction.startPrice - auction.currentPrice) / 1000).toFixed(0)}K (-${(((auction.startPrice - auction.currentPrice) / auction.startPrice) * 100).toFixed(1)}%)\n\nACTIVITY:\nParticipants: ${auction.participants}\nTotal Bids: ${auction.bidsPlaced}\nAvg Bids per Supplier: ${auction.participants > 0 ? (auction.bidsPlaced / auction.participants).toFixed(1) : '0'}\nLast Bid: ${auction.status === 'live' ? '45 seconds ago' : 'N/A'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nBIDDING ANALYSIS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${auction.status === 'live' ? 'Active Bidders: ' + Math.ceil(auction.participants * 0.6) + ' of ' + auction.participants + '\nInactive: ' + Math.floor(auction.participants * 0.4) + ' suppliers\n\nBid Frequency:\n- High activity (last 5 min): ' + Math.floor(auction.bidsPlaced * 0.3) + ' bids\n- Moderate activity: ' + Math.floor(auction.bidsPlaced * 0.5) + ' bids\n- Early bids: ' + Math.floor(auction.bidsPlaced * 0.2) + ' bids\n\nLeading Bidder: Supplier ${Math.floor(Math.random() * auction.participants) + 1}\nBid Count: ' + Math.ceil(auction.bidsPlaced / auction.participants) + ' bids' : 'Auction ' + auction.status}\n\nSAVINGS TRACKING:\nCurrent Savings: $${(auction.savings / 1000).toFixed(0)}K\nSavings vs Start: ${((auction.savings / auction.startPrice) * 100).toFixed(1)}%\n${auction.currentPrice <= auction.reservePrice ? '✓ Reserve price achieved' : '⚠️ ' + (((auction.currentPrice - auction.reservePrice) / auction.reservePrice) * 100).toFixed(1) + '% above reserve'}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nAUCTION CONTROLS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${auction.status === 'live' ? '⏯️ Pause Auction (emergency only)\n🔔 Send Message to Bidders\n⏰ Extend Time (anti-sniping: auto +5min if bid in last 2min)\n📊 View Live Bid Log\n💬 Monitor Q&A' : auction.status === 'upcoming' ? '▶️ Start Auction Now\n⏰ Delay Start Time\n📧 Send Reminder to Participants\n✓ Pre-auction Checklist' : '📊 View Final Results\n🏆 Award to Winner\n📄 Generate Report\n📧 Notify Participants'}\n\n${auction.status === 'live' && auction.currentPrice > auction.reservePrice ? '\n⚠️ RECOMMENDATION:\nCurrent price has not reached reserve.\nOptions:\n- Continue auction (time remaining)\n- Negotiate with leading bidder\n- Reject all bids if reserve not met\n- Consider lowering reserve (requires approval)' : ''}\n\n${auction.status === 'ended' ? '\nFINAL OUTCOME:\n' + (auction.currentPrice <= auction.reservePrice ? '✓ Successful auction\n✓ Reserve price met\n✓ Savings: $' + (auction.savings / 1000).toFixed(0) + 'K\n\nNext: Award to winning bidder' : '⚠️ Reserve price not met\n\nOptions:\n- Negotiate with winner\n- Re-run auction\n- Go to traditional RFQ') : ''}\n\nRefresh rate: Real-time (every 2 seconds)`);
  };

  // Mock data - Sourcing events
  const events: SourcingEvent[] = [
    {
      id: 'EVT001',
      eventNumber: 'RFQ-2025-001',
      title: 'Steel Raw Materials Procurement - Q4 2025',
      type: 'rfq',
      status: 'active',
      category: 'Raw Materials',
      publishDate: '2025-10-15',
      closeDate: '2025-10-30',
      estimatedValue: 2500000,
      participantsInvited: 8,
      responsesReceived: 5,
      currentBestBid: 2280000,
      savingsEstimate: 220000,
      owner: 'Sarah Johnson',
    },
    {
      id: 'EVT002',
      eventNumber: 'RFP-2025-045',
      title: 'IT Infrastructure Services - 3 Year Contract',
      type: 'rfp',
      status: 'evaluation',
      category: 'IT Services',
      publishDate: '2025-09-01',
      closeDate: '2025-10-10',
      estimatedValue: 1800000,
      participantsInvited: 5,
      responsesReceived: 4,
      currentBestBid: 1650000,
      savingsEstimate: 150000,
      owner: 'Michael Chen',
    },
    {
      id: 'EVT003',
      eventNumber: 'AUC-2025-012',
      title: 'Electronic Components - Reverse Auction',
      type: 'auction',
      status: 'awarded',
      category: 'Electronic Components',
      publishDate: '2025-09-20',
      closeDate: '2025-09-20',
      estimatedValue: 950000,
      participantsInvited: 12,
      responsesReceived: 9,
      currentBestBid: 825000,
      savingsEstimate: 125000,
      owner: 'Emily Davis',
    },
    {
      id: 'EVT004',
      eventNumber: 'RFQ-2025-089',
      title: 'Packaging Materials - Annual Supply',
      type: 'rfq',
      status: 'published',
      category: 'Packaging',
      publishDate: '2025-10-20',
      closeDate: '2025-11-05',
      estimatedValue: 680000,
      participantsInvited: 6,
      responsesReceived: 2,
      owner: 'Robert Wilson',
    },
    {
      id: 'EVT005',
      eventNumber: 'RFP-2025-078',
      title: 'Logistics and Transportation Services',
      type: 'rfp',
      status: 'draft',
      category: 'Logistics',
      publishDate: '2025-11-01',
      closeDate: '2025-11-20',
      estimatedValue: 3200000,
      participantsInvited: 10,
      responsesReceived: 0,
      owner: 'Lisa Anderson',
    },
  ];

  // Mock data - Bid responses
  const bids: BidResponse[] = [
    {
      id: 'BID001',
      eventId: 'EVT001',
      supplier: 'Quality Steel Industries',
      bidAmount: 2280000,
      submittedDate: '2025-10-22',
      status: 'shortlisted',
      technicalScore: 92,
      commercialScore: 88,
      overallScore: 90,
      leadTime: 30,
      paymentTerms: 'Net 60',
      validityDays: 90,
    },
    {
      id: 'BID002',
      eventId: 'EVT001',
      supplier: 'Acme Manufacturing Co.',
      bidAmount: 2350000,
      submittedDate: '2025-10-21',
      status: 'under-review',
      technicalScore: 88,
      commercialScore: 85,
      overallScore: 86.5,
      leadTime: 35,
      paymentTerms: 'Net 45',
      validityDays: 60,
    },
    {
      id: 'BID003',
      eventId: 'EVT001',
      supplier: 'Industrial Metals Corp',
      bidAmount: 2420000,
      submittedDate: '2025-10-23',
      status: 'rejected',
      technicalScore: 75,
      commercialScore: 82,
      overallScore: 78.5,
      leadTime: 45,
      paymentTerms: 'Net 30',
      validityDays: 90,
    },
    {
      id: 'BID004',
      eventId: 'EVT002',
      supplier: 'Tech Solutions Inc.',
      bidAmount: 1650000,
      submittedDate: '2025-10-08',
      status: 'awarded',
      technicalScore: 95,
      commercialScore: 90,
      overallScore: 92.5,
      leadTime: 60,
      paymentTerms: 'Net 30',
      validityDays: 120,
    },
    {
      id: 'BID005',
      eventId: 'EVT002',
      supplier: 'Global IT Services',
      bidAmount: 1720000,
      submittedDate: '2025-10-09',
      status: 'shortlisted',
      technicalScore: 90,
      commercialScore: 87,
      overallScore: 88.5,
      leadTime: 45,
      paymentTerms: 'Net 45',
      validityDays: 90,
    },
    {
      id: 'BID006',
      eventId: 'EVT003',
      supplier: 'Global Components Ltd.',
      bidAmount: 825000,
      submittedDate: '2025-09-20',
      status: 'awarded',
      technicalScore: 93,
      commercialScore: 95,
      overallScore: 94,
      leadTime: 20,
      paymentTerms: 'Net 45',
      validityDays: 90,
    },
  ];

  // Mock data - Auction events
  const auctions: AuctionEvent[] = [
    {
      id: 'AUC001',
      eventNumber: 'AUC-2025-023',
      title: 'Machined Parts - Reverse Auction',
      startPrice: 1200000,
      currentPrice: 1050000,
      reservePrice: 980000,
      participants: 7,
      bidsPlaced: 23,
      timeRemaining: '2h 15m',
      status: 'live',
      savings: 150000,
    },
    {
      id: 'AUC002',
      eventNumber: 'AUC-2025-024',
      title: 'Office Supplies - Annual Contract',
      startPrice: 450000,
      currentPrice: 450000,
      reservePrice: 380000,
      participants: 5,
      bidsPlaced: 0,
      timeRemaining: '1d 4h',
      status: 'upcoming',
      savings: 0,
    },
    {
      id: 'AUC003',
      eventNumber: 'AUC-2025-012',
      title: 'Electronic Components Bulk Purchase',
      startPrice: 950000,
      currentPrice: 825000,
      reservePrice: 800000,
      participants: 9,
      bidsPlaced: 47,
      timeRemaining: 'Ended',
      status: 'ended',
      savings: 125000,
    },
    {
      id: 'AUC004',
      eventNumber: 'AUC-2025-025',
      title: 'Maintenance Services - Q1 2026',
      startPrice: 680000,
      currentPrice: 620000,
      reservePrice: 580000,
      participants: 6,
      bidsPlaced: 15,
      timeRemaining: '45m',
      status: 'live',
      savings: 60000,
    },
  ];

  const getEventStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'evaluation': return 'bg-yellow-100 text-yellow-800';
      case 'awarded': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidStatusColor = (status: BidStatus): string => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'awarded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuctionStatusColor = (status: string): string => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderEvents = () => (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'active').length}
              </p>
            </div>
            <FileSearch className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(events.reduce((sum, e) => sum + e.estimatedValue, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + e.participantsInvited, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Est. Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(events.filter(e => e.savingsEstimate).reduce((sum, e) => sum + (e.savingsEstimate || 0), 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estimated Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Best Bid</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Savings</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileSearch className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.eventNumber}</div>
                        <div className="text-xs text-gray-500">{event.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 uppercase">
                      {event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <div>
                        <div>{event.publishDate}</div>
                        <div className="text-xs">to {event.closeDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(event.estimatedValue / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.responsesReceived} / {event.participantsInvited}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {event.currentBestBid ? `$${(event.currentBestBid / 1000000).toFixed(2)}M` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {event.savingsEstimate ? `$${(event.savingsEstimate / 1000).toFixed(0)}K` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.owner}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewEventDetails(event)}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs"
                        title="View Details"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </button>
                      {event.status === 'draft' && (
                        <button
                          onClick={() => handlePublishEvent(event)}
                          className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-xs"
                          title="Publish Event"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Publish
                        </button>
                      )}
                      {(event.status === 'active' || event.status === 'published') && (
                        <button
                          onClick={() => handleCloseEvent(event)}
                          className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors text-xs"
                          title="Close Event"
                        >
                          <StopCircle className="h-3 w-3 mr-1" />
                          Close
                        </button>
                      )}
                      {event.status === 'evaluation' && (
                        <button
                          onClick={() => handleAwardEvent(event)}
                          className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-xs"
                          title="Award Event"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          Award
                        </button>
                      )}
                      {event.responsesReceived > 0 && (
                        <button
                          onClick={() => handleCompareBids(event)}
                          className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-xs"
                          title="Compare Bids"
                        >
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Compare
                        </button>
                      )}
                      {event.status !== 'awarded' && event.status !== 'cancelled' && (
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs"
                          title="Edit Event"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBids = () => (
    <div className="space-y-4">
      {/* Bid Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
            </div>
            <FileSearch className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">
                {bids.filter(b => b.status === 'shortlisted').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Awarded</p>
              <p className="text-2xl font-bold text-gray-900">
                {bids.filter(b => b.status === 'awarded').length}
              </p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {(bids.reduce((sum, b) => sum + b.overallScore, 0) / bids.length).toFixed(1)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Bids Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Bid Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Technical</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Commercial</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Overall</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Lead Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Terms</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bids.map((bid) => {
                const eventData = events.find(e => e.id === bid.eventId);
                return (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {events.find(e => e.id === bid.eventId)?.eventNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bid.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${(bid.bidAmount / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.submittedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBidStatusColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${bid.technicalScore >= 90 ? 'bg-green-500' : bid.technicalScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${bid.technicalScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{bid.technicalScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${bid.commercialScore >= 90 ? 'bg-green-500' : bid.commercialScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${bid.commercialScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{bid.commercialScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${bid.overallScore >= 90 ? 'text-green-600' : bid.overallScore >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {bid.overallScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.leadTime} days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.paymentTerms}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewBid(bid, eventData)}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs"
                      title="View Bid Details"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAuctions = () => (
    <div className="space-y-4">
      {/* Auction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Live Auctions</p>
              <p className="text-2xl font-bold text-gray-900">
                {auctions.filter(a => a.status === 'live').length}
              </p>
            </div>
            <Gavel className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">
                {auctions.reduce((sum, a) => sum + a.bidsPlaced, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {auctions.reduce((sum, a) => sum + a.participants, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(auctions.reduce((sum, a) => sum + a.savings, 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Auctions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {auctions.map((auction) => (
          <div key={auction.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`p-4 ${auction.status === 'live' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : auction.status === 'upcoming' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-gray-600 to-slate-600'} text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Gavel className="h-5 w-5" />
                  <h3 className="font-bold">{auction.eventNumber}</h3>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${getAuctionStatusColor(auction.status)} bg-white bg-opacity-90`}>
                  {auction.status}
                </span>
              </div>
              <p className="text-sm">{auction.title}</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Start Price:</span>
                <span className="text-sm font-medium text-gray-900">${(auction.startPrice / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Price:</span>
                <span className="text-lg font-bold text-green-600">${(auction.currentPrice / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reserve Price:</span>
                <span className="text-sm font-medium text-gray-900">${(auction.reservePrice / 1000).toFixed(0)}K</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Participants:</span>
                  <span className="text-sm font-medium text-gray-900">{auction.participants}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Bids Placed:</span>
                  <span className="text-sm font-medium text-gray-900">{auction.bidsPlaced}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Time Remaining:</span>
                  <span className={`text-sm font-bold ${auction.status === 'live' ? 'text-red-600' : 'text-gray-900'}`}>
                    {auction.timeRemaining}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Savings:</span>
                  <span className="text-sm font-bold text-green-600">${(auction.savings / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <button
                onClick={() => handleMonitorAuction(auction)}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  auction.status === 'live'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : auction.status === 'upcoming'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
                title={auction.status === 'live' ? 'Monitor Live Auction' : auction.status === 'upcoming' ? 'View Auction Details' : 'View Results'}
              >
                {auction.status === 'live' ? (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Monitor Live Auction</span>
                  </>
                ) : auction.status === 'upcoming' ? (
                  <>
                    <Clock className="h-4 w-4" />
                    <span>View Details</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>View Results</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gavel className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Sourcing Events</h2>
              <p className="text-blue-100">RFQs, RFPs, and reverse auctions for competitive sourcing</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCreateEvent}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              title="Create New Sourcing Event"
            >
              <Plus className="h-4 w-4" />
              <span>New Event</span>
            </button>
            <button
              onClick={handleExportEvents}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Export Sourcing Report"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Refresh Events"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              title="Sourcing Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveView('events')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'events'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileSearch className="h-4 w-4" />
            <span>Events</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('bids')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'bids'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Bid Responses</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('auctions')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'auctions'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Gavel className="h-4 w-4" />
            <span>Auctions</span>
          </div>
        </button>
      </div>

      {/* Content */}
      {activeView === 'events' && renderEvents()}
      {activeView === 'bids' && renderBids()}
      {activeView === 'auctions' && renderAuctions()}
    </div>
  );
};

export default SourcingEvents;
