
import React, { useState } from 'react';

export const ExpenseList = ({ expenses, setExpenses, expenseCategories, onAddExpense }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsEditMode(true);
  };

  const handleDelete = (expense) => {
    // Delete expense from the database
    fetch(`http://localhost:8088/expenses/${expense.id}`, {
      method: 'DELETE'
    })
      .then(response => {
        // Remove the deleted expense from the expenses list
        setExpenses(expenses.filter(item => item.id !== expense.id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSave = () => {
    // Save the edited expense to the database
    fetch(`http://localhost:8088/expenses/${selectedExpense.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedExpense)
    })
      .then(response => response.json())
      .then(data => {
        // Update the expenses list with the edited expense
        setExpenses(expenses.map(item => (item.id === selectedExpense.id ? selectedExpense : item)));
        setSelectedExpense(null);
        setIsEditMode(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleAddExpense = (newExpense) => {
    // Call the addExpense function passed as a prop
    onAddExpense(newExpense);

    // Update the expenses list with the new expense
    setExpenses([...expenses, newExpense]);
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(expense => (
          <tr key={expense.id}>
            <td>
              <input type="checkbox" />
            </td>
            <td>{expense.name}</td>
            <td>{expense.amount}</td>
            <td>
              {expenseCategories.map(category => {
                if (category.id === expense.expenseCategoryId) { 
                  return category.name;
                }
                return null;
              })}
            </td>

            <td>
              <button className="btn btn-primary" onClick={() => handleEdit(expense)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(expense)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        {isEditMode && selectedExpense && (
          <tr>
            <td colSpan="5">
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </td>
          </tr>
        )}
      </tfoot>
    </table>
  );
};
