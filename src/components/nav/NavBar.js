import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./NavBar.css";

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-expand-sm">
      <div className="container">
        <Link className="navbar-brand" to="/overview">
        <span className="green-dollar">$</span>pendWise
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/overview">
                Overview
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/incomes">
                Income
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/expenses">
                Expenses
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                onClick={() => {
                  localStorage.removeItem("spend_wise_user");
                  navigate("/", { replace: true });
                }}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
