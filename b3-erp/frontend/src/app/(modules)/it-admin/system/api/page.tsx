'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, Play, Code, Server, Shield, Lock, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';

interface ApiEndpoint {
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    summary: string;
    description: string;
    parameters?: {
        name: string;
        type: string;
        required: boolean;
        description: string;
    }[];
    response?: string;
}

export default function ApiDocsPage() {
    const router = useRouter();
    const [selectedSection, setSelectedSection] = useState('authentication');
    const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
    const [expandedEndpoints, setExpandedEndpoints] = useState<string[]>([]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedEndpoint(text);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    const toggleEndpoint = (id: string) => {
        setExpandedEndpoints(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const endpoints: ApiEndpoint[] = [
        {
            id: 'auth-login',
            method: 'POST',
            path: '/api/v1/auth/login',
            summary: 'User Login',
            description: 'Authenticate a user and return an access token.',
            parameters: [
                { name: 'email', type: 'string', required: true, description: 'User email address' },
                { name: 'password', type: 'string', required: true, description: 'User password' }
            ],
            response: '{\n  "token": "eyJhbGciOiJIUzI1NiIs...",\n  "user": {\n    "id": "usr_123",\n    "email": "user@example.com"\n  }\n}'
        },
        {
            id: 'orders-list',
            method: 'GET',
            path: '/api/v1/orders',
            summary: 'List Orders',
            description: 'Retrieve a list of sales orders with optional filtering.',
            parameters: [
                { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
                { name: 'limit', type: 'integer', required: false, description: 'Items per page (default: 20)' },
                { name: 'status', type: 'string', required: false, description: 'Filter by order status' }
            ],
            response: '{\n  "data": [\n    {\n      "id": "ord_123",\n      "customer": "Acme Corp",\n      "total": 1250.00,\n      "status": "pending"\n    }\n  ],\n  "meta": {\n    "total": 45,\n    "page": 1\n  }\n}'
        },
        {
            id: 'orders-create',
            method: 'POST',
            path: '/api/v1/orders',
            summary: 'Create Order',
            description: 'Create a new sales order.',
            parameters: [
                { name: 'customer_id', type: 'string', required: true, description: 'ID of the customer' },
                { name: 'items', type: 'array', required: true, description: 'List of order items' }
            ],
            response: '{\n  "id": "ord_124",\n  "status": "draft",\n  "created_at": "2024-01-20T10:00:00Z"\n}'
        },
        {
            id: 'inventory-check',
            method: 'GET',
            path: '/api/v1/inventory/{sku}',
            summary: 'Check Stock',
            description: 'Get current stock level for a specific product SKU.',
            parameters: [
                { name: 'sku', type: 'string', required: true, description: 'Product SKU code' }
            ],
            response: '{\n  "sku": "PROD-001",\n  "quantity": 150,\n  "reserved": 20,\n  "available": 130\n}'
        }
    ];

    const getMethodColor = (method: string) => {
        const colors: { [key: string]: string } = {
            GET: 'bg-blue-100 text-blue-700 border-blue-200',
            POST: 'bg-green-100 text-green-700 border-green-200',
            PUT: 'bg-orange-100 text-orange-700 border-orange-200',
            DELETE: 'bg-red-100 text-red-700 border-red-200',
            PATCH: 'bg-purple-100 text-purple-700 border-purple-200'
        };
        return colors[method] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50 px-3 py-2 w-full max-w-full">
            <div className="mb-3 flex items-center gap-2">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
                    <p className="text-sm text-gray-500 mt-1">RESTful API reference and playground</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Open Swagger UI
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Generate API Key
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                {/* Sidebar Navigation */}
                <div className="bg-white rounded-xl border border-gray-200 p-3 h-fit sticky top-6">
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 px-2">Resources</h2>
                    <nav className="space-y-1">
                        {['Authentication', 'Orders', 'Inventory', 'Customers', 'Products', 'Webhooks'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setSelectedSection(item.toLowerCase())}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSection === item.toLowerCase()
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 px-2">Client Libraries</h2>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                <Code className="w-4 h-4" /> Node.js SDK
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                                <Code className="w-4 h-4" /> Python SDK
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-3">
                    {/* Authentication Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-3">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication</h2>
                        <p className="text-gray-600 mb-2">
                            All API requests must be authenticated using a Bearer Token in the Authorization header.
                        </p>
                        <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-gray-300">
                            <div className="flex justify-between items-start">
                                <p>Authorization: Bearer &lt;your_access_token&gt;</p>
                                <button
                                    onClick={() => copyToClipboard('Authorization: Bearer <your_access_token>')}
                                    className="text-gray-500 hover:text-white"
                                >
                                    {copiedEndpoint === 'Authorization: Bearer <your_access_token>' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Endpoints List */}
                    <div className="space-y-2">
                        {endpoints.map((endpoint) => (
                            <div key={endpoint.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleEndpoint(endpoint.id)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getMethodColor(endpoint.method)}`}>
                                            {endpoint.method}
                                        </span>
                                        <span className="font-mono text-sm text-gray-700">{endpoint.path}</span>
                                        <span className="text-sm text-gray-500">- {endpoint.summary}</span>
                                    </div>
                                    {expandedEndpoints.includes(endpoint.id) ? (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {expandedEndpoints.includes(endpoint.id) && (
                                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                                        <p className="text-gray-600 mb-3">{endpoint.description}</p>

                                        {endpoint.parameters && (
                                            <div className="mb-3">
                                                <h3 className="text-sm font-bold text-gray-900 mb-3">Parameters</h3>
                                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {endpoint.parameters.map((param) => (
                                                                <tr key={param.name}>
                                                                    <td className="px-4 py-2 text-sm font-mono text-gray-900">{param.name}</td>
                                                                    <td className="px-4 py-2 text-sm text-gray-600">{param.type}</td>
                                                                    <td className="px-4 py-2 text-sm">
                                                                        {param.required ? (
                                                                            <span className="text-red-600 font-medium">Yes</span>
                                                                        ) : (
                                                                            <span className="text-gray-500">No</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-sm text-gray-600">{param.description}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 mb-3">Example Request</h3>
                                                <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-gray-300 overflow-x-auto">
                                                    <p className="text-green-400">curl</p>
                                                    <p className="pl-4">-X {endpoint.method}</p>
                                                    <p className="pl-4">https://api.b3erp.com{endpoint.path}</p>
                                                    <p className="pl-4">-H "Authorization: Bearer token"</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 mb-3">Example Response</h3>
                                                <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-300 overflow-x-auto">
                                                    <pre>{endpoint.response}</pre>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 text-sm">
                                                <Play className="w-4 h-4" />
                                                Try it out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
