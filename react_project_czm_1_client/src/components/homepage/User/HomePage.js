import React, { Component } from "react";
import { Link } from "react-router-dom"; // Eğer projenizde react-router kullanıyorsanız
import Navbar from "../../../utilities/user/Navbar";
class HomePage extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Link to="/admin">Go to Admin Page</Link>
      </div>
    );
  }
}

export default HomePage;
