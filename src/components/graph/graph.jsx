import React from "react";
import DragScroll from "./dragScroll";

function getXYFromMouse(e) {
  const x = e.clientX;
  const y = e.clientY;
  return { x: x, y: y };
}

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();

    // this.preventDefault = (e) => e.preventDefault();
  }

  componentDidMount() {
    this.ref.current.addEventListener("wheel", this.preventDefault);
    const dragScroll = new DragScroll();
    this.setState({ dragScroll });
  }

  handleMouseUp = (e) => {
    if (e.nativeEvent.which === 1) this.handleUpLMB(e);
    else if (e.nativeEvent.which === 3) this.handleUpRMB(e);
  };

  handleMouseMove = (e) => this.handleDragScroll(e);
  handleMouseDown = (e) => {
    if (e.nativeEvent.which === 1) this.handleDownLMB(e);
    else if (e.nativeEvent.which === 3) this.handleDownRMB(e);
  };

  handleUpLMB = (e) => {
    const { onConnectonAttempt } = this.props;
    onConnectonAttempt();
  };

  handleUpRMB = (e) => this.disableScrollDrag();

  handleDownLMB = (e) => {};
  handleDownRMB = (e) => this.enableScrollDragAtPoint(getXYFromMouse(e));

  getDragScrollClone = () => {
    if (this.state.dragScroll) return this.state.dragScroll.clone();
  };

  isDragScrollEnabled = () => {
    const d = this.getDragScrollClone();
    if (d) return d.getIsActive();
    return false;
  };

  enableScrollDragAtPoint = ({ x, y }) => {
    const dragScroll = this.getDragScrollClone();
    if (dragScroll) {
      dragScroll.enable();
      dragScroll.setPosition(x, y);
      this.setState({ dragScroll });
    }
  };

  disableScrollDrag = () => {
    const dragScroll = this.getDragScrollClone();
    if (dragScroll) {
      dragScroll.disable();
      this.setState({ dragScroll });
    }
  };

  handleDragScroll = (e) => {
    if (this.isDragScrollEnabled() && this.ref) {
      const dragScroll = this.getDragScrollClone();
      const { x, y } = getXYFromMouse(e);
      const deltaXY = dragScroll.getDeltaPosition(x, y);

      this.ref.current.scrollLeft += deltaXY.x;
      this.ref.current.scrollTop += deltaXY.y;

      dragScroll.setPosition(x, y);
      this.setState({ dragScroll });
    }
  };

  render() {
    const { renderData, onConnectonCancel } = this.props;
    return (
      <div
        ref={this.ref}
        className="graph-container"
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={onConnectonCancel}
        onMouseMove={this.handleMouseMove}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="graph">{renderData}</div>
      </div>
    );
  }
}

export default Graph;
