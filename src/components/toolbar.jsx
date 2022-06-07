import React from "react";
import FileUploader from "./fileUploader";

class ToolBar extends React.Component {
  handleFileNameChange = (e) => this.props.onFileNameChange(e.target.value);

  render() {
    const {
      onAddNodeClicked,
      onRemoveNodeClicked,
      onUploadFileClicked,
      onArrangeClicked,
      onDownloadClicked,
      currentFileName,
    } = this.props;
    return (
      <div className="toolbar ">
        <div className="toolbar-buttons-container">
          <button className="btn btn-toolbar" onClick={onAddNodeClicked}>
            Add Node
          </button>
          <button className="btn btn-toolbar" onClick={onRemoveNodeClicked}>
            Remove Node
          </button>
          <button className="btn btn-toolbar" onClick={onArrangeClicked}>
            Arrange
          </button>
          <FileUploader
            buttonClass={"btn btn-toolbar"}
            buttonText={"Upload file"}
            onUpload={onUploadFileClicked}
          />
          <button className="btn btn-toolbar" onClick={onDownloadClicked}>
            Download
          </button>
        </div>
        <div className="toolbar-file-name-input-container">
          <input
            className="toolbar-file-name-input"
            type="text"
            value={currentFileName}
            onChange={this.handleFileNameChange}
          />
        </div>
      </div>
    );
  }
}

export default ToolBar;
