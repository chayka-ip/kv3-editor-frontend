import * as data_types from "../global/data_types.json";
import * as special_data_keys from "../global/special_data_keys.json";

import { arrayContains } from "./commonUtils";

const complexDataType = [data_types.array, data_types.object];
const childrenKeys = [special_data_keys.child, special_data_keys.children];

export function isChildValueKey(key) {
  return arrayContains(childrenKeys, key);
}

export function isComplexDataType(dataType) {
  return arrayContains(complexDataType, dataType);
}

export function getJSONDefaultObj(data) {
  return data["default"];
}

export function getDefaultPlainValueByDataType(dataType) {
  if (dataType === data_types.bool) return "true";
  if (dataType === data_types.number) return 0;
  if (dataType === data_types.str) return "";
}

export function tryParsetoNumber(v) {
  const value = v * 1;
  if (!Object.is(NaN, value)) return value;
}

export function isBool(v) {
  return v === "true" || v === "false";
}

export function downloadFile(string, fileName) {
  const element = document.createElement("a");
  const file = new Blob([string], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = fileName;
  // document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
