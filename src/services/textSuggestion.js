import * as name_data from "../data/name_data.json";
import * as value_data from "../data/value_data.json";
import { getJSONDefaultObj } from "../utils/dataUtils";

export function getNameSuggestionArray() {
  return getJSONDefaultObj(name_data);
}

export function getValueSuggestionArray() {
  return getJSONDefaultObj(value_data);
}
