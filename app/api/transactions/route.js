import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// GET - Fetch all transactions with optional filters
export async function GET(request) {
  try {
    await connectDB();
     console.log('GET transactions request received');
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    
    // Build query object
    const query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }
    
    
    const skip = (page - 1) * limit;
    
    // Fetch transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
   
    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);
    
    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalTransactions,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('GET transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST - Create new transaction
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { amount, date, description, category, type } = body;
    
    // Validation
    if (!amount || !date || !description || !category || !type) {
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
    
    // Create transaction
    const transaction = new Transaction({
      amount: parseFloat(amount),
      date: new Date(date),
      description: description.trim(),
      category,
      type
    });
    
    const savedTransaction = await transaction.save();
    
    return NextResponse.json({
      success: true,
      data: savedTransaction,
      message: 'Transaction created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST transaction error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}