import * as data_types from "../global/data_types.json";

export function getDataTypeList() {
  return [
    data_types.str,
    data_types.bool,
    data_types.number,
    data_types.array,
    data_types.object,
  ];
}
