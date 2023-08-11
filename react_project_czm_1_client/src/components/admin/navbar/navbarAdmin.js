import React, { Component } from "react";
import { fetchNavbarData, updateNavbarData } from "../../../services/api-services/apiServices";
import { Link } from "react-router-dom";

class NavbarAdmin extends Component {
  state = {
    navbarData: [],
  };

  editableRef = null;
  inputRef = null;

  componentDidMount() {
    this.fetchAndSetNavbarData();

    document.addEventListener("mousedown", this.handleClick);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick);
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  fetchAndSetNavbarData = () => {
    fetchNavbarData().then((data) => {
      if (data && data.length > 0) {
        this.setState({ navbarData: data });
      }
    });
  };

  handleClick = (event) => {
    if (
      this.editableRef &&
      !this.editableRef.contains(event.target) &&
      this.inputRef &&
      !this.inputRef.contains(event.target)
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

  handleAddInput = () => {
    const { navbarData } = this.state;
    if (navbarData.length < 10) {
      const newNavbarData = [...navbarData];
      newNavbarData.push({ title: "", editable: true });
      this.setState({ navbarData: newNavbarData });
    }
  };

  handleSave = () => {
    const { navbarData } = this.state;

    const filteredData = navbarData.filter((item) => item.title.trim() !== "");

    if (filteredData.length === 0) {
      return;
    }

    const data = {
      table_names: ["navbar"],
      columns: ["title"],
      values: filteredData.map((item) => item.title),
    };

    updateNavbarData(data).then(() => {
      // Yeniden yükleme işlemi
      window.location.reload();
    });
  };

  handleInputClick = (event) => {
    event.stopPropagation();
  };

  render() {
    const { navbarData } = this.state;
    const showPadding = navbarData.length <= 6 ? "20%" : "10%";

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/" style={{ paddingLeft: "10%" }}>
          <img src="/czmLogo.png" alt="Logo" />
        </Link>
        <div className="container" style={{ float: "left" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              justifyItems: "start",
              alignItems: "center",
              textAlign: "left",
              paddingLeft: showPadding,
            }}
          >
            {navbarData.map((item, index) => (
              <div
                key={index}
                ref={(ref) => (this.editableRef = ref)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
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
                {index === navbarData.length - 1 && (
                  <span
                    className="add-icon"
                    onClick={this.handleAddInput}
                    style={{
                      cursor: "pointer",
                      marginLeft: "5px",
                      display: "inline-block",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      textAlign: "center",
                      lineHeight: "24px",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    +
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
