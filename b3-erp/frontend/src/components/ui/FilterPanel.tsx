import React, { ReactNode, useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'select' | 'daterange' | 'search';
  options?: FilterOption[];
  placeholder?: string;
  defaultValue?: any;
}

export interface FilterPanelProps {
  filters: FilterGroup[];
  activeFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearAll: () => void;
  onApply?: () => void;
  className?: string;
  collapsible?: boolean;
  showApplyButton?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  onApply,
  className = '',
  collapsible = true,
  showApplyButton = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(filters.map(f => f.id))
  );

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const activeFilterCount = Object.keys(activeFilters).filter(
    key => activeFilters[key] !== undefined && activeFilters[key] !== '' &&
    (Array.isArray(activeFilters[key]) ? activeFilters[key].length > 0 : true)
  ).length;

  const renderFilterGroup = (group: FilterGroup) => {
    const isGroupExpanded = expandedGroups.has(group.id);

    return (
      <div key={group.id} className="border-b border-gray-200 last:border-b-0">
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(group.id)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">{group.label}</span>
          {isGroupExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Group Content */}
        {isGroupExpanded && (
          <div className="px-4 pb-4">
            {group.type === 'checkbox' && group.options && (
              <div className="space-y-2">
                {group.options.map((option) => {
                  const isChecked = Array.isArray(activeFilters[group.id])
                    ? activeFilters[group.id].includes(option.value)
                    : false;

                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentValues = activeFilters[group.id] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, option.value]
                            : currentValues.filter((v: any) => v !== option.value);
                          onFilterChange(group.id, newValues);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {option.label}
                      </span>
                      {option.count !== undefined && (
                        <span className="text-xs text-gray-500">({option.count})</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {group.type === 'radio' && group.options && (
              <div className="space-y-2">
                {group.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name={group.id}
                      checked={activeFilters[group.id] === option.value}
                      onChange={() => onFilterChange(group.id, option.value)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {option.label}
                    </span>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-500">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {group.type === 'select' && group.options && (
              <select
                value={activeFilters[group.id] || ''}
                onChange={(e) => onFilterChange(group.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">{group.placeholder || 'Select...'}</option>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {group.type === 'search' && (
              <input
                type="text"
                value={activeFilters[group.id] || ''}
                onChange={(e) => onFilterChange(group.id, e.target.value)}
                placeholder={group.placeholder || 'Search...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            )}

            {group.type === 'daterange' && (
              <div className="space-y-2">
                <input
                  type="date"
                  value={activeFilters[group.id]?.start || ''}
                  onChange={(e) =>
                    onFilterChange(group.id, {
                      ...activeFilters[group.id],
                      start: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={activeFilters[group.id]?.end || ''}
                  onChange={(e) =>
                    onFilterChange(group.id, {
                      ...activeFilters[group.id],
                      end: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="End date"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-base font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filter Groups */}
      {isExpanded && (
        <>
          <div className="max-h-96 overflow-y-auto">
            {filters.map(renderFilterGroup)}
          </div>

          {/* Apply Button */}
          {showApplyButton && onApply && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={onApply}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FilterPanel;
