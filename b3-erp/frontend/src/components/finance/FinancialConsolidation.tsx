'use client';

import React, { useState, useEffect } from 'react';
import { Building2, GitMerge, FileSpreadsheet, AlertCircle, TrendingUp, Filter, Download, Eye, Settings, Plus, X, Check, ChevronDown, ChevronRight, DollarSign, Users, Globe, Calculator, FileText, Activity, RefreshCw, Lock, Unlock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap, Sankey } from 'recharts';

interface Entity {
  id: string;
  code: string;
  name: string;
  country: string;
  currency: string;
  type: 'parent' | 'subsidiary' | 'joint-venture' | 'associate';
  ownershipPercentage: number;
  parentEntityId?: string;
  status: 'active' | 'inactive' | 'under-review';
  reportingStandard: 'IFRS' | 'US-GAAP' | 'LOCAL-GAAP';
  lastReportDate: string;
  fiscalYearEnd: string;
}

interface FinancialData {
  entityId: string;
  period: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  equity: number;
  cashFlow: number;
  currency: string;
}

interface IntercompanyTransaction {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  transactionType: 'sale' | 'loan' | 'dividend' | 'service' | 'royalty';
  amount: number;
  currency: string;
  date: string;
  status: 'pending' | 'validated' | 'eliminated';
  eliminationAmount?: number;
}

interface ConsolidationAdjustment {
  id: string;
  type: 'elimination' | 'currency' | 'goodwill' | 'minority' | 'other';
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  entityId: string;
  status: 'draft' | 'approved' | 'posted';
}

interface ConsolidationSession {
  id: string;
  period: string;
  status: 'in-progress' | 'review' | 'approved' | 'published';
  createdBy: string;
  createdDate: string;
  approvedBy?: string;
  approvedDate?: string;
  entities: string[];
  adjustments: number;
  eliminations: number;
}

const FinancialConsolidation = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false);
  const [consolidationView, setConsolidationView] = useState('structure');

  // Mock data
  const entities: Entity[] = [
    { id: 'E001', code: 'PARENT', name: 'Global Manufacturing Corp', country: 'USA', currency: 'USD', type: 'parent', ownershipPercentage: 100, status: 'active', reportingStandard: 'US-GAAP', lastReportDate: '2024-03-31', fiscalYearEnd: '12-31' },
    { id: 'E002', code: 'EU-SUB', name: 'European Operations GmbH', country: 'Germany', currency: 'EUR', type: 'subsidiary', ownershipPercentage: 100, parentEntityId: 'E001', status: 'active', reportingStandard: 'IFRS', lastReportDate: '2024-03-31', fiscalYearEnd: '12-31' },
    { id: 'E003', code: 'ASIA-SUB', name: 'Asia Pacific Ltd', country: 'Singapore', currency: 'SGD', type: 'subsidiary', ownershipPercentage: 75, parentEntityId: 'E001', status: 'active', reportingStandard: 'IFRS', lastReportDate: '2024-03-31', fiscalYearEnd: '12-31' },
    { id: 'E004', code: 'JV-TECH', name: 'Tech Innovation JV', country: 'Japan', currency: 'JPY', type: 'joint-venture', ownershipPercentage: 50, parentEntityId: 'E001', status: 'active', reportingStandard: 'IFRS', lastReportDate: '2024-03-31', fiscalYearEnd: '03-31' },
    { id: 'E005', code: 'UK-SUB', name: 'UK Manufacturing Ltd', country: 'UK', currency: 'GBP', type: 'subsidiary', ownershipPercentage: 100, parentEntityId: 'E002', status: 'active', reportingStandard: 'IFRS', lastReportDate: '2024-03-31', fiscalYearEnd: '12-31' }
  ];

  const financialData: FinancialData[] = [
    { entityId: 'E001', period: '2024-Q1', revenue: 50000000, expenses: 35000000, netIncome: 15000000, assets: 200000000, liabilities: 80000000, equity: 120000000, cashFlow: 12000000, currency: 'USD' },
    { entityId: 'E002', period: '2024-Q1', revenue: 25000000, expenses: 18000000, netIncome: 7000000, assets: 80000000, liabilities: 30000000, equity: 50000000, cashFlow: 5500000, currency: 'EUR' },
    { entityId: 'E003', period: '2024-Q1', revenue: 15000000, expenses: 11000000, netIncome: 4000000, assets: 60000000, liabilities: 25000000, equity: 35000000, cashFlow: 3200000, currency: 'SGD' },
    { entityId: 'E004', period: '2024-Q1', revenue: 8000000, expenses: 6500000, netIncome: 1500000, assets: 30000000, liabilities: 12000000, equity: 18000000, cashFlow: 1200000, currency: 'JPY' },
    { entityId: 'E005', period: '2024-Q1', revenue: 12000000, expenses: 9000000, netIncome: 3000000, assets: 45000000, liabilities: 18000000, equity: 27000000, cashFlow: 2400000, currency: 'GBP' }
  ];

  const intercompanyTransactions: IntercompanyTransaction[] = [
    { id: 'IC001', fromEntityId: 'E001', toEntityId: 'E002', transactionType: 'sale', amount: 2500000, currency: 'USD', date: '2024-03-15', status: 'validated', eliminationAmount: 2500000 },
    { id: 'IC002', fromEntityId: 'E002', toEntityId: 'E005', transactionType: 'service', amount: 800000, currency: 'EUR', date: '2024-03-20', status: 'validated', eliminationAmount: 800000 },
    { id: 'IC003', fromEntityId: 'E001', toEntityId: 'E003', transactionType: 'loan', amount: 5000000, currency: 'USD', date: '2024-02-01', status: 'validated', eliminationAmount: 5000000 },
    { id: 'IC004', fromEntityId: 'E003', toEntityId: 'E001', transactionType: 'dividend', amount: 1500000, currency: 'SGD', date: '2024-03-25', status: 'pending' },
    { id: 'IC005', fromEntityId: 'E004', toEntityId: 'E001', transactionType: 'royalty', amount: 300000, currency: 'JPY', date: '2024-03-28', status: 'validated', eliminationAmount: 300000 }
  ];

  const consolidationAdjustments: ConsolidationAdjustment[] = [
    { id: 'ADJ001', type: 'elimination', description: 'Intercompany sales elimination', debitAccount: 'Revenue', creditAccount: 'Cost of Sales', amount: 2500000, entityId: 'E001', status: 'approved' },
    { id: 'ADJ002', type: 'currency', description: 'Foreign currency translation adjustment', debitAccount: 'Currency Translation Reserve', creditAccount: 'Equity', amount: 450000, entityId: 'E002', status: 'approved' },
    { id: 'ADJ003', type: 'goodwill', description: 'Goodwill impairment test adjustment', debitAccount: 'Goodwill Impairment', creditAccount: 'Goodwill', amount: 200000, entityId: 'E003', status: 'draft' },
    { id: 'ADJ004', type: 'minority', description: 'Non-controlling interest adjustment', debitAccount: 'Net Income', creditAccount: 'Minority Interest', amount: 1000000, entityId: 'E003', status: 'approved' },
    { id: 'ADJ005', type: 'elimination', description: 'Intercompany loan elimination', debitAccount: 'Intercompany Payable', creditAccount: 'Intercompany Receivable', amount: 5000000, entityId: 'E001', status: 'approved' }
  ];

  const consolidationSessions: ConsolidationSession[] = [
    { id: 'CS001', period: '2024-Q1', status: 'in-progress', createdBy: 'John Doe', createdDate: '2024-04-05', entities: ['E001', 'E002', 'E003', 'E004', 'E005'], adjustments: 12, eliminations: 8 },
    { id: 'CS002', period: '2023-Q4', status: 'published', createdBy: 'Jane Smith', createdDate: '2024-01-05', approvedBy: 'Mike Johnson', approvedDate: '2024-01-08', entities: ['E001', 'E002', 'E003', 'E004', 'E005'], adjustments: 15, eliminations: 10 },
    { id: 'CS003', period: '2023-Q3', status: 'published', createdBy: 'Jane Smith', createdDate: '2023-10-05', approvedBy: 'Mike Johnson', approvedDate: '2023-10-08', entities: ['E001', 'E002', 'E003', 'E004'], adjustments: 10, eliminations: 7 }
  ];

  // Consolidated financial data
  const consolidatedData = [
    { metric: 'Revenue', standalone: 110000000, eliminations: -8600000, consolidated: 101400000 },
    { metric: 'Expenses', standalone: 79500000, eliminations: -8600000, consolidated: 70900000 },
    { metric: 'Net Income', standalone: 30500000, eliminations: 0, consolidated: 30500000 },
    { metric: 'Assets', standalone: 415000000, eliminations: -12000000, consolidated: 403000000 },
    { metric: 'Liabilities', standalone: 165000000, eliminations: -12000000, consolidated: 153000000 },
    { metric: 'Equity', standalone: 250000000, eliminations: 0, consolidated: 250000000 }
  ];

  // Entity hierarchy for visualization
  const entityHierarchy = {
    name: 'Global Manufacturing Corp',
    value: 100,
    children: [
      {
        name: 'European Operations GmbH',
        value: 100,
        children: [
          { name: 'UK Manufacturing Ltd', value: 100 }
        ]
      },
      { name: 'Asia Pacific Ltd', value: 75 },
      { name: 'Tech Innovation JV', value: 50 }
    ]
  };

  // Exchange rates for consolidation
  const exchangeRates = [
    { currency: 'EUR', rate: 1.08, change: 0.02 },
    { currency: 'GBP', rate: 1.26, change: -0.01 },
    { currency: 'SGD', rate: 0.74, change: 0.00 },
    { currency: 'JPY', rate: 0.0067, change: -0.0001 }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entities</p>
              <p className="text-2xl font-bold text-gray-900">{entities.length}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consolidated Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$101.4M</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Eliminations</p>
              <p className="text-2xl font-bold text-gray-900">$8.6M</p>
            </div>
            <GitMerge className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-gray-900">$30.5M</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Consolidation Impact Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consolidatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`} />
              <Legend />
              <Bar dataKey="standalone" fill="#3B82F6" name="Standalone" />
              <Bar dataKey="eliminations" fill="#EF4444" name="Eliminations" />
              <Bar dataKey="consolidated" fill="#10B981" name="Consolidated" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Entity Contribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={financialData.map(fd => ({
                  name: entities.find(e => e.id === fd.entityId)?.name,
                  value: fd.revenue
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name?.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
              >
                {financialData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3">
        <h3 className="text-lg font-semibold mb-2">Recent Consolidation Sessions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Period</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Created By</th>
                <th className="text-left py-2">Entities</th>
                <th className="text-left py-2">Adjustments</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consolidationSessions.map(session => (
                <tr key={session.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{session.period}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      session.status === 'published' ? 'bg-green-100 text-green-800' :
                      session.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      session.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="py-2">{session.createdBy}</td>
                  <td className="py-2">{session.entities.length}</td>
                  <td className="py-2">{session.adjustments}</td>
                  <td className="py-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStructureTab = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Entity Structure</h3>
          <button
            onClick={() => setShowEntityModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entity
          </button>
        </div>

        <div className="mb-2">
          <select
            value={consolidationView}
            onChange={(e) => setConsolidationView(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="structure">Ownership Structure</option>
            <option value="list">Entity List</option>
            <option value="map">Geographic Map</option>
          </select>
        </div>

        {consolidationView === 'structure' && (
          <div className="bg-gray-50 rounded-lg p-3">
            <ResponsiveContainer width="100%" height={400}>
              <Treemap
                data={[entityHierarchy]}
                dataKey="value"
                aspectRatio={4/3}
                stroke="#fff"
                fill="#3B82F6"
              />
            </ResponsiveContainer>
          </div>
        )}

        {consolidationView === 'list' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Code</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Country</th>
                  <th className="text-left py-2">Currency</th>
                  <th className="text-left py-2">Ownership %</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entities.map(entity => (
                  <tr key={entity.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-mono text-sm">{entity.code}</td>
                    <td className="py-2">{entity.name}</td>
                    <td className="py-2">
                      <span className="capitalize">{entity.type}</span>
                    </td>
                    <td className="py-2">{entity.country}</td>
                    <td className="py-2">{entity.currency}</td>
                    <td className="py-2">{entity.ownershipPercentage}%</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        entity.status === 'active' ? 'bg-green-100 text-green-800' :
                        entity.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entity.status}
                      </span>
                    </td>
                    <td className="py-2">
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <Settings className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">Settings</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Reporting Standards</h3>
          <div className="space-y-2">
            {['IFRS', 'US-GAAP', 'LOCAL-GAAP'].map(standard => {
              const count = entities.filter(e => e.reportingStandard === standard).length;
              return (
                <div key={standard} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{standard}</span>
                  <div className="flex items-center">
                    <span className="mr-4">{count} entities</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(count / entities.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Entity Types Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie dataKey="value"
                data={[
                  { name: 'Subsidiaries', value: entities.filter(e => e.type === 'subsidiary').length },
                  { name: 'Joint Ventures', value: entities.filter(e => e.type === 'joint-venture').length },
                  { name: 'Associates', value: entities.filter(e => e.type === 'associate').length }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                label
              >
                <Cell fill="#3B82F6" />
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderEliminationsTab = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Intercompany Transactions</h3>
          <div className="flex space-x-2">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Filter</span>
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Auto-Match
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">From Entity</th>
                <th className="text-left py-2">To Entity</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Elimination</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {intercompanyTransactions.map(transaction => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-mono text-sm">{transaction.id}</td>
                  <td className="py-2">
                    {entities.find(e => e.id === transaction.fromEntityId)?.name}
                  </td>
                  <td className="py-2">
                    {entities.find(e => e.id === transaction.toEntityId)?.name}
                  </td>
                  <td className="py-2">
                    <span className="capitalize">{transaction.transactionType}</span>
                  </td>
                  <td className="py-2">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: transaction.currency
                    }).format(transaction.amount)}
                  </td>
                  <td className="py-2">{transaction.date}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'eliminated' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'validated' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-2">
                    {transaction.eliminationAmount && (
                      <span className="text-red-600">
                        -{new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: transaction.currency
                        }).format(transaction.eliminationAmount)}
                      </span>
                    )}
                  </td>
                  <td className="py-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Approve</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Elimination Summary by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { type: 'Sales', amount: 2500000 },
              { type: 'Services', amount: 800000 },
              { type: 'Loans', amount: 5000000 },
              { type: 'Dividends', amount: 1500000 },
              { type: 'Royalties', amount: 300000 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`} />
              <Bar dataKey="amount" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Intercompany Flow</h3>
          <div className="space-y-3">
            {intercompanyTransactions.slice(0, 4).map(transaction => {
              const fromEntity = entities.find(e => e.id === transaction.fromEntityId);
              const toEntity = entities.find(e => e.id === transaction.toEntityId);
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="font-medium">{fromEntity?.code}</span>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="font-medium">{toEntity?.code}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: transaction.currency
                    }).format(transaction.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdjustmentsTab = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Consolidation Adjustments</h3>
          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Adjustment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Debit Account</th>
                <th className="text-left py-2">Credit Account</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Entity</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consolidationAdjustments.map(adjustment => (
                <tr key={adjustment.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-mono text-sm">{adjustment.id}</td>
                  <td className="py-2">
                    <span className="capitalize">{adjustment.type}</span>
                  </td>
                  <td className="py-2">{adjustment.description}</td>
                  <td className="py-2">{adjustment.debitAccount}</td>
                  <td className="py-2">{adjustment.creditAccount}</td>
                  <td className="py-2">
                    ${new Intl.NumberFormat('en-US').format(adjustment.amount)}
                  </td>
                  <td className="py-2">
                    {entities.find(e => e.id === adjustment.entityId)?.code}
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      adjustment.status === 'posted' ? 'bg-green-100 text-green-800' :
                      adjustment.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {adjustment.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm mr-2">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">View</span>
                    </button>
                    {adjustment.status === 'draft' && (
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Approve</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Adjustment Types</h3>
          <div className="space-y-2">
            {['elimination', 'currency', 'goodwill', 'minority'].map(type => {
              const count = consolidationAdjustments.filter(a => a.type === type).length;
              const total = consolidationAdjustments
                .filter(a => a.type === type)
                .reduce((sum, a) => sum + a.amount, 0);
              return (
                <div key={type} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{type}</span>
                    <span className="text-sm text-gray-600">{count} items</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Total: ${new Intl.NumberFormat('en-US').format(total)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Exchange Rates</h3>
          <div className="space-y-2">
            {exchangeRates.map(rate => (
              <div key={rate.currency} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{rate.currency}/USD</span>
                  <div className="flex items-center">
                    <span className="mr-2">{rate.rate.toFixed(4)}</span>
                    <span className={`text-sm ${rate.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {rate.change >= 0 ? '+' : ''}{(rate.change * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              <RefreshCw className="h-4 w-4 inline mr-2" />
              Update Rates
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3">
          <h3 className="text-lg font-semibold mb-2">Adjustment Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: 'Draft', value: consolidationAdjustments.filter(a => a.status === 'draft').length },
                  { name: 'Approved', value: consolidationAdjustments.filter(a => a.status === 'approved').length },
                  { name: 'Posted', value: consolidationAdjustments.filter(a => a.status === 'posted').length }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                label
              >
                <Cell fill="#F59E0B" />
                <Cell fill="#3B82F6" />
                <Cell fill="#10B981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Consolidated Financial Statements</h3>
          <div className="flex space-x-2">
            <select className="border rounded px-3 py-2" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
              <option value="2024-Q1">2024 Q1</option>
              <option value="2023-Q4">2023 Q4</option>
              <option value="2023-Q3">2023 Q3</option>
              <option value="2023-FY">2023 Full Year</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-3">Consolidated Income Statement</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Revenue</td>
                  <td className="text-right">$101,400,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Cost of Revenue</td>
                  <td className="text-right">($60,500,000)</td>
                </tr>
                <tr className="border-b font-semibold">
                  <td className="py-2">Gross Profit</td>
                  <td className="text-right">$40,900,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Operating Expenses</td>
                  <td className="text-right">($10,400,000)</td>
                </tr>
                <tr className="border-b font-semibold">
                  <td className="py-2">Operating Income</td>
                  <td className="text-right">$30,500,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Other Income/Expenses</td>
                  <td className="text-right">$0</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Tax Expense</td>
                  <td className="text-right">($9,150,000)</td>
                </tr>
                <tr className="font-bold">
                  <td className="py-2">Net Income</td>
                  <td className="text-right">$21,350,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-3">Consolidated Balance Sheet</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="font-semibold border-b">
                  <td className="py-2">Assets</td>
                  <td className="text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pl-4">Current Assets</td>
                  <td className="text-right">$150,000,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pl-4">Non-Current Assets</td>
                  <td className="text-right">$253,000,000</td>
                </tr>
                <tr className="border-b font-semibold">
                  <td className="py-2">Total Assets</td>
                  <td className="text-right">$403,000,000</td>
                </tr>
                <tr className="font-semibold border-b">
                  <td className="py-2">Liabilities</td>
                  <td className="text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pl-4">Current Liabilities</td>
                  <td className="text-right">$75,000,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pl-4">Non-Current Liabilities</td>
                  <td className="text-right">$78,000,000</td>
                </tr>
                <tr className="border-b font-semibold">
                  <td className="py-2">Total Liabilities</td>
                  <td className="text-right">$153,000,000</td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2">Total Equity</td>
                  <td className="text-right">$250,000,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3">
        <h3 className="text-lg font-semibold mb-2">Consolidation Reconciliation</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Parent</th>
                <th className="text-right py-2">Subsidiaries</th>
                <th className="text-right py-2">Eliminations</th>
                <th className="text-right py-2">Non-controlling</th>
                <th className="text-right py-2 font-bold">Consolidated</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Revenue</td>
                <td className="text-right">$50,000,000</td>
                <td className="text-right">$60,000,000</td>
                <td className="text-right text-red-600">($8,600,000)</td>
                <td className="text-right">$0</td>
                <td className="text-right font-semibold">$101,400,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Net Income</td>
                <td className="text-right">$15,000,000</td>
                <td className="text-right">$15,500,000</td>
                <td className="text-right">$0</td>
                <td className="text-right text-red-600">($1,000,000)</td>
                <td className="text-right font-semibold">$29,500,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Assets</td>
                <td className="text-right">$200,000,000</td>
                <td className="text-right">$215,000,000</td>
                <td className="text-right text-red-600">($12,000,000)</td>
                <td className="text-right">$0</td>
                <td className="text-right font-semibold">$403,000,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Equity</td>
                <td className="text-right">$120,000,000</td>
                <td className="text-right">$130,000,000</td>
                <td className="text-right">$0</td>
                <td className="text-right">$0</td>
                <td className="text-right font-semibold">$250,000,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3">
        <h3 className="text-lg font-semibold mb-2">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { name: 'Consolidated Financial Statements', type: 'PDF', size: '2.4 MB' },
            { name: 'Elimination Entries Report', type: 'XLSX', size: '450 KB' },
            { name: 'Entity Performance Analysis', type: 'PDF', size: '1.8 MB' },
            { name: 'Currency Translation Report', type: 'XLSX', size: '320 KB' },
            { name: 'Minority Interest Calculation', type: 'PDF', size: '890 KB' },
            { name: 'Audit Trail Report', type: 'CSV', size: '1.2 MB' }
          ].map((report, index) => (
            <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{report.type} • {report.size}</p>
                </div>
                <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Download className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkflowTab = () => (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow p-3">
        <h3 className="text-lg font-semibold mb-2">Consolidation Process Workflow</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 h-1 bg-gray-200 top-5"></div>
              <div className="absolute left-0 h-1 bg-blue-500 top-5" style={{ width: '60%' }}></div>
              {['Data Collection', 'Validation', 'Eliminations', 'Adjustments', 'Review', 'Approval', 'Publish'].map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index <= 3 ? <Check className="h-5 w-5" /> : index + 1}
                  </div>
                  <span className="text-xs mt-2">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-3">Current Tasks</h4>
            <div className="space-y-2">
              {[
                { task: 'Complete Q1 data collection', assignee: 'John Doe', due: '2024-04-10', status: 'in-progress' },
                { task: 'Validate subsidiary reports', assignee: 'Jane Smith', due: '2024-04-12', status: 'pending' },
                { task: 'Review currency translations', assignee: 'Mike Johnson', due: '2024-04-13', status: 'pending' },
                { task: 'Approve elimination entries', assignee: 'Sarah Wilson', due: '2024-04-15', status: 'pending' }
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-gray-500">{task.assignee} • Due {task.due}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-3">Approval Queue</h4>
            <div className="space-y-2">
              {[
                { item: 'Currency Translation Adjustments', type: 'adjustment', amount: '$450,000', status: 'pending' },
                { item: 'Intercompany Eliminations', type: 'elimination', amount: '$8,600,000', status: 'pending' },
                { item: 'Goodwill Impairment', type: 'adjustment', amount: '$200,000', status: 'review' },
                { item: 'Minority Interest Calculation', type: 'adjustment', amount: '$1,000,000', status: 'approved' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{item.item}</p>
                    <p className="text-sm text-gray-500">{item.type} • {item.amount}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'approved' ? 'bg-green-100 text-green-800' :
                      item.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                    {item.status === 'pending' && (
                      <button className="inline-flex items-center gap-1.5 px-3 py-2 border border-green-300 rounded-lg hover:bg-green-50 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Approve</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3">
        <h3 className="text-lg font-semibold mb-2">Process Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {[
            { control: 'Data Validation', status: 'active', lastRun: '2024-04-05 10:30', result: 'passed' },
            { control: 'Balance Check', status: 'active', lastRun: '2024-04-05 10:35', result: 'passed' },
            { control: 'Currency Conversion', status: 'active', lastRun: '2024-04-05 10:40', result: 'passed' },
            { control: 'Elimination Matching', status: 'active', lastRun: '2024-04-05 10:45', result: 'warning' },
            { control: 'Minority Interest Calc', status: 'active', lastRun: '2024-04-05 10:50', result: 'passed' },
            { control: 'Final Reconciliation', status: 'scheduled', lastRun: '-', result: '-' }
          ].map((control, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{control.control}</h4>
                {control.status === 'active' ?
                  <Lock className="h-4 w-4 text-green-500" /> :
                  <Unlock className="h-4 w-4 text-gray-400" />
                }
              </div>
              <p className="text-sm text-gray-500">Last run: {control.lastRun}</p>
              {control.result !== '-' && (
                <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                  control.result === 'passed' ? 'bg-green-100 text-green-800' :
                  control.result === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  control.result === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {control.result}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 ">
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Consolidation</h2>
        <p className="text-gray-600">Multi-entity financial reporting and consolidation management</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-3">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'structure', 'eliminations', 'adjustments', 'reports', 'workflow'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-6 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'structure' && renderStructureTab()}
        {activeTab === 'eliminations' && renderEliminationsTab()}
        {activeTab === 'adjustments' && renderAdjustmentsTab()}
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'workflow' && renderWorkflowTab()}
      </div>

      {showAdjustmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-3 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">New Consolidation Adjustment</h3>
              <button onClick={() => setShowAdjustmentModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Adjustment Type</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Elimination</option>
                  <option>Currency Translation</option>
                  <option>Goodwill</option>
                  <option>Minority Interest</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded px-3 py-2" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Debit Account</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Credit Account</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input type="number" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Entity</label>
                  <select className="w-full border rounded px-3 py-2">
                    {entities.map(entity => (
                      <option key={entity.id} value={entity.id}>{entity.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowAdjustmentModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Create Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEntityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-3 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Add New Entity</h3>
              <button onClick={() => setShowEntityModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Entity Code</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Entity Name</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Entity Type</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>Subsidiary</option>
                    <option>Joint Venture</option>
                    <option>Associate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Parent Entity</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>Global Manufacturing Corp</option>
                    <option>European Operations GmbH</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input type="text" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>SGD</option>
                    <option>JPY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ownership %</label>
                  <input type="number" className="w-full border rounded px-3 py-2" min="0" max="100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Reporting Standard</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>IFRS</option>
                    <option>US-GAAP</option>
                    <option>LOCAL-GAAP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fiscal Year End</label>
                  <input type="text" className="w-full border rounded px-3 py-2" placeholder="MM-DD" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowEntityModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Add Entity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialConsolidation;