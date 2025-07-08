import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';

// GET - Fetch all budgets with optional filters
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    
    // Build query object
    const query = {};
    
    if (month) {
      query.month = parseInt(month);
    }
    
    if (year) {
      query.year = parseInt(year);
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // If no month/year specified, get current month/year
    if (!month && !year) {
      const now = new Date();
      query.month = now.getMonth() + 1;
      query.year = now.getFullYear();
    }
    
    const budgets = await Budget.find(query)
      .sort({ category: 1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: budgets
    });
    
  } catch (error) {
    console.error('GET budgets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

// POST - Create new budget
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { category, amount, month, year } = body;
    
    // Validation
    if (!category || !amount || !month || !year) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, error: 'Month must be between 1 and 12' },
        { status: 400 }
      );
    }
    
    // Create budget
    const budget = new Budget({
      category,
      amount: parseFloat(amount),
      month: parseInt(month),
      year: parseInt(year)
    });
    
    const savedBudget = await budget.save();
    
    return NextResponse.json({
      success: true,
      data: savedBudget,
      message: 'Budget created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST budget error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Budget already exists for this category and month' },
        { status: 409 }
      );
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}