import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Update Budget</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select Category</option>
                            {Object.keys(categoryColors).map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.amount ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Enter amount"
                        />
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                            <select
                                value={formData.month}
                                onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.month ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Month</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.year ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Year"
                            />
                            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBudgetDialog;