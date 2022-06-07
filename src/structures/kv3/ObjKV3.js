import ObjectHierarchy from "../common/objectHierarchy";
import PropertyContainer from "./propertyContainer";
import * as special_data_keys from "../../global/special_data_keys.json";
import * as data_types from "../../global/data_types.json";
import * as data_keys from "../../global/data_keys.json";
import * as gvar from "../../global/variables.json";
import { getValueIfKeyExists, objectHasKey } from "../../utils/commonUtils";
import {
  getDefaultPlainValueByDataType,
  isBool,
  isChildValueKey,
  isComplexDataType,
  tryParsetoNumber,
} from "../../utils/dataUtils";
import clone from "just-clone";

// лютый javascript
export const methodsObjKV3 = Object.freeze({
  modifyPropertyDataFromRoot: "modifyPropertyDataFromRoot",
  objGetPropertyArray: "getPropertyArrayOfObject",
  objChangeComment: "objChangeComment",
  objGetFirstComment: "objGetFirstComment",
  objGetAllComplexPropertiesRecursively: "objGetAllComplexPropertiesRecursively",
  getAllNodesIdAndComment: "getAllNodesIdAndComment",
  getAllNodesIdAndTitleText: "getAllNodesIdAndTitleText",
  modifyPropertyData: "modifyPropertyData",

  addProperty: "addProperty",
  removeProperty: "removeProperty",
  changePropertyDataType: "changePropertyDataType",
  changePropertyName: "changePropertyName",
  changePropertyValue: "changePropertyValue",
  changeComment: "changeComment",
  getPropertyArray: "getPropertyArray",
  findTopLevelPropertyById: "findTopLevelPropertyById",
  modifyOwnProperty: "modifyOwnProperty",
  hasTopLevelPropertyWithId: "hasTopLevelPropertyWithId",
  removeNestedProperty: "removeNestedProperty",
  getAllComplexPropertiesRecursively: "getAllComplexPropertiesRecursively",

  getFirstComment: "getFirstComment",
  getTitleText: "getTitleText",

  isComplexDataType: "isComplexDataType",
  getDataType: "getDataType",
  getName: "getName",
  getPlainValue: "getPlainValue",
  getComplexValue: "getComplexValue",
  getId: "getId",

  getChildWithName: "getChildWithName",
  addObjectToPropertyArray: "addObjectToPropertyArray",
  getConnectionTable: "getConnectionTable",
  getGraphConnectionTable: "getGraphConnectionTable",
});

export default class ObjKV3 extends ObjectHierarchy {
  constructor() {
    super();
    this.name = "";
    this.complexValue = new PropertyContainer(); // used in case of complex data type
    this.plainValue = ""; // used in case of plain data type
    this.dataType = data_types.str;
    this.comments = [];
  }

  overrideId = (_id) => {
    if (this.name === this._id) this.setName(_id);
    this.setId(_id);
  };

  canThisAddTopLevelProperty = ({ propertyId }) => {
    if (propertyId == null) return true;
    return false;
  };

  canThisRemoveTopLevelProperty = ({ propertyId }) => {
    return this.hasTopLevelPropertyWithId({ propertyId });
  };

  canAddOrRemoveTopLevelProperty = ({ propertyId, isAdd, isRemove }) => {
    const chAdd = this.canThisAddTopLevelProperty({ propertyId });
    const chRem = this.canThisRemoveTopLevelProperty({ propertyId });

    const canAdd = isAdd && chAdd;
    const canRemove = isRemove && chRem;

    return canAdd || canRemove;
  };

  // this function is called only on data root!
  modifyPropertyDataFromRoot = ({ dataObjectId, propertyId, funcName, value }) => {
    const object = this.findById(dataObjectId);
    if (object) object[methodsObjKV3.modifyPropertyData]({ propertyId, funcName, value });
  };

  modifyPropertyData = ({ propertyId, funcName, value }) => {
    const isAdd = funcName === methodsObjKV3.addProperty;
    const isRemove = funcName === methodsObjKV3.removeProperty;

    const topLevelAddDel = this.canAddOrRemoveTopLevelProperty({
      propertyId,
      isAdd,
      isRemove,
    });

    if (topLevelAddDel) {
      if (isAdd) this.addProperty();
      else this.removeProperty({ propertyId });
    } else {
      if (isRemove) this.removeNestedProperty({ propertyId });
      else this.modifyOwnProperty({ propertyId, funcName, value });
    }
  };

  removeNestedProperty = ({ propertyId }) => {
    const parentObj = this.findParentOfNestedPropertyById({ propertyId });
    if (parentObj) parentObj[methodsObjKV3.removeProperty]({ propertyId });
  };

