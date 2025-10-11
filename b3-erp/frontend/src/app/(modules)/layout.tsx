'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return undefined;
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return <DashboardLayout pageTitle={getPageTitle()}>{children}</DashboardLayout>;
}
