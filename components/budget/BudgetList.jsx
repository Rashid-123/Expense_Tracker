"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import BudgetCard from './BudgetCard';
import UpdateBudgetDialog from './UpdateBudgetDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import AddBudgetDialog from './AddBudgetDialog';
import Loader from '../Loader';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { showToast } from '@/lib/showToast';


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


    useEffect(() => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        setSelectedMonth(currentMonth.toString());
        setSelectedYear(currentYear.toString());
    }, []);


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
                showToast('Budget added successfully!', 'success');
                await fetchBudgets();
                if (onBudgetChange) onBudgetChange();
            } else {

                throw new Error(data.error || 'Failed to add budget');
            }
        } catch (err) {
            console.error('Add budget error:', err);

            throw new Error(err.message || 'Network error occurred');
        }
    };

    // Handle update budget`
    const handleUpdateBudget = async (budgetId, updatedData) => {
        try {
            const response = await fetch(`/api/budgets/${budgetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();

            if (data.success) {
                showToast('Budget updated successfully!', 'success');
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
                showToast('Budget deleted successfully!', 'success');
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


    const generateYearOptions = () => {
        const years = [2025, 2026];
        return years;
    };


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
        <div className="mx-auto relative">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Budgets</h1>
                <p className="text-gray-600">Manage your category budgets</p>
            </div>
            <div className="bg-white rounded-md shadow-xs p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    <div>
                        <Label htmlFor="month" className="mb-2 block text-sm font-medium">
                            Month
                        </Label>
                        <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                        >
                            <SelectTrigger id="month" className="w-full">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                    <div>
                        <Label htmlFor="year" className="mb-2 block text-sm font-medium">
                            Year
                        </Label>
                        <Select
                            value={selectedYear}
                            onValueChange={setSelectedYear}
                        >
                            <SelectTrigger id="year" className="w-full">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {generateYearOptions().map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

            </div>
            {loading ? (
                <Loader />
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

                    <div className="fixed bottom-6 right-6">
                        <button
                            onClick={handleAddClick}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
                            aria-label="Add Budget"
                        >
                            <Plus size={24} className="group-hover:scale-110 transition-transform duration-200" />
                        </button>
                    </div>

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


        </div>);
};

export default BudgetList;