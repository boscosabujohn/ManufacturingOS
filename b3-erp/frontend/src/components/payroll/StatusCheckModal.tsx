'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, AlertCircle, RefreshCw, FileText } from 'lucide-react';

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  description: string;
  user?: string;
}

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnId: string;
  currentStatus: 'draft' | 'pending' | 'filed' | 'accepted' | 'rejected';
  onRefreshStatus: () => Promise<{
    status: 'draft' | 'pending' | 'filed' | 'accepted' | 'rejected';
    history?: StatusHistoryItem[];
    acknowledgeNumber?: string;
    message?: string;
  }>;
}

export default function StatusCheckModal({
  isOpen,
  onClose,
  returnId,
  currentStatus,
  onRefreshStatus
}: StatusCheckModalProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [acknowledgeNumber, setAcknowledgeNumber] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await onRefreshStatus();
      setStatus(result.status);
      if (result.history) setHistory(result.history);
      if (result.acknowledgeNumber) setAcknowledgeNumber(result.acknowledgeNumber);
      if (result.message) setMessage(result.message);
    } catch (error) {
      console.error('Failed to refresh status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Auto-refresh status when modal opens
      handleRefresh();
    }
  }, [isOpen]);

  const statusConfig = {
    draft: {
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      label: 'Draft',
      description: 'Return is being prepared'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      label: 'Pending Filing',
      description: 'Ready to file with ESIC'
    },
    filed: {
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: 'Filed',
      description: 'Awaiting ESIC acceptance'
    },
    accepted: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      label: 'Accepted',
      description: 'Return accepted by ESIC'
    },
    rejected: {
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      label: 'Rejected',
      description: 'Return rejected - corrections needed'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Return Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Return ID */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">Return ID</label>
            <p className="text-lg font-semibold text-gray-900">{returnId}</p>
          </div>

          {/* Current Status Badge */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${config.bgColor} mb-3`}>
            <div className="flex items-center">
              <Icon className={`h-8 w-8 ${config.color} mr-4`} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{config.label}</p>
                <p className={`text-sm ${config.color} mt-1`}>{config.description}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
              title="Refresh status"
            >
              <RefreshCw className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Acknowledgement Number (if accepted) */}
          {acknowledgeNumber && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <label className="text-sm font-medium text-green-900">Acknowledgement Number</label>
              <p className="text-lg font-mono font-bold text-green-700 mt-1">{acknowledgeNumber}</p>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`mb-3 p-3 rounded-lg border ${
              status === 'accepted'
                ? 'bg-green-50 border-green-200'
                : status === 'rejected'
                ? 'bg-red-50 border-red-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm ${
                status === 'accepted'
                  ? 'text-green-900'
                  : status === 'rejected'
                  ? 'text-red-900'
                  : 'text-blue-900'
              }`}>
                {message}
              </p>
            </div>
          )}

          {/* Status History */}
          {history.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status History</h3>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 mr-3 ${
                      item.status === 'accepted' ? 'bg-green-500' :
                      item.status === 'rejected' ? 'bg-red-500' :
                      item.status === 'filed' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900">{item.status.toUpperCase()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{item.description}</p>
                      {item.user && (
                        <p className="text-xs text-gray-500 mt-1">By: {item.user}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Timeline (visual representation) */}
          {history.length === 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Timeline</h3>
              <div className="relative">
                {Object.entries(statusConfig).map(([key, conf], index) => {
                  const isActive = key === status;
                  const isPast = Object.keys(statusConfig).indexOf(key) < Object.keys(statusConfig).indexOf(status);
                  const StatusIcon = conf.icon;

                  return (
                    <div key={key} className="flex items-center mb-2 last:mb-0">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive ? conf.bgColor : isPast ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <StatusIcon className={`h-5 w-5 ${
                          isActive ? conf.color : isPast ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="ml-4">
                        <p className={`font-medium ${
                          isActive ? 'text-gray-900' : isPast ? 'text-green-900' : 'text-gray-500'
                        }`}>
                          {conf.label}
                        </p>
                        <p className="text-xs text-gray-500">{conf.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Status Information:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Draft:</strong> Return is being prepared locally</li>
              <li>• <strong>Pending:</strong> Ready to file, awaiting submission</li>
              <li>• <strong>Filed:</strong> Submitted to ESIC portal, awaiting response</li>
              <li>• <strong>Accepted:</strong> Return accepted by ESIC</li>
              <li>• <strong>Rejected:</strong> Corrections needed, resubmission required</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
