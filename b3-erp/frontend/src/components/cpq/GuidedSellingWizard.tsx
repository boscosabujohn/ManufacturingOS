'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Package,
  Settings,
  DollarSign,
  FileText,
  ShoppingCart,
  Sparkles,
  Info,
  Star,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export type StepStatus = 'pending' | 'active' | 'completed' | 'skipped';
export type QuestionType = 'single' | 'multiple' | 'number' | 'text' | 'range' | 'boolean';

export interface Answer {
  questionId: string;
  value: any;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  recommended?: boolean;
  popular?: boolean;
  price?: number;
  disabledIf?: (answers: Answer[]) => boolean;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  defaultValue?: any;
  helpText?: string;
  recommendation?: string;
  validationRule?: (value: any) => boolean;
  validationMessage?: string;
  dependsOn?: string; // questionId
  showIf?: (answers: Answer[]) => boolean;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: StepStatus;
  questions: Question[];
  skippable?: boolean;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  configuredPrice: number;
  discount: number;
  matchScore: number;
  features: string[];
  whyRecommended: string[];
}

export interface GuidedSellingWizardProps {
  steps: WizardStep[];
  onComplete?: (answers: Answer[], recommendations: ProductRecommendation[]) => void;
  onCancel?: () => void;
  onStepChange?: (stepId: string) => void;
  showRecommendations?: boolean;
  className?: string;
}

