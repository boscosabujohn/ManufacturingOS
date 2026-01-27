'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Types
export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  expandedGroups: Set<string>;
  searchQuery: string;
  isMobileOpen: boolean;
}

interface SidebarContextValue {
  state: SidebarState;
  toggleSidebar: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCollapse: () => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  toggleGroup: (groupId: string) => void;
  expandGroup: (groupId: string) => void;
  collapseGroup: (groupId: string) => void;
  collapseAllGroups: () => void;
  setSearchQuery: (query: string) => void;
  toggleMobile: () => void;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const STORAGE_KEY = 'manufacturingos-sidebar-state';

// Context
const SidebarContext = createContext<SidebarContextValue | null>(null);

// Helper to get initial state from localStorage
function getInitialState(): Partial<SidebarState> {
  if (typeof window === 'undefined') return {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        isCollapsed: parsed.isCollapsed ?? false,
        expandedGroups: new Set(parsed.expandedGroups ?? []),
      };
    }
  } catch (e) {
    console.error('Failed to parse sidebar state:', e);
  }
  return {};
}

// Provider component
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>({
    isOpen: true,
    isCollapsed: false,
    expandedGroups: new Set(),
    searchQuery: '',
    isMobileOpen: false,
  });

  // Load persisted state on mount
  useEffect(() => {
    const initial = getInitialState();
    setState(prev => ({
      ...prev,
      ...initial,
      expandedGroups: initial.expandedGroups ?? prev.expandedGroups,
    }));
  }, []);

  // Persist state to localStorage
  useEffect(() => {
    const toSave = {
      isCollapsed: state.isCollapsed,
      expandedGroups: Array.from(state.expandedGroups),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state.isCollapsed, state.expandedGroups]);

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && state.isMobileOpen) {
        setState(prev => ({ ...prev, isMobileOpen: false }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.isMobileOpen]);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const setIsOpen = useCallback((isOpen: boolean) => {
    setState(prev => ({ ...prev, isOpen }));
  }, []);

  const toggleCollapse = useCallback(() => {
    setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  const setIsCollapsed = useCallback((isCollapsed: boolean) => {
    setState(prev => ({ ...prev, isCollapsed }));
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedGroups);
      if (newExpanded.has(groupId)) {
        newExpanded.delete(groupId);
      } else {
        newExpanded.add(groupId);
      }
      return { ...prev, expandedGroups: newExpanded };
    });
  }, []);

  const expandGroup = useCallback((groupId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedGroups);
      newExpanded.add(groupId);
      return { ...prev, expandedGroups: newExpanded };
    });
  }, []);

  const collapseGroup = useCallback((groupId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedGroups);
      newExpanded.delete(groupId);
      return { ...prev, expandedGroups: newExpanded };
    });
  }, []);

  const collapseAllGroups = useCallback(() => {
    setState(prev => ({ ...prev, expandedGroups: new Set() }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setState(prev => ({ ...prev, searchQuery }));
  }, []);

  const toggleMobile = useCallback(() => {
    setState(prev => ({ ...prev, isMobileOpen: !prev.isMobileOpen }));
  }, []);

  const setIsMobileOpen = useCallback((isMobileOpen: boolean) => {
    setState(prev => ({ ...prev, isMobileOpen }));
  }, []);

  return (
    <SidebarContext.Provider value={{
      state,
      toggleSidebar,
      setIsOpen,
      toggleCollapse,
      setIsCollapsed,
      toggleGroup,
      expandGroup,
      collapseGroup,
      collapseAllGroups,
      setSearchQuery,
      toggleMobile,
      setIsMobileOpen,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Hook to use sidebar context
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

// Hook for just the collapse state
export function useSidebarCollapse() {
  const { state, toggleCollapse, setIsCollapsed } = useSidebar();
  return {
    isCollapsed: state.isCollapsed,
    toggleCollapse,
    setIsCollapsed,
  };
}

// Hook for just mobile state
export function useMobileSidebar() {
  const { state, toggleMobile, setIsMobileOpen } = useSidebar();
  return {
    isOpen: state.isMobileOpen,
    toggle: toggleMobile,
    setIsOpen: setIsMobileOpen,
  };
}

export type { SidebarContextValue };
