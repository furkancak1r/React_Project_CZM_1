import React, { Component } from "react";
import {
  fetchNavbarData,
  translateService,
  fetchColorData,

} from "../../../services/api-services/apiServices";
import { Link } from "react-router-dom";
import languageOptions from "../../../services/translator/languageOptions";
import "./navbar.css";
class Navbar extends Component {
  state = {
    navbarData: null,
    selectedLanguage: "tr",
    translatedTitles: [],
  };

  componentDidMount() {
    this.fetchAndSetNavbarData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.navbarData !== this.state.navbarData ||
      prevState.selectedLanguage !== this.state.selectedLanguage
    ) {
      this.translateNavbarTitles();
    }
  }

  fetchAndSetNavbarData = async() => {
    const [navbarData, colors] = await Promise.all([
      fetchNavbarData(),
      fetchColorData(),
    ]);
    if (navbarData.length > 0) {
      this.setState({ navbarData });
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

  render() {
    const { navbarData, selectedLanguage, translatedTitles } = this.state;

    if (!navbarData || translatedTitles.length !== navbarData.length) {
      return <div>Loading...</div>;
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          <img src="czmLogo.png" alt="Logo" />
        </Link>
        <div className="container">
          <div
            className={`belowContainer ${
              navbarData.length <= 6 ? "showPadding wide" : "showPadding"
            }`}
          >
            {navbarData.map((item, index) => (
              <Link key={index} className="nav-link" to="/">
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
