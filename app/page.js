"use client";

import BudgetComparisonChart from "@/components/dashboard/Budget_Comparison";
import MonthlyExpenseChart from "@/components/dashboard/Monthly_Expense";
import ExpensePieChart from "@/components/dashboard/CategoryWisePiChart";
import DashboardSummary from "@/components/dashboard/DashboardSummary";


export default function Dashboard() {
  return (
    <div className=" mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h2>
       <p>Your financial overview at a glance.</p>
  
      <DashboardSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart />
        <MonthlyExpenseChart />
      </div>
     
      <BudgetComparisonChart />
    </div>
  );
}