import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const navigate = useNavigate()

    return (
        <ul className="navbar">
            <li className="navbar__item active">
                <Link className="navbar__link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="navbar__item active">
                <Link className="navbar__link" to="/budgets">Budget</Link>
            </li>
            <li className="navbar__item active">
                <Link className="navbar__link" to="/incomes">Income</Link>
            </li>
            <li className="navbar__item active">
                <Link className="navbar__link" to="/expenses">Expenses</Link>
            </li>
            <li className="navbar__item navbar__logout">
                <Link className="navbar__link" to="" onClick={() => {
                    localStorage.removeItem("spend_wise_user")
                    navigate("/", {replace: true})
                }}>Logout</Link>
            </li>
        </ul>
    )
}
