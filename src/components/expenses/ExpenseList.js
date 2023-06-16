import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedExpenses, setEditedExpenses] = useState([]);
  const localSpendWiseUser = localStorage.getItem("spend_wise_user")
  const spendWiseUserObject = JSON.parse(localSpendWiseUser)

  useEffect(() => {
    // Fetch expenses for a specific user and budget
    fetch(`http://localhost:8088/expenses?userId=${spendWiseUserObject.userId}&budgetId=${spendWiseUserObject.budgetId}`)
      .then((response) => response.json())
      .then((data) => setExpenses(data));

    // Fetch expense categories
    fetch("http://localhost:8088/expenseCategories")
      .then((response) => response.json())
      .then((data) => setExpenseCategories(data));
  }, [spendWiseUserObject.userId, spendWiseUserObject.budgetId]);

  const getExpenseCategoryName = (categoryId) => {
    const category = expenseCategories.find((category) => category.id === categoryId);
    return category ? category.name : "";
  };

  const handleCheckboxChange = (expenseId) => {
    if (selectedExpenses.includes(expenseId)) {
      setSelectedExpenses(selectedExpenses.filter((id) => id !== expenseId));
    } else {
      setSelectedExpenses([...selectedExpenses, expenseId]);
    }
  };

  const handleEditExpense = (expenseId) => {
    setEditMode(true);
    const expenseToEdit = expenses.find((expense) => expense.id === expenseId);
    setEditedExpenses([{ ...expenseToEdit }]);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedExpenses([]);
  };

  const handleSaveExpense = () => {
    // Handle save logic here using the editedExpenses state
    console.log("Saving edited expenses:", editedExpenses);
    setEditMode(false);
    setEditedExpenses([]);
  };

  const handleDeleteExpense = () => {
    // Perform delete logic here using the selectedExpenses state
    console.log("Deleting expenses:", selectedExpenses);
    setSelectedExpenses([]);
  };

  const handleExpenseChange = (event, index) => {
    const { name, value } = event.target;
    setEditedExpenses((prevExpenses) => {
      const updatedExpenses = [...prevExpenses];
      updatedExpenses[index] = {
        ...updatedExpenses[index],
        [name]: value,
      };
      return updatedExpenses;
    });
  };

  const renderCategoryDropdown = (categoryId, index) => {
    return (
      <select
        name="expenseCategoryId"
        value={categoryId}
        onChange={(event) => handleExpenseChange(event, index)}
      >
        {expenseCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div>
      <h2>Expense List</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Select</th>
            <th>Expense</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr
              key={expense.id}
              className={selectedExpenses.includes(expense.id) ? "table-primary" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedExpenses.includes(expense.id)}
                  onChange={() => handleCheckboxChange(expense.id)}
                />
              </td>
              <td>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={editedExpenses[index]?.name || ""}
                    onChange={(event) => handleExpenseChange(event, index)}
                  />
                ) : (
                  expense.name
                )}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="number"
                    name="amount"
                    value={editedExpenses[index]?.amount || ""}
                    onChange={(event) => handleExpenseChange(event, index)}
                  />
                ) : (
                  expense.amount
                )}
              </td>
              <td>
                {editMode ? (
                  renderCategoryDropdown(editedExpenses[index]?.expenseCategoryId, index)
                ) : (
                  getExpenseCategoryName(expense.expenseCategoryId)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editMode ? (
        <div className="buttons-container">
          <button className="btn btn-primary" onClick={handleSaveExpense}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="buttons-container">
          <button
            className="btn btn-primary"
            onClick={() => handleEditExpense(selectedExpenses[0])}
            disabled={selectedExpenses.length !== 1}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteExpense(selectedExpenses)}
            disabled={selectedExpenses.length === 0}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
