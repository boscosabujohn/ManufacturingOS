'use client';

import React, { useState } from 'react';

// Types
type ComponentState = 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading' | 'error' | 'success';
type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ComponentSize = 'sm' | 'md' | 'lg';

interface ComponentExample {
  id: string;
  name: string;
  description: string;
  variants: ComponentVariant[];
  sizes: ComponentSize[];
  states: ComponentState[];
}

interface ComponentVariantMatrixProps {
  className?: string;
}

const components: ComponentExample[] = [
  {
    id: 'button',
    name: 'Button',
    description: 'Interactive button component for actions',
    variants: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'hover', 'active', 'focus', 'disabled', 'loading']
  },
  {
    id: 'input',
    name: 'Input',
    description: 'Text input field for user data entry',
    variants: ['primary', 'outline'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'hover', 'focus', 'disabled', 'error', 'success']
  },
  {
    id: 'badge',
    name: 'Badge',
    description: 'Status indicator and label component',
    variants: ['primary', 'secondary', 'outline'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default']
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Container component for grouped content',
    variants: ['primary', 'outline'],
    sizes: ['sm', 'md', 'lg'],
    states: ['default', 'hover', 'active']
  }
];

const ComponentVariantMatrix: React.FC<ComponentVariantMatrixProps> = ({ className = '' }) => {
  const [selectedComponent, setSelectedComponent] = useState<string>('button');
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const getButtonStyles = (variant: ComponentVariant, state: ComponentState, size: ComponentSize): string => {
    const baseStyles = 'rounded-lg font-medium transition-all inline-flex items-center justify-center';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-3 py-2 text-base'
    };

    const variantStyles = {
      primary: {
        default: 'bg-blue-600 text-white',
        hover: 'bg-blue-700 text-white',
        active: 'bg-blue-800 text-white',
        focus: 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2',
        disabled: 'bg-blue-300 text-white cursor-not-allowed',
        loading: 'bg-blue-600 text-white cursor-wait',
        error: 'bg-blue-600 text-white',
        success: 'bg-blue-600 text-white'
      },
      secondary: {
        default: 'bg-gray-100 text-gray-700',
        hover: 'bg-gray-200 text-gray-800',
        active: 'bg-gray-300 text-gray-900',
        focus: 'bg-gray-100 text-gray-700 ring-2 ring-gray-300 ring-offset-2',
        disabled: 'bg-gray-50 text-gray-400 cursor-not-allowed',
        loading: 'bg-gray-100 text-gray-700 cursor-wait',
        error: 'bg-gray-100 text-gray-700',
        success: 'bg-gray-100 text-gray-700'
      },
      outline: {
        default: 'border-2 border-blue-600 text-blue-600 bg-transparent',
        hover: 'border-2 border-blue-700 text-blue-700 bg-blue-50',
        active: 'border-2 border-blue-800 text-blue-800 bg-blue-100',
        focus: 'border-2 border-blue-600 text-blue-600 ring-2 ring-blue-300 ring-offset-2',
        disabled: 'border-2 border-gray-300 text-gray-300 cursor-not-allowed',
        loading: 'border-2 border-blue-600 text-blue-600 cursor-wait',
        error: 'border-2 border-blue-600 text-blue-600',
        success: 'border-2 border-blue-600 text-blue-600'
      },
      ghost: {
        default: 'text-gray-700 bg-transparent',
        hover: 'text-gray-900 bg-gray-100',
        active: 'text-gray-900 bg-gray-200',
        focus: 'text-gray-700 ring-2 ring-gray-300 ring-offset-2',
        disabled: 'text-gray-300 cursor-not-allowed',
        loading: 'text-gray-700 cursor-wait',
        error: 'text-gray-700',
        success: 'text-gray-700'
      },
      danger: {
        default: 'bg-red-600 text-white',
        hover: 'bg-red-700 text-white',
        active: 'bg-red-800 text-white',
        focus: 'bg-red-600 text-white ring-2 ring-red-300 ring-offset-2',
        disabled: 'bg-red-300 text-white cursor-not-allowed',
        loading: 'bg-red-600 text-white cursor-wait',
        error: 'bg-red-600 text-white',
        success: 'bg-red-600 text-white'
      }
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant][state]}`;
  };

  const getInputStyles = (variant: ComponentVariant, state: ComponentState, size: ComponentSize): string => {
    const baseStyles = 'rounded-lg border transition-all w-full';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const stateStyles = {
      default: 'border-gray-300 bg-white',
      hover: 'border-gray-400 bg-white',
      focus: 'border-blue-500 ring-2 ring-blue-200 bg-white',
      disabled: 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed',
      error: 'border-red-500 bg-red-50 ring-2 ring-red-200',
      success: 'border-green-500 bg-green-50 ring-2 ring-green-200',
      active: 'border-blue-500 bg-white',
      loading: 'border-gray-300 bg-gray-50 cursor-wait'
    };

    return `${baseStyles} ${sizeStyles[size]} ${stateStyles[state]}`;
  };

  const getBadgeStyles = (variant: ComponentVariant, size: ComponentSize): string => {
    const baseStyles = 'rounded-full font-medium inline-flex items-center justify-center';

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1 text-sm'
    };

    const variantStyles = {
      primary: 'bg-blue-100 text-blue-700',
      secondary: 'bg-gray-100 text-gray-700',
      outline: 'border border-gray-300 text-gray-700 bg-transparent',
      ghost: 'text-gray-600',
      danger: 'bg-red-100 text-red-700'
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const selectedComp = components.find(c => c.id === selectedComponent);

  const renderButton = (variant: ComponentVariant, state: ComponentState, size: ComponentSize) => (
    <button className={getButtonStyles(variant, state, size)}>
      {state === 'loading' ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading
        </>
      ) : (
        'Button'
      )}
    </button>
  );

  const renderInput = (variant: ComponentVariant, state: ComponentState, size: ComponentSize) => (
    <div className="relative">
      <input
        type="text"
        className={getInputStyles(variant, state, size)}
        placeholder="Input text..."
        disabled={state === 'disabled'}
        defaultValue={state === 'error' ? 'Invalid input' : state === 'success' ? 'Valid input' : ''}
      />
      {state === 'error' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      {state === 'success' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );

  const renderBadge = (variant: ComponentVariant, size: ComponentSize) => (
    <span className={getBadgeStyles(variant, size)}>Badge</span>
  );

  const renderCard = (variant: ComponentVariant, state: ComponentState, size: ComponentSize) => {
    const sizeStyles = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    };
    const stateStyles = {
      default: 'bg-white border border-gray-200',
      hover: 'bg-white border border-gray-300 shadow-md',
      active: 'bg-gray-50 border border-blue-500 shadow-lg',
      focus: 'bg-white border border-gray-200',
      disabled: 'bg-gray-50 border border-gray-200 opacity-50',
      loading: 'bg-white border border-gray-200',
      error: 'bg-white border border-gray-200',
      success: 'bg-white border border-gray-200'
    };

    return (
      <div className={`rounded-lg transition-all ${sizeStyles[size]} ${stateStyles[state]}`}>
        <h4 className="font-medium text-gray-800">Card Title</h4>
        <p className="text-sm text-gray-500 mt-1">Card content goes here</p>
      </div>
    );
  };

  const renderComponent = (variant: ComponentVariant, state: ComponentState, size: ComponentSize) => {
    switch (selectedComponent) {
      case 'button':
        return renderButton(variant, state, size);
      case 'input':
        return renderInput(variant, state, size);
      case 'badge':
        return renderBadge(variant, size);
      case 'card':
        return renderCard(variant, state, size);
      default:
        return null;
    }
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-800">Component Variant Matrix</h2>
        <p className="text-sm text-gray-600">Document all component states and variations</p>
      </div>

      {/* Component Selector */}
      <div className="flex gap-2 mb-3">
        {components.map(comp => (
          <button
            key={comp.id}
            onClick={() => setSelectedComponent(comp.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedComponent === comp.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {comp.name}
          </button>
        ))}
      </div>

      {selectedComp && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
            <h3 className="font-semibold text-gray-800">{selectedComp.name}</h3>
            <p className="text-sm text-gray-600">{selectedComp.description}</p>
          </div>

          {/* Variant x State Matrix */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 sticky left-0 bg-gray-50">
                      Variant / State
                    </th>
                    {selectedComp.states.map(state => (
                      <th
                        key={state}
                        className="text-center p-3 text-sm font-semibold text-gray-600 capitalize min-w-[140px]"
                        onMouseEnter={() => setHoveredState(state)}
                        onMouseLeave={() => setHoveredState(null)}
                      >
                        {state}
                        {hoveredState === state && (
                          <div className="text-xs text-gray-400 font-normal mt-1">
                            {state === 'default' && 'Initial state'}
                            {state === 'hover' && 'Mouse over'}
                            {state === 'active' && 'Being clicked'}
                            {state === 'focus' && 'Keyboard focus'}
                            {state === 'disabled' && 'Not interactive'}
                            {state === 'loading' && 'Processing'}
                            {state === 'error' && 'Invalid state'}
                            {state === 'success' && 'Valid state'}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedComp.variants.map(variant => (
                    <tr key={variant} className="border-t">
                      <td className="p-4 font-medium text-gray-700 capitalize sticky left-0 bg-white">
                        {variant}
                      </td>
                      {selectedComp.states.map(state => (
                        <td key={state} className="p-4 text-center">
                          <div className="flex justify-center">
                            {renderComponent(variant, state, 'md')}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Size Variants */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Size Variants</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-8">
                {selectedComp.sizes.map(size => (
                  <div key={size} className="text-center">
                    <div className="mb-2">
                      {renderComponent('primary', 'default', size)}
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Usage Guidelines</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-green-800 mb-2">✓ Do</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>Use primary variant for main actions</li>
                  <li>Maintain consistent sizing within context</li>
                  <li>Provide clear visual feedback for states</li>
                  <li>Use appropriate variant for the action type</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-medium text-red-800 mb-2">✗ Don&apos;t</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>Mix different sizes in the same context</li>
                  <li>Use danger variant for non-destructive actions</li>
                  <li>Disable without explaining why</li>
                  <li>Use loading state without actual processing</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentVariantMatrix;
