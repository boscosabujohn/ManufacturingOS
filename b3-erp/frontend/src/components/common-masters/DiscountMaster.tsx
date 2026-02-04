'use client';

import React, { useState } from 'react';
import { Percent, Plus, Search, Eye, Edit3, TrendingDown, Tag as TagIcon, Users } from 'lucide-react';

interface DiscountScheme {
  id: string;
  discountCode: string;
  discountName: string;
  description: string;
  
  discountType: 'percentage' | 'fixed' | 'tiered' | 'buy-x-get-y';
  discountValue?: number;
  
  tieredDiscounts?: {
    minQty: number;
    maxQty?: number;
    discountPercentage: number;
  }[];
  
  buyXGetY?: {
    buyQuantity: number;
    getQuantity: number;
    applyOnItem?: string;
  };
  
  applicableOn: 'item' | 'category' | 'brand' | 'total-order';
  applicableItems?: string[];
  applicableCategories?: string[];
  
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  
  validFrom: string;
  validTo?: string;
  
  customerType: 'all' | 'retail' | 'wholesale' | 'distributor';
  combinableWithOtherOffers: boolean;
  
  usageLimit?: number;
  usedCount: number;
  
  status: 'active' | 'inactive' | 'expired';
  createdBy: string;
  createdAt: string;
}

const DiscountMaster: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountScheme[]>([
    {
      id: '1',
      discountCode: 'SEASON10',
      discountName: 'Seasonal Discount 10%',
      description: 'Flat 10% discount on all kitchen items',
      discountType: 'percentage',
      discountValue: 10,
      applicableOn: 'category',
      applicableCategories: ['Kitchen Cabinets', 'Finished Goods'],
      minimumOrderValue: 50000,
      validFrom: '2024-01-01',
      validTo: '2024-03-31',
      customerType: 'all',
      combinableWithOtherOffers: false,
      usedCount: 145,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      discountCode: 'BULK-TIER',
      discountName: 'Bulk Order Tiered Discount',
      description: 'Progressive discounts based on quantity',
      discountType: 'tiered',
      tieredDiscounts: [
        { minQty: 10, maxQty: 49, discountPercentage: 5 },
        { minQty: 50, maxQty: 99, discountPercentage: 10 },
        { minQty: 100, discountPercentage: 15 }
      ],
      applicableOn: 'item',
      applicableItems: ['KIT-CAB-001', 'KIT-CAB-002'],
      validFrom: '2024-01-01',
      customerType: 'wholesale',
      combinableWithOtherOffers: true,
      usedCount: 78,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      discountCode: 'BUY3GET1',
      discountName: 'Buy 3 Get 1 Free',
      description: 'Buy 3 cabinets and get 1 free',
      discountType: 'buy-x-get-y',
      buyXGetY: {
        buyQuantity: 3,
        getQuantity: 1
      },
      applicableOn: 'category',
      applicableCategories: ['Kitchen Cabinets'],
      validFrom: '2024-01-01',
      validTo: '2024-06-30',
      customerType: 'retail',
      combinableWithOtherOffers: false,
      usageLimit: 500,
      usedCount: 234,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-05T10:00:00Z'
    },
    {
      id: '4',
      discountCode: 'EARLY-BIRD',
      discountName: 'Early Bird Special',
      description: 'Fixed ₹5000 off on orders above ₹1L',
      discountType: 'fixed',
      discountValue: 5000,
      applicableOn: 'total-order',
      minimumOrderValue: 100000,
      maximumDiscountAmount: 5000,
      validFrom: '2024-01-01',
      validTo: '2024-02-28',
      customerType: 'all',
      combinableWithOtherOffers: false,
      usedCount: 56,
      status: 'active',
      createdBy: 'admin',
      createdAt: '2024-01-01T10:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredDiscounts = discounts.filter(d => {
    const matchesSearch = d.discountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.discountCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || d.discountType === filterType;
    return matchesSearch && matchesType;
  });

  const totalUsage = discounts.reduce((sum, d) => sum + d.usedCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Percent className="w-8 h-8 text-orange-600" />
                Discount Master
              </h1>
              <p className="text-gray-600 mt-2">Manage discount schemes and promotional offers</p>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Discount Scheme
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search discounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="tiered">Tiered</option>
              <option value="buy-x-get-y">Buy X Get Y</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Schemes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{discounts.length}</p>
              </div>
              <Percent className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {discounts.filter(d => d.status === 'active').length}
                </p>
              </div>
              <TagIcon className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{totalUsage}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Combinable</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {discounts.filter(d => d.combinableWithOtherOffers).length}
                </p>
              </div>
              <TrendingDown className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Discount Schemes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredDiscounts.map(discount => (
            <div key={discount.id} className="bg-white rounded-lg shadow-sm p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{discount.discountName}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      discount.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : discount.status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {discount.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-mono mb-1">{discount.discountCode}</p>
                  <p className="text-sm text-gray-500">{discount.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">View</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Edit</span>
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div className="mb-2">
                {discount.discountType === 'percentage' && (
                  <div className="flex items-center justify-center bg-orange-50 rounded-lg p-3 border-2 border-orange-200">
                    <Percent className="w-8 h-8 text-orange-600 mr-2" />
                    <span className="text-3xl font-bold text-orange-600">{discount.discountValue}%</span>
                    <span className="ml-2 text-gray-600">OFF</span>
                  </div>
                )}
                {discount.discountType === 'fixed' && (
                  <div className="flex items-center justify-center bg-green-50 rounded-lg p-3 border-2 border-green-200">
                    <span className="text-3xl font-bold text-green-600">₹{discount.discountValue}</span>
                    <span className="ml-2 text-gray-600">OFF</span>
                  </div>
                )}
                {discount.discountType === 'buy-x-get-y' && discount.buyXGetY && (
                  <div className="flex items-center justify-center bg-purple-50 rounded-lg p-3 border-2 border-purple-200">
                    <span className="text-lg font-bold text-purple-600">
                      Buy {discount.buyXGetY.buyQuantity} Get {discount.buyXGetY.getQuantity} FREE
                    </span>
                  </div>
                )}
                {discount.discountType === 'tiered' && discount.tieredDiscounts && (
                  <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Tiered Discounts</h4>
                    <div className="space-y-1">
                      {discount.tieredDiscounts.map((tier, index) => (
                        <div key={index} className="flex justify-between text-sm text-blue-700">
                          <span>
                            {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} units:
                          </span>
                          <span className="font-bold">{tier.discountPercentage}% OFF</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Applicable On:</span>
                  <p className="font-medium capitalize">{discount.applicableOn.replace('-', ' ')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Customer Type:</span>
                  <p className="font-medium capitalize">{discount.customerType}</p>
                </div>
                {discount.minimumOrderValue && (
                  <div>
                    <span className="text-gray-600">Min Order:</span>
                    <p className="font-medium">₹{discount.minimumOrderValue.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Usage:</span>
                  <p className="font-medium">
                    {discount.usedCount}{discount.usageLimit ? `/${discount.usageLimit}` : ''}
                  </p>
                </div>
              </div>

              {/* Validity */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Valid: </span>
                    <span className="font-medium">
                      {new Date(discount.validFrom).toLocaleDateString()}
                      {discount.validTo && ` - ${new Date(discount.validTo).toLocaleDateString()}`}
                    </span>
                  </div>
                  {discount.combinableWithOtherOffers && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Combinable
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscountMaster;
