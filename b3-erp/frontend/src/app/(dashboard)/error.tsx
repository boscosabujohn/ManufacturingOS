'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw, ChevronDown, ChevronUp, AlertCircle, ArrowLeft } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error:', error);
  }, [error]);

  const errorDetails = {
    name: error.name || 'Unknown Error',
    message: error.message || 'An unexpected error occurred',
    digest: error.digest,
    timestamp: new Date().toISOString(),
    stack: error.stack,
    component: 'Dashboard Module',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-3">
      <div className="max-w-2xl w-full">
        {/* Main Error Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Animated Error Icon */}
          <div className="mb-8 relative">
            <div className="inline-block relative">
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-orange-100 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-red-100 rounded-full animate-pulse"></div>
              </div>
              
              {/* Error Icon */}
              <div className="relative z-10 flex items-center justify-center">
                <AlertTriangle className="w-24 h-24 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Module Error Occurred
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              We encountered an issue while loading this module.
            </p>
            <p className="text-gray-500 text-sm">
              This could be due to a temporary glitch or network issue.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-orange-600 hover:text-orange-600 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          {/* Quick Recovery Steps */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              Quick Recovery Steps:
            </p>
            <div className="grid gap-3 text-left">
              <div className="flex items-start p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Reload the module</strong> - Click "Try Again" to retry loading
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Check your connection</strong> - Ensure you have stable internet
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Try another module</strong> - Go back to dashboard and access a different module
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Details Toggle */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              {showErrorDetails ? 'Hide' : 'Show'} Exception Details
              {showErrorDetails ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </button>

            {/* Error Details Panel */}
            {showErrorDetails && (
              <div className="mt-4 bg-gray-50 rounded-lg p-3 text-left border border-gray-200 animate-fadeIn">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                  Exception Details
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex border-b border-gray-200 pb-2">
                    <span className="text-gray-500 w-32 flex-shrink-0">Exception Type:</span>
                    <span className="text-orange-600 font-semibold">{errorDetails.name}</span>
                  </div>
                  <div className="flex border-b border-gray-200 pb-2">
                    <span className="text-gray-500 w-32 flex-shrink-0">Exception Message:</span>
                    <span className="text-gray-800 break-all">{errorDetails.message}</span>
                  </div>
                  <div className="flex border-b border-gray-200 pb-2">
                    <span className="text-gray-500 w-32 flex-shrink-0">Component:</span>
                    <span className="text-gray-800">{errorDetails.component}</span>
                  </div>
                  {errorDetails.digest && (
                    <div className="flex border-b border-gray-200 pb-2">
                      <span className="text-gray-500 w-32 flex-shrink-0">Error ID:</span>
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

                {/* Copy Exception Details Button */}
                <button
                  onClick={() => {
                    const exceptionInfo = {
                      type: errorDetails.name,
                      message: errorDetails.message,
                      component: errorDetails.component,
                      errorId: errorDetails.digest,
                      timestamp: errorDetails.timestamp,
                      stackTrace: errorDetails.stack,
                    };
                    navigator.clipboard.writeText(JSON.stringify(exceptionInfo, null, 2));
                    alert('Exception details copied to clipboard!');
                  }}
                  className="mt-4 w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-medium rounded transition-colors"
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
            Issue persists? Contact{' '}
            <a href="mailto:support@b3erp.com" className="text-orange-600 hover:text-orange-800 font-medium underline">
              support@b3erp.com
            </a>
            {errorDetails.digest && (
              <>
                {' '}with error ID:{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                  {errorDetails.digest}
                </code>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Add animation styles */}
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
