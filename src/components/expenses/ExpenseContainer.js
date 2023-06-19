import { useState, useEffect } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from './ExpenseList';
import "./Expenses.css"

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
    const userExpenses = data.filter(expense => expense.userId === spendWiseUserObject.id);
    setExpenses(userExpenses);
  };
  
  const fetchExpenseCategories = async () => {
    const response = await fetch('http://localhost:8088/expenseCategories'); 
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
      userId: spendWiseUserObject.id
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
 
  const handleEditExpense = async (updatedExpense) => {
    const response = await fetch(`http://localhost:8088/expenses/${updatedExpense.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedExpense),
    });
  
    if (response.ok) {
      fetchExpenses();
    } else {
      console.error('Failed to update expense in the database');
    }
  };
  
  const handleDeleteExpense = async (expenseId) => {
    const response = await fetch(`http://localhost:8088/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      fetchExpenses();
    } else {
      console.error('Failed to delete expense from the database');
    }
  };
  

  return (
    <div className="expense__container">
      <div className="expense-form-container">
        <ExpenseForm
          onAddExpense={handleAddExpense}
          expenseCategories={expenseCategories}
          selectedExpense={selectedExpense}
          setSelectedExpense={setSelectedExpense}
          isEditMode={isEditMode}
          onEditExpense={handleEditExpense}
          setIsEditMode={setIsEditMode}
        />
      </div>
      <div className="expense-list-container">
        <ExpenseList
          expenses={expenses}
          setExpenses={setExpenses}
          expenseCategories={expenseCategories}
          onEdit={setSelectedExpense}
          onDelete={handleDeleteExpense}
          onAddExpense={handleAddExpense}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </div>
    </div>
  );  
};
