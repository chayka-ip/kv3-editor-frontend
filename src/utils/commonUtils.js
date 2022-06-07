export class Position {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  addX = (x = 0) => (this.x += x);
  addY = (y = 0) => (this.y += y);

  addPosition = ({ x, y }) => {
    this.addX(x);
    this.addY(y);
  };

  addPositionXY = (x = 0, y = 0) => {
    this.addX(x);
    this.addY(y);
  };

  setPosition = (x, y) => {
    this.x = x;
    this.y = y;
  };

  isZero = () => this.x === 0 && this.y === 0;
}

export function arrayContains(arr, item) {
  return arr.indexOf(item) >= 0;
}

export function arrayRemove(arr, item) {
  const index = arr.indexOf(item);
  let a = arr;
  if (index >= 0) a.splice(index, 1);
  return a;
}

export function getValueIfKeyExists(data, key) {
  if (!isObject(data)) return;
  if (objectHasKey(data, key)) return data[key];
}

export function objectHasKey(obj, key) {
  return key in obj ? true : false;
}

export function isObject(v) {
  return v instanceof Object;
}

export function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

export function upgradeObject(obj, upgradeByObj) {
  return { ...upgradeByObj, ...obj };
}

export function upgradeObjectList(objList, upgradeByObj) {
  let newObjects = [];
  for (const obj of objList) {
    newObjects.push(upgradeObject(obj, upgradeByObj));
  }
  return newObjects;
}
