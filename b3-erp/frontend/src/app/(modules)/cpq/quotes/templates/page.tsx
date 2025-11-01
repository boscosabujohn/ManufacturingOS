'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Copy,
  Star,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { TemplateModal, ViewTemplateModal, UseTemplateModal, FilterModal } from '@/components/cpq/QuoteTemplateModals'

interface QuoteTemplate {
  id: string
  name: string
  description: string
  category: string
  sections: number
  lastUsed: string
  usageCount: number
  isFavorite: boolean
  status: 'active' | 'inactive'
}

export default function CPQQuotesTemplatesPage() {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUseModalOpen, setIsUseModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null)
  const [appliedFilters, setAppliedFilters] = useState<any>(null)

  const [templates, setTemplates] = useState<QuoteTemplate[]>([
    {
      id: 'TPL-001',
      name: 'Premium Kitchen Package',
      description: 'Complete template for premium modular kitchen quotations',
      category: 'Premium',
      sections: 8,
      lastUsed: '2024-10-18',
      usageCount: 234,
      isFavorite: true,
      status: 'active'
    },
    {
      id: 'TPL-002',
      name: 'L-Shaped Kitchen Standard',
      description: 'Standard quotation template for L-shaped kitchen layouts',
      category: 'Standard',
      sections: 6,
      lastUsed: '2024-10-17',
      usageCount: 187,
      isFavorite: true,
      status: 'active'
    },
    {
      id: 'TPL-003',
      name: 'Island Kitchen Deluxe',
      description: 'Comprehensive template for island kitchen configurations',
      category: 'Deluxe',
      sections: 10,
      lastUsed: '2024-10-15',
      usageCount: 145,
      isFavorite: false,
      status: 'active'
    },
    {
      id: 'TPL-004',
      name: 'Builder Economy Package',
      description: 'Quick quote template for builder economy projects',
      category: 'Economy',
      sections: 5,
      lastUsed: '2024-10-12',
      usageCount: 312,
      isFavorite: true,
      status: 'active'
    },
    {
      id: 'TPL-005',
      name: 'Straight Kitchen Basic',
      description: 'Simple template for straight kitchen layouts',
      category: 'Basic',
      sections: 4,
      lastUsed: '2024-10-10',
      usageCount: 98,
      isFavorite: false,
      status: 'active'
    },
    {
      id: 'TPL-006',
      name: 'Custom Design Package',
      description: 'Flexible template for custom kitchen designs',
      category: 'Custom',
      sections: 12,
      lastUsed: '2024-10-08',
      usageCount: 67,
      isFavorite: false,
      status: 'active'
    },
    {
      id: 'TPL-007',
      name: 'Renovation Quote',
      description: 'Template for kitchen renovation projects',
      category: 'Renovation',
      sections: 7,
      lastUsed: '2024-09-25',
      usageCount: 45,
      isFavorite: false,
      status: 'inactive'
    }
  ])

  const getCategoryColor = (category: string) => {
    const colors: any = {
      Premium: 'bg-purple-100 text-purple-700 border-purple-200',
      Deluxe: 'bg-blue-100 text-blue-700 border-blue-200',
      Standard: 'bg-green-100 text-green-700 border-green-200',
      Economy: 'bg-orange-100 text-orange-700 border-orange-200',
      Basic: 'bg-gray-100 text-gray-700 border-gray-200',
      Custom: 'bg-pink-100 text-pink-700 border-pink-200',
      Renovation: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
    return colors[category] || colors.Standard
  }

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-gray-100 text-gray-700 border-gray-200'
  }

  // Handlers
  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setIsTemplateModalOpen(true)
  }

  const handleEditTemplate = (template: QuoteTemplate) => {
    setSelectedTemplate(template)
    setIsTemplateModalOpen(true)
  }

  const handleViewTemplate = (template: QuoteTemplate) => {
    setSelectedTemplate(template)
    setIsViewModalOpen(true)
  }

  const handleUseTemplate = (template: QuoteTemplate) => {
    setSelectedTemplate(template)
    setIsUseModalOpen(true)
  }

  const handleDuplicateTemplate = (template: QuoteTemplate) => {
    const duplicated: QuoteTemplate = {
      ...template,
      id: `TPL-${Date.now().toString().slice(-3)}`,
      name: `${template.name} (Copy)`,
      usageCount: 0,
      lastUsed: new Date().toISOString().split('T')[0]
    }
    setTemplates([...templates, duplicated])
    setIsViewModalOpen(false)
  }

  const handleSaveTemplate = (template: QuoteTemplate) => {
    if (selectedTemplate) {
      // Edit existing template
      setTemplates(templates.map(t =>
        t.id === template.id ? template : t
      ))
    } else {
      // Add new template
      setTemplates([...templates, template])
    }
    setIsTemplateModalOpen(false)
    setSelectedTemplate(null)
  }

  const handleToggleFavorite = (template: QuoteTemplate) => {
    setTemplates(templates.map(t =>
      t.id === template.id ? { ...t, isFavorite: !t.isFavorite } : t
    ))
  }

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Description', 'Category', 'Sections', 'Usage Count', 'Last Used', 'Status', 'Favorite']
    const csvData = filteredTemplates.map(template => [
      template.id,
      `"${template.name}"`,
      `"${template.description}"`,
      template.category,
      template.sections,
      template.usageCount,
      template.lastUsed,
      template.status,
      template.isFavorite ? 'Yes' : 'No'
    ])

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quote-templates-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategoryFilter(category)
  }

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters)
  }

  const handleConfirmUseTemplate = (quoteData: any) => {
    // Simulate creating a quote and navigating
    console.log('Creating quote from template:', quoteData)
    setIsUseModalOpen(false)
    // In a real app, this would navigate to the quote builder with pre-filled data
    // router.push(`/cpq/quotes/create?templateId=${quoteData.templateId}`)
  }

  // Filtering logic
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategoryFilter === null ||
      (selectedCategoryFilter === 'Favorites' ? template.isFavorite : template.category === selectedCategoryFilter)

    let matchesAdvancedFilters = true
    if (appliedFilters) {
      if (appliedFilters.categories.length > 0 && !appliedFilters.categories.includes(template.category)) {
        matchesAdvancedFilters = false
      }
      if (appliedFilters.status.length > 0 && !appliedFilters.status.includes(template.status)) {
        matchesAdvancedFilters = false
      }
      if (appliedFilters.favorites && !template.isFavorite) {
        matchesAdvancedFilters = false
      }
      if (appliedFilters.usageRange.min > 0 && template.usageCount < appliedFilters.usageRange.min) {
        matchesAdvancedFilters = false
      }
      if (appliedFilters.usageRange.max > 0 && template.usageCount > appliedFilters.usageRange.max) {
        matchesAdvancedFilters = false
      }
    }

    return matchesSearch && matchesCategory && matchesAdvancedFilters
  })

  const favorites = filteredTemplates.filter(t => t.isFavorite)
  const totalUsage = filteredTemplates.reduce((sum, t) => sum + t.usageCount, 0)

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFilterModalOpen(true)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button onClick={handleExport} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button onClick={handleCreateTemplate} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Templates</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{filteredTemplates.length}</p>
              <p className="text-xs text-blue-700 mt-1">{searchQuery || selectedCategoryFilter || appliedFilters ? 'Matching filter' : 'Available templates'}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Active</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {filteredTemplates.filter(t => t.status === 'active').length}
              </p>
              <p className="text-xs text-green-700 mt-1">In use</p>
            </div>
            <ToggleRight className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Favorites</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{favorites.length}</p>
              <p className="text-xs text-purple-700 mt-1">Most used</p>
            </div>
            <Star className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Usage</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{totalUsage}</p>
              <p className="text-xs text-orange-700 mt-1">Times used</p>
            </div>
            <Copy className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button onClick={() => handleCategoryFilter(null)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
          selectedCategoryFilter === null
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          All Templates ({templates.length})
        </button>
        <button onClick={() => handleCategoryFilter('Premium')} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
          selectedCategoryFilter === 'Premium'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          Premium ({templates.filter(t => t.category === 'Premium').length})
        </button>
        <button onClick={() => handleCategoryFilter('Standard')} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
          selectedCategoryFilter === 'Standard'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          Standard ({templates.filter(t => t.category === 'Standard').length})
        </button>
        <button onClick={() => handleCategoryFilter('Economy')} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
          selectedCategoryFilter === 'Economy'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          Economy ({templates.filter(t => t.category === 'Economy').length})
        </button>
        <button onClick={() => handleCategoryFilter('Favorites')} className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
          selectedCategoryFilter === 'Favorites'
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}>
          Favorites ({favorites.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500 mb-2">No templates found</p>
            <p className="text-sm text-gray-400 mb-4">
              {searchQuery || selectedCategoryFilter || appliedFilters
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first quote template'}
            </p>
            {!searchQuery && !selectedCategoryFilter && !appliedFilters && (
              <button onClick={handleCreateTemplate} className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </button>
            )}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">{template.name}</h3>
                    <button
                      onClick={() => handleToggleFavorite(template)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star className={`h-4 w-4 ${template.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">{template.id}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500">Sections</p>
                  <p className="font-semibold text-gray-900">{template.sections}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500">Usage</p>
                  <p className="font-semibold text-gray-900">{template.usageCount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
                <span>Last used: {new Date(template.lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                <span className={`px-2 py-0.5 rounded-full border ${getStatusColor(template.status)}`}>
                  {template.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleUseTemplate(template)} className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                  <Plus className="h-3 w-3" />
                  Use Template
                </button>
                <button
                  onClick={() => handleViewTemplate(template)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  aria-label="View"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  aria-label="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  aria-label="Copy"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Template Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quote Template Features:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Pre-configured Sections:</strong> Standard sections like customer info, line items, terms & conditions</li>
          <li><strong>Customizable Fields:</strong> Add or remove fields based on project requirements</li>
          <li><strong>Pricing Rules:</strong> Templates can include pre-defined pricing rules and discounts</li>
          <li><strong>Branding:</strong> Each template maintains consistent company branding and formatting</li>
        </ul>
      </div>

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
        template={selectedTemplate}
      />

      <ViewTemplateModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        template={selectedTemplate}
        onEdit={() => {
          setIsViewModalOpen(false)
          setIsTemplateModalOpen(true)
        }}
        onUse={() => {
          setIsViewModalOpen(false)
          setIsUseModalOpen(true)
        }}
        onDuplicate={() => selectedTemplate && handleDuplicateTemplate(selectedTemplate)}
      />

      <UseTemplateModal
        isOpen={isUseModalOpen}
        onClose={() => setIsUseModalOpen(false)}
        template={selectedTemplate}
        onConfirm={handleConfirmUseTemplate}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />
    </div>
  )
}
