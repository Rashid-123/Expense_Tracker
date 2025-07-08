import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';
import mongoose from 'mongoose';

// GET - Fetch single budget
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid budget ID' },
        { status: 400 }
      );
    }
    
    const budget = await Budget.findById(id).lean();
    
    if (!budget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: budget
    });
    
  } catch (error) {
    console.error('GET budget error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budget' },
      { status: 500 }
    );
  }
}

// PUT - Update budget
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    const { category, amount, month, year } = body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid budget ID' },
        { status: 400 }
      );
    }
    
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
    
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        category,
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year)
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedBudget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedBudget,
      message: 'Budget updated successfully'
    });
    
  } catch (error) {
    console.error('PUT budget error:', error);
    
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
      { success: false, error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

// DELETE - Delete budget
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid budget ID' },
        { status: 400 }
      );
    }
    
    const deletedBudget = await Budget.findByIdAndDelete(id);
    
    if (!deletedBudget) {
      return NextResponse.json(
        { success: false, error: 'Budget not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Budget deleted successfully'
    });
    
  } catch (error) {
    console.error('DELETE budget error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}