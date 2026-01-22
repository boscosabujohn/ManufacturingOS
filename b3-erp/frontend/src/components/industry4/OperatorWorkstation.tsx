'use client';

import React, { useState, useEffect, useCallback } from 'react';

// Types
export type WorkstationMode = 'production' | 'quality' | 'maintenance' | 'setup';
export type JobStatus = 'not_started' | 'in_progress' | 'paused' | 'completed';

export interface CurrentJob {
  id: string;
  workOrderId: string;
  productName: string;
  operationName: string;
  targetQuantity: number;
  completedQuantity: number;
  scrapQuantity: number;
  startTime?: Date;
  status: JobStatus;
  machineId: string;
  machineName: string;
}

export interface WorkstationAction {
  id: string;
  label: string;
  icon: string;
  color: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'orange';
  size: 'small' | 'medium' | 'large';
  action: () => void;
  disabled?: boolean;
  requiresConfirmation?: boolean;
}

export interface QualityCheck {
  id: string;
  name: string;
  specification: string;
  result?: 'pass' | 'fail' | 'pending';
  value?: string;
}

export interface OperatorWorkstationProps {
  operatorId?: string;
  operatorName?: string;
  currentJob?: CurrentJob;
  onJobAction?: (action: string, jobId: string, data?: Record<string, unknown>) => void;
  onQuantityUpdate?: (completed: number, scrap: number) => void;
  onQualityCheck?: (checks: QualityCheck[]) => void;
  onMaintenanceRequest?: (type: string, description: string) => void;
  className?: string;
}

// Fixed date for consistent rendering
const MOCK_NOW = new Date('2024-03-10T14:30:00').getTime();

// Mock data
const generateMockJob = (): CurrentJob => ({
  id: 'JOB-001',
  workOrderId: 'WO-2024-1847',
  productName: 'Assembly Unit A-7',
  operationName: 'Final Assembly',
  targetQuantity: 150,
  completedQuantity: 87,
  scrapQuantity: 3,
  startTime: new Date(MOCK_NOW - 3 * 60 * 60 * 1000),
  status: 'in_progress',
  machineId: 'MC-04',
  machineName: 'Assembly Station 4',
});

const mockQualityChecks: QualityCheck[] = [
  { id: 'qc1', name: 'Dimension A', specification: '25.0 ± 0.1 mm', result: 'pending' },
  { id: 'qc2', name: 'Dimension B', specification: '15.5 ± 0.05 mm', result: 'pending' },
  { id: 'qc3', name: 'Surface Finish', specification: 'Ra ≤ 1.6 μm', result: 'pending' },
  { id: 'qc4', name: 'Visual Inspection', specification: 'No defects', result: 'pending' },
];

