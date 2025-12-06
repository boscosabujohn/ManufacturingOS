'use client';

import React, { useState } from 'react';
import {
  Check,
  X,
  AlertTriangle,
  AlertCircle,
  Package,
  FileText,
  Receipt,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Link2,
  Unlink,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

// Types
export type MatchStatus = 'matched' | 'partial' | 'mismatch' | 'pending' | 'exception';

export interface DocumentLine {
  lineNumber: number;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  uom: string;
}

export interface PurchaseOrderDoc {
  id: string;
  number: string;
  date: string;
  vendor: string;
  lines: DocumentLine[];
  totalAmount: number;
  currency: string;
}

export interface GoodsReceiptDoc {
  id: string;
  number: string;
  date: string;
  receivedBy: string;
  lines: (DocumentLine & { receivedQty: number; acceptedQty: number; rejectedQty: number })[];
  totalAmount: number;
}

export interface InvoiceDoc {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  lines: DocumentLine[];
  totalAmount: number;
  taxAmount: number;
}

export interface MatchingResult {
  lineNumber: number;
  itemCode: string;
  description: string;
  poQty: number;
  grQty: number;
  invoiceQty: number;
  poPrice: number;
  invoicePrice: number;
  status: MatchStatus;
  variance: {
    quantity: number;
    price: number;
    total: number;
  };
  issues: string[];
}

export interface ThreeWayMatch {
  id: string;
  purchaseOrder: PurchaseOrderDoc;
  goodsReceipt: GoodsReceiptDoc;
  invoice: InvoiceDoc;
  matchingResults: MatchingResult[];
  overallStatus: MatchStatus;
  tolerance: {
    quantity: number; // percentage
    price: number; // percentage
  };
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

interface GoodsReceiptMatchingProps {
  match?: ThreeWayMatch;
  onApprove?: (matchId: string) => void;
  onReject?: (matchId: string, reason: string) => void;
  onCreateException?: (matchId: string, lineNumbers: number[]) => void;
  onAdjust?: (matchId: string, adjustments: Record<number, { field: string; value: number }>) => void;
}

// Sample data
const sampleMatch: ThreeWayMatch = {
  id: 'MATCH-2024-001',
  overallStatus: 'partial',
  tolerance: {
    quantity: 5, // 5% tolerance
    price: 2, // 2% tolerance
  },
  createdAt: '2024-01-18T10:30:00Z',
  purchaseOrder: {
    id: 'PO-2024-001234',
    number: 'PO-2024-001234',
    date: '2024-01-10',
    vendor: 'Precision Components Inc.',
    currency: 'USD',
    totalAmount: 12575.00,
    lines: [
      { lineNumber: 1, itemCode: 'CNC-TOOL-001', description: 'Carbide End Mill 10mm', quantity: 50, unitPrice: 45.50, totalAmount: 2275.00, uom: 'EA' },
      { lineNumber: 2, itemCode: 'CNC-TOOL-002', description: 'Ball Nose Cutter 8mm', quantity: 30, unitPrice: 62.00, totalAmount: 1860.00, uom: 'EA' },
      { lineNumber: 3, itemCode: 'CNC-INSERT-001', description: 'Turning Insert CNMG', quantity: 100, unitPrice: 28.50, totalAmount: 2850.00, uom: 'EA' },
      { lineNumber: 4, itemCode: 'CNC-HOLDER-001', description: 'Tool Holder BT40', quantity: 5, unitPrice: 385.00, totalAmount: 1925.00, uom: 'EA' },
      { lineNumber: 5, itemCode: 'CNC-COOL-001', description: 'Coolant Nozzle Assembly', quantity: 10, unitPrice: 166.50, totalAmount: 1665.00, uom: 'SET' },
      { lineNumber: 6, itemCode: 'CNC-ALIGN-001', description: 'Alignment Fixture Kit', quantity: 2, unitPrice: 1000.00, totalAmount: 2000.00, uom: 'KIT' },
    ],
  },
  goodsReceipt: {
    id: 'GRN-2024-000456',
    number: 'GRN-2024-000456',
    date: '2024-01-17',
    receivedBy: 'Mike Wilson',
    totalAmount: 12387.50,
    lines: [
      { lineNumber: 1, itemCode: 'CNC-TOOL-001', description: 'Carbide End Mill 10mm', quantity: 50, unitPrice: 45.50, totalAmount: 2275.00, uom: 'EA', receivedQty: 50, acceptedQty: 50, rejectedQty: 0 },
      { lineNumber: 2, itemCode: 'CNC-TOOL-002', description: 'Ball Nose Cutter 8mm', quantity: 30, unitPrice: 62.00, totalAmount: 1860.00, uom: 'EA', receivedQty: 28, acceptedQty: 28, rejectedQty: 0 },
      { lineNumber: 3, itemCode: 'CNC-INSERT-001', description: 'Turning Insert CNMG', quantity: 100, unitPrice: 28.50, totalAmount: 2850.00, uom: 'EA', receivedQty: 100, acceptedQty: 97, rejectedQty: 3 },
      { lineNumber: 4, itemCode: 'CNC-HOLDER-001', description: 'Tool Holder BT40', quantity: 5, unitPrice: 385.00, totalAmount: 1925.00, uom: 'EA', receivedQty: 5, acceptedQty: 5, rejectedQty: 0 },
      { lineNumber: 5, itemCode: 'CNC-COOL-001', description: 'Coolant Nozzle Assembly', quantity: 10, unitPrice: 166.50, totalAmount: 1665.00, uom: 'SET', receivedQty: 10, acceptedQty: 10, rejectedQty: 0 },
      { lineNumber: 6, itemCode: 'CNC-ALIGN-001', description: 'Alignment Fixture Kit', quantity: 2, unitPrice: 1000.00, totalAmount: 2000.00, uom: 'KIT', receivedQty: 2, acceptedQty: 2, rejectedQty: 0 },
    ],
  },
  invoice: {
    id: 'INV-PC-2024-789',
    number: 'INV-PC-2024-789',
    date: '2024-01-18',
    dueDate: '2024-03-03',
    totalAmount: 12700.00,
    taxAmount: 1143.00,
    lines: [
      { lineNumber: 1, itemCode: 'CNC-TOOL-001', description: 'Carbide End Mill 10mm', quantity: 50, unitPrice: 45.50, totalAmount: 2275.00, uom: 'EA' },
      { lineNumber: 2, itemCode: 'CNC-TOOL-002', description: 'Ball Nose Cutter 8mm', quantity: 30, unitPrice: 62.00, totalAmount: 1860.00, uom: 'EA' },
      { lineNumber: 3, itemCode: 'CNC-INSERT-001', description: 'Turning Insert CNMG', quantity: 100, unitPrice: 29.00, totalAmount: 2900.00, uom: 'EA' },
      { lineNumber: 4, itemCode: 'CNC-HOLDER-001', description: 'Tool Holder BT40', quantity: 5, unitPrice: 385.00, totalAmount: 1925.00, uom: 'EA' },
      { lineNumber: 5, itemCode: 'CNC-COOL-001', description: 'Coolant Nozzle Assembly', quantity: 10, unitPrice: 166.50, totalAmount: 1665.00, uom: 'SET' },
      { lineNumber: 6, itemCode: 'CNC-ALIGN-001', description: 'Alignment Fixture Kit', quantity: 2, unitPrice: 1037.50, totalAmount: 2075.00, uom: 'KIT' },
    ],
  },
  matchingResults: [
    {
      lineNumber: 1,
      itemCode: 'CNC-TOOL-001',
      description: 'Carbide End Mill 10mm',
      poQty: 50,
      grQty: 50,
      invoiceQty: 50,
      poPrice: 45.50,
      invoicePrice: 45.50,
      status: 'matched',
      variance: { quantity: 0, price: 0, total: 0 },
      issues: [],
    },
    {
      lineNumber: 2,
      itemCode: 'CNC-TOOL-002',
      description: 'Ball Nose Cutter 8mm',
      poQty: 30,
      grQty: 28,
      invoiceQty: 30,
      poPrice: 62.00,
      invoicePrice: 62.00,
      status: 'mismatch',
      variance: { quantity: -2, price: 0, total: -124 },
      issues: ['GRN quantity (28) does not match Invoice quantity (30)', 'Quantity variance exceeds tolerance'],
    },
    {
      lineNumber: 3,
      itemCode: 'CNC-INSERT-001',
      description: 'Turning Insert CNMG',
      poQty: 100,
      grQty: 97,
      invoiceQty: 100,
      poPrice: 28.50,
      invoicePrice: 29.00,
      status: 'exception',
      variance: { quantity: -3, price: 0.50, total: 50 },
      issues: ['GRN accepted quantity (97) less than PO (100)', 'Invoice price ($29.00) differs from PO price ($28.50)', 'Price variance: 1.75%'],
    },
    {
      lineNumber: 4,
      itemCode: 'CNC-HOLDER-001',
      description: 'Tool Holder BT40',
      poQty: 5,
      grQty: 5,
      invoiceQty: 5,
      poPrice: 385.00,
      invoicePrice: 385.00,
      status: 'matched',
      variance: { quantity: 0, price: 0, total: 0 },
      issues: [],
    },
    {
      lineNumber: 5,
      itemCode: 'CNC-COOL-001',
      description: 'Coolant Nozzle Assembly',
      poQty: 10,
      grQty: 10,
      invoiceQty: 10,
      poPrice: 166.50,
      invoicePrice: 166.50,
      status: 'matched',
      variance: { quantity: 0, price: 0, total: 0 },
      issues: [],
    },
    {
      lineNumber: 6,
      itemCode: 'CNC-ALIGN-001',
      description: 'Alignment Fixture Kit',
      poQty: 2,
      grQty: 2,
      invoiceQty: 2,
      poPrice: 1000.00,
      invoicePrice: 1037.50,
      status: 'exception',
      variance: { quantity: 0, price: 37.50, total: 75 },
      issues: ['Invoice price ($1,037.50) exceeds PO price ($1,000.00)', 'Price variance: 3.75% exceeds tolerance (2%)'],
    },
  ],
};

export function GoodsReceiptMatching({
  match = sampleMatch,
  onApprove,
  onReject,
  onCreateException,
  onAdjust,
}: GoodsReceiptMatchingProps) {
  const [expandedLines, setExpandedLines] = useState<number[]>([]);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'comparison' | 'summary'>('comparison');
  const [filterStatus, setFilterStatus] = useState<MatchStatus | 'all'>('all');

  const toggleLineExpand = (lineNumber: number) => {
    setExpandedLines(prev =>
      prev.includes(lineNumber)
        ? prev.filter(n => n !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  const toggleLineSelection = (lineNumber: number) => {
    setSelectedLines(prev =>
      prev.includes(lineNumber)
        ? prev.filter(n => n !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  const getStatusConfig = (status: MatchStatus) => {
    switch (status) {
      case 'matched':
        return {
          icon: CheckCircle2,
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          label: 'Matched',
        };
      case 'partial':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          label: 'Partial Match',
        };
      case 'mismatch':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          label: 'Mismatch',
        };
      case 'exception':
        return {
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          label: 'Exception',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          label: 'Pending',
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: match.purchaseOrder.currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredResults = filterStatus === 'all'
    ? match.matchingResults
    : match.matchingResults.filter(r => r.status === filterStatus);

  const statusCounts = match.matchingResults.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalVariance = match.matchingResults.reduce((sum, r) => sum + r.variance.total, 0);
  const matchedPercentage = ((statusCounts['matched'] || 0) / match.matchingResults.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                3-Way Match Verification
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusConfig(match.overallStatus).bgColor} ${getStatusConfig(match.overallStatus).color}`}>
                {React.createElement(getStatusConfig(match.overallStatus).icon, { className: 'h-3.5 w-3.5' })}
                {getStatusConfig(match.overallStatus).label}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Matching ID: {match.id} | Created: {formatDate(match.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <RefreshCw className="h-4 w-4" />
              Re-match
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Document Cards */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {/* Purchase Order Card */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Purchase Order</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">{match.purchaseOrder.number}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{match.purchaseOrder.vendor}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Date: {formatDate(match.purchaseOrder.date)}</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-white">{formatCurrency(match.purchaseOrder.totalAmount)}</p>
          </div>

          {/* Goods Receipt Card */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Goods Receipt</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">{match.goodsReceipt.number}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Received by: {match.goodsReceipt.receivedBy}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Date: {formatDate(match.goodsReceipt.date)}</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-white">{formatCurrency(match.goodsReceipt.totalAmount)}</p>
          </div>

          {/* Invoice Card */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Vendor Invoice</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">{match.invoice.number}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Due: {formatDate(match.invoice.dueDate)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Date: {formatDate(match.invoice.date)}</p>
            <p className="mt-2 font-semibold text-gray-900 dark:text-white">{formatCurrency(match.invoice.totalAmount)}</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{match.matchingResults.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Lines</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{statusCounts['matched'] || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Matched</p>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{(statusCounts['exception'] || 0) + (statusCounts['mismatch'] || 0)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Exceptions</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className={`text-2xl font-bold ${totalVariance > 0 ? 'text-red-600' : totalVariance < 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {formatCurrency(Math.abs(totalVariance))}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Variance</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as MatchStatus | 'all')}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Lines</option>
                <option value="matched">Matched Only</option>
                <option value="exception">Exceptions Only</option>
                <option value="mismatch">Mismatches Only</option>
              </select>
            </div>
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-3 py-1.5 text-sm ${viewMode === 'comparison' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Comparison
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1.5 text-sm ${viewMode === 'summary' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Summary
              </button>
            </div>
          </div>
          {selectedLines.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedLines.length} lines selected
              </span>
              <button
                onClick={() => onCreateException?.(match.id, selectedLines)}
                className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg hover:bg-orange-200"
              >
                Create Exception
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={selectedLines.length === filteredResults.length}
                  onChange={(e) => setSelectedLines(e.target.checked ? filteredResults.map(r => r.lineNumber) : [])}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Item</th>
              <th className="px-4 py-3 text-center" colSpan={2}>
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>PO</span>
                </div>
              </th>
              <th className="px-4 py-3 text-center" colSpan={2}>
                <div className="flex items-center justify-center gap-2">
                  <Package className="h-4 w-4 text-purple-500" />
                  <span>GRN</span>
                </div>
              </th>
              <th className="px-4 py-3 text-center" colSpan={2}>
                <div className="flex items-center justify-center gap-2">
                  <Receipt className="h-4 w-4 text-green-500" />
                  <span>Invoice</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right">Variance</th>
              <th className="px-4 py-3 text-center w-10"></th>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th></th>
              <th></th>
              <th></th>
              <th className="px-4 py-2 text-center">Qty</th>
              <th className="px-4 py-2 text-center">Price</th>
              <th className="px-4 py-2 text-center">Qty</th>
              <th className="px-4 py-2 text-center">Accepted</th>
              <th className="px-4 py-2 text-center">Qty</th>
              <th className="px-4 py-2 text-center">Price</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredResults.map((result) => {
              const config = getStatusConfig(result.status);
              const StatusIcon = config.icon;
              const isExpanded = expandedLines.includes(result.lineNumber);
              const isSelected = selectedLines.includes(result.lineNumber);
              const grLine = match.goodsReceipt.lines.find(l => l.lineNumber === result.lineNumber);

              return (
                <React.Fragment key={result.lineNumber}>
                  <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleLineSelection(result.lineNumber)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{result.itemCode}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{result.description}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                      {result.poQty}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-white">
                      {formatCurrency(result.poPrice)}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm ${result.grQty !== result.poQty ? 'text-orange-600 font-medium' : 'text-gray-900 dark:text-white'}`}>
                      {result.grQty}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      {grLine?.acceptedQty || result.grQty}
                      {grLine?.rejectedQty ? (
                        <span className="text-red-500 text-xs ml-1">(-{grLine.rejectedQty})</span>
                      ) : null}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm ${result.invoiceQty !== result.grQty ? 'text-orange-600 font-medium' : 'text-gray-900 dark:text-white'}`}>
                      {result.invoiceQty}
                    </td>
                    <td className={`px-4 py-3 text-center text-sm ${result.invoicePrice !== result.poPrice ? 'text-orange-600 font-medium' : 'text-gray-900 dark:text-white'}`}>
                      {formatCurrency(result.invoicePrice)}
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-medium ${
                      result.variance.total > 0 ? 'text-red-600' :
                      result.variance.total < 0 ? 'text-green-600' :
                      'text-gray-500'
                    }`}>
                      {result.variance.total !== 0 ? formatCurrency(result.variance.total) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleLineExpand(result.lineNumber)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <td colSpan={11} className="px-4 py-4">
                        <div className="space-y-3">
                          {result.issues.length > 0 && (
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-2">Issues Detected:</p>
                              <ul className="space-y-1">
                                {result.issues.map((issue, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-orange-600 dark:text-orange-400">
                                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                              <Edit2 className="h-4 w-4" />
                              Adjust
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                              <Link2 className="h-4 w-4" />
                              Re-link
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                              <Unlink className="h-4 w-4" />
                              Exclude
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{Math.round(matchedPercentage)}%</span> match rate
              {' | '}
              Tolerance: Qty ±{match.tolerance.quantity}%, Price ±{match.tolerance.price}%
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onReject?.(match.id, '')}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4" />
              Reject All
            </button>
            <button
              onClick={() => onCreateException?.(match.id, match.matchingResults.filter(r => r.status !== 'matched').map(r => r.lineNumber))}
              className="flex items-center gap-2 px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <AlertTriangle className="h-4 w-4" />
              Create Exceptions
            </button>
            <button
              onClick={() => onApprove?.(match.id)}
              disabled={match.overallStatus === 'mismatch'}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4" />
              Approve & Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoodsReceiptMatching;
