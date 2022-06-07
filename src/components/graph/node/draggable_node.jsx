import React from "react";
import Draggable from "react-draggable";
import { Position } from "../../../utils/commonUtils";
import { getElementCenterPosition } from "../../../utils/elementGeomUtils";

// http://react-grid-layout.github.io/react-draggable/example/
// https://github.com/react-grid-layout/react-draggable

// Draggable node position must be absolute due to keep it's position independent of other nodes position!!!!!!

class DraggableNode extends React.Component {
  constructor(props) {
    super(props);
    this.draggableRef = React.createRef();
    this.nodeDivRef = React.createRef();
    this.connectionInRef = React.createRef();
    this.connectionOutRef = React.createRef();
  }

  handleDragStart = (e) => this.props.onSelect();

  handleDrag = () => {
    const { onDrag } = this.props;
    onDrag();
  };

  handleDragStop = () => {};

  handleNodeMouseEnter = (e) => {
    const { onNodeMouseEnter } = this.props;
    onNodeMouseEnter();
  };

  handleMouseLeave = (e) => {
    this.props.onNodeMouseLeave();
  };

  getElementPosition = () => {
    let p = new Position();
    const r = this.draggableRef.current;
    if (r) {
      const { x, y } = r.state;
      p.addPositionXY(x, y);
    }
    return p;
  };

  connectionInPressed = () => this.connectionSlotPressed(false);
  connectionOutPressed = () => this.connectionSlotPressed(true);
  connectionSlotPressed = (isOutSlot) => {
    const { _id, onConnectionSlotSelected } = this.props;
    onConnectionSlotSelected({ nodeId: _id, isOutSlot: isOutSlot });
  };

  getInConnectionCenter = () => this.getConnectionCenter(this.connectionInRef);
  getOutConnectionCenter = () => this.getConnectionCenter(this.connectionOutRef);

  getConnectionCenter = (ref) => {
    const nodePosition = this.getElementPosition();
    if (ref && nodePosition) {
      const elemPosiiton = getElementCenterPosition(ref.current);
      nodePosition.addPosition(elemPosiiton);
      return nodePosition;
    }
  };

  getNodeDimenshions = () => {
    let width = 0;
    let height = 0;
    if (this.nodeDivRef && this.nodeDivRef.current) {
      const current = this.nodeDivRef.current;
      width = current.clientWidth;
      height = current.clientHeight;
    }
    return { width, height };
  };

  render() {
    const { defaultPosition, currentComment, title, isSelected } = this.props;

    const nodeSelectedClass1 = isSelected ? " node-sel-1" : "";
    const nodeSelectedClass2 = isSelected ? " node-sel-2" : "";

    const scale = 0.7;

    return (
      <Draggable
        ref={this.draggableRef}
        bounds="parent"
        defaultPosition={defaultPosition}
        onStart={this.handleDragStart}
        cancel="b"
        onDrag={this.handleDrag}
        scale={scale}
      >
        <div
          ref={this.nodeDivRef}
          className={"draggable-node" + nodeSelectedClass1}
          onMouseEnter={this.handleNodeMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div className={"draggable-node-content" + nodeSelectedClass2}>
            <div className="draggable-node-connections-row">
              <b
                ref={this.connectionInRef}
                className="node-connection-point connection-in"
                onMouseDown={this.connectionInPressed}
              ></b>
              <div className="draggable-node-title-section">{title}</div>
              <b
                ref={this.connectionOutRef}
                className="node-connection-point connection-out"
                onMouseDown={this.connectionOutPressed}
              ></b>
            </div>
            <div className="draggable-node-comment-section">{currentComment}</div>
            <b className="draggable-node-footer"></b>
          </div>
        </div>
      </Draggable>
    );
  }
}
export default DraggableNode;

// way to get styles
// const styles = getComputedStyle(rootRef);
// console.log(styles);
