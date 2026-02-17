import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useTransactions, useCreateTransaction, useDeleteTransaction } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency, formatDate, formatDateForInput } from '../utils/formatters';
import { FiPlus, FiTrash2, FiX, FiFilter, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });
  const [formData, setFormData] = useState({
    accountId: '', categoryId: '', amount: '', type: 'DEBIT',
    description: '', transactionDate: formatDateForInput(new Date()),
  });

  const { data: transactions, isLoading } = useTransactions(filters);
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const openCreateModal = () => {
    setFormData({
      accountId: accounts?.[0]?.id || '', categoryId: categories?.[0]?.id || '',
      amount: '', type: 'DEBIT', description: '', transactionDate: formatDateForInput(new Date()),
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const clearFilters = () => setFilters({ startDate: '', endDate: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction.mutateAsync({
        ...formData,
        accountId: parseInt(formData.accountId),
        categoryId: parseInt(formData.categoryId),
        amount: parseFloat(formData.amount),
      });
      setIsModalOpen(false);
    } catch { alert('Failed to create transaction.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      try { await deleteTransaction.mutateAsync(id); }
      catch { alert('Failed to delete transaction.'); }
    }
  };

  const totalIncome = transactions?.filter(t => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0) || 0;
  const totalExpenses = transactions?.filter(t => t.type === 'DEBIT').reduce((s, t) => s + t.amount, 0) || 0;
  const netAmount = totalIncome - totalExpenses;

  if (isLoading) return (
    <Layout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-fuchsia-200 border-t-fuchsia-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading transactions...</p>
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Track your income and expenses</p>
          </div>
          <button onClick={openCreateModal} className="btn-primary inline-flex items-center gap-2">
            <FiPlus className="w-4 h-4" /> Add Transaction
          </button>
        </div>

        {/* Summary Stats */}
        {transactions && transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Income</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">{formatCurrency(totalIncome)}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">{transactions.filter(t => t.type === 'CREDIT').length} transactions</p>
                </div>
                <div className="p-3 bg-emerald-200 dark:bg-emerald-900/40 rounded-xl">
                  <FiArrowUpCircle className="w-7 h-7 text-emerald-700 dark:text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">Expenses</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-2">{formatCurrency(totalExpenses)}</p>
                  <p className="text-xs text-red-600 dark:text-red-500 mt-1">{transactions.filter(t => t.type === 'DEBIT').length} transactions</p>
                </div>
                <div className="p-3 bg-red-200 dark:bg-red-900/40 rounded-xl">
                  <FiArrowDownCircle className="w-7 h-7 text-red-700 dark:text-red-400" />
                </div>
              </div>
            </div>
            <div className={`rounded-2xl p-6 border ${netAmount >= 0 ? 'bg-fuchsia-50 dark:bg-fuchsia-950/20 border-fuchsia-100 dark:border-fuchsia-900/30' : 'bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${netAmount >= 0 ? 'text-fuchsia-700 dark:text-fuchsia-400' : 'text-orange-700 dark:text-orange-400'}`}>Net</p>
                  <p className={`text-2xl font-bold mt-2 ${netAmount >= 0 ? 'text-fuchsia-700 dark:text-fuchsia-300' : 'text-orange-700 dark:text-orange-300'}`}>
                    {netAmount >= 0 ? '+' : ''}{formatCurrency(Math.abs(netAmount))}
                  </p>
                  <p className={`text-xs mt-1 ${netAmount >= 0 ? 'text-fuchsia-600 dark:text-fuchsia-500' : 'text-orange-600 dark:text-orange-500'}`}>
                    {netAmount >= 0 ? 'Positive balance' : 'Negative balance'}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${netAmount >= 0 ? 'bg-fuchsia-200 dark:bg-fuchsia-900/40' : 'bg-orange-200 dark:bg-orange-900/40'}`}>
                  <FiArrowUpCircle className={`w-7 h-7 ${netAmount >= 0 ? 'text-fuchsia-700 dark:text-fuchsia-400' : 'text-orange-700 dark:text-orange-400'}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-[#13121f] rounded-2xl p-5 border border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm mb-auto pt-1">
              <FiFilter className="w-4 h-4" /> Filters
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-wide">Start Date</label>
              <input type="date" name="startDate" className="input-field" value={filters.startDate} onChange={handleFilterChange} />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-500 mb-1.5 uppercase tracking-wide">End Date</label>
              <input type="date" name="endDate" className="input-field" value={filters.endDate} onChange={handleFilterChange} />
            </div>
            {(filters.startDate || filters.endDate) && (
              <button onClick={clearFilters} className="btn-secondary">Clear</button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-[#13121f] rounded-2xl border border-slate-100 dark:border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.03]">
                  {['Date', 'Description', 'Category', 'Account', 'Type', 'Amount', ''].map((h, i) => (
                    <th key={i} className={`px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider ${i >= 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                {transactions && transactions.length > 0 ? transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(t.transactionDate)}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white">
                      {t.description || <span className="text-slate-400 dark:text-slate-600 italic text-xs">No description</span>}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {t.categoryIcon && <span className="mr-1.5">{t.categoryIcon}</span>}{t.categoryName}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{t.accountName}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {t.type === 'CREDIT'
                        ? <span className="inline-flex px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">Income</span>
                        : <span className="inline-flex px-2.5 py-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold">Expense</span>
                      }
                    </td>
                    <td className={`px-5 py-3.5 text-sm font-bold text-right whitespace-nowrap ${t.type === 'CREDIT' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {t.type === 'CREDIT' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="px-6 py-20 text-center">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                      {filters.startDate || filters.endDate ? 'No transactions found' : 'No transactions yet'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {filters.startDate || filters.endDate ? 'Try adjusting your filters' : 'Create your first transaction to get started'}
                    </p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#13121f] rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.06]">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Transaction</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {[
                  { label: 'Type', name: 'type', tag: 'select', options: [{ value: 'DEBIT', label: '💸 Expense' }, { value: 'CREDIT', label: '💰 Income' }] },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{f.label} *</label>
                    <select name={f.name} required className="input-field" value={formData[f.name]} onChange={handleChange}>
                      {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Account *</label>
                  <select name="accountId" required className="input-field" value={formData.accountId} onChange={handleChange}>
                    {accounts?.map(a => <option key={a.id} value={a.id}>{a.name} ({formatCurrency(a.balance)})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
                  <select name="categoryId" required className="input-field" value={formData.categoryId} onChange={handleChange}>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Amount *</label>
                  <input type="number" name="amount" required step="0.01" min="0.01" placeholder="0.00" className="input-field" value={formData.amount} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date *</label>
                  <input type="date" name="transactionDate" required className="input-field" value={formData.transactionDate} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                  <textarea name="description" rows="2" placeholder="Optional description..." className="input-field resize-none" value={formData.description} onChange={handleChange} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary" disabled={createTransaction.isPending}>
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