import React, { Component } from "react";
import { fetchNavbarData, updateNavbarData } from "../../../services/api-services/apiServices";

class NavbarAdmin extends Component {
  state = {
    navbarData: null,
  };

  componentDidMount() {
    fetchNavbarData().then((data) => {
      // Limiting the data to first 5 items
      if(data){
      const limitedData = data.slice(0, 5);
      this.setState({ navbarData: limitedData });}
    });
  }

  handleTitleChange = (index, event) => {
    const { navbarData } = this.state;
    const newNavbarData = [...navbarData];
    newNavbarData[index].title = event.target.value;
    this.setState({ navbarData: newNavbarData });
  };

  handleDoubleClick = (index) => {
    const { navbarData } = this.state;
    const newNavbarData = [...navbarData];
    newNavbarData[index].editable = true;
    this.setState({ navbarData: newNavbarData });
  };

  handleSave = () => {
    const { navbarData } = this.state;
    const data = {
      table_names: ["navbar"],
      columns: ["title"],
      values: navbarData.map((item) => item.title),
    };
    updateNavbarData(data).then(() => {
      // After saving, set editable to false for all items
      const updatedNavbarData = navbarData.map((item) => ({ ...item, editable: false }));
      this.setState({ navbarData: updatedNavbarData });
    });
  };

  render() {
    const { navbarData } = this.state;

    if (!navbarData) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" >
            {navbarData[0].editable ? (
              <input
                type="text"
                value={navbarData[0].title}
                onChange={(event) => this.handleTitleChange(0, event)}
              />
            ) : (
              navbarData[0].title
            )}
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {navbarData.slice(1).map((item, index) => (
                <li key={index} className={`nav-item ${index === 0 ? 'active' : ''}`}>
                  {item.editable ? (
                    <input
                      type="text"
                      value={item.title}
                      onChange={(event) => this.handleTitleChange(index + 1, event)}
                    />
                  ) : (
                    <span
                      className="nav-link" // Added a class for styling
                      onDoubleClick={() => this.handleDoubleClick(index + 1)}
                    >
                      {item.title}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <button onClick={this.handleSave}>Save</button>
      </div>
    );
  }
}

export default NavbarAdmin;
