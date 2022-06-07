import React from "react";

class TableCommentBox extends React.Component {
  handleChange = (e) => this.props.onCommentChange(e.target.value);
  render() {
    const { currentComment } = this.props;
    return (
      <React.Fragment>
        <div className="table-node-comment-box">
          <textarea
            className="table-node-comment-box-textarea"
            onChange={this.handleChange}
            value={currentComment}
          ></textarea>
        </div>
      </React.Fragment>
    );
  }
}

export default TableCommentBox;
