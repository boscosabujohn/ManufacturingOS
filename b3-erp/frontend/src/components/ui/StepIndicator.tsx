'use client'

import React from 'react'
import { Check } from 'lucide-react'

export interface Step {
  id: string
  label: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  variant?: 'default' | 'simple' | 'circles'
  orientation?: 'horizontal' | 'vertical'
  allowSkip?: boolean
  className?: string
}

/**
 * StepIndicator - Multi-step workflow progress indicator
 *
 * @example
 * <StepIndicator
 *   steps={[
 *     { id: '1', label: 'Contact Info', description: 'Enter basic details' },
 *     { id: '2', label: 'Company', description: 'Company information' },
 *     { id: '3', label: 'Review', description: 'Review and submit' }
 *   ]}
 *   currentStep={1}
 *   onStepClick={(index) => setCurrentStep(index)}
 * />
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  variant = 'default',
  orientation = 'horizontal',
  allowSkip = false,
  className = ''
}) => {
  const isStepComplete = (index: number) => index < currentStep
  const isStepCurrent = (index: number) => index === currentStep
  const isStepClickable = (index: number) => {
    return onStepClick && (allowSkip || index <= currentStep)
  }

  if (variant === 'simple') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium text-gray-900">
          Step {currentStep + 1} of {steps.length}
        </span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  if (variant === 'circles') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        {steps.map((step, index) => {
          const Icon = step.icon
          const complete = isStepComplete(index)
          const current = isStepCurrent(index)
          const clickable = isStepClickable(index)

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => clickable && onStepClick!(index)}
                disabled={!clickable}
                className={`
                  flex flex-col items-center gap-2
                  ${clickable ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${complete
                    ? 'bg-blue-600 border-blue-600'
                    : current
                    ? 'border-blue-600 bg-white'
                    : 'border-gray-300 bg-white'
                  }
                `}>
                  {complete ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : Icon ? (
                    <Icon className={`h-5 w-5 ${current ? 'text-blue-600' : 'text-gray-400'}`} />
                  ) : (
                    <span className={`text-sm font-semibold ${current ? 'text-blue-600' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${current ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${complete ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  // Default variant
  if (orientation === 'vertical') {
    return (
      <nav className={`space-y-4 ${className}`}>
        {steps.map((step, index) => {
          const Icon = step.icon
          const complete = isStepComplete(index)
          const current = isStepCurrent(index)
          const clickable = isStepClickable(index)

          return (
            <button
              key={step.id}
              onClick={() => clickable && onStepClick!(index)}
              disabled={!clickable}
              className={`
                flex items-start gap-4 w-full text-left
                ${clickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}
                p-3 rounded-lg transition-colors
              `}
            >
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0
                ${complete
                  ? 'bg-blue-600'
                  : current
                  ? 'bg-blue-100 ring-2 ring-blue-600'
                  : 'bg-gray-200'
                }
              `}>
                {complete ? (
                  <Check className="h-4 w-4 text-white" />
                ) : Icon ? (
                  <Icon className={`h-4 w-4 ${current ? 'text-blue-600' : 'text-gray-500'}`} />
                ) : (
                  <span className={`text-sm font-semibold ${current ? 'text-blue-600' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${current ? 'text-gray-900' : 'text-gray-600'}`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                )}
              </div>
            </button>
          )
        })}
      </nav>
    )
  }

  // Horizontal default
  return (
    <nav className={`${className}`}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const Icon = step.icon
          const complete = isStepComplete(index)
          const current = isStepCurrent(index)
          const clickable = isStepClickable(index)

          return (
            <li key={step.id} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
              <button
                onClick={() => clickable && onStepClick!(index)}
                disabled={!clickable}
                className={`
                  flex items-center gap-3
                  ${clickable ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0
                  ${complete
                    ? 'bg-blue-600'
                    : current
                    ? 'bg-blue-100 ring-2 ring-blue-600'
                    : 'bg-gray-200'
                  }
                `}>
                  {complete ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : Icon ? (
                    <Icon className={`h-5 w-5 ${current ? 'text-blue-600' : 'text-gray-500'}`} />
                  ) : (
                    <span className={`text-sm font-semibold ${current ? 'text-blue-600' : 'text-gray-500'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-semibold ${current ? 'text-gray-900' : 'text-gray-600'}`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500">{step.description}</p>
                  )}
                </div>
              </button>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${complete ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
