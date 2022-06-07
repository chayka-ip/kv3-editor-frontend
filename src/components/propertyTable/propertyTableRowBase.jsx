import React from "react";

const PropertyTableRowBase = ({ content, onSelect }) => {
  return (
    <React.Fragment>
      <div className="property-row" onClick={onSelect}>
        <div className="property-row-content">
          <React.Fragment>{content}</React.Fragment>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PropertyTableRowBase;
