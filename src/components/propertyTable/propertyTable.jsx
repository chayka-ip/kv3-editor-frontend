import React from "react";
import PropertyTableRow from "./propertyTableRow";
import PropertyTableAddingRow from "./propertyTableAddingRow";
import TableCommentBox from "./commentBox";
import { methodsObjKV3 as m_prop } from "./../../structures/kv3/ObjKV3";
import { nanoid } from "nanoid";
import DynamicComponent from "./../dynamicComponent";
import RecordContainer from "./recordContainer";
import RecordHolder from "./recordHolder";

class PropertyTable extends DynamicComponent {
  componentDidMount() {
    // stores expanded/collapsed state for complex properties
    const container = new RecordContainer();
    this.setState({ container });
  }

  componentDidUpdate() {
    this.updateContainer();
  }

  updateContainer = () => {
    const { propertyPlainArray } = this.props;
    for (const p of propertyPlainArray) {
      const _id = p._id;
      const isComplexType = p.isComplexDataType();
      if (isComplexType) {
        this.createComplexPropertyExpandHolderIfDoesNotExist(_id);
      }
    }
  };

  getContainerClone = () => {
    const container = this.getContainer();
    if (container) return container.clone();
  };

  propertySetDisplayState = ({ propertyId, isExpanded }) => {
    const container = this.getContainerClone();
    if (container) {
      container.setDisplayState({ propertyId, isExpanded });
      this.setState({ container });
    }
  };

  handleNestedCollapse = (rowId) => this.toggleDisplayState(rowId);

  toggleDisplayState = (propertyId) => {
    const container = this.getContainerClone();
    if (!container) return;
    container.toggleDisplayState(propertyId);
  };

  getDisplayStateOfNested = (propertyId) => {
    const container = this.getContainerClone();
    if (!container) return true;
    return container.getDisplayState(propertyId);
  };

  createPropertyHolder = (propertyId) => {
    const holder = new RecordHolder();
    holder.setId(propertyId);
    return holder;
  };

  createComplexPropertyExpandHolderIfDoesNotExist = (propertyId) => {
    const container = this.getContainer();
    if (container) {
      const exists = container.doesItemExist(propertyId);
      if (exists) return;
      const holder = this.createPropertyHolder(propertyId);
      this.addItem(holder);
    }
  };

  createTableRow = ({ _id, dataType, currentName, plainValue, nestedRows }) => {
    const {
      onDataTypeChange,
      onNameChange,
      onValueChange,
      nameSuggestOptions,
      valueSuggestOptions,
      onPropertySelect,
      onRemoveProperty,
    } = this.props;

    if (_id) {
      const tableRow = (
        <PropertyTableRow
          key={_id}
          _id={_id}
          onSelect={() => onPropertySelect(_id)}
          onRemove={() => onRemoveProperty(_id)}
          dataType={dataType}
          onDataTypeChange={onDataTypeChange}
          onNameChange={onNameChange}
          onValueChange={onValueChange}
          onCollapseToggle={() => this.handleNestedCollapse(_id)}
          nameSuggestOptions={nameSuggestOptions}
          valueSuggestOptions={valueSuggestOptions}
          currentName={currentName}
          plainValue={plainValue}
          nestedRows={nestedRows}
        />
      );
      return tableRow;
    }
  };

  createAddRowRow = (parentPropertyRowId) => {
    return (
      <PropertyTableAddingRow
        key={nanoid()}
        onAddRow={() => this.props.onAddProperty(parentPropertyRowId)}
      />
    );
  };

  getTableRows = ({ propertyObjects, parentRowId }) => {
    const rows = [];
    for (const dataObj of propertyObjects) {
      const _id = dataObj[m_prop.getId]();
      const dataType = dataObj[m_prop.getDataType]();
      let plainValue = dataObj[m_prop.getPlainValue]();
      const currentName = dataObj[m_prop.getName]();
      const isComplexType = dataObj[m_prop.isComplexDataType]();

      let nestedRows = [];

      if (isComplexType) {
        const displayStateOfNested = this.getDisplayStateOfNested(_id);
        if (displayStateOfNested) {
          const nestedProps = dataObj[m_prop.getPropertyArray]();
          nestedRows = this.getTableRows({
            propertyObjects: nestedProps,
            parentRowId: _id,
          });
        }
      }

      const row = this.createTableRow({
        _id,
        dataType,
        currentName,
        plainValue,
        nestedRows,
      });

      if (row) rows.push(row);
    }

    const addRowRow = this.createAddRowRow(parentRowId);
    rows.push(addRowRow);

    return rows;
  };

  getRenderData = () => {
    const { propertyObjects } = this.props;
    const data = this.getTableRows({ propertyObjects, parentRowId: null });
    return <React.Fragment>{data}</React.Fragment>;
  };

  render() {
    const { onCommentChange, currentComment } = this.props;
    return (
      <div className="property-table-container">
        <div className="table-node-comment-box-container">
          <TableCommentBox
            onCommentChange={onCommentChange}
            currentComment={currentComment}
          />
        </div>
        <div className="property-table">{this.getRenderData()}</div>
      </div>
    );
  }
}

export default PropertyTable;

// todo: move delete button to corresponding row;
// add buttn also will appear when property is complex type