  modifyOwnProperty = ({ propertyId, funcName, value }) => {
    const isTopLevelProperty = this.hasTopLevelPropertyWithId({ propertyId });
    let property = null;

    if (isTopLevelProperty) property = this.findTopLevelPropertyById({ propertyId });
    else property = this.findNestedPropertyById({ propertyId });

    if (property) property[funcName](value);
  };

  getPropertyArrayOfObject = ({ dataObjectId }) => {
    const object = this.findById(dataObjectId);
    if (object) return object.getPropertyArray();
    return [];
  };

  addObjectToPropertyArray = (obj) => this.addItemToComplexValue(obj);

  addProperty = () => this.addEmptyItemToComplexValue();
  removeProperty = ({ propertyId }) => {
    const _id = propertyId;
    this.removeItemFromComplexValueById(_id);
  };
  getPropertyArray = () => this.complexValue.getItemsAsArray();
  findTopLevelPropertyById = ({ propertyId }) => {
    const _id = propertyId;
    return this.findComplexValueById(_id);
  };

  findParentOfNestedPropertyById = ({ propertyId }) => {
    const topLevelProp = this.findTopLevelPropertyById({ propertyId });
    if (topLevelProp) return this;

    for (const prop of this.complexValue.items) {
      const nestedReturn = prop.findParentOfNestedPropertyById({ propertyId });
      if (nestedReturn) return nestedReturn;
    }
  };

  findNestedPropertyById = ({ propertyId }) => {
    const topLevelProp = this.findTopLevelPropertyById({ propertyId });
    if (topLevelProp) return topLevelProp;

    for (const prop of this.complexValue.items) {
      const nestedProp = prop.findNestedPropertyById({ propertyId });
      if (nestedProp) return nestedProp;
    }
  };

  hasTopLevelPropertyWithId = ({ propertyId }) =>
    this.findTopLevelPropertyById({ propertyId }) != null;

  changePropertyDataType = (value) => this.setDataType(value);
  changePropertyName = (value) => this.setName(value);
  changePropertyValue = (value) => this.updateValue(value);

  objChangeComment = ({ dataObjectId, value }) => {
    const object = this.findById(dataObjectId);
    if (object) object[methodsObjKV3.changeComment](value);
  };

  objGetFirstComment = ({ dataObjectId }) => {
    const object = this.findById(dataObjectId);
    if (object) return object[methodsObjKV3.getFirstComment]();
    return "";
  };

  objGetAllComplexPropertiesRecursively = ({ dataObjectId }) => {
    const object = this.findById(dataObjectId);
    if (object) return object[methodsObjKV3.getAllComplexPropertiesRecursively]();
    return [];
  };

  getAllComplexPropertiesRecursively = () => {
    let objArray = [];
    if (this.isComplexDataType) {
      const selfProps = this.getPropertyArray();
      objArray = objArray.concat(selfProps);
      for (const prop of selfProps) {
        const nestedObjArray = prop.getAllComplexPropertiesRecursively();
        objArray = objArray.concat(nestedObjArray);
      }
    }
    return objArray;
  };

  addEmptyItemToComplexValue = () => {
    const obj = new ObjKV3();
    this.addItemToComplexValue(obj);
  };

  getAllNodesIdAndComment = () => {
    const nodeArray = this.mergeAllChildrenToSingleArrayRecursively();
    let outArray = [];
    for (const node of nodeArray) {
      const obj = { _id: node._id, comment: node[methodsObjKV3.getFirstComment]() };
      outArray.push(obj);
    }
    return outArray;
  };

  getAllNodesIdAndTitleText = () => {
    const nodeArray = this.mergeAllChildrenToSingleArrayRecursively();
    let outArray = [];
    for (const node of nodeArray) {
      const obj = { _id: node._id, title: node[methodsObjKV3.getTitleText]() };
      outArray.push(obj);
    }
    return outArray;
  };

  getTitleText = () => {
    const ret_id = gvar.display_id_as_title || !this.isComplexDataType();
    if (ret_id) return this._id;

    const typedValye = this.getPlainValueOfPropWithName("type");
    if (typedValye) return typedValye;

    const firstPlainPropData = this.getFirstPlainPropNameValue();
    if (firstPlainPropData) {
      const { name, value, dataType } = firstPlainPropData;
      if (dataType === data_types.number) return `${name}=${value}`;
      return `${name}: ${value}`;
    }

    return "";
  };

