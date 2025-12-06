'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Download,
  Image,
  FileText,
  Code,
  Loader2,
  Check,
  ChevronDown,
  Settings,
} from 'lucide-react';

// Types
export type ChartExportFormat = 'png' | 'svg' | 'pdf' | 'jpg';

export interface ExportOptions {
  format: ChartExportFormat;
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
  filename?: string;
  title?: string;
  includeTitle?: boolean;
  includeLegend?: boolean;
  includeTimestamp?: boolean;
  quality?: number; // For JPG (0-1)
}

interface ChartExportProps {
  chartRef: React.RefObject<HTMLElement | SVGElement>;
  filename?: string;
  title?: string;
  formats?: ChartExportFormat[];
  defaultFormat?: ChartExportFormat;
  onExportStart?: () => void;
  onExportComplete?: (format: ChartExportFormat) => void;
  onExportError?: (error: Error) => void;
  variant?: 'button' | 'dropdown' | 'icon';
  className?: string;
}

// Format configurations
const formatConfig: Record<ChartExportFormat, { label: string; icon: React.ReactNode; mime: string }> = {
  png: { label: 'PNG Image', icon: <Image className="w-4 h-4" />, mime: 'image/png' },
  jpg: { label: 'JPEG Image', icon: <Image className="w-4 h-4" />, mime: 'image/jpeg' },
  svg: { label: 'SVG Vector', icon: <Code className="w-4 h-4" />, mime: 'image/svg+xml' },
  pdf: { label: 'PDF Document', icon: <FileText className="w-4 h-4" />, mime: 'application/pdf' },
};

// Export utility functions
async function elementToCanvas(
  element: HTMLElement | SVGElement,
  options: ExportOptions
): Promise<HTMLCanvasElement> {
  const { width, height, scale = 2, backgroundColor = '#ffffff' } = options;

  // Get element dimensions
  const rect = element.getBoundingClientRect();
  const w = width || rect.width;
  const h = height || rect.height;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Set background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);

  // Check if element is SVG
  if (element instanceof SVGElement || element.querySelector('svg')) {
    const svg = element instanceof SVGElement ? element : element.querySelector('svg');
    if (svg) {
      return svgToCanvas(svg as SVGElement, canvas, ctx, w, h);
    }
  }

  // For HTML elements, use html2canvas approach
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${w}px`;
  clone.style.height = `${h}px`;

  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Use foreignObject to render HTML in SVG, then to canvas
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${clone.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;

    const img = new window.Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG'));
      };
      img.src = url;
    });
  } finally {
    document.body.removeChild(container);
  }
}

async function svgToCanvas(
  svg: SVGElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  // Clone SVG to avoid modifying the original
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));

  // Serialize SVG
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clone);

  // Add XML declaration
  if (!svgString.startsWith('<?xml')) {
    svgString = '<?xml version="1.0" encoding="UTF-8"?>' + svgString;
  }

  // Create image from SVG
  const img = new window.Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };
    img.src = url;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export functions
export async function exportToPNG(
  element: HTMLElement | SVGElement,
  options: ExportOptions
): Promise<void> {
  const canvas = await elementToCanvas(element, options);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))),
      'image/png'
    );
  });
  downloadBlob(blob, `${options.filename || 'chart'}.png`);
}

export async function exportToJPG(
  element: HTMLElement | SVGElement,
  options: ExportOptions
): Promise<void> {
  const canvas = await elementToCanvas(element, { ...options, backgroundColor: '#ffffff' });
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))),
      'image/jpeg',
      options.quality || 0.9
    );
  });
  downloadBlob(blob, `${options.filename || 'chart'}.jpg`);
}

export async function exportToSVG(
  element: HTMLElement | SVGElement,
  options: ExportOptions
): Promise<void> {
  let svg: SVGElement | null = null;

  if (element instanceof SVGElement) {
    svg = element;
  } else {
    svg = element.querySelector('svg');
  }

  if (!svg) {
    throw new Error('No SVG element found');
  }

  // Clone and prepare SVG
  const clone = svg.cloneNode(true) as SVGElement;

  // Inline styles
  const computedStyles = window.getComputedStyle(svg);
  const styleString = Array.from(computedStyles)
    .map((key) => `${key}:${computedStyles.getPropertyValue(key)}`)
    .join(';');

  // Add title if requested
  if (options.includeTitle && options.title) {
    const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleEl.textContent = options.title;
    clone.insertBefore(titleEl, clone.firstChild);
  }

  // Serialize
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clone);

  // Add XML declaration
  svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, `${options.filename || 'chart'}.svg`);
}

export async function exportToPDF(
  element: HTMLElement | SVGElement,
  options: ExportOptions
): Promise<void> {
  // Create canvas first
  const canvas = await elementToCanvas(element, options);

  // Create PDF using print
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Failed to open print window');
  }

  const dataUrl = canvas.toDataURL('image/png');
  const timestamp = options.includeTimestamp ? new Date().toLocaleString() : '';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options.title || 'Chart Export'}</title>
        <style>
          @page { margin: 20mm; }
          body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
          .header { margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; margin: 0; }
          .timestamp { font-size: 12px; color: #666; margin-top: 8px; }
          .chart { max-width: 100%; height: auto; }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${options.includeTitle && options.title ? `
          <div class="header">
            <h1 class="title">${options.title}</h1>
            ${timestamp ? `<p class="timestamp">Generated: ${timestamp}</p>` : ''}
          </div>
        ` : ''}
        <img src="${dataUrl}" class="chart" />
      </body>
    </html>
  `);

  printWindow.document.close();

  // Wait for image to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
}

