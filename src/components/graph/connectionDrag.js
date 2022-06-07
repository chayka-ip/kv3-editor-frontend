class ConnectionDrag {
  constructor({ onConnectionSuccess, onConnectionFail }) {
    this.parentId = null;
    this.childId = null;
    this.isConnectionStartFromOut = false;
    this.isConnectionStarted = false;
    this.onConnectionSuccess = onConnectionSuccess;
    this.onConnectionFail = onConnectionFail;
    this.mousePosition = { x: 0, y: 0 };
  }

  setParentId = (_id) => (this.parentId = _id);
  setChildId = (_id) => (this.childId = _id);

  getIdByTarget = ({ isParent }) => (isParent ? this.parentId : this.childId);

  setIdByTarget = ({ _id, isParent }) => {
    if (isParent) this.setParentId(_id);
    else this.setChildId(_id);
  };

  beginConnection = ({ _id, isParent }) => {
    this.isConnectionStarted = true;
    this.isConnectionStartFromOut = isParent;
    this.setIdByTarget({ _id: _id, isParent: isParent });
  };

  getOriginId = () => {
    return this.getIdByTarget({ isParent: this.isConnectionStartFromOut });
  };

  setDestinationId = (_id) => {
    if (this.isHandlingConnection()) {
      const target = !this.isConnectionStartFromOut;
      this.setIdByTarget({ _id: _id, isParent: target });
    }
  };

  resolveConnectionAttempt = () => {
    if (this.parentId != null && this.childId != null)
      this.onConnectionSuccess({ parentId: this.parentId, childId: this.childId });
    else this.onConnectionFail();
  };

  isHandlingConnection = () => this.parentId !== null || this.childId !== null;

  isOriginInConnection = () => !this.isOriginOutConnection();
  isOriginOutConnection = () => this.isConnectionStartFromOut;

  setMousePosition = (p) => (this.mousePosition = p);
  getMousePosition = () => this.mousePosition;

  reset = () => {
    this.parentId = null;
    this.childId = null;
    this.isConnectionStartFromOut = false;
    this.isConnectionStarted = false;
  };

  clone = () => {
    return { ...this };
  };

  logId = () => console.log("p", this.parentId, "c", this.childId);
}

export default ConnectionDrag;
