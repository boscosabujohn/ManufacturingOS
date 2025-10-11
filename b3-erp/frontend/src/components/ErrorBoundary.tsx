'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call the optional error handler
    this.props.onError?.(error, errorInfo);

    // Log to error reporting service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  copyErrorDetails = () => {
    const { error, errorInfo } = this.state;
    const errorDetails = {
      name: error?.name || 'Unknown Error',
      message: error?.message || 'An unexpected error occurred',
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
    };
    
    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
    alert('Exception details copied to clipboard!');
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, showDetails } = this.state;

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
              {/* Error Icon */}
              <div className="mb-8 relative">
                <div className="inline-block relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-yellow-100 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-orange-100 rounded-full animate-pulse"></div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center">
                    <AlertTriangle className="w-24 h-24 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Component Exception
                </h1>
                <p className="text-gray-600 text-lg mb-2">
                  A component encountered an unexpected exception.
                </p>
                <p className="text-gray-500 text-sm">
                  The error has been logged and we're working to fix it.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
                
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-yellow-600 hover:text-yellow-600 transition-all duration-200"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </a>
              </div>

              {/* Error Details Toggle */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={this.toggleDetails}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mx-auto"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {showDetails ? 'Hide' : 'Show'} Exception Details
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>

                {/* Error Details Panel */}
                {showDetails && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 text-left border border-gray-200 animate-fadeIn">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                      Exception Details
                    </h3>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Exception Type:</span>
                        <span className="text-yellow-700 font-semibold">
                          {error?.name || 'Unknown Exception'}
                        </span>
                      </div>
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Message:</span>
                        <span className="text-gray-800 break-all">
                          {error?.message || 'An unexpected exception occurred'}
                        </span>
                      </div>
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Timestamp:</span>
                        <span className="text-gray-800">{new Date().toISOString()}</span>
                      </div>
                      {error?.stack && (
                        <div className="flex flex-col border-b border-gray-200 pb-2">
                          <span className="text-gray-500 mb-2">Stack Trace:</span>
                          <pre className="text-gray-800 bg-gray-100 p-3 rounded overflow-x-auto text-[10px] leading-relaxed max-h-32 overflow-y-auto">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                      {errorInfo?.componentStack && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 mb-2">Component Stack:</span>
                          <pre className="text-gray-800 bg-gray-100 p-3 rounded overflow-x-auto text-[10px] leading-relaxed max-h-32 overflow-y-auto">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={this.copyErrorDetails}
                      className="mt-4 w-full px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-medium rounded transition-colors"
                    >
                      Copy Exception Details
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact{' '}
                <a
                  href="mailto:support@b3erp.com"
                  className="text-yellow-600 hover:text-yellow-800 font-medium underline"
                >
                  support@b3erp.com
                </a>
              </p>
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

    return this.props.children;
  }
}
