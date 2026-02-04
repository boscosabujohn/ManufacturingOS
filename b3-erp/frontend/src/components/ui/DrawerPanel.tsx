'use client'

import React, { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

export interface DrawerPanelProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  position?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

/**
 * DrawerPanel - Slide-out panel from left or right
 *
 * @example
 * <DrawerPanel
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Ticket Details"
 *   position="right"
 *   size="lg"
 * >
 *   <div>Ticket information...</div>
 * </DrawerPanel>
 */
export const DrawerPanel: React.FC<DrawerPanelProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeOnEscape, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: ''
  }

  const slideDirection = position === 'left' ? '-translate-x-full' : 'translate-x-full'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 ${position}-0 flex ${position === 'left' ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`
            relative bg-white shadow-2xl w-full ${sizeClasses[size]}
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : slideDirection}
            flex flex-col
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex-1">
                {title && (
                  <h3 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-600">{description}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-3 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
