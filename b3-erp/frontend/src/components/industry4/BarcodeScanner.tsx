'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QrCode,
  Camera,
  CameraOff,
  Flashlight,
  FlashlightOff,
  Check,
  X,
  AlertTriangle,
  Package,
  MapPin,
  Clock,
  User,
  ArrowRight,
  RotateCcw,
  History,
  ChevronRight,
  Keyboard,
  Search,
  Loader2,
  Vibrate,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============================================================================
// Types
// ============================================================================

export type ScanMode = 'wip-tracking' | 'inventory' | 'receiving' | 'shipping' | 'quality-check';
export type ScanResult = 'success' | 'warning' | 'error' | 'not-found';

export interface ScannedItem {
  id: string;
  barcode: string;
  type: 'part' | 'container' | 'work-order' | 'location' | 'operator';
  name: string;
  description?: string;
  status?: string;
  quantity?: number;
  location?: string;
  workOrder?: string;
  operation?: string;
  timestamp: string;
}

export interface ScanHistory {
  id: string;
  barcode: string;
  mode: ScanMode;
  result: ScanResult;
  item?: ScannedItem;
  message: string;
  timestamp: string;
  operator?: string;
}

export interface WIPStatus {
  workOrderId: string;
  workOrderName: string;
  partNumber: string;
  partName: string;
  currentOperation: string;
  nextOperation?: string;
  quantity: number;
  completedQty: number;
  location: string;
  operator?: string;
  startTime: string;
  status: 'in-progress' | 'completed' | 'on-hold' | 'pending';
}

export interface BarcodeScannerProps {
  mode?: ScanMode;
  onScan?: (barcode: string, item?: ScannedItem) => void;
  onModeChange?: (mode: ScanMode) => void;
  onStatusUpdate?: (status: WIPStatus, action: string) => void;
}

// ============================================================================
// Mock Data & Simulation
// ============================================================================

const mockLookup = (barcode: string): { item: ScannedItem | null; wipStatus: WIPStatus | null; result: ScanResult; message: string } => {
  // Simulate barcode lookup
  const mockItems: Record<string, { item: ScannedItem; wip?: WIPStatus }> = {
    'WO-2024-1234': {
      item: {
        id: 'item-1',
        barcode: 'WO-2024-1234',
        type: 'work-order',
        name: 'Work Order #1234',
        description: 'Assembly Line A - Electronic Control Unit',
        status: 'in-progress',
        quantity: 100,
        location: 'Station A-3',
        timestamp: new Date().toISOString(),
      },
      wip: {
        workOrderId: 'WO-2024-1234',
        workOrderName: 'ECU Assembly Batch 45',
        partNumber: 'ECU-A2345',
        partName: 'Electronic Control Unit - Type A',
        currentOperation: 'OP-030 Final Assembly',
        nextOperation: 'OP-040 Quality Inspection',
        quantity: 100,
        completedQty: 67,
        location: 'Assembly Line A - Station 3',
        operator: 'John Smith',
        startTime: '2024-12-05T08:30:00Z',
        status: 'in-progress',
      },
    },
    'PART-A2345': {
      item: {
        id: 'item-2',
        barcode: 'PART-A2345',
        type: 'part',
        name: 'Electronic Control Unit',
        description: 'ECU Type A - Rev 3',
        quantity: 1,
        location: 'WIP Buffer',
        workOrder: 'WO-2024-1234',
        operation: 'OP-030',
        timestamp: new Date().toISOString(),
      },
    },
    'LOC-A3': {
      item: {
        id: 'item-3',
        barcode: 'LOC-A3',
        type: 'location',
        name: 'Assembly Line A - Station 3',
        description: 'Final Assembly Station',
        timestamp: new Date().toISOString(),
      },
    },
    'CONT-5678': {
      item: {
        id: 'item-4',
        barcode: 'CONT-5678',
        type: 'container',
        name: 'Container #5678',
        description: 'Blue Bin - Medium',
        quantity: 25,
        location: 'Assembly Line A',
        workOrder: 'WO-2024-1234',
        timestamp: new Date().toISOString(),
      },
    },
    'OP-JS001': {
      item: {
        id: 'item-5',
        barcode: 'OP-JS001',
        type: 'operator',
        name: 'John Smith',
        description: 'Assembly Technician',
        timestamp: new Date().toISOString(),
      },
    },
  };

  if (mockItems[barcode]) {
    return {
      item: mockItems[barcode].item,
      wipStatus: mockItems[barcode].wip || null,
      result: 'success',
      message: 'Item found successfully',
    };
  }

  // Check if barcode starts with known prefixes
  if (barcode.startsWith('WO-')) {
    return { item: null, wipStatus: null, result: 'not-found', message: 'Work order not found in system' };
  }
  if (barcode.startsWith('PART-')) {
    return { item: null, wipStatus: null, result: 'warning', message: 'Part not assigned to any work order' };
  }

  return { item: null, wipStatus: null, result: 'error', message: 'Unknown barcode format' };
};

