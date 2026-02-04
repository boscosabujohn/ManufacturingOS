'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Home, RefreshCw, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  const errorDetails = {
    name: error.name || 'Critical Error',
    message: error.message || 'A critical error occurred',
    digest: error.digest,
    timestamp: new Date().toISOString(),
    stack: error.stack,
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-red-50 flex items-center justify-center p-3">
          <div className="max-w-2xl w-full">
            {/* Main Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
              {/* Animated Error Icon */}
              <div className="mb-8 relative">
                <div className="inline-block relative">
                  {/* Animated circles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-purple-100 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Error Icon */}
                  <div className="relative z-10 flex items-center justify-center">
                    <Zap className="w-24 h-24 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Critical System Error
                </h1>
                <p className="text-gray-600 text-lg mb-2">
                  A critical error has occurred in the application.
                </p>
                <p className="text-gray-500 text-sm">
                  Please try refreshing the page or contact support if the issue persists.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8">
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload Application
                </button>
                
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-purple-600 hover:text-purple-600 transition-all duration-200"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </a>
              </div>

              {/* Error Details Toggle */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {showErrorDetails ? 'Hide' : 'Show'} Technical Details
                  {showErrorDetails ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>

                {/* Error Details Panel */}
                {showErrorDetails && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3 text-left border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-purple-500" />
                      Technical Details
                    </h3>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Error Name:</span>
                        <span className="text-purple-600 font-semibold">{errorDetails.name}</span>
                      </div>
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Error Message:</span>
                        <span className="text-gray-800 break-all">{errorDetails.message}</span>
                      </div>
                      {errorDetails.digest && (
                        <div className="flex border-b border-gray-200 pb-2">
                          <span className="text-gray-500 w-32 flex-shrink-0">Error Digest:</span>
                          <span className="text-gray-800 break-all">{errorDetails.digest}</span>
                        </div>
                      )}
                      <div className="flex border-b border-gray-200 pb-2">
                        <span className="text-gray-500 w-32 flex-shrink-0">Timestamp:</span>
                        <span className="text-gray-800">{errorDetails.timestamp}</span>
                      </div>
                      {errorDetails.stack && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 mb-2">Stack Trace:</span>
                          <pre className="text-gray-800 bg-gray-100 p-3 rounded overflow-x-auto text-[10px] leading-relaxed max-h-48 overflow-y-auto">
                            {errorDetails.stack}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Copy Error Details Button */}
                    <button
                      onClick={() => {
                        const errorInfo = {
                          name: errorDetails.name,
                          message: errorDetails.message,
                          digest: errorDetails.digest,
                          timestamp: errorDetails.timestamp,
                          stack: errorDetails.stack,
                        };
                        navigator.clipboard.writeText(JSON.stringify(errorInfo, null, 2));
                        alert('Error details copied to clipboard!');
                      }}
                      className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
                    >
                      Copy Error Details
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Critical issue? Contact{' '}
                <a href="mailto:support@b3erp.com" className="text-purple-600 hover:text-purple-800 font-medium underline">
                  support@b3erp.com
                </a>
                {' '}immediately
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
