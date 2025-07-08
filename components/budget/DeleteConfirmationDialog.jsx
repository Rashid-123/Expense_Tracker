import React, { useState } from 'react';
import { Button } from "../ui/button";
const DeleteConfirmationDialog = ({ isOpen, budget, onDelete, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);
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
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(budget._id);
            onClose();
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !budget) return null;

    const categoryColor = categoryColors[budget.category] || '#666';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Budget</h2>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4">Are you sure you want to delete this budget? This action cannot be undone.</p>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                            <div
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: categoryColor }}
                            ></div>
                            <span className="font-medium text-gray-800">
                                {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 mb-1">
                            ${budget.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                            {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Budget'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationDialog;