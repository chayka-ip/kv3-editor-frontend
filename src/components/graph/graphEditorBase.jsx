import React from "react";
import NodeContainer from "./node/nodeContainer";
import NodeHolder from "./node/nodeHolder";
import DraggableNode from "./node/draggable_node";
import * as gvar from "../../global/variables.json";
import * as layoutVar from "../../global/layout.json";
import { methodsObjHierarchy as m_oh } from "./../../structures/common/objectHierarchy";
import { Position } from "./../../utils/commonUtils";
import GraphEditorRoot from "./graphEditorRoot";
import ConnectionLine from "../common/connectionLine";
import { nanoid } from "nanoid";
import { methodsFileObjectKV3 as mfo } from "../../structures/kv3/fileObjectKV3";

class GraphEditorBase extends GraphEditorRoot {
  componentDidUpdate() {
    const nodesVerified = this.verifyNodesRendered();
    if (nodesVerified) {
      this.verifyNodeComments();
      this.verifyNodeTitles();
    }
  }

  createNode = (nodeId, startPosition, comment, title, isSelected) => {
    const node = new NodeHolder();
    node.setDefaultPosition(startPosition);
    if (nodeId != null) node.setId(nodeId);

    if (!comment) comment = "";
    node.setComment(comment);

    if (!title) title = "";
    node.setTitle(title);

    if (isSelected == null) isSelected = false;
    node.setIsSelected(isSelected);

    const { _id } = node;

    node.renderData = (
      <DraggableNode
        ref={node.ref}
        key={_id}
        _id={_id}
        onSelect={() => this.handleNodeSelected(_id)}
        onDrag={() => this.handleNodeDrag(_id)}
        defaultPosition={startPosition}
        onNodeMouseEnter={() => this.handleNodeMouseEnter(_id)}
        onNodeMouseLeave={() => this.handleNodeMouseLeave(_id)}
        onConnectionSlotSelected={this.handleNodeConnectionSlotSelected}
        currentComment={comment}
        title={title}
        isSelected={isSelected}
      />
    );
    return node;
  };

  addNodeFunc = ({ nodeId, position, comment, isSelected, title }) => {
    const holder = this.createNode(nodeId, position, comment, title, isSelected);
    this.addItem(holder);
  };

  addNode = (nodeId, parentId, comment, title, isSelected) => {
    const position = this.getNodeStartPosition(nodeId);
    this.addNodeFunc({
      nodeId: nodeId,
      position: position,
      comment: comment,
      title: title,
      isSelected: isSelected,
    });
  };

  removeAllNodes = () => this.setState({ container: new NodeContainer() });

  getNodeStartPosition = (nodeId) => {
    const container = this.getContainer();
    if (container) {
      const connectionTable = this.getConnectionTable();
      const tableItem = connectionTable.findItemInTable(nodeId);
      if (tableItem) {
        const { rowIndex, colIndex } = tableItem;
        return this.computeNodeLayoutOffset(rowIndex, colIndex);
      }
    }
    return this.getMostRightNodePosition();
  };

  computeNodeLayoutOffset = (rowIndex, colIndex) => {
    const { width, height } = this.getLayoutCellWidthHeight();
    const x = width * colIndex + layoutVar.defaultOffsetX;
    const y = height * rowIndex + layoutVar.defaultOffsetY;
    return { x, y };
  };

  getNodePositionById = (_id) => {
    const container = this.getContainer();
    if (container) return container.getNodePositionById(_id);
    return Position();
  };

  getMostRightNodePosition = () => {
    const container = this.getContainer();
    if (container) {
      const startPosition = container.getMostRightNodePosition();
      let x = layoutVar.defaultOffsetX;
      let y = 0;
      if (startPosition.y === 0) y = layoutVar.defaultOffsetY;
      startPosition.addPositionXY(x, y);

      return startPosition;
    }
    return { x: 0, y: 0 };
  };

  verifyNodeComments = () => {
    const commentDataArr = this.getAllNodesIdAndComment();
    for (const obj of commentDataArr) {
      const nodeId = obj._id;
      const comment = obj.comment;
      const updateRequired = !this.isNodeCommentUpToDate({ nodeId, comment });
      if (updateRequired) this.updateNodeComment({ nodeId, comment });
    }
  };

  verifyNodeTitles = () => {
    const titleDataArr = this.getAllNodesIdAndTitleText();
    for (const obj of titleDataArr) {
      const nodeId = obj._id;
      const title = obj.title;
      const updateRequired = !this.isNodeTitleUpToDate({ nodeId, title });
      if (updateRequired) this.updateNodeTitle({ nodeId, title });
    }
  };

  verifyNodesRendered = () => {
    const connectionMap = this.getConnectionMap();
    const res = this.recursiveNodeCheck(connectionMap);
    return res ? false : true;
  };

  recursiveNodeCheck = ({ _id, children, parentId }) => {
    const nodeDoesNotExist = !this.doesNodeExist(_id);
    const isNotGraphId = _id !== gvar.graph_root_id;
    const shouldCreateNode = nodeDoesNotExist && isNotGraphId;

    if (shouldCreateNode) {
      this.addNode(_id, parentId);
      return true;
    } else {
      for (const child of children) {
        const wasCreated = this.recursiveNodeCheck({ ...child, parentId: _id });
        if (wasCreated) return true;
      }
    }
  };

  getChildrenIdOfNodeById = (_id) => {
    const map = this.getConnectionMap();
    if (map) return map[m_oh.getChildrenIdOf](_id);
    return [];
  };

  doesNodeExist = (_id) => {
    const container = this.getContainer();
    if (container) return container.doesItemExist(_id);
    return false;
  };

  rearrangeNodes = () => {
    this.removeAllNodes();
    this.delayedUpdate(20);
    // this.getConnectionTable().print(true);
  };

