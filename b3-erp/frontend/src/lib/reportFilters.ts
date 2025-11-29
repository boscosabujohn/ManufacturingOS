import { useRouter, useSearchParams } from 'next/navigation';

export interface ReportFilters {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    category?: string;
    [key: string]: string | undefined;
}

/**
 * Utility functions for managing report filters and drill-down navigation
 */

/**
 * Preserve current filters when navigating to a drill-down page
 */
export function preserveFilters(newUrl: string, currentFilters: ReportFilters): string {
    const params = new URLSearchParams();

    Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, value);
        }
    });

    const queryString = params.toString();
    return queryString ? `${newUrl}?${queryString}` : newUrl;
}

/**
 * Get filters from URL search params
 */
export function getFiltersFromUrl(searchParams: URLSearchParams): ReportFilters {
    const filters: ReportFilters = {};

    searchParams.forEach((value, key) => {
        filters[key] = value;
    });

    return filters;
}

/**
 * Create a drill-down URL with preserved filters
 */
export function createDrillDownUrl(
    baseUrl: string,
    additionalParams: Record<string, string | number>,
    currentFilters?: ReportFilters
): string {
    const params = new URLSearchParams();

    // Add current filters
    if (currentFilters) {
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
    }

    // Add additional drill-down params
    Object.entries(additionalParams).forEach(([key, value]) => {
        params.set(key, String(value));
    });

    return `${baseUrl}?${params.toString()}`;
}

/**
 * Hook for drill-down navigation with filter preservation
 */
export function useDrillDown() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentFilters = getFiltersFromUrl(searchParams);

    const navigateTo = (url: string, additionalParams?: Record<string, string | number>) => {
        const targetUrl = additionalParams
            ? createDrillDownUrl(url, additionalParams, currentFilters)
            : preserveFilters(url, currentFilters);

        router.push(targetUrl);
    };

    const navigateBack = () => {
        router.back();
    };

    return {
        currentFilters,
        navigateTo,
        navigateBack,
    };
}

/**
 * Format filters for display
 */
export function formatFilterDisplay(filters: ReportFilters): string[] {
    const display: string[] = [];

    if (filters.dateFrom && filters.dateTo) {
        display.push(`${filters.dateFrom} to ${filters.dateTo}`);
    }

    if (filters.status) {
        display.push(`Status: ${filters.status}`);
    }

    if (filters.category) {
        display.push(`Category: ${filters.category}`);
    }

    return display;
}
