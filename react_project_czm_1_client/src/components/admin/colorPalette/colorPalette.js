import React, { Component } from "react";
import { SketchPicker } from "react-color";

export default class ColorPalette extends Component {
  render() {
    const {
      background,
      handleChangeComplete,
      handleColorSelected,
      colorForHover,
      navbarStyle,
    } = this.props;
    let colorForHoverApply = {
      backgroundColor: `rgba(${colorForHover.r}, ${colorForHover.g}, ${colorForHover.b}, ${colorForHover.a})`,
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            className="btn btn-light"
            style={navbarStyle}
            onClick={() => {
              handleColorSelected("navbar");
            }}
          >
            Navbar
          </button>
          <button
            type="button"
            className="btn btn-light"
            style={colorForHoverApply}
            onClick={() => {
              handleColorSelected("hover");
            }}
          >
            Hover
          </button>
        </div>
        <SketchPicker color={background} onChange={handleChangeComplete} />
      </div>
    );
  }
}
