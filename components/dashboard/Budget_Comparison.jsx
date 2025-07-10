// 'use client';

// import { useEffect, useState } from 'react';
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';

// const months = [
//     { label: 'Jan', value: '1' }, { label: 'Feb', value: '2' }, { label: 'Mar', value: '3' },
//     { label: 'Apr', value: '4' }, { label: 'May', value: '5' }, { label: 'Jun', value: '6' },
//     { label: 'Jul', value: '7' }, { label: 'Aug', value: '8' }, { label: 'Sep', value: '9' },
//     { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' },
// ];

// const getYears = (start = 2022, count = 5) => {
//     const currentYear = new Date().getFullYear();
//     return Array.from({ length: count }, (_, i) => (currentYear - i).toString());
// };

// const BudgetComparisonChart = () => {
//     const currentMonth = (new Date().getMonth() + 1).toString();
//     const currentYear = new Date().getFullYear().toString();

//     const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//     const [selectedYear, setSelectedYear] = useState(currentYear);
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         const fetchBudgetData = async () => {
//             try {
//                 const res = await fetch(`/api/analytics/budget-comparison?month=${selectedMonth}&year=${selectedYear}`);
//                 const json = await res.json();
//                 if (json.success) setData(json.data);
//             } catch (err) {
//                 console.error('Failed to fetch budget data', err);
//             }
//         };

//         fetchBudgetData();
//     }, [selectedMonth, selectedYear]);

//     return (
//         <div className="space-y-6">
//             {/* Filters */}
//             <div className="flex gap-4 items-center">
//                 <div>
//                     <Label>Month</Label>
//                     <Select value={selectedMonth} onValueChange={setSelectedMonth}>
//                         <SelectTrigger className="w-[120px]">
//                             <SelectValue placeholder="Select month" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {months.map(m => (
//                                 <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>

//                 <div>
//                     <Label>Year</Label>
//                     <Select value={selectedYear} onValueChange={setSelectedYear}>
//                         <SelectTrigger className="w-[120px]">
//                             <SelectValue placeholder="Select year" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {getYears().map(y => (
//                                 <SelectItem key={y} value={y}>{y}</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>

//             {/* Chart */}
//             <div className="w-full h-96">
//                 <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={data}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="category" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
//                         <Bar dataKey="actual" fill="#82ca9d" name="Actual Spending" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// };

// export default BudgetComparisonChart;

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const months = [
    { label: 'Jan', value: '1' }, { label: 'Feb', value: '2' }, { label: 'Mar', value: '3' },
    { label: 'Apr', value: '4' }, { label: 'May', value: '5' }, { label: 'Jun', value: '6' },
    { label: 'Jul', value: '7' }, { label: 'Aug', value: '8' }, { label: 'Sep', value: '9' },
    { label: 'Oct', value: '10' }, { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' }
];

const getYears = (start = 2022, count = 5) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: count }, (_, i) => (currentYear - i).toString());
};
const BudgetComparisonChart = () => {
    const currentMonth = (new Date().getMonth() + 1).toString();
    const currentYear = new Date().getFullYear().toString();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchBudgetData = async () => {
            try {
                const res = await fetch(`/api/analytics/budget-comparison?month=${selectedMonth}&year=${selectedYear}`);
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch (err) {
                console.error('Failed to fetch budget data', err);
            }
        };

        fetchBudgetData();
    }, [selectedMonth, selectedYear]);

    return (
        <Card className="bg-white border border-gray-200 shadow-none rounded-sm">
            <CardContent className="p-6">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <div>  <h2 className="text-xl font-semibold text-gray-800 ">Budget vs Expense</h2>
                        <p className="text-gray-600">Your monthly budget vs expense comparison</p>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <Label className="text-sm">Month</Label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map(m => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-sm">Year</Label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getYears().map(y => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
                            <Bar dataKey="actual" fill="#82ca9d" name="Actual Spending" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card >
    );
};

export default BudgetComparisonChart;