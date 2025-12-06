'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  FileText,
  Users,
  Package,
  Factory,
  ShoppingCart,
  DollarSign,
  Truck,
  Settings,
  Clock,
  Filter,
  ChevronRight,
  Loader2,
} from 'lucide-react';

// Types
export type SearchCategory = 'all' | 'orders' | 'products' | 'customers' | 'vendors' | 'documents' | 'settings';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: SearchCategory;
  type: string;
  href: string;
  highlight?: string;
  meta?: Record<string, string>;
  timestamp?: Date;
}

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string, category: SearchCategory) => Promise<SearchResult[]>;
  onResultClick?: (result: SearchResult) => void;
  showFilters?: boolean;
  compact?: boolean;
}

// Category configuration
const categories: { id: SearchCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Search className="w-4 h-4" /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
  { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
  { id: 'vendors', label: 'Vendors', icon: <Truck className="w-4 h-4" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

const categoryIcons: Record<string, React.ReactNode> = {
  orders: <ShoppingCart className="w-4 h-4" />,
  products: <Package className="w-4 h-4" />,
  customers: <Users className="w-4 h-4" />,
  vendors: <Truck className="w-4 h-4" />,
  documents: <FileText className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
  production: <Factory className="w-4 h-4" />,
  accounts: <DollarSign className="w-4 h-4" />,
};

// Mock search function for demo
const mockSearch = async (query: string, category: SearchCategory): Promise<SearchResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!query.trim()) return [];

  const allResults: SearchResult[] = [
    { id: '1', title: 'SO-2024-001234', subtitle: 'Acme Corporation', category: 'orders', type: 'Sales Order', href: '/sales/orders/1234', meta: { status: 'In Progress', amount: '$45,000' } },
    { id: '2', title: 'PO-2024-005678', subtitle: 'Steel Supplies Inc', category: 'orders', type: 'Purchase Order', href: '/procurement/orders/5678', meta: { status: 'Pending', amount: '$12,500' } },
    { id: '3', title: 'Industrial Motor 5HP', subtitle: 'SKU: MOT-5HP-001', category: 'products', type: 'Product', href: '/inventory/items/mot-5hp', meta: { stock: '45 units' } },
    { id: '4', title: 'Stainless Steel Sheet', subtitle: 'SKU: SS-304-2MM', category: 'products', type: 'Raw Material', href: '/inventory/items/ss-304', meta: { stock: '120 kg' } },
    { id: '5', title: 'Acme Corporation', subtitle: 'Premium Customer', category: 'customers', type: 'Customer', href: '/crm/contacts/acme', meta: { orders: '45 orders' } },
    { id: '6', title: 'TechStart Industries', subtitle: 'New Lead', category: 'customers', type: 'Lead', href: '/crm/leads/techstart', meta: { value: '$150,000' } },
    { id: '7', title: 'Steel Supplies Inc', subtitle: 'Verified Supplier', category: 'vendors', type: 'Vendor', href: '/procurement/vendors/steel-supplies', meta: { rating: '4.8/5' } },
    { id: '8', title: 'Project Proposal - Q4', subtitle: 'PDF Document', category: 'documents', type: 'Document', href: '/documents/proposal-q4.pdf', meta: { size: '2.4 MB' } },
  ];

  const filtered = allResults.filter(r => {
    const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.subtitle?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'all' || r.category === category;
    return matchesQuery && matchesCategory;
  });

  return filtered;
};

export function GlobalSearch({
  className = '',
  placeholder = 'Search across all modules...',
  onSearch = mockSearch,
  onResultClick,
  showFilters = true,
  compact = false,
}: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('global-search-recent');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Save search to recent
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('global-search-recent', JSON.stringify(updated));
  }, [recentSearches]);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await onSearch(query, selectedCategory);
        setResults(searchResults);
      } catch (e) {
        console.error('Search failed:', e);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedCategory, onSearch]);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    if (onResultClick) {
      onResultClick(result);
    } else {
      router.push(result.href);
    }
    setIsOpen(false);
    setQuery('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group results by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach(result => {
      const cat = result.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(result);
    });
    return groups;
  }, [results]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className={`relative flex items-center ${compact ? '' : 'w-full max-w-xl'}`}>
        <div className="absolute left-3 text-gray-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            compact ? 'text-sm' : ''
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {/* Category Filters */}
          {showFilters && (
            <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedIndex(-1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {!query.trim() ? (
              // Recent Searches
              <div className="p-3">
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      <Clock className="w-3 h-3" />
                      Recent Searches
                    </div>
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuery(search);
                          setSelectedIndex(-1);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        <Clock className="w-3 h-3 text-gray-400" />
                        {search}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    Start typing to search across all modules
                  </div>
                )}
              </div>
            ) : results.length === 0 && !isLoading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </div>
            ) : (
              Object.entries(groupedResults).map(([category, categoryResults]) => (
                <div key={category} className="py-2">
                  <div className="px-4 py-1 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {categoryIcons[category] || <FileText className="w-3 h-3" />}
                    {category}
                    <span className="text-gray-400">({categoryResults.length})</span>
                  </div>
                  {categoryResults.map((result, i) => {
                    const globalIndex = results.indexOf(result);
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className={`flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                          {categoryIcons[result.category] || <FileText className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium truncate ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                              {result.title}
                            </span>
                            <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                              {result.type}
                            </span>
                          </div>
                          {result.subtitle && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {result.subtitle}
                            </div>
                          )}
                          {result.meta && (
                            <div className="flex items-center gap-3 mt-1">
                              {Object.entries(result.meta).map(([key, value]) => (
                                <span key={key} className="text-xs text-gray-400">
                                  {key}: <span className="text-gray-600 dark:text-gray-300">{value}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-500' : 'text-gray-300'}`} />
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{results.length} results</span>
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">↑↓</kbd>
                  Navigate
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px]">↵</kbd>
                  Select
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type { GlobalSearchProps };
