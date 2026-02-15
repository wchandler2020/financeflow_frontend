import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions, useTransactionSummary, useSpendingByCategory } from '../hooks/useTransactions';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPlusCircle, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const { data: categorySpending, isLoading: categoryLoading } = useSpendingByCategory();

  // Debug logging
  React.useEffect(() => {
    if (summary) {
      console.log('Summary data:', summary);
      console.log('Total Income:', summary?.totalIncome);
      console.log('Total Expenses:', summary?.totalExpenses);
    }
  }, [summary]);

  // Calculate total balance
  const totalBalance = accounts?.reduce((sum, account) => sum + parseFloat(account.balance), 0) || 0;

  // Get summary values with fallbacks
  const totalIncome = summary?.totalIncome ?? summary?.income ?? 0;
  const totalExpenses = summary?.totalExpenses ?? summary?.expenses ?? 0;

  // Prepare chart data
  const chartData = categorySpending?.slice(0, 5).map(cat => ({
    name: cat.categoryName,
    value: parseFloat(cat.totalAmount),
  })) || [];

  const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#10b981'];

  // Loading state
  if (accountsLoading || summaryLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Empty state
  if (!accounts || accounts.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <FiDollarSign className="w-10 h-10 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Accounts Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first account to begin tracking your finances.
          </p>
          <Link to="/accounts" className="btn-primary inline-flex items-center">
            <FiPlusCircle className="mr-2" />
            Create Your First Account
          </Link>
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-gray-500">Your financial overview at a glance</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className="card group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Balance</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="p-4 bg-primary-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FiDollarSign className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Total Income */}
          <div className="card group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Income</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FiTrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="card group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Expenses</p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div className="p-4 bg-red-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FiTrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounts Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Accounts</h2>
              <Link 
                to="/accounts" 
                className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center group"
              >
                View all
                <FiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-3">
              {accounts?.slice(0, 5).map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.type}</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              ))}
              {accounts?.length === 0 && (
                <p className="text-center text-gray-500 py-8">No accounts yet</p>
              )}
            </div>
          </div>

          {/* Spending by Category */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Spending Categories</h2>
            {categorySpending && categorySpending.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No spending data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <Link 
              to="/transactions" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center group"
            >
              View all
              <FiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions?.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center">
                        {transaction.categoryIcon && (
                          <span className="mr-2">{transaction.categoryIcon}</span>
                        )}
                        {transaction.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {transaction.accountName}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                      transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'CREDIT' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!transactions || transactions.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                No transactions yet. Create your first transaction!
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;