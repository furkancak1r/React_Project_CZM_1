import React, { Component } from "react";
import {
  fetchNavbarData,
  fetchColorData,
} from "../../../services/api-services/apiServices";
import "./navbarAdmin.css";
import {
  addGlobalEventListeners,
  removeGlobalEventListeners,
  bubbleAdd,
  bubbleRemove,
} from "../../../services/eventHandlers/eventHandlers.js";
import { fetchLatestFileVersions } from "../../../services/api-services/apiServices";
import "../../admin/sidebar/sidebar.css";
import { handleSaveAdminFn } from "../../../services/handleSaveAdmin/handleSaveAdmin";
import Sidebar from "../sidebar/sidebar";
import ColorPalette from "../colorPalette/colorPalette";
class NavbarAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarData: [],
      latestFileInfoForLogos: [],
      latestFilesInfosForScreenshots: [],
      showSidebar: false,
      uploadedLogoFile: null,
      uploadedLogoSrc: null,
      sidebarRef: null,
      changesPending: false,
      savedSuccessMessage: false,
      showColorPalette: false,
      background: {},
      navbarColorSelected: true,
      hoverColorSelected: false,
      backgroundColorForNavbar: {},
      colorForHover: {},
      allColors: {},
      selectedSavedVersion: null,
    };
    this.editableRef = null;
    this.inputRef = null;
    this.enlargedImageRef = null;
    this.testNavbarInfo = null;
    this.handleSave = this.handleSave.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.handleColorSelected = this.handleColorSelected.bind(this);
    this.selectedSavedVersionFn = this.selectedSavedVersionFn.bind(this);
  }

  componentDidMount() {
    this.fetchDataAndSetState();
    addGlobalEventListeners(this.handleClickText, this.handleKeyDown);
    addGlobalEventListeners(this.handleOutsideClick);
  }

  componentWillUnmount() {
    removeGlobalEventListeners(this.handleClickText, this.handleKeyDown);
    removeGlobalEventListeners(this.handleOutsideClick);
  }

  fetchLatestFileInfoAndSetState = async (location, count, stateKey) => {
    try {
      const fileInfo = await fetchLatestFileVersions(location, count);
      this.setState({ [stateKey]: fileInfo });
    } catch (error) {
      console.error(`${stateKey} güncellenirken hata oluştu:`, error);
    }
  };

  fetchAndSetNavbarData = async () => {
    const { backgroundColorForNavbar, colorForHover } = this.state;

    const [navbarData, colors] = await Promise.all([
      fetchNavbarData(),
      fetchColorData(),
    ]);

    if (navbarData.length > 0) {
      this.setState({ navbarData });
    } else {
      this.isNavbarDataServerEmpty = true;
    }

    colors.forEach((color) => {
      let properColor = JSON.parse(color.color);

      if (
        Object.keys(backgroundColorForNavbar).length === 0 &&
        color.location === "backgroundColorForNavbar"
      ) {
        this.setState({ backgroundColorForNavbar: properColor });
      }
      if (
        Object.keys(colorForHover).length === 0 &&
        color.location === "colorForHover"
      ) {
        this.setState({ colorForHover: properColor });
      }
    });
  };

  async fetchAndSetLatestFileInfo() {
    await Promise.all([
      this.fetchLatestFileInfoAndSetState("logo", 1, "latestFileInfoForLogos"),
      this.fetchLatestFileInfoAndSetState(
        "screenshots",
        4,
        "latestFilesInfosForScreenshots"
      ),
    ]);
  }
  async fetchDataAndSetState() {
    await Promise.all([
      this.fetchAndSetNavbarData(),
      this.fetchAndSetLatestFileInfo(),
    ]);
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
    const { showSidebar, showColorPalette } = this.state;
    if (
      showSidebar &&
      this.sidebarRef &&
      !this.sidebarRef.contains(event.target)
    ) {
      this.setState({ showSidebar: false });
    }
    const colorPalette = document.querySelector(".colorPalette");
    const isClickInsidePalette = colorPalette.contains(event.target);

    if (showColorPalette && !isClickInsidePalette) {
      this.setState({ showColorPalette: false });
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

    if (!this.isNavbarDataServerEmpty) {
      if (
        this.testNavbarInfo === null ||
        this.testNavbarInfo.length !== navbarData.length
      ) {
        this.testNavbarInfo = navbarData.map((item) => ({ ...item }));
      }

      const originalTitle = this.testNavbarInfo[index].title;
      newNavbarData[index].title = event.target.value;

      const isTextChanged = originalTitle !== newNavbarData[index].title;

      this.setState({
        navbarData: newNavbarData,
        changesPending: isTextChanged,
      });
    } else {
      newNavbarData[index].title = event.target.value;
      this.setState({
        navbarData: newNavbarData,
        changesPending: true,
      });
    }
  };

  handleAddInput = () => {
    const { navbarData } = this.state;
    if (navbarData.length < 10) {
      const newNavbarData = [...navbarData];
      newNavbarData.push({ title: "", editable: true });
      this.setState({ navbarData: newNavbarData, changesPending: true });
    }
  };
  handleDoubleClickText = (index) => {
    const { navbarData } = this.state;
    const newItem = { ...navbarData[index] };

    if (!newItem.editable) {
      const newNavbarData = [...navbarData];
      newNavbarData[index].editable = true;
      this.setState({ navbarData: newNavbarData });
    }
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
            changesPending: true,
          });
        };
        fileReader.readAsDataURL(selectedFile);
      }
    });
  };

  handleSave = async () => {
    const { navbarData, uploadedLogoFile, allColors } = this.state;
    try {
      this.setState({ changesPending: false });
      await handleSaveAdminFn(
        navbarData,
        uploadedLogoFile,
        this.fetchDataAndSetState.bind(this),
        allColors
      );
      this.setState({ savedSuccessMessage: true });
      setTimeout(() => {
        this.setState({ savedSuccessMessage: false });
      }, 3000);
    } catch (error) {
      console.error("Hata:", error);
      this.setState({ savedSuccessMessage: false });
    }
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({
      showSidebar: !prevState.showSidebar,
    }));
  };
  updateSidebarRef = (newRef) => {
    this.sidebarRef = newRef;
  };

  handlePaletteClick = () => {
    this.setState({ showColorPalette: true });
  };

  handleChangeComplete = (color) => {
    this.setState({ background: color.rgb });

    const {
      background,
      navbarColorSelected,
      hoverColorSelected,
      allColors,
    } = this.state;

    if (navbarColorSelected) {
      this.setState({
        backgroundColorForNavbar: background,
        allColors: {
          ...allColors,
          backgroundColorForNavbar: background,
        },
        changesPending: true,
      });
    } else if (hoverColorSelected) {
      this.setState({
        colorForHover: background,
        allColors: {
          ...allColors,
          colorForHover: background,
        },
        changesPending: true,
      });
    }
  };

  handleColorSelected = (selected) => {
    const { backgroundColorForNavbar, colorForHover } = this.state;
    if (selected === "navbar") {
      this.setState({
        navbarColorSelected: true,
        hoverColorSelected: false,
        background: backgroundColorForNavbar,
      });
    } else if (selected === "hover") {
      this.setState({
        navbarColorSelected: false,
        hoverColorSelected: true,
        background: colorForHover,
      });
    }
  };
  hoverAdd = (e) => {
    const { colorForHover } = this.state;
    if (colorForHover && !e.target.className.includes("inactive")) {
      e.target.style.color = `rgba(${colorForHover.r}, ${colorForHover.g}, ${colorForHover.b}, ${colorForHover.a})`;
    }
  };

  hoverRemove = (e) => {
    e.target.style.color = "";
  };
  selectedSavedVersionFn = (selectedSavedVersionParam) => {
    this.setState({ selectedSavedVersion: selectedSavedVersionParam });
    console.log("selectedSavedVersion:", selectedSavedVersionParam);
  };
  renderSaveInstruction() {
    const { changesPending, savedSuccessMessage } = this.state;
    const classNames = `save-instruction ${changesPending ? "info" : ""} ${
      savedSuccessMessage ? "success" : ""
    }`;

    return (
      <div className={classNames}>
        {changesPending && (
          <div>
            Değişiklikleri kaydetmek için lütfen kaydet butonuna tıklayın
          </div>
        )}
        {savedSuccessMessage && <div>Değişiklikler başarıyla kaydedildi</div>}
      </div>
    );
  }
  render() {
    const {
      navbarData,
      latestFileInfoForLogos,
      showSidebar,
      latestFilesInfosForScreenshots,
      uploadedLogoSrc,
      changesPending,
      showColorPalette,
      background,
      backgroundColorForNavbar,
      colorForHover,
    } = this.state;
    let imageSrc = "";
    let latestFileInfoForLogo = latestFileInfoForLogos[0];
    if (latestFileInfoForLogo && latestFileInfoForLogo.fileExtension) {
      imageSrc = `data:${latestFileInfoForLogo.fileExtension};base64,${latestFileInfoForLogo.fileBase64}`;
    }
    const navbarStyle = backgroundColorForNavbar && {
      backgroundColor: `rgba(${backgroundColorForNavbar.r}, ${backgroundColorForNavbar.g}, ${backgroundColorForNavbar.b}, ${backgroundColorForNavbar.a})`,
    };
    const addIconStyle = backgroundColorForNavbar && {
      background: `rgba(${backgroundColorForNavbar.r + 30}, ${
        backgroundColorForNavbar.g
      }, ${backgroundColorForNavbar.b}, ${backgroundColorForNavbar.a})`,
    };

    return (
      <div>
        {this.renderSaveInstruction()}

        <nav
          className="navbar navbar-expand-lg navbar-light "
          style={navbarStyle}
        >
          <div
            className="navbar-brand"
            onMouseEnter={bubbleAdd}
            onMouseLeave={bubbleRemove}
            onDoubleClick={this.handleDoubleClicked}
          >
            {uploadedLogoSrc ? (
              <img src={uploadedLogoSrc} alt="Logo" />
            ) : latestFileInfoForLogo ? (
              <img src={imageSrc} alt="Logo" />
            ) : (
              <span
                className="add-icon"
                onClick={this.handleDoubleClicked}
                onMouseEnter={this.hoverAdd}
                onMouseLeave={this.hoverRemove}
              >
                +
              </span>
            )}

            <div id="bubble" className="bubble">
              Max Genişlik: "110px", Max Yükseklik: "80px"
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
                      name="text"
                      value={item.title}
                      onChange={(event) => this.handleTitleChange(index, event)}
                      ref={(ref) => (this.inputRef = ref)}
                    />
                  ) : (
                    <span
                      className="item-title"
                      onDoubleClick={() => this.handleDoubleClickText(index)}
                      onMouseEnter={this.hoverAdd}
                      onMouseLeave={this.hoverRemove}
                    >
                      {item.title}
                    </span>
                  )}
                  {index === navbarData.length - 1 && (
                    <span
                      className="add-icon"
                      onClick={this.handleAddInput}
                      style={addIconStyle}
                      onMouseEnter={this.hoverAdd}
                      onMouseLeave={this.hoverRemove}
                    >
                      +
                    </span>
                  )}
                </div>
              ))}
              {navbarData.length === 0 && (
                <span
                  className="add-icon"
                  onClick={this.handleAddInput}
                  style={addIconStyle}
                  onMouseEnter={this.hoverAdd}
                  onMouseLeave={this.hoverRemove}
                >
                  +
                </span>
              )}
            </div>
          </div>
          <div className="icons">
            <i
              className="bi bi-palette"
              onClick={this.handlePaletteClick}
              onMouseEnter={this.hoverAdd}
              onMouseLeave={this.hoverRemove}
            ></i>
            <i
              className={`bi bi-save ${changesPending ? "" : "inactive"}`}
              onClick={changesPending ? this.handleSave : null}
              onMouseEnter={this.hoverAdd}
              onMouseLeave={this.hoverRemove}
            ></i>
            <i
              className="bi bi-clock-history"
              onClick={this.toggleSidebar}
              onMouseEnter={this.hoverAdd}
              onMouseLeave={this.hoverRemove}
            ></i>
          </div>
          <Sidebar
            showSidebar={showSidebar}
            latestFilesInfosForScreenshots={latestFilesInfosForScreenshots}
            updateSidebarRef={this.updateSidebarRef}
            selectedSavedVersionFn={this.selectedSavedVersionFn}
          />{" "}
          <div className="colorPalette">
            {showColorPalette && (
              <ColorPalette
                background={background}
                handleChangeComplete={this.handleChangeComplete}
                handleColorSelected={this.handleColorSelected}
                colorForHover={colorForHover}
                navbarStyle={navbarStyle}
              />
            )}
          </div>
        </nav>
      </div>
    );
  }
}

export default NavbarAdmin;
