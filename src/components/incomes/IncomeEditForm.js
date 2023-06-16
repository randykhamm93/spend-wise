import React from "react";

export const IncomeEditForm = ({ income, incomeCategories, onSave }) => {
  const handleSave = (e) => {
    e.preventDefault();

    // Extract the form field values
    const { name, amount, incomeCategoryId, incomeFrequencyId } = e.target.elements;

    // Create an updated income object with the modified values
    const updatedIncome = {
      ...income,
      name: name.value !== "" ? name.value : income.name,
      amount: amount.value !== "" ? amount.value : income.amount,
      incomeCategoryId: incomeCategoryId.value !== "" ? incomeCategoryId.value : income.incomeCategoryId,
      incomeFrequencyId: incomeFrequencyId.value !== "" ? incomeFrequencyId.value : income.incomeFrequencyId,
    };

    // Call the onSave callback with the updated income
    onSave(updatedIncome);
  };

  return (
    <div>
      <h2>Edit Income</h2>
      <form onSubmit={handleSave}>
        <label>
          Name:
          <input type="text" name="name" defaultValue={income?.name || ""} />
        </label>
        <label>
          Amount:
          <input type="number" name="amount" defaultValue={income?.amount || ""} />
        </label>
        <label>
          Frequency:
          <select name="incomeFrequencyId" defaultValue={income?.incomeFrequencyId || ""}>
            <option value="">Select frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
        <label>
          Category:
          <select name="incomeCategoryId" defaultValue={income?.incomeCategoryId || ""}>
            <option value="">Select category</option>
            {incomeCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
