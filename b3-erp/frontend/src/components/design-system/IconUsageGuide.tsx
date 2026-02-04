'use client';

import React, { useState } from 'react';

// Types
type IconSize = 16 | 20 | 24 | 32;
type IconCategory = 'navigation' | 'action' | 'status' | 'communication' | 'file' | 'commerce';

interface IconDefinition {
  name: string;
  category: IconCategory;
  path: string;
  usage: string[];
}

interface IconUsageGuideProps {
  className?: string;
}

// Sample icons using SVG paths
const icons: IconDefinition[] = [
  {
    name: 'Home',
    category: 'navigation',
    path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    usage: ['Navigation menu', 'Dashboard link', 'Breadcrumb home']
  },
  {
    name: 'Settings',
    category: 'navigation',
    path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    usage: ['Settings page', 'Configuration options', 'User preferences']
  },
  {
    name: 'Search',
    category: 'action',
    path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    usage: ['Search bar', 'Filter action', 'Find functionality']
  },
  {
    name: 'Plus',
    category: 'action',
    path: 'M12 4v16m8-8H4',
    usage: ['Add new item', 'Create action', 'Expand content']
  },
  {
    name: 'Edit',
    category: 'action',
    path: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    usage: ['Edit button', 'Modify content', 'Update action']
  },
  {
    name: 'Delete',
    category: 'action',
    path: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    usage: ['Delete action', 'Remove item', 'Clear content']
  },
  {
    name: 'Check',
    category: 'status',
    path: 'M5 13l4 4L19 7',
    usage: ['Success state', 'Completion', 'Selection']
  },
  {
    name: 'Warning',
    category: 'status',
    path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    usage: ['Warning state', 'Caution indicator', 'Alert']
  },
  {
    name: 'Error',
    category: 'status',
    path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    usage: ['Error state', 'Invalid input', 'Failed action']
  },
  {
    name: 'Info',
    category: 'status',
    path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    usage: ['Information tooltip', 'Help text', 'Additional details']
  },
  {
    name: 'Mail',
    category: 'communication',
    path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    usage: ['Email', 'Messages', 'Contact']
  },
  {
    name: 'Bell',
    category: 'communication',
    path: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    usage: ['Notifications', 'Alerts', 'Updates']
  },
  {
    name: 'Document',
    category: 'file',
    path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    usage: ['Documents', 'Files', 'Reports']
  },
  {
    name: 'Folder',
    category: 'file',
    path: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    usage: ['Folders', 'Categories', 'Groups']
  },
  {
    name: 'Cart',
    category: 'commerce',
    path: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    usage: ['Shopping cart', 'Orders', 'Checkout']
  },
  {
    name: 'Chart',
    category: 'commerce',
    path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    usage: ['Analytics', 'Reports', 'Statistics']
  },
];

const iconSizes: { size: IconSize; label: string; usage: string }[] = [
  { size: 16, label: 'Small (16px)', usage: 'Inline icons, dense UI, badges' },
  { size: 20, label: 'Medium (20px)', usage: 'Default size, buttons, form inputs' },
  { size: 24, label: 'Large (24px)', usage: 'Headers, prominent actions, navigation' },
  { size: 32, label: 'Extra Large (32px)', usage: 'Feature icons, empty states, illustrations' },
];

const IconUsageGuide: React.FC<IconUsageGuideProps> = ({ className = '' }) => {
  const [selectedSize, setSelectedSize] = useState<IconSize>(24);
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const categories: { id: IconCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Icons' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'action', label: 'Actions' },
    { id: 'status', label: 'Status' },
    { id: 'communication', label: 'Communication' },
    { id: 'file', label: 'Files' },
    { id: 'commerce', label: 'Commerce' },
  ];

  const filteredIcons = icons.filter(icon => {
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyIconCode = (icon: IconDefinition) => {
    const code = `<svg className="w-${selectedSize / 4} h-${selectedSize / 4}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="${icon.path}" />
</svg>`;
    navigator.clipboard.writeText(code);
    setCopiedIcon(icon.name);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-800">Icon Usage Guide</h2>
        <p className="text-sm text-gray-600">Standardized icon sizes and usage patterns</p>
      </div>

      {/* Size Guide */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Icon Sizes</h3>
        <div className="grid grid-cols-4 gap-3">
          {iconSizes.map(({ size, label, usage }) => (
            <div
              key={size}
              className={`text-center p-3 rounded-lg cursor-pointer transition-all ${
                selectedSize === size
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              <svg
                className="mx-auto text-gray-700"
                style={{ width: size, height: size }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="font-medium text-gray-800 mt-3">{label}</div>
              <div className="text-xs text-gray-500 mt-1">{usage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-4 gap-2">
        {filteredIcons.map(icon => (
          <div
            key={icon.name}
            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
            onClick={() => copyIconCode(icon)}
          >
            <div className="flex justify-center mb-3">
              <svg
                className="text-gray-700"
                style={{ width: selectedSize, height: selectedSize }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.path} />
              </svg>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm text-gray-800">{icon.name}</div>
              <div className="text-xs text-gray-500 capitalize">{icon.category}</div>
              {copiedIcon === icon.name && (
                <div className="text-xs text-green-600 mt-1">Copied!</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Usage Guidelines */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Icon Guidelines</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-medium text-gray-800 mb-3">Sizing Rules</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use 20px for buttons and form elements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use 16px for inline text and dense layouts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use 24px for navigation and headers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use 32px sparingly for emphasis</span>
              </li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-medium text-gray-800 mb-3">Color Rules</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use currentColor to inherit text color</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Use semantic colors for status icons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span>Don&apos;t use multiple colors in one icon</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span>Don&apos;t use icons as decoration only</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h4 className="font-medium text-blue-800 mb-2">Accessibility Requirements</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Always provide alt text or aria-label for meaningful icons</li>
          <li>• Use aria-hidden=&quot;true&quot; for decorative icons</li>
          <li>• Ensure sufficient color contrast (4.5:1 minimum)</li>
          <li>• Include text labels when icons alone may be ambiguous</li>
        </ul>
      </div>
    </div>
  );
};

export default IconUsageGuide;
