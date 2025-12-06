'use client';

import React, { useState } from 'react';

// Design Token Types
export interface ColorToken {
  name: string;
  variable: string;
  value: string;
  description: string;
  usage: string[];
}

export interface SpacingToken {
  name: string;
  variable: string;
  value: string;
  pixels: number;
}

export interface TypographyToken {
  name: string;
  variable: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  usage: string;
}

export interface ShadowToken {
  name: string;
  variable: string;
  value: string;
  usage: string;
}

export interface RadiusToken {
  name: string;
  variable: string;
  value: string;
}

// Design Tokens Data
export const colorTokens: { category: string; colors: ColorToken[] }[] = [
  {
    category: 'Primary',
    colors: [
      { name: 'Primary 50', variable: '--color-primary-50', value: '#eff6ff', description: 'Lightest primary', usage: ['Backgrounds', 'Hover states'] },
      { name: 'Primary 100', variable: '--color-primary-100', value: '#dbeafe', description: 'Very light primary', usage: ['Card backgrounds', 'Selected states'] },
      { name: 'Primary 200', variable: '--color-primary-200', value: '#bfdbfe', description: 'Light primary', usage: ['Borders', 'Dividers'] },
      { name: 'Primary 500', variable: '--color-primary-500', value: '#3b82f6', description: 'Base primary', usage: ['Buttons', 'Links', 'Icons'] },
      { name: 'Primary 600', variable: '--color-primary-600', value: '#2563eb', description: 'Dark primary', usage: ['Button hover', 'Active states'] },
      { name: 'Primary 700', variable: '--color-primary-700', value: '#1d4ed8', description: 'Darker primary', usage: ['Pressed states'] },
    ]
  },
  {
    category: 'Semantic',
    colors: [
      { name: 'Success', variable: '--color-success', value: '#22c55e', description: 'Success state', usage: ['Success messages', 'Positive indicators', 'Completed status'] },
      { name: 'Warning', variable: '--color-warning', value: '#f59e0b', description: 'Warning state', usage: ['Warnings', 'Pending status', 'Attention needed'] },
      { name: 'Error', variable: '--color-error', value: '#dc2626', description: 'Error state', usage: ['Errors', 'Destructive actions', 'Critical alerts'] },
      { name: 'Info', variable: '--color-info', value: '#3b82f6', description: 'Info state', usage: ['Information messages', 'Tips', 'Neutral status'] },
    ]
  },
  {
    category: 'Neutral',
    colors: [
      { name: 'Gray 50', variable: '--color-gray-50', value: '#f9fafb', description: 'Lightest gray', usage: ['Page background'] },
      { name: 'Gray 100', variable: '--color-gray-100', value: '#f3f4f6', description: 'Very light gray', usage: ['Card backgrounds', 'Input backgrounds'] },
      { name: 'Gray 200', variable: '--color-gray-200', value: '#e5e7eb', description: 'Light gray', usage: ['Borders', 'Dividers'] },
      { name: 'Gray 300', variable: '--color-gray-300', value: '#d1d5db', description: 'Medium light gray', usage: ['Disabled borders'] },
      { name: 'Gray 400', variable: '--color-gray-400', value: '#9ca3af', description: 'Medium gray', usage: ['Placeholder text', 'Disabled text'] },
      { name: 'Gray 500', variable: '--color-gray-500', value: '#6b7280', description: 'Base gray', usage: ['Secondary text'] },
      { name: 'Gray 600', variable: '--color-gray-600', value: '#4b5563', description: 'Dark gray', usage: ['Body text'] },
      { name: 'Gray 700', variable: '--color-gray-700', value: '#374151', description: 'Darker gray', usage: ['Headings'] },
      { name: 'Gray 800', variable: '--color-gray-800', value: '#1f2937', description: 'Very dark gray', usage: ['Primary text'] },
      { name: 'Gray 900', variable: '--color-gray-900', value: '#111827', description: 'Darkest gray', usage: ['Headlines', 'Emphasis'] },
    ]
  }
];

