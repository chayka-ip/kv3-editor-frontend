import { Position } from "../../utils/commonUtils";

export default class DragScroll {
  constructor() {
    this.isActive = false;
    this.p = new Position();
  }

  setPosition = (x, y) => this.p.setPosition(x, y);
  getPosition = () => this.p;
  getDeltaPosition = (x, y) => ({ x: this.p.x - x, y: this.p.y - y });

  getIsActive = () => this.isActive;
  setIsActive = (value) => (this.isActive = value);

  enable = () => this.setIsActive(true);
  disable = () => this.setIsActive(false);

  clone = () => ({ ...this });
}
