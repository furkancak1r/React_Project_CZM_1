import React, { Component } from "react";
import { fetchNavbarData } from "../../../services/api-services/apiServices";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import config from "../../../config";
class Navbar extends Component {
  state = {
    navbarData: null,
    selectedLanguage: "en",
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
    const key = config.key;
    const endpoint = config.endpoint;
    const location = config.location;

    const apiUrl = `${endpoint}/translate?api-version=3.0&from=en&to=${targetLanguage}`;
    const requestData = [
      {
        text: text,
      },
    ];

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": location,
          "Content-type": "application/json",
          "X-ClientTraceId": uuidv4().toString(),
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      return data[0].translations[0].text;
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
              padding: `10px ${showPadding}`, // Add padding on top and bottom
            }}
          >
            <div style={{ flex: 1 }}>
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
            <div>
              <select
                value={selectedLanguage}
                onChange={this.handleLanguageChange}
                style={{ marginRight: "10px" }} // Add margin to the right
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
                <option value="ar">Arabic</option>
                <option value="he">Hebrew</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
