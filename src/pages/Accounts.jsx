import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '../hooks/useAccounts';
import { formatCurrency, getAccountTypeName } from '../utils/formatters';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTrendingUp, FiCreditCard, FiDollarSign } from 'react-icons/fi';

const Accounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CHECKING',
    balance: '',
    currency: 'USD',
    description: '',
  });

  const { data: accounts, isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const accountTypes = [
    { value: 'CHECKING', label: 'Checking' },
    { value: 'SAVINGS', label: 'Savings' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'INVESTMENT', label: 'Investment' },
  ];

  const getAccountIcon = (type) => {
    switch (type) {
      case 'CHECKING':
        return <FiDollarSign className="w-5 h-5" />;
      case 'SAVINGS':
        return <FiTrendingUp className="w-5 h-5" />;
      case 'CREDIT_CARD':
        return <FiCreditCard className="w-5 h-5" />;
      case 'INVESTMENT':
        return <FiTrendingUp className="w-5 h-5" />;
      default:
        return <FiDollarSign className="w-5 h-5" />;
    }
  };

  const getAccountColor = (type) => {
    switch (type) {
      case 'CHECKING':
        return 'bg-emerald-500';
      case 'SAVINGS':
        return 'bg-amber-500';
      case 'CREDIT_CARD':
        return 'bg-rose-500';
      case 'INVESTMENT':
        return 'bg-violet-500';
      default:
        return 'bg-slate-500';
    }
  };

  const openCreateModal = () => {
    setEditingAccount(null);
    setFormData({
      name: '',
      type: 'CHECKING',
      balance: '',
      currency: 'USD',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
      currency: account.currency,
      description: account.description || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accountData = {
      ...formData,
      balance: parseFloat(formData.balance),
    };

    try {
      if (editingAccount) {
        await updateAccount.mutateAsync({ id: editingAccount.id, data: accountData });
      } else {
        await createAccount.mutateAsync(accountData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving account:', error);
      alert('Failed to save account. Please try again.');
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      try {
        await deleteAccount.mutateAsync(accountId);
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading accounts...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
            <p className="mt-1 text-gray-500">Manage your financial accounts</p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-primary inline-flex items-center"
          >
            <FiPlus className="mr-2" />
            Add Account
          </button>
        </div>

        {/* Total Balance Summary */}
        {accounts && accounts.length > 0 && (
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 uppercase tracking-wide font-medium">Total Balance</p>
                <p className="text-4xl font-bold mt-2">{formatCurrency(totalBalance)}</p>
                <p className="text-sm opacity-75 mt-2">
                  Across {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
                </p>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-xl">
                <FiDollarSign className="w-12 h-12" />
              </div>
            </div>
          </div>
        )}

        {/* Accounts Grid */}
        {accounts && accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                {/* Account Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${getAccountColor(account.type)} bg-opacity-10 rounded-xl`}>
                    <div className={`${getAccountColor(account.type)} bg-opacity-100 w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                      {getAccountIcon(account.type)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(account)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{getAccountTypeName(account.type)}</p>
                </div>

                {/* Balance */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Current Balance
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(account.balance)}
                  </p>
                </div>

                {/* Description */}
                {account.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{account.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <FiDollarSign className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No accounts yet</h3>
            <p className="text-gray-600 mb-6">
              Add your first account to start tracking your finances
            </p>
            <button
              onClick={openCreateModal}
              className="btn-primary inline-flex items-center"
            >
              <FiPlus className="mr-2" />
              Add Account
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingAccount ? 'Edit Account' : 'Add Account'}
                </h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-field"
                    placeholder="e.g., Chase Checking"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type *
                  </label>
                  <select
                    name="type"
                    required
                    className="input-field"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    {accountTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Starting Balance *
                  </label>
                  <input
                    type="number"
                    name="balance"
                    required
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                    value={formData.balance}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    className="input-field"
                    placeholder="USD"
                    value={formData.currency}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
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
                    disabled={createAccount.isPending || updateAccount.isPending}
                  >
                    {createAccount.isPending || updateAccount.isPending
                      ? 'Saving...'
                      : editingAccount
                      ? 'Update Account'
                      : 'Add Account'}
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

export default Accounts;