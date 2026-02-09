'use client'

import { useState } from 'react'
import {
    BookOpen,
    Search,
    FileText,
    CheckCircle,
    AlertCircle,
    HelpCircle,
    ChevronRight,
    Download
} from 'lucide-react'
import Link from 'next/link'

interface KnowledgeArticle {
    id: string
    title: string
    category: 'Manual' | 'Troubleshooting' | 'FAQ'
    description: string
    lastUpdated: string
    views: number
    tags: string[]
}

export default function KnowledgeBasePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<'All' | 'Manual' | 'Troubleshooting' | 'FAQ'>('All')

    const articles: KnowledgeArticle[] = [
        {
            id: 'KB-001',
            title: 'Hydraulic Press HP-500 Maintenance Manual',
            category: 'Manual',
            description: 'Complete guide for daily maintenance, fluid checks, and seal replacements.',
            lastUpdated: '2025-05-12',
            views: 1240,
            tags: ['HP-500', 'Maintenance', 'Hydraulic']
        },
        {
            id: 'KB-002',
            title: 'Common Error Codes for CM-350 CNC',
            category: 'Troubleshooting',
            description: 'Detailed explanation of spindle and axis error codes with resolution steps.',
            lastUpdated: '2025-08-20',
            views: 850,
            tags: ['CM-350', 'CNC', 'Errors']
        },
        {
            id: 'KB-003',
            title: 'Warranty Policy FAQ',
            category: 'FAQ',
            description: 'Frequently asked questions regarding international warranty coverage and claims.',
            lastUpdated: '2025-01-10',
            views: 2100,
            tags: ['Warranty', 'Policy']
        },
        {
            id: 'KB-004',
            title: 'Conveyor Belt Alignment Procedure',
            category: 'Manual',
            description: 'Step-by-step procedure for aligning CS-200 series conveyor belts.',
            lastUpdated: '2025-09-05',
            views: 430,
            tags: ['CS-200', 'Alignment']
        },
        {
            id: 'KB-005',
            title: 'Spindle Overheating Resolution',
            category: 'Troubleshooting',
            description: 'Emergency steps to take when motor temperature exceeds 80°C.',
            lastUpdated: '2025-10-15',
            views: 1120,
            tags: ['Overheating', 'Spindle', 'Emergency']
        }
    ]

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            Knowledge Base
                        </h1>
                        <p className="text-gray-600 mt-2">Access repair manuals, troubleshooting guides, and FAQs</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles, tags, or equipment..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {['All', 'Manual', 'Troubleshooting', 'FAQ'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat as any)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                        <div key={article.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col group">
                            <div className="p-6 flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${article.category === 'Manual' ? 'bg-green-100 text-green-700' :
                                            article.category === 'Troubleshooting' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {article.category}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {article.id}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                    {article.description}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-4">
                                    {article.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded uppercase tracking-wider font-semibold">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex items-center justify-between">
                                <span className="text-xs text-gray-500">Updated: {article.lastUpdated}</span>
                                <Link
                                    href={`/after-sales-service/knowledge/articles/${article.id}`}
                                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                                >
                                    Read Now
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <div className="py-20 text-center">
                        <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600">No articles found matching your criteria</h2>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
                            className="text-blue-600 mt-2 hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Can't find what you're looking for?</h2>
                        <p className="text-blue-100">Our technical experts are available 24/7 to assist you with complex repairs.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                            Open Support Ticket
                        </button>
                        <button className="px-6 py-3 bg-blue-500/30 text-white border border-blue-400/50 rounded-xl font-bold hover:bg-blue-500/50 transition-colors">
                            Request Manual
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
