'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  X,
  Smartphone,
  Share,
  PlusSquare,
  Check,
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react';

// Types
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallProps {
  appName?: string;
  appDescription?: string;
  onInstall?: () => void;
  onDismiss?: () => void;
}

// Check if running as installed PWA
function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// Check if iOS
function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Check if can install
function canInstall(): boolean {
  if (typeof window === 'undefined') return false;
  return 'BeforeInstallPromptEvent' in window || isIOS();
}

export function PWAInstallPrompt({
  appName = 'ManufacturingOS',
  appDescription = 'Access your manufacturing dashboard anytime, even offline.',
  onInstall,
  onDismiss,
}: PWAInstallProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Listen for install prompt
  useEffect(() => {
    if (isStandalone()) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after delay if not dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if iOS and show instructions
    if (isIOS() && !isStandalone()) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Handle install
  const handleInstall = useCallback(async () => {
    if (isIOS()) {
      setShowIOSInstructions(true);
      return;
    }

    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
        onInstall?.();
      }
    } catch (error) {
      console.error('Install failed:', error);
    }

    setInstallPrompt(null);
  }, [installPrompt, onInstall]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    onDismiss?.();
  }, [onDismiss]);

  // Don't show if already installed or can't install
  if (isInstalled || !showPrompt) return null;

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Install {appName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {appDescription}
              </p>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl active:bg-gray-200 dark:active:bg-gray-700"
            >
              Not Now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl active:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-around text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Wifi className="w-3 h-3" /> Works Offline
            </span>
            <span className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Native Feel
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Auto Updates
            </span>
          </div>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowIOSInstructions(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Install {appName}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Follow these steps to add to your home screen
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      Tap the Share button
                      <Share className="w-4 h-4 text-blue-600" />
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      At the bottom of your Safari browser
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      Add to Home Screen
                      <PlusSquare className="w-4 h-4 text-blue-600" />
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Scroll down and tap "Add to Home Screen"
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      Tap Add
                      <Check className="w-4 h-4 text-green-600" />
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Confirm by tapping "Add" in the top right
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSInstructions(false)}
                className="w-full mt-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                Got it
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// PWA Update Prompt
interface PWAUpdatePromptProps {
  onUpdate?: () => void;
  onDismiss?: () => void;
}

export function PWAUpdatePrompt({ onUpdate, onDismiss }: PWAUpdatePromptProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = useCallback(async () => {
    setUpdating(true);

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }

    onUpdate?.();
    window.location.reload();
  }, [onUpdate]);

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-blue-600 text-white rounded-xl shadow-lg p-4">
      <div className="flex items-center gap-3">
        <RefreshCw className={`w-5 h-5 ${updating ? 'animate-spin' : ''}`} />
        <div className="flex-1">
          <p className="font-medium">Update Available</p>
          <p className="text-sm opacity-90">A new version is ready to install.</p>
        </div>
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg disabled:opacity-50"
        >
          {updating ? 'Updating...' : 'Update'}
        </button>
        <button
          onClick={() => {
            setShowUpdate(false);
            onDismiss?.();
          }}
          className="p-1 opacity-70 hover:opacity-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Hook for PWA status
export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandalone());
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleInstall = () => setCanInstall(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstall);
    };
  }, []);

  return { isInstalled, isOnline, canInstall };
}

export { isStandalone, isIOS, canInstall };
export type { PWAInstallProps, PWAUpdatePromptProps };
