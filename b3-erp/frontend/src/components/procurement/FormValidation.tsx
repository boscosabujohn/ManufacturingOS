'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import {
  AlertCircle, CheckCircle, X, Eye, EyeOff, Calendar, DollarSign,
  User, Mail, Phone, Building, Package, FileText, Hash, Percent
} from 'lucide-react'

// ============= Validation Rules =============
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  email?: boolean
  phone?: boolean
  url?: boolean
  custom?: (value: any) => string | null
}

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'date' | 'currency'
  placeholder?: string
  rules?: ValidationRule
  options?: Array<{ value: string; label: string }>
  icon?: ReactNode
  helpText?: string
}

// ============= Form Validation Hook =============
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  fieldConfigs: FieldConfig[]
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name: string, value: any): string | null => {
    const config = fieldConfigs.find(f => f.name === name)
    if (!config?.rules) return null

    const rules = config.rules

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${config.label} is required`
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null
    }

    // String length validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `${config.label} must be at least ${rules.minLength} characters`
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${config.label} must not exceed ${rules.maxLength} characters`
      }
    }

    // Number validations
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      const numValue = Number(value)
      if (rules.min !== undefined && numValue < rules.min) {
        return `${config.label} must be at least ${rules.min}`
      }
      if (rules.max !== undefined && numValue > rules.max) {
        return `${config.label} must not exceed ${rules.max}`
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return `${config.label} format is invalid`
    }

    // Email validation
    if (rules.email && typeof value === 'string') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    // Phone validation
    if (rules.phone && typeof value === 'string') {
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/
      if (!phonePattern.test(value.replace(/[\s\-\(\)]/g, ''))) {
        return 'Please enter a valid phone number'
      }
    }

    // URL validation
    if (rules.url && typeof value === 'string') {
      try {
        new URL(value)
      } catch {
        return 'Please enter a valid URL'
      }
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value)
    }

    return null
  }

  const setValue = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error || '' }))
    }
  }

  const setFieldTouched = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))

    // Validate on blur
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error || '' }))
  }

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fieldConfigs.forEach(config => {
      const error = validateField(config.name, values[config.name])
      if (error) {
        newErrors[config.name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(
      fieldConfigs.reduce((acc, config) => ({ ...acc, [config.name]: true }), {})
    )

    return isValid
  }

  const handleSubmit = async (onSubmit: (values: T) => Promise<void> | void) => {
    setIsSubmitting(true)

    if (validateAll()) {
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }

    setIsSubmitting(false)
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  const hasErrors = Object.values(errors).some(error => error)
  const isFieldValid = (name: string) => touched[name] && !errors[name]
  const isFieldInvalid = (name: string) => touched[name] && !!errors[name]

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validateAll,
    handleSubmit,
    reset,
    hasErrors,
    isFieldValid,
    isFieldInvalid
  }
}

// ============= Form Field Component =============
interface FormFieldProps {
  config: FieldConfig
  value: any
  error?: string
  touched?: boolean
  onChange: (value: any) => void
  onBlur: () => void
  disabled?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  config,
  value,
  error,
  touched,
  onChange,
  onBlur,
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const hasError = touched && !!error
  const isValid = touched && !error && value

  const baseInputClasses = `w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : isValid
      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`

  const renderInput = () => {
    switch (config.type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={config.placeholder}
            disabled={disabled}
            className={`${baseInputClasses} min-h-[100px] resize-vertical`}
            rows={4}
          />
        )

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            className={baseInputClasses}
          >
            <option value="">{config.placeholder || `Select ${config.label}`}</option>
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={config.placeholder}
              disabled={disabled}
              className={`${baseInputClasses} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        )

      case 'currency':
        return (
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || '')}
              onBlur={onBlur}
              placeholder={config.placeholder}
              disabled={disabled}
              className={`${baseInputClasses} pl-10`}
              step="0.01"
              min="0"
            />
          </div>
        )

      case 'date':
        return (
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              disabled={disabled}
              className={`${baseInputClasses} pl-10`}
            />
          </div>
        )

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || '')}
            onBlur={onBlur}
            placeholder={config.placeholder}
            disabled={disabled}
            className={baseInputClasses}
          />
        )

      default:
        return (
          <div className="relative">
            {config.icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {config.icon}
              </div>
            )}
            <input
              type={config.type}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={config.placeholder}
              disabled={disabled}
              className={`${baseInputClasses} ${config.icon ? 'pl-10' : ''}`}
            />
            {isValid && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
        )
    }
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {config.label}
        {config.rules?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {config.helpText && !hasError && (
        <p className="text-xs text-gray-500">{config.helpText}</p>
      )}
      {hasError && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// ============= Form Error Summary Component =============
interface FormErrorSummaryProps {
  errors: Record<string, string>
  fieldConfigs: FieldConfig[]
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  fieldConfigs
}) => {
  const errorEntries = Object.entries(errors).filter(([_, error]) => error)

  if (errorEntries.length === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-red-800">
            Please correct the following errors:
          </h3>
          <ul className="mt-2 text-sm text-red-700 space-y-1">
            {errorEntries.map(([fieldName, error]) => {
              const field = fieldConfigs.find(f => f.name === fieldName)
              return (
                <li key={fieldName}>
                  <strong>{field?.label || fieldName}:</strong> {error}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============= Success Message Component =============
interface SuccessMessageProps {
  message: string
  onClose?: () => void
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-green-800">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ============= Example Procurement Form =============
export const ProcurementFormExample: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false)

  const fieldConfigs: FieldConfig[] = [
    {
      name: 'vendorName',
      label: 'Vendor Name',
      type: 'text',
      placeholder: 'Enter vendor name',
      icon: <Building className="h-4 w-4" />,
      rules: { required: true, minLength: 2, maxLength: 100 }
    },
    {
      name: 'contactEmail',
      label: 'Contact Email',
      type: 'email',
      placeholder: 'vendor@example.com',
      icon: <Mail className="h-4 w-4" />,
      rules: { required: true, email: true }
    },
    {
      name: 'contactPhone',
      label: 'Contact Phone',
      type: 'tel',
      placeholder: '+1 (555) 123-4567',
      icon: <Phone className="h-4 w-4" />,
      rules: { phone: true },
      helpText: 'Include country code for international numbers'
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'Select category',
      options: [
        { value: 'raw-materials', label: 'Raw Materials' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'services', label: 'Services' },
        { value: 'it-software', label: 'IT & Software' }
      ],
      rules: { required: true }
    },
    {
      name: 'contractValue',
      label: 'Contract Value',
      type: 'currency',
      placeholder: '0.00',
      rules: { required: true, min: 0, max: 10000000 }
    },
    {
      name: 'contractStart',
      label: 'Contract Start Date',
      type: 'date',
      rules: { required: true }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter vendor description...',
      rules: { maxLength: 500 },
      helpText: 'Provide a brief description of the vendor and services'
    }
  ]

  const initialValues = {
    vendorName: '',
    contactEmail: '',
    contactPhone: '',
    category: '',
    contractValue: '',
    contractStart: '',
    description: ''
  }

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    hasErrors
  } = useFormValidation(initialValues, fieldConfigs)

  const onSubmit = async (formValues: typeof initialValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Form submitted:', formValues)
    setShowSuccess(true)
    reset()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Vendor</h2>

      {showSuccess && (
        <div className="mb-6">
          <SuccessMessage
            message="Vendor has been successfully added to the system!"
            onClose={() => setShowSuccess(false)}
          />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)
        }}
        className="space-y-6"
      >
        <FormErrorSummary errors={errors} fieldConfigs={fieldConfigs} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fieldConfigs.map((config) => (
            <div
              key={config.name}
              className={config.type === 'textarea' ? 'md:col-span-2' : ''}
            >
              <FormField
                config={config}
                value={values[config.name]}
                error={errors[config.name]}
                touched={touched[config.name]}
                onChange={(value) => setValue(config.name, value)}
                onBlur={() => setFieldTouched(config.name)}
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || hasErrors}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding Vendor...
              </>
            ) : (
              'Add Vendor'
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}