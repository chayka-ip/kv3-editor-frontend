import React from "react";
import ItemSelection from "../structures/common/itemSelection";

class ComponentWithSelection extends React.Component {
  state = {
    selection: new ItemSelection(),
  };

  handleItemSelection = (itemKey) => {
    const selection = this.getSelection().clone();
    selection.setSelection(itemKey);
    this.setState({ selection });
  };

  getSelection = () => this.state.selection;

  getSelectedId = () => {
    const selection = this.getSelection();
    if (selection) return selection.getSelected();
  };

  render() {
    return <div></div>;
  }
}

export default ComponentWithSelection;
