import React from "react";
import { getDataTypeList } from "../../services/dataService";
import AutosuggestInput from "../common/autosuggestInput";
import DropDownList from "./../common/dropDownList";
import * as data_types from "../../global/data_types.json";
import * as gvar from "../../global/variables.json";
import PropertyTableRowBase from "./propertyTableRowBase";

function sanitizeStringForName(string) {
  return string.replace(/[^a-zA-Z0-9_]/g, "");
}

function sanitizeStringForValue(string) {
  return string.replace(/[^a-zA-Z0-9_'"/.,: ]/g, "");
}

function sanitizeStringNumericOnly(string) {
  let s = string.replace(/[^0-9.-]/g, "");
  const p = s.split(".");
  if (p.length === 1) return p[0];
  return p[0] + "." + p[1];
}

class PropertyTableRow extends React.Component {
  handleDataTypeChange = (value) => {
    const { _id } = this.props;
    this.props.onDataTypeChange({ propertyId: _id, value: value });
  };

  handleNameChange = (value) => {
    const { _id } = this.props;
    value = sanitizeStringForName(value);
    this.props.onNameChange({ propertyId: _id, value: value });
  };
  handleValueChange = (value) => {
    const { _id, dataType } = this.props;
    if (dataType === data_types.number) value = sanitizeStringNumericOnly(value);
    if (dataType === data_types.str) value = sanitizeStringForValue(value);

    this.props.onValueChange({ propertyId: _id, value: value });
  };

  getDataTypeField = () => {
    return (
      <DropDownList
        options={getDataTypeList()}
        selectedValue={this.props.dataType}
        onChange={this.handleDataTypeChange}
      />
    );
  };

  getNameField = () => {
    const { _id, currentName, nameSuggestOptions } = this.props;
    return (
      <AutosuggestInput
        elementId={"name-" + _id}
        currentValue={currentName}
        options={nameSuggestOptions}
        onInputChange={this.handleNameChange}
      />
    );
  };

  getBoolValueField = () => {
    const { plainValue } = this.props;
    const opt = [gvar.bool_true, gvar.bool_false];
    return (
      <DropDownList
        options={opt}
        selectedValue={plainValue}
        onChange={this.handleValueChange}
      />
    );
  };

  getPlainValueField = () => {
    const { _id, dataType, plainValue, valueSuggestOptions } = this.props;

    if (dataType === data_types.bool) return this.getBoolValueField();

    return (
      <AutosuggestInput
        elementId={"value-" + _id}
        currentValue={plainValue}
        options={valueSuggestOptions}
        onInputChange={this.handleValueChange}
      />
    );
  };

  getNestedRowsContent = () => {
    const { nestedRows } = this.props;
    if (nestedRows.length === 0) return <React.Fragment />;
    return (
      <React.Fragment>
        <div className="property-table-content-nested">
          <div className="property-table-content-nested-top"></div>
          <div className="property-table-content-nested-offset"></div>
          <div className="property-table-content-nested-rows">{nestedRows}</div>
          <div className="property-table-content-nested-down"></div>
        </div>
      </React.Fragment>
    );
  };

  getComplexValueField = () => {
    const { onCollapseToggle } = this.props;
    return (
      <React.Fragment>
        <div className="property-table-nested-rows-show-hide" onClick={onCollapseToggle}>
          Nested show/hide
        </div>
      </React.Fragment>
    );
  };

  isComplexDataType = () => {
    const dt = this.props.dataType;
    if (dt === data_types.array || dt === data_types.object) return true;
    return false;
  };

  getValueField = () => {
    if (this.isComplexDataType()) return this.getComplexValueField();
    return this.getPlainValueField();
  };

  getRenderContent = () => {
    const { onRemove } = this.props;
    const columnClassName = "property-column";
    return (
      <React.Fragment>
        <div className="property-row-content-base">
          <div className={`${columnClassName} property-data-type`}>
            {this.getDataTypeField()}
          </div>
          <div className={`${columnClassName} property-name-container`}>
            <div className="property-name">{this.getNameField()}</div>
          </div>
          <div className={`${columnClassName} property-value-container`}>
            <div className=" property-value">{this.getValueField()}</div>
          </div>
          <div className={`${columnClassName} property-table-remove-row-btn-container`}>
            <button className="property-table-remove-row-btn red" onClick={onRemove}>
              -
            </button>
          </div>
        </div>
        {this.getNestedRowsContent()}
      </React.Fragment>
    );
  };

  render() {
    const { onSelect } = this.props;
    return (
      <React.Fragment>
        <PropertyTableRowBase onSelect={onSelect} content={this.getRenderContent()} />
      </React.Fragment>
    );
  }
}

export default PropertyTableRow;

//data type; name; value; additional stuff - expand/collapse
//todo: drop down; field with suggestion
