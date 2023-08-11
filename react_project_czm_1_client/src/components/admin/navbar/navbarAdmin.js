import React, { Component } from "react";
import {
  fetchNavbarData,
  updateNavbarData,
} from "../../../services/api-services/apiServices";
import { Link } from "react-router-dom";

class NavbarAdmin extends Component {
  state = {
    navbarData: null,
  };

  editableRef = null;
  inputRef = null;

  componentDidMount() {
    fetchNavbarData().then((data) => {
      if (data) {
        const limitedData = data.slice(0, 5).map((item) => ({ ...item, editable: false }));
        this.setState({ navbarData: limitedData });
      }
    });

    document.addEventListener("mousedown", this.handleClick);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick);
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleClick = (event) => {
    if (
      this.editableRef && !this.editableRef.contains(event.target) &&
      this.inputRef && !this.inputRef.contains(event.target)
    ) {
      this.closeEditable();
    }
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") {
      this.closeEditable();
    }
  };

  closeEditable = () => {
    const { navbarData } = this.state;
    const updatedNavbarData = navbarData.map((item) => ({
      ...item,
      editable: false,
    }));
    this.setState({ navbarData: updatedNavbarData });
  };

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
      // No need to reset editable state here, as it's controlled by user actions
    });
  };

  handleInputClick = (event) => {
    event.stopPropagation();
  };

  render() {
    const { navbarData } = this.state;

    if (!navbarData) {
      return <div>Loading...</div>;
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/" style={{ paddingLeft: "10%" }}>
          <img src="/czmLogo.png" alt="Logo" />
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
            {navbarData.map((item, index) => (
              <div
                key={index}
                ref={(ref) => (this.editableRef = ref)}
                style={{ position: "relative" }}
              >
                {item.editable ? (
                  <input
                    type="text"
                    value={item.title}
                    onClick={this.handleInputClick}
                    onChange={(event) => this.handleTitleChange(index, event)}
                    ref={(ref) => (this.inputRef = ref)}
                  />
                ) : (
                  <span
                    onDoubleClick={() => this.handleDoubleClick(index)}
                    style={{
                      margin: "0 20px",
                      fontWeight: "600",
                      fontSize: "18px",
                    }}
                  >
                    {item.title}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: "auto", paddingRight: "30px" }}>
          <button onClick={this.handleSave} className="btn btn-primary">
            Kaydet
          </button>
        </div>
      </nav>
    );
  }
}

export default NavbarAdmin;