// Main export function
export async function exportChart(
  element: HTMLElement | SVGElement,
  options: ExportOptions
): Promise<void> {
  switch (options.format) {
    case 'png':
      return exportToPNG(element, options);
    case 'jpg':
      return exportToJPG(element, options);
    case 'svg':
      return exportToSVG(element, options);
    case 'pdf':
      return exportToPDF(element, options);
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }
}

// Export button component
export function ChartExport({
  chartRef,
  filename = 'chart',
  title,
  formats = ['png', 'svg', 'pdf'],
  defaultFormat = 'png',
  onExportStart,
  onExportComplete,
  onExportError,
  variant = 'dropdown',
  className = '',
}: ChartExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: defaultFormat,
    filename,
    title,
    scale: 2,
    backgroundColor: '#ffffff',
    includeTitle: true,
    includeTimestamp: true,
  });

  const handleExport = useCallback(async (format?: ChartExportFormat) => {
    if (!chartRef.current) {
      onExportError?.(new Error('Chart element not found'));
      return;
    }

    const exportFormat = format || options.format;

    setIsExporting(true);
    setExportSuccess(false);
    onExportStart?.();

    try {
      await exportChart(chartRef.current, { ...options, format: exportFormat });
      setExportSuccess(true);
      onExportComplete?.(exportFormat);

      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      onExportError?.(error as Error);
    } finally {
      setIsExporting(false);
      setShowDropdown(false);
    }
  }, [chartRef, options, onExportStart, onExportComplete, onExportError]);

  if (variant === 'icon') {
    return (
      <button
        onClick={() => handleExport()}
        disabled={isExporting}
        className={`p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 ${className}`}
        title="Export chart"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : exportSuccess ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Download className="w-4 h-4" />
        )}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={() => handleExport()}
        disabled={isExporting}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 ${className}`}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : exportSuccess ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export
      </button>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export
        <ChevronDown className="w-3 h-3" />
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
            {formats.map(format => {
              const config = formatConfig[format];
              return (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {config.icon}
                  {config.label}
                </button>
              );
            })}

            <hr className="my-1 border-gray-200 dark:border-gray-700" />

            <button
              onClick={() => {
                setShowOptions(!showOptions);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
              Export Options
            </button>
          </div>
        </>
      )}

      {/* Options Modal */}
      {showOptions && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowOptions(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Export Options</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Scale
                  </label>
                  <select
                    value={options.scale}
                    onChange={(e) => setOptions({ ...options, scale: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value={1}>1x (Standard)</option>
                    <option value={2}>2x (High Quality)</option>
                    <option value={3}>3x (Very High)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Background
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                      className="w-10 h-10 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={options.backgroundColor}
                      onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.includeTitle}
                    onChange={(e) => setOptions({ ...options, includeTitle: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include title</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.includeTimestamp}
                    onChange={(e) => setOptions({ ...options, includeTimestamp: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include timestamp</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowOptions(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowOptions(false);
                    handleExport();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Hook for chart export
export function useChartExport(options?: Partial<ExportOptions>) {
  const chartRef = useRef<HTMLElement | SVGElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportAs = useCallback(async (format: ChartExportFormat, customOptions?: Partial<ExportOptions>) => {
    if (!chartRef.current) return;

    setIsExporting(true);
    try {
      await exportChart(chartRef.current, {
        format,
        filename: 'chart',
        ...options,
        ...customOptions,
      });
    } finally {
      setIsExporting(false);
    }
  }, [options]);

  return {
    chartRef,
    isExporting,
    exportAs,
    exportPNG: (opts?: Partial<ExportOptions>) => exportAs('png', opts),
    exportSVG: (opts?: Partial<ExportOptions>) => exportAs('svg', opts),
    exportPDF: (opts?: Partial<ExportOptions>) => exportAs('pdf', opts),
    exportJPG: (opts?: Partial<ExportOptions>) => exportAs('jpg', opts),
  };
}

export type { ChartExportProps, ExportOptions, ChartExportFormat };
