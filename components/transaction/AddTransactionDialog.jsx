

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { showToast } from '@/lib/showToast';



const AddTransactionDialog = ({ onTransactionAdded, triggerClassName, triggerChildren, variant = "fab" }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        description: '',
        category: '',
        type: 'expense'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        { value: 'food', label: 'Food' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'education', label: 'Education' },
        { value: 'other', label: 'Other' }
    ];
    const getButtonClasses = () => {
        if (triggerClassName) return triggerClassName;

        if (variant === "fab") {
            return "fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center";
        }

        return "flex items-center gap-2";
    };

    const getButtonContent = () => {
        if (triggerChildren) return triggerChildren;

        if (variant === "fab") {
            return <Plus className="h-6 w-6" />;
        }

        return (
            <>
                <Plus className="h-4 w-4" />
                Add Transaction
            </>
        );
    };
    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(name, value);
    };

    const resetForm = () => {
        setFormData({
            amount: '',
            date: '',
            description: '',
            category: '',
            type: 'expense'
        });
        setError('');
        setSuccess('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!formData.amount || !formData.date || !formData.description || !formData.category || !formData.type) {
            setError('All fields are required');
            return;
        }

        if (parseFloat(formData.amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('Transaction added successfully!');

                resetForm();
                showToast('Transaction added successfully!', 'success');
                setTimeout(() => {
                    setOpen(false);
                    setSuccess('');
                }, 1500);


                if (onTransactionAdded) {
                    onTransactionAdded();
                }
            } else {
                setError(result.error || 'Failed to add transaction');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={getButtonClasses()}>
                    {getButtonContent()}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="space-y-2">
                        <Label>Transaction Type</Label>
                        <RadioGroup
                            value={formData.type}
                            onValueChange={(value) => handleChange('type', value)}
                            className="flex gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expense" id="expense" />
                                <Label htmlFor="expense" className="text-sm">Expense</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="income" id="income" />
                                <Label htmlFor="income" className="text-sm">Income</Label>
                            </div>
                        </RadioGroup>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            placeholder="Enter amount"
                        />
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                            <SelectTrigger>
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


                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Enter description"
                            className="resize-none"
                        />
                    </div>


                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}


                    {success && (
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">{success}</AlertDescription>
                        </Alert>
                    )}


                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? 'Adding...' : 'Add Transaction'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddTransactionDialog;