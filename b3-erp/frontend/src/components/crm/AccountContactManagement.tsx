'use client';

import React, { useState } from 'react';
import { Building2, Users, User, Star, Mail, Phone, MapPin, Briefcase, Award, TrendingUp, Shield, AlertCircle } from 'lucide-react';

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: 'champion' | 'influencer' | 'blocker' | 'decision-maker' | 'user';
  department: string;
  isPrimary: boolean;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  revenue: number;
  employees: number;
  status: 'active' | 'inactive' | 'prospect';
  healthScore: number;
  tier: 'strategic' | 'key' | 'standard';
  address: string;
  website: string;
  contacts: Contact[];
  totalDeals: number;
  dealValue: number;
  lastActivity: string;
}

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'TechCorp Industries',
    industry: 'Technology',
    revenue: 50000000,
    employees: 500,
    status: 'active',
    healthScore: 92,
    tier: 'strategic',
    address: '123 Tech Street, San Francisco, CA',
    website: 'techcorp.com',
    totalDeals: 12,
    dealValue: 1250000,
    lastActivity: '2 hours ago',
    contacts: [
      { id: '1', name: 'Sarah Johnson', title: 'CTO', email: 'sarah@techcorp.com', phone: '+1 234-567-8901', role: 'decision-maker', department: 'IT', isPrimary: true },
      { id: '2', name: 'Mike Davis', title: 'VP Engineering', email: 'mike@techcorp.com', phone: '+1 234-567-8902', role: 'champion', department: 'Engineering', isPrimary: false },
      { id: '3', name: 'Emily Chen', title: 'CFO', email: 'emily@techcorp.com', phone: '+1 234-567-8903', role: 'influencer', department: 'Finance', isPrimary: false }
    ]
  },
  {
    id: '2',
    name: 'Global Manufacturing Ltd',
    industry: 'Manufacturing',
    revenue: 120000000,
    employees: 1200,
    status: 'active',
    healthScore: 78,
    tier: 'key',
    address: '456 Factory Road, Detroit, MI',
    website: 'globalmanuf.com',
    totalDeals: 8,
    dealValue: 850000,
    lastActivity: '1 day ago',
    contacts: [
      { id: '4', name: 'Robert Wilson', title: 'Operations Director', email: 'robert@globalmanuf.com', phone: '+1 345-678-9012', role: 'decision-maker', department: 'Operations', isPrimary: true },
      { id: '5', name: 'Lisa Anderson', title: 'IT Manager', email: 'lisa@globalmanuf.com', phone: '+1 345-678-9013', role: 'user', department: 'IT', isPrimary: false }
    ]
  },
  {
    id: '3',
    name: 'Precision Parts Co',
    industry: 'Automotive',
    revenue: 25000000,
    employees: 250,
    status: 'prospect',
    healthScore: 56,
    tier: 'standard',
    address: '789 Auto Avenue, Detroit, MI',
    website: 'precisionparts.com',
    totalDeals: 2,
    dealValue: 180000,
    lastActivity: '5 days ago',
    contacts: [
      { id: '6', name: 'David Martinez', title: 'CEO', email: 'david@precisionparts.com', phone: '+1 456-789-0123', role: 'decision-maker', department: 'Executive', isPrimary: true }
    ]
  }
];

const roleColors = {
  'champion': 'bg-green-100 text-green-700 border-green-300',
  'influencer': 'bg-blue-100 text-blue-700 border-blue-300',
  'blocker': 'bg-red-100 text-red-700 border-red-300',
  'decision-maker': 'bg-purple-100 text-purple-700 border-purple-300',
  'user': 'bg-gray-100 text-gray-700 border-gray-300'
};

const tierColors = {
  strategic: 'bg-purple-100 text-purple-700 border-purple-300',
  key: 'bg-blue-100 text-blue-700 border-blue-300',
  standard: 'bg-gray-100 text-gray-700 border-gray-300'
};

