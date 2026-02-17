import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useCurrentBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency } from '../utils/formatters';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const G = 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Budgets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [formData, setFormData] = useState({ categoryId: '', amount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });

    const { data: budgets, isLoading } = useCurrentBudgets();
    const { data: categories } = useCategories('EXPENSE');
    const createBudget = useCreateBudget();
    const updateBudget = useUpdateBudget();
    const deleteBudget = useDeleteBudget();

    const getBudgetStatus = (p) => p >= 100 ? 'exceeded' : p >= 80 ? 'warning' : 'good';

    const statusStyles = {
        exceeded: { bar: '#ef4444', text: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/20' },
        warning: { bar: '#f59e0b', text: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
        good: { bar: '#10b981', text: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    };

    const openCreateModal = () => {
        setEditingBudget(null);
        setFormData({ categoryId: categories?.[0]?.id || '', amount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
        setIsModalOpen(true);
    };
    const openEditModal = (b) => {
        setEditingBudget(b);
        setFormData({ categoryId: b.categoryId, amount: b.amount, month: b.month, year: b.year });
        setIsModalOpen(true);
    };
    const closeModal = () => { setIsModalOpen(false); setEditingBudget(null); };
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...formData, categoryId: parseInt(formData.categoryId), amount: parseFloat(formData.amount), month: parseInt(formData.month), year: parseInt(formData.year) };
        try {
            if (editingBudget) await updateBudget.mutateAsync({ id: editingBudget.id, data: { amount: data.amount } });
            else await createBudget.mutateAsync(data);
            closeModal();
        } catch (err) { alert(err.response?.data?.message || 'Failed to save budget.'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this budget?')) {
            try { await deleteBudget.mutateAsync(id); }
            catch { alert('Failed to delete budget.'); }
        }
    };

    if (isLoading) return (
        <Layout>
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-fuchsia-200 border-t-fuchsia-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Loading budgets...</p>
                </div>
            </div>
        </Layout>
    );

    const totalBudget = budgets?.reduce((s, b) => s + parseFloat(b.amount), 0) || 0;
    const totalSpent = budgets?.reduce((s, b) => s + parseFloat(b.spent), 0) || 0;
    const budgetsOnTrack = budgets?.filter(b => b.percentageUsed < 80).length || 0;
    const budgetsExceeded = budgets?.filter(b => b.percentageUsed >= 100).length || 0;

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Budgets</h1>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Manage your monthly spending limits</p>
                    </div>
                    <button onClick={openCreateModal} className="btn-primary inline-flex items-center gap-2">
                        <FiPlus className="w-4 h-4" /> Set Budget
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Budget', value: formatCurrency(totalBudget), color: 'text-slate-900 dark:text-white' },
                        { label: 'Total Spent', value: formatCurrency(totalSpent), color: 'text-fuchsia-600 dark:text-fuchsia-400' },
                        { label: 'On Track', value: budgetsOnTrack, color: 'text-emerald-600 dark:text-emerald-400' },
                        { label: 'Exceeded', value: budgetsExceeded, color: 'text-red-500 dark:text-red-400' },
                    ].map(s => (
                        <div key={s.label} className="bg-white dark:bg-[#13121f] rounded-2xl p-5 border border-slate-100 dark:border-white/[0.06]">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{s.label}</p>
                            <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Month label */}
                <div className="bg-white dark:bg-[#13121f] rounded-2xl px-6 py-4 border border-slate-100 dark:border-white/[0.06]">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{months[new Date().getMonth()]} {new Date().getFullYear()}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Current month budgets</p>
                </div>

                {/* Budgets List */}
                {budgets && budgets.length > 0 ? (
                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const status = getBudgetStatus(budget.percentageUsed);
                            const ss = statusStyles[status];
                            const progressWidth = Math.min(budget.percentageUsed, 100);
                            return (
                                <div key={budget.id} className="bg-white dark:bg-[#13121f] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06]">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{budget.categoryIcon}</span>
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white">{budget.categoryName}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => openEditModal(budget)} className="p-2 text-slate-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/30 rounded-lg transition-colors">
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(budget.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className={`font-semibold ${ss.text}`}>{budget.percentageUsed.toFixed(1)}% used</span>
                                            <span className="text-slate-500 dark:text-slate-400 text-xs">{formatCurrency(budget.remaining)} remaining</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressWidth}%`, background: ss.bar }} />
                                        </div>
                                    </div>

                                    <div className={`mt-3 flex items-center gap-2 text-xs font-medium ${ss.text}`}>
                                        {status === 'exceeded' && <><FiAlertCircle className="w-3.5 h-3.5" />Budget exceeded by {formatCurrency(Math.abs(budget.remaining))}</>}
                                        {status === 'warning' && <><FiAlertCircle className="w-3.5 h-3.5" />Approaching budget limit</>}
                                        {status === 'good' && <><FiCheckCircle className="w-3.5 h-3.5" />On track</>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-[#13121f] rounded-2xl border border-slate-100 dark:border-white/[0.06]">
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No budgets set for this month. Create your first budget to start tracking!</p>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-[#13121f] rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/[0.06]">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingBudget ? 'Edit Budget' : 'Set Budget'}</h3>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {!editingBudget && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category *</label>
                                            <select name="categoryId" required className="input-field" value={formData.categoryId} onChange={handleChange}>
                                                {categories?.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Month *</label>
                                                <select name="month" required className="input-field" value={formData.month} onChange={handleChange}>
                                                    {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Year *</label>
                                                <input type="number" name="year" required min="2000" max="2100" className="input-field" value={formData.year} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Budget Amount *</label>
                                    <input type="number" name="amount" required step="0.01" min="0.01" placeholder="0.00" className="input-field" value={formData.amount} onChange={handleChange} />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={createBudget.isPending || updateBudget.isPending}>
                                        {createBudget.isPending || updateBudget.isPending ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
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

export default Budgets;