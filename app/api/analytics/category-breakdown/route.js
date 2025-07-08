import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month'));
    const year = parseInt(searchParams.get('year'));
    const type = searchParams.get('type') || 'expense';
    
    // Build date filter
    let dateFilter = {};
    if (month && year) {
      dateFilter = {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0)
      };
    } else if (year) {
      dateFilter = {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      };
    } else {
      // Default to current month
      const now = new Date();
      dateFilter = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      };
    }
    
    // Aggregate category data
    const categoryData = await Transaction.aggregate([
      {
        $match: {
          type: type,
          date: dateFilter
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    // Format for chart
    const chartData = categoryData.map(item => ({
      category: item._id,
      amount: item.total,
      count: item.count
    }));
    
    // Calculate total for percentages
    const totalAmount = chartData.reduce((sum, item) => sum + item.amount, 0);
    
    // Add percentage to each category
    const dataWithPercentage = chartData.map(item => ({
      ...item,
      percentage: totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0
    }));
    
    return NextResponse.json({
      success: true,
      data: dataWithPercentage,
      total: totalAmount
    });
    
  } catch (error) {
    console.error('Category breakdown analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category breakdown data' },
      { status: 500 }
    );
  }
}
