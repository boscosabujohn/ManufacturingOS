'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  X,
  Check,
  ChevronDown,
  Plus,
  Minus,
  Loader2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useFormDraft } from '@/hooks/useOfflineStorage';

interface QuickEntryOption {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
}

interface QuickEntryFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'select' | 'autocomplete' | 'quantity';
  value: any;
  onChange: (value: any) => void;
  options?: QuickEntryOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => Promise<QuickEntryOption[]>;
  recentOptions?: QuickEntryOption[];
}

/**
 * QuickEntryField - Touch-optimized form field with autocomplete support
 */
export function QuickEntryField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  error,
  min,
  max,
  step = 1,
  unit,
  autoFocus = false,
  disabled = false,
  loading = false,
  onSearch,
  recentOptions = []
}: QuickEntryFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<QuickEntryOption[]>(options);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search
  useEffect(() => {
    if (type === 'autocomplete' && searchQuery && onSearch) {
      setIsSearching(true);
      onSearch(searchQuery)
        .then(results => {
          setFilteredOptions(results);
          setIsSearching(false);
        })
        .catch(() => {
          setIsSearching(false);
        });
    } else if (type === 'select' || type === 'autocomplete') {
      const filtered = options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(searchQuery ? filtered : options);
    }
  }, [searchQuery, options, type, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (option: QuickEntryOption) => {
    onChange(option.id);
    setSearchQuery(option.label);
    setIsOpen(false);
  };

  const handleQuantityChange = (delta: number) => {
    const newValue = Math.max(min ?? 0, Math.min(max ?? Infinity, (value || 0) + delta));
    onChange(newValue);
  };

  const selectedOption = options.find(opt => opt.id === value);

  // Quantity input with large +/- buttons
  if (type === 'quantity') {
    return (
      <div className="mb-2" ref={containerRef}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuantityChange(-step)}
            disabled={disabled || (min !== undefined && value <= min)}
            className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Minus className="w-8 h-8" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="number"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className={`w-full h-16 text-center text-2xl font-bold bg-white dark:bg-gray-800 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } text-gray-900 dark:text-white`}
            />
            {unit && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                {unit}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleQuantityChange(step)}
            disabled={disabled || (max !== undefined && value >= max)}
            className="w-16 h-16 flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>

        {error && (
          <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  }

  // Select or Autocomplete dropdown
  if (type === 'select' || type === 'autocomplete') {
    return (
      <div className="mb-2" ref={containerRef}>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {/* Input / Button */}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`w-full min-h-[56px] px-4 py-3 flex items-center justify-between gap-2 bg-white dark:bg-gray-800 border-2 rounded-xl text-left transition-colors ${
              error
                ? 'border-red-500'
                : isOpen
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
                  : 'border-gray-300 dark:border-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`text-base ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              {selectedOption ? selectedOption.label : placeholder || 'Select...'}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-80 overflow-hidden">
              {/* Search */}
              {type === 'autocomplete' && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-base text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Options */}
              {recentOptions.length > 0 && !searchQuery && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Recent
                  </p>
                  {recentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      className="w-full px-3 py-3 flex items-center gap-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {option.icon}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                          {option.label}
                        </p>
                        {option.description && (
                          <p className="text-sm text-gray-500 truncate">{option.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Options List */}
              <div className="overflow-y-auto max-h-60">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        value === option.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                    >
                      {option.icon}
                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-medium truncate ${
                          value === option.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                        }`}>
                          {option.label}
                        </p>
                        {option.description && (
                          <p className="text-sm text-gray-500 truncate">{option.description}</p>
                        )}
                      </div>
                      {value === option.id && (
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  }

  // Standard text/number input
  return (
    <div className="mb-2" ref={containerRef}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          min={min}
          max={max}
          step={step}
          className={`w-full min-h-[56px] px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl text-base transition-colors ${
            error
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900'
          } text-gray-900 dark:text-white placeholder-gray-500 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
        {unit && !loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
            {unit}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

interface QuickEntryFormProps {
  formId: string;
  title?: string;
  children: React.ReactNode;
  onSubmit: (data: any) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  enableDraft?: boolean;
}

/**
 * QuickEntryForm - Touch-optimized form wrapper with draft support
 */
export function QuickEntryForm({
  formId,
  title,
  children,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  isLoading = false,
  enableDraft = true
}: QuickEntryFormProps) {
  const { draft, saveDraft, clearDraft, isLoading: draftLoading } = useFormDraft(formId);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    if (draft && !draftLoading) {
      setHasDraft(true);
    }
  }, [draft, draftLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(new FormData(e.target as HTMLFormElement));
    if (enableDraft) {
      await clearDraft();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>
      )}

      {hasDraft && (
        <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl mb-2">
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Draft saved
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Your previous entry was saved
            </p>
          </div>
          <button
            type="button"
            onClick={() => { clearDraft(); setHasDraft(false); }}
            className="text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:underline"
          >
            Discard
          </button>
        </div>
      )}

      {children}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 min-h-[56px] px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 min-h-[56px] px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default QuickEntryForm;
