'use client';

import React, { useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import {
  X,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings,
} from 'lucide-react';

// ============================================================================
// Print Preview Modal
// ============================================================================

export interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  children: ReactNode;
  title?: string;
  pageSize?: 'letter' | 'A4' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: { top: string; right: string; bottom: string; left: string };
  showSettings?: boolean;
  onExportPDF?: () => void;
  className?: string;
}

const pageDimensions = {
  letter: { portrait: { width: 816, height: 1056 }, landscape: { width: 1056, height: 816 } },
  A4: { portrait: { width: 794, height: 1123 }, landscape: { width: 1123, height: 794 } },
  legal: { portrait: { width: 816, height: 1344 }, landscape: { width: 1344, height: 816 } },
};

export function PrintPreview({
  isOpen,
  onClose,
  onPrint,
  children,
  title = 'Print Preview',
  pageSize = 'letter',
  orientation = 'portrait',
  margins = { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
  showSettings = true,
  onExportPDF,
  className = '',
}: PrintPreviewProps) {
  const [zoom, setZoom] = useState(75);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [localOrientation, setLocalOrientation] = useState(orientation);
  const [localPageSize, setLocalPageSize] = useState(pageSize);

  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const dimensions = pageDimensions[localPageSize][localOrientation];

  // Calculate pages based on content height
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const pageHeight = dimensions.height - 96; // Subtract margins
      const pages = Math.ceil(contentHeight / pageHeight);
      setTotalPages(Math.max(1, pages));
    }
  }, [children, dimensions.height]);

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const resetZoom = () => setZoom(75);

  // Page navigation
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Fullscreen toggle
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Handle print
  const handlePrint = useCallback(() => {
    onPrint();
    onClose();
  }, [onPrint, onClose]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handlePrint();
      }
      if (e.key === '+' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        zoomIn();
      }
      if (e.key === '-' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        zoomOut();
      }
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrint, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${isFullscreen ? '' : 'p-4'} bg-gray-900/90 flex flex-col ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <FileText className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={zoomOut}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-medium">{zoom}%</span>
            <button
              onClick={zoomIn}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded ml-1"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Page navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Settings */}
          {showSettings && (
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className={`p-2 rounded-lg ${showSettingsPanel ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              aria-label="Print settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

          {/* Export PDF */}
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          )}

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Settings panel */}
        {showSettingsPanel && (
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Print Settings</h3>

            {/* Page Size */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Size
              </label>
              <select
                value={localPageSize}
                onChange={(e) => setLocalPageSize(e.target.value as typeof localPageSize)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="letter">Letter (8.5" × 11")</option>
                <option value="A4">A4 (210mm × 297mm)</option>
                <option value="legal">Legal (8.5" × 14")</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Orientation
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLocalOrientation('portrait')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border ${
                    localOrientation === 'portrait'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => setLocalOrientation('landscape')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border ${
                    localOrientation === 'landscape'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            {/* Margins info */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Margins
              </label>
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Top:</span>
                  <span>{margins.top}</span>
                </div>
                <div className="flex justify-between">
                  <span>Right:</span>
                  <span>{margins.right}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bottom:</span>
                  <span>{margins.bottom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Left:</span>
                  <span>{margins.left}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Tips</h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Press Ctrl+P to print</li>
                <li>• Use +/- to zoom</li>
                <li>• Arrow keys navigate pages</li>
              </ul>
            </div>
          </div>
        )}

        {/* Preview area */}
        <div
          ref={previewRef}
          className="flex-1 overflow-auto bg-gray-700 p-8"
        >
          <div
            className="mx-auto bg-white shadow-2xl transition-all duration-200"
            style={{
              width: dimensions.width * (zoom / 100),
              minHeight: dimensions.height * (zoom / 100),
              padding: `${parseFloat(margins.top) * 96 * (zoom / 100)}px ${parseFloat(margins.right) * 96 * (zoom / 100)}px ${parseFloat(margins.bottom) * 96 * (zoom / 100)}px ${parseFloat(margins.left) * 96 * (zoom / 100)}px`,
              transformOrigin: 'top center',
            }}
          >
            <div
              ref={contentRef}
              className="print-preview-content"
              style={{
                fontSize: `${12 * (zoom / 100)}pt`,
                lineHeight: 1.4,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Simple Print Preview Trigger
// ============================================================================

export interface PrintPreviewTriggerProps {
  children: ReactNode;
  content: ReactNode;
  title?: string;
  buttonClassName?: string;
  onPrint?: () => void;
}

export function PrintPreviewTrigger({
  children,
  content,
  title,
  buttonClassName = '',
  onPrint,
}: PrintPreviewTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClassName}
      >
        {children}
      </button>

      <PrintPreview
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPrint={handlePrint}
        title={title}
      >
        {content}
      </PrintPreview>
    </>
  );
}

