import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useMonthlyTrends, useCategoryTrends, useTopSpendingMonths } from '../hooks/useAnalytics';
import { formatCurrency } from '../utils/formatters';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState(6);

    const { data: monthlyTrends, isLoading: trendsLoading } = useMonthlyTrends(timeRange);
    const { data: categoryTrends, isLoading: categoryLoading } = useCategoryTrends(timeRange);
    const { data: topMonths, isLoading: topMonthsLoading } = useTopSpendingMonths(5);

    // Process category trends for stacked area chart
    const processedCategoryData = React.useMemo(() => {
        if (!categoryTrends || categoryTrends.length === 0) return [];

        // Group by month
        const grouped = categoryTrends.reduce((acc, item) => {
            const key = `${item.year}-${item.month}`;
            if (!acc[key]) {
                acc[key] = {
                    monthName: item.monthName,
                    year: item.year,
                    month: item.month,
                };
            }
            acc[key][item.categoryName] = parseFloat(item.amount);
            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });
    }, [categoryTrends]);

    // Get unique categories for the area chart
    const categories = React.useMemo(() => {
        if (!categoryTrends) return [];
        const uniqueCategories = [...new Set(categoryTrends.map(t => t.categoryName))];
        return uniqueCategories.slice(0, 5); // Top 5 categories
    }, [categoryTrends]);

    // Colors for charts
    const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

    // Calculate summary stats
    const totalIncome = monthlyTrends?.reduce((sum, t) => sum + parseFloat(t.income), 0) || 0;
    const totalExpenses = monthlyTrends?.reduce((sum, t) => sum + parseFloat(t.expenses), 0) || 0;
    const avgMonthlyExpenses = monthlyTrends?.length > 0 ? totalExpenses / monthlyTrends.length : 0;

    if (trendsLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-500">Loading analytics...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Insights into your spending patterns
                        </p>
                    </div>

                    {/* Time Range Selector */}
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(parseInt(e.target.value))}
                        className="input-field w-48"
                    >
                        <option value={3}>Last 3 Months</option>
                        <option value={6}>Last 6 Months</option>
                        <option value={12}>Last 12 Months</option>
                    </select>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Income</p>
                                <p className="mt-2 text-2xl font-bold text-green-600">
                                    {formatCurrency(totalIncome)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Last {timeRange} months
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <FiTrendingUp className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Expenses</p>
                                <p className="mt-2 text-2xl font-bold text-red-600">
                                    {formatCurrency(totalExpenses)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Last {timeRange} months
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <FiTrendingDown className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Monthly Spending</p>
                                <p className="mt-2 text-2xl font-bold text-primary-600">
                                    {formatCurrency(avgMonthlyExpenses)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Average per month
                                </p>
                            </div>
                            <div className="p-3 bg-primary-100 rounded-full">
                                <FiDollarSign className="w-8 h-8 text-primary-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Income vs Expenses Trend */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Income vs Expenses
                    </h2>
                    {monthlyTrends && monthlyTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="monthName"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Income"
                                    dot={{ fill: '#10b981', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    name="Expenses"
                                    dot={{ fill: '#ef4444', r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="net"
                                    stroke="#0ea5e9"
                                    strokeWidth={2}
                                    name="Net"
                                    dot={{ fill: '#0ea5e9', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No data available for the selected period
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Expenses Bar Chart */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Monthly Expenses
                        </h2>
                        {monthlyTrends && monthlyTrends.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="monthName"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '8px' }}
                                    />
                                    <Bar
                                        dataKey="expenses"
                                        fill="#0ea5e9"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                No expense data available
                            </div>
                        )}
                    </div>

                    {/* Top Spending Months */}
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Top Spending Months
                        </h2>
                        {topMonths && topMonths.length > 0 ? (
                            <div className="space-y-3">
                                {topMonths.map((month, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {month.monthName}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(month.totalSpent)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-gray-500">
                                No spending data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Spending Over Time */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Spending by Category Over Time
                    </h2>
                    {processedCategoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={processedCategoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="monthName"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px' }}
                                />
                                <Legend />
                                {categories.map((category, index) => (
                                    <Area
                                        key={category}
                                        type="monotone"
                                        dataKey={category}
                                        stackId="1"
                                        stroke={COLORS[index % COLORS.length]}
                                        fill={COLORS[index % COLORS.length]}
                                        fillOpacity={0.6}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                            No category data available for the selected period
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Analytics;