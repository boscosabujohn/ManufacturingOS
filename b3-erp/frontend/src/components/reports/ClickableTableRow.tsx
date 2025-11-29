'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ClickableTableRowProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    basePath?: string;
    id?: string;
    queryParam?: string;
}

export function ClickableTableRow({ children, onClick, className = '', basePath, id, queryParam }: ClickableTableRowProps) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (basePath && id) {
            if (queryParam) {
                router.push(`${basePath}?${queryParam}=${id}`);
            } else {
                router.push(`${basePath}/${id}`);
            }
        }
    };

    const isClickable = onClick || (basePath && id);
    const hoverClasses = isClickable ? 'cursor-pointer hover:bg-gray-50 transition-colors' : '';

    return (
        <tr
            className={`${hoverClasses} ${className}`}
            onClick={handleClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            {children}
        </tr>
    );
}

export default ClickableTableRow;
