'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Mail, FileText, Check, X, Calendar, User, DollarSign, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { quotationService, Quotation } from '@/services/quotation.service';

const CURRENCY_SYMBOLS: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
};

export default function QuotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const quoteId = params.id as string;
    const [quote, setQuote] = useState<Quotation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                setLoading(true);
                const data = await quotationService.getQuotationById(quoteId);
                setQuote(data);
            } catch (err) {
                console.error('Error fetching quotation:', err);
                setError('Failed to load quotation details.');
            } finally {
                setLoading(false);
            }
        };

        if (quoteId) {
            fetchQuotation();
        }
    }, [quoteId]);

    const handleBack = () => router.push('/sales/quotations');

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !quote) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-600 font-medium mb-4">{error || 'Quotation not found'}</p>
                <Button onClick={handleBack}>Go Back</Button>
            </div>
        );
    }

    const currencySymbol = CURRENCY_SYMBOLS[quote.currency] || quote.currency;

    return (
        <div className="w-full px-4 py-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-2 px-0 hover:bg-transparent text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Quotations
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-gray-900">{quote.quotationNumber}</h1>
                        <Badge className={`
                          ${quote.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                                quote.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                                    quote.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'} border-none px-3 py-1 font-bold
                        `}>
                            {quote.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="border-gray-200">
                        <Download className="mr-2 h-4 w-4" /> PDF
                    </Button>
                    <Button variant="outline" className="border-gray-200">
                        <Mail className="mr-2 h-4 w-4" /> Send
                    </Button>
                    {quote.status !== 'Converted' && (
                        <Button className="bg-blue-600 hover:bg-blue-700 font-bold">
                            Convert to Order
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quotation Body */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Items & Details</h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2 py-1 rounded-full border
                                ${quote.marginStatus === 'Healthy' ? 'bg-green-50 text-green-700 border-green-100' :
                                        quote.marginStatus === 'Warning' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                            'bg-red-50 text-red-700 border-red-100'}
                              `}>
                                    {quote.marginStatus.toUpperCase()} MARGIN
                                </span>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-gray-50/30 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 tracking-widest uppercase">Description</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 tracking-widest uppercase">Qty</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 tracking-widest uppercase">Price</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 tracking-widest uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {quote.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 text-sm">{item.productName}</div>
                                                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                                                {item.quantity} {item.uom}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                                                {currencySymbol}{item.unitPrice.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="text-sm font-bold text-gray-900">{currencySymbol}{item.totalPrice.toLocaleString()}</div>
                                                {item.discount > 0 && (
                                                    <div className="text-[10px] text-orange-600 font-bold">-{item.discount}% OFF</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="p-6 bg-gray-50/30 border-t border-gray-100">
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex justify-between w-64 text-sm">
                                        <span className="text-gray-500 font-medium">Subtotal</span>
                                        <span className="font-bold text-gray-900">{currencySymbol}{quote.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between w-64 text-sm text-orange-600">
                                        <span className="font-medium">Total Discount</span>
                                        <span className="font-bold">-{currencySymbol}{quote.discountAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between w-64 text-sm text-gray-700">
                                        <span className="font-medium">Tax</span>
                                        <span className="font-bold">+{currencySymbol}{quote.taxAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="w-64 border-t border-gray-200 my-2 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-black text-gray-900">Grand Total</span>
                                            <span className="text-xl font-black text-blue-600">
                                                {currencySymbol}{quote.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {quote.notes && (
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="py-4">
                                <CardTitle className="text-sm font-bold text-gray-900">Additional Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{quote.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50/50 py-4 border-b border-gray-100">
                            <CardTitle className="text-sm font-bold text-gray-900">Customer Info</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                                <p className="font-bold text-gray-900">{quote.customerName}</p>
                            </div>
                            {quote.contactPerson && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Person</p>
                                    <p className="text-sm font-medium text-gray-700">{quote.contactPerson}</p>
                                </div>
                            )}
                            {(quote.customerEmail || quote.customerPhone) && (
                                <div className="pt-2 space-y-2">
                                    {quote.customerEmail && (
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Mail className="h-3.5 w-3.5" /> {quote.customerEmail}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50/50 py-4 border-b border-gray-100">
                            <CardTitle className="text-sm font-bold text-gray-900">Key Dates</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 text-gray-400" /> Quotation Date
                                </div>
                                <span className="text-sm font-bold text-gray-900">{new Date(quote.quotationDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4 text-blue-400" /> Valid Until
                                </div>
                                <span className="text-sm font-bold text-blue-600">{new Date(quote.validUntil).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-50 bg-orange-50/20 shadow-none border">
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm font-bold text-orange-900">Payment & Terms</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-orange-700/60 uppercase tracking-widest mb-1">Payment Terms</p>
                                <p className="text-sm font-bold text-orange-900">{quote.paymentTerms}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-orange-700/60 uppercase tracking-widest mb-1">Delivery Terms</p>
                                <p className="text-sm font-bold text-orange-900">{quote.deliveryTerms}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
