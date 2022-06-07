import GenericContainer from "./../common/genericContainer";

class PropertyContainer extends GenericContainer {
  constructor() {
    super({ itemKeyName: "_id" });
  }
}

export default PropertyContainer;
