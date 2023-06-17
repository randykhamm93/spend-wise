import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const ExpenseList = ({
  expenses,
  loggedInUserId,
  expenseCategories,
  onDeleteExpense,
  setExpenses,
}) => {
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [editedAmount, setEditedAmount] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedCategory, setEditedCategory] = useState("")
  const [selectedExpenses, setSelectedExpenses] = useState([]); // State for selected expenses

  const filteredExpenses = expenses.filter(
    (expense) => expense.userId === loggedInUserId
  );

  const handleAmountChange = (e) => {
    setEditedAmount(e.target.value);
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleEditExpense = (expenseId) => {
    const expense = filteredExpenses.find((expense) => expense.id === expenseId);
    if (expense) {
      setEditingExpenseId(expenseId);
      setEditedAmount(expense.amount.toString());
      setEditedName(expense.name);
    }
  };

  const handleCategoryChange = (expenseId, category) => {
    // Handle category change logic
    console.log("Expense ID:", expenseId);
    console.log("Selected category:", category);
  };

  const handleDeleteExpense = (expenseId) => {
    setDeletingExpenseId(expenseId);
    onDeleteExpense(expenseId);
  };

  const handleSaveExpense = (expenseId) => {
    // Find the edited expense by ID
    const editedExpense = expenses.find((expense) => expense.id === expenseId);

    // Update the amount and name of the edited expense
    editedExpense.amount = parseFloat(editedAmount);
    editedExpense.name = editedName;

    // Perform the update API call or any other logic to update the expense
    fetch(`http://localhost:8088/expenses/${expenseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedExpense),
    })
      .then((response) => {
        if (response.ok) {
          // If the update is successful, update the expenses state
          setExpenses((prevExpenses) =>
            prevExpenses.map((expense) =>
              expense.id === expenseId ? editedExpense : expense
            )
          );
          setEditingExpenseId(null); // Reset the editing expense ID
          setEditedAmount("");
          setEditedName("");
        } else {
          throw new Error("Failed to update expense");
        }
      })
      .catch((error) => {
        console.log("Error updating expense:", error);
      });
  };

  const handleCancelEditExpense = () => {
    // Reset the editing state without saving changes
    setEditingExpenseId(null);
    setEditedAmount("");
    setEditedName("");
  };

  const handleExpenseSelection = (expenseId) => {
    // Toggle the selection of the expense
    setSelectedExpenses((prevSelectedExpenses) => {
      if (prevSelectedExpenses.includes(expenseId)) {
        return prevSelectedExpenses.filter((id) => id !== expenseId);
      } else {
        return [...prevSelectedExpenses, expenseId];
      }
    });
  };

  const handleEditButtonClick = () => {
    // Perform edit action
    // ...
  };

  const handleDeleteButtonClick = () => {
    // Perform delete action
    // ...
  };

  const renderCategoryCell = (expense) => {
    if (expense.id === editingExpenseId) {
      // Render editable dropdown when expense is being edited
      return (
        <td>
          <select
            className="form-control"
            defaultValue={expense.expenses[0]?.expenseCategoryId} // Access expenseCategoryId from nested expense
            onChange={(e) => handleCategoryChange(expense.id, e.target.value)}
          >
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </td>
      );
    } else {
      // Render category name when expense is not being edited
      const category = expenseCategories.find(
        (cat) => cat.id === expense.expenses[0]?.expenseCategoryId // Access expenseCategoryId from nested expense
      );
      return <td>{category ? category.name : ""}</td>;
    }
  };

  const renderExpenseName = (expense) => {
    const foundExpense = expenses.find((exp) => exp.id === expense.expenseId);
    return foundExpense ? foundExpense.name : "Unknown expense";
  };




  const renderExpenseAmount = (expense) => {
    const foundExpense = expenses.find((exp) => exp.id === expense.expenseId);
    return foundExpense ? foundExpense.amount : "";
  };

  const isEditButtonDisabled = selectedExpenses.length === 0; // Disable edit button if no expenses are selected
  const isDeleteButtonDisabled = selectedExpenses.length === 0; // Disable delete button if no expenses are selected

  return (
    <>
      <h2>List of Expenses</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Select</th>
            <th scope="col">Name</th>
            <th scope="col">Amount</th>
            <th scope="col">Category</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedExpenses.includes(expense.id)}
                  onChange={() => handleExpenseSelection(expense.id)}
                />
              </td>
              <td>
                {editingExpenseId === expense.id ? (
                  <input
                    className="form-control"
                    type="text"
                    value={editedName}
                    onChange={handleNameChange}
                  />
                ) : (
                  expense.name
                )}
              </td>
              <td>
                {editingExpenseId === expense.id ? (
                  <input
                    className="form-control"
                    type="number"
                    value={editedAmount}
                    onChange={handleAmountChange}
                  />
                ) : (
                  expense.amount
                )}
              </td>
              <td>{renderExpenseName(expense)}</td>
              {renderCategoryCell(expense)}
              <td>
                {editingExpenseId !== expense.id ? (
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => handleEditExpense(expense.id)}
                    disabled={isEditButtonDisabled} // Disable edit button if no expenses are selected
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-success mr-2"
                      onClick={() => handleSaveExpense(expense.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelEditExpense}
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteExpense(expense.id)}
                  disabled={deletingExpenseId === expense.id || isDeleteButtonDisabled} // Disable delete button if deleting or no expenses are selected
                >
                  {deletingExpenseId === expense.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
