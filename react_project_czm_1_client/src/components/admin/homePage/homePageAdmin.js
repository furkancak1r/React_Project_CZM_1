import React, { Component } from "react";
import { Link } from "react-router-dom"; // Eğer projenizde react-router kullanıyorsanız
import NavbarAdmin from "../navbar/navbarAdmin";
class HomePageAdmin extends Component {
  render() {
    return (
      <div>
        <NavbarAdmin />
        <Link to="/">Go to User Page</Link>
      </div>
    );
  }
}

export default HomePageAdmin;
