'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function NotFound() {
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const errorDetails = {
    statusCode: 404,
    message: 'Page Not Found',
    timestamp: new Date().toISOString(),
    path: typeof window !== 'undefined' ? window.location.pathname : '/unknown',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
  };

  const suggestedLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'CRM', href: '/crm', icon: Search },
    { name: 'Sales', href: '/sales', icon: Search },
    { name: 'Inventory', href: '/inventory', icon: Search },
    { name: 'Production', href: '/production', icon: Search },
    { name: 'Finance', href: '/finance', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Error Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Animated 404 Icon */}
          <div className="mb-8 relative">
            <div className="inline-block relative">
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-blue-100 rounded-full animate-ping opacity-20"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full animate-pulse"></div>
              </div>
              
              {/* 404 Text */}
              <div className="relative z-10 flex items-center justify-center">
                <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  🚀
                </h1>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              🚀 You're Exploring New Territory!
            </h2>
            <p className="text-gray-600 text-lg mb-2">
              This page is on our roadmap - great things are coming soon!
            </p>
            <p className="text-gray-500 text-sm">
              We're building an amazing ERP system, one feature at a time. 🎯
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Motivational Features Coming Soon */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600 mb-4 font-medium">
              💡 What's in Development:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="flex items-start p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
                  ✨
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-700 font-semibold">
                    New Features
                  </p>
                  <p className="text-xs text-gray-600">
                    We're constantly adding new modules and capabilities
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
                  🎨
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-700 font-semibold">
                    Better UI/UX
                  </p>
                  <p className="text-xs text-gray-600">
                    Beautiful interfaces coming to all modules
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
                  ⚡
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-700 font-semibold">
                    Performance
                  </p>
                  <p className="text-xs text-gray-600">
                    Lightning-fast response times
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
                  🔒
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-700 font-semibold">
                    Security
                  </p>
                  <p className="text-xs text-gray-600">
                    Enterprise-grade protection
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Details Toggle */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowErrorDetails(!showErrorDetails)}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mx-auto"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              {showErrorDetails ? 'Hide' : 'Show'} Developer Info
              {showErrorDetails ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              )}
            </button>

            {/* Error Details Panel */}
            {showErrorDetails && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4 text-left border border-gray-200 animate-fadeIn">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-blue-500" />
                  Developer Information
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex border-b border-gray-200 pb-2">
                    <span className="text-gray-500 w-32 flex-shrink-0">Status Code:</span>
                    <span className="text-blue-600 font-semibold">404 - Not Found</span>
                  </div>
                  <div className="flex border-b border-gray-200 pb-2">
                    <span className="text-gray-500 w-32 flex-shrink-0">Message:</span>
                    <span className="text-gray-800">Page under development</span>
                  </div>
                  <div className="flex border-b border-gray-200 pb-2">
                    <span className="text-gray-500 w-32 flex-shrink-0">Requested Path:</span>
                    <span className="text-gray-800 break-all">{errorDetails.path}</span>
                  </div>
                  <div className="flex border-b border-gray-200 pb-2">
                    <span className="text-gray-500 w-32 flex-shrink-0">Timestamp:</span>
                    <span className="text-gray-800">{errorDetails.timestamp}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32 flex-shrink-0">Note:</span>
                    <span className="text-gray-800 text-[10px] leading-relaxed">
                      This is a development environment. The page you requested will be available soon!
                    </span>
                  </div>
                </div>

                {/* Copy Error Details Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
                    alert('Developer info copied to clipboard!');
                  }}
                  className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded transition-colors"
                >
                  Copy Developer Info
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Building something amazing? We'd love to hear your ideas!{' '}
            <a href="mailto:support@b3erp.com" className="text-blue-600 hover:text-blue-800 font-medium underline">
              Contact us
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            🚀 Every great feature starts with a single request
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
