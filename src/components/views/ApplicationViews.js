import { Outlet, Route, Routes } from "react-router-dom";
import { IncomeContainer } from "../incomes/IncomeContainer";
import { ExpenseContainer } from "../expenses/ExpenseContainer";
import { Budget } from "../budgets/Overview";

export const ApplicationViews = () => {
  return (
    <>
      <div className="logo-heading">
      <h1 className=""><span className="green-dollar">$</span>pendWise</h1>
      <div className="logo-slogan">Budgeting Made Simple</div>
      </div>
      <Routes>
        <Route path="/" element={<Outlet />} />
        <Route path="/overview" element={<Budget />} />
        <Route path="/incomes" element={<IncomeContainer />} />
        <Route path="/expenses" element={<ExpenseContainer />} />
      </Routes>
    </>
  );
};
