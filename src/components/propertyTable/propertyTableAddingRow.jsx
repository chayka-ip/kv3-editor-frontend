import React from "react";
import PropertyTableRowBase from "./propertyTableRowBase";

const PropertyTableAddingRow = ({ onAddRow }) => {
  const content = (
    <div className="property-table-add-row">
      <button className="property-table-add-row-btn" onClick={onAddRow}>
        <div className="property-table-add-row-btn-text">+</div>
      </button>
    </div>
  );

  return <PropertyTableRowBase onSelect={() => null} content={content} />;
};

export default PropertyTableAddingRow;
