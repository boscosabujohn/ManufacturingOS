'use client';

import React, { useState, useCallback } from 'react';

// Skip link target IDs
export const SKIP_TARGETS = {
  MAIN_CONTENT: 'main-content',
  NAVIGATION: 'main-navigation',
  SEARCH: 'search-input',
  FOOTER: 'main-footer',
} as const;

export type SkipTarget = typeof SKIP_TARGETS[keyof typeof SKIP_TARGETS];

export interface SkipLinkItem {
  id: string;
  label: string;
  targetId: string;
}

export interface SkipLinksProps {
  links?: SkipLinkItem[];
  className?: string;
}

// Default skip links
const defaultLinks: SkipLinkItem[] = [
  { id: 'skip-main', label: 'Skip to main content', targetId: SKIP_TARGETS.MAIN_CONTENT },
  { id: 'skip-nav', label: 'Skip to navigation', targetId: SKIP_TARGETS.NAVIGATION },
  { id: 'skip-search', label: 'Skip to search', targetId: SKIP_TARGETS.SEARCH },
];

export function SkipLinks({ links = defaultLinks, className = '' }: SkipLinksProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleClick = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      // Make the target focusable if it isn't already
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <nav
      aria-label="Skip links"
      className={`skip-links ${className}`}
    >
      <ul className="m-0 p-0 list-none">
        {links.map((link, index) => (
          <li key={link.id}>
            <a
              href={`#${link.targetId}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.targetId);
              }}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              className={`
                fixed top-0 left-0 z-[9999]
                px-4 py-3
                bg-blue-600 text-white
                font-semibold text-lg
                rounded-br-lg
                shadow-lg
                transform transition-transform duration-200
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
                ${focusedIndex === index ? 'translate-y-0' : '-translate-y-full'}
              `}
              style={{
                // Ensure it's above everything when focused
                clipPath: focusedIndex === index ? 'none' : 'inset(100% 100% 100% 100%)',
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* CSS for skip links - sr-only until focused */}
      <style jsx>{`
        .skip-links a:not(:focus) {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </nav>
  );
}

// Main content wrapper with skip target
export interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MainContent({ children, className = '' }: MainContentProps) {
  return (
    <main
      id={SKIP_TARGETS.MAIN_CONTENT}
      tabIndex={-1}
      className={`outline-none ${className}`}
      role="main"
    >
      {children}
    </main>
  );
}

// Navigation wrapper with skip target
export interface NavigationLandmarkProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export function NavigationLandmark({
  children,
  label = 'Main navigation',
  className = '',
}: NavigationLandmarkProps) {
  return (
    <nav
      id={SKIP_TARGETS.NAVIGATION}
      tabIndex={-1}
      aria-label={label}
      className={`outline-none ${className}`}
    >
      {children}
    </nav>
  );
}

// Search input wrapper with skip target
export interface SearchLandmarkProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export function SearchLandmark({
  children,
  label = 'Site search',
  className = '',
}: SearchLandmarkProps) {
  return (
    <search
      id={SKIP_TARGETS.SEARCH}
      tabIndex={-1}
      aria-label={label}
      className={`outline-none ${className}`}
    >
      {children}
    </search>
  );
}

// Footer landmark
export interface FooterLandmarkProps {
  children: React.ReactNode;
  className?: string;
}

export function FooterLandmark({ children, className = '' }: FooterLandmarkProps) {
  return (
    <footer
      id={SKIP_TARGETS.FOOTER}
      tabIndex={-1}
      className={`outline-none ${className}`}
      role="contentinfo"
    >
      {children}
    </footer>
  );
}

// Hook for programmatic skip link focus
export function useSkipToContent() {
  const skipTo = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return {
    skipToMain: () => skipTo(SKIP_TARGETS.MAIN_CONTENT),
    skipToNav: () => skipTo(SKIP_TARGETS.NAVIGATION),
    skipToSearch: () => skipTo(SKIP_TARGETS.SEARCH),
    skipToFooter: () => skipTo(SKIP_TARGETS.FOOTER),
    skipTo,
  };
}

