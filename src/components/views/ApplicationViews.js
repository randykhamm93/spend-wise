import { Outlet, Route, Routes } from "react-router-dom";
import { IncomeContainer } from "../incomes/IncomeContainer";
import { ExpenseContainer } from "../expenses/ExpenseContainer";
import { Budget } from "../budgets/Budget";

export const ApplicationViews = () => {
  return (
    <>
      <h1>SpendWise</h1>
      <div>Budgeting Made Simple</div>
      <Routes>
        <Route path="/" element={<Outlet />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/incomes" element={<IncomeContainer />} />
        <Route path="/expenses" element={<ExpenseContainer />} />
      </Routes>
    </>
  );
};
