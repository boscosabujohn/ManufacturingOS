'use client';

import { useState } from 'react';
import { Receipt, Upload, X, Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt?: File;
}

const expenseCategories = [
  'Travel',
  'Accommodation',
  'Meals',
  'Transport',
  'Office Supplies',
  'Client Entertainment',
  'Training',
  'Software/Tools',
  'Communication',
  'Other'
];

export default function SubmitExpensePage() {
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([{
    id: '1',
    category: 'Travel',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addExpenseItem = () => {
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      category: 'Travel',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenseItems([...expenseItems, newItem]);
  };

  const removeExpenseItem = (id: string) => {
    if (expenseItems.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one expense item is required",
        variant: "destructive"
      });
      return;
    }
    setExpenseItems(expenseItems.filter(item => item.id !== id));
  };

  const updateExpenseItem = (id: string, field: keyof ExpenseItem, value: any) => {
    setExpenseItems(expenseItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleFileUpload = (id: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Receipt file must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    updateExpenseItem(id, 'receipt', file);
    toast({
      title: "Receipt Uploaded",
      description: `${file.name} attached successfully`
    });
  };

  const validateForm = (): boolean => {
    if (!expenseTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter expense title",
        variant: "destructive"
      });
      return false;
    }

    for (const item of expenseItems) {
      if (!item.description.trim()) {
        toast({
          title: "Validation Error",
          description: "All expense items must have descriptions",
          variant: "destructive"
        });
        return false;
      }
      if (item.amount <= 0) {
        toast({
          title: "Validation Error",
          description: "All expense amounts must be greater than zero",
          variant: "destructive"
        });
        return false;
      }
      if (!item.date) {
        toast({
          title: "Validation Error",
          description: "All expense items must have dates",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const totalAmount = expenseItems.reduce((sum, item) => sum + item.amount, 0);

      toast({
        title: "Expense Submitted",
        description: `Expense claim for ₹${totalAmount.toLocaleString('en-IN')} submitted successfully`
      });

      // Reset form
      setExpenseTitle('');
      setExpenseItems([{
        id: Date.now().toString(),
        category: 'Travel',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
      }]);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = expenseItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Receipt className="h-7 w-7 text-purple-600" />
          Submit Expense Claim
        </h1>
        <p className="text-sm text-gray-600 mt-1">Create and submit expense reimbursement request</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Title */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Details</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="e.g., Business Trip to Mumbai - March 2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Expense Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Expense Items</h2>
              <button
                onClick={addExpenseItem}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {expenseItems.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Item {index + 1}</h3>
                    {expenseItems.length > 1 && (
                      <button
                        onClick={() => removeExpenseItem(item.id)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => updateExpenseItem(item.id, 'category', e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                      >
                        {expenseCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateExpenseItem(item.id, 'date', e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateExpenseItem(item.id, 'description', e.target.value)}
                        placeholder="e.g., Flight ticket Mumbai to Delhi"
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (₹) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) => updateExpenseItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        disabled={isSubmitting}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Receipt
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(item.id, e.target.files[0]);
                            }
                          }}
                          disabled={isSubmitting}
                          className="hidden"
                          id={`receipt-${item.id}`}
                        />
                        <label
                          htmlFor={`receipt-${item.id}`}
                          className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="h-4 w-4" />
                          {item.receipt ? item.receipt.name : 'Upload Receipt'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Total Items:</span>
                <span className="font-semibold text-purple-900">{expenseItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-700">Items with Receipts:</span>
                <span className="font-semibold text-purple-900">
                  {expenseItems.filter(item => item.receipt).length}
                </span>
              </div>
              <div className="border-t border-purple-300 my-3"></div>
              <div className="flex justify-between">
                <span className="font-semibold text-purple-900">Total Amount:</span>
                <span className="text-2xl font-bold text-purple-900">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !expenseTitle.trim()}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Submitting...
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4" />
                  Submit Expense
                </>
              )}
            </button>

            <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Guidelines:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Attach receipts for all expenses</li>
                <li>• Expenses must be within policy limits</li>
                <li>• Submit within 30 days of expense</li>
                <li>• Provide clear descriptions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
