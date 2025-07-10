


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const UpdateBudgetDialog = ({ isOpen, budget, onUpdate, onClose }) => {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        month: '',
        year: ''
    });

    const categoryColors = {
        food: '#8884d8',
        transportation: '#82ca9d',
        housing: '#ffc658',
        utilities: '#ff7300',
        entertainment: '#00ff00',
        healthcare: '#ff0000',
        shopping: '#8dd1e1',
        education: '#d084d0',
        other: '#82d982'
    };

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (budget) {
            setFormData({
                category: budget.category || '',
                amount: budget.amount || '',
                month: budget.month || '',
                year: budget.year || ''
            });
        }
    }, [budget]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
        if (!formData.month || formData.month < 1 || formData.month > 12) newErrors.month = 'Valid month is required (1-12)';
        if (!formData.year || formData.year < 2020) newErrors.year = 'Valid year is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onUpdate(budget._id, formData);
            onClose();
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const getMonthName = (monthNumber) => {
        return new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Budget</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange('category', value)}
                        >
                            <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(categoryColors).map(cat => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                            className={errors.amount ? 'border-red-500' : ''}
                            placeholder="Enter amount"
                        />
                        {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="month">Month</Label>
                            <Select
                                value={formData.month.toString()}
                                onValueChange={(value) => handleInputChange('month', parseInt(value))}
                            >
                                <SelectTrigger className={errors.month ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            {getMonthName(i + 1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.month && <p className="text-red-500 text-xs">{errors.month}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                                className={errors.year ? 'border-red-500' : ''}
                                placeholder="Year"
                            />
                            {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Budget'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateBudgetDialog;