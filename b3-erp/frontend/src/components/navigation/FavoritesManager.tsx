'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Star,
  Plus,
  X,
  ChevronRight,
  GripVertical,
  Trash2,
  Edit2,
  Check,
  FileText,
  Folder,
} from 'lucide-react';

// Types
export interface FavoritePage {
  id: string;
  path: string;
  title: string;
  subtitle?: string;
  icon?: string;
  folder?: string;
  order: number;
  createdAt: number;
}

export interface FavoriteFolder {
  id: string;
  name: string;
  order: number;
}

interface FavoritesContextValue {
  favorites: FavoritePage[];
  folders: FavoriteFolder[];
  isFavorite: (path: string) => boolean;
  addFavorite: (page: Omit<FavoritePage, 'id' | 'order' | 'createdAt'>) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (page: Omit<FavoritePage, 'id' | 'order' | 'createdAt'>) => void;
  updateFavorite: (id: string, updates: Partial<FavoritePage>) => void;
  reorderFavorites: (favorites: FavoritePage[]) => void;
  addFolder: (name: string) => void;
  removeFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
}

interface FavoritesManagerProps {
  className?: string;
  variant?: 'dropdown' | 'sidebar' | 'panel';
  showFolders?: boolean;
  allowReorder?: boolean;
}

const STORAGE_KEY = 'manufacturingos-favorites';
const FOLDERS_KEY = 'manufacturingos-favorite-folders';

// Context
const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// Provider component
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritePage[]>([]);
  const [folders, setFolders] = useState<FavoriteFolder[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(STORAGE_KEY);
    const savedFolders = localStorage.getItem(FOLDERS_KEY);

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }

    if (savedFolders) {
      try {
        setFolders(JSON.parse(savedFolders));
      } catch (e) {
        console.error('Failed to parse folders:', e);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save folders to localStorage
  useEffect(() => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  }, [folders]);

  const isFavorite = useCallback((path: string) => {
    return favorites.some(f => f.path === path);
  }, [favorites]);

  const addFavorite = useCallback((page: Omit<FavoritePage, 'id' | 'order' | 'createdAt'>) => {
    setFavorites(prev => {
      if (prev.some(f => f.path === page.path)) {
        return prev; // Already exists
      }

      const maxOrder = prev.length > 0 ? Math.max(...prev.map(f => f.order)) : -1;
      const newFavorite: FavoritePage = {
        ...page,
        id: `fav-${Date.now()}`,
        order: maxOrder + 1,
        createdAt: Date.now(),
      };

      return [...prev, newFavorite];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, []);

  const toggleFavorite = useCallback((page: Omit<FavoritePage, 'id' | 'order' | 'createdAt'>) => {
    const existing = favorites.find(f => f.path === page.path);
    if (existing) {
      removeFavorite(existing.id);
    } else {
      addFavorite(page);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const updateFavorite = useCallback((id: string, updates: Partial<FavoritePage>) => {
    setFavorites(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const reorderFavorites = useCallback((newFavorites: FavoritePage[]) => {
    setFavorites(newFavorites.map((f, i) => ({ ...f, order: i })));
  }, []);

  const addFolder = useCallback((name: string) => {
    setFolders(prev => {
      const maxOrder = prev.length > 0 ? Math.max(...prev.map(f => f.order)) : -1;
      return [...prev, { id: `folder-${Date.now()}`, name, order: maxOrder + 1 }];
    });
  }, []);

  const removeFolder = useCallback((id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    // Remove folder reference from favorites
    setFavorites(prev => prev.map(f => f.folder === id ? { ...f, folder: undefined } : f));
  }, []);

  const renameFolder = useCallback((id: string, name: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name } : f));
  }, []);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      folders,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      updateFavorite,
      reorderFavorites,
      addFolder,
      removeFolder,
      renameFolder,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook to use favorites
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}

// Star button component
export function FavoriteButton({
  path,
  title,
  subtitle,
  icon,
  className = '',
}: {
  path: string;
  title: string;
  subtitle?: string;
  icon?: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isStarred = isFavorite(path);

  return (
    <button
      onClick={() => toggleFavorite({ path, title, subtitle, icon })}
      className={`transition-colors ${className} ${
        isStarred
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-gray-400 hover:text-yellow-500'
      }`}
      title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
    </button>
  );
}

// Main component
export function FavoritesManager({
  className = '',
  variant = 'dropdown',
  showFolders = false,
  allowReorder = false,
}: FavoritesManagerProps) {
  const { favorites, folders, removeFavorite, updateFavorite, addFolder, removeFolder, renameFolder } = useFavorites();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  // Sort favorites by order
  const sortedFavorites = [...favorites].sort((a, b) => a.order - b.order);

  // Group by folder
  const groupedFavorites = sortedFavorites.reduce((acc, fav) => {
    const folder = fav.folder || 'unfiled';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(fav);
    return acc;
  }, {} as Record<string, FavoritePage[]>);

  const handleStartEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditValue(currentTitle);
  };

  const handleSaveEdit = (id: string) => {
    if (editValue.trim()) {
      updateFavorite(id, { title: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolder(false);
    }
  };

  if (variant === 'sidebar') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3 h-3" />
            Favorites
          </h3>
        </div>
        <div className="space-y-0.5">
          {sortedFavorites.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
              No favorites yet
            </div>
          ) : (
            sortedFavorites.map(fav => (
              <Link
                key={fav.id}
                href={fav.path}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md group"
              >
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current flex-shrink-0" />
                <span className="truncate flex-1">{fav.title}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFavorite(fav.id);
                  }}
                  className="p-0.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </Link>
            ))
          )}
        </div>
      </div>
    );
  }

  if (variant === 'panel') {
    return (
      <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Favorites
          </h3>
          {showFolders && (
            <button
              onClick={() => setShowNewFolder(true)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Folder
            </button>
          )}
        </div>

        {/* New folder input */}
        {showNewFolder && (
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFolder();
                  if (e.key === 'Escape') setShowNewFolder(false);
                }}
              />
              <button
                onClick={handleAddFolder}
                className="p-1 text-green-600 hover:text-green-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowNewFolder(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedFavorites.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No favorites yet</p>
              <p className="text-sm mt-1">Click the star icon on any page to add it here</p>
            </div>
          ) : (
            sortedFavorites.map(fav => (
              <div
                key={fav.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                {allowReorder && (
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                )}
                <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {editingId === fav.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(fav.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(fav.id)}
                        className="p-1 text-green-600"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        href={fav.path}
                        className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {fav.title}
                      </Link>
                      {fav.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {fav.subtitle}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(fav.id, fav.title)}
                    className="p-1 text-gray-400 hover:text-blue-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Star className={`w-4 h-4 ${favorites.length > 0 ? 'text-yellow-500 fill-current' : ''}`} />
        <span className="hidden sm:inline">Favorites</span>
        {favorites.length > 0 && (
          <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {favorites.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Favorites
              </h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {sortedFavorites.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No favorites yet
                </div>
              ) : (
                sortedFavorites.map(fav => (
                  <Link
                    key={fav.id}
                    href={fav.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
                  >
                    <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate text-sm">
                        {fav.title}
                      </div>
                      {fav.subtitle && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {fav.subtitle}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export type { FavoritesManagerProps };
