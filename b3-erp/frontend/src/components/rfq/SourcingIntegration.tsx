'use client'

import { useState } from 'react'
import { Link2, ArrowRight, FileText, Gavel } from 'lucide-react'

export interface SourcingEvent {
  rfqId: string;
  eventType: 'auction' | 'reverse-auction' | 'sealed-bid';
  eventId: string;
  status: 'scheduled' | 'live' | 'completed';
  startDate: string;
  participants: number;
}

export default function SourcingIntegration() {
  const [events] = useState<SourcingEvent[]>([
    { rfqId: 'RFQ-2025-0142', eventType: 'reverse-auction', eventId: 'EVT-2025-089', status: 'scheduled', startDate: '2025-10-25 10:00', participants: 5 },
    { rfqId: 'RFQ-2025-0135', eventType: 'sealed-bid', eventId: 'EVT-2025-082', status: 'completed', startDate: '2025-10-20 14:00', participants: 7 },
    { rfqId: 'RFQ-2025-0128', eventType: 'auction', eventId: 'EVT-2025-075', status: 'live', startDate: '2025-10-22 09:00', participants: 4 }
  ]);

  const getStatusColor = (status: string) => {
    if (status === 'scheduled') return 'bg-blue-100 text-blue-700';
    if (status === 'live') return 'bg-green-100 text-green-700 animate-pulse';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Gavel className="h-8 w-8 text-teal-600" />
          Sourcing Event Integration
        </h2>
        <p className="text-gray-600 mt-1">Link RFQs to auctions and bidding events</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200 p-3">
        <div className="space-y-2">
          {events.map((event, idx) => (
            <div key={idx} className="p-5 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{event.rfqId}</h4>
                  <p className="text-sm text-gray-600 capitalize">{event.eventType.replace('-', ' ')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {event.status.toUpperCase()}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">RFQ</p>
                      <p className="font-bold text-gray-900">{event.rfqId}</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="h-8 w-8 text-green-600" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Gavel className="h-8 w-8 text-teal-600" />
                    <div>
                      <p className="text-xs text-gray-600">Event</p>
                      <p className="font-bold text-gray-900">{event.eventId}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Participants</p>
                  <p className="text-2xl font-bold text-blue-900">{event.participants}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 font-medium">Start Date</p>
                  <p className="text-sm font-bold text-purple-900">{event.startDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
