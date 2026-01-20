'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { usePathname } from 'next/navigation';
import { NotificationProvider } from '@/context/NotificationContext';
import { ToastProvider } from '@/components/ui/Toast';
import { EnhancedToastProvider } from '@/components/ui/EnhancedToast';

export default function RFQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Generate page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      return segments
        .map(segment => segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        )
        .join(' - ');
    }
    return 'RFQ Management';
  };

  return (
    <NotificationProvider>
      <EnhancedToastProvider>
        <ToastProvider>
          <DashboardLayout pageTitle={getPageTitle()}>
            {children}
          </DashboardLayout>
        </ToastProvider>
      </EnhancedToastProvider>
    </NotificationProvider>
  );
}
