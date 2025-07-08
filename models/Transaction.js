
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Amount must be a positive number'
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [1, 'Description cannot be empty'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
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
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: {
      values: ['income', 'expense'],
      message: 'Type must be either income or expense'
    },
    default: 'expense'
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ date: -1, type: 1 });
transactionSchema.index({ category: 1, type: 1 });

// Virtual for formatted amount (useful for frontend display)
transactionSchema.virtual('formattedAmount').get(function() {
  return this.amount.toFixed(2);
});

// Virtual for formatted date
transactionSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Virtual for category display name
transactionSchema.virtual('categoryDisplayName').get(function() {
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

// Pre-save middleware to ensure amount is rounded to 2 decimal places
transactionSchema.pre('save', function(next) {
  if (this.amount) {
    this.amount = Math.round(this.amount * 100) / 100;
  }
  next();
});

// Static method to get transactions by category
transactionSchema.statics.getByCategory = function(category, startDate, endDate) {
  const query = { category };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }
  return this.find(query).sort({ date: -1 });
};

// Static method to get monthly summary
transactionSchema.statics.getMonthlySummary = function(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: endDate }
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
};

// Instance method to check if transaction is recent (within last 7 days)
transactionSchema.methods.isRecent = function() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.date >= sevenDaysAgo;
};

// Prevent model recompilation during development
export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

