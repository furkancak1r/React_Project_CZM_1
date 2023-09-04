export async function processColors(
  colors,
  backgroundColorForNavbar,
  colorForHover
) {
  const defaultBackgroundColor = { r: 248, g: 249, b: 250, a: 1 };
  const defaultHoverColor = { r: 0, g: 123, b: 255, a: 1 };
  let defaultBackgroundColorin = {};
  let defaultHoverColorin = {};
  await colors.forEach((color) => {
    let properColor = JSON.parse(color.color);

    if (
      Object.keys(backgroundColorForNavbar).length === 0 &&
      color.location === "backgroundColorForNavbar"
    ) {
      defaultBackgroundColorin = properColor;
    } else if (color.location === "backgroundColorForNavbar") {
      defaultBackgroundColorin = defaultBackgroundColor;
    }

    if (
      Object.keys(colorForHover).length === 0 &&
      color.location === "colorForHover"
    ) {
      defaultHoverColorin = properColor;
    } else if (color.location === "colorForHover") {
      defaultHoverColorin = defaultHoverColor;
    }
  });
  return { defaultBackgroundColorin, defaultHoverColorin };
}

export async function navbarStyleFn(backgroundColorForNavbar) {
  const navbarStyle = backgroundColorForNavbar && {
    backgroundColor: `rgba(${backgroundColorForNavbar.r}, ${backgroundColorForNavbar.g}, ${backgroundColorForNavbar.b}, ${backgroundColorForNavbar.a})`,
  };
  return navbarStyle;
}

export async function addIconStyleFn(backgroundColorForNavbar) {
  const addIconStyle = backgroundColorForNavbar && {
    background: `rgba(${backgroundColorForNavbar.r + 30}, ${
      backgroundColorForNavbar.g
    }, ${backgroundColorForNavbar.b}, ${backgroundColorForNavbar.a})`,
  };
  return addIconStyle;
}
