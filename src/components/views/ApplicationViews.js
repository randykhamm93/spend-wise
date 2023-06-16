import { Outlet, Route, Routes } from "react-router-dom";
import { Overview } from "../dashboard/Overview";
import { BudgetForm } from "../budgets.js/BudgetForm";
import { IncomeList } from "../incomes/IncomeList";
import { ExpenseList } from "../expenses/ExpenseList";

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
			>
				<Route path="dashboard" element={<Overview />} />
				<Route path="budgets" element={<BudgetForm />} />
				<Route path="incomes" element={<IncomeList />} />
				<Route path="expenses" element={<ExpenseList />} />

			</Route>
		</Routes>
	);
};
