
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


budgetSchema.index({ 
  category: 1, 
  month: 1, 
  year: 1 
}, { 
  unique: true,
  name: 'unique_budget_per_category_month_year'
});


budgetSchema.index({ month: 1, year: 1 });
budgetSchema.index({ category: 1 });
budgetSchema.index({ year: 1, month: 1, isActive: 1 });


budgetSchema.virtual('formattedAmount').get(function() {
  return this.amount.toFixed(2);
});





export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema);