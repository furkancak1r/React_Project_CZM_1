import React, { Component } from "react";
import { SketchPicker } from "react-color";

export default class ColorPalette extends Component {
 
  render() {
    const { background, handleChangeComplete } = this.props;

    return (
      <SketchPicker
        color={background}
        onChange={handleChangeComplete}
      />
    );
  }
}