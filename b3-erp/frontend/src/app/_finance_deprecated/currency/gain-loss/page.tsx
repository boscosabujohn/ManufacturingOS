'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, RefreshCw, FileText, AlertCircle, Info, X, Download, Plus, BarChart3 } from 'lucide-react';

interface ForexTransaction {
  id: string;
  transactionDate: string;
  transactionType: 'receipt' | 'payment' | 'revaluation';
  documentType: 'invoice' | 'bill' | 'receipt' | 'payment' | 'adjustment';
  documentNumber: string;
  partyName: string;
  currency: string;
  foreignAmount: number;
  transactionRate: number;
  transactionINR: number;
  settlementDate?: string;
  settlementRate?: number;
  settlementINR?: number;
  gainLossType: 'realized' | 'unrealized';
  gainLoss: number;
  status: 'settled' | 'open' | 'partially-settled';
  remarks?: string;
}

// Mock data for forex transactions
const mockForexData: ForexTransaction[] = [
  {
    id: 'FX-001',
    transactionDate: '2025-04-15',
    transactionType: 'receipt',
    documentType: 'invoice',
    documentNumber: 'INV-2025-1234',
    partyName: 'Global Tech Inc., USA',
    currency: 'USD',
    foreignAmount: 10000,
    transactionRate: 83.50,
    transactionINR: 835000,
    settlementDate: '2025-05-20',
    settlementRate: 84.20,
    settlementINR: 842000,
    gainLossType: 'realized',
    gainLoss: 7000,
    status: 'settled',
    remarks: 'Full payment received'
  },
  {
    id: 'FX-002',
    transactionDate: '2025-04-22',
    transactionType: 'payment',
    documentType: 'bill',
    documentNumber: 'BILL-2025-5678',
    partyName: 'Euro Components GmbH',
    currency: 'EUR',
    foreignAmount: 8000,
    transactionRate: 90.00,
    transactionINR: 720000,
    settlementDate: '2025-06-10',
    settlementRate: 89.20,
    settlementINR: 713600,
    gainLossType: 'realized',
    gainLoss: -6400,
    status: 'settled',
    remarks: 'Wire transfer completed'
  },
  {
    id: 'FX-003',
    transactionDate: '2025-05-05',
    transactionType: 'receipt',
    documentType: 'invoice',
    documentNumber: 'INV-2025-1456',
    partyName: 'UK Solutions Ltd.',
    currency: 'GBP',
    foreignAmount: 5000,
    transactionRate: 105.00,
    transactionINR: 525000,
    settlementDate: '2025-06-15',
    settlementRate: 106.50,
    settlementINR: 532500,
    gainLossType: 'realized',
    gainLoss: 7500,
    status: 'settled'
  },
  {
    id: 'FX-004',
    transactionDate: '2025-05-12',
    transactionType: 'payment',
    documentType: 'bill',
    documentNumber: 'BILL-2025-7890',
    partyName: 'Singapore Suppliers Pte Ltd',
    currency: 'SGD',
    foreignAmount: 15000,
    transactionRate: 62.00,
    transactionINR: 930000,
    settlementDate: '2025-07-05',
    settlementRate: 61.50,
    settlementINR: 922500,
    gainLossType: 'realized',
    gainLoss: -7500,
    status: 'settled'
  },
  {
    id: 'FX-005',
    transactionDate: '2025-06-01',
    transactionType: 'receipt',
    documentType: 'invoice',
    documentNumber: 'INV-2025-1789',
    partyName: 'American Corp, USA',
    currency: 'USD',
    foreignAmount: 12000,
    transactionRate: 83.80,
    transactionINR: 1005600,
    settlementDate: '2025-06-25',
    settlementRate: 84.50,
    settlementINR: 1014000,
    gainLossType: 'realized',
    gainLoss: 8400,
    status: 'settled'
  },
  {
    id: 'FX-006',
    transactionDate: '2025-06-10',
    transactionType: 'payment',
    documentType: 'bill',
    documentNumber: 'BILL-2025-8901',
    partyName: 'Dubai Trading LLC',
    currency: 'AED',
    foreignAmount: 20000,
    transactionRate: 22.80,
    transactionINR: 456000,
    settlementDate: '2025-07-12',
    settlementRate: 22.60,
    settlementINR: 452000,
    gainLossType: 'realized',
    gainLoss: -4000,
    status: 'settled'
  },
  {
    id: 'FX-007',
    transactionDate: '2025-07-01',
    transactionType: 'receipt',
    documentType: 'invoice',
    documentNumber: 'INV-2025-2001',
    partyName: 'Australian Partners Pty',
    currency: 'AUD',
    foreignAmount: 7000,
    transactionRate: 56.50,
    transactionINR: 395500,
    settlementDate: '2025-08-05',
    settlementRate: 57.20,
    settlementINR: 400400,
    gainLossType: 'realized',
    gainLoss: 4900,
    status: 'settled'
  },
  {
    id: 'FX-008',
    transactionDate: '2025-07-15',
    transactionType: 'payment',
    documentType: 'bill',
    documentNumber: 'BILL-2025-9012',
    partyName: 'Japanese Manufacturers Ltd.',
    currency: 'JPY',
    foreignAmount: 500000,
    transactionRate: 0.58,
    transactionINR: 290000,
    settlementDate: '2025-08-20',
    settlementRate: 0.56,
    settlementINR: 280000,
    gainLossType: 'realized',
    gainLoss: -10000,
    status: 'settled'
  },
  {
    id: 'FX-009',
    transactionDate: '2025-08-01',
    transactionType: 'receipt',
    documentType: 'invoice',
    documentNumber: 'INV-2025-2234',
    partyName: 'Canadian Enterprises Inc.',
    currency: 'CAD',
    foreignAmount: 9000,
    transactionRate: 61.00,
    transactionINR: 549000,
    settlementDate: '2025-09-10',
    settlementRate: 61.80,
    settlementINR: 556200,
    gainLossType: 'realized',
    gainLoss: 7200,
    status: 'settled'
  },
  {
    id: 'FX-010',
    transactionDate: '2025-08-20',
    transactionType: 'receipt',
    documentType: 'invoice',
    documentNumber: 'INV-2025-2456',
    partyName: 'Global Tech Inc., USA',
    currency: 'USD',
    foreignAmount: 15000,
    transactionRate: 84.00,
    transactionINR: 1260000,
    gainLossType: 'unrealized',
    gainLoss: 0,
    status: 'open',
    remarks: 'Awaiting payment - Due Oct 2025'
  },
  {
    id: 'FX-011',
    transactionDate: '2025-09-05',
    transactionType: 'payment',
    documentType: 'bill',
    documentNumber: 'BILL-2025-9345',
    partyName: 'Euro Components GmbH',
    currency: 'EUR',
    foreignAmount: 6000,
    transactionRate: 89.50,
    transactionINR: 537000,
    gainLossType: 'unrealized',
    gainLoss: 0,
    status: 'open',
    remarks: 'Payment due Oct 2025'
  },
  {
    id: 'FX-012',
    transactionDate: '2025-09-15',
    transactionType: 'receipt',
    documentType: 'invoice',
    documentNumber: 'INV-2025-2678',
    partyName: 'UK Solutions Ltd.',
    currency: 'GBP',
    foreignAmount: 8000,
    transactionRate: 106.00,
    transactionINR: 848000,
    settlementDate: '2025-10-01',
    settlementRate: 106.80,
    settlementINR: 854400,
    gainLossType: 'realized',
    gainLoss: 6400,
    status: 'settled'
  },
  {
    id: 'FX-013',
    transactionDate: '2025-09-22',
    transactionType: 'revaluation',
    documentType: 'adjustment',
    documentNumber: 'ADJ-2025-Q2',
    partyName: 'Various Parties',
    currency: 'MULTI',
    foreignAmount: 0,
    transactionRate: 0,
    transactionINR: 0,
    gainLossType: 'unrealized',
    gainLoss: -15000,
    status: 'open',
    remarks: 'Q2 Revaluation - MTM adjustment'
  },
  {
    id: 'FX-014',
    transactionDate: '2025-10-01',
    transactionType: 'payment',
    documentType: 'bill',
    documentNumber: 'BILL-2025-9567',
    partyName: 'Singapore Suppliers Pte Ltd',
    currency: 'SGD',
    foreignAmount: 10000,
    transactionRate: 61.80,
    transactionINR: 618000,
    gainLossType: 'unrealized',
    gainLoss: 0,
    status: 'open',
    remarks: 'Payment scheduled Nov 2025'
  },
  {
    id: 'FX-015',
    transactionDate: '2025-10-10',
    transactionType: 'receipt',
    documentType: 'invoice',
    documentNumber: 'INV-2025-2890',
    partyName: 'American Corp, USA',
    currency: 'USD',
    foreignAmount: 18000,
    transactionRate: 84.30,
    transactionINR: 1517400,
    settlementDate: '2025-10-20',
    settlementRate: 84.80,
    settlementINR: 1526400,
    gainLossType: 'realized',
    gainLoss: 9000,
    status: 'settled'
  }
];

