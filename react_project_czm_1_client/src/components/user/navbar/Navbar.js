import React, { Component } from "react";
import {
  fetchNavbarData,
  translateService,
  fetchColorData,
  fetchLatestFileVersions,
} from "../../../services/api-services/apiServices";
import { Link } from "react-router-dom";
import languageOptions from "../../../services/translator/languageOptions";
import "./navbar.css";
import {
  addIconStyleFn,
  navbarStyleFn,
} from "../../../services/colorsProcessing/colorsProcessing";
import {
  hoverAddFn,
  hoverRemoveFn,
  imageSrcFn,
} from "../../../services/eventHandlers/eventHandlers";
import { processColors } from "../../../services/colorsProcessing/colorsProcessing";


class Navbar extends Component {
  state = {
    navbarData: null,
    selectedLanguage: "tr",
    translatedTitles: [],
    backgroundColorForNavbar: {},
    colorForHover: {},
    addIconStyle: null,
    navbarStyle: null,
    imageSrc: null,
  };

  async componentDidMount() {
    await this.fetchAndSetNavbarData();
    if (this.state.navbarData && this.state.navbarData.length > 0) {
      await this.translateNavbarTitles();
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

    if (!navbarData || navbarData.length === 0) {
      console.error("Navbar data is empty or undefined.");
      return;
    }
    console.log("selectedLanguageüst:",selectedLanguage);

    const translatedTitles = await Promise.all(
      navbarData.map(async (item) => {
        const translatedTitle = await this.translateText(
          item.title,
          selectedLanguage
        );
        console.log("translatedTitle:",translatedTitle);
        console.log("selectedLanguage:",selectedLanguage);

        return translatedTitle;
      })
    );

    this.setState({ translatedTitles });
  };

  handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    console.log("handleLanguageChange selectedLanguage: ",selectedLanguage);
    this.setState({ selectedLanguage });
    // hemen set ediyor translateNavbarTitles()'a set edilmeyen default tr değeri gidiyor bu yüzden güncellenmiyor fonksiyon
    await this.translateNavbarTitles();
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
            className={`belowContainer ${navbarData.length <= 6 ? "showPadding wide" : "showPadding"
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
              onChange={(e)=>{this.handleLanguageChange(e)}}
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
