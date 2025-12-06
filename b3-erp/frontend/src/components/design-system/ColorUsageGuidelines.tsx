'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  AlertCircle,
  Clock,
  Zap,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Pause,
  Square,
  Eye,
  EyeOff,
} from 'lucide-react';

// Types
type SemanticColor = 'success' | 'warning' | 'error' | 'info' | 'neutral';
type UsageContext = 'status' | 'feedback' | 'action' | 'data';

interface ColorGuideline {
  color: SemanticColor;
  name: string;
  hex: string;
  bgHex: string;
  textHex: string;
  borderHex: string;
  description: string;
  whenToUse: string[];
  whenNotToUse: string[];
  examples: {
    context: UsageContext;
    description: string;
    icon: React.ReactNode;
  }[];
  accessibilityNote: string;
}

interface ColorUsageGuidelinesProps {
  className?: string;
}

// Color guidelines data
const colorGuidelines: ColorGuideline[] = [
  {
    color: 'success',
    name: 'Success / Green',
    hex: '#22c55e',
    bgHex: '#dcfce7',
    textHex: '#166534',
    borderHex: '#86efac',
    description: 'Indicates successful completion, positive states, or affirmative actions.',
    whenToUse: [
      'Completed tasks or processes',
      'Successful form submissions',
      'Positive metrics or KPIs',
      'Active/online status indicators',
      'Approval confirmations',
      'Quality checks passed',
      'Goals achieved or exceeded',
    ],
    whenNotToUse: [
      'Primary actions that don\'t indicate success',
      'Navigation elements',
      'Neutral information',
      'Decorative purposes only',
    ],
    examples: [
      { context: 'status', description: 'Machine Online', icon: <CheckCircle className="w-5 h-5" /> },
      { context: 'feedback', description: 'Order Completed', icon: <CheckCircle className="w-5 h-5" /> },
      { context: 'data', description: '+15% Efficiency', icon: <TrendingUp className="w-5 h-5" /> },
      { context: 'action', description: 'Approve', icon: <CheckCircle className="w-5 h-5" /> },
    ],
    accessibilityNote: 'Ensure 4.5:1 contrast ratio. Never rely solely on color—use icons or text labels.',
  },
  {
    color: 'warning',
    name: 'Warning / Amber',
    hex: '#f59e0b',
    bgHex: '#fef3c7',
    textHex: '#92400e',
    borderHex: '#fcd34d',
    description: 'Alerts users to potential issues requiring attention but not immediate action.',
    whenToUse: [
      'Low inventory warnings',
      'Approaching deadlines',
      'Degraded performance',
      'Pending actions required',
      'Quality deviations within tolerance',
      'Maintenance due soon',
      'Partially completed states',
    ],
    whenNotToUse: [
      'Critical errors requiring immediate action',
      'Informational messages',
      'Success states',
      'Primary UI elements',
    ],
    examples: [
      { context: 'status', description: 'Low Stock', icon: <AlertTriangle className="w-5 h-5" /> },
      { context: 'feedback', description: 'Deadline Approaching', icon: <Clock className="w-5 h-5" /> },
      { context: 'data', description: 'Near Threshold', icon: <AlertCircle className="w-5 h-5" /> },
      { context: 'action', description: 'Review Required', icon: <Eye className="w-5 h-5" /> },
    ],
    accessibilityNote: 'Use darker amber for text. Pair with warning icons for clarity.',
  },
  {
    color: 'error',
    name: 'Error / Red',
    hex: '#ef4444',
    bgHex: '#fee2e2',
    textHex: '#991b1b',
    borderHex: '#fca5a5',
    description: 'Indicates critical issues, failures, or destructive actions requiring immediate attention.',
    whenToUse: [
      'System errors and failures',
      'Form validation errors',
      'Machine breakdowns',
      'Quality failures',
      'Destructive actions (delete, cancel)',
      'Critical alerts',
      'Blocked or stopped processes',
    ],
    whenNotToUse: [
      'Warnings that don\'t require immediate action',
      'Negative trends that aren\'t critical',
      'Decorative purposes',
      'Non-critical notifications',
    ],
    examples: [
      { context: 'status', description: 'Machine Down', icon: <XCircle className="w-5 h-5" /> },
      { context: 'feedback', description: 'Validation Failed', icon: <AlertCircle className="w-5 h-5" /> },
      { context: 'data', description: '-25% Below Target', icon: <TrendingDown className="w-5 h-5" /> },
      { context: 'action', description: 'Delete', icon: <XCircle className="w-5 h-5" /> },
    ],
    accessibilityNote: 'Always pair with descriptive text. Provide recovery actions where possible.',
  },
  {
    color: 'info',
    name: 'Info / Blue',
    hex: '#3b82f6',
    bgHex: '#dbeafe',
    textHex: '#1e40af',
    borderHex: '#93c5fd',
    description: 'Provides neutral information, guidance, or context without urgency.',
    whenToUse: [
      'Informational messages',
      'Help text and tooltips',
      'Progress indicators',
      'New feature announcements',
      'Contextual guidance',
      'Links and navigation hints',
      'Selected/active states',
    ],
    whenNotToUse: [
      'Success confirmations',
      'Warnings or errors',
      'Primary call-to-action buttons',
      'When urgency needs to be conveyed',
    ],
    examples: [
      { context: 'status', description: 'In Progress', icon: <Play className="w-5 h-5" /> },
      { context: 'feedback', description: 'Tip: Try this', icon: <Info className="w-5 h-5" /> },
      { context: 'data', description: '5 Active Jobs', icon: <Zap className="w-5 h-5" /> },
      { context: 'action', description: 'Learn More', icon: <Info className="w-5 h-5" /> },
    ],
    accessibilityNote: 'Good default for interactive elements. Ensure links are distinguishable.',
  },
  {
    color: 'neutral',
    name: 'Neutral / Gray',
    hex: '#6b7280',
    bgHex: '#f3f4f6',
    textHex: '#374151',
    borderHex: '#d1d5db',
    description: 'Used for secondary information, disabled states, or when no semantic meaning is needed.',
    whenToUse: [
      'Disabled or inactive states',
      'Secondary text and labels',
      'Borders and dividers',
      'Background surfaces',
      'Placeholder text',
      'Paused or idle states',
      'Archived or historical items',
    ],
    whenNotToUse: [
      'When semantic meaning is important',
      'Primary content that needs attention',
      'Active controls',
      'Important status indicators',
    ],
    examples: [
      { context: 'status', description: 'Offline', icon: <EyeOff className="w-5 h-5" /> },
      { context: 'feedback', description: 'No Changes', icon: <Minus className="w-5 h-5" /> },
      { context: 'data', description: 'N/A', icon: <Minus className="w-5 h-5" /> },
      { context: 'action', description: 'Skip', icon: <Square className="w-5 h-5" /> },
    ],
    accessibilityNote: 'Ensure sufficient contrast (4.5:1) for text. Don\'t use for important information.',
  },
];

