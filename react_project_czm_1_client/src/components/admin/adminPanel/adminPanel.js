import React, { useState } from "react";
import { sendAdminInfo } from "../../../services/api-services/apiServices";
import bcrypt from "bcryptjs";
import "./adminPanel.css";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleAdminPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAdminSubmit = async (event) => {
    event.preventDefault();

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const response = await sendAdminInfo(username, hashedPassword);

      if (response.message === "Login successful") {
        console.log("Login successful");
        navigate("/admin/homepage");
      } else {
        alert("Incorrect username or password");
      }
    } catch (error) {
      console.error("Error sending admin info:", error);
    }
  };

  return (
    <div className="centered-container">
      <form className="form-signin" onSubmit={handleAdminSubmit}>
        <h1 className="h4 mb-4 text-center font-weight-normal">
          Sign in as an Admin
        </h1>
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          required
          value={username}
          onChange={handleAdminUsernameChange}
        />
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          required
          value={password}
          onChange={handleAdminPasswordChange}
        />

        <button className="btn btn-primary btn-block" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;
