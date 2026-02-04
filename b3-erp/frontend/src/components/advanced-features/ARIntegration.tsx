'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from 'react';

// ============================================================================
// AR Types
// ============================================================================

export interface ARMarker {
  id: string;
  type: 'image' | 'qr' | 'nft' | 'location';
  data: string;
  position?: { x: number; y: number; z: number };
}

export interface ARAnnotation {
  id: string;
  markerId: string;
  title: string;
  description?: string;
  type: 'text' | 'image' | 'video' | 'model' | 'steps';
  content: string | ARStep[];
  position: { x: number; y: number; z: number };
  scale?: number;
  visible?: boolean;
}

export interface ARStep {
  id: string;
  order: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
  duration?: number;
  warnings?: string[];
  tools?: string[];
}

export interface MaintenanceGuide {
  id: string;
  equipmentId: string;
  equipmentName: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  tools: string[];
  safetyWarnings: string[];
  steps: ARStep[];
  markers: ARMarker[];
  annotations: ARAnnotation[];
}

export type ARState = 'unavailable' | 'ready' | 'initializing' | 'active' | 'paused' | 'error';

// ============================================================================
// WebXR Types
// ============================================================================

declare global {
  interface Navigator {
    xr?: XRSystem;
  }

  interface XRSystem {
    isSessionSupported(mode: XRSessionMode): Promise<boolean>;
    requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>;
  }

  type XRSessionMode = 'inline' | 'immersive-vr' | 'immersive-ar';

  interface XRSessionInit {
    requiredFeatures?: string[];
    optionalFeatures?: string[];
  }

  interface XRSession extends EventTarget {
    end(): Promise<void>;
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    cancelAnimationFrame(handle: number): void;
  }

  type XRReferenceSpaceType = 'viewer' | 'local' | 'local-floor' | 'bounded-floor' | 'unbounded';
  type XRFrameRequestCallback = (time: DOMHighResTimeStamp, frame: XRFrame) => void;

  interface XRReferenceSpace extends EventTarget {}
  interface XRFrame {}
}

// ============================================================================
// AR Context
// ============================================================================

interface ARContextValue {
  isSupported: boolean;
  state: ARState;
  error: string | null;
  currentGuide: MaintenanceGuide | null;
  currentStep: number;
  detectedMarkers: ARMarker[];
  startAR: () => Promise<void>;
  stopAR: () => void;
  loadGuide: (guide: MaintenanceGuide) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  completeStep: (stepId: string) => void;
  completedSteps: string[];
}

const ARContext = createContext<ARContextValue | null>(null);

// ============================================================================
// AR Provider
// ============================================================================

export interface ARProviderProps {
  children: ReactNode;
  onMarkerDetected?: (marker: ARMarker) => void;
  onStepCompleted?: (step: ARStep, guideId: string) => void;
  onGuideCompleted?: (guide: MaintenanceGuide) => void;
}

export function ARProvider({
  children,
  onMarkerDetected,
  onStepCompleted,
  onGuideCompleted,
}: ARProviderProps) {
  const [state, setState] = useState<ARState>('unavailable');
  const [error, setError] = useState<string | null>(null);
  const [currentGuide, setCurrentGuide] = useState<MaintenanceGuide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [detectedMarkers, setDetectedMarkers] = useState<ARMarker[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const sessionRef = useRef<XRSession | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check WebXR support
  const isSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'xr' in navigator;
  }, []);

  // Check AR support on mount
  useEffect(() => {
    const checkSupport = async () => {
      if (!isSupported) {
        setState('unavailable');
        return;
      }

      try {
        const supported = await navigator.xr?.isSessionSupported('immersive-ar');
        setState(supported ? 'ready' : 'unavailable');
      } catch {
        setState('unavailable');
      }
    };

    checkSupport();
  }, [isSupported]);

  // Start AR session
  const startAR = useCallback(async () => {
    if (!navigator.xr || state !== 'ready') return;

    setState('initializing');
    setError(null);

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['dom-overlay', 'hit-test'],
      });

      sessionRef.current = session;

      session.addEventListener('end', () => {
        setState('ready');
        sessionRef.current = null;
      });

      setState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start AR session');
      setState('error');
    }
  }, [state]);

  // Stop AR session
  const stopAR = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.end();
    }
  }, []);

  // Load maintenance guide
  const loadGuide = useCallback((guide: MaintenanceGuide) => {
    setCurrentGuide(guide);
    setCurrentStep(0);
    setCompletedSteps([]);
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    if (!currentGuide) return;
    setCurrentStep((prev) => Math.min(prev + 1, currentGuide.steps.length - 1));
  }, [currentGuide]);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (!currentGuide) return;
    setCurrentStep(Math.max(0, Math.min(step, currentGuide.steps.length - 1)));
  }, [currentGuide]);

  // Complete step
  const completeStep = useCallback(
    (stepId: string) => {
      if (!currentGuide) return;

      setCompletedSteps((prev) => {
        if (prev.includes(stepId)) return prev;
        return [...prev, stepId];
      });

      const step = currentGuide.steps.find((s) => s.id === stepId);
      if (step) {
        onStepCompleted?.(step, currentGuide.id);
      }

      // Check if guide is complete
      const allStepsCompleted =
        currentGuide.steps.every((s) => completedSteps.includes(s.id) || s.id === stepId);

      if (allStepsCompleted) {
        onGuideCompleted?.(currentGuide);
      }
    },
    [currentGuide, completedSteps, onStepCompleted, onGuideCompleted]
  );

  const value = useMemo(
    () => ({
      isSupported,
      state,
      error,
      currentGuide,
      currentStep,
      detectedMarkers,
      startAR,
      stopAR,
      loadGuide,
      nextStep,
      previousStep,
      goToStep,
      completeStep,
      completedSteps,
    }),
    [
      isSupported,
      state,
      error,
      currentGuide,
      currentStep,
      detectedMarkers,
      startAR,
      stopAR,
      loadGuide,
      nextStep,
      previousStep,
      goToStep,
      completeStep,
      completedSteps,
    ]
  );

  return <ARContext.Provider value={value}>{children}</ARContext.Provider>;
}

