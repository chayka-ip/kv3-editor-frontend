import DynamicComponent from "../dynamicComponent";
import ConnectionDrag from "./connectionDrag";
import FileObjectKV3 from "../../structures/kv3/fileObjectKV3";
import ObjKV3 from "../../structures/kv3/ObjKV3";
import NodeContainer from "./node/nodeContainer";
import * as data_types from "../../global/data_types.json";
import { getValueIfKeyExists } from "../../utils/commonUtils";
import {
  getNameSuggestionArray,
  getValueSuggestionArray,
} from "../../services/textSuggestion";
import {
  convertJsonToKV3,
  getFileObjectFromJson,
  getTestFileObjectFromJson,
  jsonFromKV3File as jsonFromFileStringKV3,
} from "../../services/parserService";
import { methodsObjKV3 as m_obj } from "./../../structures/kv3/ObjKV3";
import { methodsFileObjectKV3 as mfo } from "../../structures/kv3/fileObjectKV3";
import { downloadFile } from "./../../utils/dataUtils";
import * as config from "../../config.json";
import { nanoid } from "nanoid";

class GraphEditorRoot extends DynamicComponent {
  componentDidMount() {
    const container = new NodeContainer();
    const fileObject = new FileObjectKV3();
    const connectorDrag = new ConnectionDrag({
      onConnectionSuccess: this.handleSuccessNodeConnection,
      onConnectionFail: this.resetDragConnector,
    });
    const selectedPropertyId = null;
    this.setState({ container, fileObject, connectorDrag, selectedPropertyId });
  }

  delayedUpdate = (ms) => {
    setTimeout(() => {
      this.setState({});
    }, ms);
  };

  resetFileObject = () => {
    const fileObject = new FileObjectKV3();
    this.setState({ fileObject });
  };

  resetContainer = () => {
    const container = this.getEmptyContainer();
    this.setState({ container });
  };

  /*==============================================================*/

  handlePropertySelection = (_id) => {
    this.setState({ selectedPropertyId: _id });
  };

  /*==============================================================*/

  modifyFileObjectProp = (params) => {
    const { funcName, propertyId, value } = params;
    const dataObjectId = this.getSelectedNodeId();
    const fileObject = this.getFileObjectClone();
    if (dataObjectId) {
      let caller = m_obj.modifyPropertyDataFromRoot;
      const p = { dataObjectId, propertyId, value, funcName };
      if (funcName === m_obj.objChangeComment) caller = funcName;

      fileObject.data[caller](p);

      this.setState({ fileObject: fileObject });
    }
  };

  getGraphData = ({ funcName }) => {
    const fileObject = this.getFileObjectClone();
    if (fileObject) return fileObject.data[funcName]();
  };

  getSelectedNodeData = ({ funcName }) => {
    const dataObjectId = this.getSelectedNodeId();
    const fileObject = this.getFileObjectClone();
    const p = { dataObjectId };
    if (dataObjectId && fileObject) return fileObject.data[funcName](p);
  };

  modifyFileData = ({ propertyId, value, funcName }) => {
    this.modifyFileObjectProp({ propertyId, value, funcName });
    this.delayedUpdate(30);
  };

  handleAddProperty = (propertyId) => {
    this.modifyFileObjectProp({ propertyId, funcName: m_obj.addProperty });
  };

  handleRemoveProperty = (propertyId) => {
    this.modifyFileObjectProp({ propertyId, funcName: m_obj.removeProperty });
  };

  handleDataTypeChange = ({ propertyId, value }) => {
    this.modifyFileData({ propertyId, value, funcName: m_obj.changePropertyDataType });
  };

  handleNameChange = ({ propertyId, value }) => {
    this.modifyFileData({ propertyId, value, funcName: m_obj.changePropertyName });
  };

  handleValueChange = ({ propertyId, value }) => {
    this.modifyFileData({ propertyId, value, funcName: m_obj.changePropertyValue });
  };

  handleCommentChange = (value) => {
    this.modifyFileData({ value: value, funcName: m_obj.objChangeComment });
    this.delayedUpdate(50);
  };

