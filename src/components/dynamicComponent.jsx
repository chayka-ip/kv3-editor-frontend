import React from "react";
import ComponentWithSelection from "./componentWithSelection";
import GenericContainer from "../structures/common/genericContainer";

class DynamicComponent extends ComponentWithSelection {
  componentDidMount() {
    const container = new GenericContainer({ itemKeyName: "_id" });
    this.setState({ container });
  }

  addItem = (item) => {
    const container = this.getContainer().clone();
    container.addItem(item);
    this.setState({ container });
  };

  removeSelectedItem = () => {
    const itemKey = this.getSelectedId();
    const container = this.getContainer().clone();
    container.removeItemByKey(itemKey);
    this.setState({ container });
  };

  getRenderData = () => {
    if (this.getContainer()) return this.getContainer().getRenderData();
    return <div></div>;
  };

  getContainer = () => this.state.container;
}

export default DynamicComponent;
