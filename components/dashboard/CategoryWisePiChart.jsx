

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';






const ExpensePieChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('api/analytics/category-breakdown?type=expense');
            const fetchedData = response.data.data;

            if (fetchedData && fetchedData.length > 0) {
                const totalAmount = fetchedData.reduce((sum, item) => sum + item.amount, 0);
                setTotal(totalAmount);
                setData(fetchedData);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const colors = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe',
        '#ffbb28', '#ff8042', '#8dd1e1', '#d084d0', '#87d068', '#ffc0cb'
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">{data.category}</p>
                    <p className="text-blue-600">Amount: ₹{data.amount.toLocaleString()}</p>
                    <p className="text-green-600">Transactions: {data.count}</p>
                    <p className="text-purple-600">Percentage: {data.percentage}%</p>
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-medium"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (loading) {
        return (
            <Card className="bg-white border border-gray-200 rounded-sm shadow-none">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center h-72">
                        <div className="text-gray-500">Loading chart data...</div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white border border-gray-200 shadow-none rounded-sm">
            <CardContent className="p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 ">Category Expenses</h2>

                    <p className="text-sm text-gray-600">Total: ₹{total.toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-center">
                    <div className="flex-1 max-w-xs">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={93}
                                        fill="#8884d8"
                                        dataKey="amount"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="ml-6 flex-shrink-0">
                        <div className="space-y-2">
                            {data.map((item, index) => (
                                <div key={item.category} className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded mr-2 flex-shrink-0"
                                        style={{ backgroundColor: colors[index % colors.length] }}
                                    ></div>
                                    <div className="flex-1">
                                        <div className="text-xs font-medium text-gray-800">{item.category}</div>
                                        <div className="text-xs text-gray-600">
                                            ₹{item.amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExpensePieChart;