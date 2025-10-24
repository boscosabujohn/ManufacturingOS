'use client';

import React, { useState } from 'react';
import { Gavel, FileSearch, TrendingDown, Users, Calendar, DollarSign, Award, FileText } from 'lucide-react';

export type EventType = 'rfq' | 'rfp' | 'auction' | 'rfx';
export type EventStatus = 'draft' | 'published' | 'active' | 'evaluation' | 'awarded' | 'cancelled';
export type BidStatus = 'submitted' | 'under-review' | 'shortlisted' | 'rejected' | 'awarded';

export interface SourcingEvent {
  id: string;
  eventNumber: string;
  title: string;
  type: EventType;
  status: EventStatus;
  category: string;
  publishDate: string;
  closeDate: string;
  estimatedValue: number;
  participantsInvited: number;
  responsesReceived: number;
  currentBestBid?: number;
  savingsEstimate?: number;
  owner: string;
}

export interface BidResponse {
  id: string;
  eventId: string;
  supplier: string;
  bidAmount: number;
  submittedDate: string;
  status: BidStatus;
  technicalScore: number;
  commercialScore: number;
  overallScore: number;
  leadTime: number;
  paymentTerms: string;
  validityDays: number;
}

export interface AuctionEvent {
  id: string;
  eventNumber: string;
  title: string;
  startPrice: number;
  currentPrice: number;
  reservePrice: number;
  participants: number;
  bidsPlaced: number;
  timeRemaining: string;
  status: 'upcoming' | 'live' | 'ended';
  savings: number;
}

