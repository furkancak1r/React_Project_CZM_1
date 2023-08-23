import React, { Component } from "react";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enlargedImages: new Array(
        props.latestFilesInfosForScreenshots.length
      ).fill(false),
    };
    this.sidebarRef = React.createRef();
  }

  componentDidMount() {
    this.props.updateSidebarRef(this.sidebarRef.current);
  }
  toggleEnlarged = (index) => {
    const { enlargedImages } = this.state;
    enlargedImages[index] = !enlargedImages[index];
    this.setState({ enlargedImages });
  };
  render() {
    const { showSidebar, latestFilesInfosForScreenshots } = this.props;
    const { enlargedImages } = this.state;
    return (
      <div
        className={`sidebar ${showSidebar ? "active" : ""}`}
        ref={this.sidebarRef}
      >
        <div className="sidebarHeader">Son Kaydedilenler</div>
        <div className="sidebarImageAll">
          {latestFilesInfosForScreenshots.map((fileInfo, index) => (
            <li
              key={index}
              className={`img-container ${
                enlargedImages[index] ? "enlarged" : ""
              }`}
            >
              <div
                className="image-overlay"
                style={{
                  pointerEvents: enlargedImages[index] ? "none" : "auto",
                }}
              >
                <i className="bi bi-arrow-90deg-left"></i>
                <i
                  className="bi bi-arrows-fullscreen"
                  onClick={() => this.toggleEnlarged(index)}
                ></i>
              </div>
              <img
                src={`data:${fileInfo.fileExtention};base64,${fileInfo.fileBase64}`}
                alt={`Screenshot ${index + 1}`}
                onClick={() => {
                  if (enlargedImages[index]) {
                    this.toggleEnlarged(index);
                  }
                }}
              />
            </li>
          ))}
        </div>
      </div>
    );
  }
}

export default Sidebar;
