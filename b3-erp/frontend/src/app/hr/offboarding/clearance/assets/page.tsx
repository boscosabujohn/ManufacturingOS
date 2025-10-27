'use client';

import { Package, CheckCircle } from 'lucide-react';

export default function AssetsClearancePage() {
  const mockClearances = [
    {
      id: 'AST001',
      employeeName: 'Rahul Sharma',
      items: [
        { name: 'Office Desk Key', status: 'returned', assetId: 'KEY-301' },
        { name: 'Locker Key', status: 'returned', assetId: 'LKR-045' },
        { name: 'Company Books', status: 'returned', assetId: 'BK-789' },
        { name: 'Stationery Items', status: 'returned', assetId: '-' },
        { name: 'Parking Pass', status: 'pending', assetId: 'PP-223' },
        { name: 'Cafeteria Card', status: 'pending', assetId: 'CF-556' }
      ],
      status: 'in-progress'
    }
  ];

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assets Department Clearance</h1>
        <p className="text-sm text-gray-600 mt-1">Physical assets and property return</p>
      </div>

      {mockClearances.map(clearance => (
        <div key={clearance.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{clearance.employeeName}</h3>
          <div className="space-y-3">
            {clearance.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.assetId !== '-' && <p className="text-xs text-gray-500">Asset ID: {item.assetId}</p>}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'returned'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
            <CheckCircle className="inline h-4 w-4 mr-2" />
            Complete Assets Clearance
          </button>
        </div>
      ))}
    </div>
  );
}
