'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Settings,
  X,
  Check,
  Search,
  GripVertical,
  Eye,
  EyeOff,
  Star,
  RotateCcw,
  Save,
  Plus,
} from 'lucide-react';

// Types
export interface KPIDefinition {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon?: React.ReactNode;
  defaultVisible?: boolean;
  required?: boolean;
}

export interface KPIPreference {
  kpiId: string;
  visible: boolean;
  order: number;
  favorite?: boolean;
}

export interface KPICategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

// Storage key
const STORAGE_KEY_PREFIX = 'kpi-preferences-';

export interface KPIPersonalizationProps {
  isOpen: boolean;
  onClose: () => void;
  availableKPIs: KPIDefinition[];
  categories: KPICategory[];
  preferences: KPIPreference[];
  onSave: (preferences: KPIPreference[]) => void;
  storageKey?: string;
  maxVisible?: number;
  className?: string;
}

export function KPIPersonalization({
  isOpen,
  onClose,
  availableKPIs,
  categories,
  preferences: initialPreferences,
  onSave,
  storageKey = 'default',
  maxVisible,
  className = '',
}: KPIPersonalizationProps) {
  const [preferences, setPreferences] = useState<KPIPreference[]>(initialPreferences);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setPreferences(initialPreferences);
      setHasChanges(false);
    }
  }, [isOpen, initialPreferences]);

  // Get KPI by ID
  const getKPI = useCallback((kpiId: string) => {
    return availableKPIs.find(k => k.id === kpiId);
  }, [availableKPIs]);

  // Visible KPIs (sorted by order)
  const visibleKPIs = useMemo(() => {
    return preferences
      .filter(p => p.visible)
      .sort((a, b) => a.order - b.order)
      .map(p => ({
        preference: p,
        definition: getKPI(p.kpiId),
      }))
      .filter(item => item.definition);
  }, [preferences, getKPI]);

  // Available (hidden) KPIs
  const hiddenKPIs = useMemo(() => {
    const visibleIds = new Set(preferences.filter(p => p.visible).map(p => p.kpiId));
    return availableKPIs
      .filter(kpi => !visibleIds.has(kpi.id))
      .filter(kpi => {
        if (searchQuery) {
          return kpi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 kpi.description?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (selectedCategory !== 'all') {
          return kpi.category === selectedCategory;
        }
        return true;
      });
  }, [availableKPIs, preferences, searchQuery, selectedCategory]);

  // Toggle visibility
  const toggleVisibility = useCallback((kpiId: string) => {
    setPreferences(prev => {
      const existing = prev.find(p => p.kpiId === kpiId);
      if (existing) {
        return prev.map(p =>
          p.kpiId === kpiId
            ? { ...p, visible: !p.visible }
            : p
        );
      } else {
        // Add new preference
        const maxOrder = Math.max(0, ...prev.filter(p => p.visible).map(p => p.order));
        return [
          ...prev,
          { kpiId, visible: true, order: maxOrder + 1 },
        ];
      }
    });
    setHasChanges(true);
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((kpiId: string) => {
    setPreferences(prev =>
      prev.map(p =>
        p.kpiId === kpiId
          ? { ...p, favorite: !p.favorite }
          : p
      )
    );
    setHasChanges(true);
  }, []);

  // Remove KPI
  const removeKPI = useCallback((kpiId: string) => {
    const kpi = getKPI(kpiId);
    if (kpi?.required) return;

    setPreferences(prev =>
      prev.map(p =>
        p.kpiId === kpiId
          ? { ...p, visible: false }
          : p
      )
    );
    setHasChanges(true);
  }, [getKPI]);

  // Drag handlers
  const handleDragStart = useCallback((kpiId: string) => {
    setDraggedId(kpiId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    setPreferences(prev => {
      const items = [...prev].filter(p => p.visible);
      const draggedIndex = items.findIndex(p => p.kpiId === draggedId);
      const targetIndex = items.findIndex(p => p.kpiId === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const [removed] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, removed);

      // Update orders
      const reordered = items.map((item, index) => ({
        ...item,
        order: index,
      }));

      // Merge back with hidden items
      const hiddenItems = prev.filter(p => !p.visible);
      return [...reordered, ...hiddenItems];
    });
    setHasChanges(true);
  }, [draggedId]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  // Add KPI
  const addKPI = useCallback((kpiId: string) => {
    if (maxVisible && visibleKPIs.length >= maxVisible) {
      return; // Max visible reached
    }

    setPreferences(prev => {
      const existing = prev.find(p => p.kpiId === kpiId);
      const maxOrder = Math.max(0, ...prev.filter(p => p.visible).map(p => p.order));

      if (existing) {
        return prev.map(p =>
          p.kpiId === kpiId
            ? { ...p, visible: true, order: maxOrder + 1 }
            : p
        );
      } else {
        return [
          ...prev,
          { kpiId, visible: true, order: maxOrder + 1 },
        ];
      }
    });
    setHasChanges(true);
  }, [maxVisible, visibleKPIs.length]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const defaultPrefs = availableKPIs
      .filter(k => k.defaultVisible)
      .map((k, i) => ({
        kpiId: k.id,
        visible: true,
        order: i,
      }));
    setPreferences(defaultPrefs);
    setHasChanges(true);
  }, [availableKPIs]);

  // Save preferences
  const handleSave = useCallback(() => {
    onSave(preferences);
    localStorage.setItem(STORAGE_KEY_PREFIX + storageKey, JSON.stringify(preferences));
    setHasChanges(false);
    onClose();
  }, [preferences, onSave, storageKey, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-y-8 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 flex items-center justify-center">
        <div
          className={`w-full max-h-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Customize KPIs
                </h2>
                <p className="text-sm text-gray-500">
                  Choose which KPIs to display and their order
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Selected KPIs */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visible KPIs ({visibleKPIs.length}{maxVisible ? `/${maxVisible}` : ''})
                </h3>
                <p className="text-xs text-gray-500 mt-1">Drag to reorder</p>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {visibleKPIs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <EyeOff className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">No KPIs selected</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {visibleKPIs.map(({ preference, definition }) => (
                      <div
                        key={preference.kpiId}
                        draggable
                        onDragStart={() => handleDragStart(preference.kpiId)}
                        onDragOver={(e) => handleDragOver(e, preference.kpiId)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-move ${
                          draggedId === preference.kpiId ? 'opacity-50' : ''
                        }`}
                      >
                        <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />

                        {definition?.icon && (
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded">
                            {definition.icon}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {definition?.name}
                          </p>
                          {definition?.category && (
                            <p className="text-xs text-gray-500 truncate">
                              {categories.find(c => c.id === definition.category)?.name}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite(preference.kpiId)}
                            className={`p-1 rounded ${
                              preference.favorite
                                ? 'text-yellow-500'
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${preference.favorite ? 'fill-current' : ''}`} />
                          </button>

                          {!definition?.required && (
                            <button
                              onClick={() => removeKPI(preference.kpiId)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Available KPIs */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Available KPIs
                </h3>

                {/* Search */}
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search KPIs..."
                    className="w-full pl-9 pr-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1 mt-2 overflow-x-auto">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                        selectedCategory === cat.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {hiddenKPIs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Check className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">All KPIs are visible</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {hiddenKPIs.map(kpi => (
                      <button
                        key={kpi.id}
                        onClick={() => addKPI(kpi.id)}
                        disabled={maxVisible !== undefined && visibleKPIs.length >= maxVisible}
                        className="w-full flex items-center gap-2 p-2 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {kpi.icon && (
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded">
                            {kpi.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {kpi.name}
                          </p>
                          {kpi.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {kpi.description}
                            </p>
                          )}
                        </div>
                        <Plus className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook for managing KPI preferences
export function useKPIPreferences(
  availableKPIs: KPIDefinition[],
  storageKey: string = 'default'
) {
  const fullKey = STORAGE_KEY_PREFIX + storageKey;

  const [preferences, setPreferences] = useState<KPIPreference[]>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(fullKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (err) {
          console.error('Failed to parse KPI preferences:', err);
        }
      }
    }

    // Default preferences
    return availableKPIs
      .filter(k => k.defaultVisible)
      .map((k, i) => ({
        kpiId: k.id,
        visible: true,
        order: i,
      }));
  });

  const visibleKPIs = useMemo(() => {
    return preferences
      .filter(p => p.visible)
      .sort((a, b) => a.order - b.order)
      .map(p => p.kpiId);
  }, [preferences]);

  const updatePreferences = useCallback((newPreferences: KPIPreference[]) => {
    setPreferences(newPreferences);
    localStorage.setItem(fullKey, JSON.stringify(newPreferences));
  }, [fullKey]);

  const toggleKPI = useCallback((kpiId: string) => {
    setPreferences(prev => {
      const updated = prev.map(p =>
        p.kpiId === kpiId ? { ...p, visible: !p.visible } : p
      );
      localStorage.setItem(fullKey, JSON.stringify(updated));
      return updated;
    });
  }, [fullKey]);

  const resetToDefaults = useCallback(() => {
    const defaults = availableKPIs
      .filter(k => k.defaultVisible)
      .map((k, i) => ({
        kpiId: k.id,
        visible: true,
        order: i,
      }));
    setPreferences(defaults);
    localStorage.setItem(fullKey, JSON.stringify(defaults));
  }, [availableKPIs, fullKey]);

  return {
    preferences,
    visibleKPIs,
    updatePreferences,
    toggleKPI,
    resetToDefaults,
  };
}

