import React, { Component } from 'react';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.sidebarRef = React.createRef();
    }

    componentDidMount() {
        this.props.updateSidebarRef(this.sidebarRef.current);
    }

    render() {
        const {
            showSidebar,
            latestFilesInfosForScreenshots,
            enlargedImageVisible,
            handleScreenshotClick
        } = this.props;

        return (
            <div
                className={`sidebar ${showSidebar ? 'active' : ''}`}
                ref={this.sidebarRef}
            >
                <div className="sidebarHeader">Son Kaydedilenler</div>
                <div className="sidebarImageAll">
                    {latestFilesInfosForScreenshots.map((fileInfo, index) => (
                        <li
                            key={index}
                            className={`img-container ${enlargedImageVisible ? 'enlarged' : ''}`}
                            onClick={enlargedImageVisible ? handleScreenshotClick : null}
                        >
                            <div className="image-overlay">
                                <i className="bi bi-arrow-90deg-left"></i>
                                <i className="bi bi-arrows-fullscreen" onClick={handleScreenshotClick}></i>
                            </div>
                            <img
                                src={`data:${fileInfo.fileExtention};base64,${fileInfo.fileBase64}`}
                                alt={`Screenshot ${index + 1}`}
                            />
                        </li>
                    ))}
                </div>
            </div>
        );
    }
}

export default Sidebar;
