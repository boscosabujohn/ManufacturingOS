import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { projectFinancialsApi } from '@/services/api';

interface ProjectFinancialsProps {
    projectId: string;
}

const ProjectFinancials: React.FC<ProjectFinancialsProps> = ({ projectId }) => {
    const [financials, setFinancials] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFinancials = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await projectFinancialsApi.getFinancials(projectId);

                if (response.success) {
                    // Merge API data with mock chart data (charts data would come from backend in production)
                    setFinancials({
                        ...response.data,
                        expensesByCategory: [
                            { name: 'Materials', value: response.data.totalExpenditure * 0.47 },
                            { name: 'Labor', value: response.data.totalExpenditure * 0.31 },
                            { name: 'Equipment', value: response.data.totalExpenditure * 0.16 },
                            { name: 'Overhead', value: response.data.totalExpenditure * 0.06 },
                        ],
                        monthlyTrend: [] // Would come from backend
                    });
                }
            } catch (err) {
                console.error('Failed to fetch financials:', err);
                setError('Failed to load financial data');
            } finally {
                setLoading(false);
            }
        };

        fetchFinancials();
    }, [projectId]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading financials...</div>
            </div>
        );
    }

    if (error || !financials) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">{error || 'No financial data available'}</div>
            </div>
        );
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{financials.budget.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenditure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">₹{financials.totalExpenditure.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">₹{financials.totalIncome.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Margin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${financials.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{financials.margin.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Status: {financials.financialStatus}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Income vs Expenditure Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financials.monthlyTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="income" fill="#10b981" name="Income" />
                                <Bar dataKey="expense" fill="#ef4444" name="Expenditure" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={financials.expensesByCategory}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {financials.expensesByCategory.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectFinancials;