  getPropertyWithName = (name) => {
    for (const prop of this.complexValue.getItemsAsArray()) {
      const propName = getValueIfKeyExists(prop, data_keys.name);
      if (propName && propName === name) return prop;
    }
  };

  getPlainValueOfPropWithName = (name) => {
    const prop = this.getPropertyWithName(name);
    if (prop) return prop.plainValue;
  };

  getFirstPlainPropNameValue = () => {
    for (const prop of this.complexValue.getItemsAsArray()) {
      const propName = getValueIfKeyExists(prop, data_keys.name);
      const dataType = prop.getDataType();
      const isComplexDataType = prop.isComplexDataType();
      if (!isComplexDataType)
        return { name: propName, value: prop.plainValue, dataType: dataType };
    }
  };

  getChildWithName = (name) => {
    for (const child of this.children) {
      const childName = getValueIfKeyExists(child, data_keys.name);
      if (childName && childName === name) return child;
    }
  };

  /*=============================================================*/

  setData = (data) => {
    const rawDataType = getValueIfKeyExists(data, data_keys.data_type);
    const rawValue = getValueIfKeyExists(data, data_keys.value);

    this.setName(getValueIfKeyExists(data, data_keys.name));
    this.setDataType(rawDataType);
    this.setComments(getValueIfKeyExists(data, data_keys.comments));

    if (rawValue != null) {
      if (this.isComplexDataType()) this.handleValueOfComplexType(rawValue);
      // else this.setPlainValue(rawValue);
      else this.readAndSetPlainValueAndDataType(rawDataType, rawValue);
    }
  };

  readAndSetPlainValueAndDataType(rawDataType, rawValue) {
    let dataType = rawDataType;
    let value = rawValue;

    const numericValue = tryParsetoNumber(rawValue);
    if (numericValue != null) {
      dataType = data_types.number;
      value = numericValue;
    }

    const isBoolean = isBool(rawValue);
    if (isBoolean) dataType = data_types.bool;

    if (!dataType) dataType = data_types.str;

    if (value == null) value = getDefaultPlainValueByDataType(dataType);

    this.setDataType(dataType);
    this.setPlainValue(value);
  }

  handleValueOfComplexType = (rawValue) => {
    for (const index in rawValue) {
      const chunk = rawValue[index];
      const chunkName = getValueIfKeyExists(chunk, data_keys.name);
      const chunkDataType = getValueIfKeyExists(chunk, data_keys.data_type);
      const isArrayType = chunkDataType === data_types.array;
      const isChildKey = isChildValueKey(chunkName);
      const unpackChildren = isArrayType && isChildKey;

      if (unpackChildren) this.unpackChildrenArray(chunk);
      else this.setNestedObjectFromData(chunk, isChildKey);
    }
  };

  unpackChildrenArray = (data) => {
    const value = getValueIfKeyExists(data, data_keys.value);
    for (const index in value) {
      const chunk = value[index];
      this.setNestedObjectFromData(chunk, true);
    }
  };

  setNestedObjectFromData = (data, isChild) => {
    const obj = new ObjKV3();
    obj.setData(data);

    if (isChild) this.addChild(obj);
    else this.addItemToComplexValue(obj);
  };

  setComments = (data) => {
    if (data) this.comments = data;
    else this.comments = [];
  };

  isComplexDataType = () => isComplexDataType(this.dataType);

  getDataType = () => this.dataType;
  setDataType = (dataType) => {
    this.dataType = dataType;
    this.changePlainValueType();
  };

  getName = () => (this.name ? this.name : "");
  setName = (name) => (this.name = name);

  changePlainValueType = () => {
    this.plainValue = getDefaultPlainValueByDataType(this.getDataType());
  };

  updateValue = (value) => {
    if (this.isComplexDataType()) {
      console.log(" COMPLEX VALUE IS NOT IMPLEMENTED");
    } else this.setPlainValue(value);
  };

  addItemToComplexValue = (item) => this.complexValue.addItem(item);
  removeItemFromComplexValueById = (_id) => this.complexValue.removeItemByKey(_id);
  findComplexValueById = (_id) => this.complexValue.getItemByKey(_id);
  getComplexValue = () => this.complexValue;
  getPlainValue = () => {
    if (this.plainValue != null) return this.plainValue;
    return getDefaultPlainValueByDataType(this.getDataType());
  };
  setPlainValue = (value) => (this.plainValue = value);
  getValue = () => {
    return this.isComplexDataType() ? this.getComplexValue() : this.getPlainValue();
  };

  setNameToId = () => this.setName(this._id);

  getFirstComment = () => {
    if (this.comments.length === 0) return "";
    return this.comments[0];
  };

