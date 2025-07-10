import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
// ---------------------------  Fetch Dashboard summary analytics -------------------------------
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    
    
    const currentMonthStart = new Date(year, month - 1, 1);
    const currentMonthEnd = new Date(year, month, 0);
    
    
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonthStart = new Date(prevYear, prevMonth - 1, 1);
    const prevMonthEnd = new Date(prevYear, prevMonth, 0);
    
    // Current month summary
    const currentMonthData = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Previous month summary
    const prevMonthData = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: prevMonthStart, $lte: prevMonthEnd }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);
    
   
    const recentTransactions = await Transaction.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .lean();
    
  
    const currentIncome = currentMonthData.find(item => item._id === 'income')?.total || 0;
    const currentExpenses = currentMonthData.find(item => item._id === 'expense')?.total || 0;
    const currentTransactionCount = currentMonthData.reduce((sum, item) => sum + item.count, 0);
    
    const prevIncome = prevMonthData.find(item => item._id === 'income')?.total || 0;
    const prevExpenses = prevMonthData.find(item => item._id === 'expense')?.total || 0;
    

    const summary = {
      currentMonth: {
        income: currentIncome,
        expenses: currentExpenses,
        balance: currentIncome - currentExpenses,
        transactionCount: currentTransactionCount
      },
      previousMonth: {
        income: prevIncome,
        expenses: prevExpenses,
        balance: prevIncome - prevExpenses
      },
      recentTransactions
    };
    
    return NextResponse.json({
      success: true,
      data: summary
    });
    
  } catch (error) {
    console.error('Dashboard summary analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard summary data' },
      { status: 500 }
    );
  }
}