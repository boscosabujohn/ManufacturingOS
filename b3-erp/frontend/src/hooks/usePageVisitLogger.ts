import { useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface PageVisitMetadata {
  referrer?: string;
  userAgent?: string;
  screenResolution?: string;
  [key: string]: any;
}

export function usePageVisitLogger(pageUrl: string, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const logPageVisit = async () => {
      try {
        const metadata: PageVisitMetadata = {
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timestamp: new Date().toISOString(),
        };

        await apiClient.post('/crm/interactions/log-visit', {
          pageUrl,
          metadata,
        });

        console.log(`[Page Visit Logger] Logged visit to: ${pageUrl}`);
      } catch (error) {
        console.error('[Page Visit Logger] Failed to log page visit:', error);
      }
    };

    // Log the page visit
    logPageVisit();
  }, [pageUrl, enabled]);
}
