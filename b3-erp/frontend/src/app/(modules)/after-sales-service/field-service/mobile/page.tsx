'use client';

import { useState } from 'react';
import { Smartphone, Download, QrCode, CheckCircle, Clock, MapPin, Tool, Camera, FileText, MessageSquare, Star, Battery, Wifi, RefreshCw, PlayCircle, Settings, Users, TrendingUp, Zap, Package, Shield } from 'lucide-react';

interface AppFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'core' | 'productivity' | 'communication' | 'reporting';
  available: boolean;
}

interface AppStats {
  totalDownloads: number;
  activeUsers: number;
  avgRating: number;
  totalReviews: number;
  lastUpdate: string;
  version: string;
}

const appFeatures: AppFeature[] = [
  {
    id: '1',
    name: 'Job Management',
    description: 'View, accept, and manage service jobs in real-time',
    icon: Tool,
    category: 'core',
    available: true
  },
  {
    id: '2',
    name: 'GPS Navigation',
    description: 'Turn-by-turn navigation to customer locations',
    icon: MapPin,
    category: 'core',
    available: true
  },
  {
    id: '3',
    name: 'Time Tracking',
    description: 'Clock in/out and track work hours automatically',
    icon: Clock,
    category: 'productivity',
    available: true
  },
  {
    id: '4',
    name: 'Parts Inventory',
    description: 'Check parts availability and request requisitions',
    icon: Package,
    category: 'core',
    available: true
  },
  {
    id: '5',
    name: 'Photo Documentation',
    description: 'Capture before/after photos and upload to job records',
    icon: Camera,
    category: 'reporting',
    available: true
  },
  {
    id: '6',
    name: 'Digital Signature',
    description: 'Collect customer signatures for job completion',
    icon: FileText,
    category: 'core',
    available: true
  },
  {
    id: '7',
    name: 'Offline Mode',
    description: 'Continue working without internet, sync when online',
    icon: Wifi,
    category: 'core',
    available: true
  },
  {
    id: '8',
    name: 'Customer Chat',
    description: 'Direct messaging with customers and support team',
    icon: MessageSquare,
    category: 'communication',
    available: true
  },
  {
    id: '9',
    name: 'Service History',
    description: 'Access complete customer and equipment service history',
    icon: FileText,
    category: 'core',
    available: true
  },
  {
    id: '10',
    name: 'Knowledge Base',
    description: 'Access troubleshooting guides and product manuals',
    icon: FileText,
    category: 'productivity',
    available: true
  },
  {
    id: '11',
    name: 'Feedback & Rating',
    description: 'Collect customer feedback and service ratings',
    icon: Star,
    category: 'reporting',
    available: true
  },
  {
    id: '12',
    name: 'Voice Commands',
    description: 'Hands-free operation with voice control',
    icon: PlayCircle,
    category: 'productivity',
    available: false
  },
  {
    id: '13',
    name: 'AR Assistance',
    description: 'Augmented reality for complex repairs (Coming Soon)',
    icon: Camera,
    category: 'productivity',
    available: false
  },
  {
    id: '14',
    name: 'Expense Tracking',
    description: 'Log expenses and submit reimbursement claims',
    icon: FileText,
    category: 'reporting',
    available: true
  },
  {
    id: '15',
    name: 'Performance Dashboard',
    description: 'View personal KPIs and performance metrics',
    icon: TrendingUp,
    category: 'reporting',
    available: true
  },
  {
    id: '16',
    name: 'Safety Checklist',
    description: 'Pre-job safety protocols and hazard reporting',
    icon: Shield,
    category: 'core',
    available: true
  }
];

const appStats: AppStats = {
  totalDownloads: 150,
  activeUsers: 142,
  avgRating: 4.7,
  totalReviews: 98,
  lastUpdate: '2025-10-15',
  version: '2.5.1'
};

