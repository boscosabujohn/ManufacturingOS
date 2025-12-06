'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  ChevronRight,
  Command,
} from 'lucide-react';

// Types
export interface SearchableMenuItem {
  id: string;
  name: string;
  href?: string;
  description?: string;
  parentPath?: string[];
  icon?: React.ReactNode;
}

interface SidebarSearchProps {
  className?: string;
  placeholder?: string;
  items: SearchableMenuItem[];
  onSelect?: (item: SearchableMenuItem) => void;
  onQueryChange?: (query: string) => void;
  showShortcut?: boolean;
  maxResults?: number;
}

export function SidebarSearch({
  className = '',
  placeholder = 'Search menu...',
  items,
  onSelect,
  onQueryChange,
  showShortcut = true,
  maxResults = 10,
}: SidebarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const matches = items.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(lowerQuery);
      const descMatch = item.description?.toLowerCase().includes(lowerQuery);
      const pathMatch = item.parentPath?.some(p => p.toLowerCase().includes(lowerQuery));
      return nameMatch || descMatch || pathMatch;
    });

    // Sort by relevance (exact match first, then starts with, then contains)
    matches.sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();

      if (aLower === lowerQuery) return -1;
      if (bLower === lowerQuery) return 1;
      if (aLower.startsWith(lowerQuery)) return -1;
      if (bLower.startsWith(lowerQuery)) return 1;
      return 0;
    });

    return matches.slice(0, maxResults);
  }, [query, items, maxResults]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setQuery('');
        setIsExpanded(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle item selection
  const handleSelect = (item: SearchableMenuItem) => {
    setQuery('');
    setIsExpanded(false);
    onSelect?.(item);
  };

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Notify parent of query changes
  useEffect(() => {
    onQueryChange?.(query);
  }, [query, onQueryChange]);

  // Global keyboard shortcut (/)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          inputRef.current?.focus();
          setIsExpanded(true);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsExpanded(true);
          }}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => {
            // Delay to allow click on results
            setTimeout(() => setIsExpanded(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:bg-white dark:focus:bg-gray-900 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-colors"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        ) : showShortcut ? (
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
            /
          </kbd>
        ) : null}
      </div>

      {/* Results Dropdown */}
      {isExpanded && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              No menu items found
            </div>
          ) : (
            <div className="py-1 max-h-64 overflow-y-auto">
              {filteredItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className={`flex-shrink-0 ${index === selectedIndex ? 'text-blue-600' : 'text-gray-400'}`}>
                    {item.icon || <Search className="w-4 h-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.name}</div>
                    {item.parentPath && item.parentPath.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.parentPath.map((p, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <ChevronRight className="w-3 h-3" />}
                            <span>{p}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                  {index === selectedIndex && (
                    <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{filteredItems.length} results</span>
              <span className="flex items-center gap-2">
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">↑↓</kbd>
                navigate
                <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">↵</kbd>
                select
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook to flatten menu items for search
export function useFlattenedMenuItems(menuItems: any[]): SearchableMenuItem[] {
  return useMemo(() => {
    const flattened: SearchableMenuItem[] = [];

    const flatten = (items: any[], parentPath: string[] = []) => {
      items.forEach(item => {
        if (item.href && item.href !== '#') {
          flattened.push({
            id: item.id,
            name: item.name,
            href: item.href,
            description: item.description,
            parentPath: parentPath.length > 0 ? parentPath : undefined,
          });
        }

        if (item.subItems) {
          flatten(item.subItems, [...parentPath, item.name]);
        }
      });
    };

    flatten(menuItems);
    return flattened;
  }, [menuItems]);
}

export type { SidebarSearchProps, SearchableMenuItem };
