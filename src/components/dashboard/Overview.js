import React, { useEffect, useState } from "react";
import { Chart } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Tooltip, Title, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Title, Legend, DoughnutController);

export const Overview = () => {
  // State variables
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [budgetStartDate, setBudgetStartDate] = useState(null);
  const [budgetEndDate, setBudgetEndDate] = useState(null);
  const localSpendWiseUser = localStorage.getItem("spend_wise_user");
  const spendWiseUserObject = JSON.parse(localSpendWiseUser);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch budget data for the logged-in user
      const budgetResponse = await fetch(`http://localhost:8088/budgets?userId=${spendWiseUserObject.id}`);
      const budgetData = await budgetResponse.json();

      if (budgetData.length >= 1) {
        const budgetId = budgetData[0].id;

        // Fetch budget details to get start and end dates
        const budgetDetailsResponse = await fetch(`http://localhost:8088/budgets/${budgetId}`);
        const budgetDetailsData = await budgetDetailsResponse.json();

        // Fetch income data and calculate total income
        const incomeResponse = await fetch(`http://localhost:8088/incomes?budgetId=${budgetId}`);

        const incomeData = await incomeResponse.json();
        const totalIncomeAmount = incomeData.reduce(
          (total, income) => total + parseFloat(income.amount),
          0
        );
        setTotalIncome(totalIncomeAmount);

        // Fetch expense data and calculate total expenses
        const expenseResponse = await fetch(`http://localhost:8088/expenses?budgetId=${budgetId}`);
        const expenseData = await expenseResponse.json();
        const totalExpenseAmount = expenseData.reduce((total, expense) => total + expense.amount, 0);
        setTotalExpenses(totalExpenseAmount);

        // Set the budget start and end dates
        setBudgetStartDate(budgetDetailsData.startDate);
        setBudgetEndDate(budgetDetailsData.endDate);
      } else {
        console.error("No budget found for the logged-in user");
      }

    };

    fetchDashboardData();
  }, [spendWiseUserObject.id]);

  // Update current balance and generate chart data when total income or total expenses change
  useEffect(() => {
    const currentBalance = totalIncome - totalExpenses;
    setCurrentBalance(currentBalance);

    const generateChartData = () => {
      const totalAmount = totalIncome + totalExpenses;
      const incomePercentage = totalAmount !== 0 ? ((totalIncome / totalAmount) * 100).toFixed(2) : "N/A";
      const expensesPercentage = totalAmount !== 0 ? ((totalExpenses / totalAmount) * 100).toFixed(2) : "N/A";

      return {
        labels: [
          `Income: $${totalIncome.toFixed(2)} (${incomePercentage}%)`,
          `Expenses: $${totalExpenses.toFixed(2)} (${expensesPercentage}%)`
        ],
        datasets: [
          {
            data: [totalIncome, totalExpenses],
            backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
          },
        ],
      };
    };

    // Generate chart data and update state
    const data = generateChartData();
    setChartData(data);
  }, [totalIncome, totalExpenses]);

  return (
    <div>
      <h2>Budget Overview</h2>
      <div>Total Income: ${totalIncome.toFixed(2)}</div>
      <div>Total Expenses: ${totalExpenses.toFixed(2)}</div>
      <div>Current Balance: ${currentBalance.toFixed(2)}</div>
      <div>
        <div>Budget Start Date: {budgetStartDate}</div>
        <div>Budget End Date: {budgetEndDate}</div>
      </div>
      {chartData && (
        <div style={{ width: "40%", height: "auto" }}>
          <Doughnut data={chartData} />
        </div>
      )}
    </div>
  );
};
