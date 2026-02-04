'use client'

import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import {
  HelpCircle, Info, AlertCircle, CheckCircle, X, ChevronRight, ChevronLeft,
  Book, Lightbulb, Target, Play, Pause, RotateCcw, ArrowRight, ExternalLink,
  Maximize2, Minimize2, Volume2, VolumeX, Settings, Eye, EyeOff
} from 'lucide-react'

// ============= Types =============
interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  trigger?: 'hover' | 'click' | 'focus'
  delay?: number
  disabled?: boolean
  maxWidth?: string
  className?: string
  showArrow?: boolean
  interactive?: boolean
}

export interface HelpStep {
  id: string
  target: string
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  spotlight?: boolean
  action?: () => void
}

interface HelpTourProps {
  steps: HelpStep[]
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  autoStart?: boolean
  showProgress?: boolean
  allowSkip?: boolean
}

// ============= Tooltip Component =============
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'auto',
  trigger = 'hover',
  delay = 200,
  disabled = false,
  maxWidth = '250px',
  className = '',
  showArrow = true,
  interactive = false
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current || position !== 'auto') {
      return position
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // Check if tooltip fits below
    if (triggerRect.bottom + tooltipRect.height + 10 < viewportHeight) {
      return 'bottom'
    }
    // Check if tooltip fits above
    if (triggerRect.top - tooltipRect.height - 10 > 0) {
      return 'top'
    }
    // Check if tooltip fits to the right
    if (triggerRect.right + tooltipRect.width + 10 < viewportWidth) {
      return 'right'
    }
    // Default to left
    return 'left'
  }, [position])

  const showTooltip = useCallback(() => {
    if (disabled) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setTimeout(() => {
        setActualPosition(calculatePosition())
      }, 0)
    }, delay)
  }, [disabled, delay, calculatePosition])

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (interactive) {
      // Add small delay for interactive tooltips
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 100)
    } else {
      setIsVisible(false)
    }
  }, [interactive])

  const handleMouseEnter = () => {
    if (trigger === 'hover') showTooltip()
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') hideTooltip()
  }

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip()
      } else {
        showTooltip()
      }
    }
  }

  const handleFocus = () => {
    if (trigger === 'focus') showTooltip()
  }

  const handleBlur = () => {
    if (trigger === 'focus') hideTooltip()
  }

  const handleTooltipMouseEnter = () => {
    if (interactive && timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleTooltipMouseLeave = () => {
    if (interactive) hideTooltip()
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    auto: 'top-full left-1/2 transform -translate-x-1/2 mt-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800',
    auto: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800'
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${positionClasses[actualPosition]} ${className}`}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          role="tooltip"
          style={{ maxWidth }}
        >
          <div className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 shadow-lg">
            {content}
          </div>
          {showArrow && (
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[actualPosition]}`}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ============= Info Icon with Tooltip =============
export const InfoTooltip: React.FC<{
  content: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ content, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <Tooltip content={content} position="auto" interactive>
      <Info className={`${sizeClasses[size]} text-gray-400 hover:text-gray-600 cursor-help ${className}`} />
    </Tooltip>
  )
}

// ============= Help Tour Component =============
export const HelpTour: React.FC<HelpTourProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  autoStart = false,
  showProgress = true,
  allowSkip = true
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoStart)
  const [spotlight, setSpotlight] = useState<HTMLElement | null>(null)

  const currentStepData = steps[currentStep]

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Tour completed
      onComplete?.()
      onClose()
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  // Update spotlight effect
  useEffect(() => {
    if (!isOpen || !currentStepData) return

    const targetElement = document.querySelector(currentStepData.target) as HTMLElement
    if (targetElement && currentStepData.spotlight) {
      setSpotlight(targetElement)

      // Scroll element into view
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    } else {
      setSpotlight(null)
    }
  }, [isOpen, currentStep, currentStepData])

  // Auto-advance steps
  useEffect(() => {
    if (!isPlaying || !isOpen) return

    const timer = setTimeout(() => {
      goToNextStep()
    }, 5000) // Auto-advance after 5 seconds

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, isOpen])

  if (!isOpen || !currentStepData) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Spotlight effect */}
      {spotlight && (
        <div
          className="fixed pointer-events-none z-50 border-4 border-yellow-400 rounded-lg shadow-lg"
          style={{
            top: spotlight.offsetTop - 4,
            left: spotlight.offsetLeft - 4,
            width: spotlight.offsetWidth + 8,
            height: spotlight.offsetHeight + 8,
            transition: 'all 0.3s ease'
          }}
        />
      )}

      {/* Tour Step Popup */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStepData.title}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title={isPlaying ? 'Pause tour' : 'Resume tour'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                onClick={handleSkip}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Close tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress */}
          {showProgress && (
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mb-3">
            <p className="text-gray-700 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {allowSkip && (
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Skip Tour
                </button>
              )}

              <button
                onClick={goToNextStep}
                className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Complete
                    <CheckCircle className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step Action */}
          {currentStepData.action && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={currentStepData.action}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Target className="h-4 w-4 mr-2" />
                Try this action
              </button>
            </div>
          )}
        </div>

        {/* Step Navigation Dots */}
        {steps.length > 1 && (
          <div className="px-6 pb-4">
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ============= Help Panel Component =============
export const HelpPanel: React.FC<{
  isOpen: boolean
  onClose: () => void
  topics?: Array<{
    id: string
    title: string
    content: ReactNode
    icon?: ReactNode
  }>
}> = ({ isOpen, onClose, topics = [] }) => {
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeTopic = topics.find(topic => topic.id === activeTopicId)

  if (!isOpen) return null

  return (
    <div className={`fixed right-4 bottom-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ${
      isMinimized ? 'w-80 h-12' : 'w-96 h-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Help & Guides</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Close help"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <HelpCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex h-80">
            {/* Topics List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                    activeTopicId === topic.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {topic.icon}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {topic.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Topic Content */}
            <div className="flex-1 p-3 overflow-y-auto">
              {activeTopic ? (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {activeTopic.title}
                  </h4>
                  <div className="text-gray-700 prose prose-sm max-w-none">
                    {activeTopic.content}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <HelpCircle className="h-12 w-12 mb-2 text-gray-300" />
                  <p>Select a help topic to get started</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ============= Contextual Help Hook =============
export const useContextualHelp = () => {
  const [activeHelp, setActiveHelp] = useState<string | null>(null)
  const [helpHistory, setHelpHistory] = useState<string[]>([])

  const showHelp = (helpId: string) => {
    setActiveHelp(helpId)
    setHelpHistory(prev => [...prev.filter(id => id !== helpId), helpId])
  }

  const hideHelp = () => {
    setActiveHelp(null)
  }

  const getRecentHelp = () => {
    return helpHistory.slice(-5).reverse()
  }

  return {
    activeHelp,
    showHelp,
    hideHelp,
    getRecentHelp
  }
}

// ============= Quick Help Button =============
export const QuickHelpButton: React.FC<{
  helpId: string
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
}> = ({ helpId, content, position = 'top', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <Tooltip content={content} position={position} trigger="hover" interactive>
      <button className="text-gray-400 hover:text-blue-500 transition-colors">
        <HelpCircle className={sizeClasses[size]} />
      </button>
    </Tooltip>
  )
}

// ============= Smart Help Suggestions =============
export const SmartHelpSuggestions: React.FC<{
  context: string
  suggestions: Array<{
    id: string
    title: string
    description: string
    action?: () => void
  }>
}> = ({ context, suggestions }) => {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || suggestions.length === 0) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Helpful tips for {context}
            </h4>
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex items-start space-x-2">
                  <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      {suggestion.title}
                    </p>
                    <p className="text-sm text-blue-600">
                      {suggestion.description}
                    </p>
                    {suggestion.action && (
                      <button
                        onClick={suggestion.action}
                        className="text-sm text-blue-700 underline hover:text-blue-900 mt-1"
                      >
                        Learn more
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-blue-400 hover:text-blue-600 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}