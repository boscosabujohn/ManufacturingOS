'use client';

import React, { useState } from 'react';
import {
  Palette,
  Layout,
  Type,
  Image,
  Settings,
  Sun,
  Moon,
  Eye,
  Paintbrush,
  Grid,
  BookOpen,
} from 'lucide-react';
import { DesignTokens } from '@/components/design-system/DesignTokens';
import { ComponentVariantMatrix } from '@/components/design-system/ComponentVariantMatrix';
import { IconUsageGuide } from '@/components/design-system/IconUsageGuide';
import { ColorUsageGuidelines } from '@/components/design-system/ColorUsageGuidelines';
import { ThemeSwitcher } from '@/components/design-system/ThemeSwitcher';
import { BrandingCustomizer } from '@/components/design-system/BrandingCustomizer';

type TabId = 'tokens' | 'components' | 'icons' | 'colors' | 'theme' | 'branding';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'tokens',
    label: 'Design Tokens',
    icon: <Layout className="w-5 h-5" />,
    description: 'Color, spacing, typography, and shadow variables',
  },
  {
    id: 'components',
    label: 'Component Matrix',
    icon: <Grid className="w-5 h-5" />,
    description: 'Interactive component states and variants',
  },
  {
    id: 'icons',
    label: 'Icon Guide',
    icon: <Image className="w-5 h-5" />,
    description: 'Icon sizes and usage guidelines',
  },
  {
    id: 'colors',
    label: 'Color Guidelines',
    icon: <Palette className="w-5 h-5" />,
    description: 'Semantic color usage and accessibility',
  },
  {
    id: 'theme',
    label: 'Theme Settings',
    icon: <Sun className="w-5 h-5" />,
    description: 'Light/dark mode and color themes',
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: <Paintbrush className="w-5 h-5" />,
    description: 'Logo and company customization',
  },
];

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<TabId>('tokens');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Design System
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Documentation and customization for ManufacturingOS UI
                  </p>
                </div>
              </div>
              <ThemeSwitcher variant="dropdown" />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto pb-2 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Description */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {tabs.find((t) => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Content */}
        {activeTab === 'tokens' && <DesignTokens />}
        {activeTab === 'components' && <ComponentVariantMatrix />}
        {activeTab === 'icons' && <IconUsageGuide />}
        {activeTab === 'colors' && <ColorUsageGuidelines />}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            {/* Theme Settings Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Theme Configuration
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Customize the appearance of the application. Changes are saved automatically and persist across sessions.
              </p>
              <ThemeSwitcher variant="inline" />
            </div>

            {/* Theme Preview Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Theme Preview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Light Theme Preview */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-3 py-2 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Light Mode</span>
                  </div>
                  <div className="bg-white p-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="flex gap-2 mt-4">
                        <div className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded">
                          Button
                        </div>
                        <div className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded">
                          Secondary
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dark Theme Preview */}
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 px-3 py-2 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Dark Mode</span>
                  </div>
                  <div className="bg-gray-900 p-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                      <div className="flex gap-2 mt-4">
                        <div className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded">
                          Button
                        </div>
                        <div className="px-3 py-1.5 border border-gray-600 text-gray-300 text-xs rounded">
                          Secondary
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Accessibility Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      High Contrast Mode
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Increases contrast ratios for better readability. Meets WCAG AAA guidelines.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      System Preference Detection
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically matches your operating system's light/dark preference.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Persistent Preferences
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Theme settings are saved to localStorage and restored on each visit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'branding' && (
          <BrandingCustomizer
            onBrandingChange={(branding) => {
              console.log('Branding updated:', branding);
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            ManufacturingOS Design System v1.0
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">
              Documentation
            </a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">
              Changelog
            </a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white">
              Figma Library
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
