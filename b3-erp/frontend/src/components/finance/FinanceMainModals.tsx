import { useState } from 'react';
import { X, Plus, Search, Filter, Download, TrendingUp, FileText, Calendar, DollarSign, Users, Building, Receipt, Banknote } from 'lucide-react';

// 1. View Cash Position Details Modal (Blue)
export function ViewCashPositionModal({ isOpen, onClose }: any) {
  const cashAccounts = [
    { id: 1, name: 'Primary Checking', bank: 'First National Bank', accountNo: '****4567', balance: 5800000, type: 'Checking', lastUpdated: '2 mins ago' },
    { id: 2, name: 'Business Savings', bank: 'First National Bank', accountNo: '****8901', balance: 4200000, type: 'Savings', lastUpdated: '5 mins ago' },
    { id: 3, name: 'Payroll Account', bank: 'Regional Bank', accountNo: '****2345', balance: 1800000, type: 'Checking', lastUpdated: '10 mins ago' },
    { id: 4, name: 'Petty Cash - Head Office', bank: 'On-site', accountNo: 'N/A', balance: 500000, type: 'Cash', lastUpdated: '1 hour ago' },
    { id: 5, name: 'Petty Cash - Branch', bank: 'On-site', accountNo: 'N/A', balance: 200000, type: 'Cash', lastUpdated: '2 hours ago' },
  ];

  const totalCash = cashAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Cash Position Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Cash Position</p>
                <p className="text-4xl font-bold text-blue-900 mt-2">₹{totalCash.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">As of: {new Date().toLocaleString()}</p>
                <div className="mt-2 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  +8.5% vs Last Month
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Account Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Account No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Balance</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {cashAccounts.map((account) => (
                  <tr key={account.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{account.name}</td>
                    <td className="px-4 py-3 text-gray-700">{account.bank}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono">{account.accountNo}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        account.type === 'Checking' ? 'bg-blue-100 text-blue-700' :
                        account.type === 'Savings' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {account.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{account.balance.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{account.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700">Bank Accounts</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹{cashAccounts.filter(a => a.type !== 'Cash').reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-700">Cash on Hand</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">₹{cashAccounts.filter(a => a.type === 'Cash').reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-700">Total Accounts</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{cashAccounts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Close</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. View Receivables Details Modal (Green)
export function ViewReceivablesModal({ isOpen, onClose }: any) {
  const receivablesData = [
    { id: 1, customer: 'TechCorp Industries', invoiceNo: 'INV-2025-289', amount: 245000, dueDate: '2025-10-25', status: 'Overdue', days: 5 },
    { id: 2, customer: 'Global Manufacturing Ltd', invoiceNo: 'INV-2025-287', amount: 180000, dueDate: '2025-10-28', status: 'Current', days: 0 },
    { id: 3, customer: 'ABC Enterprises', invoiceNo: 'INV-2025-285', amount: 125000, dueDate: '2025-09-30', status: 'Overdue', days: 20 },
    { id: 4, customer: 'XYZ Corporation', invoiceNo: 'INV-2025-283', amount: 98000, dueDate: '2025-10-30', status: 'Current', days: 0 },
    { id: 5, customer: 'Premium Foods Inc', invoiceNo: 'INV-2025-280', amount: 156000, dueDate: '2025-08-15', status: 'Overdue', days: 65 },
  ];

  const totalReceivables = receivablesData.reduce((sum, r) => sum + r.amount, 0);
  const overdueAmount = receivablesData.filter(r => r.status === 'Overdue').reduce((sum, r) => sum + r.amount, 0);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Accounts Receivable Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700">Total Receivables</p>
              <p className="text-3xl font-bold text-green-900 mt-2">₹{totalReceivables.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-700">Current (Not Due)</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">₹{receivablesData.filter(r => r.status === 'Current').reduce((sum, r) => sum + r.amount, 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-700">Overdue</p>
              <p className="text-3xl font-bold text-red-900 mt-2">₹{overdueAmount.toLocaleString('en-IN')}</p>
              <p className="text-xs text-red-600 mt-1">{((overdueAmount / totalReceivables) * 100).toFixed(1)}% of total</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice No</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Days</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {receivablesData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.customer}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono">{item.invoiceNo}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{item.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-700">{item.dueDate}</td>
                    <td className="px-4 py-3 text-center">
                      {item.status === 'Overdue' ? (
                        <span className="text-red-700 font-semibold">{item.days} days</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t sticky bottom-0">
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Send Reminders</button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Close</button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Download className="h-4 w-4" />
              Export Aging Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. View Payables Details Modal (Orange)
export function ViewPayablesModal({ isOpen, onClose }: any) {
  const payablesData = [
    { id: 1, vendor: 'Steel Suppliers Ltd', billNo: 'BILL-2025-456', amount: 185000, dueDate: '2025-10-22', status: 'Due Soon', days: 2, discount: 3500 },
    { id: 2, vendor: 'Equipment Rentals Inc', billNo: 'BILL-2025-454', amount: 120000, dueDate: '2025-10-26', status: 'Current', days: 6, discount: 0 },
    { id: 3, vendor: 'Office Supplies Co', billNo: 'BILL-2025-452', amount: 45000, dueDate: '2025-09-28', status: 'Overdue', days: 22, discount: 0 },
    { id: 4, vendor: 'Utilities Provider', billNo: 'BILL-2025-450', amount: 78000, dueDate: '2025-10-29', status: 'Current', days: 9, discount: 1560 },
    { id: 5, vendor: 'Raw Materials Trader', billNo: 'BILL-2025-448', amount: 295000, dueDate: '2025-10-20', status: 'Due Soon', days: 0, discount: 8850 },
  ];

  const totalPayables = payablesData.reduce((sum, p) => sum + p.amount, 0);
  const totalDiscounts = payablesData.reduce((sum, p) => sum + p.discount, 0);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Accounts Payable Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-700">Total Payables</p>
              <p className="text-2xl font-bold text-orange-900 mt-2">₹{totalPayables.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-700">Due Soon (7 days)</p>
              <p className="text-2xl font-bold text-red-900 mt-2">₹{payablesData.filter(p => p.status === 'Due Soon').reduce((sum, p) => sum + p.amount, 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700">Discounts Available</p>
              <p className="text-2xl font-bold text-green-900 mt-2">₹{totalDiscounts.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-700">Total Bills</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">{payablesData.length}</p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bill No</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Discount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {payablesData.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.vendor}</td>
                    <td className="px-4 py-3 text-gray-700 font-mono">{item.billNo}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{item.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right text-green-700 font-semibold">
                      {item.discount > 0 ? `₹${item.discount.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.dueDate}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                        item.status === 'Due Soon' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Pay Now</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t sticky bottom-0">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Process Batch Payment</button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Close</button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. View Profit Details Modal (Purple)
export function ViewProfitModal({ isOpen, onClose }: any) {
  const profitData = {
    revenue: {
      total: 15200000,
      product: 9500000,
      services: 4100000,
      other: 1600000
    },
    expenses: {
      total: 9800000,
      cogs: 5500000,
      operating: 2900000,
      interest: 800000,
      other: 600000
    },
    profit: {
      gross: 9700000,
      operating: 5400000,
      net: 5400000,
      grossMargin: 63.8,
      operatingMargin: 35.5,
      netMargin: 35.5
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Profit & Loss Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Net Profit (Current Month)</p>
                <p className="text-4xl font-bold text-purple-900 mt-2">₹{profitData.profit.net.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-600">Net Margin</p>
                <p className="text-3xl font-bold text-purple-800 mt-2">{profitData.profit.netMargin}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Revenue Breakdown */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Product Sales</span>
                  <span className="font-bold text-green-700">₹{profitData.revenue.product.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">Services</span>
                  <span className="font-bold text-blue-700">₹{profitData.revenue.services.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-gray-700">Other Income</span>
                  <span className="font-bold text-purple-700">₹{profitData.revenue.other.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border-2 border-green-500">
                  <span className="font-bold text-gray-900">Total Revenue</span>
                  <span className="font-bold text-green-700 text-lg">₹{profitData.revenue.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Expense Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-gray-700">Cost of Goods Sold</span>
                  <span className="font-bold text-red-700">₹{profitData.expenses.cogs.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-700">Operating Expenses</span>
                  <span className="font-bold text-orange-700">₹{profitData.expenses.operating.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-gray-700">Interest Expense</span>
                  <span className="font-bold text-yellow-700">₹{profitData.expenses.interest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <span className="font-medium text-gray-700">Other Expenses</span>
                  <span className="font-bold text-pink-700">₹{profitData.expenses.other.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border-2 border-red-500">
                  <span className="font-bold text-gray-900">Total Expenses</span>
                  <span className="font-bold text-red-700 text-lg">₹{profitData.expenses.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Profitability Metrics */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Profitability Metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-700">Gross Profit</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">₹{profitData.profit.gross.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-green-600 mt-1">Margin: {profitData.profit.grossMargin}%</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-700">Operating Profit</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">₹{profitData.profit.operating.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-blue-600 mt-1">Margin: {profitData.profit.operatingMargin}%</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-purple-700">Net Profit</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">₹{profitData.profit.net.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-purple-600 mt-1">Margin: {profitData.profit.netMargin}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Close</button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <FileText className="h-4 w-4" />
            View Full P&L
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Search Transactions Modal (Indigo)
export function SearchTransactionsModal({ isOpen, onClose, onSearch }: any) {
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    status: 'all',
    account: ''
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Search Transactions</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Keyword Search</label>
              <input
                type="text"
                value={searchCriteria.keyword}
                onChange={(e) => setSearchCriteria({...searchCriteria, keyword: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Search by reference, description, customer, vendor..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select value={searchCriteria.type} onChange={(e) => setSearchCriteria({...searchCriteria, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="all">All Types</option>
                <option value="journal">Journal Entry</option>
                <option value="payment">Payment</option>
                <option value="receipt">Receipt</option>
                <option value="invoice">Invoice</option>
                <option value="bill">Bill</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={searchCriteria.status} onChange={(e) => setSearchCriteria({...searchCriteria, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="all">All Status</option>
                <option value="posted">Posted</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
                <option value="void">Void</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input type="date" value={searchCriteria.dateFrom} onChange={(e) => setSearchCriteria({...searchCriteria, dateFrom: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input type="date" value={searchCriteria.dateTo} onChange={(e) => setSearchCriteria({...searchCriteria, dateTo: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
              <input type="number" value={searchCriteria.minAmount} onChange={(e) => setSearchCriteria({...searchCriteria, minAmount: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0.00" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
              <input type="number" value={searchCriteria.maxAmount} onChange={(e) => setSearchCriteria({...searchCriteria, maxAmount: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0.00" step="0.01" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <select value={searchCriteria.account} onChange={(e) => setSearchCriteria({...searchCriteria, account: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">All Accounts</option>
                <option value="1000">1000 - Cash in Hand</option>
                <option value="1010">1010 - Bank Account</option>
                <option value="1100">1100 - Accounts Receivable</option>
                <option value="2000">2000 - Accounts Payable</option>
                <option value="4000">4000 - Sales Revenue</option>
                <option value="5000">5000 - Cost of Goods Sold</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button onClick={() => setSearchCriteria({ keyword: '', type: 'all', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '', status: 'all', account: '' })} className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium">
            Clear All
          </button>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
            <button onClick={() => { console.log('Search Transactions:', searchCriteria); onSearch(searchCriteria); }} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Recent Activities Modal (Teal)
export function RecentActivitiesModal({ isOpen, onClose }: any) {
  const activities = [
    { id: 1, user: 'John Doe', action: 'Posted journal entry', ref: 'JE-2025-045', time: '10 mins ago', type: 'journal' },
    { id: 2, user: 'Jane Smith', action: 'Approved payment', ref: 'PMT-2025-132', time: '25 mins ago', type: 'payment' },
    { id: 3, user: 'Mike Johnson', action: 'Created invoice', ref: 'INV-2025-289', time: '1 hour ago', type: 'invoice' },
    { id: 4, user: 'Sarah Williams', action: 'Reconciled bank statement', ref: 'REC-OCT-2025', time: '2 hours ago', type: 'reconciliation' },
    { id: 5, user: 'John Doe', action: 'Updated chart of accounts', ref: 'ACC-5500', time: '3 hours ago', type: 'config' },
    { id: 6, user: 'Emily Brown', action: 'Exported financial report', ref: 'P&L-OCT-2025', time: '4 hours ago', type: 'report' },
    { id: 7, user: 'David Lee', action: 'Closed accounting period', ref: 'SEP-2025', time: '1 day ago', type: 'period' },
    { id: 8, user: 'Jane Smith', action: 'Posted receipt', ref: 'RCT-2025-156', time: '1 day ago', type: 'receipt' },
  ];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Recent Activities</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'journal' ? 'bg-blue-100 text-blue-700' :
                  activity.type === 'payment' ? 'bg-green-100 text-green-700' :
                  activity.type === 'invoice' ? 'bg-purple-100 text-purple-700' :
                  activity.type === 'reconciliation' ? 'bg-orange-100 text-orange-700' :
                  activity.type === 'config' ? 'bg-yellow-100 text-yellow-700' :
                  activity.type === 'report' ? 'bg-indigo-100 text-indigo-700' :
                  activity.type === 'period' ? 'bg-red-100 text-red-700' :
                  'bg-teal-100 text-teal-700'
                }`}>
                  {activity.type === 'journal' ? <FileText className="h-5 w-5" /> :
                   activity.type === 'payment' ? <DollarSign className="h-5 w-5" /> :
                   activity.type === 'invoice' ? <Receipt className="h-5 w-5" /> :
                   activity.type === 'reconciliation' ? <Banknote className="h-5 w-5" /> :
                   activity.type === 'report' ? <Download className="h-5 w-5" /> :
                   <FileText className="h-5 w-5" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">
                    by <span className="font-medium">{activity.user}</span> • {activity.ref}
                  </p>
                </div>
                <div className="text-xs text-gray-500 flex-shrink-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t sticky bottom-0">
          <button onClick={onClose} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Close</button>
        </div>
      </div>
    </div>
  );
}
