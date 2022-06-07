import FileObjectKV3 from "../structures/kv3/fileObjectKV3";
import httpService from "./httpService";
import * as sampleData from "../data/sample_data/simple_test.json";
// import * as sampleData from "../data/sample_data/test2.json";
import * as backend from "../services/backendApi";
import { getJSONDefaultObj } from "../utils/dataUtils";
import * as gvar from "../global/variables.json";

function getSendObj(payload) {
  return { data: payload };
}

export function getFileObjectFromJson(json) {
  const header = json[gvar.file_header_key];
  const graph_root = json[gvar.graph_root_key];
  if (header && graph_root) {
    const fileObject = new FileObjectKV3();
    fileObject.setHeader(header);
    fileObject.setData(graph_root);
    return fileObject;
  }
}

export function getTestFileObjectFromJson() {
  const json = getJSONDefaultObj(sampleData);
  return getFileObjectFromJson(json);
}

export async function convertJsonToKV3(json) {
  const sendObj = getSendObj(json);
  const { data } = await httpService.post(backend.jsonToKV3, sendObj);
  if (data) return data.data;
  return {};
}

export async function jsonFromKV3File(text) {
  const sendObj = getSendObj(text);
  const { data } = await httpService.post(backend.parseRawFile, sendObj);
  if (data) return data.data;
  return {};
}
