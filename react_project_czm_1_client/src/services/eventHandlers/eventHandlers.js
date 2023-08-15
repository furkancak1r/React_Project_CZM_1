export const addGlobalEventListeners = (clickHandler, keyDownHandler) => {
  document.addEventListener("mousedown", clickHandler);
  document.addEventListener("keydown", keyDownHandler);
};

export const removeGlobalEventListeners = (clickHandler, keyDownHandler) => {
  document.removeEventListener("mousedown", clickHandler);
  document.removeEventListener("keydown", keyDownHandler);
};
