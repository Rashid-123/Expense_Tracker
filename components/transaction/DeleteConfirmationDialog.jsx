import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { useState } from 'react';
const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, transaction }) => {
    const [isDeleting, setIsDeleting] = useState(false);


    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            console.log('Deleting transaction:', transaction._id);
            await onConfirm(transaction._id);
            onClose();
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Transaction</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete this transaction?
                    </p>
                    {transaction && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                                {formatCurrency(transaction.amount)} • {formatDate(transaction.date)}
                            </p>
                        </div>
                    )}
                    <p className="text-sm text-red-600 mt-2">
                        This action cannot be undone.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;