'use client'

import { useState, useEffect } from 'react'
import { Play, RotateCcw, CheckCircle, XCircle, AlertTriangle, Clock, FileText, Database } from 'lucide-react'

export type TestStatus = 'idle' | 'running' | 'success' | 'failed' | 'warning';

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  mockData: Record<string, any>;
  expectedOutcome: string;
  status: TestStatus;
  duration?: number;
  lastRun?: string;
}

export interface TestResult {
  scenarioId: string;
  status: TestStatus;
  startTime: string;
  endTime?: string;
  duration: number;
  steps: TestStep[];
  errors?: string[];
  warnings?: string[];
}

export interface TestStep {
  id: string;
  name: string;
  status: TestStatus;
  duration: number;
  output?: any;
  error?: string;
}

export default function TestingSandbox() {
  const [scenarios, setScenarios] = useState<TestScenario[]>([
    {
      id: 'TEST-001',
      name: 'PO Approval - High Value',
      description: 'Test high-value purchase order requiring CFO approval',
      mockData: {
        poNumber: 'PO-12345',
        amount: 150000,
        department: 'Finance',
        requestedBy: 'john.doe@company.com',
        items: [
          { sku: 'LAPTOP-001', quantity: 10, unitPrice: 15000 }
        ]
      },
      expectedOutcome: 'Routed to CFO for approval',
      status: 'idle',
      lastRun: '2025-01-20 14:30:00'
    },
    {
      id: 'TEST-002',
      name: 'PO Approval - Low Value',
      description: 'Test auto-approval for low-value purchase orders',
      mockData: {
        poNumber: 'PO-12346',
        amount: 25000,
        department: 'Operations',
        requestedBy: 'jane.smith@company.com',
        items: [
          { sku: 'OFFICE-SUPPLIES-001', quantity: 50, unitPrice: 500 }
        ]
      },
      expectedOutcome: 'Auto-approved',
      status: 'idle',
      lastRun: '2025-01-20 13:15:00'
    },
    {
      id: 'TEST-003',
      name: 'Inventory Reorder - Critical Stock',
      description: 'Test urgent reorder when stock hits critical levels',
      mockData: {
        itemSku: 'RAW-MATERIAL-001',
        stockLevel: 15,
        reorderPoint: 50,
        demandForecast: 'high',
        itemCategory: 'critical',
        preferredSupplier: 'SUP-001'
      },
      expectedOutcome: 'Urgent PO created with express shipping',
      status: 'idle',
      lastRun: '2025-01-20 12:00:00'
    },
    {
      id: 'TEST-004',
      name: 'Quality Inspection - New Supplier',
      description: 'Test full QC routing for new supplier orders',
      mockData: {
        supplierId: 'SUP-999',
        supplierTenure: 2,
        supplierRating: 3.5,
        orderValue: 75000,
        itemCount: 100
      },
      expectedOutcome: 'Routed to full QC with senior inspector',
      status: 'idle',
      lastRun: '2025-01-19 16:45:00'
    }
  ]);

  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);

  useEffect(() => {
    if (activeTest) {
      const interval = setInterval(() => {
        setRealTimeUpdate(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTest]);

  const runTest = (scenarioId: string) => {
    setActiveTest(scenarioId);

    // Simulate test execution
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setScenarios(prev => prev.map(s =>
      s.id === scenarioId ? { ...s, status: 'running' as TestStatus } : s
    ));

    // Simulate async test execution
    setTimeout(() => {
      const result: TestResult = {
        scenarioId,
        status: 'success',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3500).toISOString(),
        duration: 3.5,
        steps: [
          { id: 'S1', name: 'Load mock data', status: 'success', duration: 0.2, output: scenario.mockData },
          { id: 'S2', name: 'Evaluate conditions', status: 'success', duration: 0.5, output: { matched: true, branch: 'BR-1' } },
          { id: 'S3', name: 'Execute actions', status: 'success', duration: 1.8, output: { actionsTaken: ['send_approval', 'notify_team'] } },
          { id: 'S4', name: 'Verify outcome', status: 'success', duration: 1.0, output: { actual: scenario.expectedOutcome, match: true } }
        ]
      };

      setTestResults(prev => [result, ...prev]);
      setScenarios(prev => prev.map(s =>
        s.id === scenarioId ? {
          ...s,
          status: 'success' as TestStatus,
          duration: 3.5,
          lastRun: new Date().toLocaleString()
        } : s
      ));
      setActiveTest(null);
    }, 3500);
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestStatus) => {
    const colors = {
      idle: 'bg-gray-100 text-gray-700',
      running: 'bg-blue-100 text-blue-700',
      success: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      warning: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Play className="h-8 w-8 text-green-600" />
              Testing Sandbox
            </h2>
            <p className="text-gray-600 mt-1">Safe testing environment with mock data and execution simulation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {testResults.length} tests executed
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
              <RotateCcw className="h-5 w-5" />
              Run All Tests
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Scenarios */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Scenarios</h3>

          {scenarios.map((scenario) => (
            <div key={scenario.id} className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(scenario.status)}
                    <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scenario.status)}`}>
                    {scenario.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{scenario.description}</p>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700 uppercase">Mock Data</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-800 max-h-32 overflow-auto">
                    {JSON.stringify(scenario.mockData, null, 2)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-700 uppercase">Expected Outcome</span>
                  </div>
                  <p className="text-sm text-gray-900 bg-green-50 p-2 rounded">{scenario.expectedOutcome}</p>
                </div>

                {scenario.lastRun && (
                  <div className="text-xs text-gray-500">
                    Last run: {scenario.lastRun}
                    {scenario.duration && ` • ${scenario.duration}s`}
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => runTest(scenario.id)}
                  disabled={activeTest !== null}
                  className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4" />
                  {scenario.status === 'running' ? 'Running...' : 'Run Test'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Test Results</h3>

          {testResults.length === 0 ? (
            <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No test results yet. Run a test to see results here.</p>
            </div>
          ) : (
            testResults.map((result) => {
              const scenario = scenarios.find(s => s.id === result.scenarioId);
              return (
                <div key={result.scenarioId + result.startTime} className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.status)}
                        <h4 className="font-semibold text-gray-900">{scenario?.name}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Duration: {result.duration}s • {new Date(result.startTime).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    {result.steps.map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{step.name}</span>
                            <span className="text-xs text-gray-500">{step.duration}s</span>
                          </div>
                          {step.output && (
                            <div className="bg-white p-2 rounded text-xs font-mono text-gray-700 max-h-20 overflow-auto">
                              {JSON.stringify(step.output, null, 2)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {result.errors && result.errors.length > 0 && (
                    <div className="p-3 bg-red-50 border-t border-red-200">
                      <div className="text-xs font-medium text-red-700 mb-1">ERRORS:</div>
                      {result.errors.map((err, idx) => (
                        <div key={idx} className="text-xs text-red-600">• {err}</div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
