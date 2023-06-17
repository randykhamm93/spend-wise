import { Outlet, Route, Routes } from "react-router-dom";
import {  } from "../incomes/IncomeList";
import {  } from "../incomes/IncomeForm";
import { ExpenseContainer } from "../expenses/ExpenseContainer";
import { Budget } from "../budgets/Budget";

export const ApplicationViews = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <h1>SpendWise</h1>
            <div>Budgeting Made Simple</div>
            <Outlet />
          </>
        }
      />
      <Route path="budget" element={ < Budget/> } />

      <Route path="incomes" element={
				<>
					
					</>
			} />

      <Route path="expenses" element={ < ExpenseContainer /> } />
    </Routes>
  );
};
