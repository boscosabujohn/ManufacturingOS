'use client';

import React, { ReactNode, useMemo } from 'react';

// ============================================================================
// Watermark Types
// ============================================================================

export type WatermarkPreset =
  | 'draft'
  | 'confidential'
  | 'sample'
  | 'copy'
  | 'void'
  | 'approved'
  | 'rejected'
  | 'final'
  | 'internal'
  | 'custom';

export interface WatermarkStyle {
  color?: string;
  opacity?: number;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  rotation?: number;
  repeat?: boolean;
  position?: 'center' | 'diagonal' | 'tiled';
}

// ============================================================================
// Watermark Component
// ============================================================================

export interface WatermarkProps {
  text?: string;
  preset?: WatermarkPreset;
  image?: string;
  style?: WatermarkStyle;
  showOnScreen?: boolean;
  showOnPrint?: boolean;
  children?: ReactNode;
  className?: string;
}

const presetStyles: Record<WatermarkPreset, { text: string; style: WatermarkStyle }> = {
  draft: {
    text: 'DRAFT',
    style: { color: '#9CA3AF', opacity: 0.15, fontSize: '120px', rotation: -45 },
  },
  confidential: {
    text: 'CONFIDENTIAL',
    style: { color: '#DC2626', opacity: 0.12, fontSize: '100px', rotation: -45 },
  },
  sample: {
    text: 'SAMPLE',
    style: { color: '#2563EB', opacity: 0.15, fontSize: '120px', rotation: -45 },
  },
  copy: {
    text: 'COPY',
    style: { color: '#6B7280', opacity: 0.15, fontSize: '140px', rotation: -45 },
  },
  void: {
    text: 'VOID',
    style: { color: '#DC2626', opacity: 0.2, fontSize: '160px', rotation: -45 },
  },
  approved: {
    text: 'APPROVED',
    style: { color: '#059669', opacity: 0.12, fontSize: '100px', rotation: -45 },
  },
  rejected: {
    text: 'REJECTED',
    style: { color: '#DC2626', opacity: 0.15, fontSize: '100px', rotation: -45 },
  },
  final: {
    text: 'FINAL',
    style: { color: '#1F2937', opacity: 0.1, fontSize: '120px', rotation: -45 },
  },
  internal: {
    text: 'INTERNAL USE ONLY',
    style: { color: '#F59E0B', opacity: 0.1, fontSize: '80px', rotation: -45 },
  },
  custom: {
    text: '',
    style: { color: '#9CA3AF', opacity: 0.15, fontSize: '100px', rotation: -45 },
  },
};

