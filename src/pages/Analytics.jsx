import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useMonthlyTrends, useCategoryTrends, useTopSpendingMonths } from '../hooks/useAnalytics';
import { formatCurrency } from '../utils/formatters';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const CHART_COLORS = ['#d946ef', '#7c3aed', '#ec4899', '#f97316', '#10b981', '#ef4444'];

const Analytics = () => {
    const [timeRange, setTimeRange] = useState(6);
    const { data: monthlyTrends, isLoading } = useMonthlyTrends(timeRange);
    const { data: categoryTrends } = useCategoryTrends(timeRange);
    const { data: topMonths } = useTopSpendingMonths(5);

    const processedCategoryData = React.useMemo(() => {
        if (!categoryTrends?.length) return [];
        const grouped = categoryTrends.reduce((acc, item) => {
            const key = `${item.year}-${item.month}`;
            if (!acc[key]) acc[key] = { monthName: item.monthName, year: item.year, month: item.month };
            acc[key][item.categoryName] = parseFloat(item.amount);
            return acc;
        }, {});
        return Object.values(grouped).sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
    }, [categoryTrends]);

    const categories = React.useMemo(() => {
        if (!categoryTrends) return [];
        return [...new Set(categoryTrends.map(t => t.categoryName))].slice(0, 5);
    }, [categoryTrends]);

    const totalIncome = monthlyTrends?.reduce((s, t) => s + parseFloat(t.income), 0) || 0;
    const totalExpenses = monthlyTrends?.reduce((s, t) => s + parseFloat(t.expenses), 0) || 0;
    const avgMonthlyExpenses = monthlyTrends?.length > 0 ? totalExpenses / monthlyTrends.length : 0;

    const tooltipStyle = { borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', background: '#13121f', color: '#e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' };

    if (isLoading) return (
        <Layout>
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-fuchsia-200 border-t-fuchsia-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Loading analytics...</p>
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Insights into your spending patterns</p>
                    </div>
                    <select value={timeRange} onChange={(e) => setTimeRange(parseInt(e.target.value))} className="input-field w-44">
                        <option value={3}>Last 3 Months</option>
                        <option value={6}>Last 6 Months</option>
                        <option value={12}>Last 12 Months</option>
                    </select>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Income', value: formatCurrency(totalIncome), sub: `Last ${timeRange} months`, icon: FiTrendingUp, color: 'text-emerald-500 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-950/30' },
                        { label: 'Total Expenses', value: formatCurrency(totalExpenses), sub: `Last ${timeRange} months`, icon: FiTrendingDown, color: 'text-red-500 dark:text-red-400', iconBg: 'bg-red-100 dark:bg-red-950/30' },
                        { label: 'Avg Monthly Spending', value: formatCurrency(avgMonthlyExpenses), sub: 'Average per month', icon: FiDollarSign, color: 'text-fuchsia-600 dark:text-fuchsia-400', iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-950/30' },
                    ].map(s => (
                        <div key={s.label} className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{s.label}</p>
                                    <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">{s.sub}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${s.iconBg}`}>
                                    <s.icon className={`w-7 h-7 ${s.color}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Income vs Expenses */}
                <div className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Income vs Expenses</h2>
                    {monthlyTrends?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                                <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} />
                                <Tooltip formatter={v => formatCurrency(v)} contentStyle={tooltipStyle} />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} name="Income" dot={{ fill: '#10b981', r: 4 }} />
                                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} name="Expenses" dot={{ fill: '#ef4444', r: 4 }} />
                                <Line type="monotone" dataKey="net" stroke="#d946ef" strokeWidth={2.5} name="Net" dot={{ fill: '#d946ef', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-600 text-sm">No data available</div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Monthly Expenses Bar */}
                    <div className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Monthly Expenses</h2>
                        {monthlyTrends?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={monthlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                                    <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} />
                                    <Tooltip formatter={v => formatCurrency(v)} contentStyle={tooltipStyle} />
                                    <Bar dataKey="expenses" radius={[8, 8, 0, 0]} fill="url(#barGradient)" />
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#d946ef" />
                                            <stop offset="100%" stopColor="#7c3aed" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-600 text-sm">No expense data</div>
                        )}
                    </div>

                    {/* Top Spending Months */}
                    <div className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Top Spending Months</h2>
                        {topMonths?.length > 0 ? (
                            <div className="space-y-3">
                                {topMonths.map((month, i) => (
                                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-white/[0.03] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ background: `linear-gradient(135deg,#d946ef,#7c3aed)` }}>
                                                {i + 1}
                                            </div>
                                            <span className="font-semibold text-slate-900 dark:text-white text-sm">{month.monthName}</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{formatCurrency(month.totalSpent)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-600 text-sm">No spending data</div>
                        )}
                    </div>
                </div>

                {/* Category Spending Over Time */}
                <div className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-5">Spending by Category Over Time</h2>
                    {processedCategoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={processedCategoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                                <XAxis dataKey="monthName" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} />
                                <Tooltip formatter={v => formatCurrency(v)} contentStyle={tooltipStyle} />
                                <Legend />
                                {categories.map((cat, i) => (
                                    <Area key={cat} type="monotone" dataKey={cat} stackId="1"
                                        stroke={CHART_COLORS[i % CHART_COLORS.length]}
                                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                                        fillOpacity={0.5} />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-600 text-sm">No category data available</div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Analytics;