import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, DollarSign, Tag, Calendar, } from 'lucide-react';

const AddBudgetDialog = ({ isOpen, onClose, onAdd, selectedMonth, selectedYear }) => {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        month: selectedMonth || '',
        year: selectedYear || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Budget categories
    const categories = [
        'food',
        'transportation',
        'housing',
        'utilities',
        'entertainment',
        'healthcare',
        'shopping',
        'education',
        'other'
    ];

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


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Generate year options
    const generateYearOptions = () => {
        return [2025, 2026];
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.category.trim()) {
            setError('Category is required');
            return false;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Amount must be greater than 0');
            return false;
        }
        if (!formData.month) {
            setError('Month is required');
            return false;
        }
        if (!formData.year) {
            setError('Year is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const budgetData = {
                category: formData.category.trim(),
                amount: parseFloat(formData.amount),
                month: parseInt(formData.month),
                year: parseInt(formData.year)
            };

            await onAdd(budgetData);
            handleClose();
        } catch (err) {
            // Handle specific error messages from backend
            if (err.message) {
                setError(err.message);
            } else {
                setError('Failed to add budget. Please try again.');
            }
            console.error('Add budget error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            category: '',
            amount: '',
            month: selectedMonth || '',
            year: selectedYear || ''
        });
        setError('');
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign size={20} className="text-green-600" />
                        Add New Budget
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 ">
                        {/* Month */}
                        <div className="space-y-2">
                            <Label htmlFor="month" className="flex items-center gap-1">
                                <Calendar size={16} />
                                Month
                            </Label>
                            <Select
                                value={formData.month}
                                onValueChange={(value) => handleInputChange('month', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map(month => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Year */}
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Select
                                value={formData.year}
                                onValueChange={(value) => handleInputChange('year', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {generateYearOptions().map(year => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category" className="flex items-center gap-1">
                            <Tag size={16} />
                            Category
                        </Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange('category', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="flex items-center gap-1">

                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}

                        />
                    </div>

                    <DialogFooter className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding...
                                </>
                            ) : (
                                'Add Budget'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBudgetDialog;