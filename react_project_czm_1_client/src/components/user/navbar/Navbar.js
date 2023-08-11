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
        {" "}
        <Link className="navbar-brand" to="/" style={{ paddingLeft: "10%" }}>
          <img src="czmLogo.png" alt="Logo" />
        </Link>
        <div className="container" style={{ float: "left" }}>
          <div
            style={{
              display: "flex",
              justifyContent: " center",
              justifyItems: "start",
              alignItems: "center",
              textAlign: "left",
              paddingLeft: "20%",
            }}
          >
            {navbarData.map((item) => (
              <Link
                className="nav-link"
                to="/"
                style={{
                  margin: "0 20px",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
