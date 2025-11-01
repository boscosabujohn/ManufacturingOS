'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save, FileText, Plus, Trash2, Calculator } from 'lucide-react'

interface EstimateItem {
  id: string
  itemCode: string
  description: string
  category: string
  quantity: number
  unit: string
  rate: number
  amount: number
}

export default function CreateDraftPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const copyFromId = searchParams?.get('copy')

  const [projectName, setProjectName] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [category, setCategory] = useState('Modular Kitchen')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<EstimateItem[]>([])

  const categories = [
    'Modular Kitchen',
    'Commercial Kitchen',
    'Kitchen Renovation',
    'Builder Package',
    'Island Kitchen',
    'L-Shaped Kitchen',
    'Parallel Kitchen',
    'Compact Kitchen',
    'Institutional Kitchen'
  ]

  const units = ['Unit', 'Sq.Ft', 'Sq.M', 'R.M', 'Set', 'Nos', 'Kg', 'Lit']

  const handleAddItem = () => {
    const newItem: EstimateItem = {
      id: Date.now().toString(),
      itemCode: '',
      description: '',
      category: 'Base Cabinets',
      quantity: 1,
      unit: 'Unit',
      rate: 0,
      amount: 0
    }
    setItems([...items, newItem])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, field: keyof EstimateItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // Recalculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }

        return updatedItem
      }
      return item
    }))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateCompletion = () => {
    let totalFields = 4 // Basic fields: projectName, customerName, contactPerson, category
    let filledFields = 0

    if (projectName) filledFields++
    if (customerName) filledFields++
    if (contactPerson) filledFields++
    if (category) filledFields++

    if (items.length > 0) {
      totalFields += items.length * 4 // Each item has 4 key fields
      items.forEach(item => {
        if (item.itemCode) filledFields++
        if (item.description) filledFields++
        if (item.quantity > 0) filledFields++
        if (item.rate > 0) filledFields++
      })
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
  }

  const handleSaveDraft = () => {
    const draft = {
      projectName,
      customerName,
      contactPerson,
      category,
      notes,
      items,
      estimatedValue: calculateTotal(),
      completionPercent: calculateCompletion(),
      createdAt: new Date().toISOString()
    }

    console.log('Saving draft:', draft)
    // Would make API call here
    router.push('/estimation/workflow/drafts')
  }

  const handleCancel = () => {
    router.push('/estimation/workflow/drafts')
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="flex-none bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {copyFromId ? 'Copy Estimate Draft' : 'Create New Estimate Draft'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {copyFromId ? `Creating copy from draft ${copyFromId}` : 'Start building your estimate'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Completion: <span className="font-semibold">{calculateCompletion()}%</span>
            </div>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Luxury Villa - Complete Kitchen Setup"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Prestige Constructions Pvt Ltd"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g., Mr. Rajesh Kumar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes or comments about this estimate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Estimate Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Estimate Items ({items.length})
              </h2>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Unit</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            value={item.itemCode}
                            onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Code"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Description"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Category"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                            min="0"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <select
                            value={item.unit}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            {units.map(u => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-right"
                            min="0"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="text-sm font-semibold text-gray-900 text-right">
                            ₹{item.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td colSpan={6} className="px-3 py-3 text-sm font-semibold text-gray-900 text-right">
                        Total Estimated Value:
                      </td>
                      <td className="px-3 py-3 text-sm font-bold text-blue-600 text-right">
                        ₹{calculateTotal().toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">No items added yet</p>
                <p className="text-sm text-gray-500 mb-4">Start by adding items to your estimate</p>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add First Item
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pb-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
