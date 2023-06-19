import { useState, useEffect } from "react";
import { IncomeForm } from "./IncomeForm";
import { IncomeList } from "./IncomeList";


export const IncomeContainer = () => {
  const [incomes, setIncomes] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [incomeFrequencies, setIncomeFrequencies] = useState([]);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);


  const localSpendWiseUser = localStorage.getItem("spend_wise_user");
  const spendWiseUserObject = JSON.parse(localSpendWiseUser);

  const fetchIncomes = async () => {
    const response = await fetch('http://localhost:8088/incomes');
    const data = await response.json();
    const userIncomes = data.filter(income => income.userId === spendWiseUserObject.id);
    setIncomes(userIncomes);
  };
  

  const fetchIncomeCategories = async () => {
    const response = await fetch('http://localhost:8088/incomeCategories'); 
    const data = await response.json();
    setIncomeCategories(data);
  };

  const fetchIncomeFrequencies = async () => {
    const response = await fetch('http://localhost:8088/incomeFrequencies'); 
    const data = await response.json();
    setIncomeFrequencies(data);
  };

  useEffect(() => {
    fetchIncomes();
    fetchIncomeCategories();
    fetchIncomeFrequencies();
  }, []);

  const handleAddIncome = async (income) => {
    const parsedIncome = {
      ...income,
      amount: parseFloat(income.amount),
      incomeCategoryId: parseInt(income.incomeCategoryId),
      userId: spendWiseUserObject.id
    };

    const response = await fetch('http://localhost:8088/incomes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsedIncome),
    });

    if (response.ok) {
      fetchIncomes();
    } else {
      console.error('Failed to add income to the database');
    }
  };
 
  const handleEditIncome = async (updatedIncome) => {
    const response = await fetch(`http://localhost:8088/incomes/${updatedIncome.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedIncome),
    });
  
    if (response.ok) {
      fetchIncomes();
    } else {
      console.error('Failed to update income in the database');
    }
  };
  
  const handleDeleteIncome = async (incomeId) => {
    const response = await fetch(`http://localhost:8088/incomes/${incomeId}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      fetchIncomes();
    } else {
      console.error('Failed to delete income from the database');
    }
  };
  
  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <>
      <IncomeForm
        onAddIncome={handleAddIncome}
        incomeCategories={incomeCategories}
        incomeFrequencies={incomeFrequencies}
        selectedIncome={selectedIncome}
        setSelectedIncome={setSelectedIncome}
        isEditMode={isEditMode}
        onEditIncome={handleEditIncome}
        setIsEditMode={setIsEditMode}
        formattedCurrent={formatCurrency}
      />
      <IncomeList
        incomes={incomes}
        setIncomes={setIncomes}
        incomeCategories={incomeCategories}
        incomeFrequencies={incomeFrequencies}
        onEdit={setSelectedIncome}
        onDelete={handleDeleteIncome}
        onAddIncome={handleAddIncome}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        formattedCurrent={formatCurrency}
      />
    </>
  );
};
