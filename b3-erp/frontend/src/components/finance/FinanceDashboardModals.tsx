import { useState } from 'react';
import { X, Plus, Calendar, Download, TrendingUp, TrendingDown, DollarSign, FileText, Receipt, Banknote } from 'lucide-react';

// 1. Quick Journal Entry Modal (Blue)
export function QuickJournalEntryModal({ isOpen, onClose, onCreate }: any) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    entries: [
      { account: '', debit: '', credit: '', description: '' },
      { account: '', debit: '', credit: '', description: '' }
    ]
  });

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { account: '', debit: '', credit: '', description: '' }]
    });
  };

  const updateEntry = (index: number, field: string, value: string) => {
    const newEntries = [...formData.entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setFormData({ ...formData, entries: newEntries });
  };

  const totalDebit = formData.entries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
  const totalCredit = formData.entries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Quick Journal Entry</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input type="text" value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="JE-2025-XXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Entry description" />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden mb-4">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Account</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Debit</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Credit</th>
                </tr>
              </thead>
              <tbody>
                {formData.entries.map((entry, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">
                      <select value={entry.account} onChange={(e) => updateEntry(index, 'account', e.target.value)} className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Account</option>
                        <option value="1000">Cash in Hand</option>
                        <option value="1010">Bank Account</option>
                        <option value="1100">Accounts Receivable</option>
                        <option value="2000">Accounts Payable</option>
                        <option value="4000">Sales Revenue</option>
                        <option value="5000">Cost of Goods Sold</option>
                        <option value="6000">Operating Expenses</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input type="text" value={entry.description} onChange={(e) => updateEntry(index, 'description', e.target.value)} className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500" placeholder="Line description" />
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" value={entry.debit} onChange={(e) => updateEntry(index, 'debit', e.target.value)} className="w-full px-2 py-1 border rounded text-right focus:ring-2 focus:ring-blue-500" placeholder="0.00" step="0.01" />
                    </td>
                    <td className="px-4 py-2">
                      <input type="number" value={entry.credit} onChange={(e) => updateEntry(index, 'credit', e.target.value)} className="w-full px-2 py-1 border rounded text-right focus:ring-2 focus:ring-blue-500" placeholder="0.00" step="0.01" />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-blue-50 font-bold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right">Total:</td>
                  <td className="px-4 py-3 text-right text-green-700">₹{totalDebit.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-red-700">₹{totalCredit.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button onClick={addEntry} className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
            <Plus className="h-4 w-4" />
            Add Line
          </button>

          {!isBalanced && totalDebit > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ⚠️ Entry is not balanced. Debit: ₹{totalDebit.toFixed(2)}, Credit: ₹{totalCredit.toFixed(2)}
            </div>
          )}
          {isBalanced && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              ✓ Entry is balanced. Total: ₹{totalDebit.toFixed(2)}
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => { console.log('Create Journal Entry:', formData); onCreate(formData); }} disabled={!isBalanced} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Post Entry</button>
        </div>
      </div>
    </div>
  );
}

// 2. Quick Payment Modal (Green)
export function QuickPaymentModal({ isOpen, onClose, onCreate }: any) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    paymentType: 'payment-out',
    payee: '',
    amount: '',
    bankAccount: '',
    reference: '',
    description: '',
    paymentMethod: 'bank-transfer'
  });

  const isValid = formData.payee && formData.amount && formData.bankAccount;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Quick Payment</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type *</label>
              <select value={formData.paymentType} onChange={(e) => setFormData({...formData, paymentType: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="payment-out">Payment Out</option>
                <option value="payment-in">Payment In (Receipt)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{formData.paymentType === 'payment-out' ? 'Payee' : 'Payer'} *</label>
              <input type="text" value={formData.payee} onChange={(e) => setFormData({...formData, payee: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Vendor or Customer name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="0.00" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account *</label>
              <select value={formData.bankAccount} onChange={(e) => setFormData({...formData, bankAccount: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="">Select Bank Account</option>
                <option value="ba1">Primary Checking - ****4567</option>
                <option value="ba2">Business Savings - ****8901</option>
                <option value="ba3">Payroll Account - ****2345</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
              <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="bank-transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input type="text" value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="TXN-XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Payment description" />
            </div>
          </div>

          {formData.amount && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total {formData.paymentType === 'payment-out' ? 'Payment' : 'Receipt'}:</span>
                <span className="text-2xl font-bold text-green-700">₹{parseFloat(formData.amount || '0').toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => { console.log('Create Payment:', formData); onCreate(formData); }} disabled={!isValid} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">Record Payment</button>
        </div>
      </div>
    </div>
  );
}

// 3. Quick Receipt Modal (Teal)
export function QuickReceiptModal({ isOpen, onClose, onCreate }: any) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    amount: '',
    bankAccount: '',
    reference: '',
    paymentMethod: 'bank-transfer',
    invoice: ''
  });

  const isValid = formData.customer && formData.amount && formData.bankAccount;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Quick Receipt</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
              <input type="text" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="Customer name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="0.00" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account *</label>
              <select value={formData.bankAccount} onChange={(e) => setFormData({...formData, bankAccount: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500">
                <option value="">Select Bank Account</option>
                <option value="ba1">Primary Checking - ****4567</option>
                <option value="ba2">Business Savings - ****8901</option>
                <option value="ba3">Collection Account - ****3456</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500">
                <option value="bank-transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference/Transaction ID</label>
              <input type="text" value={formData.reference} onChange={(e) => setFormData({...formData, reference: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="TXN-XXXX" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Against Invoice (Optional)</label>
              <select value={formData.invoice} onChange={(e) => setFormData({...formData, invoice: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500">
                <option value="">Not linked to invoice</option>
                <option value="inv1">INV-2025-001 - ₹125,000</option>
                <option value="inv2">INV-2025-002 - ₹85,000</option>
                <option value="inv3">INV-2025-003 - ₹245,000</option>
              </select>
            </div>
          </div>

          {formData.amount && (
            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Total Receipt Amount:</span>
                <span className="text-2xl font-bold text-teal-700">₹{parseFloat(formData.amount || '0').toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => { console.log('Create Receipt:', formData); onCreate(formData); }} disabled={!isValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50">Record Receipt</button>
        </div>
      </div>
    </div>
  );
}

// 4. Filter Dashboard Modal (Violet)
export function FilterDashboardModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({
    period: 'current-month',
    accountType: 'all',
    status: 'all',
    amountRange: 'all',
    customStartDate: '',
    customEndDate: ''
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Filter Dashboard</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select value={filters.period} onChange={(e) => setFilters({...filters, period: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500">
                <option value="current-month">Current Month</option>
                <option value="current-quarter">Current Quarter</option>
                <option value="current-year">Current Year (FY)</option>
                <option value="last-month">Last Month</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="last-year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select value={filters.accountType} onChange={(e) => setFilters({...filters, accountType: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500">
                <option value="all">All Accounts</option>
                <option value="assets">Assets</option>
                <option value="liabilities">Liabilities</option>
                <option value="equity">Equity</option>
                <option value="revenue">Revenue</option>
                <option value="expenses">Expenses</option>
              </select>
            </div>

            {filters.period === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={filters.customStartDate} onChange={(e) => setFilters({...filters, customStartDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={filters.customEndDate} onChange={(e) => setFilters({...filters, customEndDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500">
                <option value="all">All Status</option>
                <option value="posted">Posted</option>
                <option value="pending">Pending Approval</option>
                <option value="draft">Draft</option>
                <option value="reversed">Reversed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
              <select value={filters.amountRange} onChange={(e) => setFilters({...filters, amountRange: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500">
                <option value="all">All Amounts</option>
                <option value="small">Under ₹10,000</option>
                <option value="medium">₹10,000 - ₹1,00,000</option>
                <option value="large">₹1,00,000 - ₹10,00,000</option>
                <option value="xlarge">Above ₹10,00,000</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={() => setFilters({ period: 'current-month', accountType: 'all', status: 'all', amountRange: 'all', customStartDate: '', customEndDate: '' })} className="px-4 py-2 text-violet-600 hover:text-violet-700 font-medium">Reset Filters</button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
            <button onClick={() => { console.log('Apply Filters:', filters); onApply(filters); }} className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">Apply Filters</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Customize Widgets Modal (Purple)
export function CustomizeWidgetsModal({ isOpen, onClose, onSave }: any) {
  const [widgets, setWidgets] = useState({
    cashPosition: true,
    accountsReceivable: true,
    accountsPayable: true,
    netProfit: true,
    cashFlowTrend: true,
    revenueExpense: true,
    financialRatios: true,
    alerts: true,
    quickActions: true,
    performanceTrends: true,
    receivablesAging: true,
    payablesAging: false
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Customize Dashboard Widgets</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">Select which widgets to display on your finance dashboard</p>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.cashPosition} onChange={(e) => setWidgets({...widgets, cashPosition: e.target.checked})} className="mr-3" />
              <span className="font-medium">💰 Cash Position</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.accountsReceivable} onChange={(e) => setWidgets({...widgets, accountsReceivable: e.target.checked})} className="mr-3" />
              <span className="font-medium">📈 Accounts Receivable</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.accountsPayable} onChange={(e) => setWidgets({...widgets, accountsPayable: e.target.checked})} className="mr-3" />
              <span className="font-medium">📉 Accounts Payable</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.netProfit} onChange={(e) => setWidgets({...widgets, netProfit: e.target.checked})} className="mr-3" />
              <span className="font-medium">🎯 Net Profit</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.cashFlowTrend} onChange={(e) => setWidgets({...widgets, cashFlowTrend: e.target.checked})} className="mr-3" />
              <span className="font-medium">📊 Cash Flow Trend</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.revenueExpense} onChange={(e) => setWidgets({...widgets, revenueExpense: e.target.checked})} className="mr-3" />
              <span className="font-medium">💵 Revenue vs Expense</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.financialRatios} onChange={(e) => setWidgets({...widgets, financialRatios: e.target.checked})} className="mr-3" />
              <span className="font-medium">📐 Financial Ratios</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.alerts} onChange={(e) => setWidgets({...widgets, alerts: e.target.checked})} className="mr-3" />
              <span className="font-medium">🔔 Alerts & Notifications</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.quickActions} onChange={(e) => setWidgets({...widgets, quickActions: e.target.checked})} className="mr-3" />
              <span className="font-medium">⚡ Quick Actions</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.performanceTrends} onChange={(e) => setWidgets({...widgets, performanceTrends: e.target.checked})} className="mr-3" />
              <span className="font-medium">📈 Performance Trends</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.receivablesAging} onChange={(e) => setWidgets({...widgets, receivablesAging: e.target.checked})} className="mr-3" />
              <span className="font-medium">⏰ Receivables Aging</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={widgets.payablesAging} onChange={(e) => setWidgets({...widgets, payablesAging: e.target.checked})} className="mr-3" />
              <span className="font-medium">⏰ Payables Aging</span>
            </label>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => { console.log('Save Widget Layout:', widgets); onSave(widgets); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Layout</button>
        </div>
      </div>
    </div>
  );
}

// 6. Export Dashboard Modal (Emerald)
export function ExportDashboardModal({ isOpen, onClose, onExport }: any) {
  const [settings, setSettings] = useState({
    format: 'PDF',
    includeCharts: true,
    includeData: true,
    includeRatios: true,
    dateRange: 'current',
    sections: {
      summary: true,
      cashFlow: true,
      profitability: true,
      aging: true
    }
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Export Dashboard</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
            <select value={settings.format} onChange={(e) => setSettings({...settings, format: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
              <option>PDF</option>
              <option>Excel</option>
              <option>PowerPoint</option>
              <option>CSV (Data Only)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Include in Export</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" checked={settings.includeCharts} onChange={(e) => setSettings({...settings, includeCharts: e.target.checked})} className="mr-2" />
                <span className="text-sm">Charts & Graphs</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={settings.includeData} onChange={(e) => setSettings({...settings, includeData: e.target.checked})} className="mr-2" />
                <span className="text-sm">Raw Data Tables</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" checked={settings.includeRatios} onChange={(e) => setSettings({...settings, includeRatios: e.target.checked})} className="mr-2" />
                <span className="text-sm">Financial Ratios</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select value={settings.dateRange} onChange={(e) => setSettings({...settings, dateRange: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
              <option value="current">Current Period</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => { console.log('Export Dashboard:', settings); onExport(settings); }} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

// 7. View Alerts Modal (Red)
export function ViewAlertsModal({ isOpen, onClose }: any) {
  const alerts = [
    { id: 1, type: 'critical', title: 'Overdue Receivables', message: '₹2.7M in receivables are overdue by more than 30 days', time: '1 hour ago', priority: 'high' },
    { id: 2, type: 'warning', title: 'Budget Variance', message: 'Operating expenses are 15% above budget for this period', time: '3 hours ago', priority: 'medium' },
    { id: 3, type: 'info', title: 'Payment Due', message: 'Vendor payment of ₹1.5M due tomorrow', time: '5 hours ago', priority: 'medium' },
    { id: 4, type: 'success', title: 'Collection Success', message: 'Large payment of ₹2.5M received from TechCorp', time: '1 day ago', priority: 'low' },
    { id: 5, type: 'warning', title: 'Low Cash Balance', message: 'Primary checking account below minimum threshold', time: '1 day ago', priority: 'high' },
    { id: 6, type: 'info', title: 'Month-End Close', message: 'October month-end closing scheduled for Nov 2', time: '2 days ago', priority: 'medium' },
  ];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Alerts & Notifications</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                alert.type === 'success' ? 'bg-green-50 border-green-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        alert.priority === 'high' ? 'bg-red-100 text-red-700' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{alert.priority.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                  </div>
                  <button className="ml-4 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button className="px-4 py-2 text-red-600 hover:text-red-700 font-medium">Mark All as Read</button>
          <button onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Close</button>
        </div>
      </div>
    </div>
  );
}

// 8. Refresh Data Modal (Indigo)
export function RefreshDataModal({ isOpen, onClose, onRefresh }: any) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing dashboard data...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    onRefresh();
    setRefreshing(false);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Refresh Dashboard Data</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200" disabled={refreshing}><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            This will fetch the latest financial data from all sources including:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Cash positions & bank balances
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Accounts receivable & payable
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Recent transactions
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Financial ratios & KPIs
            </li>
          </ul>
          {refreshing && (
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                <span className="text-sm text-indigo-700">Refreshing data...</span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} disabled={refreshing} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancel</button>
          <button onClick={handleRefresh} disabled={refreshing} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {refreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 9. Period Selector Modal (Yellow/Amber)
export function PeriodSelectorModal({ isOpen, onClose, onSelect }: any) {
  const [period, setPeriod] = useState({
    type: 'month',
    fiscalYear: '2025',
    month: 'October',
    quarter: 'Q4',
    customStart: '',
    customEnd: ''
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Select Accounting Period</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period Type</label>
              <select value={period.type} onChange={(e) => setPeriod({...period, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500">
                <option value="month">Monthly</option>
                <option value="quarter">Quarterly</option>
                <option value="year">Yearly</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year</label>
              <select value={period.fiscalYear} onChange={(e) => setPeriod({...period, fiscalYear: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500">
                <option value="2023">FY 2023-24</option>
                <option value="2024">FY 2024-25</option>
                <option value="2025">FY 2025-26</option>
              </select>
            </div>
          </div>

          {period.type === 'month' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
              <select value={period.month} onChange={(e) => setPeriod({...period, month: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500">
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
          )}

          {period.type === 'quarter' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Quarter</label>
              <select value={period.quarter} onChange={(e) => setPeriod({...period, quarter: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500">
                <option value="Q1">Q1 (Apr-Jun)</option>
                <option value="Q2">Q2 (Jul-Sep)</option>
                <option value="Q3">Q3 (Oct-Dec)</option>
                <option value="Q4">Q4 (Jan-Mar)</option>
              </select>
            </div>
          )}

          {period.type === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={period.customStart} onChange={(e) => setPeriod({...period, customStart: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" value={period.customEnd} onChange={(e) => setPeriod({...period, customEnd: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Selected Period:</p>
            <p className="text-lg font-bold text-amber-700">
              {period.type === 'custom'
                ? `${period.customStart} to ${period.customEnd}`
                : period.type === 'month'
                ? `${period.month} ${period.fiscalYear}`
                : period.type === 'quarter'
                ? `${period.quarter} FY ${period.fiscalYear}`
                : `FY ${period.fiscalYear}`
              }
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
          <button onClick={() => { console.log('Select Period:', period); onSelect(period); }} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
            <Calendar className="h-4 w-4" />
            Apply Period
          </button>
        </div>
      </div>
    </div>
  );
}

// 10. View Transaction Details Modal (Slate/Gray)
export function ViewTransactionDetailsModal({ isOpen, onClose, transaction }: any) {
  if (!isOpen) return null;

  const mockTransaction = transaction || {
    id: 'TXN-2025-145',
    type: 'Journal Entry',
    date: '2025-10-18',
    status: 'Posted',
    reference: 'JE-2025-045',
    description: 'Monthly depreciation expense',
    createdBy: 'John Doe',
    approvedBy: 'Jane Smith',
    totalDebit: 125000,
    totalCredit: 125000,
    entries: [
      { account: '6100 - Depreciation Expense', debit: 125000, credit: 0 },
      { account: '1800 - Accumulated Depreciation', debit: 0, credit: 125000 }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Transaction Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">Transaction ID</label>
              <p className="text-lg font-semibold text-gray-900">{mockTransaction.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Type</label>
              <p className="text-lg font-semibold text-gray-900">{mockTransaction.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Date</label>
              <p className="text-lg font-semibold text-gray-900">{mockTransaction.date}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Status</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                {mockTransaction.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Reference</label>
              <p className="text-lg font-semibold text-gray-900">{mockTransaction.reference}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Created By</label>
              <p className="text-lg font-semibold text-gray-900">{mockTransaction.createdBy}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
            <p className="text-gray-900">{mockTransaction.description}</p>
          </div>

          <div className="border rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Account</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Debit</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Credit</th>
                </tr>
              </thead>
              <tbody>
                {mockTransaction.entries.map((entry: any, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 text-gray-900">{entry.account}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold">
                <tr>
                  <td className="px-4 py-3 text-right">Total:</td>
                  <td className="px-4 py-3 text-right text-green-700">₹{mockTransaction.totalDebit.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-red-700">₹{mockTransaction.totalCredit.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Approved by:</span>
            <span>{mockTransaction.approvedBy}</span>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Close</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Print</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
