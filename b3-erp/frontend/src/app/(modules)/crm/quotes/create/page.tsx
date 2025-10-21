'use client';

import { useState } from 'react';
import { Save, Send, Eye, Plus, X, Search, Calculator, Percent, DollarSign, Calendar, User, Building2, Mail, Phone, FileText, Package, Trash2 } from 'lucide-react';

interface QuoteItem {
  id: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Smith', company: 'Acme Corp', email: 'john@acme.com', phone: '+1 555-0101' },
  { id: '2', name: 'Sarah Johnson', company: 'TechStart Inc', email: 'sarah@techstart.com', phone: '+1 555-0102' },
  { id: '3', name: 'Michael Chen', company: 'Global Industries', email: 'michael@global.com', phone: '+1 555-0103' },
  { id: '4', name: 'Emily Davis', company: 'Innovate Solutions', email: 'emily@innovate.com', phone: '+1 555-0104' },
];

const mockProducts = [
  { id: '1', name: 'Enterprise Software License', price: 5000, description: 'Annual license for up to 100 users' },
  { id: '2', name: 'Professional Services', price: 150, description: 'Per hour consulting and implementation' },
  { id: '3', name: 'Training Package', price: 2500, description: 'Comprehensive team training (5 sessions)' },
  { id: '4', name: 'Premium Support', price: 1200, description: 'Monthly premium support package' },
  { id: '5', name: 'Custom Integration', price: 8000, description: 'Custom API integration and setup' },
];

export default function CreateQuotePage() {
  const [quoteNumber] = useState(`Q-${Date.now().toString().slice(-6)}`);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  const [quoteName, setQuoteName] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [notes, setNotes] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('Payment due within 30 days of acceptance. All prices are in USD.');

  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [globalDiscountType, setGlobalDiscountType] = useState<'percentage' | 'fixed'>('percentage');

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const addProduct = (product: typeof mockProducts[0]) => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      productName: product.name,
      description: product.description,
      quantity: 1,
      unitPrice: product.price,
      discount: 0,
      tax: 10,
      total: product.price * 1.1,
    };
    setItems([...items, newItem]);
    setShowProductSearch(false);
    setProductSearchTerm('');
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: number | string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount' || field === 'tax') {
          const subtotal = (updated.quantity as number) * (updated.unitPrice as number);
          const afterDiscount = subtotal - (subtotal * (updated.discount as number) / 100);
          updated.total = afterDiscount + (afterDiscount * (updated.tax as number) / 100);
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);

  const itemDiscounts = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice * item.discount / 100);
  }, 0);

  const afterItemDiscounts = subtotal - itemDiscounts;

  const globalDiscountAmount = globalDiscountType === 'percentage'
    ? afterItemDiscounts * globalDiscount / 100
    : globalDiscount;

  const afterAllDiscounts = afterItemDiscounts - globalDiscountAmount;

  const totalTax = items.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const afterDiscount = itemSubtotal - (itemSubtotal * item.discount / 100);
    return sum + (afterDiscount * item.tax / 100);
  }, 0);

  const grandTotal = afterAllDiscounts + totalTax;

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + validityDays);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex gap-3 mb-6 justify-end">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Send className="w-4 h-4" />
            Send Quote
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quote Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote Name</label>
                  <input
                    type="text"
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    placeholder="e.g., Enterprise Software Package Q4 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid For (Days)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={validityDays}
                      onChange={(e) => setValidityDays(Number(e.target.value))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      Valid until: {validUntil.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer
              </h2>

              {selectedCustomer ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{selectedCustomer.company}</h3>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4" />
                          {selectedCustomer.name}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4" />
                          {selectedCustomer.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4" />
                          {selectedCustomer.phone}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setShowCustomerSearch(true)}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Select Customer
                  </button>

                  {showCustomerSearch && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-4">
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search customers..."
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowCustomerSearch(false);
                              setCustomerSearchTerm('');
                            }}
                            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300"
                          >
                            <div className="font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-600">{customer.company}</div>
                            <div className="text-xs text-gray-500">{customer.email}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Line Items
              </h2>

              {items.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-5 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            min="1"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Unit Price</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            min="0"
                            step="0.01"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Discount %</label>
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, 'discount', Number(e.target.value))}
                            min="0"
                            max="100"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Tax %</label>
                          <input
                            type="number"
                            value={item.tax}
                            onChange={(e) => updateItem(item.id, 'tax', Number(e.target.value))}
                            min="0"
                            max="100"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Total</label>
                          <div className="px-2 py-1 text-sm font-semibold text-gray-900 bg-gray-50 rounded border border-gray-200">
                            ${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 mb-4">
                  <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No items added yet</p>
                </div>
              )}

              <button
                onClick={() => setShowProductSearch(true)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Product/Service
              </button>

              {showProductSearch && (
                <div className="mt-4 border border-gray-200 rounded-lg p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addProduct(product)}
                        className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-600">{product.description}</div>
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            ${product.price.toLocaleString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes and Terms */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Internal notes (not visible to customer)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                  <textarea
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    rows={4}
                    placeholder="Terms and conditions (visible to customer)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Quote Summary
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Item Discounts */}
                {itemDiscounts > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Item Discounts</span>
                    <span className="font-medium">-${itemDiscounts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                {/* Global Discount */}
                <div className="pt-3 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Discount</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      value={globalDiscount}
                      onChange={(e) => setGlobalDiscount(Number(e.target.value))}
                      min="0"
                      step="0.01"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={globalDiscountType}
                      onChange={(e) => setGlobalDiscountType(e.target.value as 'percentage' | 'fixed')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                  {globalDiscountAmount > 0 && (
                    <div className="flex justify-between text-orange-600 text-sm">
                      <span>Discount Amount</span>
                      <span className="font-medium">-${globalDiscountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>

                {/* After Discounts */}
                <div className="flex justify-between text-gray-700 pt-3 border-t border-gray-200">
                  <span>After Discounts</span>
                  <span className="font-medium">${afterAllDiscounts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-gray-700">
                  <span>Total Tax</span>
                  <span className="font-medium">${totalTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Grand Total */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Grand Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Total Savings */}
                {(itemDiscounts + globalDiscountAmount) > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center text-green-700">
                      <span className="text-sm font-medium">Total Savings</span>
                      <span className="text-lg font-bold">
                        ${(itemDiscounts + globalDiscountAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      {(((itemDiscounts + globalDiscountAmount) / subtotal) * 100).toFixed(1)}% off original price
                    </div>
                  </div>
                )}

                {/* Quote Info */}
                <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Valid until: {validUntil.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Items: {items.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
