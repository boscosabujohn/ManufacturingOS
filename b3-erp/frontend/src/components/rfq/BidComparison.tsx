'use client'

import { useState } from 'react'
import { BarChart3, DollarSign, Calendar, CheckCircle } from 'lucide-react'

export interface BidItem {
  item: string;
  vendors: { vendorName: string; unitPrice: number; leadTime: number; totalCost: number }[];
}

export default function BidComparison() {
  const [bids] = useState<BidItem[]>([
    {
      item: 'CNC Machine Spare Part A',
      vendors: [
        { vendorName: 'ABC Suppliers', unitPrice: 125000, leadTime: 15, totalCost: 1250000 },
        { vendorName: 'XYZ Industries', unitPrice: 132000, leadTime: 10, totalCost: 1320000 },
        { vendorName: 'Tech Solutions', unitPrice: 142500, leadTime: 12, totalCost: 1425000 }
      ]
    },
    {
      item: 'Hydraulic Pump Model X',
      vendors: [
        { vendorName: 'ABC Suppliers', unitPrice: 85000, leadTime: 20, totalCost: 850000 },
        { vendorName: 'XYZ Industries', unitPrice: 82000, leadTime: 18, totalCost: 820000 },
        { vendorName: 'Tech Solutions', unitPrice: 88000, leadTime: 15, totalCost: 880000 }
      ]
    }
  ]);

  const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(2)}L`;

  const getLowestPrice = (vendors: any[]) => Math.min(...vendors.map(v => v.unitPrice));
  const getFastestDelivery = (vendors: any[]) => Math.min(...vendors.map(v => v.leadTime));

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-green-600" />
          Automated Bid Comparison
        </h2>
        <p className="text-gray-600 mt-1">Side-by-side comparison of vendor bids</p>
      </div>

      <div className="space-y-3">
        {bids.map((bid, idx) => {
          const lowestPrice = getLowestPrice(bid.vendors);
          const fastestDelivery = getFastestDelivery(bid.vendors);

          return (
            <div key={idx} className="bg-white shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="text-lg font-semibold text-gray-900">{bid.item}</h3>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lead Time</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bid.vendors.map((v, vidx) => (
                        <tr key={vidx} className="hover:bg-gray-50">
                          <td className="px-4 py-4 font-medium text-gray-900">{v.vendorName}</td>
                          <td className={`px-4 py-4 text-right ${v.unitPrice === lowestPrice ? 'text-green-600 font-bold' : 'text-gray-900'}`}>
                            {formatCurrency(v.unitPrice)}
                            {v.unitPrice === lowestPrice && <CheckCircle className="h-4 w-4 inline ml-1 text-green-600" />}
                          </td>
                          <td className={`px-4 py-4 text-right ${v.leadTime === fastestDelivery ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                            {v.leadTime} days
                            {v.leadTime === fastestDelivery && <CheckCircle className="h-4 w-4 inline ml-1 text-blue-600" />}
                          </td>
                          <td className="px-4 py-4 text-right font-bold text-gray-900">{formatCurrency(v.totalCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
