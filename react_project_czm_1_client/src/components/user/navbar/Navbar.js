import React, { Component } from "react";
import { fetchNavbarData } from "../../../services/api-services/apiServices";
import { Link } from "react-router-dom";

class Navbar extends Component {
  state = {
    navbarData: null,
  };

  componentDidMount() {
    fetchNavbarData().then((data) => {
      // Limiting the data to first 5 items
      const limitedData = data.slice(0, 5);
      this.setState({ navbarData: limitedData });
    });
  }

  render() {
    const { navbarData } = this.state;
    //console.log("navbarData:", navbarData);
    if (!navbarData) {
      return <div>Loading...</div>;
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          {navbarData[0].title}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {navbarData.slice(1).map((item, index) => (
              <li
                key={index}
                className={`nav-item ${index === 0 ? "active" : ""}`}
              >
                <Link className="nav-link" to="/">{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
