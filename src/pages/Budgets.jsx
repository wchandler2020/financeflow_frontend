import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useCurrentBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency } from '../utils/formatters';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Budgets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [formData, setFormData] = useState({
        categoryId: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const { data: budgets, isLoading } = useCurrentBudgets();
    const { data: categories } = useCategories('EXPENSE'); // Only expense categories
    const createBudget = useCreateBudget();
    const updateBudget = useUpdateBudget();
    const deleteBudget = useDeleteBudget();

    console.log('BUDGETS: ', budgets)

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getBudgetStatus = (percentageUsed) => {
        if (percentageUsed >= 100) return 'exceeded';
        if (percentageUsed >= 80) return 'warning';
        return 'good';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'exceeded': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            case 'good': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'exceeded': return 'text-red-600';
            case 'warning': return 'text-yellow-600';
            case 'good': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const openCreateModal = () => {
        setEditingBudget(null);
        setFormData({
            categoryId: categories?.[0]?.id || '',
            amount: '',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        });
        setIsModalOpen(true);
    };

    const openEditModal = (budget) => {
        setEditingBudget(budget);
        setFormData({
            categoryId: budget.categoryId,
            amount: budget.amount,
            month: budget.month,
            year: budget.year,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBudget(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const budgetData = {
            ...formData,
            categoryId: parseInt(formData.categoryId),
            amount: parseFloat(formData.amount),
            month: parseInt(formData.month),
            year: parseInt(formData.year),
        };

        try {
            if (editingBudget) {
                await updateBudget.mutateAsync({
                    id: editingBudget.id,
                    data: { amount: budgetData.amount }
                });
            } else {
                await createBudget.mutateAsync(budgetData);
            }
            closeModal();
        } catch (error) {
            console.error('Error saving budget:', error);
            alert(error.response?.data?.message || 'Failed to save budget. Please try again.');
        }
    };

    const handleDelete = async (budgetId) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await deleteBudget.mutateAsync(budgetId);
            } catch (error) {
                console.error('Error deleting budget:', error);
                alert('Failed to delete budget. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-500">Loading budgets...</div>
                </div>
            </Layout>
        );
    }

    // Calculate summary stats
    const totalBudget = budgets?.reduce((sum, b) => sum + parseFloat(b.amount), 0) || 0;
    const totalSpent = budgets?.reduce((sum, b) => sum + parseFloat(b.spent), 0) || 0;
    const budgetsOnTrack = budgets?.filter(b => b.percentageUsed < 80).length || 0;
    const budgetsExceeded = budgets?.filter(b => b.percentageUsed >= 100).length || 0;

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your monthly spending limits
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="btn-primary inline-flex items-center"
                    >
                        <FiPlus className="mr-2" />
                        Set Budget
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card">
                        <p className="text-sm text-gray-600">Total Budget</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {formatCurrency(totalBudget)}
                        </p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600">Total Spent</p>
                        <p className="mt-2 text-2xl font-bold text-primary-600">
                            {formatCurrency(totalSpent)}
                        </p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600">On Track</p>
                        <p className="mt-2 text-2xl font-bold text-green-600">
                            {budgetsOnTrack}
                        </p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600">Exceeded</p>
                        <p className="mt-2 text-2xl font-bold text-red-600">
                            {budgetsExceeded}
                        </p>
                    </div>
                </div>

                {/* Current Month Display */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {months[new Date().getMonth()]} {new Date().getFullYear()}
                    </h2>
                    <p className="text-sm text-gray-500">Current month budgets</p>
                </div>

                {/* Budgets List */}
                {budgets && budgets.length > 0 ? (
                    <div className="space-y-4">
                        {budgets.map((budget) => {
                            const status = getBudgetStatus(budget.percentageUsed);
                            const progressWidth = Math.min(budget.percentageUsed, 100);

                            return (
                                <div key={budget.id} className="card">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl">{budget.categoryIcon}</span>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {budget.categoryName}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openEditModal(budget)}
                                                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(budget.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className={`font-medium ${getStatusTextColor(status)}`}>
                                                {budget.percentageUsed.toFixed(1)}% used
                                            </span>
                                            <span className="text-gray-600">
                                                {formatCurrency(budget.remaining)} remaining
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${getStatusColor(status)}`}
                                                style={{ width: `${progressWidth}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Warning */}
                                    {status === 'exceeded' && (
                                        <div className="mt-3 flex items-center text-sm text-red-600">
                                            <FiAlertCircle className="w-4 h-4 mr-2" />
                                            Budget exceeded by {formatCurrency(Math.abs(budget.remaining))}
                                        </div>
                                    )}
                                    {status === 'warning' && (
                                        <div className="mt-3 flex items-center text-sm text-yellow-600">
                                            <FiAlertCircle className="w-4 h-4 mr-2" />
                                            Approaching budget limit
                                        </div>
                                    )}
                                    {status === 'good' && (
                                        <div className="mt-3 flex items-center text-sm text-green-600">
                                            <FiCheckCircle className="w-4 h-4 mr-2" />
                                            On track
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 card">
                        <p className="text-gray-500">
                            No budgets set for this month. Create your first budget to start tracking!
                        </p>
                    </div>
                )}

                {/* Create/Edit Budget Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editingBudget ? 'Edit Budget' : 'Set Budget'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {!editingBudget && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category *
                                            </label>
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

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Month *
                                                </label>
                                                <select
                                                    name="month"
                                                    required
                                                    className="input-field"
                                                    value={formData.month}
                                                    onChange={handleChange}
                                                >
                                                    {months.map((month, index) => (
                                                        <option key={index} value={index + 1}>
                                                            {month}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Year *
                                                </label>
                                                <input
                                                    type="number"
                                                    name="year"
                                                    required
                                                    min="2000"
                                                    max="2100"
                                                    className="input-field"
                                                    value={formData.year}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Budget Amount *
                                    </label>
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

                                {/* Modal Footer */}
                                <div className="flex justify-end space-x-3 pt-4">
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
                                        disabled={createBudget.isPending || updateBudget.isPending}
                                    >
                                        {createBudget.isPending || updateBudget.isPending
                                            ? 'Saving...'
                                            : editingBudget
                                                ? 'Update Budget'
                                                : 'Create Budget'}
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