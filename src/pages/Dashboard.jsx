import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions, useTransactionSummary, useSpendingByCategory } from '../hooks/useTransactions';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPlusCircle, FiArrowRight } from 'react-icons/fi';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

const G = 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)';

const Dashboard = () => {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: transactions } = useTransactions();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const { data: categorySpending } = useSpendingByCategory();

  const totalBalance = accounts?.reduce((sum, a) => sum + parseFloat(a.balance), 0) || 0;
  const totalIncome = summary?.totalIncome ?? summary?.income ?? 0;
  const totalExpenses = summary?.totalExpenses ?? summary?.expenses ?? 0;

  const chartData = categorySpending?.slice(0, 5).map(cat => ({
    name: cat.categoryName,
    value: parseFloat(cat.totalAmount),
  })) || [];
  const COLORS = ['#d946ef', '#7c3aed', '#ec4899', '#f97316', '#10b981'];

  const stats = [
    {
      label: 'Total Balance', value: formatCurrency(totalBalance), icon: FiDollarSign,
      lightBg: 'bg-fuchsia-50', lightText: 'text-fuchsia-600', lightIcon: 'bg-fuchsia-100',
    },
    {
      label: 'Total Income', value: formatCurrency(totalIncome), icon: FiTrendingUp,
      lightBg: 'bg-emerald-50', lightText: 'text-emerald-600', lightIcon: 'bg-emerald-100',
    },
    {
      label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: FiTrendingDown,
      lightBg: 'bg-red-50', lightText: 'text-red-500', lightIcon: 'bg-red-100',
    },
  ];

  if (accountsLoading || summaryLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-fuchsia-200 border-t-fuchsia-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Layout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
          <div className="w-16 h-16 bg-fuchsia-50 dark:bg-fuchsia-950/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FiDollarSign className="w-8 h-8 text-fuchsia-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No accounts yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-7 max-w-sm mx-auto text-sm">
            Create your first account to start tracking your finances.
          </p>
          <Link to="/accounts"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition-all"
            style={{ background: G }}
          >
            <FiPlusCircle className="w-4 h-4" />
            Create your first account
          </Link>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Your financial overview at a glance</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(217,70,239,0.12)' }}
              className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-2 ${stat.lightText}`}>{stat.value}</p>
                </div>
                <div className={`${stat.lightIcon} dark:bg-white/[0.06] p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.lightText}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Accounts */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}
            className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900 dark:text-white">Accounts</h2>
              <Link to="/accounts" className="text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-700 flex items-center gap-1 group">
                View all <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="space-y-2">
              {accounts?.slice(0, 5).map((account, i) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-white/[0.03] rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{account.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{account.type}</p>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{formatCurrency(account.balance)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Spending Chart */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}
            className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]">
            <h2 className="font-bold text-slate-900 dark:text-white mb-5">Spending by Category</h2>
            {chartData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80} dataKey="value" strokeWidth={2} stroke="transparent"
                    >
                      {chartData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => formatCurrency(v)}
                      contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#13121f', color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-56 text-slate-400 dark:text-slate-600 text-sm">
                No spending data yet
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}
          className="bg-white dark:bg-[#13121f] rounded-2xl border border-slate-100 dark:border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-white/[0.04]">
            <h2 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
            <Link to="/transactions" className="text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400 flex items-center gap-1 group">
              View all <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.03]">
                  {['Date', 'Description', 'Category', 'Account', 'Amount'].map(h => (
                    <th key={h} className={`px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider ${h === 'Amount' ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                {transactions?.slice(0, 5).map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(t.transactionDate)}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white">{t.description || '-'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {t.categoryIcon && <span className="mr-1.5">{t.categoryIcon}</span>}
                      {t.categoryName}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{t.accountName}</td>
                    <td className={`px-5 py-3.5 text-sm font-bold text-right whitespace-nowrap ${t.type === 'CREDIT' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {t.type === 'CREDIT' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {(!transactions || transactions.length === 0) && (
              <p className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm">No transactions yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;