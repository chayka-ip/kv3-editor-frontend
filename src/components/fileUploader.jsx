import React, { useRef } from "react";
import "screw-filereader";

const FileUploader = (props) => {
  const { buttonClass, buttonText, onUpload } = props;

  let fileRef = useRef();

  const showOpenFileDialog = () => fileRef.current.click();

  const handleTextUpload = (e) => {
    const fileObject = e.target.files[0];
    if (!fileObject) return;
    fileObject.text().then((text) => {
      const fileName = fileObject.name;
      onUpload(text, fileName);
      fileRef.current.value = "";
    });
  };

  return (
    <React.Fragment>
      <button className={buttonClass} onClick={showOpenFileDialog}>
        <input
          ref={fileRef}
          type="file"
          style={{ display: "none" }}
          accept=".kv3"
          onChange={handleTextUpload}
        />
        {buttonText}
      </button>
    </React.Fragment>
  );
};

export default FileUploader;
