/* eslint-disable jsx-a11y/anchor-is-valid */
// Navbar.js
import React, { Component } from "react";
import { fetchNavbarData } from '../../api-services/ApiServices';

class Navbar extends Component {
  state = {
    navbarData: null,
  };

  componentDidMount() {
    fetchNavbarData().then((data) => {
      this.setState({ navbarData: data });
      
    });
  }

  render() {
    const { navbarData } = this.state;
    console.log("navbarData:",navbarData)
    if (!navbarData) {
      return <div>Loading...</div>;
    }

    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">{navbarData[0].title}</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            {navbarData.slice(1).map((item, index) => (
              <li key={index} class={`nav-item ${index === 0 ? 'active' : ''}`}>
                <a class="nav-link" href="#">{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
