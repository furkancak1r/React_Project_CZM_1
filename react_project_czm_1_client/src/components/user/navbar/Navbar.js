import React, { Component } from "react";
import { fetchNavbarData ,translateService } from "../../../services/api-services/apiServices";
import { Link } from "react-router-dom";
import languageOptions from "../../../services/translator/languageOptions"
class Navbar extends Component {
  state = {
    navbarData: null,
    selectedLanguage: "tr", // Varsayılan olarak Türkçe seçili
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

  fetchAndSetNavbarData = () => {
    fetchNavbarData().then((data) => {
      this.setState({ navbarData: data });
    });
  };

  translateText = async (text, targetLanguage) => {
    try {
      const data = await translateService(text, targetLanguage);
      return data
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
    const showPadding = navbarData && navbarData.length <= 6 ? "20%" : "10%";
    
    if (!navbarData || translatedTitles.length !== navbarData.length) {
      return <div>Loading...</div>;
    }


    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/" style={{ paddingLeft: "10%" }}>
          <img src="czmLogo.png" alt="Logo" />
        </Link>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "left",
              padding: `10px ${showPadding}`,
            }}
          >
            {navbarData.map((item, index) => (
              <Link
                key={index}
                className="nav-link"
                to="/"
                style={{
                  margin: "0 20px",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                {translatedTitles[index]}
              </Link>
            ))}
          </div>
          <div style={{ marginRight: "20px" }}>
            <select
              className="form-select"
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