export function OperatorWorkstation({
  operatorName = 'Operator',
  currentJob: initialJob,
  onJobAction,
  onQuantityUpdate,
  onQualityCheck,
  onMaintenanceRequest,
  className = '',
}: OperatorWorkstationProps) {
  const [mode, setMode] = useState<WorkstationMode>('production');
  const [job, setJob] = useState<CurrentJob>(initialJob || generateMockJob());
  const [elapsedTime, setElapsedTime] = useState('0:00:00');
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(mockQualityChecks);
  const [countInput, setCountInput] = useState({ good: 0, scrap: 0 });
  const [maintenanceNote, setMaintenanceNote] = useState('');

  // Update elapsed time
  useEffect(() => {
    if (job.status === 'in_progress' && job.startTime) {
      const interval = setInterval(() => {
        const diff = Date.now() - new Date(job.startTime!).getTime();
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setElapsedTime(
          `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [job.status, job.startTime]);

  const handleJobAction = useCallback((action: string) => {
    switch (action) {
      case 'start':
        setJob(prev => ({
          ...prev,
          status: 'in_progress',
          startTime: new Date(),
        }));
        break;
      case 'pause':
        setJob(prev => ({ ...prev, status: 'paused' }));
        break;
      case 'resume':
        setJob(prev => ({ ...prev, status: 'in_progress' }));
        break;
      case 'complete':
        setJob(prev => ({ ...prev, status: 'completed' }));
        break;
    }
    onJobAction?.(action, job.id);
    setShowConfirmDialog(null);
  }, [job.id, onJobAction]);

  const handleQuantitySubmit = () => {
    setJob(prev => ({
      ...prev,
      completedQuantity: prev.completedQuantity + countInput.good,
      scrapQuantity: prev.scrapQuantity + countInput.scrap,
    }));
    onQuantityUpdate?.(countInput.good, countInput.scrap);
    setCountInput({ good: 0, scrap: 0 });
  };

  const handleQualityResult = (checkId: string, result: 'pass' | 'fail') => {
    setQualityChecks(prev =>
      prev.map(check =>
        check.id === checkId ? { ...check, result } : check
      )
    );
  };

  const submitQualityChecks = () => {
    onQualityCheck?.(qualityChecks);
    setQualityChecks(mockQualityChecks);
  };

  const submitMaintenanceRequest = (type: string) => {
    onMaintenanceRequest?.(type, maintenanceNote);
    setMaintenanceNote('');
    setShowConfirmDialog(null);
  };

  const progress = Math.round((job.completedQuantity / job.targetQuantity) * 100);

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'in_progress': return 'bg-green-600';
      case 'paused': return 'bg-yellow-600';
      case 'completed': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const renderProductionMode = () => (
    <div className="space-y-6">
      {/* Job Status Card */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-lg">Current Job</p>
            <p className="text-3xl font-bold text-white">{job.workOrderId}</p>
            <p className="text-xl text-gray-300">{job.productName}</p>
          </div>
          <div className={`px-6 py-3 rounded-xl ${getStatusColor(job.status)}`}>
            <p className="text-white text-xl font-bold uppercase">
              {job.status.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-lg mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-bold">{job.completedQuantity} / {job.targetQuantity}</span>
          </div>
          <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-2xl font-bold text-green-400">{progress}%</span>
            <span className="text-gray-400">Scrap: <span className="text-red-400 font-bold">{job.scrapQuantity}</span></span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between bg-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏱️</span>
            <div>
              <p className="text-gray-400">Elapsed Time</p>
              <p className="text-3xl font-mono font-bold text-white">{elapsedTime}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Machine</p>
            <p className="text-xl text-white">{job.machineName}</p>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {job.status === 'not_started' && (
          <button
            onClick={() => setShowConfirmDialog('start')}
            className="col-span-2 bg-green-600 hover:bg-green-700 text-white text-3xl font-bold py-10 rounded-2xl transition-colors active:scale-95"
          >
            <span className="text-5xl mb-2 block">▶️</span>
            START JOB
          </button>
        )}

        {job.status === 'in_progress' && (
          <>
            <button
              onClick={() => setShowConfirmDialog('pause')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-2xl font-bold py-8 rounded-2xl transition-colors active:scale-95"
            >
              <span className="text-4xl mb-2 block">⏸️</span>
              PAUSE
            </button>
            <button
              onClick={() => setShowConfirmDialog('complete')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-8 rounded-2xl transition-colors active:scale-95"
            >
              <span className="text-4xl mb-2 block">✅</span>
              COMPLETE
            </button>
          </>
        )}

        {job.status === 'paused' && (
          <>
            <button
              onClick={() => handleJobAction('resume')}
              className="bg-green-600 hover:bg-green-700 text-white text-2xl font-bold py-8 rounded-2xl transition-colors active:scale-95"
            >
              <span className="text-4xl mb-2 block">▶️</span>
              RESUME
            </button>
            <button
              onClick={() => setShowConfirmDialog('complete')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-8 rounded-2xl transition-colors active:scale-95"
            >
              <span className="text-4xl mb-2 block">✅</span>
              COMPLETE
            </button>
          </>
        )}
      </div>

      {/* Count Entry */}
      {job.status === 'in_progress' && (
        <div className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Log Production Count</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 block mb-2">Good Parts</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCountInput(prev => ({ ...prev, good: Math.max(0, prev.good - 1) }))}
                  className="w-16 h-16 bg-gray-700 text-white text-3xl rounded-xl hover:bg-gray-600 active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  value={countInput.good}
                  onChange={e => setCountInput(prev => ({ ...prev, good: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="flex-1 h-16 bg-gray-700 text-white text-3xl text-center rounded-xl border-2 border-gray-600 focus:border-green-500 outline-none"
                />
                <button
                  onClick={() => setCountInput(prev => ({ ...prev, good: prev.good + 1 }))}
                  className="w-16 h-16 bg-green-600 text-white text-3xl rounded-xl hover:bg-green-700 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="text-gray-400 block mb-2">Scrap</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCountInput(prev => ({ ...prev, scrap: Math.max(0, prev.scrap - 1) }))}
                  className="w-16 h-16 bg-gray-700 text-white text-3xl rounded-xl hover:bg-gray-600 active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  value={countInput.scrap}
                  onChange={e => setCountInput(prev => ({ ...prev, scrap: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className="flex-1 h-16 bg-gray-700 text-white text-3xl text-center rounded-xl border-2 border-gray-600 focus:border-red-500 outline-none"
                />
                <button
                  onClick={() => setCountInput(prev => ({ ...prev, scrap: prev.scrap + 1 }))}
                  className="w-16 h-16 bg-red-600 text-white text-3xl rounded-xl hover:bg-red-700 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleQuantitySubmit}
            disabled={countInput.good === 0 && countInput.scrap === 0}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold rounded-xl transition-colors"
          >
            SUBMIT COUNT
          </button>
        </div>
      )}
    </div>
  );

  const renderQualityMode = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Quality Checks</h3>
        <p className="text-gray-400 mb-6">Complete all required quality checks for the current job</p>

        <div className="space-y-4">
          {qualityChecks.map(check => (
            <div key={check.id} className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white text-xl font-medium">{check.name}</p>
                  <p className="text-gray-400">{check.specification}</p>
                </div>
                {check.result === 'pass' && (
                  <span className="text-4xl">✅</span>
                )}
                {check.result === 'fail' && (
                  <span className="text-4xl">❌</span>
                )}
              </div>

              {check.result === 'pending' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleQualityResult(check.id, 'pass')}
                    className="py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl transition-colors active:scale-95"
                  >
                    ✓ PASS
                  </button>
                  <button
                    onClick={() => handleQualityResult(check.id, 'fail')}
                    className="py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-xl transition-colors active:scale-95"
                  >
                    ✗ FAIL
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={submitQualityChecks}
          disabled={qualityChecks.some(c => c.result === 'pending')}
          className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xl font-bold rounded-xl transition-colors"
        >
          SUBMIT ALL CHECKS
        </button>
      </div>
    </div>
  );

  const renderMaintenanceMode = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Request Maintenance</h3>
        <p className="text-gray-400 mb-6">Select issue type and describe the problem</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowConfirmDialog('maintenance-urgent')}
            className="py-8 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-2xl transition-colors active:scale-95"
          >
            <span className="text-4xl block mb-2">🚨</span>
            URGENT
            <span className="block text-sm font-normal mt-1">Machine Down</span>
          </button>
          <button
            onClick={() => setShowConfirmDialog('maintenance-scheduled')}
            className="py-8 bg-yellow-600 hover:bg-yellow-700 text-white text-xl font-bold rounded-2xl transition-colors active:scale-95"
          >
            <span className="text-4xl block mb-2">🔧</span>
            SCHEDULED
            <span className="block text-sm font-normal mt-1">Plan Repair</span>
          </button>
          <button
            onClick={() => setShowConfirmDialog('maintenance-tooling')}
            className="py-8 bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold rounded-2xl transition-colors active:scale-95"
          >
            <span className="text-4xl block mb-2">🛠️</span>
            TOOLING
            <span className="block text-sm font-normal mt-1">Tool Change</span>
          </button>
          <button
            onClick={() => setShowConfirmDialog('maintenance-quality')}
            className="py-8 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-2xl transition-colors active:scale-95"
          >
            <span className="text-4xl block mb-2">📊</span>
            QUALITY
            <span className="block text-sm font-normal mt-1">Out of Spec</span>
          </button>
        </div>

        <div>
          <label className="text-gray-400 block mb-2">Additional Notes</label>
          <textarea
            value={maintenanceNote}
            onChange={e => setMaintenanceNote(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full h-32 bg-gray-700 text-white text-lg p-4 rounded-xl border-2 border-gray-600 focus:border-blue-500 outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderSetupMode = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Job Setup</h3>
        <p className="text-gray-400 mb-6">Complete setup checklist before starting production</p>

        <div className="space-y-4">
          {[
            { id: 1, task: 'Load raw materials', icon: '📦' },
            { id: 2, task: 'Verify machine settings', icon: '⚙️' },
            { id: 3, task: 'Check tooling condition', icon: '🔧' },
            { id: 4, task: 'Review work instructions', icon: '📋' },
            { id: 5, task: 'Perform first piece inspection', icon: '🔍' },
          ].map(item => (
            <label
              key={item.id}
              className="flex items-center gap-4 p-4 bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-650 transition-colors"
            >
              <input
                type="checkbox"
                className="w-8 h-8 rounded-lg accent-green-600"
              />
              <span className="text-3xl">{item.icon}</span>
              <span className="text-white text-xl">{item.task}</span>
            </label>
          ))}
        </div>

        <button className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl transition-colors">
          SETUP COMPLETE
        </button>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-900 min-h-screen ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
            👷
          </div>
          <div>
            <p className="text-white text-xl font-bold">{operatorName}</p>
            <p className="text-gray-400">{job.machineName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Current Time</p>
          <p className="text-white text-2xl font-mono">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'production', label: 'Production', icon: '🏭' },
            { id: 'quality', label: 'Quality', icon: '✅' },
            { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
            { id: 'setup', label: 'Setup', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as WorkstationMode)}
              className={`py-3 rounded-xl font-bold text-lg transition-colors ${mode === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
            >
              <span className="text-xl mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {mode === 'production' && renderProductionMode()}
        {mode === 'quality' && renderQualityMode()}
        {mode === 'maintenance' && renderMaintenanceMode()}
        {mode === 'setup' && renderSetupMode()}
      </div>

      {/* Quick Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-3">
        <div className="grid grid-cols-4 gap-2">
          <button className="py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors active:scale-95">
            🚨 EMERGENCY
          </button>
          <button className="py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl transition-colors active:scale-95">
            👤 SUPERVISOR
          </button>
          <button className="py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors active:scale-95">
            📦 MATERIAL
          </button>
          <button className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors active:scale-95">
            📋 DOCS
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Action</h3>

            {showConfirmDialog === 'start' && (
              <p className="text-gray-300 text-lg mb-6">Are you sure you want to start this job?</p>
            )}
            {showConfirmDialog === 'pause' && (
              <p className="text-gray-300 text-lg mb-6">Are you sure you want to pause this job?</p>
            )}
            {showConfirmDialog === 'complete' && (
              <p className="text-gray-300 text-lg mb-6">Are you sure you want to complete this job?</p>
            )}
            {showConfirmDialog.startsWith('maintenance') && (
              <>
                <p className="text-gray-300 text-lg mb-4">
                  Submit {showConfirmDialog.split('-')[1].toUpperCase()} maintenance request?
                </p>
                {maintenanceNote && (
                  <p className="text-gray-400 text-sm mb-4 p-3 bg-gray-700 rounded-lg">{maintenanceNote}</p>
                )}
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="py-4 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold rounded-xl transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  if (showConfirmDialog.startsWith('maintenance')) {
                    submitMaintenanceRequest(showConfirmDialog.split('-')[1]);
                  } else {
                    handleJobAction(showConfirmDialog);
                  }
                }}
                className="py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl transition-colors"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding for fixed footer */}
      <div className="h-20" />
    </div>
  );
}

export default OperatorWorkstation;
