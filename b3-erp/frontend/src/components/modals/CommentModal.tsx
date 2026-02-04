'use client'

import { useState, useEffect, useRef } from 'react'
import { X, MessageSquare, AtSign, Eye, Edit3 } from 'lucide-react'

export interface Comment {
  id?: string
  content: string
  mentions: string[]
}

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (comment: Comment) => void
  comment?: Comment
  mode?: 'add' | 'edit'
}

// Mock user list for mentions
const availableUsers = [
  { id: '1', name: 'John Doe', username: 'johndoe' },
  { id: '2', name: 'Jane Smith', username: 'janesmith' },
  { id: '3', name: 'Mike Johnson', username: 'mikejohnson' },
  { id: '4', name: 'Sarah Williams', username: 'sarahwilliams' },
  { id: '5', name: 'David Brown', username: 'davidbrown' },
  { id: '6', name: 'Emily Davis', username: 'emilydavis' }
]

export default function CommentModal({ isOpen, onClose, onSave, comment, mode = 'add' }: CommentModalProps) {
  const [formData, setFormData] = useState<Comment>({
    content: '',
    mentions: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionSearch, setMentionSearch] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (comment && mode === 'edit') {
      setFormData(comment)
    } else {
      setFormData({
        content: '',
        mentions: []
      })
    }
    setErrors({})
    setShowPreview(false)
  }, [comment, mode, isOpen])

  const handleChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }))
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }))
    }

    // Detect @ mentions
    const cursorPos = textareaRef.current?.selectionStart || 0
    const textBeforeCursor = value.slice(0, cursorPos)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      if (!textAfterAt.includes(' ') && textAfterAt.length <= 20) {
        setMentionSearch(textAfterAt)
        setShowMentionDropdown(true)
        setCursorPosition(lastAtIndex)
      } else {
        setShowMentionDropdown(false)
      }
    } else {
      setShowMentionDropdown(false)
    }
  }

  const insertMention = (username: string) => {
    const before = formData.content.slice(0, cursorPosition)
    const after = formData.content.slice(textareaRef.current?.selectionStart || 0)
    const newContent = `${before}@${username} ${after}`

    setFormData(prev => ({
      ...prev,
      content: newContent,
      mentions: Array.from(new Set([...prev.mentions, username]))
    }))

    setShowMentionDropdown(false)
    setMentionSearch('')

    // Refocus textarea
    setTimeout(() => {
      textareaRef.current?.focus()
      const newPosition = cursorPosition + username.length + 2
      textareaRef.current?.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const filteredUsers = availableUsers.filter(user =>
    user.username.toLowerCase().includes(mentionSearch.toLowerCase()) ||
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  )

  const renderPreview = () => {
    let content = formData.content
    formData.mentions.forEach(mention => {
      const regex = new RegExp(`@${mention}`, 'g')
      content = content.replace(regex, `<span class="bg-blue-100 text-blue-700 px-1 rounded">@${mention}</span>`)
    })
    return content
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.content.trim()) {
      newErrors.content = 'Comment is required'
    }

    if (formData.content.length > 500) {
      newErrors.content = 'Comment must not exceed 500 characters'
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
    if (e.key === 'Escape' && !showMentionDropdown) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Comment' : 'Add Comment'}
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
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                !showPreview
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showPreview
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          {/* Comment Content */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comment <span className="text-red-500">*</span>
            </label>

            {!showPreview ? (
              <>
                <textarea
                  ref={textareaRef}
                  value={formData.content}
                  onChange={(e) => handleChange(e.target.value)}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Write your comment... Use @ to mention users"
                  autoFocus
                />

                {/* Mention Dropdown */}
                {showMentionDropdown && filteredUsers.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => insertMention(user.username)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <AtSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div
                className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[150px] bg-gray-50"
                dangerouslySetInnerHTML={{ __html: renderPreview() || '<span class="text-gray-400">No content to preview</span>' }}
              />
            )}

            <div className="mt-1 flex items-center justify-between">
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
              <p className={`text-sm ${formData.content.length > 500 ? 'text-red-600' : 'text-gray-500'} ml-auto`}>
                {formData.content.length} / 500 characters
              </p>
            </div>
          </div>

          {/* Mentioned Users */}
          {formData.mentions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <AtSign className="w-4 h-4" />
                Mentioned Users
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.mentions.map((mention) => (
                  <span
                    key={mention}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    @{mention}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          mentions: prev.mentions.filter(m => m !== mention)
                        }))
                      }}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Type @ followed by a username to mention someone. They'll be notified about your comment.
            </p>
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
              {mode === 'edit' ? 'Save Changes' : 'Add Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