// ============================================================================
// useAR Hook
// ============================================================================

export function useAR() {
  const context = useContext(ARContext);
  if (!context) {
    throw new Error('useAR must be used within an ARProvider');
  }
  return context;
}

// ============================================================================
// AR Viewer Component
// ============================================================================

export interface ARViewerProps {
  guide?: MaintenanceGuide;
  showOverlay?: boolean;
  showControls?: boolean;
  className?: string;
}

export function ARViewer({
  guide,
  showOverlay = true,
  showControls = true,
  className = '',
}: ARViewerProps) {
  const {
    isSupported,
    state,
    error,
    currentGuide,
    currentStep,
    startAR,
    stopAR,
    loadGuide,
    nextStep,
    previousStep,
    completedSteps,
    completeStep,
  } = useAR();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Load guide if provided
  useEffect(() => {
    if (guide) {
      loadGuide(guide);
    }
  }, [guide, loadGuide]);

  // Start camera for fallback mode
  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Failed to start camera:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  }, []);

  const activeGuide = currentGuide;
  const activeStep = activeGuide?.steps[currentStep];

  if (!isSupported && !navigator.mediaDevices) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 rounded-xl ${className}`}>
        <div className="text-center">
          <svg className="w-16 h-16 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2">AR Not Available</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Your device does not support augmented reality features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-black rounded-xl ${className}`}>
      {/* Video/Camera View */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* AR Overlay */}
      {showOverlay && activeGuide && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Step indicator */}
          <div className="absolute top-4 left-4 right-4 pointer-events-auto">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">
                  Step {currentStep + 1} of {activeGuide.steps.length}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  activeGuide.difficulty === 'easy' ? 'bg-green-500' :
                  activeGuide.difficulty === 'medium' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}>
                  {activeGuide.difficulty}
                </span>
              </div>
              <h3 className="font-semibold">{activeStep?.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{activeStep?.description}</p>

              {/* Warnings */}
              {activeStep?.warnings && activeStep.warnings.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-500/20 rounded border border-yellow-500/50">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-sm text-yellow-200">
                      {activeStep.warnings.map((w, i) => (
                        <p key={i}>{w}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tools needed */}
              {activeStep?.tools && activeStep.tools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {activeStep.tools.map((tool, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-blue-500/30 rounded">
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-20 left-4 right-4 pointer-events-auto">
            <div className="flex gap-1">
              {activeGuide.steps.map((step, i) => (
                <div
                  key={step.id}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-500'
                      : i === currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
              >
                Start Camera
              </button>
            ) : (
              <button
                onClick={() => activeStep && completeStep(activeStep.id)}
                disabled={!activeStep || completedSteps.includes(activeStep?.id || '')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium disabled:opacity-50"
              >
                Mark Complete
              </button>
            )}

            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={!activeGuide || currentStep >= activeGuide.steps.length - 1}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <svg className="w-12 h-12 mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Maintenance Guide List
// ============================================================================

export interface MaintenanceGuideListProps {
  guides: MaintenanceGuide[];
  onSelectGuide: (guide: MaintenanceGuide) => void;
  className?: string;
}

export function MaintenanceGuideList({
  guides,
  onSelectGuide,
  className = '',
}: MaintenanceGuideListProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {guides.map((guide) => (
        <button
          key={guide.id}
          onClick={() => onSelectGuide(guide)}
          className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{guide.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {guide.equipmentName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {guide.description}
              </p>
            </div>
            <div className="ml-4 flex flex-col items-end gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                guide.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                guide.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {guide.difficulty}
              </span>
              <span className="text-xs text-gray-500">
                ~{guide.estimatedTime} min
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {guide.steps.length} steps
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {guide.tools.length} tools
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Step-by-Step Guide Component (Non-AR)
// ============================================================================

export interface StepByStepGuideProps {
  guide: MaintenanceGuide;
  onComplete?: () => void;
  className?: string;
}

export function StepByStepGuide({
  guide,
  onComplete,
  className = '',
}: StepByStepGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const step = guide.steps[currentStep];
  const isLastStep = currentStep === guide.steps.length - 1;
  const isStepCompleted = completedSteps.includes(step?.id);

  const handleComplete = () => {
    if (!step) return;

    if (!isStepCompleted) {
      setCompletedSteps([...completedSteps, step.id]);
    }

    if (isLastStep) {
      onComplete?.();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">{guide.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {guide.equipmentName}
        </p>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2 overflow-x-auto">
        {guide.steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(i)}
            className={`
              flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
              transition-colors flex-shrink-0
              ${completedSteps.includes(s.id)
                ? 'bg-green-500 text-white'
                : i === currentStep
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
          >
            {completedSteps.includes(s.id) ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </button>
        ))}
      </div>

      {/* Step Content */}
      {step && (
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">{step.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{step.description}</p>

          {/* Step Image */}
          {step.image && (
            <div className="mt-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Warnings */}
          {step.warnings && step.warnings.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  {step.warnings.map((w, i) => (
                    <p key={i}>{w}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tools */}
          {step.tools && step.tools.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Required Tools:
              </p>
              <div className="flex flex-wrap gap-2">
                {step.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleComplete}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isLastStep ? 'Complete Guide' : isStepCompleted ? 'Next Step' : 'Mark Complete & Continue'}
        </button>
      </div>
    </div>
  );
}