  setFirstComment = (value) => (this.comments[0] = value);

  changeComment = (value) => this.setFirstComment(value);

  getGraphConnectionTable = () => {
    const doReduse = gvar.use_compact_layout;
    if (this.numChildren() > 0)
      return this.children[0][methodsObjKV3.getConnectionTable](doReduse);
    // anyway is empty
    return this.getConnectionTable();
  };

  /*=============================================================*/

  serialize = () => {
    let obj = this.getCommonSerializedObjPart();
    obj[data_keys.value] = this.getObjectSerializedValue();
    return this.getValidatedSerializedObject(obj);
  };

  getCommonSerializedObjPart = () => {
    let obj = {};

    const isGraphRoot = this.isGraphRoot();
    const hasValidName = this.getName() && this.getName() !== this.getId();
    const bProcComplexDataType = this.isComplexDataType();

    if (hasValidName) obj[data_keys.name] = this.getName();
    if (isGraphRoot) obj[data_keys.name] = gvar.graph_root_key;

    if (bProcComplexDataType) obj[data_keys.data_type] = this.getDataType();

    if (this.comments.length > 0) obj[data_keys.comments] = this.comments;

    return obj;
  };

  getObjectSerializedValue = () => {
    return this.isComplexDataType()
      ? this.getComplexObjectSerializedValue()
      : this.getPrimitiveObjectSerializedValue();
  };

  getPrimitiveObjectSerializedValue = () => {
    let val = this.getPlainValue();
    if (this.dataType === data_types.number) val = parseFloat(val);
    return val;
  };

  getComplexObjectSerializedValue = () => {
    //returns array
    let value = this.getSerializedPropertyArray();
    const serializedChildrenObj = this.getSerializedChildrenObj();
    if (serializedChildrenObj) value.push(serializedChildrenObj);
    return value;
  };

  getSerializedPropertyArray = () => {
    let value = [];
    for (const prop of this.getPropertyArray()) {
      const nestedReturn = prop.serialize();
      if (nestedReturn) value.push(nestedReturn);
    }
    return value;
  };

  getSerializedChildrenObj = () => {
    const childrenArray = this.getSerializedChildrenArray();
    if (childrenArray.length > 0) {
      let obj = {};
      obj[data_keys.name] = special_data_keys.children;
      obj[data_keys.data_type] = data_types.array;
      obj[data_keys.value] = childrenArray;
      return obj;
    }
  };

  getSerializedChildrenArray = () => {
    let childrenArray = [];

    for (const child of this.children) {
      let childObj = child.serialize();
      if (childObj) {
        const childName = getValueIfKeyExists(childObj, data_keys.name);
        // convert single child object to children's array item
        if (childName === special_data_keys.child) delete childObj.name;

        childrenArray.push(childObj);
      }
    }
    return childrenArray;
  };

  getValidatedSerializedObject = (obj) => {
    const isGraphRoot = this.isGraphRoot();
    const bProcComplexDataType = this.isComplexDataType();
    const hasValueKey = objectHasKey(obj, data_keys.value);
    let hasValidValue = false;

    if (!hasValueKey) return;

    if (bProcComplexDataType) hasValidValue = obj[data_keys.value].length > 0;
    else hasValidValue = obj[data_keys.value] != null;

    if (!hasValidValue) return;

    if (isGraphRoot) {
      const children = obj[data_keys.value][0];
      if (children) return children[data_keys.value][0];
    }
    return obj;
  };

  getDeepClone = () => {
    let obj = new ObjKV3();
    obj.setId(this.getId());
    obj.setName(this.getName());
    obj.setDataType(this.getDataType());
    obj.setPlainValue(this.getPlainValue());
    obj.comments = clone(this.comments);

    obj.children = this.getChildrenDeepClone();
    obj.complexValue = this.getComplexValueDeepClone();

    return obj;
  };

  getChildrenDeepClone = () => {
    let cloneArray = [];
    for (const child of this.children) {
      const cl = child.getDeepClone();
      cloneArray.push(cl);
    }
    return cloneArray;
  };

  getComplexValueDeepClone = () => {
    const newObj = new PropertyContainer();
    for (const prop of this.getPropertyArray()) {
      const cl = prop.getDeepClone();
      newObj.addItem(cl);
    }
    return newObj;
  };

  isGraphRoot = () => this._id === gvar.graph_root_id;
}

/*
    Object's value contains bunch of property objects.
  
    There also migh be an array of children 
    supposed to be placed inside "children" property.
  
    Single child object also should be placed to "children" property
  
    Regular arrays and properties are placed into "value" field
*/
