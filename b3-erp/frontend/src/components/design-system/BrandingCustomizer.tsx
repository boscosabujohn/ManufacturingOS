'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Image,
  Palette,
  Type,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Copy,
  Building2,
  Trash2,
} from 'lucide-react';

// Types
export interface BrandingConfig {
  logoUrl?: string;
  logoAlt?: string;
  companyName?: string;
  primaryColor?: string;
  accentColor?: string;
  faviconUrl?: string;
}

interface BrandingCustomizerProps {
  className?: string;
  initialBranding?: BrandingConfig;
  onBrandingChange?: (branding: BrandingConfig) => void;
  showPreview?: boolean;
}

// Preset color palettes
const presetColors = [
  { name: 'Ocean Blue', primary: '#0066cc', accent: '#00a3e0' },
  { name: 'Forest Green', primary: '#228b22', accent: '#32cd32' },
  { name: 'Royal Purple', primary: '#6b21a8', accent: '#9333ea' },
  { name: 'Sunset Orange', primary: '#ea580c', accent: '#fb923c' },
  { name: 'Crimson Red', primary: '#dc2626', accent: '#ef4444' },
  { name: 'Slate Gray', primary: '#475569', accent: '#64748b' },
  { name: 'Teal', primary: '#0d9488', accent: '#14b8a6' },
  { name: 'Indigo', primary: '#4338ca', accent: '#6366f1' },
];

