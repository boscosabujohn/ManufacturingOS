'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Download, Send, Copy, FileText, DollarSign, Calendar, User, Building2, CheckCircle, XCircle, Clock, Package, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { ConfirmDialog } from '@/components/ui';

interface Quote {
  id: string;
  quoteNumber: string;
  title: string;
  customer: string;
  contact: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  amount: number;
  discount: number;
  finalAmount: number;
  validUntil: string;
  createdDate: string;
  sentDate?: string;
  acceptedDate?: string;
  owner: string;
  products: number;
  probability: number;
}

const mockQuotes: Quote[] = [
  {
    id: '1',
    quoteNumber: 'QT-2024-001',
    title: 'Enterprise Software License - Annual',
    customer: 'TechCorp Global Inc.',
    contact: 'Sarah Johnson (CTO)',
    status: 'sent',
    amount: 850000,
    discount: 212500,
    finalAmount: 637500,
    validUntil: '2024-11-30',
    createdDate: '2024-10-15',
    sentDate: '2024-10-16',
    owner: 'Michael Chen',
    products: 5,
    probability: 75,
  },
  {
    id: '2',
    quoteNumber: 'QT-2024-002',
    title: 'Professional Services Package',
    customer: 'FinanceHub International',
    contact: 'Elizabeth Wilson (CFO)',
    status: 'accepted',
    amount: 520000,
    discount: 52000,
    finalAmount: 468000,
    validUntil: '2024-10-31',
    createdDate: '2024-10-10',
    sentDate: '2024-10-11',
    acceptedDate: '2024-10-18',
    owner: 'Emily Rodriguez',
    products: 3,
    probability: 100,
  },
  {
    id: '3',
    quoteNumber: 'QT-2024-003',
    title: 'Cloud Infrastructure Setup',
    customer: 'StartupTech Inc.',
    contact: 'Michael Chen (CEO)',
    status: 'viewed',
    amount: 125000,
    discount: 12500,
    finalAmount: 112500,
    validUntil: '2024-11-15',
    createdDate: '2024-10-18',
    sentDate: '2024-10-19',
    owner: 'David Martinez',
    products: 4,
    probability: 60,
  },
  {
    id: '4',
    quoteNumber: 'QT-2024-004',
    title: 'Manufacturing ERP Implementation',
    customer: 'GlobalManufacturing Corp',
    contact: 'Robert Davis (VP Operations)',
    status: 'draft',
    amount: 950000,
    discount: 95000,
    finalAmount: 855000,
    validUntil: '2024-12-15',
    createdDate: '2024-10-20',
    owner: 'Sarah Johnson',
    products: 8,
    probability: 50,
  },
  {
    id: '5',
    quoteNumber: 'QT-2024-005',
    title: 'Security & Compliance Audit',
    customer: 'FinServ Group',
    contact: 'Compliance Director',
    status: 'sent',
    amount: 75000,
    discount: 3750,
    finalAmount: 71250,
    validUntil: '2024-11-20',
    createdDate: '2024-10-12',
    sentDate: '2024-10-13',
    owner: 'Michael Chen',
    products: 2,
    probability: 70,
  },
  {
    id: '6',
    quoteNumber: 'QT-2024-006',
    title: 'Training & Support - Quarterly',
    customer: 'Enterprise Solutions Ltd.',
    contact: 'John Anderson (CTO)',
    status: 'rejected',
    amount: 48000,
    discount: 0,
    finalAmount: 48000,
    validUntil: '2024-10-25',
    createdDate: '2024-10-05',
    sentDate: '2024-10-06',
    owner: 'Emily Rodriguez',
    products: 1,
    probability: 0,
  },
  {
    id: '7',
    quoteNumber: 'QT-2024-007',
    title: 'Data Migration Services',
    customer: 'Healthcare Systems Inc.',
    contact: 'IT Director',
    status: 'expired',
    amount: 180000,
    discount: 18000,
    finalAmount: 162000,
    validUntil: '2024-10-15',
    createdDate: '2024-09-20',
    sentDate: '2024-09-21',
    owner: 'David Martinez',
    products: 3,
    probability: 40,
  },
];

interface QuoteItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

const mockQuoteItems: QuoteItem[] = [
  {
    id: '1',
    product: 'Enterprise Software License',
    description: 'Annual subscription for up to 500 users',
    quantity: 1,
    unitPrice: 500000,
    discount: 100000,
    total: 400000,
  },
  {
    id: '2',
    product: 'Implementation Services',
    description: 'Professional setup and configuration',
    quantity: 1,
    unitPrice: 150000,
    discount: 50000,
    total: 100000,
  },
  {
    id: '3',
    product: 'Training Package',
    description: 'On-site training for administrators and end users',
    quantity: 1,
    unitPrice: 80000,
    discount: 30000,
    total: 50000,
  },
  {
    id: '4',
    product: 'Premium Support',
    description: '24/7 priority support with 2-hour response time',
    quantity: 1,
    unitPrice: 70000,
    discount: 20000,
    total: 50000,
  },
  {
    id: '5',
    product: 'Data Migration',
    description: 'Migration from legacy system',
    quantity: 1,
    unitPrice: 50000,
    discount: 12500,
    total: 37500,
  },
];

