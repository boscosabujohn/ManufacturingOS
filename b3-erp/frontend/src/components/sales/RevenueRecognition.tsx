'use client'

import { useState } from 'react'
import { DollarSign, Calendar, TrendingUp, CheckCircle, Clock, Download, RefreshCw, Settings, Eye, Edit, Plus, FileText } from 'lucide-react'

export interface RevenueSchedule {
  orderId: string;
  customer: string;
  totalRevenue: number;
  recognizedRevenue: number;
  deferredRevenue: number;
  recognitionMethod: 'point-in-time' | 'over-time' | 'percentage-completion';
  startDate: string;
  completionDate: string;
  percentComplete: number;
}

export default function RevenueRecognition() {
  const [schedules] = useState<RevenueSchedule[]>([
    { orderId: 'SO-2025-234', customer: 'ABC Manufacturing', totalRevenue: 28025000, recognizedRevenue: 18216250, deferredRevenue: 9808750, recognitionMethod: 'percentage-completion', startDate: '2025-10-12', completionDate: '2025-11-15', percentComplete: 65 },
    { orderId: 'SO-2025-235', customer: 'XYZ Industries', totalRevenue: 19912500, recognizedRevenue: 8956125, deferredRevenue: 10956375, recognitionMethod: 'over-time', startDate: '2025-10-15', completionDate: '2025-11-20', percentComplete: 45 },
    { orderId: 'SO-2025-237', customer: 'Global Exports', totalRevenue: 11328000, recognizedRevenue: 11328000, deferredRevenue: 0, recognitionMethod: 'point-in-time', startDate: '2025-10-08', completionDate: '2025-10-20', percentComplete: 100 }
  ]);

  const formatCurrency = (amount: number) => `₹${(amount / 10000000).toFixed(2)}Cr`;

  // Handler functions
  const handleRefresh = () => {
    console.log('Refreshing revenue recognition data...');
    alert('Refreshing Revenue Recognition Schedules...\n\nRecalculating recognition amounts based on:\n- Project completion percentages\n- Delivery milestones\n- Contract terms\n- Time-based recognition rules\n\nUpdating deferred revenue balances.\nSyncing with accounting system.\n\nEstimated time: 15 seconds');
  };

  const handleSettings = () => {
    console.log('Opening revenue recognition settings...');
    alert('Revenue Recognition Settings\n\nConfigure:\n- Recognition methods and policies\n  • Point-in-time (delivery-based)\n  • Over-time (subscription-based)\n  • Percentage-of-completion (project-based)\n- Accounting standards (ASC 606, IFRS 15)\n- Performance obligation rules\n- Contract modification handling\n- Milestone definitions\n- Automated journal entry posting\n- Audit trail requirements\n\nCompliance:\n- GAAP/IFRS revenue recognition standards\n- SOX controls and documentation\n- Multi-element arrangement allocation');
  };

  const handleExport = () => {
    console.log('Exporting revenue recognition report...');
    alert('Exporting Revenue Recognition Report to Excel...\n\nIncludes:\n- All revenue schedules by order\n- Recognized vs. deferred breakdown\n- Recognition method analysis\n- Monthly revenue waterfall\n- Deferred revenue aging\n- Revenue forecast by completion date\n- Journal entry details\n- Audit documentation\n\nCompliance Reports:\n- ASC 606 disclosure schedules\n- Contract asset/liability roll-forward\n- Disaggregated revenue analysis');
  };

  const handleNewSchedule = () => {
    console.log('Creating new revenue schedule...');
    alert('Create Revenue Recognition Schedule\n\nSteps:\n1. Select sales order or contract\n2. Define performance obligations:\n   - Product delivery\n   - Service delivery\n   - Warranty/support\n   - License grants\n\n3. Choose recognition method:\n   - Point-in-time: Revenue recognized at delivery\n   - Over-time: Ratable over contract period\n   - % Completion: Based on project milestones\n\n4. Set milestone schedule:\n   - Define completion criteria\n   - Set recognition dates\n   - Allocate transaction price\n\n5. Configure automation:\n   - Auto-calculate based on % complete\n   - Post GL entries automatically\n   - Alert on recognition events\n\nNote: Schedules require finance manager approval.');
  };

  const handleViewDetails = (schedule: RevenueSchedule) => {
    const methodDescription =
      schedule.recognitionMethod === 'point-in-time'
        ? 'Revenue recognized in full upon delivery and customer acceptance.'
      : schedule.recognitionMethod === 'over-time'
        ? 'Revenue recognized ratably over the contract term based on time elapsed.'
      : 'Revenue recognized based on percentage of project completion (cost-to-cost or milestones).';

    const daysElapsed = Math.floor((new Date().getTime() - new Date(schedule.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((new Date(schedule.completionDate).getTime() - new Date(schedule.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = totalDays - daysElapsed;

    alert(`Revenue Recognition Details: ${schedule.orderId}\n\nCUSTOMER: ${schedule.customer}\n\nTOTAL CONTRACT VALUE: ${formatCurrency(schedule.totalRevenue)}\n\nREVENUE BREAKDOWN:\n✓ Recognized: ${formatCurrency(schedule.recognizedRevenue)} (${schedule.percentComplete}%)\n⏳ Deferred: ${formatCurrency(schedule.deferredRevenue)} (${100 - schedule.percentComplete}%)\n\nRECOGNITION METHOD: ${schedule.recognitionMethod.replace('-', ' ').toUpperCase()}\n${methodDescription}\n\nTIMELINE:\n- Start Date: ${schedule.startDate}\n- Completion Date: ${schedule.completionDate}\n- Days Elapsed: ${daysElapsed} / ${totalDays}\n- Days Remaining: ${daysRemaining}\n\nPERFORMANCE OBLIGATIONS:\n1. Product Delivery: ${schedule.percentComplete >= 60 ? '✓ Complete' : schedule.percentComplete >= 30 ? '⏳ In Progress' : '⏱ Pending'}\n2. Installation Services: ${schedule.percentComplete >= 80 ? '✓ Complete' : schedule.percentComplete >= 50 ? '⏳ In Progress' : '⏱ Pending'}\n3. Training & Support: ${schedule.percentComplete === 100 ? '✓ Complete' : schedule.percentComplete >= 70 ? '⏳ In Progress' : '⏱ Pending'}\n\nNEXT RECOGNITION EVENT:\n${schedule.percentComplete === 100 ? 'All revenue recognized' : `Estimated ${formatCurrency(schedule.deferredRevenue * 0.3)} in ${Math.ceil(daysRemaining / 2)} days based on project progress`}`);
  };

  const handleEditSchedule = (schedule: RevenueSchedule) => {
    if (schedule.percentComplete === 100) {
      alert(`Revenue schedule ${schedule.orderId} is fully complete.\n\nCompleted revenue schedules cannot be edited.\n\nIf adjustments are needed, please:\n1. Contact finance manager for approval\n2. Create revenue adjustment journal entry\n3. Document reason for change (audit trail)`);
      return;
    }

    alert(`Edit Revenue Schedule: ${schedule.orderId}\n\nCustomer: ${schedule.customer}\nCurrent Progress: ${schedule.percentComplete}%\n\nEditable Fields:\n- Completion percentage (updates recognized/deferred amounts)\n- Milestone dates (adjusts recognition timeline)\n- Recognition method (requires re-calculation)\n- Performance obligation split\n\nIMPORTANT:\n- Changes will recalculate revenue amounts\n- GL reversals may be required for prior periods\n- Finance manager approval needed for material changes\n- All modifications are logged for SOX compliance\n\nProceed with caution - consult accounting team for guidance.`);
  };

  const handleRecognizeRevenue = (schedule: RevenueSchedule) => {
    if (schedule.percentComplete === 100) {
      alert(`Revenue for ${schedule.orderId} is already fully recognized.\n\nNo action needed.`);
      return;
    }

    if (schedule.deferredRevenue === 0) {
      alert(`No deferred revenue remaining for ${schedule.orderId}.`);
      return;
    }

    alert(`Manual Revenue Recognition: ${schedule.orderId}\n\nCurrent Status:\n- Total Revenue: ${formatCurrency(schedule.totalRevenue)}\n- Recognized: ${formatCurrency(schedule.recognizedRevenue)} (${schedule.percentComplete}%)\n- Deferred: ${formatCurrency(schedule.deferredRevenue)}\n\nTrigger Recognition Event:\n\n1. Milestone Completion:\n   - Mark milestone as achieved\n   - Recognize allocated revenue amount\n   - Update % complete\n\n2. Delivery Confirmation:\n   - Upload delivery receipt/acceptance\n   - Recognize revenue per contract terms\n   - Generate customer invoice\n\n3. Time-Based Recognition:\n   - Calculate elapsed time\n   - Recognize pro-rata amount\n   - Schedule next recognition\n\nGENERATE JOURNAL ENTRY:\nDR Deferred Revenue\nCR Revenue\n\nNote: All recognition events require supporting documentation and approval per revenue recognition policy.`);
  };

  const handleViewJournalEntries = (schedule: RevenueSchedule) => {
    alert(`Journal Entries: ${schedule.orderId}\n\nREVENUE RECOGNITION ENTRIES:\n\nEntry 1 - Initial Booking (${schedule.startDate}):\nDR Accounts Receivable     ${formatCurrency(schedule.totalRevenue)}\n   CR Revenue (Deferred)   ${formatCurrency(schedule.totalRevenue)}\nMemo: Initial order booking - deferred\n\nEntry 2 - Progressive Recognition:\n${Array.from({ length: Math.ceil(schedule.percentComplete / 25) }, (_, i) => {
      const pct = Math.min((i + 1) * 25, schedule.percentComplete);
      const amt = schedule.totalRevenue * (pct / 100) - (i > 0 ? schedule.totalRevenue * (i * 25 / 100) : 0);
      return `DR Deferred Revenue        ${formatCurrency(amt)}\n   CR Revenue (Earned)     ${formatCurrency(amt)}\nMemo: ${pct}% completion milestone achieved`;
    }).join('\n\n')}\n\nCURRENT BALANCE SHEET IMPACT:\n- Deferred Revenue (Liability): ${formatCurrency(schedule.deferredRevenue)}\n- Accounts Receivable (Asset): ${formatCurrency(schedule.totalRevenue - schedule.recognizedRevenue)}\n\nINCOME STATEMENT IMPACT:\n- Revenue Recognized (P&L): ${formatCurrency(schedule.recognizedRevenue)}\n\nAll entries posted to GL and available in accounting system.`);
  };

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-emerald-600" />
              Revenue Recognition
            </h2>
            <p className="text-gray-600 mt-1">Track revenue recognition schedules and compliance (ASC 606 / IFRS 15)</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleNewSchedule}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              title="Create New Revenue Schedule"
            >
              <Plus className="h-4 w-4" />
              <span>New Schedule</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh Revenue Data"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Recognition Settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Export Revenue Report"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Schedules ({schedules.length})</h3>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div key={schedule.orderId} className="p-5 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{schedule.orderId}</h4>
                    <p className="text-sm text-gray-600 mt-1">{schedule.customer}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                    {schedule.recognitionMethod.replace('-', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Total Revenue</p>
                    <p className="text-lg font-bold text-blue-900">{formatCurrency(schedule.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Recognized</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(schedule.recognizedRevenue)}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600 font-medium">Deferred</p>
                    <p className="text-lg font-bold text-yellow-900">{formatCurrency(schedule.deferredRevenue)}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Completion Progress</span>
                    <span className="text-sm font-bold text-gray-900">{schedule.percentComplete}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${schedule.percentComplete === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${schedule.percentComplete}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{schedule.startDate} to {schedule.completionDate}</span>
                  </div>
                  {schedule.percentComplete === 100 ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">In Progress</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(schedule)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    title="View Schedule Details"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  {schedule.percentComplete < 100 && (
                    <>
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleRecognizeRevenue(schedule)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        title="Recognize Revenue"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Recognize Revenue</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleViewJournalEntries(schedule)}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    title="View Journal Entries"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Journal Entries</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
