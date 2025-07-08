"use client";
import React, { useState } from "react";
import TransactionList from "@/components/transaction/Transaction_list";
import ExpensePieChart from "@/components/transaction/CategoryWisePIChart";
import AddTransactionForm from "@/components/transaction/AddTransaction";

export default function Transactions() {
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [refreshFlag2, setRefreshFlag2] = useState(false);
  const handleTransactionAdded = () => {
    setRefreshFlag(prev => !prev); // Toggle flag to trigger refresh
  };
  const handleTransactionDelete = () => {
    setRefreshFlag2(prev => !prev); // Toggle flag to trigger refresh
  };
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* First two components - Parallel on md+ screens, stacked on smaller screens */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Add Transaction Form - Takes half width on md+ screens, full width on smaller screens */}
        {/* <div className="w-full md:w-1/2">
          <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
        </div> */}
        
        {/* Pie Chart - Takes half width on md+ screens, full width on smaller screens */}
        {/* <div className="w-full md:w-1/2">
          <ExpensePieChart refreshFlag={refreshFlag} refreshFlag2={refreshFlag2} />
        </div> */}
      </div>
      
      {/* Transaction List - Always takes full width */}
      <div className="w-full">
        <TransactionList refreshFlag={refreshFlag} onDeleteTransaction={handleTransactionDelete} />
      </div>
    </div>
  );
}