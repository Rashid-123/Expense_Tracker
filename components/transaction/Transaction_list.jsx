
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import TransactionItem from './TransactionItem';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Main Transaction List Component
const TransactionList = ({ refreshFlag, onDeleteTransaction }) => {
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        category: 'all',
        type: 'all',
        limit: 6
    });

    // Common categories (you can adjust these based on your app)
    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'food', label: 'Food' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'education', label: 'Education' },
        { value: 'other', label: 'Other' }
    ];

    const types = [
        { value: 'all', label: 'All Types' },
        { value: 'income', label: 'Income' },
        { value: 'expense', label: 'Expense' }
    ];

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsEditDialogOpen(true);
    };

    const handleDelete = (transaction) => {
        setDeletingTransaction(transaction);
        setIsDeleteDialogOpen(true);
    };

    // Fetch transactions with filters and pagination
    const fetchTransactions = async (page = 1, currentFilters = filters) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: currentFilters.limit.toString()
            });

            if (currentFilters.category !== 'all') {
                params.append('category', currentFilters.category);
            }

            if (currentFilters.type !== 'all') {
                params.append('type', currentFilters.type);
            }

            const response = await axios.get(`${API_URL}/transactions?${params}`);

            // Access transactions and pagination data
            const { transactions, pagination } = response.data.data;



            setTransactions(transactions);
            setCurrentPage(pagination.currentPage);
            setTotalPages(pagination.totalPages);
            setTotalTransactions(pagination.totalTransactions);
            setHasNextPage(pagination.hasNextPage);
            setHasPrevPage(pagination.hasPrevPage);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchTransactions(1, filters);
    }, [refreshFlag]);

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
        fetchTransactions(1, newFilters);
    };

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchTransactions(page, filters);
    };

    const handleUpdateTransaction = async (id, formData) => {
        try {
            const response = await axios.put(`${API_URL}/transactions/${id}`, formData);
            setTransactions(prev =>
                prev.map(t => t._id === id ? response.data.data : t)
            );
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const handleDeleteTransaction = async (id) => {
        try {
            console.log(id);
            const response = await axios.delete(`${API_URL}/transactions/${id}`);
            setTransactions(prev =>
                prev.filter(t => t._id !== id)
            );

            onDeleteTransaction(); // Notify parent component about deletion
            fetchTransactions(currentPage, filters);
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Transactions</h1>
                <p className="text-gray-600">Manage your income and expenses</p>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type
                        </label>
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {types.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Info */}
            <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Showing {transactions.length} of {totalTransactions} transactions
                </p>
                {loading && (
                    <div className="text-sm text-blue-600">Loading...</div>
                )}
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
                {transactions?.map((transaction) => (
                    <TransactionItem
                        key={transaction._id}
                        transaction={transaction}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Empty State */}
            {transactions?.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No transactions found</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <nav className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!hasPrevPage}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${page === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasNextPage}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}

            {/* Edit Dialog */}
            <EditTransactionDialog
                isOpen={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setEditingTransaction(null);
                }}
                transaction={editingTransaction}
                onUpdate={handleUpdateTransaction}
            />

            {/* Delete Dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setDeletingTransaction(null);
                }}
                transaction={deletingTransaction}
                onConfirm={handleDeleteTransaction}
            />
        </div>
    );
};

export default TransactionList;