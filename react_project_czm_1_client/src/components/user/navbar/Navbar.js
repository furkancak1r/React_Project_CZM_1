import React, { Component } from "react";
import {
  fetchNavbarData,
  translateService,
  fetchColorData,
} from "../../../services/api-services/apiServices";
import { Link } from "react-router-dom";
import languageOptions from "../../../services/translator/languageOptions";
import "./navbar.css";
import {
  addIconStyleFn,
  navbarStyleFn,
} from "../../../services/colorsProcessing/colorsProcessing";
import { processColors } from "../../../services/colorsProcessing/colorsProcessing";
import {
  hoverAddFn,
  hoverRemoveFn,
  imageSrcFn
} from "../../../services/eventHandlers/eventHandlers";
import { fetchLatestFileVersions } from "../../../services/api-services/apiServices";
class Navbar extends Component {
  state = {
    navbarData: null,
    selectedLanguage: "tr",
    translatedTitles: [],
    backgroundColorForNavbar: {},
    colorForHover: {},
    addIconStyle: null,
    navbarStyle: null,
  };

  componentDidMount() {
    this.fetchAndSetNavbarData();
  }

  componentDidUpdate(prevState) {
    if (
      prevState.navbarData !== this.state.navbarData ||
      prevState.selectedLanguage !== this.state.selectedLanguage
    ) {
      this.translateNavbarTitles();
    }
  }

  async fetchAndSetNavbarData() {
    const { backgroundColorForNavbar, colorForHover } = this.state;

    try {
      const [navbarData, colors, logoData] = await Promise.all([
        fetchNavbarData(),
        fetchColorData(),
        fetchLatestFileVersions("logo", 1),

      ]);

      if (navbarData.length > 0) {
        this.setState({ navbarData });
      }

      const result = await processColors(
        colors,
        backgroundColorForNavbar,
        colorForHover
      );
      this.setState({
        backgroundColorForNavbar: result.defaultBackgroundColorin,
        colorForHover: result.defaultHoverColorin,
      });

      const addIconStyle = await addIconStyleFn(
        result.defaultBackgroundColorin
      );
      const navbarStyle = await navbarStyleFn(result.defaultBackgroundColorin);

      this.setState({ addIconStyle, navbarStyle });

      if (logoData) {
        const data = imageSrcFn(logoData);
        this.setState({ imageSrc: data });
      }
    } catch (error) {
      console.error("Error fetching and setting data:", error);
    }
  }
  fetchLatestFileInfoAndSetState = async (location, count, stateKey) => {
    try {
      const fileInfo = await fetchLatestFileVersions(location, count);
      this.setState({ [stateKey]: fileInfo });
    } catch (error) {
      console.error(`${stateKey} güncellenirken hata oluştu:`, error);
    }
  };

  translateText = async (text, targetLanguage) => {
    try {
      const data = await translateService(text, targetLanguage);
      return data;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  translateNavbarTitles = async () => {
    const { navbarData, selectedLanguage } = this.state;
    const translatedTitles = await Promise.all(
      navbarData.map(async (item) => {
        const translatedTitle = await this.translateText(
          item.title,
          selectedLanguage
        );
        return translatedTitle;
      })
    );
    this.setState({ translatedTitles });
  };

  handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    this.setState({ selectedLanguage });
  };

  hoverAdd = (e) => {
    const { colorForHover } = this.state;
    hoverAddFn(e, colorForHover);
  };

  hoverRemove = (e) => {
    hoverRemoveFn(e);
  };

  render() {
    const {
      navbarData,
      selectedLanguage,
      translatedTitles,
      navbarStyle,
      imageSrc,
    } = this.state;

    if (!navbarData || translatedTitles.length !== navbarData.length) {
      return <div>Loading...</div>;
    }

    return (
      <nav className="navbar navbar-expand-lg" style={navbarStyle}>
        {" "}
        <Link className="navbar-brand" to="/">
          {imageSrc ? (
            <img src={imageSrc} alt="Logo" />
          ) : (
            <p>Resim bulunamadı.</p>
          )}
        </Link>
        <div className="container">
          <div
            className={`belowContainer ${
              navbarData.length <= 6 ? "showPadding wide" : "showPadding"
            }`}
          >
            {navbarData.map((item, index) => (
              <Link
                key={index}
                className="nav-link"
                to="/"
                onMouseEnter={this.hoverAdd}
                onMouseLeave={this.hoverRemove}
              >
                {translatedTitles[index]}
              </Link>
            ))}
          </div>
          <div className="language-select">
            <select
              className="form-select"
              name="language"
              value={selectedLanguage}
              onChange={this.handleLanguageChange}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
