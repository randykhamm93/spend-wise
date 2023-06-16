import { Navigate, useLocation } from "react-router-dom";

export const Authorized = ({ children }) => {
  const location = useLocation();
  const localSpendWiseUser = localStorage.getItem("spend_wise_user");
  const spendWiseUserObject = JSON.parse(localSpendWiseUser);

  if (spendWiseUserObject) {
    return children;
  } else {
    return (
      <Navigate
        to={`/login/${location.search}`}
        replace
        state={{ location }}
      />
    );
  }
};
