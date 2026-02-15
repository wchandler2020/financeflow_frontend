import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useTransactions, useCreateTransaction, useDeleteTransaction } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency, formatDate, formatDateForInput } from '../utils/formatters';
import { FiPlus, FiTrash2, FiX, FiFilter, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });
  const [formData, setFormData] = useState({
    accountId: '',
    categoryId: '',
    amount: '',
    type: 'DEBIT',
    description: '',
    transactionDate: formatDateForInput(new Date()),
  });

  const { data: transactions, isLoading: transactionsLoading } = useTransactions(filters);
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const openCreateModal = () => {
    setFormData({
      accountId: accounts?.[0]?.id || '',
      categoryId: categories?.[0]?.id || '',
      amount: '',
      type: 'DEBIT',
      description: '',
      transactionDate: formatDateForInput(new Date()),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      ...formData,
      accountId: parseInt(formData.accountId),
      categoryId: parseInt(formData.categoryId),
      amount: parseFloat(formData.amount),
    };

    try {
      await createTransaction.mutateAsync(transactionData);
      closeModal();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction. Please try again.');
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction.mutateAsync(transactionId);
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction. Please try again.');
      }
    }
  };

  // Calculate summary stats
  const totalIncome = transactions?.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalExpenses = transactions?.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0) || 0;
  const netAmount = totalIncome - totalExpenses;

  if (transactionsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="mt-1 text-gray-500">Track your income and expenses</p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Transaction
          </button>
        </div>

        {/* Summary Stats */}
        {transactions && transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income Card */}
            <div className="card bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700 uppercase tracking-wide">Income</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{formatCurrency(totalIncome)}</p>
                  <p className="text-sm text-green-600 mt-2">
                    {transactions.filter(t => t.type === 'CREDIT').length} transactions
                  </p>
                </div>
                <div className="p-4 bg-green-200 rounded-xl">
                  <FiArrowUpCircle className="w-8 h-8 text-green-700" />
                </div>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="card bg-red-50 border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700 uppercase tracking-wide">Expenses</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">{formatCurrency(totalExpenses)}</p>
                  <p className="text-sm text-red-600 mt-2">
                    {transactions.filter(t => t.type === 'DEBIT').length} transactions
                  </p>
                </div>
                <div className="p-4 bg-red-200 rounded-xl">
                  <FiArrowDownCircle className="w-8 h-8 text-red-700" />
                </div>
              </div>
            </div>

            {/* Net Card */}
            <div className={`card ${netAmount >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium uppercase tracking-wide ${netAmount >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                    Net
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${netAmount >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                    {netAmount >= 0 ? '+' : ''}
                    {formatCurrency(Math.abs(netAmount))}
                  </p>
                  <p className={`text-sm mt-2 ${netAmount >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {netAmount >= 0 ? 'Positive balance' : 'Negative balance'}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${netAmount >= 0 ? 'bg-blue-200' : 'bg-orange-200'}`}>
                  <FiArrowUpCircle className={`w-8 h-8 ${netAmount >= 0 ? 'text-blue-700' : 'text-orange-700'}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <FiFilter className="w-5 h-5" />
              <span>Filters</span>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                className="input-field"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                className="input-field"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            {(filters.startDate || filters.endDate) && (
              <button
                onClick={clearFilters}
                className="btn-secondary mt-auto"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.transactionDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {transaction.description || <span className="text-gray-400 italic">No description</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center text-sm text-gray-600">
                          {transaction.categoryIcon && (
                            <span className="mr-2">{transaction.categoryIcon}</span>
                          )}
                          {transaction.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {transaction.accountName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.type === 'CREDIT' ? (
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Income
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Expense
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                        transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'CREDIT' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="text-gray-500">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {filters.startDate || filters.endDate ? 'No transactions found' : 'No transactions yet'}
                        </h3>
                        <p>
                          {filters.startDate || filters.endDate 
                            ? 'Try adjusting your filters to see more results' 
                            : 'Create your first transaction to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Transaction Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900">Add Transaction</h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    name="type"
                    required
                    className="input-field"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="DEBIT">💸 Expense</option>
                    <option value="CREDIT">💰 Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account *</label>
                  <select
                    name="accountId"
                    required
                    className="input-field"
                    value={formData.accountId}
                    onChange={handleChange}
                  >
                    {accounts?.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({formatCurrency(account.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="categoryId"
                    required
                    className="input-field"
                    value={formData.categoryId}
                    onChange={handleChange}
                  >
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    step="0.01"
                    min="0.01"
                    className="input-field"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="transactionDate"
                    required
                    className="input-field"
                    value={formData.transactionDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="input-field resize-none"
                    placeholder="Optional description..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={createTransaction.isPending}
                  >
                    {createTransaction.isPending ? 'Creating...' : 'Create Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;