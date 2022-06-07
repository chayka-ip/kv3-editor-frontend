import React from "react";

const RawTextPage = (content) => {
  let text = content.content;
  console.log({ text, content });
  // console.log(content.content);
  // let text = content.content;
  // if (text == null) text = "";
  return (
    <React.Fragment>
      <div className="raw-data-content">{text}</div>
    </React.Fragment>
  );
};

export default RawTextPage;