// Color contrast checker
function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function isValidHex(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function BrandingCustomizer({
  className = '',
  initialBranding = {},
  onBrandingChange,
  showPreview = true,
}: BrandingCustomizerProps) {
  const [branding, setBranding] = useState<BrandingConfig>(initialBranding);
  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'company'>('logo');
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const updateBranding = useCallback(
    (updates: Partial<BrandingConfig>) => {
      const newBranding = { ...branding, ...updates };
      setBranding(newBranding);
      onBrandingChange?.(newBranding);
    },
    [branding, onBrandingChange]
  );

  const handleColorChange = (field: 'primaryColor' | 'accentColor', value: string) => {
    const upperValue = value.toUpperCase();
    if (value === '' || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      updateBranding({ [field]: upperValue });

      if (value.length === 7) {
        if (!isValidHex(upperValue)) {
          setErrors((prev) => ({ ...prev, [field]: 'Invalid hex color' }));
        } else {
          setErrors((prev) => {
            const { [field]: _, ...rest } = prev;
            return rest;
          });
        }
      }
    }
  };

  const handleFileUpload = (file: File, type: 'logo' | 'favicon') => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, [type]: 'Please upload an image file' }));
      return;
    }

    const maxSize = type === 'favicon' ? 100 * 1024 : 2 * 1024 * 1024; // 100KB for favicon, 2MB for logo
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [type]: `File too large. Max size: ${type === 'favicon' ? '100KB' : '2MB'}`,
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (type === 'logo') {
        updateBranding({ logoUrl: dataUrl });
      } else {
        updateBranding({ faviconUrl: dataUrl });
      }
      setErrors((prev) => {
        const { [type]: _, ...rest } = prev;
        return rest;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'logo' | 'favicon') => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  const applyPreset = (preset: (typeof presetColors)[0]) => {
    updateBranding({
      primaryColor: preset.primary,
      accentColor: preset.accent,
    });
  };

  const resetBranding = () => {
    setBranding({});
    onBrandingChange?.({});
    setErrors({});
  };

  const exportConfig = () => {
    const configJson = JSON.stringify(branding, null, 2);
    navigator.clipboard.writeText(configJson);
  };

  const contrastWithWhite = branding.primaryColor
    ? getContrastRatio(branding.primaryColor, '#ffffff')
    : 0;
  const contrastWithBlack = branding.primaryColor
    ? getContrastRatio(branding.primaryColor, '#000000')
    : 0;
  const meetsWCAG = contrastWithWhite >= 4.5 || contrastWithBlack >= 4.5;

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Branding Customization
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Customize your company logo and brand colors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportConfig}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              title="Copy configuration"
            >
              <Copy className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={resetBranding}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'logo', label: 'Logo', icon: <Image className="w-4 h-4" /> },
            { id: 'colors', label: 'Colors', icon: <Palette className="w-4 h-4" /> },
            { id: 'company', label: 'Company', icon: <Building2 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Configuration Panel */}
        <div className="p-6 border-r border-gray-200 dark:border-gray-700">
          {/* Logo Tab */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              {/* Main Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Logo
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => handleDrop(e, 'logo')}
                >
                  {branding.logoUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={branding.logoUrl}
                        alt={branding.logoAlt || 'Logo'}
                        className="max-h-24 max-w-full mx-auto"
                      />
                      <button
                        onClick={() => updateBranding({ logoUrl: undefined })}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Drag and drop or{' '}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:underline"
                        >
                          browse
                        </button>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, SVG, or JPG (max 2MB)</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                />
                {errors.logo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.logo}
                  </p>
                )}
              </div>

              {/* Logo Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo Alt Text
                </label>
                <input
                  type="text"
                  value={branding.logoAlt || ''}
                  onChange={(e) => updateBranding({ logoAlt: e.target.value })}
                  placeholder="Company logo"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Favicon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {branding.faviconUrl ? (
                    <div className="relative">
                      <img
                        src={branding.faviconUrl}
                        alt="Favicon"
                        className="w-8 h-8 rounded"
                      />
                      <button
                        onClick={() => updateBranding({ faviconUrl: undefined })}
                        className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                      <Image className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => faviconInputRef.current?.click()}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Upload Favicon
                  </button>
                </div>
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0], 'favicon')
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Square image, 32x32 or 64x64px recommended</p>
              </div>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={branding.primaryColor || '#3b82f6'}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor || ''}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                  />
                </div>
                {branding.primaryColor && (
                  <div className="mt-2 flex items-center gap-2">
                    {meetsWCAG ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <Check className="w-3 h-3" />
                        WCAG AA compliant
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600">
                        <AlertCircle className="w-3 h-3" />
                        May have contrast issues
                      </span>
                    )}
                  </div>
                )}
                {errors.primaryColor && (
                  <p className="mt-1 text-sm text-red-600">{errors.primaryColor}</p>
                )}
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={branding.accentColor || '#60a5fa'}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.accentColor || ''}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    placeholder="#60A5FA"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Preset Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preset Color Palettes
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                        branding.primaryColor === preset.primary
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex -space-x-1">
                        <div
                          className="w-5 h-5 rounded-full border-2 border-white"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border-2 border-white"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{preset.name}</span>
                      {branding.primaryColor === preset.primary && (
                        <Check className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={branding.companyName || ''}
                  onChange={(e) => updateBranding({ companyName: e.target.value })}
                  placeholder="Your Company Name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Displayed in the sidebar and page titles
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Branding Options
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Custom email templates (coming soon)</li>
                  <li>• Report header/footer customization (coming soon)</li>
                  <li>• Login page branding (coming soon)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="p-6 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('light')}
                  className={`p-1.5 rounded ${
                    previewMode === 'light'
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('dark')}
                  className={`p-1.5 rounded ${
                    previewMode === 'dark'
                      ? 'bg-gray-700 shadow text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Container */}
            <div
              className={`rounded-lg border overflow-hidden ${
                previewMode === 'dark'
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Mock Header */}
              <div
                className={`flex items-center gap-3 px-4 py-3 border-b ${
                  previewMode === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
                style={{
                  backgroundColor: branding.primaryColor
                    ? previewMode === 'dark'
                      ? branding.primaryColor + '20'
                      : branding.primaryColor + '10'
                    : undefined,
                }}
              >
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="h-8" />
                ) : (
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: branding.primaryColor || '#3b82f6' }}
                  >
                    {branding.companyName?.charAt(0) || 'M'}
                  </div>
                )}
                <span
                  className={`font-semibold ${
                    previewMode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {branding.companyName || 'ManufacturingOS'}
                </span>
              </div>

              {/* Mock Content */}
              <div className="p-4 space-y-3">
                <div
                  className={`h-2 rounded ${previewMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  style={{ width: '60%' }}
                />
                <div
                  className={`h-2 rounded ${previewMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                  style={{ width: '80%' }}
                />
                <div className="flex gap-2 pt-2">
                  <button
                    className="px-3 py-1.5 rounded text-sm text-white"
                    style={{ backgroundColor: branding.primaryColor || '#3b82f6' }}
                  >
                    Primary Action
                  </button>
                  <button
                    className="px-3 py-1.5 rounded text-sm border"
                    style={{
                      borderColor: branding.accentColor || '#60a5fa',
                      color: branding.accentColor || '#60a5fa',
                    }}
                  >
                    Secondary
                  </button>
                </div>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div
                className="p-3 rounded-lg text-center"
                style={{ backgroundColor: branding.primaryColor || '#3b82f6' }}
              >
                <span className="text-xs font-medium text-white">Primary</span>
              </div>
              <div
                className="p-3 rounded-lg text-center"
                style={{ backgroundColor: branding.accentColor || '#60a5fa' }}
              >
                <span className="text-xs font-medium text-white">Accent</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { BrandingCustomizerProps };