const SourcingEvents: React.FC = () => {
  const [activeView, setActiveView] = useState<'events' | 'bids' | 'auctions'>('events');

  // Mock data - Sourcing events
  const events: SourcingEvent[] = [
    {
      id: 'EVT001',
      eventNumber: 'RFQ-2025-001',
      title: 'Steel Raw Materials Procurement - Q4 2025',
      type: 'rfq',
      status: 'active',
      category: 'Raw Materials',
      publishDate: '2025-10-15',
      closeDate: '2025-10-30',
      estimatedValue: 2500000,
      participantsInvited: 8,
      responsesReceived: 5,
      currentBestBid: 2280000,
      savingsEstimate: 220000,
      owner: 'Sarah Johnson',
    },
    {
      id: 'EVT002',
      eventNumber: 'RFP-2025-045',
      title: 'IT Infrastructure Services - 3 Year Contract',
      type: 'rfp',
      status: 'evaluation',
      category: 'IT Services',
      publishDate: '2025-09-01',
      closeDate: '2025-10-10',
      estimatedValue: 1800000,
      participantsInvited: 5,
      responsesReceived: 4,
      currentBestBid: 1650000,
      savingsEstimate: 150000,
      owner: 'Michael Chen',
    },
    {
      id: 'EVT003',
      eventNumber: 'AUC-2025-012',
      title: 'Electronic Components - Reverse Auction',
      type: 'auction',
      status: 'awarded',
      category: 'Electronic Components',
      publishDate: '2025-09-20',
      closeDate: '2025-09-20',
      estimatedValue: 950000,
      participantsInvited: 12,
      responsesReceived: 9,
      currentBestBid: 825000,
      savingsEstimate: 125000,
      owner: 'Emily Davis',
    },
    {
      id: 'EVT004',
      eventNumber: 'RFQ-2025-089',
      title: 'Packaging Materials - Annual Supply',
      type: 'rfq',
      status: 'published',
      category: 'Packaging',
      publishDate: '2025-10-20',
      closeDate: '2025-11-05',
      estimatedValue: 680000,
      participantsInvited: 6,
      responsesReceived: 2,
      owner: 'Robert Wilson',
    },
    {
      id: 'EVT005',
      eventNumber: 'RFP-2025-078',
      title: 'Logistics and Transportation Services',
      type: 'rfp',
      status: 'draft',
      category: 'Logistics',
      publishDate: '2025-11-01',
      closeDate: '2025-11-20',
      estimatedValue: 3200000,
      participantsInvited: 10,
      responsesReceived: 0,
      owner: 'Lisa Anderson',
    },
  ];

  // Mock data - Bid responses
  const bids: BidResponse[] = [
    {
      id: 'BID001',
      eventId: 'EVT001',
      supplier: 'Quality Steel Industries',
      bidAmount: 2280000,
      submittedDate: '2025-10-22',
      status: 'shortlisted',
      technicalScore: 92,
      commercialScore: 88,
      overallScore: 90,
      leadTime: 30,
      paymentTerms: 'Net 60',
      validityDays: 90,
    },
    {
      id: 'BID002',
      eventId: 'EVT001',
      supplier: 'Acme Manufacturing Co.',
      bidAmount: 2350000,
      submittedDate: '2025-10-21',
      status: 'under-review',
      technicalScore: 88,
      commercialScore: 85,
      overallScore: 86.5,
      leadTime: 35,
      paymentTerms: 'Net 45',
      validityDays: 60,
    },
    {
      id: 'BID003',
      eventId: 'EVT001',
      supplier: 'Industrial Metals Corp',
      bidAmount: 2420000,
      submittedDate: '2025-10-23',
      status: 'rejected',
      technicalScore: 75,
      commercialScore: 82,
      overallScore: 78.5,
      leadTime: 45,
      paymentTerms: 'Net 30',
      validityDays: 90,
    },
    {
      id: 'BID004',
      eventId: 'EVT002',
      supplier: 'Tech Solutions Inc.',
      bidAmount: 1650000,
      submittedDate: '2025-10-08',
      status: 'awarded',
      technicalScore: 95,
      commercialScore: 90,
      overallScore: 92.5,
      leadTime: 60,
      paymentTerms: 'Net 30',
      validityDays: 120,
    },
    {
      id: 'BID005',
      eventId: 'EVT002',
      supplier: 'Global IT Services',
      bidAmount: 1720000,
      submittedDate: '2025-10-09',
      status: 'shortlisted',
      technicalScore: 90,
      commercialScore: 87,
      overallScore: 88.5,
      leadTime: 45,
      paymentTerms: 'Net 45',
      validityDays: 90,
    },
    {
      id: 'BID006',
      eventId: 'EVT003',
      supplier: 'Global Components Ltd.',
      bidAmount: 825000,
      submittedDate: '2025-09-20',
      status: 'awarded',
      technicalScore: 93,
      commercialScore: 95,
      overallScore: 94,
      leadTime: 20,
      paymentTerms: 'Net 45',
      validityDays: 90,
    },
  ];

  // Mock data - Auction events
  const auctions: AuctionEvent[] = [
    {
      id: 'AUC001',
      eventNumber: 'AUC-2025-023',
      title: 'Machined Parts - Reverse Auction',
      startPrice: 1200000,
      currentPrice: 1050000,
      reservePrice: 980000,
      participants: 7,
      bidsPlaced: 23,
      timeRemaining: '2h 15m',
      status: 'live',
      savings: 150000,
    },
    {
      id: 'AUC002',
      eventNumber: 'AUC-2025-024',
      title: 'Office Supplies - Annual Contract',
      startPrice: 450000,
      currentPrice: 450000,
      reservePrice: 380000,
      participants: 5,
      bidsPlaced: 0,
      timeRemaining: '1d 4h',
      status: 'upcoming',
      savings: 0,
    },
    {
      id: 'AUC003',
      eventNumber: 'AUC-2025-012',
      title: 'Electronic Components Bulk Purchase',
      startPrice: 950000,
      currentPrice: 825000,
      reservePrice: 800000,
      participants: 9,
      bidsPlaced: 47,
      timeRemaining: 'Ended',
      status: 'ended',
      savings: 125000,
    },
    {
      id: 'AUC004',
      eventNumber: 'AUC-2025-025',
      title: 'Maintenance Services - Q1 2026',
      startPrice: 680000,
      currentPrice: 620000,
      reservePrice: 580000,
      participants: 6,
      bidsPlaced: 15,
      timeRemaining: '45m',
      status: 'live',
      savings: 60000,
    },
  ];

  const getEventStatusColor = (status: EventStatus): string => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'evaluation': return 'bg-yellow-100 text-yellow-800';
      case 'awarded': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidStatusColor = (status: BidStatus): string => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'awarded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuctionStatusColor = (status: string): string => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderEvents = () => (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'active').length}
              </p>
            </div>
            <FileSearch className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(events.reduce((sum, e) => sum + e.estimatedValue, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + e.participantsInvited, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Est. Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(events.filter(e => e.savingsEstimate).reduce((sum, e) => sum + (e.savingsEstimate || 0), 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estimated Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Best Bid</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Savings</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileSearch className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.eventNumber}</div>
                        <div className="text-xs text-gray-500">{event.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 uppercase">
                      {event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <div>
                        <div>{event.publishDate}</div>
                        <div className="text-xs">to {event.closeDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(event.estimatedValue / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.responsesReceived} / {event.participantsInvited}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {event.currentBestBid ? `$${(event.currentBestBid / 1000000).toFixed(2)}M` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {event.savingsEstimate ? `$${(event.savingsEstimate / 1000).toFixed(0)}K` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBids = () => (
    <div className="space-y-4">
      {/* Bid Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">{bids.length}</p>
            </div>
            <FileSearch className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">
                {bids.filter(b => b.status === 'shortlisted').length}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Awarded</p>
              <p className="text-2xl font-bold text-gray-900">
                {bids.filter(b => b.status === 'awarded').length}
              </p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {(bids.reduce((sum, b) => sum + b.overallScore, 0) / bids.length).toFixed(1)}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Bids Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Bid Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Technical</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Commercial</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Overall</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Lead Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Terms</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {events.find(e => e.id === bid.eventId)?.eventNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bid.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${(bid.bidAmount / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.submittedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBidStatusColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${bid.technicalScore >= 90 ? 'bg-green-500' : bid.technicalScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${bid.technicalScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{bid.technicalScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${bid.commercialScore >= 90 ? 'bg-green-500' : bid.commercialScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${bid.commercialScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{bid.commercialScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${bid.overallScore >= 90 ? 'text-green-600' : bid.overallScore >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {bid.overallScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.leadTime} days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.paymentTerms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAuctions = () => (
    <div className="space-y-4">
      {/* Auction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Live Auctions</p>
              <p className="text-2xl font-bold text-gray-900">
                {auctions.filter(a => a.status === 'live').length}
              </p>
            </div>
            <Gavel className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-900">
                {auctions.reduce((sum, a) => sum + a.bidsPlaced, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-gray-900">
                {auctions.reduce((sum, a) => sum + a.participants, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(auctions.reduce((sum, a) => sum + a.savings, 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Auctions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {auctions.map((auction) => (
          <div key={auction.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`p-4 ${auction.status === 'live' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : auction.status === 'upcoming' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-gray-600 to-slate-600'} text-white`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Gavel className="h-5 w-5" />
                  <h3 className="font-bold">{auction.eventNumber}</h3>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${getAuctionStatusColor(auction.status)} bg-white bg-opacity-90`}>
                  {auction.status}
                </span>
              </div>
              <p className="text-sm">{auction.title}</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Start Price:</span>
                <span className="text-sm font-medium text-gray-900">${(auction.startPrice / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Price:</span>
                <span className="text-lg font-bold text-green-600">${(auction.currentPrice / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reserve Price:</span>
                <span className="text-sm font-medium text-gray-900">${(auction.reservePrice / 1000).toFixed(0)}K</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Participants:</span>
                  <span className="text-sm font-medium text-gray-900">{auction.participants}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Bids Placed:</span>
                  <span className="text-sm font-medium text-gray-900">{auction.bidsPlaced}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Time Remaining:</span>
                  <span className={`text-sm font-bold ${auction.status === 'live' ? 'text-red-600' : 'text-gray-900'}`}>
                    {auction.timeRemaining}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Savings:</span>
                  <span className="text-sm font-bold text-green-600">${(auction.savings / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-3">
          <Gavel className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Sourcing Events</h2>
            <p className="text-blue-100">RFQs, RFPs, and reverse auctions for competitive sourcing</p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveView('events')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'events'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileSearch className="h-4 w-4" />
            <span>Events</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('bids')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'bids'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Bid Responses</span>
          </div>
        </button>
        <button
          onClick={() => setActiveView('auctions')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeView === 'auctions'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Gavel className="h-4 w-4" />
            <span>Auctions</span>
          </div>
        </button>
      </div>

      {/* Content */}
      {activeView === 'events' && renderEvents()}
      {activeView === 'bids' && renderBids()}
      {activeView === 'auctions' && renderAuctions()}
    </div>
  );
};

export default SourcingEvents;
