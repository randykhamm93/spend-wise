import { Outlet, Route, Routes } from "react-router-dom"
import { Overview } from "../dashboard/Overview"
import { BudgetForm } from "../forms/BudgetForm"
import { IncomeForm } from "../forms/IncomeForm"
import { ExpenseForm } from "../forms/ExpenseForm"

export const ApplicationViews = () => {
	const loggedUserId = JSON.parse(localStorage.getItem("spend_wise_user")).id;

	return (
		<Routes>
			<Route path="/" element={
				<>
					<h1>SpendWise</h1>
					<div>Budgeting Made Simple</div>

					<Outlet />
				</>
			}>
				
        <Route
          path="dashboard" element={<Overview loggedUserId={loggedUserId} />} />
				<Route path="budgets" element={<BudgetForm />} />
				<Route path="incomes" element={<IncomeForm />} />
				<Route path="expenses" element={<ExpenseForm />} />


			</Route>
		</Routes>
	)
}
