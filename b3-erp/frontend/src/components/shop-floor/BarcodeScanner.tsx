'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// Type declaration for BarcodeDetector API (not available in all browsers)
interface BarcodeDetectorOptions {
  formats?: string[];
}

interface DetectedBarcode {
  rawValue: string;
  format: string;
  boundingBox?: DOMRectReadOnly;
  cornerPoints?: { x: number; y: number }[];
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions);
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
  static getSupportedFormats(): Promise<string[]>;
}
import {
  Camera,
  CameraOff,
  FlashlightOff,
  Flashlight,
  SwitchCamera,
  X,
  Check,
  AlertCircle,
  QrCode,
  Barcode,
  RefreshCw,
  Volume2,
  VolumeX,
  History,
  Trash2,
  Copy,
} from 'lucide-react';

// Barcode/QR code types
export type CodeType =
  | 'qr'
  | 'code128'
  | 'code39'
  | 'ean13'
  | 'ean8'
  | 'upc_a'
  | 'upc_e'
  | 'datamatrix'
  | 'unknown';

export interface ScanResult {
  code: string;
  type: CodeType;
  timestamp: Date;
  rawValue?: string;
}

// Camera scanner using BarcodeDetector API (Chrome/Edge) with fallback
export interface BarcodeScannerProps {
  onScan: (result: ScanResult) => void;
  onError?: (error: Error) => void;
  acceptedFormats?: CodeType[];
  continuous?: boolean;
  beepOnScan?: boolean;
  vibrate?: boolean;
  showHistory?: boolean;
  maxHistory?: number;
  overlay?: 'box' | 'line' | 'corners' | 'none';
  className?: string;
}

// Check for BarcodeDetector support
const hasBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;

