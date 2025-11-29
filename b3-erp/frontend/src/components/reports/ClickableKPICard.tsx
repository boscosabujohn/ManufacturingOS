import React from 'react';

interface ClickableKPICardProps {
    title: string;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
    color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
    description?: string;
    subtext?: string;
    trend?: string;
    trendUp?: boolean;
    onClick?: () => void;
    className?: string;
}

export function ClickableKPICard({
    title,
    value,
    icon: Icon,
    color = 'blue',
    description,
    subtext,
    trend,
    trendUp,
    onClick,
    className = '',
}: ClickableKPICardProps) {
    const colorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600',
        orange: 'text-orange-600',
        purple: 'text-purple-600',
    };

    const hoverClasses = onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200' : '';

    return (
        <div
            className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${hoverClasses} ${className}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
                    {description && (
                        <p className="text-xs text-gray-500 mt-2">{description}</p>
                    )}
                    {subtext && (
                        <p className="text-xs text-gray-500 mt-1">{subtext}</p>
                    )}
                    {trend && (
                        <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                            {trend}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`ml-4 ${colorClasses[color]}`}>
                        <Icon className="h-8 w-8" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClickableKPICard;
