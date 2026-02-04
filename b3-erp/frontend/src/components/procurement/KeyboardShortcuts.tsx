'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Command, Search, Plus, Save, RefreshCw, Printer, Download, Upload, X, HelpCircle } from 'lucide-react'

// ============= Keyboard Shortcuts Hook =============
interface Shortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  action: () => void
  description: string
  category: string
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement

      // Don't trigger shortcuts when typing in inputs
      if (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const ctrlPressed = event.ctrlKey || event.metaKey
        const altPressed = event.altKey
        const shiftPressed = event.shiftKey

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!shortcut.ctrl || ctrlPressed) &&
          (!shortcut.alt || altPressed) &&
          (!shortcut.shift || shiftPressed)
        ) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// ============= Global Procurement Shortcuts =============
export const useProcurementShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const shortcuts: Shortcut[] = [
    // Navigation
    {
      key: 'h',
      ctrl: true,
      action: () => window.location.href = '/procurement',
      description: 'Go to Procurement Home',
      category: 'Navigation'
    },
    {
      key: 'v',
      ctrl: true,
      action: () => window.location.href = '/procurement/vendors',
      description: 'Go to Vendors',
      category: 'Navigation'
    },
    {
      key: 'p',
      ctrl: true,
      action: () => window.location.href = '/procurement/purchase-orders',
      description: 'Go to Purchase Orders',
      category: 'Navigation'
    },
    {
      key: 'r',
      ctrl: true,
      action: () => window.location.href = '/procurement/requisitions',
      description: 'Go to Requisitions',
      category: 'Navigation'
    },
    {
      key: 'q',
      ctrl: true,
      action: () => window.location.href = '/procurement/rfq',
      description: 'Go to RFQ',
      category: 'Navigation'
    },
    {
      key: 'g',
      ctrl: true,
      action: () => window.location.href = '/procurement/grn',
      description: 'Go to GRN',
      category: 'Navigation'
    },
    {
      key: 'a',
      ctrl: true,
      action: () => window.location.href = '/procurement/analytics',
      description: 'Go to Analytics',
      category: 'Navigation'
    },

    // Actions
    {
      key: 'n',
      ctrl: true,
      action: () => {
        const addButton = document.querySelector('[data-shortcut="add"]') as HTMLElement
        addButton?.click()
      },
      description: 'Create New Item',
      category: 'Actions'
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        const saveButton = document.querySelector('[data-shortcut="save"]') as HTMLElement
        saveButton?.click()
      },
      description: 'Save Current Form',
      category: 'Actions'
    },
    {
      key: 'f',
      ctrl: true,
      action: () => setShowSearch(true),
      description: 'Open Search',
      category: 'Actions'
    },
    {
      key: 'Escape',
      action: () => {
        setShowSearch(false)
        setShowHelp(false)
        const modal = document.querySelector('[role="dialog"]')
        const closeButton = modal?.querySelector('[aria-label*="Close"]') as HTMLElement
        closeButton?.click()
      },
      description: 'Close Modal/Search',
      category: 'Actions'
    },

    // Data Actions
    {
      key: 'F5',
      action: () => {
        const refreshButton = document.querySelector('[data-shortcut="refresh"]') as HTMLElement
        refreshButton?.click(); if (!refreshButton) window.location.reload()
      },
      description: 'Refresh Data',
      category: 'Data'
    },
    {
      key: 'e',
      ctrl: true,
      action: () => {
        const exportButton = document.querySelector('[data-shortcut="export"]') as HTMLElement
        exportButton?.click()
      },
      description: 'Export Data',
      category: 'Data'
    },
    {
      key: 'i',
      ctrl: true,
      action: () => {
        const importButton = document.querySelector('[data-shortcut="import"]') as HTMLElement
        importButton?.click()
      },
      description: 'Import Data',
      category: 'Data'
    },
    {
      key: 'p',
      ctrl: true,
      shift: true,
      action: () => {
        const printButton = document.querySelector('[data-shortcut="print"]') as HTMLElement
        printButton?.click(); if (!printButton) window.print()
      },
      description: 'Print Current Page',
      category: 'Data'
    },

    // Help
    {
      key: '?',
      action: () => setShowHelp(true),
      description: 'Show Keyboard Shortcuts',
      category: 'Help'
    },
    {
      key: 'F1',
      action: () => setShowHelp(true),
      description: 'Show Help',
      category: 'Help'
    }
  ]

  useKeyboardShortcuts(shortcuts)

  return {
    shortcuts,
    showHelp,
    setShowHelp,
    showSearch,
    setShowSearch
  }
}

// ============= Quick Search Component =============
interface QuickSearchProps {
  isOpen: boolean
  onClose: () => void
}

export const QuickSearch: React.FC<QuickSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const searchItems = [
    { title: 'Vendors', url: '/procurement/vendors', type: 'page' },
    { title: 'Purchase Orders', url: '/procurement/purchase-orders', type: 'page' },
    { title: 'Requisitions', url: '/procurement/requisitions', type: 'page' },
    { title: 'RFQ', url: '/procurement/rfq', type: 'page' },
    { title: 'GRN', url: '/procurement/grn', type: 'page' },
    { title: 'Analytics', url: '/procurement/analytics', type: 'page' },
    { title: 'Contracts', url: '/procurement/contracts', type: 'page' },
    { title: 'Approvals', url: '/procurement/approvals', type: 'page' },
    { title: 'Invoices', url: '/procurement/invoices', type: 'page' },
    { title: 'Budget', url: '/procurement/budget', type: 'page' },
    { title: 'Create New Vendor', url: '/procurement/vendors/add', type: 'action' },
    { title: 'Create New PO', url: '/procurement/purchase-orders/add', type: 'action' },
    { title: 'Create New Requisition', url: '/procurement/requisitions/add', type: 'action' },
    { title: 'Create New RFQ', url: '/procurement/rfq/add', type: 'action' }
  ]

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setActiveIndex(0)
    } else {
      setResults(searchItems.slice(0, 8))
      setActiveIndex(0)
    }
  }, [query])

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex(prev => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        event.preventDefault()
        if (results[activeIndex]) {
          window.location.href = results[activeIndex].url
          onClose()
        }
        break
      case 'Escape':
        event.preventDefault()
        onClose()
        break
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, activeIndex, results])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-start justify-center pt-20">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pages, actions, and more..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {results.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  window.location.href = item.url
                  onClose()
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 ${
                  index === activeIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  item.type === 'page' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {item.type === 'page' ? <Search className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500 capitalize">{item.type}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+F</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============= Keyboard Shortcuts Help Modal =============
interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: Shortcut[]
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcuts
}) => {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = []
    }
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, Shortcut[]>)

  const formatShortcut = (shortcut: Shortcut) => {
    const keys = []
    if (shortcut.ctrl) keys.push('Ctrl')
    if (shortcut.alt) keys.push('Alt')
    if (shortcut.shift) keys.push('Shift')
    keys.push(shortcut.key === ' ' ? 'Space' : shortcut.key)
    return keys.join(' + ')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-3">
        <div className="bg-white rounded-lg shadow-xl w-full ">
          <div className="px-3 py-2 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close shortcuts help"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="px-3 py-2 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                          {formatShortcut(shortcut)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-3 py-2 border-t bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">?</kbd> or <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">F1</kbd> to show this help again</span>
              <span>Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============= Shortcut Indicator Component =============
export const ShortcutIndicator: React.FC<{ shortcut: string; className?: string }> = ({
  shortcut,
  className = ''
}) => {
  return (
    <kbd className={`ml-auto px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono ${className}`}>
      {shortcut}
    </kbd>
  )
}

// ============= Main Procurement Shortcuts Provider =============
export const ProcurementShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { shortcuts, showHelp, setShowHelp, showSearch, setShowSearch } = useProcurementShortcuts()

  return (
    <>
      {children}
      <QuickSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <KeyboardShortcutsHelp
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        shortcuts={shortcuts}
      />
    </>
  )
}