export default function ForexGainLossPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<ForexTransaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const realizedGain = mockForexData
      .filter(t => t.gainLossType === 'realized' && t.gainLoss > 0)
      .reduce((sum, t) => sum + t.gainLoss, 0);

    const realizedLoss = mockForexData
      .filter(t => t.gainLossType === 'realized' && t.gainLoss < 0)
      .reduce((sum, t) => sum + Math.abs(t.gainLoss), 0);

    const unrealizedGain = mockForexData
      .filter(t => t.gainLossType === 'unrealized' && t.gainLoss > 0)
      .reduce((sum, t) => sum + t.gainLoss, 0);

    const unrealizedLoss = mockForexData
      .filter(t => t.gainLossType === 'unrealized' && t.gainLoss < 0)
      .reduce((sum, t) => sum + Math.abs(t.gainLoss), 0);

    const netRealized = realizedGain - realizedLoss;
    const netUnrealized = unrealizedGain - unrealizedLoss;
    const netPosition = netRealized + netUnrealized;

    const settledCount = mockForexData.filter(t => t.status === 'settled').length;
    const openCount = mockForexData.filter(t => t.status === 'open').length;

    return {
      realizedGain,
      realizedLoss,
      unrealizedGain,
      unrealizedLoss,
      netRealized,
      netUnrealized,
      netPosition,
      settledCount,
      openCount
    };
  }, []);

  // Get unique currencies
  const currencies = useMemo(() => {
    const currencySet = new Set(mockForexData.map(t => t.currency));
    return Array.from(currencySet).sort();
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockForexData.filter(transaction => {
      const matchesSearch =
        transaction.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCurrency = selectedCurrency === 'all' || transaction.currency === selectedCurrency;
      const matchesType = selectedType === 'all' || transaction.gainLossType === selectedType;
      const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;

      return matchesSearch && matchesCurrency && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedCurrency, selectedType, selectedStatus]);

  const getGainLossColor = (gainLoss: number) => {
    if (gainLoss > 0) return 'text-green-700';
    if (gainLoss < 0) return 'text-red-700';
    return 'text-gray-700';
  };

  const getGainLossBadge = (gainLoss: number) => {
    if (gainLoss > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <TrendingUp className="h-3 w-3" />
          Gain ₹{gainLoss.toLocaleString('en-IN')}
        </span>
      );
    }
    if (gainLoss < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <TrendingDown className="h-3 w-3" />
          Loss ₹{Math.abs(gainLoss).toLocaleString('en-IN')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <DollarSign className="h-3 w-3" />
        No G/L
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'settled': 'bg-green-100 text-green-800',
      'open': 'bg-yellow-100 text-yellow-800',
      'partially-settled': 'bg-blue-100 text-blue-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      'realized': 'bg-purple-100 text-purple-800',
      'unrealized': 'bg-orange-100 text-orange-800'
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'receipt') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (type === 'payment') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <RefreshCw className="h-4 w-4 text-blue-600" />;
  };

  const handleTransactionClick = (transaction: ForexTransaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleExportToExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Create CSV data
      const headers = ['ID', 'Date', 'Type', 'Document', 'Party', 'Currency', 'Foreign Amount', 'Rate', 'INR Amount', 'Settlement Rate', 'Settlement INR', 'Gain/Loss', 'Status'];
      const rows = filteredTransactions.map(t => [
        t.id,
        t.transactionDate,
        t.transactionType,
        t.documentNumber,
        t.partyName,
        t.currency,
        t.foreignAmount,
        t.transactionRate,
        t.transactionINR,
        t.settlementRate || '',
        t.settlementINR || '',
        t.gainLoss,
        t.status
      ]);

      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Forex_GainLoss_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      alert('Forex data exported to Excel successfully!');
    }, 1000);
  };

  const handleExportToPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Create a simple text-based report
      const report = `
FOREX GAIN/LOSS REPORT
======================
Generated: ${new Date().toLocaleString('en-IN')}
FY 2025-26

SUMMARY
-------
Realized Gain: ₹${(stats.realizedGain / 100000).toFixed(2)}L
Realized Loss: ₹${(stats.realizedLoss / 100000).toFixed(2)}L
Net Realized: ₹${(Math.abs(stats.netRealized) / 1000).toFixed(0)}K ${stats.netRealized >= 0 ? 'Gain' : 'Loss'}
Unrealized G/L: ₹${(Math.abs(stats.netUnrealized) / 1000).toFixed(0)}K
Net Position: ₹${(Math.abs(stats.netPosition) / 1000).toFixed(0)}K ${stats.netPosition >= 0 ? 'Gain' : 'Loss'}
Total Transactions: ${mockForexData.length}

TRANSACTIONS
------------
${filteredTransactions.map(t => `
${t.id} - ${t.documentNumber}
Party: ${t.partyName}
Date: ${new Date(t.transactionDate).toLocaleDateString('en-IN')}
Amount: ${t.currency} ${t.foreignAmount.toLocaleString('en-IN')} @ ${t.transactionRate}
INR: ₹${t.transactionINR.toLocaleString('en-IN')}
${t.settlementRate ? `Settlement: @ ${t.settlementRate} = ₹${t.settlementINR?.toLocaleString('en-IN')}` : 'Not settled'}
Gain/Loss: ₹${Math.abs(t.gainLoss).toLocaleString('en-IN')} ${t.gainLoss >= 0 ? 'Gain' : 'Loss'}
Status: ${t.status.toUpperCase()}
Type: ${t.gainLossType.toUpperCase()}
`).join('\n---\n')}

---
Generated by ManufacturingOS Finance Module
      `.trim();

      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Forex_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      alert('Forex report exported to PDF successfully!');
    }, 1000);
  };

  const handleAddTransaction = () => {
    alert('Add Forex Transaction form will open here.\n\nThis feature allows you to:\n- Record new forex transactions\n- Enter invoice/bill details\n- Specify exchange rates\n- Track foreign currency exposure');
  };

  const handleRevaluateCurrency = () => {
    alert('Currency Revaluation feature will open here.\n\nThis feature allows you to:\n- Perform mark-to-market revaluation\n- Update exchange rates\n- Calculate unrealized gains/losses\n- Generate revaluation journal entries');
  };

  return (
    <div className="p-6">
      <div className="mb-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              Forex Gain/Loss
            </h1>
            <p className="text-gray-600 mt-2">Foreign exchange gain and loss tracking • FY 2025-26</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportToExcel}
              disabled={isExporting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export Excel'}
            </button>
            <button
              onClick={handleExportToPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button
              onClick={handleRevaluateCurrency}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Revaluate
            </button>
            <button
              onClick={handleAddTransaction}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards - 6 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 mb-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-700 text-sm font-medium">Realized Gain</p>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">₹{(stats.realizedGain / 100000).toFixed(2)}L</p>
          <p className="text-xs text-green-600 mt-1">{stats.settledCount} settled txns</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-red-700 text-sm font-medium">Realized Loss</p>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-900">₹{(stats.realizedLoss / 100000).toFixed(2)}L</p>
          <p className="text-xs text-red-600 mt-1">{stats.settledCount} settled txns</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-700 text-sm font-medium">Net Realized</p>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
          <p className={`text-2xl font-bold ${stats.netRealized >= 0 ? 'text-purple-900' : 'text-red-900'}`}>
            ₹{(Math.abs(stats.netRealized) / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {stats.netRealized >= 0 ? 'Gain' : 'Loss'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-700 text-sm font-medium">Unrealized G/L</p>
            <RefreshCw className="h-5 w-5 text-orange-600" />
          </div>
          <p className={`text-2xl font-bold ${stats.netUnrealized >= 0 ? 'text-orange-900' : 'text-red-900'}`}>
            ₹{(Math.abs(stats.netUnrealized) / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-orange-600 mt-1">{stats.openCount} open txns</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-700 text-sm font-medium">Net Position</p>
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <p className={`text-2xl font-bold ${stats.netPosition >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
            ₹{(Math.abs(stats.netPosition) / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-blue-600 mt-1">Overall impact</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-indigo-700 text-sm font-medium">Total Txns</p>
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-900">{mockForexData.length}</p>
          <p className="text-xs text-indigo-600 mt-1">
            {stats.settledCount} settled, {stats.openCount} open
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <input
              type="text"
              placeholder="Search party, document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Currencies</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="realized">Realized</option>
              <option value="unrealized">Unrealized</option>
            </select>
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="settled">Settled</option>
              <option value="open">Open</option>
              <option value="partially-settled">Partially Settled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2 mb-3">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            onClick={() => handleTransactionClick(transaction)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getTransactionIcon(transaction.transactionType)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{transaction.partyName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                      {transaction.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(transaction.gainLossType)}`}>
                      {transaction.gainLossType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {transaction.documentNumber}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(transaction.transactionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-purple-600">{transaction.currency}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {getGainLossBadge(transaction.gainLoss)}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-blue-600 font-medium mb-1">Foreign Amount</p>
                <p className="text-lg font-bold text-blue-900">
                  {transaction.currency} {transaction.foreignAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  @ {transaction.transactionRate.toFixed(2)}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                <p className="text-xs text-indigo-600 font-medium mb-1">Transaction Value</p>
                <p className="text-lg font-bold text-indigo-900">
                  ₹{transaction.transactionINR.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-indigo-700 mt-1">Booking rate</p>
              </div>

              {transaction.settlementDate && transaction.settlementRate ? (
                <>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs text-purple-600 font-medium mb-1">Settlement Value</p>
                    <p className="text-lg font-bold text-purple-900">
                      ₹{transaction.settlementINR?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      @ {transaction.settlementRate.toFixed(2)}
                    </p>
                  </div>

                  <div className={`rounded-lg p-3 border ${
                    transaction.gainLoss > 0
                      ? 'bg-green-50 border-green-100'
                      : transaction.gainLoss < 0
                      ? 'bg-red-50 border-red-100'
                      : 'bg-gray-50 border-gray-100'
                  }`}>
                    <p className={`text-xs font-medium mb-1 ${
                      transaction.gainLoss > 0
                        ? 'text-green-600'
                        : transaction.gainLoss < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {transaction.gainLoss > 0 ? 'Forex Gain' : transaction.gainLoss < 0 ? 'Forex Loss' : 'No G/L'}
                    </p>
                    <p className={`text-lg font-bold ${
                      transaction.gainLoss > 0
                        ? 'text-green-900'
                        : transaction.gainLoss < 0
                        ? 'text-red-900'
                        : 'text-gray-900'
                    }`}>
                      ₹{Math.abs(transaction.gainLoss).toLocaleString('en-IN')}
                    </p>
                    <p className={`text-xs mt-1 ${
                      transaction.gainLoss > 0
                        ? 'text-green-700'
                        : transaction.gainLoss < 0
                        ? 'text-red-700'
                        : 'text-gray-700'
                    }`}>
                      {transaction.settlementDate && new Date(transaction.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </>
              ) : (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100 md:col-span-2">
                  <p className="text-xs text-orange-600 font-medium mb-1">Status</p>
                  <p className="text-sm font-semibold text-orange-900">Awaiting Settlement</p>
                  <p className="text-xs text-orange-700 mt-1">
                    {transaction.remarks || 'Pending payment/receipt'}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            {transaction.remarks && transaction.status === 'settled' && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {transaction.remarks}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Guidelines Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-purple-600" />
          Forex Gain/Loss Guidelines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Realized Gain/Loss</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Definition:</strong> Actual gain/loss incurred when a foreign currency transaction is settled</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Recognition:</strong> Recorded at the time of payment/receipt settlement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Calculation:</strong> Difference between transaction rate and settlement rate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>P&L Impact:</strong> Directly impacts profit and loss statement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span><strong>Tax Treatment:</strong> Included in taxable income as per IT Act provisions</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Unrealized Gain/Loss</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Definition:</strong> Notional gain/loss on unsettled foreign currency transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Recognition:</strong> Mark-to-market valuation at period-end</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Calculation:</strong> Difference between transaction rate and current market rate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Reporting:</strong> Disclosed in financial statements as per AS-11/Ind AS-21</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong>Revaluation:</strong> Performed quarterly or at financial year-end</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Exchange Rate Management</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Transaction Rate:</strong> Rate on date of invoice/bill booking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Settlement Rate:</strong> Rate on date of actual payment/receipt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Revaluation Rate:</strong> Market rate at period-end (e.g., RBI reference rate)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Hedging:</strong> Consider forward contracts to minimize forex exposure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span><strong>Documentation:</strong> Maintain evidence of rates used (bank statements, RBI rates)</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Best Practices</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Regular Monitoring:</strong> Track forex exposure and G/L impact weekly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Timely Settlement:</strong> Encourage prompt payments to reduce forex risk</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Hedging Strategy:</strong> Consider natural hedging (matching receipts with payments)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Accounting Standards:</strong> Follow AS-11 (or Ind AS-21) for forex transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Audit Trail:</strong> Maintain complete documentation for all forex transactions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {getTransactionIcon(selectedTransaction.transactionType)}
                  {selectedTransaction.documentNumber}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  {selectedTransaction.partyName} • {selectedTransaction.currency}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-3">
              {/* Transaction Status Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(selectedTransaction.status)}`}>
                  {selectedTransaction.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeBadge(selectedTransaction.gainLossType)}`}>
                  {selectedTransaction.gainLossType.toUpperCase()}
                </span>
                {getGainLossBadge(selectedTransaction.gainLoss)}
              </div>

              {/* Transaction Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {/* Left Column */}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Transaction Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Transaction ID:</span>
                        <span className="text-sm font-semibold text-gray-900">{selectedTransaction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Transaction Type:</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{selectedTransaction.transactionType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Document Type:</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{selectedTransaction.documentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Transaction Date:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {new Date(selectedTransaction.transactionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      {selectedTransaction.settlementDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Settlement Date:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {new Date(selectedTransaction.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Party Details</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-gray-900">{selectedTransaction.partyName}</p>
                      <p className="text-sm text-gray-600 mt-1">Foreign Currency Counterparty</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Foreign Currency</h3>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-blue-600 mb-2">Foreign Amount</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {selectedTransaction.currency} {selectedTransaction.foreignAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-blue-700 mt-2">
                        Exchange Rate: {selectedTransaction.transactionRate.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">INR Equivalent</h3>
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                      <p className="text-sm text-indigo-600 mb-2">Transaction Value</p>
                      <p className="text-3xl font-bold text-indigo-900">
                        ₹{selectedTransaction.transactionINR.toLocaleString('en-IN')}
                      </p>
                      {selectedTransaction.settlementINR && (
                        <>
                          <hr className="my-2 border-indigo-200" />
                          <p className="text-sm text-indigo-600 mb-1">Settlement Value</p>
                          <p className="text-2xl font-bold text-indigo-900">
                            ₹{selectedTransaction.settlementINR.toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-indigo-700 mt-1">
                            Rate: {selectedTransaction.settlementRate?.toFixed(4)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gain/Loss Analysis */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border-2 border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Forex Gain/Loss Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <p className="text-sm text-purple-700 mb-1">Transaction Rate</p>
                    <p className="text-2xl font-bold text-purple-900">{selectedTransaction.transactionRate.toFixed(4)}</p>
                  </div>
                  {selectedTransaction.settlementRate && (
                    <>
                      <div>
                        <p className="text-sm text-purple-700 mb-1">Settlement Rate</p>
                        <p className="text-2xl font-bold text-purple-900">{selectedTransaction.settlementRate.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-700 mb-1">Rate Difference</p>
                        <p className={`text-2xl font-bold ${
                          selectedTransaction.settlementRate > selectedTransaction.transactionRate ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {(selectedTransaction.settlementRate - selectedTransaction.transactionRate).toFixed(4)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-700">Net Gain/Loss:</span>
                    <span className={`text-3xl font-bold ${
                      selectedTransaction.gainLoss > 0 ? 'text-green-700' :
                      selectedTransaction.gainLoss < 0 ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      ₹{Math.abs(selectedTransaction.gainLoss).toLocaleString('en-IN')}
                      {selectedTransaction.gainLoss !== 0 && (
                        <span className="text-lg ml-2">
                          {selectedTransaction.gainLoss > 0 ? '(Gain)' : '(Loss)'}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedTransaction.remarks && (
                <div className="mt-6 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Remarks
                  </h3>
                  <p className="text-sm text-gray-700">{selectedTransaction.remarks}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                Close
              </button>
              {selectedTransaction.status === 'open' && (
                <button
                  onClick={() => alert('Settlement feature will allow you to:\n- Record settlement details\n- Enter settlement rate\n- Calculate realized gain/loss\n- Update transaction status')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Record Settlement
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
