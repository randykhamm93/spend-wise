import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const BudgetForm = () => {
  const [budgetName, setBudgetName] = useState("");
  const [amount, setAmount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  useEffect(() => {
    // Add event listener for form submission
    const handleSubmit = (event) => {
      event.preventDefault();

      // Validate form inputs
      if (!budgetName || amount <= 0 || !startDate || !endDate) {
        alert("Please fill in all fields with valid data.");
        return;
      }

      // Create a budget object
      const budget = {
        budgetName,
        amount,
        startDate,
        endDate,
      };

      // Perform your API logic to save the budget data
      saveBudget(budget);

      // Reset form inputs
      setBudgetName("");
      setAmount(0);
      setStartDate(null);
      setEndDate(null);
    };

    // Attach the event listener
    const form = document.getElementById("budgetForm");
    form.addEventListener("submit", handleSubmit);

    // Clean up the event listener
    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, [budgetName, amount, startDate, endDate]);

  const saveBudget = (budget) => {
    // Perform the API request to save the budget data
    // You can use the Fetch API or any other library of your choice
    fetch("http://localhost:8088/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budget),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Budget saved:", data);
        // Optionally, you can update your state or perform any other actions upon successful save
      })
      .catch((error) => {
        console.error("Error saving budget:", error);
        // Optionally, you can handle the error and display a message to the user
      });
  };

  return (
    <div>
      <h2>Add Budget</h2>
      <form id="budgetForm">
        <div>
          <label htmlFor="budgetName">Budget Name:</label>
          <input
            type="text"
            id="budgetName"
            value={budgetName}
            onChange={(event) => setBudgetName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(event) => setAmount(parseFloat(event.target.value))}
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
        <button type="submit">Add Budget</button>
      </form>
    </div>
  );
};
