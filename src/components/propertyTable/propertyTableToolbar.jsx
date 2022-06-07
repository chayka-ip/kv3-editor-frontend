import React from "react";

class PropertyTableToolbar extends React.Component {
  render() {
    const { onAddProperty, onRemoveProperty } = this.props;
    return (
      <div className="property-table-toolbar-container">
        <div className="property-table-toolbar">
          <button className="property-btn green" onClick={onAddProperty}>
            +
          </button>
          <button className="property-btn red" onClick={onRemoveProperty}>
            -
          </button>
        </div>
      </div>
    );
  }
}

export default PropertyTableToolbar;
