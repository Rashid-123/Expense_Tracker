
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import TransactionItem from './TransactionItem';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import AddTransactionDialog from './AddTransactionDialog';
import Loader from '@/components/Loader';

const TransactionList = () => {
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

            const response = await axios.get(`api/transactions?${params}`);


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


    useEffect(() => {
        fetchTransactions(1, filters);
    }, []);


    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...filters, [filterType]: value };
        setFilters(newFilters);
        setCurrentPage(1);
        fetchTransactions(1, newFilters);
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchTransactions(page, filters);
    };


    const handleTransactionAdded = async () => {
        fetchTransactions(currentPage, filters);
    };

    const handleUpdateTransaction = async (id, formData) => {
        try {
            const response = await axios.put(`api/transactions/${id}`, formData);
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
            const response = await axios.delete(`api/transactions/${id}`);
            setTransactions(prev =>
                prev.filter(t => t._id !== id)
            );


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
        <div className="mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Transactions</h1>
                <p className="text-gray-600">Manage your income and expenses</p>
            </div>


            <div className="mb-6 bg-white p-4 rounded-md shadow-xs border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    <div>
                        <Label htmlFor="category" className="mb-2 block text-sm font-medium">
                            Category
                        </Label>
                        <Select
                            value={filters.category}
                            onValueChange={(value) => handleFilterChange("category", value)}
                        >
                            <SelectTrigger id="category" className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Type Filter */}
                    <div>
                        <Label htmlFor="type" className="mb-2 block text-sm font-medium">
                            Type
                        </Label>
                        <Select
                            value={filters.type}
                            onValueChange={(value) => handleFilterChange("type", value)}
                        >
                            <SelectTrigger id="type" className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>


            <div className="mb-4 flex justify-between items-center">
                {!loading && <p className="text-sm text-gray-600">
                    Showing {transactions.length} of {totalTransactions} transactions
                </p>}

            </div>


            {loading ? <Loader /> : <div className="space-y-3">
                {transactions?.map((transaction) => (
                    <TransactionItem
                        key={transaction._id}
                        transaction={transaction}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>}


            {transactions?.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No transactions found</p>
                </div>
            )}


            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <nav className="flex items-center space-x-2">

                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!hasPrevPage}
                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>


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

            {/* edit dialog */}
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
            {/* Add transaction dialog  */}
            <AddTransactionDialog onTransactionAdded={handleTransactionAdded} />
        </div>
    );
};

export default TransactionList;