'use client'

import React, { useState, useMemo } from 'react'
import {
    Target,
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    CheckCircle,
    XCircle,
    Edit3,
    Trash2,
    Plus,
    FileText,
    Award
} from 'lucide-react'

// ... existing interfaces and mock data ...

export default function BonusSchemesPage() {
    // ... existing state and hook logic ...

    // Safe Date Handling
    const DateDisplay = ({ date, fallback = '-' }: { date?: string, fallback?: string }) => {
        const [mounted, setMounted] = useState(false)
        React.useEffect(() => setMounted(true), [])
        if (!mounted) return <span>{date || fallback}</span>
        return <span>{date ? new Date(date).toLocaleDateString('en-IN') : fallback}</span>
    }

    // ... rest of the component using <DateDisplay /> instead of direct formatting
}
