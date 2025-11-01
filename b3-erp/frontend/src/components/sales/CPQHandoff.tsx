'use client'

import { useState } from 'react'
import { Link2, CheckCircle, ArrowRight, Package, FileText, Download, RefreshCw, Settings, Eye, AlertCircle, Plus, PlayCircle } from 'lucide-react'

export interface CPQHandoff {
  id: string;
  cpqQuoteId: string;
  salesOrderId: string;
  customer: string;
  totalAmount: number;
  handoffDate: string;
  status: 'synced' | 'in-progress' | 'failed';
  items: number;
}

export default function CPQHandoff() {
  const [handoffs] = useState<CPQHandoff[]>([
    { id: 'H-001', cpqQuoteId: 'CPQ-2025-123', salesOrderId: 'SO-2025-234', customer: 'ABC Manufacturing', totalAmount: 28025000, handoffDate: '2025-10-10', status: 'synced', items: 10 },
    { id: 'H-002', cpqQuoteId: 'CPQ-2025-124', salesOrderId: 'SO-2025-235', customer: 'XYZ Industries', totalAmount: 19912500, handoffDate: '2025-10-15', status: 'in-progress', items: 5 },
    { id: 'H-003', cpqQuoteId: 'CPQ-2025-125', salesOrderId: 'SO-2025-237', customer: 'Global Exports', totalAmount: 11328000, handoffDate: '2025-10-05', status: 'synced', items: 8 }
  ]);

  const getStatusColor = (status: string) => {
    return status === 'synced' ? 'bg-green-100 text-green-700' : status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  };

  const formatCurrency = (amount: number) => `₹${(amount / 10000000).toFixed(2)}Cr`;

  // Handler functions
  const handleRefresh = () => {
    console.log('Refreshing CPQ handoff data...');
    alert('Refreshing CPQ Integration Status...\n\nSyncing latest handoffs from CPQ system.\nChecking for pending quotes ready for conversion.\nUpdating order synchronization status.\n\nEstimated time: 10 seconds');
  };

  const handleSettings = () => {
    console.log('Opening CPQ integration settings...');
    alert('CPQ Integration Settings\n\nConfigure:\n- CPQ system connection (API endpoint, credentials)\n- Auto-sync rules and schedules\n- Field mapping (CPQ → ERP)\n- Approval workflows\n- Handoff notifications\n- Error handling and retry logic\n- Data validation rules\n\nSupported CPQ Systems:\n- Salesforce CPQ\n- Oracle CPQ Cloud\n- SAP CPQ\n- Custom CPQ solutions via REST API');
  };

  const handleExport = () => {
    console.log('Exporting CPQ handoff report...');
    alert('Exporting CPQ Integration Report to Excel...\n\nIncludes:\n- All handoff records and statuses\n- Quote to order conversion timeline\n- Sync success/failure rates\n- Data validation errors\n- Revenue transferred to ERP\n- Integration performance metrics\n- Audit trail for compliance');
  };

  const handleNewHandoff = () => {
    console.log('Creating manual CPQ handoff...');
    alert('Create Manual CPQ Handoff\n\nWhen to use:\n- Emergency order creation\n- CPQ system downtime\n- Special quote scenarios\n\nSteps:\n1. Select approved CPQ quote\n2. Validate line items and pricing\n3. Map customer and product data\n4. Review terms and conditions\n5. Create sales order in ERP\n6. Link CPQ quote to order\n\nNote: Manual handoffs require manager approval.');
  };

  const handleViewDetails = (handoff: CPQHandoff) => {
    const statusDetail = handoff.status === 'synced'
      ? 'Successfully synchronized to ERP. Sales order created and active.'
      : handoff.status === 'in-progress'
      ? 'Synchronization in progress. Waiting for data validation and approval.'
      : 'Synchronization failed. Check error logs for details.';

    alert(`CPQ Handoff Details: ${handoff.id}\n\nCUSTOMER: ${handoff.customer}\n\nCPQ QUOTE: ${handoff.cpqQuoteId}\nSALES ORDER: ${handoff.salesOrderId}\n\nHandoff Date: ${handoff.handoffDate}\nTotal Amount: ${formatCurrency(handoff.totalAmount)}\nLine Items: ${handoff.items}\n\nSTATUS: ${handoff.status.toUpperCase()}\n${statusDetail}\n\nINTEGRATION WORKFLOW:\n1. Quote approved in CPQ ✓\n2. Data validation ${handoff.status !== 'failed' ? '✓' : '✗'}\n3. Customer/product mapping ${handoff.status === 'synced' ? '✓' : '...'}\n4. Sales order creation ${handoff.status === 'synced' ? '✓' : '...'}\n5. Inventory allocation ${handoff.status === 'synced' ? '✓' : '...'}\n6. Finance system sync ${handoff.status === 'synced' ? '✓' : '...'}`);
  };

  const handleRetrySync = (handoff: CPQHandoff) => {
    if (handoff.status === 'synced') {
      alert(`Handoff ${handoff.id} is already synced.\n\nNo retry needed. Sales order ${handoff.salesOrderId} is active in the system.`);
      return;
    }

    if (confirm(`Retry synchronization for ${handoff.id}?\n\nQuote: ${handoff.cpqQuoteId}\nCustomer: ${handoff.customer}\n\nThis will reattempt the CPQ to ERP handoff process.`)) {
      console.log('Retrying sync for:', handoff);
      alert(`Retrying CPQ Handoff: ${handoff.id}\n\nRe-executing integration workflow:\n- Validating quote data\n- Mapping to ERP fields\n- Creating sales order\n- Allocating inventory\n\nMonitor status in real-time.\nYou will be notified upon completion.`);
    }
  };

  const handleViewMapping = (handoff: CPQHandoff) => {
    alert(`Field Mapping: ${handoff.id}\n\nCPQ QUOTE → ERP SALES ORDER\n\nCustomer Data:\n- CPQ Account → ERP Customer Master\n- Bill-to Address → Billing Address\n- Ship-to Address → Shipping Address\n- Payment Terms → Payment Terms\n\nLine Item Data:\n- CPQ Product Code → ERP Material Code\n- Quantity → Order Quantity\n- Unit Price → Selling Price\n- Discount % → Discount\n- Total → Line Total\n\nPricing:\n- Base Price: ${formatCurrency(handoff.totalAmount * 0.85)}\n- Discounts: ${formatCurrency(handoff.totalAmount * 0.10)}\n- Taxes: ${formatCurrency(handoff.totalAmount * 0.05)}\n- Grand Total: ${formatCurrency(handoff.totalAmount)}\n\nCustom Fields:\n- CPQ Config ID → Order Config Reference\n- Sales Rep → Account Manager\n- Quote Valid Until → Order Expiry Date`);
  };

  const handleViewErrors = (handoff: CPQHandoff) => {
    if (handoff.status !== 'failed') {
      alert(`No errors for handoff ${handoff.id}.\n\nStatus: ${handoff.status.toUpperCase()}\n\nAll validation checks passed.`);
      return;
    }

    alert(`Integration Errors: ${handoff.id}\n\nERROR LOG:\n\n1. Customer Validation Error\n   - CPQ Account "Acme Corp" not found in ERP\n   - Action: Create customer master or map to existing\n\n2. Product Code Mismatch\n   - CPQ Product "PROD-XYZ-789" not in ERP catalog\n   - Action: Update product mapping table\n\n3. Pricing Validation Failed\n   - Discount 25% exceeds approval limit (20%)\n   - Action: Get manager approval for discount\n\n4. Inventory Allocation Error\n   - Insufficient stock for item "Widget-A" (need 100, available 75)\n   - Action: Adjust quantity or schedule production\n\nRECOMMENDATIONS:\n- Fix data issues in CPQ or ERP\n- Update integration mapping rules\n- Retry sync after corrections\n- Contact integration support if issues persist`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Link2 className="h-8 w-8 text-cyan-600" />
              CPQ Integration & Handoff
            </h2>
            <p className="text-gray-600 mt-1">Seamless transition from quotes to orders</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleNewHandoff}
              className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              title="Create Manual Handoff"
            >
              <Plus className="h-4 w-4" />
              <span>Manual Handoff</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh CPQ Status"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Integration Settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Export Integration Report"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
          <h3 className="text-lg font-semibold text-gray-900">CPQ Handoffs ({handoffs.length})</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {handoffs.map((handoff) => (
              <div key={handoff.id} className="p-5 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{handoff.customer}</h4>
                    <p className="text-sm text-gray-600 mt-1">{handoff.handoffDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(handoff.status)}`}>
                    {handoff.status.toUpperCase()}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">CPQ Quote</p>
                        <p className="font-bold text-gray-900">{handoff.cpqQuoteId}</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Sales Order</p>
                        <p className="font-bold text-gray-900">{handoff.salesOrderId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Items</p>
                    <p className="text-xl font-bold text-blue-900">{handoff.items}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Total Amount</p>
                    <p className="text-xl font-bold text-green-900">{formatCurrency(handoff.totalAmount)}</p>
                  </div>
                </div>

                {handoff.status === 'synced' && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-700">Successfully synced to ERP system</p>
                  </div>
                )}

                {handoff.status === 'failed' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-700">Synchronization failed - click "View Errors" for details</p>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(handoff)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    title="View Handoff Details"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => handleViewMapping(handoff)}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    title="View Field Mapping"
                  >
                    <Link2 className="h-4 w-4" />
                    <span>Field Mapping</span>
                  </button>
                  {handoff.status !== 'synced' && (
                    <button
                      onClick={() => handleRetrySync(handoff)}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      title="Retry Synchronization"
                    >
                      <PlayCircle className="h-4 w-4" />
                      <span>Retry Sync</span>
                    </button>
                  )}
                  {handoff.status === 'failed' && (
                    <button
                      onClick={() => handleViewErrors(handoff)}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="View Error Details"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>View Errors</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
