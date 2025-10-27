'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search, Download, Filter, X, DollarSign, Calendar, Tag, TrendingUp, Copy } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockPriceLists, PriceList, getPriceListStats } from '@/data/common-masters/price-lists';

export default function PriceListMasterPage() {
  const [priceLists, setPriceLists] = useState<PriceList[]>(mockPriceLists);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurrency, setFilterCurrency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return priceLists.filter(priceList => {
      const matchesSearch =
        priceList.priceListName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        priceList.priceListCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        priceList.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCurrency = filterCurrency === 'all' || priceList.currency === filterCurrency;

      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && priceList.isActive) ||
        (filterStatus === 'inactive' && !priceList.isActive);

      return matchesSearch && matchesCurrency && matchesStatus;
    });
  }, [priceLists, searchTerm, filterCurrency, filterStatus]);

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AED': 'د.إ'
    };
    return symbols[currency] || currency;
  };

  const getPriceListTypeColor = (type: string) => {
    const colors = {
      'standard': 'bg-blue-100 text-blue-800',
      'promotional': 'bg-green-100 text-green-800',
      'seasonal': 'bg-yellow-100 text-yellow-800',
      'contract': 'bg-purple-100 text-purple-800',
      'wholesale': 'bg-orange-100 text-orange-800',
      'retail': 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isCurrentlyValid = (validFrom: string | null | undefined, validTo?: string | null) => {
    if (!validFrom) return false;
    const now = new Date();
    const from = new Date(validFrom);
    const to = validTo ? new Date(validTo) : null;

    return now >= from && (!to || now <= to);
  };

  const columns: Column<PriceList>[] = [
    {
      id: 'priceList',
      header: 'Price List',
      accessor: 'priceListName',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {row.isDefault && <Tag className="w-4 h-4 text-blue-600" />}
            {value}
          </div>
          <div className="text-xs text-gray-500">
            <span className="font-mono font-semibold text-blue-600">{row.priceListCode}</span>
            {row.isDefault && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Default
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'type',
      header: 'Type',
      accessor: 'priceListType',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriceListTypeColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      id: 'currency',
      header: 'Currency',
      accessor: 'currency',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {getCurrencySymbol(value)} {value}
          </div>
          {row.exchangeRateApplied && (
            <div className="text-xs text-blue-600">Auto-convert</div>
          )}
        </div>
      )
    },
    {
      id: 'validity',
      header: 'Validity Period',
      accessor: 'validFrom',
      sortable: true,
      render: (value, row) => {
        const isCurrent = isCurrentlyValid(value, row.validTo);
        return (
          <div className="text-xs">
            <div className="font-medium text-gray-900 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              From: {new Date(value).toLocaleDateString('en-IN')}
            </div>
            <div className={row.validTo ? 'text-gray-500' : 'text-green-600'}>
              {row.validTo ? `To: ${new Date(row.validTo).toLocaleDateString('en-IN')}` : 'No expiry'}
            </div>
            <div className={`font-medium ${isCurrent ? 'text-green-600' : 'text-red-600'}`}>
              {isCurrent ? '✓ Current' : '✗ Expired'}
            </div>
          </div>
        );
      }
    },
    {
      id: 'pricing',
      header: 'Pricing Details',
      accessor: 'itemsCount',
      sortable: true,
      render: (value, row) => (
        <div className="text-xs">
          <div className="font-medium text-gray-900">{value} items</div>
          {row.baseMarkupPercentage && (
            <div className="text-green-600">Markup: +{row.baseMarkupPercentage}%</div>
          )}
          {row.discountPercentage && (
            <div className="text-orange-600">Discount: -{row.discountPercentage}%</div>
          )}
          {row.roundingRule && (
            <div className="text-gray-500">Round: {row.roundingRule}</div>
          )}
        </div>
      )
    },
    {
      id: 'categories',
      header: 'Applicable To',
      accessor: 'applicableCustomerCategories',
      sortable: false,
      render: (value, row) => {
        const categories = value || [];
        return (
          <div className="text-xs">
            {categories.length > 0 ? (
              <>
                <div className="font-medium text-gray-900">
                  {categories.length} categor{categories.length > 1 ? 'ies' : 'y'}
                </div>
                <div className="text-gray-500">
                  {categories.slice(0, 2).join(', ')}
                  {categories.length > 2 && ` +${categories.length - 2}`}
                </div>
              </>
            ) : (
              <div className="text-gray-400">All customers</div>
            )}
            {row.territoryRestrictions && row.territoryRestrictions.length > 0 && (
              <div className="text-blue-600">
                {row.territoryRestrictions.length} territor{row.territoryRestrictions.length > 1 ? 'ies' : 'y'}
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: 'usage',
      header: 'Usage Stats',
      accessor: 'transactionsCount',
      sortable: true,
      render: (value, row) => (
        <div className="text-xs">
          <div className="font-medium text-gray-900">{value} transactions</div>
          <div className="text-green-600">Revenue: {getCurrencySymbol(row.currency)}{((row.totalRevenue || 0) / 1000000).toFixed(2)}M</div>
          {row.lastUsedDate && (
            <div className="text-gray-500">
              Last: {new Date(row.lastUsedDate).toLocaleDateString('en-IN')}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <StatusBadge
          status={value ? 'active' : 'inactive'}
          text={value ? 'Active' : 'Inactive'}
        />
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
          <button
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Clone price list:', row);
            }}
          >
            Clone
          </button>
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit price list:', row);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete ${row.priceListName}?`)) {
                setPriceLists(prev => prev.filter(p => p.id !== row.id));
              }
            }}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCurrency('all');
    setFilterStatus('all');
  };

  const activeFilterCount = [
    filterCurrency !== 'all',
    filterStatus !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  const stats = useMemo(() => getPriceListStats(), [priceLists]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-blue-600" />
            Price List Master
          </h1>
          <p className="text-gray-600 mt-1">Manage pricing strategies, customer segments, and promotional campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log('Export price lists')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => console.log('Add price list')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Price List</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Price Lists</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Active Lists</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Items</div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Transactions</div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalTransactions}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Total Revenue
          </div>
          <div className="text-2xl font-bold text-green-600">₹{(stats.totalRevenue / 10000000).toFixed(1)}Cr</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Avg Markup</div>
          <div className="text-2xl font-bold text-orange-600">{stats.avgMarkup}%</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search price lists by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Currencies</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="AED">AED - UAE Dirham</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable
          data={filteredData}
          columns={columns}
          pagination={{
            enabled: true,
            pageSize: 10
          }}
          sorting={{
            enabled: true,
            defaultSort: { column: 'priceList', direction: 'asc' }
          }}
          emptyMessage="No price lists found"
          emptyDescription="Try adjusting your search or filters to find what you're looking for."
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Price List Management Guidelines
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>✓ <strong>Multiple Pricing Strategies:</strong> Standard, promotional, seasonal, contract, wholesale, and retail price lists</li>
          <li>✓ <strong>Customer Segmentation:</strong> Assign price lists to specific customer categories and territories</li>
          <li>✓ <strong>Multi-Currency Support:</strong> Manage prices in multiple currencies with automatic exchange rate conversion</li>
          <li>✓ <strong>Time-Based Validity:</strong> Configure validity periods for seasonal and promotional pricing</li>
          <li>✓ <strong>Markup & Discount:</strong> Apply base markup and discount percentages at price list level</li>
          <li>✓ <strong>Revenue Analytics:</strong> Track transactions and revenue generated from each price list</li>
        </ul>
      </div>
    </div>
  );
}