export default function MobileAppPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showQRCode, setShowQRCode] = useState(false);

  const filteredFeatures = selectedCategory === 'all'
    ? appFeatures
    : appFeatures.filter(f => f.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-700';
      case 'productivity': return 'bg-purple-100 text-purple-700';
      case 'communication': return 'bg-green-100 text-green-700';
      case 'reporting': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Smartphone className="h-8 w-8 text-emerald-600" />
          Technician Mobile App
        </h1>
        <p className="text-gray-600 mt-1">Download and manage the field service mobile application</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{appStats.totalDownloads}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{appStats.activeUsers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2 flex items-center gap-1">
                {appStats.avgRating}
                <Star className="h-6 w-6 fill-yellow-600 text-yellow-600" />
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviews</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{appStats.totalReviews}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Version</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{appStats.version}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Update</p>
              <p className="text-lg font-bold text-gray-900 mt-2">
                {new Date(appStats.lastUpdate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <RefreshCw className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-8 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <Smartphone className="h-16 w-16 text-emerald-600" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">Download Technician App</h2>
              <p className="text-emerald-100 mb-4 max-w-2xl">
                Empower your field technicians with our mobile app. Manage jobs, track time, access customer information, and provide excellent service on the go.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">iOS & Android</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <Wifi className="h-5 w-5" />
                  <span className="font-medium">Offline Capable</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <Battery className="h-5 w-5" />
                  <span className="font-medium">Battery Optimized</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowQRCode(true)}
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-md"
            >
              <QrCode className="h-5 w-5" />
              Show QR Code
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-md">
              <Download className="h-5 w-5" />
              Download for iOS
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-md">
              <Download className="h-5 w-5" />
              Download for Android
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Features
            </button>
            <button
              onClick={() => setSelectedCategory('core')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'core'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Core
            </button>
            <button
              onClick={() => setSelectedCategory('productivity')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'productivity'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Productivity
            </button>
            <button
              onClick={() => setSelectedCategory('communication')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'communication'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Communication
            </button>
            <button
              onClick={() => setSelectedCategory('reporting')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'reporting'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reporting
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">App Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all ${
                  !feature.available ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    feature.category === 'core' ? 'bg-blue-100' :
                    feature.category === 'productivity' ? 'bg-purple-100' :
                    feature.category === 'communication' ? 'bg-green-100' :
                    'bg-orange-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      feature.category === 'core' ? 'text-blue-600' :
                      feature.category === 'productivity' ? 'text-purple-600' :
                      feature.category === 'communication' ? 'text-green-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  {feature.available ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(feature.category)}`}>
                    {feature.category.toUpperCase()}
                  </span>
                  {!feature.available && (
                    <span className="text-xs font-medium text-yellow-600">Coming Soon</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* App Screenshots Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">App Screenshots</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Job Dashboard', color: 'from-blue-400 to-blue-600' },
            { title: 'Navigation', color: 'from-green-400 to-green-600' },
            { title: 'Parts Inventory', color: 'from-purple-400 to-purple-600' },
            { title: 'Customer Signature', color: 'from-orange-400 to-orange-600' }
          ].map((screen, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-900 rounded-2xl p-4 shadow-xl">
                <div className={`bg-gradient-to-br ${screen.color} rounded-lg aspect-[9/16] flex items-center justify-center`}>
                  <div className="text-center text-white">
                    <Smartphone className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium opacity-75">{screen.title}</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-3 font-medium">{screen.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* App Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Requirements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-600" />
            System Requirements
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">iOS Version</span>
              <span className="text-sm font-medium text-gray-900">13.0 or later</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Android Version</span>
              <span className="text-sm font-medium text-gray-900">8.0 (Oreo) or later</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Storage Required</span>
              <span className="text-sm font-medium text-gray-900">~250 MB</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">RAM Required</span>
              <span className="text-sm font-medium text-gray-900">2 GB minimum</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">GPS Required</span>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Yes
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Camera Required</span>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Yes
              </span>
            </div>
          </div>
        </div>

        {/* What's New */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-emerald-600" />
            What's New in v{appStats.version}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Enhanced Offline Mode</p>
                <p className="text-xs text-gray-600">Work seamlessly without internet connectivity</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Performance Improvements</p>
                <p className="text-xs text-gray-600">50% faster app launch and sync times</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Battery Optimization</p>
                <p className="text-xs text-gray-600">Reduced battery consumption by 30%</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">New Safety Features</p>
                <p className="text-xs text-gray-600">Pre-job safety checklists and hazard reporting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">UI/UX Enhancements</p>
                <p className="text-xs text-gray-600">Redesigned job dashboard with better navigation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Bug Fixes</p>
                <p className="text-xs text-gray-600">Various bug fixes and stability improvements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scan to Download</h2>
            <p className="text-gray-600 mb-6">Scan this QR code with your mobile device to download the app</p>
            
            {/* QR Code Placeholder */}
            <div className="bg-white border-4 border-gray-200 rounded-lg p-8 mb-6 inline-block">
              <div className="w-64 h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-32 w-32 text-emerald-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">QR Code</p>
                  <p className="text-xs text-gray-500 mt-2">Scan with camera app</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Smartphone className="h-4 w-4" />
                <span>iOS & Android</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Download className="h-4 w-4" />
                <span>Free Download</span>
              </div>
            </div>

            <button
              onClick={() => setShowQRCode(false)}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
