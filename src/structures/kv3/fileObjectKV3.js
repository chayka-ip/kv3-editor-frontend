import ObjKV3, { methodsObjKV3 as m_obj } from "./ObjKV3";
import * as gvar from "../../global/variables.json";
import * as data_types from "../../global/data_types.json";
import * as special_data_keys from "../../global/special_data_keys.json";

function constructGraphObject() {
  const graph = new ObjKV3();
  graph.setName(gvar.graph_root_key);
  graph.overrideId(gvar.graph_root_id);
  graph.setDataType(data_types.object);
  return graph;
}

function constructFirstDataObject(data) {
  const first = new ObjKV3();
  first.setData(data);
  first.setNameToId();

  const root = first.getPropertyWithName(special_data_keys.root);
  if (root) {
    first.addChild(root);
    first.removeProperty({ propertyId: root._id });
  }

  return first;
}

function getDataObjectSerialized(data) {
  const dataClone = data.getDeepClone();
  const numChildren = dataClone.children.length;
  if (numChildren > 0) {
    const firstChild = dataClone.children[0];
    const root = firstChild[m_obj.getChildWithName](special_data_keys.root);

    if (root) {
      // move  object with name "root" to properties
      firstChild[m_obj.addObjectToPropertyArray](root);
      firstChild.removeById(root._id);
    }
  }

  return dataClone.serialize();
}

export const methodsFileObjectKV3 = Object.freeze({
  placeObjectIntoHierarchy: "placeObjectIntoHierarchy",
  removeObjectWithId: "removeObjectWithId",
  connectItems: "connectItems",
  getConnectionMap: "getConnectionMap",
  serialize: "serialize",
});

export default class FileObjectKV3 {
  constructor() {
    this.fileName = "";
    this.fileHeader = gvar.default_header;
    this.data = constructGraphObject();
  }

  setFileName = (fileName) => (this.fileName = fileName);
  setHeader = (header) => (this.fileHeader = header);
  setData = (data) => {
    const first = constructFirstDataObject(data);
    this.data.addChild(first);
  };

  placeObjectIntoHierarchy = ({ parentId, child }) => {
    const childExistsInHierarchy = this.data.findById(child._id);
    if (childExistsInHierarchy) this.removeObjectWithId(child._id);
    this.data.addChildTo({ parentId: parentId, child: child });
  };

  removeObjectWithId = (_id) => this.data.removeById(_id);

  connectItems = ({ parentId, childId }) => {
    const isSelfConnecting = childId === parentId;
    if (isSelfConnecting) return;

    // items must exist
    const parent = this.data.findById(parentId);
    const child = this.data.findById(childId);
    if (parent && child) {
      const notConnected = !parent.isParentOfItemWithId(child._id);
      if (notConnected) {
        this.placeObjectIntoHierarchy({ parentId: parentId, child: child });
      }
    }
  };

  getConnectionMap = () => this.data.getConnectionMap();

  clone = () => {
    return { ...this };
  };

  serialize = (asString) => {
    let object = {};
    object[gvar.file_header_key] = this.fileHeader;
    object[gvar.graph_root_key] = getDataObjectSerialized(this.data);
    return asString ? JSON.stringify(object) : object;
  };
}