  getNodeComment = () => {
    const comment = this.getSelectedNodeData({ funcName: m_obj.objGetFirstComment });
    if (comment) return comment;
    return "";
  };

  getSelectedNodePropertyList = () => {
    const data = this.getSelectedNodeData({ funcName: m_obj.objGetPropertyArray });
    if (data) return data;
    return [];
  };

  getSelectedNodePlainPropertyArray = () => {
    const data = this.getSelectedNodeData({
      funcName: m_obj.objGetAllComplexPropertiesRecursively,
    });
    if (data) return data;
    return [];
  };

  getAllNodesIdAndComment = () => {
    const data = this.getGraphData({ funcName: m_obj.getAllNodesIdAndComment });
    if (data) return data;
    return [];
  };

  getAllNodesIdAndTitleText = () => {
    const data = this.getGraphData({ funcName: m_obj.getAllNodesIdAndTitleText });
    if (data) return data;
    return [];
  };

  getConnectionTable = () => {
    return this.getGraphData({ funcName: m_obj.getGraphConnectionTable });
  };

  getConnectionMap = () => {
    const name = "fileObject";
    if (getValueIfKeyExists(this.state, name)) {
      return this.state[name][mfo.getConnectionMap]();
    }
  };

  getSerializedData = (asString) => {
    const fileObject = this.getFileObjectClone();
    if (fileObject) {
      const data = fileObject[mfo.serialize](asString);
      return data;
    }
  };

  getJsonFromCurrentObject = (asString) => {
    const data = this.getSerializedData(asString);
    return data;
  };

  getFileName = () => {
    const file = this.getFileObjectClone();
    if (file) return file.fileName;
    return nanoid() + ".txt";
  };

  handleFileNameChange = (value) => {
    const fileObject = this.getFileObjectClone();
    fileObject.setFileName(value);
    this.setState({ fileObject });
  };

  getNameSuggestOptions = () => getNameSuggestionArray();
  getValueSuggestOptions = () => getValueSuggestionArray();

  /*==============================================================*/

  createDataObject = (_id, parentId) => {
    const obj = new ObjKV3();
    obj.setDataType(data_types.object);

    if (_id) obj.overrideId(_id);
    this.placeObjectIntoHierarchy({ parentId: parentId, child: obj });
  };

  removeDataObjectById = (_id) => {
    const fileObject = this.getFileObjectClone();
    fileObject[mfo.removeObjectWithId](_id);
    this.setState({ fileObject });
  };

  removeSelectedDataObject = () => {
    const _id = this.getSelectedNodeId();
    this.removeDataObjectById(_id);
  };

  placeObjectIntoHierarchy = ({ parentId, child }) => {
    const fileObject = this.getFileObjectClone();
    fileObject[mfo.placeObjectIntoHierarchy]({ parentId: parentId, child: child });
    this.setState({ fileObject });
  };

  /*==============================================================*/

  getContainerClone = () => {
    if (this.getContainer()) return this.getContainer().clone();
  };

  getEmptyContainer = () => new NodeContainer();

  getDragConnectorClone = () =>
    this.state.connectorDrag ? this.state.connectorDrag.clone() : null;

  getFileObjectClone = () => {
    if (this.state.fileObject) return this.state.fileObject.clone();
  };

  getSelectedNodeId = () => this.getSelectedId();
  getSelectedPropertyId = () => this.state.selectedPropertyId;

  /*==============================================================*/

  getFileObjectFromUpload = async (text, fileName) => {
    if (config.is_debug) return getTestFileObjectFromJson();
    else {
      const json = await jsonFromFileStringKV3(text);
      const obj = getFileObjectFromJson(json);
      obj.setFileName(fileName);
      if (obj) return obj;
    }
    return new FileObjectKV3();
  };

  downloadKV3 = async () => {
    let fileName = "";
    let string = "";
    if (config.is_debug) {
      const json = this.getJsonFromCurrentObject(true);
      fileName = "test.json";
      string = json;
    } else {
      fileName = this.getFileName();
      const json = this.getJsonFromCurrentObject(false);
      string = await convertJsonToKV3(json);
    }
    downloadFile(string, fileName);
  };
}

export default GraphEditorRoot;
