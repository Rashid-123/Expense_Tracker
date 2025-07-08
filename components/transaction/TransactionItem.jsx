import { Button } from '@/components/ui/button';
import {
    Edit,
    Trash2,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import {
    Utensils,
    Car,
    Home,
    Zap,
    Film,
    Heart,
    ShoppingBag,
    GraduationCap,
    MoreHorizontal,
} from 'lucide-react';
const TransactionItem = ({ transaction, onEdit, onDelete }) => {
    const categoryIcons = {
        food: Utensils,
        transportation: Car,
        housing: Home,
        utilities: Zap,
        entertainment: Film,
        healthcare: Heart,
        shopping: ShoppingBag,
        education: GraduationCap,
        other: MoreHorizontal
    };

    const IconComponent = categoryIcons[transaction.category];
    const isIncome = transaction.type === 'income';


    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };


    return (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                    <IconComponent className={`w-5 h-5 ${isIncome ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {transaction.category}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <div className="text-right">
                    <div className="flex items-center space-x-1">
                        {isIncome ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">{transaction.type}</p>
                </div>

                <div className="flex space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 p-0 hover:bg-blue-50"
                    >
                        <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(transaction)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TransactionItem;