
import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'food', 
        'transportation', 
        'housing', 
        'utilities', 
        'entertainment', 
        'healthcare', 
        'shopping', 
        'education', 
        'other'
      ],
      message: 'Invalid category selected'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount cannot be negative'],
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Budget amount must be a non-negative number'
    }
  },
  month: {
    type: Number,
    required: [true, 'Month is required'],
    min: [1, 'Month must be between 1 and 12'],
    max: [12, 'Month must be between 1 and 12']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2020, 'Year must be 2020 or later'],
    max: [2050, 'Year must be 2050 or earlier']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one budget per category per month/year
budgetSchema.index({ 
  category: 1, 
  month: 1, 
  year: 1 
}, { 
  unique: true,
  name: 'unique_budget_per_category_month_year'
});

// Additional indexes for better query performance
budgetSchema.index({ month: 1, year: 1 });
budgetSchema.index({ category: 1 });
budgetSchema.index({ year: 1, month: 1, isActive: 1 });

// Virtual for formatted amount
budgetSchema.virtual('formattedAmount').get(function() {
  return this.amount.toFixed(2);
});

// Virtual for month name
budgetSchema.virtual('monthName').get(function() {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[this.month - 1];
});

// Virtual for category display name
budgetSchema.virtual('categoryDisplayName').get(function() {
  const categoryNames = {
    food: 'Food & Dining',
    transportation: 'Transportation',
    housing: 'Housing',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    healthcare: 'Healthcare',
    shopping: 'Shopping',
    education: 'Education',
    other: 'Other'
  };
  return categoryNames[this.category] || this.category;
});

// Virtual for period display (e.g., "March 2024")
budgetSchema.virtual('periodDisplay').get(function() {
  return `${this.monthName} ${this.year}`;
});

// Pre-save middleware to round amount to 2 decimal places
budgetSchema.pre('save', function(next) {
  if (this.amount) {
    this.amount = Math.round(this.amount * 100) / 100;
  }
  next();
});

// Static method to get budgets for a specific period
budgetSchema.statics.getByPeriod = function(year, month) {
  const query = { year, isActive: true };
  if (month) {
    query.month = month;
  }
  return this.find(query).sort({ category: 1 });
};

// Static method to get current month budgets
budgetSchema.statics.getCurrentMonthBudgets = function() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  return this.getByPeriod(currentYear, currentMonth);
};

// Static method to check if budget exists for category and period
budgetSchema.statics.budgetExists = function(category, month, year, excludeId = null) {
  const query = { category, month, year };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return this.findOne(query);
};

// Instance method to check if budget is for current month
budgetSchema.methods.isCurrentMonth = function() {
  const now = new Date();
  return this.month === (now.getMonth() + 1) && this.year === now.getFullYear();
};

// Instance method to check if budget is expired (past month)
budgetSchema.methods.isExpired = function() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  return this.year < currentYear || 
         (this.year === currentYear && this.month < currentMonth);
};

// Instance method to check if budget is for future month
budgetSchema.methods.isFuture = function() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  return this.year > currentYear || 
         (this.year === currentYear && this.month > currentMonth);
};

// Custom error handling for duplicate key error
budgetSchema.post('save', function(error, doc, next) {
  if (error.code === 11000) {
    const duplicateError = new Error('Budget already exists for this category and month');
    duplicateError.name = 'DuplicateBudgetError';
    next(duplicateError);
  } else {
    next(error);
  }
});

// Prevent model recompilation during development
export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema);