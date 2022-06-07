import GenericContainer from "../../../structures/common/genericContainer";
import { arrayContains, Position } from "../../../utils/commonUtils";

export default class NodeContainer extends GenericContainer {
  constructor() {
    super({ itemKeyName: "_id" });
  }

  getMostRightNodePosition = () => {
    let position = new Position();

    for (const node of this.items) {
      let p = node.getNodePosition();
      if (p.x > position.x) position = p;
    }
    return position;
  };

  getMostDownNodePositionByIdList = (idList) => {
    let position = new Position();
    for (const nodeId of idList) {
      let p = this.getNodePositionById(nodeId);
      // console.log(nodeId, p);
      if (p.y > position.y) position = p;
    }
    return position;
  };

  getNodeListByIds = (idList) =>
    this.items.filter((item) => arrayContains(idList, item._id));

  getNodePositionById = (_id) => {
    const node = this.getItemByKey(_id);
    return node ? node.getNodePosition() : new Position();
  };

  isNodeCommentUpToDate = ({ _id, comment }) => {
    const node = this.getItemByKey(_id);
    return node ? node.isCommentEqualsTo(comment) : false;
  };

  isNodeTitleUpToDate = ({ _id, title }) => {
    const node = this.getItemByKey(_id);
    return node ? node.isTitleEqualsTo(title) : false;
  };

  getRenderData = () => this.items.map((item) => item.renderData);
}
