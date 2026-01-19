'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { usePathname } from 'next/navigation';
import { NotificationProvider } from '@/context/NotificationContext';

export default function HRLayout({
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
        .slice(1)
        .map(segment => segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        )
        .join(' - ');
    }
    return 'HR Management';
  };

  return (
    <NotificationProvider>
      <DashboardLayout pageTitle={getPageTitle()}>
        {children}
      </DashboardLayout>
    </NotificationProvider>
  );
}
