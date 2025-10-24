'use client'

import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface BreadcrumbTrailProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  homeHref?: string
  separator?: 'chevron' | 'slash' | 'dot'
  className?: string
}

/**
 * BreadcrumbTrail - Navigation breadcrumb component
 *
 * @example
 * <BreadcrumbTrail
 *   items={[
 *     { label: 'Support', href: '/support' },
 *     { label: 'Tickets', href: '/support/tickets' },
 *     { label: 'TKT-123' }
 *   ]}
 *   showHome
 * />
 */
export const BreadcrumbTrail: React.FC<BreadcrumbTrailProps> = ({
  items,
  showHome = false,
  homeHref = '/',
  separator = 'chevron',
  className = ''
}) => {
  const separators = {
    chevron: <ChevronRight className="h-4 w-4 text-gray-400" />,
    slash: <span className="text-gray-400">/</span>,
    dot: <span className="text-gray-400">•</span>
  }

  const Separator = () => (
    <span className="mx-2 flex items-center">
      {separators[separator]}
    </span>
  )

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center flex-wrap gap-1">
        {showHome && (
          <>
            <li>
              <Link
                href={homeHref}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Home</span>
              </Link>
            </li>
            {items.length > 0 && <Separator />}
          </>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const Icon = item.icon

          return (
            <React.Fragment key={index}>
              <li>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className={`flex items-center gap-1.5 text-sm ${isLast ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
              {!isLast && <Separator />}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
