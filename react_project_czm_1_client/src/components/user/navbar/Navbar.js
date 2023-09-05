import React, { useState, useEffect } from "react";
import {
  fetchNavbarData,
  translateService,
  fetchColorData,
  fetchLatestFileVersions,
} from "../../../services/api-services/apiServices";
import {
  hoverAddFn,
  hoverRemoveFn,
  imageSrcFn,
} from "../../../services/eventHandlers/eventHandlers";
import { processColors } from "../../../services/colorsProcessing/colorsProcessing";
import { Link } from "react-router-dom";
import languageOptions from "../../../services/translator/languageOptions";
import { navbarStyleFn } from "../../../services/colorsProcessing/colorsProcessing";
import "./navbar.css";

function Navbar() {
  const [navbarData, setNavbarData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedTitles, setTranslatedTitles] = useState([]);
  const [backgroundColorForNavbar, setBackgroundColorForNavbar] = useState({});
  const [colorForHover, setColorForHover] = useState({});
  const [navbarStyle, setNavbarStyle] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await fetchAndSetNavbarData();
      setSelectedLanguage("tr"); // "tr" is no set for initial value because translateNavbarTitles is triggered with the change of selected language value. So initially it will be none and then it will be set to tr and translateNavbarTitles will be triggered.
    }
    fetchData();
  }, []);

  async function fetchAndSetNavbarData() {
    try {
      const [navbarData, colors, logoData] = await Promise.all([
        fetchNavbarData(),
        fetchColorData(),
        fetchLatestFileVersions("logo", 1),
      ]);

      if (navbarData && navbarData.length > 0) {
        setNavbarData(navbarData);
      }
      const result = await processColors(
        colors,
        backgroundColorForNavbar,
        colorForHover
      );
      setBackgroundColorForNavbar(result.defaultBackgroundColorin);
      setColorForHover(result.defaultHoverColorin);
      const navbarStyle = await navbarStyleFn(result.defaultBackgroundColorin);
      setNavbarStyle(navbarStyle);
      if (logoData) {
        const data = imageSrcFn(logoData);
        setImageSrc(data);
      }
    } catch (error) {
      console.error("Error fetching and setting data:", error);
    }
  }

  async function translateText(text, targetLanguage) {
    try {
      const data = await translateService(text, targetLanguage);
      return data;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }

  async function translateNavbarTitles() {
    if (!navbarData || navbarData.length === 0) {
      console.error("Navbar data is empty or undefined.");
      return;
    }
    const translatedTitles = await Promise.all(
      navbarData.map(async (item) => {
        const translatedTitle = await translateText(
          item.title,
          selectedLanguage
        );
        return translatedTitle;
      })
    );
    setTranslatedTitles(translatedTitles);
  }

  function handleLanguageChange(e) {
    const selectedLanguagenew = e.target.value;
    if (selectedLanguagenew) {
      setSelectedLanguage(selectedLanguagenew);
    }
  }

  useEffect(() => {
    if (selectedLanguage && navbarData) {
      translateNavbarTitles();
    }
  }, [selectedLanguage]);

  function hoverAdd(e) {
    hoverAddFn(e, colorForHover);
  }

  function hoverRemove(e) {
    hoverRemoveFn(e);
  }

  if (!navbarData || translatedTitles.length !== navbarData.length) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="navbar navbar-expand-lg" style={navbarStyle}>
      <Link className="navbar-brand" to="/">
        {imageSrc ? (
          <img src={imageSrc} alt="Logo" />
        ) : (
          <p>Logo is not found.</p>
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
              to="/" //  will be to={item.path} when mysql is updated with paths
              onMouseEnter={hoverAdd}
              onMouseLeave={hoverRemove}
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
            onChange={(e) => {
              handleLanguageChange(e);
            }}
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

export default Navbar;
