'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Factory,
  ClipboardCheck,
  Package,
  QrCode,
  AlertTriangle,
  Clock,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  Wifi,
  WifiOff,
  Battery,
  Sun,
  Moon,
} from 'lucide-react';

interface ShopFloorLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  operatorName?: string;
  workstationId?: string;
}

/**
 * ShopFloorLayout - Main layout for shop floor tablet interface
 * Features large touch targets and simplified navigation for factory use
 */
export function ShopFloorLayout({
  children,
  title,
  showBackButton = false,
  onBack,
  operatorName = 'Operator',
  workstationId = 'WS-001'
}: ShopFloorLayoutProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Track online status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/shopfloor', icon: Factory },
    { id: 'tasks', label: 'My Tasks', href: '/shopfloor/tasks', icon: ClipboardCheck, badge: 3 },
    { id: 'scan', label: 'Scan', href: '/shopfloor/scan', icon: QrCode },
    { id: 'inventory', label: 'Materials', href: '/shopfloor/materials', icon: Package },
    { id: 'issues', label: 'Report Issue', href: '/shopfloor/issues', icon: AlertTriangle },
  ];

  const isNavActive = (href: string) => {
    if (href === '/shopfloor') return pathname === '/shopfloor';
    return pathname?.startsWith(href);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header - Simplified for shop floor */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={onBack || (() => window.history.back())}
                  className={`p-3 rounded-xl transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  style={{ minWidth: '48px', minHeight: '48px' }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {title || 'Shop Floor'}
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {workstationId}
                </p>
              </div>
            </div>

            {/* Right side - Status bar */}
            <div className="flex items-center gap-4">
              {/* Connection status */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isOnline
                  ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                  : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
              }`}>
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                <span className="text-sm font-medium hidden sm:block">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Time */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>

              {/* User menu */}
              <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                } text-white`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {operatorName}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Operator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation - Large touch targets */}
      <nav className={`sticky bottom-0 z-40 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t safe-area-inset-bottom`}>
        <div className="flex items-stretch h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavActive(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-colors ${
                  isActive
                    ? isDarkMode
                      ? 'bg-blue-900/50 text-blue-400'
                      : 'bg-blue-50 text-blue-600'
                    : isDarkMode
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-7 h-7 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default ShopFloorLayout;
