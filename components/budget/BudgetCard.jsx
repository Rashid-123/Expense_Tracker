
import { Edit2, Trash2, DollarSign, Calendar } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {

    const categoryColors = {
        food: '#8884d8',
        transportation: '#82ca9d',
        housing: '#ffc658',
        utilities: '#ff7300',
        entertainment: '#00ff00',
        healthcare: '#ff0000',
        shopping: '#8dd1e1',
        education: '#d084d0',
        other: '#82d982'
    };
    const categoryColor = categoryColors[budget.category] || '#666';
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };
    return (
        <div className="bg-white rounded-sm shadow-xs p-6 border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: categoryColor }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}
                    </h3>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(budget)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(budget)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center text-gray-600">

                    <span className="text-2xl font-bold text-gray-800">
                        {formatCurrency(budget.amount)}
                    </span>
                </div>

                <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-1" />
                    <span className="text-sm">
                        {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BudgetCard;