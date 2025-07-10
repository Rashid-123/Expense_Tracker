



import React, { useState, useEffect } from 'react';
import Loader from "@/components/Loader";

const DashboardSummary = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardSummary = async () => {
        try {
            const response = await fetch('/api/analytics/dashboard-summary');
            const data = await response.json();
            if (data.success) {
                setSummary(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard summary:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardSummary();
    }, []);

    const formatCurrency = (amount) => `₹${amount.toLocaleString()}`;

    if (loading) return <Loader />;
    if (!summary) return <div className="text-center py-8">No data available</div>;

    const { currentMonth, previousMonth } = summary;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 shadow-none rounded-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Current Month</h2>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Income</span>
                            <span className="font-medium text-green-600">{formatCurrency(summary.currentMonth.income)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Expenses</span>
                            <span className="font-medium text-red-600">{formatCurrency(summary.currentMonth.expenses)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Balance</span>
                            <span className="font-medium text-blue-600">{formatCurrency(summary.currentMonth.balance)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">Transactions</span>
                            <span className="font-medium text-gray-800">{summary.currentMonth.transactionCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-none rounded-sm">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Previous Month</h3>
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Income</span>
                            <span className="font-medium text-green-600">{formatCurrency(summary.previousMonth.income)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Expenses</span>
                            <span className="font-medium text-red-600">{formatCurrency(summary.previousMonth.expenses)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Balance</span>
                            <span className="font-medium text-blue-600">{formatCurrency(summary.previousMonth.balance)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">Transactions</span>
                            <span className="font-medium text-gray-800">{summary.previousMonth.transactionCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;