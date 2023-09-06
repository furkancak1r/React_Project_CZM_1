import React, { Component } from "react";
import {
  fetchNavbarData,
  fetchColorData,
} from "../../../services/api-services/apiServices";
import "./navbarAdmin.css";
import {
  addGlobalEventListeners,
  removeGlobalEventListeners,
  toggleVisibility,
  hoverAddFn,
  hoverRemoveFn,
  imageSrcFn,
} from "../../../services/eventHandlers/eventHandlers.js";
import {
  processColors,
  navbarStyleFn,
  addIconStyleFn,
} from "../../../services/colorsProcessing/colorsProcessing";
import { fetchLatestFileVersions } from "../../../services/api-services/apiServices";
import "../../admin/sidebar/sidebar.css";
import { handleSaveAdminFn } from "../../../services/handleSaveAdmin/handleSaveAdmin";
import Sidebar from "../sidebar/sidebar";
import ColorPalette from "../colorPalette/colorPalette";
import fetchSavedVersionData from "../../../services/fetchSavedVersionData/fetchSavedVersionData";
import { handleDoubleClickedFn } from "../../../services/imageSelect/imageSelect";

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
      addIconStyle: null,
      navbarStyle: null,
      imageSrc: null,
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
   this.defaultBubbleFn();
  }

  componentWillUnmount() {
    removeGlobalEventListeners(this.handleClickText, this.handleKeyDown);
    removeGlobalEventListeners(this.handleOutsideClick);
  }
  fetchLatestFileInfoAndSetState = async (location, count, stateKey) => {
    try {
      const fileInfo = await fetchLatestFileVersions(location, count);
      this.setState({ [stateKey]: fileInfo });

      if (count === 1) {
        const data = imageSrcFn(fileInfo);
        this.setState({ imageSrc: data });
      }
    } catch (error) {
      console.error(`Hata oluştu while ${stateKey} güncellenirken:`, error);
    }
  };

  fetchAndSetNavbarData = async () => {
    const { allColors, backgroundColorForNavbar, colorForHover } = this.state;
    const [navbarData, colors] = await Promise.all([
      fetchNavbarData(),
      fetchColorData(),
    ]);

    if (navbarData.length > 0) {
      this.setState({ navbarData });
    } else {
      this.isNavbarDataServerEmpty = true;
    }


    processColors(colors, backgroundColorForNavbar, colorForHover).then(
      async (result) => {
        this.setState({
          colorsProcessed: true,
          allColors: {
            ...allColors,
            backgroundColorForNavbar: result.defaultBackgroundColorin,
            colorForHover: result.defaultHoverColorin,
          },
          backgroundColorForNavbar: result.defaultBackgroundColorin,
          colorForHover: result.defaultHoverColorin,
        });
        await this.setStyleFn(result.defaultBackgroundColorin);
      }
    );
  };
  
  setStyleFn = async (bgColor) => {
    try {
      const navbarStyle = await navbarStyleFn(bgColor);
      this.setState({ navbarStyle });

      const addIconStyle = await addIconStyleFn(bgColor);
      this.setState({ addIconStyle });
    } catch (error) {
      console.error("Stil güncellenirken hata oluştu:", error);
    }
  };

  defaultBubbleFn =  () => {
    try {
       toggleVisibility("bubbleNavbar", false);
    } catch (error) {
      console.error(error);
    }
  };
  
  async fetchAndSetLatestFileInfo() {
    try {
      await Promise.all([
        this.fetchLatestFileInfoAndSetState(
          "logo",
          1,
          "latestFileInfoForLogos"
        ),
        this.fetchLatestFileInfoAndSetState(
          "screenshots",
          4,
          "latestFilesInfosForScreenshots"
        ),
      ]);
    } catch (error) {
      console.error("Error fetching and setting latest file info:", error);
    }
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
    handleDoubleClickedFn()
      .then((result) => {
        this.setState({
          uploadedLogoFile: result.uploadedLogoFile,
          uploadedLogoSrc: result.uploadedLogoSrc,
          changesPending: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleSave = async () => {
    const {
      navbarData,
      uploadedLogoFile,
      allColors,
      latestFileInfoForLogos,
    } = this.state;

    try {
      this.setState({ changesPending: false });
      this.setState({ backgroundColorForNavbar: {}, colorForHover: {} });
      await handleSaveAdminFn(
        navbarData,
        uploadedLogoFile,
        this.fetchDataAndSetState.bind(this),
        allColors,
        latestFileInfoForLogos[0]
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

  handleChangeComplete = async (color) => {
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
      await this.setStyleFn(background);
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
  //kaydet sonrası bg color güncellenmiyor
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
    hoverAddFn(e, colorForHover);
  };

  hoverRemove = (e) => {
    hoverRemoveFn(e);
  };

  selectedSavedVersionFn = async (selectedSavedVersionParam) => {
    try {
      let result = await fetchSavedVersionData(selectedSavedVersionParam);

      let backgroundColors = result.fetchedColorsDataBySavedVersion.filter(
        (item) => item.location === "backgroundColorForNavbar"
      );
      let colorsForHover = result.fetchedColorsDataBySavedVersion.filter(
        (item) => item.location === "colorForHover"
      );

      let backgroundColorProperColor;
      let colorForHoverProperColor;
      try {
        if (backgroundColors[0] && backgroundColors[0].color) {
          backgroundColorProperColor = JSON.parse(backgroundColors[0].color);
        }
        if (colorsForHover[0] && colorsForHover[0].color) {
          colorForHoverProperColor = JSON.parse(colorsForHover[0].color);
        }
      } catch (error) {
        console.error("Geçersiz JSON verisi:", error);
      }

      let files = result.fetchedFilesDataBySavedVersion.filter(
        (file) => file.location === "logo"
      );

      this.setState({
        navbarData: result.fetchedNavbarDataBySavedVersion,
        latestFileInfoForLogos: files,
        backgroundColorForNavbar: backgroundColorProperColor,
        colorForHover: colorForHoverProperColor,
        changesPending: true,
      });
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
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
      colorForHover,
      addIconStyle,
      navbarStyle,
      imageSrc,
    } = this.state;

    return (
      <div>
        {this.renderSaveInstruction()}

        <nav className="navbar navbar-expand-lg " style={navbarStyle}>
          <div
            className="navbar-brand"
            onMouseEnter={() => toggleVisibility("bubbleNavbar", true)}
            onMouseLeave={() => toggleVisibility("bubbleNavbar", false)}
            onDoubleClick={this.handleDoubleClicked}
          >
            {uploadedLogoSrc ? (
              <img src={uploadedLogoSrc} alt="Logo" />
            ) : latestFileInfoForLogos[0] ? (
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
            <div id="bubbleNavbar" className="bubbleNavbar">
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
