import React from "react";
import { getDistanceXY, getLineCenterXY, getAngleXY } from "../../utils/elementGeomUtils";

// accepts two points

class ConnectionLine extends React.Component {
  getLine() {
    const { p1, p2 } = this.props;

    const errorX = 0;
    const errorY = 0;
    const errorLength = 0;

    const thickness = 2;

    const length = getDistanceXY(p1, p2);
    const center = getLineCenterXY(p1, p2, length, thickness);
    const angle = getAngleXY(p1, p2);

    const lineLeft = center.x + errorX;
    const lineTop = center.y + errorY;
    const lineLength = length + errorLength;
    const rotate = `rotate(${angle}deg)`;

    const style = {
      height: thickness,
      left: lineLeft,
      top: lineTop,
      width: lineLength,
      transform: rotate,
    };

    return <div className="line-connection" style={style}></div>;
  }

  render() {
    return this.getLine();
  }
}

export default ConnectionLine;
