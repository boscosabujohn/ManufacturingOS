'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  forwardRef,
  InputHTMLAttributes,
} from 'react';
import {
  Search,
  X,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Hash,
  Package,
  User,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';

// Large input field for shop floor
export interface LargeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  size?: 'lg' | 'xl' | '2xl';
  fullWidth?: boolean;
}

const inputSizeClasses = {
  lg: 'min-h-[60px] text-xl px-5',
  xl: 'min-h-[72px] text-2xl px-6',
  '2xl': 'min-h-[88px] text-3xl px-8',
};

export const LargeInput = forwardRef<HTMLInputElement, LargeInputProps>(
  (
    {
      label,
      error,
      icon,
      size = 'xl',
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              ${inputSizeClasses[size]}
              ${icon ? 'pl-14' : ''}
              ${fullWidth ? 'w-full' : ''}
              bg-white dark:bg-gray-900
              border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              rounded-xl
              text-gray-900 dark:text-white
              placeholder-gray-400
              focus:outline-none focus:ring-4 focus:ring-blue-500/25
              ${error ? 'focus:border-red-500' : 'focus:border-blue-500'}
              transition-all
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-lg text-red-500 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

LargeInput.displayName = 'LargeInput';

// Autocomplete suggestion item
export interface AutocompleteItem {
  id: string;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  data?: unknown;
}

// Autocomplete input with large touch targets
export interface AutocompleteInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: AutocompleteItem) => void;
  suggestions: AutocompleteItem[];
  loading?: boolean;
  error?: string;
  icon?: ReactNode;
  size?: 'lg' | 'xl' | '2xl';
  minChars?: number;
  debounceMs?: number;
  recentItems?: AutocompleteItem[];
  className?: string;
}

export function AutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  suggestions,
  loading = false,
  error,
  icon,
  size = 'xl',
  minChars = 1,
  recentItems = [],
  className = '',
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const displayItems = value.length >= minChars ? suggestions : recentItems;
  const showDropdown = isOpen && (displayItems.length > 0 || loading);

  const handleSelect = useCallback((item: AutocompleteItem) => {
    onSelect(item);
    onChange(item.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onSelect, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < displayItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : displayItems.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && displayItems[highlightedIndex]) {
          handleSelect(displayItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [showDropdown, highlightedIndex, displayItems, handleSelect]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : icon ? (
            icon
          ) : (
            <Search className="w-6 h-6" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            ${inputSizeClasses[size]}
            w-full pl-14 pr-12
            bg-white dark:bg-gray-900
            border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            rounded-xl
            text-gray-900 dark:text-white
            placeholder-gray-400
            focus:outline-none focus:ring-4 focus:ring-blue-500/25
            ${error ? 'focus:border-red-500' : 'focus:border-blue-500'}
            transition-all
          `}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
        >
          {loading && displayItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-lg">Searching...</p>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-lg">No results found</p>
            </div>
          ) : (
            <>
              {value.length < minChars && recentItems.length > 0 && (
                <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50 dark:bg-gray-800">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Recent
                </div>
              )}
              {displayItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`
                    w-full text-left p-4 flex items-center gap-4
                    ${highlightedIndex === index
                      ? 'bg-blue-50 dark:bg-blue-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                    transition-colors
                  `}
                >
                  {item.icon && (
                    <span className="text-gray-400 flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xl font-medium text-gray-900 dark:text-white truncate">
                      {item.label}
                    </p>
                    {item.sublabel && (
                      <p className="text-lg text-gray-500 truncate">
                        {item.sublabel}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-lg text-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </p>
      )}
    </div>
  );
}

// Quantity input with large +/- buttons
export interface QuantityInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'lg' | 'xl' | '2xl';
  error?: string;
  className?: string;
}

export function QuantityInput({
  label,
  value,
  onChange,
  min = 0,
  max = 99999,
  step = 1,
  size = 'xl',
  error,
  className = '',
}: QuantityInputProps) {
  const buttonSizes = {
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
  };

  const iconSizes = {
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12',
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
    if ('vibrate' in navigator) navigator.vibrate(5);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
    if ('vibrate' in navigator) navigator.vibrate(5);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className={`
            ${buttonSizes[size]}
            flex items-center justify-center
            bg-gray-200 dark:bg-gray-700
            hover:bg-gray-300 dark:hover:bg-gray-600
            disabled:opacity-50 disabled:cursor-not-allowed
            rounded-xl
            active:scale-95 transition-all
          `}
        >
          <Minus className={iconSizes[size]} />
        </button>

        <input
          type="number"
          value={value}
          onChange={e => {
            const newValue = parseInt(e.target.value) || 0;
            onChange(Math.min(Math.max(newValue, min), max));
          }}
          min={min}
          max={max}
          className={`
            ${inputSizeClasses[size]}
            flex-1 text-center font-bold
            bg-white dark:bg-gray-900
            border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            rounded-xl
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
          `}
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={`
            ${buttonSizes[size]}
            flex items-center justify-center
            bg-blue-500 text-white
            hover:bg-blue-600
            disabled:opacity-50 disabled:cursor-not-allowed
            rounded-xl
            active:scale-95 transition-all
          `}
        >
          <Plus className={iconSizes[size]} />
        </button>
      </div>
      {error && (
        <p className="mt-2 text-lg text-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </p>
      )}
    </div>
  );
}

// Large select dropdown
export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface LargeSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  size?: 'lg' | 'xl' | '2xl';
  className?: string;
}

export function LargeSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  size = 'xl',
  className = '',
}: LargeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${inputSizeClasses[size]}
          w-full text-left
          flex items-center justify-between
          bg-white dark:bg-gray-900
          border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          rounded-xl
          ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400'}
          focus:outline-none focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500
          transition-all
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedOption?.icon && (
            <span className="flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption?.label || placeholder}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-6 h-6 flex-shrink-0" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                disabled={option.disabled}
                className={`
                  w-full text-left p-5 flex items-center gap-4
                  ${option.value === value
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                  }
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  transition-colors text-xl
                `}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span className="flex-1">{option.label}</span>
                {option.value === value && (
                  <Check className="w-6 h-6 text-blue-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {error && (
        <p className="mt-2 text-lg text-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </p>
      )}
    </div>
  );
}

// Quick entry form container
export interface QuickEntryFormProps {
  title?: string;
  children: ReactNode;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  valid?: boolean;
  className?: string;
}

export function QuickEntryForm({
  title,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'SUBMIT',
  cancelLabel = 'CANCEL',
  loading = false,
  valid = true,
  className = '',
}: QuickEntryFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valid && !loading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h2>
      )}

      <div className="space-y-6">
        {children}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[72px] px-6 text-xl font-bold rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-[0.98] transition-all"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={!valid || loading}
          className="flex-1 min-h-[72px] px-6 text-xl font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="w-6 h-6" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Pre-configured field templates
export interface PartNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: AutocompleteItem) => void;
  suggestions?: AutocompleteItem[];
  loading?: boolean;
  error?: string;
  size?: 'lg' | 'xl' | '2xl';
}

export function PartNumberField({
  value,
  onChange,
  onSelect,
  suggestions = [],
  loading,
  error,
  size = 'xl',
}: PartNumberFieldProps) {
  return (
    <AutocompleteInput
      label="Part Number"
      placeholder="Enter or scan part number"
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      suggestions={suggestions}
      loading={loading}
      error={error}
      icon={<Hash className="w-6 h-6" />}
      size={size}
    />
  );
}

export function WorkOrderField({
  value,
  onChange,
  onSelect,
  suggestions = [],
  loading,
  error,
  size = 'xl',
}: PartNumberFieldProps) {
  return (
    <AutocompleteInput
      label="Work Order"
      placeholder="Enter work order number"
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      suggestions={suggestions}
      loading={loading}
      error={error}
      icon={<Package className="w-6 h-6" />}
      size={size}
    />
  );
}

export function OperatorField({
  value,
  onChange,
  onSelect,
  suggestions = [],
  loading,
  error,
  size = 'xl',
}: PartNumberFieldProps) {
  return (
    <AutocompleteInput
      label="Operator"
      placeholder="Enter operator name or ID"
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      suggestions={suggestions}
      loading={loading}
      error={error}
      icon={<User className="w-6 h-6" />}
      size={size}
    />
  );
}

export function LocationField({
  value,
  onChange,
  onSelect,
  suggestions = [],
  loading,
  error,
  size = 'xl',
}: PartNumberFieldProps) {
  return (
    <AutocompleteInput
      label="Location"
      placeholder="Enter location or bin"
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      suggestions={suggestions}
      loading={loading}
      error={error}
      icon={<MapPin className="w-6 h-6" />}
      size={size}
    />
  );
}

export type {
  LargeInputProps,
  AutocompleteItem,
  AutocompleteInputProps,
  QuantityInputProps,
  SelectOption,
  LargeSelectProps,
  QuickEntryFormProps,
  PartNumberFieldProps,
};
