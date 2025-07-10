

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';




const getYears = (start = 2022, count = 5) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: count }, (_, i) => (currentYear - i).toString());
};

const MonthlyExpenseChart = () => {
    const currentYear = new Date().getFullYear().toString();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/analytics/monthly-expenses?year=${selectedYear}`);
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch (err) {
                console.error('Error fetching monthly expense data:', err);
            }
        };

        fetchData();
    }, [selectedYear]);

    return (
        <Card className="bg-white border border-gray-200 shadow-none rounded-sm">
            <CardContent className="p-3 md:p-6">

                <div className="flex items-center justify-between mb-4">
                    <div>  <h2 className="text-xl font-semibold text-gray-800 ">Monthly Expense</h2>
                        <p className="text-gray-600">your total monthly expenses</p></div>

                    <div className="w-32">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {getYears().map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#f97316" name="Expense (₹)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default MonthlyExpenseChart;