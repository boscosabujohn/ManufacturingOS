'use client'

import { useState } from 'react'
import { Link2, CheckCircle, ArrowRight, Package, FileText } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Link2 className="h-8 w-8 text-cyan-600" />
          CPQ Integration & Handoff
        </h2>
        <p className="text-gray-600 mt-1">Seamless transition from quotes to orders</p>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
