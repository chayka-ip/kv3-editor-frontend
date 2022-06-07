import ConnectionTable from "./connectionTable";
import { buildConnectionTable, printConnectionTable } from "./connectionTable";
import { nanoid } from "nanoid";

export const methodsObjHierarchy = Object.freeze({
  getChildrenIdOf: "getChildrenIdOf",
});

class ObjectHierarchy {
  constructor() {
    this._id = nanoid(); // must be unique for every item
    this.children = []; // list of objects of this type
  }

  getId = () => this._id;
  setId = (_id) => (this._id = _id);

  removeById = (_id) => {
    const parent = this.getParentOfItemById(_id);
    if (parent) parent.removeChildWithId(_id);
  };

  findById = (_id) => {
    if (this._id === _id) return this;

    for (const child of this.children) {
      const found = child.findById(_id);
      if (found) return found;
    }
  };

  isParentOfItemWithId = (_id) => {
    for (const child of this.children) {
      if (child._id === _id) return true;
    }
  };

  getParentOfItemById = (_id) => {
    const isParent = this.isParentOfItemWithId(_id);
    if (isParent) return this;
    for (const child of this.children) {
      const parentOfItem = child.getParentOfItemById(_id);
      if (parentOfItem) return parentOfItem;
    }
  };

  getChildOfThisIfByIdExists = (_id) => {
    for (const child of this.children) {
      if (child._id === _id) return child;
    }
  };

  removeChildWithId = (_id) => {
    const child = this.getChildOfThisIfByIdExists(_id);
    if (child) {
      this.children = this.children.filter((ch) => ch._id !== _id);
    }
  };

  removeAllChildren = () => (this.children = []);

  getChildrenIdList = () => this.children.map((ch) => ch._id);

  addChild = (child) => this.children.push(child);

  addChildTo = ({ parentId, child }) => {
    const parent = this.findById(parentId);
    if (parent) parent.addChild(child);
  };

  getChildrenIdOf = (_id) => {
    const item = this.findById(_id);
    return item ? item.getChildrenIdList() : [];
  };

  numChildren = () => this.children.length;

  // simplifies potentially complex object of subtypes to this primitve one
  getConnectionMap = () => {
    const root = new ObjectHierarchy();
    root.setId(this._id);
    for (const child of this.children) root.addChild(child.getConnectionMap());
    return root;
  };

  mergeAllChildrenToSingleArrayRecursively = () => {
    let outArray = [];
    outArray = outArray.concat(this.children);
    for (const child of this.children) {
      const nestedArray = child.mergeAllChildrenToSingleArrayRecursively();
      outArray = outArray.concat(nestedArray);
    }
    return outArray;
  };

  getConnectionTable = (doReduce) => {
    const table = new ConnectionTable();
    table.setTable(this.objBuildConnectionTable(doReduce));
    return table;
  };

  objBuildConnectionTable = (doReduce) => {
    return buildConnectionTable(
      this.children,
      this.getChildrenIdList(),
      this._id,
      doReduce
    );
  };

  printConnectionTable = (pretty) => {
    const table = this.objBuildConnectionTable();
    printConnectionTable(table, pretty);
  };
}

export default ObjectHierarchy;
