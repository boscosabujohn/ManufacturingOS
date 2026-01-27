'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ImgHTMLAttributes,
  CSSProperties,
} from 'react';

// ============================================================================
// Optimized Image Component
// ============================================================================

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type ImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  /** Image source URL */
  src: string;
  /** Alt text (required for accessibility) */
  alt: string;
  /** Image width */
  width?: number | string;
  /** Image height */
  height?: number | string;
  /** Low-quality placeholder image (blur-up effect) */
  placeholder?: string;
  /** Blur data URL for placeholder */
  blurDataURL?: string;
  /** Object fit mode */
  fit?: ImageFit;
  /** Object position */
  position?: ImagePosition;
  /** Enable lazy loading */
  lazy?: boolean;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Priority loading (disables lazy) */
  priority?: boolean;
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Fallback image on error */
  fallbackSrc?: string;
  /** Enable fade-in animation */
  fadeIn?: boolean;
  /** Fade duration in ms */
  fadeDuration?: number;
  /** On load callback */
  onLoad?: () => void;
  /** On error callback */
  onError?: (error: Error) => void;
  /** Container className */
  containerClassName?: string;
}

const positionMap: Record<ImagePosition, string> = {
  center: 'center',
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  'top-left': 'top left',
  'top-right': 'top right',
  'bottom-left': 'bottom left',
  'bottom-right': 'bottom right',
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  placeholder,
  blurDataURL,
  fit = 'cover',
  position = 'center',
  lazy = true,
  rootMargin = '200px',
  priority = false,
  showSkeleton = true,
  aspectRatio,
  fallbackSrc,
  fadeIn = true,
  fadeDuration = 300,
  onLoad,
  onError,
  className = '',
  containerClassName = '',
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, rootMargin, isInView]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;
    setCurrentSrc(src);
  }, [isInView, src]);

  // Handle load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle error
  const handleError = useCallback(() => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      onError?.(new Error(`Failed to load image: ${src}`));
    }
  }, [src, fallbackSrc, currentSrc, onError]);

  // Container styles
  const containerStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width,
    height,
    aspectRatio,
    ...style,
  };

  // Image styles
  const imageStyle: CSSProperties = {
    objectFit: fit,
    objectPosition: positionMap[position],
    transition: fadeIn ? `opacity ${fadeDuration}ms ease-in-out` : undefined,
    opacity: isLoaded ? 1 : 0,
  };

  // Placeholder/blur background
  const showPlaceholder = !isLoaded && (placeholder || blurDataURL);
  const placeholderStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${placeholder || blurDataURL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(20px)',
    transform: 'scale(1.1)',
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${containerClassName}`}
      style={containerStyle}
    >
      {/* Skeleton loader */}
      {showSkeleton && !isLoaded && !showPlaceholder && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Blur placeholder */}
      {showPlaceholder && (
        <div style={placeholderStyle} aria-hidden="true" />
      )}

      {/* Actual image */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          width={typeof width === 'number' ? width : undefined}
          height={typeof height === 'number' ? height : undefined}
          loading={lazy && !priority ? 'lazy' : undefined}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full ${className}`}
          style={imageStyle}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Responsive Image Component
// ============================================================================

export interface ImageSource {
  src: string;
  media?: string; // Media query
  width?: number;
  type?: string; // MIME type
}

export interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'src'> {
  /** Default source */
  src: string;
  /** Array of responsive sources */
  sources?: ImageSource[];
  /** Sizes attribute for responsive images */
  sizes?: string;
}

export function ResponsiveImage({
  src,
  sources = [],
  sizes,
  alt,
  ...props
}: ResponsiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  // Build srcSet from sources
  const srcSet = sources
    .filter(s => s.width)
    .map(s => `${s.src} ${s.width}w`)
    .join(', ');

  // Use picture element for art direction
  const hasMediaSources = sources.some(s => s.media);

  if (hasMediaSources) {
    return (
      <picture>
        {sources
          .filter(s => s.media)
          .map((source, i) => (
            <source
              key={i}
              srcSet={source.src}
              media={source.media}
              type={source.type}
            />
          ))}
        <OptimizedImage src={src} alt={alt} {...props} />
      </picture>
    );
  }

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      {...props}
      // @ts-ignore - srcSet is valid but not in our types
      srcSet={srcSet || undefined}
      sizes={sizes}
    />
  );
}

// ============================================================================
// Avatar Image Component
// ============================================================================

export interface AvatarImageProps {
  src?: string;
  alt: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallbackColor?: string;
  showInitials?: boolean;
  className?: string;
}

const avatarSizes = {
  xs: { container: 'w-6 h-6', text: 'text-xs' },
  sm: { container: 'w-8 h-8', text: 'text-sm' },
  md: { container: 'w-10 h-10', text: 'text-base' },
  lg: { container: 'w-12 h-12', text: 'text-lg' },
  xl: { container: 'w-16 h-16', text: 'text-xl' },
  '2xl': { container: 'w-24 h-24', text: 'text-3xl' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16',
    '#22C55E', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
    '#D946EF', '#EC4899', '#F43F5E',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function AvatarImage({
  src,
  alt,
  name,
  size = 'md',
  fallbackColor,
  showInitials = true,
  className = '',
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);
  const sizeConfig = avatarSizes[size];
  const initials = name ? getInitials(name) : '?';
  const bgColor = fallbackColor || (name ? getColorFromName(name) : '#9CA3AF');

  if (!src || hasError) {
    return (
      <div
        className={`
          ${sizeConfig.container}
          rounded-full flex items-center justify-center
          text-white font-semibold
          ${sizeConfig.text}
          ${className}
        `}
        style={{ backgroundColor: bgColor }}
        role="img"
        aria-label={alt}
      >
        {showInitials ? initials : null}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`${sizeConfig.container} rounded-full ${className}`}
      fit="cover"
      lazy
      showSkeleton
      onError={() => setHasError(true)}
    />
  );
}

// ============================================================================
// Background Image Component
// ============================================================================

export interface BackgroundImageProps {
  src: string;
  alt?: string;
  fit?: ImageFit;
  position?: ImagePosition;
  overlay?: string;
  blur?: number;
  children?: React.ReactNode;
  className?: string;
}

export function BackgroundImage({
  src,
  alt = '',
  fit = 'cover',
  position = 'center',
  overlay,
  blur,
  children,
  className = '',
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background image */}
      <div
        className={`
          absolute inset-0
          transition-opacity duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: fit,
          backgroundPosition: positionMap[position],
          filter: blur ? `blur(${blur}px)` : undefined,
          transform: blur ? 'scale(1.1)' : undefined,
        }}
        role="img"
        aria-label={alt}
      />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlay }}
        />
      )}

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ============================================================================
// Image Gallery with Lazy Loading
// ============================================================================

export interface GalleryImage {
  src: string;
  alt: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: number;
  aspectRatio?: string;
  onImageClick?: (image: GalleryImage, index: number) => void;
  className?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 16,
  aspectRatio = '1/1',
  onImageClick,
  className = '',
}: ImageGalleryProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <div
      className={`grid ${gridCols[columns]} ${className}`}
      style={{ gap }}
    >
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageClick?.(image, index)}
          className="relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          style={{ aspectRatio }}
        >
          <OptimizedImage
            src={image.thumbnail || image.src}
            alt={image.alt}
            fit="cover"
            lazy
            rootMargin="100px"
            className="w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </button>
      ))}
    </div>
  );
}