export function BarcodeScanner({
  onScan,
  onError,
  acceptedFormats,
  continuous = false,
  beepOnScan = true,
  vibrate = true,
  showHistory = false,
  maxHistory = 10,
  overlay = 'corners',
  className = '',
}: BarcodeScannerProps) {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(beepOnScan);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetector | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Map our types to BarcodeDetector formats
  const formatMap: Record<string, string> = {
    qr: 'qr_code',
    code128: 'code_128',
    code39: 'code_39',
    ean13: 'ean_13',
    ean8: 'ean_8',
    upc_a: 'upc_a',
    upc_e: 'upc_e',
    datamatrix: 'data_matrix',
  };

  // Initialize barcode detector
  useEffect(() => {
    if (!hasBarcodeDetector) {
      console.warn('BarcodeDetector API not supported');
      return;
    }

    const formats = acceptedFormats
      ? acceptedFormats.map(f => formatMap[f]).filter(Boolean)
      : undefined;

    try {
      // @ts-ignore - BarcodeDetector may not be in types
      detectorRef.current = new BarcodeDetector({ formats });
    } catch (e) {
      console.error('Failed to create BarcodeDetector:', e);
    }
  }, [acceptedFormats]);

  // Beep sound
  const playBeep = useCallback(() => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 1800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio not available
    }
  }, [soundEnabled]);

  // Handle successful scan
  const handleScan = useCallback((result: ScanResult) => {
    // Avoid duplicate scans within 1 second
    if (lastScan && lastScan.code === result.code &&
        Date.now() - lastScan.timestamp.getTime() < 1000) {
      return;
    }

    setLastScan(result);
    setScanHistory(prev => [result, ...prev].slice(0, maxHistory));

    if (soundEnabled) playBeep();
    if (vibrate && 'vibrate' in navigator) navigator.vibrate(100);

    onScan(result);

    if (!continuous) {
      stopScanner();
    }
  }, [lastScan, continuous, soundEnabled, vibrate, onScan, playBeep, maxHistory]);

  // Scan frame
  const scanFrame = useCallback(async () => {
    if (!videoRef.current || !detectorRef.current || !isActive) return;

    const video = videoRef.current;

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    try {
      setScanning(true);
      const barcodes = await detectorRef.current.detect(video);

      if (barcodes.length > 0) {
        const barcode = barcodes[0];
        const type = Object.entries(formatMap).find(
          ([, v]) => v === barcode.format
        )?.[0] as CodeType || 'unknown';

        handleScan({
          code: barcode.rawValue,
          type,
          timestamp: new Date(),
          rawValue: barcode.rawValue,
        });
      }
    } catch (e) {
      // Detection error, continue
    } finally {
      setScanning(false);
    }

    if (isActive) {
      animationRef.current = requestAnimationFrame(scanFrame);
    }
  }, [isActive, handleScan]);

  // Start camera
  const startScanner = useCallback(async () => {
    try {
      setError(null);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsActive(true);

      // Start scanning loop
      if (hasBarcodeDetector) {
        animationRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (e) {
      const err = e as Error;
      setHasPermission(false);
      setError(err.name === 'NotAllowedError'
        ? 'Camera permission denied'
        : 'Failed to access camera');
      onError?.(err);
    }
  }, [facingMode, scanFrame, onError]);

  // Stop camera
  const stopScanner = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    if (isActive) {
      stopScanner();
      setTimeout(startScanner, 100);
    }
  }, [isActive, startScanner, stopScanner]);

  // Toggle torch
  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      // torch is a non-standard property supported by some mobile browsers
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
      });
      setTorchOn(!torchOn);
    } catch (e) {
      // Torch not supported
    }
  }, [torchOn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  // Clear history
  const clearHistory = () => {
    setScanHistory([]);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Clipboard not available
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Scanner viewport */}
      <div className="relative bg-black rounded-xl overflow-hidden aspect-[4/3]">
        {!isActive ? (
          // Start button
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
            {error ? (
              <>
                <AlertCircle className="w-16 h-16 text-red-500 mb-2" />
                <p className="text-xl text-red-400 mb-3">{error}</p>
                <button
                  onClick={startScanner}
                  className="flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-xl text-xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <RefreshCw className="w-6 h-6" />
                  Try Again
                </button>
              </>
            ) : (
              <>
                <Camera className="w-20 h-20 text-gray-400 mb-2" />
                <p className="text-xl text-gray-400 mb-3">
                  Tap to start scanning
                </p>
                <button
                  onClick={startScanner}
                  className="flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-xl text-xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
                >
                  <Camera className="w-6 h-6" />
                  Start Scanner
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Video element */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />

            {/* Scanning overlay */}
            {overlay !== 'none' && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Darkened edges */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Clear scanning area */}
                <div className="absolute inset-[15%] bg-transparent">
                  {overlay === 'box' && (
                    <div className="absolute inset-0 border-4 border-white rounded-xl" />
                  )}

                  {overlay === 'line' && (
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-red-500 animate-pulse" />
                  )}

                  {overlay === 'corners' && (
                    <>
                      {/* Top left */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                      {/* Top right */}
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                      {/* Bottom left */}
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                      {/* Bottom right */}
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                      {/* Scanning line animation */}
                      <div className="absolute left-2 right-2 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
                    </>
                  )}
                </div>

                {/* Scanning indicator */}
                {scanning && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium animate-pulse">
                    Scanning...
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={stopScanner}
                className="w-14 h-14 flex items-center justify-center bg-red-500 text-white rounded-full shadow-lg active:scale-95 transition-transform"
              >
                <X className="w-7 h-7" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur text-white rounded-full active:scale-95 transition-transform"
                >
                  {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </button>

                <button
                  onClick={toggleTorch}
                  className={`w-12 h-12 flex items-center justify-center ${torchOn ? 'bg-yellow-500' : 'bg-white/20 backdrop-blur'} text-white rounded-full active:scale-95 transition-transform`}
                >
                  {torchOn ? <Flashlight className="w-6 h-6" /> : <FlashlightOff className="w-6 h-6" />}
                </button>

                <button
                  onClick={toggleCamera}
                  className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur text-white rounded-full active:scale-95 transition-transform"
                >
                  <SwitchCamera className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Last scan result */}
            {lastScan && (
              <div className="absolute top-4 left-4 right-4 bg-green-500 text-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <Check className="w-8 h-8 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg truncate">{lastScan.code}</p>
                    <p className="text-sm opacity-80">Type: {lastScan.type.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* API not supported message */}
      {!hasBarcodeDetector && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Limited Scanner Support
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Barcode detection is not fully supported in this browser.
                For best results, use Chrome or Edge on Android.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scan history */}
      {showHistory && scanHistory.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5" />
              Scan History
            </h3>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {scanHistory.map((scan, index) => (
              <div
                key={`${scan.code}-${scan.timestamp.getTime()}`}
                className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                {scan.type === 'qr' ? (
                  <QrCode className="w-6 h-6 text-gray-400 flex-shrink-0" />
                ) : (
                  <Barcode className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {scan.code}
                  </p>
                  <p className="text-sm text-gray-500">
                    {scan.type.toUpperCase()} • {scan.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(scan.code)}
                  className="p-2 text-gray-400 hover:text-blue-500"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Manual code entry fallback
export interface ManualCodeEntryProps {
  onSubmit: (code: string, type: CodeType) => void;
  placeholder?: string;
  className?: string;
}

export function ManualCodeEntry({
  onSubmit,
  placeholder = 'Enter code manually',
  className = '',
}: ManualCodeEntryProps) {
  const [code, setCode] = useState('');
  const [type, setType] = useState<CodeType>('unknown');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim(), type);
      setCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
      <div>
        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Manual Entry
        </label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[60px] px-5 text-xl bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <select
          value={type}
          onChange={e => setType(e.target.value as CodeType)}
          className="flex-1 min-h-[52px] px-4 text-lg bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500"
        >
          <option value="unknown">Auto-detect</option>
          <option value="qr">QR Code</option>
          <option value="code128">Code 128</option>
          <option value="code39">Code 39</option>
          <option value="ean13">EAN-13</option>
          <option value="upc_a">UPC-A</option>
        </select>

        <button
          type="submit"
          disabled={!code.trim()}
          className="px-8 min-h-[52px] bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          Submit
        </button>
      </div>
    </form>
  );
}

// Combined scanner with manual fallback
export interface ScannerWithFallbackProps {
  onScan: (result: ScanResult) => void;
  onError?: (error: Error) => void;
  showManualEntry?: boolean;
  className?: string;
}

export function ScannerWithFallback({
  onScan,
  onError,
  showManualEntry = true,
  className = '',
}: ScannerWithFallbackProps) {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');

  const handleManualSubmit = (code: string, type: CodeType) => {
    onScan({
      code,
      type,
      timestamp: new Date(),
    });
  };

  return (
    <div className={className}>
      {/* Mode tabs */}
      {showManualEntry && (
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setMode('camera')}
            className={`flex-1 py-3 px-4 rounded-xl text-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              mode === 'camera'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Camera className="w-5 h-5" />
            Camera
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-3 px-4 rounded-xl text-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              mode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Barcode className="w-5 h-5" />
            Manual
          </button>
        </div>
      )}

      {mode === 'camera' ? (
        <BarcodeScanner
          onScan={onScan}
          onError={onError}
          showHistory
          beepOnScan
          vibrate
        />
      ) : (
        <ManualCodeEntry onSubmit={handleManualSubmit} />
      )}
    </div>
  );
}

// Scan button for inline scanning
export interface ScanButtonProps {
  onScan: (result: ScanResult) => void;
  size?: 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'ghost';
  label?: string;
  className?: string;
}

export function ScanButton({
  onScan,
  size = 'lg',
  variant = 'primary',
  label = 'Scan',
  className = '',
}: ScanButtonProps) {
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (result: ScanResult) => {
    onScan(result);
    setShowScanner(false);
  };

  const sizeClasses = {
    md: 'min-h-[48px] px-4 text-base',
    lg: 'min-h-[60px] px-6 text-lg',
    xl: 'min-h-[72px] px-8 text-xl',
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
  };

  return (
    <>
      <button
        onClick={() => setShowScanner(true)}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          inline-flex items-center justify-center gap-2
          font-semibold rounded-xl
          active:scale-95 transition-all
          ${className}
        `}
      >
        <QrCode className="w-6 h-6" />
        {label}
      </button>

      {/* Scanner modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Scan Code
              </h3>
              <button
                onClick={() => setShowScanner(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <ScannerWithFallback onScan={handleScan} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

