'use client'

import { useState } from 'react'
import { X, Plus, Trash2, GripVertical, CheckCircle2, AlertCircle, Save } from 'lucide-react'

export interface Question {
  id: string
  text: string
  type: 'text' | 'multiple-choice' | 'rating' | 'yes-no' | 'number'
  required: boolean
  options?: string[]
}

export interface Questionnaire {
  id: string
  questionnaireCode: string
  questionnaireName: string
  category: string
  targetSegment: string
  questions: number
  avgCompletionTime: number
  completionRate: number
  usageCount: number
  qualifiedLeads: number
  qualificationRate: number
  avgDealSize: number
  status: 'active' | 'draft' | 'archived'
  createdBy: string
  createdDate: string
  lastUpdated: string
  description: string
}

interface QuestionnaireModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (questionnaire: Questionnaire) => void
  questionnaire: Questionnaire | null
}

interface QuestionBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  questionnaire: Questionnaire
}

interface ViewQuestionnaireModalProps {
  isOpen: boolean
  onClose: () => void
  questionnaire: Questionnaire
}

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  questionnaire: Questionnaire
}

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  questionnaire: Questionnaire
}

export function QuestionnaireModal({ isOpen, onClose, onSave, questionnaire }: QuestionnaireModalProps) {
  const [formData, setFormData] = useState({
    questionnaireName: questionnaire?.questionnaireName || '',
    questionnaireCode: questionnaire?.questionnaireCode || '',
    category: questionnaire?.category || '',
    targetSegment: questionnaire?.targetSegment || '',
    description: questionnaire?.description || '',
    status: questionnaire?.status || 'draft' as 'active' | 'draft' | 'archived',
    avgCompletionTime: questionnaire?.avgCompletionTime || 10
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.questionnaireName.trim()) newErrors.questionnaireName = 'Name is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (!formData.targetSegment.trim()) newErrors.targetSegment = 'Target segment is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const newQuestionnaire: Questionnaire = {
      id: questionnaire?.id || `Q${Date.now()}`,
      ...formData,
      questionnaireCode: formData.questionnaireCode || `Q-${formData.category.substring(0, 3).toUpperCase()}-${String(Date.now()).slice(-3)}`,
      questions: questionnaire?.questions || 0,
      completionRate: questionnaire?.completionRate || 0,
      usageCount: questionnaire?.usageCount || 0,
      qualifiedLeads: questionnaire?.qualifiedLeads || 0,
      qualificationRate: questionnaire?.qualificationRate || 0,
      avgDealSize: questionnaire?.avgDealSize || 0,
      createdBy: questionnaire?.createdBy || 'Current User',
      createdDate: questionnaire?.createdDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    }

    onSave(newQuestionnaire)
    onClose()
  }

  const categories = [
    'Luxury Kitchen', 'Standard Kitchen', 'Commercial Kitchen', 'Renovation',
    'Sinks & Faucets', 'Appliances', 'Builder Projects', 'Smart Kitchen',
    'Compact Kitchen', 'Sustainable Kitchen', 'Cookware', 'General'
  ]

  const segments = [
    'High Net Worth Individuals', 'Middle Income Residential', 'B2B - Restaurants & Hotels',
    'Home Renovation Projects', 'Retail Customers', 'New Home Buyers',
    'Real Estate Developers', 'Tech-Savvy Professionals', 'Studio Apartments',
    'Eco-Conscious Buyers', 'Cooking Enthusiasts', 'All Segments'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {questionnaire ? 'Edit Questionnaire' : 'Create New Questionnaire'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Basic Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questionnaire Name *
              </label>
              <input
                type="text"
                value={formData.questionnaireName}
                onChange={(e) => setFormData({ ...formData, questionnaireName: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.questionnaireName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Luxury Kitchen Requirements Assessment"
              />
              {errors.questionnaireName && (
                <p className="text-red-500 text-sm mt-1">{errors.questionnaireName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Questionnaire Code
                </label>
                <input
                  type="text"
                  value={formData.questionnaireCode}
                  onChange={(e) => setFormData({ ...formData, questionnaireCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Auto-generated if empty"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Segment *
              </label>
              <select
                value={formData.targetSegment}
                onChange={(e) => setFormData({ ...formData, targetSegment: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.targetSegment ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Target Segment</option>
                {segments.map(seg => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>
              {errors.targetSegment && (
                <p className="text-red-500 text-sm mt-1">{errors.targetSegment}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of questionnaire purpose and use case"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Completion Time (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.avgCompletionTime}
                  onChange={(e) => setFormData({ ...formData, avgCompletionTime: parseInt(e.target.value) || 10 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'archived' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {questionnaire ? 'Update Questionnaire' : 'Create Questionnaire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function QuestionBuilderModal({ isOpen, onClose, questionnaire }: QuestionBuilderModalProps) {
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: 'What is your budget range?', type: 'multiple-choice', required: true, options: ['<₹5L', '₹5-10L', '₹10-25L', '>₹25L'] },
    { id: '2', text: 'What is the size of your kitchen space?', type: 'text', required: true },
    { id: '3', text: 'Rate your cooking frequency', type: 'rating', required: false },
  ])

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    text: '',
    type: 'text',
    required: false,
    options: []
  })

  if (!isOpen) return null

  const addQuestion = () => {
    if (!newQuestion.text?.trim()) return

    const question: Question = {
      id: `Q${Date.now()}`,
      text: newQuestion.text,
      type: newQuestion.type || 'text',
      required: newQuestion.required || false,
      options: newQuestion.options || []
    }

    setQuestions([...questions, question])
    setNewQuestion({ text: '', type: 'text', required: false, options: [] })
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleSave = () => {
    alert(`Saved ${questions.length} questions for questionnaire`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Question Builder</h2>
            <p className="text-sm text-gray-600">{questionnaire.questionnaireName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Existing Questions */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Questions ({questions.length})</h3>

            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-gray-400 mt-1 cursor-move" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                          {question.required && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                          )}
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">
                            {question.type.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">{question.text}</p>
                      </div>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {question.options && question.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {question.options.map((option, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {option}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Question */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Add New Question</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
              <input
                type="text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your question..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as Question['type'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="rating">Rating</option>
                  <option value="yes-no">Yes/No</option>
                  <option value="number">Number</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newQuestion.required}
                    onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Required</span>
                </label>
              </div>
            </div>

            {newQuestion.type === 'multiple-choice' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Option 1, Option 2, Option 3"
                  onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ViewQuestionnaireModal({ isOpen, onClose, questionnaire }: ViewQuestionnaireModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Questionnaire Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{questionnaire.questionnaireName}</h3>
            <p className="text-gray-600">{questionnaire.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm text-blue-700 mb-1">Questionnaire Code</div>
              <div className="text-lg font-bold text-blue-900">{questionnaire.questionnaireCode}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-700 mb-1">Category</div>
              <div className="text-lg font-bold text-green-900">{questionnaire.category}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-purple-700 mb-1">Target Segment</div>
              <div className="text-lg font-bold text-purple-900">{questionnaire.targetSegment}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-sm text-orange-700 mb-1">Status</div>
              <div className="text-lg font-bold text-orange-900 capitalize">{questionnaire.status}</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Performance Metrics</h4>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-sm text-gray-600 mb-1">Questions</div>
                <div className="text-2xl font-bold text-gray-900">{questionnaire.questions}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Avg Time</div>
                <div className="text-2xl font-bold text-gray-900">{questionnaire.avgCompletionTime} min</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Usage Count</div>
                <div className="text-2xl font-bold text-gray-900">{questionnaire.usageCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
                <div className="text-2xl font-bold text-green-600">{questionnaire.completionRate.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Qualified Leads</div>
                <div className="text-2xl font-bold text-blue-600">{questionnaire.qualifiedLeads}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Avg Deal Size</div>
                <div className="text-2xl font-bold text-purple-600">₹{(questionnaire.avgDealSize / 100000).toFixed(1)}L</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>Created by {questionnaire.createdBy} on {questionnaire.createdDate}</div>
              <div>Last updated: {questionnaire.lastUpdated}</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AnalyticsModal({ isOpen, onClose, questionnaire }: AnalyticsModalProps) {
  if (!isOpen) return null

  const chartData = [
    { month: 'Jan', usage: 45, qualified: 38 },
    { month: 'Feb', usage: 52, qualified: 44 },
    { month: 'Mar', usage: 48, qualified: 40 },
    { month: 'Apr', usage: 61, qualified: 51 },
    { month: 'May', usage: 55, qualified: 46 },
    { month: 'Jun', usage: 67, qualified: 56 },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full  max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
            <p className="text-sm text-gray-600">{questionnaire.questionnaireName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
              <div className="text-sm text-blue-700 mb-1">Total Usage</div>
              <div className="text-2xl font-bold text-blue-900">{questionnaire.usageCount}</div>
              <div className="text-xs text-blue-600 mt-1">+12% from last month</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
              <div className="text-sm text-green-700 mb-1">Completion Rate</div>
              <div className="text-2xl font-bold text-green-900">{questionnaire.completionRate.toFixed(1)}%</div>
              <div className="text-xs text-green-600 mt-1">+5% from last month</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
              <div className="text-sm text-purple-700 mb-1">Qualification Rate</div>
              <div className="text-2xl font-bold text-purple-900">{questionnaire.qualificationRate.toFixed(1)}%</div>
              <div className="text-xs text-purple-600 mt-1">+3% from last month</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
              <div className="text-sm text-orange-700 mb-1">Avg Deal Size</div>
              <div className="text-2xl font-bold text-orange-900">₹{(questionnaire.avgDealSize / 100000).toFixed(1)}L</div>
              <div className="text-xs text-orange-600 mt-1">+8% from last month</div>
            </div>
          </div>

          {/* Usage Trend Chart */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Trend (Last 6 Months)</h3>
            <div className="space-y-3">
              {chartData.map((data) => (
                <div key={data.month} className="flex items-center gap-2">
                  <div className="w-12 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Usage</span>
                        <span>{data.usage}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(data.usage / 70) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Qualified</span>
                        <span>{data.qualified}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(data.qualified / 70) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Performance */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Performing Questions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Budget range question</div>
                  <div className="text-xs text-gray-600">98% response rate</div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Kitchen size question</div>
                  <div className="text-xs text-gray-600">96% response rate</div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Timeline expectations</div>
                  <div className="text-xs text-gray-600">78% response rate</div>
                </div>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PreviewModal({ isOpen, onClose, questionnaire }: PreviewModalProps) {
  if (!isOpen) return null

  const sampleQuestions = [
    { id: 1, text: 'What is your budget range for this project?', type: 'multiple-choice', options: ['<₹5L', '₹5-10L', '₹10-25L', '>₹25L'] },
    { id: 2, text: 'What is the size of your kitchen space (in sq ft)?', type: 'number' },
    { id: 3, text: 'Do you currently have a modular kitchen?', type: 'yes-no' },
    { id: 4, text: 'Rate your cooking frequency', type: 'rating' },
    { id: 5, text: 'What are your must-have features?', type: 'text' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Preview Questionnaire</h2>
            <p className="text-sm text-gray-600">{questionnaire.questionnaireName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">{questionnaire.description}</p>
            <div className="text-xs text-blue-700 mt-2">
              Estimated time: {questionnaire.avgCompletionTime} minutes • {sampleQuestions.length} questions
            </div>
          </div>

          {sampleQuestions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-semibold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{question.text}</p>
                </div>
              </div>

              {question.type === 'multiple-choice' && question.options && (
                <div className="ml-11 space-y-2">
                  {question.options.map((option, idx) => (
                    <label key={idx} className="flex items-center gap-2">
                      <input type="radio" name={`q${question.id}`} className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'yes-no' && (
                <div className="ml-11 flex gap-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`q${question.id}`} className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name={`q${question.id}`} className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              )}

              {question.type === 'text' && (
                <div className="ml-11">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your answer..."
                  />
                </div>
              )}

              {question.type === 'number' && (
                <div className="ml-11">
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number..."
                  />
                </div>
              )}

              {question.type === 'rating' && (
                <div className="ml-11 flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-700 font-medium"
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close Preview
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Start Questionnaire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