export function Watermark({
  text,
  preset = 'custom',
  image,
  style = {},
  showOnScreen = true,
  showOnPrint = true,
  children,
  className = '',
}: WatermarkProps) {
  const presetConfig = presetStyles[preset];
  const watermarkText = text || presetConfig.text;

  const mergedStyle: WatermarkStyle = {
    ...presetConfig.style,
    ...style,
  };

  const watermarkStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) rotate(${mergedStyle.rotation || -45}deg)`,
    color: mergedStyle.color || '#9CA3AF',
    opacity: mergedStyle.opacity || 0.15,
    fontSize: mergedStyle.fontSize || '100px',
    fontWeight: mergedStyle.fontWeight || 'bold',
    fontFamily: mergedStyle.fontFamily || 'Arial, sans-serif',
    whiteSpace: 'nowrap' as const,
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
    zIndex: 0,
    // Force color print
    WebkitPrintColorAdjust: 'exact' as const,
    printColorAdjust: 'exact' as const,
  }), [mergedStyle]);

  const visibilityClass = useMemo(() => {
    if (showOnScreen && showOnPrint) return '';
    if (showOnScreen && !showOnPrint) return 'print:hidden';
    if (!showOnScreen && showOnPrint) return 'hidden print:block';
    return 'hidden';
  }, [showOnScreen, showOnPrint]);

  return (
    <div className={`relative ${className}`}>
      {/* Watermark layer */}
      <div
        className={`watermark-layer absolute inset-0 overflow-hidden pointer-events-none ${visibilityClass}`}
        aria-hidden="true"
      >
        {image ? (
          <img
            src={image}
            alt=""
            style={{
              ...watermarkStyle,
              maxWidth: '50%',
              maxHeight: '50%',
              objectFit: 'contain',
            }}
          />
        ) : watermarkText ? (
          mergedStyle.position === 'tiled' ? (
            <TiledWatermark text={watermarkText} style={mergedStyle} />
          ) : (
            <span style={watermarkStyle}>{watermarkText}</span>
          )
        ) : null}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Tiled Watermark (Repeating Pattern)
// ============================================================================

interface TiledWatermarkProps {
  text: string;
  style: WatermarkStyle;
}

function TiledWatermark({ text, style }: TiledWatermarkProps) {
  const rows = 5;
  const cols = 3;

  return (
    <div
      className="absolute inset-0 flex flex-wrap justify-center items-center"
      style={{
        transform: `rotate(${style.rotation || -45}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span
          key={i}
          style={{
            color: style.color || '#9CA3AF',
            opacity: style.opacity || 0.1,
            fontSize: style.fontSize ? `calc(${style.fontSize} * 0.5)` : '50px',
            fontWeight: style.fontWeight || 'bold',
            fontFamily: style.fontFamily || 'Arial, sans-serif',
            padding: '40px 60px',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}

// ============================================================================
// Watermark Container (For wrapping content)
// ============================================================================

export interface WatermarkContainerProps {
  watermark: WatermarkProps;
  children: ReactNode;
  className?: string;
}

export function WatermarkContainer({
  watermark,
  children,
  className = '',
}: WatermarkContainerProps) {
  return (
    <Watermark {...watermark} className={className}>
      {children}
    </Watermark>
  );
}

// ============================================================================
// Security Watermark (With Timestamp and User)
// ============================================================================

export interface SecurityWatermarkProps {
  username?: string;
  timestamp?: Date;
  documentId?: string;
  style?: WatermarkStyle;
  showOnScreen?: boolean;
  showOnPrint?: boolean;
  children: ReactNode;
  className?: string;
}

export function SecurityWatermark({
  username,
  timestamp = new Date(),
  documentId,
  style = {},
  showOnScreen = false,
  showOnPrint = true,
  children,
  className = '',
}: SecurityWatermarkProps) {
  const securityText = useMemo(() => {
    const parts = [];
    if (username) parts.push(username);
    parts.push(timestamp.toISOString());
    if (documentId) parts.push(documentId);
    return parts.join(' | ');
  }, [username, timestamp, documentId]);

  return (
    <div className={`relative ${className}`}>
      {/* Content */}
      {children}

      {/* Security watermark at bottom */}
      <div
        className={`
          absolute bottom-0 left-0 right-0
          text-center text-xs
          py-1 px-4
          ${showOnScreen ? '' : 'hidden'} print:block
        `}
        style={{
          color: style.color || '#9CA3AF',
          opacity: style.opacity || 0.5,
          fontFamily: 'monospace',
        }}
      >
        {securityText}
      </div>
    </div>
  );
}

// ============================================================================
// Dynamic Watermark based on Document Status
// ============================================================================

export type DocumentStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'final'
  | 'archived'
  | 'expired';

export interface StatusWatermarkProps {
  status: DocumentStatus;
  customText?: Record<DocumentStatus, string>;
  showOnScreen?: boolean;
  showOnPrint?: boolean;
  children: ReactNode;
  className?: string;
}

const defaultStatusText: Record<DocumentStatus, string> = {
  draft: 'DRAFT',
  pending_review: 'PENDING REVIEW',
  approved: 'APPROVED',
  rejected: 'REJECTED',
  final: 'FINAL',
  archived: 'ARCHIVED',
  expired: 'EXPIRED',
};

const statusColors: Record<DocumentStatus, string> = {
  draft: '#9CA3AF',
  pending_review: '#F59E0B',
  approved: '#059669',
  rejected: '#DC2626',
  final: '#1F2937',
  archived: '#6B7280',
  expired: '#DC2626',
};

export function StatusWatermark({
  status,
  customText,
  showOnScreen = true,
  showOnPrint = true,
  children,
  className = '',
}: StatusWatermarkProps) {
  const text = customText?.[status] || defaultStatusText[status];
  const color = statusColors[status];

  // Only show watermark for certain statuses
  const showWatermark = ['draft', 'pending_review', 'rejected', 'expired'].includes(status);

  if (!showWatermark) {
    return <>{children}</>;
  }

  return (
    <Watermark
      text={text}
      style={{ color, opacity: 0.12 }}
      showOnScreen={showOnScreen}
      showOnPrint={showOnPrint}
      className={className}
    >
      {children}
    </Watermark>
  );
}

// ============================================================================
// Watermark with Logo
// ============================================================================

export interface LogoWatermarkProps {
  logoUrl: string;
  opacity?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'center' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  showOnScreen?: boolean;
  showOnPrint?: boolean;
  children: ReactNode;
  className?: string;
}

export function LogoWatermark({
  logoUrl,
  opacity = 0.1,
  size = 'md',
  position = 'center',
  showOnScreen = true,
  showOnPrint = true,
  children,
  className = '',
}: LogoWatermarkProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-72 h-72',
    xl: 'w-96 h-96',
  };

  const positionClasses = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const visibilityClass = useMemo(() => {
    if (showOnScreen && showOnPrint) return '';
    if (showOnScreen && !showOnPrint) return 'print:hidden';
    if (!showOnScreen && showOnPrint) return 'hidden print:block';
    return 'hidden';
  }, [showOnScreen, showOnPrint]);

  return (
    <div className={`relative ${className}`}>
      {/* Logo watermark */}
      <div
        className={`absolute ${positionClasses[position]} pointer-events-none ${visibilityClass}`}
        aria-hidden="true"
      >
        <img
          src={logoUrl}
          alt=""
          className={`${sizeClasses[size]} object-contain`}
          style={{
            opacity,
            filter: 'grayscale(100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Print-specific Watermark Styles
// ============================================================================

export function WatermarkStyles() {
  return (
    <style jsx global>{`
      @media print {
        .watermark-layer {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        .watermark-layer * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }

      /* Ensure watermark doesn't interfere with content selection */
      .watermark-layer {
        pointer-events: none;
        user-select: none;
      }
    `}</style>
  );
}

export type {
  WatermarkPreset,
  WatermarkStyle,
  WatermarkProps,
  WatermarkContainerProps,
  SecurityWatermarkProps,
  DocumentStatus,
  StatusWatermarkProps,
  LogoWatermarkProps,
};