// Context labels
const contextLabels: Record<UsageContext, string> = {
  status: 'Status Indicator',
  feedback: 'User Feedback',
  action: 'Action Button',
  data: 'Data Display',
};

export function ColorUsageGuidelines({ className = '' }: ColorUsageGuidelinesProps) {
  const [selectedColor, setSelectedColor] = useState<SemanticColor | null>(null);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const getColorClasses = (color: SemanticColor) => {
    const classes = {
      success: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
        badge: 'bg-green-500',
        light: 'bg-green-50',
      },
      warning: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-300',
        badge: 'bg-amber-500',
        light: 'bg-amber-50',
      },
      error: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        badge: 'bg-red-500',
        light: 'bg-red-50',
      },
      info: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300',
        badge: 'bg-blue-500',
        light: 'bg-blue-50',
      },
      neutral: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
        badge: 'bg-gray-500',
        light: 'bg-gray-50',
      },
    };
    return classes[color];
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Color Usage Guidelines</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Semantic color definitions for consistent and accessible UI design
        </p>

        {/* Controls */}
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showAccessibility}
              onChange={(e) => setShowAccessibility(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Show accessibility notes</span>
          </label>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Quick Reference</h3>
        <div className="grid grid-cols-5 gap-4">
          {colorGuidelines.map((guideline) => {
            const classes = getColorClasses(guideline.color);
            const isSelected = selectedColor === guideline.color;

            return (
              <button
                key={guideline.color}
                onClick={() => setSelectedColor(isSelected ? null : guideline.color)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `${classes.border} ${classes.light} ring-2 ring-offset-2`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${classes.badge} mx-auto mb-2`} />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {guideline.color.charAt(0).toUpperCase() + guideline.color.slice(1)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {guideline.hex}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Guidelines */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {colorGuidelines
          .filter((g) => !selectedColor || g.color === selectedColor)
          .map((guideline) => {
            const classes = getColorClasses(guideline.color);

            return (
              <div key={guideline.color} className="p-6">
                {/* Color Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${classes.badge} flex items-center justify-center`}
                    >
                      {guideline.color === 'success' && <CheckCircle className="w-6 h-6 text-white" />}
                      {guideline.color === 'warning' && <AlertTriangle className="w-6 h-6 text-white" />}
                      {guideline.color === 'error' && <XCircle className="w-6 h-6 text-white" />}
                      {guideline.color === 'info' && <Info className="w-6 h-6 text-white" />}
                      {guideline.color === 'neutral' && <Minus className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {guideline.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {guideline.description}
                      </p>
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex gap-2">
                    <div className="text-center">
                      <div
                        className="w-16 h-10 rounded border border-gray-300"
                        style={{ backgroundColor: guideline.hex }}
                      />
                      <span className="text-xs text-gray-500">Base</span>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-16 h-10 rounded border border-gray-300"
                        style={{ backgroundColor: guideline.bgHex }}
                      />
                      <span className="text-xs text-gray-500">Background</span>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-16 h-10 rounded border border-gray-300 flex items-center justify-center"
                        style={{ backgroundColor: guideline.bgHex, color: guideline.textHex }}
                      >
                        <span className="text-xs font-medium">Aa</span>
                      </div>
                      <span className="text-xs text-gray-500">Text</span>
                    </div>
                  </div>
                </div>

                {/* Usage Guidelines */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      When to Use
                    </h4>
                    <ul className="space-y-1">
                      {guideline.whenToUse.map((use, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4" />
                      When NOT to Use
                    </h4>
                    <ul className="space-y-1">
                      {guideline.whenNotToUse.map((use, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Examples */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Examples</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {guideline.examples.map((example, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${classes.bg} ${classes.border} border`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={classes.text}>{example.icon}</span>
                          <span className={`text-sm font-medium ${classes.text}`}>
                            {example.description}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {contextLabels[example.context]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accessibility Note */}
                {showAccessibility && (
                  <div className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Shield className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Accessibility:
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                        {guideline.accessibilityNote}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Color Combinations */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Common Color Combinations
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Traffic Light Status */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Traffic Light Status
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                <CheckCircle className="w-3 h-3" /> Good
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">
                <AlertTriangle className="w-3 h-3" /> Warning
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                <XCircle className="w-3 h-3" /> Critical
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Use for: Machine health, KPI status, alert priorities
            </p>
          </div>

          {/* Progress States */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Progress States
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                <Pause className="w-3 h-3" /> Pending
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                <Play className="w-3 h-3" /> Active
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                <CheckCircle className="w-3 h-3" /> Done
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Use for: Order status, task progress, workflow stages
            </p>
          </div>

          {/* Trend Indicators */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Trend Indicators
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                <TrendingUp className="w-3 h-3" /> +12%
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                <Minus className="w-3 h-3" /> 0%
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                <TrendingDown className="w-3 h-3" /> -8%
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Use for: KPI changes, efficiency metrics, quality scores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { SemanticColor, UsageContext, ColorGuideline, ColorUsageGuidelinesProps };
