import React, { Component } from "react";
import { sendAdminInfo } from "../../../api-services/apiServices";
import bcrypt from "bcryptjs"; 
import "./HomePageAdmin.css"; 
export default class HomePageAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleAdminUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handleAdminPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleAdminSubmit = (event) => {
    event.preventDefault();

    const { username, password } = this.state;

    // Kullanıcı şifresini şifrele
    const hashedPassword = bcrypt.hashSync(password, 10); // 10 rounds of salt

    // Sunucuya şifrelenmiş veriyi gönder
    sendAdminInfo(username, hashedPassword)
      .then((response) => {
        console.log("response:", response);
      })
      .catch((error) => {
        console.error("Error sending admin info:", error);
      });
  };

  render() {
    return (
      <div className="centered-container">
        <form className="form-signin" onSubmit={this.handleAdminSubmit}>
          <h1 className="h4 mb-4 text-center font-weight-normal">
            Sign in as an Admin
          </h1>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            required
            value={this.state.username}
            onChange={this.handleAdminUsernameChange}
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            required
            value={this.state.password}
            onChange={this.handleAdminPasswordChange}
          />

          <button className="btn btn-primary btn-block" type="submit">
            Sign in
          </button>
        </form>
      </div>
    );
  }
}