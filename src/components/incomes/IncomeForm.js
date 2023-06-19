import { useEffect, useState } from "react";

export const IncomeForm = ({ onAddIncome, incomeFrequencies, incomeCategories, selectedIncome,
 onEditIncome }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequencyId, setFrequencyId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (selectedIncome) {
      setName(selectedIncome.name);
      setAmount(selectedIncome.amount);
      setFrequencyId(selectedIncome.incomeFrequencyId);
      setCategoryId(selectedIncome.incomeCategoryId);
    } else {
      setName("");
      setAmount("");
      setFrequencyId("");
      setCategoryId("");
    }
  }, [selectedIncome]);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Create a new income object
    const newIncome = {
      name,
      amount,
      incomeFrequencyId: frequencyId,
      incomeCategoryId: categoryId
    };
  
    // If there's a selectedIncome, we're editing an existing income
    if (selectedIncome) {
      onEditIncome({ ...selectedIncome, ...newIncome });
    } else {
      // Otherwise, we're adding a new income
      onAddIncome(newIncome);
    }
  
    // Reset the form fields
    setName("");
    setAmount("");
    setFrequencyId("");
    setCategoryId("");
  };
  

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <h1>{"Add an Income"}</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Income name"
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
        value={frequencyId}
        onChange={(e) => setFrequencyId(e.target.value)}
        required
        className="form-control"
      >
        <option value="">Select frequency</option>
        {incomeFrequencies.map((frequency) => (
          <option key={frequency.id} value={frequency.id}>
            {frequency.name}
          </option>
        ))}
      </select>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
        className="form-control"
      >
        <option value="">Select category</option>
        {incomeCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">
         {"Add Income"}
      </button>
    </form>
  );
};
