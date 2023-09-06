import React, { useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { toggleVisibility } from "../../../services/eventHandlers/eventHandlers";

function DarkVariantExample() {
  const images = [
    { src: "/czmLogo.png", alt: "First slide" },
    { src: "/logo192.png", alt: "Second slide" },
    { src: "/logo512.png", alt: "Third slide" },
  ];
  useEffect(() => {
    function defaultBubbleFn() {
      try {
        toggleVisibility("bubbleSlider", false);
      } catch (error) {
        console.error(error);
      }
    }
    defaultBubbleFn();
  }, []);

  return (
    <Carousel data-bs-theme="dark" data-bs-pause="false" margin="auto">
      {images.map((image) => (
        <Carousel.Item
          key={image.src}
          align="center"
          onMouseEnter={() => toggleVisibility("bubbleSlider", true)}
          onMouseLeave={() => toggleVisibility("bubbleSlider", false)}
        >
          <img
            className="d-block w-40"
            src={image.src}
            alt={image.alt}
            style={{ height: "32rem" }} //512 px
          />
          <div id="bubbleSlider" className="bubbleSlider">
            Max Yükseklik: "512px"
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default DarkVariantExample;
