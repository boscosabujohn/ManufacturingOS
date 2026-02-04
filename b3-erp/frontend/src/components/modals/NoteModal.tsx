'use client'

import { useState, useEffect } from 'react'
import { X, FileText, FolderOpen, Lock, Unlock, Tag, BookmarkCheck, Briefcase, UserCircle } from 'lucide-react'

export interface Note {
  id?: string
  title: string
  content: string
  category: 'personal' | 'business' | 'follow-up'
  privacy: 'private' | 'shared'
  tags?: string[]
}

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: Note) => void
  note?: Note
  mode?: 'add' | 'edit'
}

const categoryConfig = {
  personal: { icon: UserCircle, label: 'Personal', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  business: { icon: Briefcase, label: 'Business', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  'follow-up': { icon: BookmarkCheck, label: 'Follow-up', color: 'bg-green-100 text-green-700 border-green-300' }
}

export default function NoteModal({ isOpen, onClose, onSave, note, mode = 'add' }: NoteModalProps) {
  const [formData, setFormData] = useState<Note>({
    title: '',
    content: '',
    category: 'personal',
    privacy: 'private',
    tags: []
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (note && mode === 'edit') {
      setFormData(note)
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'personal',
        privacy: 'private',
        tags: []
      })
    }
    setErrors({})
  }, [note, mode, isOpen])

  const handleChange = (field: keyof Note, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (formData.content.length > 5000) {
      newErrors.content = 'Content must not exceed 5000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Note' : 'Add New Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter note title"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={8}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write your note here..."
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
              <p className={`text-sm ${formData.content.length > 5000 ? 'text-red-600' : 'text-gray-500'} ml-auto`}>
                {formData.content.length} / 5000 characters
              </p>
            </div>
          </div>

          {/* Category & Privacy */}
          <div className="grid grid-cols-2 gap-2">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Category
              </label>
              <div className="space-y-2">
                {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((category) => {
                  const config = categoryConfig[category]
                  const Icon = config.icon
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleChange('category', category)}
                      className={`w-full px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                        formData.category === category
                          ? config.color
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {config.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleChange('privacy', 'private')}
                  className={`w-full px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                    formData.privacy === 'private'
                      ? 'bg-gray-100 text-gray-700 border-gray-300'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Private
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('privacy', 'shared')}
                  className={`w-full px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                    formData.privacy === 'shared'
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  Shared
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'edit' ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
