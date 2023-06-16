import React, { useState, useEffect } from "react";
import { IncomeEditForm } from "./IncomeEditForm";

export const IncomeList = ({ loggedUserId, loggedUserBudgetId }) => {
  const [incomes, setIncomes] = useState([]);
  const [selectedIncomes, setSelectedIncomes] = useState([]);
  const [editIncome, setEditIncome] = useState(null);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [incomeFrequencies, setIncomeFrequencies] = useState([]);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8088/incomes?userId=${loggedUserId}&budgetId=${loggedUserBudgetId}`
        );
        const data = await response.json();
        setIncomes(data);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    fetchIncomeData();
  }, [loggedUserId, loggedUserBudgetId]);

  useEffect(() => {
    const fetchIncomeCategories = async () => {
      try {
        const response = await fetch("http://localhost:8088/incomeCategories");
        const data = await response.json();
        setIncomeCategories(data);
      } catch (error) {
        console.error("Error fetching income categories:", error);
      }
    };

    fetchIncomeCategories();
  }, []);

  const handleIncomeSelection = (incomeId) => {
    setSelectedIncomes((prevSelectedIncomes) => {
      if (prevSelectedIncomes.includes(incomeId)) {
        // Deselecting an income
        return prevSelectedIncomes.filter((id) => id !== incomeId);
      } else {
        // Selecting an income
        return [...prevSelectedIncomes, incomeId];
      }
    });
    setEditIncome((prevEditIncome) => {
      if (prevEditIncome && prevEditIncome.id === incomeId) {
        // Deselecting the currently edited income, clear the edit form
        return null;
      } else {
        return prevEditIncome;
      }
    });
  };

  const handleDeleteIncome = async () => {
    try {
      await Promise.all(
        selectedIncomes.map(async (incomeId) => {
          const response = await fetch(`http://localhost:8088/incomes/${incomeId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            setIncomes((prevIncomes) => prevIncomes.filter((income) => income.id !== incomeId));
            setSelectedIncomes((prevSelectedIncomes) =>
              prevSelectedIncomes.filter((id) => id !== incomeId)
            );
          }
        })
      );
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  const getIncomeCategoryName = (categoryId) => {
    const category = incomeCategories.find((category) => category.id === categoryId);
    return category ? category.name : "";
  };
  
  const getIncomeFrequencyName = (frequencyId) => {
    const frequency = incomeFrequencies.find((frequency) => frequency.id === frequencyId);
    return frequency ? frequency.name : "";
  };
  

  const handleEditIncome = (incomeId) => {
    const selectedIncome = incomes.find((income) => income.id === incomeId);
    setEditIncome(selectedIncome);
  };

  const handleUpdateIncome = async (updatedIncome) => {
    try {
      const response = await fetch(`http://localhost:8088/incomes/${updatedIncome.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedIncome),
      });

      if (response.ok) {
        setIncomes((prevIncomes) =>
          prevIncomes.map((income) => (income.id === updatedIncome.id ? updatedIncome : income))
        );
        setEditIncome(null);
      }
    } catch (error) {
      console.error("Error updating income:", error);
    }
  };

  return (
    <div>
      <h2>Income List</h2>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Frequency</th>
            <th>Category</th>
          </tr>
        </thead>
       <tbody>
  {incomes.map((income) => (
    <tr key={income.id}>
      <td>
        <input
          type="checkbox"
          checked={selectedIncomes.includes(income.id)}
          onChange={() => handleIncomeSelection(income.id)}
        />
      </td>
      <td>{income.name}</td>
      <td>{income.amount}</td>
      <td>{getIncomeFrequencyName(income.incomeFrequencyId)}</td>
      <td>{getIncomeCategoryName(income.incomeCategoryId)}</td>
    </tr>
  ))}
</tbody>

      </table>
      {editIncome && (
        <IncomeEditForm
          income={editIncome}
          incomeCategories={incomeCategories}
          onSave={handleUpdateIncome}
        />
      )}
      {selectedIncomes.length === 1 && (
        <button onClick={() => handleEditIncome(selectedIncomes[0])}>Edit</button>
      )}
      {selectedIncomes.length > 0 && (
        <button onClick={handleDeleteIncome}>Delete Selected</button>
      )}
    </div>
  );
};
