'use client'

import { useState } from 'react'
import { FileText, CheckCircle, Download, Send, Eye } from 'lucide-react'

export interface Contract {
  contractId: string;
  rfqId: string;
  vendor: string;
  value: number;
  status: 'draft' | 'generated' | 'sent' | 'signed';
  generatedDate: string;
  terms: string[];
}

export default function ContractGeneration() {
  const [contracts] = useState<Contract[]>([
    {
      contractId: 'CONTRACT-2025-089',
      rfqId: 'RFQ-2025-0121',
      vendor: 'ABC Suppliers Ltd',
      value: 2500000,
      status: 'signed',
      generatedDate: '2025-10-18',
      terms: ['Payment: Net 30', 'Delivery: 15 days', 'Warranty: 2 years']
    },
    {
      contractId: 'CONTRACT-2025-092',
      rfqId: 'RFQ-2025-0128',
      vendor: 'XYZ Industries Inc',
      value: 1850000,
      status: 'sent',
      generatedDate: '2025-10-22',
      terms: ['Payment: Net 45', 'Delivery: 10 days', 'Warranty: 1 year']
    },
    {
      contractId: 'CONTRACT-2025-095',
      rfqId: 'RFQ-2025-0135',
      vendor: 'Tech Solutions Pvt Ltd',
      value: 3200000,
      status: 'generated',
      generatedDate: '2025-10-23',
      terms: ['Payment: Net 60', 'Delivery: 20 days', 'Warranty: 3 years']
    }
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      generated: 'bg-blue-100 text-blue-700',
      sent: 'bg-yellow-100 text-yellow-700',
      signed: 'bg-green-100 text-green-700'
    };
    return colors[status as keyof typeof colors];
  };

  const formatCurrency = (amount: number) => `₹${(amount / 100000).toFixed(2)}L`;

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="h-8 w-8 text-emerald-600" />
          Contract Generation
        </h2>
        <p className="text-gray-600 mt-1">Automated contract creation from RFQ awards</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200 p-3">
        <div className="space-y-2">
          {contracts.map((contract) => (
            <div key={contract.contractId} className="p-5 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{contract.contractId}</h4>
                  <p className="text-sm text-gray-600 mt-1">{contract.vendor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                  {contract.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">RFQ Reference</p>
                  <p className="text-lg font-bold text-blue-900">{contract.rfqId}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Contract Value</p>
                  <p className="text-lg font-bold text-green-900">{formatCurrency(contract.value)}</p>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Contract Terms:</p>
                <div className="space-y-1">
                  {contract.terms.map((term, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">Generated: {contract.generatedDate}</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  {contract.status === 'generated' && (
                    <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm flex items-center gap-1">
                      <Send className="h-4 w-4" />
                      Send
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
