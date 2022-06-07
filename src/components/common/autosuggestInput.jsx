import React from "react";

class AutosuggestInput extends React.Component {
  handleOnChange = (e) => this.props.onInputChange(e.target.value);

  handleOnClick = () => {
    // console.log("handleOnClick");
  };

  handleOnBlur = () => {
    // out of focus.. but seems that updates will be constant
    // console.log("handleOnBlur");
  };

  getSuggestionList() {
    const { elementId, options } = this.props;
    return (
      <React.Fragment>
        <datalist id={elementId}>
          {options.map((o) => (
            <option key={o} value={o}></option>
          ))}
        </datalist>
      </React.Fragment>
    );
  }

  render() {
    const { elementId, currentValue } = this.props;
    return (
      <React.Fragment>
        <input
          list={elementId}
          onChange={this.handleOnChange}
          onClick={this.handleOnClick}
          onBlur={this.handleOnBlur}
          value={currentValue}
          className="autocomplete-input"
        />
        {this.getSuggestionList()}
      </React.Fragment>
    );
  }
}

export default AutosuggestInput;
