export const addGlobalEventListeners = (clickHandler, keyDownHandler) => {
  document.addEventListener("mousedown", clickHandler);
  document.addEventListener("keydown", keyDownHandler);
};

export const removeGlobalEventListeners = (clickHandler, keyDownHandler) => {
  document.removeEventListener("mousedown", clickHandler);
  document.removeEventListener("keydown", keyDownHandler);
};

export const toggleVisibility = (id, visible) => {
  const element = document.getElementById(id);
  element.style.visibility = visible ? "visible" : "hidden";
};

export const hoverAddFn = (e,colorForHover) => {
  if (colorForHover && !e.target.className.includes("inactive")) {
    e.target.style.color = `rgba(${colorForHover.r}, ${colorForHover.g}, ${colorForHover.b}, ${colorForHover.a})`;
  }
};

export const hoverRemoveFn = (e) => {
  e.target.style.color = "";
};

export const imageSrcFn = (latestFileInfoForLogos)=>{
  let imageSrc = "";
  let latestFileInfoForLogo = latestFileInfoForLogos[0];
    if (latestFileInfoForLogo && latestFileInfoForLogo.fileExtension) {
      imageSrc = `data:${latestFileInfoForLogo.fileExtension};base64,${latestFileInfoForLogo.fileBase64}`;
    }
    return imageSrc;
}