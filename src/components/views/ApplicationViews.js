import { Outlet, Route, Routes } from "react-router-dom";
import { IncomeContainer } from "../incomes/IncomeContainer";
import { ExpenseContainer } from "../expenses/ExpenseContainer";
import { Budget } from "../budgets/Budget";

export const ApplicationViews = () => {
  return (
    <>
      <div className="logo-heading">
      <h1 className="">$pendWise</h1>
      <div className="logo-slogan">Budgeting Made Simple</div>
      </div>
      <Routes>
        <Route path="/" element={<Outlet />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/incomes" element={<IncomeContainer />} />
        <Route path="/expenses" element={<ExpenseContainer />} />
      </Routes>
    </>
  );
};
