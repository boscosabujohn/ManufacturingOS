'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    Globe,
    Star,
    TrendingUp,
    Package,
    DollarSign,
    Calendar,
    FileText,
    CheckCircle,
    AlertCircle,
    Clock,
    Edit,
    MoreVertical,
    Download,
    ExternalLink
} from 'lucide-react';
import { vendorService, Vendor } from '@/services/VendorService';

export default function VendorDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'performance' | 'documents'>('overview');

    useEffect(() => {
        if (id) {
            fetchVendorDetails();
        }
    }, [id]);

    const fetchVendorDetails = async () => {
        try {
            setLoading(true);
            const data = await vendorService.getVendorById(id);
            setVendor(data);
        } catch (error) {
            console.error('Failed to fetch vendor details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!vendor) {
        return <div className="flex justify-center items-center min-h-screen">Vendor not found</div>;
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            Active: 'bg-green-100 text-green-700 border-green-200',
            Inactive: 'bg-gray-100 text-gray-700 border-gray-200',
            Blacklisted: 'bg-red-100 text-red-700 border-red-200',
            Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
        return colors[status] || colors.Inactive;
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return 'text-green-600';
        if (rating >= 4.0) return 'text-blue-600';
        if (rating >= 3.5) return 'text-yellow-600';
        return 'text-orange-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="w-full px-3">
                    <div className="py-2">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Vendors
                        </button>

                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{vendor.vendorName}</h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm text-gray-500">{vendor.vendorCode}</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vendor.status)}`}>
                                            {vendor.status}
                                        </span>
                                        <span className="text-sm text-gray-500">• {vendor.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push(`/procurement/vendors/${id}/edit`)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                    <FileText className="h-4 w-4" />
                                    Create PO
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-8 mt-8 border-b border-gray-200">
                            {['overview', 'orders', 'performance', 'documents'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`pb-4 text-sm font-medium capitalize transition-colors relative ${activeTab === tab
                                        ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full px-3 py-8">
                <div className="grid grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="col-span-2 space-y-3">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Total Spend</span>
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${((vendor.totalPurchases || 0) / 1000).toFixed(1)}K
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+12% vs last year</span>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Avg Rating</span>
                                    <Star className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {(vendor.averageRating || 0).toFixed(1)}
                                    </span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= (vendor.averageRating || 0)
                                                    ? 'text-yellow-400 fill-current'
                                                    : 'text-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-500">Open Orders</span>
                                    <Package className="h-4 w-4 text-gray-400" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">3</p>
                                <p className="text-xs text-gray-500 mt-1">Next delivery: Tomorrow</p>
                            </div>
                        </div>

                        {/* Detailed Info */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Vendor Information</h3>
                                <button className="text-sm text-blue-600 hover:text-blue-700">Edit Details</button>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Person</h4>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-600">
                                                {vendor.contactPerson.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <span>{vendor.contactPerson}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <a href={`mailto:${vendor.email}`} className="hover:text-blue-600">
                                            {vendor.email}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h4>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span>{vendor.phone}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <a href="#" className="hover:text-blue-600">www.example.com</a>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                                    <div className="flex items-start gap-2 text-gray-900">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <span>{vendor.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-3 py-2 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                        <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Purchase Order #PO-2024-{100 + i} Created</p>
                                            <p className="text-xs text-gray-500">Created by John Doe • 2 hours ago</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <ExternalLink className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-3">
                        {/* Performance Card */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-2">Performance Overview</h3>
                            <div className="space-y-2">
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-600">On-Time Delivery</span>
                                        <span className="font-medium text-gray-900">95%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-600">Quality Score</span>
                                        <span className="font-medium text-gray-900">88%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-600">Response Time</span>
                                        <span className="font-medium text-gray-900">92%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }} />
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                View Full Report
                            </button>
                        </div>

                        {/* Financials */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-2">Financial Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Payment Terms</span>
                                    <span className="font-medium text-gray-900">{vendor.paymentTerms || 'Net 30'}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Currency</span>
                                    <span className="font-medium text-gray-900">{vendor.currency}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Tax ID</span>
                                    <span className="font-medium text-gray-900">{vendor.taxId || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Outstanding</span>
                                    <span className="font-medium text-red-600">${vendor.outstandingPayables}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-2">Tags & Certifications</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                    ISO 9001
                                </span>
                                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                                    Preferred
                                </span>
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                    Eco-Friendly
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
