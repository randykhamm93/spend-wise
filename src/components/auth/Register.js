import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export const Register = (props) => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  let navigate = useNavigate();

  const registerNewUser = () => {
    return fetch("http://localhost:8088/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((createdUser) => {
        if (createdUser.hasOwnProperty("id")) {
          localStorage.setItem(
            "spend_wise_user",
            JSON.stringify({
              id: createdUser.id,
            })
          );

          navigate("/");
        }
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    return fetch(`http://localhost:8088/users?email=${user.email}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          // Duplicate email. No good.
          window.alert("Account with that email address already exists");
        } else {
          // Good email, create user.
          registerNewUser();
        }
      });
  };

  const updateUser = (evt) => {
    const copy = { ...user };
    copy[evt.target.id] = evt.target.value;
    setUser(copy);
  };

  return (
    <main style={{ textAlign: "center" }}>
      <form className="form--login" onSubmit={handleRegister}>
      <h1 className="mb-4">SpendWise</h1>
        <h1 className="h3 mb-3 font-weight-normal">
          Please Register for SpendWise
        </h1>
        <fieldset className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            onChange={updateUser}
            type="text"
            id="fullName"
            className="form-control"
            placeholder="Enter your full name"
            required
            autoFocus
          />
        </fieldset>
        <fieldset className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            onChange={updateUser}
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email address"
            required
          />
        </fieldset>
        <fieldset className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            onChange={updateUser}
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            required
          />
        </fieldset>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </main>
  );
};