export default function AccountContactManagement() {
  const [accounts] = useState<Account[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [viewMode, setViewMode] = useState<'hierarchy' | 'contacts'>('hierarchy');

  const stats = {
    totalAccounts: accounts.length,
    strategicAccounts: accounts.filter(a => a.tier === 'strategic').length,
    avgHealthScore: Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length),
    totalContacts: accounts.reduce((sum, a) => sum + a.contacts.length, 0),
    totalDealValue: accounts.reduce((sum, a) => sum + a.dealValue, 0),
    activeAccounts: accounts.filter(a => a.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
          Account & Contact Management
        </h2>
        <p className="text-gray-600 mt-1">Hierarchical account relationships with decision-maker mapping and buying committee tracking</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">Total Accounts</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">{stats.totalAccounts}</p>
            </div>
            <Building2 className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Strategic</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{stats.strategicAccounts}</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Health Score</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{stats.avgHealthScore}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Contacts</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stats.totalContacts}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Deal Value</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">${(stats.totalDealValue / 1000000).toFixed(1)}M</p>
            </div>
            <Award className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Active</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{stats.activeAccounts}</p>
            </div>
            <Shield className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('hierarchy')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'hierarchy'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Account Hierarchy
          </button>
          <button
            onClick={() => setViewMode('contacts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'contacts'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Decision-Maker Map
          </button>
        </div>
      </div>

      {/* Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedAccount(account)}
          >
            {/* Account Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-500">{account.industry}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${tierColors[account.tier]}`}>
                {account.tier}
              </span>
            </div>

            {/* Account Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Revenue</p>
                <p className="text-sm font-bold text-gray-900">${(account.revenue / 1000000).toFixed(0)}M</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Employees</p>
                <p className="text-sm font-bold text-gray-900">{account.employees.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Deal Value</p>
                <p className="text-sm font-bold text-indigo-600">${(account.dealValue / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Health Score</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        account.healthScore >= 80 ? 'bg-green-500' :
                        account.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${account.healthScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{account.healthScore}</span>
                </div>
              </div>
            </div>

            {/* Contacts Preview */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Key Contacts ({account.contacts.length})</p>
              <div className="space-y-2">
                {account.contacts.slice(0, 2).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{contact.name}</span>
                      {contact.isPrimary && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${roleColors[contact.role]}`}>
                      {contact.role.replace('-', ' ')}
                    </span>
                  </div>
                ))}
                {account.contacts.length > 2 && (
                  <p className="text-xs text-gray-500">+{account.contacts.length - 2} more contacts</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Account Detail Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedAccount.name}</h3>
                  <p className="text-gray-600">{selectedAccount.industry} • {selectedAccount.employees.toLocaleString()} employees</p>
                </div>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Account Information */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Account Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm text-gray-900">{selectedAccount.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <a href={`https://${selectedAccount.website}`} className="text-sm text-indigo-600 hover:underline">{selectedAccount.website}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buying Committee / Decision-Maker Map */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-indigo-600 mr-2" />
                  Buying Committee & Decision-Maker Map
                </h4>
                <div className="space-y-4">
                  {selectedAccount.contacts.map((contact) => (
                    <div key={contact.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-900">{contact.name}</span>
                              {contact.isPrimary && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                            </div>
                            <p className="text-sm text-gray-600">{contact.title}</p>
                            <p className="text-xs text-gray-500">{contact.department}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${roleColors[contact.role]}`}>
                          {contact.role.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:underline">{contact.email}</a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${contact.phone}`} className="text-indigo-600 hover:underline">{contact.phone}</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  View Full Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-indigo-900 mb-1">Strategic Account Planning</h4>
            <p className="text-sm text-indigo-800">
              Account hierarchies show parent-child relationships, while the decision-maker map identifies champions, influencers, and blockers
              within the buying committee. Health scores are calculated from engagement, deal velocity, and customer satisfaction metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
