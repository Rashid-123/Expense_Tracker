import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// ---------------------------  Fetch monthly expenses analytics -------------------------------
export async function GET(request) {
  try { 
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const type = searchParams.get('type') || 'expense';
    
    // Aggregate monthly data
    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          type: type,
          date: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);
    
   
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const chartData = months.map((month, index) => {
      const monthData = monthlyData.find(item => item._id.month === index + 1);
      return {
        month,
        amount: monthData ? monthData.total : 0,
        count: monthData ? monthData.count : 0
      };
    });
    
    return NextResponse.json({
      success: true,
      data: chartData
    });
    
  } catch (error) {
    console.error('Monthly expenses analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch monthly expenses data' },
      { status: 500 }
    );
  }
}