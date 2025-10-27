'use client';

import { DollarSign, CheckCircle } from 'lucide-react';

export default function FinanceClearancePage() {
  const mockClearances = [
    {
      id: 'FIN001',
      employeeName: 'Rahul Sharma',
      items: [
        { name: 'Salary Hold Verification', status: 'completed', amount: null },
        { name: 'Pending Reimbursements Settled', status: 'completed', amount: 5000 },
        { name: 'Notice Period Buyout Deduction', status: 'completed', amount: -180000 },
        { name: 'Loan Recovery', status: 'in-progress', amount: -50000 },
        { name: 'Final Tax Calculation', status: 'pending', amount: null },
        { name: 'PF Transfer Initiated', status: 'pending', amount: null }
      ],
      status: 'in-progress'
    }
  ];

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Finance Department Clearance</h1>
        <p className="text-sm text-gray-600 mt-1">Financial settlements and recoveries</p>
      </div>

      {mockClearances.map(clearance => (
        <div key={clearance.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{clearance.employeeName}</h3>
          <div className="space-y-3">
            {clearance.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.amount && (
                    <p className={`text-sm font-semibold ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.amount > 0 ? '+' : ''}₹{Math.abs(item.amount).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
            <CheckCircle className="inline h-4 w-4 mr-2" />
            Complete Finance Clearance
          </button>
        </div>
      ))}
    </div>
  );
}
