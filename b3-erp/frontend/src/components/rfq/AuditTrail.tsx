'use client'

import { useState } from 'react'
import { FileText, Clock, User, Edit, Eye, Send, CheckCircle } from 'lucide-react'

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ipAddress: string;
}

export default function AuditTrail() {
  const [entries] = useState<AuditEntry[]>([
    { id: 'A-001', timestamp: '2025-10-22 14:30:00', user: 'John Doe', action: 'RFQ Created', details: 'Created RFQ-2025-0142', ipAddress: '192.168.1.100' },
    { id: 'A-002', timestamp: '2025-10-22 14:35:00', user: 'John Doe', action: 'Vendors Added', details: 'Added 5 vendors to RFQ', ipAddress: '192.168.1.100' },
    { id: 'A-003', timestamp: '2025-10-22 15:00:00', user: 'Jane Smith', action: 'RFQ Reviewed', details: 'Reviewed and approved for issuance', ipAddress: '192.168.1.105' },
    { id: 'A-004', timestamp: '2025-10-22 15:15:00', user: 'System', action: 'RFQ Issued', details: 'Email notifications sent to vendors', ipAddress: 'system' },
    { id: 'A-005', timestamp: '2025-10-23 10:20:00', user: 'Vendor ABC', action: 'Response Submitted', details: 'Vendor submitted bid response', ipAddress: '203.45.67.89' }
  ]);

  const getActionIcon = (action: string) => {
    if (action.includes('Created')) return <Edit className="h-5 w-5 text-blue-600" />;
    if (action.includes('Reviewed')) return <Eye className="h-5 w-5 text-purple-600" />;
    if (action.includes('Issued')) return <Send className="h-5 w-5 text-green-600" />;
    if (action.includes('Submitted')) return <CheckCircle className="h-5 w-5 text-orange-600" />;
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="h-8 w-8 text-indigo-600" />
          Audit Trail
        </h2>
        <p className="text-gray-600 mt-1">Complete activity log with timestamps</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200 p-6">
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-full">{getActionIcon(entry.action)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{entry.action}</h4>
                    <span className="text-xs text-gray-600">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{entry.details}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {entry.user}
                    </span>
                    <span>IP: {entry.ipAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
