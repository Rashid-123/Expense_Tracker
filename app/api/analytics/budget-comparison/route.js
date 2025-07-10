import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';
// ---------------------------  Fetch budget comparison analytics -------------------------------
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    
    
    const budgets = await Budget.find({ month, year }).lean();
    
    
    const actualExpenses = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month, 0)
          }
        }
      },
      {
        $group: {
          _id: '$category',
          actual: { $sum: '$amount' }
        }
      }
    ]);
    
    
    const comparisonData = budgets.map(budget => {
      const actualData = actualExpenses.find(expense => expense._id === budget.category);
      const actualAmount = actualData ? actualData.actual : 0;
      const remaining = budget.amount - actualAmount;
      const percentage = budget.amount > 0 ? (actualAmount / budget.amount) * 100 : 0;
      
      return {
        category: budget.category,
        budgeted: budget.amount,
        actual: actualAmount,
        remaining: remaining,
        percentage: percentage.toFixed(1),
        status: remaining >= 0 ? 'under' : 'over'
      };
    });

    const categoriesWithoutBudget = actualExpenses.filter(expense =>
      !budgets.some(budget => budget.category === expense._id)
    );
    
    categoriesWithoutBudget.forEach(expense => {
      comparisonData.push({
        category: expense._id,
        budgeted: 0,
        actual: expense.actual,
        remaining: -expense.actual,
        percentage: 0,
        status: 'no_budget'
      });
    });
    
    return NextResponse.json({
      success: true,
      data: comparisonData
    });
    
  } catch (error) {
    console.error('Budget comparison analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget comparison data' },
      { status: 500 }
    );
  }
}