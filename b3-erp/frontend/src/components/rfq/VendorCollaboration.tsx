'use client'

import { useState } from 'react'
import { Users, MessageSquare, FileText, CheckCircle, Clock, Download, Upload, AlertCircle } from 'lucide-react'

export type CollaborationStatus = 'pending' | 'in-progress' | 'submitted' | 'clarification-requested' | 'updated';

export interface VendorResponse {
  vendorId: string;
  vendorName: string;
  status: CollaborationStatus;
  submittedDate?: string;
  lastUpdated: string;
  documents: { name: string; uploadedDate: string; size: string }[];
  clarifications: { question: string; answer?: string; date: string }[];
  responseCompletion: number;
}

export default function VendorCollaboration() {
  const [responses] = useState<VendorResponse[]>([
    {
      vendorId: 'V-001',
      vendorName: 'ABC Suppliers Ltd',
      status: 'submitted',
      submittedDate: '2025-10-20',
      lastUpdated: '2025-10-20 14:30',
      responseCompletion: 100,
      documents: [
        { name: 'Technical_Specifications.pdf', uploadedDate: '2025-10-20', size: '2.4 MB' },
        { name: 'Price_Quote.xlsx', uploadedDate: '2025-10-20', size: '1.1 MB' }
      ],
      clarifications: [
        { question: 'Can you provide samples before bulk order?', answer: 'Yes, we can provide 5 samples within 3 days', date: '2025-10-18' }
      ]
    },
    {
      vendorId: 'V-002',
      vendorName: 'XYZ Industries Inc',
      status: 'in-progress',
      lastUpdated: '2025-10-22 10:15',
      responseCompletion: 65,
      documents: [
        { name: 'Company_Profile.pdf', uploadedDate: '2025-10-22', size: '3.2 MB' }
      ],
      clarifications: [
        { question: 'What is your delivery timeline?', answer: undefined, date: '2025-10-21' },
        { question: 'Do you offer warranty?', answer: '2-year comprehensive warranty included', date: '2025-10-20' }
      ]
    },
    {
      vendorId: 'V-003',
      vendorName: 'Tech Solutions Pvt Ltd',
      status: 'clarification-requested',
      lastUpdated: '2025-10-21 16:45',
      responseCompletion: 45,
      documents: [],
      clarifications: [
        { question: 'Please clarify payment terms', answer: undefined, date: '2025-10-21' },
        { question: 'Minimum order quantity?', answer: undefined, date: '2025-10-21' }
      ]
    }
  ]);

  const getStatusColor = (status: CollaborationStatus) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'submitted': return 'bg-green-100 text-green-700';
      case 'clarification-requested': return 'bg-yellow-100 text-yellow-700';
      case 'updated': return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-white shadow-lg p-3">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          Vendor Collaboration Portal
        </h2>
        <p className="text-gray-600 mt-1">Real-time vendor response tracking and collaboration</p>
      </div>

      <div className="bg-white shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <h3 className="text-lg font-semibold text-gray-900">Vendor Responses ({responses.length})</h3>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {responses.map((response) => (
              <div key={response.vendorId} className="p-5 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{response.vendorName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{response.vendorId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(response.status)}`}>
                    {response.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Response Completion</p>
                    <p className="text-2xl font-bold text-blue-900">{response.responseCompletion}%</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Documents</p>
                    <p className="text-2xl font-bold text-green-900">{response.documents.length}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Clarifications</p>
                    <p className="text-2xl font-bold text-purple-900">{response.clarifications.length}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${response.responseCompletion === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${response.responseCompletion}%` }}
                    />
                  </div>
                </div>

                {response.documents.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Submitted Documents
                    </p>
                    <div className="space-y-2">
                      {response.documents.map((doc, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-600">{doc.uploadedDate} • {doc.size}</p>
                          </div>
                          <Download className="h-4 w-4 text-blue-600 cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {response.clarifications.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Clarifications ({response.clarifications.filter(c => !c.answer).length} pending)
                    </p>
                    <div className="space-y-2">
                      {response.clarifications.map((clar, idx) => (
                        <div key={idx} className={`p-3 rounded ${clar.answer ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                          <div className="flex items-start gap-2 mb-2">
                            {clar.answer ? <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> : <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Q: {clar.question}</p>
                              {clar.answer && (
                                <p className="text-sm text-gray-700 mt-1">A: {clar.answer}</p>
                              )}
                              <p className="text-xs text-gray-600 mt-1">{clar.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-600">
                  Last updated: {response.lastUpdated}
                  {response.submittedDate && ` • Submitted: ${response.submittedDate}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
