import React, { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Title, Legend, DoughnutController } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Overview.css'

Chart.register(ArcElement, Tooltip, Title, Legend, DoughnutController);

export const Budget = () => {
  // State variables
  const [user, setUser] = useState({});
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  const localSpendWiseUser = localStorage.getItem("spend_wise_user");
  const spendWiseUserObject = JSON.parse(localSpendWiseUser);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data
    fetch(`http://localhost:8088/users/${spendWiseUserObject.id}`)
      .then(response => response.json())
      .then(data => setUser(data));

    // Fetch income data
    fetch(`http://localhost:8088/incomes?userId=${spendWiseUserObject.id}`)
      .then(response => response.json())
      .then(data => {
        const monthlyIncomes = data.map(income => ({
          ...income,
          amount: calculateMonthlyIncome(Number(income.amount), income.incomeFrequencyId)
        }));
        setIncomes(monthlyIncomes);
        const total = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);
        setTotalIncome(total);
      });

    // Fetch expense data
    fetch(`http://localhost:8088/expenses?userId=${spendWiseUserObject.id}`)
      .then(response => response.json())
      .then(data => {
        const monthlyExpenses = data.map(expense => ({
          ...expense,
          amount: calculateMonthlyExpenses(Number(expense.amount), expense.expenseFrequencyId)
        }));
        setExpenses(monthlyExpenses);
        const total = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        setTotalExpenses(total);
      });
  }, [spendWiseUserObject.id]);

  useEffect(() => {
    // Calculate balance
    setBalance(totalIncome - totalExpenses);
  }, [totalIncome, totalExpenses]);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
      }
    ]
  };

  const calculateMonthlyIncome = (amount, frequencyId) => {
    switch (frequencyId) {
      case 1: // Weekly
        return amount * 4;
      case 2: // Bi-Weekly
        return amount * 2;
      case 3: // Monthly
        return amount;
      case 4: // Annually
        return amount / 12;
      default:
        return amount;
    }
  };

  const calculateMonthlyExpenses = (amount, frequencyId) => {
    switch (frequencyId) {
      case 1: // Weekly
        return amount * 4;
      case 2: // Bi-Weekly
        return amount * 2;
      case 3: // Monthly
        return amount;
      case 4: // Annually
        return amount / 12;
      default:
        return amount;
    }
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: `Income (${((totalIncome / (totalIncome + totalExpenses)) * 100).toFixed(2)}%) vs Expenses (${((totalExpenses / (totalIncome + totalExpenses)) * 100).toFixed(2)}%)`
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const handleEditIncome = () => {
    navigate('/incomes');
  };

  const handleEditExpenses = () => {
    navigate('/expenses');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-left mb-5">Hello {user.fullName}, here is an overview of your current monthly budget..</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Total Income: {formatCurrency(totalIncome)}
              <button onClick={handleEditIncome} className="btn btn-primary custom-btn">Edit Income</button>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Total Expenses: {formatCurrency(totalExpenses)}
              <button onClick={handleEditExpenses} className="btn btn-primary custom-btn">Edit Expenses</button>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Budget Balance: {formatCurrency(balance)}
            </li>
          </ul>
        </div>
      </div>
      <div className="row mt-5 justify-content-center">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          {totalIncome !== 0 || totalExpenses !== 0 ? (
            <Doughnut data={data} options={options} />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};
