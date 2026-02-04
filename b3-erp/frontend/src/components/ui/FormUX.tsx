'use client';

import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  HelpCircle,
  X,
  Clock,
  Info,
  Loader2,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isOptional?: boolean;
  validate?: () => boolean | Promise<boolean>;
  fields?: string[];
}

export interface MultiStepFormProps {
  steps: WizardStep[];
  children: React.ReactNode;
  onComplete: (data: Record<string, unknown>) => void;
  onStepChange?: (stepIndex: number, direction: 'next' | 'prev') => void;
  initialStep?: number;
  allowSkipOptional?: boolean;
  showProgressBar?: boolean;
  showStepList?: boolean;
  variant?: 'horizontal' | 'vertical' | 'sidebar';
  className?: string;
}

export interface FormProgressIndicatorProps {
  // Field-based API (original)
  fields?: FormFieldConfig[];
  values?: Record<string, unknown>;
  // Number-based API (alternative)
  completedFields?: number;
  totalFields?: number;
  label?: string;
  // Common options
  showPercentage?: boolean;
  showFieldCount?: boolean;
  variant?: 'bar' | 'circular' | 'segments';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface FormFieldConfig {
  name: string;
  required?: boolean;
  validate?: (value: unknown) => boolean;
}

export interface FieldHelpProps {
  content: string | React.ReactNode;
  title?: string;
  trigger?: 'hover' | 'click' | 'focus';
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'tooltip' | 'popover' | 'inline';
  children: React.ReactNode;
  className?: string;
}

export interface SmartDefaultConfig {
  field: string;
  source: 'localStorage' | 'context' | 'api' | 'computed';
  key?: string;
  compute?: (context: Record<string, unknown>) => unknown;
  fallback?: unknown;
}

// ============================================================================
// Context for Multi-Step Form
// ============================================================================

interface MultiStepFormContextType {
  currentStep: number;
  totalSteps: number;
  formData: Record<string, unknown>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  goToStep: (step: number) => void;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  stepValidation: Record<number, boolean>;
  markStepValid: (step: number, isValid: boolean) => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextType | null>(null);

export const useMultiStepForm = () => {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepForm');
  }
  return context;
};

// ============================================================================
// Multi-Step Form Wizard
// ============================================================================

export function MultiStepForm({
  steps,
  children,
  onComplete,
  onStepChange,
  initialStep = 0,
  allowSkipOptional = false,
  showProgressBar = true,
  showStepList = true,
  variant = 'horizontal',
  className = '',
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const markStepValid = useCallback((step: number, isValid: boolean) => {
    setStepValidation(prev => ({ ...prev, [step]: isValid }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const nextStep = useCallback(async () => {
    const step = steps[currentStep];

    if (step.validate) {
      setIsValidating(true);
      try {
        const isValid = await step.validate();
        if (!isValid) {
          setIsValidating(false);
          return false;
        }
      } catch {
        setIsValidating(false);
        return false;
      }
      setIsValidating(false);
    }

    markStepValid(currentStep, true);

    if (isLastStep) {
      onComplete(formData);
      return true;
    }

    const nextIndex = currentStep + 1;
    setCurrentStep(nextIndex);
    onStepChange?.(nextIndex, 'next');
    return true;
  }, [currentStep, steps, isLastStep, formData, onComplete, onStepChange, markStepValid]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      onStepChange?.(prevIndex, 'prev');
    }
  }, [currentStep, isFirstStep, onStepChange]);

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const contextValue: MultiStepFormContextType = {
    currentStep,
    totalSteps,
    formData,
    setFormData,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    stepValidation,
    markStepValid,
  };

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      <div className={`multi-step-form ${className}`}>
        {/* Progress Bar */}
        {showProgressBar && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {showStepList && variant !== 'sidebar' && (
          <StepList
            steps={steps}
            currentStep={currentStep}
            stepValidation={stepValidation}
            onStepClick={goToStep}
            variant={variant}
            allowSkipOptional={allowSkipOptional}
          />
        )}

        {/* Form Content */}
        <div className={variant === 'sidebar' ? 'flex gap-3' : ''}>
          {variant === 'sidebar' && showStepList && (
            <div className="w-64 flex-shrink-0">
              <StepList
                steps={steps}
                currentStep={currentStep}
                stepValidation={stepValidation}
                onStepClick={goToStep}
                variant="vertical"
                allowSkipOptional={allowSkipOptional}
              />
            </div>
          )}

          <div className="flex-1">
            {/* Step Content */}
            <div className="mt-6 mb-3">
              {React.Children.toArray(children)[currentStep]}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={prevStep}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isFirstStep
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {steps[currentStep].isOptional && allowSkipOptional && !isLastStep && (
                  <button
                    type="button"
                    onClick={() => {
                      const nextIndex = currentStep + 1;
                      setCurrentStep(nextIndex);
                      onStepChange?.(nextIndex, 'next');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Skip this step
                  </button>
                )}

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isValidating}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isValidating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isLastStep ? (
                    <>
                      <Check className="h-4 w-4" />
                      Complete
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MultiStepFormContext.Provider>
  );
}

// Step List Component
function StepList({
  steps,
  currentStep,
  stepValidation,
  onStepClick,
  variant,
  allowSkipOptional,
}: {
  steps: WizardStep[];
  currentStep: number;
  stepValidation: Record<number, boolean>;
  onStepClick: (step: number) => void;
  variant: 'horizontal' | 'vertical';
  allowSkipOptional: boolean;
}) {
  const isClickable = (index: number) => {
    if (index <= currentStep) return true;
    if (allowSkipOptional && steps[index - 1]?.isOptional) return true;
    return stepValidation[index - 1] === true;
  };

  if (variant === 'vertical') {
    return (
      <nav className="space-y-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = stepValidation[index] === true;
          const isCurrent = index === currentStep;
          const clickable = isClickable(index);

          return (
            <button
              key={step.id}
              onClick={() => clickable && onStepClick(index)}
              disabled={!clickable}
              className={`
                w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors
                ${isCurrent ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                ${clickable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : 'cursor-not-allowed opacity-50'}
              `}
            >
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0
                ${isComplete
                  ? 'bg-green-600'
                  : isCurrent
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `}>
                {isComplete ? (
                  <Check className="h-4 w-4 text-white" />
                ) : Icon ? (
                  <Icon className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-gray-500'}`} />
                ) : (
                  <span className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                  {step.label}
                  {step.isOptional && (
                    <span className="ml-2 text-xs text-gray-400">(Optional)</span>
                  )}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {step.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    );
  }

  // Horizontal variant
  return (
    <nav className="flex items-center justify-between">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isComplete = stepValidation[index] === true;
        const isCurrent = index === currentStep;
        const clickable = isClickable(index);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => clickable && onStepClick(index)}
              disabled={!clickable}
              className={`flex items-center gap-2 ${clickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            >
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full transition-colors
                ${isComplete
                  ? 'bg-green-600'
                  : isCurrent
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `}>
                {isComplete ? (
                  <Check className="h-5 w-5 text-white" />
                ) : Icon ? (
                  <Icon className={`h-5 w-5 ${isCurrent ? 'text-white' : 'text-gray-500'}`} />
                ) : (
                  <span className={`text-sm font-semibold ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-medium ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  {step.label}
                </p>
              </div>
            </button>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-4 ${isComplete ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ============================================================================
// Form Progress Indicator
// ============================================================================

export function FormProgressIndicator({
  fields,
  values,
  completedFields: completedFieldsProp,
  totalFields: totalFieldsProp,
  label,
  showPercentage = true,
  showFieldCount = true,
  variant = 'bar',
  size = 'md',
  className = '',
}: FormProgressIndicatorProps) {
  const calculateProgress = useCallback(() => {
    // Use number-based API if provided
    if (completedFieldsProp !== undefined && totalFieldsProp !== undefined) {
      const percentage = totalFieldsProp > 0 ? (completedFieldsProp / totalFieldsProp) * 100 : completedFieldsProp;
      return { completed: completedFieldsProp, total: totalFieldsProp, percentage };
    }

    // Fall back to field-based API
    let completed = 0;
    let total = 0;

    if (fields && values) {
      fields.forEach(field => {
        if (field.required) {
          total++;
          const value = values[field.name];

          if (field.validate) {
            if (field.validate(value)) completed++;
          } else if (value !== undefined && value !== null && value !== '') {
            completed++;
          }
        }
      });
    }

    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }, [fields, values, completedFieldsProp, totalFieldsProp]);

  const { completed, total, percentage } = calculateProgress();

  const sizeClasses = {
    sm: { bar: 'h-1.5', text: 'text-xs', circle: 'w-12 h-12' },
    md: { bar: 'h-2', text: 'text-sm', circle: 'w-16 h-16' },
    lg: { bar: 'h-3', text: 'text-base', circle: 'w-20 h-20' },
  };

  const getColor = () => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (variant === 'circular') {
    const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
    const radius = size === 'sm' ? 20 : size === 'md' ? 26 : 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`relative ${sizeClasses[size].circle}`}>
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={percentage === 100 ? 'text-green-500' : 'text-blue-500'}
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          {showPercentage && (
            <span className={`absolute inset-0 flex items-center justify-center font-semibold ${sizeClasses[size].text}`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        {showFieldCount && (
          <span className={`text-gray-600 dark:text-gray-400 ${sizeClasses[size].text}`}>
            {completed} of {total} required fields
          </span>
        )}
      </div>
    );
  }

  if (variant === 'segments' && fields && values) {
    return (
      <div className={className}>
        <div className="flex items-center gap-1 mb-1">
          {fields.filter(f => f.required).map((field) => {
            const value = values[field.name];
            const isComplete = field.validate
              ? field.validate(value)
              : value !== undefined && value !== null && value !== '';

            return (
              <div
                key={field.name}
                className={`flex-1 ${sizeClasses[size].bar} rounded-full transition-colors ${
                  isComplete ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                title={field.name}
              />
            );
          })}
        </div>
        <div className={`flex justify-between ${sizeClasses[size].text} text-gray-600 dark:text-gray-400`}>
          {showFieldCount && <span>{completed} of {total} fields</span>}
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      </div>
    );
  }

  // Default bar variant
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        {showFieldCount && (
          <span className={`text-gray-600 dark:text-gray-400 ${sizeClasses[size].text}`}>
            {completed} of {total} required fields
          </span>
        )}
        {showPercentage && (
          <span className={`font-medium text-gray-900 dark:text-white ${sizeClasses[size].text}`}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className={`${sizeClasses[size].bar} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${getColor()} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Auto-Save Draft Hook
// ============================================================================

interface AutoSaveConfig {
  key: string;
  debounceMs?: number;
  onSave?: (data: Record<string, unknown>) => void;
  onRestore?: (data: Record<string, unknown>) => void;
}

interface AutoSaveResult {
  lastSaved: Date | null;
  isSaving: boolean;
  hasDraft: boolean;
  clearDraft: () => void;
  restoreDraft: () => Record<string, unknown> | null;
}

export function useAutoSaveDraft(
  data: Record<string, unknown>,
  config: AutoSaveConfig
): AutoSaveResult {
  const { key, debounceMs = 2000, onSave, onRestore } = config;
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `form_draft_${key}`;

  // Check for existing draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(storageKey);
    setHasDraft(!!draft);
  }, [storageKey]);

  // Auto-save with debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (Object.keys(data).length > 0) {
        setIsSaving(true);

        const draftData = {
          data,
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem(storageKey, JSON.stringify(draftData));
        setLastSaved(new Date());
        setHasDraft(true);
        setIsSaving(false);
        onSave?.(data);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, storageKey, debounceMs, onSave]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setHasDraft(false);
    setLastSaved(null);
  }, [storageKey]);

  const restoreDraft = useCallback(() => {
    const draft = localStorage.getItem(storageKey);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        onRestore?.(parsed.data);
        return parsed.data;
      } catch {
        return null;
      }
    }
    return null;
  }, [storageKey, onRestore]);

  return {
    lastSaved,
    isSaving,
    hasDraft,
    clearDraft,
    restoreDraft,
  };
}

// Auto-Save Indicator Component
export function AutoSaveIndicator({
  lastSaved,
  isSaving,
  className = '',
}: {
  lastSaved: Date | null;
  isSaving: boolean;
  className?: string;
}) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-gray-500 dark:text-gray-400">Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <Save className="h-4 w-4 text-green-500" />
          <span className="text-gray-500 dark:text-gray-400">
            Saved at {formatTime(lastSaved)}
          </span>
        </>
      ) : (
        <>
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">Not saved yet</span>
        </>
      )}
    </div>
  );
}

// Draft Recovery Banner
export function DraftRecoveryBanner({
  hasDraft = true,
  onRestore,
  onDiscard,
  lastSaved,
  className = '',
}: {
  hasDraft?: boolean;
  onRestore: () => void;
  onDiscard: () => void;
  lastSaved?: Date | null;
  className?: string;
}) {
  if (!hasDraft) return null;

  return (
    <div className={`flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg ${className}`}>
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            You have an unsaved draft
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Would you like to restore your previous progress?
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDiscard}
          className="px-3 py-1.5 text-sm text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 rounded-lg transition-colors"
        >
          Discard
        </button>
        <button
          onClick={onRestore}
          className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Restore Draft
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Unsaved Changes Warning Hook
// ============================================================================

export function useUnsavedChangesWarning(
  hasUnsavedChanges: boolean,
  message: string = 'You have unsaved changes. Are you sure you want to leave?'
): void {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, message]);
}

// Unsaved Changes Modal
export function UnsavedChangesModal({
  isOpen,
  onSave,
  onDiscard,
  onCancel,
}: {
  isOpen: boolean;
  onSave?: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unsaved Changes
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          You have unsaved changes that will be lost if you leave this page.
          What would you like to do?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Discard Changes
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Field-Level Help
// ============================================================================

export function FieldHelp({
  content,
  title,
  trigger = 'hover',
  position = 'top',
  variant = 'tooltip',
  children,
  className = '',
}: FieldHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleTrigger = (type: 'enter' | 'leave' | 'click' | 'focus' | 'blur') => {
    if (trigger === 'hover') {
      if (type === 'enter') setIsOpen(true);
      if (type === 'leave') setIsOpen(false);
    } else if (trigger === 'click') {
      if (type === 'click') setIsOpen(!isOpen);
    } else if (trigger === 'focus') {
      if (type === 'focus') setIsOpen(true);
      if (type === 'blur') setIsOpen(false);
    }
  };

  // Close on outside click for click trigger
  useEffect(() => {
    if (trigger === 'click' && isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [trigger, isOpen]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900 dark:border-t-gray-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900 dark:border-b-gray-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 dark:border-l-gray-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900 dark:border-r-gray-700',
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-start gap-2 ${className}`}>
        {children}
        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>{content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => handleTrigger('enter')}
      onMouseLeave={() => handleTrigger('leave')}
      onFocus={() => handleTrigger('focus')}
      onBlur={() => handleTrigger('blur')}
      onClick={() => handleTrigger('click')}
    >
      {children}

      {isOpen && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${positionClasses[position]}`}
        >
          {variant === 'tooltip' ? (
            <div className="relative">
              <div className="px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg max-w-xs">
                {content}
              </div>
              <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 max-w-sm">
              {title && (
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {content}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Standalone Help Icon with Tooltip
export function HelpIcon({
  content,
  title,
  size = 'sm',
  className = '',
}: {
  content: string | React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <FieldHelp content={content} title={title} trigger="hover" variant="tooltip">
      <button
        type="button"
        className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${className}`}
      >
        <HelpCircle className={sizeClasses[size]} />
      </button>
    </FieldHelp>
  );
}

// ============================================================================
// Smart Defaults
// ============================================================================

export function useSmartDefaults(
  configs: SmartDefaultConfig[],
  context: Record<string, unknown> = {}
): Record<string, unknown> {
  const [defaults, setDefaults] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const loadDefaults = async () => {
      const newDefaults: Record<string, unknown> = {};

      for (const config of configs) {
        let value: unknown = config.fallback;

        try {
          switch (config.source) {
            case 'localStorage':
              if (config.key) {
                const stored = localStorage.getItem(config.key);
                if (stored) {
                  value = JSON.parse(stored);
                }
              }
              break;

            case 'context':
              if (config.key && context[config.key] !== undefined) {
                value = context[config.key];
              }
              break;

            case 'computed':
              if (config.compute) {
                value = config.compute(context);
              }
              break;

            case 'api':
              // API calls would be handled here
              // For now, use fallback
              break;
          }
        } catch {
          value = config.fallback;
        }

        if (value !== undefined) {
          newDefaults[config.field] = value;
        }
      }

      setDefaults(newDefaults);
    };

    loadDefaults();
  }, [configs, context]);

  return defaults;
}

// Smart Default Field Wrapper
export function SmartDefaultField({
  name,
  defaultValue,
  previousValue,
  onAccept,
  onReject,
  children,
  className = '',
}: {
  name: string;
  defaultValue: unknown;
  previousValue?: unknown;
  onAccept: (value: unknown) => void;
  onReject: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [showSuggestion, setShowSuggestion] = useState(!!defaultValue && defaultValue !== previousValue);

  if (!showSuggestion) {
    return <>{children}</>;
  }

  return (
    <div className={className}>
      {children}
      <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <span className="text-sm text-blue-700 dark:text-blue-300 flex-1">
          Suggested: <strong>{String(defaultValue)}</strong>
        </span>
        <button
          type="button"
          onClick={() => {
            onAccept(defaultValue);
            setShowSuggestion(false);
          }}
          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Use
        </button>
        <button
          type="button"
          onClick={() => {
            onReject();
            setShowSuggestion(false);
          }}
          className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default MultiStepForm;
