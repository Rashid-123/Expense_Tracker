"use client";

import BudgetComparisonChart from "@/components/dashboard/Budget_Comparison";
import MonthlyExpenseChart from "@/components/dashboard/Monthly_Expense";
import ExpensePieChart from "@/components/dashboard/CategoryWisePiChart";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
// export default function Home() {
//   return (
//    <div> 
//        <DashboardSummary />

//     <ExpensePieChart />
//     <BudgetComparisonChart />
//     <MonthlyExpenseChart />
     
//    </div>
//   );
// }



export default function Dashboard() {
  return (
    <div className=" mx-auto space-y-6">
      {/* Dashboard Summary */}
      <DashboardSummary />
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart />
        <MonthlyExpenseChart />
      </div>
      
      {/* Budget Comparison - Full Width */}
      <BudgetComparisonChart />
    </div>
  );
}