export default function QuoteViewPage() {
  const router = useRouter();
  const params = useParams();
  const quoteId = params?.id as string;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);

  const quote = mockQuotes.find(q => q.id === quoteId);

  if (!quote) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Quote Not Found</h2>
          <p className="text-gray-600 mb-4">The quote you're looking for doesn't exist.</p>
          <Link href="/crm/quotes" className="text-blue-600 hover:underline">
            Return to Quotes
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'sent':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'viewed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'expired':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'viewed':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'expired':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleEdit = () => {
    router.push(`/crm/quotes/edit/${quote.id}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    router.push('/crm/quotes');
  };

  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${quote.quoteNumber}.pdf`;
  };

  const handleSend = () => {
    setShowSendDialog(true);
  };

  const confirmSend = () => {
    setShowSendDialog(false);
    router.push('/crm/quotes');
  };

  const handleCopy = () => {
    router.push('/crm/quotes');
  };

  const isExpiringSoon = (validUntil: string) => {
    const daysUntilExpiry = Math.ceil((new Date(validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const discountPercentage = quote.amount > 0 ? ((quote.discount / quote.amount) * 100).toFixed(0) : '0';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Quotes</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{quote.quoteNumber}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${getStatusColor(quote.status)}`}>
                {getStatusIcon(quote.status)}
                {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
              </span>
              {isExpiringSoon(quote.validUntil) && quote.status === 'sent' && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Expiring Soon
                </span>
              )}
            </div>
            <h2 className="text-xl text-gray-700 mb-1">{quote.title}</h2>
            <p className="text-gray-600">{quote.customer}</p>
          </div>

          <div className="flex items-center gap-2">
            {quote.status === 'draft' && (
              <button
                onClick={handleSend}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                <span>Send Quote</span>
              </button>
            )}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 text-blue-600"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900">Original Amount</p>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">${(quote.amount / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-900">Discount</p>
            <DollarSign className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-900">{discountPercentage}%</p>
          <p className="text-sm text-orange-700 mt-1">${(quote.discount / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-900">Final Amount</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">${(quote.finalAmount / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-900">Win Probability</p>
            <CheckCircle className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{quote.probability}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Items</h2>

            <div className="space-y-4">
              {mockQuoteItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-gray-900">${item.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-gray-500">Qty: </span>
                      <span className="font-medium text-gray-900">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Unit Price: </span>
                      <span className="font-medium text-gray-900">${item.unitPrice.toLocaleString()}</span>
                    </div>
                    {item.discount > 0 && (
                      <div>
                        <span className="text-gray-500">Discount: </span>
                        <span className="font-medium text-orange-600">-${item.discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${quote.amount.toLocaleString()}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex items-center justify-between text-orange-600">
                    <span>Total Discount ({discountPercentage}%)</span>
                    <span className="font-semibold">-${quote.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                  <span>Total Amount</span>
                  <span>${quote.finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Payment terms: Net 30 days from invoice date</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>This quote is valid until {new Date(quote.validUntil).toLocaleDateString()}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>All prices are in USD and exclude applicable taxes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Implementation timeline: 8-12 weeks from contract signature</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>Standard warranty and support terms apply</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quote Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Quote Number</p>
                <p className="text-sm font-medium text-gray-900">{quote.quoteNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm border ${getStatusColor(quote.status)}`}>
                  {getStatusIcon(quote.status)}
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Created Date</p>
                <p className="text-sm font-medium text-gray-900">{new Date(quote.createdDate).toLocaleDateString()}</p>
              </div>

              {quote.sentDate && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sent Date</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(quote.sentDate).toLocaleDateString()}</p>
                </div>
              )}

              {quote.acceptedDate && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Accepted Date</p>
                  <p className="text-sm font-medium text-green-600">{new Date(quote.acceptedDate).toLocaleDateString()}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Valid Until</p>
                <p className={`text-sm font-medium ${isExpiringSoon(quote.validUntil) ? 'text-orange-600' : 'text-gray-900'}`}>
                  {new Date(quote.validUntil).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Quote Owner</p>
                <p className="text-sm font-medium text-gray-900">{quote.owner}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Number of Products</p>
                <p className="text-sm font-medium text-gray-900">{quote.products}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-sm font-medium text-gray-900">{quote.customer}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="text-sm font-medium text-gray-900">{quote.contact}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-blue-600">contact@customer.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">123 Business Ave<br />Suite 456<br />San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Quote"
        message={`Are you sure you want to delete ${quote.quoteNumber} - "${quote.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Send Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSendDialog}
        onClose={() => setShowSendDialog(false)}
        onConfirm={confirmSend}
        title="Send Quote"
        message={`Are you sure you want to send ${quote.quoteNumber} to ${quote.customer}?`}
        confirmLabel="Send"
        variant="info"
      />
    </div>
  );
}
