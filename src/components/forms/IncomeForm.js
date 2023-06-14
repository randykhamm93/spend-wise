import { useEffect, useState } from "react";

export const IncomeForm = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("");
  const [category, setCategory] = useState("");
  const [incomeFrequencies, setIncomeFrequencies] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);

  useEffect(() => {
    // Fetch income categories from JSON data and set the state
    const fetchIncomeCategories = () => {
      fetch("http://localhost:8088/incomeCategories")
        .then((response) => response.json())
        .then((data) => {
          setIncomeCategories(data);
        })
        .catch((error) => {
          console.error("Error fetching income categories:", error);
        });
    };

    // Fetch income frequencies from JSON data and set the state
    const fetchIncomeFrequencies = () => {
      fetch("http://localhost:8088/incomeFrequencies")
        .then((response) => response.json())
        .then((data) => {
          setIncomeFrequencies(data);
        })
        .catch((error) => {
          console.error("Error fetching income frequencies:", error);
        });
    };
    fetchIncomeFrequencies();
    fetchIncomeCategories();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create the new income object
    const newIncome = {
      name: name,
      amount: amount,
      incomeFrequencyId: frequency,
      incomeCategoryId: category,
      // Add any additional necessary properties (e.g., budgetId, userId)
    };

    // Send a POST request to save the new income
    fetch("http://localhost:8088/incomes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newIncome),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("New income saved:", data);
        // Optionally, you can perform any other actions upon successful save
      })
      .catch((error) => {
        console.error("Error saving new income:", error);
        // Optionally, you can handle the error and display a message to the user
      });

    // Reset the form inputs
    setName("");
    setAmount("");
    setFrequency("");
    setCategory("");
  };

  return (
    <div>
      <h2>Income Form</h2>
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
          <label htmlFor="frequency">Frequency:</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
          >
            <option value="">Select Frequency</option>
            {/* Render options based on income frequencies */}
            {incomeFrequencies.map((frequency) => (
              <option key={frequency.id} value={frequency.id}>
                {frequency.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Select Category</option>
            {/* Render options based on income categories */}
            {incomeCategories.map((category) => (
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
