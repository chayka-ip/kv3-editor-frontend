import RenderedItem from "../../../structures/renderedItem";

export default class NodeHolder extends RenderedItem {
  constructor(props) {
    super(props);
    this.defaultPosition = { x: 0, y: 0 };
    this.comment = "";
    this.title = "";
    this.isSelected = false;
  }

  getIsSelected = () => this.isSelected;
  setIsSelected = (value) => (this.isSelected = value);

  getDefaultPosition = () => this.defaultPosition;
  setDefaultPosition = (p) => (this.defaultPosition = p);

  getNodePosition = () => {
    if (this.getCurrent()) {
      return this.getCurrent().getElementPosition();
    }

    return { x: 0, y: 0 };
  };

  getInConnectionCenter = () => {
    if (this.getCurrent()) return this.getCurrent().getInConnectionCenter();
  };

  getOutConnectionCenter = () => {
    if (this.getCurrent()) return this.getCurrent().getOutConnectionCenter();
  };

  getConnectionCenter = ({ isInConnection }) => {
    return isInConnection ? this.getInConnectionCenter() : this.getOutConnectionCenter();
  };

  getNodeDimenshions = () => {
    if (this.getCurrent()) return this.getCurrent().getNodeDimenshions();
  };

  getComment = () => this.comment;
  setComment = (value) => (this.comment = value);

  getTitle = () => this.title;
  setTitle = (value) => (this.title = value);

  isCommentEqualsTo = (comment) => this.comment === comment;
  isTitleEqualsTo = (title) => this.title === title;
}
