'use client'

import React, { FormEvent, ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local' | 'time'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  value?: string | number
  onChange?: (value: string) => void
  helperText?: string
  autoComplete?: string
  pattern?: string
  min?: number
  max?: number
  step?: number
}

export interface FormWrapperProps {
  title?: string
  description?: string
  children: ReactNode
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void
  loading?: boolean
  error?: string
  success?: string
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  className?: string
  layout?: 'vertical' | 'horizontal'
  showRequiredIndicator?: boolean
  footer?: ReactNode
}

/**
 * FormWrapper - Consistent form container with validation feedback
 *
 * @example
 * <FormWrapper
 *   title="Create New Lead"
 *   description="Enter lead information"
 *   onSubmit={handleSubmit}
 *   loading={isSubmitting}
 *   error={errorMessage}
 *   submitLabel="Create Lead"
 * >
 *   <Input name="name" label="Full Name" required />
 *   <Input name="email" label="Email" type="email" required />
 * </FormWrapper>
 */
export const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  description,
  children,
  onSubmit,
  loading = false,
  error,
  success,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  className = '',
  layout = 'vertical',
  showRequiredIndicator = true,
  footer
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit && !loading) {
      onSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      {(title || description) && (
        <div className="pb-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
          {showRequiredIndicator && (
            <p className="mt-2 text-xs text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">Success</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      <div className={`space-y-2 ${layout === 'horizontal' ? 'md:space-y-0 md:grid md:grid-cols-2 md:gap-2' : ''}`}>
        {children}
      </div>

      {footer || (onSubmit && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitLabel}
          </button>
        </div>
      ))}
    </form>
  )
}
