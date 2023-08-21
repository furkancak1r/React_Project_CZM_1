import React, { Component } from "react";
import { fetchNavbarData } from "../../../services/api-services/apiServices";
import "./navbarAdmin.css";
import {
  addGlobalEventListeners,
  removeGlobalEventListeners,
} from "../../../services/eventHandlers/eventHandlers.js";
import { fetchLatestFileVersions } from "../../../services/api-services/apiServices";
import "../../admin/sidebar/sidebar.css";
import { handleSaveAdminFn } from "../../../services/handleSaveAdmin/handleSaveAdmin";
import Sidebar from "../sidebar/sidebar";
class NavbarAdmin extends Component {
  state = {
    navbarData: [],
    latestFileInfoForLogos: [],
    latestFilesInfosForScreenshots: [],
    showSidebar: false,
    enlargedImageVisible: false,
    uploadedLogoFile: null,
    uploadedLogoSrc: null,
    sidebarRef: null,

  };
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.sidebarRef = null;

  }

  editableRef = null;
  inputRef = null;
  enlargedImageRef = null;

  componentDidMount() {
    this.fetchDataAndSetState();

    addGlobalEventListeners(this.handleClickText, this.handleKeyDown);
    addGlobalEventListeners(this.handleOutsideClick);
  }

  componentWillUnmount() {
    removeGlobalEventListeners(this.handleClickText, this.handleKeyDown);
    removeGlobalEventListeners(this.handleOutsideClick);
  }

  async fetchLatestFileInfoAndSetState(location, count, stateKey) {
    try {
      const fileInfo = await fetchLatestFileVersions(location, count);
      this.setState({ [stateKey]: fileInfo }, () => { });
    } catch (error) {
      console.error(`${stateKey} güncellenirken hata oluştu:`, error);
    }
  }

  fetchAndSetNavbarData = async () => {
    await fetchNavbarData().then((data) => {
      if (data && data.length > 0) {
        this.setState({ navbarData: data });
      }
    });
  };

  async fetchAndSetLatestFileInfo() {
    await this.fetchLatestFileInfoAndSetState(
      "logo",
      1,
      "latestFileInfoForLogos"
    );
    await this.fetchLatestFileInfoAndSetState(
      "screenshots",
      4,
      "latestFilesInfosForScreenshots"
    );
  }
  async fetchDataAndSetState() {
    await this.fetchAndSetNavbarData();
    await this.fetchAndSetLatestFileInfo();
  }

  handleClickText = (event) => {
    if (
      this.editableRef &&
      !this.editableRef.contains(event.target) &&
      this.inputRef &&
      !this.inputRef.contains(event.target)
    ) {
      this.closeEditable();
    }
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

  handleScreenshotClick = () => {
    this.setState((prevState) => ({
      enlargedImageVisible: !prevState.enlargedImageVisible,
    }));
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
    fileInput.click();
    fileInput.addEventListener("change", () => {
      const selectedFile = fileInput.files[0];
      if (selectedFile) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const uploadedLogoSrc = fileReader.result;
          this.setState({
            uploadedLogoFile: selectedFile,
            uploadedLogoSrc: uploadedLogoSrc,
          });
        };
        fileReader.readAsDataURL(selectedFile);
      }
    });
  };

  handleSave = async () => {
    const { navbarData, uploadedLogoFile } = this.state;
    await handleSaveAdminFn(
      navbarData,
      uploadedLogoFile,
      this.fetchDataAndSetState.bind(this)
    );
  };

  toggleBubble() {
    const bubble = document.getElementById("bubble");
    const currentVisibility = bubble.style.visibility;

    bubble.style.visibility =
      currentVisibility === "visible" ? "hidden" : "visible";
  }

  toggleSidebar = () => {
    this.setState((prevState) => ({
      showSidebar: !prevState.showSidebar,
    }));
  };
  updateSidebarRef = (newRef) => {
    this.sidebarRef = newRef;
  };

  render() {
    const {
      navbarData,
      latestFileInfoForLogos,
      showSidebar,
      latestFilesInfosForScreenshots,
      enlargedImageVisible,
      uploadedLogoSrc

    } = this.state;
    let imageSrc = "";
    let latestFileInfoForLogo = latestFileInfoForLogos[0];

    if (latestFileInfoForLogo && latestFileInfoForLogo.fileExtention) {
      imageSrc = `data:${latestFileInfoForLogo.fileExtention};base64,${latestFileInfoForLogo.fileBase64}`;
    }
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div
          className="navbar-brand"
          onMouseEnter={this.toggleBubble}
          onMouseLeave={this.toggleBubble}
          onDoubleClick={this.handleDoubleClicked}
        >
          {uploadedLogoSrc ? (
            <img src={uploadedLogoSrc} alt="Logo" />
          ) : latestFileInfoForLogos ? (
            <img src={imageSrc} alt="Logo" />
          ) : (
            <span className="add-icon" onClick={this.handleDoubleClicked}>
              +
            </span>
          )}

          <div id="bubble" className="bubble">
            Max Genişlik: "110px", Max Yükseklik: "80px",
          </div>
        </div>
        <div className="container">
          <div
            className={`belowContainer ${navbarData.length <= 6 ? "showPadding wide" : "showPadding"
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
                    name="text"
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

        <Sidebar
          showSidebar={showSidebar}
          latestFilesInfosForScreenshots={latestFilesInfosForScreenshots}
          enlargedImageVisible={enlargedImageVisible}
          handleScreenshotClick={this.handleScreenshotClick}
          updateSidebarRef={this.updateSidebarRef}
        />


      </nav>
    );
  }
}

export default NavbarAdmin;
