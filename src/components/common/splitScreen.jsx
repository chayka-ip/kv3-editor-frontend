import React from "react";

class SplitScreen extends React.Component {
  state = {
    isResizing: false,
    splitOffset: -1,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.leftRef = React.createRef();
    this.rightRef = React.createRef();
  }

  componentDidMount() {
    const { splitOffset } = this.state;
    if (splitOffset < 0) {
      const offset = this.rightRef.current.offsetLeft;
      this.updateSplitOffset(offset);
    }
  }

  handleMouseDown = () => {
    this.setState({ isResizing: true });
  };

  handleMouseUp = () => {
    this.setState({ isResizing: false });
  };

  handleMouseMove = (e) => {
    if (!this.state.isResizing) return;
    const mouseOffset = e.clientX;
    this.updateSplitOffset(mouseOffset);
  };

  updateSplitOffset = (referenseOffset) => {
    const containerWidth = this.getContainerWidth();
    const containerOffsetLeft = this.getContainerOffsetLeft();
    const splitOffset = containerWidth - (referenseOffset - containerOffsetLeft);
    this.setState({ splitOffset });
  };

  getContainerWidth = () => {
    return this.containerRef.current.offsetWidth;
  };

  getContainerOffsetLeft = () => {
    return this.containerRef.current.offsetLeft;
  };

  render() {
    const { splitOffset } = this.state;
    let { leftPanContent, rigthPanContent } = this.props;

    if (!leftPanContent) leftPanContent = "LEFT PANEL";
    if (!rigthPanContent) rigthPanContent = "RIGHT PANEL";

    const leftPanStyle = { right: splitOffset };
    const rightPanStyle = { width: splitOffset };

    return (
      <div
        ref={this.containerRef}
        className="split-container"
        onMouseMove={this.handleMouseMove}
      >
        <div ref={this.leftRef} className="split-left-panel" style={leftPanStyle}>
          {leftPanContent}
        </div>
        <div ref={this.rightRef} className="split-right-panel" style={rightPanStyle}>
          <div
            className="split-drag"
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
          ></div>
          <div className="split-right-panel-content">{rigthPanContent}</div>
        </div>
      </div>
    );
  }
}

export default SplitScreen;
