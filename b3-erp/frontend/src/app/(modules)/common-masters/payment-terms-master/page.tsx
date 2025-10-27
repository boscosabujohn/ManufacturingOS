'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, CreditCard, Users, TrendingUp } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockPaymentTerms, PaymentTerm, getPaymentTermStats } from '@/data/common-masters/payment-terms';

export default function PaymentTermsMasterPage() {
  const [terms, setTerms] = useState<PaymentTerm[]>(mockPaymentTerms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApplicability, setFilterApplicability] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return terms.filter(term => {
      const matchesSearch =
        term.termName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.termCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesApplicability = filterApplicability === 'all' || term.applicableFor === filterApplicability;
      const matchesMethod = filterMethod === 'all' || term.paymentMethod === filterMethod;

      return matchesSearch && matchesApplicability && matchesMethod;
    });
  }, [terms, searchTerm, filterApplicability, filterMethod]);

  const getPaymentMethodColor = (method: string) => {
    const colors = {
      'immediate': 'bg-red-100 text-red-800',
      'advance': 'bg-green-100 text-green-800',
      'partial': 'bg-blue-100 text-blue-800',
      'on_delivery': 'bg-orange-100 text-orange-800',
      'credit': 'bg-purple-100 text-purple-800'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: Column<PaymentTerm>[] = [
    {
      id: 'term',
      header: 'Payment Term',
      accessor: 'termName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {row.isDefault && <CreditCard className="w-4 h-4 text-blue-600" />}
            {value}
          </div>
          <div className="text-xs">
            <span className="font-mono text-blue-600">{row.termCode}</span>
          </div>
          <div className="text-xs text-gray-500">{row.description}</div>
        </div>
      )
    },
    {
      id: 'method',
      header: 'Method',
      accessor: 'paymentMethod',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getPaymentMethodColor(value)}`}>
            {value.replace('_', ' ')}
          </span>
          <div className="text-xs text-gray-600">
            Credit: {row.creditPeriod} days
          </div>
        </div>
      )
    },
    {
      id: 'terms',
      header: 'Terms',
      accessor: 'daysAfterInvoice',
      sortable: true,
      render: (_, row) => (
        <div className="text-xs">
          {row.advancePercentage && <div className="text-green-600">Advance: {row.advancePercentage}%</div>}
          {row.daysAfterInvoice > 0 && <div className="text-gray-600">Invoice + {row.daysAfterInvoice} days</div>}
          {row.partialPayments && (
            <div className="text-blue-600">{row.partialPayments.length} milestones</div>
          )}
        </div>
      )
    },
    {
      id: 'discounts',
      header: 'Discounts & Penalties',
      accessor: 'earlyPaymentDiscount',
      sortable: false,
      render: (_, row) => (
        <div className="text-xs">
          {row.earlyPaymentDiscount && (
            <div className="text-green-600">Early: {row.earlyPaymentDiscount}% ({row.earlyPaymentDays}d)</div>
          )}
          {row.cashDiscountPercentage && (
            <div className="text-blue-600">Cash: {row.cashDiscountPercentage}%</div>
          )}
          {row.lateFeePercentage && (
            <div className="text-red-600">Late: {row.lateFeePercentage}% after {row.lateFeeStartsAfter}d</div>
          )}
        </div>
      )
    },
    {
      id: 'applicability',
      header: 'Applicable For',
      accessor: 'applicableFor',
      sortable: true,
      render: (value) => (
        <div className="text-xs capitalize">
          {value}
        </div>
      )
    },
    {
      id: 'usage',
      header: 'Usage',
      accessor: 'transactionsCount',
      sortable: true,
      render: (value, row) => (
        <div className="text-xs">
          <div className="font-medium text-gray-900">{value} txns</div>
          <div className="text-green-600">Customers: {row.customersUsing}</div>
          <div className="text-blue-600">Vendors: {row.vendorsUsing}</div>
          <div className="text-gray-500">₹{(row.totalAmount / 1000000).toFixed(1)}M</div>
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} text={value ? 'Active' : 'Inactive'} />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: 'id',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={(e) => { e.stopPropagation(); }}>View</button>
          <button className="text-green-600 hover:text-green-800 text-sm font-medium" onClick={(e) => { e.stopPropagation(); }}>Edit</button>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterApplicability('all');
    setFilterMethod('all');
  };

  const activeFilterCount = [filterApplicability !== 'all', filterMethod !== 'all', searchTerm !== ''].filter(Boolean).length;
  const stats = useMemo(() => getPaymentTermStats(), [terms]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-blue-600" />
            Payment Terms Master
          </h1>
          <p className="text-gray-600 mt-1">Manage payment terms and credit conditions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => console.log('Export')} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button onClick={() => console.log('Add')} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Add Term</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Terms</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">For Customers</div>
          <div className="text-2xl font-bold text-blue-600">{stats.forCustomers}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">For Vendors</div>
          <div className="text-2xl font-bold text-green-600">{stats.forVendors}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Credit Period</div>
          <div className="text-2xl font-bold text-purple-600">{stats.avgCreditPeriod}d</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Total Amount
          </div>
          <div className="text-2xl font-bold text-orange-600">₹{(stats.totalAmount / 10000000).toFixed(1)}Cr</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">With Discount</div>
          <div className="text-2xl font-bold text-green-600">{stats.withEarlyDiscount}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by term name or code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'}`}>
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">{activeFilterCount}</span>}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900">
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Applicable For</label>
              <select value={filterApplicability} onChange={(e) => setFilterApplicability(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="all">All</option>
                <option value="customers">Customers</option>
                <option value="vendors">Vendors</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="all">All Methods</option>
                <option value="immediate">Immediate</option>
                <option value="advance">Advance</option>
                <option value="partial">Partial</option>
                <option value="on_delivery">On Delivery</option>
                <option value="credit">Credit</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable data={filteredData} columns={columns} pagination={{ enabled: true, pageSize: 10 }} sorting={{ enabled: true, defaultSort: { column: 'term', direction: 'asc' } }} emptyMessage="No payment terms found" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Terms Management
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ Flexible payment schedules: immediate, advance, partial, on delivery, or credit</li>
          <li>✓ Early payment discounts and cash discount incentives for timely payments</li>
          <li>✓ Late fee penalties and interest charges for overdue payments</li>
          <li>✓ Milestone-based partial payments for project-based billing</li>
          <li>✓ Default terms by customer/vendor category with approval workflows</li>
          <li>✓ Usage analytics: transaction count, total amount, and outstanding tracking</li>
        </ul>
      </div>
    </div>
  );
}