export const GuidedSellingWizard: React.FC<GuidedSellingWizardProps> = ({
  steps: initialSteps,
  onComplete,
  onCancel,
  onStepChange,
  showRecommendations = true,
  className = '',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [steps, setSteps] = useState<WizardStep[]>(initialSteps);
  const [showHelp, setShowHelp] = useState<{ [key: string]: boolean }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const getAnswer = (questionId: string): any => {
    return answers.find((a) => a.questionId === questionId)?.value;
  };

  const setAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, value };
        return updated;
      }
      return [...prev, { questionId, value }];
    });

    // Clear validation error when user changes answer
    setValidationErrors((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const validateCurrentStep = (): boolean => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    currentStep.questions.forEach((question) => {
      // Skip if question should not be shown
      if (question.showIf && !question.showIf(answers)) {
        return;
      }

      const answer = getAnswer(question.id);

      // Check required fields
      if (question.required && (answer === undefined || answer === null || answer === '')) {
        errors[question.id] = 'This field is required';
        isValid = false;
        return;
      }

      // Check custom validation
      if (answer && question.validationRule && !question.validationRule(answer)) {
        errors[question.id] = question.validationMessage || 'Invalid value';
        isValid = false;
        return;
      }

      // Check number range
      if (question.type === 'number' && answer !== undefined) {
        if (question.min !== undefined && answer < question.min) {
          errors[question.id] = `Value must be at least ${question.min}`;
          isValid = false;
          return;
        }
        if (question.max !== undefined && answer > question.max) {
          errors[question.id] = `Value must be at most ${question.max}`;
          isValid = false;
          return;
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Mark current step as completed
    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = { ...currentStep, status: 'completed' };

    // Set next step as active
    if (currentStepIndex < steps.length - 1) {
      updatedSteps[currentStepIndex + 1] = { ...updatedSteps[currentStepIndex + 1], status: 'active' };
      setSteps(updatedSteps);
      setCurrentStepIndex(currentStepIndex + 1);
      onStepChange?.(updatedSteps[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const updatedSteps = [...steps];
      updatedSteps[currentStepIndex] = { ...currentStep, status: 'pending' };
      updatedSteps[currentStepIndex - 1] = { ...updatedSteps[currentStepIndex - 1], status: 'active' };
      setSteps(updatedSteps);
      setCurrentStepIndex(currentStepIndex - 1);
      onStepChange?.(updatedSteps[currentStepIndex - 1].id);
    }
  };

  const handleSkip = () => {
    if (currentStep.skippable) {
      const updatedSteps = [...steps];
      updatedSteps[currentStepIndex] = { ...currentStep, status: 'skipped' };
      if (currentStepIndex < steps.length - 1) {
        updatedSteps[currentStepIndex + 1] = { ...updatedSteps[currentStepIndex + 1], status: 'active' };
        setSteps(updatedSteps);
        setCurrentStepIndex(currentStepIndex + 1);
        onStepChange?.(updatedSteps[currentStepIndex + 1].id);
      }
    }
  };

  const handleComplete = () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Generate mock recommendations based on answers
    const mockRecommendations: ProductRecommendation[] = [
      {
        id: '1',
        name: 'Enterprise Solution Package',
        description: 'Complete manufacturing suite with advanced features',
        basePrice: 15000,
        configuredPrice: 13500,
        discount: 10,
        matchScore: 95,
        features: ['AI-powered analytics', 'Real-time monitoring', '24/7 support'],
        whyRecommended: ['Matches your scale requirements', 'Best ROI for enterprise', 'Includes all requested features'],
      },
      {
        id: '2',
        name: 'Professional Package',
        description: 'Mid-tier solution with essential features',
        basePrice: 8000,
        configuredPrice: 7200,
        discount: 10,
        matchScore: 78,
        features: ['Standard analytics', 'Business hours support', 'Core modules'],
        whyRecommended: ['Cost-effective option', 'Covers 80% of requirements'],
      },
    ];

    const updatedSteps = [...steps];
    updatedSteps[currentStepIndex] = { ...currentStep, status: 'completed' };
    setSteps(updatedSteps);

    onComplete?.(answers, mockRecommendations);
  };

  const toggleHelp = (questionId: string) => {
    setShowHelp((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const renderQuestion = (question: Question) => {
    // Check if question should be shown
    if (question.showIf && !question.showIf(answers)) {
      return null;
    }

    const answer = getAnswer(question.id);
    const error = validationErrors[question.id];

    return (
      <div key={question.id} className="mb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              {question.title}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {question.description && (
              <p className="text-sm text-gray-600 mb-2">{question.description}</p>
            )}
          </div>
          {question.helpText && (
            <button
              onClick={() => toggleHelp(question.id)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Help Text */}
        {showHelp[question.id] && question.helpText && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-start space-x-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{question.helpText}</span>
          </div>
        )}

        {/* Recommendation */}
        {question.recommendation && (
          <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800 flex items-start space-x-2">
            <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Recommendation:</strong> {question.recommendation}
            </div>
          </div>
        )}

        {/* Question Input */}
        <div>
          {question.type === 'single' && question.options && (
            <div className="space-y-2">
              {question.options.map((option) => {
                const isDisabled = option.disabledIf?.(answers) || false;
                const OptionIcon = option.icon;

                return (
                  <button
                    key={option.id}
                    onClick={() => !isDisabled && setAnswer(question.id, option.value)}
                    disabled={isDisabled}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      answer === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {OptionIcon && (
                        <div className={`p-2 rounded-lg ${answer === option.value ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <OptionIcon className={`h-5 w-5 ${answer === option.value ? 'text-blue-600' : 'text-gray-600'}`} />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{option.label}</span>
                          {option.recommended && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                              Recommended
                            </span>
                          )}
                          {option.popular && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center space-x-1">
                              <Star className="h-3 w-3" />
                              <span>Popular</span>
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        )}
                        {option.price !== undefined && (
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            ${option.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {answer === option.value && (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {question.type === 'multiple' && question.options && (
            <div className="space-y-2">
              {question.options.map((option) => {
                const isSelected = Array.isArray(answer) && answer.includes(option.value);
                const isDisabled = option.disabledIf?.(answers) || false;
                const OptionIcon = option.icon;

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (isDisabled) return;
                      const currentValues = Array.isArray(answer) ? answer : [];
                      const newValues = isSelected
                        ? currentValues.filter((v) => v !== option.value)
                        : [...currentValues, option.value];
                      setAnswer(question.id, newValues);
                    }}
                    disabled={isDisabled}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {OptionIcon && (
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <OptionIcon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900">{option.label}</span>
                        {option.description && (
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        )}
                      </div>
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {question.type === 'number' && (
            <input
              type="number"
              value={answer || ''}
              onChange={(e) => setAnswer(question.id, parseFloat(e.target.value))}
              min={question.min}
              max={question.max}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter a number${question.min !== undefined ? ` (min: ${question.min})` : ''}${
                question.max !== undefined ? ` (max: ${question.max})` : ''
              }`}
            />
          )}

          {question.type === 'text' && (
            <input
              type="text"
              value={answer || ''}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your answer"
            />
          )}

          {question.type === 'boolean' && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAnswer(question.id, true)}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                  answer === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Yes</span>
                </div>
              </button>
              <button
                onClick={() => setAnswer(question.id, false)}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                  answer === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 text-gray-700 hover:border-red-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <XCircle className="h-5 w-5" />
                  <span>No</span>
                </div>
              </button>
            </div>
          )}

          {question.type === 'range' && (
            <div>
              <input
                type="range"
                value={answer || question.min || 0}
                onChange={(e) => setAnswer(question.id, parseInt(e.target.value))}
                min={question.min}
                max={question.max}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{question.min}</span>
                <span className="font-semibold text-blue-600">{answer || question.min || 0}</span>
                <span>{question.max}</span>
              </div>
            </div>
          )}
        </div>

        {/* Validation Error */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Progress Bar */}
      <div className="px-6 pt-6">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = step.status === 'completed';
            const isSkipped = step.status === 'skipped';

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isSkipped
                        ? 'bg-gray-300 border-gray-300 text-white'
                        : isActive
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : isSkipped ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      isActive ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 -mt-10 ${
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-6 py-2 border-t border-gray-200">
        <div className="mb-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
          <p className="text-gray-600">{currentStep.description}</p>
        </div>

        <div className="space-y-3">
          {currentStep.questions.map((question) => renderQuestion(question))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          {currentStep.skippable && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip This Step
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
          )}

          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Next Step</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Complete & Get Recommendations</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
