import React from "react";
import SplitScreen from "../common/splitScreen";
import ToolBar from "../toolbar";
import Graph from "./graph";
import PropertyTable from "../propertyTable/propertyTable";
import * as globalVar from "../../global/variables.json";
import { nanoid } from "nanoid";
import GraphEditorBase from "./graphEditorBase";

class GraphEditor extends GraphEditorBase {
  handleFileUploadRequest = async (fileText, fileName) => {
    this.resetAllData();
    const fileObject = await this.getFileObjectFromUpload(fileText, fileName);
    this.setState({ fileObject });
    this.delayedUpdate(20);
  };

  handleAddNodeRequest = () => {
    const nodeId = nanoid();
    const parentNodeId = globalVar.graph_root_id;
    this.createDataObject(nodeId, parentNodeId);
  };

  handleRemoveNodeRequest = () => {
    this.removeSelectedDataObject();
    this.removeSelectedItem();
  };

  getGraphRenderData = () => {
    let nodes = this.getRenderData();
    const connections = this.getConnectonRenderData();
    if (nodes && Array.isArray(nodes)) {
      if (connections) nodes = nodes.concat(connections);
    }
    return <React.Fragment>{nodes}</React.Fragment>;
  };

  getGraphEditor = () => {
    return (
      <React.Fragment>
        <ToolBar
          onAddNodeClicked={this.handleAddNodeRequest}
          onRemoveNodeClicked={this.handleRemoveNodeRequest}
          onUploadFileClicked={this.handleFileUploadRequest}
          onArrangeClicked={this.rearrangeNodes}
          onDownloadClicked={this.downloadKV3}
          currentFileName={this.getFileName()}
          onFileNameChange={this.handleFileNameChange}
        />
        <div className="container">
          <SplitScreen
            leftPanContent={
              <Graph
                renderData={this.getGraphRenderData()}
                onConnectonAttempt={this.handleConnectionAttempt}
                onConnectonCancel={this.resetDragConnector}
              />
            }
            rigthPanContent={
              <PropertyTable
                onAddProperty={this.handleAddProperty}
                onRemoveProperty={this.handleRemoveProperty}
                onPropertySelect={this.handlePropertySelection}
                onDataTypeChange={this.handleDataTypeChange}
                onNameChange={this.handleNameChange}
                onValueChange={this.handleValueChange}
                onCommentChange={this.handleCommentChange}
                currentComment={this.getNodeComment()}
                nameSuggestOptions={this.getNameSuggestOptions()}
                valueSuggestOptions={this.getValueSuggestOptions()}
                propertyObjects={this.getSelectedNodePropertyList()}
                propertyPlainArray={this.getSelectedNodePlainPropertyArray()}
              />
            }
          />
        </div>
        <div className="footer"></div>
      </React.Fragment>
    );
  };

  render() {
    return this.getGraphEditor();
  }
}

export default GraphEditor;
