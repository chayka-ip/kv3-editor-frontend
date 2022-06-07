import React from "react";
import GenericItem from "./common/genericItem";

export default class RenderedItem extends GenericItem {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.renderData = null;
  }

  getCurrent = () => this.ref.current;
}
