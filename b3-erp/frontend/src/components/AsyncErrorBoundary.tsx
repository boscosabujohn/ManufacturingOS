'use client';

import { Component, ReactNode } from 'react';
import { Loader2, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isLoading: boolean;
  showDetails: boolean;
}

/**
 * AsyncErrorBoundary - Handles async errors and loading states
 * Useful for components that fetch data or perform async operations
 */
export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isLoading: false,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, isLoading: false };
  }

  componentDidCatch(error: Error) {
    console.error('AsyncErrorBoundary caught an error:', error);
    this.props.onError?.(error);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      isLoading: true,
      showDetails: false,
    });

    // Simulate retry delay
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 500);
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  copyErrorDetails = () => {
    const { error } = this.state;
    const errorDetails = {
      name: error?.name || 'Unknown Error',
      message: error?.message || 'An async operation failed',
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      type: 'Async Exception',
    };
    
    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
    alert('Async exception details copied to clipboard!');
  };

  render() {
    const { children, loadingFallback, errorFallback } = this.props;
    const { hasError, error, isLoading, showDetails } = this.state;

    // Loading state
    if (isLoading) {
      if (loadingFallback) {
        return loadingFallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Error state
    if (hasError) {
      if (errorFallback) {
        return errorFallback;
      }

      return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 my-4">
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              {/* Error Icon */}
              <div className="mb-3 relative">
                <div className="inline-block relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center">
                    <AlertCircle className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-3">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Async Operation Failed
                </h3>
                <p className="text-gray-600 mb-1">
                  An error occurred while loading data or performing an operation.
                </p>
                <p className="text-gray-500 text-sm">
                  This might be a temporary network issue.
                </p>
              </div>

              {/* Retry Button */}
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-3"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retry Operation
              </button>

              {/* Error Details Toggle */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={this.toggleDetails}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {showDetails ? 'Hide' : 'Show'} Exception Details
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>

                {showDetails && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3 text-left border border-gray-200 animate-fadeIn">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
                      Async Exception Details
                    </h4>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Exception Type:</span>
                        <span className="text-blue-600 font-semibold">
                          {error?.name || 'AsyncError'}
                        </span>
                      </div>
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Message:</span>
                        <span className="text-gray-800 break-all">
                          {error?.message || 'Async operation failed'}
                        </span>
                      </div>
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Timestamp:</span>
                        <span className="text-gray-800">{new Date().toISOString()}</span>
                      </div>
                      {error?.stack && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 mb-2">Stack Trace:</span>
                          <pre className="text-gray-800 bg-gray-100 p-3 rounded overflow-x-auto text-[10px] leading-relaxed max-h-32 overflow-y-auto">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={this.copyErrorDetails}
                      className="mt-4 w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded transition-colors"
                    >
                      Copy Exception Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <style jsx global>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out;
            }
          `}</style>
        </div>
      );
    }

    return children;
  }
}
