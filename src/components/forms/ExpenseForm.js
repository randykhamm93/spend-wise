import { useEffect, useState } from "react";

export const ExpenseForm = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseCategories, setExpenseCategories] = useState([]);

  useEffect(() => {
    // Fetch expense categories from JSON data and set the state
    const fetchExpenseCategories = () => {
      fetch("http://localhost:8088/expenseCategories")
        .then((response) => response.json())
        .then((data) => {
          setExpenseCategories(data);
        })
        .catch((error) => {
          console.error("Error fetching expense categories:", error);
        });
    };

    fetchExpenseCategories();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create the new expense object
    const newExpense = {
      name: name,
      amount: amount,
      // Add any additional necessary properties (e.g., budgetId, userId)
    };

    // Send a POST request to save the new expense
    fetch("http://localhost:8088/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("New expense saved:", data);
        // Optionally, you can perform any other actions upon successful save
      })
      .catch((error) => {
        console.error("Error saving new expense:", error);
        // Optionally, you can handle the error and display a message to the user
      });

    // Reset the form inputs
    setName("");
    setAmount("");
  };

  return (
    <div>
      <h2>Expense Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Select Category</option>
            {/* Render options based on expense categories */}
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

