import React, { Component } from "react";
import { fetchNavbarData, updateNavbarData } from "../../api-services/ApiServices";

class NavbarAdmin extends Component {
  state = {
    navbarData: null,
  };

  componentDidMount() {
    fetchNavbarData().then((data) => {
      this.setState({ navbarData: data });
    });
  }

  handleTitleChange = (index, event) => {
    const { navbarData } = this.state;
    const newNavbarData = [...navbarData];
    newNavbarData[index].title = event.target.value;
    this.setState({ navbarData: newNavbarData });
  };

  handleSave = () => {
    const { navbarData } = this.state;
    const data = {
      table_names: ["navbar"],
      columns: ["title"],
      values: navbarData.map((item) => item.title),
    };
    console.log(navbarData);

    console.log(data);
    updateNavbarData(data);
  };
  

  render() {
    const { navbarData } = this.state;

    if (!navbarData) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <ul>
          {navbarData.map((item, index) => (
            <li key={index}>
              <input
                type="text"
                value={item.title}
                onChange={(event) => this.handleTitleChange(index, event)}
              />
            </li>
          ))}
        </ul>
        <button onClick={this.handleSave}>Save</button>
      </div>
    );
  }
}

export default NavbarAdmin;
