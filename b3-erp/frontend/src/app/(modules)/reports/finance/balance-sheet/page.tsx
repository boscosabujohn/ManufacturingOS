'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { ClickableKPICard } from '@/components/reports/ClickableKPICard';

export default function BalanceSheetReport() {
    const router = useRouter();

    const data = {
        totalAssets: 15500000,
        totalLiabilities: 8200000,
        totalEquity: 7300000,
        currentAssets: 6500000,
        fixedAssets: 9000000,
        currentLiabilities: 3200000,
        longTermLiabilities: 5000000,
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Balance Sheet</h1>
                    <p className="text-gray-600">Statement of financial position - Click cards to drill down</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <ClickableKPICard
                    title="Total Assets"
                    value={`₹${(data.totalAssets / 10000000).toFixed(2)}Cr`}
                    color="blue"
                    description="Click for breakdown"
                    onClick={() => router.push('/reports/finance/balance-sheet/assets')}
                />
                <ClickableKPICard
                    title="Total Liabilities"
                    value={`₹${(data.totalLiabilities / 10000000).toFixed(2)}Cr`}
                    color="red"
                    description="Click for breakdown"
                    onClick={() => router.push('/reports/finance/balance-sheet/liabilities')}
                />
                <ClickableKPICard
                    title="Total Equity"
                    value={`₹${(data.totalEquity / 10000000).toFixed(2)}Cr`}
                    color="green"
                    description="Click for breakdown"
                    onClick={() => router.push('/reports/finance/balance-sheet/equity')}
                />
            </div>

            {/* Balance Sheet Statement */}
            <Card>
                <CardHeader><CardTitle>Balance Sheet Statement</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                        <tbody>
                            <tr className="bg-blue-50 cursor-pointer hover:bg-blue-100" onClick={() => router.push('/reports/finance/balance-sheet/assets')}>
                                <td className="px-6 py-3 font-bold text-blue-900">ASSETS</td>
                                <td className="px-6 py-3 text-right font-bold text-blue-900">
                                    ₹{data.totalAssets.toLocaleString()}
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-6 py-2 pl-12">Current Assets</td>
                                <td className="px-6 py-2 text-right">₹{data.currentAssets.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-6 py-2 pl-12">Fixed Assets</td>
                                <td className="px-6 py-2 text-right">₹{data.fixedAssets.toLocaleString()}</td>
                            </tr>

                            <tr className="bg-red-50 cursor-pointer hover:bg-red-100" onClick={() => router.push('/reports/finance/balance-sheet/liabilities')}>
                                <td className="px-6 py-3 font-bold text-red-900">LIABILITIES</td>
                                <td className="px-6 py-3 text-right font-bold text-red-900">
                                    ₹{data.totalLiabilities.toLocaleString()}
                                </td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-6 py-2 pl-12">Current Liabilities</td>
                                <td className="px-6 py-2 text-right">₹{data.currentLiabilities.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="px-6 py-2 pl-12">Long-term Liabilities</td>
                                <td className="px-6 py-2 text-right">₹{data.longTermLiabilities.toLocaleString()}</td>
                            </tr>

                            <tr className="bg-green-50 cursor-pointer hover:bg-green-100" onClick={() => router.push('/reports/finance/balance-sheet/equity')}>
                                <td className="px-6 py-3 font-bold text-green-900">EQUITY</td>
                                <td className="px-6 py-3 text-right font-bold text-green-900">
                                    ₹{data.totalEquity.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
