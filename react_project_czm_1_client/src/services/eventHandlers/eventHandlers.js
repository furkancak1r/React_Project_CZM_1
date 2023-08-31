export const addGlobalEventListeners = (clickHandler, keyDownHandler) => {
  document.addEventListener("mousedown", clickHandler);
  document.addEventListener("keydown", keyDownHandler);
};

export const removeGlobalEventListeners = (clickHandler, keyDownHandler) => {
  document.removeEventListener("mousedown", clickHandler);
  document.removeEventListener("keydown", keyDownHandler);
};

export const bubbleAdd = () => {
  const bubble = document.getElementById("bubble");
  bubble.style.visibility = "visible";
};

export const bubbleRemove = () => {
  const bubble = document.getElementById("bubble");
  bubble.style.visibility = "hidden";
};