export const spacingTokens: SpacingToken[] = [
  { name: 'None', variable: '--spacing-0', value: '0', pixels: 0 },
  { name: 'Extra Small', variable: '--spacing-1', value: '0.25rem', pixels: 4 },
  { name: 'Small', variable: '--spacing-2', value: '0.5rem', pixels: 8 },
  { name: 'Medium Small', variable: '--spacing-3', value: '0.75rem', pixels: 12 },
  { name: 'Medium', variable: '--spacing-4', value: '1rem', pixels: 16 },
  { name: 'Medium Large', variable: '--spacing-5', value: '1.25rem', pixels: 20 },
  { name: 'Large', variable: '--spacing-6', value: '1.5rem', pixels: 24 },
  { name: 'Extra Large', variable: '--spacing-8', value: '2rem', pixels: 32 },
  { name: '2X Large', variable: '--spacing-10', value: '2.5rem', pixels: 40 },
  { name: '3X Large', variable: '--spacing-12', value: '3rem', pixels: 48 },
  { name: '4X Large', variable: '--spacing-16', value: '4rem', pixels: 64 },
];

export const typographyTokens: TypographyToken[] = [
  { name: 'Display', variable: '--text-display', fontSize: '3rem', lineHeight: '1.1', fontWeight: '700', usage: 'Hero sections, landing pages' },
  { name: 'Heading 1', variable: '--text-h1', fontSize: '2.25rem', lineHeight: '1.2', fontWeight: '700', usage: 'Page titles' },
  { name: 'Heading 2', variable: '--text-h2', fontSize: '1.875rem', lineHeight: '1.25', fontWeight: '600', usage: 'Section headings' },
  { name: 'Heading 3', variable: '--text-h3', fontSize: '1.5rem', lineHeight: '1.3', fontWeight: '600', usage: 'Subsection headings' },
  { name: 'Heading 4', variable: '--text-h4', fontSize: '1.25rem', lineHeight: '1.4', fontWeight: '600', usage: 'Card titles' },
  { name: 'Body Large', variable: '--text-lg', fontSize: '1.125rem', lineHeight: '1.5', fontWeight: '400', usage: 'Lead paragraphs' },
  { name: 'Body', variable: '--text-base', fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', usage: 'Default body text' },
  { name: 'Body Small', variable: '--text-sm', fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '400', usage: 'Secondary text, labels' },
  { name: 'Caption', variable: '--text-xs', fontSize: '0.75rem', lineHeight: '1.4', fontWeight: '400', usage: 'Captions, hints' },
];

export const shadowTokens: ShadowToken[] = [
  { name: 'None', variable: '--shadow-none', value: 'none', usage: 'Flat elements' },
  { name: 'Small', variable: '--shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', usage: 'Subtle elevation' },
  { name: 'Base', variable: '--shadow', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', usage: 'Cards, dropdowns' },
  { name: 'Medium', variable: '--shadow-md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', usage: 'Hover states' },
  { name: 'Large', variable: '--shadow-lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', usage: 'Modals, popovers' },
  { name: 'Extra Large', variable: '--shadow-xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', usage: 'Floating elements' },
];

export const radiusTokens: RadiusToken[] = [
  { name: 'None', variable: '--radius-none', value: '0' },
  { name: 'Small', variable: '--radius-sm', value: '0.125rem' },
  { name: 'Base', variable: '--radius', value: '0.25rem' },
  { name: 'Medium', variable: '--radius-md', value: '0.375rem' },
  { name: 'Large', variable: '--radius-lg', value: '0.5rem' },
  { name: 'Extra Large', variable: '--radius-xl', value: '0.75rem' },
  { name: '2X Large', variable: '--radius-2xl', value: '1rem' },
  { name: 'Full', variable: '--radius-full', value: '9999px' },
];

interface DesignTokensProps {
  className?: string;
}

const DesignTokens: React.FC<DesignTokensProps> = ({ className = '' }) => {
  const [activeCategory, setActiveCategory] = useState<'colors' | 'spacing' | 'typography' | 'shadows' | 'radius'>('colors');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const renderColors = () => (
    <div className="space-y-8">
      {colorTokens.map(category => (
        <div key={category.category}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{category.category} Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            {category.colors.map(color => (
              <div
                key={color.variable}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => copyToClipboard(color.variable)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-lg shadow-inner flex-shrink-0"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{color.name}</span>
                      {copiedToken === color.variable && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                    <code className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                      {color.variable}
                    </code>
                    <p className="text-xs text-gray-500 mt-1">{color.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {color.usage.map((use, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSpacing = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-6">
        Spacing tokens use a consistent 4px base unit. Use these for margins, padding, and gaps.
      </p>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Variable</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Value</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Pixels</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-600">Preview</th>
            </tr>
          </thead>
          <tbody>
            {spacingTokens.map(token => (
              <tr
                key={token.variable}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => copyToClipboard(token.variable)}
              >
                <td className="p-4 font-medium">{token.name}</td>
                <td className="p-4">
                  <code className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {token.variable}
                  </code>
                </td>
                <td className="p-4 text-sm text-gray-600">{token.value}</td>
                <td className="p-4 text-sm text-gray-600">{token.pixels}px</td>
                <td className="p-4">
                  <div
                    className="bg-blue-500 h-4 rounded"
                    style={{ width: Math.min(token.pixels * 2, 128) }}
                  ></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTypography = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-6">
        Typography tokens define consistent text styles across the application.
      </p>
      <div className="space-y-4">
        {typographyTokens.map(token => (
          <div
            key={token.variable}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => copyToClipboard(token.variable)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-medium text-gray-800">{token.name}</span>
                <code className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-2">
                  {token.variable}
                </code>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{token.fontSize} / {token.lineHeight}</div>
                <div>Weight: {token.fontWeight}</div>
              </div>
            </div>
            <p
              style={{
                fontSize: token.fontSize,
                lineHeight: token.lineHeight,
                fontWeight: parseInt(token.fontWeight)
              }}
              className="text-gray-800"
            >
              The quick brown fox jumps over the lazy dog
            </p>
            <p className="text-xs text-gray-500 mt-2">Usage: {token.usage}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderShadows = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-6">
        Shadow tokens create depth and hierarchy in the interface.
      </p>
      <div className="grid grid-cols-3 gap-6">
        {shadowTokens.map(token => (
          <div
            key={token.variable}
            className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer"
            style={{ boxShadow: token.value }}
            onClick={() => copyToClipboard(token.variable)}
          >
            <div className="font-medium text-gray-800 mb-2">{token.name}</div>
            <code className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {token.variable}
            </code>
            <p className="text-xs text-gray-500 mt-2">{token.usage}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRadius = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-6">
        Border radius tokens for consistent rounded corners.
      </p>
      <div className="grid grid-cols-4 gap-4">
        {radiusTokens.map(token => (
          <div
            key={token.variable}
            className="bg-white border border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => copyToClipboard(token.variable)}
          >
            <div
              className="w-16 h-16 bg-blue-500 mx-auto mb-3"
              style={{ borderRadius: token.value }}
            ></div>
            <div className="font-medium text-sm text-gray-800">{token.name}</div>
            <code className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
              {token.value}
            </code>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Design Tokens</h2>
        <p className="text-sm text-gray-600">Formalized color, spacing, typography, and effect tokens</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        {(['colors', 'spacing', 'typography', 'shadows', 'radius'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeCategory === 'colors' && renderColors()}
      {activeCategory === 'spacing' && renderSpacing()}
      {activeCategory === 'typography' && renderTypography()}
      {activeCategory === 'shadows' && renderShadows()}
      {activeCategory === 'radius' && renderRadius()}

      {/* CSS Output */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">CSS Variables</h3>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
{`:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  /* Semantic Colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #dc2626;
  --color-info: #3b82f6;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;

  /* Typography */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DesignTokens;
