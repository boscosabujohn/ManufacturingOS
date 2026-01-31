'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Plus, Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface SelectOption {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    addNewLabel?: string;
    addNewHref?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select an option...',
    addNewLabel = 'Add New Record',
    addNewHref,
    className,
    disabled = false,
    error = false,
}: SearchableSelectProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [options, searchQuery]);

    // Get selected option label
    const selectedOption = useMemo(() => {
        return options.find((opt) => opt.value === value);
    }, [options, value]);

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSearchQuery('');
            // Use setTimeout to ensure input is rendered before focusing
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    };

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleAddNew = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (addNewHref) {
            router.push(addNewHref);
        }
    };

    return (
        <div className={cn('relative w-full', className)} ref={containerRef}>
            {/* Trigger */}
            <div
                onClick={handleToggle}
                className={cn(
                    'flex items-center justify-between w-full min-h-[42px] px-4 py-2 text-sm bg-white border rounded-lg cursor-pointer transition-all duration-200',
                    isOpen ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-300',
                    error ? 'border-red-500' : '',
                    disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : 'hover:border-gray-400'
                )}
            >
                <span className={cn('truncate', !selectedOption ? 'text-gray-400' : 'text-gray-900')}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform duration-200', isOpen ? 'rotate-180' : '')} />
            </div>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transform origin-top">
                    {/* Search Input */}
                    <div className="flex items-center px-3 py-2 border-b border-gray-100">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 px-3 py-1 text-sm border-none focus:ring-0 placeholder-gray-400"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        {searchQuery && (
                            <X
                                className="w-4 h-4 text-gray-300 hover:text-gray-500 cursor-pointer"
                                onClick={() => setSearchQuery('')}
                            />
                        )}
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        'flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors',
                                        value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                                    )}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {value === option.value && <Check className="w-4 h-4" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-4 text-sm text-center text-gray-400 italic">
                                No results found
                            </div>
                        )}
                    </div>

                    {/* Add New Option */}
                    {addNewHref && (
                        <div
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 bg-gray-50 border-t border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors"
                        >
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                                <Plus className="w-3.5 h-3.5" />
                            </div>
                            {addNewLabel}
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </div>
    );
}
