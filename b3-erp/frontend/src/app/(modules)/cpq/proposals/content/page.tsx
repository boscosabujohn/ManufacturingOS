'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Image,
  Video,
  FileImage,
  Folder,
  BarChart3,
  TrendingUp,
  Download
} from 'lucide-react'

interface ContentItem {
  id: string
  name: string
  type: 'text' | 'image' | 'video' | 'document' | 'case-study' | 'specification'
  category: string
  description: string
  fileSize?: string
  usageCount: number
  lastUsed: string
  tags: string[]
  status: 'approved' | 'pending' | 'draft'
  createdBy: string
  createdDate: string
}

export default function CPQProposalsContentPage() {
  const router = useRouter()

  const [content] = useState<ContentItem[]>([
    {
      id: 'CNT-001',
      name: 'Premium Kitchen 3D Renders',
      type: 'image',
      category: 'Visualizations',
      description: 'High-quality 3D renders of premium modular kitchen designs',
      fileSize: '24.5 MB',
      usageCount: 156,
      lastUsed: '2024-10-18',
      tags: ['3D', 'Premium', 'Renders', 'Kitchen'],
      status: 'approved',
      createdBy: 'Design Team',
      createdDate: '2024-06-15'
    },
    {
      id: 'CNT-002',
      name: 'Company Profile & Capabilities',
      type: 'document',
      category: 'Company Info',
      description: 'Comprehensive company profile with capabilities, certifications, and achievements',
      fileSize: '3.2 MB',
      usageCount: 289,
      lastUsed: '2024-10-18',
      tags: ['Company', 'Profile', 'Certifications'],
      status: 'approved',
      createdBy: 'Marketing',
      createdDate: '2024-01-10'
    },
    {
      id: 'CNT-003',
      name: 'Material Specifications',
      type: 'specification',
      category: 'Technical',
      description: 'Detailed specifications for all materials used in kitchen manufacturing',
      fileSize: '1.8 MB',
      usageCount: 234,
      lastUsed: '2024-10-17',
      tags: ['Materials', 'Specifications', 'Technical'],
      status: 'approved',
      createdBy: 'Technical Team',
      createdDate: '2024-03-20'
    },
    {
      id: 'CNT-004',
      name: 'Customer Success Stories',
      type: 'case-study',
      category: 'Case Studies',
      description: 'Collection of successful project implementations with customer testimonials',
      fileSize: '8.7 MB',
      usageCount: 187,
      lastUsed: '2024-10-16',
      tags: ['Case Study', 'Success', 'Testimonials'],
      status: 'approved',
      createdBy: 'Marketing',
      createdDate: '2024-05-12'
    },
    {
      id: 'CNT-005',
      name: 'Installation Process Video',
      type: 'video',
      category: 'Process',
      description: 'Step-by-step video showing kitchen installation process',
      fileSize: '125 MB',
      usageCount: 145,
      lastUsed: '2024-10-15',
      tags: ['Video', 'Installation', 'Process'],
      status: 'approved',
      createdBy: 'Operations',
      createdDate: '2024-07-08'
    },
    {
      id: 'CNT-006',
      name: 'Warranty & Maintenance Terms',
      type: 'document',
      category: 'Legal',
      description: 'Standard warranty terms and maintenance guidelines',
      fileSize: '950 KB',
      usageCount: 312,
      lastUsed: '2024-10-18',
      tags: ['Warranty', 'Legal', 'Terms'],
      status: 'approved',
      createdBy: 'Legal',
      createdDate: '2024-02-05'
    },
    {
      id: 'CNT-007',
      name: 'L-Shaped Kitchen Designs',
      type: 'image',
      category: 'Visualizations',
      description: 'Gallery of L-shaped kitchen layout options and configurations',
      fileSize: '18.3 MB',
      usageCount: 198,
      lastUsed: '2024-10-17',
      tags: ['L-Shaped', 'Layouts', 'Designs'],
      status: 'approved',
      createdBy: 'Design Team',
      createdDate: '2024-06-22'
    },
    {
      id: 'CNT-008',
      name: 'Quality Certifications',
      type: 'document',
      category: 'Certifications',
      description: 'ISO certifications and quality compliance documents',
      fileSize: '2.1 MB',
      usageCount: 267,
      lastUsed: '2024-10-16',
      tags: ['ISO', 'Quality', 'Certifications'],
      status: 'approved',
      createdBy: 'Quality Team',
      createdDate: '2024-04-15'
    },
    {
      id: 'CNT-009',
      name: 'Sustainability Practices',
      type: 'text',
      category: 'Company Info',
      description: 'Overview of eco-friendly materials and sustainable manufacturing practices',
      usageCount: 124,
      lastUsed: '2024-10-14',
      tags: ['Sustainability', 'Eco-Friendly', 'Green'],
      status: 'approved',
      createdBy: 'Marketing',
      createdDate: '2024-08-01'
    },
    {
      id: 'CNT-010',
      name: 'Smart Kitchen Technologies',
      type: 'text',
      category: 'Technology',
      description: 'Information about smart appliances and IoT integration options',
      usageCount: 89,
      lastUsed: '2024-10-12',
      tags: ['Smart', 'Technology', 'IoT'],
      status: 'pending',
      createdBy: 'Product Team',
      createdDate: '2024-09-15'
    }
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />
      case 'video': return <Video className="h-5 w-5" />
      case 'document': return <FileText className="h-5 w-5" />
      case 'case-study': return <BarChart3 className="h-5 w-5" />
      case 'specification': return <FileImage className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    const colors: any = {
      text: 'bg-gray-100 text-gray-700 border-gray-200',
      image: 'bg-blue-100 text-blue-700 border-blue-200',
      video: 'bg-purple-100 text-purple-700 border-purple-200',
      document: 'bg-green-100 text-green-700 border-green-200',
      'case-study': 'bg-orange-100 text-orange-700 border-orange-200',
      specification: 'bg-pink-100 text-pink-700 border-pink-200'
    }
    return colors[type] || colors.document
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-orange-100 text-orange-700 border-orange-200',
      draft: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[status] || colors.draft
  }

  const totalContent = content.length
  const approvedContent = content.filter(c => c.status === 'approved').length
  const totalUsage = content.reduce((sum, c) => sum + c.usageCount, 0)
  const contentTypes = [...new Set(content.map(c => c.type))].length

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Action Buttons */}
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Organize
          </button>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Upload Content
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Content</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalContent}</p>
              <p className="text-xs text-blue-700 mt-1">Items available</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{approvedContent}</p>
              <p className="text-xs text-green-700 mt-1">Ready to use</p>
            </div>
            <Eye className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total Usage</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{totalUsage}</p>
              <p className="text-xs text-purple-700 mt-1">Times used</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Content Types</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">{contentTypes}</p>
              <p className="text-xs text-orange-700 mt-1">Different formats</p>
            </div>
            <Folder className="h-10 w-10 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap">
          All Content ({totalContent})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Images ({content.filter(c => c.type === 'image').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Documents ({content.filter(c => c.type === 'document').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Videos ({content.filter(c => c.type === 'video').length})
        </button>
        <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
          Case Studies ({content.filter(c => c.type === 'case-study').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search content by name, category, or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-lg border ${getTypeColor(item.type)}`}>
                {getTypeIcon(item.type)}
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{item.id} • {item.category}</p>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              {item.fileSize && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500">File Size</p>
                  <p className="font-semibold text-gray-900">{item.fileSize}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-500">Usage</p>
                <p className="font-semibold text-gray-900">{item.usageCount}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
              <span>Last used: {new Date(item.lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
              <span className="text-gray-500">by {item.createdBy}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1">
                <Plus className="h-3 w-3" />
                Add to Proposal
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                aria-label="View"
               
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                aria-label="Download"
               
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                aria-label="Edit"
               
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Content Library Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Content Library Features:</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li><strong>Centralized Storage:</strong> All proposal content in one searchable library</li>
          <li><strong>Version Control:</strong> Track content updates and maintain approval workflows</li>
          <li><strong>Usage Analytics:</strong> See which content performs best in winning proposals</li>
          <li><strong>Tag-Based Search:</strong> Quickly find relevant content using tags and categories</li>
          <li><strong>Multi-Format Support:</strong> Images, videos, documents, case studies, and specifications</li>
        </ul>
      </div>
    </div>
  )
}
