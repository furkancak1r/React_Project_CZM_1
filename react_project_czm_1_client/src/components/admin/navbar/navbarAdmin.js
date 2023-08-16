import React, { Component } from "react";
import {
  fetchNavbarData,
  updateNavbarData,
} from "../../../services/api-services/apiServices";
import "./navbarAdmin.css";
import { uploadFile } from "../../../services/uploadFile/uploadFile";
import {
  addGlobalEventListeners,
  removeGlobalEventListeners,
} from "../../../services/eventHandlers/eventHandlers.js";
import { fetchLatestFileVersions } from "../../../services/api-services/apiServices";
import "./sideBar.css";
import { takeFullScreenshot } from "../../../services/screenshot/screenshot";
import { dataURLtoFile } from "../../../services/dataURLtoFile/dataURLtoFile";
class NavbarAdmin extends Component {
  state = {
    navbarData: [],
    latestFileInfoForLogo: [],
    latestFilesInfosForScreenshots: [],
    showSidebar: false,
  };

  editableRef = null;
  inputRef = null;

  componentDidMount() {
    this.fetchAndSetNavbarData();
    this.fetchLatestFileInfo("logo");
    this.fetchLatestFileInfosForScreenshots();

    addGlobalEventListeners(this.handleClick, this.handleKeyDown);
    addGlobalEventListeners(this.handleOutsideClick);
  }

  componentWillUnmount() {
    removeGlobalEventListeners(this.handleClick, this.handleKeyDown);
    removeGlobalEventListeners(this.handleOutsideClick);
  }

  fetchAndSetNavbarData = () => {
    fetchNavbarData().then((data) => {
      if (data && data.length > 0) {
        this.setState({ navbarData: data });
      }
    });
  };

  fetchLatestFileInfo = (location) => {
    fetchLatestFileVersions(location, 1) // 1 is for to get the latest logo
      .then((fileInfo) => {
        this.setState({ latestFileInfoForLogo: fileInfo[0] });
      })
      .catch((error) => {
        console.error("Error fetching latest logo file version:", error);
      });
  };
  fetchLatestFileInfosForScreenshots = () => {
    fetchLatestFileVersions("screenshots", 4) // Fetch latest 4 screenshots
      .then((fileInfos) => {
        this.setState({ latestFilesInfosForScreenshots: fileInfos });
      })
      .catch((error) => {
        console.error("Error fetching latest screenshot file versions:", error);
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

  handleAddInput = () => {
    const { navbarData } = this.state;
    if (navbarData.length < 10) {
      const newNavbarData = [...navbarData];
      newNavbarData.push({ title: "", editable: true });
      this.setState({ navbarData: newNavbarData });
    }
  };

  handleDoubleClickText = (index) => {
    const { navbarData } = this.state;
    const newNavbarData = [...navbarData];
    newNavbarData[index].editable = true;
    this.setState({ navbarData: newNavbarData });
  };
  handleDoubleClicked = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", () =>
      this.handleFileUpload(fileInput)
    );
    fileInput.click();
  };

  handleFileUpload = async (fileInput) => {
    const file = fileInput.files[0];
    await uploadFile(file, "logo");
  };

  handleSave = async () => {
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

    const fileInput = document.getElementById("fileInput");
    console.log("fileInput:", fileInput);
    if (fileInput && fileInput.files.length > 0) {
      await this.handleFileUpload(fileInput.files[0]);
    }

    updateNavbarData(data).then(() => {
      this.fetchAndSetNavbarData();
      this.fetchLatestFileInfo("logo");
    });
    try {
      const screenshot = await takeFullScreenshot();

      const screenshotFile = dataURLtoFile(screenshot, "screenshot.png");
      await uploadFile(screenshotFile, "screenshots");
    } catch (error) {
      console.error("Ekran görüntüsü alınırken hata oluştu:", error);
    }
  };

  showBubble() {
    const bubble = document.getElementById("bubble");
    bubble.style.visibility = "visible";
  }

  hideBubble() {
    const bubble = document.getElementById("bubble");
    bubble.style.visibility = "hidden";
  }
  toggleSidebar = () => {
    this.setState((prevState) => ({
      showSidebar: !prevState.showSidebar,
    }));
  };
  handleOutsideClick = (event) => {
    if (
      this.state.showSidebar &&
      this.sidebarRef &&
      !this.sidebarRef.contains(event.target)
    ) {
      this.setState({ showSidebar: false });
    }
  };

  render() {
    const {
      navbarData,
      latestFileInfoForLogo,
      latestFilesInfosForScreenshots,
      showSidebar,
    } = this.state;
    console.log(
      "latestFilesInfosForScreenshots:",
      latestFilesInfosForScreenshots
    );
    console.log(
      "Type of latestFilesInfosForScreenshots:",
      typeof latestFilesInfosForScreenshots
    );
    console.log("latestFileInfoForLogo:", latestFileInfoForLogo);
    console.log("navbarData:", navbarData);
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div
          className="navbar-brand"
          onMouseEnter={this.showBubble}
          onMouseLeave={this.hideBubble}
          onDoubleClick={this.handleDoubleClicked}
        >
          {latestFileInfoForLogo && (
            <img
              src={`data:${latestFileInfoForLogo.fileExtention};base64,${latestFileInfoForLogo.fileBase64}`}
              alt="Logo"
            />
          )}
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
                    onChange={(event) => this.handleTitleChange(index, event)}
                    ref={(ref) => (this.inputRef = ref)}
                  />
                ) : (
                  <span
                    className="item-title"
                    onDoubleClick={() => this.handleDoubleClickText(index)}
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
          <i className="bi bi-save" onClick={this.handleSave}></i>
          <i className="bi bi-clock-history" onClick={this.toggleSidebar}></i>
        </div>

        <div
          className={`sidebar ${showSidebar ? "active" : ""}`}
          ref={(ref) => (this.sidebarRef = ref)}
        >
          <div className="sidebarHeader">Son Kaydedilenler</div>
          <div className="sidebarImageAll">
            {latestFilesInfosForScreenshots.map((fileInfo, index) => (
              <li key={index} className="img-container">
                <i className="bi bi-arrows-fullscreen"></i>
                <img
                  src={`data:${fileInfo.fileExtention};base64,${fileInfo.fileBase64}`}
                  alt={`Screenshot ${index + 1}`}
                />
              </li>
            ))}</div>
          </div>
      </nav>
    );
  }
}

export default NavbarAdmin;