  handleNodeSelected = (_id) => {
    const nowSelectedId = this.getSelectedNodeId();
    if (nowSelectedId === _id) return;
    this.handleItemSelection(_id);

    let container = this.getContainerClone();
    if (container) {
      container = this.containerRecreateNode({
        nodeId: nowSelectedId,
        isSelected: false,
        container,
      });

      container = this.containerRecreateNode({
        nodeId: _id,
        isSelected: true,
        container,
      });

      this.setState({ container });
      this.delayedUpdate(20);
    }
  };

  containerRecreateNode = ({
    nodeId,
    position,
    comment,
    title,
    isSelected,
    container,
  }) => {
    const node = container.getItemByKey(nodeId);
    if (node) {
      if (position == null) position = node.getNodePosition();
      if (comment == null) comment = node.getComment();
      if (title == null) title = node.getTitle();
      if (isSelected == null) isSelected = node.getIsSelected();

      const newNode = this.createNode(nodeId, position, comment, title, isSelected);
      container.removeItemByKey(nodeId);
      container.addItem(newNode);
    }
    return container;
  };

  handleNodeDrag = (_id) => {
    // to update connections
    this.setState({});
  };

  isNodeCommentUpToDate = ({ nodeId, comment }) => {
    const container = this.getContainer();
    if (container) {
      return container.isNodeCommentUpToDate({ _id: nodeId, comment });
    }
    return false;
  };

  isNodeTitleUpToDate = ({ nodeId, title }) => {
    const container = this.getContainer();
    if (container) {
      return container.isNodeTitleUpToDate({ _id: nodeId, title });
    }
    return false;
  };

  updateNodeComment = ({ nodeId, comment }) => {
    let container = this.getContainerClone();
    if (container) {
      const node = container.getItemByKey(nodeId);
      if (node) {
        container = this.containerRecreateNode({ nodeId, comment, container });
        this.setState({ container });
      }
    }
  };

  updateNodeTitle = ({ nodeId, title }) => {
    let container = this.getContainerClone();
    if (container) {
      const node = container.getItemByKey(nodeId);
      if (node) {
        container = this.containerRecreateNode({ nodeId, title, container });
        this.setState({ container });
      }
    }
  };

  resetAllData = () => {
    this.resetContainer();
    this.resetFileObject();
    this.removeAllNodes();
    this.handleNodeSelected(null);
  };

  connectNodes = ({ parentId, childId }) => {
    const fileObject = this.getFileObjectClone();
    fileObject[mfo.connectItems]({ parentId: parentId, childId: childId });
    this.setState({ fileObject });
  };

  getConnectonRenderData = () => {
    const connectionMap = this.getConnectionMap();
    let connectionElements = [];
    if (connectionMap) {
      connectionElements = this.getConnectionElementsFromMap(connectionMap);
    }
    return connectionElements;
  };

  getConnectionElementsFromMap = ({ _id, children }) => {
    let connectionElements = [];
    const container = this.getContainer();
    if (!container) return [];
    const sourceNodeHolder = this.getContainer().getItemByKey(_id);
    // collect connections from this node

    if (sourceNodeHolder) {
      const childrenIdList = children.map((ch) => ch._id);

      const childNodeHolders =
        this.getContainer().getListOfExistigItemsByKey(childrenIdList);
      for (const node of childNodeHolders) {
        const connection = this.getConnectionBetweenTwoNodes(sourceNodeHolder, node);
        if (connection) connectionElements.push(connection);
      }
    }

    // collect child connections

    for (const child of children) {
      const childMap = this.getConnectionElementsFromMap(child);
      if (childMap) connectionElements = connectionElements.concat(childMap);
    }

    return connectionElements;
  };

  getConnectionBetweenTwoNodes = (node1, node2) => {
    const source = node1.getOutConnectionCenter();
    const target = node2.getInConnectionCenter();
    if (source && target) {
      return <ConnectionLine key={nanoid()} p1={source} p2={target} />;
    }
  };

  handleNodeConnectionSlotSelected = ({ nodeId, isOutSlot }) => {
    const connectorDrag = this.getDragConnectorClone();
    connectorDrag.beginConnection({ _id: nodeId, isParent: isOutSlot });
    this.setState({ connectorDrag });
  };

  handleNodeMouseEnter = (nodeId) => {
    const connectorDrag = this.getDragConnectorClone();
    connectorDrag.setDestinationId(nodeId);
    this.setState({ connectorDrag });
  };

  handleNodeMouseLeave = (nodeId) => {
    this.setState({});
  };

  handleSuccessNodeConnection = ({ parentId, childId }) => {
    this.connectNodes({ parentId: parentId, childId: childId });
    this.resetDragConnector();
  };

  resetDragConnector = () => {
    const connectorDrag = this.getDragConnectorClone();
    if (connectorDrag.isHandlingConnection()) {
      connectorDrag.reset();
      this.setState({ connectorDrag });
    }
  };

  handleConnectionAttempt = () => {
    const connectorDrag = this.getDragConnectorClone();
    connectorDrag.resolveConnectionAttempt();
  };

  getLayoutCellWidthHeight = () => {
    let { width, height } = this.getNodeWidthHeight();
    width += layoutVar.cellHorizontalGap;
    height += layoutVar.cellVerticalGap;
    return { width, height };
  };

  getNodeWidthHeight = () => {
    let width = 0;
    let height = 0;
    const container = this.getContainer();
    if (container) {
      const nodes = container.getItemsAsArray();
      if (nodes.length > 0) {
        const node = nodes[0];
        const dimensions = node.getNodeDimenshions();
        if (dimensions) return dimensions;
      }
    }
    return { width, height };
  };
}

export default GraphEditorBase;
