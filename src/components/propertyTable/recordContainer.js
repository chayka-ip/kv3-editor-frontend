import GenericContainer from "./../../structures/common/genericContainer";

export default class RecordContainer extends GenericContainer {
  constructor() {
    super({ itemKeyName: "_id" });
  }

  setDisplayState = ({ propertyId, isExpanded }) => {
    const prop = this.getItemByKey(propertyId);
    if (prop) prop.setDisplayState(isExpanded);
  };

  toggleDisplayState = (propertyId) => {
    const prop = this.getItemByKey(propertyId);
    if (prop) prop.toggleDisplayState();
  };

  getDisplayState = (propertyId) => {
    const prop = this.getItemByKey(propertyId);
    if (prop) return prop.getDisplayState();
    return false;
  };
}
