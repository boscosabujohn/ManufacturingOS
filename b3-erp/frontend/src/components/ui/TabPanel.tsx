'use client'

import React, { ReactNode } from 'react'

export interface Tab {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
  disabled?: boolean
  badge?: string
}

export interface TabPanelProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

/**
 * TabPanel - Tab navigation component
 *
 * @example
 * <TabPanel
 *   tabs={[
 *     { id: 'all', label: 'All Tickets', count: 87 },
 *     { id: 'open', label: 'Open', count: 45 },
 *     { id: 'resolved', label: 'Resolved', count: 42 }
 *   ]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 *   variant="pills"
 * />
 */
export const TabPanel: React.FC<TabPanelProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5'
  }

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700',
      activeTab: 'border-blue-600 text-blue-600'
    },
    pills: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: 'rounded-md hover:bg-gray-200 hover:text-gray-900',
      activeTab: 'bg-white shadow-sm text-gray-900'
    },
    underline: {
      container: 'space-x-8 border-b border-gray-200',
      tab: 'border-b-2 border-transparent pb-3 hover:border-gray-300',
      activeTab: 'border-blue-600 text-blue-600'
    }
  }

  const config = variantClasses[variant]

  return (
    <div className={`flex ${config.container} ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={`
              ${sizeClasses[size]}
              ${config.tab}
              ${isActive ? config.activeTab : 'text-gray-600'}
              ${fullWidth ? 'flex-1' : ''}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              font-medium transition-all duration-200
              flex items-center justify-center gap-2
            `}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`
                ml-1 px-2 py-0.5 text-xs font-semibold rounded-full
                ${isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-700'
                }
              `}>
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export interface TabContentProps {
  activeTab: string
  tabId: string
  children: ReactNode
  lazy?: boolean
}

/**
 * TabContent - Content container for TabPanel
 *
 * @example
 * <TabContent activeTab={activeTab} tabId="all">
 *   <div>All tickets content...</div>
 * </TabContent>
 */
export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  tabId,
  children,
  lazy = false
}) => {
  if (lazy && activeTab !== tabId) return null

  return (
    <div
      className={activeTab === tabId ? 'block' : 'hidden'}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
    >
      {children}
    </div>
  )
}