// ============================================================================
// Camera Preview Component (Simulated)
// ============================================================================

function CameraPreview({
  isActive,
  onCapture,
}: {
  isActive: boolean;
  onCapture: () => void;
}) {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Simulate periodic scanning animation
      const interval = setInterval(() => {
        setIsScanning(prev => !prev);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
      {isActive ? (
        <>
          {/* Simulated camera feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
            {/* Scan line animation */}
            <div className={`absolute left-4 right-4 h-0.5 bg-green-500 transition-all duration-1000 ${isScanning ? 'top-[80%]' : 'top-[20%]'}`}>
              <div className="absolute inset-0 bg-green-500 blur-sm" />
            </div>
          </div>

          {/* Viewfinder corners */}
          <div className="absolute inset-8">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
          </div>

          {/* Center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-green-500/50 rounded-lg" />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white/80 text-sm">Point camera at barcode or QR code</p>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <CameraOff className="w-16 h-16 mb-2" />
          <p>Camera inactive</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Manual Input Component
// ============================================================================

function ManualInput({
  onSubmit,
  isLoading,
}: {
  onSubmit: (barcode: string) => void;
  isLoading: boolean;
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value.toUpperCase())}
          placeholder="Enter barcode manually..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" size="lg" disabled={!value.trim() || isLoading}>
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
      </Button>
    </form>
  );
}

// ============================================================================
// Scan Result Display Component
// ============================================================================

function ScanResultDisplay({
  result,
  item,
  wipStatus,
  message,
  onDismiss,
  onAction,
}: {
  result: ScanResult;
  item?: ScannedItem | null;
  wipStatus?: WIPStatus | null;
  message: string;
  onDismiss: () => void;
  onAction?: (action: string) => void;
}) {
  const resultColors = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700',
    warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700',
    'not-found': 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
  };

  const resultIcons = {
    success: <Check className="w-8 h-8 text-green-600" />,
    warning: <AlertTriangle className="w-8 h-8 text-amber-600" />,
    error: <X className="w-8 h-8 text-red-600" />,
    'not-found': <Search className="w-8 h-8 text-gray-500" />,
  };

  const getItemIcon = (type: ScannedItem['type']) => {
    switch (type) {
      case 'part': return <Package className="w-5 h-5" />;
      case 'container': return <Package className="w-5 h-5" />;
      case 'work-order': return <QrCode className="w-5 h-5" />;
      case 'location': return <MapPin className="w-5 h-5" />;
      case 'operator': return <User className="w-5 h-5" />;
    }
  };

  return (
    <Card className={`border-2 ${resultColors[result]}`}>
      <CardContent className="p-4">
        {/* Result Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            {resultIcons[result]}
            <div>
              <p className="font-semibold text-lg">{message}</p>
              {item && <p className="text-sm text-gray-500 font-mono">{item.barcode}</p>}
            </div>
          </div>
          <button onClick={onDismiss} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Details */}
        {item && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                {getItemIcon(item.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
              </div>
              {item.quantity && (
                <div className="text-right">
                  <p className="text-2xl font-bold">{item.quantity}</p>
                  <p className="text-xs text-gray-500">qty</p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {item.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{item.location}</span>
                </div>
              )}
              {item.workOrder && (
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-gray-400" />
                  <span>{item.workOrder}</span>
                </div>
              )}
              {item.operation && (
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span>{item.operation}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* WIP Status */}
        {wipStatus && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">Work In Progress Status</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Part:</span>
                <span className="font-medium">{wipStatus.partNumber} - {wipStatus.partName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Operation:</span>
                <span className="font-medium">{wipStatus.currentOperation}</span>
              </div>

              {wipStatus.nextOperation && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Next Operation:</span>
                  <span className="text-gray-500">{wipStatus.nextOperation}</span>
                </div>
              )}

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{wipStatus.completedQty} / {wipStatus.quantity}</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(wipStatus.completedQty / wipStatus.quantity) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {wipStatus.operator || 'Unassigned'}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  wipStatus.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  wipStatus.status === 'completed' ? 'bg-green-100 text-green-700' :
                  wipStatus.status === 'on-hold' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {wipStatus.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1" onClick={() => onAction?.('complete-unit')}>
                Complete Unit
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => onAction?.('move-next')}>
                Move to Next Op
              </Button>
              <Button size="sm" variant="outline" onClick={() => onAction?.('hold')}>
                Hold
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions for non-WIP items */}
        {item && !wipStatus && result === 'success' && (
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onAction?.('details')}>
              View Details
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onAction?.('history')}>
              View History
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Scan History Component
// ============================================================================

function ScanHistoryList({ history }: { history: ScanHistory[] }) {
  const resultColors = {
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    'not-found': 'text-gray-500',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="w-4 h-4" />
          Scan History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No scans yet</p>
          ) : (
            history.map(scan => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    scan.result === 'success' ? 'bg-green-500' :
                    scan.result === 'warning' ? 'bg-amber-500' :
                    scan.result === 'error' ? 'bg-red-500' : 'bg-gray-400'
                  }`} />
                  <div>
                    <p className="font-mono text-sm">{scan.barcode}</p>
                    <p className={`text-xs ${resultColors[scan.result]}`}>{scan.message}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(scan.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Mode Selector Component
// ============================================================================

function ModeSelector({
  currentMode,
  onModeChange,
}: {
  currentMode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
}) {
  const modes: { id: ScanMode; label: string; icon: React.ReactNode }[] = [
    { id: 'wip-tracking', label: 'WIP Tracking', icon: <ArrowRight className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
    { id: 'receiving', label: 'Receiving', icon: <Package className="w-4 h-4" /> },
    { id: 'shipping', label: 'Shipping', icon: <Package className="w-4 h-4" /> },
    { id: 'quality-check', label: 'Quality', icon: <Check className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
            currentMode === mode.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {mode.icon}
          {mode.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function BarcodeScanner({
  mode: initialMode = 'wip-tracking',
  onScan,
  onModeChange,
  onStatusUpdate,
}: BarcodeScannerProps) {
  const [mode, setMode] = useState<ScanMode>(initialMode);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isVibrationOn, setIsVibrationOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    result: ScanResult;
    item: ScannedItem | null;
    wipStatus: WIPStatus | null;
    message: string;
  } | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);

  const handleModeChange = (newMode: ScanMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const handleScan = useCallback((barcode: string) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const lookupResult = mockLookup(barcode);

      // Feedback
      if (isVibrationOn && 'vibrate' in navigator) {
        navigator.vibrate(lookupResult.result === 'success' ? 100 : [50, 50, 50]);
      }

      setLastResult(lookupResult);

      // Add to history
      const historyEntry: ScanHistory = {
        id: `scan-${Date.now()}`,
        barcode,
        mode,
        result: lookupResult.result,
        item: lookupResult.item || undefined,
        message: lookupResult.message,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [historyEntry, ...prev.slice(0, 19)]);

      // Callback
      onScan?.(barcode, lookupResult.item || undefined);

      setIsLoading(false);
    }, 500);
  }, [mode, isSoundOn, isVibrationOn, onScan]);

  const handleAction = (action: string) => {
    console.log('Action:', action, lastResult?.wipStatus);
    if (lastResult?.wipStatus) {
      onStatusUpdate?.(lastResult.wipStatus, action);
    }
    setLastResult(null);
  };

  const dismissResult = () => {
    setLastResult(null);
  };

  return (
    <div className="space-y-2">
      {/* Mode Selector */}
      <Card>
        <CardContent className="p-4">
          <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
        </CardContent>
      </Card>

      {/* Main Scanner Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Scanner */}
        <div className="lg:col-span-2 space-y-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  Barcode Scanner
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSoundOn(!isSoundOn)}
                  >
                    {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFlashOn(!isFlashOn)}
                    disabled={!isCameraActive}
                  >
                    {isFlashOn ? <Flashlight className="w-4 h-4" /> : <FlashlightOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant={isCameraActive ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => setIsCameraActive(!isCameraActive)}
                  >
                    {isCameraActive ? <CameraOff className="w-4 h-4 mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                    {isCameraActive ? 'Stop' : 'Start'} Camera
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Camera Preview */}
              <CameraPreview isActive={isCameraActive} onCapture={() => {}} />

              {/* Manual Input */}
              <div className="mt-4">
                <ManualInput onSubmit={handleScan} isLoading={isLoading} />
              </div>

              {/* Quick Demo Barcodes */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Quick test barcodes:</p>
                <div className="flex flex-wrap gap-2">
                  {['WO-2024-1234', 'PART-A2345', 'LOC-A3', 'CONT-5678', 'OP-JS001'].map(code => (
                    <button
                      key={code}
                      onClick={() => handleScan(code)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono hover:bg-gray-200 transition-colors"
                      disabled={isLoading}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scan Result */}
          {lastResult && (
            <ScanResultDisplay
              result={lastResult.result}
              item={lastResult.item}
              wipStatus={lastResult.wipStatus}
              message={lastResult.message}
              onDismiss={dismissResult}
              onAction={handleAction}
            />
          )}
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
          <ScanHistoryList history={history} />
        </div>
      </div>
    </div>
  );
}
