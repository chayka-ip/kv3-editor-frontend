import GenericItem from "./../../structures/common/genericItem";

export default class RecordHolder extends GenericItem {
  constructor(props) {
    super(props);
    this.isExpanded = true;
  }

  setDisplayState = (isExpanded) => (this.isExpanded = isExpanded);
  getDisplayState = () => this.isExpanded;
  toggleDisplayState = () => (this.isExpanded = !this.isExpanded);
}
