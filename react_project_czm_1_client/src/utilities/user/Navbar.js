import React, { Component } from "react";
import { fetchNavbarData } from '../../api-services/ApiServices';

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
    console.log("navbarData:", navbarData)
    if (!navbarData) {
      return <div>Loading...</div>;
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          {navbarData[0].title}
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {navbarData.slice(1).map((item, index) => (
              <li key={index} className={`nav-item ${index === 0 ? 'active' : ''}`}>
                <a className="nav-link" href="#">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
