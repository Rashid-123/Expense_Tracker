
import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import BudgetCard from './BudgetCard';
import UpdateBudgetDialog from './UpdateBudgetDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import AddBudgetDialog from './AddBudgetDialog';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8 min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
);

const BudgetList = ({ onBudgetChange }) => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    // Filter states
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Initialize filters with current month/year
    useEffect(() => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        setSelectedMonth(currentMonth.toString());
        setSelectedYear(currentYear.toString());
    }, []);

    // Fetch budgets
    const fetchBudgets = async () => {
        try {
            setLoading(true);
            setError('');

            const params = new URLSearchParams();
            if (selectedMonth) params.append('month', selectedMonth);
            if (selectedYear) params.append('year', selectedYear);
            if (selectedCategory && selectedCategory !== 'all') {
                params.append('category', selectedCategory);
            }

            const response = await fetch(`/api/budgets?${params}`);
            const data = await response.json();

            if (data.success) {
                setBudgets(data.data);
            } else {
                setError(data.error || 'Failed to fetch budgets');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch budgets when filters change
    useEffect(() => {
        if (selectedMonth && selectedYear) {
            fetchBudgets();
        }
    }, [selectedMonth, selectedYear, selectedCategory]);

    // Handle add budget
    const handleAddBudget = async (budgetData) => {
        try {
            const response = await fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetData)
            });

            const data = await response.json();

            if (data.success) {
                // Refresh budgets after adding
                await fetchBudgets();
                if (onBudgetChange) onBudgetChange();
            } else {
                // Throw error with backend message
                throw new Error(data.error || 'Failed to add budget');
            }
        } catch (err) {
            console.error('Add budget error:', err);
            // Re-throw with the specific error message for the dialog to handle
            throw new Error(err.message || 'Network error occurred');
        }
    };

    // Handle update budget
    const handleUpdateBudget = async (budgetId, updatedData) => {
        try {
            const response = await fetch(`/api/budgets/${budgetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();

            if (data.success) {
                setBudgets(prev =>
                    prev.map(budget =>
                        budget._id === budgetId ? data.data : budget
                    )
                );
                if (onBudgetChange) onBudgetChange();
            } else {
                setError(data.error || 'Failed to update budget');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Update error:', err);
        }
    };

    // Handle delete budget
    const handleDeleteBudget = async (budgetId) => {
        try {
            const response = await fetch(`/api/budgets/${budgetId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                setBudgets(prev => prev.filter(budget => budget._id !== budgetId));
                if (onBudgetChange) onBudgetChange();
            } else {
                setError(data.error || 'Failed to delete budget');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Delete error:', err);
        }
    };

    // Dialog handlers
    const handleEditClick = (budget) => {
        setSelectedBudget(budget);
        setIsUpdateDialogOpen(true);
    };

    const handleDeleteClick = (budget) => {
        setSelectedBudget(budget);
        setIsDeleteDialogOpen(true);
    };

    const handleAddClick = () => {
        setIsAddDialogOpen(true);
    };

    const closeDialogs = () => {
        setIsUpdateDialogOpen(false);
        setIsDeleteDialogOpen(false);
        setIsAddDialogOpen(false);
        setSelectedBudget(null);
    };

    // Generate year options (current year ± 2 years)
    const generateYearOptions = () => {
        const years = [2025, 2026];
        return years;
    };

    // Month options
    const monthOptions = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const totalAmount = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };
    return (
        <div className="relative">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-xs p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Month Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Month
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {monthOptions.map(month => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {generateYearOptions().map(year => (
                                <option key={year} value={year.toString()}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Header */}
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className="flex items-center justify-between my-6">
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {formatCurrency(totalAmount)}
                            </p>
                            <p className="text-sm text-gray-600">
                                Total Budget ({budgets.length} {budgets.length === 1 ? 'category' : 'categories'})
                            </p>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Calendar size={20} className="mr-2" />
                            <span className="text-sm">
                                {selectedMonth && selectedYear &&
                                    new Date(selectedYear, selectedMonth - 1).toLocaleString('default', {
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                }
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {budgets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {budgets.map(budget => (
                                <BudgetCard
                                    key={budget._id}
                                    budget={budget}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No budgets found for the selected filters.</p>
                        </div>
                    )}

                    {/* Floating Action Button */}
                    <button
                        onClick={handleAddClick}
                        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
                        aria-label="Add Budget"
                    >
                        <Plus size={24} className="group-hover:scale-110 transition-transform duration-200" />
                    </button>

                    {/* Dialogs */}
                    <UpdateBudgetDialog
                        isOpen={isUpdateDialogOpen}
                        budget={selectedBudget}
                        onUpdate={handleUpdateBudget}
                        onClose={closeDialogs}
                    />

                    <DeleteConfirmationDialog
                        isOpen={isDeleteDialogOpen}
                        budget={selectedBudget}
                        onDelete={handleDeleteBudget}
                        onClose={closeDialogs}
                    />

                    <AddBudgetDialog
                        isOpen={isAddDialogOpen}
                        onAdd={handleAddBudget}
                        onClose={closeDialogs}
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                    />
                </div>
            )}
        </div>
    );
};

export default BudgetList;