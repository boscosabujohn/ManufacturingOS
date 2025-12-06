'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  FlashlightOff,
  Flashlight,
  X,
  RotateCcw,
  History,
  Check,
  AlertCircle,
  Keyboard,
  QrCode,
  Barcode
} from 'lucide-react';

interface ScanResult {
  format: string;
  rawValue: string;
  timestamp: Date;
}

interface BarcodeScannerProps {
  onScan: (result: ScanResult) => void;
  onClose?: () => void;
  acceptedFormats?: string[];
  showManualEntry?: boolean;
  showHistory?: boolean;
  continuous?: boolean;
  overlay?: 'box' | 'line' | 'corners';
  title?: string;
  instructions?: string;
}

/**
 * BarcodeScanner - Camera-based barcode/QR code scanner with manual entry fallback
 * Uses native BarcodeDetector API when available, with fallback instructions
 */
export function BarcodeScanner({
  onScan,
  onClose,
  acceptedFormats = ['qr_code', 'code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e'],
  showManualEntry = true,
  showHistory = true,
  continuous = false,
  overlay = 'corners',
  title = 'Scan Code',
  instructions = 'Point camera at barcode or QR code'
}: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualValue, setManualValue] = useState('');
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasBarcodeDetector, setHasBarcodeDetector] = useState(false);

  // Check for BarcodeDetector support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      setHasBarcodeDetector(true);
    }
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setHasPermission(true);
      setIsScanning(true);
    } catch (err: any) {
      console.error('Camera error:', err);
      setHasPermission(false);

      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please enable camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Failed to access camera. Try manual entry instead.');
      }
    }
  }, [facingMode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Toggle torch
  const toggleTorch = useCallback(async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && 'torch' in track.getCapabilities()) {
        await track.applyConstraints({
          advanced: [{ torch: !torchOn } as any]
        });
        setTorchOn(!torchOn);
      }
    }
  }, [torchOn]);

  // Switch camera
  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, [stopCamera]);

  // Scan for barcodes
  useEffect(() => {
    if (!isScanning || !hasBarcodeDetector || !videoRef.current) return;

    const detector = new (window as any).BarcodeDetector({
      formats: acceptedFormats
    });

    let animationId: number;

    const scan = async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const barcodes = await detector.detect(videoRef.current);

          if (barcodes.length > 0) {
            const result: ScanResult = {
              format: barcodes[0].format,
              rawValue: barcodes[0].rawValue,
              timestamp: new Date()
            };

            setLastScan(result);
            setScanHistory(prev => [result, ...prev.slice(0, 9)]);
            onScan(result);

            if (!continuous) {
              stopCamera();
              return;
            }
          }
        } catch (err) {
          // Scanning error, continue trying
        }
      }

      animationId = requestAnimationFrame(scan);
    };

    scan();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isScanning, hasBarcodeDetector, acceptedFormats, continuous, onScan, stopCamera]);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Handle manual entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualValue.trim()) {
      const result: ScanResult = {
        format: 'manual',
        rawValue: manualValue.trim(),
        timestamp: new Date()
      };
      setLastScan(result);
      setScanHistory(prev => [result, ...prev.slice(0, 9)]);
      onScan(result);
      setManualValue('');
      setShowManual(false);
    }
  };

  // Handle history item click
  const handleHistoryClick = (result: ScanResult) => {
    onScan(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm text-gray-400">{instructions}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            style={{ minWidth: '48px', minHeight: '48px' }}
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {hasPermission === false ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <CameraOff className="w-16 h-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Camera Access Required</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Scan Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {overlay === 'corners' && (
                <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

                  {/* Scan line animation */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" />
                </div>
              )}

              {overlay === 'box' && (
                <div className="w-64 h-64 sm:w-80 sm:h-80 border-4 border-blue-500 rounded-2xl" />
              )}

              {overlay === 'line' && (
                <div className="w-80 h-1 bg-red-500 shadow-lg shadow-red-500/50" />
              )}
            </div>

            {/* Last scan feedback */}
            {lastScan && (
              <div className="absolute top-4 left-4 right-4 bg-green-500 text-white p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                <Check className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{lastScan.rawValue}</p>
                  <p className="text-sm text-green-100">{lastScan.format}</p>
                </div>
              </div>
            )}

            {/* Error feedback */}
            {error && (
              <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Torch toggle */}
          <button
            onClick={toggleTorch}
            className={`p-4 rounded-full transition-colors ${
              torchOn ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            style={{ minWidth: '56px', minHeight: '56px' }}
          >
            {torchOn ? <Flashlight className="w-6 h-6" /> : <FlashlightOff className="w-6 h-6" />}
          </button>

          {/* Main scan button */}
          <button
            onClick={isScanning ? stopCamera : startCamera}
            className={`p-6 rounded-full transition-colors ${
              isScanning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
            style={{ minWidth: '80px', minHeight: '80px' }}
          >
            {isScanning ? (
              <CameraOff className="w-8 h-8" />
            ) : (
              <Camera className="w-8 h-8" />
            )}
          </button>

          {/* Switch camera */}
          <button
            onClick={switchCamera}
            className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            style={{ minWidth: '56px', minHeight: '56px' }}
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Secondary controls */}
        <div className="flex items-center justify-center gap-4">
          {showManualEntry && (
            <button
              onClick={() => setShowManual(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              style={{ minHeight: '48px' }}
            >
              <Keyboard className="w-5 h-5" />
              <span className="font-medium">Enter Manually</span>
            </button>
          )}

          {showHistory && scanHistory.length > 0 && (
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              style={{ minHeight: '48px' }}
            >
              <History className="w-5 h-5" />
              <span className="font-medium">History ({scanHistory.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showManual && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Manual Entry
              </h3>
              <button
                onClick={() => setShowManual(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter barcode or code value
                </label>
                <input
                  type="text"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                  placeholder="Scan value..."
                  autoFocus
                  className="w-full px-4 py-4 text-lg bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowManual(false)}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!manualValue.trim()}
                  className="flex-1 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scan animation styles */}
      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 90%; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default BarcodeScanner;
