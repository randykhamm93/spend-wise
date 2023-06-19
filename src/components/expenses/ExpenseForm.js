import { useEffect, useState } from "react";

export const ExpenseForm = ({ onAddExpense, expenseCategories, selectedExpense,
 onEditExpense, formattedCurrency }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (selectedExpense) {
      setName(selectedExpense.name);
      setAmount(selectedExpense.amount);
      setCategoryId(selectedExpense.expenseCategoryId);
    } else {
      setName("");
      setAmount("");
      setCategoryId("");
    }
  }, [selectedExpense]);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Create a new expense object
    const newExpense = {
      name,
      amount,
      expenseCategoryId: categoryId
    };
  
    // If there's a selectedExpense, we're editing an existing expense
    if (selectedExpense) {
      onEditExpense({ ...selectedExpense, ...newExpense });
    } else {
      // Otherwise, we're adding a new expense
      onAddExpense(newExpense);
    }
  
    // Reset the form fields
    setName("");
    setAmount("");
    setCategoryId("");
  };
  

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <h1>{"Add an Expense"}</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Expense name"
        required
        className="form-control"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
        className="form-control"
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
        className="form-control"
      >
        <option value="">Select category</option>
        {expenseCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">
         {"Add Expense"}
      </button>
    </form>
  );
};
