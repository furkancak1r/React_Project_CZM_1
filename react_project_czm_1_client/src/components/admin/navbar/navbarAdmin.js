import React, { Component } from "react";
import {
  fetchNavbarData,
  updateNavbarData,
  } from "../../../services/api-services/apiServices";
import "./navbarAdmin.css";
import { uploadFile } from "../../../services/uploadFile/uploadFile";

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
      this.fetchAndSetNavbarData();
    });
  };

  handleInputClick = (event) => {
    event.stopPropagation();
  };

  showBubble() {
    const bubble = document.getElementById("bubble");
    bubble.style.visibility = "visible";
  }

  hideBubble() {
    const bubble = document.getElementById("bubble");
    bubble.style.visibility = "hidden";
  }
   handleLogoDoubleClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; 
    fileInput.addEventListener("change", this.handleFileUpload);
    fileInput.click();
  };

   handleFileUpload = async (e) => {
    uploadFile(e);
    this.fetchAndSetNavbarData();
  };
  render() {
    const { navbarData } = this.state;

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div
          className="navbar-brand"
          onMouseEnter={this.showBubble}
          onMouseLeave={this.hideBubble}
          onDoubleClick={this.handleLogoDoubleClick}
        >
          <img src="/czmLogo.png" alt="Logo" />
          <div id="bubble" className="bubble">
            Max Genişlik: "110px", Max Yükseklik: "80px",
          </div>
        </div>

        <div className="container">
          <div
            className={`belowContainer ${
              navbarData.length <= 6 ? "showPadding wide" : "showPadding"
            }`}
          >
            {navbarData.map((item, index) => (
              <div
                className="navbarDataMap"
                key={index}
                ref={(ref) => (this.editableRef = ref)}
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
                    className="item-title"
                    onDoubleClick={() => this.handleDoubleClick(index)}
                  >
                    {item.title}
                  </span>
                )}
                {index === navbarData.length - 1 && (
                  <span className="add-icon" onClick={this.handleAddInput}>
                    +
                  </span>
                )}
              </div>
            ))}
            {navbarData.length === 0 && (
              <span className="add-icon" onClick={this.handleAddInput}>
                +
              </span>
            )}
          </div>
        </div>
        <div className="classHandleSave">
          <button onClick={this.handleSave} className="btn btn-primary">
            Save
          </button>
        </div>
      </nav>
    );
  }
}

export default NavbarAdmin;
