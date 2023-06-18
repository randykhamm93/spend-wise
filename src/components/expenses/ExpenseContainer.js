import { useState, useEffect } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from './ExpenseList';

export const ExpenseContainer = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

 
  const localSpendWiseUser = localStorage.getItem("spend_wise_user");
  const spendWiseUserObject = JSON.parse(localSpendWiseUser);

  const fetchExpenses = async () => {
    const response = await fetch('http://localhost:8088/expenses');
    const data = await response.json();
    setExpenses(data);
  };

  const fetchExpenseCategories = async () => {
    const response = await fetch('http://localhost:8088/expenseCategories'); // replace with your actual API endpoint
    const data = await response.json();
    setExpenseCategories(data);
  };

  useEffect(() => {
    fetchExpenses();
    fetchExpenseCategories();
  }, []);

  const handleAddExpense = async (expense) => {
    const parsedExpense = {
      ...expense,
      amount: parseFloat(expense.amount),
      expenseCategoryId: parseInt(expense.expenseCategoryId),
      userId: 1,
    };

    const response = await fetch('http://localhost:8088/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedExpense),
    });

    if (response.ok) {
      fetchExpenses();
    } else {
      console.error('Failed to add expense to the database');
    }
  };
  
  

  const handleEditExpense = (updatedExpense) => {
    // Update the edited expense in the expenses state
    setExpenses(
      expenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const handleDeleteExpense = (expenseId) => {
    // Remove the deleted expense from the expenses state
    setExpenses(expenses.filter((expense) => expense.id !== expenseId));
  };

  return (
    <>
      <ExpenseForm
        onAddExpense={handleAddExpense}
        expenseCategories={expenseCategories}
        selectedExpense={selectedExpense}
        setSelectedExpense={setSelectedExpense}
        isEditMode={isEditMode}
        onEditExpense={handleEditExpense}
        setIsEditMode={setIsEditMode}
      />
      <ExpenseList
        expenses={expenses}
        setExpenses={setExpenses}
        expenseCategories={expenseCategories} 
        onEdit={setSelectedExpense}
        onDelete={handleDeleteExpense}
        onAddExpense={handleAddExpense}
      />
    </>
  );
};
