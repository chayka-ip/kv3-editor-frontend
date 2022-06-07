import React from "react";

class DropDownList extends React.Component {
  handleChange = (e) => this.props.onChange(e.target.value);

  render() {
    const { options, selectedValue } = this.props;
    return (
      <select
        className="data-type-select"
        value={selectedValue}
        onChange={this.handleChange}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
}

export default DropDownList;
