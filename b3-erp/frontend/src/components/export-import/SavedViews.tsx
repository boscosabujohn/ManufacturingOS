'use client';

import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import {
  Bookmark,
  BookmarkPlus,
  MoreVertical,
  Trash2,
  Edit2,
  Check,
  X,
  Star,
  Lock,
  Globe,
  ChevronDown,
  Search,
  Clock,
} from 'lucide-react';

// Types
export interface ViewConfig {
  filters?: Record<string, any>;
  sort?: { column: string; direction: 'asc' | 'desc' };
  columns?: { id: string; visible: boolean; order: number }[];
  pageSize?: number;
  density?: 'compact' | 'normal' | 'comfortable';
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  config: ViewConfig;
  isDefault?: boolean;
  isShared?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// Storage key prefix
const STORAGE_KEY_PREFIX = 'saved-views-';

// SavedViews Context
interface SavedViewsContextValue {
  views: SavedView[];
  currentView: SavedView | null;
  saveView: (name: string, config: ViewConfig, description?: string) => SavedView;
  loadView: (viewId: string) => void;
  updateView: (viewId: string, updates: Partial<SavedView>) => void;
  deleteView: (viewId: string) => void;
  setDefaultView: (viewId: string | null) => void;
  resetToDefault: () => void;
}

const SavedViewsContext = createContext<SavedViewsContextValue | null>(null);

// Provider Props
interface SavedViewsProviderProps {
  children: React.ReactNode;
  storageKey: string;
  defaultConfig?: ViewConfig;
  onViewChange?: (view: SavedView | null) => void;
}

// Provider Component
export function SavedViewsProvider({
  children,
  storageKey,
  defaultConfig = {},
  onViewChange,
}: SavedViewsProviderProps) {
  const [views, setViews] = useState<SavedView[]>([]);
  const [currentView, setCurrentView] = useState<SavedView | null>(null);
  const fullStorageKey = STORAGE_KEY_PREFIX + storageKey;

  // Load views from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(fullStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const loadedViews = parsed.map((v: any) => ({
          ...v,
          createdAt: new Date(v.createdAt),
          updatedAt: new Date(v.updatedAt),
        }));
        setViews(loadedViews);

        // Load default view if exists
        const defaultView = loadedViews.find((v: SavedView) => v.isDefault);
        if (defaultView) {
          setCurrentView(defaultView);
          onViewChange?.(defaultView);
        }
      } catch (e) {
        console.error('Failed to load saved views:', e);
      }
    }
  }, [fullStorageKey, onViewChange]);

  // Save views to localStorage
  const persistViews = useCallback((newViews: SavedView[]) => {
    localStorage.setItem(fullStorageKey, JSON.stringify(newViews));
  }, [fullStorageKey]);

  // Save a new view
  const saveView = useCallback((name: string, config: ViewConfig, description?: string) => {
    const newView: SavedView = {
      id: `view-${Date.now()}`,
      name,
      description,
      config,
      isDefault: false,
      isShared: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setViews(prev => {
      const updated = [...prev, newView];
      persistViews(updated);
      return updated;
    });

    return newView;
  }, [persistViews]);

  // Load a view
  const loadView = useCallback((viewId: string) => {
    const view = views.find(v => v.id === viewId);
    if (view) {
      setCurrentView(view);
      onViewChange?.(view);
    }
  }, [views, onViewChange]);

  // Update a view
  const updateView = useCallback((viewId: string, updates: Partial<SavedView>) => {
    setViews(prev => {
      const updated = prev.map(v =>
        v.id === viewId
          ? { ...v, ...updates, updatedAt: new Date() }
          : v
      );
      persistViews(updated);

      // Update current view if it's the one being updated
      if (currentView?.id === viewId) {
        const updatedView = updated.find(v => v.id === viewId);
        if (updatedView) {
          setCurrentView(updatedView);
          onViewChange?.(updatedView);
        }
      }

      return updated;
    });
  }, [currentView, persistViews, onViewChange]);

  // Delete a view
  const deleteView = useCallback((viewId: string) => {
    setViews(prev => {
      const updated = prev.filter(v => v.id !== viewId);
      persistViews(updated);
      return updated;
    });

    if (currentView?.id === viewId) {
      setCurrentView(null);
      onViewChange?.(null);
    }
  }, [currentView, persistViews, onViewChange]);

  // Set default view
  const setDefaultView = useCallback((viewId: string | null) => {
    setViews(prev => {
      const updated = prev.map(v => ({
        ...v,
        isDefault: v.id === viewId,
      }));
      persistViews(updated);
      return updated;
    });
  }, [persistViews]);

  // Reset to default
  const resetToDefault = useCallback(() => {
    const defaultView = views.find(v => v.isDefault);
    if (defaultView) {
      setCurrentView(defaultView);
      onViewChange?.(defaultView);
    } else {
      setCurrentView(null);
      onViewChange?.(null);
    }
  }, [views, onViewChange]);

  return (
    <SavedViewsContext.Provider value={{
      views,
      currentView,
      saveView,
      loadView,
      updateView,
      deleteView,
      setDefaultView,
      resetToDefault,
    }}>
      {children}
    </SavedViewsContext.Provider>
  );
}

// Hook to use SavedViews context
export function useSavedViews() {
  const context = useContext(SavedViewsContext);
  if (!context) {
    throw new Error('useSavedViews must be used within a SavedViewsProvider');
  }
  return context;
}

// SavedViews Dropdown Component
interface SavedViewsDropdownProps {
  currentConfig: ViewConfig;
  className?: string;
  placement?: 'left' | 'right';
}

export function SavedViewsDropdown({
  currentConfig,
  className = '',
  placement = 'right',
}: SavedViewsDropdownProps) {
  const { views, currentView, saveView, loadView, updateView, deleteView, setDefaultView } = useSavedViews();
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [newViewDescription, setNewViewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredViews = views.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (newViewName.trim()) {
      saveView(newViewName.trim(), currentConfig, newViewDescription.trim() || undefined);
      setNewViewName('');
      setNewViewDescription('');
      setShowSaveDialog(false);
    }
  };

  const handleRename = (viewId: string) => {
    if (editName.trim()) {
      updateView(viewId, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
    }
  };

  const handleUpdateConfig = (viewId: string) => {
    updateView(viewId, { config: currentConfig });
    setActiveMenu(null);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bookmark className="w-4 h-4" />
        <span className="hidden sm:inline">
          {currentView ? currentView.name : 'Views'}
        </span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className={`absolute ${placement === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden`}>
            {/* Search */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search views..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Views List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredViews.length === 0 ? (
                <div className="px-4 py-2 text-center text-sm text-gray-500">
                  No saved views
                </div>
              ) : (
                filteredViews.map(view => (
                  <div
                    key={view.id}
                    className={`group flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      currentView?.id === view.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    {editingId === view.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(view.id)}
                          autoFocus
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
                        />
                        <button
                          onClick={() => handleRename(view.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            loadView(view.id);
                            setIsOpen(false);
                          }}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          {currentView?.id === view.id && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className={`text-sm truncate ${
                                currentView?.id === view.id
                                  ? 'font-medium text-blue-600 dark:text-blue-400'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {view.name}
                              </span>
                              {view.isDefault && (
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              )}
                              {view.isShared && (
                                <Globe className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                            {view.description && (
                              <p className="text-xs text-gray-500 truncate">{view.description}</p>
                            )}
                          </div>
                        </button>

                        {/* Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === view.id ? null : view.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenu === view.id && (
                            <>
                              <div className="fixed inset-0 z-50" onClick={() => setActiveMenu(null)} />
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                                <button
                                  onClick={() => {
                                    setEditingId(view.id);
                                    setEditName(view.name);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Rename
                                </button>
                                <button
                                  onClick={() => handleUpdateConfig(view.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Clock className="w-4 h-4" />
                                  Update
                                </button>
                                <button
                                  onClick={() => {
                                    setDefaultView(view.isDefault ? null : view.id);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <Star className="w-4 h-4" />
                                  {view.isDefault ? 'Unset Default' : 'Set as Default'}
                                </button>
                                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                <button
                                  onClick={() => {
                                    deleteView(view.id);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Save New View */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              {showSaveDialog ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                    placeholder="View name"
                    autoFocus
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={newViewDescription}
                    onChange={(e) => setNewViewDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      disabled={!newViewName.trim()}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg"
                    >
                      Save View
                    </button>
                    <button
                      onClick={() => {
                        setShowSaveDialog(false);
                        setNewViewName('');
                        setNewViewDescription('');
                      }}
                      className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  Save Current View
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// SavedViews Panel Component (for sidebar)
interface SavedViewsPanelProps {
  currentConfig: ViewConfig;
  className?: string;
}

export function SavedViewsPanel({
  currentConfig,
  className = '',
}: SavedViewsPanelProps) {
  const { views, currentView, saveView, loadView, deleteView, setDefaultView } = useSavedViews();
  const [newViewName, setNewViewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = () => {
    if (newViewName.trim()) {
      saveView(newViewName.trim(), currentConfig);
      setNewViewName('');
      setIsAdding(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Saved Views
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
        >
          <BookmarkPlus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder="View name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSave}
              disabled={!newViewName.trim()}
              className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewViewName('');
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {views.length === 0 ? (
          <div className="px-4 py-2 text-center text-sm text-gray-500">
            No saved views yet
          </div>
        ) : (
          views.map(view => (
            <div
              key={view.id}
              className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                currentView?.id === view.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <button
                onClick={() => loadView(view.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {view.isDefault ? (
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Bookmark className={`w-4 h-4 ${currentView?.id === view.id ? 'text-blue-600' : 'text-gray-400'}`} />
                )}
                <span className={`text-sm ${
                  currentView?.id === view.id
                    ? 'font-medium text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {view.name}
                </span>
              </button>
              <button
                onClick={() => setDefaultView(view.isDefault ? null : view.id)}
                className="p-1 text-gray-400 hover:text-yellow-500"
                title={view.isDefault ? 'Unset as default' : 'Set as default'}
              >
                <Star className={`w-4 h-4 ${view.isDefault ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              </button>
              <button
                onClick={() => deleteView(view.id)}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Delete view"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export type { SavedViewsDropdownProps, SavedViewsPanelProps };
