import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ExpensePieChart = ({ refreshFlag, refreshFlag2 }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);


    const colors = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe',
        '#ffbb28', '#ff8042', '#8dd1e1', '#d084d0', '#87d068', '#ffc0cb'
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/analytics/category-breakdown?type=expense`);
            const fetchedData = response.data.data;
            console.log('Fetched Data:', fetchedData.length);
            console.log('Fetched Data:', fetchedData);
            if (fetchedData && fetchedData.length > 0) {

                const totalAmount = fetchedData.reduce((sum, item) => sum + item.amount, 0);
                setTotal(totalAmount);

                console.log('Total Amount:', totalAmount);
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

    }, [refreshFlag, refreshFlag2]); // Fetch data when component mounts or when refreshFlag changes


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
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
                className="text-sm font-medium"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (loading) {
        return (
            <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-center">Expense Categories</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-lg text-gray-500">Loading chart data...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto bg-white rounded-md">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Expense Categories
                </h2>
                <p className="text-center text-gray-600 mt-2">
                    Total Expenses: ₹{total.toLocaleString()}
                </p>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-center">
                    <div className="flex-1 max-w-md">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={120}
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


                    <div className="ml-8 flex-shrink-0">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
                        <div className="space-y-3">
                            {data.map((item, index) => (
                                <div key={item.category} className="flex items-center">
                                    <div
                                        className="w-4 h-4 rounded mr-3 flex-shrink-0"
                                        style={{ backgroundColor: colors[index % colors.length] }}
                                    ></div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-800">{item.category}</div>
                                        <div className="text-xs text-gray-600">
                                            ₹{item.amount.toLocaleString()} ({item.percentage}%)
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpensePieChart;