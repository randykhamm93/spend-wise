import React, { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart, ArcElement, Tooltip, Title, Legend, DoughnutController } from 'chart.js';

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
        setIncomes(data);
        const total = data.reduce((sum, income) => sum + Number(income.amount), 0);
        setTotalIncome(total);
      });

    // Fetch expense data
    fetch(`http://localhost:8088/expenses?userId=${spendWiseUserObject.id}`)
      .then(response => response.json())
      .then(data => {
        setExpenses(data);
        const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0);
        setTotalExpenses(total);
      });
  }, [spendWiseUserObject.id]);

  useEffect(() => {
    // Calculate balance
    setBalance(totalIncome - totalExpenses);
  }, [totalIncome, totalExpenses]);

  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Income vs Expenses'
      },
      tooltip: {
        enabled: true,
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
      <h1 className="text-center mb-4">Hello {user.fullName}, here is an overview of your current budget..</h1>
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Total Income: ${totalIncome}
              <button onClick={handleEditIncome} className="btn btn-primary">Edit Income</button>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Total Expenses: ${totalExpenses}
              <button onClick={handleEditExpenses} className="btn btn-primary">Edit Expenses</button>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              Budget Balance: ${balance}
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};
