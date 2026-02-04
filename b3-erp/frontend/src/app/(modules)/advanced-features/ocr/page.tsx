'use client';

import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, Check, Loader2, AlertCircle, ScanText } from 'lucide-react';
import Link from 'next/link';

export default function OCRPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const handleUpload = () => {
        setIsUploading(true);
        setUploadStatus('processing');
        // Simulate processing
        setTimeout(() => {
            setIsUploading(false);
            setUploadStatus('success');
        }, 2000);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-3">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/advanced-features" className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">OCR Integration</h1>
                        <p className="text-gray-600 mt-1">Automated document processing and data extraction</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Upload Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Upload Document</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                <Upload className="w-6 h-6" />
                            </div>
                            <p className="text-gray-900 font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500 mb-2">PDF, PNG, JPG up to 10MB</p>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || uploadStatus === 'success'}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full transition-colors"
                            >
                                {isUploading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </span>
                                ) : uploadStatus === 'success' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Processed
                                    </span>
                                ) : (
                                    'Select File'
                                )}
                            </button>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Supported Documents</h3>
                            <ul className="space-y-2">
                                {['Invoices', 'Purchase Orders', 'Receipts', 'Delivery Challans'].map((item, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-green-500 mr-2" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2">
                    {uploadStatus === 'success' ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FileText className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Extraction Results</h2>
                                        <p className="text-sm text-gray-500">invoice_oct_2025.pdf</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    Confidence: 98.5%
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Vendor Name</label>
                                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-900 font-medium">
                                        Acme Industrial Supplies Ltd.
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Invoice Number</label>
                                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-900 font-medium">
                                        INV-2025-8892
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Date</label>
                                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-900 font-medium">
                                        Oct 24, 2025
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Total Amount</label>
                                    <div className="p-2 bg-gray-50 rounded border border-gray-200 text-gray-900 font-medium">
                                        $4,250.00
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 font-medium text-gray-700">Item Description</th>
                                            <th className="px-4 py-2 font-medium text-gray-700 text-right">Qty</th>
                                            <th className="px-4 py-2 font-medium text-gray-700 text-right">Unit Price</th>
                                            <th className="px-4 py-2 font-medium text-gray-700 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr>
                                            <td className="px-4 py-2 text-gray-900">Industrial Lubricant 50L</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">2</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">$500.00</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">$1,000.00</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-gray-900">Safety Gloves (Pack of 100)</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">5</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">$50.00</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">$250.00</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-gray-900">CNC Drill Bits Set</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">1</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">$3,000.00</td>
                                            <td className="px-4 py-2 text-gray-900 text-right">$3,000.00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setUploadStatus('idle')}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Discard
                                </button>
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    Approve & Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                <ScanText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Document Selected</h3>
                            <p className="text-gray-500 max-w-sm">
                                Upload an invoice or receipt to automatically extract data using our advanced OCR engine.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
