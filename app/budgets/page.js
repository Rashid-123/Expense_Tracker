"use client"; 
import React from 'react';
import BudgetList from '@/components/budget/BudgetList';
export default function Budgets() {
  return (
   <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
      </div>
      <BudgetList />
     
   </div>
  );
}
