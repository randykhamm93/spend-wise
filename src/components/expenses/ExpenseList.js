import { useState } from 'react';

export const ExpenseList = ({ expenses, setExpenses, expenseCategories, onAddExpense, isEditMode, setIsEditMode }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleCheckboxChange = (event, expense) => {
    if (event.target.checked) {
      setSelectedExpense(expense);
    } else {
      setSelectedExpense(null);
      setIsEditMode(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = () => {
    // Delete expense from the database
    fetch(`http://localhost:8088/expenses/${selectedExpense.id}`, {
      method: 'DELETE'
    })
      .then(response => {
        // Remove the deleted expense from the expenses list
        setExpenses(expenses.filter(item => item.id !== selectedExpense.id));
        setSelectedExpense(null);
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

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return (
    <div>
      <h2>Current Expenses</h2>
    <table className="table">
      <thead>
        <tr>
          <th>Select</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(expense => (
          <tr key={expense.id}>
            <td>
              <input type="checkbox" onChange={(event) => handleCheckboxChange(event, expense)} />
            </td>
            <td>
              {isEditMode && selectedExpense.id === expense.id ? (
                <input type="text" value={selectedExpense.name} onChange={(e) => setSelectedExpense({ ...selectedExpense, name: e.target.value })} />
              ) : (
                expense.name
              )}
            </td>
            <td>
              {isEditMode && selectedExpense.id === expense.id ? (
                <input
                  type="number"
                  value={selectedExpense.amount}
                  onChange={(e) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      amount: parseFloat(e.target.value)
                    })
                  }
                />
              ) : (
                usdFormatter.format(expense.amount)
              )}
            </td>
            <td>
              {isEditMode && selectedExpense.id === expense.id ? (
                <select value={selectedExpense.expenseCategoryId} onChange={(e) => setSelectedExpense({ ...selectedExpense, expenseCategoryId: parseInt(e.target.value) })}>
                  {expenseCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              ) : (
                expenseCategories.find(category => category.id === Number(expense.expenseCategoryId))?.name || ''
              )}

            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="5">
            <button className="btn btn-primary" onClick={handleEdit} disabled={!selectedExpense}>Edit</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={!selectedExpense}>Delete</button>
            {isEditMode && <button className="btn btn-success" onClick={handleSave}>Save</button>}
          </td>
        </tr>
      </tfoot>
    </table>
    </div>
  );
};
